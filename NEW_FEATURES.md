# New Features Implementation - Underground Club Manager

This document describes the 7 major feature categories implemented for the Underground Club Manager game.

## 1. Performer Personalities & Chemistry System 💕

### Overview
Each performer has a personality archetype that affects their chemistry with other performers and determines which themed nights they excel at.

### Features
- **8 Personality Archetypes**: Flirtatious, Dominant, Shy, Kinky, Comedic, Vanilla, Mysterious, Playful
- **Chemistry System**: Performers have chemistry ratings (0-100) with each other based on personality compatibility
- **Chemistry Icons**: 
  - 💕 Excellent (80+)
  - ⚡ Good (60-79)
  - 🤝 Neutral (40-59)
  - ❌ Poor (<40)
- **Relationships**: Staff can have alliances (🤜🤛), romances (💕), feuds (⚔️), or neutral (🤝) relationships

### Themed Nights
Seven themed nights available, each requiring specific personality types:

1. **Gothic Fetish Night** (1.5x bonus) - Dominant, Kinky, Mysterious
2. **Comedy Burlesque** (1.3x bonus) - Comedic, Playful
3. **Pet Play Thursday** (1.4x bonus) - Kinky, Playful, Shy
4. **BDSM Showcase** (1.6x bonus) - Dominant, Kinky
5. **Vanilla Romance Night** (1.2x bonus) - Vanilla, Flirtatious
6. **Mystery Masquerade** (1.35x bonus) - Mysterious, Flirtatious
7. **Playful Tease Night** (1.25x bonus) - Playful, Flirtatious

### How to Use
- Navigate to **Run Club Night** to see the themed night selector
- Choose a theme matching your performers' personalities for maximum bonus
- Check **Chemistry** button in performer management to see compatibility
- Pair high-chemistry performers for themed nights for best results

## 2. Audience Mood, Demands, and Crowd Dynamics 📊

### Overview
The audience has dynamic preferences that change based on seasons, viral trends, and time.

### Features
- **10 Crowd Kink Types**: BDSM, petplay, roleplay, voyeurism, exhibitionism, fetish, vanilla, comedy, gothic, mystery
- **Real-Time Mood Tracking**: Each kink has a demand level (0-100%)
- **Seasonal Trends**: Preferences shift with seasons
  - Winter: gothic, mystery, BDSM
  - Spring: vanilla, playful
  - Summer: exhibitionism, playful
  - Fall: gothic, mystery, fetish
- **Viral Trends**: 10% chance per week for a viral trend to boost specific kinks by 30%
  - Tentacle Trend, Pet Play Craze, Gothic Revival, Comedy Boom, Mystery Madness

### How to Use
- Navigate to **Crowd Trends** menu to see current audience demands
- Schedule themed nights matching high-demand kinks
- Watch for viral trend alerts when advancing days
- Seasonal trends automatically adjust every season

## 3. Staff Drama & Gossip System 🎭

### Overview
Staff members develop relationships and occasionally generate rumors that must be managed.

### Features
- **Drama Level Meter**: Tracks overall backstage drama (0-100)
- **Automatic Rumor Generation**: 15% chance per day when you have 2+ performers
- **4 Rumor Types**: Romance Brewing, Backstage Feud, Jealousy Drama, Secret Alliance
- **3 Severity Levels**: Low, Medium, High
- **Resolution Options**:
  - **Diplomacy** (Free, 70% success, +5 ethics)
  - **Bribe** ($500, 90% success, -5 ethics)
  - **Ignore** (Free, 30% success, -2 ethics)

### How to Use
- Check **Staff Drama** menu to see active rumors
- Resolve rumors quickly to prevent drama escalation
- High drama (70+) negatively affects club performance
- Build positive relationships through successful resolution

## 4. Club Customization & Staging 🎪

### Overview
Customize your club with stage props and special effects to boost show ratings.

### Stage Props (5 types)
1. **Professional Pole** - Appeal: 8, Cost: $1,500, Maintenance: $20/day
2. **Dancing Cage** - Appeal: 7, Cost: $2,000, Maintenance: $30/day
3. **Dominance Throne** - Appeal: 9, Cost: $2,500, Maintenance: $15/day
4. **Aerial Swing** - Appeal: 10, Cost: $3,000, Maintenance: $50/day
5. **Elevated Platform** - Appeal: 6, Cost: $800, Maintenance: $10/day

### Special Effects (6 types)
1. **Fire Display** - Impact: 15, Cost: $3,000, Maintenance: $100/day
2. **Laser Show** - Impact: 12, Cost: $2,500, Maintenance: $75/day
3. **Bubble Machine** - Impact: 8, Cost: $800, Maintenance: $30/day
4. **Smoke Machine** - Impact: 10, Cost: $1,200, Maintenance: $40/day
5. **Champagne Shower** - Impact: 20, Cost: $5,000, Maintenance: $200/day
6. **Confetti Cannon** - Impact: 7, Cost: $600, Maintenance: $25/day

### How to Use
- Navigate to **Stage & Effects** menu
- Purchase props and effects to boost show ratings
- Monitor daily maintenance costs (deducted automatically)
- Higher appeal/impact = higher income during club nights

