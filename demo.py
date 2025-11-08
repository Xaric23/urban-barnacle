#!/usr/bin/env python3
"""
Demo script for Underground Club Manager
Demonstrates game features through automated playthrough
"""

from game import ClubManager, Performer, PerformerType, Gender
from dataclasses import asdict
import time


def demo_game():
    """Run an automated demo of the game"""
    print("\n" + "="*70)
    print("🎭 UNDERGROUND CLUB MANAGER - AUTOMATED DEMO 🎭".center(70))
    print("="*70)
    
    game = ClubManager()
    
    print("\n📖 DEMO SCENARIO: Building Your Diverse Club Empire")
    print("-" * 70)
    
    # Day 1: Recruit first performers
    print("\n[DAY 1] Starting with $5,000. Time to build our diverse team!\n")
    time.sleep(1)
    
    # Hire a dancer
    dancer = Performer(
        name="Aria Star",
        performer_type=PerformerType.DANCER,
        gender=Gender.FEMALE,
        traits=["Charismatic", "Stage Presence"],
        skill=7,
        loyalty=6,
        energy=10,
        salary=400,
        reputation=0
    )
    game.state.performers.append(asdict(dancer))
    game.state.relationships[dancer.name] = 5
    game.state.money -= dancer.salary * 7
    print(f"✓ Hired {dancer.name} ({dancer.gender.value}, Dancer)")
    print(f"   Skill: {dancer.skill}/10 | Traits: {', '.join(dancer.traits)}")
    
    # Hire a DJ
    dj = Performer(
        name="DJ Nova",
        performer_type=PerformerType.DJ,
        gender=Gender.NON_BINARY,
        traits=["Creative", "Tech Savvy"],
        skill=6,
        loyalty=7,
        energy=10,
        salary=350,
        reputation=0
    )
    game.state.performers.append(asdict(dj))
    game.state.relationships[dj.name] = 5
    game.state.money -= dj.salary * 7
    print(f"✓ Hired {dj.name} ({dj.gender.value}, DJ)")
    print(f"   Skill: {dj.skill}/10 | Traits: {', '.join(dj.traits)}")
    
    print(f"\n💰 Remaining money: ${game.state.money}")
    time.sleep(2)
    
    # Day 2: First club night
    print("\n[DAY 2] Time for our first club night!\n")
    game.state.day = 2
    time.sleep(1)
    
    total_income = 0
    for perf_data in game.state.performers:
        perf = Performer(**perf_data)
        income = perf.work()
        total_income += income
        print(f"🎵 {perf.name} ({perf.gender.value}) performed! Income: ${income}")
        # Update energy
        idx = game.state.performers.index(perf_data)
        game.state.performers[idx] = asdict(perf)
    
    total_expenses = sum(Performer(**p).salary for p in game.state.performers)
    net = total_income - total_expenses
    game.state.money += net
    game.state.reputation += 3
    
    print(f"\n📊 Night Results:")
    print(f"   Income: ${total_income}")
    print(f"   Expenses: ${total_expenses}")
    print(f"   Net Profit: ${net}")
    print(f"   Reputation: {game.state.reputation}/100 (+3)")
    time.sleep(2)
    
    # Day 3: Training
    print("\n[DAY 3] Investing in performer development\n")
    game.state.day = 3
    time.sleep(1)
    
    # Train the dancer
    dancer_data = game.state.performers[0]
    dancer = Performer(**dancer_data)
    old_skill = dancer.skill
    dancer.train()
    game.state.performers[0] = asdict(dancer)
    game.state.money -= 100
    
    print(f"📚 {dancer.name} trained!")
    print(f"   Skill: {old_skill}/10 → {dancer.skill}/10")
    print(f"   Training cost: $100")
    print(f"   Remaining money: ${game.state.money}")
    time.sleep(2)
    
    # Day 4: Building relationships
    print("\n[DAY 4] Building team morale and relationships\n")
    game.state.day = 4
    time.sleep(1)
    
    for perf_data in game.state.performers:
        perf = Performer(**perf_data)
        old_rel = game.state.relationships[perf.name]
        game.state.relationships[perf.name] = min(10, old_rel + 1)
        print(f"💬 Had a great conversation with {perf.name} ({perf.gender.value})")
        print(f"   Relationship: {old_rel}/10 → {game.state.relationships[perf.name]}/10")
    time.sleep(2)
    
    # Day 5: Hire more diverse staff
    print("\n[DAY 5] Expanding the team with more diversity!\n")
    game.state.day = 5
    time.sleep(1)
    
    singer = Performer(
        name="Luna Voice",
        performer_type=PerformerType.SINGER,
        gender=Gender.TRANSGENDER,
        traits=["Vocal Powerhouse", "Passionate", "Inspiring"],
        skill=8,
        loyalty=5,
        energy=10,
        salary=500,
        reputation=0
    )
    game.state.performers.append(asdict(singer))
    game.state.relationships[singer.name] = 5
    game.state.money -= singer.salary * 7
    print(f"✓ Hired {singer.name} ({singer.gender.value}, Singer)")
    print(f"   Skill: {singer.skill}/10 | Traits: {', '.join(singer.traits)}")
    print(f"💰 Money: ${game.state.money}")
    time.sleep(2)
    
    # Day 6: Big night
    print("\n[DAY 6] Big club night with full diverse crew!\n")
    game.state.day = 6
    time.sleep(1)
    
    # Let tired performers rest first
    for i, perf_data in enumerate(game.state.performers):
        perf = Performer(**perf_data)
        if perf.energy < 5:
            perf.rest()
            print(f"😴 {perf.name} rested. Energy: {perf.energy}/10")
            game.state.performers[i] = asdict(perf)
    
    time.sleep(1)
    print("\n🎉 Club night in progress...")
    
    total_income = 0
    for perf_data in game.state.performers:
        perf = Performer(**perf_data)
        income = perf.work()
        total_income += income
        trait_info = f" ({perf.traits[0]})" if perf.traits else ""
        print(f"⭐ {perf.name} ({perf.gender.value}, {perf.performer_type.value}): ${income}{trait_info}")
        idx = game.state.performers.index(perf_data)
        game.state.performers[idx] = asdict(perf)
    
    total_expenses = sum(Performer(**p).salary for p in game.state.performers)
    net = total_income - total_expenses
    game.state.money += net
    game.state.reputation += 5
    
    print(f"\n📊 Night Results:")
    print(f"   Total Income: ${total_income}")
    print(f"   Total Expenses: ${total_expenses}")
    print(f"   Net Profit: ${net}")
    print(f"   Reputation: {game.state.reputation}/100 (+5)")
    time.sleep(2)
    
    # Simulate a moral dilemma
    print("\n[EVENT] 🌟 VIP Visitor Arrives!")
    print("-" * 70)
    print("A wealthy patron wants to book your club for a private event.")
    print("They're offering $2,000 but requesting some questionable activities.")
    time.sleep(2)
    
    print("\n💭 DECISION: Offer ethical alternative entertainment")
    print("   Result: +$800, +5 Ethics, +3 Reputation")
    
    game.state.money += 800
    game.state.ethics_score += 5
    game.state.reputation += 3
    time.sleep(2)
    
    # Final stats
    print("\n" + "="*70)
    print("📈 FINAL STATISTICS".center(70))
    print("="*70)
    print(f"\n💰 Money: ${game.state.money}")
    print(f"⭐ Reputation: {game.state.reputation}/100")
    print(f"✨ Ethics Score: {game.state.ethics_score}/100")
    print(f"👥 Team Size: {len(game.state.performers)} performers")
    
    print("\n🎭 YOUR DIVERSE TEAM:")
    for perf_data in game.state.performers:
        perf = Performer(**perf_data)
        rel = game.state.relationships[perf.name]
        print(f"   • {perf.name} ({perf.gender.value}, {perf.performer_type.value})")
        print(f"     Skill: {perf.skill}/10 | Loyalty: {perf.loyalty}/10 | Relationship: {rel}/10")
        print(f"     Traits: {', '.join(perf.traits)}")
    
    # Show diversity stats
    print("\n🌈 DIVERSITY STATISTICS:")
    gender_counts = {}
    for perf_data in game.state.performers:
        perf = Performer(**perf_data)
        gender = perf.gender.value
        gender_counts[gender] = gender_counts.get(gender, 0) + 1
    
    for gender, count in gender_counts.items():
        print(f"   {gender.capitalize()}: {count}")
    
    print("\n" + "="*70)
    print("✓ DEMO COMPLETE - You've built an inclusive, successful club!".center(70))
    print("="*70)
    
    print("\n💡 Key Features Demonstrated:")
    print("   ✓ Diverse gender representation (5 gender options)")
    print("   ✓ 50+ unique personality traits")
    print("   ✓ Trait-based performance bonuses")
    print("   ✓ Performer recruitment and management")
    print("   ✓ Skill training and development")
    print("   ✓ Energy and rest management")
    print("   ✓ Relationship building")
    print("   ✓ Financial management")
    print("   ✓ Reputation system")
    print("   ✓ Ethical decision-making")
    print("   ✓ Event system with moral choices")
    
    print("\n📝 To play the full game, run: python3 game.py")
    print("\n")


if __name__ == "__main__":
    demo_game()
