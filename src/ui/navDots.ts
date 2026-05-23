import { PLANET_DATA } from '../data/planets';

export function buildNavDots(onSelect: (i: number) => void): void {
  const host = document.getElementById('nav-dots');
  if (!host) return;
  host.innerHTML = '';
  PLANET_DATA.forEach((d, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.title = d.name;
    dot.onclick = () => onSelect(i);
    host.appendChild(dot);
  });
}
