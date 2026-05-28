import {
  CARD_BANK,
  MODES,
  SCOPES,
  SETTINGS
} from '../data/cards.js';
import {
  finalizeProfile,
  getAnswerText,
  getLiveReadout,
  getMode,
  getNextCard,
  getReadableText,
  getSetting,
  getScope,
  getUICopy,
  makeInitialState,
  quoteLabel,
  recordAnswer
} from './engine.js';

const STORAGE_HISTORY = '42ndMirror:history';
const STORAGE_LAST = '42ndMirror:lastResult';
const app = document.getElementById('app');

const ui = {
  modeId: 'fast',
  scope: 'claim',
  setting: 'private',
  label: '',
  state: null,
  currentCard: null,
  result: null,
  history: loadHistory(),
  pendingDeleteIndex: null
};

renderStart();

function copy() {
  return getUICopy(ui.modeId);
}

function setMode(modeId) {
  ui.modeId = modeId;
  document.body.dataset.mode = modeId;
}

function renderStart() {
  setMode(ui.modeId);
  const c = copy();
  app.innerHTML = `
    <section class="card start-card">
      <div class="header">
        <div>
          <div class="brand-title">${escapeHTML(c.title)}</div>
          <div class="brand-subtitle">${escapeHTML(c.subtitle)}</div>
          <div class="mini-rule">${escapeHTML(c.howItWorks)}</div>
        </div>
        <div class="badge">|x| + |y| + |z| = 1</div>
      </div>

      <hr>
      <h2 class="section-title">${escapeHTML(c.modeTitle)}</h2>
      <div class="grid" id="modeGrid">
        ${Object.values(MODES).map(mode => tile('mode-tile', mode.id, ui.modeId === mode.id, mode.name, mode.simpleName, '')).join('')}
      </div>

      <hr>
      <h2 class="section-title">${escapeHTML(c.scopeTitle)}</h2>
      <div class="grid" id="scopeGrid">
        ${SCOPES.map(scope => tile('scope-tile', scope.id, ui.scope === scope.id, scope.name, scope.simpleName, '')).join('')}
      </div>

      <hr>
      <h2 class="section-title">${escapeHTML(c.settingTitle)}</h2>
      <div class="grid" id="settingGrid">
        ${SETTINGS.map(setting => tile('scope-tile', setting.id, ui.setting === setting.id, setting.name, setting.simpleName, '')).join('')}
      </div>

      <div class="field-group">
        <label for="labelInput"><strong>${escapeHTML(c.labelTitle)}</strong><br>${escapeHTML(c.labelHelp)}</label>
        <textarea id="labelInput" placeholder="${escapeAttr(c.labelPlaceholder)}">${escapeHTML(ui.label)}</textarea>
      </div>

      <div class="actions">
        <button class="ghost-button" id="clearBtn">${escapeHTML(c.reset)}</button>
        <button class="primary-button" id="startBtn">${escapeHTML(c.start)}</button>
      </div>
    </section>

    <section class="card history-card">
      <div class="history-head">
        <h2 class="section-title">${escapeHTML(c.saved)}</h2>
      </div>
      <div class="entry-list" id="historyList">${renderHistoryHTML()}</div>
    </section>
  `;

  bindStartEvents();
}

function tile(className, id, selected, normal, simple, desc) {
  const simpleMode = getMode(ui.modeId).readingLevel === 'simple';
  const label = simpleMode ? simple : normal;
  return `
    <button class="${className} ${selected ? 'selected' : ''}" data-id="${escapeAttr(id)}">
      <span class="scope-name">${escapeHTML(label)}</span>
      ${desc ? `<span class="scope-desc">${escapeHTML(desc)}</span>` : ''}
    </button>
  `;
}

function bindStartEvents() {
  const labelInput = document.getElementById('labelInput');
  labelInput?.addEventListener('input', () => { ui.label = labelInput.value; });

  document.querySelectorAll('#modeGrid .mode-tile').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.label = labelInput?.value || ui.label;
      ui.modeId = btn.dataset.id;
      renderStart();
    });
  });
  document.querySelectorAll('#scopeGrid .scope-tile').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.scope = btn.dataset.id;
      renderStart();
    });
  });
  document.querySelectorAll('#settingGrid .scope-tile').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.setting = btn.dataset.id;
      renderStart();
    });
  });
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    ui.label = '';
    renderStart();
  });
  document.getElementById('startBtn')?.addEventListener('click', startRun);

  document.querySelectorAll('[data-remove-entry]').forEach(btn => {
    btn.addEventListener('click', () => showDeleteModal(Number(btn.dataset.removeEntry)));
  });
}

function startRun() {
  const labelInput = document.getElementById('labelInput');
  ui.label = (labelInput?.value || '').trim();
  ui.state = makeInitialState({ modeId: ui.modeId, scope: ui.scope, setting: ui.setting, claim: ui.label });
  ui.currentCard = getNextCard(ui.state);
  if (!ui.currentCard) {
    ui.result = finalizeProfile(ui.state);
    saveResult(ui.result);
    renderResult();
    return;
  }
  renderCard();
}

