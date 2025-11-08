// Game Logic and State Management for Underground Club Manager

import { GameState, Performer, PerformerType, Gender, Upgrade, ClothingSlot, Wardrobe, ClothingItem } from './types';
import { PERSONALITY_TRAITS, generateFullName, CLOTHING_CATALOG } from './constants';

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
  };
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
      return JSON.parse(saved);
    }
  }
  return null;
}

export function deleteGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clubManagerSave');
  }
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
    wardrobe: {
      [ClothingSlot.TOP]: null,
      [ClothingSlot.BOTTOM]: null,
      [ClothingSlot.SHOES]: null,
      [ClothingSlot.ACCESSORY]: null,
    },
    tipsEarned: 0,
  };
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

// Calculate income from adult services
export function calculateAdultServiceIncome(performer: Performer, baseIncome: number): { bonus: number; messages: string[] } {
  let totalBonus = 0;
  const messages: string[] = [];
  
  if (performer.offersStriptease && performer.energy >= 3) {
    const stripBonus = Math.max(120, Math.floor(baseIncome * 0.25));
    totalBonus += stripBonus;
    messages.push(`Striptease routine: +$${stripBonus}`);
  } else if (performer.offersStriptease) {
    messages.push("Too exhausted for striptease routine");
  }
  
  if (performer.offersPrivateLounge && performer.energy >= 4) {
    const loungeBase = baseIncome + totalBonus;
    const loungeBonus = Math.max(160, Math.floor(loungeBase * 0.35));
    totalBonus += loungeBonus;
    messages.push(`Private lounge experience: +$${loungeBonus}`);
  } else if (performer.offersPrivateLounge) {
    messages.push("Too drained for private lounge");
  }
  
  if (performer.afterHoursExclusive && performer.energy >= 5) {
    const exclusiveBase = baseIncome + totalBonus;
    const exclusiveBonus = Math.max(240, Math.floor(exclusiveBase * 0.45));
    totalBonus += exclusiveBonus;
    messages.push(`After-hours exclusive: +$${exclusiveBonus}`);
  } else if (performer.afterHoursExclusive) {
    messages.push("No stamina for after-hours exclusive");
  }
  
  return { bonus: totalBonus, messages };
}
