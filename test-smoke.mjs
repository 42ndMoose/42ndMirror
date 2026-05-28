import assert from 'node:assert/strict';
import { CARD_BANK } from './data/cards.js';
import {
  finalizeProfile,
  getNextCard,
  makeInitialState,
  recordAnswer
} from './src/engine.js';

function choose(card, answerId) {
  const answer = card.answers.find(item => item.id === answerId) || card.answers[0];
  if (!answer) throw new Error(`No answer for card ${card.id}`);
  return answer;
}

function runScenario({ label, scope = 'claim', setting = 'private', modeId = 'fast', pick }) {
  const state = makeInitialState({ modeId, scope, setting, claim: label });
  const cards = [];
  let card;
  while ((card = getNextCard(state))) {
    cards.push(card.id);
    const answerId = pick?.(card, state, cards) || card.answers[0]?.id;
    recordAnswer(state, card, choose(card, answerId));
  }
  return { state, cards, result: finalizeProfile(state) };
}

function surfaceOk(result) {
  const p = result.coordinates;
  return Math.abs(Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z) - 1) < 0.00001;
}

const chicken = runScenario({
  label: 'the chicken probably came after the egg',
  scope: 'argument',
  setting: 'group',
  modeId: 'adhd',
  pick(card) {
    const ids = {
      opener_burden_01: 'words_do_work',
      settle_best_01: 'cleaner_boundary',
      definition_edge_01: 'origin_label',
      context_pressure_01: 'context_seen_not_decisive',
      proof_pressure_01: 'needs_counterexample_test',
      score_pressure_01: 'compare_after_reasons',
      final_commitment_01: 'weakened_claim'
    };
    return ids[card.id] || card.answers[0].id;
  }
});
assert.equal(chicken.cards[0], 'opener_burden_01');
assert.notEqual(chicken.cards[1], 'score_pressure_01');
assert.ok(chicken.cards.includes('definition_edge_01') || chicken.cards.includes('causal_sequence_01') || chicken.cards.includes('settle_best_01'));
assert.ok(surfaceOk(chicken.result));

const snack = runScenario({
  label: 'should i stop procrastinating and eat now',
  scope: 'decision',
  setting: 'private',
  modeId: 'adhd',
  pick(card) {
    const ids = {
      opener_burden_01: 'not_that_deep',
      micro_live_constraint_01: 'body_floor',
      seriousness_load_01: 'light_probe',
      constraint_pressure_01: 'considered_less_relevant_constraint',
      final_commitment_01: 'retained_after_pressure'
    };
    return ids[card.id] || card.answers[0].id;
  }
});
assert.equal(snack.cards[0], 'opener_burden_01');
assert.ok(snack.cards.includes('micro_live_constraint_01'));
assert.ok(snack.cards.length <= 7);
assert.ok(surfaceOk(snack.result));

const pressure = runScenario({
  label: 'my friends want to compare scores to prove who has the better take',
  scope: 'argument',
  setting: 'group',
  modeId: 'fast',
  pick(card) {
    const ids = {
      opener_burden_01: 'real_world_cost',
      seriousness_load_01: 'contest_load',
      score_pressure_01: 'higher_number_wins',
      polished_balance_01: 'looks_fair',
      final_commitment_01: 'pressure_did_not_matter'
    };
    return ids[card.id] || card.answers.at(-1).id;
  }
});
assert.equal(pressure.cards[0], 'opener_burden_01');
assert.notEqual(pressure.cards[1], 'score_pressure_01');
assert.ok(pressure.result.signal_quality.score < 0.75);
assert.ok(surfaceOk(pressure.result));

const blunt = runScenario({
  label: 'the cleanest rule is to punish repeated delays immediately',
  scope: 'decision',
  setting: 'private',
  modeId: 'serious',
  pick(card) {
    const ids = {
      opener_burden_01: 'real_world_cost',
      seriousness_load_01: 'personal_action',
      constraint_pressure_01: 'enforcement_limit',
      person_pressure_01: 'considered_less_relevant_person',
      opposite_model_01: 'other_right_wrong_weight',
      final_commitment_01: 'retained_after_pressure'
    };
    return ids[card.id] || card.answers[0].id;
  }
});
assert.ok(blunt.result.pressure.integrated + blunt.result.pressure.survived >= 1);
assert.ok(surfaceOk(blunt.result));

for (const card of CARD_BANK) {
  assert.ok(card.answers?.length >= 4, `${card.id} should have at least four answers`);
}

console.log('42ndMirror smoke and routing tests passed.');
