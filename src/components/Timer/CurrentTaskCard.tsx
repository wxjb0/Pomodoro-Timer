import type { Task } from '../../types';
import { TAG_LABELS } from '../../types';

interface CurrentTaskCardProps {
  task: Task | null;
}

export default function CurrentTaskCard({ task }: CurrentTaskCardProps) {
  if (!task) {
    return (
      <div className="mt-8 glass rounded-2xl p-5 text-center animate-fade-in">
        <i className="fa-solid fa-face-smile icon-3d icon-3d-lg mx-auto mb-3" />
        <p className="text-sm text-morandi-slate/60 dark:text-morandi-mist/50">
          选择一个任务开始专注
        </p>
      </div>
    );
  }

  const progress = Math.min(
    (task.completedPomodoros / task.estimatedPomodoros) * 100,
    100
  );

  return (
    <div className="mt-8 glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-circle-check icon-3d icon-3d-indigo icon-3d-sm" />
          <div>
            <p className="text-sm font-medium text-morandi-indigo-deep dark:text-morandi-pearl">{task.name}</p>
            <p className="text-[10px] text-morandi-slate/60 dark:text-morandi-mist/50 mt-0.5">{TAG_LABELS[task.tag]}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-morandi-slate dark:text-morandi-mist tabular-nums">
          {task.completedPomodoros}/{task.estimatedPomodoros}
        </span>
      </div>
      <div className="w-full bg-morandi-cloud/30 dark:bg-morandi-slate/15 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4a5568 0%, #718096 100%)',
          }}
        />
      </div>
    </div>
  );
}
