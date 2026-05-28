import { MODES, SCOPES } from '../data/cards.js';
import {
  answerCard,
  calculateResult,
  getAnswerText,
  getMode,
  getNextCard,
  getReadableText,
  getScope,
  makeInitialState
} from './engine.js';

const app = document.querySelector('#app');

let screen = 'start';
let selectedMode = 'fast';
let selectedScope = SCOPES[0].id;
let claim = '';
let testState = null;
let lastResult = null;

function render() {
  if (screen === 'start') renderStart();
  else if (screen === 'card') renderCard();
  else if (screen === 'result') renderResult();
}

function renderStart() {
  const mode = getMode(selectedMode);
  app.innerHTML = `
    <section class="card start-card">
      <div class="header">
        <div class="brand">
          <div class="brand-title">42ndMirror</div>
          <div class="brand-subtitle">
            Deterministic reasoning-shape validator. It does not read minds or parse essays. It makes the user compress a scope into structured contrasts, then outputs an xyz point on the Epistemic Octahedron surface.
          </div>
        </div>
        <div class="badge">${escapeHtml(mode.name)}</div>
      </div>

      <div class="notice">
        The result is a plot of the selected scope, not a permanent label for a person. For fictional characters, public figures, or debates, judge visible method and structure before fan appeal.
      </div>

      <p class="section-title">Mode</p>
      <div class="grid" id="modeGrid">
        ${Object.values(MODES).map(item => `
          <button class="mode-tile ${item.id === selectedMode ? 'selected' : ''}" data-mode="${item.id}" type="button">
            <div class="mode-name">${escapeHtml(item.name)}</div>
            <div class="mode-desc">${escapeHtml(item.description)}</div>
          </button>
        `).join('')}
      </div>

      <hr />

      <p class="section-title">Scope</p>
      <div class="grid" id="scopeGrid">
        ${SCOPES.map(item => `
          <button class="scope-tile ${item.id === selectedScope ? 'selected' : ''}" data-scope="${item.id}" type="button">
            <div class="scope-name">${escapeHtml(selectedMode === 'adhd' ? item.simpleName : item.name)}</div>
            <div class="scope-desc">${escapeHtml(item.description)}</div>
          </button>
        `).join('')}
      </div>

      <div class="field-group">
        <label for="claimInput">Label the scope in one sentence. The app stores this as a label only. It does not interpret the text.</label>
        <textarea id="claimInput" maxlength="500" placeholder="Example: L vs Light, judged by method under pressure rather than who I like more.">${escapeHtml(claim)}</textarea>
      </div>

      <div class="actions">
        <button id="clearButton" class="ghost-button" type="button">Reset</button>
        <button id="startButton" class="primary-button" type="button">Start</button>
      </div>
    </section>
  `;

  app.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => {
      selectedMode = button.dataset.mode;
      render();
    });
  });

  app.querySelectorAll('[data-scope]').forEach(button => {
    button.addEventListener('click', () => {
      selectedScope = button.dataset.scope;
      render();
    });
  });

  const claimInput = app.querySelector('#claimInput');
  claimInput.addEventListener('input', () => {
    claim = claimInput.value;
  });

  app.querySelector('#clearButton').addEventListener('click', () => {
    selectedMode = 'fast';
    selectedScope = SCOPES[0].id;
    claim = '';
    testState = null;
    lastResult = null;
    render();
  });

  app.querySelector('#startButton').addEventListener('click', () => {
    testState = makeInitialState({ modeId: selectedMode, scope: selectedScope, claim });
    screen = 'card';
    render();
  });
}

function renderCard() {
  const card = getNextCard(testState);
  if (!card) {
    lastResult = calculateResult(testState);
    screen = 'result';
    render();
    return;
  }

  const text = getReadableText(card, testState.modeId);
  const totalBase = testState.baseDeck.length;
  const followCount = testState.askedCardIds.filter(id => id.includes('followup')).length + testState.pendingFollowUps.length;
  const denominator = totalBase + Math.max(0, followCount);
  const progressPercent = Math.max(5, Math.min(98, (testState.askedCardIds.length / Math.max(1, denominator)) * 100));

  app.innerHTML = `
    <section class="card question-card">
      <div class="progress-wrap">
        <div class="small">${escapeHtml(getMode(testState.modeId).name)} · ${escapeHtml(getScope(testState.scope).name)} · Card ${testState.askedCardIds.length + 1}</div>
        <div class="progress-line"><div class="progress-bar" style="width:${progressPercent}%"></div></div>
      </div>

      <div class="kicker">${escapeHtml(text.kicker)}</div>
      <h1 class="question-title">${escapeHtml(text.title)}</h1>
      <p class="question-help">${escapeHtml(text.help)}</p>

      <div class="answers">
        ${card.answers.map(answer => {
          const answerText = getAnswerText(answer, testState.modeId);
          return `
            <button class="answer-button" type="button" data-answer="${escapeHtml(answer.id)}">
              <span class="answer-main">${escapeHtml(answerText.main)}</span>
              <span class="answer-sub">${escapeHtml(answerText.sub)}</span>
            </button>
          `;
        }).join('')}
      </div>

      <div class="actions">
        <button id="backStartButton" class="ghost-button" type="button">Restart</button>
        <div class="small">Base progress: ${Math.min(testState.baseIndex + 1, totalBase)}/${totalBase}</div>
      </div>
    </section>
  `;

  app.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      const answer = card.answers.find(item => item.id === button.dataset.answer);
      if (!answer) return;
      answerCard(testState, card, answer);
      render();
    });
  });

  app.querySelector('#backStartButton').addEventListener('click', () => {
    screen = 'start';
    testState = null;
    lastResult = null;
    render();
  });
}

