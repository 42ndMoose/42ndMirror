export const AXIS_CONVENTION = {
  x: { positive: 'empathy', negative: 'practicality' },
  y: { positive: 'positive epistemic stability', negative: 'negative epistemic stability' },
  z: { positive: 'wisdom', negative: 'knowledge' },
  surface: '|x| + |y| + |z| = 1'
};

export const GATES = {
  G1_counter_consideration: 'counter-consideration',
  G2_non_strawman: 'fair-opponent model',
  G3_self_correction: 'self-correction',
  G4_contradiction_handling: 'contradiction handling',
  G5_reality_contact: 'reality contact',
  G6_non_self_sealing: 'non-sealing'
};

export const GATE_WEIGHTS = {
  G1_counter_consideration: 0.8,
  G2_non_strawman: 1.0,
  G3_self_correction: 1.1,
  G4_contradiction_handling: 1.2,
  G5_reality_contact: 1.25,
  G6_non_self_sealing: 1.1
};

export const ROUTE_FACETS = {
  micro_action: 'small action',
  body_need: 'body/time need',
  task_friction: 'task friction',
  evidence_claim: 'truth burden',
  value_tradeoff: 'value tradeoff',
  public_pressure: 'public pressure',
  comparison: 'comparison',
  person_pattern: 'person/character',
  policy_system: 'system/policy',
  strategy: 'strategy',
  argument: 'argument structure',
  fiction: 'fiction/character',
  low_stakes: 'light scope'
};

export const MODES = {
  fast: {
    id: 'fast',
    name: 'Fast mode',
    shortName: 'Fast',
    description: 'A short run for a lunch-break read.',
    readingLevel: 'normal',
    maxCards: 7
  },
  adhd: {
    id: 'adhd',
    name: 'ADHD mode',
    shortName: 'ADHD',
    description: 'Same math as Fast mode. Simpler words everywhere.',
    readingLevel: 'simple',
    maxCards: 7
  },
  serious: {
    id: 'serious',
    name: 'Serious mode',
    shortName: 'Serious',
    description: 'More cards and stricter signal checks.',
    readingLevel: 'normal',
    maxCards: 11
  }
};

export const UI_COPY = {
  normal: {
    title: '42ndMirror',
    subtitle: 'A short card test that plots a belief, decision, argument, or comparison on the Epistemic Octahedron.',
    howItWorks: 'Name the scope, answer the cards, get a strict xyz point.',
    modeTitle: 'Mode',
    scopeTitle: 'Scope',
    settingTitle: 'Setting',
    labelTitle: 'Scope label',
    labelHelp: 'Give it a short label. The label follows the run and result.',
    labelPlaceholder: 'Example: should I stop procrastinating and eat now',
    start: 'Start plot',
    reset: 'Reset',
    restart: 'Restart',
    retake: 'Run another plot',
    copy: 'Copy JSON',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    openVisualizer: 'Open full visualizer',
    result: 'Result',
    projectedOutput: 'Projected output',
    projectedHelp: 'The visualizer receives this run’s xyz payload.',
    coordinate: 'Surface coordinate',
    check: 'Check',
    gates: 'Gate pressure',
    coverage: 'Dimension coverage',
    readout: 'Readout',
    routing: 'Routing math',
    json: 'JSON output',
    history: 'Recent entries',
    historyEmpty: 'Completed plots will appear here.',
    remove: 'Remove',
    confirmTitle: 'Remove entry?',
    confirmText: 'This removes the saved entry from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Remove entry',
    card: 'Card',
    quotedScope: 'Scope',
    noLabel: 'Untitled scope'
  },
  simple: {
    title: '42ndMirror',
    subtitle: 'A quick card test for an idea, choice, argument, or comparison.',
    howItWorks: 'Name it. Pick answers. Get x, y, z.',
    modeTitle: 'Mode',
    scopeTitle: 'Thing to score',
    settingTitle: 'Where this is used',
    labelTitle: 'Name it',
    labelHelp: 'Write a short name. This name follows every card.',
    labelPlaceholder: 'Example: should I eat now',
    start: 'Start',
    reset: 'Clear',
    restart: 'Start over',
    retake: 'Do another one',
    copy: 'Copy JSON',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    openVisualizer: 'Open big graph',
    result: 'Result',
    projectedOutput: 'Graph point',
    projectedHelp: 'The graph gets this x, y, z point.',
    coordinate: 'x, y, z',
    check: 'Math check',
    gates: 'Pressure checks',
    coverage: 'What got counted',
    readout: 'Plain result',
    routing: 'Card picker math',
    json: 'JSON output',
    history: 'Saved runs',
    historyEmpty: 'Finished runs show up here.',
    remove: 'Delete',
    confirmTitle: 'Delete this?',
    confirmText: 'This deletes the saved run from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Delete',
    card: 'Card',
    quotedScope: 'Thing',
    noLabel: 'Unnamed thing'
  }
};

