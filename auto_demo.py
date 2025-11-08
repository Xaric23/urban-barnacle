#!/usr/bin/env python3
"""
Auto Manager Demo - Demonstrates the automated club management system

This script shows how to integrate and use the AutoClubManager with the main game.
"""

import sys
import time
from game import ClubManager
from auto_manager import create_auto_manager, AutomationLevel, AutomationStrategy


def demo_automation():
    """Demonstrate the automated club management system."""
    print("🎭 AUTO MANAGER DEMO 🎭")
    print("=" * 50)
    
    # Create a new club manager
    club = ClubManager()
    
    # Create an automated manager
    auto_manager = create_auto_manager(
        club_manager=club,
        level_name="moderate",
        strategy_name="balanced"
    )
    
    print(f"Created auto manager with:")
    print(f"  Level: {auto_manager.automation_level.value}")
    print(f"  Strategy: {auto_manager.strategy.value}")
    print(f"  Starting money: ${club.state.money}")
    print(f"  Starting performers: {len(club.state.performers)}")
    print()
    
    # Run several automated turns
    print("Running 5 automated turns...")
    print("-" * 30)
    
    for turn in range(5):
        print(f"\nTurn {turn + 1} (Day {club.state.day}):")
        
        # Run automated management
        actions = auto_manager.auto_manage_turn()
        
        # Display actions taken
        if actions["staff_actions"]:
            print("  Staff Actions:")
            for action in actions["staff_actions"]:
                print(f"    • {action}")
        
        if actions["recruitment"]:
            print("  Recruitment:")
            for action in actions["recruitment"]:
                print(f"    • {action}")
        
        if actions["upgrades"]:
            print("  Upgrades:")
            for action in actions["upgrades"]:
                print(f"    • {action}")
        
        if actions["strategic_decisions"]:
            print("  Strategic Decisions:")
            for action in actions["strategic_decisions"]:
                print(f"    • {action}")
        
        if actions["decisions_made"] == 0:
            print("  No automated actions taken this turn")
        
        # Simulate a night (simplified)
        if club.state.performers:
            base_income = len(club.state.performers) * 250
            expenses = sum(p.get("salary", 100) for p in club.state.performers)
            net_income = base_income - expenses
            club.state.money += net_income
            print(f"  Night results: +${net_income} (Income: ${base_income}, Expenses: ${expenses})")
        
        # Advance day
        club.state.day += 1
        
        print(f"  Status: ${club.state.money} | Performers: {len(club.state.performers)}")
        
        time.sleep(0.5)  # Small delay for readability
    
    # Show final report
    print("\n" + "=" * 50)
    print("AUTOMATION REPORT")
    print("=" * 50)
    
    report = auto_manager.get_automation_report()
    for key, value in report.items():
        print(f"{key.replace('_', ' ').title()}: {value}")
    
    return auto_manager, club


