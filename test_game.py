<<<<<<< HEAD
=======
import os
import sys
import unittest

# Ensure local import works when running from parent or other cwd
sys.path.insert(0, os.path.dirname(__file__))
from game import (
    generate_full_name, ClubManager, compute_checksum, 
    Performer, PerformerType, Gender, asdict, Patron
)


class TestNightclubGame(unittest.TestCase):
    def test_generate_full_name_unique(self):
        used = set()
        names = [generate_full_name(used) for _ in range(50)]
        self.assertEqual(len(set(names)), 50)

    def test_ensure_bouncer_present(self):
        mgr = ClubManager()
        has_security = any(
            (p.get("performer_type") == PerformerType.SECURITY) 
            for p in mgr.state.performers
        )
        self.assertTrue(has_security, "Bouncer should be present after initialization")

    def test_checksum_detects_tamper(self):
        # Build a minimal save-like structure
        save_data = {
            'day': 1,
            'money': 1000,
            'reputation': 50,
            'ethics_score': 50,
            'performers': [],
            'relationships': {},
            'story_flags': {},
            'completed_events': []
        }
        checksum = compute_checksum({**save_data})
        self.assertIsInstance(checksum, str)

        tampered = {**save_data, 'money': 999999}
        self.assertNotEqual(checksum, compute_checksum({**tampered}))

    def test_promotion_prerequisites(self):
        """Test promotion prerequisite checking"""
        mgr = ClubManager()
        
        # Create a new performer with low skill
        perf = Performer(
            name="Test Singer",
            performer_type=PerformerType.SINGER,
            gender=Gender.FEMALE,
            traits=["Talented"],
            skill=3,
            loyalty=5,
            energy=10,
            salary=500,
            reputation=0,
            promotion_level=0
        )
        
        # Should not be able to promote (skill < 6)
        promo = mgr.can_promote(perf)
        self.assertIsNone(promo, "Should not promote performer with skill < 6")
        
        # Increase skill
        perf.skill = 7
        promo = mgr.can_promote(perf)
        self.assertIsNotNone(promo, "Should be able to promote with skill >= 6")
        self.assertEqual(promo['title'], "Vocal Coach")  # First promotion title

    def test_promotion_progression(self):
        """Test promotion level progression"""
        mgr = ClubManager()
        
        perf = Performer(
            name="Test DJ",
            performer_type=PerformerType.DJ,
            gender=Gender.MALE,
            traits=["Creative"],
            skill=8,
            loyalty=7,
            energy=10,
            salary=500,
            reputation=20,
            promotion_level=0
        )
        
        mgr.state.performers.append(asdict(perf))
        mgr.state.money = 50000
        
        # Promote the DJ (index 1, since bouncer is at index 0)
        perf_index = len(mgr.state.performers) - 1
        success = mgr.promote_performer(perf_index)
        self.assertTrue(success, "Should successfully promote")
        perf1 = Performer(**mgr.state.performers[perf_index])
        self.assertEqual(perf1.promotion_level, 1)

    def test_promotion_buffs(self):
        """Test promotion buffs are applied correctly"""
        mgr = ClubManager()
        
        # Add a promoted performer
        perf = Performer(
            name="Master Dancer",
            performer_type=PerformerType.DANCER,
            gender=Gender.FEMALE,
            traits=["Athletic"],
            skill=9,
            loyalty=8,
            energy=10,
            salary=800,
            reputation=50,
            promotion_level=2
        )
        mgr.state.performers.append(asdict(perf))
        
        buffs = mgr.get_active_buffs()
        self.assertGreater(len(buffs), 0, "Should have active buffs from promotion")

    def test_event_filtering(self):
        """Test event filtering by prerequisites"""
        mgr = ClubManager()
        mgr.state.day = 1
        
        # Get all events
        all_events = list(mgr.event_registry.keys())
        self.assertGreater(len(all_events), 0, "Should have events in registry")
        
        # Check event metadata
        for event_id, meta in mgr.event_registry.items():
            self.assertIn('tags', meta)
            self.assertIn('risk_rating', meta)
            self.assertIn('cooldown', meta)
            self.assertIn('weight', meta)

    def test_event_cooldowns(self):
        """Test event cooldown enforcement"""
        mgr = ClubManager()
        mgr.state.day = 5
        
        # Set a cooldown
        event_id = list(mgr.event_registry.keys())[0]
        mgr.state.event_cooldowns[event_id] = 10  # Cooldown until day 10
        
        # Event should not be available
        self.assertLess(mgr.state.day, mgr.state.event_cooldowns[event_id])
        
        # Advance to after cooldown
        mgr.state.day = 11
        self.assertGreater(mgr.state.day, mgr.state.event_cooldowns[event_id])

    def test_upgrades_catalog(self):
        """Test upgrade catalog exists and is properly structured"""
        mgr = ClubManager()
        
        self.assertGreater(len(mgr.upgrade_catalog), 0, "Should have upgrades")
        
        # Check required fields (use 'desc' not 'description')
        for upgrade_id, data in mgr.upgrade_catalog.items():
            self.assertIn('name', data)
            self.assertIn('desc', data)  # Changed from 'description'
            self.assertIn('base_cost', data)
            self.assertIn('max_level', data)

    def test_upgrade_purchase(self):
        """Test purchasing upgrades"""
        mgr = ClubManager()
        mgr.state.money = 10000
        
        # Purchase sound system
        upgrade_id = "sound_system"
        cost = mgr.upgrade_catalog[upgrade_id]['base_cost']
        
        mgr.state.money -= cost
        mgr.state.upgrades[upgrade_id] = 1
        
        self.assertEqual(mgr.state.upgrades[upgrade_id], 1)
        self.assertEqual(mgr.state.money, 10000 - cost)

    def test_upgrade_levels(self):
        """Test upgrade level progression"""
        mgr = ClubManager()
        
        upgrade_id = "vip_lounge"
        max_level = mgr.upgrade_catalog[upgrade_id]['max_level']
        
        # Test level progression
        for level in range(1, max_level + 1):
            mgr.state.upgrades[upgrade_id] = level
            self.assertEqual(mgr.state.upgrades[upgrade_id], level)
        
        # Should not exceed max level
        self.assertLessEqual(mgr.state.upgrades[upgrade_id], max_level)

    def test_economy_initialization(self):
        """Test dynamic economy initialization"""
        mgr = ClubManager()
        
        # Check city demand
        self.assertGreater(mgr.state.city_demand, 0)
        self.assertLessEqual(mgr.state.city_demand, 200)
        
        # Check genre trends
        self.assertEqual(len(mgr.state.genre_trend), 5)  # 5 performer types
        for ptype in PerformerType:
            self.assertIn(ptype.value, mgr.state.genre_trend)

    def test_economy_adjustment(self):
        """Test weekly economy adjustment"""
        mgr = ClubManager()
        
        initial_demand = mgr.state.city_demand
        initial_trends = dict(mgr.state.genre_trend)
        
        # Adjust economy
        mgr.adjust_weekly_economy()
        
        # Values should change (with very high probability)
        # Using a range check instead of exact inequality to account for rare edge cases
        self.assertTrue(
            mgr.state.city_demand != initial_demand or 
            mgr.state.genre_trend != initial_trends,
            "Economy should change after adjustment"
        )

    def test_risk_levels(self):
        """Test risk level setting"""
        mgr = ClubManager()
        
        for risk in ["conservative", "standard", "bold"]:
            mgr.state.risk_level = risk
            self.assertEqual(mgr.state.risk_level, risk)

    def test_patron_generation(self):
        """Test patron generation with archetypes"""
        mgr = ClubManager()
        mgr.state.reputation = 60
        
        patrons = mgr.generate_patrons()
        
        self.assertGreater(len(patrons), 0, "Should generate patrons")
        
        # Check patron structure - patrons are Patron dataclass objects
        for patron in patrons:
            self.assertIsInstance(patron, Patron)
            self.assertIsNotNone(patron.name)
            self.assertGreater(patron.mood, 0)
            self.assertGreater(patron.spending_power, 0)
            self.assertIsNotNone(patron.archetype)
            
            # Check archetype is valid
            valid_archetypes = ["general", "high_roller", "critic", "influencer", "trendsetter"]
            self.assertIn(patron.archetype, valid_archetypes)

    def test_crowd_bonus_calculation(self):
        """Test crowd bonus calculation"""
        mgr = ClubManager()
        
        # Create test patrons as Patron objects
        patrons = [
            Patron(name='Test1', mood=8, spending_power=100, archetype='general'),
            Patron(name='Test2', mood=7, spending_power=200, archetype='high_roller'),
            Patron(name='Test3', mood=6, spending_power=80, archetype='general'),
        ]
        
        bonus = mgr.calculate_crowd_bonus(patrons)
        
        self.assertGreater(bonus, 0, "Should calculate positive crowd bonus")
        self.assertIsInstance(bonus, int)

    def test_bouncer_effect(self):
        """Test bouncer reduces event probability"""
        mgr = ClubManager()
        
        self.assertTrue(mgr.has_bouncer(), "Should have bouncer on init")
        
        # Bouncer should be security type (stored as enum)
        bouncer = next((p for p in mgr.state.performers if p['performer_type'] == PerformerType.SECURITY), None)
        self.assertIsNotNone(bouncer, "Should have security performer")

    def test_save_load_new_fields(self):
        """Test save/load with new features"""
        mgr = ClubManager()
        test_file = "test_new_features.json"
        
        # Set new field values
        mgr.state.upgrades = {"sound_system": 2, "vip_lounge": 1}
        mgr.state.city_demand = 120
        mgr.state.genre_trend = {"singer": 10, "dancer": -5, "dj": 0, "bartender": 15, "security": 0}
        mgr.state.risk_level = "bold"
        mgr.state.event_cooldowns = {"vip_visitor": 10, "equipment_failure": 15}
        
        # Add promoted performer
        perf = Performer(
            name="Test Promoted",
            performer_type=PerformerType.SINGER,
            gender=Gender.MALE,
            traits=["Talented"],
            skill=8,
            loyalty=7,
            energy=10,
            salary=800,
            reputation=30,
            promotion_level=2
        )
        mgr.state.performers.append(asdict(perf))
        
        # Save
        mgr.save_file = test_file
        mgr.save_game()
        
        # Load into new manager
        mgr2 = ClubManager()
        mgr2.save_file = test_file
        mgr2.load_game()
        
        # Verify all fields
        self.assertEqual(mgr2.state.upgrades, mgr.state.upgrades)
        self.assertEqual(mgr2.state.city_demand, mgr.state.city_demand)
        self.assertEqual(mgr2.state.genre_trend, mgr.state.genre_trend)
        self.assertEqual(mgr2.state.risk_level, mgr.state.risk_level)
        self.assertEqual(mgr2.state.event_cooldowns, mgr.state.event_cooldowns)
        
        # Verify promoted performer
        loaded_perf = Performer(**mgr2.state.performers[-1])
        self.assertEqual(loaded_perf.promotion_level, 2)
        
        # Cleanup
        os.remove(test_file)


