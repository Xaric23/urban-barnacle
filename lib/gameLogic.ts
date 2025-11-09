// Game Logic and State Management for Underground Club Manager

import { GameState, Performer, PerformerType, Gender, Upgrade, ClothingSlot, Wardrobe, PersonalityArchetype, ThemedNightType, Rumor } from './types';
import { PERSONALITY_TRAITS, generateFullName, CLOTHING_CATALOG, SKILL_CARDS, CROWD_KINKS, PERSONALITY_ARCHETYPES, CHEMISTRY_COMPATIBILITY, THEMED_NIGHTS, EXPLICIT_PERFORMANCE_DESCRIPTIONS } from './constants';

export function createInitialGameState(): GameState {
  return {
    day: 1,
    money: 5000,
    reputation: 50,
    ethicsScore: 50,
    performers: [],
    relationships: {},
    storyFlags: {},
    completedEvents: [],
    upgrades: {},
    cityDemand: 100,
    genreTrend: {
      [PerformerType.DANCER]: 0,
      [PerformerType.SINGER]: 0,
      [PerformerType.DJ]: 0,
      [PerformerType.BARTENDER]: 0,
      [PerformerType.SECURITY]: 0,
    },
    riskLevel: 'standard',
    eventCooldowns: {},
    eventHistory: [],
    lastEventDay: 0,
    ownedClothing: [],
    
    // New fields
    crowdMood: initializeCrowdMood(),
    seasonalTrends: [],
    viralTrends: [],
    activeRumors: [],
    dramaLevel: 0,
    stageProps: [],
    activeEffects: [],
    maintenanceCost: 0,
    rivalClubs: [
      { name: "The Velvet Underground", strength: 60, aggression: 50, lastSabotage: 0 },
      { name: "Crimson Palace", strength: 70, aggression: 70, lastSabotage: 0 },
      { name: "Midnight Oasis", strength: 50, aggression: 30, lastSabotage: 0 },
    ],
    fame: 0,
    camShowBranch: false,
    vipWebsite: false,
    managedTroupes: [],
    availableCards: SKILL_CARDS.slice(0, 6), // Start with 6 basic cards
    usedCardsThisNight: [],
    
    // New adult features
    vipRooms: [],
    ownedFetishItems: [],
    activePatronRequests: [],
    adultContentLevel: 50, // Start at moderate level
  };
}

function initializeCrowdMood(): Record<string, number> {
  const mood: Record<string, number> = {};
  CROWD_KINKS.forEach(kink => {
    mood[kink] = 50 + Math.floor(Math.random() * 20) - 10; // 40-60 starting range
  });
  return mood;
}

