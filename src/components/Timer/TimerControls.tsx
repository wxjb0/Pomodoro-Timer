interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
      {/* Reset button */}
      <button
        onClick={onReset}
        aria-label="重置计时器"
        className="icon-3d icon-3d-indigo"
      >
        <i className="fa-solid fa-rotate-left" />
      </button>

      {/* Play / Pause — the hero button */}
      <button
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? '暂停计时' : '开始计时'}
        className="
          icon-3d icon-3d-lg
          transition-all duration-300 ease-in-out
          hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
        "
        style={{
          background: isRunning
            ? 'linear-gradient(145deg, rgba(198, 149, 90, 0.25) 0%, rgba(198, 149, 90, 0.08) 100%)'
            : 'linear-gradient(145deg, rgba(74, 85, 104, 0.25) 0%, rgba(74, 85, 104, 0.08) 100%)',
          color: isRunning ? '#c6955a' : '#4a5568',
          boxShadow: isRunning
            ? '0 4px 12px -2px rgba(198, 149, 90, 0.2), 0 2px 6px -2px rgba(198, 149, 90, 0.15), inset 0 1px 0 0 rgba(255,255,255,0.5)'
            : '0 4px 12px -2px rgba(74, 85, 104, 0.2), 0 2px 6px -2px rgba(74, 85, 104, 0.15), inset 0 1px 0 0 rgba(255,255,255,0.5)',
        }}
      >
        <i className={`text-xl ${isRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play ml-1'}`} />
      </button>

      {/* Skip / Next mode */}
      <button
        onClick={onReset}
        aria-label="跳过当前阶段"
        className="icon-3d icon-3d-indigo"
      >
        <i className="fa-solid fa-forward-step" />
      </button>
    </div>
  );
}
