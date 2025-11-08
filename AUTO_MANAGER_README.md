# Automated Club Manager System

This document describes the Automated Club Manager system for the Underground Club Manager game.

## Overview

The Automated Club Manager (`auto_manager.py`) provides AI-driven automation for various club management tasks. It allows players to enable partial or full automation of their nightclub operations, from basic staff management to complete strategic control.

## Files

- `auto_manager.py` - Main automation system
- `auto_demo.py` - Demo and testing script
- Integration in `game.py` - Menu option 7: "Automation Manager"

## Automation Levels

### 1. None
- Manual control only
- No automated actions

### 2. Basic
- Basic staff management
- Automatic rest for tired performers
- Training when skill is below target
- Relationship building with low-loyalty staff

### 3. Moderate  
- All Basic features plus:
- Automatic recruitment when needed
- Basic upgrade purchases
- Maintains minimum staff levels

### 4. Advanced
- All Moderate features plus:
- Strategic decision making
- Automatic promotions
- Performance-based firing decisions
- Risk level adjustments

### 5. Full
- Complete automation
- All Advanced features
- Future: Automated event responses

## Automation Strategies

### Balanced
- Balance all aspects of club management
- Default strategy for new players
- Moderate cash reserves and risk-taking

### Profit
- Focus on money generation
- Lower cash reserves
- Prefers high-skill, efficient performers
- Bold risk appetite
- May fire underperforming staff

### Ethics
- Prioritize ethical choices
- Higher cash reserves for stability  
- Avoids difficult personalities
- Conservative risk approach
- Never fires staff for performance

### Growth
- Focus on expansion and upgrades
- Aggressive recruitment and training
- Prioritizes marketing upgrades
- Standard risk level

### Reputation
- Maximize reputation gains
- High skill requirements
- Conservative approach
- Marketing and security focus

## Usage

### In-Game Integration

1. Start the game normally (`python game.py`)
2. From the main menu, select "7. Automation Manager"
3. Configure your automation level and strategy
4. Use automation options:
   - Run single automated turns
   - Simulate multiple turns
   - Change settings
   - View performance reports

### Demo Scripts

Run the demo to test automation:
```bash
python auto_demo.py
```

Demo options:
- Basic automation demo
- Interactive configuration
- Strategy comparison
- Performance testing

### Programmatic Usage

```python
from game import ClubManager
from auto_manager import create_auto_manager

# Create game and automation
club = ClubManager()
auto_manager = create_auto_manager(
    club_manager=club,
    level_name="moderate",
    strategy_name="balanced"
)

# Run automated turn
actions = auto_manager.auto_manage_turn()
print(f"Actions taken: {actions['decisions_made']}")

# Simulate multiple turns
results = auto_manager.simulate_multiple_turns(10)
```

## Key Features

### Smart Staff Management
- Automatically rests tired performers
- Trains performers below skill targets
- Builds relationships with disloyal staff
- Considers trait bonuses and promotion buffs

### Strategic Recruitment
- Maintains minimum staff levels
- Ensures critical roles are filled (security, bartender)
- Considers budget constraints
- Strategy-based hiring decisions

### Upgrade Management
- Purchases upgrades based on strategy priorities
- Respects cash reserve requirements
- Different priorities per strategy

### Performance Tracking
- Tracks decisions made
- Monitors money and reputation impact
- Detailed reporting system

### Strategy-Specific Behavior
- Profit strategy fires poor performers
- Ethics strategy avoids "Arrogant" personalities  
- Growth strategy recruits aggressively
- Reputation strategy maintains high standards

## Configuration Parameters

Each strategy has customizable parameters:

```python
{
    "min_cash_reserve": 1000,      # Minimum money to keep
    "max_performers": 8,           # Maximum staff size
    "min_performers": 3,           # Minimum staff size
    "target_skill_avg": 6.5,       # Target average skill level
    "upgrade_priority": [...],      # Upgrade purchase order
    "risk_preference": "standard"   # Risk level preference
}
```

## Advanced Features

### Multi-Turn Simulation
- Test strategies over multiple turns
- Performance comparison
- Automated night simulation

### Decision Logging
- Tracks all automated decisions
- Performance metrics
- Historical analysis

### Integration with Game Systems
- Works with existing promotion system
- Respects upgrade effects
- Considers trait bonuses
- Uses relationship system

## Best Practices

### For New Players
- Start with "Basic" automation and "Balanced" strategy
- Learn the system gradually
- Use demo to understand different strategies

### For Advanced Players
- Use "Moderate" or "Advanced" for partial automation
- Switch strategies based on game situation
- Use simulation to test approaches

### For Testing/Development
- Use "Full" automation for rapid testing
- Compare strategies with demo script
- Simulate long-term scenarios

## Performance Notes

The automation system is designed to be:
- **Efficient**: Minimal performance impact
- **Safe**: Won't break existing saves
- **Optional**: Can be disabled anytime
- **Flexible**: Easy to modify strategies

## Troubleshooting

### Module Not Found
If you get "Automation module not available":
1. Ensure `auto_manager.py` is in the same directory
2. Check for syntax errors in the automation files

### Poor Performance
If automation makes bad decisions:
1. Try a different strategy
2. Adjust automation level
3. Check your current game state (money, staff, etc.)

### Integration Issues
If automation conflicts with manual play:
1. Disable automation temporarily
2. Manual actions override automated ones
3. Save before testing new strategies

## Future Enhancements

Planned features:
- Automated event responses
- Custom strategy creation
- Machine learning optimization
- Advanced analytics
- Save/load automation settings

## Contributing

To extend the automation system:
1. Modify strategy parameters in `_build_strategy_params()`
2. Add new automation levels in `AutomationLevel` enum
3. Implement new decision logic in automation methods
4. Test with demo scripts

The system is designed to be modular and extensible for future enhancements.