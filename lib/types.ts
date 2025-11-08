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
  [key: string]: any;
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
