# Anti-Cheat System Documentation

## Overview

This document describes the anti-cheat implementation for Underground Club Manager. The system is ported and improved from the Python `game.py` implementation, providing robust save file protection and ensuring game integrity.

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


## Save/Load System

### Overview

The game uses a simple save/load system in `lib/gameLogic.ts` that integrates with the anti-cheat system to ensure save file integrity.

### API Reference

#### `saveGame(state: GameState): void`

Saves the game state to localStorage with anti-cheat protection.

**Parameters:**
- `state`: Complete game state object

**Example:**
```typescript
saveGame(gameState);
```

**Features:**
- Automatically adds SHA-256 checksum
- Stores in localStorage as 'clubManagerSave'
- Silently handles errors (logs to console)

#### `loadGame(): GameState | null`

Loads and validates game state from localStorage.

**Returns:** Game state object or `null` if no save exists or validation fails

**Example:**
```typescript
const savedGame = loadGame();
if (savedGame) {
  // Use saved game
} else {
  // Create new game
}
```

**Features:**
- Validates checksum before loading
- Detects time manipulation
- Ensures backward compatibility
- Sanitizes suspicious data
- Returns `null` for invalid saves

#### `deleteSave(): void`

Deletes the saved game from localStorage.

**Example:**
```typescript
deleteSave();
```

## Integration Example

```typescript
// In your component
useEffect(() => {
  // Load game on mount
  const savedGame = loadGame();
  if (savedGame) {
    setGameState(savedGame);
  } else {
    setGameState(createInitialGameState());
  }
}, []);

useEffect(() => {
  // Auto-save on state changes
  if (gameState) {
    saveGame(gameState);
  }
}, [gameState]);
```

## Security Notes

- **Salt**: The save salt is `"v1|NightclubGameSalt|DoNotModify"`. Changing this will invalidate all existing saves.
- **Checksum**: SHA-256 hash is computed from all save data (excluding the checksum field itself).
- **Validation**: Invalid saves are rejected and `null` is returned. The game should handle this gracefully by creating a new game.
- **Browser Compatibility**: The system uses Web Crypto API when available, with a fallback for older browsers.

## Best Practices

1. **Always validate loads**: Check if `loadGame()` returns `null` before using the data
2. **Handle missing saves gracefully**: Create a new game if no valid save exists
3. **Don't modify the salt**: Changing the salt will break all existing saves
4. **Test backward compatibility**: Ensure new game state fields have defaults in `loadGame()`
5. **Auto-save frequently**: Save after significant game state changes to prevent data loss

## Troubleshooting

### Save not loading

**Problem**: Game always starts fresh, never loads saved data

**Solutions:**
1. Check browser console for validation errors
2. Verify localStorage is enabled in the browser
3. Check if the save data was corrupted (manually inspect localStorage)
4. Clear localStorage and try creating a new save

### Checksum mismatch errors

**Problem**: Save validation fails with checksum mismatch

**Solutions:**
1. This usually means the save was tampered with or corrupted
2. Clear localStorage and start a new game
3. If persistent, check if game state structure changed (add backward compatibility)

### Time manipulation warnings

**Problem**: Game detects time manipulation

**Solutions:**
1. This occurs if `lastEventDay` is in the future or cooldowns are impossible
2. The system auto-sanitizes these values
3. If persistent, the save may be corrupted - start a new game
