package com.bebop.os.api.services;

import java.util.List;
import java.util.UUID;

/**
 * Serviço que gerencia o comércio de itens raros (Black Market).
 * Demonstra o uso de imutabilidade e lógica de progressão.
 */
public class BlackMarketService {

    public record MarketItem(String id, String name, String type, long cost, double powerBoost) {}

    /**
     * Retorna o catálogo de itens disponíveis.
     * Mistura itens de Bebop (Hardware) e SAO (Software/Combat).
     */
    public List<MarketItem> getAvailableCatalog() {
        return List.of(
            new MarketItem("SW-01", "Plasma Cannon [Mk.I]", "HARDWARE", 500000, 15.5),
            new MarketItem("SAO-EL", "Elucidator [Carbon Steel]", "COMBAT", 1200000, 25.0),
            new MarketItem("SEC-BR", "Kernel Bypass Rootkit", "SECURITY", 300000, 10.0),
            new MarketItem("SW-ENG", "Hermes Engine Thruster", "HARDWARE", 800000, 18.2)
        );
    }

    /**
     * Valida se o jogador tem XP/Woolongs suficientes para o upgrade.
     */
    public boolean validatePurchase(long playerBalance, MarketItem item) {
        return playerBalance >= item.cost();
    }

    /**
     * Gera um certificado digital de posse do item (Simulando integridade).
     */
    public String generateOwnershipToken(UUID playerId, String itemId) {
        return "TOKEN-SIG-" + Integer.toHexString((playerId.toString() + itemId).hashCode()).toUpperCase();
    }
}