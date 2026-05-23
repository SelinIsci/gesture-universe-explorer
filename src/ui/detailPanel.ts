import { PLANET_DATA } from '../data/planets';
import { TRIVIA_BY_PLANET } from '../data/trivia';

let panel: HTMLDivElement | null = null;

// Defense in depth: all interpolated values come from hardcoded data modules,
// but escape anyway so a future "load trivia from JSON/API" change can't open XSS.
function esc(s: string | number): string {
  return String(s).replace(
    /[&<>"']/g,
    c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const safeColor = (c: string): string => (HEX_COLOR.test(c) ? c : '#fff');

function ensurePanel(): HTMLDivElement {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = 'detail-panel';
  document.body.appendChild(panel);
  return panel;
}

export function showDetail(i: number): void {
  const data = PLANET_DATA[i];
  const trivia = TRIVIA_BY_PLANET.get(data.name);
  if (!data || !trivia) return;

  const el = ensurePanel();
  const atmosphereHTML = trivia.atmosphere
    ? `<div class="dossier-section">
        <div class="dossier-section-title">Atmospheric Composition</div>
        <div class="atm-bars">
          ${Object.entries(trivia.atmosphere)
            .map(
              ([gas, pct]) => `
              <div class="atm-row">
                <span class="atm-label">${esc(gas)}</span>
                <div class="atm-track"><div class="atm-fill" style="width:${Math.min(pct, 100)}%; background:${safeColor(data.typeColor)}"></div></div>
                <span class="atm-pct">${esc(pct)}%</span>
              </div>`,
            )
            .join('')}
        </div>
      </div>`
    : '';

  const featuresHTML = trivia.notableFeatures
    ? `<div class="dossier-section">
        <div class="dossier-section-title">Notable Features</div>
        <ul class="features-list">${trivia.notableFeatures.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>`
    : '';

  el.innerHTML = `
    <div class="dossier-header">
      <div class="dossier-eyebrow">PLANETARY DOSSIER</div>
      <div class="dossier-title" style="color:${safeColor(data.typeColor)}">${esc(data.name)}</div>
      <div class="dossier-subtitle">${esc(data.subtitle)}</div>
    </div>
    <div class="dossier-section">
      <div class="dossier-section-title">Did you know?</div>
      <div class="trivia-list">
        ${trivia.facts.map((f, idx) => `<div class="trivia-card" style="animation-delay:${idx * 80}ms">${esc(f)}</div>`).join('')}
      </div>
    </div>
    ${atmosphereHTML}
    ${featuresHTML}
    <div class="dossier-footer">Open palm or press <kbd>Esc</kbd> to exit</div>
  `;
  el.classList.add('visible');
  document.body.classList.add('detail-mode');
}

export function hideDetail(): void {
  if (panel) panel.classList.remove('visible');
  document.body.classList.remove('detail-mode');
}

export function isDetailVisible(): boolean {
  return !!panel && panel.classList.contains('visible');
}
