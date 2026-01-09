import React, { useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { useFakeActivity } from './hooks/useFakeActivity';
import { theme } from './styles/theme';
import { ChartWidget } from './components/ChartWidget';
import { TradePanel } from './components/TradePanel';
import { Zap, Menu, User } from 'lucide-react';

function App() {
  const store = useGameStore();
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Обработчики симуляции
  const handlePriceWiggle = (impact) => {
    store.setBullPrice(prev => Math.max(0.0001, prev * (1 + impact)));
  };
  
  const handleMassiveTrade = (activity) => {
    console.log("Whale Alert:", activity);
  };

  // Запускаем бота активности
  useFakeActivity(handlePriceWiggle, handleMassiveTrade);

  const handleTrade = (direction) => {
    // Простая логика сделки
    console.log(`Trade ${direction} executed`);
    store.setBalance(prev => prev - 100); // Списываем ставку
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: theme.colors.background }}>
      
      {/* Верхний Хедер */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-800" style={{ background: theme.colors.surface }}>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-800 rounded">
            <Menu className="text-gray-400" />
          </button>
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="bg-blue-600 p-1 rounded">
              <Zap size={16} fill="white" />
            </div>
            <span>Pocket Clone</span>
          </div>
          
          {/* Выбор актива */}
          <div className="hidden md:flex ml-4 gap-2">
            <button className="px-3 py-1 bg-[#2a2e39] rounded text-white text-sm hover:bg-gray-700 transition">
              BTC/USD <span className="text-green-400 ml-1">92%</span>
            </button>
            <button className="px-3 py-1 bg-transparent rounded text-gray-400 text-sm hover:bg-gray-800 transition">
              ETH/USD <span className="text-green-400 ml-1">85%</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#26a69a] px-3 py-1 rounded text-white font-bold text-sm">
            ДЕМ СЧЕТ
          </div>
          <div className="text-white font-mono font-bold">
            ${store.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-300" />
          </div>
        </div>
      </header>

      {/* Основная рабочая область */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* График (занимает всё свободное место) */}
        <div className="flex-1 relative bg-[#131722]">
          <ChartWidget currentPrice={store.bullPrice} />
          
          {/* Плавающее инфо об активе на мобилке */}
          <div className="absolute top-4 left-4 md:hidden bg-[#2a2e39] p-2 rounded z-10 opacity-90">
            <div className="text-white font-bold">BTC/USD (OTC)</div>
            <div className="text-green-400 text-sm">+92%</div>
          </div>
        </div>

        {/* Панель управления (сбоку на ПК, снизу на телефоне) */}
        <TradePanel 
          balance={store.balance}
          leverage={store.leverage}
          setLeverage={store.setLeverage}
          onTrade={handleTrade}
        />

      </main>
    </div>
  );
}

export default App;
