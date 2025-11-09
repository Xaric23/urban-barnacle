// Game Types and Interfaces for Underground Club Manager

export enum PerformerType {
  DANCER = "dancer",
  SINGER = "singer",
  DJ = "dj",
  BARTENDER = "bartender",
  SECURITY = "security",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  TRANSGENDER = "transgender",
  NON_BINARY = "non-binary",
  INTERSEX = "intersex",
}

export enum EventType {
  RECRUITMENT = "recruitment",
  MORAL_DILEMMA = "moral_dilemma",
  BUSINESS = "business",
  RELATIONSHIP = "relationship",
  RANDOM = "random",
  SABOTAGE = "sabotage",
  DRAMA = "drama",
  TREND = "trend",
}

export enum PersonalityArchetype {
  FLIRTATIOUS = "flirtatious",
  DOMINANT = "dominant",
  SHY = "shy",
  KINKY = "kinky",
  COMEDIC = "comedic",
  VANILLA = "vanilla",
  MYSTERIOUS = "mysterious",
  PLAYFUL = "playful",
}

export enum ThemedNightType {
  GOTHIC_FETISH = "gothic_fetish",
  COMEDY_BURLESQUE = "comedy_burlesque",
  PET_PLAY_THURSDAY = "pet_play_thursday",
  BDSM_SHOWCASE = "bdsm_showcase",
  VANILLA_ROMANCE = "vanilla_romance",
  MYSTERY_MASQUERADE = "mystery_masquerade",
  PLAYFUL_TEASE = "playful_tease",
}

export enum ClothingSlot {
  TOP = "top",
  BOTTOM = "bottom",
  SHOES = "shoes",
  ACCESSORY = "accessory",
}

export interface ClothingItem {
  id: string;
  name: string;
  slot: ClothingSlot;
  appeal: number; // 0-10, affects tips and income
  cost: number;
  description: string;
}

export interface Wardrobe {
  [ClothingSlot.TOP]: string | null; // clothing item id
  [ClothingSlot.BOTTOM]: string | null;
  [ClothingSlot.SHOES]: string | null;
  [ClothingSlot.ACCESSORY]: string | null;
}

export interface Performer {
  name: string;
  performerType: PerformerType;
  gender: Gender;
  traits: string[];
  skill: number; // 1-10
  loyalty: number; // 1-10
  energy: number; // 1-10
  salary: number;
  reputation: number; // -10 to 10
  promotionLevel: number;
  offersStriptease: boolean;
  dancerStripRoutine: boolean;
  offersPrivateLounge: boolean;
  afterHoursExclusive: boolean;
  wardrobe: Wardrobe;
  tipsEarned: number; // Lifetime tips earned by this performer
  personalityArchetype: PersonalityArchetype; // New: personality type
  chemistryWith: Record<string, number>; // New: performer_name -> chemistry_score (0-100)
  relationships: Record<string, "alliance" | "feud" | "romance" | "neutral">; // New: staff relationships
  cards: string[]; // New: NSFW skill cards
  breastSize?: string; // Cup size (AA-H), for female/intersex/transgender/non-binary
  penisSize?: string; // In inches (e.g., "7 inches"), for male/intersex/transgender/non-binary
  comfortLevel: number; // 0-100: How comfortable they are with adult content
  offersLapDances: boolean; // New adult service
  offersPoleShows: boolean; // New adult service
  willDoFetishShows: boolean; // New adult service
}

export interface GameState {
  day: number;
  money: number;
  reputation: number; // 0-100
  ethicsScore: number; // 0-100
  performers: Performer[];
  relationships: Record<string, number>; // performer_name -> relationship_level
  storyFlags: Record<string, boolean>;
  completedEvents: string[];
  upgrades: Record<string, number>; // upgrade_id -> level
  cityDemand: number; // Base demand percentage
  genreTrend: Record<string, number>; // performer_type -> trend modifier
  riskLevel: "conservative" | "standard" | "bold";
  eventCooldowns: Record<string, number>; // event_id -> day_available_again
  eventHistory: string[];
  lastEventDay: number;
  ownedClothing: string[]; // IDs of clothing items owned by the club
  
  // New: Audience & Crowd System
  crowdMood: Record<string, number>; // kink_type -> demand level (0-100)
  seasonalTrends: string[]; // active seasonal trends
  viralTrends: string[]; // current viral trends
  
  // New: Drama & Gossip
  activeRumors: Rumor[];
  dramaLevel: number; // 0-100, affects performance
  
