# Underground Club Manager 🎭

A text-based management game where you run an underground nightclub. Recruit and train performers, balance ethics and profit, manage relationships, and navigate moral dilemmas.

**Now built with Next.js, React, and TypeScript!**

## 🎮 Features

### Core Gameplay
- **Performer Management**: Recruit, train, and manage various types of performers (dancers, singers, DJs, bartenders, security)
- **Diverse Characters**: Inclusive character generation with 5 gender identity options
- **Personality System**: Over 70 unique personality traits affecting performance and interactions
- **Skill Development**: Train your staff to improve performance and income generation
- **Energy System**: Balance work and rest to keep your team performing at their best

### Business Mechanics
- **Financial Management**: Balance income from club nights with daily expenses and salaries
- **Reputation System**: Build your club's reputation (0-100)
- **Ethics Score**: Navigate moral dilemmas affecting your ethics rating (0-100)
- **Club Upgrades**: Improve facilities to boost performance
- **Performance Bonuses**: Traits grant income bonuses during performances

### System Features
- **🔒 Anti-Cheat Protection**: SHA-256 checksum validation prevents save file tampering (ported from Python implementation)
- **🚀 Bootstrap Launcher**: Professional loading sequence with integrity checking and validation
- **💾 Secure Saves**: Tamper-evident save files with automatic corruption detection
- **🔄 Auto-Recovery**: Graceful handling of corrupted saves with automatic new game creation

## 🚀 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: Browser localStorage

## 💻 Installation

### Requirements
- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm start
```

## 🎯 How to Play

### Starting Resources
- $5,000 starting capital
- 50 reputation
- 50 ethics score
- No performers (recruit first!)

### Main Actions

1. **Recruit Performer**: Hire diverse staff from 5 performer types
2. **Manage Performers**: Train, rest, and build relationships
3. **Run Club Night**: Operate your club and earn income
4. **Club Upgrades**: Improve facilities
5. **View Statistics**: Track your progress
6. **Advance Day**: Move forward (auto-saves)

### Game Systems

- **Skill (1-10)**: Affects income per performance
- **Energy (1-10)**: Depletes with work, recovers with rest
- **Loyalty (1-10)**: Affects performer retention
- **Relationship (1-10)**: Your rapport with performers

### Win/Lose
- **Game Over**: Money drops below $0
- **Success**: Build a thriving club with high reputation

## 📁 Project Structure

```
urban-barnacle/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main game page (with bootstrap integration)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameHeader.tsx
│   ├── GameMenu.tsx
│   ├── RecruitPerformer.tsx
│   ├── ManagePerformers.tsx
│   ├── RunClubNight.tsx
│   ├── ViewStats.tsx
│   ├── UpgradeShop.tsx
│   └── LoadingScreen.tsx  # Bootstrap loading screen
├── lib/                   # Game logic
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # Game constants
│   ├── gameLogic.ts       # Core game functions
│   ├── antiCheat.ts       # Anti-cheat system (SHA-256)
│   └── bootstrap.ts       # Bootstrap/launcher system
├── python-original/       # Original Python implementation
└── BOOTSTRAP_ANTICHEAT_DOCS.md  # Anti-cheat documentation
```

## 🔒 Security & Anti-Cheat

This game includes a comprehensive anti-cheat system ported from the Python implementation:

- **SHA-256 Checksums**: Save files are protected with cryptographic hashes
- **Integrity Validation**: All game values are validated for impossible ranges
- **Tampering Detection**: Automatically detects and handles save file modifications
- **Time Manipulation Detection**: Prevents exploits through date/time changes
- **Graceful Recovery**: Creates new game if corruption is detected

See [BOOTSTRAP_ANTICHEAT_DOCS.md](BOOTSTRAP_ANTICHEAT_DOCS.md) for complete documentation.

## 🔧 Development

### Extending the Game
1. **New Performer Types**: Add to `PerformerType` enum
2. **New Components**: Create in components/
3. **New Logic**: Add to lib/gameLogic.ts
4. **New Mechanics**: Extend GameState interface

## 📜 License

See LICENSE file for details.

## 🙏 Credits

Created as a demonstration of game design with modern web technologies.

---

**Note**: This game focuses on business management and ethical decision-making. All content is text-based and appropriate for general audiences.
