import { TRIVIA } from '../data/trivia';
import { PLANET_DATA } from '../data/planets';

let panel: HTMLDivElement | null = null;

function ensurePanel(): HTMLDivElement {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = 'detail-panel';
  document.body.appendChild(panel);
  return panel;
}

export function showDetail(i: number): void {
  const data = PLANET_DATA[i];
  const trivia = TRIVIA.find(t => t.planet === data.name);
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
                <span class="atm-label">${gas}</span>
                <div class="atm-track"><div class="atm-fill" style="width:${Math.min(pct, 100)}%; background:${data.typeColor}"></div></div>
                <span class="atm-pct">${pct}%</span>
              </div>`,
            )
            .join('')}
        </div>
      </div>`
    : '';

  const featuresHTML = trivia.notableFeatures
    ? `<div class="dossier-section">
        <div class="dossier-section-title">Notable Features</div>
        <ul class="features-list">${trivia.notableFeatures.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>`
    : '';

  el.innerHTML = `
    <div class="dossier-header">
      <div class="dossier-eyebrow">PLANETARY DOSSIER</div>
      <div class="dossier-title" style="color:${data.typeColor}">${data.name}</div>
      <div class="dossier-subtitle">${data.subtitle}</div>
    </div>
    <div class="dossier-section">
      <div class="dossier-section-title">Did you know?</div>
      <div class="trivia-list">
        ${trivia.facts.map((f, idx) => `<div class="trivia-card" style="animation-delay:${idx * 80}ms">${f}</div>`).join('')}
      </div>
    </div>
    ${atmosphereHTML}
    ${featuresHTML}
    <div class="dossier-footer">Open palm or press <kbd>Esc</kbd> to exit</div>
  `;
  el.classList.add('visible');
}

export function hideDetail(): void {
  if (panel) panel.classList.remove('visible');
}

export function isDetailVisible(): boolean {
  return !!panel && panel.classList.contains('visible');
}
