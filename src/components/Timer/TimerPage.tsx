import { useTimer } from '../../hooks/useTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useStore } from '../../store/useStore';
import { MODE_LABELS } from '../../types';
import CircularProgress from './CircularProgress';
import TimerControls from './TimerControls';
import CurrentTaskCard from './CurrentTaskCard';
import WhiteNoiseBar from './WhiteNoiseBar';

export default function TimerPage() {
  const { timer, start, pause, reset } = useTimer();
  const currentTask = useStore((s) => s.currentTask);

  useKeyboardShortcuts({
    onStartPause: () => (timer.isRunning ? pause() : start()),
    onReset: reset,
  });

  const progress = timer.totalTime > 0 ? (timer.timeLeft / timer.totalTime) * 100 : 0;
  const m = Math.floor(timer.timeLeft / 60);
  const s = timer.timeLeft % 60;
  const timeDisplay = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 pb-28">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-morandi-slate/40 dark:text-morandi-mist/30">
          Pomodoro Timer
        </h1>
      </div>

      {/* Timer ring */}
      <CircularProgress
        progress={progress}
        mode={timer.mode}
        timeDisplay={timeDisplay}
        modeLabel={MODE_LABELS[timer.mode]}
      />

      {/* Controls */}
      <TimerControls
        isRunning={timer.isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      {/* Current task */}
      <div className="w-full max-w-sm mt-8">
        <CurrentTaskCard task={currentTask} />
      </div>

      {/* White noise */}
      <div className="w-full max-w-sm">
        <WhiteNoiseBar />
      </div>
    </div>
  );
}