def interactive_auto_demo():
    """Interactive demo allowing user to choose automation settings."""
    print("🎭 INTERACTIVE AUTO MANAGER DEMO 🎭")
    print("=" * 50)
    
    # Get user preferences
    print("Available automation levels:")
    levels = list(AutomationLevel)
    for i, level in enumerate(levels, 1):
        print(f"  {i}. {level.value.title()}")
    
    while True:
        try:
            choice = int(input("\nSelect automation level (1-5): "))
            if 1 <= choice <= len(levels):
                selected_level = levels[choice - 1]
                break
            else:
                print("Invalid choice. Please select 1-5.")
        except ValueError:
            print("Please enter a number.")
    
    print("\nAvailable strategies:")
    strategies = list(AutomationStrategy)
    for i, strategy in enumerate(strategies, 1):
        print(f"  {i}. {strategy.value.title()}")
    
    while True:
        try:
            choice = int(input("\nSelect strategy (1-5): "))
            if 1 <= choice <= len(strategies):
                selected_strategy = strategies[choice - 1]
                break
            else:
                print("Invalid choice. Please select 1-5.")
        except ValueError:
            print("Please enter a number.")
    
    # Create managers
    club = ClubManager()
    auto_manager = create_auto_manager(
        club_manager=club,
        level_name=selected_level.value,
        strategy_name=selected_strategy.value
    )
    
    print(f"\nCreated auto manager with {selected_level.value} level and {selected_strategy.value} strategy")
    print(f"Starting: ${club.state.money} | {len(club.state.performers)} performers")
    
    # Ask for number of turns
    while True:
        try:
            turns = int(input("\nHow many turns to simulate? (1-20): "))
            if 1 <= turns <= 20:
                break
            else:
                print("Please enter 1-20.")
        except ValueError:
            print("Please enter a number.")
    
    # Run simulation
    print(f"\nRunning {turns} turns...")
    results = auto_manager.simulate_multiple_turns(turns)
    
    # Show summary
    print("\nSIMULATION SUMMARY:")
    print("-" * 30)
    for result in results:
        print(f"Turn {result['turn']}: ${result['money']} | "
              f"Rep: {result['reputation']} | "
              f"Staff: {result['performers']} | "
              f"Actions: {result['actions']['decisions_made']}")
    
    return auto_manager, club


def compare_strategies():
    """Compare different automation strategies side by side."""
    print("🎭 STRATEGY COMPARISON DEMO 🎭")
    print("=" * 50)
    
    strategies = [AutomationStrategy.BALANCED, AutomationStrategy.PROFIT, 
                 AutomationStrategy.ETHICS, AutomationStrategy.GROWTH]
    
    results = {}
    
    for strategy in strategies:
        print(f"\nTesting {strategy.value.upper()} strategy...")
        
        # Create fresh club and auto manager
        club = ClubManager()
        auto_manager = create_auto_manager(
            club_manager=club,
            level_name="moderate",
            strategy_name=strategy.value
        )
        
        # Run 10 turns
        sim_results = auto_manager.simulate_multiple_turns(10)
        
        # Store final results
        final_result = sim_results[-1]
        results[strategy.value] = {
            "money": final_result["money"],
            "reputation": final_result["reputation"],
            "performers": final_result["performers"],
            "total_actions": sum(r["actions"]["decisions_made"] for r in sim_results)
        }
    
    # Display comparison
    print("\n" + "=" * 70)
    print("STRATEGY COMPARISON RESULTS (after 10 turns)")
    print("=" * 70)
    print(f"{'Strategy':<12} {'Money':<8} {'Reputation':<12} {'Staff':<6} {'Actions':<8}")
    print("-" * 70)
    
    for strategy, data in results.items():
        print(f"{strategy.title():<12} ${data['money']:<7} {data['reputation']:<12} "
              f"{data['performers']:<6} {data['total_actions']:<8}")
    
    # Find best performers
    best_money = max(results.values(), key=lambda x: x["money"])
    best_rep = max(results.values(), key=lambda x: x["reputation"])
    
    print("\nBest Performers:")
    for strategy, data in results.items():
        if data == best_money:
            print(f"  💰 Highest Money: {strategy.title()}")
        if data == best_rep:
            print(f"  🌟 Highest Reputation: {strategy.title()}")


if __name__ == "__main__":
    print("Auto Manager Demo System")
    print("Choose a demo:")
    print("1. Basic automation demo")
    print("2. Interactive demo")
    print("3. Strategy comparison")
    print("4. Exit")
    
    while True:
        try:
            choice = int(input("\nSelect option (1-4): "))
            if choice == 1:
                demo_automation()
                break
            elif choice == 2:
                interactive_auto_demo()
                break
            elif choice == 3:
                compare_strategies()
                break
            elif choice == 4:
                print("Goodbye!")
                sys.exit(0)
            else:
                print("Invalid choice. Please select 1-4.")
        except ValueError:
            print("Please enter a number.")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            sys.exit(0)