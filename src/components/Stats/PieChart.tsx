import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    if (data.length === 0) {
      chart.setOption({
        graphic: {
          type: 'group',
          left: 'center',
          top: 'middle',
          children: [{
            type: 'text',
            style: { text: '暂无数据', fontSize: 12, fill: '#a0aec0', textAlign: 'center' },
          }],
        },
      });
    } else {
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: 'rgba(74,85,104,0.08)',
          borderWidth: 1,
          textStyle: { color: '#2d3748', fontSize: 12 },
        },
        series: [{
          type: 'pie',
          radius: ['42%', '72%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, fontSize: 10, color: '#718096', formatter: '{b}\n{d}%' },
          labelLine: { length: 10, length2: 12 },
          data,
        }],
        color: ['#4a5568', '#7a9e7e', '#c4756e', '#c6955a'],
      });
    }

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); chart.dispose(); instanceRef.current = null; };
  }, [data]);

  return (
    <div className="glass rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center gap-3 mb-4">
        <i className="fa-solid fa-chart-pie icon-3d icon-3d-rose icon-3d-sm" />
        <span className="text-xs font-medium text-morandi-slate/60 dark:text-morandi-mist/50">任务类型占比</span>
      </div>
      <div ref={chartRef} className="w-full h-44" />
    </div>
  );
}