function renderCard() {
  setMode(ui.modeId);
  const c = copy();
  const card = ui.currentCard;
  const text = getReadableText(card, ui.modeId);
  const step = ui.state.askedCardIds.length + 1;
  const progress = Math.min(100, (ui.state.askedCardIds.length / ui.state.maxCards) * 100);
  const live = getLiveReadout(ui.state);

  app.innerHTML = `
    <section class="card question-card">
      <div class="progress-wrap">
        <span class="run-label">${escapeHTML(quoteLabel(ui.state.claim, c))}</span>
        <div class="small">${escapeHTML(getMode(ui.modeId).name)} · ${escapeHTML(getScope(ui.scope).name)} · ${escapeHTML(getSetting(ui.setting).name)} · ${escapeHTML(c.card)} ${step}/${ui.state.maxCards}</div>
        <div class="progress-line"><div class="progress-bar" style="width:${progress}%"></div></div>
      </div>

      <div class="card-layout">
        <div class="question-main">
          <div class="kicker">${escapeHTML(text.kicker || '')}</div>
          <h1 class="question-title">${escapeHTML(text.title || '')}</h1>
          <p class="question-help">${escapeHTML(text.help || c.chooseOne)}</p>
          <div class="answers">
            ${(card.answers || []).map(answer => {
              const a = getAnswerText(answer, ui.modeId);
              return `<button class="answer-button" data-answer="${escapeAttr(answer.id)}">
                <span class="answer-main">${escapeHTML(a.main || '')}</span>
                <span class="answer-sub">${escapeHTML(a.sub || '')}</span>
              </button>`;
            }).join('')}
          </div>
        </div>
        ${renderLogicPanel(live)}
      </div>

      <div class="actions">
        <button class="ghost-button" id="backBtn">${escapeHTML(c.restart)}</button>
      </div>
    </section>
  `;

  document.querySelectorAll('.answer-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = card.answers.find(a => a.id === btn.dataset.answer);
      recordAnswer(ui.state, card, answer);
      ui.currentCard = getNextCard(ui.state);
      if (!ui.currentCard) {
        ui.result = finalizeProfile(ui.state);
        saveResult(ui.result);
        renderResult();
      } else {
        renderCard();
      }
    });
  });
  document.getElementById('backBtn')?.addEventListener('click', () => {
    ui.state = null;
    ui.currentCard = null;
    renderStart();
  });
}

function renderLogicPanel(live) {
  const selected = live.selection;
  const parts = selected?.parts || {};
  return `
    <aside class="logic-panel">
      <div class="logic-head"><span>${escapeHTML(copy().routing)}</span><span class="logic-score">${selected ? selected.score.toFixed(3) : 'seed'}</span></div>
      <div class="formula">${escapeHTML(live.formula)}</div>
      ${selected ? `<div class="logic-card-id">next: ${escapeHTML(selected.selected)}</div>` : ''}
      ${selected ? `<div class="score-grid">
        ${miniScore('R', parts.route)}
        ${miniScore('P', parts.pressure)}
        ${miniScore('C', parts.gap)}
        ${miniScore('G', parts.gate)}
      </div>` : ''}
      <div class="route-bars">
        ${bars('load', live.loads)}
        ${bars('pressure', live.pressure)}
      </div>
      <div class="logic-log">
        <div class="logic-line">target: ${escapeHTML(live.pressure_target)}</div>
        <div class="logic-line">asym: ${escapeHTML(live.asymmetry ? `${live.asymmetry.axis} → test ${live.asymmetry.oppositeAxis}` : 'none yet')}</div>
      </div>
    </aside>
  `;
}

function miniScore(label, value) {
  return `<div class="mini-score"><span>${escapeHTML(label)}</span><strong>${Number(value || 0).toFixed(2)}</strong></div>`;
}

function bars(label, items) {
  return `<div>
    <div class="logic-line">${escapeHTML(label)}</div>
    ${(items || []).map(item => `
      <div>
        <div class="route-label"><span>${escapeHTML(item.label || item.key)}</span><span>${Number(item.value || 0).toFixed(2)}</span></div>
        <div class="route-track"><div class="route-fill" style="width:${Math.max(2, Math.min(100, (Number(item.value || 0) * 100)))}%"></div></div>
      </div>
    `).join('')}
  </div>`;
}

