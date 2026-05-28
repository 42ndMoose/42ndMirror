export const AXIS_CONVENTION = {
  x: {
    positive: 'empathy',
    negative: 'practicality',
    note: '+x follows the uploaded visualizer: empathy is positive, practicality is negative.'
  },
  y: {
    positive: 'positive epistemic stability',
    negative: 'negative epistemic stability',
    note: '+y means coherent, reality-contacting, self-corrective, and non-sealed.'
  },
  z: {
    positive: 'wisdom',
    negative: 'knowledge',
    note: '+z follows the uploaded visualizer: wisdom is positive, knowledge is negative.'
  },
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

export const MODES = {
  fast: {
    id: 'fast',
    name: 'Fast mode',
    shortName: 'Fast',
    description: 'A short card run for a lunch-break read.',
    readingLevel: 'normal',
    maxBaseCards: 9,
    maxFollowUps: 2
  },
  adhd: {
    id: 'adhd',
    name: 'ADHD mode',
    shortName: 'ADHD',
    description: 'Same scoring as Fast mode. Shorter words across the whole app.',
    readingLevel: 'simple',
    maxBaseCards: 9,
    maxFollowUps: 2
  },
  serious: {
    id: 'serious',
    name: 'Serious mode',
    shortName: 'Serious',
    description: 'More cards, stronger pressure checks, better signal quality.',
    readingLevel: 'normal',
    maxBaseCards: 14,
    maxFollowUps: 4
  }
};

export const UI_COPY = {
  normal: {
    title: '42ndMirror',
    subtitle: 'A short card test for plotting the shape of a belief, decision, argument, or comparison on the Epistemic Octahedron.',
    howItWorks: 'Pick a scope, give it a label, answer scenario cards, then get a strict xyz surface point.',
    modeTitle: 'Mode',
    scopeTitle: 'Scope',
    useCaseTitle: 'Setting',
    labelTitle: 'Scope label',
    labelHelp: 'Give the scope a short label. It will follow the run and appear in the result log.',
    labelPlaceholder: 'Example: whether this decision holds up under pressure',
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
    projectedHelp: 'The visualizer receives the xyz payload from this run.',
    coordinate: 'Surface coordinate',
    check: 'Check',
    gates: 'Gate pressure',
    coverage: 'Dimension coverage',
    readout: 'Readout',
    json: 'JSON output',
    history: 'Recent entries',
    historyEmpty: 'Completed plots will appear here.',
    remove: 'Remove',
    confirmTitle: 'Remove entry?',
    confirmText: 'This removes the saved entry from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Remove entry',
    card: 'Card',
    baseProgress: 'Base progress',
    quotedScope: 'Scope',
    noLabel: 'Untitled scope'
  },
  simple: {
    title: '42ndMirror',
    subtitle: 'A quick card test that puts an idea, choice, argument, or comparison on the octahedron.',
    howItWorks: 'Name the thing. Pick answers. Get x, y, z.',
    modeTitle: 'Mode',
    scopeTitle: 'Thing to score',
    useCaseTitle: 'Where this is used',
    labelTitle: 'Name it',
    labelHelp: 'Write a short name. This name follows every card.',
    labelPlaceholder: 'Example: this choice under pressure',
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
    projectedHelp: 'This graph gets the x, y, z point.',
    coordinate: 'x, y, z',
    check: 'Math check',
    gates: 'Pressure checks',
    coverage: 'What got counted',
    readout: 'Plain result',
    json: 'JSON output',
    history: 'Saved runs',
    historyEmpty: 'Finished runs show up here.',
    remove: 'Delete',
    confirmTitle: 'Delete this?',
    confirmText: 'This deletes the saved run from this browser.',
    cancel: 'Cancel',
    confirmRemove: 'Delete',
    card: 'Card',
    baseProgress: 'Progress',
    quotedScope: 'Thing',
    noLabel: 'Unnamed thing'
  }
};

export const SCOPES = [
  {
    id: 'claim',
    name: 'Claim or belief',
    simpleName: 'Something I think',
    description: 'A view, take, or conclusion.',
    simpleDescription: 'A thought or opinion.'
  },
  {
    id: 'decision',
    name: 'Decision',
    simpleName: 'A choice',
    description: 'Something someone should do, avoid, allow, or reject.',
    simpleDescription: 'A yes/no or do/don’t choice.'
  },
  {
    id: 'reaction',
    name: 'Reaction',
    simpleName: 'A reaction',
    description: 'A response, impulse, argument, or move after pressure.',
    simpleDescription: 'How someone reacts.'
  },
  {
    id: 'argument',
    name: 'Argument',
    simpleName: 'An argument',
    description: 'A case someone is making.',
    simpleDescription: 'A case someone makes.'
  },
  {
    id: 'person_pattern',
    name: 'Person or character pattern',
    simpleName: 'Person/character',
    description: 'A visible pattern in a real or fictional subject.',
    simpleDescription: 'How a person or character acts.'
  },
  {
    id: 'comparison',
    name: 'Comparison',
    simpleName: 'Two sides',
    description: 'Two people, views, strategies, or outcomes.',
    simpleDescription: 'Two things being compared.'
  }
];

export const USE_CASES = [
  {
    id: 'private',
    name: 'Private check',
    simpleName: 'Just me',
    description: 'For self-reflection or a quiet read.',
    simpleDescription: 'I am checking it for myself.'
  },
  {
    id: 'group',
    name: 'Group comparison',
    simpleName: 'With friends',
    description: 'For comparing runs with other people.',
    simpleDescription: 'Other people may compare scores.'
  },
  {
    id: 'debate',
    name: 'Debate pressure',
    simpleName: 'To prove a point',
    description: 'For a claim that may be used in an argument.',
    simpleDescription: 'This may be used to win an argument.'
  },
  {
    id: 'fiction',
    name: 'Fiction or strategy read',
    simpleName: 'Story/game read',
    description: 'For characters, tactics, or strategy comparisons.',
    simpleDescription: 'For a character, game, or strategy.'
  }
];

const C = (main, sub = '') => ({ main, sub });
const fx = (effects = {}) => effects;

export const BASE_CARDS = [
  {
    id: 'sample_shape_01',
    normal: {
      kicker: 'Footing',
      title: 'What kind of sample are you bringing?',
      help: 'Pick the closest shape. This sets how much weight the run should carry.'
    },
    simple: {
      kicker: 'Start',
      title: 'What do you have?',
      help: 'Pick the closest one.'
    },
    answers: [
      {
        id: 'one_moment',
        normal: C('One moment that matters.', 'A quote, choice, scene, or example that carries the issue.'),
        simple: C('One moment.', 'One quote, choice, or example.'),
        effects: fx({ knowledge: 0.35, gates: { G5_reality_contact: 0.35 }, quality: { narrow_sample: 1, provisional_sample: 1 }, coverage: { knowledge: 0.75 } }),
        followUps: ['sample_weight_followup']
      },
      {
        id: 'repeated_shape',
        normal: C('A repeated shape.', 'Different moments keep pointing to the same pattern.'),
        simple: C('A pattern.', 'It happens more than once.'),
        effects: fx({ wisdom: 0.35, knowledge: 0.3, practicality: 0.1, gates: { G5_reality_contact: 0.65, G4_contradiction_handling: 0.35 }, quality: { high_signal: 1 }, coverage: { wisdom: 0.75, knowledge: 0.75, practicality: 0.25 } })
      },
      {
        id: 'live_decision',
        normal: C('A live choice with tradeoffs.', 'The point is what happens if the idea becomes action.'),
        simple: C('A real choice.', 'It matters what happens next.'),
        effects: fx({ practicality: 0.4, empathy: 0.25, wisdom: 0.2, gates: { G5_reality_contact: 0.55 }, quality: { high_signal: 1 }, coverage: { practicality: 0.75, empathy: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'exploratory_read',
        normal: C('An exploratory read.', 'You are mapping the shape before claiming too much.'),
        simple: C('A first look.', 'You are just checking the shape.'),
        effects: fx({ wisdom: 0.25, gates: { G3_self_correction: 0.35, G6_non_self_sealing: 0.2 }, quality: { provisional_sample: 1, precision_signal: 1 }, coverage: { wisdom: 0.5 } })
      }
    ]
  },
  {
    id: 'anchor_under_time_01',
    normal: {
      kicker: 'First anchor',
      title: 'You have little time before people react. What anchor do you trust first?',
      help: 'Each option can be smart. Pick the one that actually carries the scope.'
    },
    simple: {
      kicker: 'Quick read',
      title: 'People are reacting fast. What do you check first?',
      help: 'Pick what matters most here.'
    },
    answers: [
      {
        id: 'who_pays_if_wrong',
        normal: C('Who pays if the read is wrong.', 'Especially the people with less room to absorb the cost.'),
        simple: C('Who gets hurt if wrong.', 'Check who pays the cost.'),
        effects: fx({ empathy: 0.85, wisdom: 0.25, gates: { G5_reality_contact: 0.25 }, coverage: { empathy: 1, wisdom: 0.5 } })
      },
      {
        id: 'breaks_when_gamed',
        normal: C('What breaks when people game it.', 'Incentives, loopholes, enforcement, and capacity.'),
        simple: C('What breaks if people abuse it.', 'Check loopholes and limits.'),
        effects: fx({ practicality: 0.8, wisdom: 0.3, knowledge: 0.1, gates: { G5_reality_contact: 0.3 }, coverage: { practicality: 1, wisdom: 0.5, knowledge: 0.25 } })
      },
      {
        id: 'what_is_known_cleanly',
        normal: C('What is known cleanly.', 'Definitions, sequence, evidence, and what is still missing.'),
        simple: C('What we actually know.', 'Check facts and missing facts.'),
        effects: fx({ knowledge: 0.85, practicality: 0.15, gates: { G5_reality_contact: 0.45 }, coverage: { knowledge: 1, practicality: 0.35 } })
      },
      {
        id: 'hidden_assumption',
        normal: C('What the claim quietly assumes.', 'The part nobody says out loud may control the whole result.'),
        simple: C('The hidden assumption.', 'Check the quiet part.'),
        effects: fx({ wisdom: 0.85, knowledge: 0.25, gates: { G4_contradiction_handling: 0.35 }, coverage: { wisdom: 1, knowledge: 0.5 } })
      }
    ]
  },
  {
    id: 'good_value_clash_01',
    normal: {
      kicker: 'Tradeoff',
      title: 'Two reasonable goods pull against each other. Which loss worries you more?',
      help: 'No answer is treated as automatically noble. The scoring looks at the shape of the burden.'
    },
    simple: {
      kicker: 'Hard tradeoff',
      title: 'Two good things clash. Which loss worries you more?',
      help: 'Pick the real worry.'
    },
    answers: [
      {
        id: 'human_cost_unseen',
        normal: C('The quiet human cost gets missed.', 'The system may look clean while people carry hidden damage.'),
        simple: C('People carry hidden damage.', 'The system looks fine but people pay.'),
        effects: fx({ empathy: 0.9, wisdom: 0.25, coverage: { empathy: 1, wisdom: 0.5 } })
      },
      {
        id: 'structure_cost_unseen',
        normal: C('The working structure gets weakened.', 'The kind impulse may make the next problem harder to solve.'),
        simple: C('The system gets weaker.', 'A kind move may break what people need.'),
        effects: fx({ practicality: 0.9, wisdom: 0.2, coverage: { practicality: 1, wisdom: 0.35 } })
      },
      {
        id: 'standard_moves',
        normal: C('The standard quietly moves.', 'People change terms, proof, or rules after pressure arrives.'),
        simple: C('The rules quietly move.', 'People change facts or rules mid-game.'),
        effects: fx({ knowledge: 0.75, practicality: 0.25, gates: { G5_reality_contact: 0.25 }, coverage: { knowledge: 1, practicality: 0.5 } })
      },
      {
        id: 'scale_gets_wrong',
        normal: C('The scale gets wrong.', 'A true part becomes too large or too small in the final read.'),
        simple: C('The size gets wrong.', 'One true thing becomes too big or too small.'),
        effects: fx({ wisdom: 0.9, knowledge: 0.15, gates: { G4_contradiction_handling: 0.25 }, coverage: { wisdom: 1, knowledge: 0.35 } })
      }
    ]
  },
  {
    id: 'challenge_move_01',
    normal: {
      kicker: 'Challenge',
      title: 'A serious challenge lands against your read. What is the clean first move?',
      help: 'The follow-up handles cases where a filter may be disciplined or merely defensive.'
    },
    simple: {
      kicker: 'Pushback',
      title: 'A strong challenge hits. What first?',
      help: 'Pick the clean move.'
    },
    answers: [
      {
        id: 'rebuild_challenge',
        normal: C('Rebuild the challenge in its strongest form.', 'Then answer that version.'),
        simple: C('Make their point strong first.', 'Then answer it.'),
        effects: fx({ wisdom: 0.45, empathy: 0.15, gates: { G1_counter_consideration: 0.9, G2_non_strawman: 0.9 }, coverage: { wisdom: 0.75, empathy: 0.35 } })
      },
      {
        id: 'set_disproof_rule',
        normal: C('Set the disproof rule.', 'Name what would weaken, narrow, or overturn the read.'),
        simple: C('Say what would change it.', 'Name what would move the answer.'),
        effects: fx({ knowledge: 0.4, wisdom: 0.2, gates: { G3_self_correction: 0.75, G5_reality_contact: 0.55, G6_non_self_sealing: 0.45 }, coverage: { knowledge: 0.75, wisdom: 0.5 } })
      },
      {
        id: 'separate_core_edge',
        normal: C('Separate the core from the edge.', 'A hit against one part may not hit the whole structure.'),
        simple: C('Separate big part from small part.', 'Maybe only one piece changes.'),
        effects: fx({ wisdom: 0.55, practicality: 0.2, gates: { G4_contradiction_handling: 0.9, G3_self_correction: 0.35 }, coverage: { wisdom: 0.75, practicality: 0.5 } })
      },
      {
        id: 'filter_before_answering',
        normal: C('Filter before answering.', 'Some challenges are noise, traps, or category mistakes.'),
        simple: C('Check if it is worth answering.', 'Some pushback is noise.'),
        effects: fx({ practicality: 0.45, wisdom: 0.2, gates: { G4_contradiction_handling: 0.15 }, quality: { needs_disambiguation: 1 }, coverage: { practicality: 0.75, wisdom: 0.35 } }),
        followUps: ['filter_reason_followup']
      }
    ]
  },
  {
    id: 'counter_evidence_01',
    normal: {
      kicker: 'Update pressure',
      title: 'Clean evidence appears against the version you preferred. What moves?',
      help: 'A good answer can update, narrow, audit, or hold, depending on what the evidence actually touches.'
    },
    simple: {
      kicker: 'New facts',
      title: 'Good facts hurt your favorite answer. What moves?',
      help: 'Pick what really changes.'
    },
    answers: [
      {
        id: 'move_conclusion',
        normal: C('The conclusion moves.', 'The evidence touches the main point, so the read should shift.'),
        simple: C('The answer changes.', 'The facts hit the main point.'),
        effects: fx({ knowledge: 0.45, wisdom: 0.25, gates: { G3_self_correction: 0.95, G5_reality_contact: 0.65, G6_non_self_sealing: 0.5 }, coverage: { knowledge: 0.75, wisdom: 0.5 } })
      },
      {
        id: 'move_boundary',
        normal: C('The boundary moves.', 'The read survives, but it needs a narrower claim.'),
        simple: C('The answer gets smaller.', 'The main idea stays, but narrower.'),
        effects: fx({ wisdom: 0.6, knowledge: 0.25, gates: { G4_contradiction_handling: 0.85, G3_self_correction: 0.5 }, coverage: { wisdom: 0.75, knowledge: 0.5 } })
      },
      {
        id: 'audit_relevance',
        normal: C('The relevance gets audited.', 'The fact may be true while not proving what people say it proves.'),
        simple: C('Check what the fact proves.', 'True fact, maybe wrong use.'),
        effects: fx({ knowledge: 0.65, practicality: 0.25, gates: { G5_reality_contact: 0.75, G4_contradiction_handling: 0.35 }, coverage: { knowledge: 0.75, practicality: 0.5 } })
      },
      {
        id: 'hold_pattern_temporarily',
        normal: C('The larger pattern stays for now.', 'One contrary point may be real without carrying enough weight.'),
        simple: C('Hold the pattern for now.', 'One point may not beat the whole pattern.'),
        effects: fx({ wisdom: 0.35, practicality: 0.15, gates: { G6_non_self_sealing: -0.1 }, quality: { needs_disambiguation: 1 }, coverage: { wisdom: 0.5, practicality: 0.35 } }),
        followUps: ['pattern_weight_followup']
      }
    ]
  },
  {
    id: 'opponent_model_01',
    normal: {
      kicker: 'Opposite read',
      title: 'At its best, what does the opposing read have?',
      help: 'This checks whether the result is comparing real structures or just preferred stories.'
    },
    simple: {
      kicker: 'Other side',
      title: 'What is the other side good at?',
      help: 'Pick its best part.'
    },
    answers: [
      {
        id: 'real_cost_bad_fix',
        normal: C('It sees a real cost but offers a weak fix.', 'The concern is live even if the answer fails.'),
        simple: C('Real worry, weak fix.', 'They see something real.'),
        effects: fx({ empathy: 0.35, practicality: 0.35, wisdom: 0.25, gates: { G2_non_strawman: 0.75, G4_contradiction_handling: 0.45 }, coverage: { empathy: 0.5, practicality: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'good_detail_bad_scale',
        normal: C('It has a good detail but poor scale.', 'A true fact may be carrying too much weight.'),
        simple: C('Good detail, wrong size.', 'A true thing may be too big.'),
        effects: fx({ knowledge: 0.4, wisdom: 0.35, gates: { G2_non_strawman: 0.55, G4_contradiction_handling: 0.5 }, coverage: { knowledge: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'good_pattern_thin_proof',
        normal: C('It sees a pattern but needs cleaner proof.', 'The shape may be plausible before it is established.'),
        simple: C('Good pattern, thin proof.', 'Maybe right, needs facts.'),
        effects: fx({ wisdom: 0.45, knowledge: 0.3, gates: { G2_non_strawman: 0.55, G5_reality_contact: 0.25 }, coverage: { wisdom: 0.5, knowledge: 0.5 } })
      },
      {
        id: 'little_best_case',
        normal: C('It has little even at its best.', 'The opposing read still dodges the central burden.'),
        simple: C('Still weak at its best.', 'Even the best version misses the main burden.'),
        effects: fx({ practicality: 0.25, knowledge: 0.25, gates: { G2_non_strawman: -0.35, G6_non_self_sealing: -0.25 }, quality: { self_protective_signal: 1, needs_disambiguation: 1 }, coverage: { practicality: 0.5, knowledge: 0.5 } }),
        followUps: ['opponent_little_followup']
      }
    ]
  },
  {
    id: 'public_pressure_01',
    useCases: ['group', 'debate'],
    normal: {
      kicker: 'Public pressure',
      title: 'This result may be compared in front of other people. What role should it play?',
      help: 'Shared scores create pressure. This card measures how the result will be used.'
    },
    simple: {
      kicker: 'With people watching',
      title: 'People may compare scores. What should the score do?',
      help: 'Pick the honest use.'
    },
    answers: [
      {
        id: 'conversation_map',
        normal: C('Map the disagreement.', 'Use the plot to see where the disagreement sits.'),
        simple: C('Map the disagreement.', 'Use it to see the shape.'),
        effects: fx({ wisdom: 0.45, gates: { G1_counter_consideration: 0.4, G6_non_self_sealing: 0.35 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.5 } })
      },
      {
        id: 'shared_rules',
        normal: C('Create a shared rule of discussion.', 'Use the same card rules so nobody gets a private standard.'),
        simple: C('Use same rules for everyone.', 'No private rules.'),
        effects: fx({ practicality: 0.45, knowledge: 0.25, gates: { G5_reality_contact: 0.3, G4_contradiction_handling: 0.25 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'tiebreaker',
        normal: C('Use it as a tiebreaker after the actual case is heard.', 'The score helps only after reasons are on the table.'),
        simple: C('Use it after hearing reasons.', 'The score helps after the case is shown.'),
        effects: fx({ knowledge: 0.35, wisdom: 0.35, gates: { G5_reality_contact: 0.35, G2_non_strawman: 0.25 }, quality: { high_signal: 1 }, coverage: { knowledge: 0.5, wisdom: 0.5 } })
      },
      {
        id: 'proof_badge',
        normal: C('Use the score as the proof badge.', 'If the plot is higher, that should settle the room.'),
        simple: C('Use score as proof.', 'Higher score wins.'),
        effects: fx({ practicality: 0.2, gates: { G6_non_self_sealing: -0.8, G5_reality_contact: -0.45, G2_non_strawman: -0.3 }, quality: { social_performance_pressure: 2, score_badge_pressure: 2, low_signal: 1 } }),
        followUps: ['score_badge_followup']
      }
    ]
  },
  {
    id: 'fascination_split_01',
    scopeIds: ['person_pattern', 'comparison'],
    normal: {
      kicker: 'Appeal split',
      title: 'The subject may be impressive, stylish, scary, funny, or useful. What are you scoring?',
      help: 'This keeps charisma, strategy, and reasoning structure from collapsing into one read.'
    },
    simple: {
      kicker: 'Cool vs strong',
      title: 'What are you scoring?',
      help: 'A thing can be cool and still score differently.'
    },
    answers: [
      {
        id: 'method_under_pressure',
        normal: C('Method under pressure.', 'How the subject handles limits, losses, tradeoffs, and correction.'),
        simple: C('How they think under pressure.', 'Losses, limits, and correction.'),
        effects: fx({ wisdom: 0.35, practicality: 0.25, knowledge: 0.2, gates: { G4_contradiction_handling: 0.45, G5_reality_contact: 0.45 }, quality: { high_signal: 1 }, coverage: { wisdom: 0.5, practicality: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'outcome_record',
        normal: C('Outcome record.', 'What actually happens when the method gets applied.'),
        simple: C('What actually happens.', 'Look at results.'),
        effects: fx({ practicality: 0.45, knowledge: 0.3, gates: { G5_reality_contact: 0.55 }, coverage: { practicality: 0.5, knowledge: 0.5 } })
      },
      {
        id: 'human_radius',
        normal: C('Human radius.', 'Who gets treated as real when the subject has power or pressure.'),
        simple: C('How they treat people.', 'Who counts when things get hard.'),
        effects: fx({ empathy: 0.6, wisdom: 0.2, gates: { G5_reality_contact: 0.2 }, coverage: { empathy: 0.75, wisdom: 0.35 } })
      },
      {
        id: 'appeal_exploration',
        normal: C('Why the subject is compelling.', 'You are mainly exploring appeal, not scoring method.'),
        simple: C('Why they are interesting.', 'Mostly about appeal.'),
        effects: fx({ wisdom: 0.15, quality: { taste_sample: 2, provisional_sample: 1, low_signal: 1 }, coverage: { wisdom: 0.25 } })
      }
    ]
  },
  {
    id: 'precision_vs_status_01',
    normal: {
      kicker: 'Precision pressure',
      title: 'The honest result may look less impressive than the result you wanted. What matters most?',
      help: 'This card keeps polished answer patterns from automatically becoming high maturity.'
    },
    simple: {
      kicker: 'Honest score',
      title: 'The honest score may look less cool. What matters?',
      help: 'Pick what you would actually accept.'
    },
    answers: [
      {
        id: 'less_impressive_more_exact',
        normal: C('Less impressive, more exact.', 'A narrower or lower plot is fine if it fits the scope.'),
        simple: C('Exact is better than cool.', 'Lower is okay if true.'),
        effects: fx({ knowledge: 0.25, wisdom: 0.25, gates: { G3_self_correction: 0.65, G6_non_self_sealing: 0.55 }, quality: { precision_signal: 2 }, coverage: { knowledge: 0.35, wisdom: 0.35 } })
      },
      {
        id: 'show_full_context',
        normal: C('Show the full context so the score can rise or fall.', 'Add burden, cost, evidence, and limits before judging.'),
        simple: C('Add context first.', 'Then the score can move up or down.'),
        effects: fx({ wisdom: 0.4, knowledge: 0.25, gates: { G1_counter_consideration: 0.45, G5_reality_contact: 0.35 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'keep_direction_despite_score',
        normal: C('Keep the direction but treat the score as rough.', 'The plot helps, but the case still has to be argued.'),
        simple: C('Keep the idea, but call score rough.', 'Still need reasons.'),
        effects: fx({ practicality: 0.2, wisdom: 0.2, gates: { G3_self_correction: 0.25 }, quality: { provisional_sample: 1 }, coverage: { practicality: 0.35, wisdom: 0.35 } })
      },
      {
        id: 'repair_until_high',
        normal: C('Reframe until the important point shows higher.', 'The current card path may not capture what you already know.'),
        simple: C('Try again until it scores high.', 'The score should show my point.'),
        effects: fx({ gates: { G6_non_self_sealing: -0.7, G3_self_correction: -0.35 }, quality: { answer_shopping_signal: 2, social_performance_pressure: 1, low_signal: 1 } }),
        followUps: ['answer_shopping_followup']
      }
    ]
  },
  {
    id: 'missing_dimension_01',
    normal: {
      kicker: 'Missing burden',
      title: 'What would most improve this read without changing the whole target?',
      help: 'This asks what extra accounting would sharpen the scope.'
    },
    simple: {
      kicker: 'Missing part',
      title: 'What would make this read better?',
      help: 'Pick the missing piece.'
    },
    answers: [
      {
        id: 'count_people_cost',
        normal: C('Sharper accounting of who absorbs the cost.', 'Especially costs that are quiet, delayed, or easy to dismiss.'),
        simple: C('Count people better.', 'Quiet costs matter.'),
        effects: fx({ empathy: 0.55, wisdom: 0.2, gates: { G4_contradiction_handling: 0.25 }, coverage: { empathy: 0.75, wisdom: 0.35 } })
      },
      {
        id: 'count_mechanism',
        normal: C('Sharper accounting of mechanism.', 'The chain from idea to result needs cleaner steps.'),
        simple: C('Count the mechanism better.', 'Show how it works.'),
        effects: fx({ practicality: 0.55, knowledge: 0.25, gates: { G5_reality_contact: 0.3 }, coverage: { practicality: 0.75, knowledge: 0.35 } })
      },
      {
        id: 'count_proof',
        normal: C('Sharper accounting of proof.', 'Better facts, definitions, sequence, or counterexamples.'),
        simple: C('Count proof better.', 'Facts and examples.'),
        effects: fx({ knowledge: 0.55, wisdom: 0.15, gates: { G5_reality_contact: 0.35 }, coverage: { knowledge: 0.75, wisdom: 0.25 } })
      },
      {
        id: 'count_timing_scale',
        normal: C('Sharper accounting of timing and scale.', 'When, where, how often, and under what conditions.'),
        simple: C('Count timing and size.', 'When, where, how often.'),
        effects: fx({ wisdom: 0.55, practicality: 0.2, gates: { G4_contradiction_handling: 0.3 }, coverage: { wisdom: 0.75, practicality: 0.35 } })
      }
    ]
  },
  {
    id: 'seriousness_01',
    normal: {
      kicker: 'Signal weight',
      title: 'How much should this run count?',
      help: 'Use this to mark the run as strong, rough, casual, or mixed.'
    },
    simple: {
      kicker: 'How real?',
      title: 'How much should this count?',
      help: 'Pick how serious this run was.'
    },
    answers: [
      {
        id: 'serious_current_read',
        normal: C('Serious current read.', 'You answered as cleanly as you could for this scope.'),
        simple: C('Real answer.', 'I answered honestly.'),
        effects: fx({ gates: { G6_non_self_sealing: 0.25 }, quality: { high_signal: 2 } })
      },
      {
        id: 'rough_current_read',
        normal: C('Rough current read.', 'Useful, but the result should stay flexible.'),
        simple: C('Rough answer.', 'Useful but not final.'),
        effects: fx({ gates: { G3_self_correction: 0.2 }, quality: { provisional_sample: 1, uncertainty: 1 } })
      },
      {
        id: 'checking_the_tool',
        normal: C('Tool check.', 'You were mainly seeing how the app behaves.'),
        simple: C('Testing the app.', 'Not a real score.'),
        effects: fx({ quality: { sandbox_sample: 2, low_signal: 2 } })
      },
      {
        id: 'mixed_signal',
        normal: C('Mixed signal.', 'Some answers were serious, some were speed, taste, or curiosity.'),
        simple: C('Mixed.', 'Some real, some quick or casual.'),
        effects: fx({ gates: { G3_self_correction: 0.1 }, quality: { noisy_sample: 1, provisional_sample: 1, low_signal: 1 } })
      }
    ]
  },
  {
    id: 'serious_coherence_01',
    seriousOnly: true,
    normal: {
      kicker: 'Coherence audit',
      title: 'Where is this read most likely to break if pushed harder?',
      help: 'Serious mode looks for the weak joint before trusting the coordinate.'
    },
    simple: {
      kicker: 'Break point',
      title: 'Where might this break?',
      help: 'Find the weak spot.'
    },
    answers: [
      {
        id: 'burden_on_people',
        normal: C('It may undercount people affected at the edges.', 'Especially people outside the main story.'),
        simple: C('It may miss edge people.', 'People outside the main story.'),
        effects: fx({ empathy: 0.45, wisdom: 0.2, gates: { G1_counter_consideration: 0.35 }, coverage: { empathy: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'burden_on_incentives',
        normal: C('It may undercount incentives and second moves.', 'People adapt once the rule exists.'),
        simple: C('It may miss incentives.', 'People adapt.'),
        effects: fx({ practicality: 0.45, wisdom: 0.2, gates: { G5_reality_contact: 0.25 }, coverage: { practicality: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'burden_on_definitions',
        normal: C('It may undercount definitions and evidence quality.', 'A key term or proof source may be doing too much work.'),
        simple: C('It may miss definitions.', 'A key word or proof may be weak.'),
        effects: fx({ knowledge: 0.45, wisdom: 0.15, gates: { G5_reality_contact: 0.3 }, coverage: { knowledge: 0.5, wisdom: 0.25 } })
      },
      {
        id: 'burden_on_proportion',
        normal: C('It may undercount proportion.', 'One true part may be controlling too much of the conclusion.'),
        simple: C('It may miss proportion.', 'One true thing may be too big.'),
        effects: fx({ wisdom: 0.45, knowledge: 0.15, gates: { G4_contradiction_handling: 0.35 }, coverage: { wisdom: 0.5, knowledge: 0.25 } })
      }
    ]
  },
  {
    id: 'serious_repair_01',
    seriousOnly: true,
    normal: {
      kicker: 'Repair path',
      title: 'If the run is wrong, what is the clean repair path?',
      help: 'This checks whether the position can adjust without collapsing or sealing.'
    },
    simple: {
      kicker: 'Fix path',
      title: 'If wrong, how does it get fixed?',
      help: 'Pick the repair.'
    },
    answers: [
      {
        id: 'new_evidence_changes_it',
        normal: C('New evidence changes the boundary or conclusion.', 'The repair is factual and visible.'),
        simple: C('New facts change it.', 'Facts move the answer.'),
        effects: fx({ knowledge: 0.35, gates: { G3_self_correction: 0.65, G5_reality_contact: 0.65 }, quality: { precision_signal: 1 }, coverage: { knowledge: 0.5 } })
      },
      {
        id: 'better_opponent_changes_it',
        normal: C('A stronger opposing model changes it.', 'The repair comes from a better version of the other side.'),
        simple: C('A better other side changes it.', 'Their strongest case matters.'),
        effects: fx({ wisdom: 0.35, empathy: 0.15, gates: { G1_counter_consideration: 0.65, G2_non_strawman: 0.65 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.5, empathy: 0.25 } })
      },
      {
        id: 'working_failure_changes_it',
        normal: C('A real-world failure changes it.', 'The repair comes from outcomes, incentives, or limits.'),
        simple: C('Bad results change it.', 'The world pushes back.'),
        effects: fx({ practicality: 0.35, knowledge: 0.2, gates: { G5_reality_contact: 0.65, G4_contradiction_handling: 0.35 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'little_would_change',
        normal: C('Very little would change it.', 'The read feels settled unless the whole frame changes.'),
        simple: C('Almost nothing changes it.', 'It feels settled.'),
        effects: fx({ gates: { G3_self_correction: -0.6, G6_non_self_sealing: -0.7, G5_reality_contact: -0.3 }, quality: { sealed_signal: 2, social_performance_pressure: 1 } })
      }
    ]
  }
];

export const FOLLOW_UP_CARDS = [
  {
    id: 'sample_weight_followup',
    normal: {
      kicker: 'Sample weight',
      title: 'That one moment matters because...',
      help: 'A single moment can be strong or weak depending on what it carries.'
    },
    simple: {
      kicker: 'One moment',
      title: 'Why does that one moment matter?',
      help: 'Pick why it counts.'
    },
    answers: [
      {
        id: 'reveals_rule',
        normal: C('It reveals the rule underneath.', 'The moment exposes how the person or claim works.'),
        simple: C('It shows the rule.', 'The moment shows how it works.'),
        effects: fx({ wisdom: 0.35, knowledge: 0.25, gates: { G5_reality_contact: 0.35 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'has_direct_stakes',
        normal: C('It has direct stakes.', 'The moment matters because the cost is not abstract.'),
        simple: C('It has real cost.', 'It matters because people pay.'),
        effects: fx({ empathy: 0.35, practicality: 0.2, gates: { G5_reality_contact: 0.35 }, coverage: { empathy: 0.5, practicality: 0.35 } })
      },
      {
        id: 'mainly_stands_out',
        normal: C('It mainly stands out.', 'Useful as a clue, weak as proof.'),
        simple: C('It just stands out.', 'Good clue, weak proof.'),
        effects: fx({ quality: { provisional_sample: 1, incomplete_signal: 1 }, gates: { G3_self_correction: 0.15 } })
      },
      {
        id: 'it_is_the_vibe',
        normal: C('It captures the vibe.', 'The moment is more expressive than evidential.'),
        simple: C('It captures the vibe.', 'More feeling than proof.'),
        effects: fx({ quality: { taste_sample: 1, low_signal: 1, provisional_sample: 1 } })
      }
    ]
  },
  {
    id: 'filter_reason_followup',
    normal: {
      kicker: 'Filter reason',
      title: 'Why filter the challenge before answering?',
      help: 'This separates disciplined filtering from convenient dismissal.'
    },
    simple: {
      kicker: 'Why filter?',
      title: 'Why check the challenge first?',
      help: 'Pick the real reason.'
    },
    answers: [
      {
        id: 'category_mismatch',
        normal: C('It may not touch the actual claim.', 'The objection could be true but aimed at the wrong target.'),
        simple: C('It may hit the wrong target.', 'True but not relevant.'),
        effects: fx({ wisdom: 0.35, knowledge: 0.2, gates: { G4_contradiction_handling: 0.45, G5_reality_contact: 0.25 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.5, knowledge: 0.35 } })
      },
      {
        id: 'limited_attention',
        normal: C('Attention is limited.', 'A clean process needs triage.'),
        simple: C('Time is limited.', 'Pick what matters.'),
        effects: fx({ practicality: 0.35, wisdom: 0.2, gates: { G4_contradiction_handling: 0.25 }, coverage: { practicality: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'source_history',
        normal: C('The source has a relevant track record.', 'Past reliability affects how fast the challenge should move the read.'),
        simple: C('The source has a record.', 'Past accuracy matters.'),
        effects: fx({ knowledge: 0.35, practicality: 0.15, gates: { G5_reality_contact: 0.35 }, coverage: { knowledge: 0.5, practicality: 0.25 } })
      },
      {
        id: 'opposing_team',
        normal: C('It comes from the opposing camp.', 'That is enough reason to hold it away.'),
        simple: C('It comes from the other team.', 'That is enough to doubt it.'),
        effects: fx({ gates: { G2_non_strawman: -0.55, G6_non_self_sealing: -0.65, G5_reality_contact: -0.25 }, quality: { self_protective_signal: 2, sealed_signal: 1 } })
      }
    ]
  },
  {
    id: 'pattern_weight_followup',
    normal: {
      kicker: 'Pattern weight',
      title: 'Why should the larger pattern survive that contrary point?',
      help: 'A pattern can be strong, or it can become a shield.'
    },
    simple: {
      kicker: 'Pattern check',
      title: 'Why keep the pattern?',
      help: 'Pick why it still holds.'
    },
    answers: [
      {
        id: 'many_independent_hits',
        normal: C('Many independent hits point the same way.', 'The contrary point narrows the read but does not erase it.'),
        simple: C('Many separate signs point there.', 'One point narrows it, not erases it.'),
        effects: fx({ knowledge: 0.35, wisdom: 0.25, gates: { G5_reality_contact: 0.45, G4_contradiction_handling: 0.35 }, quality: { high_signal: 1 }, coverage: { knowledge: 0.5, wisdom: 0.35 } })
      },
      {
        id: 'mechanism_explains_exception',
        normal: C('The mechanism explains the exception.', 'The contrary point fits as a boundary case.'),
        simple: C('The rule explains the exception.', 'It fits as a special case.'),
        effects: fx({ practicality: 0.3, wisdom: 0.35, gates: { G4_contradiction_handling: 0.55 }, quality: { precision_signal: 1 }, coverage: { practicality: 0.35, wisdom: 0.5 } })
      },
      {
        id: 'not_ready_to_say',
        normal: C('You are not ready to say.', 'The honest move is to reduce confidence.'),
        simple: C('Not sure yet.', 'Lower confidence.'),
        effects: fx({ gates: { G3_self_correction: 0.4, G6_non_self_sealing: 0.25 }, quality: { provisional_sample: 1, uncertainty: 1 } })
      },
      {
        id: 'pattern_obvious',
        normal: C('The pattern is obvious enough.', 'The exception should not change the larger read.'),
        simple: C('The pattern is obvious.', 'The exception does not matter much.'),
        effects: fx({ gates: { G6_non_self_sealing: -0.45, G3_self_correction: -0.25 }, quality: { sealed_signal: 1, self_protective_signal: 1 } })
      }
    ]
  },
  {
    id: 'opponent_little_followup',
    normal: {
      kicker: 'Low-opposition check',
      title: 'If the opposing read has little at its best, what would still make you pause?',
      help: 'This prevents an easy dismissal from pretending to be a complete audit.'
    },
    simple: {
      kicker: 'Other side check',
      title: 'What would still make you pause?',
      help: 'Pick the pause point.'
    },
    answers: [
      {
        id: 'new_fact_pause',
        normal: C('A clean new fact would make you pause.', 'Especially one that touches the main burden.'),
        simple: C('A clean fact.', 'A fact that hits the main point.'),
        effects: fx({ knowledge: 0.25, gates: { G3_self_correction: 0.45, G5_reality_contact: 0.45, G6_non_self_sealing: 0.25 }, quality: { precision_signal: 1 }, coverage: { knowledge: 0.35 } })
      },
      {
        id: 'human_cost_pause',
        normal: C('A missed human cost would make you pause.', 'Especially if the cost falls on people outside the main story.'),
        simple: C('A missed human cost.', 'Someone pays and we missed it.'),
        effects: fx({ empathy: 0.35, wisdom: 0.15, gates: { G1_counter_consideration: 0.35 }, coverage: { empathy: 0.5, wisdom: 0.25 } })
      },
      {
        id: 'mechanism_failure_pause',
        normal: C('A mechanism failure would make you pause.', 'Especially if the idea fails when applied.'),
        simple: C('A failure in real life.', 'It breaks when used.'),
        effects: fx({ practicality: 0.35, gates: { G5_reality_contact: 0.35 }, coverage: { practicality: 0.5 } })
      },
      {
        id: 'nothing_obvious_pause',
        normal: C('Nothing obvious would pause it right now.', 'The burden seems settled within this run.'),
        simple: C('Nothing obvious.', 'It feels settled.'),
        effects: fx({ gates: { G3_self_correction: -0.35, G6_non_self_sealing: -0.45 }, quality: { sealed_signal: 1 } })
      }
    ]
  },
  {
    id: 'score_badge_followup',
    normal: {
      kicker: 'Score use',
      title: 'If someone with a lower score makes a strong point, what happens?',
      help: 'This checks whether the shared number stays answerable to reasons.'
    },
    simple: {
      kicker: 'Score use',
      title: 'Lower score, strong point. What happens?',
      help: 'Pick what happens.'
    },
    answers: [
      {
        id: 'strong_point_counts',
        normal: C('The strong point counts.', 'A real objection still counts.'),
        simple: C('The strong point counts.', 'A score cannot erase it.'),
        effects: fx({ wisdom: 0.25, gates: { G1_counter_consideration: 0.45, G6_non_self_sealing: 0.45 }, quality: { precision_signal: 1 }, coverage: { wisdom: 0.35 } })
      },
      {
        id: 'rerun_specific_scope',
        normal: C('Run the specific objection as its own scope.', 'The number should become more precise, not louder.'),
        simple: C('Score that point by itself.', 'Make it more exact.'),
        effects: fx({ knowledge: 0.25, practicality: 0.15, gates: { G5_reality_contact: 0.35, G4_contradiction_handling: 0.25 }, quality: { precision_signal: 1 }, coverage: { knowledge: 0.35, practicality: 0.25 } })
      },
      {
        id: 'score_still_settles',
        normal: C('The higher score still mostly settles it.', 'The lower-score person may have a point, but the room needs a decision.'),
        simple: C('Higher score mostly wins.', 'The room needs a winner.'),
        effects: fx({ practicality: 0.2, gates: { G6_non_self_sealing: -0.45, G2_non_strawman: -0.25 }, quality: { social_performance_pressure: 1, score_badge_pressure: 1 } })
      },
      {
        id: 'ignore_lower_score',
        normal: C('The lower score makes the point less worth tracking.', 'The tool already marked the weaker position.'),
        simple: C('Lower score matters more.', 'The tool already showed weakness.'),
        effects: fx({ gates: { G1_counter_consideration: -0.45, G6_non_self_sealing: -0.65, G5_reality_contact: -0.35 }, quality: { sealed_signal: 1, social_performance_pressure: 2, score_badge_pressure: 2 } })
      }
    ]
  },
  {
    id: 'answer_shopping_followup',
    normal: {
      kicker: 'Retake pressure',
      title: 'Why try again until it scores higher?',
      help: 'A retake can sharpen a scope or turn into result shopping.'
    },
    simple: {
      kicker: 'Trying again',
      title: 'Why try again for higher?',
      help: 'Pick the reason.'
    },
    answers: [
      {
        id: 'scope_was_wrong',
        normal: C('The scope was framed badly.', 'A cleaner label may test the real target.'),
        simple: C('The scope name was wrong.', 'Fix the thing being scored.'),
        effects: fx({ wisdom: 0.25, gates: { G3_self_correction: 0.35 }, quality: { precision_signal: 1, provisional_sample: 1 } })
      },
      {
        id: 'missed_evidence',
        normal: C('Important evidence was missing.', 'The retake should add real burden, not just better-looking answers.'),
        simple: C('Important facts were missing.', 'Add real facts.'),
        effects: fx({ knowledge: 0.25, gates: { G5_reality_contact: 0.35 }, quality: { precision_signal: 1, provisional_sample: 1 } })
      },
      {
        id: 'audience_needs_higher',
        normal: C('The audience needs the result to land higher.', 'The score has to carry the point socially.'),
        simple: C('People need to see a higher score.', 'The score has to win.'),
        effects: fx({ gates: { G6_non_self_sealing: -0.65, G3_self_correction: -0.35 }, quality: { social_performance_pressure: 2, answer_shopping_signal: 2, low_signal: 1 } })
      },
      {
        id: 'not_retake_then',
        normal: C('Then do not retake yet.', 'Hold the lower result until the scope or evidence is genuinely cleaner.'),
        simple: C('Do not retake yet.', 'Keep the lower result until clearer.'),
        effects: fx({ wisdom: 0.25, gates: { G3_self_correction: 0.45, G6_non_self_sealing: 0.35 }, quality: { precision_signal: 1 } })
      }
    ]
  }
];
