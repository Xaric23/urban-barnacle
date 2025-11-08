# Underground Club Manager - Feature Guide

## Core Systems

### 1. Performer Promotions
Each performer can be promoted through a specialization track based on their role:

#### Promotion Tracks by Role

**Dancer Track:**
- Level 1: Choreographer (Skill 6, $1500) - +1 energy regen for all dancers
- Level 2: Dance Captain (Skill 8, $3000) - +8% crowd bonus
- Level 3: Artistic Director (Skill 10, $5000) - +2 reputation per night

**Singer Track:**
- Level 1: Vocal Coach (Skill 6, $1500) - +50% training effectiveness
- Level 2: Headliner (Skill 8, $3000) - +15% income for all singers
- Level 3: Music Director (Skill 10, $5000) - Better event outcomes

**DJ Track:**
- Level 1: Sound Engineer (Skill 6, $1500) - -30% equipment failures
- Level 2: Resident DJ (Skill 8, $3000) - +1 average patron mood
- Level 3: Festival Curator (Skill 10, $5000) - +10% city demand

**Bartender Track:**
- Level 1: Mixologist (Skill 6, $1500) - +10% patron spending power
- Level 2: Bar Manager (Skill 8, $3000) - -10% daily expenses
- Level 3: Hospitality Director (Skill 10, $5000) - Attracts more VIPs

**Security Track:**
- Level 1: Head of Security (Skill 6, $1500) - -20% conflict events
- Level 2: Safety Coordinator (Skill 8, $3000) - +1 loyalty for all staff
- Level 3: Operations Chief (Skill 10, $5000) - Better crisis outcomes

### 2. Event System (8 Total Events)

**New Events:**
- **Talent Scout**: External gig offers for performers
- **Health Inspection**: Pass/fail based on ethics and upgrades
- **Media Coverage**: Interview opportunities for reputation
- **Performer Breakthrough**: Random skill/loyalty boost

**Event Features:**
- Cooldown system prevents spam
- Prerequisites (reputation, performer count, upgrades)
- Weighted probability selection
- Risk-based outcomes

### 3. Club Upgrades

**Sound System** ($2500 base) - +5% income, -5% equipment failures per level
**VIP Lounge** ($4000 base) - +10% patron spending per level
**Marketing Hub** ($3000 base) - +8% crowd size, +5% reputation gains per level
**Security Suite** ($2000 base) - -7% event probability per level

### 4. Dynamic Economy

- **City Demand**: 60-140%, drifts weekly, affects crowd size
- **Genre Trends**: -30% to +30% per role, affects income
- **Risk Levels**: Conservative/Standard/Bold affects events and bonuses

### 5. Patron Archetypes

- General (50%), High-Roller (10%), Critic (10%), Influencer (15%), Trendsetter (15%)
- Each affects mood and spending differently

---

## Quick Start Guide

1. **Recruit performers** - Diverse roles unlock all promotion tracks
2. **Train to skill 6+** - Required for first promotion tier
3. **Buy Sound System** - Best early ROI (direct income boost)
4. **Promote strategically** - Vocal Coach for training, Bar Manager for cost reduction
5. **Run nights on Bold risk** - When you have security and high skills
6. **Watch weekly trends** - Hire/promote roles when their genre is "Hot"

---

## Strategic Synergies

**Income Stack:** Headliner + Sound System + Bold risk + High demand
**Safety Net:** Operations Chief + Security Suite + Bouncer
**Growth Engine:** Festival Curator + Marketing Hub + Artistic Director
**Efficiency:** Bar Manager reduces expenses as roster grows

---

## Testing Commands

```powershell
# Run the game
python "C:\Users\Jason Rozansky\Nightclub\game.py"

# Run tests
python -m unittest -v .\test_game.py
```

## Save File Anti-Cheat

- SHA-256 checksum protection
- Automatic tamper detection
- Penalties: -15 reputation, -10 ethics
- Persists `cheat_detected` flag
