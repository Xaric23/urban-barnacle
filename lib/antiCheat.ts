// Anti-Cheat System for Underground Club Manager
// Validates game state integrity and prevents tampering
// Ported and enhanced from Python game.py implementation

import { GameState, Performer, Rumor, StageProp, RivalClub, SkillCard, VIPRoom, PatronRequest, BrothelRoom, BrothelWorker, BrothelSession } from './types';

// Salt for checksum computation - changing this invalidates all saves
// Matches Python implementation: _SAVE_SALT = "v1|NightclubGameSalt|DoNotModify"
const SAVE_SALT = "v1|NightclubGameSalt|DoNotModify";

/**
 * Generates a SHA-256 checksum for game state validation
 * This matches the Python implementation in game.py
 */
export async function generateChecksum(data: Record<string, unknown>): Promise<string> {
  try {
    console.log('[AntiCheat] generateChecksum: Starting...');
    
    // Check if Web Crypto API is available
    // Use safe feature detection wrapped in try-catch to prevent freezing on GitHub Pages
    let hasWebCrypto = false;
    try {
      hasWebCrypto = 
        typeof window !== 'undefined' &&
        typeof globalThis.crypto !== 'undefined' &&
        typeof globalThis.crypto.subtle !== 'undefined' &&
        typeof globalThis.crypto.subtle.digest === 'function';
    } catch {
      hasWebCrypto = false;
    }
    
    if (!hasWebCrypto) {
      console.warn('[AntiCheat] Web Crypto API not available, using sync fallback');
      return generateChecksumSync(data);
    }

    console.log('[AntiCheat] generateChecksum: Using Web Crypto API');

    // Filter out checksum field and sort keys (matches Python behavior)
    const filtered: Record<string, unknown> = {};
    Object.keys(data)
      .filter(k => k !== 'checksum')
      .sort()
      .forEach(k => {
        filtered[k] = data[k];
      });

    // Serialize with consistent formatting (matches Python: separators=(",", ":"), sort_keys=True)
    const serialized = JSON.stringify(filtered, Object.keys(filtered).sort());
    const message = SAVE_SALT + serialized;

    console.log('[AntiCheat] generateChecksum: Message prepared, computing hash...');
    
    // Use Web Crypto API for SHA-256
    const encoder = new TextEncoder();
    const msgBuffer = encoder.encode(message);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('[AntiCheat] generateChecksum: Hash computed successfully');
    return hashHex;
  } catch (error) {
    console.warn('[AntiCheat] Error during async checksum generation, falling back to sync:', error);
    return generateChecksumSync(data);
  }
}

/**
 * Synchronous fallback checksum for when crypto.subtle is unavailable
 * Uses a simpler but still secure hash function
 */
export function generateChecksumSync(data: Record<string, unknown>): string {
  // Filter out checksum field and sort keys
  const filtered: Record<string, unknown> = {};
  Object.keys(data)
    .filter(k => k !== 'checksum')
    .sort()
    .forEach(k => {
      filtered[k] = data[k];
    });

  const serialized = JSON.stringify(filtered, Object.keys(filtered).sort());
  const message = SAVE_SALT + serialized;
  
  // Simple but effective hash function for fallback
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).padStart(10, '0');
}

/**
 * Validates game state for impossible or cheated values
 */
