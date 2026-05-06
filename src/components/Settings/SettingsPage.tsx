import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestNotificationPermission } from '../../utils/notification';

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const [workTime, setWorkTime] = useState(settings.workTime);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [soundNotification, setSoundNotification] = useState(settings.soundNotification);
  const [desktopNotification, setDesktopNotification] = useState(settings.desktopNotification);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (workTime < 1 || workTime > 90) return;
    if (shortBreak < 1 || shortBreak > 30) return;
    if (longBreak < 5 || longBreak > 60) return;
    if (longBreakInterval < 1 || longBreakInterval > 10) return;

    if (desktopNotification) requestNotificationPermission();

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    updateSettings({
      workTime, shortBreak, longBreak, longBreakInterval,
      darkMode, soundNotification, desktopNotification,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen px-6 py-12 pb-28 max-w-lg mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-morandi-slate/40 dark:text-morandi-mist/30 mb-2">
          Preferences
        </h1>
        <h2 className="text-xl font-semibold text-morandi-indigo-deep dark:text-morandi-pearl">
          系统设置
        </h2>
      </div>

      <div className="space-y-5">
        <section className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <i className="fa-solid fa-clock icon-3d icon-3d-amber" />
            <span className="text-xs font-medium text-morandi-slate/60 dark:text-morandi-mist/50">时长设置</span>
          </div>
          <div className="space-y-4">
            <NumberSetting label="专注时长" unit="分钟" value={workTime} onChange={setWorkTime} min={1} max={90} />
            <NumberSetting label="短休息" unit="分钟" value={shortBreak} onChange={setShortBreak} min={1} max={30} />
            <NumberSetting label="长休息" unit="分钟" value={longBreak} onChange={setLongBreak} min={5} max={60} />
            <NumberSetting label="长休息间隔" unit="个番茄" value={longBreakInterval} onChange={setLongBreakInterval} min={1} max={10} />
          </div>
        </section>

        <section className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <i className="fa-solid fa-sliders icon-3d icon-3d-indigo" />
            <span className="text-xs font-medium text-morandi-slate/60 dark:text-morandi-mist/50">外观与提醒</span>
          </div>
          <div className="space-y-4">
            <ToggleSetting label="深色模式" icon="fa-solid fa-moon" variant="icon-3d-indigo" checked={darkMode} onChange={setDarkMode} />
            <ToggleSetting label="声音提醒" icon="fa-solid fa-bell" variant="icon-3d-sage" checked={soundNotification} onChange={setSoundNotification} />
            <ToggleSetting label="桌面通知" icon="fa-solid fa-envelope" variant="icon-3d-amber" checked={desktopNotification} onChange={setDesktopNotification} />
          </div>
        </section>

        <button
          onClick={handleSave}
          className={`
            w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out
            hover:scale-[1.01] active:scale-[0.99]
            ${saved
              ? 'bg-morandi-sage text-white shadow-soft-md'
              : 'btn-primary'
            }
          `}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-check text-xs" />
              已保存
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-floppy-disk text-xs" />
              保存设置
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function NumberSetting({
  label, unit, value, onChange, min, max,
}: {
  label: string; unit: string; value: number;
  onChange: (v: number) => void; min: number; max: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-morandi-indigo-deep dark:text-morandi-pearl">{label}</span>
        <span className="text-[10px] text-morandi-slate/40 dark:text-morandi-mist/30 ml-1.5">{unit}</span>
      </div>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 px-2 py-1.5 input-base text-center text-xs tabular-nums"
      />
    </div>
  );
}

function ToggleSetting({
  label, icon, variant, checked, onChange,
}: {
  label: string; icon: string; variant: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <i className={`${icon} icon-3d icon-3d-sm ${variant}`} />
        <span className="text-sm text-morandi-indigo-deep dark:text-morandi-pearl">{label}</span>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out
          ${checked ? 'bg-morandi-indigo' : 'bg-morandi-cloud dark:bg-morandi-slate/30'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-soft
            transition-transform duration-300 ease-in-out
            ${checked ? 'translate-x-5' : ''}
          `}
        />
      </button>
    </div>
  );
}
