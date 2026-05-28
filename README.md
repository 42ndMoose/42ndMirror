# 42ndMirror

42ndMirror is a static, deterministic card instrument for plotting a scoped idea, choice, argument, reaction, pattern, or comparison onto the Epistemic Octahedron.

It uses one universal logic engine. Categories only seed the opening bias. After that, the same card router narrows the run through generic reasoning loads: causal order, wording boundaries, evidence burden, consequence, moral load, practical limit, comparison, social pressure, small-scope action, uncertainty, and score-pressure.

The cards are intent probes. The calculation happens on the side.

The output point always follows:

```text
|x| + |y| + |z| = 1
```

Axis convention:

```text
+x = Empathy
-x = Practicality
+y = positive epistemic stability
-y = negative epistemic stability
+z = Wisdom
-z = Knowledge
```

## How it works

1. The user labels a scope.
2. The first card identifies the main reasoning burden.
3. Later cards narrow the active load.
4. If the answer pattern becomes asymmetrical, the router pressures the opposite side.
5. The result distinguishes ignored asymmetry from asymmetry that survived pressure.
6. The live routing panel shows the mathematical routing sequence without exposing a direct answer key.

## Files

```text
index.html
styles.css
visualizer.html
src/app.js
src/engine.js
data/cards.js
test-smoke.mjs
package.json
```

## Local test

```bash
node test-smoke.mjs
```

## GitHub Pages

Upload the files to a repository and enable GitHub Pages from the repository settings.