  // New: Club Customization
  stageProps: StageProp[];
  activeEffects: string[]; // active special effects
  maintenanceCost: number; // daily cost for effects/props
  
  // New: Rival Clubs
  rivalClubs: RivalClub[];
  
  // New: Expansion & Fame
  fame: number; // 0-100
  camShowBranch: boolean;
  vipWebsite: boolean;
  managedTroupes: string[]; // IDs of troupes at other clubs
  
  // New: Card System
  availableCards: SkillCard[];
  usedCardsThisNight: string[];
  
  // New: VIP Room & Adult Features
  vipRooms: VIPRoom[];
  ownedFetishItems: string[]; // IDs of fetish items
  activePatronRequests: PatronRequest[];
  adultContentLevel: number; // 0-100: How explicit the club is
}

export interface EventContext {
  id: string;
  tags: string[];
  riskRating: number;
  intensity: number;
  severity: "low" | "medium" | "high";
  chainDepth: number;
  daysSinceLastEvent: number;
  variantSeed: number;
  clubMoney: number;
  reputation: number;
  ethics: number;
  cityDemand: number;
}

export interface Upgrade {
  name: string;
  desc: string;
  baseCost: number;
  maxLevel: number;
  incomePct?: number;
  eventFailureReduction?: number;
  spendingPowerPct?: number;
  crowdSizePct?: number;
  repGainPct?: number;
  eventProbReduction?: number;
}

export interface Promotion {
  title: string;
  skillReq: number;
  cost: number;
  buff: string;
  desc: string;
}

export interface Patron {
  name: string;
  mood: number;
  spendingPower: number;
  archetype: string;
}

// New Types for Advanced Features

export interface Rumor {
  id: string;
  title: string;
  description: string;
  involvedPerformers: string[]; // performer names
  severity: "low" | "medium" | "high";
  resolutionOptions: RumorResolution[];
  dayStarted: number;
}

export interface RumorResolution {
  type: "diplomacy" | "bribe" | "ignore";
  cost: number;
  ethicsImpact: number;
  successChance: number;
  description: string;
}

export interface StageProp {
  id: string;
  name: string;
  type: "pole" | "cage" | "throne" | "swing" | "platform";
  appeal: number;
  cost: number;
  maintenanceCost: number;
  description: string;
}

export interface SpecialEffect {
  id: string;
  name: string;
  type: "fire" | "laser" | "bubble" | "smoke" | "champagne_shower" | "confetti";
  impact: number; // show rating bonus
  cost: number;
  maintenanceCost: number;
  description: string;
}

export interface RivalClub {
  name: string;
  strength: number; // 0-100
  aggression: number; // 0-100, how often they sabotage
  lastSabotage: number; // day number
}

export interface SkillCard {
  id: string;
  name: string;
  category: "tease" | "dominance" | "submission" | "comedy" | "mystery" | "vanilla";
  power: number; // 1-10
  energyCost: number;
  description: string;
  comboWith: string[]; // card IDs that combo with this
  unlockRequirement?: string; // requirement to unlock
}

export interface ThemedNight {
  type: ThemedNightType;
  name: string;
  description: string;
  requiredArchetypes: PersonalityArchetype[];
  bonusMultiplier: number;
  minPerformers: number;
}

export interface TabooNightEvent {
  id: string;
  name: string;
  description: string;
  riskLevel: number; // 1-10
  potentialReward: number;
  ethicsImpact: number;
}

// VIP Room System
export interface VIPRoom {
  id: string;
  name: string;
  tier: number; // 1-3 (Basic, Deluxe, Premium)
  cost: number;
  dailyIncome: number;
  description: string;
  unlockRequirement: {
    reputation: number;
    fame: number;
  };
}

// Fetish Shop Items
export interface FetishItem {
  id: string;
  name: string;
  category: "toy" | "furniture" | "costume" | "restraint" | "prop";
  appeal: number;
  cost: number;
  description: string;
  unlockRequirement?: {
    ethics?: number; // Lower ethics unlocks more extreme items
    reputation?: number;
  };
}

// Patron Request System
export interface PatronRequest {
  id: string;
  patronName: string;
  requestType: "private_show" | "specific_performer" | "themed_performance" | "custom_act";
  payment: number;
  ethicsImpact: number;
  description: string;
  requirements: {
    performerArchetype?: PersonalityArchetype;
    minSkill?: number;
    specificService?: string;
  };
}
