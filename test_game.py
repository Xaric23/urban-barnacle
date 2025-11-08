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
