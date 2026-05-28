# 42ndMirror

A static GitHub Pages-ready card test for plotting a selected scope onto the Epistemic Octahedron.

The app asks structured scenario cards, applies deterministic scoring, and outputs an `x,y,z` coordinate that strictly satisfies:

```txt
|x| + |y| + |z| = 1
```

## What changed in v0.3

- Landing copy is shorter and more casual.
- The scope label appears in quotes during cards, result, and saved entries.
- Recent entries appear at the bottom of the landing page.
- Entries can be removed with a confirmation dialog.
- ADHD mode changes the whole UI copy and sizing, not only card text.
- Public/group/debate settings add pressure-aware cards.
- Card answers are less dimension-obvious and more cross-loaded.
- The scoring now watches for score-as-proof pressure, retake pressure, over-smooth answer patterns, and public comparison pressure.

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
node test-smoke.mjs
```

## Axis convention

```txt
+x = empathy
-x = practicality
+y = positive epistemic stability
-y = negative epistemic stability
+z = wisdom
-z = knowledge
```

## Design note

The free-text label is treated as the name of the run. The coordinate comes from the card choices.

The result is best read as:

```txt
Given this selected scope and these structured answers, this is the reasoning-shape expressed by the run.
```

## GitHub Pages

Upload the folder to a repository named `42ndMirror`, enable GitHub Pages from the main branch, and point Pages at the repository root.
