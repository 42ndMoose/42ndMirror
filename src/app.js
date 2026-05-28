import { MODES, SCOPES, SETTINGS, ROUTE_FACETS } from '../data/cards.js';
import {
  answerCard,
  calculateResult,
  getAnswerText,
  getMode,
  getNextCard,
  getReadableText,
  getScope,
  getSetting,
  getUICopy,
  getRoutingSnapshot,
  makeInitialState
} from './engine.js';

const app = document.querySelector('#app');

let screen = 'start';
let selectedMode = 'fast';
let selectedScope = SCOPES[0].id;
let selectedSetting = SETTINGS[0].id;
let claim = '';
let testState = null;
let lastResult = null;
let pendingRemovalId = null;
let showRouter = true;

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
            <div class="mode-name">${escapeHtml(simple ? item.shortName : item.name)}</div>
            <div class="mode-desc">${escapeHtml(simple ? simplifyModeDesc(item) : item.description)}</div>
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

      <p class="section-title">${escapeHtml(copy.settingTitle)}</p>
      <div class="grid" id="settingGrid">
        ${SETTINGS.map(item => `
          <button class="scope-tile ${item.id === selectedSetting ? 'selected' : ''}" data-setting="${item.id}" type="button">
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
      ${entries.length ? `<div class="entry-list">${entries.map(entry => renderEntry(entry, copy)).join('')}</div>` : `<div class="empty-history">${escapeHtml(copy.historyEmpty)}</div>`}
    </section>

    ${pendingRemovalId ? renderConfirmModal(copy) : ''}
  `;

  app.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { selectedMode = button.dataset.mode; render(); }));
  app.querySelectorAll('[data-scope]').forEach(button => button.addEventListener('click', () => { selectedScope = button.dataset.scope; render(); }));
  app.querySelectorAll('[data-setting]').forEach(button => button.addEventListener('click', () => { selectedSetting = button.dataset.setting; render(); }));
  app.querySelectorAll('[data-remove-entry]').forEach(button => button.addEventListener('click', () => { pendingRemovalId = button.dataset.removeEntry; render(); }));

  const claimInput = app.querySelector('#claimInput');
  claimInput.addEventListener('input', () => { claim = claimInput.value; });

  app.querySelector('#clearButton').addEventListener('click', () => {
    selectedMode = 'fast';
    selectedScope = SCOPES[0].id;
    selectedSetting = SETTINGS[0].id;
    claim = '';
    testState = null;
    lastResult = null;
    render();
  });

  app.querySelector('#startButton').addEventListener('click', () => {
    testState = makeInitialState({ modeId: selectedMode, scope: selectedScope, setting: selectedSetting, claim });
    screen = 'card';
    render();
  });

  const cancel = app.querySelector('#cancelRemoveButton');
  if (cancel) cancel.addEventListener('click', () => { pendingRemovalId = null; render(); });
  const confirm = app.querySelector('#confirmRemoveButton');
  if (confirm) confirm.addEventListener('click', () => { removeEntry(pendingRemovalId); pendingRemovalId = null; render(); });
}

function simplifyModeDesc(item) {
  if (item.id === 'adhd') return 'Simple words.';
  if (item.id === 'serious') return 'More cards.';
  return 'Short run.';
}

