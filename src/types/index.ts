export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export type TaskTag = 'work' | 'study' | 'personal' | 'other';

export interface Task {
  id: number;
  name: string;
  tag: TaskTag;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
}

export interface Settings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  darkMode: boolean;
  soundNotification: boolean;
  desktopNotification: boolean;
}

export interface TimerState {
  isRunning: boolean;
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  currentSession: number;
}

export type NoiseType = 'rain' | 'cafe' | 'forest' | 'ocean';

export interface NoiseState {
  currentType: NoiseType | null;
  volume: number;
}

export interface PomodoroRecord {
  time: string;
  tag: TaskTag;
  duration: number;
}

export interface PomodoroStats {
  pomodoros: PomodoroRecord[];
}

export type TabType = 'timer' | 'tasks' | 'stats' | 'settings';

export type TimeDimension = 'day' | 'week' | 'month';

export const DEFAULT_SETTINGS: Settings = {
  workTime: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  darkMode: false,
  soundNotification: true,
  desktopNotification: true,
};

export const MODE_COLORS: Record<TimerMode, string> = {
  work: '#e74c3c',
  shortBreak: '#2ecc71',
  longBreak: '#3498db',
};

export const MODE_LABELS: Record<TimerMode, string> = {
  work: '专注时间',
  shortBreak: '短休息时间',
  longBreak: '长休息时间',
};

export const TAG_LABELS: Record<TaskTag, string> = {
  work: '工作',
  study: '学习',
  personal: '个人',
  other: '其他',
};