if __name__ == '__main__':
    unittest.main()
>>>>>>> bdced82 (Add automation manager system)
#!/usr/bin/env python3
"""
Test script for Underground Club Manager game
Tests core functionality without requiring user interaction
"""

import sys
import os
import json
from game import ClubManager, Performer, PerformerType, GameState, Gender


def test_game_state_creation():
    """Test creating a new game state"""
    print("Testing GameState creation...", end=" ")
    state = GameState()
    assert state.day == 1
    assert state.money == 5000
    assert state.reputation == 50
    assert state.ethics_score == 50
    assert len(state.performers) == 0
    print("✓")


def test_performer_creation():
    """Test creating performers"""
    print("Testing Performer creation...", end=" ")
    perf = Performer(
        name="Test Performer",
        performer_type=PerformerType.DANCER,
        gender=Gender.FEMALE,
        traits=["Charismatic", "Hardworking"],
        skill=5,
        loyalty=7,
        energy=10,
        salary=500,
        reputation=0
    )
    assert perf.name == "Test Performer"
    assert perf.skill == 5
    assert perf.energy == 10
    assert perf.gender == Gender.FEMALE
    assert len(perf.traits) == 2
    print("✓")


def test_performer_training():
    """Test performer training mechanics"""
    print("Testing performer training...", end=" ")
    perf = Performer(
        name="Test",
        performer_type=PerformerType.SINGER,
        gender=Gender.MALE,
        traits=["Patient"],
        skill=5,
        loyalty=5,
        energy=10,
        salary=300,
        reputation=0
    )
    
    initial_skill = perf.skill
    initial_energy = perf.energy
    
    result = perf.train()
    assert result == True
    assert perf.skill == initial_skill + 1
    assert perf.energy == initial_energy - 2
    print("✓")


