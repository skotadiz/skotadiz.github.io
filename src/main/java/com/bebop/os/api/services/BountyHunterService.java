package com.bebop.os.api.services;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

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

    private final Map<UUID, Target> database = new ConcurrentHashMap<>();
    private final NeuralLinkManager neuralLinkManager;

    public BountyHunterService(NeuralLinkManager neuralLinkManager) {
        this.neuralLinkManager = neuralLinkManager;
        // Inicializa com alvos padrão para o Sistema Cardinal
        createFloorBossBounty(74, "THE GLEAM EYES", 50000000);
        createFloorBossBounty(90, "THE FATAL SCYTHE", 150000000);
        createFloorBossBounty(100, "HEATHCLIFF", 1000000000);
        createSyndicateTarget("VICIOUS", 300000000, 99);
    }

    /**
     * Filtra alvos de alto nível (S-Rank) usando Streams.
     */
    public List<Target> getHighValueTargets() {
        return database.values().stream()
                .filter(t -> t.dangerLevel() > 75)
                .sorted(Comparator.comparing(Target::reward).reversed())
                .toList();
    }

    /**
     * Executa o cálculo de probabilidade de captura (Neural Logic).
     */
    public double calculateSuccessRate(int playerLevel, double equipmentBonus, Target target) {
        if (target.dangerLevel() <= 0) return 99.9;

        // Agora o cálculo integra o bônus de equipamento do BlackMarketService
        double combatPower = playerLevel + equipmentBonus;
        double baseChance = (combatPower / (double) target.dangerLevel()) * 100;
        
        // Refatorado para evitar boxing com Optional e melhorar a legibilidade
        double clamped = Math.min(99.9, baseChance);
        return Math.max(1.0, clamped);
    }
    
    /**
     * Simula o drop de itens de alta raridade (Ex: Elucidator ou Peças da Swordfish).
     */
    public String calculateLoot(Target target) {
        if ("VICIOUS".equals(target.name())) return "LEGENDARY: [Red Dragon Katana]";

        // Sorte baseada no Danger Level e Floor: Alvos mais perigosos aumentam o piso do roll
        double floorFactor = target.floor().startsWith("Floor") ? 
                             Integer.parseInt(target.floor().replaceAll("\\D+", "")) * 0.5 : 0;
        double dangerBonus = (target.dangerLevel() * 0.15) + floorFactor;
        double roll = ThreadLocalRandom.current().nextDouble(100) + dangerBonus;

        if (roll > 115.0) return "MYTHIC: [Holy Sword Excalibur]";
        if (roll > 100.0) return "LEGENDARY: [Dark Repulser Core]";
        if (roll > 85.0) return "RARE: [Swordfish II Thruster]";
        if (roll > 60.0) return "UNCOMMON: [Woolong Credit Chip]";
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
        database.put(newId, boss);
        return boss;
    }

    /**
     * Registra alvos do Sindicato (Crossover Bebop).
     */
    public void createSyndicateTarget(String name, long reward, int threatLevel) {
        Target target = new Target(
            UUID.randomUUID(),
            name,
            reward,
            threatLevel,
            "Deep Space",
            "ACTIVE",
            "SHA-REDDRAGON-" + Integer.toHexString(name.hashCode()).toUpperCase()
        );
        database.put(target.id(), target);
    }

    /**
     * Simula o resultado de um combate contra um Boss de Andar.
     * Mistura probabilidade estatística com o nível atual do jogador.
     * Agora valida o estado do link neural antes de processar o duelo.
     */
    public DuelResult challengeBoss(UUID sessionId, UUID bossId) {
        // 1. Validar estabilidade do link (Sync Rate > 50%)
        if (!neuralLinkManager.isLinkStable(sessionId)) {
            return new DuelResult(false, 0, "NEURAL_LINK_ABORT: Sync Rate below safe threshold (50%). Active cooling required.");
        }

        NeuralLinkManager.PlayerStats stats = neuralLinkManager.getSessionStats(sessionId);
        Target target = database.get(bossId);

        if (target == null || !"ACTIVE".equals(target.status())) {
            return new DuelResult(false, 0, "CARDINAL_ERROR: Target not found in the current floor sector.");
        }

        // 2. Utiliza o combatPower calculado pelo NeuralLinkManager (Level + Bônus)
        double chance = calculateSuccessRate(stats.level(), stats.combatPower() - stats.level(), target);
        boolean success = ThreadLocalRandom.current().nextDouble(100) <= chance;

        // Aplica desgaste neural independente do resultado
        neuralLinkManager.applyStrain(sessionId, 12.5);

        if (success) {
            String summary = defeatTarget(bossId);
            return new DuelResult(true, chance, summary);
        }
        return new DuelResult(false, chance, "SYNC_LOSS: Neural feedback overload. System eject initiated to prevent brain damage.");
    }

    public record DuelResult(boolean success, double winProbability, String message) {}

    /**
     * Finaliza um contrato de Boss. No mundo de SAO, isso seria o "Floor Cleared".
     */
    public String defeatTarget(UUID targetId) {
        Target t = database.get(targetId);
        if (t == null) return "CARDINAL_ERROR: Target_ID mismatch in sector database.";

        Target cleared = new Target(t.id(), t.name(), t.reward(), t.dangerLevel(), 
                                   t.floor(), "CLEARED", t.securityHash());
        database.put(targetId, cleared);

        return String.format("FLOOR_CLEARED: Boss %s eliminated. Reward: %d ₩. Loot: %s", 
                            cleared.name(), cleared.reward(), calculateLoot(cleared));
    }

    /**
     * Executa um protocolo de meditação neural para restaurar a taxa de sincronização.
     * Demonstra a integração de lógica de recuperação no Cardinal System.
     */
    public String initiateMeditation(UUID sessionId) {
        NeuralLinkManager.PlayerStats stats = neuralLinkManager.getSessionStats(sessionId);
        if (stats == null) return "ERROR: No active neural session found.";
        
        neuralLinkManager.applyStrain(sessionId, -25.0); // Valor negativo recupera o Sync Rate
        return "RECOVERY_COMPLETE: Neural buffers cleared. Sync Rate stabilized.";
    }

    public void broadcastWantedNotice(Target target) {
        System.out.println("ISSSP ALERT: New target identified in Sector 7.");
        System.out.printf("TARGET: %s | REWARD: %d Woolongs | THREAT: %d%n", 
            target.name(), target.reward(), target.dangerLevel());
    }
}