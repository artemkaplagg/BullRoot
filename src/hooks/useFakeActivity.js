import { useState, useEffect } from 'react';

const NPC_TRADERS = [
  '@nightfalcon', '@urbanecho', '@softpixel', '@coldcomet', 
  '@neonwaves', '@silentorbit', '@lazyasteroid', '@darkmint', 
  '@echovoid', '@pixelrain'
];

const ASSETS = ['BTC', 'ETH', 'TON', '$BULL'];

export const useFakeActivity = (onPriceWiggle, onMassiveTrade) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const generateActivity = () => {
      const trader = NPC_TRADERS[Math.floor(Math.random() * NPC_TRADERS.length)];
      const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
      const leverage = [1, 5, 10, 25, 50, 75, 100][Math.floor(Math.random() * 7)];
      const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
      const amount = Math.floor(Math.random() * 10000) + 100;
      
      const isMassive = leverage >= 75 && Math.random() > 0.7;
      
      const activity = {
        id: Date.now() + Math.random(),
        trader,
        direction,
        leverage,
        asset,
        amount,
        timestamp: new Date(),
        isMassive
      };
      
      // Оставляем только последние 20 записей
      setActivities(prev => [activity, ...prev].slice(0, 20));
      
      // Если торгуют нашим токеном, цена немного дергается
      if (asset === '$BULL') {
        const priceImpact = (leverage / 100) * (Math.random() * 0.02 - 0.01);
        onPriceWiggle(direction === 'LONG' ? priceImpact : -priceImpact);
      }
      
      // Если крупная сделка - вызываем событие
      if (isMassive) {
        onMassiveTrade(activity);
      }
    };

    // Стартовая генерация (чтобы лента не была пустой при запуске)
    for (let i = 0; i < 5; i++) {
      setTimeout(generateActivity, i * 1000);
    }

    // Бесконечный цикл активности
    const interval = setInterval(() => {
      generateActivity();
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, [onPriceWiggle, onMassiveTrade]);

  return activities;
};
