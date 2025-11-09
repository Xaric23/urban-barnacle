import { ClothingItem, ClothingSlot, PersonalityArchetype, ThemedNightType, ThemedNight, SkillCard, StageProp, SpecialEffect, RivalClub, VIPRoom, FetishItem, PatronRequest } from './types';

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

// Chemistry System Constants
export const PERSONALITY_ARCHETYPES = Object.values(PersonalityArchetype);

export const CHEMISTRY_COMPATIBILITY: Record<PersonalityArchetype, PersonalityArchetype[]> = {
  [PersonalityArchetype.FLIRTATIOUS]: [PersonalityArchetype.SHY, PersonalityArchetype.PLAYFUL, PersonalityArchetype.KINKY],
  [PersonalityArchetype.DOMINANT]: [PersonalityArchetype.SHY, PersonalityArchetype.KINKY],
  [PersonalityArchetype.SHY]: [PersonalityArchetype.FLIRTATIOUS, PersonalityArchetype.DOMINANT, PersonalityArchetype.MYSTERIOUS],
  [PersonalityArchetype.KINKY]: [PersonalityArchetype.FLIRTATIOUS, PersonalityArchetype.DOMINANT, PersonalityArchetype.PLAYFUL],
  [PersonalityArchetype.COMEDIC]: [PersonalityArchetype.PLAYFUL, PersonalityArchetype.VANILLA],
  [PersonalityArchetype.VANILLA]: [PersonalityArchetype.VANILLA, PersonalityArchetype.COMEDIC],
  [PersonalityArchetype.MYSTERIOUS]: [PersonalityArchetype.SHY, PersonalityArchetype.FLIRTATIOUS],
  [PersonalityArchetype.PLAYFUL]: [PersonalityArchetype.FLIRTATIOUS, PersonalityArchetype.KINKY, PersonalityArchetype.COMEDIC],
};

// Themed Nights Configuration
export const THEMED_NIGHTS: ThemedNight[] = [
  {
    type: ThemedNightType.GOTHIC_FETISH,
    name: "Gothic Fetish Night",
    description: "Dark, mysterious performances with BDSM themes",
    requiredArchetypes: [PersonalityArchetype.DOMINANT, PersonalityArchetype.KINKY, PersonalityArchetype.MYSTERIOUS],
    bonusMultiplier: 1.5,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.COMEDY_BURLESQUE,
    name: "Comedy Burlesque",
    description: "Laughter and sensuality combined",
    requiredArchetypes: [PersonalityArchetype.COMEDIC, PersonalityArchetype.PLAYFUL],
    bonusMultiplier: 1.3,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.PET_PLAY_THURSDAY,
    name: "Pet Play Thursday",
    description: "Animal roleplay and submission themes",
    requiredArchetypes: [PersonalityArchetype.KINKY, PersonalityArchetype.PLAYFUL, PersonalityArchetype.SHY],
    bonusMultiplier: 1.4,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.BDSM_SHOWCASE,
    name: "BDSM Showcase",
    description: "Dominance and submission performances",
    requiredArchetypes: [PersonalityArchetype.DOMINANT, PersonalityArchetype.KINKY],
    bonusMultiplier: 1.6,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.VANILLA_ROMANCE,
    name: "Vanilla Romance Night",
    description: "Classic, romantic performances",
    requiredArchetypes: [PersonalityArchetype.VANILLA, PersonalityArchetype.FLIRTATIOUS],
    bonusMultiplier: 1.2,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.MYSTERY_MASQUERADE,
    name: "Mystery Masquerade",
    description: "Masked performers in mysterious acts",
    requiredArchetypes: [PersonalityArchetype.MYSTERIOUS, PersonalityArchetype.FLIRTATIOUS],
    bonusMultiplier: 1.35,
    minPerformers: 2,
  },
  {
    type: ThemedNightType.PLAYFUL_TEASE,
    name: "Playful Tease Night",
    description: "Fun, flirtatious performances",
    requiredArchetypes: [PersonalityArchetype.PLAYFUL, PersonalityArchetype.FLIRTATIOUS],
    bonusMultiplier: 1.25,
    minPerformers: 2,
  },
];

