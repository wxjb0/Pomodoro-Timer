import { useEffect } from 'react';

interface ShortcutHandlers {
  onStartPause: () => void;
  onReset: () => void;
}

export function useKeyboardShortcuts({ onStartPause, onReset }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        onStartPause();
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartPause, onReset]);
}
