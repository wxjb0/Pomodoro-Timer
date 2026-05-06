const PREFIX = 'pomodoro_';

const KEYS = {
  settings: `${PREFIX}settings`,
  tasks: `${PREFIX}tasks`,
  currentTask: `${PREFIX}currentTask`,
  stats: `${PREFIX}stats`,
  timerState: `${PREFIX}timer_state`,
} as const;

export function getStorageItem<T>(key: keyof typeof KEYS, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(KEYS[key]);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: keyof typeof KEYS, value: T): void {
  try {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${KEYS[key]}:`, e);
  }
}

export function removeStorageItem(key: keyof typeof KEYS): void {
  try {
    localStorage.removeItem(KEYS[key]);
  } catch (e) {
    console.error(`Failed to remove ${KEYS[key]}:`, e);
  }
}
