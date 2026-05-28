import { MODES, SCOPES, SETTINGS } from './data/cards.js';
import {
  answerCard,
  calculateResult,
  getNextCard,
  makeInitialState,
  projectToOctahedronSurface
} from './src/engine.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkSurface(point, label) {
  const surface = Math.abs(point.x) + Math.abs(point.y) + Math.abs(point.z);
  assert(Math.abs(surface - 1) < 1e-6, `${label}: expected surface equation, got ${surface}`);
}

function runScenario({ label, modeId = 'fast', scope = 'decision', setting = 'private', answerPicker = firstAnswer }) {
  const state = makeInitialState({ modeId, scope, setting, claim: label });
  let guard = 0;
  while (true) {
    const card = getNextCard(state);
    if (!card) break;
    const answer = answerPicker(card, state);
    answerCard(state, card, answer);
    guard += 1;
    assert(guard <= state.maxCards + 2, `too many cards for ${label}`);
  }
  const result = calculateResult(state);
  checkSurface(result.coordinates, label);
  assert(result.coordinates.surface_check === 1, `${label}: rounded surface check failed`);
  assert(result.visualizer_payload?.data?.data?.point, `${label}: missing visualizer payload`);
  assert(result.quoted_label === label, `${label}: quoted label missing`);
  return result;
}

function firstAnswer(card) {
  return card.answers[0];
}

function pickById(ids) {
  return card => card.answers.find(answer => ids.includes(answer.id)) || card.answers[0];
}

for (const modeId of Object.keys(MODES)) {
  for (const scope of SCOPES.map(s => s.id)) {
    for (const setting of SETTINGS.map(s => s.id)) {
      runScenario({ label: 'smoke test', modeId, scope, setting });
    }
  }
}

const micro = runScenario({
  label: 'should i stop procrastinating and eat now',
  scope: 'decision',
  setting: 'private',
  answerPicker: pickById(['body_budget', 'energy_drops', 'feed_then_return'])
});
assert(micro.routing.selected_cards.includes('micro_body_state_01'), 'micro scenario did not route to body/state card');
assert(micro.routing.selected_cards.includes('micro_delay_cost_01') || micro.routing.selected_cards.includes('micro_next_step_01'), 'micro scenario did not route to later micro cards');
assert(!micro.routing.selected_cards.includes('opposition_best_01'), 'micro scenario routed to abstract opposition card');

const group = runScenario({
  label: 'my friends want to compare scores to prove who has the better take',
  scope: 'argument',
  setting: 'group',
  answerPicker: pickById(['public_result_pressure', 'same_rules', 'after_reasons', 'exact_over_impressive'])
});
assert(group.routing.selected_cards.includes('public_score_use_01'), 'group scenario did not route to public score-use card');

const policy = runScenario({
  label: 'is this policy fair if it raises costs but improves enforcement',
  scope: 'claim',
  setting: 'debate',
  answerPicker: pickById(['value_tradeoff_pressure', 'execution_cost', 'enforcement_load', 'terms_first'])
});
assert(policy.routing.selected_cards.includes('policy_load_01') || policy.routing.selected_cards.includes('value_tradeoff_01'), 'policy scenario did not route to system/tradeoff card');

const comparison = runScenario({
  label: 'which character has stronger reasoning under pressure',
  scope: 'comparison',
  setting: 'fiction',
  answerPicker: pickById(['comparison_pressure', 'compare_method', 'strategic_clarity_under_power'])
});
assert(comparison.routing.selected_cards.includes('comparison_standard_01'), 'comparison scenario did not route to comparison standard card');
assert(comparison.routing.selected_cards.includes('character_power_01'), 'comparison scenario did not route to character power card');

for (const result of [micro, group, policy, comparison]) {
  const specificity = result.routing.route_specificity;
  assert(Number.isFinite(specificity.last_avg_route_fit), 'missing route specificity');
  assert(specificity.last_avg_route_fit >= 0.12, 'late route fit too low');
}

for (const raw of [
  { x: 0, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: -0.2, y: 0.5, z: 0.3 },
  { x: 0.123, y: -0.456, z: 0.789 }
]) {
  checkSurface(projectToOctahedronSurface(raw), `raw ${JSON.stringify(raw)}`);
}

console.log('42ndMirror v0.4 smoke and routing tests passed.');
console.log('micro cards:', micro.routing.selected_cards.join(' -> '));
console.log('group cards:', group.routing.selected_cards.join(' -> '));
console.log('policy cards:', policy.routing.selected_cards.join(' -> '));
console.log('comparison cards:', comparison.routing.selected_cards.join(' -> '));
