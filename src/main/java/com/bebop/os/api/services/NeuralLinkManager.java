package com.bebop.os.api.services;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Gerencia a conexão entre a consciência do usuário (SAO) e o hardware da Bebop.
 * Profissionalmente, isso simula um Session Manager ou State Manager.
 */
public class NeuralLinkManager {
    
    private final Map<UUID, PlayerStats> sessionCache = new HashMap<>();

    public record PlayerStats(int level, double syncRate, String gearStatus) {}

    /**
     * Sincroniza o nível de experiência detectado no frontend com o backend.
     * O 'syncRate' aumenta conforme o usuário interage com o portfólio.
     */
    public PlayerStats syncNeuralData(UUID sessionId, int currentXP) {
        int calculatedLevel = (currentXP / 10) + 1;
        double syncRate = Math.min(100.0, 45.5 + (calculatedLevel * 2.5));
        
        PlayerStats stats = new PlayerStats(
            calculatedLevel, 
            syncRate, 
            syncRate > 80 ? "BURST_LINK_READY" : "STABLE"
        );
        
        sessionCache.put(sessionId, stats);
        return stats;
    }

    /**
     * Verifica se o link neural está estável para operações críticas (Duelos).
     */
    public boolean isLinkStable(UUID sessionId) {
        PlayerStats stats = sessionCache.get(sessionId);
        return stats != null && stats.syncRate() > 50.0;
    }
}