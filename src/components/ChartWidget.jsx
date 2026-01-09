import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export const ChartWidget = ({ candles, currentPrice }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    // Настройки графика "как у профи"
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' }, // Темно-синий фон
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' }, // Очень тусклая сетка
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
        barSpacing: 10, // Ширина свечей
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          style: 3,
          labelBackgroundColor: '#2B2B43',
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',        // Зеленый
      downColor: '#ef5350',      // Красный
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Ресайз
    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Обновление данных при приходе новых свечей с Бинанса
  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      // Если загрузили историю первый раз
      if (candles.length > 1 && seriesRef.current.data().length < 2) {
        seriesRef.current.setData(candles);
      } else {
        // Обновляем только последнюю свечу в реальном времени
        const lastCandle = candles[candles.length - 1];
        seriesRef.current.update(lastCandle);
      }
    }
  }, [candles]);

  return (
    <div className="w-full h-full relative">
      <div ref={chartContainerRef} className="w-full h-full" />
      
      {/* Плашка с текущей ценой */}
      <div className={`absolute top-4 left-4 px-3 py-2 rounded shadow-lg z-10 
        ${candles.length > 0 && candles[candles.length-1].close >= candles[candles.length-1].open ? 'bg-[#26a69a]' : 'bg-[#ef5350]'}`}>
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <span>BTC/USDT</span>
          <span className="bg-white bg-opacity-20 px-1 rounded text-sm">82%</span>
        </div>
        <div className="text-white font-mono text-xl font-bold tracking-wider">
            {currentPrice ? currentPrice.toFixed(2) : 'Loading...'}
        </div>
      </div>
    </div>
  );
};
