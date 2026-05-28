import { AXIS_CONVENTION, BASE_CARDS, FOLLOW_UP_CARDS, GATES, MODES } from '../data/cards.js';

const AXES = ['empathy', 'practicality', 'wisdom', 'knowledge'];
const GATE_IDS = Object.keys(GATES);
const QUALITY_KEYS = [
  'high_signal',
  'incomplete_signal',
  'low_signal',
  'shallow_signal',
  'sealed_signal',
  'self_protective_signal',
  'uncertainty',
  'narrow_sample',
  'noisy_sample'
];

export function getMode(id) {
  return MODES[id] ?? MODES.fast;
}

export function getReadableText(card, modeId) {
  const mode = getMode(modeId);
  const level = mode.readingLevel === 'simple' ? 'simple' : 'normal';
  return card[level] ?? card.normal;
}

export function getAnswerText(answer, modeId) {
  const mode = getMode(modeId);
  const level = mode.readingLevel === 'simple' ? 'simple' : 'normal';
  return answer[level] ?? answer.normal;
}

export function buildBaseDeck(modeId) {
  const mode = getMode(modeId);
  const all = BASE_CARDS.filter(card => !card.seriousOnly || modeId === 'serious');
  const finalCard = all.find(card => card.id === 'final_check_01');
  const regular = all.filter(card => card.id !== 'final_check_01');
  const capped = regular.slice(0, Math.max(0, mode.maxBaseCards - 1));
  return finalCard ? [...capped, finalCard] : capped;
}

export function makeInitialState({ modeId, scope, claim }) {
  const deck = buildBaseDeck(modeId);
  return {
    repo: '42ndMirror',
    version: '0.1.0-test-engine',
    modeId,
    scope,
    claim: (claim || '').trim(),
    baseDeck: deck,
    baseIndex: 0,
    pendingFollowUps: [],
    askedCardIds: [],
    answers: [],
    startedAt: Date.now(),
    lastCardAt: Date.now(),
    timing: []
  };
}

export function getNextCard(state) {
  const followUp = popNextFollowUp(state);
  if (followUp) return followUp;
  return state.baseDeck[state.baseIndex] ?? null;
}

function popNextFollowUp(state) {
  while (state.pendingFollowUps.length) {
    const id = state.pendingFollowUps.shift();
    if (state.askedCardIds.includes(id)) continue;
    const card = FOLLOW_UP_CARDS.find(item => item.id === id);
    if (card) return card;
  }
  return null;
}

export function answerCard(state, card, answer) {
  const now = Date.now();
  const elapsedMs = Math.max(0, now - state.lastCardAt);
  const isBase = state.baseDeck[state.baseIndex]?.id === card.id;

  const selected = {
    cardId: card.id,
    answerId: answer.id,
    elapsedMs,
    effects: cloneEffects(answer.effects ?? {})
  };

  state.answers.push(selected);
  state.askedCardIds.push(card.id);
  state.timing.push(elapsedMs);
  state.lastCardAt = now;

  const mode = getMode(state.modeId);
  if (Array.isArray(answer.followUps)) {
    const alreadyQueued = new Set(state.pendingFollowUps);
    const currentFollowUpCount = countAskedFollowUps(state) + state.pendingFollowUps.length;
    for (const id of answer.followUps) {
      if (currentFollowUpCount >= mode.maxFollowUps && state.modeId !== 'serious') break;
      if (!state.askedCardIds.includes(id) && !alreadyQueued.has(id)) {
        state.pendingFollowUps.push(id);
        alreadyQueued.add(id);
      }
    }
  }

  if (isBase) state.baseIndex += 1;

  return state;
}

function countAskedFollowUps(state) {
  const followIds = new Set(FOLLOW_UP_CARDS.map(card => card.id));
  return state.askedCardIds.filter(id => followIds.has(id)).length;
}

function cloneEffects(effects) {
  return JSON.parse(JSON.stringify(effects || {}));
}

