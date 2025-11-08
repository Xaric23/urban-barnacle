#!/usr/bin/env python3
"""
Underground Club Manager - A Text-Based Management Game
Manage your underground nightclub, recruit performers, balance ethics and profit,
and navigate moral dilemmas through branching storylines.
"""

import json
import os
import random
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


class PerformerType(Enum):
    """Types of performers available"""
    DANCER = "dancer"
    SINGER = "singer"
    DJ = "dj"
    BARTENDER = "bartender"
    SECURITY = "security"


class EventType(Enum):
    """Types of events in the game"""
    RECRUITMENT = "recruitment"
    MORAL_DILEMMA = "moral_dilemma"
    BUSINESS = "business"
    RELATIONSHIP = "relationship"
    RANDOM = "random"


class Gender(Enum):
    """Gender identity options"""
    MALE = "male"
    FEMALE = "female"
    TRANSGENDER = "transgender"
    NON_BINARY = "non-binary"
    INTERSEX = "intersex"


# Comprehensive trait system - 50+ unique traits
PERSONALITY_TRAITS = [
    # Positive traits
    "Charismatic", "Hardworking", "Creative", "Passionate", "Reliable",
    "Energetic", "Confident", "Empathetic", "Innovative", "Loyal",
    "Ambitious", "Patient", "Humble", "Optimistic", "Honest",
    "Adaptable", "Caring", "Disciplined", "Generous", "Courageous",
    
    # Performance-related traits
    "Natural Talent", "Stage Presence", "Crowd Pleaser", "Perfectionist", "Improvisational",
    "Versatile", "Quick Learner", "Detail-Oriented", "Rhythmic", "Expressive",
    
    # Social traits
    "Team Player", "Mentor", "Diplomatic", "Inspiring", "Networking Pro",
    "Conflict Resolver", "Natural Leader", "Supportive", "Funny", "Charming",
    
    # Challenging traits
    "Demanding", "Anxious", "Stubborn", "Hot-Tempered", "Jealous",
    "Arrogant", "Moody", "Impulsive", "Reserved", "Competitive",
    
    # Unique traits
    "Night Owl", "Early Bird", "Risk Taker", "Cautious", "Eccentric",
    "Mysterious", "Flamboyant", "Minimalist", "Traditional", "Avant-Garde",
    
    # Additional traits
    "Sophisticated", "Street Smart", "Book Smart", "Athletic", "Artistic",
    "Musical Genius", "Dancing Legend", "Vocal Powerhouse", "Tech Savvy", "Fashion Icon"
]


@dataclass
class Performer:
    """Represents a performer/staff member"""
    name: str
    performer_type: PerformerType
    gender: Gender
    traits: List[str]
    skill: int  # 1-10
    loyalty: int  # 1-10
    energy: int  # 1-10
    salary: int
    reputation: int  # -10 to 10
    
    def train(self):
        """Train the performer to increase skill"""
        if self.energy >= 3:
            self.skill = min(10, self.skill + 1)
            self.energy -= 2
            return True
        return False
    
    def rest(self):
        """Rest to recover energy"""
        self.energy = min(10, self.energy + 3)
    
    def work(self) -> int:
        """Perform and return income generated"""
        if self.energy < 2:
            return 0
        self.energy -= 1
        base_income = self.skill * 50
        return base_income + random.randint(-20, 50)


@dataclass
class GameState:
    """Main game state"""
    day: int = 1
    money: int = 5000
    reputation: int = 50  # 0-100
    ethics_score: int = 50  # 0-100 (higher = more ethical)
    performers: List[Dict] = None
    relationships: Dict[str, int] = None  # performer_name -> relationship_level
    story_flags: Dict[str, bool] = None
    completed_events: List[str] = None
    
    def __post_init__(self):
        if self.performers is None:
            self.performers = []
        if self.relationships is None:
            self.relationships = {}
        if self.story_flags is None:
            self.story_flags = {}
        if self.completed_events is None:
            self.completed_events = []


