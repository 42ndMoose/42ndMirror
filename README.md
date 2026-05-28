# 42ndMirror

A static GitHub Pages-ready card test for plotting a selected scope onto the Epistemic Octahedron.

The app asks structured scenario cards, applies deterministic scoring, and outputs an `x,y,z` coordinate that strictly satisfies:

```txt
|x| + |y| + |z| = 1
```

## v0.4 focus

v0.4 adds a deterministic card router. The free-text label is still not parsed by an LLM, but the app now uses a transparent keyword/facet classifier to seed a route vector. Each next card is selected by a visible scoring formula:

```txt
S = .54R + .22D + .12G + .08T + setting + fixed - penalty
```

Where:

```txt
R = route fit
D = dimension deficit fit
G = gate deficit fit
T = stage fit
```

This lets the card sequence get more specific to small life choices, evidence claims, public comparison pressure, character reads, policy/system questions, and comparisons.

## Example behavior

A label like:

```txt
should i stop procrastinating and eat now
```

should route toward small-action/body-need cards rather than abstract debate cards.

## Files

```txt
index.html
styles.css
visualizer.html
src/app.js
src/engine.js
data/cards.js
test-smoke.mjs
```

## Run locally

Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 8080
```

Then open:

```txt
http://localhost:8080
```

## Smoke test

```bash
npm test
```

The test checks the surface equation, routing relevance, and several stress labels.

## Axis convention

```txt
+x = empathy
-x = practicality
+y = positive epistemic stability
-y = negative epistemic stability
+z = wisdom
-z = knowledge
```

## GitHub Pages

Upload the folder to a repository named `42ndMirror`, enable GitHub Pages from the main branch, and point Pages at the repository root.
