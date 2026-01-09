import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { theme } from '../styles/theme';

export const ChartWidget = ({ currentPrice, priceHistory }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    // Инициализация графика
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: theme.colors.background },
        textColor: theme.colors.textSecondary,
      },
      grid: {
        vertLines: { color: theme.colors.grid },
        horzLines: { color: theme.colors.grid },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: theme.colors.chartUp,
      downColor: theme.colors.chartDown,
      borderVisible: false,
      wickUpColor: theme.colors.chartUp,
      wickDownColor: theme.colors.chartDown,
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // Авто-ресайз
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Обновление данных
  useEffect(() => {
    if (seriesRef.current && currentPrice) {
      // Здесь мы имитируем свечу. В реальном проекте нужно накапливать тики.
      // Для упрощения сейчас просто обновляем последнюю точку.
      const time = Math.floor(Date.now() / 1000);
      
      // Простой апдейт для симуляции движения
      seriesRef.current.update({
        time: time,
        open: currentPrice,
        high: currentPrice + 0.0001,
        low: currentPrice - 0.0001,
        close: currentPrice,
      });
    }
  }, [currentPrice]);

  return (
    <div className="w-full relative group">
      <div 
        ref={chartContainerRef} 
        className="w-full h-[400px] md:h-[500px]"
      />
      {/* Текущая цена (плашка) */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-1 text-sm font-bold rounded-l z-10">
        {currentPrice?.toFixed(5)}
      </div>
    </div>
  );
};
