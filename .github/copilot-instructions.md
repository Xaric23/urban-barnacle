# Copilot Instructions for Underground Club Manager

## Project Overview

**Underground Club Manager** is a text-based management game built with modern web technologies. Players run an underground nightclub, managing performers, finances, reputation, and ethical decisions.

### Tech Stack
- **Framework**: Next.js 14 (App Router with static export)
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Desktop App**: Electron (for .exe builds)
- **Build Tool**: Next.js Turbopack
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm

### Project Type
- Single-page application (SPA) game
- Client-side state management using React hooks
- Browser localStorage for save data
- Electron wrapper for desktop distribution

## Repository Structure

```
urban-barnacle/
├── .github/                    # GitHub configuration
│   └── copilot-instructions.md # This file
├── app/                        # Next.js App Router directory
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Main game page (bootstrap + game UI)
│   ├── globals.css            # Global styles and Tailwind imports
│   └── favicon.ico            # App icon
├── components/                 # React components (game UI)
│   ├── GameHeader.tsx         # Header with resources display
│   ├── GameMenu.tsx           # Main menu/actions
│   ├── LoadingScreen.tsx      # Bootstrap loading screen
│   ├── RecruitPerformer.tsx   # Performer recruitment UI
│   ├── ManagePerformers.tsx   # Performer management UI
│   ├── RunClubNight.tsx       # Club night simulation UI
│   ├── ViewStats.tsx          # Statistics dashboard
│   ├── UpgradeShop.tsx        # Upgrade purchase UI
│   └── [15 components total]  # Various game features
├── lib/                        # Core game logic
│   ├── types.ts               # TypeScript interfaces and enums (261 lines)
│   ├── constants.ts           # Game constants and data tables (400+ lines)
│   ├── gameLogic.ts           # Core game functions (700+ lines)
│   ├── antiCheat.ts           # SHA-256 save validation (400+ lines)
│   └── bootstrap.ts           # Loading/initialization system (250+ lines)
├── electron/                   # Electron main process
│   └── main.js                # Electron window setup + auto-updater
├── python-original/            # Original Python implementation (reference)
├── public/                     # Static assets (SVG icons)
├── package.json                # npm dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js config (static export)
├── eslint.config.mjs          # ESLint configuration
├── postcss.config.mjs         # PostCSS for Tailwind
├── .gitignore                 # Git ignore rules
└── [Documentation files]       # Multiple .md files
```

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle

# Install dependencies (requires Node.js 18+)
npm install

# Note: May show engine warnings for Node.js 22.12.0 requirement
# (Works fine with Node.js 20+)
```

### Development Commands

```bash
# Start development server (with hot reload)
npm run dev
# Opens at http://localhost:3000

# Run linter
npm run lint

# Build production static export
npm run build
# Creates optimized build in .next/ and out/

# Start production server (after build)
npm start

# Build Windows executable
npm run build-exe
# Creates installer in dist/ folder (Windows only)

