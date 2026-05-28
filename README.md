# 42ndMirror

42ndMirror is a static, deterministic reasoning-shape validator for the Epistemic Octahedron.

It does not use an LLM, backend, model weights, or server scoring. The app asks structured contrast cards, applies deterministic scoring, and outputs an `x,y,z` coordinate that strictly satisfies:

```txt
|x| + |y| + |z| = 1
```

## Current scope

This version focuses only on the test/input engine and projection output. Diachronic mechanisms are intentionally not implemented yet.

Included:

- Fast mode
- ADHD mode, same scoring as Fast mode with simpler wording
- Serious mode
- Scope selector
- Balanced contrast cards
- Adaptive follow-up cards
- Signal-quality checks for sandbox, taste, speed, narrow samples, scope confusion, and closure pressure
- Deterministic coordinate output
- Embedded projection into the uploaded Epistemic Octahedron HTML visualizer

## Axis convention

This repo follows the uploaded visualizer convention:

```txt
+x = Empathy
-x = Practicality
+y = positive epistemic stability
-y = negative epistemic stability
+z = Wisdom
-z = Knowledge
```

## Design rule

The app does not interpret the user's free text. The one-sentence label is only a label. The score comes from structured choices.

That keeps the system auditable and GitHub Pages-safe.

## Run locally

Any static server works:

```bash
python3 -m http.server
```

Then open:

```txt
http://localhost:8000
```

## GitHub Pages

Push the repo contents to a GitHub repository and enable GitHub Pages from the root or `/docs`, depending on your chosen layout.

## Test

```bash
npm test
```

The smoke test checks that the engine always returns a surface-valid coordinate.

## Important limitation

This is a validator for a selected scope, not a certification of a person. A character, argument, public figure, or claim can be plotted, but the output should be read according to the breadth and quality of the evidence supplied by the structured answers.