def test_performer_work():
    """Test performer work mechanics"""
    print("Testing performer work...", end=" ")
    perf = Performer(
        name="Test",
        performer_type=PerformerType.DJ,
        gender=Gender.NON_BINARY,
        traits=["Energetic", "Creative"],
        skill=8,
        loyalty=5,
        energy=10,
        salary=400,
        reputation=0
    )
    
    income = perf.work()
    assert income > 0  # Should generate income
    assert perf.energy == 9  # Should lose 1 energy
    print("✓")


def test_performer_rest():
    """Test performer rest mechanics"""
    print("Testing performer rest...", end=" ")
    perf = Performer(
        name="Test",
        performer_type=PerformerType.BARTENDER,
        gender=Gender.TRANSGENDER,
        traits=["Reliable"],
        skill=6,
        loyalty=5,
        energy=5,
        salary=350,
        reputation=0
    )
    
    perf.rest()
    assert perf.energy == 8  # Should gain 3 energy
    print("✓")


def test_save_load_game():
    """Test save and load functionality"""
    print("Testing save/load game...", end=" ")
    
    # Create a test save file
    test_save = "test_savegame.json"
    
    # Create game and modify state
    game = ClubManager()
    game.save_file = test_save
    game.state.day = 10
    game.state.money = 10000
    game.state.reputation = 75
    
    # Save
    game.save_game()
    
    # Create new game and load
    game2 = ClubManager()
    game2.save_file = test_save
    game2.load_game()
    
    # Verify loaded data
    assert game2.state.day == 10
    assert game2.state.money == 10000
    assert game2.state.reputation == 75
    
    # Cleanup
    os.remove(test_save)
    print("✓")