export function calculateResult(state) {
  const totals = emptyTotals();

  for (const item of state.answers) {
    applyEffects(totals, item.effects || {});
  }

  const gateSummary = summarizeGates(totals.gates);
  const xRaw = round6((totals.practicality - totals.empathy) / 3);
  const zRaw = round6((totals.wisdom - totals.knowledge) / 3);
  const yRaw = round6(gateSummary.average);

  const projected = projectToOctahedronSurface({ x: xRaw, y: yRaw, z: zRaw });
  const quality = summarizeQuality(totals.quality, state.timing, state.answers.length);
  const interpretation = buildInterpretation(projected, totals, gateSummary, quality);

  return {
    repo: state.repo,
    version: state.version,
    mode: state.modeId,
    scope: state.scope,
    claim: state.claim,
    axis_convention: AXIS_CONVENTION,
    coordinates: {
      x: projected.x,
      y: projected.y,
      z: projected.z,
      surface_check: round6(Math.abs(projected.x) + Math.abs(projected.y) + Math.abs(projected.z)),
      raw: { x: xRaw, y: yRaw, z: zRaw },
      projection_note: projected.note
    },
    components: {
      empathy: round6(totals.empathy),
      practicality: round6(totals.practicality),
      wisdom: round6(totals.wisdom),
      knowledge: round6(totals.knowledge)
    },
    gates: gateSummary,
    signal_quality: quality,
    interpretation,
    selected_answers: state.answers.map(item => ({
      card_id: item.cardId,
      answer_id: item.answerId,
      elapsed_ms: item.elapsedMs
    }))
  };
}

function emptyTotals() {
  const gates = {};
  for (const id of GATE_IDS) gates[id] = 0;
  const quality = {};
  for (const key of QUALITY_KEYS) quality[key] = 0;
  return { empathy: 0, practicality: 0, wisdom: 0, knowledge: 0, gates, quality };
}

function applyEffects(totals, effects) {
  for (const axis of AXES) {
    if (Number.isFinite(effects[axis])) totals[axis] += effects[axis];
  }
  if (effects.gates) {
    for (const gate of GATE_IDS) {
      if (Number.isFinite(effects.gates[gate])) totals.gates[gate] += effects.gates[gate];
    }
  }
  if (effects.quality) {
    for (const key of Object.keys(effects.quality)) {
      if (!Number.isFinite(totals.quality[key])) totals.quality[key] = 0;
      if (Number.isFinite(effects.quality[key])) totals.quality[key] += effects.quality[key];
    }
  }
}

function summarizeGates(rawGates) {
  const items = {};
  let sum = 0;

  for (const id of GATE_IDS) {
    const raw = rawGates[id] || 0;
    const normalized = clamp(raw / 2, -1, 1);
    const status = normalized >= 0.34 ? 'open' : normalized <= -0.34 ? 'closed' : 'dormant';
    items[id] = {
      label: GATES[id],
      raw: round6(raw),
      normalized: round6(normalized),
      status
    };
    sum += normalized;
  }

  return {
    average: round6(sum / GATE_IDS.length),
    items
  };
}

