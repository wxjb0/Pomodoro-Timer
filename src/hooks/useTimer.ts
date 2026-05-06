import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import type { TimerMode } from '../types';
import { MODE_COLORS } from '../types';
import { sendNotification } from '../utils/notification';

export function useTimer() {
  const workerRef = useRef<Worker | null>(null);
  const {
    timer,
    settings,
    currentTask,
    setTimerRunning,
    setTimerMode,
    setTimerTimeLeft,
    setTimerTotalTime,
    incrementSession,
    resetSession,
    completePomodoroForCurrentTask,
    addPomodoroRecord,
  } = useStore();

  const timerRef = useRef(timer);
  timerRef.current = timer;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e) => {
      const { type, timeLeft } = e.data;

      if (type === 'tick') {
        setTimerTimeLeft(timeLeft);
        document.title = timeLeft > 0
          ? `[${formatTime(timeLeft)}] - 高效番茄钟`
          : '高效番茄钟';
      }

      if (type === 'complete') {
        handleComplete();
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  const handleComplete = useCallback(() => {
    const current = timerRef.current;
    const s = settingsRef.current;

    setTimerRunning(false);

    if (current.mode === 'work') {
      addPomodoroRecord(currentTask?.tag || 'other', s.workTime);
      completePomodoroForCurrentTask();

      const newSession = current.currentSession + 1;
      if (newSession > s.longBreakInterval) {
        switchMode('longBreak');
        resetSession();
      } else {
        switchMode('shortBreak');
        incrementSession();
      }
    } else {
      switchMode('work');
    }

    if (s.desktopNotification) {
      sendNotification(current.mode);
    }
  }, []);

  const switchMode = useCallback((mode: TimerMode) => {
    const s = settingsRef.current;
    let totalTime: number;

    switch (mode) {
      case 'work':
        totalTime = s.workTime * 60;
        break;
      case 'shortBreak':
        totalTime = s.shortBreak * 60;
        break;
      case 'longBreak':
        totalTime = s.longBreak * 60;
        break;
    }

    setTimerMode(mode);
    setTimerTotalTime(totalTime);
    setTimerTimeLeft(totalTime);
    setTimerRunning(false);

    document.documentElement.style.setProperty('--timer-color', MODE_COLORS[mode]);
  }, []);

  const start = useCallback(() => {
    if (workerRef.current && timerRef.current.timeLeft > 0) {
      workerRef.current.postMessage({
        type: 'start',
        timeLeft: timerRef.current.timeLeft,
      });
      setTimerRunning(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'pause' });
      setTimerRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
    }
    const s = settingsRef.current;
    const mode = timerRef.current.mode;
    let totalTime: number;

    switch (mode) {
      case 'work':
        totalTime = s.workTime * 60;
        break;
      case 'shortBreak':
        totalTime = s.shortBreak * 60;
        break;
      case 'longBreak':
        totalTime = s.longBreak * 60;
        break;
    }

    setTimerTimeLeft(totalTime);
    setTimerTotalTime(totalTime);
    setTimerRunning(false);
    document.title = '高效番茄钟';
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (workerRef.current && timerRef.current.isRunning) {
        workerRef.current.postMessage({ type: 'stop' });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { timer, start, pause, reset };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
