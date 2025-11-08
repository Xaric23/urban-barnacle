# Bootstrap/Launcher System & Anti-Cheat Documentation

## Overview

This document describes the new bootstrap/launcher system and enhanced anti-cheat implementation for Underground Club Manager. The system is ported and improved from the Python `game.py` implementation, providing robust save file protection and a professional game initialization experience.

## Anti-Cheat System

### Core Features

The anti-cheat system prevents save file tampering and ensures game integrity through multiple layers of protection:

#### 1. **SHA-256 Checksum Validation**

Matching the Python implementation in `game.py`, the system uses SHA-256 hashing with a salt to detect any modifications to save files:

```typescript
const SAVE_SALT = "v1|NightclubGameSalt|DoNotModify";
```

- **How it works**: Every save includes a SHA-256 checksum computed from all game data + salt
- **Detection**: If save data is modified, the checksum won't match and the save is rejected
- **Python equivalent**: `compute_checksum()` in game.py (lines 52-56)

#### 2. **Data Integrity Validation**

Validates all game state values to prevent impossible or cheated values:

- **Reputation & Ethics**: Clamped to 0-100 range
- **Money**: Reasonable limits (-$10,000 to $100,000,000)
- **Day**: Valid range (1-10,000)
- **Performer Stats**: 
  - Skill: 1-10
  - Loyalty: 1-10
  - Energy: 0-10
  - Salary: 0-100,000
  - Reputation: -10 to 10

#### 3. **Time Manipulation Detection**

Detects attempts to manipulate timestamps:
- Checks if `lastEventDay` is in the future
- Validates event cooldowns for impossible values
- Auto-sanitizes suspicious timestamps

#### 4. **State Sanitization**

When anomalies are detected, the system automatically sanitizes values rather than rejecting the entire save:
- Clamps values to valid ranges
- Preserves as much data as possible
- Warns the player about corrections made

### API Reference

#### `generateChecksum(data: Record<string, unknown>): Promise<string>`

Generates a SHA-256 checksum for save data validation.

**Parameters:**
- `data`: Game state object (checksum field will be excluded)

**Returns:** SHA-256 hash as hexadecimal string

**Example:**
```typescript
const checksum = await generateChecksum(saveData);
```

#### `validateGameState(state: GameState): { valid: boolean; errors: string[] }`

Validates all game state values for impossible or cheated values.

**Parameters:**
- `state`: Complete game state object

**Returns:** Validation result with array of error messages

**Example:**
```typescript
const validation = validateGameState(gameState);
if (!validation.valid) {
  console.error('Invalid state:', validation.errors);
}
```

#### `sanitizeGameState(state: GameState): GameState`

Sanitizes game state by clamping values to valid ranges.

**Parameters:**
- `state`: Game state to sanitize

**Returns:** Sanitized game state

**Example:**
```typescript
const cleanState = sanitizeGameState(gameState);
```

#### `detectTimeManipulation(state: GameState): boolean`

Detects potential timestamp manipulation.

**Parameters:**
- `state`: Game state to check

**Returns:** `true` if manipulation detected

**Example:**
```typescript
if (detectTimeManipulation(gameState)) {
  console.warn('Time manipulation detected!');
}
```

## Bootstrap/Launcher System

### Features

The bootstrap system provides a professional game initialization experience with:

1. **Multi-stage initialization sequence**
   - Initializing (0%)
   - Validating (25-60%)
   - Loading (60-80%)
   - Ready (100%)

2. **Save file integrity checking**
   - Validates checksums
   - Checks for corruption
   - Handles backward compatibility

3. **Graceful error handling**
   - Creates new game if save is corrupted
   - Displays warnings for non-critical issues
   - Sanitizes suspicious data automatically

4. **Visual feedback**
   - Professional loading screen
   - Progress bar with animations
   - Status indicators with icons
   - Warning/error displays

### Initialization Sequence

