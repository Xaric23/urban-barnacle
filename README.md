# Underground Club Manager 🎭

A text-based management game where you run an underground nightclub. Recruit and train performers, balance ethics and profit, manage relationships, and navigate moral dilemmas through branching dialogue and events that affect your reputation and storyline outcomes.

## Features

### Core Gameplay
- **Performer Management**: Recruit, train, and manage various types of performers (dancers, singers, DJs, bartenders, security)
- **Diverse Characters**: Inclusive character generation with 5 gender identity options (male, female, transgender, non-binary, intersex)
- **Personality System**: Over 70 unique personality traits that affect performance, interactions, and income
- **Skill Development**: Train your staff to improve their performance and income generation
- **Energy System**: Balance work and rest to keep your team performing at their best

### Character Diversity & Traits
- **Gender Inclusivity**: Characters can be male, female, transgender, non-binary, or intersex
- **Rich Personality System**: Each performer has 2-3 unique traits from a pool of 70+:
  - **Positive Traits**: Charismatic, Hardworking, Creative, Passionate, Reliable
  - **Performance Traits**: Natural Talent, Stage Presence, Crowd Pleaser, Quick Learner
  - **Social Traits**: Team Player, Mentor, Diplomatic, Inspiring, Charming
  - **Complex Traits**: Demanding, Anxious, Stubborn, Competitive, Reserved
  - **Unique Traits**: Night Owl, Eccentric, Flamboyant, Avant-Garde, Risk Taker
- **Trait Effects**: Traits affect salary demands, training outcomes, performance bonuses, and relationship dynamics

### Business Mechanics
- **Financial Management**: Balance income from club nights with daily expenses and salaries
- **Reputation System**: Build your club's reputation (0-100) through successful operations
- **Ethics Score**: Navigate moral dilemmas that affect your ethics rating (0-100)
- **Performance Bonuses**: Traits like "Crowd Pleaser" grant income bonuses during performances

### Relationship System
- **Individual Relationships**: Build relationships with each performer (1-10 scale)
- **Loyalty Mechanics**: Higher loyalty means performers are less likely to leave
- **Meaningful Interactions**: Talk with performers to improve relationships and loyalty
- **Trait-Based Interactions**: Conversations vary based on personality traits

### Dynamic Events
The game features various random events that create moral dilemmas and strategic choices:

1. **VIP Visitor Event**: A wealthy patron requests questionable services
   - Accept for money but lose ethics
   - Decline to maintain principles
   - Offer ethical alternatives for a compromise

2. **Equipment Failure Event**: Technical problems during a performance
   - Pay for repairs
   - Cancel and refund customers
   - Continue with degraded service

3. **Rival Club Event**: Competitors try to poach your performers
   - Match their salary offer
   - Let them go
   - Appeal to performer loyalty

4. **Performer Conflict Event**: Staff disagreements affect operations
   - Take sides
   - Mediate for a fair solution
   - Make tough disciplinary decisions

### Branching Narratives
- Your choices affect relationships, reputation, and ethics scores
- Different events trigger based on your current state
- Multiple paths to success (ethical vs profitable vs balanced)

## Installation

