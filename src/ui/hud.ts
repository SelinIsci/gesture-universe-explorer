export function startClock(): void {
  const el = document.getElementById('system-time');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toUTCString().slice(17, 25) + ' UTC';
  };
  tick();
  setInterval(tick, 1000);
}

export function setHandStatus(active: boolean): void {
  const el = document.getElementById('hand-status');
  if (!el) return;
  el.textContent = active ? '◉ HAND ACTIVE' : '◌ SEARCHING HAND';
  el.className = active ? 'active' : 'searching';
}

export function setKeyboardStatus(active: boolean): void {
  const el = document.getElementById('hand-status');
  if (!el) return;
  if (active) {
    el.textContent = '⌨ KEYBOARD ACTIVE';
    el.className = 'keyboard';
  }
}

export function flash(): void {
  const f = document.getElementById('focus-flash');
  if (!f) return;
  f.classList.add('flash');
  setTimeout(() => f.classList.remove('flash'), 200);
}

export function setOrbitFill(percent: number): void {
  const el = document.getElementById('orbit-fill');
  if (el) el.style.height = percent + '%';
}

export function showErrorBanner(message: string): void {
  let banner = document.getElementById('error-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'error-banner';
    document.body.appendChild(banner);
  }
  banner.textContent = '⚠ ' + message;
  banner.style.display = 'block';
}