export function saveGameState(state: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clubManagerSave', JSON.stringify(state));
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('clubManagerSave');
    if (saved) {
      const state = JSON.parse(saved) as GameState;
      
      // Backward compatibility: ensure new fields exist
      if (!state.ownedClothing) {
        state.ownedClothing = [];
      }
      if (!state.crowdMood) {
        state.crowdMood = initializeCrowdMood();
      }
      if (!state.seasonalTrends) {
        state.seasonalTrends = [];
      }
      if (!state.viralTrends) {
        state.viralTrends = [];
      }
      if (!state.activeRumors) {
        state.activeRumors = [];
      }
      if (state.dramaLevel === undefined) {
        state.dramaLevel = 0;
      }
      if (!state.stageProps) {
        state.stageProps = [];
      }
      if (!state.activeEffects) {
        state.activeEffects = [];
      }
      if (state.maintenanceCost === undefined) {
        state.maintenanceCost = 0;
      }
      if (!state.rivalClubs) {
        state.rivalClubs = [
          { name: "The Velvet Underground", strength: 60, aggression: 50, lastSabotage: 0 },
          { name: "Crimson Palace", strength: 70, aggression: 70, lastSabotage: 0 },
          { name: "Midnight Oasis", strength: 50, aggression: 30, lastSabotage: 0 },
        ];
      }
      if (state.fame === undefined) {
        state.fame = 0;
      }
      if (state.camShowBranch === undefined) {
        state.camShowBranch = false;
      }
      if (state.vipWebsite === undefined) {
        state.vipWebsite = false;
      }
      if (!state.managedTroupes) {
        state.managedTroupes = [];
      }
      if (!state.availableCards) {
        state.availableCards = SKILL_CARDS.slice(0, 6);
      }
      if (!state.usedCardsThisNight) {
        state.usedCardsThisNight = [];
      }
      
      // Add new adult feature fields
      if (!state.vipRooms) {
        state.vipRooms = [];
      }
      if (!state.ownedFetishItems) {
        state.ownedFetishItems = [];
      }
      if (!state.activePatronRequests) {
        state.activePatronRequests = [];
      }
      if (state.adultContentLevel === undefined) {
        state.adultContentLevel = 50;
      }
      
      // Ensure all performers have new fields
      state.performers = state.performers.map(p => {
        if (!p.wardrobe) {
          p.wardrobe = {
            [ClothingSlot.TOP]: null,
            [ClothingSlot.BOTTOM]: null,
            [ClothingSlot.SHOES]: null,
            [ClothingSlot.ACCESSORY]: null,
          };
        }
        if (p.tipsEarned === undefined) {
          p.tipsEarned = 0;
        }
        if (!p.personalityArchetype) {
          p.personalityArchetype = PERSONALITY_ARCHETYPES[Math.floor(Math.random() * PERSONALITY_ARCHETYPES.length)];
        }
        if (!p.chemistryWith) {
          p.chemistryWith = {};
        }
        if (!p.relationships) {
          p.relationships = {};
        }
        if (!p.cards) {
          p.cards = [];
        }
        
        // Add new adult service fields
        if (p.comfortLevel === undefined) {
          // Generate comfort level based on personality
          let baseComfort = 50;
          if (p.personalityArchetype === PersonalityArchetype.KINKY) baseComfort = 80;
          if (p.personalityArchetype === PersonalityArchetype.SHY) baseComfort = 30;
          if (p.personalityArchetype === PersonalityArchetype.FLIRTATIOUS) baseComfort = 70;
          p.comfortLevel = baseComfort + Math.floor(Math.random() * 20) - 10; // +/- 10
        }
        if (p.offersLapDances === undefined) {
          p.offersLapDances = false;
        }
        if (p.offersPoleShows === undefined) {
          p.offersPoleShows = false;
        }
        if (p.willDoFetishShows === undefined) {
          p.willDoFetishShows = false;
        }
        
        // Add breast and penis sizes for existing performers if missing
        // Also convert old numeric format to new string format
        if (p.breastSize === undefined) {
          switch (p.gender) {
            case Gender.FEMALE:
              p.breastSize = generateBreastSize();
              break;
            case Gender.TRANSGENDER:
            case Gender.INTERSEX:
              p.breastSize = generateBreastSize();
              break;
            case Gender.NON_BINARY:
              if (Math.random() > 0.33) {
                p.breastSize = generateBreastSize();
              }
              break;
          }
        } else if (typeof p.breastSize === 'number') {
          // Convert old numeric format to new cup size format
          p.breastSize = convertOldBreastSize(p.breastSize);
        }
        
        if (p.penisSize === undefined) {
          switch (p.gender) {
            case Gender.MALE:
              p.penisSize = generatePenisSize();
              break;
            case Gender.TRANSGENDER:
            case Gender.INTERSEX:
              p.penisSize = generatePenisSize();
              break;
            case Gender.NON_BINARY:
              if (Math.random() > 0.33) {
                p.penisSize = generatePenisSize();
              }
              break;
          }
        } else if (typeof p.penisSize === 'number') {
          // Convert old numeric format to new inches format
          p.penisSize = convertOldPenisSize(p.penisSize);
        }
        return p;
      });
      
      return state;
    }
  }
  return null;
}

export function deleteGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clubManagerSave');
  }
}

// Helper function to generate breast size as cup size
function generateBreastSize(): string {
  const cupSizes = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'E', 'F', 'G', 'H'];
  // Weight towards middle sizes (B-D)
  const weights = [0.05, 0.1, 0.15, 0.2, 0.2, 0.15, 0.08, 0.04, 0.02, 0.01, 0.005];
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < cupSizes.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return cupSizes[i];
    }
  }
  return 'C'; // fallback
}

// Helper function to generate penis size in inches
function generatePenisSize(): string {
  // Generate size between 4 and 10 inches, weighted towards 6-8 (average)
  // Using normal distribution approximation
  const min = 4;
  const max = 10;
  const mean = 7; // average
  const stdDev = 1.2;
  
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  let size = mean + z * stdDev;
  size = Math.max(min, Math.min(max, size)); // clamp to range
  size = Math.round(size * 10) / 10; // round to 1 decimal place
  
  return `${size} inches`;
}

// Helper function to convert old numeric sizes to new format (for backwards compatibility)
function convertOldBreastSize(oldSize: number): string {
  const cupSizes = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'E', 'F', 'G', 'H'];
  const index = Math.max(0, Math.min(cupSizes.length - 1, oldSize - 1));
  return cupSizes[index];
}