### Requirements
- Python 3.7 or higher
- No external dependencies required (uses only Python standard library)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle
```

2. Run the game:
```bash
python3 game.py
```

Or make it executable:
```bash
chmod +x game.py
./game.py
```

## How to Play

### Starting the Game
When you start the game, you'll begin with:
- $5,000 starting capital
- 50 reputation
- 50 ethics score
- No performers (you need to recruit!)

### Main Menu Actions

1. **Recruit Performer**: Hire new diverse staff members
   - Choose from 5 performer types
   - Each candidate has a randomly assigned gender identity
   - Candidates have 2-3 unique personality traits
   - Traits affect salary demands and performance
   - Requires 1 week advance salary payment

2. **Manage Performers**: Train and interact with your staff
   - Train: Costs $100, requires 2 energy, increases skill by 1
   - Rest: Recover 3 energy points
   - Talk: Improve relationship and loyalty (trait-based responses)
   - View Profile: See detailed information including gender and traits
   - Fire: Remove performer (decreases ethics)

3. **Run Club Night**: Operate your club for the evening
   - Performers generate income based on skill level and traits
   - Trait bonuses: Crowd Pleaser (+15%), Stage Presence (+10%), etc.
   - Random events may occur (30% chance)
   - Costs daily salaries for all performers

4. **Advance Day**: Move to the next day
   - Pays daily expenses automatically
   - Reputation naturally drifts toward 50

5. **View Statistics**: See detailed stats about your club
   - View diversity statistics (gender distribution)
   - See top team traits
   - Track financial performance

6. **Save Game**: Save your progress to `savegame.json`

7. **Exit Game**: Quit (with optional save)

### Game Systems

#### Performer Stats
- **Skill (1-10)**: Affects income generation per performance
- **Energy (1-10)**: Depletes with work/training, recovers with rest
- **Loyalty (1-10)**: Affects response to rival offers
- **Relationship (1-10)**: Your personal rapport with the performer

#### Income Generation
- Base income per performance: `skill × $50`
- Random variance: -$20 to +$50
- Performers need at least 2 energy to work
- Each performance costs 1 energy

#### Reputation Effects
- Increases with profitable nights
- Decreases with poor service or ethical lapses
- Affects event outcomes and opportunities

#### Ethics Score
- Tracks your moral choices throughout the game
- High ethics = more principled management
- Low ethics = profit-focused, questionable methods
- Affects available choices in events

### Win/Lose Conditions
- **Game Over**: Money drops below $0
- **Success**: Build a thriving club with high reputation and sustainable income

### Tips for Success

1. **Start Small**: Recruit 2-3 performers initially to manage costs
2. **Train Regularly**: Higher skills = more income per performance
3. **Balance Ethics**: Pure profit or pure ethics both have consequences
4. **Build Relationships**: Loyal performers won't leave for rivals
5. **Manage Energy**: Rested performers work better
6. **Save Often**: Complex moral choices can have unexpected outcomes

## Game Design

### Moral Dilemma System
The game presents various ethical choices where you must balance:
- **Profit vs Ethics**: High-paying but questionable opportunities
- **Short-term vs Long-term**: Quick money vs sustainable reputation
- **Individual vs Business**: Staff welfare vs club success

### Branching Outcomes
Your choices create a unique narrative:
- High ethics + high reputation = Prestigious club
- High profit + low ethics = Profitable but controversial
- Balanced approach = Sustainable middle ground
- Poor management = Bankruptcy and game over

## Technical Details

### Save System
- Game state saved to `savegame.json`
- Includes all performers, relationships, and story flags
- Load on startup if save file exists

### File Structure
```
urban-barnacle/
├── game.py          # Main game file (all-in-one)
├── savegame.json    # Save file (created on first save)
├── README.md        # This file
└── LICENSE          # License information
```

### Data Structures
- **GameState**: Central state management using dataclass
- **Performer**: Individual staff member data and methods
- **Enums**: Type-safe performer and event types
- **JSON**: Human-readable save format

## Development

### Code Structure
The game is built with clean, modular Python:
- Object-oriented design with dataclasses
- Enum types for game constants
- JSON serialization for saves
- No external dependencies

### Extending the Game
To add new features:
1. **New Performer Types**: Add to `PerformerType` enum
2. **New Events**: Create methods like `event_your_event()`
3. **New Stats**: Add to `GameState` or `Performer` dataclasses
4. **New Mechanics**: Extend `ClubManager` class methods

## License

See LICENSE file for details.

## Contributing

This is a learning project demonstrating game design concepts:
- State management
- Branching narratives
- Resource management
- Moral choice systems
- Relationship mechanics

Feel free to fork and extend with your own ideas!

## Credits

Created as a demonstration of text-based game design with Python.

---

**Note**: This game focuses on business management and ethical decision-making in an entertainment industry context. All content is text-based and appropriate for general audiences.