function renderEntry(entry, copy) {
  const coords = entry.coordinates || {};
  const label = entry.quoted_label || entry.claim || copy.noLabel;
  return `
    <article class="entry-item">
      <div class="entry-main">
        <div class="entry-label">“${escapeHtml(label)}”</div>
        <div class="entry-meta">${escapeHtml(entry.scope_label || 'Scope')} · ${escapeHtml(entry.setting_label || 'Setting')} · ${escapeHtml(entry.signal_grade || '')}</div>
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
  const label = testState.claim || copy.noLabel;
  const progressPercent = Math.max(6, Math.min(98, (testState.askedCardIds.length / Math.max(1, testState.maxCards)) * 100));
  const routing = getRoutingSnapshot(testState);

  app.innerHTML = `
    <section class="card question-card">
      <div class="progress-wrap">
        <div class="run-label">${escapeHtml(copy.quotedScope)}: “${escapeHtml(label)}”</div>
        <div class="small">${escapeHtml(getMode(testState.modeId).name)} · ${escapeHtml(getScope(testState.scope).name)} · ${escapeHtml(getSetting(testState.setting).name)} · ${escapeHtml(copy.card)} ${testState.askedCardIds.length + 1}/${testState.maxCards}</div>
        <div class="progress-line"><div class="progress-bar" style="width:${progressPercent}%"></div></div>
      </div>

      <div class="card-layout">
        <div class="question-main">
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
        </div>

        ${showRouter ? renderRoutingPanel(routing, copy) : ''}
      </div>

      <div class="actions">
        <button id="backStartButton" class="ghost-button" type="button">${escapeHtml(copy.restart)}</button>
        <button id="toggleRouterButton" class="ghost-button" type="button">${showRouter ? 'Hide math' : 'Show math'}</button>
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
  app.querySelector('#backStartButton').addEventListener('click', () => { screen = 'start'; testState = null; lastResult = null; render(); });
  app.querySelector('#toggleRouterButton').addEventListener('click', () => { showRouter = !showRouter; render(); });
}

function renderRoutingPanel(routing, copy) {
  const selection = routing.selection || {};
  const parts = selection.parts || {};
  return `
    <aside class="logic-panel" aria-label="${escapeHtml(copy.routing)}">
      <div class="logic-head">
        <span>${escapeHtml(copy.routing)}</span>
        <span class="logic-score">S=${formatCoord(selection.score)}</span>
      </div>
      <div class="formula">${escapeHtml(selection.formula || 'S = .54R + .22D + .12G + .08T')}</div>
      <div class="logic-card-id">next: ${escapeHtml(selection.selected_card_id || '')}</div>
      <div class="score-grid">
        ${miniScore('R', parts.route)}
        ${miniScore('D', parts.deficit)}
        ${miniScore('G', parts.gate)}
        ${miniScore('T', parts.stage)}
      </div>
      <div class="route-bars">
        ${routing.top_routes.map(route => routeBar(route.label, route.value)).join('')}
      </div>
      <div class="logic-log">
        ${routing.recent_route_log.map(item => renderRouteLog(item)).join('')}
      </div>
    </aside>
  `;
}

function miniScore(label, value) {
  return `<div class="mini-score"><span>${escapeHtml(label)}</span><strong>${formatCoord(value)}</strong></div>`;
}

