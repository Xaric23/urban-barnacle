#!/usr/bin/env python3
"""
Trait System Showcase
Demonstrates the personality trait and gender diversity system
"""

from game import PERSONALITY_TRAITS, Gender, Performer, PerformerType
import random

def showcase_traits():
    """Show examples of the trait system"""
    print("\n" + "="*70)
    print("PERSONALITY TRAIT SYSTEM SHOWCASE".center(70))
    print("="*70)
    
    print(f"\n📊 Total Unique Traits: {len(PERSONALITY_TRAITS)}")
    print(f"✓ All traits are unique: {len(PERSONALITY_TRAITS) == len(set(PERSONALITY_TRAITS))}")
    
    print("\n🎭 TRAIT CATEGORIES:")
    print("\nPositive Traits (20):")
    print("  " + ", ".join(PERSONALITY_TRAITS[0:20]))
    
    print("\nPerformance Traits (10):")
    print("  " + ", ".join(PERSONALITY_TRAITS[20:30]))
    
    print("\nSocial Traits (10):")
    print("  " + ", ".join(PERSONALITY_TRAITS[30:40]))
    
    print("\nChallenging Traits (10):")
    print("  " + ", ".join(PERSONALITY_TRAITS[40:50]))
    
    print("\nUnique Traits (10):")
    print("  " + ", ".join(PERSONALITY_TRAITS[50:60]))
    
    print("\nAdditional Traits (10):")
    print("  " + ", ".join(PERSONALITY_TRAITS[60:70]))


def showcase_diversity():
    """Show gender diversity options"""
    print("\n" + "="*70)
    print("GENDER DIVERSITY SYSTEM".center(70))
    print("="*70)
    
    print(f"\n🌈 Available Gender Identities: {len(Gender)}")
    for gender in Gender:
        print(f"  • {gender.value.capitalize()}")


def generate_sample_characters():
    """Generate sample diverse characters"""
    print("\n" + "="*70)
    print("SAMPLE CHARACTER GENERATION".center(70))
    print("="*70)
    
    first_names = [
        "Alex", "Jordan", "Casey", "Morgan", "Riley", "Taylor",
        "Sam", "Jamie", "Dakota", "Sage", "River", "Phoenix"
    ]
    
    performer_types = list(PerformerType)
    genders = list(Gender)
    
    print("\n📋 Generating 5 diverse characters:\n")
    
    for i in range(5):
        name = random.choice(first_names)
        ptype = random.choice(performer_types)
        gender = random.choice(genders)
        traits = random.sample(PERSONALITY_TRAITS, 3)
        skill = random.randint(5, 9)
        
        print(f"{i+1}. {name} - {ptype.value.capitalize()}")
        print(f"   Gender: {gender.value.capitalize()}")
        print(f"   Skill: {skill}/10")
        print(f"   Traits: {', '.join(traits)}")
        print()


def showcase_trait_effects():
    """Show how traits affect game mechanics"""
    print("\n" + "="*70)
    print("TRAIT EFFECTS ON GAMEPLAY".center(70))
    print("="*70)
    
    print("\n💰 SALARY ADJUSTMENTS:")
    print("  • Hardworking: -10% salary (willing to work for less)")
    print("  • Arrogant: +20% salary (demands more)")
    
    print("\n🎯 PERFORMANCE BONUSES:")
    print("  • Crowd Pleaser: +15% income during performances")
    print("  • Stage Presence: +10% income during performances")
    print("  • Natural Talent: +8% income during performances")
    print("  • Charismatic: +5% income during performances")
    
    print("\n📚 TRAINING EFFECTS:")
    print("  • Quick Learner: Special feedback during training")
    print("  • Perfectionist: Determined to master every detail")
    print("  • Natural Talent: +1 skill bonus at hiring")
    
    print("\n😴 REST EFFECTS:")
    print("  • Energetic: +1 extra energy recovery when resting")
    
    print("\n💬 CONVERSATION STYLES:")
    print("  • Charismatic: Charisma shines through in conversations")
    print("  • Reserved: Quiet at first, gradually opens up")
    print("  • Funny: Makes you laugh with jokes and stories")


def main():
    """Run all showcases"""
    showcase_traits()
    showcase_diversity()
    generate_sample_characters()
    showcase_trait_effects()
    
    print("\n" + "="*70)
    print("✓ TRAIT SYSTEM FULLY IMPLEMENTED".center(70))
    print("="*70)
    print("\n📝 Run 'python3 game.py' to experience these features in gameplay!")
    print()


if __name__ == "__main__":
    main()