function convertOldPenisSize(oldSize: number): string {
  // Map 1-10 scale to 4-10 inches
  const inches = 4 + (oldSize - 1) * 0.67;
  return `${Math.round(inches * 10) / 10} inches`;
}

export function generatePerformer(type: PerformerType): Performer {
  const gender = Object.values(Gender)[Math.floor(Math.random() * Object.values(Gender).length)];
  const numTraits = Math.floor(Math.random() * 2) + 2; // 2-3 traits
  const traits: string[] = [];
  const shuffled = [...PERSONALITY_TRAITS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numTraits; i++) {
    traits.push(shuffled[i]);
  }

  let skill = Math.floor(Math.random() * 6) + 3; // 3-8
  let salary = skill * 100 + Math.floor(Math.random() * 101) + 50; // skill * 100 + 50-150

  // Trait adjustments
  if (traits.includes("Natural Talent")) {
    skill = Math.min(10, skill + 1);
  }
  if (traits.includes("Hardworking")) {
    salary = Math.floor(salary * 0.9);
  }
  if (traits.includes("Arrogant")) {
    salary = Math.floor(salary * 1.2);
  }

  // Assign personality archetype
  const personalityArchetype = PERSONALITY_ARCHETYPES[Math.floor(Math.random() * PERSONALITY_ARCHETYPES.length)];

  // Assign starting cards based on personality
  const startingCards = getStartingCardsForArchetype(personalityArchetype);

  // Assign breast and penis sizes based on gender
  let breastSize: string | undefined;
  let penisSize: string | undefined;

  switch (gender) {
    case Gender.FEMALE:
      breastSize = generateBreastSize();
      break;
    case Gender.MALE:
      penisSize = generatePenisSize();
      break;
    case Gender.TRANSGENDER:
    case Gender.INTERSEX:
      // Both breast and penis size
      breastSize = generateBreastSize();
      penisSize = generatePenisSize();
      break;
    case Gender.NON_BINARY:
      // Randomly assign either or both
      if (Math.random() > 0.33) {
        breastSize = generateBreastSize();
      }
      if (Math.random() > 0.33) {
        penisSize = generatePenisSize();
      }
      break;
  }
  
  // Generate comfort level based on personality archetype
  let comfortLevel = 50; // Base comfort
  if (personalityArchetype === PersonalityArchetype.KINKY) comfortLevel = 80;
  if (personalityArchetype === PersonalityArchetype.SHY) comfortLevel = 30;
  if (personalityArchetype === PersonalityArchetype.FLIRTATIOUS) comfortLevel = 70;
  if (personalityArchetype === PersonalityArchetype.DOMINANT) comfortLevel = 75;
  if (personalityArchetype === PersonalityArchetype.VANILLA) comfortLevel = 40;
  comfortLevel += Math.floor(Math.random() * 20) - 10; // +/- 10
  comfortLevel = Math.max(10, Math.min(100, comfortLevel));

  return {
    name: generateFullName(),
    performerType: type,
    gender,
    traits,
    skill,
    loyalty: Math.floor(Math.random() * 4) + 4, // 4-7
    energy: 10,
    salary,
    reputation: 0,
    promotionLevel: 0,
    offersStriptease: false,
    dancerStripRoutine: false,
    offersPrivateLounge: false,
    afterHoursExclusive: false,
    comfortLevel,
    offersLapDances: false,
    offersPoleShows: false,
    willDoFetishShows: false,
    wardrobe: {
      [ClothingSlot.TOP]: null,
      [ClothingSlot.BOTTOM]: null,
      [ClothingSlot.SHOES]: null,
      [ClothingSlot.ACCESSORY]: null,
    },
    tipsEarned: 0,
    personalityArchetype,
    chemistryWith: {},
    relationships: {},
    cards: startingCards,
    breastSize,
    penisSize,
  };
}

function getStartingCardsForArchetype(archetype: PersonalityArchetype): string[] {
  const cardsByCategory: Record<string, string[]> = {
    [PersonalityArchetype.FLIRTATIOUS]: ["tease_wink", "tease_dance"],
    [PersonalityArchetype.DOMINANT]: ["dom_command"],
    [PersonalityArchetype.SHY]: ["sub_obey"],
    [PersonalityArchetype.KINKY]: ["tease_strip"],
    [PersonalityArchetype.COMEDIC]: ["comedy_joke"],
    [PersonalityArchetype.VANILLA]: ["vanilla_romance"],
    [PersonalityArchetype.MYSTERIOUS]: ["mystery_mask"],
    [PersonalityArchetype.PLAYFUL]: ["tease_wink", "comedy_joke"],
  };
  return cardsByCategory[archetype] || [];
}