```
┌──────────────┐
│ INITIALIZING │ (0%) - Initialize game systems
└──────┬───────┘
       │
┌──────▼───────┐
│  VALIDATING  │ (25-60%) - Check for saved game, validate integrity
└──────┬───────┘
       │
┌──────▼───────┐
│   LOADING    │ (60-80%) - Load game state, ensure compatibility
└──────┬───────┘
       │
┌──────▼───────┐
│    READY     │ (100%) - Game ready to play
└──────────────┘
```

### API Reference

#### `bootstrapGame(onProgress?: (state: BootstrapState) => void): Promise<BootstrapResult>`

Bootstrap the game with full initialization sequence.

**Parameters:**
- `onProgress`: Optional callback for progress updates

**Returns:** Promise resolving to bootstrap result

**Example:**
```typescript
const result = await bootstrapGame((state) => {
  console.log(`${state.status}: ${state.progress}%`);
});

if (result.success) {
  setGameState(result.gameState);
}
```

#### `saveToStorage(state: GameState): Promise<void>`

Save game state with anti-cheat protection.

**Parameters:**
- `state`: Game state to save

**Example:**
```typescript
await saveToStorage(gameState);
```

#### `loadFromStorage(): SecureSave | null`

Load game state from storage.

**Returns:** Secure save object or null if no save exists

**Example:**
```typescript
const save = loadFromStorage();
if (save) {
  const validation = await verifySecureSave(save);
  if (validation.valid) {
    // Load game
  }
}
```

#### `deleteSave(): void`

Delete saved game from localStorage.

**Example:**
```typescript
deleteSave();
```

#### `exportSave(): string | null`

Export save for backup.

**Returns:** JSON string of save data or null

**Example:**
```typescript
const backup = exportSave();
if (backup) {
  // Download or copy to clipboard
}
```

#### `importSave(saveData: string): Promise<{ success: boolean; error?: string }>`

Import save from backup.

**Parameters:**
- `saveData`: JSON string of save data

**Returns:** Import result with success status

**Example:**
```typescript
const result = await importSave(backupData);
if (!result.success) {
  alert(result.error);
}
```

## Save File Format

### SecureSave Structure

```typescript
interface SecureSave {
  version: string;           // Save format version (e.g., "1.0.0")
  timestamp: number;          // Unix timestamp when saved
  checksum: string;           // SHA-256 checksum
  day: number;                // Current game day
  money: number;              // Current money
  reputation: number;         // Club reputation (0-100)
  ethicsScore: number;        // Ethics score (0-100)
  performers: Performer[];    // Array of performers
  relationships: Record<string, number>;
  storyFlags: Record<string, boolean>;
  completedEvents: string[];
  upgrades: Record<string, number>;
  cityDemand: number;
  genreTrend: Record<string, number>;
  riskLevel: string;
  eventCooldowns: Record<string, number>;
  eventHistory: string[];
  lastEventDay: number;
  ownedClothing: string[];
}
```

### Example Save File

```json
{
  "version": "1.0.0",
  "timestamp": 1699459200000,
  "checksum": "a1b2c3d4e5f6...",
  "day": 15,
  "money": 12500,
  "reputation": 65,
  "ethicsScore": 55,
  "performers": [...],
  "upgrades": {
    "sound_system": 2,
    "vip_lounge": 1
  },
  "cityDemand": 110,
  "riskLevel": "standard",
  ...
}
```

## Security Considerations

### What the System Protects Against

✅ **Save file editing** - Checksum validation prevents manual editing
✅ **Memory manipulation** - Values validated on load and during gameplay
✅ **Time manipulation** - Timestamp validation catches date/time changes
✅ **Impossible values** - Range validation prevents unrealistic stats
✅ **Save file injection** - Format validation ensures proper structure

### What the System Does NOT Protect Against

❌ **Browser DevTools manipulation** - Client-side game, vulnerable to runtime changes
❌ **localStorage clearing** - Players can always start fresh
❌ **Determined hackers** - Client-side code can be modified

### Best Practices