function renderResult() {
  setMode(ui.modeId);
  const c = copy();
  const r = ui.result;
  localStorage.setItem(STORAGE_LAST, JSON.stringify(r));
  const p = r.coordinates;
  app.innerHTML = `
    <section class="card result-card">
      <div>
        <span class="run-label result-label">${escapeHTML(r.quoted_scope)}</span>
        <h1 class="result-title">${escapeHTML(c.result)}</h1>
      </div>

      <div class="visualizer-shell">
        <div class="visualizer-head">
          <strong>${escapeHTML(c.graphPoint)}</strong>
          <span class="small">x ${fmt(p.x)} · y ${fmt(p.y)} · z ${fmt(p.z)}</span>
        </div>
        <iframe id="visualizerFrame" class="visualizer-frame" src="./visualizer.html?x=${encodeURIComponent(p.x)}&y=${encodeURIComponent(p.y)}&z=${encodeURIComponent(p.z)}" title="Epistemic Octahedron visualizer"></iframe>
      </div>

      <div class="result-grid">
        <div class="coord-box">
          <h2 class="section-title">${escapeHTML(c.graphPoint)}</h2>
          ${coordLine('x', p.x)}
          ${coordLine('y', p.y)}
          ${coordLine('z', p.z)}
          <div class="coord-line"><span>${escapeHTML(c.mathCheck)}</span><strong>${fmt(r.surface_check)}</strong></div>
        </div>
        <div>
          <h2 class="section-title">${escapeHTML(c.resultText)}</h2>
          <div class="explain-list compact">
            <div>${escapeHTML(r.interpretation.short)}</div>
            <div>Signal: ${escapeHTML(r.signal_quality.grade)} (${escapeHTML(String(r.signal_quality.score))}).</div>
            <div>Pressure: ${escapeHTML(r.pressure.status)}.</div>
            <div>Scope load: ${escapeHTML(r.interpretation.scope_load)}.</div>
            <div>${escapeHTML(r.interpretation.note)}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="section-title">${escapeHTML(c.routing)}</h2>
        <div class="pill-row">
          ${(r.loads_top || []).map(item => `<span class="pill neutral">${escapeHTML(item.label)} ${Number(item.value).toFixed(2)}</span>`).join('')}
        </div>
      </div>

      <details>
        <summary class="section-title">JSON output</summary>
        <pre class="codeblock">${escapeHTML(JSON.stringify(r, null, 2))}</pre>
      </details>

      <div class="actions">
        <button class="ghost-button" id="homeBtn">${escapeHTML(c.retake)}</button>
        <button class="primary-button" id="copyBtn">${escapeHTML(c.copy)}</button>
      </div>
    </section>
  `;

  document.getElementById('homeBtn')?.addEventListener('click', () => {
    ui.state = null;
    ui.currentCard = null;
    ui.result = null;
    renderStart();
  });
  document.getElementById('copyBtn')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(r, null, 2));
      document.getElementById('copyBtn').textContent = c.copied;
    } catch {
      document.getElementById('copyBtn').textContent = c.copyFailed;
    }
  });

  const frame = document.getElementById('visualizerFrame');
  frame?.addEventListener('load', () => {
    frame.contentWindow?.postMessage(r.visualizer_payload, '*');
  });
}

function coordLine(k, v) {
  return `<div class="coord-line"><span>${escapeHTML(k)}</span><strong>${fmt(v)}</strong></div>`;
}

function fmt(v) {
  return Number(v || 0).toFixed(6);
}

function saveResult(result) {
  ui.history = loadHistory();
  ui.history.unshift({
    claim: result.claim,
    quoted_scope: result.quoted_scope,
    mode: result.mode,
    scope: result.scope,
    setting: result.setting,
    coordinates: result.coordinates,
    surface_check: result.surface_check,
    signal_quality: result.signal_quality,
    created_at: result.created_at
  });
  ui.history = ui.history.slice(0, 12);
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(ui.history));
  localStorage.setItem(STORAGE_LAST, JSON.stringify(result));
}

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderHistoryHTML() {
  const c = copy();
  if (!ui.history.length) return `<div class="empty-history">${escapeHTML(c.savedEmpty)}</div>`;
  return ui.history.map((entry, index) => {
    const p = entry.coordinates || { x: 0, y: 0, z: 0 };
    return `<div class="entry-item">
      <div>
        <div class="entry-label">${escapeHTML(entry.quoted_scope || quoteLabel(entry.claim, c))}</div>
        <div class="entry-meta">${escapeHTML(entry.mode || '')} · ${escapeHTML(entry.scope || '')} · ${escapeHTML(entry.setting || '')} · ${escapeHTML(entry.signal_quality?.grade || '')}</div>
        <div class="entry-score">x ${fmt(p.x)} · y ${fmt(p.y)} · z ${fmt(p.z)}</div>
      </div>
      <button class="ghost-button small-button" data-remove-entry="${index}">${escapeHTML(c.remove)}</button>
    </div>`;
  }).join('');
}

function showDeleteModal(index) {
  ui.pendingDeleteIndex = index;
  const c = copy();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-card">
      <h2>${escapeHTML(c.confirmTitle)}</h2>
      <p>${escapeHTML(c.confirmText)}</p>
      <div class="actions modal-actions">
        <button class="ghost-button" id="cancelDelete">${escapeHTML(c.cancel)}</button>
        <button class="primary-button danger" id="confirmDelete">${escapeHTML(c.confirmRemove)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cancelDelete')?.addEventListener('click', () => modal.remove());
  document.getElementById('confirmDelete')?.addEventListener('click', () => {
    ui.history.splice(ui.pendingDeleteIndex, 1);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(ui.history));
    modal.remove();
    renderStart();
  });
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHTML(value).replaceAll('`', '&#096;');
}

export const appInternals = { CARD_BANK };
