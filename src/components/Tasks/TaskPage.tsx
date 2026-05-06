import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function TaskPage() {
  return (
    <div className="min-h-screen px-6 py-12 pb-28 max-w-lg mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-morandi-slate/40 dark:text-morandi-mist/30 mb-2">
          Task Manager
        </h1>
        <h2 className="text-xl font-semibold text-morandi-indigo-deep dark:text-morandi-pearl">
          任务管理
        </h2>
      </div>
      <TaskForm />
      <TaskList />
    </div>
  );
}
