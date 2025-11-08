// Game Constants - Traits and Names

export const PERSONALITY_TRAITS: string[] = [
  // Positive traits
  "Charismatic", "Hardworking", "Creative", "Passionate", "Reliable",
  "Energetic", "Confident", "Empathetic", "Innovative", "Loyal",
  "Ambitious", "Patient", "Humble", "Optimistic", "Honest",
  "Adaptable", "Caring", "Disciplined", "Generous", "Courageous",
  
  // Performance-related traits
  "Natural Talent", "Stage Presence", "Crowd Pleaser", "Perfectionist", "Improvisational",
  "Versatile", "Quick Learner", "Detail-Oriented", "Rhythmic", "Expressive",
  
  // Social traits
  "Team Player", "Mentor", "Diplomatic", "Inspiring", "Networking Pro",
  "Conflict Resolver", "Natural Leader", "Supportive", "Funny", "Charming",
  
  // Challenging traits
  "Demanding", "Anxious", "Stubborn", "Hot-Tempered", "Jealous",
  "Arrogant", "Moody", "Impulsive", "Reserved", "Competitive",
  
  // Unique traits
  "Night Owl", "Early Bird", "Risk Taker", "Cautious", "Eccentric",
  "Mysterious", "Flamboyant", "Minimalist", "Traditional", "Avant-Garde",
  
  // Additional traits
  "Sophisticated", "Street Smart", "Book Smart", "Athletic", "Artistic",
  "Musical Genius", "Dancing Legend", "Vocal Powerhouse", "Tech Savvy", "Fashion Icon"
];

export const FIRST_NAMES: string[] = [
  "Alex", "Jordan", "Casey", "Morgan", "Riley", "Taylor", "Quinn", "Blake", "Avery", "Cameron",
  "Sam", "Jamie", "Dakota", "Sage", "River", "Phoenix", "Skylar", "Rowan", "Jesse", "Charlie",
  "Drew", "Harper", "Emerson", "Reese", "Elliot", "Hayden", "Logan", "Peyton", "Finley", "Kendall",
  "Devon", "Frankie", "Remy", "Billie", "Tatum", "Marley", "Shiloh", "Sawyer", "Lux", "Onyx"
];

export const LAST_NAMES: string[] = [
  "Reed", "Brooks", "Hayes", "Lane", "Graham", "Jensen", "Hart", "Wells", "Price", "Dixon",
  "Frost", "Knight", "Stone", "Ford", "Blair", "West", "Cole", "Beck", "Page", "Sloan",
  "Banks", "Cross", "Grant", "Hale", "Rhodes", "Moss", "Pace", "Jennings", "Kerr", "Lowell",
  "Monroe", "Parker", "Quill", "Rowe", "Voss", "York", "Winter", "Ash", "Locke", "Vale"
];

const usedNames = new Set<string>();

export function generateFullName(): string {
  let attempts = 0;
  while (attempts < 50) {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const candidate = `${first} ${last}`;
    if (!usedNames.has(candidate)) {
      usedNames.add(candidate);
      return candidate;
    }
    attempts++;
  }
  const suffix = Math.floor(Math.random() * 900) + 100;
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const candidate = `${first} ${last} #${suffix}`;
  usedNames.add(candidate);
  return candidate;
}

export function resetUsedNames(): void {
  usedNames.clear();
}
