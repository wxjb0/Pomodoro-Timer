import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TrendChartProps {
  labels: string[];
  values: number[];
}

export default function TrendChart({ labels, values }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.dispose();

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: 'rgba(74,85,104,0.08)',
        borderWidth: 1,
        textStyle: { color: '#2d3748', fontSize: 12 },
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(74,85,104,0.04)' } },
      },
      grid: { left: 36, right: 16, top: 16, bottom: 28 },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontSize: 9, color: '#a0aec0', interval: 'auto' },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { fontSize: 9, color: '#a0aec0' },
        splitLine: { lineStyle: { color: 'rgba(74,85,104,0.05)', type: 'dashed' } },
        axisLine: { show: false },
      },
      series: [{
        type: 'bar',
        data: values,
        barMaxWidth: 20,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4a5568' },
            { offset: 1, color: 'rgba(74,85,104,0.15)' },
          ]),
        },
      }],
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); chart.dispose(); instanceRef.current = null; };
  }, [labels, values]);

  return (
    <div className="glass rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-3 mb-4">
        <i className="fa-solid fa-chart-simple icon-3d icon-3d-indigo icon-3d-sm" />
        <span className="text-xs font-medium text-morandi-slate/60 dark:text-morandi-mist/50">专注趋势</span>
      </div>
      <div ref={chartRef} className="w-full h-44" />
    </div>
  );
}