export function trainPerformer(performer: Performer): { success: boolean; message: string } {
  if (performer.energy >= 3) {
    performer.skill = Math.min(10, performer.skill + 1);
    performer.energy -= 2;
    return { success: true, message: `${performer.name} trained! Skill increased to ${performer.skill}/10` };
  }
  return { success: false, message: `${performer.name} is too tired to train!` };
}

export function restPerformer(performer: Performer): void {
  performer.energy = Math.min(10, performer.energy + 3);
}

export function performWork(performer: Performer): number {
  if (performer.energy < 2) {
    return 0;
  }
  performer.energy -= 1;
  const baseIncome = performer.skill * 50;
  return baseIncome + Math.floor(Math.random() * 71) - 20; // -20 to +50
}

export function calculateTraitBonus(performer: Performer, income: number): { bonus: number; message: string } {
  if (performer.traits.includes("Crowd Pleaser")) {
    return { bonus: Math.floor(income * 0.15), message: "Crowd Pleaser: +15% tips!" };
  }
  if (performer.traits.includes("Stage Presence")) {
    return { bonus: Math.floor(income * 0.10), message: "Stage Presence: +10%" };
  }
  if (performer.traits.includes("Natural Talent")) {
    return { bonus: Math.floor(income * 0.08), message: "Natural Talent: +8%" };
  }
  if (performer.traits.includes("Charismatic")) {
    return { bonus: Math.floor(income * 0.05), message: "Charismatic: +5%" };
  }
  return { bonus: 0, message: "" };
}

export function advanceDay(state: GameState): void {
  state.day += 1;

  // Pay daily expenses
  const totalExpenses = state.performers.reduce((sum, p) => sum + p.salary, 0);
  state.money -= totalExpenses;

  // Reputation drift
  if (state.reputation > 60) {
    state.reputation = Math.max(50, state.reputation - 1);
  } else if (state.reputation < 40) {
    state.reputation = Math.min(50, state.reputation + 1);
  }
}

export const UPGRADE_CATALOG: Record<string, Upgrade> = {
  sound_system: {
    name: "Pro Sound System",
    desc: "Boosts performer income and reduces equipment failure chance.",
    baseCost: 2500,
    maxLevel: 3,
    incomePct: 0.05,
    eventFailureReduction: 0.05
  },
  vip_lounge: {
    name: "VIP Lounge",
    desc: "Attracts high-roller patrons increasing crowd spending.",
    baseCost: 4000,
    maxLevel: 2,
    spendingPowerPct: 0.10
  },
  marketing: {
    name: "Marketing Hub",
    desc: "Increases crowd size and reputation gains.",
    baseCost: 3000,
    maxLevel: 3,
    crowdSizePct: 0.08,
    repGainPct: 0.05
  },
  security_suite: {
    name: "Security Suite",
    desc: "Further reduces negative event probability.",
    baseCost: 2000,
    maxLevel: 2,
    eventProbReduction: 0.07
  }
};

export function calculateUpgradeCost(upgrade: Upgrade, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));
}

export function purchaseUpgrade(state: GameState, upgradeId: string): { success: boolean; message: string } {
  const upgrade = UPGRADE_CATALOG[upgradeId];
  if (!upgrade) {
    return { success: false, message: "Invalid upgrade!" };
  }

  const currentLevel = state.upgrades[upgradeId] || 0;
  if (currentLevel >= upgrade.maxLevel) {
    return { success: false, message: "Already at max level!" };
  }

  const cost = calculateUpgradeCost(upgrade, currentLevel);
  if (state.money < cost) {
    return { success: false, message: "Not enough money!" };
  }

  state.money -= cost;
  state.upgrades[upgradeId] = currentLevel + 1;
  return { success: true, message: `✓ Upgraded ${upgrade.name} to level ${currentLevel + 1}.` };
}

// Calculate wardrobe appeal bonus
export function calculateWardrobeAppeal(wardrobe: Wardrobe, ownedClothing: string[]): number {
  let totalAppeal = 0;
  
  Object.values(wardrobe).forEach((itemId) => {
    if (itemId && ownedClothing.includes(itemId)) {
      const item = CLOTHING_CATALOG.find((c) => c.id === itemId);
      if (item) {
        totalAppeal += item.appeal;
      }
    }
  });
  
  return totalAppeal;
}

