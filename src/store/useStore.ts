import { create } from 'zustand';
import type {
  Settings,
  TimerState,
  Task,
  NoiseState,
  PomodoroStats,
  TimerMode,
  TaskTag,
} from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';

interface StoreState {
  timer: TimerState;
  settings: Settings;
  tasks: Task[];
  currentTask: Task | null;
  noise: NoiseState;
  stats: PomodoroStats;

  // Timer actions
  setTimerRunning: (running: boolean) => void;
  setTimerMode: (mode: TimerMode) => void;
  setTimerTimeLeft: (time: number) => void;
  setTimerTotalTime: (time: number) => void;
  incrementSession: () => void;
  resetSession: () => void;

  // Settings actions
  updateSettings: (partial: Partial<Settings>) => void;

  // Task actions
  addTask: (name: string, tag: TaskTag, estimated: number) => void;
  deleteTask: (id: number) => void;
  selectCurrentTask: (id: number) => void;
  clearCurrentTask: () => void;
  completePomodoroForCurrentTask: () => void;

  // Noise actions
  setNoiseType: (type: NoiseState['currentType']) => void;
  setNoiseVolume: (volume: number) => void;

  // Stats actions
  addPomodoroRecord: (tag: TaskTag, duration: number) => void;
}

function getInitialSettings(): Settings {
  return getStorageItem('settings', DEFAULT_SETTINGS);
}

function getInitialTasks(): Task[] {
  return getStorageItem('tasks', []);
}

function getInitialCurrentTask(): Task | null {
  return getStorageItem('currentTask', null);
}

function getInitialStats(): PomodoroStats {
  return getStorageItem('stats', { pomodoros: [] });
}

function getInitialTimer(): TimerState {
  const settings = getInitialSettings();
  return {
    isRunning: false,
    mode: 'work',
    timeLeft: settings.workTime * 60,
    totalTime: settings.workTime * 60,
    currentSession: 1,
  };
}

function syncStorage(key: 'settings' | 'tasks' | 'currentTask' | 'stats', value: unknown) {
  setStorageItem(key, value);
}

export const useStore = create<StoreState>((set) => ({
  timer: getInitialTimer(),
  settings: getInitialSettings(),
  tasks: getInitialTasks(),
  currentTask: getInitialCurrentTask(),
  noise: { currentType: null, volume: 50 },
  stats: getInitialStats(),

  setTimerRunning: (running) =>
    set((s) => ({ timer: { ...s.timer, isRunning: running } })),

  setTimerMode: (mode) =>
    set((s) => ({ timer: { ...s.timer, mode } })),

  setTimerTimeLeft: (time) =>
    set((s) => ({ timer: { ...s.timer, timeLeft: time } })),

  setTimerTotalTime: (time) =>
    set((s) => ({ timer: { ...s.timer, totalTime: time } })),

  incrementSession: () =>
    set((s) => ({ timer: { ...s.timer, currentSession: s.timer.currentSession + 1 } })),

  resetSession: () =>
    set((s) => ({ timer: { ...s.timer, currentSession: 1 } })),

  updateSettings: (partial) =>
    set((s) => {
      const next = { ...s.settings, ...partial };
      syncStorage('settings', next);
      return { settings: next };
    }),

  addTask: (name, tag, estimated) =>
    set((s) => {
      const task: Task = {
        id: Date.now(),
        name,
        tag,
        estimatedPomodoros: estimated,
        completedPomodoros: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const next = [...s.tasks, task];
      syncStorage('tasks', next);
      return { tasks: next };
    }),

  deleteTask: (id) =>
    set((s) => {
      const next = s.tasks.filter((t) => t.id !== id);
      syncStorage('tasks', next);
      const currentTask =
        s.currentTask?.id === id ? null : s.currentTask;
      syncStorage('currentTask', currentTask);
      return { tasks: next, currentTask };
    }),

  selectCurrentTask: (id) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === id) || null;
      syncStorage('currentTask', task);
      return { currentTask: task };
    }),

  clearCurrentTask: () =>
    set(() => {
      syncStorage('currentTask', null);
      return { currentTask: null };
    }),

  completePomodoroForCurrentTask: () =>
    set((s) => {
      if (!s.currentTask) return {};
      const updated = s.tasks.map((t) => {
        if (t.id !== s.currentTask!.id) return t;
        const completedPomodoros = t.completedPomodoros + 1;
        return {
          ...t,
          completedPomodoros,
          completed: completedPomodoros >= t.estimatedPomodoros,
        };
      });
      const updatedTask = updated.find((t) => t.id === s.currentTask!.id) || null;
      const currentTask = updatedTask?.completed ? null : updatedTask;
      syncStorage('tasks', updated);
      syncStorage('currentTask', currentTask);
      return { tasks: updated, currentTask };
    }),

  setNoiseType: (type) =>
    set((s) => ({ noise: { ...s.noise, currentType: type } })),

  setNoiseVolume: (volume) =>
    set((s) => ({ noise: { ...s.noise, volume } })),

  addPomodoroRecord: (tag, duration) =>
    set((s) => {
      const record = { time: new Date().toISOString(), tag, duration };
      const next = { pomodoros: [...s.stats.pomodoros, record] };
      syncStorage('stats', next);
      return { stats: next };
    }),
}));
