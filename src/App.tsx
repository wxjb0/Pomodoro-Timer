import { useState, useEffect } from 'react';
import type { TabType } from './types';
import { useStore } from './store/useStore';
import TabBar from './components/Layout/TabBar';
import TimerPage from './components/Timer/TimerPage';
import TaskPage from './components/Tasks/TaskPage';
import StatsPage from './components/Stats/StatsPage';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="ambient-bg" />

      <main className="relative z-10">
        {activeTab === 'timer' && <TimerPage />}
        {activeTab === 'tasks' && <TaskPage />}
        {activeTab === 'stats' && <StatsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