// Calculate tips based on performance
export function calculateTips(performer: Performer, baseIncome: number, ownedClothing: string[]): { tips: number; message: string } {
  if (performer.energy < 2) {
    return { tips: 0, message: "Too tired to earn tips." };
  }
  
  // Base tip rate (10-30% of base income)
  let tipRate = 0.10 + (performer.skill / 100);
  
  // Relationship bonus (up to +10%)
  const relationshipBonus = Math.min(0.10, performer.loyalty / 100);
  tipRate += relationshipBonus;
  
  // Wardrobe appeal bonus (up to +15%)
  const wardrobeAppeal = calculateWardrobeAppeal(performer.wardrobe, ownedClothing);
  const wardrobeBonus = Math.min(0.15, wardrobeAppeal / 100);
  tipRate += wardrobeBonus;
  
  // Trait bonuses
  if (performer.traits.includes("Charismatic")) {
    tipRate += 0.05;
  }
  if (performer.traits.includes("Crowd Pleaser")) {
    tipRate += 0.08;
  }
  
  const tips = Math.floor(baseIncome * tipRate);
  return { tips, message: `Earned $${tips} in tips!` };
}

// Calculate income from adult services with explicit descriptions
export function calculateAdultServiceIncome(performer: Performer, baseIncome: number): { bonus: number; messages: string[] } {
  let totalBonus = 0;
  const messages: string[] = [];
  
  // Helper function to get random description
  const getRandomDescription = (category: string): string => {
    const descriptions = EXPLICIT_PERFORMANCE_DESCRIPTIONS[category as keyof typeof EXPLICIT_PERFORMANCE_DESCRIPTIONS];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };
  
  // Striptease
  if (performer.offersStriptease && performer.energy >= 3) {
    const stripBonus = Math.max(120, Math.floor(baseIncome * 0.25));
    totalBonus += stripBonus;
    const description = getRandomDescription('striptease');
    messages.push(`💃 ${performer.name} ${description} (+$${stripBonus})`);
  } else if (performer.offersStriptease) {
    messages.push(`${performer.name} is too exhausted for striptease`);
  }
  
  // Lap Dances
  if (performer.offersLapDances && performer.energy >= 2) {
    const lapBonus = Math.max(80, Math.floor(baseIncome * 0.20));
    totalBonus += lapBonus;
    const description = getRandomDescription('lapDance');
    messages.push(`💋 ${performer.name} ${description} (+$${lapBonus})`);
  } else if (performer.offersLapDances) {
    messages.push(`${performer.name} too tired for lap dances`);
  }
  
  // Pole Shows
  if (performer.offersPoleShows && performer.energy >= 3) {
    const poleBonus = Math.max(150, Math.floor(baseIncome * 0.30));
    totalBonus += poleBonus;
    const description = getRandomDescription('poleShow');
    messages.push(`💎 ${performer.name} ${description} (+$${poleBonus})`);
  } else if (performer.offersPoleShows) {
    messages.push(`${performer.name} too drained for pole work`);
  }
  
  // Private Lounge
  if (performer.offersPrivateLounge && performer.energy >= 4) {
    const loungeBase = baseIncome + totalBonus;
    const loungeBonus = Math.max(160, Math.floor(loungeBase * 0.35));
    totalBonus += loungeBonus;
    const description = getRandomDescription('privateLounge');
    messages.push(`🛋️ ${performer.name} ${description} (+$${loungeBonus})`);
  } else if (performer.offersPrivateLounge) {
    messages.push(`${performer.name} too drained for private lounge`);
  }
  
  // Fetish Shows
  if (performer.willDoFetishShows && performer.energy >= 4) {
    const fetishBonus = Math.max(200, Math.floor((baseIncome + totalBonus) * 0.40));
    totalBonus += fetishBonus;
    const description = getRandomDescription('fetishShow');
    messages.push(`🔗 ${performer.name} ${description} (+$${fetishBonus})`);
  } else if (performer.willDoFetishShows) {
    messages.push(`${performer.name} no energy for fetish content`);
  }
  
  // After-hours Exclusive
  if (performer.afterHoursExclusive && performer.energy >= 5) {
    const exclusiveBase = baseIncome + totalBonus;
    const exclusiveBonus = Math.max(240, Math.floor(exclusiveBase * 0.45));
    totalBonus += exclusiveBonus;
    const description = getRandomDescription('afterHours');
    messages.push(`🌙 ${performer.name} ${description} (+$${exclusiveBonus})`);
  } else if (performer.afterHoursExclusive) {
    messages.push(`${performer.name} no stamina for after-hours`);
  }
  
  return { bonus: totalBonus, messages };
}

