import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Simula a transição entre o mundo físico (Bebop) e o virtual (SAO).
 */
export const HyperspaceDive = () => {
  const [isDiving, setIsDiving] = useState(false);

  const startDive = () => {
    setIsDiving(true);
    setTimeout(() => setIsDiving(false), 3000);
  };

  return (
    <div className="dive-system">
      <button onClick={startDive} className="btn-dive">
        LINK START: HYPERSPACE
      </button>

      {isDiving && (
        <motion.div 
          initial={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          className="dive-overlay"
        >
          <div className="dive-tunnel">
            <div className="portal-rings">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ rotate: 360, scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="ring"
                />
              ))}
            </div>
            <h2 className="dive-text">Sincronizando com o Cardinal...</h2>
          </div>
        </motion.div>
      )}
    </div>
  );
};