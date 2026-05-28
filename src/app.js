import { MODES, SCOPES, GATES } from '../data/cards.js';
import {
  answerCard,
  calculateResult,
  getAnswerText,
  getMode,
  getNextCard,
  getReadableText,
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
    <section class="card">
      <div class="header">
        <div class="brand">
          <div class="brand-title">42ndMirror</div>
          <div class="brand-subtitle">
            A deterministic reasoning-shape validator. No LLM, no backend, no model download. It asks structured cards, then outputs an xyz coordinate on the octahedron surface.
          </div>
        </div>
        <div class="badge">${escapeHtml(mode.name)}</div>
      </div>

      <p class="section-title">Choose mode</p>
      <div class="grid" id="modeGrid">
        ${Object.values(MODES).map(item => `
          <button class="mode-tile ${item.id === selectedMode ? 'selected' : ''}" data-mode="${item.id}" type="button">
            <div class="mode-name">${escapeHtml(item.name)}</div>
            <div class="mode-desc">${escapeHtml(item.description)}</div>
          </button>
        `).join('')}
      </div>

      <hr />

      <p class="section-title">Choose scope</p>
      <div class="grid" id="scopeGrid">
        ${SCOPES.map(item => `
          <button class="scope-tile ${item.id === selectedScope ? 'selected' : ''}" data-scope="${item.id}" type="button">
            <div class="scope-name">${escapeHtml(selectedMode === 'adhd' ? item.simpleName : item.name)}</div>
            <div class="scope-desc">${escapeHtml(item.description)}</div>
          </button>
        `).join('')}
      </div>

      <div class="field-group">
        <label for="claimInput">Label the scope in one sentence. This text is stored only as a label. The app does not interpret it.</label>
        <textarea id="claimInput" maxlength="400" placeholder="Example: I think this policy works in theory but fails when enforcement costs are counted.">${escapeHtml(claim)}</textarea>
      </div>

      <div class="actions">
        <button id="clearButton" class="ghost-button" type="button">Reset</button>
        <button id="startButton" class="primary-button" type="button">Start test</button>
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
  const baseProgress = Math.min(testState.baseIndex + 1, totalBase);
  const followCount = testState.askedCardIds.filter(id => id.includes('followup')).length + testState.pendingFollowUps.length;
  const progressPercent = Math.max(4, Math.min(98, (testState.askedCardIds.length / (totalBase + Math.max(1, followCount))) * 100));

  app.innerHTML = `
    <section class="card">
      <div class="progress-wrap">
        <div class="small">${escapeHtml(getMode(testState.modeId).name)} · Card ${testState.askedCardIds.length + 1}</div>
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
        <div class="small">Base progress: ${baseProgress}/${totalBase}</div>
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

  app.innerHTML = `
    <section class="card">
      <div class="header">
        <div class="brand">
          <div class="kicker">Result</div>
          <div class="brand-title">${escapeHtml(result.interpretation.label)}</div>
          <div class="brand-subtitle">This is the plotted shape of the selected scope based only on your structured answers.</div>
        </div>
        <div class="badge">signal: ${escapeHtml(result.signal_quality.grade)}</div>
      </div>

      ${result.signal_quality.flags.length ? `<div class="warning">${escapeHtml(result.signal_quality.flags.join(' · '))}</div>` : ''}

      <div class="result-grid">
        <div>
          <p class="section-title">Surface coordinate</p>
          <div class="coord-box">
            ${coordLine('x', coords.x)}
            ${coordLine('y', coords.y)}
            ${coordLine('z', coords.z)}
          </div>
          <div class="small" style="margin-top:10px;">Check: |x| + |y| + |z| = ${coords.surface_check}</div>

          <hr />
          <p class="section-title">Gate status</p>
          <div class="pill-row">${gatePills}</div>
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
        <button id="againButton" class="primary-button" type="button">Run another scope</button>
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

  app.querySelector('#againButton').addEventListener('click', () => {
    screen = 'start';
    testState = null;
    lastResult = null;
    render();
  });
}

function coordLine(axis, value) {
  const pct = Math.min(100, Math.round(Math.abs(value) * 100));
  return `
    <div class="coord-line">
      <div class="coord-axis">${axis}</div>
      <div class="meter"><div class="meter-fill" style="width:${pct}%"></div></div>
      <div>${formatSigned(value)}</div>
    </div>
  `;
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${Number(value).toFixed(6)}`;
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