1. **Regular validation**: Game state is validated on every load
2. **Graceful degradation**: Corrupted saves create new game instead of crashing
3. **User transparency**: Warnings inform players when anomalies are detected
4. **Backward compatibility**: Old saves are automatically upgraded

## UI Components

### LoadingScreen Component

Professional loading screen with:
- Animated progress bar
- Status indicators with icons (🔄 🔍 📦 ✅ ❌)
- Warning/error displays
- Pulsing animations
- Anti-cheat badge

**Props:**
```typescript
interface LoadingScreenProps {
  bootstrapState: BootstrapState;
}
```

**Usage:**
```typescript
<LoadingScreen bootstrapState={bootstrapState} />
```

## Integration Example

Complete integration in main game page:

```typescript
const [gameState, setGameState] = useState<GameState | null>(null);
const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
  status: BootstrapStatus.INITIALIZING,
  progress: 0,
  message: 'Starting...',
  warnings: [],
});
const [isBootstrapping, setIsBootstrapping] = useState(true);

useEffect(() => {
  const initGame = async () => {
    const result = await bootstrapGame(setBootstrapState);
    
    if (result.success) {
      setGameState(result.gameState);
      if (result.warnings.length > 0) {
        alert('⚠️ Warnings:\n' + result.warnings.join('\n'));
      }
    }
    
    setTimeout(() => setIsBootstrapping(false), 800);
  };

  initGame();
}, []);

useEffect(() => {
  if (gameState && !isBootstrapping) {
    saveToStorage(gameState);
  }
}, [gameState, isBootstrapping]);
```

## Auto-Update System Integration

The bootstrap system now works alongside an auto-update system (for desktop executable builds only):

- **Automatic Updates**: When new versions are released on GitHub Releases, the desktop app automatically checks for updates
- **User Control**: Users choose when to download and install updates
- **No Interruption**: Update checks happen in the background
- **Save Compatibility**: Game saves are preserved during updates
- **Bootstrap + Updates**: The bootstrap system validates saves on every load, including after updates

See [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md) for complete auto-update documentation.

## Future Enhancements

Potential improvements for the anti-cheat system:

1. **Server-side validation** - Move critical validation to backend
2. **Achievement tracking** - Detect impossible achievement patterns
3. **Play session tracking** - Monitor for unrealistic progress rates
4. **Encrypted saves** - Add encryption layer on top of checksums
5. **Cloud sync** - Sync saves to prevent local tampering
6. **Replay validation** - Record and validate player actions

## Migration Guide

### From Old Save System

Old saves (without checksums) are automatically detected and migrated:

1. System attempts to load old save
2. Checksum is missing → triggers migration
3. New checksum is computed and added
4. Save is re-saved in new format
5. Player continues with no interruption

### Breaking Changes

- Save file format now includes `checksum` field
- localStorage key remains `clubManagerSave` for compatibility
- All game state mutations must go through proper save functions

## Testing

### Manual Testing Checklist

- [ ] Fresh game creation works
- [ ] Save/load cycle preserves data
- [ ] Editing save file triggers warning
- [ ] Invalid values are sanitized
- [ ] Loading screen displays correctly
- [ ] Progress bar animates smoothly
- [ ] Warnings display properly
- [ ] Old saves migrate successfully

### Test Cases

```typescript
// Test 1: Checksum validation
const save = await createSecureSave(gameState);
save.money = 999999999; // Tamper with money
const result = await verifySecureSave(save);
// Expected: validation.valid === false

// Test 2: Value sanitization
gameState.reputation = 150; // Invalid
const sanitized = sanitizeGameState(gameState);
// Expected: sanitized.reputation === 100

// Test 3: Time manipulation
gameState.lastEventDay = gameState.day + 100; // Future date
const manipulated = detectTimeManipulation(gameState);
// Expected: manipulated === true
```

## Support

For issues or questions:
1. Check the validation error messages
2. Review console logs for detailed errors
3. Try deleting save and starting fresh
4. File an issue on GitHub with error details

## License

Part of Underground Club Manager - See main LICENSE file
