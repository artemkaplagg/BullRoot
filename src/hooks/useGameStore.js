import { useState } from 'react';

export const useGameStore = () => {
  const [balance, setBalance] = useState(10000.00);
  const [onlineUsers, setOnlineUsers] = useState(7);
  const [currentAsset, setCurrentAsset] = useState('BTC');
  const [leverage, setLeverage] = useState(1);
  const [bullPrice, setBullPrice] = useState(0.0234);
  const [positions, setPositions] = useState([]);
  const [exposure, setExposure] = useState({ long: 0, short: 0 });

  return {
    balance,
    setBalance,
    onlineUsers,
    setOnlineUsers,
    currentAsset,
    setCurrentAsset,
    leverage,
    setLeverage,
    bullPrice,
    setBullPrice,
    positions,
    setPositions,
    exposure,
    setExposure
  };
};
