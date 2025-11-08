# Contributing to Underground Club Manager

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** (if applicable)
2. **Clone your fork** to your local machine
3. **Create a new branch** for your feature: `git checkout -b feature/my-new-feature`

## Development Setup

```bash
# No external dependencies required
python --version  # Ensure Python 3.8+

# Run tests
python -m unittest test_game.py

# Run demo
python demo.py

# Run the game
python game.py
```

## Project Structure

```
.
├── game.py              # Main game engine (core gameplay loop)
├── traits.py            # Personality traits and name pools
├── test_game.py         # Comprehensive test suite
├── demo.py              # Automated gameplay demonstration
├── GAMEPLAY_GUIDE.md    # Feature documentation
└── README.md            # Project overview
```

## Code Style

- Follow PEP 8 guidelines
- Use type hints where appropriate
- Add docstrings for new functions/classes
- Keep functions focused and single-purpose

## Adding New Features

### Adding New Performer Traits
Edit `traits.py`:
```python
PERSONALITY_TRAITS = [
    # ... existing traits
    "Your New Trait",
]
```

### Adding New Events
In `game.py`, add to `_build_event_registry()`:
```python
self.event_registry["your_event"] = {
    "tags": ["category1", "category2"],
    "risk_rating": 3,  # 1-5
    "cooldown": 7,     # days
    "prerequisites": {"min_performers": 4},
    "weight": 1.0
}
```

Then implement the event method:
```python
def event_your_event(self):
    """Your event description."""
    # Event logic here
```

### Adding New Upgrades
In `game.py`, add to `_build_upgrade_catalog()`:
```python
catalog["your_upgrade"] = {
    "name": "Display Name",
    "desc": "What it does",
    "base_cost": 2000,
    "max_level": 3,
    # Effect attributes...
}
```

### Adding New Promotions
In `game.py`, add to `_build_promotion_catalog()`:
```python
catalog["role_name"] = [
    {
        "title": "Promotion Title",
        "skill_req": 6,
        "cost": 1500,
        "buff": "buff_type",
        "desc": "Description"
    },
    # Additional levels...
]
```

## Testing

- Add tests for new features in `test_game.py`
- Ensure all existing tests pass: `python -m unittest test_game.py`
- Test the demo still runs: `python demo.py`

## Submitting Changes

1. **Commit your changes** with descriptive messages
2. **Push to your branch**
3. **Create a Pull Request** with:
   - Clear description of changes
   - Why the change is needed
   - Any breaking changes
   - Test results

## Feature Ideas

See `GAMEPLAY_GUIDE.md` for implemented features and potential expansion areas:
- New performer roles
- Additional event types
- Expanded economy mechanics
- Multiplayer/competition features
- Achievement system

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

Thank you for contributing! 🎭