// ============= NEW FEATURE FUNCTIONS =============

// 1. Chemistry System
export function calculateChemistry(performer1: Performer, performer2: Performer): number {
  const arch1 = performer1.personalityArchetype;
  const arch2 = performer2.personalityArchetype;
  
  const compatible = CHEMISTRY_COMPATIBILITY[arch1]?.includes(arch2);
  let chemistry = 50; // base
  
  if (compatible) {
    chemistry += 30;
  }
  
  // Trait bonuses
  if (performer1.traits.includes("Team Player") || performer2.traits.includes("Team Player")) {
    chemistry += 10;
  }
  if (performer1.traits.includes("Charming") && performer2.traits.includes("Charming")) {
    chemistry += 15;
  }
  
  return Math.min(100, chemistry);
}

export function updateChemistryForAllPerformers(performers: Performer[]): void {
  for (let i = 0; i < performers.length; i++) {
    for (let j = i + 1; j < performers.length; j++) {
      const chemistry = calculateChemistry(performers[i], performers[j]);
      performers[i].chemistryWith[performers[j].name] = chemistry;
      performers[j].chemistryWith[performers[i].name] = chemistry;
    }
  }
}

export function getChemistryIcon(chemistry: number): string {
  if (chemistry >= 80) return "💕"; // hearts - excellent chemistry
  if (chemistry >= 60) return "⚡"; // lightning - good chemistry
  if (chemistry >= 40) return "🤝"; // handshake - neutral
  return "❌"; // X - poor chemistry
}

export function calculateThemedNightBonus(performers: Performer[], themedNightType: ThemedNightType): { bonus: number; message: string } {
  const themedNight = THEMED_NIGHTS.find(tn => tn.type === themedNightType);
  if (!themedNight) {
    return { bonus: 0, message: "Invalid themed night" };
  }
  
  if (performers.length < themedNight.minPerformers) {
    return { bonus: 0, message: `Need at least ${themedNight.minPerformers} performers for ${themedNight.name}` };
  }
  
  // Check if we have performers matching required archetypes
  const matchingPerformers = performers.filter(p => 
    themedNight.requiredArchetypes.includes(p.personalityArchetype)
  );
  
  if (matchingPerformers.length === 0) {
    return { bonus: 0, message: `No performers match ${themedNight.name} theme` };
  }
  
  const matchRatio = matchingPerformers.length / performers.length;
  const bonusMultiplier = 1 + ((themedNight.bonusMultiplier - 1) * matchRatio);
  
  return {
    bonus: bonusMultiplier,
    message: `${themedNight.name}: ${Math.floor((bonusMultiplier - 1) * 100)}% bonus! (${matchingPerformers.length}/${performers.length} matching)`
  };
}

// 2. Crowd Dynamics
export function updateCrowdMood(state: GameState): void {
  // Random fluctuations
  Object.keys(state.crowdMood).forEach(kink => {
    const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
    state.crowdMood[kink] = Math.max(0, Math.min(100, state.crowdMood[kink] + change));
  });
  
  // Apply viral trends
  state.viralTrends.forEach(trendName => {
    const matchingKink = Object.keys(state.crowdMood).find(k => trendName.toLowerCase().includes(k));
    if (matchingKink) {
      state.crowdMood[matchingKink] = Math.min(100, state.crowdMood[matchingKink] + 5);
    }
  });
}

export function checkForViralTrend(state: GameState): string | null {
  // 10% chance each week (day % 7 === 0) for a viral trend
  if (state.day % 7 === 0 && Math.random() < 0.1) {
    const trends = ["Tentacle Trend", "Pet Play Craze", "Gothic Revival", "Comedy Boom", "Mystery Madness"];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    if (!state.viralTrends.includes(trend)) {
      state.viralTrends.push(trend);
      return trend;
    }
  }
  return null;
}

export function applySeasonalTrends(state: GameState): void {
  const dayOfYear = state.day % 365;
  let season = "winter";
  
  if (dayOfYear >= 79 && dayOfYear < 171) season = "spring";
  else if (dayOfYear >= 171 && dayOfYear < 265) season = "summer";
  else if (dayOfYear >= 265 && dayOfYear < 355) season = "fall";
  
  // Apply seasonal kink boosts
  const seasonalKinks: Record<string, string[]> = {
    winter: ["gothic", "mystery", "bdsm"],
    spring: ["vanilla", "playful"],
    summer: ["exhibitionism", "playful"],
    fall: ["gothic", "mystery", "fetish"],
  };
  
  state.seasonalTrends = seasonalKinks[season] || [];
  
  state.seasonalTrends.forEach(kink => {
    if (state.crowdMood[kink] !== undefined) {
      state.crowdMood[kink] = Math.min(100, state.crowdMood[kink] + 3);
    }
  });
}

