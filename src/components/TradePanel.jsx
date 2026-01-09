import React from 'react';
import { theme } from '../styles/theme';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';

export const TradePanel = ({ balance, leverage, setLeverage, onTrade }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 md:relative md:w-80 md:border-t-0 md:border-l flex flex-col gap-4" 
         style={{ background: theme.colors.surface }}>
      
      {/* Баланс и настройки */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#2a2e39] p-3 rounded-lg">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} /> Время
          </div>
          <div className="text-white font-bold text-lg">00:01:00</div>
        </div>
        <div className="bg-[#2a2e39] p-3 rounded-lg">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <DollarSign size={12} /> Сумма
          </div>
          <input 
            type="number" 
            value={100} // Хардкод для примера
            className="bg-transparent text-white font-bold text-lg w-full outline-none"
            readOnly
          />
        </div>
      </div>

      {/* Прибыльность */}
      <div className="text-center text-gray-400 text-sm">
        Выплата: <span className="text-green-400 font-bold">92%</span>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button
          onClick={() => onTrade('LONG')}
          className="flex flex-col items-center justify-center py-4 rounded-lg transition-transform active:scale-95 hover:brightness-110"
          style={{ background: theme.colors.call, boxShadow: theme.shadows.callGlow }}
        >
          <div className="flex items-center gap-1 text-white font-bold text-lg">
            <TrendingUp size={24} />
            ВВЕРХ
          </div>
          <span className="text-xs text-green-100 opacity-80">CALL</span>
        </button>

        <button
          onClick={() => onTrade('SHORT')}
          className="flex flex-col items-center justify-center py-4 rounded-lg transition-transform active:scale-95 hover:brightness-110"
          style={{ background: theme.colors.put, boxShadow: theme.shadows.putGlow }}
        >
          <div className="flex items-center gap-1 text-white font-bold text-lg">
            <TrendingDown size={24} />
            ВНИЗ
          </div>
          <span className="text-xs text-red-100 opacity-80">PUT</span>
        </button>
      </div>
    </div>
  );
};
