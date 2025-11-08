"""
Trait and name data for Underground Club Manager.
Externalized for modularity and easy expansion.
"""

from typing import List

# Comprehensive trait system - 70+ unique traits
PERSONALITY_TRAITS: List[str] = [
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

# Name pools for generating natural performer and patron identities
FIRST_NAMES: List[str] = [
    "Alex", "Jordan", "Casey", "Morgan", "Riley", "Taylor", "Quinn", "Blake", "Avery", "Cameron",
    "Sam", "Jamie", "Dakota", "Sage", "River", "Phoenix", "Skylar", "Rowan", "Jesse", "Charlie",
    "Drew", "Harper", "Emerson", "Reese", "Elliot", "Hayden", "Logan", "Peyton", "Finley", "Kendall",
    "Devon", "Frankie", "Remy", "Billie", "Tatum", "Marley", "Shiloh", "Sawyer", "Lux", "Onyx"
]

LAST_NAMES: List[str] = [
    "Reed", "Brooks", "Hayes", "Lane", "Graham", "Jensen", "Hart", "Wells", "Price", "Dixon",
    "Frost", "Knight", "Stone", "Ford", "Blair", "West", "Cole", "Beck", "Page", "Sloan",
    "Banks", "Cross", "Grant", "Hale", "Rhodes", "Moss", "Pace", "Jennings", "Kerr", "Lowell",
    "Monroe", "Parker", "Quill", "Rowe", "Voss", "York", "Winter", "Ash", "Locke", "Vale"
]