// 3. Drama & Gossip System
export function generateRumor(state: GameState): Rumor | null {
  if (state.performers.length < 2) return null;
  if (Math.random() > 0.15) return null; // 15% chance per day
  
  const rumorTemplates = [
    { title: "Romance Brewing", type: "romance" },
    { title: "Backstage Feud", type: "feud" },
    { title: "Jealousy Drama", type: "feud" },
    { title: "Secret Alliance", type: "alliance" },
  ];
  
  const template = rumorTemplates[Math.floor(Math.random() * rumorTemplates.length)];
  const involved = [];
  
  // Pick 2 random performers
  const shuffled = [...state.performers].sort(() => Math.random() - 0.5);
  involved.push(shuffled[0].name, shuffled[1].name);
  
  // Update relationships
  if (template.type === "romance" || template.type === "alliance") {
    shuffled[0].relationships[shuffled[1].name] = template.type as "romance" | "alliance";
    shuffled[1].relationships[shuffled[0].name] = template.type as "romance" | "alliance";
  } else {
    shuffled[0].relationships[shuffled[1].name] = "feud";
    shuffled[1].relationships[shuffled[0].name] = "feud";
  }
  
  const severity: "low" | "medium" | "high" = Math.random() < 0.6 ? "low" : Math.random() < 0.8 ? "medium" : "high";
  
  return {
    id: `rumor_${state.day}_${Math.random()}`,
    title: template.title,
    description: `${involved[0]} and ${involved[1]} are involved in ${template.title.toLowerCase()}`,
    involvedPerformers: involved,
    severity,
    resolutionOptions: [
      { type: "diplomacy", cost: 0, ethicsImpact: 5, successChance: 0.7, description: "Mediate the situation" },
      { type: "bribe", cost: 500, ethicsImpact: -5, successChance: 0.9, description: "Pay to make it go away" },
      { type: "ignore", cost: 0, ethicsImpact: -2, successChance: 0.3, description: "Hope it resolves itself" },
    ],
    dayStarted: state.day,
  };
}

export function resolveRumor(state: GameState, rumor: Rumor, resolutionType: "diplomacy" | "bribe" | "ignore"): { success: boolean; message: string } {
  const resolution = rumor.resolutionOptions.find(r => r.type === resolutionType);
  if (!resolution) {
    return { success: false, message: "Invalid resolution type" };
  }
  
  if (state.money < resolution.cost) {
    return { success: false, message: "Not enough money!" };
  }
  
  state.money -= resolution.cost;
  state.ethicsScore = Math.max(0, Math.min(100, state.ethicsScore + resolution.ethicsImpact));
  
  const success = Math.random() < resolution.successChance;
  
  if (success) {
    // Remove rumor
    state.activeRumors = state.activeRumors.filter(r => r.id !== rumor.id);
    state.dramaLevel = Math.max(0, state.dramaLevel - 10);
    return { success: true, message: `Successfully resolved: ${rumor.title}` };
  } else {
    state.dramaLevel = Math.min(100, state.dramaLevel + 10);
    return { success: false, message: `Failed to resolve: ${rumor.title}. Drama increased!` };
  }
}

// 4. Rival Club Sabotage
export function checkForSabotage(state: GameState): { sabotaged: boolean; club: string; message: string } | null {
  const aggressiveRivals = state.rivalClubs.filter(c => 
    c.aggression > 50 && (state.day - c.lastSabotage) > 14
  );
  
  if (aggressiveRivals.length === 0) return null;
  
  const rival = aggressiveRivals[Math.floor(Math.random() * aggressiveRivals.length)];
  const sabotageChance = rival.aggression / 100 * 0.3; // Max 30% chance
  
  if (Math.random() < sabotageChance) {
    rival.lastSabotage = state.day;
    
    const sabotageTypes = [
      { type: "equipment", damage: 500, message: "sabotaged your sound system!" },
      { type: "reputation", damage: 10, message: "spread rumors, damaging your reputation!" },
      { type: "staff", damage: 0, message: "tried to poach your performers!" },
    ];
    
    const sabotage = sabotageTypes[Math.floor(Math.random() * sabotageTypes.length)];
    
    if (sabotage.type === "equipment") {
      state.money -= sabotage.damage;
    } else if (sabotage.type === "reputation") {
      state.reputation = Math.max(0, state.reputation - sabotage.damage);
    } else if (sabotage.type === "staff" && state.performers.length > 0) {
      const targetPerformer = state.performers[Math.floor(Math.random() * state.performers.length)];
      targetPerformer.loyalty = Math.max(1, targetPerformer.loyalty - 2);
    }
    
    return {
      sabotaged: true,
      club: rival.name,
      message: `${rival.name} ${sabotage.message}`
    };
  }
  
  return null;
}

