import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import type { TimeDimension } from '../../types';
import {
  filterRecords, calcTotalPomodoros, calcTotalMinutes,
  calcStreakDays, calcTrendData, calcTagDistribution,
} from '../../utils/stats';
import StatsCards from './StatsCards';
import TrendChart from './TrendChart';
import PieChart from './PieChart';

const DIMENSIONS: { id: TimeDimension; label: string }[] = [
  { id: 'day', label: '今日' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
];

export default function StatsPage() {
  const [dimension, setDimension] = useState<TimeDimension>('day');
  const pomodoros = useStore((s) => s.stats.pomodoros);

  const filtered = useMemo(() => filterRecords(pomodoros, dimension), [pomodoros, dimension]);
  const trend = useMemo(() => calcTrendData(pomodoros, dimension), [pomodoros, dimension]);
  const distribution = useMemo(() => calcTagDistribution(filtered), [filtered]);

  return (
    <div className="min-h-screen px-6 py-12 pb-28 max-w-lg mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-morandi-slate/40 dark:text-morandi-mist/30 mb-2">
          Analytics
        </h1>
        <h2 className="text-xl font-semibold text-morandi-indigo-deep dark:text-morandi-pearl">
          数据统计
        </h2>
      </div>

      {/* Dimension switcher */}
      <div className="flex gap-2 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {DIMENSIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDimension(d.id)}
            className={`
              px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ease-in-out
              ${dimension === d.id
                ? 'bg-morandi-indigo text-white shadow-soft-md'
                : 'bg-morandi-pearl/50 dark:bg-morandi-slate/12 text-morandi-slate/60 dark:text-morandi-mist/50 hover:bg-morandi-cloud/50 dark:hover:bg-morandi-slate/20'
              }
            `}
          >
            {d.label}
          </button>
        ))}
      </div>

      <StatsCards
        totalPomodoros={calcTotalPomodoros(filtered)}
        totalMinutes={calcTotalMinutes(filtered)}
        streakDays={calcStreakDays(pomodoros)}
      />
      <TrendChart labels={trend.labels} values={trend.values} />
      <PieChart data={distribution} />
    </div>
  );
}