export function validateGameState(state: GameState): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate day
  if (state.day < 1 || state.day > 10000 || !Number.isInteger(state.day)) {
    errors.push('Invalid day value');
  }

  // Validate reputation (0-100)
  if (state.reputation < 0 || state.reputation > 100) {
    errors.push('Invalid reputation value');
  }

  // Validate ethics (0-100)
  if (state.ethicsScore < 0 || state.ethicsScore > 100) {
    errors.push('Invalid ethics score');
  }

  // Validate money (reasonable limits)
  if (state.money < -10000 || state.money > 100000000 || !Number.isFinite(state.money)) {
    errors.push('Invalid money value');
  }

  // Validate performers
  state.performers.forEach((performer, index) => {
    const perfErrors = validatePerformer(performer);
    if (perfErrors.length > 0) {
      errors.push(`Performer ${index} (${performer.name}): ${perfErrors.join(', ')}`);
    }
  });

  // Check for impossibly high upgrades
  Object.entries(state.upgrades).forEach(([key, level]) => {
    if (level < 0 || level > 10 || !Number.isInteger(level)) {
      errors.push(`Invalid upgrade level for ${key}`);
    }
  });

  // Validate city demand
  if (state.cityDemand < 0 || state.cityDemand > 200) {
    errors.push('Invalid city demand value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a single performer's stats
 */
function validatePerformer(performer: Performer): string[] {
  const errors: string[] = [];

  // Validate skill (1-10)
  if (performer.skill < 1 || performer.skill > 10 || !Number.isInteger(performer.skill)) {
    errors.push('invalid skill');
  }

  // Validate loyalty (1-10)
  if (performer.loyalty < 1 || performer.loyalty > 10 || !Number.isInteger(performer.loyalty)) {
    errors.push('invalid loyalty');
  }

  // Validate energy (0-10)
  if (performer.energy < 0 || performer.energy > 10 || !Number.isInteger(performer.energy)) {
    errors.push('invalid energy');
  }

  // Validate salary (must be positive and reasonable)
  if (performer.salary < 0 || performer.salary > 100000 || !Number.isFinite(performer.salary)) {
    errors.push('invalid salary');
  }

  // Validate reputation (-10 to 10)
  if (performer.reputation < -10 || performer.reputation > 10 || !Number.isInteger(performer.reputation)) {
    errors.push('invalid reputation');
  }

  // Validate promotion level
  if (performer.promotionLevel < 0 || performer.promotionLevel > 5 || !Number.isInteger(performer.promotionLevel)) {
    errors.push('invalid promotion level');
  }

  // Validate tips earned
  if (performer.tipsEarned < 0 || !Number.isFinite(performer.tipsEarned)) {
    errors.push('invalid tips earned');
  }

  return errors;
}

/**
 * Sanitizes game state by clamping values to valid ranges
 */
export function sanitizeGameState(state: GameState): GameState {
  const sanitized = { ...state };

  // Clamp reputation
  sanitized.reputation = Math.max(0, Math.min(100, sanitized.reputation));

  // Clamp ethics
  sanitized.ethicsScore = Math.max(0, Math.min(100, sanitized.ethicsScore));

  // Clamp city demand
  sanitized.cityDemand = Math.max(0, Math.min(200, sanitized.cityDemand));

  // Sanitize performers
  sanitized.performers = sanitized.performers.map(sanitizePerformer);

  return sanitized;
}

/**
 * Sanitizes a performer's stats
 */
function sanitizePerformer(performer: Performer): Performer {
  return {
    ...performer,
    skill: Math.max(1, Math.min(10, Math.floor(performer.skill))),
    loyalty: Math.max(1, Math.min(10, Math.floor(performer.loyalty))),
    energy: Math.max(0, Math.min(10, Math.floor(performer.energy))),
    salary: Math.max(0, Math.min(100000, performer.salary)),
    reputation: Math.max(-10, Math.min(10, Math.floor(performer.reputation))),
    promotionLevel: Math.max(0, Math.min(5, Math.floor(performer.promotionLevel))),
    tipsEarned: Math.max(0, performer.tipsEarned),
  };
}

/**
 * Detects potential timestamp manipulation
 */
export function detectTimeManipulation(state: GameState): boolean {
  if (!state.lastEventDay) {
    return false; // No data to check
  }

  // Check if lastEventDay is in the future
  if (state.lastEventDay > state.day) {
    return true;
  }

  // Check for impossible event cooldowns
  const impossibleCooldowns = Object.values(state.eventCooldowns).some(
    cooldownDay => cooldownDay < state.day - 365 || cooldownDay > state.day + 365
  );

  return impossibleCooldowns;
}

/**
 * Creates a tamper-evident save with metadata
 * Enhanced version with checksum matching Python implementation
 */
export interface SecureSave {
  version?: string;
  timestamp?: number;
  checksum: string;
  day: number;
  money: number;
  reputation: number;
  ethicsScore: number;
  performers: Performer[];
  relationships?: Record<string, number>;
  storyFlags?: Record<string, boolean>;
  completedEvents?: string[];
  upgrades: Record<string, number>;
  cityDemand: number;
  genreTrend: Record<string, number>;
  riskLevel: string;
  eventCooldowns: Record<string, number>;
  eventHistory: string[];
  lastEventDay: number;
  ownedClothing?: string[];
  crowdMood?: Record<string, number>;
  seasonalTrends?: string[];
  viralTrends?: string[];
  activeRumors?: Rumor[];
  dramaLevel?: number;
  stageProps?: StageProp[];
  activeEffects?: string[];
  maintenanceCost?: number;
  rivalClubs?: RivalClub[];
  fame?: number;
  camShowBranch?: boolean;
  vipWebsite?: boolean;
  managedTroupes?: string[];
  availableCards?: SkillCard[];
  usedCardsThisNight?: string[];
  vipRooms?: VIPRoom[];
  ownedFetishItems?: string[];
  activePatronRequests?: PatronRequest[];
  adultContentLevel?: number;
  brothelRooms?: BrothelRoom[];
  brothelWorkers?: BrothelWorker[];
  brothelSessions?: BrothelSession[];
  brothelReputation?: number;
  brothelEnabled?: boolean;
}

export async function createSecureSave(state: GameState): Promise<SecureSave> {
  try {
    // Check if Web Crypto API is actually available and working
    // Use safe feature detection wrapped in try-catch to prevent freezing on GitHub Pages
    let hasWebCrypto = false;
    try {
      hasWebCrypto = 
        typeof window !== 'undefined' &&
        typeof globalThis.crypto !== 'undefined' &&
        typeof globalThis.crypto.subtle !== 'undefined' &&
        typeof globalThis.crypto.subtle.digest === 'function';
    } catch {
      hasWebCrypto = false;
    }
    
    if (!hasWebCrypto) {
      console.warn('[AntiCheat] Web Crypto API not available, using sync fallback');
      return createSecureSaveSync(state);
    }

    const saveData: Omit<SecureSave, 'checksum'> = {
      version: '1.0.0',
      timestamp: Date.now(),
      day: state.day,
      money: state.money,
      reputation: state.reputation,
      ethicsScore: state.ethicsScore,
      performers: state.performers,
      relationships: state.relationships,
      storyFlags: state.storyFlags,
      completedEvents: state.completedEvents,
      upgrades: state.upgrades,
      cityDemand: state.cityDemand,
      genreTrend: state.genreTrend,
      riskLevel: state.riskLevel,
      eventCooldowns: state.eventCooldowns,
      eventHistory: state.eventHistory,
      lastEventDay: state.lastEventDay,
      ownedClothing: state.ownedClothing,
      crowdMood: state.crowdMood,
      seasonalTrends: state.seasonalTrends,
      viralTrends: state.viralTrends,
      activeRumors: state.activeRumors,
      dramaLevel: state.dramaLevel,
      stageProps: state.stageProps,
      activeEffects: state.activeEffects,
      maintenanceCost: state.maintenanceCost,
      rivalClubs: state.rivalClubs,
      fame: state.fame,
      camShowBranch: state.camShowBranch,
      vipWebsite: state.vipWebsite,
      managedTroupes: state.managedTroupes,
      availableCards: state.availableCards,
      usedCardsThisNight: state.usedCardsThisNight,
    };

    console.log('[AntiCheat] Generating checksum...');
    const checksum = await generateChecksum(saveData as Record<string, unknown>);
    console.log('[AntiCheat] Checksum generated:', checksum.substring(0, 8) + '...');
    return {
      ...saveData,
      checksum,
    };
  } catch (error) {
    console.error('[AntiCheat] Error during async save creation, falling back to sync:', error);
    return createSecureSaveSync(state);
  }
}

/**
 * Synchronous version for when async is not possible
 */
export function createSecureSaveSync(state: GameState): SecureSave {
  const saveData: Omit<SecureSave, 'checksum'> = {
    version: '1.0.0',
    timestamp: Date.now(),
    day: state.day,
    money: state.money,
    reputation: state.reputation,
    ethicsScore: state.ethicsScore,
    performers: state.performers,
    relationships: state.relationships,
    storyFlags: state.storyFlags,
    completedEvents: state.completedEvents,
    upgrades: state.upgrades,
    cityDemand: state.cityDemand,
    genreTrend: state.genreTrend,
    riskLevel: state.riskLevel,
    eventCooldowns: state.eventCooldowns,
    eventHistory: state.eventHistory,
    lastEventDay: state.lastEventDay,
    ownedClothing: state.ownedClothing,
    crowdMood: state.crowdMood,
    seasonalTrends: state.seasonalTrends,
    viralTrends: state.viralTrends,
    activeRumors: state.activeRumors,
    dramaLevel: state.dramaLevel,
    stageProps: state.stageProps,
    activeEffects: state.activeEffects,
    maintenanceCost: state.maintenanceCost,
    rivalClubs: state.rivalClubs,
    fame: state.fame,
    camShowBranch: state.camShowBranch,
    vipWebsite: state.vipWebsite,
    managedTroupes: state.managedTroupes,
    availableCards: state.availableCards,
    usedCardsThisNight: state.usedCardsThisNight,
  };

  const checksum = generateChecksumSync(saveData as Record<string, unknown>);
  return {
    ...saveData,
    checksum,
  };
}

/**
 * Verifies a secure save (async version)
 * Matches Python implementation: raises ValueError if integrity check fails
 */
export async function verifySecureSave(save: SecureSave): Promise<{ valid: boolean; reason?: string }> {
  try {
    console.log('[AntiCheat] verifySecureSave: Starting verification...');
    
    // Verify checksum exists
    if (!save.checksum) {
      console.log('[AntiCheat] verifySecureSave: No checksum found');
      return { valid: false, reason: 'Save file integrity check failed: no checksum' };
    }

    // Check if Web Crypto API is available
    // Use safe feature detection wrapped in try-catch to prevent freezing on GitHub Pages
    let hasWebCrypto = false;
    try {
      hasWebCrypto = 
        typeof window !== 'undefined' &&
        typeof globalThis.crypto !== 'undefined' &&
        typeof globalThis.crypto.subtle !== 'undefined' &&
        typeof globalThis.crypto.subtle.digest === 'function';
    } catch {
      hasWebCrypto = false;
    }
    
    if (!hasWebCrypto) {
      console.warn('[AntiCheat] Web Crypto API not available, using sync verification');
      return verifySecureSaveSync(save);
    }

    // Compute current checksum
    console.log('[AntiCheat] verifySecureSave: Computing checksum...');
    const currentChecksum = await generateChecksum(save as unknown as Record<string, unknown>);
    console.log('[AntiCheat] verifySecureSave: Checksum computed:', currentChecksum.substring(0, 8) + '...');
    
    if (currentChecksum !== save.checksum) {
      console.log('[AntiCheat] verifySecureSave: Checksum mismatch');
      return { valid: false, reason: 'Save file integrity check failed: checksum mismatch' };
    }

    // Convert save to GameState for validation
    const gameState: GameState = {
      day: save.day,
      money: save.money,
      reputation: save.reputation,
      ethicsScore: save.ethicsScore,
      performers: save.performers,
      relationships: save.relationships || {},
      storyFlags: save.storyFlags || {},
      completedEvents: save.completedEvents || [],
      upgrades: save.upgrades,
      cityDemand: save.cityDemand,
      genreTrend: save.genreTrend,
      riskLevel: save.riskLevel as "conservative" | "standard" | "bold",
      eventCooldowns: save.eventCooldowns,
      eventHistory: save.eventHistory,
      lastEventDay: save.lastEventDay,
      ownedClothing: save.ownedClothing || [],
      crowdMood: save.crowdMood || {},
      seasonalTrends: save.seasonalTrends || [],
      viralTrends: save.viralTrends || [],
      activeRumors: save.activeRumors || [],
      dramaLevel: save.dramaLevel || 0,
      stageProps: save.stageProps || [],
      activeEffects: save.activeEffects || [],
      maintenanceCost: save.maintenanceCost || 0,
      rivalClubs: save.rivalClubs || [],
      fame: save.fame || 0,
      camShowBranch: save.camShowBranch || false,
      vipWebsite: save.vipWebsite || false,
      managedTroupes: save.managedTroupes || [],
      availableCards: save.availableCards || [],
      usedCardsThisNight: save.usedCardsThisNight || [],
      vipRooms: save.vipRooms || [],
      ownedFetishItems: save.ownedFetishItems || [],
      activePatronRequests: save.activePatronRequests || [],
      adultContentLevel: save.adultContentLevel || 50,
      brothelRooms: save.brothelRooms || [],
      brothelWorkers: save.brothelWorkers || [],
      brothelSessions: save.brothelSessions || [],
      brothelReputation: save.brothelReputation || 50,
      brothelEnabled: save.brothelEnabled || false,
    };

    // Validate game state
    console.log('[AntiCheat] verifySecureSave: Validating game state...');
    const validation = validateGameState(gameState);
    if (!validation.valid) {
      console.log('[AntiCheat] verifySecureSave: Invalid game state:', validation.errors);
      return { valid: false, reason: `Invalid game state: ${validation.errors.join('; ')}` };
    }

    console.log('[AntiCheat] verifySecureSave: Verification successful');
    return { valid: true };
  } catch (error) {
    console.error('[AntiCheat] Error during save verification:', error);
    return { valid: false, reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Synchronous version for when async is not possible
 */
export function verifySecureSaveSync(save: SecureSave): { valid: boolean; reason?: string } {
  // Verify checksum exists
  if (!save.checksum) {
    return { valid: false, reason: 'Save file integrity check failed: no checksum' };
  }

  // Compute current checksum
  const currentChecksum = generateChecksumSync(save as unknown as Record<string, unknown>);
  if (currentChecksum !== save.checksum) {
    return { valid: false, reason: 'Save file integrity check failed: checksum mismatch' };
  }

  // Convert save to GameState for validation
  const gameState: GameState = {
    day: save.day,
    money: save.money,
    reputation: save.reputation,
    ethicsScore: save.ethicsScore,
    performers: save.performers,
    relationships: save.relationships || {},
    storyFlags: save.storyFlags || {},
    completedEvents: save.completedEvents || [],
    upgrades: save.upgrades,
    cityDemand: save.cityDemand,
    genreTrend: save.genreTrend,
    riskLevel: save.riskLevel as "conservative" | "standard" | "bold",
    eventCooldowns: save.eventCooldowns,
    eventHistory: save.eventHistory,
    lastEventDay: save.lastEventDay,
    ownedClothing: save.ownedClothing || [],
    crowdMood: save.crowdMood || {},
    seasonalTrends: save.seasonalTrends || [],
    viralTrends: save.viralTrends || [],
    activeRumors: save.activeRumors || [],
    dramaLevel: save.dramaLevel || 0,
    stageProps: save.stageProps || [],
    activeEffects: save.activeEffects || [],
    maintenanceCost: save.maintenanceCost || 0,
    rivalClubs: save.rivalClubs || [],
    fame: save.fame || 0,
    camShowBranch: save.camShowBranch || false,
    vipWebsite: save.vipWebsite || false,
    managedTroupes: save.managedTroupes || [],
    availableCards: save.availableCards || [],
    usedCardsThisNight: save.usedCardsThisNight || [],
    vipRooms: save.vipRooms || [],
    ownedFetishItems: save.ownedFetishItems || [],
    activePatronRequests: save.activePatronRequests || [],
    adultContentLevel: save.adultContentLevel || 50,
    brothelRooms: save.brothelRooms || [],
    brothelWorkers: save.brothelWorkers || [],
    brothelSessions: save.brothelSessions || [],
    brothelReputation: save.brothelReputation || 50,
    brothelEnabled: save.brothelEnabled || false,
  };

  // Validate game state
  const validation = validateGameState(gameState);
  if (!validation.valid) {
    return { valid: false, reason: `Invalid game state: ${validation.errors.join('; ')}` };
  }

  return { valid: true };
}
