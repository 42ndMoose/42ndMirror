# 42ndMirror

42ndMirror is a static, deterministic reasoning-shape validator for the Epistemic Octahedron.

It does not use an LLM, backend, API call, model weights, or browser GPU inference. It asks structured adaptive cards, calculates deterministic effects, and outputs a strict xyz coordinate on the octahedron surface:

```text
|x| + |y| + |z| = 1
```

## Current scope

This repo focuses only on the test/input side.

Diachronic mechanisms, external output schematics, longitudinal updates, and richer visualizer integration are intentionally left for a later layer.

## Axis convention

```text
x positive = Practicality
x negative = Empathy

y positive = stable reasoning
y negative = unstable reasoning

z positive = Wisdom
z negative = Knowledge
```

This follows the convention that the Knowledge pole is negative Z.

## Modes

- Fast mode: short structured validator.
- ADHD mode: same engine as Fast mode, but simpler wording.
- Serious mode: more cards and follow-ups.

## How it works

The app does not interpret free text. The user writes a scope label, but that text is not parsed.

The test uses forced-choice cards with deterministic effects:

- Empathy
- Practicality
- Wisdom
- Knowledge
- Six stability gates:
  - Counter-consideration
  - Non-strawman
  - Self-correction
  - Contradiction handling
  - Reality contact
  - Non-self-sealing

Each answer can also trigger adaptive follow-up cards. This lets the instrument separate similar-looking answers. For example, "I distrust the source" can mean valid source criticism or sealed reasoning, depending on the follow-up.

## Signal-quality net

The app includes signal-quality checks without naming or insulting the user. It marks weak results when answers indicate low effort, sealed reasoning, shallow accounting, noisy samples, or unusually fast clicking.

Signal quality is reported separately from the xyz coordinate.

## Files

```text
index.html          Static entry point
styles.css          UI styling
src/app.js          UI state and rendering
src/engine.js       Deterministic scoring and projection
/data/cards.js      Test cards, answers, effects, modes, gates
```

## Local use

Because this uses ES modules, open it through a local static server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## GitHub Pages use

Push this repo to GitHub and enable Pages from the root branch. No build step is required.

## Output shape

The result JSON includes:

```json
{
  "coordinates": {
    "x": 0,
    "y": 0,
    "z": 0,
    "surface_check": 1,
    "raw": { "x": 0, "y": 0, "z": 0 }
  }
}
```

The public coordinate is always projected onto the octahedron surface.

If the test somehow produces no directional signal, the engine uses a deterministic insufficient-signal fallback:

```json
{ "x": 0, "y": -1, "z": 0 }
```

That case should be rare because the current card set is designed to produce directional signal.
