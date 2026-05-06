import { useStore } from '../../store/useStore';
import { TAG_LABELS } from '../../types';

const TAG_ICONS: Record<string, string> = {
  work: 'fa-solid fa-briefcase',
  study: 'fa-solid fa-book-open',
  personal: 'fa-solid fa-user',
  other: 'fa-solid fa-bookmark',
};

export default function TaskList() {
  const tasks = useStore((s) => s.tasks);
  const currentTask = useStore((s) => s.currentTask);
  const selectCurrentTask = useStore((s) => s.selectCurrentTask);
  const clearCurrentTask = useStore((s) => s.clearCurrentTask);
  const deleteTask = useStore((s) => s.deleteTask);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <i className="fa-solid fa-folder-open icon-3d icon-3d-lg mx-auto mb-3" />
        <p className="text-sm text-morandi-slate/40 dark:text-morandi-mist/30">还没有任务</p>
      </div>
    );
  }

  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-3 stagger-children visible">
      {incomplete.map((task) => {
        const isCurrent = currentTask?.id === task.id;
        const progress = Math.min((task.completedPomodoros / task.estimatedPomodoros) * 100, 100);

        return (
          <div
            key={task.id}
            className={`
              glass rounded-xl p-4 transition-all duration-300 ease-in-out
              ${isCurrent
                ? 'ring-1.5 ring-morandi-indigo/20 dark:ring-morandi-pearl/15 shadow-soft-md'
                : 'hover:shadow-soft'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => isCurrent ? clearCurrentTask() : selectCurrentTask(task.id)}
                  className={`icon-3d icon-3d-sm ${
                    isCurrent ? 'icon-3d-indigo' : ''
                  }`}
                  aria-label={isCurrent ? '取消当前任务' : '设为当前任务'}
                >
                  <i className={`${isCurrent ? 'fa-solid fa-check' : 'fa-solid fa-circle'}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-morandi-indigo-deep dark:text-morandi-pearl">
                    {task.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <i className={`${TAG_ICONS[task.tag]} text-[9px] text-morandi-slate/40 dark:text-morandi-mist/30`} />
                    <span className="text-[10px] text-morandi-slate/50 dark:text-morandi-mist/40">
                      {TAG_LABELS[task.tag]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-morandi-slate/40 dark:text-morandi-mist/30 tabular-nums">
                  {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="删除任务"
                  className="icon-3d icon-3d-sm icon-3d-rose !w-7 !h-7 !text-[10px]"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            <div className="w-full bg-morandi-cloud/25 dark:bg-morandi-slate/10 rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #4a5568 0%, #718096 100%)',
                }}
              />
            </div>
          </div>
        );
      })}

      {completed.length > 0 && (
        <>
          <div className="flex items-center gap-2 pt-6 pb-2 px-1">
            <span className="text-[10px] font-medium tracking-widest uppercase text-morandi-slate/30 dark:text-morandi-mist/20">
              已完成
            </span>
            <div className="flex-1 h-px bg-morandi-cloud/30 dark:bg-morandi-slate/10" />
          </div>
          {completed.map((task) => (
            <div
              key={task.id}
              className="glass rounded-xl p-4 opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check icon-3d icon-3d-sm icon-3d-sage" />
                  <p className="text-sm text-morandi-slate/60 dark:text-morandi-mist/40 line-through">
                    {task.name}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="删除任务"
                  className="icon-3d icon-3d-sm icon-3d-rose !w-7 !h-7 !text-[10px]"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