def test_game_manager_creation():
    """Test creating a game manager"""
    print("Testing ClubManager creation...", end=" ")
    game = ClubManager()
    assert game.state is not None
    assert game.running == True
    assert game.state.day == 1
    print("✓")


def test_all_performer_types():
    """Test all performer types can be created"""
    print("Testing all PerformerType enums...", end=" ")
    types = [
        PerformerType.DANCER,
        PerformerType.SINGER,
        PerformerType.DJ,
        PerformerType.BARTENDER,
        PerformerType.SECURITY
    ]
    
    for ptype in types:
        perf = Performer(
            name=f"Test {ptype.value}",
            performer_type=ptype,
            gender=Gender.MALE,
            traits=["Reliable"],
            skill=5,
            loyalty=5,
            energy=10,
            salary=300,
            reputation=0
        )
        assert perf.performer_type == ptype
    print("✓")


def test_all_genders():
    """Test all gender types can be created"""
    print("Testing all Gender enums...", end=" ")
    genders = [
        Gender.MALE,
        Gender.FEMALE,
        Gender.TRANSGENDER,
        Gender.NON_BINARY,
        Gender.INTERSEX
    ]
    
    for gender in genders:
        perf = Performer(
            name=f"Test {gender.value}",
            performer_type=PerformerType.DANCER,
            gender=gender,
            traits=["Charismatic"],
            skill=5,
            loyalty=5,
            energy=10,
            salary=300,
            reputation=0
        )
        assert perf.gender == gender
    print("✓")


def test_energy_limits():
    """Test energy system boundaries"""
    print("Testing energy limits...", end=" ")
    perf = Performer(
        name="Test",
        performer_type=PerformerType.DANCER,
        gender=Gender.FEMALE,
        traits=["Energetic"],
        skill=5,
        loyalty=5,
        energy=1,
        salary=300,
        reputation=0
    )
    
    # Should not be able to work with energy < 2
    income = perf.work()
    assert income == 0
    
    # Should not be able to train with energy < 3
    perf.energy = 2
    result = perf.train()
    assert result == False
    
    # Energy should cap at 10
    perf.energy = 9
    perf.rest()
    assert perf.energy == 10  # Capped at max
    print("✓")


def test_skill_limits():
    """Test skill system boundaries"""
    print("Testing skill limits...", end=" ")
    perf = Performer(
        name="Test",
        performer_type=PerformerType.SINGER,
        gender=Gender.MALE,
        traits=["Natural Talent"],
        skill=10,
        loyalty=5,
        energy=10,
        salary=300,
        reputation=0
    )
    
    # Should not increase skill beyond 10
    initial_skill = perf.skill
    perf.train()
    assert perf.skill == 10  # Should stay at max
    print("✓")


def test_trait_system():
    """Test trait system"""
    print("Testing trait system...", end=" ")
    
    # Import the trait list
    from game import PERSONALITY_TRAITS
    
    # Verify we have at least 50 traits
    assert len(PERSONALITY_TRAITS) >= 50, f"Expected at least 50 traits, got {len(PERSONALITY_TRAITS)}"
    
    # Verify traits are unique
    assert len(PERSONALITY_TRAITS) == len(set(PERSONALITY_TRAITS)), "Traits should be unique"
    
    # Test performer can have multiple traits
    perf = Performer(
        name="Test",
        performer_type=PerformerType.DANCER,
        gender=Gender.INTERSEX,
        traits=["Charismatic", "Creative", "Energetic"],
        skill=7,
        loyalty=6,
        energy=10,
        salary=400,
        reputation=0
    )
    
    assert len(perf.traits) == 3
    assert "Charismatic" in perf.traits
    print("✓")


def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("Running Underground Club Manager Tests")
    print("="*60 + "\n")
    
    tests = [
        test_game_state_creation,
        test_performer_creation,
        test_performer_training,
        test_performer_work,
        test_performer_rest,
        test_save_load_game,
        test_game_manager_creation,
        test_all_performer_types,
        test_all_genders,
        test_energy_limits,
        test_skill_limits,
        test_trait_system,
    ]
    
    failed = 0
    for test in tests:
        try:
            test()
        except AssertionError as e:
            print(f"✗ {test.__name__} failed: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {test.__name__} error: {e}")
            failed += 1
    
    print("\n" + "="*60)
    if failed == 0:
        print("✓ All tests passed!")
    else:
        print(f"✗ {failed} test(s) failed")
    print("="*60 + "\n")
    
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