export const SCOPES = [
  { id: 'claim', name: 'Claim or belief', simpleName: 'Something I think', description: 'A view, take, or conclusion.', simpleDescription: 'A thought or opinion.' },
  { id: 'decision', name: 'Decision', simpleName: 'A choice', description: 'Something someone should do, avoid, allow, or reject.', simpleDescription: 'A yes/no or do/don’t choice.' },
  { id: 'reaction', name: 'Reaction', simpleName: 'A reaction', description: 'A response, impulse, argument, or move after pressure.', simpleDescription: 'How someone reacts.' },
  { id: 'argument', name: 'Argument', simpleName: 'An argument', description: 'A case someone is making.', simpleDescription: 'A case someone makes.' },
  { id: 'person_pattern', name: 'Person or character pattern', simpleName: 'Person/character', description: 'A visible pattern in a real or fictional subject.', simpleDescription: 'How a person or character acts.' },
  { id: 'comparison', name: 'Comparison', simpleName: 'Two sides', description: 'Two people, views, strategies, or outcomes.', simpleDescription: 'Two things being compared.' }
];

export const SETTINGS = [
  { id: 'private', name: 'Private check', simpleName: 'Just me', description: 'For a quiet read.', simpleDescription: 'I am checking it for myself.' },
  { id: 'group', name: 'Group comparison', simpleName: 'With friends', description: 'For comparing runs with other people.', simpleDescription: 'Other people may compare scores.' },
  { id: 'debate', name: 'Debate pressure', simpleName: 'To prove a point', description: 'For a claim used in an argument.', simpleDescription: 'This may be used to win an argument.' },
  { id: 'fiction', name: 'Fiction or strategy read', simpleName: 'Story/game read', description: 'For characters, tactics, or strategy comparisons.', simpleDescription: 'For a character, game, or strategy.' }
];

const C = (main, sub = '') => ({ main, sub });
const A = (id, normal, simple, effects = {}, route = {}) => ({ id, normal, simple, effects, route });

const baseGate = {
  G1_counter_consideration: 0,
  G2_non_strawman: 0,
  G3_self_correction: 0,
  G4_contradiction_handling: 0,
  G5_reality_contact: 0,
  G6_non_self_sealing: 0
};