// Skill Card System
export const SKILL_CARDS: SkillCard[] = [
  // Tease Cards
  { id: "tease_wink", name: "Seductive Wink", category: "tease", power: 3, energyCost: 1, description: "A flirtatious wink that captivates", comboWith: ["tease_dance"] },
  { id: "tease_dance", name: "Teasing Dance", category: "tease", power: 5, energyCost: 2, description: "A provocative dance routine", comboWith: ["tease_wink", "tease_strip"] },
  { id: "tease_strip", name: "Slow Strip", category: "tease", power: 7, energyCost: 3, description: "Artful removal of clothing", comboWith: ["tease_dance"] },
  
  // Dominance Cards
  { id: "dom_command", name: "Commanding Presence", category: "dominance", power: 6, energyCost: 2, description: "Assert dominance over the audience", comboWith: ["dom_punish"] },
  { id: "dom_punish", name: "Playful Punishment", category: "dominance", power: 8, energyCost: 3, description: "Theatrical dominance display", comboWith: ["dom_command"] },
  
  // Submission Cards
  { id: "sub_obey", name: "Obedient Display", category: "submission", power: 5, energyCost: 2, description: "Submissive performance", comboWith: ["sub_beg"] },
  { id: "sub_beg", name: "Pleading Performance", category: "submission", power: 6, energyCost: 2, description: "Theatrical begging", comboWith: ["sub_obey"] },
  
  // Comedy Cards
  { id: "comedy_joke", name: "Naughty Joke", category: "comedy", power: 4, energyCost: 1, description: "NSFW humor", comboWith: ["comedy_physical"] },
  { id: "comedy_physical", name: "Slapstick Burlesque", category: "comedy", power: 6, energyCost: 2, description: "Physical comedy with sensuality", comboWith: ["comedy_joke"] },
  
  // Mystery Cards
  { id: "mystery_mask", name: "Masked Tease", category: "mystery", power: 5, energyCost: 2, description: "Hidden identity performance", comboWith: ["mystery_reveal"] },
  { id: "mystery_reveal", name: "Dramatic Reveal", category: "mystery", power: 7, energyCost: 3, description: "Surprising unveiling", comboWith: ["mystery_mask"] },
  
  // Vanilla Cards
  { id: "vanilla_romance", name: "Romantic Dance", category: "vanilla", power: 4, energyCost: 1, description: "Sweet, sensual performance", comboWith: ["vanilla_kiss"] },
  { id: "vanilla_kiss", name: "Air Kiss", category: "vanilla", power: 3, energyCost: 1, description: "Blow kisses to audience", comboWith: ["vanilla_romance"] },
];

// Stage Props
export const STAGE_PROPS: StageProp[] = [
  { id: "prop_pole", name: "Professional Pole", type: "pole", appeal: 8, cost: 1500, maintenanceCost: 20, description: "Classic stripper pole" },
  { id: "prop_cage", name: "Dancing Cage", type: "cage", appeal: 7, cost: 2000, maintenanceCost: 30, description: "Cage for confined performances" },
  { id: "prop_throne", name: "Dominance Throne", type: "throne", appeal: 9, cost: 2500, maintenanceCost: 15, description: "Throne for power dynamics" },
  { id: "prop_swing", name: "Aerial Swing", type: "swing", appeal: 10, cost: 3000, maintenanceCost: 50, description: "Suspended swing for aerial acts" },
  { id: "prop_platform", name: "Elevated Platform", type: "platform", appeal: 6, cost: 800, maintenanceCost: 10, description: "Raised stage section" },
];

// Special Effects
export const SPECIAL_EFFECTS: SpecialEffect[] = [
  { id: "fx_fire", name: "Fire Display", type: "fire", impact: 15, cost: 3000, maintenanceCost: 100, description: "Controlled flames on stage" },
  { id: "fx_laser", name: "Laser Show", type: "laser", impact: 12, cost: 2500, maintenanceCost: 75, description: "Colorful laser patterns" },
  { id: "fx_bubble", name: "Bubble Machine", type: "bubble", impact: 8, cost: 800, maintenanceCost: 30, description: "Fills stage with bubbles" },
  { id: "fx_smoke", name: "Smoke Machine", type: "smoke", impact: 10, cost: 1200, maintenanceCost: 40, description: "Atmospheric fog effects" },
  { id: "fx_champagne", name: "Champagne Shower", type: "champagne_shower", impact: 20, cost: 5000, maintenanceCost: 200, description: "Luxurious champagne spray" },
  { id: "fx_confetti", name: "Confetti Cannon", type: "confetti", impact: 7, cost: 600, maintenanceCost: 25, description: "Festive confetti bursts" },
];

// Rival Clubs
export const RIVAL_CLUBS: RivalClub[] = [
  { name: "The Velvet Underground", strength: 60, aggression: 50, lastSabotage: 0 },
  { name: "Crimson Palace", strength: 70, aggression: 70, lastSabotage: 0 },
  { name: "Midnight Oasis", strength: 50, aggression: 30, lastSabotage: 0 },
];

