import React, { useState, useEffect } from 'react';
import { useBinanceData } from './hooks/useBinanceData'; // Новый хук
import { ChartWidget } from './components/ChartWidget';
import { TradePanel } from './components/TradePanel';
import { Zap, Menu, User } from 'lucide-react';
import { theme } from './styles/theme';

function App() {
  const { currentPrice, candles } = useBinanceData(); // Данные с Бинанса
  const [balance, setBalance] = useState(10000);
  
  // Инициализация Telegram
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#131722');
      window.Telegram.WebApp.setBackgroundColor('#131722');
    }
  }, []);

  const handleTrade = (direction) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }
    console.log(`Open ${direction} at ${currentPrice}`);
    // Пока просто списываем визуально
    setBalance(prev => prev - 100);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#131722] text-white font-sans">
      
      {/* Хедер (Стиль Pocket Option) */}
      <header className="h-14 min-h-[56px] flex items-center justify-between px-3 border-b border-[#2a2e39] bg-[#1c2030] z-20">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-[#2a2e39] rounded transition">
            <Menu className="text-gray-400" size={24} />
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-blue-600 p-1 rounded-lg shadow-lg shadow-blue-500/20">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="hidden sm:block">PO Trade</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Demo Account</span>
            <span className="text-[#26a69a] font-bold font-mono text-lg leading-none">
              ${balance.toLocaleString()}
            </span>
          </div>
          
          <div className="w-9 h-9 bg-[#2a2e39] rounded-lg flex items-center justify-center border border-[#363a45]">
            <User size={18} className="text-gray-300" />
          </div>
          
          <button className="bg-[#26a69a] hover:bg-[#2bbbad] text-white font-bold py-1.5 px-4 rounded-lg text-sm shadow-[0_4px_10px_rgba(38,166,154,0.3)] transition-all active:scale-95 hidden sm:block">
            DEPOSIT
          </button>
        </div>
      </header>

      {/* Основная область */}
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* График - занимает всё пространство */}
        <div className="flex-1 relative bg-[#131722]">
            {/* Если данных нет - показываем лоадер */}
            {candles.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Connecting to Binance...
                </div>
            ) : (
                <ChartWidget candles={candles} currentPrice={currentPrice} />
            )}
        </div>

        {/* Панель управления */}
        <TradePanel 
          balance={balance}
          onTrade={handleTrade}
        />

      </main>
    </div>
  );
}

export default App;
