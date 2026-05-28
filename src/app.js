import { MODES, SCOPES, USE_CASES } from '../data/cards.js';
import {
  answerCard,
  calculateResult,
  getAnswerText,
  getMode,
  getNextCard,
  getReadableText,
  getScope,
  getUICopy,
  getUseCase,
  makeInitialState
} from './engine.js';

const app = document.querySelector('#app');

let screen = 'start';
let selectedMode = 'fast';
let selectedScope = SCOPES[0].id;
let selectedUseCase = USE_CASES[0].id;
let claim = '';
let testState = null;
let lastResult = null;
let pendingRemovalId = null;

function render() {
  document.body.dataset.mode = selectedMode;
  if (screen === 'start') renderStart();
  else if (screen === 'card') renderCard();
  else if (screen === 'result') renderResult();
}

function renderStart() {
  const mode = getMode(selectedMode);
  const copy = getUICopy(selectedMode);
  const simple = mode.readingLevel === 'simple';
  const entries = loadEntries();

  app.innerHTML = `
    <section class="card start-card">
      <div class="header">
        <div class="brand">
          <div class="brand-title">${escapeHtml(copy.title)}</div>
          <div class="brand-subtitle">${escapeHtml(copy.subtitle)}</div>
          <div class="mini-rule">${escapeHtml(copy.howItWorks)}</div>
        </div>
        <div class="badge">${escapeHtml(mode.shortName)}</div>
      </div>

      <p class="section-title">${escapeHtml(copy.modeTitle)}</p>
      <div class="grid" id="modeGrid">
        ${Object.values(MODES).map(item => `
          <button class="mode-tile ${item.id === selectedMode ? 'selected' : ''}" data-mode="${item.id}" type="button">
            <div class="mode-name">${escapeHtml(item.name)}</div>
            <div class="mode-desc">${escapeHtml(item.description)}</div>
          </button>
        `).join('')}
      </div>

      <hr />

      <p class="section-title">${escapeHtml(copy.scopeTitle)}</p>
      <div class="grid" id="scopeGrid">
        ${SCOPES.map(item => `
          <button class="scope-tile ${item.id === selectedScope ? 'selected' : ''}" data-scope="${item.id}" type="button">
            <div class="scope-name">${escapeHtml(simple ? item.simpleName : item.name)}</div>
            <div class="scope-desc">${escapeHtml(simple ? item.simpleDescription : item.description)}</div>
          </button>
        `).join('')}
      </div>

      <hr />

      <p class="section-title">${escapeHtml(copy.useCaseTitle)}</p>
      <div class="grid" id="useCaseGrid">
        ${USE_CASES.map(item => `
          <button class="scope-tile ${item.id === selectedUseCase ? 'selected' : ''}" data-use-case="${item.id}" type="button">
            <div class="scope-name">${escapeHtml(simple ? item.simpleName : item.name)}</div>
            <div class="scope-desc">${escapeHtml(simple ? item.simpleDescription : item.description)}</div>
          </button>
        `).join('')}
      </div>

      <div class="field-group">
        <label for="claimInput"><strong>${escapeHtml(copy.labelTitle)}</strong><br>${escapeHtml(copy.labelHelp)}</label>
        <textarea id="claimInput" maxlength="500" placeholder="${escapeHtml(copy.labelPlaceholder)}">${escapeHtml(claim)}</textarea>
      </div>

      <div class="actions">
        <button id="clearButton" class="ghost-button" type="button">${escapeHtml(copy.reset)}</button>
        <button id="startButton" class="primary-button" type="button">${escapeHtml(copy.start)}</button>
      </div>
    </section>

    <section class="card start-card history-card">
      <div class="history-head">
        <p class="section-title">${escapeHtml(copy.history)}</p>
        <span class="small">${entries.length} saved</span>
      </div>
      ${entries.length ? `
        <div class="entry-list">
          ${entries.map(entry => renderEntry(entry, copy)).join('')}
        </div>
      ` : `<div class="empty-history">${escapeHtml(copy.historyEmpty)}</div>`}
    </section>

    ${pendingRemovalId ? renderConfirmModal(copy) : ''}
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

  app.querySelectorAll('[data-use-case]').forEach(button => {
    button.addEventListener('click', () => {
      selectedUseCase = button.dataset.useCase;
      render();
    });
  });

  app.querySelectorAll('[data-remove-entry]').forEach(button => {
    button.addEventListener('click', () => {
      pendingRemovalId = button.dataset.removeEntry;
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
    selectedUseCase = USE_CASES[0].id;
    claim = '';
    testState = null;
    lastResult = null;
    render();
  });

  app.querySelector('#startButton').addEventListener('click', () => {
    testState = makeInitialState({ modeId: selectedMode, scope: selectedScope, useCase: selectedUseCase, claim });
    screen = 'card';
    render();
  });

  const cancel = app.querySelector('#cancelRemoveButton');
  if (cancel) cancel.addEventListener('click', () => {
    pendingRemovalId = null;
    render();
  });

  const confirm = app.querySelector('#confirmRemoveButton');
  if (confirm) confirm.addEventListener('click', () => {
    removeEntry(pendingRemovalId);
    pendingRemovalId = null;
    render();
  });
}

function renderEntry(entry, copy) {
  const coords = entry.coordinates || {};
  const label = entry.quoted_label || entry.claim || copy.noLabel;
  return `
    <article class="entry-item">
      <div class="entry-main">
        <div class="entry-label">“${escapeHtml(label)}”</div>
        <div class="entry-meta">
          ${escapeHtml(entry.scope_label || 'Scope')} · ${escapeHtml(entry.use_case_label || 'Setting')} · ${escapeHtml(entry.signal_grade || '')}
        </div>
        <div class="entry-score">x ${formatCoord(coords.x)} · y ${formatCoord(coords.y)} · z ${formatCoord(coords.z)}</div>
      </div>
      <button class="ghost-button small-button" data-remove-entry="${escapeHtml(entry.id)}" type="button">${escapeHtml(copy.remove)}</button>
    </article>
  `;
}

function renderConfirmModal(copy) {
  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
        <h2 id="confirmTitle">${escapeHtml(copy.confirmTitle)}</h2>
        <p>${escapeHtml(copy.confirmText)}</p>
        <div class="actions modal-actions">
          <button id="cancelRemoveButton" class="ghost-button" type="button">${escapeHtml(copy.cancel)}</button>
          <button id="confirmRemoveButton" class="primary-button danger" type="button">${escapeHtml(copy.confirmRemove)}</button>
        </div>
      </section>
    </div>
  `;
}

