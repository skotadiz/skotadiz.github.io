import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CardinalHUD: Interface de Sincronização de Alto Nível.
 * Mistura o status de HP (SAO) com telemetria da Swordfish II (Bebop).
 */
export const CardinalHUD = ({ playerStats, shipStatus }) => {
  const [syncRate, setSyncRate] = useState(0);

  // Efeito de pulso para simular conexão neural
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncRate(prev => Math.min(100, prev + Math.random() * 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDanger = useMemo(() => playerStats.hp < 20, [playerStats.hp]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`neural-interface ${isDanger ? 'alert-mode' : ''}`}
    >
      <div className="hud-header">
        <span className="unit-id">UNIT-01: SPIKE_REPLICA</span>
        <span className="sync-value">{syncRate.toFixed(1)}% SYNC</span>
      </div>

      <div className="gauge-container">
        {/* Barra de HP estilo SAO com degradê dinâmico */}
        <div className="hp-bar-wrapper">
          <motion.div 
            className="hp-fill"
            animate={{ width: `${playerStats.hp}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{ backgroundColor: playerStats.hp > 50 ? '#06ffa5' : '#e63946' }}
          />
        </div>
        
        {/* Telemetria Bebop */}
        <div className="ship-telemetry">
          <p>FUEL_RODS: {shipStatus.fuel}%</p>
          <p>THRUST_VECTOR: {shipStatus.vector}</p>
        </div>
      </div>
      
      <AnimatePresence>
        {syncRate >= 100 && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="link-start-banner"
          >
            LINK START - FULL DIVE READY
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};