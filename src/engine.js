import { AXIS_CONVENTION, BASE_CARDS, FOLLOW_UP_CARDS, GATES, GATE_WEIGHTS, MODES, SCOPES } from '../data/cards.js';

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
  'noisy_sample',
  'sandbox_sample',
  'playful_sample',
  'taste_sample',
  'provisional_sample',
  'scope_confusion',
  'needs_disambiguation'
];

export function getMode(id) {
  return MODES[id] ?? MODES.fast;
}

export function getScope(id) {
  return SCOPES.find(scope => scope.id === id) ?? SCOPES[0];
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

export function buildBaseDeck(modeId, scopeId = 'claim') {
  const mode = getMode(modeId);
  const all = BASE_CARDS.filter(card => {
    if (card.seriousOnly && modeId !== 'serious') return false;
    if (Array.isArray(card.scopeIds) && !card.scopeIds.includes(scopeId)) return false;
    return true;
  });

  const finalCard = all.find(card => card.id === 'seriousness_01');
  const regular = all.filter(card => card.id !== 'seriousness_01');
  const capped = regular.slice(0, Math.max(0, mode.maxBaseCards - (finalCard ? 1 : 0)));
  return finalCard ? [...capped, finalCard] : capped;
}

export function makeInitialState({ modeId, scope, claim }) {
  const deck = buildBaseDeck(modeId, scope);
  return {
    repo: '42ndMirror',
    version: '0.2.0-balanced-cards-visualizer',
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

  state.answers.push({
    cardId: card.id,
    answerId: answer.id,
    elapsedMs,
    effects: cloneEffects(answer.effects ?? {})
  });
  state.askedCardIds.push(card.id);
  state.timing.push(elapsedMs);
  state.lastCardAt = now;

  const mode = getMode(state.modeId);
  if (Array.isArray(answer.followUps)) {
    const alreadyQueued = new Set(state.pendingFollowUps);
    for (const id of answer.followUps) {
      const currentFollowUpCount = countAskedFollowUps(state) + state.pendingFollowUps.length;
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
  for (const item of state.answers) applyEffects(totals, item.effects || {});

  const gateSummary = summarizeGates(totals.gates);
  const coverage = summarizeCoverage(totals.coverage);
  const quality = summarizeQuality(totals.quality, state.timing, state.answers.length, coverage, gateSummary);

  const lateralScale = computeLateralScale(state, coverage);
  const xRaw = round6((totals.empathy - totals.practicality) / lateralScale);
  const zRaw = round6((totals.wisdom - totals.knowledge) / lateralScale);
  const yRaw = round6(computeYRaw(gateSummary, quality));

  const projected = projectToOctahedronSurface({ x: xRaw, y: yRaw, z: zRaw });
  const interpretation = buildInterpretation(projected, totals, gateSummary, quality, coverage, state);

  return {
    repo: state.repo,
    version: state.version,
    mode: state.modeId,
    scope: state.scope,
    scope_label: getScope(state.scope).name,
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
    visualizer_payload: {
      type: 'set-profile',
      data: { data: { point: { x: projected.x, y: projected.y, z: projected.z } } }
    },
    components: {
      empathy: round6(totals.empathy),
      practicality: round6(totals.practicality),
      wisdom: round6(totals.wisdom),
      knowledge: round6(totals.knowledge)
    },
    coverage,
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
  const coverage = {};
  for (const axis of AXES) coverage[axis] = 0;
  return { empathy: 0, practicality: 0, wisdom: 0, knowledge: 0, gates, quality, coverage };
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
  if (effects.coverage) {
    for (const axis of AXES) {
      if (Number.isFinite(effects.coverage[axis])) totals.coverage[axis] += effects.coverage[axis];
    }
  }
}

function summarizeGates(rawGates) {
  const items = {};
  let weightedSum = 0;
  let weightTotal = 0;

  for (const id of GATE_IDS) {
    const raw = rawGates[id] || 0;
    const normalized = clamp(raw / 2, -1, 1);
    const weight = GATE_WEIGHTS[id] ?? 1;
    const status = normalized >= 0.34 ? 'open' : normalized <= -0.34 ? 'closed' : 'dormant';
    items[id] = {
      label: GATES[id],
      weight,
      raw: round6(raw),
      normalized: round6(normalized),
      status
    };
    weightedSum += normalized * weight;
    weightTotal += weight;
  }

  return {
    average: round6(weightTotal ? weightedSum / weightTotal : 0),
    items,
    open_count: Object.values(items).filter(g => g.status === 'open').length,
    closed_count: Object.values(items).filter(g => g.status === 'closed').length,
    dormant_count: Object.values(items).filter(g => g.status === 'dormant').length
  };
}

function summarizeCoverage(rawCoverage) {
  const items = {};
  for (const axis of AXES) items[axis] = round6(rawCoverage[axis] || 0);
  const touched = AXES.filter(axis => items[axis] >= 0.75);
  const weak = AXES.filter(axis => items[axis] > 0 && items[axis] < 0.75);
  const missing = AXES.filter(axis => items[axis] <= 0);
  return {
    items,
    touched,
    weak,
    missing,
    touched_count: touched.length,
    all_four_touched: touched.length === 4
  };
}

function computeLateralScale(state, coverage) {
  const base = state.modeId === 'serious' ? 5.2 : 4.0;
  const coverageLift = Math.min(1.4, coverage.touched_count * 0.18);
  return base + coverageLift;
}

function computeYRaw(gateSummary, quality) {
  let y = gateSummary.average;

  if (quality.grade === 'weak' || quality.grade === 'sandbox') y *= 0.55;
  else if (quality.grade === 'provisional') y *= 0.75;

  if (quality.counts.sealed_signal >= 2) y = Math.min(y, -0.25);
  if (quality.counts.low_signal >= 3) y = Math.min(y, 0.12);
  return clamp(round6(y), -1, 1);
}

function summarizeQuality(quality, timing, answerCount, coverage, gateSummary) {
  const totalMs = timing.reduce((a, b) => a + b, 0);
  const avgMs = answerCount ? totalMs / answerCount : 0;
  const veryFastCount = timing.filter(ms => ms > 0 && ms < 700).length;
  const fastRatio = answerCount ? veryFastCount / answerCount : 0;

  const flags = [];
  if ((quality.sandbox_sample || 0) >= 2) flags.push('sandbox sample: useful for testing, weak as a real plot');
  if ((quality.taste_sample || 0) >= 2) flags.push('taste signal: appeal may be mixed with judgement');
  if ((quality.low_signal || 0) >= 2) flags.push('low signal: do not overclaim the coordinate');
  if ((quality.sealed_signal || 0) > 0) flags.push('closure pressure detected');
  if ((quality.self_protective_signal || 0) > 0) flags.push('position-protection pressure detected');
  if ((quality.scope_confusion || 0) > 0) flags.push('scope may mix taste, judgement, or roleplay');
  if ((quality.incomplete_signal || 0) > 1) flags.push('some answers admit missing information');
  if ((quality.narrow_sample || 0) > 0) flags.push('sample may be narrow');
  if ((quality.noisy_sample || 0) > 0) flags.push('sample may be noisy');
  if ((quality.provisional_sample || 0) > 1) flags.push('result should be read as provisional');
  if ((quality.needs_disambiguation || 0) > 0) flags.push('one or more answers needed a follow-up to disambiguate');
  if (!coverage.all_four_touched && coverage.touched_count <= 2) flags.push('not all four lateral dimensions were clearly touched');
  if (gateSummary.closed_count > 0) flags.push('one or more stability gates closed');
  if (answerCount >= 5 && fastRatio >= 0.45) flags.push('answers were unusually fast');

  let score = 100;
  score += (quality.high_signal || 0) * 4;
  score -= (quality.sandbox_sample || 0) * 18;
  score -= (quality.low_signal || 0) * 16;
  score -= (quality.taste_sample || 0) * 12;
  score -= (quality.sealed_signal || 0) * 14;
  score -= (quality.self_protective_signal || 0) * 10;
  score -= (quality.scope_confusion || 0) * 10;
  score -= (quality.incomplete_signal || 0) * 6;
  score -= (quality.narrow_sample || 0) * 6;
  score -= (quality.noisy_sample || 0) * 6;
  score -= (quality.provisional_sample || 0) * 5;
  score -= (quality.needs_disambiguation || 0) * 3;
  if (!coverage.all_four_touched) score -= (4 - coverage.touched_count) * 4;
  if (answerCount >= 5 && fastRatio >= 0.45) score -= 10;

  score = clamp(Math.round(score), 0, 100);
  let grade = 'strong';
  if ((quality.sandbox_sample || 0) >= 2) grade = 'sandbox';
  else if (score < 45) grade = 'weak';
  else if (score < 70) grade = 'provisional';
  else if (score < 86) grade = 'usable';

  return {
    score,
    grade,
    flags,
    average_answer_ms: Math.round(avgMs),
    fast_ratio: round6(fastRatio),
    counts: Object.fromEntries(Object.keys(quality).map(key => [key, quality[key] || 0]))
  };
}

export function projectToOctahedronSurface(raw) {
  const x = finite(raw.x);
  const y = finite(raw.y);
  const z = finite(raw.z);
  const manhattan = Math.abs(x) + Math.abs(y) + Math.abs(z);

  if (manhattan < 1e-9) {
    return { x: 0, y: 1, z: 0, note: 'near-zero raw vector projected to positive integration default' };
  }

  const point = {
    x: round6(x / manhattan),
    y: round6(y / manhattan),
    z: round6(z / manhattan)
  };
  forceRoundedSurface(point);

  return {
    x: point.x,
    y: point.y,
    z: point.z,
    note: 'raw vector normalized to octahedron surface'
  };
}

function forceRoundedSurface(point) {
  const axes = ['x', 'y', 'z'];
  const sum = axes.reduce((acc, axis) => acc + Math.abs(point[axis]), 0);
  const diff = round6(1 - sum);
  if (Math.abs(diff) < 0.000001) return;

  let target = axes[0];
  for (const axis of axes) {
    if (Math.abs(point[axis]) > Math.abs(point[target])) target = axis;
  }

  let sign = Math.sign(point[target]);
  if (!sign) sign = target === 'y' ? 1 : 1;
  point[target] = round6(point[target] + sign * diff);
}

function buildInterpretation(projected, totals, gateSummary, quality, coverage, state) {
  const notes = [];
  const xLabel = projected.x >= 0.08 ? 'empathy-leaning' : projected.x <= -0.08 ? 'practicality-leaning' : 'laterally balanced on empathy/practicality';
  const zLabel = projected.z >= 0.08 ? 'wisdom-leaning' : projected.z <= -0.08 ? 'knowledge-leaning' : 'laterally balanced on wisdom/knowledge';
  const yLabel = projected.y >= 0.34 ? 'stable' : projected.y <= -0.34 ? 'unstable' : 'borderline';

  notes.push(`X-axis: ${xLabel}.`);
  notes.push(`Z-axis: ${zLabel}.`);
  notes.push(`Y-axis: ${yLabel} for this scope.`);

  const sortedComponents = Object.entries({
    empathy: totals.empathy,
    practicality: totals.practicality,
    wisdom: totals.wisdom,
    knowledge: totals.knowledge
  }).sort((a, b) => b[1] - a[1]);

  const top = sortedComponents[0];
  if (top && top[1] > 0) notes.push(`Strongest expressed lens: ${top[0]}.`);

  if (coverage.missing.length) notes.push(`Untouched dimensions: ${coverage.missing.join(', ')}.`);
  else if (coverage.weak.length) notes.push(`Lightly touched dimensions: ${coverage.weak.join(', ')}.`);
  else notes.push('All four lateral dimensions were touched.');

  if (gateSummary.closed_count > 0) {
    const closed = Object.values(gateSummary.items).filter(g => g.status === 'closed').map(g => g.label);
    notes.push(`Closed gates: ${closed.join(', ')}.`);
  } else if (gateSummary.open_count >= 4) {
    notes.push('Most stability gates opened for this scope.');
  } else {
    notes.push('Several gates stayed dormant rather than clearly open or closed.');
  }

  if (quality.flags.length) notes.push(`Signal note: ${quality.flags[0]}.`);

  const label = `${capitalize(yLabel)} · ${capitalize(xLabel)} · ${capitalize(zLabel)}`;

  return {
    label,
    notes,
    reading: {
      stability: yLabel,
      empathy_practicality: xLabel,
      wisdom_knowledge: zLabel,
      scope: getScope(state.scope).name
    }
  };
}

function finite(value) {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round6(value) {
  return Math.round((Number(value) || 0) * 1_000_000) / 1_000_000;
}

function capitalize(value) {
  return String(value || '').replace(/^./, char => char.toUpperCase());
}