function routeBar(label, value) {
  const pct = Math.max(2, Math.min(100, Number(value || 0) * 100));
  return `
    <div class="route-row">
      <div class="route-label"><span>${escapeHtml(label)}</span><span>${Number(value || 0).toFixed(2)}</span></div>
      <div class="route-track"><div class="route-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function renderRouteLog(item) {
  if (item.type === 'seed') {
    return `<div class="logic-line">t0 seed · ${escapeHtml((item.top || []).map(r => `${ROUTE_FACETS[r.id] || r.id} ${Number(r.value).toFixed(2)}`).join(' / '))}</div>`;
  }
  return `<div class="logic-line">t${item.step} Δ · ${escapeHtml((item.delta || []).map(r => `${ROUTE_FACETS[r.id] || r.id} ${r.value >= 0 ? '+' : ''}${Number(r.value).toFixed(2)}`).join(' / '))}</div>`;
}

function renderResult() {
  const result = lastResult;
  const copy = getUICopy(result.mode);
  const coords = result.coordinates;
  const json = JSON.stringify(result, null, 2);
  const gatePills = Object.entries(result.gates.items).map(([id, gate]) => `<span class="pill ${gate.status}" title="${escapeHtml(id)}">${escapeHtml(gate.label)}: ${escapeHtml(gate.status)}</span>`).join('');
  const coveragePills = Object.entries(result.coverage.items).map(([axis, value]) => `<span class="pill neutral">${escapeHtml(axis)}: ${escapeHtml(Number(value).toFixed(2))}</span>`).join('');

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
          <div><p class="section-title">${escapeHtml(copy.projectedOutput)}</p><div class="small">${escapeHtml(copy.projectedHelp)}</div></div>
          <button id="openVisualizerButton" class="ghost-button" type="button">${escapeHtml(copy.openVisualizer)}</button>
        </div>
        <iframe id="visualizerFrame" class="visualizer-frame" src="./visualizer.html?embed=1" title="Epistemic Octahedron visualizer"></iframe>
      </div>

      <div class="result-grid">
        <div>
          <p class="section-title">${escapeHtml(copy.coordinate)}</p>
          <div class="coord-box">${coordLine('x', coords.x)}${coordLine('y', coords.y)}${coordLine('z', coords.z)}</div>
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
          <div class="explain-list">${result.interpretation.notes.map(note => `<div>${escapeHtml(note)}</div>`).join('')}</div>
          <hr />
          <p class="section-title">${escapeHtml(copy.routing)}</p>
          ${renderResultRouting(result.routing)}
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
    try { await navigator.clipboard.writeText(json); app.querySelector('#copyButton').textContent = copy.copied; }
    catch { app.querySelector('#copyButton').textContent = copy.copyFailed; }
  });
  app.querySelector('#retakeButton').addEventListener('click', () => { screen = 'start'; testState = null; lastResult = null; render(); });
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

function renderResultRouting(routing) {
  const series = routing.route_specificity || {};
  return `
    <div class="explain-list compact">
      <div>route fit: ${formatCoord(series.first_avg_route_fit)} → ${formatCoord(series.last_avg_route_fit)} (${Number(series.delta || 0) >= 0 ? '+' : ''}${formatCoord(series.delta)})</div>
      <div>top route: ${escapeHtml((routing.top_routes || []).slice(0, 3).map(r => `${r.label} ${Number(r.value).toFixed(2)}`).join(' / '))}</div>
      <div>cards: ${escapeHtml((routing.selected_cards || []).join(' → '))}</div>
    </div>
  `;
}

function saveEntry(result) {
  try { localStorage.setItem('42ndMirror:lastResult', JSON.stringify(result)); } catch {}
  const entries = loadEntries();
  if (entries.some(entry => entry.id === result.id)) return;
  const entry = {
    id: result.id,
    created_at: result.created_at,
    quoted_label: result.quoted_label,
    claim: result.claim,
    mode_label: result.mode_label,
    scope_label: result.scope_label,
    setting_label: result.setting_label,
    coordinates: result.coordinates,
    signal_grade: result.signal_quality.grade,
    signal_score: result.signal_quality.score,
    interpretation_label: result.interpretation.label,
    entry_text: result.entry_text
  };
  const next = [entry, ...entries].slice(0, 50);
  try { localStorage.setItem('42ndMirror:entries', JSON.stringify(next)); } catch {}
}

function loadEntries() {
  try { const parsed = JSON.parse(localStorage.getItem('42ndMirror:entries') || '[]'); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}

function removeEntry(id) {
  const entries = loadEntries().filter(entry => entry.id !== id);
  try { localStorage.setItem('42ndMirror:entries', JSON.stringify(entries)); } catch {}
}

function postResultToVisualizer(frame, result) {
  try { frame.contentWindow.postMessage(result.visualizer_payload, '*'); } catch {}
}

function coordLine(label, value) {
  return `<div class="coord-line"><span>${escapeHtml(label)}</span><strong>${Number(value).toFixed(6)}</strong></div>`;
}

function formatCoord(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(3) : '0.000';
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

render();
