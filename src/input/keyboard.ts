export interface KeyboardCallbacks {
  onNavigate(direction: -1 | 1): void;
  onZoomStep(direction: -1 | 1): void;
  onToggleDetail(): void;
  onExitDetail(): void;
  onToggleAutoRotate(): void;
}

export function attachKeyboard(cb: KeyboardCallbacks): void {
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
        cb.onNavigate(-1);
        break;
      case 'ArrowRight':
        cb.onNavigate(1);
        break;
      case '+':
      case '=':
        cb.onZoomStep(1);
        break;
      case '-':
      case '_':
        cb.onZoomStep(-1);
        break;
      case 'd':
      case 'D':
        cb.onToggleDetail();
        break;
      case 'Escape':
        cb.onExitDetail();
        break;
      case ' ':
        e.preventDefault();
        cb.onToggleAutoRotate();
        break;
    }
  });
}
