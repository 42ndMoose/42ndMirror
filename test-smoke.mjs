import { SCOPES } from './data/cards.js';
import { answerCard, calculateResult, getNextCard, makeInitialState } from './src/engine.js';

const state = makeInitialState({ modeId: 'fast', scope: SCOPES[0].id, claim: 'Smoke test' });
let card = getNextCard(state);
let safety = 0;
while (card && safety < 30) {
  answerCard(state, card, card.answers[0]);
  card = getNextCard(state);
  safety += 1;
}
const result = calculateResult(state);
const sum = Math.abs(result.coordinates.x) + Math.abs(result.coordinates.y) + Math.abs(result.coordinates.z);
if (Math.abs(sum - 1) > 0.00001) {
  throw new Error(`Surface check failed: ${sum}`);
}
console.log(JSON.stringify({ ok: true, coordinates: result.coordinates, answers: state.answers.length }, null, 2));
