import { PLANET_DATA } from '../data/planets';
import { setOrbitFill } from './hud';

const total = PLANET_DATA.length;

export function updateInfoPanel(i: number): void {
  const d = PLANET_DATA[i];
  if (!d) return;

  setText(
    'planet-index',
    `OBJECT ${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
  );

  const nameEl = document.getElementById('planet-name');
  if (nameEl) {
    nameEl.style.opacity = '0';
    nameEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      nameEl.textContent = d.name;
      nameEl.style.opacity = '1';
      nameEl.style.transform = 'translateY(0)';
    }, 150);
  }

  setText('planet-subtitle', d.subtitle);
  setText('stat-diameter', d.diameter);
  setText('stat-distance', d.distance);
  setText('stat-period', d.period || '—');
  setText('stat-temp', d.temp);
  setText('planet-desc', d.desc);

  const badge = document.getElementById('planet-type-badge');
  if (badge) {
    badge.textContent = d.type;
    badge.style.color = d.typeColor;
    badge.style.borderColor = d.typeColor;
  }

  setOrbitFill((i / (total - 1)) * 100);

  document
    .querySelectorAll('.nav-dot')
    .forEach((el, j) => el.classList.toggle('active', j === i));
}

function setText(id: string, value: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