# Electron development mode (requires dev server running)
npm run electron-dev
# Terminal 1: npm run dev
# Terminal 2: npm run electron-dev
```

### Build Notes

- **Build time**: ~10-30 seconds for production build
- **Output**: Static HTML/CSS/JS in `out/` directory
- **No SSR**: Static export mode (no server-side rendering)
- **Build cache**: Not configured (see warning during build)

## Code Patterns and Conventions

### TypeScript Usage

- **Strict mode enabled**: All type checking enforced
- **Target**: ES2017
- **Module system**: ESNext with bundler resolution
- **Path aliases**: `@/*` maps to project root

### Component Structure

Components follow a consistent pattern:

```typescript
// 1. Imports
import { useState } from 'react';
import type { GameState, Performer } from '@/lib/types';

// 2. Interface for props
interface ComponentProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onBack: () => void;
}

// 3. Component function
export default function ComponentName({ gameState, setGameState, onBack }: ComponentProps) {
  // 4. Local state
  const [localState, setLocalState] = useState<Type>(initialValue);
  
  // 5. Helper functions
  const handleAction = () => {
    // Logic here
  };
  
  // 6. JSX return
  return (
    <div className="...">
      {/* UI elements */}
    </div>
  );
}
```

### State Management

- **No external state library**: Pure React hooks
- **State ownership**: Main game state in `app/page.tsx`
- **State propagation**: Props drilling (gameState + setGameState)
- **Persistence**: Manual localStorage save/load
- **State shape**: Defined in `lib/types.ts` as `GameState` interface

### Styling

- **Tailwind CSS**: Utility-first approach
- **Common classes**: `bg-purple-900`, `text-gray-300`, `rounded-lg`, `p-4`, `mb-4`
- **Dark theme**: Purple/gray color scheme throughout
- **Responsive**: Not heavily optimized (desktop-first design)
- **Layout**: Flexbox and grid for layouts

### Game Logic

All game mechanics are in `lib/gameLogic.ts`:

```typescript
// Pure functions that take state and return modified state
export function recruitPerformer(state: GameState, performerData: PerformerData): GameState {
  // Create new state object (immutable pattern)
  return {
    ...state,
    performers: [...state.performers, newPerformer],
    money: state.money - cost,
  };
}
```

**Key principles:**
- Pure functions (no side effects)
- Immutable state updates
- Validate all inputs
- Return new state objects (don't mutate)

### Anti-Cheat System

The anti-cheat system (ported from Python) uses:

1. **SHA-256 checksums** with salt for save validation
2. **Data integrity checks** for impossible values
3. **Time manipulation detection**
4. **Automatic sanitization** when issues detected

**Important**: When modifying save/load:
- Always call `generateChecksum()` before saving
- Always call `validateGameState()` after loading
- Preserve the salt constant in `antiCheat.ts`
- Test with `localStorage` inspector to verify

## Adding New Features

### Adding a New Component

1. Create component in `components/`:
```typescript
// components/NewFeature.tsx
interface NewFeatureProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onBack: () => void;
}

export default function NewFeature({ gameState, setGameState, onBack }: NewFeatureProps) {
  // Implementation
}
```

2. Import in `app/page.tsx`
3. Add to menu/navigation in `components/GameMenu.tsx`
4. Add state property if needed in `lib/types.ts`

### Adding New Game Mechanics

1. **Define types** in `lib/types.ts`:
```typescript
export interface NewMechanic {
  id: string;
  value: number;
  // ...
}

export interface GameState {
  // ... existing fields
  newMechanic: NewMechanic[];
}
```

2. **Add constants** in `lib/constants.ts`:
```typescript
export const NEW_MECHANIC_DATA = {
  option1: { /* data */ },
  option2: { /* data */ },
};
```

3. **Implement logic** in `lib/gameLogic.ts`:
```typescript
export function performNewAction(state: GameState, params: ActionParams): GameState {
  // Validate inputs
  // Calculate results
  // Return new state
  return { ...state, /* changes */ };
}
```

4. **Create UI** in new component
5. **Update save validation** in `lib/antiCheat.ts` if needed

### Adding New Performer Types

1. Update enum in `lib/types.ts`:
```typescript
export enum PerformerType {
  // ... existing
  NEW_TYPE = "new_type",
}
```

2. Add constants in `lib/constants.ts`:
   - Salary range
   - Promotion path
   - Trait bonuses

3. Update UI in `RecruitPerformer.tsx` and other components

## Testing Approach

### Current State
- **No automated test suite** for TypeScript code
- **Python tests exist** in `python-original/test_game.py` (reference only)
- **Manual testing** is primary method

### Testing Strategy

When making changes:

1. **Build test**: Run `npm run build` - must succeed
2. **Lint test**: Run `npm run lint` - must pass
3. **Manual testing**:
   - Start dev server: `npm run dev`
   - Test new feature in browser
   - Test save/load functionality
   - Check console for errors
   - Verify anti-cheat doesn't trigger

4. **localStorage testing**:
```typescript
// In browser console:
localStorage.getItem('club_save') // Check save data
localStorage.clear() // Clear save for fresh start
```

5. **Edge case testing**:
   - Test with zero money
   - Test with maximum values
   - Test invalid inputs
   - Test missing data (for backwards compatibility)

### Common Test Scenarios

```bash
# Test build works
npm run build

# Test development mode
npm run dev
# Navigate to http://localhost:3000
# Recruit a performer
# Run club night
# Save game (advance day)
# Refresh browser
# Verify save loaded correctly

# Test production build
npm run build
npm start
# Navigate to http://localhost:3000
# Test key features

