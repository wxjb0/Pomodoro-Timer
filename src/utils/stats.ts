import type { PomodoroRecord, TimeDimension, TaskTag } from '../types';

function getRangeStart(dimension: TimeDimension): Date {
  const now = new Date();
  const start = new Date(now);

  switch (dimension) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week': {
      const day = start.getDay();
      start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return start;
}

export function filterRecords(
  records: PomodoroRecord[],
  dimension: TimeDimension
): PomodoroRecord[] {
  const start = getRangeStart(dimension);
  return records.filter((r) => new Date(r.time) >= start);
}

export function calcTotalPomodoros(records: PomodoroRecord[]): number {
  return records.length;
}

export function calcTotalMinutes(records: PomodoroRecord[]): number {
  return records.reduce((sum, r) => sum + r.duration, 0);
}

export function calcStreakDays(records: PomodoroRecord[]): number {
  if (records.length === 0) return 0;

  const days = new Set(
    records.map((r) => {
      const d = new Date(r.time);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(check.getDate() - i);
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;

    if (days.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      break;
    }
  }

  return streak;
}

export function calcTrendData(
  records: PomodoroRecord[],
  dimension: TimeDimension
): { labels: string[]; values: number[] } {
  const now = new Date();

  if (dimension === 'day') {
    const labels: string[] = [];
    const values: number[] = new Array(24).fill(0);
    for (let h = 0; h < 24; h++) {
      labels.push(`${h}:00`);
    }
    records.forEach((r) => {
      const d = new Date(r.time);
      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      ) {
        values[d.getHours()]++;
      }
    });
    return { labels, values };
  }

  if (dimension === 'week') {
    const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const values = new Array(7).fill(0);
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
    weekStart.setHours(0, 0, 0, 0);

    records.forEach((r) => {
      const d = new Date(r.time);
      if (d >= weekStart) {
        const idx = (d.getDay() + 6) % 7;
        values[idx]++;
      }
    });
    return { labels, values };
  }

  // month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const labels: string[] = [];
  const values: number[] = new Array(daysInMonth).fill(0);
  for (let d = 1; d <= daysInMonth; d++) {
    labels.push(`${d}日`);
  }
  records.forEach((r) => {
    const d = new Date(r.time);
    if (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    ) {
      values[d.getDate() - 1]++;
    }
  });
  return { labels, values };
}

export function calcTagDistribution(
  records: PomodoroRecord[]
): { name: string; value: number }[] {
  const TAG_NAMES: Record<TaskTag, string> = {
    work: '工作',
    study: '学习',
    personal: '个人',
    other: '其他',
  };

  const map = new Map<TaskTag, number>();
  records.forEach((r) => {
    map.set(r.tag, (map.get(r.tag) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([tag, count]) => ({ name: TAG_NAMES[tag], value: count }))
    .filter((item) => item.value > 0);
}
