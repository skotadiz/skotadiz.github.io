package com.bebop.os.api.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Service de alto nível para processamento de recompensas intergalácticas.
 * Integra o conceito de "Boss Level" (SAO) com "WANTED" (Bebop).
 */
public class BountyHunterService {

    /**
     * Record que define um alvo de recompensa. 
     * Adicionado o campo 'securityHash' para simular integridade de dados.
     */
    public record Target(UUID id, String name, long reward, int dangerLevel, 
                        String floor, String status, String securityHash) {}

    private final List<Target> database = new ArrayList<>();

    /**
     * Filtra alvos de alto nível (S-Rank) usando Streams.
     */
    public List<Target> getHighValueTargets() {
        return database.stream()
                .filter(t -> t.dangerLevel() > 75)
                .sorted(Comparator.comparing(Target::reward).reversed())
                .toList();
    }

    /**
     * Executa o cálculo de probabilidade de captura (Neural Logic).
     */
    public double calculateSuccessRate(int playerLevel, Target target) {
        if (target.dangerLevel() <= 0) return 99.9;

        // Se o nível do jogador for menor que o do alvo, a chance cai drasticamente
        double baseChance = (playerLevel / (double) target.dangerLevel()) * 100;
        
        // Refatorado para evitar boxing com Optional e melhorar a legibilidade
        double clamped = Math.min(99.9, baseChance);
        return Math.max(1.0, clamped);
    }
    
    /**
     * Simula o drop de itens de alta raridade (Ex: Elucidator ou Peças da Swordfish).
     */
    public String calculateLoot(Target target) {
        double roll = Math.random() * 100;
        if (roll > 95.0) return "LEGENDARY: [Dark Repulser Core]";
        if (roll > 80.0) return "RARE: [Swordfish II Thruster]";
        return "COMMON: [Woolong Scrap]";
    }

    /**
     * Registra um novo Boss de Andar no sistema Cardinal.
     */
    public Target createFloorBossBounty(int floor, String bossName, long woolongs) {
        UUID newId = UUID.randomUUID();
        String integrityHash = Integer.toHexString(Objects.hash(newId, bossName, woolongs));
        
        Target boss = new Target(newId, 
                         bossName, 
                         woolongs, 
                         floor + 50, // Bosses de andar são muito mais perigosos (S-Rank)
                         "Floor " + floor, 
                         "ACTIVE",
                         "SHA-BEBOP-" + integrityHash.toUpperCase());
        
        // Profissionalmente: Adicionar ao banco de dados em memória
        database.add(boss);
        return boss;
    }

    /**
     * Simula o resultado de um combate contra um Boss de Andar.
     * Mistura probabilidade estatística com o nível atual do jogador.
     */
    public DuelResult challengeBoss(int currentPlayerLevel, UUID bossId) {
        return database.stream()
                .filter(t -> t.id().equals(bossId) && t.status().equals("ACTIVE"))
                .findFirst()
                .map(target -> {
                    double chance = calculateSuccessRate(currentPlayerLevel, target);
                    boolean success = (Math.random() * 100) <= chance;
                    
                    if (success) {
                        String summary = defeatTarget(target.id());
                        return new DuelResult(true, chance, summary);
                    }
                    return new DuelResult(false, chance, "CONNECTION LOST: System eject. You were not strong enough to clear this floor.");
                })
                .orElse(new DuelResult(false, 0, "ERROR: Target not found."));
    }

    public record DuelResult(boolean success, double winProbability, String message) {}

    /**
     * Finaliza um contrato de Boss. No mundo de SAO, isso seria o "Floor Cleared".
     */
    public String defeatTarget(UUID targetId) {
        return database.stream()
                .filter(t -> t.id().equals(targetId))
                .findFirst()
                .map(t -> {
                    database.remove(t);
                    database.add(new Target(t.id(), t.name(), t.reward(), t.dangerLevel(), 
                                          t.floor(), "CLEARED", t.securityHash()));
                    
                    String loot = calculateLoot(t);
                    return String.format("CONGRATULATIONS! Floor Boss %s defeated. Reward: %d Woolongs. Loot: %s", 
                                        t.name(), t.reward(), loot);
                })
                .orElse("ERROR: Target not found in Cardinal Database.");
    }

    public void broadcastWantedNotice(Target target) {
        System.out.println("ISSSP ALERT: New target identified in Sector 7.");
        System.out.printf("TARGET: %s | REWARD: %d Woolongs | THREAT: %d%n", 
            target.name(), target.reward(), target.dangerLevel());
    }
}