// Crowd Kinks/Trends
export const CROWD_KINKS = [
  "bdsm", "petplay", "roleplay", "voyeurism", "exhibitionism",
  "fetish", "vanilla", "comedy", "gothic", "mystery"
];

// Seasonal Trends
export const SEASONAL_TRENDS: Record<string, string[]> = {
  winter: ["gothic", "mystery", "bdsm"],
  spring: ["vanilla", "romance", "playful"],
  summer: ["exhibitionism", "beach", "playful"],
  fall: ["gothic", "mystery", "fetish"],
};

// Viral Trends (random chance)
export const VIRAL_TRENDS = [
  { name: "Tentacle Trend", kink: "fetish", duration: 7, bonus: 30 },
  { name: "Pet Play Craze", kink: "petplay", duration: 5, bonus: 25 },
  { name: "Gothic Revival", kink: "gothic", duration: 10, bonus: 20 },
  { name: "Comedy Boom", kink: "comedy", duration: 6, bonus: 22 },
  { name: "Mystery Madness", kink: "mystery", duration: 8, bonus: 18 },
];

// VIP Room Tiers
export const VIP_ROOMS: VIPRoom[] = [
  {
    id: "vip_basic",
    name: "Private Booth",
    tier: 1,
    cost: 5000,
    dailyIncome: 200,
    description: "Intimate booth for one-on-one performances",
    unlockRequirement: { reputation: 40, fame: 20 }
  },
  {
    id: "vip_deluxe",
    name: "Champagne Lounge",
    tier: 2,
    cost: 15000,
    dailyIncome: 500,
    description: "Luxurious lounge with private bar and stage",
    unlockRequirement: { reputation: 60, fame: 40 }
  },
  {
    id: "vip_premium",
    name: "The Velvet Suite",
    tier: 3,
    cost: 40000,
    dailyIncome: 1200,
    description: "Ultra-exclusive suite with custom performances and amenities",
    unlockRequirement: { reputation: 80, fame: 60 }
  },
];

// Fetish Shop Items
export const FETISH_ITEMS: FetishItem[] = [
  // Toys
  { 
    id: "toy_feather", 
    name: "Feather Teaser", 
    category: "toy", 
    appeal: 5, 
    cost: 150, 
    description: "Soft feathers for sensual teasing"
  },
  { 
    id: "toy_paddle", 
    name: "Velvet Paddle", 
    category: "toy", 
    appeal: 8, 
    cost: 350, 
    description: "For playful spanking performances",
    unlockRequirement: { ethics: 40 }
  },
  { 
    id: "toy_whip", 
    name: "Leather Flogger", 
    category: "toy", 
    appeal: 12, 
    cost: 650, 
    description: "BDSM prop for dominance shows",
    unlockRequirement: { ethics: 30 }
  },
  { 
    id: "toy_vibrator", 
    name: "Performance Vibrator", 
    category: "toy", 
    appeal: 15, 
    cost: 800, 
    description: "Interactive toy for explicit performances",
    unlockRequirement: { ethics: 25, reputation: 50 }
  },
  
  // Furniture
  { 
    id: "furn_bench", 
    name: "Spanking Bench", 
    category: "furniture", 
    appeal: 10, 
    cost: 1200, 
    description: "BDSM furniture for submission shows",
    unlockRequirement: { ethics: 35 }
  },
  { 
    id: "furn_cross", 
    name: "St. Andrew's Cross", 
    category: "furniture", 
    appeal: 14, 
    cost: 2500, 
    description: "Classic restraint apparatus",
    unlockRequirement: { ethics: 25 }
  },
  { 
    id: "furn_bed", 
    name: "Performance Bed", 
    category: "furniture", 
    appeal: 18, 
    cost: 3500, 
    description: "Luxury bed for intimate shows",
    unlockRequirement: { ethics: 20, reputation: 60 }
  },
  
  // Costumes
  { 
    id: "costume_latex", 
    name: "Latex Bodysuit", 
    category: "costume", 
    appeal: 10, 
    cost: 500, 
    description: "Shiny, form-fitting outfit"
  },
  { 
    id: "costume_leather", 
    name: "Leather Harness", 
    category: "costume", 
    appeal: 12, 
    cost: 700, 
    description: "Strappy leather outfit for fetish shows",
    unlockRequirement: { ethics: 35 }
  },
  { 
    id: "costume_nurse", 
    name: "Naughty Nurse Outfit", 
    category: "costume", 
    appeal: 8, 
    cost: 400, 
    description: "Roleplay costume for fantasy scenarios"
  },
  { 
    id: "costume_officer", 
    name: "Officer Outfit", 
    category: "costume", 
    appeal: 9, 
    cost: 450, 
    description: "Authority roleplay costume"
  },
  
  // Restraints
  { 
    id: "restraint_cuffs", 
    name: "Velvet Cuffs", 
    category: "restraint", 
    appeal: 7, 
    cost: 250, 
    description: "Comfortable cuffs for light bondage",
    unlockRequirement: { ethics: 40 }
  },
  { 
    id: "restraint_rope", 
    name: "Silk Rope Kit", 
    category: "restraint", 
    appeal: 10, 
    cost: 450, 
    description: "For artistic rope bondage displays",
    unlockRequirement: { ethics: 35 }
  },
  { 
    id: "restraint_collar", 
    name: "Leather Collar", 
    category: "restraint", 
    appeal: 8, 
    cost: 300, 
    description: "Collar with leash for pet play",
    unlockRequirement: { ethics: 35 }
  },
  
  // Props
  { 
    id: "prop_mask", 
    name: "Masquerade Masks", 
    category: "prop", 
    appeal: 5, 
    cost: 200, 
    description: "Mysterious masks for anonymous shows"
  },
  { 
    id: "prop_oil", 
    name: "Massage Oil", 
    category: "prop", 
    appeal: 6, 
    cost: 150, 
    description: "Scented oil for sensual performances"
  },
  { 
    id: "prop_candles", 
    name: "Wax Play Candles", 
    category: "prop", 
    appeal: 11, 
    cost: 400, 
    description: "Special candles for temperature play",
    unlockRequirement: { ethics: 30 }
  },
];

