import { ClothingItem, ClothingSlot } from './types';

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

// Clothing Catalog
export const CLOTHING_CATALOG: ClothingItem[] = [
  // Tops
  { id: "top_basic_tee", name: "Basic T-Shirt", slot: ClothingSlot.TOP, appeal: 2, cost: 50, description: "Simple and casual" },
  { id: "top_tank", name: "Tank Top", slot: ClothingSlot.TOP, appeal: 3, cost: 75, description: "Shows off physique" },
  { id: "top_dress_shirt", name: "Dress Shirt", slot: ClothingSlot.TOP, appeal: 5, cost: 150, description: "Professional look" },
  { id: "top_silk_blouse", name: "Silk Blouse", slot: ClothingSlot.TOP, appeal: 6, cost: 250, description: "Elegant and flowing" },
  { id: "top_leather_vest", name: "Leather Vest", slot: ClothingSlot.TOP, appeal: 7, cost: 350, description: "Edgy and stylish" },
  { id: "top_sequin_top", name: "Sequin Top", slot: ClothingSlot.TOP, appeal: 8, cost: 500, description: "Catches the stage lights" },
  { id: "top_designer_jacket", name: "Designer Jacket", slot: ClothingSlot.TOP, appeal: 9, cost: 800, description: "High-end fashion statement" },
  
  // Bottoms
  { id: "bottom_jeans", name: "Jeans", slot: ClothingSlot.BOTTOM, appeal: 2, cost: 60, description: "Classic denim" },
  { id: "bottom_shorts", name: "Shorts", slot: ClothingSlot.BOTTOM, appeal: 3, cost: 70, description: "Casual and comfortable" },
  { id: "bottom_slacks", name: "Dress Slacks", slot: ClothingSlot.BOTTOM, appeal: 5, cost: 140, description: "Professional attire" },
  { id: "bottom_skirt", name: "Mini Skirt", slot: ClothingSlot.BOTTOM, appeal: 6, cost: 200, description: "Flirty and fun" },
  { id: "bottom_leather_pants", name: "Leather Pants", slot: ClothingSlot.BOTTOM, appeal: 7, cost: 400, description: "Bold and daring" },
  { id: "bottom_designer_pants", name: "Designer Pants", slot: ClothingSlot.BOTTOM, appeal: 8, cost: 600, description: "Haute couture" },
  
  // Shoes
  { id: "shoes_sneakers", name: "Sneakers", slot: ClothingSlot.SHOES, appeal: 2, cost: 80, description: "Comfortable for dancing" },
  { id: "shoes_boots", name: "Boots", slot: ClothingSlot.SHOES, appeal: 4, cost: 150, description: "Stylish and sturdy" },
  { id: "shoes_heels", name: "High Heels", slot: ClothingSlot.SHOES, appeal: 6, cost: 250, description: "Classic elegance" },
  { id: "shoes_platform", name: "Platform Heels", slot: ClothingSlot.SHOES, appeal: 7, cost: 350, description: "Statement footwear" },
  { id: "shoes_designer", name: "Designer Heels", slot: ClothingSlot.SHOES, appeal: 9, cost: 700, description: "Luxury brand shoes" },
  
  // Accessories
  { id: "acc_watch", name: "Watch", slot: ClothingSlot.ACCESSORY, appeal: 3, cost: 100, description: "Keeps you on time" },
  { id: "acc_necklace", name: "Necklace", slot: ClothingSlot.ACCESSORY, appeal: 4, cost: 180, description: "Adds sparkle" },
  { id: "acc_bracelet", name: "Bracelet", slot: ClothingSlot.ACCESSORY, appeal: 4, cost: 150, description: "Subtle accent" },
  { id: "acc_choker", name: "Choker", slot: ClothingSlot.ACCESSORY, appeal: 5, cost: 200, description: "Trendy neckwear" },
  { id: "acc_diamond_necklace", name: "Diamond Necklace", slot: ClothingSlot.ACCESSORY, appeal: 8, cost: 1000, description: "Dazzling jewels" },
  { id: "acc_gold_chain", name: "Gold Chain", slot: ClothingSlot.ACCESSORY, appeal: 7, cost: 600, description: "Shows success" },
];

