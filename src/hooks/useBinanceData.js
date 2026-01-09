import { useState, useEffect, useRef } from 'react';

export const useBinanceData = () => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [candles, setCandles] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // 1. Сначала грузим историю (последние 100 свечей), чтобы график не был пустым
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100');
        const data = await res.json();
        
        const formattedCandles = data.map(c => ({
          time: c[0] / 1000,
          open: parseFloat(c[1]),
          high: parseFloat(c[2]),
          low: parseFloat(c[3]),
          close: parseFloat(c[4]),
        }));

        setCandles(formattedCandles);
        setCurrentPrice(formattedCandles[formattedCandles.length - 1].close);
      } catch (error) {
        console.error("Ошибка загрузки истории:", error);
      }
    };

    fetchHistory();

    // 2. Подключаем WebSocket для Real-time обновлений
    ws.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const k = message.k; // Данные свечи

      const newCandle = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      };

      setCurrentPrice(newCandle.close);

      // Обновляем состояние свечей (добавляем новую или обновляем текущую)
      setCandles(prev => {
        const lastCandle = prev[prev.length - 1];
        if (!lastCandle) return [newCandle];

        if (lastCandle.time === newCandle.time) {
          // Обновляем текущую минуту
          const updated = [...prev];
          updated[updated.length - 1] = newCandle;
          return updated;
        } else {
          // Новая минута - добавляем новую свечу
          return [...prev, newCandle];
        }
      });
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return { currentPrice, candles };
};
