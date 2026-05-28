import { BASE_CARDS, FOLLOW_UP_CARDS, MODES, SCOPES } from './data/cards.js';
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

for (const modeId of Object.keys(MODES)) {
  for (const scope of SCOPES.map(s => s.id)) {
    const state = makeInitialState({ modeId, scope, claim: 'smoke test' });
    let guard = 0;
    while (true) {
      const card = getNextCard(state);
      if (!card) break;
      const answer = card.answers[0];
      answerCard(state, card, answer);
      guard += 1;
      assert(guard < 40, `too many cards for ${modeId}/${scope}`);
    }
    const result = calculateResult(state);
    checkSurface(result.coordinates, `${modeId}/${scope}`);
    assert(result.coordinates.surface_check === 1, `${modeId}/${scope}: rounded surface check failed`);
    assert(result.visualizer_payload?.data?.data?.point, `${modeId}/${scope}: missing visualizer payload`);
  }
}

for (const raw of [
  { x: 0, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: -0.2, y: 0.5, z: 0.3 },
  { x: 0.123, y: -0.456, z: 0.789 }
]) {
  checkSurface(projectToOctahedronSurface(raw), `raw ${JSON.stringify(raw)}`);
}

assert(BASE_CARDS.length > 0, 'base cards missing');
assert(FOLLOW_UP_CARDS.length > 0, 'follow-up cards missing');

console.log('42ndMirror smoke test passed.');
