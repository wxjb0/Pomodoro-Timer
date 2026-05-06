interface StatsCardsProps {
  totalPomodoros: number;
  totalMinutes: number;
  streakDays: number;
}

const cards = [
  { label: '专注次数', icon: 'fa-solid fa-clock', variant: 'icon-3d-indigo' },
  { label: '专注时长', icon: 'fa-solid fa-stopwatch', variant: 'icon-3d-sage' },
  { label: '连续天数', icon: 'fa-solid fa-fire', variant: 'icon-3d-amber' },
];

export default function StatsCards({ totalPomodoros, totalMinutes, streakDays }: StatsCardsProps) {
  const values = [totalPomodoros, totalMinutes, streakDays];
  const units = ['次', '分钟', '天'];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="glass rounded-2xl p-4 text-center animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <i className={`${card.icon} icon-3d ${card.variant} mx-auto mb-3`} />
          <div className="text-2xl font-semibold text-morandi-indigo-deep dark:text-morandi-pearl tabular-nums">
            {values[i]}
          </div>
          <div className="text-[10px] text-morandi-slate/50 dark:text-morandi-mist/40 mt-1 tracking-wide">
            {card.label}
          </div>
          <div className="text-[9px] text-morandi-slate/30 dark:text-morandi-mist/20 mt-0.5">
            {units[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