export const CARD_BANK = [
  {
    id: 'route_lens_01',
    stage: 'early',
    fixedEarly: true,
    routes: { micro_action: 0.35, evidence_claim: 0.35, value_tradeoff: 0.35, policy_system: 0.25, comparison: 0.25, person_pattern: 0.25, public_pressure: 0.25 },
    normal: { kicker: 'Lens', title: 'What kind of pressure is carrying this scope?', help: 'Pick the pressure that would make the result more exact.' },
    simple: { kicker: 'Lens', title: 'What is this mostly about?', help: 'Pick what would make the answer clearer.' },
    answers: [
      A('live_action_pressure', C('A live action choice.', 'Timing, friction, energy, or next step matters most.'), C('A thing to do now.', 'Time, energy, or next step matters.'), { practicality: 0.35, wisdom: 0.15, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { practicality: 0.55, wisdom: 0.25 }, quality: { precision_signal: 1 } }, { micro_action: 0.45, task_friction: 0.3, body_need: 0.15 }),
      A('truth_burden_pressure', C('A truth burden.', 'The answer depends on proof, terms, source quality, or counterexamples.'), C('A fact/proof issue.', 'Facts, terms, or examples matter.'), { knowledge: 0.45, wisdom: 0.15, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { knowledge: 0.6, wisdom: 0.25 } }, { evidence_claim: 0.55 }),
      A('value_tradeoff_pressure', C('A real tradeoff.', 'Costs, duties, people, limits, or consequences pull in different directions.'), C('A tradeoff.', 'Costs and people pull different ways.'), { empathy: 0.25, practicality: 0.25, wisdom: 0.25, gates: { ...baseGate, G4_contradiction_handling: 0.25 }, coverage: { empathy: 0.4, practicality: 0.4, wisdom: 0.4 } }, { value_tradeoff: 0.55, policy_system: 0.1 }),
      A('comparison_pressure', C('A comparison.', 'The hard part is which standard should compare the two sides.'), C('Two things compared.', 'The rule for comparing matters.'), { wisdom: 0.3, knowledge: 0.2, gates: { ...baseGate, G4_contradiction_handling: 0.2 }, coverage: { wisdom: 0.4, knowledge: 0.3 } }, { comparison: 0.55, person_pattern: 0.15 }),
      A('public_result_pressure', C('A public result.', 'The score may be used socially, so the use of the score matters too.'), C('People may compare it.', 'The score might be used socially.'), { practicality: 0.2, wisdom: 0.2, gates: { ...baseGate, G6_non_self_sealing: 0.1 }, coverage: { practicality: 0.25, wisdom: 0.25 }, quality: { social_performance_pressure: 1 } }, { public_pressure: 0.55, evidence_claim: 0.1 })
    ]
  },
  {
    id: 'micro_body_state_01',
    stage: 'early',
    routes: { micro_action: 0.85, body_need: 1.0, task_friction: 0.45, low_stakes: 0.35 },
    normal: { kicker: 'Small choice', title: 'For this exact choice, what is the live constraint?', help: 'This card keeps tiny choices from getting abstract cards too early.' },
    simple: { kicker: 'Small choice', title: 'What is the real thing here?', help: 'Pick the closest one.' },
    answers: [
      A('body_budget', C('Body budget.', 'Food, sleep, pain, energy, or attention is setting the floor.'), C('Body needs.', 'Food, sleep, energy, or focus.'), { practicality: 0.45, wisdom: 0.2, empathy: 0.15, gates: { ...baseGate, G5_reality_contact: 0.45 }, coverage: { practicality: 0.55, wisdom: 0.3, empathy: 0.2 } }, { body_need: 0.45, micro_action: 0.2 }),
      A('momentum_budget', C('Momentum budget.', 'The concern is whether stopping will kill the task flow.'), C('Momentum.', 'Stopping may break the flow.'), { practicality: 0.5, knowledge: 0.15, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { practicality: 0.6, knowledge: 0.2 } }, { task_friction: 0.4, micro_action: 0.25 }),
      A('avoidance_budget', C('Avoidance budget.', 'The choice may be hiding discomfort, uncertainty, or task resistance.'), C('Avoiding something.', 'This may hide task resistance.'), { wisdom: 0.3, knowledge: 0.15, gates: { ...baseGate, G3_self_correction: 0.2 }, coverage: { wisdom: 0.35, knowledge: 0.2 }, quality: { needs_disambiguation: 1 } }, { task_friction: 0.45 }),
      A('tiny_stakes', C('Tiny stakes.', 'The cleanest read is probably a light operational check.'), C('Tiny stakes.', 'This is probably just a small check.'), { practicality: 0.2, gates: { ...baseGate, G5_reality_contact: 0.1 }, coverage: { practicality: 0.25 }, quality: { low_stakes: 2, low_signal: 1 } }, { low_stakes: 0.55, micro_action: 0.2 })
    ]
  },
  {
    id: 'micro_delay_cost_01',
    stage: 'mid',
    routes: { micro_action: 0.9, body_need: 0.75, task_friction: 0.75, low_stakes: 0.25 },
    normal: { kicker: 'Delay test', title: 'If this waits 30 minutes, what actually changes?', help: 'The point is not drama. It is what changes in the real system.' },
    simple: { kicker: 'Delay test', title: 'If you wait 30 minutes, what changes?', help: 'Pick the real change.' },
    answers: [
      A('energy_drops', C('Energy or attention drops.', 'The body cost gets worse, so action gets less clean.'), C('Energy drops.', 'Waiting makes the body worse.'), { practicality: 0.45, empathy: 0.2, gates: { ...baseGate, G5_reality_contact: 0.45 }, coverage: { practicality: 0.55, empathy: 0.25 } }, { body_need: 0.35 }),
      A('task_gets_clearer', C('The task gets clearer.', 'A short delay may improve sequencing or reduce mess.'), C('It gets clearer.', 'Waiting helps plan it.'), { wisdom: 0.35, practicality: 0.25, gates: { ...baseGate, G4_contradiction_handling: 0.25 }, coverage: { wisdom: 0.4, practicality: 0.35 } }, { task_friction: 0.25 }),
      A('cost_moves_to_others', C('The cost moves to someone else.', 'Delay affects people, promises, or shared timing.'), C('Someone else pays.', 'Delay affects another person.'), { empathy: 0.45, practicality: 0.2, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { empathy: 0.55, practicality: 0.25 } }, { value_tradeoff: 0.25 }),
      A('little_changes', C('Little changes.', 'The useful move is a low-pressure choice, not a major verdict.'), C('Not much changes.', 'Keep it simple.'), { practicality: 0.2, wisdom: 0.15, quality: { low_stakes: 2, provisional_sample: 1 }, coverage: { practicality: 0.2, wisdom: 0.2 } }, { low_stakes: 0.35 })
    ]
  },
  {
    id: 'micro_next_step_01',
    stage: 'mid',
    routes: { micro_action: 0.95, body_need: 0.6, task_friction: 0.7, low_stakes: 0.4 },
    normal: { kicker: 'Operational close', title: 'What is the cleanest next move for this small scope?', help: 'The answer should fit the pressure you already identified.' },
    simple: { kicker: 'Next move', title: 'What should happen next?', help: 'Pick the clean move.' },
    answers: [
      A('feed_then_return', C('Handle the body need, then return with a timer.', 'The body cost is real, but the task still gets a guardrail.'), C('Eat, then timer.', 'Body first, task still protected.'), { practicality: 0.45, wisdom: 0.25, empathy: 0.2, gates: { ...baseGate, G4_contradiction_handling: 0.35, G5_reality_contact: 0.35 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.55, wisdom: 0.35, empathy: 0.25 } }),
      A('timer_then_feed', C('Set a short task timer, then eat.', 'Momentum is protected without ignoring the body signal.'), C('Timer, then eat.', 'Protect flow, then body.'), { practicality: 0.55, wisdom: 0.2, gates: { ...baseGate, G4_contradiction_handling: 0.25, G5_reality_contact: 0.25 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.6, wisdom: 0.25 } }),
      A('remove_friction_first', C('Remove the task friction first.', 'Clarify the next action so food is not used as a fog machine.'), C('Fix the task fog first.', 'Make the next step clear.'), { wisdom: 0.4, knowledge: 0.25, gates: { ...baseGate, G3_self_correction: 0.25, G5_reality_contact: 0.25 }, coverage: { wisdom: 0.45, knowledge: 0.35 } }),
      A('drop_the_scope', C('Drop the score and make the tiny choice.', 'The run already showed this is too light for a heavy read.'), C('Stop scoring it.', 'Just make the small choice.'), { practicality: 0.25, wisdom: 0.25, gates: { ...baseGate, G3_self_correction: 0.35 }, quality: { low_stakes: 2, precision_signal: 1 }, coverage: { practicality: 0.25, wisdom: 0.25 } })
    ]
  },
  {
    id: 'truth_burden_01',
    stage: 'early',
    routes: { evidence_claim: 1.0, argument: 0.7, policy_system: 0.35, value_tradeoff: 0.25 },
    normal: { kicker: 'Truth burden', title: 'What would make this scope better grounded?', help: 'Pick the thing that would most improve the read.' },
    simple: { kicker: 'Facts', title: 'What would make this more solid?', help: 'Pick the thing that helps most.' },
    answers: [
      A('terms_first', C('Cleaner terms.', 'People may be using the same words for different things.'), C('Clearer words.', 'Same word, different meaning.'), { knowledge: 0.45, wisdom: 0.2, gates: { ...baseGate, G4_contradiction_handling: 0.25 }, coverage: { knowledge: 0.5, wisdom: 0.25 } }, { evidence_claim: 0.25 }),
      A('better_examples', C('Better examples.', 'The examples need to be representative, not just memorable.'), C('Better examples.', 'Not just the loudest example.'), { knowledge: 0.5, wisdom: 0.2, gates: { ...baseGate, G5_reality_contact: 0.4 }, coverage: { knowledge: 0.6, wisdom: 0.25 } }, { evidence_claim: 0.25 }),
      A('mechanism_first', C('A mechanism.', 'The claim needs a working path from cause to result.'), C('How it works.', 'Cause to result.'), { practicality: 0.35, knowledge: 0.25, gates: { ...baseGate, G5_reality_contact: 0.3 }, coverage: { practicality: 0.4, knowledge: 0.35 } }, { strategy: 0.2, policy_system: 0.15 }),
      A('human_stake_first', C('The human stake.', 'The proof matters, but the read is thin without who bears the cost.'), C('Who pays the cost.', 'The fact needs a human side.'), { empathy: 0.45, wisdom: 0.15, gates: { ...baseGate, G1_counter_consideration: 0.15 }, coverage: { empathy: 0.5, wisdom: 0.2 } }, { value_tradeoff: 0.25 })
    ]
  },
  {
    id: 'counter_evidence_01',
    stage: 'mid',
    routes: { evidence_claim: 0.95, argument: 0.65, public_pressure: 0.3, policy_system: 0.3 },
    normal: { kicker: 'Update pressure', title: 'Clean evidence appears against the version you preferred. What moves?', help: 'A good answer can move the conclusion, boundary, relevance, or confidence.' },
    simple: { kicker: 'New facts', title: 'Good facts hurt your favorite answer. What moves?', help: 'Pick what really changes.' },
    answers: [
      A('move_conclusion', C('The conclusion moves.', 'The evidence touches the main point.'), C('The answer changes.', 'The fact hits the main point.'), { knowledge: 0.45, wisdom: 0.25, gates: { ...baseGate, G3_self_correction: 0.75, G5_reality_contact: 0.6, G6_non_self_sealing: 0.4 }, coverage: { knowledge: 0.5, wisdom: 0.3 }, quality: { precision_signal: 1 } }),
      A('move_boundary', C('The boundary moves.', 'The read survives, but it gets narrower.'), C('The answer gets smaller.', 'Main idea stays, but narrower.'), { wisdom: 0.5, knowledge: 0.25, gates: { ...baseGate, G4_contradiction_handling: 0.6, G3_self_correction: 0.35 }, coverage: { wisdom: 0.55, knowledge: 0.3 } }),
      A('audit_relevance', C('The relevance gets audited.', 'The fact may be true while proving less than claimed.'), C('Check what it proves.', 'True fact, maybe wrong use.'), { knowledge: 0.45, practicality: 0.25, gates: { ...baseGate, G5_reality_contact: 0.5, G4_contradiction_handling: 0.25 }, coverage: { knowledge: 0.5, practicality: 0.3 } }),
      A('hold_temporarily', C('The larger pattern holds for now.', 'The contrary point may be real without carrying enough weight.'), C('Hold for now.', 'One point may not beat the pattern.'), { wisdom: 0.25, practicality: 0.15, gates: { ...baseGate, G6_non_self_sealing: -0.1 }, quality: { needs_disambiguation: 1 }, coverage: { wisdom: 0.3, practicality: 0.2 } }, { evidence_claim: 0.1 })
    ]
  },
  {
    id: 'opposition_best_01',
    stage: 'mid',
    routes: { evidence_claim: 0.65, argument: 0.9, public_pressure: 0.55, value_tradeoff: 0.45, comparison: 0.35 },
    normal: { kicker: 'Opposite read', title: 'At its best, what does the opposing read have?', help: 'This checks whether the result compares real structures or just preferred stories.' },
    simple: { kicker: 'Other side', title: 'What is the other side good at?', help: 'Pick its best part.' },
    answers: [
      A('real_cost_weak_fix', C('It sees a real cost but offers a weak fix.', 'The concern is live even if the answer fails.'), C('Real worry, weak fix.', 'They see something real.'), { empathy: 0.25, practicality: 0.25, wisdom: 0.2, gates: { ...baseGate, G2_non_strawman: 0.55, G4_contradiction_handling: 0.35 }, coverage: { empathy: 0.35, practicality: 0.35, wisdom: 0.25 } }),
      A('good_detail_bad_scale', C('It has a good detail but poor scale.', 'A true fact may be carrying too much weight.'), C('Good detail, wrong size.', 'True thing, too big.'), { knowledge: 0.35, wisdom: 0.25, gates: { ...baseGate, G2_non_strawman: 0.45, G4_contradiction_handling: 0.35 }, coverage: { knowledge: 0.4, wisdom: 0.3 } }),
      A('good_pattern_thin_proof', C('It sees a pattern but needs cleaner proof.', 'The shape may be plausible before it is established.'), C('Good pattern, thin proof.', 'Maybe right, needs facts.'), { wisdom: 0.35, knowledge: 0.25, gates: { ...baseGate, G2_non_strawman: 0.45, G5_reality_contact: 0.2 }, coverage: { wisdom: 0.4, knowledge: 0.3 } }),
      A('still_misses_burden', C('It still misses the central burden.', 'Even the best version does not carry enough load.'), C('Still misses the main load.', 'Best version still fails.'), { practicality: 0.25, knowledge: 0.2, gates: { ...baseGate, G2_non_strawman: -0.25, G6_non_self_sealing: -0.15 }, quality: { needs_disambiguation: 1 }, coverage: { practicality: 0.3, knowledge: 0.25 } })
    ]
  },
  {
    id: 'value_tradeoff_01',
    stage: 'early',
    routes: { value_tradeoff: 1.0, policy_system: 0.55, micro_action: 0.25, comparison: 0.25 },
    normal: { kicker: 'Tradeoff', title: 'Which burden is easiest to undercount here?', help: 'All four are valid. Pick the one most likely to be missed.' },
    simple: { kicker: 'Tradeoff', title: 'What gets missed easiest?', help: 'All can matter. Pick the missed one.' },
    answers: [
      A('quiet_person_cost', C('Quiet person-cost.', 'Someone affected has little power to make the cost visible.'), C('Quiet human cost.', 'Someone pays quietly.'), { empathy: 0.55, wisdom: 0.15, gates: { ...baseGate, G1_counter_consideration: 0.25 }, coverage: { empathy: 0.6, wisdom: 0.2 } }),
      A('execution_cost', C('Execution cost.', 'The idea sounds clean until capacity, enforcement, or timing enters.'), C('Hard to actually do.', 'Capacity, timing, or enforcement.'), { practicality: 0.55, knowledge: 0.15, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { practicality: 0.6, knowledge: 0.2 } }),
      A('missing_detail', C('Missing detail.', 'The read may be too broad without better facts.'), C('Missing facts.', 'Need better details.'), { knowledge: 0.55, wisdom: 0.1, gates: { ...baseGate, G5_reality_contact: 0.25 }, coverage: { knowledge: 0.6, wisdom: 0.15 } }),
      A('bad_scale', C('Bad scale.', 'A real point may be too large or too small in the final judgment.'), C('Wrong size.', 'Real point, wrong size.'), { wisdom: 0.55, knowledge: 0.15, gates: { ...baseGate, G4_contradiction_handling: 0.25 }, coverage: { wisdom: 0.6, knowledge: 0.2 } })
    ]
  },
  {
    id: 'policy_load_01',
    stage: 'mid',
    routes: { policy_system: 1.0, value_tradeoff: 0.65, strategy: 0.5, public_pressure: 0.25 },
    normal: { kicker: 'System load', title: 'If this becomes a rule or shared norm, where does pressure build?', help: 'This makes system-level scopes more concrete.' },
    simple: { kicker: 'System', title: 'If this becomes a rule, where does it strain?', help: 'Pick the pressure point.' },
    answers: [
      A('enforcement_load', C('Enforcement load.', 'The rule may fail because nobody can apply it evenly.'), C('Hard to enforce.', 'People cannot apply it evenly.'), { practicality: 0.55, knowledge: 0.2, gates: { ...baseGate, G5_reality_contact: 0.35 }, coverage: { practicality: 0.6, knowledge: 0.25 } }),
      A('edge_case_load', C('Edge-case load.', 'The rule may break where real life is messier than the principle.'), C('Messy edge cases.', 'Real life gets complicated.'), { wisdom: 0.45, empathy: 0.2, gates: { ...baseGate, G4_contradiction_handling: 0.35 }, coverage: { wisdom: 0.5, empathy: 0.25 } }),
      A('trust_load', C('Trust load.', 'The system may depend on people believing the process is fair.'), C('Trust.', 'People need to see fair process.'), { empathy: 0.3, wisdom: 0.25, practicality: 0.15, gates: { ...baseGate, G1_counter_consideration: 0.25 }, coverage: { empathy: 0.35, wisdom: 0.3, practicality: 0.2 } }),
      A('measurement_load', C('Measurement load.', 'The rule may need cleaner data than people actually have.'), C('Hard to measure.', 'The rule needs better data.'), { knowledge: 0.5, practicality: 0.2, gates: { ...baseGate, G5_reality_contact: 0.35 }, coverage: { knowledge: 0.55, practicality: 0.25 } })
    ]
  },
  {
    id: 'comparison_standard_01',
    stage: 'early',
    routes: { comparison: 1.0, person_pattern: 0.6, strategy: 0.45, public_pressure: 0.25 },
    normal: { kicker: 'Comparison rule', title: 'What standard should compare the two sides?', help: 'A comparison gets noisy when appeal, record, method, and effect are mixed together.' },
    simple: { kicker: 'Compare', title: 'What rule compares them?', help: 'Pick the fairest rule.' },
    answers: [
      A('compare_method', C('Method under pressure.', 'How each side handles limits, losses, tradeoffs, and correction.'), C('How they think under pressure.', 'Limits, losses, correction.'), { wisdom: 0.35, practicality: 0.2, knowledge: 0.15, gates: { ...baseGate, G4_contradiction_handling: 0.35, G5_reality_contact: 0.25 }, coverage: { wisdom: 0.4, practicality: 0.25, knowledge: 0.2 } }, { person_pattern: 0.2, strategy: 0.2 }),
      A('compare_record', C('Outcome record.', 'What actually happens when the method gets applied.'), C('What happens.', 'Real outcomes.'), { practicality: 0.45, knowledge: 0.25, gates: { ...baseGate, G5_reality_contact: 0.35 }, coverage: { practicality: 0.5, knowledge: 0.3 } }),
      A('compare_radius', C('Human radius.', 'Who gets treated as real when power or pressure rises.'), C('Who counts.', 'Who gets treated as real.'), { empathy: 0.5, wisdom: 0.2, gates: { ...baseGate, G1_counter_consideration: 0.25 }, coverage: { empathy: 0.55, wisdom: 0.25 } }),
      A('compare_appeal', C('Why one side is compelling.', 'Appeal matters for interest, but it is weaker as a maturity standard.'), C('Why it feels cool.', 'Interesting, but weaker as a score rule.'), { wisdom: 0.15, quality: { taste_sample: 2, low_signal: 1 }, coverage: { wisdom: 0.15 } }, { low_stakes: 0.25 })
    ]
  },
  {
    id: 'character_power_01',
    stage: 'mid',
    routes: { person_pattern: 1.0, comparison: 0.55, strategy: 0.55, fiction: 0.35 },
    normal: { kicker: 'Power test', title: 'When the subject has leverage, what becomes clearest?', help: 'This is useful for real people, fictional characters, leaders, and strategic actors.' },
    simple: { kicker: 'Power', title: 'When they have power, what shows?', help: 'Pick what becomes clear.' },
    answers: [
      A('precision_under_power', C('Precision increases.', 'They track facts and constraints more sharply under leverage.'), C('They get sharper.', 'Facts and limits get clearer.'), { knowledge: 0.35, practicality: 0.35, gates: { ...baseGate, G5_reality_contact: 0.3 }, coverage: { knowledge: 0.4, practicality: 0.4 } }),
      A('care_radius_under_power', C('Care radius changes.', 'The question becomes who still counts once pressure rises.'), C('Who still counts.', 'Power shows who matters to them.'), { empathy: 0.45, wisdom: 0.15, gates: { ...baseGate, G1_counter_consideration: 0.2 }, coverage: { empathy: 0.5, wisdom: 0.2 } }),
      A('strategic_clarity_under_power', C('Strategic clarity increases.', 'They see the board, costs, timing, and incentives.'), C('They see the board.', 'Costs, timing, incentives.'), { practicality: 0.35, wisdom: 0.3, knowledge: 0.15, gates: { ...baseGate, G4_contradiction_handling: 0.25 }, coverage: { practicality: 0.4, wisdom: 0.35, knowledge: 0.2 } }),
      A('image_takes_over', C('Image takes over.', 'The subject becomes harder to separate from performance.'), C('Image takes over.', 'Performance gets mixed with truth.'), { wisdom: 0.15, gates: { ...baseGate, G6_non_self_sealing: -0.25 }, quality: { social_performance_pressure: 1, needs_disambiguation: 1 }, coverage: { wisdom: 0.2 } }, { public_pressure: 0.2 })
    ]
  },
  {
    id: 'public_score_use_01',
    stage: 'early',
    routes: { public_pressure: 1.0, comparison: 0.55, evidence_claim: 0.35, argument: 0.35 },
    settings: ['group', 'debate'],
    normal: { kicker: 'Score use', title: 'Other people may compare results. What should the number do?', help: 'Shared scores create pressure, so the use of the result becomes part of the run.' },
    simple: { kicker: 'Score use', title: 'People may compare scores. What should the number do?', help: 'Pick the honest use.' },
    answers: [
      A('map_disagreement', C('Map the disagreement.', 'Use the plot to see where the disagreement sits.'), C('Map the disagreement.', 'Use it to see the shape.'), { wisdom: 0.35, gates: { ...baseGate, G1_counter_consideration: 0.25, G6_non_self_sealing: 0.2 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.35 } }),
      A('same_rules', C('Use shared rules.', 'Everyone uses the same scope and card rules.'), C('Same rules for everyone.', 'No private standard.'), { practicality: 0.35, knowledge: 0.2, gates: { ...baseGate, G5_reality_contact: 0.2, G4_contradiction_handling: 0.2 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.35, knowledge: 0.2 } }),
      A('after_reasons', C('Use it after reasons are on the table.', 'The score helps after the case is shown.'), C('Use after reasons.', 'Reasons first, score second.'), { knowledge: 0.25, wisdom: 0.3, gates: { ...baseGate, G5_reality_contact: 0.25, G2_non_strawman: 0.2 }, quality: { precision_signal: 1 }, coverage: { knowledge: 0.3, wisdom: 0.3 } }),
      A('score_as_badge', C('Use it as the proof badge.', 'If the plot is higher, that should settle the room.'), C('Higher score wins.', 'Use the score as proof.'), { practicality: 0.15, gates: { ...baseGate, G6_non_self_sealing: -0.8, G5_reality_contact: -0.35, G2_non_strawman: -0.25 }, quality: { social_performance_pressure: 2, score_badge_pressure: 2, low_signal: 1 } }, { public_pressure: 0.25 })
    ]
  },
  {
    id: 'precision_close_01',
    stage: 'late',
    routes: { micro_action: 0.4, evidence_claim: 0.6, value_tradeoff: 0.6, public_pressure: 0.6, comparison: 0.5, person_pattern: 0.45, policy_system: 0.5, strategy: 0.5, low_stakes: 0.5 },
    normal: { kicker: 'Close', title: 'The exact result may look less impressive than the result you wanted. What matters?', help: 'This keeps the output attached to the scope.' },
    simple: { kicker: 'Finish', title: 'The honest score may look less cool. What matters?', help: 'Pick what you accept.' },
    answers: [
      A('exact_over_impressive', C('Less impressive, more exact.', 'A narrower or lower plot is fine if it fits the scope.'), C('Exact beats cool.', 'Lower is okay if true.'), { knowledge: 0.2, wisdom: 0.25, gates: { ...baseGate, G3_self_correction: 0.45, G6_non_self_sealing: 0.4 }, quality: { precision_signal: 2 }, coverage: { knowledge: 0.25, wisdom: 0.3 } }),
      A('context_before_close', C('Add missing context first.', 'The score can rise or fall after burden, cost, evidence, and limits are counted.'), C('Add context first.', 'Then score can move up or down.'), { wisdom: 0.35, knowledge: 0.2, empathy: 0.1, practicality: 0.1, gates: { ...baseGate, G1_counter_consideration: 0.25, G5_reality_contact: 0.2 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.4, knowledge: 0.25, empathy: 0.1, practicality: 0.1 } }),
      A('rough_map_only', C('Keep it as a rough map.', 'The direction is useful, but the case still needs reasons.'), C('Call it rough.', 'Useful, but needs reasons.'), { practicality: 0.15, wisdom: 0.2, gates: { ...baseGate, G3_self_correction: 0.2 }, quality: { provisional_sample: 1 }, coverage: { practicality: 0.2, wisdom: 0.25 } }),
      A('rerun_until_better', C('Rerun until it lands better.', 'The result needs to carry the point socially.'), C('Try until higher.', 'The score needs to look better.'), { gates: { ...baseGate, G6_non_self_sealing: -0.6, G3_self_correction: -0.25 }, quality: { answer_shopping_signal: 2, social_performance_pressure: 1, low_signal: 1 } }, { public_pressure: 0.2 })
    ]
  }
];
