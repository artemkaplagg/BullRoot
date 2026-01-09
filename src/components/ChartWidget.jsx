import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { theme } from '../styles/theme';

export const ChartWidget = ({ currentPrice }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    // 1. Настройка графика (Профессиональный конфиг)
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: theme.colors.background },
        textColor: theme.colors.textSecondary,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 400,
      
      // Включаем сетку, но делаем её тусклой
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      
      // Настройки перекрестия (курсора)
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 3,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },

      // Самое важное: ЗУМ и СКРОЛЛ
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.1)',
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 12,    // Отступ справа, чтобы было видно свечу
        barSpacing: 12,     // Ширина свечи (чем больше, тем ближе зум)
        minBarSpacing: 3,   // Минимальный зум (чтобы не сжалось в нитку)
        fixLeftEdge: true,  // Не даем уйти в пустоту слева
      },
      
      // Кинетическая прокрутка (инерция как на айфоне)
      kineticScroll: {
        touch: true,
        mouse: true,
      },
      
      // Скрываем логотип TradingView (если лицензия позволяет, для демо ок)
      attributionLogo: false, 
    });

    // 2. Добавляем серию свечей
    const candleSeries = chart.addCandlestickSeries({
      upColor: theme.colors.chartUp,
      downColor: theme.colors.chartDown,
      borderVisible: false,
      wickUpColor: theme.colors.chartUp,
      wickDownColor: theme.colors.chartDown,
      priceLineVisible: true, // Линия текущей цены
      priceLineWidth: 1,
      priceLineColor: theme.colors.call,
    });

    // 3. Генерируем начальную историю (последние 100 свечей), чтобы график не был пустым
    const initialData = [];
    let price = currentPrice || 1000;
    let time = Math.floor(Date.now() / 1000) - 100 * 60; // 100 минут назад

    for (let i = 0; i < 100; i++) {
      const volatility = 0.002;
      const change = price * (Math.random() - 0.5) * volatility;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.abs(change) * Math.random();
      const low = Math.min(open, close) - Math.abs(change) * Math.random();
      
      initialData.push({ time, open, high, low, close });
      time += 60; // Следующая минута
      price = close;
    }
    
    candleSeries.setData(initialData);

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // Ресайз при изменении окна
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []); // Запускаем 1 раз при старте

  // 4. Обновление цены в реальном времени
  useEffect(() => {
    if (seriesRef.current && currentPrice) {
      const now = Math.floor(Date.now() / 1000);
      // Округляем до текущей минуты, чтобы "строить" одну свечу, пока минута не пройдет
      // Для демо упростим: каждый тик - новая секунда
      
      // Получаем последнюю свечу
      // В реальном проекте тут сложнее логика накопления свечи
      const lastPrice = currentPrice;
      
      seriesRef.current.update({
        time: now,
        open: lastPrice,
        high: lastPrice + 0.0005,
        low: lastPrice - 0.0005,
        close: lastPrice,
      });
    }
  }, [currentPrice]);

  return (
    <div className="w-full h-full relative group">
      <div 
        ref={chartContainerRef} 
        className="w-full h-full"
        style={{ minHeight: '100%' }} // Важно для заполнения родителя
      />
    </div>
  );
};
