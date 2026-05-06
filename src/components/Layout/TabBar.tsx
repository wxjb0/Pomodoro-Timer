import type { TabType } from '../../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'timer', label: '专注', icon: 'fa-solid fa-clock' },
  { id: 'tasks', label: '任务', icon: 'fa-solid fa-circle-check' },
  { id: 'stats', label: '统计', icon: 'fa-solid fa-chart-column' },
  { id: 'settings', label: '设置', icon: 'fa-solid fa-gear' },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[env(safe-area-inset-bottom)]"
      role="tablist"
      aria-label="主导航"
    >
      <div className="max-w-md mx-auto">
        <div className="glass-strong rounded-2xl shadow-elevated mb-3 px-3 py-2 flex justify-around items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.label}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl min-w-[60px]
                  transition-all duration-300 ease-in-out
                  ${isActive
                    ? 'text-morandi-indigo dark:text-morandi-pearl'
                    : 'text-morandi-slate/50 dark:text-morandi-mist/40 hover:text-morandi-slate dark:hover:text-morandi-mist'
                  }
                `}
              >
                <i
                  className={`${tab.icon} icon-3d icon-3d-sm ${
                    isActive ? 'icon-3d-indigo' : ''
                  }`}
                />
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
