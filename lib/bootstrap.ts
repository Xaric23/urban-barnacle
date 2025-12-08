// Bootstrap/Launcher System for Underground Club Manager
// Handles game initialization, integrity checks, and loading sequence
// Enhanced version that uses the anti-cheat system from game.py

import { GameState } from './types';
import { createInitialGameState } from './gameLogic';
import { 
  sanitizeGameState,
  detectTimeManipulation,
  SecureSave,
  verifySecureSaveSync,
  createSecureSaveSync
} from './antiCheat';

export enum BootstrapStatus {
  INITIALIZING = 'initializing',
  VALIDATING = 'validating',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export interface BootstrapState {
  status: BootstrapStatus;
  progress: number; // 0-100
  message: string;
  error?: string;
  warnings: string[];
}

export interface BootstrapResult {
  success: boolean;
  gameState: GameState;
  isNewGame: boolean;
  warnings: string[];
  error?: string;
}

/**
 * Bootstrap the game with full initialization sequence
 */
export async function bootstrapGame(
  onProgress?: (state: BootstrapState) => void
): Promise<BootstrapResult> {
  console.log('[Bootstrap] Starting bootstrap process...');
  const warnings: string[] = [];
  
  try {
    // Step 1: Initialize
    updateProgress(onProgress, {
      status: BootstrapStatus.INITIALIZING,
      progress: 0,
      message: 'Initializing game systems...',
      warnings: [],
    });
    console.log('[Bootstrap] Step 1: Initializing...');
    await delay(300);

  // Step 2: Check for existing save
  console.log('[Bootstrap] Step 2: Checking for saved game...');
  updateProgress(onProgress, {
    status: BootstrapStatus.VALIDATING,
    progress: 25,
    message: 'Checking for saved game...',
    warnings: [],
  });
  await delay(200);

  const savedData = loadFromStorage();
  console.log('[Bootstrap] Saved data:', savedData ? 'Found' : 'Not found');
  
  if (!savedData) {
    // No save found - create new game
    console.log('[Bootstrap] Creating new game...');
    updateProgress(onProgress, {
      status: BootstrapStatus.LOADING,
      progress: 75,
      message: 'Creating new game...',
      warnings: [],
    });
    await delay(200);

    const newGame = createInitialGameState();
    console.log('[Bootstrap] Saving new game...');
    await saveToStorage(newGame);

    updateProgress(onProgress, {
      status: BootstrapStatus.READY,
      progress: 100,
      message: 'Game ready!',
      warnings: [],
    });
    console.log('[Bootstrap] Bootstrap complete - new game created');

    return {
      success: true,
      gameState: newGame,
      isNewGame: true,
      warnings: [],
    };
  }

  // Step 3: Validate saved data
  console.log('[Bootstrap] Step 3: Validating save file...');
  updateProgress(onProgress, {
    status: BootstrapStatus.VALIDATING,
    progress: 40,
    message: 'Validating save file integrity...',
    warnings: [],
  });
  await delay(300);

  // Use sync verification for better compatibility with Electron/older Node
  console.log('[Bootstrap] Using sync verification for compatibility...');
  const validation = verifySecureSaveSync(savedData);
  console.log('[Bootstrap] Sync verification result:', validation);
  
  if (!validation.valid) {
    // Save is corrupted or tampered with
    warnings.push(`Save validation failed: ${validation.reason}`);
    warnings.push('🔒 Anti-cheat detected tampering - creating new game');

    updateProgress(onProgress, {
      status: BootstrapStatus.LOADING,
      progress: 60,
      message: 'Save file corrupted, creating new game...',
      warnings,
    });
    await delay(300);

    const newGame = createInitialGameState();
    await saveToStorage(newGame);

    updateProgress(onProgress, {
      status: BootstrapStatus.READY,
      progress: 100,
      message: 'Game ready! (new game created)',
      warnings,
    });

    return {
      success: true,
      gameState: newGame,
      isNewGame: true,
      warnings,
    };
  }

  // Step 4: Additional integrity checks
  updateProgress(onProgress, {
    status: BootstrapStatus.VALIDATING,
    progress: 60,
    message: 'Performing integrity checks...',
    warnings: [],
  });
  await delay(200);

  // Convert SecureSave to GameState
  let gameState: GameState = {
    day: savedData.day,
    money: savedData.money,
    reputation: savedData.reputation,
    ethicsScore: savedData.ethicsScore,
    performers: savedData.performers,
    relationships: savedData.relationships || {},
    storyFlags: savedData.storyFlags || {},
    completedEvents: savedData.completedEvents || [],
    upgrades: savedData.upgrades,
    cityDemand: savedData.cityDemand,
    genreTrend: savedData.genreTrend,
    riskLevel: savedData.riskLevel as "conservative" | "standard" | "bold",
    eventCooldowns: savedData.eventCooldowns,
    eventHistory: savedData.eventHistory,
    lastEventDay: savedData.lastEventDay,
    ownedClothing: savedData.ownedClothing || [],
    crowdMood: savedData.crowdMood || {},
    seasonalTrends: savedData.seasonalTrends || [],
    viralTrends: savedData.viralTrends || [],
    activeRumors: savedData.activeRumors || [],
    dramaLevel: savedData.dramaLevel || 0,
    stageProps: savedData.stageProps || [],
    activeEffects: savedData.activeEffects || [],
    maintenanceCost: savedData.maintenanceCost || 0,
    rivalClubs: savedData.rivalClubs || [],
    fame: savedData.fame || 0,
    camShowBranch: savedData.camShowBranch || false,
    vipWebsite: savedData.vipWebsite || false,
    managedTroupes: savedData.managedTroupes || [],
    availableCards: savedData.availableCards || [],
    usedCardsThisNight: savedData.usedCardsThisNight || [],
    vipRooms: savedData.vipRooms || [],
    ownedFetishItems: savedData.ownedFetishItems || [],
    activePatronRequests: savedData.activePatronRequests || [],
    adultContentLevel: savedData.adultContentLevel || 50,
    brothelRooms: savedData.brothelRooms || [],
    brothelWorkers: savedData.brothelWorkers || [],
    brothelSessions: savedData.brothelSessions || [],
    brothelReputation: savedData.brothelReputation || 50,
    brothelEnabled: savedData.brothelEnabled || false,
  };

  // Check for time manipulation
  if (detectTimeManipulation(gameState)) {
    warnings.push('Warning: Time manipulation detected. Game state sanitized.');
    gameState = sanitizeGameState(gameState);
  }

  // Step 5: Load game
  updateProgress(onProgress, {
    status: BootstrapStatus.LOADING,
    progress: 80,
    message: 'Loading game state...',
    warnings,
  });
  await delay(300);

  // Ensure backward compatibility
  gameState = ensureBackwardCompatibility(gameState);

  updateProgress(onProgress, {
    status: BootstrapStatus.READY,
    progress: 100,
    message: 'Game loaded successfully!',
    warnings,
  });

  return {
    success: true,
    gameState,
    isNewGame: false,
    warnings,
  };
  } catch (error) {
    console.error('[Bootstrap] Fatal error during bootstrap:', error);
    
    updateProgress(onProgress, {
      status: BootstrapStatus.ERROR,
      progress: 0,
      message: 'Bootstrap failed',
      warnings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Return a new game on error
    const newGame = createInitialGameState();
    return {
      success: false,
      gameState: newGame,
      isNewGame: true,
      warnings: [],
      error: error instanceof Error ? error.message : 'Bootstrap failed with unknown error',
    };
  }
}

/**
 * Save game state with anti-cheat protection
 * Uses synchronous operations to avoid Electron/Node compatibility issues
 */
export async function saveToStorage(state: GameState): Promise<void> {
  if (typeof window === 'undefined') {
    console.log('[Bootstrap] saveToStorage: window undefined, skipping');
    return;
  }

  console.log('[Bootstrap] saveToStorage: Starting save process...');
  
  // Use sync method directly for better compatibility with Electron/older Node
  const secureSave = createSecureSaveSync(state);
  localStorage.setItem('clubManagerSave', JSON.stringify(secureSave));
  console.log('[Bootstrap] saveToStorage: Save complete');
}

/**
 * Load game state from storage
 */
export function loadFromStorage(): SecureSave | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const saved = localStorage.getItem('clubManagerSave');
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as SecureSave;
  } catch (error) {
    console.error('Failed to parse save file:', error);
    return null;
  }
}

/**
 * Ensure backward compatibility with older save formats
 */
function ensureBackwardCompatibility(state: GameState): GameState {
  const updated = { ...state };

  // Ensure new fields exist
  if (!updated.ownedClothing) {
    updated.ownedClothing = [];
  }

  if (!updated.eventCooldowns) {
    updated.eventCooldowns = {};
  }

  if (!updated.eventHistory) {
    updated.eventHistory = [];
  }

  if (updated.lastEventDay === undefined) {
    updated.lastEventDay = 0;
  }

  // Ensure all performers have required fields
  updated.performers = updated.performers.map(performer => {
    const p = { ...performer };
    
    if (!p.wardrobe) {
      p.wardrobe = {
        top: null,
        bottom: null,
        shoes: null,
        accessory: null,
      };
    }

    if (p.tipsEarned === undefined) {
      p.tipsEarned = 0;
    }

    return p;
  });

  return updated;
}

/**
 * Utility to update progress callback
 */
function updateProgress(
  callback: ((state: BootstrapState) => void) | undefined,
  state: BootstrapState
): void {
  if (callback) {
    callback(state);
  }
}

/**
 * Utility delay function for smooth loading animations
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Delete saved game
 */
export function deleteSave(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clubManagerSave');
  }
}

/**
 * Export save for backup
 */
export function exportSave(): string | null {
  const save = loadFromStorage();
  if (!save) {
    return null;
  }
  return JSON.stringify(save, null, 2);
}

/**
 * Import save from backup
 */
export async function importSave(saveData: string): Promise<{ success: boolean; error?: string }> {
  try {
    const save = JSON.parse(saveData) as SecureSave;
    const validation = verifySecureSaveSync(save);
    
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('clubManagerSave', saveData);
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Invalid save file format' };
  }
}
