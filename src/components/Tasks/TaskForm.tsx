import { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { TaskTag } from '../../types';

const TAG_OPTIONS: { value: TaskTag; label: string; icon: string }[] = [
  { value: 'work', label: '工作', icon: 'fa-solid fa-briefcase' },
  { value: 'study', label: '学习', icon: 'fa-solid fa-book-open' },
  { value: 'personal', label: '个人', icon: 'fa-solid fa-user' },
  { value: 'other', label: '其他', icon: 'fa-solid fa-bookmark' },
];

export default function TaskForm() {
  const addTask = useStore((s) => s.addTask);
  const [name, setName] = useState('');
  const [tag, setTag] = useState<TaskTag>('work');
  const [estimated, setEstimated] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('请输入任务名称'); return; }
    if (estimated < 1 || estimated > 20) { setError('预估番茄数范围为 1-20'); return; }
    addTask(trimmed, tag, estimated);
    setName(''); setTag('work'); setEstimated(1); setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 mb-6 animate-fade-in">
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="任务名称"
          aria-label="任务名称"
          className="input-base"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex gap-2 flex-wrap">
          {TAG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTag(opt.value)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium
                transition-all duration-300 ease-in-out
                ${tag === opt.value
                  ? 'icon-3d icon-3d-indigo !w-auto !h-auto !text-[11px] !rounded-xl !px-3 !py-2'
                  : 'bg-morandi-pearl/30 dark:bg-morandi-slate/10 text-morandi-slate/50 dark:text-morandi-mist/40 hover:bg-morandi-cloud/50 dark:hover:bg-morandi-slate/20 rounded-xl'
                }
              `}
            >
              <i className={`${opt.icon} text-[10px]`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-clock icon-3d icon-3d-sm icon-3d-amber" />
          <span className="text-xs text-morandi-slate/60 dark:text-morandi-mist/50">预估番茄</span>
          <input
            id="est-pomodoros"
            type="number"
            min="1"
            max="20"
            value={estimated}
            onChange={(e) => setEstimated(Number(e.target.value))}
            className="w-14 px-2 py-1.5 input-base text-center text-xs"
          />
        </div>
        <button
          type="submit"
          className="btn-primary text-xs px-5 py-2.5"
        >
          <i className="fa-solid fa-plus text-[10px]" />
          添加
        </button>
      </div>

      {error && (
        <p className="text-xs text-morandi-rose mt-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation icon-3d icon-3d-sm icon-3d-rose !w-auto !h-auto !shadow-none !bg-none" />
          {error}
        </p>
      )}
    </form>
  );
}