## 5. Risk/Reward Nights & Rival Club Sabotage ⚔️

### Overview
Compete against rival clubs who may attempt to sabotage your business.

### Rival Clubs (3 types)
1. **The Velvet Underground** - Strength: 60, Aggression: 50
2. **Crimson Palace** - Strength: 70, Aggression: 70 (Most dangerous!)
3. **Midnight Oasis** - Strength: 50, Aggression: 30

### Sabotage Types
- **Equipment Sabotage**: Costs $500 in repairs
- **Reputation Attack**: Lose 10 reputation points
- **Staff Poaching**: Performers lose 2 loyalty points

### How to Use
- Sabotage is checked automatically when advancing days
- More aggressive rivals attack more frequently
- 14-day cooldown between sabotages per rival
- Build high reputation and security to deter attacks
- Keep performer loyalty high to resist poaching

## 6. NSFW Card/Skill System 🎴

### Overview
Performers have skill cards they can use during performances for bonus income and combos.

### Card Categories (13 total cards)
- **Tease** (3 cards): Seductive Wink, Teasing Dance, Slow Strip
- **Dominance** (2 cards): Commanding Presence, Playful Punishment
- **Submission** (2 cards): Obedient Display, Pleading Performance
- **Comedy** (2 cards): Naughty Joke, Slapstick Burlesque
- **Mystery** (2 cards): Masked Tease, Dramatic Reveal
- **Vanilla** (2 cards): Romantic Dance, Air Kiss

### Card Mechanics
- Each card has **Power** (1-10) = $50 per power point
- **Energy Cost**: 1-3 energy per card
- **Combos**: Playing related cards in sequence gives +$100 bonus
- Example combo: Seductive Wink → Teasing Dance = extra $100

### Starting Cards
Performers get 1-2 cards matching their personality:
- Flirtatious: Seductive Wink, Teasing Dance
- Dominant: Commanding Presence
- Kinky: Slow Strip
- Comedic: Naughty Joke
- Etc.

### How to Use
- View performer cards via **Cards** button in management
- Cards are automatically used during club nights (future enhancement: manual selection)
- Train performers to potentially unlock more cards
- Build combos for maximum income

## 7. Expansion Paths & Fame ⭐

### Overview
Grow your empire and build fame to attract celebrities and unlock new revenue streams.

### Fame System
- **Fame Meter**: 0-100 scale
- **Fame Levels**:
  - 0-19: 🔰 Unknown
  - 20-39: 🌱 Emerging
  - 40-59: 📈 Rising
  - 60-79: ✨ Famous
  - 80-89: ⭐ Superstar
  - 90-100: 🌟 Legendary
- **Fame Increases**: High profits (>$5,000), high reputation (>80)
- **Fame Decreases**: Slowly decays 1 point per week

### Celebrity Cameos
- Unlock at 70+ fame
- Chance increases with fame (0-30%)
- 5 celebrity types: Pop Star, Movie Actor, Social Media Influencer, Famous DJ, Pro Athlete
- Bonus: $2,000-$5,000 + 5 fame points

### Expansions

#### Cam Show Branch ($10,000)
- **Income**: ~$100 per performer per day
- **Passive**: Generates income automatically
- **Scales**: More performers = more income

#### VIP Member Website ($15,000)
- **Income**: Reputation × $10 per day
- **Reputation-based**: Higher reputation = more members
- **Exclusive**: Premium content attracts high-paying members

#### Managed Troupes (Future)
- Coming in future update
- Manage performers at partner clubs
- Percentage of their profits

### How to Use
- Navigate to **Fame & Expansions** menu
- Build reputation and earn profits to increase fame
- Unlock expansions when you have capital ($10k-$15k)
- Expansion income is added automatically each day
- Watch for celebrity cameo alerts!

## Tips for Success

1. **Chemistry First**: Check performer chemistry and build compatible teams
2. **Match Themes**: Schedule themed nights matching crowd trends
3. **Manage Drama**: Resolve rumors quickly before they escalate
4. **Invest Wisely**: Stage props and effects boost all performances
5. **Build Fame**: High fame attracts celebrities for massive bonuses
6. **Expand Smart**: Unlock expansions when stable, they provide passive income
7. **Watch Rivals**: High security and reputation deter sabotage
8. **Card Combos**: Plan card usage for maximum bonus income

## Technical Details

### State Management
All new features are saved in the game state with backward compatibility. Old saves will automatically initialize new fields with defaults.

### Performance
- Chemistry calculations: O(n²) for n performers (acceptable for small teams)
- Crowd mood updates: O(1) per kink type
- Daily events: Multiple checks but lightweight

### Balancing
- Themed nights: 1.2x - 1.6x multipliers
- Props/Effects: $600 - $5,000 cost, $10 - $200/day maintenance
- Expansions: $10k - $15k unlock, $100 - $1,000+/day income
- Drama resolution: 30% - 90% success rates

## Future Enhancements

Possible future additions:
- Manual card selection during club nights
- More themed nights (holidays, special events)
- Troupe management expansion
- Mini-games for sabotage prevention
- More card unlocks through training/achievements
- Performer progression paths tied to personalities
- Advanced chemistry mechanics (team synergies)