// 5. Card System
export function playSkillCard(performer: Performer, cardId: string, state: GameState): { success: boolean; bonus: number; message: string } {
  if (!performer.cards.includes(cardId)) {
    return { success: false, bonus: 0, message: "Performer doesn't have this card!" };
  }
  
  if (state.usedCardsThisNight.includes(cardId)) {
    return { success: false, bonus: 0, message: "Card already used this night!" };
  }
  
  const card = SKILL_CARDS.find(c => c.id === cardId);
  if (!card) {
    return { success: false, bonus: 0, message: "Invalid card!" };
  }
  
  if (performer.energy < card.energyCost) {
    return { success: false, bonus: 0, message: "Not enough energy!" };
  }
  
  performer.energy -= card.energyCost;
  state.usedCardsThisNight.push(cardId);
  
  const bonus = card.power * 50; // Each power point = $50
  
  // Check for combos
  let comboBonus = 0;
  for (const comboCardId of card.comboWith) {
    if (state.usedCardsThisNight.includes(comboCardId)) {
      comboBonus += 100;
    }
  }
  
  return {
    success: true,
    bonus: bonus + comboBonus,
    message: comboBonus > 0 
      ? `${card.name} played! +$${bonus} (Combo bonus: +$${comboBonus})`
      : `${card.name} played! +$${bonus}`
  };
}

// 6. Expansion System
export function unlockCamShowBranch(state: GameState): { success: boolean; message: string } {
  const cost = 10000;
  if (state.money < cost) {
    return { success: false, message: "Need $10,000 to start cam show branch!" };
  }
  if (state.camShowBranch) {
    return { success: false, message: "Already have cam show branch!" };
  }
  
  state.money -= cost;
  state.camShowBranch = true;
  return { success: true, message: "Cam show branch unlocked! Generates passive income daily." };
}

export function unlockVIPWebsite(state: GameState): { success: boolean; message: string } {
  const cost = 15000;
  if (state.money < cost) {
    return { success: false, message: "Need $15,000 to launch VIP website!" };
  }
  if (state.vipWebsite) {
    return { success: false, message: "Already have VIP website!" };
  }
  
  state.money -= cost;
  state.vipWebsite = true;
  return { success: true, message: "VIP website launched! Attracts premium members." };
}

export function calculateExpansionIncome(state: GameState): { income: number; messages: string[] } {
  let income = 0;
  const messages: string[] = [];
  
  if (state.camShowBranch) {
    const camIncome = state.performers.length * 100 + Math.floor(Math.random() * 500);
    income += camIncome;
    messages.push(`Cam shows: +$${camIncome}`);
  }
  
  if (state.vipWebsite) {
    const vipIncome = Math.floor(state.reputation * 10) + Math.floor(Math.random() * 300);
    income += vipIncome;
    messages.push(`VIP memberships: +$${vipIncome}`);
  }
  
  return { income, messages };
}

// 7. Fame System
export function updateFame(state: GameState, incomeEarned: number): void {
  // Fame increases with high earnings and reputation
  if (incomeEarned > 5000) {
    state.fame = Math.min(100, state.fame + 2);
  }
  if (state.reputation > 80) {
    state.fame = Math.min(100, state.fame + 1);
  }
  
  // Fame decays slowly
  if (state.day % 7 === 0) {
    state.fame = Math.max(0, state.fame - 1);
  }
}

export function checkForCelebrityCameo(state: GameState): { cameo: boolean; celebrity: string; bonus: number } | null {
  if (state.fame < 70) return null;
  
  const chance = (state.fame - 70) / 100; // 0% at 70 fame, 30% at 100 fame
  if (Math.random() < chance) {
    const celebrities = ["Pop Star", "Movie Actor", "Social Media Influencer", "Famous DJ", "Pro Athlete"];
    const celebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
    const bonus = 2000 + Math.floor(Math.random() * 3000);
    
    return { cameo: true, celebrity, bonus };
  }
  
  return null;
}