function summarizeQuality(quality, timing, answerCount) {
  const totalMs = timing.reduce((a, b) => a + b, 0);
  const avgMs = answerCount ? totalMs / answerCount : 0;
  const veryFastCount = timing.filter(ms => ms > 0 && ms < 700).length;
  const fastRatio = answerCount ? veryFastCount / answerCount : 0;

  const flags = [];
  if ((quality.low_signal || 0) >= 2) flags.push('result should be treated as weak signal');
  if ((quality.sealed_signal || 0) > 0) flags.push('view was marked as hard to falsify');
  if ((quality.shallow_signal || 0) > 0) flags.push('some answers avoided detailed accounting');
  if ((quality.self_protective_signal || 0) > 0) flags.push('some answers protected position before correction');
  if ((quality.incomplete_signal || 0) > 1) flags.push('some answers admitted missing information');
  if ((quality.narrow_sample || 0) > 0) flags.push('pattern sample may be narrow');
  if ((quality.noisy_sample || 0) > 0) flags.push('pattern sample may be noisy');
  if (answerCount >= 5 && fastRatio >= 0.45) flags.push('answers were unusually fast');

  let score = 100;
  score -= (quality.low_signal || 0) * 18;
  score -= (quality.sealed_signal || 0) * 14;
  score -= (quality.shallow_signal || 0) * 10;
  score -= (quality.self_protective_signal || 0) * 8;
  score -= (quality.incomplete_signal || 0) * 6;
  score -= (quality.narrow_sample || 0) * 6;
  score -= (quality.noisy_sample || 0) * 6;
  score -= fastRatio >= 0.45 ? 12 : 0;
  score += (quality.high_signal || 0) * 6;
  score = clamp(Math.round(score), 0, 100);

  const grade = score >= 82 ? 'strong' : score >= 62 ? 'usable' : score >= 42 ? 'weak' : 'do not rely on it';

  return {
    grade,
    score,
    flags,
    timing: {
      answer_count: answerCount,
      average_ms_per_card: Math.round(avgMs),
      very_fast_answer_count: veryFastCount
    },
    raw: quality
  };
}

export function projectToOctahedronSurface(vector) {
  let x = numberOrZero(vector.x);
  let y = numberOrZero(vector.y);
  let z = numberOrZero(vector.z);
  const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);

  if (sum === 0) {
    return {
      x: 0,
      y: -1,
      z: 0,
      note: 'no directional signal; deterministic insufficient-signal fallback used'
    };
  }

  return {
    x: round6(x / sum),
    y: round6(y / sum),
    z: round6(z / sum),
    note: 'surface projection from raw vector'
  };
}

function buildInterpretation(coords, totals, gateSummary, quality) {
  const xLabel = coords.x > 0.08 ? 'Practicality-leaning' : coords.x < -0.08 ? 'Empathy-leaning' : 'Empathy/Practicality balanced';
  const zLabel = coords.z > 0.08 ? 'Wisdom-leaning' : coords.z < -0.08 ? 'Knowledge-leaning' : 'Wisdom/Knowledge balanced';
  const yLabel = coords.y > 0.22 ? 'stable' : coords.y < -0.22 ? 'unstable' : 'borderline';

  const open = [];
  const closed = [];
  const dormant = [];
  for (const [id, item] of Object.entries(gateSummary.items)) {
    if (item.status === 'open') open.push(item.label);
    else if (item.status === 'closed') closed.push(item.label);
    else dormant.push(item.label);
  }

  const notes = [];
  notes.push(`The plotted scope is ${xLabel}, ${zLabel}, and ${yLabel}.`);
  if (coords.x > 0.08) notes.push('It leaned toward practicality because the selected answers favored workable consequences, action, enforcement, or results.');
  if (coords.x < -0.08) notes.push('It leaned toward empathy because the selected answers favored human impact, fairness, harm, or emotional cost.');
  if (coords.z > 0.08) notes.push('It leaned toward wisdom because the selected answers favored context, limits, tradeoffs, patterns, or framing.');
  if (coords.z < -0.08) notes.push('It leaned toward knowledge because the selected answers favored evidence, proof, accuracy, records, or technical correctness.');
  if (closed.length) notes.push(`Closed or pressured gates: ${closed.join(', ')}.`);
  if (open.length) notes.push(`Open gates: ${open.join(', ')}.`);
  if (quality.flags.length) notes.push(`Signal warning: ${quality.flags.join('; ')}.`);

  return {
    label: `${xLabel} / ${zLabel} / ${yLabel}`,
    notes,
    open_gates: open,
    closed_gates: closed,
    dormant_gates: dormant
  };
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round6(value) {
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;
}
