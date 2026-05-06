import { MODE_COLORS } from '../../types';
import type { TimerMode } from '../../types';

interface CircularProgressProps {
  progress: number;
  mode: TimerMode;
  timeDisplay: string;
  modeLabel: string;
}

export default function CircularProgress({
  progress,
  mode,
  timeDisplay,
  modeLabel,
}: CircularProgressProps) {
  const size = 280;
  const stroke = 5;
  const radius = (size - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color = MODE_COLORS[mode];

  return (
    <div className="relative flex flex-col items-center animate-scale-in">
      {/* Ambient glow behind the ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-15 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: color }}
      />

      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-morandi-cloud/40 dark:text-morandi-slate/20"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-5xl sm:text-6xl font-light tracking-tight text-morandi-indigo-deep dark:text-morandi-pearl tabular-nums">
          {timeDisplay}
        </span>
        <div className="flex items-center gap-2 mt-3">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-500"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-medium tracking-widest uppercase text-morandi-slate dark:text-morandi-mist">
            {modeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