// Explicit Performance Descriptions
export const EXPLICIT_PERFORMANCE_DESCRIPTIONS = {
  striptease: [
    "slowly removes clothing piece by piece, teasing the audience",
    "performs a sensual dance while gradually undressing",
    "seductively slides out of their outfit to enthusiastic applause",
    "does a playful striptease routine, leaving little to imagination",
    "executes a professional burlesque strip with perfect timing"
  ],
  privateLounge: [
    "gives an intimate private performance in the VIP lounge",
    "provides a personal show with close interaction",
    "entertains a high-paying patron with exclusive attention",
    "performs a sensual dance in the private booth",
    "offers a one-on-one experience that exceeds expectations"
  ],
  afterHours: [
    "stays after closing for an exclusive private session",
    "provides elite-level intimate entertainment behind closed doors",
    "offers premium after-hours companionship",
    "delivers a discreet, high-end experience for top clients",
    "gives a no-holds-barred performance for VIP guests"
  ],
  lapDance: [
    "gives a sultry lap dance, grinding rhythmically",
    "performs an intimate lap dance with close body contact",
    "delivers a steamy personal dance in the patron's lap",
    "provides a sensual lap dance that drives the client wild",
    "executes a professional lap dance with expert technique"
  ],
  poleShow: [
    "spins gracefully on the pole, removing clothing skillfully",
    "performs athletic pole tricks while gradually undressing",
    "combines acrobatics with seduction on the pole",
    "executes advanced pole work in progressively less clothing",
    "captivates the audience with a sensual pole routine"
  ],
  fetishShow: [
    "performs a BDSM-themed show with props and roleplay",
    "demonstrates dominance in a fetish performance",
    "acts out submission scenarios for fetish enthusiasts",
    "uses fetish gear in an erotic display",
    "delivers a kink-focused show that satisfies niche desires"
  ]
};

// Patron Request Templates
export const PATRON_REQUESTS: PatronRequest[] = [
  {
    id: "req_private_dom",
    patronName: "Mr. Sterling",
    requestType: "themed_performance",
    payment: 1500,
    ethicsImpact: -5,
    description: "Wants a private dominance show with a commanding performer",
    requirements: {
      performerArchetype: PersonalityArchetype.DOMINANT,
      minSkill: 6
    }
  },
  {
    id: "req_fetish_couple",
    patronName: "The Valentines",
    requestType: "custom_act",
    payment: 2000,
    ethicsImpact: -8,
    description: "A couple requesting a pet play performance with costumes",
    requirements: {
      minSkill: 5
    }
  },
  {
    id: "req_champagne",
    patronName: "Ms. Dubois",
    requestType: "private_show",
    payment: 1200,
    ethicsImpact: -3,
    description: "Wealthy patron wants champagne and an intimate strip show",
    requirements: {
      performerArchetype: PersonalityArchetype.FLIRTATIOUS,
      minSkill: 5
    }
  },
  {
    id: "req_mystery",
    patronName: "Anonymous",
    requestType: "specific_performer",
    payment: 2500,
    ethicsImpact: -10,
    description: "Anonymous high-roller wants an after-hours exclusive with no questions",
    requirements: {
      minSkill: 7
    }
  },
];