# Test executable (Windows only)
npm run build-exe
# Install from dist/ folder
# Launch and test
```

## Common Issues and Solutions

### Issue: Node version warning

```
npm warn EBADENGINE Unsupported engine
required: { node: '>=22.12.0' }
current: { node: 'v20.19.5' }
```

**Solution**: Safe to ignore. Project works fine with Node.js 18+. The warning is from electron dependencies.

### Issue: Build fails with TypeScript errors

**Solutions**:
1. Check `tsconfig.json` hasn't been modified
2. Ensure all types are imported from `lib/types.ts`
3. Run `npm install` to ensure dependencies are fresh
4. Check for syntax errors in `.ts`/`.tsx` files

### Issue: Tailwind styles not working

**Solutions**:
1. Verify `globals.css` has Tailwind imports
2. Check `tailwindcss` is in `devDependencies`
3. Restart dev server after config changes
4. Clear Next.js cache: `rm -rf .next/`

### Issue: Save data corruption

**Solutions**:
1. Clear localStorage: `localStorage.clear()` in browser console
2. Check anti-cheat validation in console logs
3. Verify checksum generation in save function
4. Check if new state properties are handled in validation

### Issue: Electron build fails

**Solutions**:
1. Ensure Next.js build completed: `npm run build`
2. Check `out/` directory exists and has files
3. Windows only: Run on Windows machine or VM
4. Check `electron-builder` logs in console

### Issue: Hot reload not working

**Solutions**:
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Hard refresh browser: `Ctrl+Shift+R`
3. Check for syntax errors in console
4. Clear Next.js cache: `rm -rf .next/`

## Important Files to Understand

### `/lib/types.ts` (261 lines)
- **Purpose**: All TypeScript interfaces and enums
- **Key exports**: `GameState`, `Performer`, `PerformerType`, all enums
- **When to modify**: Adding new game mechanics or data structures
- **Critical**: Changes here ripple through entire codebase

### `/lib/gameLogic.ts` (700+ lines)
- **Purpose**: Core game mechanics and calculations
- **Pattern**: Pure functions taking state and returning new state
- **Key functions**: 
  - `createNewGame()` - Initialize game state
  - `recruitPerformer()` - Hire new performer
  - `runClubNight()` - Simulate club operation
  - `trainPerformer()` - Skill improvement
  - `advanceDay()` - Progress time and save
- **Testing**: Any changes should be manually tested in-game

### `/lib/antiCheat.ts` (400+ lines)
- **Purpose**: Save file integrity and validation
- **Critical**: SHA-256 implementation matches Python version
- **Key functions**:
  - `generateChecksum()` - Create SHA-256 hash
  - `validateGameState()` - Check for impossible values
  - `sanitizeGameState()` - Fix invalid values
  - `detectTimeManipulation()` - Catch time exploits
- **Warning**: Don't modify salt or hash algorithm without good reason

### `/app/page.tsx` (298 lines)
- **Purpose**: Main game container with bootstrap integration
- **Responsibilities**:
  - State management (top-level)
  - Loading screen / bootstrap
  - Save/load orchestration
  - Component routing/navigation
- **Pattern**: Single state object passed to all components

### `/components/GameMenu.tsx` (105 lines)
- **Purpose**: Main menu with all game actions
- **Pattern**: Button list with state-based navigation
- **When to modify**: Adding new features/screens

## Best Practices

### Do's ✓
- **Use TypeScript strictly** - Define all types
- **Keep components focused** - One responsibility per component
- **Pure functions** - Game logic should be side-effect free
- **Immutable updates** - Always create new state objects
- **Validate inputs** - Check all user input and data
- **Test save/load** - After any state changes
- **Follow existing patterns** - Match code style in the file
- **Document complex logic** - Add comments for non-obvious code

### Don'ts ✗
- **Don't mutate state** - Always create new objects
- **Don't skip build tests** - Run `npm run build` before committing
- **Don't modify anti-cheat salt** - Breaks existing saves
- **Don't add external state libraries** - Use React hooks
- **Don't ignore TypeScript errors** - Fix all type issues
- **Don't break backwards compatibility** - Handle missing save fields
- **Don't remove existing features** - Only add or enhance
- **Don't commit node_modules** - Already in `.gitignore`

## Performance Considerations

### Current Performance
- **Build time**: ~10-30 seconds
- **Bundle size**: ~2-3 MB (static export)
- **Runtime**: Fast (no heavy computations)
- **Save data**: <100 KB typically

### Optimization Tips
- **Avoid large lists**: Performers limited in practice (5-20 typical)
- **Lazy load components**: Not currently implemented but possible
- **Memoize expensive calculations**: Use `useMemo` if needed
- **Debounce frequent updates**: For rapid state changes

### Known Limitations
- No build caching configured
- No code splitting beyond Next.js defaults
- No image optimization (static export)
- No SSR/SSG benefits (client-only game)

## Electron-Specific Notes

### Auto-Update System

The Electron build includes automatic update checking:

- **Implementation**: `electron/main.js` using `electron-updater`
- **Trigger**: 3 seconds after app launch (production only)
- **Source**: GitHub Releases
- **User control**: User must approve download and install
- **Documentation**: See `AUTO_UPDATE_GUIDE.md`

**Testing auto-updates**:
1. Build with updated version in `package.json`
2. Create GitHub Release with tag matching version
3. Upload installer to release
4. Old version will detect and prompt for update

### Desktop vs Web Differences

- **Save location**: Web uses `localStorage`, desktop uses same (Electron wraps web app)
- **File access**: None needed (all in-memory or localStorage)
- **Native features**: None used (pure web technologies)
- **Distribution**: Web via static hosting, desktop via installer

## Documentation Files

The repository includes extensive documentation:

- `README.md` - Project overview and setup
- `CONTRIBUTING.md` - Outdated (references Python version)
- `QUICKSTART.md` - Game play guide (Python-focused)
- `BUILD_EXE.md` - Electron build instructions
- `AUTO_UPDATE_GUIDE.md` - Auto-updater documentation
- `BOOTSTRAP_ANTICHEAT_DOCS.md` - Anti-cheat technical docs
- `FEATURES.md` - Feature implementation summary
- `GAMEPLAY_GUIDE.md` - Game mechanics documentation
- `WORKSPACE_SETUP.md` - Original Python workspace setup
- Various `*_SUMMARY.md` files - Implementation notes

**Note**: Many docs reference Python implementation and may be outdated for TypeScript version.

## Migration Context

### Python → TypeScript Migration

This project was ported from Python to TypeScript/React:

- **Original**: `python-original/game.py` (~1550 lines)
- **New**: TypeScript implementation in `lib/` and `components/`
- **Preserved**: Anti-cheat system (SHA-256 logic matches Python)
- **Enhanced**: UI (web-based vs terminal), features (many additions)

**Reference files**:
- `python-original/game.py` - Original implementation
- `python-original/test_game.py` - Test suite (Python)
- `CONVERSION_NOTES.md` - Migration notes (if exists)

### Backwards Compatibility

When modifying save format:
1. Add new fields with defaults
2. Check for missing fields during load
3. Don't remove existing fields
4. Update `validateGameState()` to handle both old and new formats

## Quick Reference

### File Count and Size
- **TypeScript files**: ~4,875 lines total
- **Components**: 15+ React components
- **Core logic**: 4 main files in `lib/`
- **Documentation**: 15+ markdown files

### Key Dependencies
```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "electron": "^39.1.1",
  "electron-updater": "6.7.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

### Critical Constants
- Save salt: `"v1|NightclubGameSalt|DoNotModify"` in `antiCheat.ts`
- localStorage key: `'club_save'` in game code
- Default starting money: $5,000
- Reputation/ethics range: 0-100
- Performer stat ranges: Various (see `types.ts`)

### Environment Requirements
- **Node.js**: 18+ (works, but 22.12+ preferred by some deps)
- **npm**: 10+
- **OS**: Any for development, Windows for `.exe` builds
- **Browser**: Modern browsers (ES2017+ support)

## Getting Help

### Resources
1. **README.md** - Start here for overview
2. **This file** - Architecture and patterns
3. **Code comments** - Inline documentation
4. **TypeScript errors** - Usually point to the issue
5. **Browser DevTools** - Console logs and debugging
6. **Python original** - Reference implementation

### Debugging Tips
1. Check browser console for errors
2. Use React DevTools to inspect component state
3. Check localStorage for save data issues
4. Use `console.log` liberally (remove before commit)
5. Build and test in production mode to catch build issues
6. Test anti-cheat by manually editing localStorage

---

**Last Updated**: 2025-11-08
**Maintained By**: Repository maintainers
**For Questions**: Open an issue on GitHub