class ClubManager:
    """Main game manager"""
    
    def __init__(self):
        self.state = GameState()
        self.running = True
        self.save_file = "savegame.json"
        
    def save_game(self):
        """Save current game state"""
        save_data = {
            'day': self.state.day,
            'money': self.state.money,
            'reputation': self.state.reputation,
            'ethics_score': self.state.ethics_score,
            'performers': self.state.performers,
            'relationships': self.state.relationships,
            'story_flags': self.state.story_flags,
            'completed_events': self.state.completed_events
        }
        with open(self.save_file, 'w') as f:
            json.dump(save_data, f, indent=2)
        print("\n✓ Game saved successfully!")
    
    def load_game(self) -> bool:
        """Load saved game state"""
        if not os.path.exists(self.save_file):
            return False
        
        try:
            with open(self.save_file, 'r') as f:
                save_data = json.load(f)
            
            self.state.day = save_data['day']
            self.state.money = save_data['money']
            self.state.reputation = save_data['reputation']
            self.state.ethics_score = save_data['ethics_score']
            self.state.performers = save_data['performers']
            self.state.relationships = save_data['relationships']
            self.state.story_flags = save_data['story_flags']
            self.state.completed_events = save_data['completed_events']
            
            print("\n✓ Game loaded successfully!")
            return True
        except Exception as e:
            print(f"\n✗ Error loading game: {e}")
            return False
    
    def display_header(self):
        """Display game header with current stats"""
        print("\n" + "="*70)
        print("🎭 UNDERGROUND CLUB MANAGER 🎭".center(70))
        print("="*70)
        print(f"Day: {self.state.day} | Money: ${self.state.money} | "
              f"Reputation: {self.state.reputation}/100 | Ethics: {self.state.ethics_score}/100")
        print("="*70 + "\n")
    
    def recruit_performer(self):
        """Recruit a new performer"""
        print("\n--- RECRUITMENT ---")
        print("Available performer types:")
        for i, ptype in enumerate(PerformerType, 1):
            print(f"{i}. {ptype.value.capitalize()}")
        print(f"{len(PerformerType) + 1}. Cancel")
        
        choice = input("\nSelect performer type: ").strip()
        
        try:
            choice_idx = int(choice) - 1
            if choice_idx == len(PerformerType):
                return
            
            if choice_idx < 0 or choice_idx >= len(PerformerType):
                print("Invalid choice!")
                return
            
            performer_type = list(PerformerType)[choice_idx]
            
            # Generate random candidate with diverse characteristics
            first_names = [
                "Alex", "Jordan", "Casey", "Morgan", "Riley", "Taylor", 
                "Quinn", "Blake", "Avery", "Cameron", "Sam", "Jamie",
                "Dakota", "Sage", "River", "Phoenix", "Skylar", "Rowan",
                "Jesse", "Charlie", "Drew", "Harper", "Emerson", "Reese"
            ]
            
            # Generate random gender identity
            gender = random.choice(list(Gender))
            
            # Generate 2-3 random traits
            num_traits = random.randint(2, 3)
            traits = random.sample(PERSONALITY_TRAITS, num_traits)
            
            name = random.choice(first_names) + f" #{random.randint(100, 999)}"
            skill = random.randint(3, 8)
            salary = skill * 100 + random.randint(50, 150)
            
            # Trait bonuses/penalties
            if "Natural Talent" in traits:
                skill = min(10, skill + 1)
            if "Hardworking" in traits:
                salary = int(salary * 0.9)  # Willing to work for less
            if "Arrogant" in traits:
                salary = int(salary * 1.2)  # Demands more
            
            print(f"\n{'='*60}")
            print(f"  CANDIDATE PROFILE".center(60))
            print(f"{'='*60}")
            print(f"Name: {name}")
            print(f"Gender: {gender.value.capitalize()}")
            print(f"Type: {performer_type.value.capitalize()}")
            print(f"Skill Level: {skill}/10")
            print(f"Traits: {', '.join(traits)}")
            print(f"Salary Demand: ${salary}/day")
            print(f"{'='*60}")
            
            if self.state.money < salary * 7:
                print("\n✗ Not enough money for 1 week salary!")
                return
            
            confirm = input("\nHire this performer? (y/n): ").strip().lower()
            if confirm == 'y':
                performer = Performer(
                    name=name,
                    performer_type=performer_type,
                    gender=gender,
                    traits=traits,
                    skill=skill,
                    loyalty=random.randint(4, 7),
                    energy=10,
                    salary=salary,
                    reputation=0
                )
                self.state.performers.append(asdict(performer))
                self.state.relationships[name] = 5
                self.state.money -= salary * 7  # Pay first week
                print(f"\n✓ {name} ({gender.value}) has been hired!")
                print(f"   Their traits: {', '.join(traits)}")
        
        except (ValueError, IndexError):
            print("Invalid input!")
    
    def manage_performers(self):
        """Manage existing performers"""
        if not self.state.performers:
            print("\n✗ You have no performers hired yet!")
            return
        
        print("\n--- YOUR PERFORMERS ---")
        for i, perf_data in enumerate(self.state.performers, 1):
            perf = Performer(**perf_data)
            rel = self.state.relationships.get(perf.name, 5)
            print(f"\n{i}. {perf.name} ({perf.gender.value}, {perf.performer_type.value})")
            print(f"   Skill: {perf.skill}/10 | Energy: {perf.energy}/10 | "
                  f"Loyalty: {perf.loyalty}/10")
            print(f"   Relationship: {rel}/10 | Salary: ${perf.salary}/day")
            print(f"   Traits: {', '.join(perf.traits)}")
        
        print(f"\n{len(self.state.performers) + 1}. Back")
        
        choice = input("\nSelect performer to manage: ").strip()
        
        try:
            choice_idx = int(choice) - 1
            if choice_idx == len(self.state.performers):
                return
            
            if choice_idx < 0 or choice_idx >= len(self.state.performers):
                print("Invalid choice!")
                return
            
            self.manage_single_performer(choice_idx)
        
        except ValueError:
            print("Invalid input!")
    
    def manage_single_performer(self, idx: int):
        """Manage a single performer"""
        perf_data = self.state.performers[idx]
        perf = Performer(**perf_data)
        
        while True:
            print(f"\n--- Managing {perf.name} ({perf.gender.value}) ---")
            print(f"Type: {perf.performer_type.value.capitalize()}")
            print(f"Traits: {', '.join(perf.traits)}")
            print(f"Skill: {perf.skill}/10 | Energy: {perf.energy}/10 | "
                  f"Loyalty: {perf.loyalty}/10")
            print(f"Relationship: {self.state.relationships[perf.name]}/10")
            
            print("\n1. Train (cost: 2 energy, +1 skill)")
            print("2. Let rest (+3 energy)")
            print("3. Talk (improve relationship)")
            print("4. View detailed profile")
            print("5. Fire performer")
            print("6. Back")
            
            action = input("\nChoose action: ").strip()
            
            if action == '1':
                cost = 100
                if self.state.money < cost:
                    print(f"\n✗ Training costs ${cost}!")
                    continue
                
                if perf.train():
                    self.state.money -= cost
                    print(f"\n✓ {perf.name} trained! Skill increased to {perf.skill}/10")
                    
                    # Trait-based responses
                    if "Quick Learner" in perf.traits:
                        print("   (Quick Learner: They picked it up faster than expected!)")
                    if "Perfectionist" in perf.traits:
                        print("   (Perfectionist: They're determined to master every detail)")
                else:
                    print(f"\n✗ {perf.name} is too tired to train!")
            
            elif action == '2':
                perf.rest()
                print(f"\n✓ {perf.name} rested. Energy: {perf.energy}/10")
                if "Energetic" in perf.traits:
                    perf.energy = min(10, perf.energy + 1)
                    print("   (Energetic: They recover faster than most!)")
            
            elif action == '3':
                print(f"\nYou spend quality time talking with {perf.name}.")
                
                # Trait-based conversation flavors
                if "Charismatic" in perf.traits:
                    print("Their charisma shines through as you chat.")
                elif "Reserved" in perf.traits:
                    print("They're quiet at first, but gradually open up.")
                elif "Funny" in perf.traits:
                    print("They make you laugh with their jokes and stories.")
                else:
                    print("They appreciate your attention and open up about their aspirations.")
                
                self.state.relationships[perf.name] = min(10, 
                    self.state.relationships[perf.name] + 1)
                perf.loyalty = min(10, perf.loyalty + 1)
                print(f"✓ Relationship improved to {self.state.relationships[perf.name]}/10")
            
            elif action == '4':
                # View detailed profile
                print(f"\n{'='*60}")
                print(f"  DETAILED PROFILE: {perf.name}".center(60))
                print(f"{'='*60}")
                print(f"Gender: {perf.gender.value.capitalize()}")
                print(f"Role: {perf.performer_type.value.capitalize()}")
                print(f"Personality Traits:")
                for trait in perf.traits:
                    print(f"  • {trait}")
                print(f"\nPerformance Stats:")
                print(f"  Skill Level: {perf.skill}/10")
                print(f"  Energy: {perf.energy}/10")
                print(f"  Loyalty: {perf.loyalty}/10")
                print(f"\nRelationship:")
                print(f"  Your relationship: {self.state.relationships[perf.name]}/10")
                print(f"\nFinancials:")
                print(f"  Daily Salary: ${perf.salary}")
                print(f"{'='*60}")
                input("\nPress Enter to continue...")
            
            elif action == '5':
                confirm = input(f"\nAre you sure you want to fire {perf.name}? (y/n): ").strip().lower()
                if confirm == 'y':
                    self.state.performers.pop(idx)
                    del self.state.relationships[perf.name]
                    print(f"\n✓ {perf.name} has been let go.")
                    self.state.ethics_score = max(0, self.state.ethics_score - 5)
                    return
            
            elif action == '6':
                # Save changes back
                self.state.performers[idx] = asdict(perf)
                return
            
            # Update performer data
            self.state.performers[idx] = asdict(perf)
    
    def run_club_night(self):
        """Simulate a night at the club"""
        if not self.state.performers:
            print("\n✗ You need performers to run the club!")
            return
        
        print("\n--- RUNNING CLUB NIGHT ---")
        print("Your performers take the stage...\n")
        
        total_income = 0
        total_expenses = 0
        
        for perf_data in self.state.performers:
            perf = Performer(**perf_data)
            income = perf.work()
            total_expenses += perf.salary
            
            if income > 0:
                # Trait bonuses
                bonus = 0
                trait_msg = ""
                
                if "Crowd Pleaser" in perf.traits:
                    bonus = int(income * 0.15)
                    trait_msg = " (Crowd Pleaser: +15% tips!)"
                elif "Stage Presence" in perf.traits:
                    bonus = int(income * 0.10)
                    trait_msg = " (Stage Presence: +10%)"
                elif "Natural Talent" in perf.traits:
                    bonus = int(income * 0.08)
                    trait_msg = " (Natural Talent: +8%)"
                elif "Charismatic" in perf.traits:
                    bonus = int(income * 0.05)
                    trait_msg = " (Charismatic: +5%)"
                
                income += bonus
                total_income += income
                print(f"✓ {perf.name} ({perf.gender.value}) performed well! Income: ${income}{trait_msg}")
            else:
                print(f"✗ {perf.name} ({perf.gender.value}) was too tired to perform.")
            
            # Update performer data
            idx = self.state.performers.index(perf_data)
            self.state.performers[idx] = asdict(perf)
        
        # Random event chance
        if random.random() < 0.3:
            self.trigger_random_event()
        
        net_income = total_income - total_expenses
        self.state.money += net_income
        
        print(f"\n--- NIGHT RESULTS ---")
        print(f"Total Income: ${total_income}")
        print(f"Total Expenses: ${total_expenses}")
        print(f"Net Profit: ${net_income}")
        
        # Reputation changes
        if net_income > 0:
            rep_gain = min(5, net_income // 200)
            self.state.reputation = min(100, self.state.reputation + rep_gain)
            print(f"✓ Reputation increased by {rep_gain}!")
        
        input("\nPress Enter to continue...")
    
    def trigger_random_event(self):
        """Trigger a random event during club operation"""
        events = [
            self.event_vip_visitor,
            self.event_equipment_failure,
            self.event_rival_club,
            self.event_performer_conflict
        ]
        
        event = random.choice(events)
        event()
    
    def event_vip_visitor(self):
        """A VIP visitor arrives"""
        print("\n🌟 --- SPECIAL EVENT: VIP VISITOR --- 🌟")
        print("A wealthy patron has arrived at your club!")
        print("They're impressed and want to make a private booking.")
        print("\nHowever, they're requesting some... questionable activities.")
        
        print("\n1. Accept the booking (+$2000, -10 ethics)")
        print("2. Politely decline (no change)")
        print("3. Offer an alternative ethical entertainment (+$800, +5 ethics)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            self.state.money += 2000
            self.state.ethics_score = max(0, self.state.ethics_score - 10)
            self.state.reputation += 5
            print("\n✓ You accepted. Money gained, but at what cost?")
        elif choice == '2':
            print("\n✓ You maintained your principles.")
            self.state.ethics_score = min(100, self.state.ethics_score + 2)
        elif choice == '3':
            self.state.money += 800
            self.state.ethics_score = min(100, self.state.ethics_score + 5)
            self.state.reputation += 3
            print("\n✓ A wise compromise! They accepted your alternative.")
        
        input("\nPress Enter to continue...")
    
    def event_equipment_failure(self):
        """Equipment breaks down"""
        print("\n⚠️ --- EVENT: EQUIPMENT FAILURE --- ⚠️")
        print("Your sound system has failed mid-performance!")
        
        repair_cost = 500
        
        print(f"\n1. Pay for immediate repair (${repair_cost})")
        print("2. Cancel the night (refund customers, -10 reputation)")
        print("3. Continue without sound (-5 reputation, keep income)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            if self.state.money >= repair_cost:
                self.state.money -= repair_cost
                self.state.ethics_score = min(100, self.state.ethics_score + 3)
                print("\n✓ Equipment repaired! The show goes on.")
            else:
                print(f"\n✗ Not enough money! Forced to cancel.")
                self.state.reputation = max(0, self.state.reputation - 10)
        elif choice == '2':
            self.state.reputation = max(0, self.state.reputation - 10)
            self.state.ethics_score = min(100, self.state.ethics_score + 5)
            print("\n✓ Customers appreciate your honesty.")
        elif choice == '3':
            self.state.reputation = max(0, self.state.reputation - 5)
            self.state.ethics_score = max(0, self.state.ethics_score - 3)
            print("\n✓ The night continues, but customers are disappointed.")
        
        input("\nPress Enter to continue...")
    
    def event_rival_club(self):
        """Rival club tries to poach performers"""
        if not self.state.performers:
            return
        
        print("\n🎯 --- EVENT: RIVAL CLUB --- 🎯")
        target = random.choice(self.state.performers)
        perf = Performer(**target)
        
        print(f"A rival club is trying to poach {perf.name}!")
        print(f"They're offering ${perf.salary + 200}/day.")
        
        print(f"\n1. Match their offer (+${200}/day salary)")
        print("2. Let them go (lose performer)")
        print("3. Appeal to loyalty (requires relationship > 7)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            perf.salary += 200
            idx = self.state.performers.index(target)
            self.state.performers[idx] = asdict(perf)
            print(f"\n✓ {perf.name} stays! Salary increased.")
        elif choice == '2':
            self.state.performers.remove(target)
            del self.state.relationships[perf.name]
            print(f"\n✗ {perf.name} has left for the rival club.")
        elif choice == '3':
            if self.state.relationships[perf.name] > 7:
                perf.loyalty = min(10, perf.loyalty + 2)
                idx = self.state.performers.index(target)
                self.state.performers[idx] = asdict(perf)
                print(f"\n✓ {perf.name} chooses to stay loyal to you!")
                self.state.ethics_score = min(100, self.state.ethics_score + 3)
            else:
                self.state.performers.remove(target)
                del self.state.relationships[perf.name]
                print(f"\n✗ {perf.name} doesn't feel loyal enough to stay.")
        
        input("\nPress Enter to continue...")
    
    def event_performer_conflict(self):
        """Two performers have a conflict"""
        if len(self.state.performers) < 2:
            return
        
        print("\n⚡ --- EVENT: PERFORMER CONFLICT --- ⚡")
        perf1_data, perf2_data = random.sample(self.state.performers, 2)
        perf1 = Performer(**perf1_data)
        perf2 = Performer(**perf2_data)
        
        print(f"{perf1.name} and {perf2.name} are having a heated argument!")
        print("The conflict is affecting the club atmosphere.")
        
        print("\n1. Side with " + perf1.name)
        print("2. Side with " + perf2.name)
        print("3. Mediate and find middle ground")
        print("4. Fire both to set an example")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            self.state.relationships[perf1.name] = min(10, 
                self.state.relationships[perf1.name] + 2)
            self.state.relationships[perf2.name] = max(1, 
                self.state.relationships[perf2.name] - 2)
            print(f"\n✓ You sided with {perf1.name}. {perf2.name} is upset.")
        elif choice == '2':
            self.state.relationships[perf2.name] = min(10, 
                self.state.relationships[perf2.name] + 2)
            self.state.relationships[perf1.name] = max(1, 
                self.state.relationships[perf1.name] - 2)
            print(f"\n✓ You sided with {perf2.name}. {perf1.name} is upset.")
        elif choice == '3':
            self.state.relationships[perf1.name] = min(10, 
                self.state.relationships[perf1.name] + 1)
            self.state.relationships[perf2.name] = min(10, 
                self.state.relationships[perf2.name] + 1)
            self.state.ethics_score = min(100, self.state.ethics_score + 5)
            print("\n✓ You successfully mediated. Both appreciate your fairness.")
        elif choice == '4':
            self.state.performers.remove(perf1_data)
            self.state.performers.remove(perf2_data)
            del self.state.relationships[perf1.name]
            del self.state.relationships[perf2.name]
            self.state.ethics_score = max(0, self.state.ethics_score - 15)
            self.state.reputation = max(0, self.state.reputation - 10)
            print("\n✗ You fired both performers. Others are worried about job security.")
        
        input("\nPress Enter to continue...")
    
    def advance_day(self):
        """Advance to next day"""
        self.state.day += 1
        
        # Pay daily expenses
        total_expenses = sum(Performer(**p).salary for p in self.state.performers)
        self.state.money -= total_expenses
        
        # Random reputation decay/growth
        if self.state.reputation > 60:
            self.state.reputation = max(50, self.state.reputation - 1)
        elif self.state.reputation < 40:
            self.state.reputation = min(50, self.state.reputation + 1)
        
        print(f"\n--- Day {self.state.day} begins ---")
        if total_expenses > 0:
            print(f"Daily expenses paid: ${total_expenses}")
        
        # Check game over conditions
        if self.state.money < 0:
            print("\n💀 GAME OVER! You ran out of money!")
            self.running = False
        
        input("\nPress Enter to continue...")
    
    def view_stats(self):
        """View detailed game statistics"""
        print("\n--- DETAILED STATISTICS ---")
        print(f"Current Day: {self.state.day}")
        print(f"Money: ${self.state.money}")
        print(f"Reputation: {self.state.reputation}/100")
        print(f"Ethics Score: {self.state.ethics_score}/100")
        print(f"Total Performers: {len(self.state.performers)}")
        
        if self.state.performers:
            total_salary = sum(Performer(**p).salary for p in self.state.performers)
            avg_skill = sum(Performer(**p).skill for p in self.state.performers) / len(self.state.performers)
            print(f"Daily Salary Expenses: ${total_salary}")
            print(f"Average Performer Skill: {avg_skill:.1f}/10")
            
            # Gender diversity stats
            print("\n--- DIVERSITY STATISTICS ---")
            gender_counts = {}
            for perf_data in self.state.performers:
                perf = Performer(**perf_data)
                gender = perf.gender.value
                gender_counts[gender] = gender_counts.get(gender, 0) + 1
            
            for gender, count in gender_counts.items():
                print(f"{gender.capitalize()}: {count}")
            
            # Most common traits
            trait_counts = {}
            for perf_data in self.state.performers:
                perf = Performer(**perf_data)
                for trait in perf.traits:
                    trait_counts[trait] = trait_counts.get(trait, 0) + 1
            
            if trait_counts:
                print("\n--- TOP TEAM TRAITS ---")
                sorted_traits = sorted(trait_counts.items(), key=lambda x: x[1], reverse=True)
                for trait, count in sorted_traits[:5]:
                    print(f"{trait}: {count} performer(s)")
        
        print("\n--- STORY PROGRESS ---")
        print(f"Events Completed: {len(self.state.completed_events)}")
        
        input("\nPress Enter to continue...")
    
    def main_menu(self):
        """Display main game menu"""
        while self.running:
            self.display_header()
            
            print("1. Recruit Performer")
            print("2. Manage Performers")
            print("3. Run Club Night")
            print("4. Advance Day")
            print("5. View Statistics")
            print("6. Save Game")
            print("7. Exit Game")
            
            choice = input("\nChoose an action: ").strip()
            
            if choice == '1':
                self.recruit_performer()
            elif choice == '2':
                self.manage_performers()
            elif choice == '3':
                self.run_club_night()
            elif choice == '4':
                self.advance_day()
            elif choice == '5':
                self.view_stats()
            elif choice == '6':
                self.save_game()
            elif choice == '7':
                save = input("\nSave before exiting? (y/n): ").strip().lower()
                if save == 'y':
                    self.save_game()
                print("\nThanks for playing!")
                self.running = False
            else:
                print("\nInvalid choice!")


def main():
    """Main game entry point"""
    print("\n" + "="*70)
    print("🎭 UNDERGROUND CLUB MANAGER 🎭".center(70))
    print("="*70)
    print("\nWelcome to Underground Club Manager!")
    print("Manage your nightclub, recruit performers, and navigate moral dilemmas.")
    
    game = ClubManager()
    
    if os.path.exists(game.save_file):
        load = input("\nFound existing save. Load it? (y/n): ").strip().lower()
        if load == 'y':
            game.load_game()
    
    if game.running:
        print("\n--- TUTORIAL ---")
        print("• Recruit performers to work at your club")
        print("• Train them to increase their skills")
        print("• Run club nights to earn money")
        print("• Balance profit with ethics and relationships")
        print("• Navigate events and make tough decisions")
        print("\nYour choices matter and affect your reputation and storyline!")
        
        input("\nPress Enter to begin...")
        
        game.main_menu()


if __name__ == "__main__":
    main()