function renderCard() {
  const card = getNextCard(testState);
  if (!card) {
    lastResult = calculateResult(testState);
    saveEntry(lastResult);
    screen = 'result';
    render();
    return;
  }

  const copy = getUICopy(testState.modeId);
  const text = getReadableText(card, testState.modeId);
  const totalBase = testState.baseDeck.length;
  const followCount = testState.askedCardIds.filter(id => id.includes('followup')).length + testState.pendingFollowUps.length;
  const denominator = totalBase + Math.max(0, followCount);
  const progressPercent = Math.max(5, Math.min(98, (testState.askedCardIds.length / Math.max(1, denominator)) * 100));
  const label = testState.claim || copy.noLabel;

  app.innerHTML = `
    <section class="card question-card">
      <div class="progress-wrap">
        <div class="run-label">${escapeHtml(copy.quotedScope)}: “${escapeHtml(label)}”</div>
        <div class="small">${escapeHtml(getMode(testState.modeId).name)} · ${escapeHtml(getScope(testState.scope).name)} · ${escapeHtml(getUseCase(testState.useCase).name)} · ${escapeHtml(copy.card)} ${testState.askedCardIds.length + 1}</div>
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
              ${answerText.sub ? `<span class="answer-sub">${escapeHtml(answerText.sub)}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <div class="actions">
        <button id="backStartButton" class="ghost-button" type="button">${escapeHtml(copy.restart)}</button>
        <div class="small">${escapeHtml(copy.baseProgress)}: ${Math.min(testState.baseIndex + 1, totalBase)}/${totalBase}</div>
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
  const copy = getUICopy(result.mode);
  const coords = result.coordinates;
  const json = JSON.stringify(result, null, 2);
  const gatePills = Object.entries(result.gates.items).map(([id, gate]) => `
    <span class="pill ${gate.status}" title="${escapeHtml(id)}">${escapeHtml(gate.label)}: ${escapeHtml(gate.status)}</span>
  `).join('');
  const coveragePills = Object.entries(result.coverage.items).map(([axis, value]) => `
    <span class="pill neutral">${escapeHtml(axis)}: ${escapeHtml(Number(value).toFixed(2))}</span>
  `).join('');

  app.innerHTML = `
    <section class="card result-card">
      <div class="header">
        <div class="brand">
          <div class="kicker">${escapeHtml(copy.result)}</div>
          <div class="run-label result-label">${escapeHtml(copy.quotedScope)}: “${escapeHtml(result.quoted_label || copy.noLabel)}”</div>
          <div class="brand-title result-title">${escapeHtml(result.interpretation.label)}</div>
          <div class="brand-subtitle">${escapeHtml(result.entry_text)}</div>
        </div>
        <div class="badge">signal: ${escapeHtml(result.signal_quality.grade)} · ${result.signal_quality.score}/100</div>
      </div>

      ${result.signal_quality.flags.length ? `<div class="warning">${escapeHtml(result.signal_quality.flags.join(' · '))}</div>` : ''}

      <div class="visualizer-shell">
        <div class="visualizer-head">
          <div>
            <p class="section-title">${escapeHtml(copy.projectedOutput)}</p>
            <div class="small">${escapeHtml(copy.projectedHelp)}</div>
          </div>
          <button id="openVisualizerButton" class="ghost-button" type="button">${escapeHtml(copy.openVisualizer)}</button>
        </div>
        <iframe id="visualizerFrame" class="visualizer-frame" src="./visualizer.html?embed=1" title="Epistemic Octahedron visualizer"></iframe>
      </div>

      <div class="result-grid">
        <div>
          <p class="section-title">${escapeHtml(copy.coordinate)}</p>
          <div class="coord-box">
            ${coordLine('x', coords.x)}
            ${coordLine('y', coords.y)}
            ${coordLine('z', coords.z)}
          </div>
          <div class="small" style="margin-top:10px;">${escapeHtml(copy.check)}: |x| + |y| + |z| = ${coords.surface_check}</div>
          <div class="small">+x empathy, -x practicality, +z wisdom, -z knowledge.</div>

          <hr />
          <p class="section-title">${escapeHtml(copy.gates)}</p>
          <div class="pill-row">${gatePills}</div>

          <hr />
          <p class="section-title">${escapeHtml(copy.coverage)}</p>
          <div class="pill-row">${coveragePills}</div>
        </div>

        <div>
          <p class="section-title">${escapeHtml(copy.readout)}</p>
          <div class="explain-list">
            ${result.interpretation.notes.map(note => `<div>${escapeHtml(note)}</div>`).join('')}
          </div>
        </div>
      </div>

      <hr />
      <details>
        <summary class="section-title" style="cursor:pointer;">${escapeHtml(copy.json)}</summary>
        <pre class="codeblock" id="jsonBlock">${escapeHtml(json)}</pre>
      </details>

      <div class="actions">
        <button id="copyButton" class="ghost-button" type="button">${escapeHtml(copy.copy)}</button>
        <button id="retakeButton" class="primary-button" type="button">${escapeHtml(copy.retake)}</button>
      </div>
    </section>
  `;

  app.querySelector('#copyButton').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(json);
      app.querySelector('#copyButton').textContent = copy.copied;
    } catch {
      app.querySelector('#copyButton').textContent = copy.copyFailed;
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

function saveEntry(result) {
  try {
    localStorage.setItem('42ndMirror:lastResult', JSON.stringify(result));
  } catch {}
  const entries = loadEntries();
  if (entries.some(entry => entry.id === result.id)) return;
  const entry = {
    id: result.id,
    created_at: result.created_at,
    quoted_label: result.quoted_label,
    claim: result.claim,
    mode_label: result.mode_label,
    scope_label: result.scope_label,
    use_case_label: result.use_case_label,
    coordinates: result.coordinates,
    signal_grade: result.signal_quality.grade,
    signal_score: result.signal_quality.score,
    interpretation_label: result.interpretation.label,
    entry_text: result.entry_text
  };
  const next = [entry, ...entries].slice(0, 50);
  try {
    localStorage.setItem('42ndMirror:entries', JSON.stringify(next));
  } catch {}
}

function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem('42ndMirror:entries') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function removeEntry(id) {
  const entries = loadEntries().filter(entry => entry.id !== id);
  try {
    localStorage.setItem('42ndMirror:entries', JSON.stringify(entries));
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

function formatCoord(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(3) : '0.000';
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