function renderResult() {
  const result = lastResult;
  const coords = result.coordinates;
  const json = JSON.stringify(result, null, 2);
  const gatePills = Object.entries(result.gates.items).map(([id, gate]) => `
    <span class="pill ${gate.status}" title="${escapeHtml(id)}">${escapeHtml(gate.label)}: ${escapeHtml(gate.status)}</span>
  `).join('');
  const coveragePills = Object.entries(result.coverage.items).map(([axis, value]) => `
    <span class="pill neutral">${escapeHtml(axis)}: ${escapeHtml(value.toFixed ? value.toFixed(2) : String(value))}</span>
  `).join('');

  saveResult(result);

  app.innerHTML = `
    <section class="card result-card">
      <div class="header">
        <div class="brand">
          <div class="kicker">Result</div>
          <div class="brand-title">${escapeHtml(result.interpretation.label)}</div>
          <div class="brand-subtitle">This is the plotted shape of the selected scope based only on structured answers.</div>
        </div>
        <div class="badge">signal: ${escapeHtml(result.signal_quality.grade)} · ${result.signal_quality.score}/100</div>
      </div>

      ${result.signal_quality.flags.length ? `<div class="warning">${escapeHtml(result.signal_quality.flags.join(' · '))}</div>` : ''}

      <div class="visualizer-shell">
        <div class="visualizer-head">
          <div>
            <p class="section-title">Projected output</p>
            <div class="small">The iframe below is the uploaded Epistemic Octahedron HTML receiving the xyz payload.</div>
          </div>
          <button id="openVisualizerButton" class="ghost-button" type="button">Open full visualizer</button>
        </div>
        <iframe id="visualizerFrame" class="visualizer-frame" src="./visualizer.html?embed=1" title="Epistemic Octahedron visualizer"></iframe>
      </div>

      <div class="result-grid">
        <div>
          <p class="section-title">Surface coordinate</p>
          <div class="coord-box">
            ${coordLine('x', coords.x)}
            ${coordLine('y', coords.y)}
            ${coordLine('z', coords.z)}
          </div>
          <div class="small" style="margin-top:10px;">Check: |x| + |y| + |z| = ${coords.surface_check}</div>
          <div class="small">Convention: +x empathy, -x practicality, +z wisdom, -z knowledge.</div>

          <hr />
          <p class="section-title">Gates</p>
          <div class="pill-row">${gatePills}</div>

          <hr />
          <p class="section-title">Dimension coverage</p>
          <div class="pill-row">${coveragePills}</div>
        </div>

        <div>
          <p class="section-title">Plain readout</p>
          <div class="explain-list">
            ${result.interpretation.notes.map(note => `<div>${escapeHtml(note)}</div>`).join('')}
          </div>
        </div>
      </div>

      <hr />
      <details>
        <summary class="section-title" style="cursor:pointer;">JSON output</summary>
        <pre class="codeblock" id="jsonBlock">${escapeHtml(json)}</pre>
      </details>

      <div class="actions">
        <button id="copyButton" class="ghost-button" type="button">Copy JSON</button>
        <button id="retakeButton" class="primary-button" type="button">Run another plot</button>
      </div>
    </section>
  `;

  app.querySelector('#copyButton').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(json);
      app.querySelector('#copyButton').textContent = 'Copied';
    } catch {
      app.querySelector('#copyButton').textContent = 'Copy failed';
    }
  });

  app.querySelector('#retakeButton').addEventListener('click', () => {
    screen = 'start';
    testState = null;
    lastResult = null;
    render();
  });

  app.querySelector('#openVisualizerButton').addEventListener('click', () => {
    const url = `./visualizer.html?x=${encodeURIComponent(coords.x)}&y=${encodeURIComponent(coords.y)}&z=${encodeURIComponent(coords.z)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const frame = app.querySelector('#visualizerFrame');
  const post = () => postResultToVisualizer(frame, result);
  frame.addEventListener('load', post);
  setTimeout(post, 300);
  setTimeout(post, 1000);
}

function saveResult(result) {
  try {
    localStorage.setItem('42ndMirror:lastResult', JSON.stringify(result));
  } catch {}
}

function postResultToVisualizer(frame, result) {
  try {
    frame.contentWindow.postMessage(result.visualizer_payload, '*');
  } catch {}
}

function coordLine(label, value) {
  return `
    <div class="coord-line">
      <span>${escapeHtml(label)}</span>
      <strong>${Number(value).toFixed(6)}</strong>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();
