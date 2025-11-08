#!/usr/bin/env python3
"""
Underground Club Manager - A Text-Based Management Game
Manage your underground nightclub, recruit performers, balance ethics and profit,
and navigate moral dilemmas through branching storylines.
"""

import hashlib
import json
import os
import random
from dataclasses import dataclass, asdict
from enum import Enum
from typing import Dict, List, Optional, Set, Tuple

from traits import FIRST_NAMES, LAST_NAMES, PERSONALITY_TRAITS


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


# Anti-cheat constants and helpers
_SAVE_SALT = "v1|NightclubGameSalt|DoNotModify"  # Changing this invalidates all saves
MAX_EVENT_HISTORY = 10
_USED_FULL_NAMES: Set[str] = set()


def compute_checksum(data: Dict) -> str:
    """Compute a SHA256 checksum over the save data (excluding existing checksum)."""
    filtered = {k: data[k] for k in sorted(data) if k != "checksum"}
    serialized = json.dumps(filtered, separators=(",", ":"), sort_keys=True)
    return hashlib.sha256((_SAVE_SALT + serialized).encode()).hexdigest()


def _serialize_performer_dict(data: Dict) -> Dict:
    """Convert performer enum fields to JSON-safe strings before saving."""
    out = dict(data)
    role = out.get("performer_type")
    gender = out.get("gender")
    if isinstance(role, Enum):
        out["performer_type"] = role.value
    if isinstance(gender, Enum):
        out["gender"] = gender.value
    return out


def _deserialize_performer_dict(data: Dict) -> Dict:
    """Convert stored performer data back into Enum values after loading."""
    out = dict(data)
    role = out.get("performer_type")
    gender = out.get("gender")
    if isinstance(role, str):
        try:
            out["performer_type"] = PerformerType(role)
        except ValueError:
            pass
    if isinstance(gender, str):
        try:
            out["gender"] = Gender(gender)
        except ValueError:
            pass
    return out


def generate_full_name(used_names: Optional[Set[str]] = None) -> str:
    """Generate a unique-sounding full name leveraging shared trait pools."""
    pool = used_names if used_names is not None else _USED_FULL_NAMES
    attempts = 0
    while attempts < 50:
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        candidate = f"{first} {last}"
        if candidate not in pool:
            pool.add(candidate)
            return candidate
        attempts += 1
    suffix = random.randint(100, 999)
    candidate = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} #{suffix}"
    pool.add(candidate)
    return candidate


@dataclass
class Patron:
    """Represents a patron visiting the club for the evening."""
    name: str
    mood: int
    spending_power: int
    archetype: str


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
    promotion_level: int = 0
    offers_striptease: bool = False
    dancer_strip_routine: bool = False
    offers_private_lounge: bool = False
    after_hours_exclusive: bool = False
    
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

    def perform_sensual_show(self, base_income: int) -> Tuple[int, int, int, List[str]]:
        """Optional sensual routines that add income but may impact ethics.

        Returns:
            income_bonus: Additional revenue generated.
            ethics_delta: Change applied to club ethics (negative lowers score).
            reputation_delta: Change applied to reputation.
            notes: Status messages describing the routine results.
        """
        total_bonus = 0
        ethics_delta = 0
        reputation_delta = 0
        notes: List[str] = []

        if base_income <= 0:
            return total_bonus, ethics_delta, reputation_delta, notes

        if self.offers_striptease:
            if self.energy >= 1:
                self.energy -= 1
                strip_bonus = max(100, int(base_income * 0.25))
                total_bonus += strip_bonus
                ethics_delta -= 3
                reputation_delta += 1
                notes.append(f"Striptease routine earned an extra ${strip_bonus}.")
            else:
                notes.append("Too exhausted to deliver the striptease routine.")

        if self.performer_type == PerformerType.DANCER and self.dancer_strip_routine:
            if self.energy >= 1:
                self.energy -= 1
                # Scale bonus with combined base plus previous bonus so routines stack naturally
                stripe_base = base_income + total_bonus
                stripe_bonus = max(80, int(stripe_base * 0.18))
                total_bonus += stripe_bonus
                reputation_delta += 1
                ethics_delta -= 1
                notes.append(f"Signature striping wowed the crowd for +${stripe_bonus}.")
            else:
                notes.append("Not enough energy for the striping showcase.")

        if self.offers_private_lounge:
            if self.energy >= 2:
                self.energy = max(0, self.energy - 2)
                lounge_base = base_income + total_bonus
                lounge_bonus = max(160, int(lounge_base * 0.35))
                total_bonus += lounge_bonus
                ethics_delta -= 4
                reputation_delta += 1
                notes.append(
                    f"Private lounge experience brought in an extra ${lounge_bonus}."
                )
            else:
                notes.append("Too drained to host the private lounge experience.")

        if self.after_hours_exclusive:
            if self.energy >= 2:
                self.energy = max(0, self.energy - 2)
                exclusive_base = base_income + total_bonus
                exclusive_bonus = max(240, int(exclusive_base * 0.45))
                total_bonus += exclusive_bonus
                ethics_delta -= 5
                reputation_delta += 2
                notes.append(
                    f"After-hours exclusive captivated VIPs for +${exclusive_bonus}."
                )
            else:
                notes.append("No stamina left for the after-hours exclusive offering.")

        return total_bonus, ethics_delta, reputation_delta, notes


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
    upgrades: Dict[str, int] = None  # upgrade_id -> level
    city_demand: int = 100  # Base demand percentage (affects crowd size)
    genre_trend: Dict[str, int] = None  # performer_type.value -> trend modifier (-20..+20)
    risk_level: str = "standard"  # conservative | standard | bold
    event_cooldowns: Dict[str, int] = None  # event_id -> day_available_again
    event_history: List[str] = None
    last_event_day: int = 0
    
    def __post_init__(self):
        if self.performers is None:
            self.performers = []
        if self.relationships is None:
            self.relationships = {}
        if self.story_flags is None:
            self.story_flags = {}
        if self.completed_events is None:
            self.completed_events = []
        if self.upgrades is None:
            self.upgrades = {}
        if self.genre_trend is None:
            # Initialize neutral trends per performer type
            self.genre_trend = {ptype.value: 0 for ptype in PerformerType}
        if self.event_cooldowns is None:
            self.event_cooldowns = {}
        if self.event_history is None:
            self.event_history = []
        if self.last_event_day is None:
            self.last_event_day = 0


class ClubManager:
    """Main game manager"""
    
    def __init__(self):
        self.state = GameState()
        self.running = True
        self.save_file = "savegame.json"
        self.auto_manager = None  # Initialize automation manager
        # Ensure critical staff roles exist for a functional club
        self.ensure_bouncer(initial=True)
        self.upgrade_catalog = self._build_upgrade_catalog()
        self.promotion_catalog = self._build_promotion_catalog()
        self.event_registry = self._build_event_registry()
        self._register_existing_names()

    def _build_upgrade_catalog(self) -> Dict[str, Dict]:
        """Define available club upgrades.
        Each entry: id -> {name, desc, base_cost, max_level, effects: callable or dict}
        Effects will be applied dynamically; store scalar modifiers here.
        """
        return {
            "sound_system": {
                "name": "Pro Sound System",
                "desc": "Boosts performer income and reduces equipment failure chance.",
                "base_cost": 2500,
                "max_level": 3,
                "income_pct": 0.05,  # per level
                "event_failure_reduction": 0.05  # per level
            },
            "vip_lounge": {
                "name": "VIP Lounge",
                "desc": "Attracts high-roller patrons increasing crowd spending.",
                "base_cost": 4000,
                "max_level": 2,
                "spending_power_pct": 0.10  # per level
            },
            "marketing": {
                "name": "Marketing Hub",
                "desc": "Increases crowd size and reputation gains.",
                "base_cost": 3000,
                "max_level": 3,
                "crowd_size_pct": 0.08,  # per level
                "rep_gain_pct": 0.05  # per level
            },
            "security_suite": {
                "name": "Security Suite",
                "desc": "Further reduces negative event probability.",
                "base_cost": 2000,
                "max_level": 2,
                "event_prob_reduction": 0.07  # per level
            }
        }

    def _build_promotion_catalog(self) -> Dict[str, Dict]:
        """Define promotion tracks for each performer type.
        
        Each promotion level requires:
        - Minimum skill
        - Cost
        - Provides team-wide or individual buffs
        """
        return {
            PerformerType.DANCER.value: [
                {"title": "Choreographer", "skill_req": 6, "cost": 1500, "buff": "team_energy_regen", "desc": "Creates routines, +1 energy regen for all dancers"},
                {"title": "Dance Captain", "skill_req": 8, "cost": 3000, "buff": "crowd_bonus", "desc": "Inspires performances, +8% crowd bonus"},
                {"title": "Artistic Director", "skill_req": 10, "cost": 5000, "buff": "reputation_gain", "desc": "Sets club vision, +2 reputation per night"}
            ],
            PerformerType.SINGER.value: [
                {"title": "Vocal Coach", "skill_req": 6, "cost": 1500, "buff": "training_efficiency", "desc": "Trains others, +50% training effectiveness"},
                {"title": "Headliner", "skill_req": 8, "cost": 3000, "buff": "income_boost", "desc": "Star power, +15% income for all singers"},
                {"title": "Music Director", "skill_req": 10, "cost": 5000, "buff": "event_quality", "desc": "Elevates shows, better event outcomes"}
            ],
            PerformerType.DJ.value: [
                {"title": "Sound Engineer", "skill_req": 6, "cost": 1500, "buff": "equipment_reliability", "desc": "Maintains gear, -30% equipment failures"},
                {"title": "Resident DJ", "skill_req": 8, "cost": 3000, "buff": "mood_boost", "desc": "Vibe master, +1 avg patron mood"},
                {"title": "Festival Curator", "skill_req": 10, "cost": 5000, "buff": "demand_boost", "desc": "Draws crowds, +10% city demand"}
            ],
            PerformerType.BARTENDER.value: [
                {"title": "Mixologist", "skill_req": 6, "cost": 1500, "buff": "spending_power", "desc": "Crafts premium drinks, +10% patron spending"},
                {"title": "Bar Manager", "skill_req": 8, "cost": 3000, "buff": "expense_reduction", "desc": "Efficient ops, -10% daily expenses"},
                {"title": "Hospitality Director", "skill_req": 10, "cost": 5000, "buff": "vip_attraction", "desc": "Attracts high-rollers, more VIPs"}
            ],
            PerformerType.SECURITY.value: [
                {"title": "Head of Security", "skill_req": 6, "cost": 1500, "buff": "conflict_prevention", "desc": "De-escalates issues, -20% conflict events"},
                {"title": "Safety Coordinator", "skill_req": 8, "cost": 3000, "buff": "loyalty_boost", "desc": "Creates safe space, +1 loyalty for all staff"},
                {"title": "Operations Chief", "skill_req": 10, "cost": 5000, "buff": "crisis_mitigation", "desc": "Handles emergencies, better crisis outcomes"}
            ]
        }

    def _build_event_registry(self) -> Dict[str, Dict]:
        """Define all possible random events with metadata for dynamic selection.
        
        Each event has:
        - handler: callable method
        - tags: list of string tags (business, moral, relationship, crisis, opportunity)
        - risk_rating: 1-5 (higher = more intense)
        - cooldown: days before can trigger again
        - prerequisites: dict of checks (min_reputation, min_performers, has_upgrade, etc.)
        - weight: base probability weight (higher = more common)
        """
        return {
            "vip_visitor": {
                "handler": self.event_vip_visitor,
                "tags": ["business", "moral"],
                "risk_rating": 3,
                "cooldown": 14,
                "prerequisites": {"min_reputation": 40},
                "weight": 10
            },
            "equipment_failure": {
                "handler": self.event_equipment_failure,
                "tags": ["crisis", "business"],
                "risk_rating": 2,
                "cooldown": 10,
                "prerequisites": {},
                "weight": 8
            },
            "rival_club": {
                "handler": self.event_rival_club,
                "tags": ["business", "relationship"],
                "risk_rating": 4,
                "cooldown": 21,
                "prerequisites": {"min_performers": 1},
                "weight": 6
            },
            "performer_conflict": {
                "handler": self.event_performer_conflict,
                "tags": ["relationship", "crisis"],
                "risk_rating": 3,
                "cooldown": 14,
                "prerequisites": {"min_performers": 2},
                "weight": 7
            },
            "talent_scout": {
                "handler": self.event_talent_scout,
                "tags": ["opportunity", "business"],
                "risk_rating": 1,
                "cooldown": 20,
                "prerequisites": {"min_reputation": 50},
                "weight": 5
            },
            "health_inspection": {
                "handler": self.event_health_inspection,
                "tags": ["crisis", "business"],
                "risk_rating": 3,
                "cooldown": 30,
                "prerequisites": {},
                "weight": 4
            },
            "media_coverage": {
                "handler": self.event_media_coverage,
                "tags": ["opportunity", "reputation"],
                "risk_rating": 2,
                "cooldown": 15,
                "prerequisites": {"min_reputation": 60},
                "weight": 6
            },
            "performer_breakthrough": {
                "handler": self.event_performer_breakthrough,
                "tags": ["opportunity", "relationship"],
                "risk_rating": 1,
                "cooldown": 25,
                "prerequisites": {"min_performers": 1},
                "weight": 5
            }
        }

    def can_promote(self, performer: Performer) -> Optional[Dict]:
        """Check if performer can be promoted and return next promotion info."""
        ptype_key = performer.performer_type.value if isinstance(performer.performer_type, PerformerType) else str(performer.performer_type)
        track = self.promotion_catalog.get(ptype_key, [])
        
        if performer.promotion_level >= len(track):
            return None  # Already at max
        
        next_promo = track[performer.promotion_level]
        if performer.skill >= next_promo["skill_req"]:
            return next_promo
        return None

    def promote_performer(self, idx: int) -> bool:
        """Attempt to promote a performer."""
        perf_data = self.state.performers[idx]
        perf = Performer(**perf_data)
        
        promo_info = self.can_promote(perf)
        if not promo_info:
            return False
        
        if self.state.money < promo_info["cost"]:
            print(f"\n✗ Promotion costs ${promo_info['cost']}!")
            return False
        
        self.state.money -= promo_info["cost"]
        perf.promotion_level += 1
        self.state.performers[idx] = asdict(perf)
        
        print(f"\n✓ {perf.name} promoted to {promo_info['title']}!")
        print(f"   Buff: {promo_info['desc']}")
        self.state.ethics_score = min(100, self.state.ethics_score + 2)  # Investing in people
        
        return True

    def get_active_buffs(self) -> Dict[str, int]:
        """Aggregate all active promotion buffs across the team."""
        buffs = {}
        for perf_data in self.state.performers:
            perf = Performer(**perf_data)
            if perf.promotion_level == 0:
                continue
            
            ptype_key = perf.performer_type.value if isinstance(perf.performer_type, PerformerType) else str(perf.performer_type)
            track = self.promotion_catalog.get(ptype_key, [])
            
            for level_idx in range(perf.promotion_level):
                if level_idx < len(track):
                    buff_type = track[level_idx]["buff"]
                    buffs[buff_type] = buffs.get(buff_type, 0) + 1
        
        return buffs

    def adjust_weekly_economy(self):
        """Simulate weekly shifts in city demand and genre trends."""
        # Demand drift ±10
        self.state.city_demand = max(60, min(140, self.state.city_demand + random.randint(-10, 10)))
        # Genre trends: each type small random nudge ±5 within -30..+30
        for ptype in PerformerType:
            key = ptype.value
            self.state.genre_trend[key] = max(-30, min(30, self.state.genre_trend[key] + random.randint(-5, 5)))
        
        # Promotion buff: demand_boost from Festival Curator (DJ level 3)
        buffs = self.get_active_buffs()
        if buffs.get("demand_boost", 0) > 0:
            self.state.city_demand = min(140, self.state.city_demand + 5)

    def generate_patrons(self) -> List[Patron]:
        """Create a nightly crowd based on demand, reputation, and upgrades."""
        base_crowd = random.randint(18, 32)
        demand_scale = self.state.city_demand / 100.0
        reputation_scale = 0.6 + (self.state.reputation / 120.0)
        vip_bonus = 1.0 + 0.12 * self.state.upgrades.get("vip_lounge", 0)
        marketing_bonus = 1.0 + 0.15 * self.state.upgrades.get("marketing", 0)
        risk_bonus = {
            "conservative": 0.9,
            "standard": 1.0,
            "bold": 1.08,
        }[self.state.risk_level]

        projected_size = int(base_crowd * demand_scale * reputation_scale * marketing_bonus * risk_bonus)
        projected_size = int(projected_size * vip_bonus)
        crowd_size = max(6, min(120, projected_size))

        archetype_weights = {
            "general": 5.0,
            "high_roller": 1.5 + self.state.upgrades.get("vip_lounge", 0) * 0.9,
            "critic": 1.2 if self.state.reputation > 60 else 0.6,
            "influencer": 1.0 + self.state.upgrades.get("marketing", 0) * 0.8,
            "trendsetter": 1.0 + max(0, self.state.genre_trend.get(PerformerType.DJ.value, 0)) / 25.0,
        }

        archetypes = list(archetype_weights.keys())
        weights = [max(0.1, w) for w in archetype_weights.values()]
        local_names: Set[str] = set()
        patrons: List[Patron] = []

        for _ in range(crowd_size):
            archetype = random.choices(archetypes, weights=weights, k=1)[0]
            full_name = generate_full_name(local_names)

            base_mood = random.randint(5, 8)
            base_spending = random.randint(60, 140)

            if archetype == "high_roller":
                base_mood += random.randint(1, 2)
                base_spending = random.randint(220, 420)
            elif archetype == "critic":
                base_mood = max(4, base_mood - random.randint(1, 2))
                base_spending = random.randint(150, 250)
            elif archetype == "influencer":
                base_mood += 1
                base_spending = random.randint(120, 220)
            elif archetype == "trendsetter":
                base_mood += random.choice([0, 1, 2])
                base_spending = random.randint(130, 240)

            if self.state.upgrades.get("sound_system", 0):
                base_mood += 1

            mood = min(10, base_mood + random.randint(-1, 2))
            spending_power = max(50, base_spending)

            patrons.append(Patron(name=full_name, mood=mood, spending_power=spending_power, archetype=archetype))

        return patrons

    def calculate_crowd_bonus(self, patrons: List[Patron]) -> int:
        """Calculate nightly revenue bonus derived from the current patrons."""
        if not patrons:
            return 0

        total_spending = sum(p.spending_power for p in patrons)
        average_mood = sum(p.mood for p in patrons) / len(patrons)
        demand_factor = self.state.city_demand / 100.0
        vip_bonus = 1.0 + 0.1 * self.state.upgrades.get("vip_lounge", 0)
        marketing_bonus = 1.0 + 0.05 * self.state.upgrades.get("marketing", 0)

        mood_multiplier = 0.08 + (average_mood / 120.0)
        bonus = int(total_spending * mood_multiplier * demand_factor * vip_bonus * marketing_bonus)

        if self.state.risk_level == "bold":
            bonus = int(bonus * 1.1)
        elif self.state.risk_level == "conservative":
            bonus = int(bonus * 0.9)

        buffs = self.get_active_buffs()
        if buffs.get("spending_power", 0) > 0:
            bonus = int(bonus * (1.0 + 0.08 * buffs["spending_power"]))

        return max(0, bonus)

    def set_risk_level(self):
        """Prompt user for nightly risk appetite."""
        print("\nSelect nightly risk level:")
        print("1. Conservative (fewer events, lower bonus)")
        print("2. Standard")
        print("3. Bold (higher bonus, more event risk)")
        choice = input("Choice: ").strip()
        mapping = {"1": "conservative", "2": "standard", "3": "bold"}
        self.state.risk_level = mapping.get(choice, "standard")
        print(f"Risk level set to: {self.state.risk_level}")

    def manage_upgrades(self):
        """Allow purchasing upgrades."""
        print("\n--- CLUB UPGRADES ---")
        for i, (uid, data) in enumerate(self.upgrade_catalog.items(), 1):
            level = self.state.upgrades.get(uid, 0)
            cost = int(data["base_cost"] * (1.5 ** level)) if level < data["max_level"] else None
            status = f"Level {level}/{data['max_level']}"
            if cost is not None:
                status += f" | Cost: ${cost}"
            else:
                status += " | MAXED"
            print(f"{i}. {data['name']} - {status}\n   {data['desc']}")
        print(f"{len(self.upgrade_catalog)+1}. Back")
        choice = input("Select upgrade: ").strip()
        try:
            idx = int(choice) - 1
            if idx == len(self.upgrade_catalog):
                return
            keys = list(self.upgrade_catalog.keys())
            if idx < 0 or idx >= len(keys):
                print("Invalid choice.")
                return
            uid = keys[idx]
            data = self.upgrade_catalog[uid]
            level = self.state.upgrades.get(uid, 0)
            if level >= data["max_level"]:
                print("Already at max level.")
                return
            cost = int(data["base_cost"] * (1.5 ** level))
            if self.state.money < cost:
                print("Not enough funds.")
                return
            self.state.money -= cost
            self.state.upgrades[uid] = level + 1
            print(f"✓ Upgraded {data['name']} to level {level+1}.")
        except ValueError:
            print("Invalid input.")

    def has_bouncer(self) -> bool:
        """Return True if a security performer exists."""
        for p in self.state.performers:
            role = p.get("performer_type")
            if role == "security" or role == PerformerType.SECURITY:
                return True
        return False

    def ensure_bouncer(self, initial: bool = False):
        """Ensure there is at least one SECURITY performer (bouncer).

        If none exists, automatically create one with reasonable defaults.
        When called during init (initial=True), no money is deducted.
        """
        if self.has_bouncer():
            return
        
        name = generate_full_name()
        gender = random.choice(list(Gender))
        traits = random.sample(PERSONALITY_TRAITS, 2)
        bouncer = Performer(
            name=name,
            performer_type=PerformerType.SECURITY,
            gender=gender,
            traits=traits,
            skill=5,
            loyalty=7,
            energy=10,
            salary=120,
            reputation=0,
        )
        self.state.performers.append(asdict(bouncer))
        self.state.relationships[name] = 6
        if not initial:
            # If added mid-game, simulate hiring cost (one week advance)
            self.state.money -= bouncer.salary * 7
        print(f"\n[+] Security hired: {name} (Bouncer)")
        _USED_FULL_NAMES.add(name)
        
    def _register_existing_names(self, reset: bool = False) -> None:
        """Register performer names so generated names remain unique."""
        if reset:
            _USED_FULL_NAMES.clear()
        for performer in self.state.performers:
            name = performer.get("name")
            if name:
                _USED_FULL_NAMES.add(name)

    def save_game(self):
        """Save current game state"""
        performers_serialized = [_serialize_performer_dict(p) for p in self.state.performers]
        save_data = {
            "day": self.state.day,
            "money": self.state.money,
            "reputation": self.state.reputation,
            "ethics_score": self.state.ethics_score,
            "performers": performers_serialized,
            "relationships": self.state.relationships,
            "story_flags": self.state.story_flags,
            "completed_events": self.state.completed_events,
            "upgrades": self.state.upgrades,
            "city_demand": self.state.city_demand,
            "genre_trend": self.state.genre_trend,
            "risk_level": self.state.risk_level,
            "event_cooldowns": self.state.event_cooldowns,
            "event_history": self.state.event_history,
            "last_event_day": self.state.last_event_day,
        }
        save_data["checksum"] = compute_checksum(save_data)

        with open(self.save_file, "w", encoding="utf-8") as f:
            json.dump(save_data, f, indent=2)
        print("\n✓ Game saved successfully!")
    
    def load_game(self) -> bool:
        """Load saved game state"""
        if not os.path.exists(self.save_file):
            return False
        
        try:
            with open(self.save_file, "r", encoding="utf-8") as f:
                save_data = json.load(f)

            checksum = save_data.get("checksum")
            if checksum and checksum != compute_checksum(save_data):
                raise ValueError("Save file integrity check failed")

            self.state.day = save_data['day']
            self.state.money = save_data['money']
            self.state.reputation = save_data['reputation']
            self.state.ethics_score = save_data['ethics_score']
            restored_performers = []
            for record in save_data.get('performers', []):
                performer_dict = _deserialize_performer_dict(record)
                performer_dict.setdefault('promotion_level', 0)
                performer_dict.setdefault('offers_striptease', False)
                performer_dict.setdefault('dancer_strip_routine', False)
                performer_dict.setdefault('offers_private_lounge', False)
                performer_dict.setdefault('after_hours_exclusive', False)
                restored_performers.append(performer_dict)
            self.state.performers = restored_performers
            self.state.upgrades = save_data.get('upgrades', {})
            self.state.city_demand = save_data.get('city_demand', 100)
            self.state.genre_trend = save_data.get('genre_trend', {ptype.value:0 for ptype in PerformerType})
            self.state.risk_level = save_data.get('risk_level', 'standard')
            self.state.event_cooldowns = save_data.get('event_cooldowns', {})
            self.state.event_history = save_data.get('event_history', [])
            self.state.last_event_day = save_data.get('last_event_day', 0)
            self.state.relationships = save_data['relationships']
            self.state.story_flags = save_data['story_flags']
            self.state.completed_events = save_data['completed_events']

            self._register_existing_names(reset=True)
            
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
            
            # Generate random gender identity
            gender = random.choice(list(Gender))
            
            # Generate 2-3 random traits
            num_traits = random.randint(2, 3)
            traits = random.sample(PERSONALITY_TRAITS, num_traits)
            
            name = generate_full_name()
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

            strip_option = "5"
            strip_status = "ON" if perf.offers_striptease else "OFF"
            print(f"{strip_option}. Toggle striptease bookings [{strip_status}]")

            next_option = 6
            stripe_option: Optional[str] = None
            if perf.performer_type == PerformerType.DANCER:
                stripe_option = str(next_option)
                stripe_status = "ON" if perf.dancer_strip_routine else "OFF"
                print(f"{stripe_option}. Toggle signature striping [{stripe_status}]")
                next_option += 1

            private_option = str(next_option)
            private_status = "ON" if perf.offers_private_lounge else "OFF"
            print(f"{private_option}. Toggle private lounge experiences [{private_status}]")
            next_option += 1

            after_hours_option = str(next_option)
            after_hours_status = "ON" if perf.after_hours_exclusive else "OFF"
            print(f"{after_hours_option}. Toggle after-hours exclusives [{after_hours_status}]")
            next_option += 1

            fire_option = str(next_option)
            print(f"{fire_option}. Fire performer")
            next_option += 1

            back_option = str(next_option)
            print(f"{back_option}. Back")
            
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
            
            elif action == strip_option:
                current_rel = self.state.relationships.get(perf.name, 5)
                if not perf.offers_striptease:
                    if current_rel < 6 or perf.loyalty < 6:
                        print("\n✗ They need more trust before agreeing to that routine.")
                        continue
                    perf.offers_striptease = True
                    self.state.ethics_score = max(0, self.state.ethics_score - 2)
                    self.state.reputation = min(100, self.state.reputation + 1)
                    print(f"\n✓ {perf.name} adds a tasteful striptease set to their bookings.")
                else:
                    perf.offers_striptease = False
                    perf.dancer_strip_routine = False
                    perf.offers_private_lounge = False
                    perf.after_hours_exclusive = False
                    print(f"\n✓ {perf.name} retires the striptease routine for now.")

            elif stripe_option and action == stripe_option:
                if not perf.offers_striptease:
                    print("\n✗ Enable striptease bookings first before planning striping effects.")
                    continue
                if not perf.dancer_strip_routine:
                    perf.dancer_strip_routine = True
                    self.state.ethics_score = max(0, self.state.ethics_score - 1)
                    self.state.reputation = min(100, self.state.reputation + 1)
                    print(f"\n✓ {perf.name} debuts an artistic striping showcase for the dance floor.")
                else:
                    perf.dancer_strip_routine = False
                    print(f"\n✓ {perf.name} shelves the striping showcase for now.")

            elif action == private_option:
                current_rel = self.state.relationships.get(perf.name, 5)
                if not perf.offers_striptease:
                    print("\n✗ Offer striptease bookings before introducing private lounge sessions.")
                    continue
                if not perf.offers_private_lounge:
                    if current_rel < 7 or perf.loyalty < 7:
                        print("\n✗ Build more trust before arranging private lounge experiences.")
                        continue
                    perf.offers_private_lounge = True
                    self.state.ethics_score = max(0, self.state.ethics_score - 3)
                    self.state.reputation = min(100, self.state.reputation + 1)
                    print(f"\n✓ {perf.name} now hosts intimate private lounge sessions for select patrons.")
                else:
                    perf.offers_private_lounge = False
                    perf.after_hours_exclusive = False
                    print(f"\n✓ {perf.name} steps back from private lounge work.")

            elif action == after_hours_option:
                current_rel = self.state.relationships.get(perf.name, 5)
                if not perf.offers_private_lounge:
                    print("\n✗ Enable private lounge experiences before arranging after-hours exclusives.")
                    continue
                if not perf.after_hours_exclusive:
                    if current_rel < 8 or perf.loyalty < 8:
                        print("\n✗ They need the highest confidence in you before committing to that offering.")
                        continue
                    perf.after_hours_exclusive = True
                    self.state.ethics_score = max(0, self.state.ethics_score - 4)
                    self.state.reputation = min(100, self.state.reputation + 2)
                    print(f"\n✓ {perf.name} agrees to limited after-hours exclusives for VIP clients.")
                else:
                    perf.after_hours_exclusive = False
                    print(f"\n✓ {perf.name} sticks to the standard sets and winds down earlier.")

            elif action == fire_option:
                confirm = input(f"\nAre you sure you want to fire {perf.name}? (y/n): ").strip().lower()
                if confirm == 'y':
                    self.state.performers.pop(idx)
                    del self.state.relationships[perf.name]
                    print(f"\n✓ {perf.name} has been let go.")
                    self.state.ethics_score = max(0, self.state.ethics_score - 5)
                    return
            
            elif action == back_option:
                # Save changes back
                self.state.performers[idx] = asdict(perf)
                return
            else:
                print("Invalid input!")
            
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
        music_playing = False
        dancers_for_privates: List[int] = []
        
        for idx, perf_data in enumerate(self.state.performers):
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

                if perf.performer_type == PerformerType.DJ:
                    music_playing = True
                if perf.performer_type == PerformerType.DANCER:
                    dancers_for_privates.append(idx)

                sensual_bonus, ethics_delta, reputation_delta, notes = perf.perform_sensual_show(income)
                if sensual_bonus:
                    income += sensual_bonus
                if ethics_delta:
                    self.state.ethics_score = max(0, min(100, self.state.ethics_score + ethics_delta))
                if reputation_delta:
                    self.state.reputation = max(0, min(100, self.state.reputation + reputation_delta))

                total_income += income
                print(f"✓ {perf.name} ({perf.gender.value}) performed well! Income: ${income}{trait_msg}")
                for note in notes:
                    print(f"   {note}")
            else:
                print(f"✗ {perf.name} ({perf.gender.value}) was too tired to perform.")
            
            # Update performer data
            self.state.performers[idx] = asdict(perf)

        if music_playing and dancers_for_privates:
            private_revenue = self._process_private_dances(dancers_for_privates)
            if private_revenue:
                total_income += private_revenue

        # Random event chance with bouncer mitigation
        base_event_prob = 0.3
        if self.has_bouncer():
            base_event_prob = max(0.1, base_event_prob - 0.1)
        risk_mod = {"conservative": -0.12, "standard": 0.0, "bold": 0.10}[self.state.risk_level]
        sec_lvl = self.state.upgrades.get("security_suite", 0)
        sec_reduction = sec_lvl * self.upgrade_catalog["security_suite"]["event_prob_reduction"]
        days_since_last = self.state.day - self.state.last_event_day if self.state.last_event_day else self.state.day
        drought_bonus = min(0.25, max(0, days_since_last - 1) * 0.04)
        event_prob = base_event_prob + risk_mod - sec_reduction + drought_bonus
        event_prob = max(0.05, min(0.9, event_prob))
        if random.random() < event_prob:
            if self.trigger_random_event():
                if self.state.risk_level == "bold" and random.random() < 0.35:
                    self.trigger_random_event(chain_depth=1)
        
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
    
    def _process_private_dances(
        self,
        dancer_indices: List[int],
        prefix: str = "",
        rng: Optional[random.Random] = None,
    ) -> int:
        """Handle private dance revenue for dancers when music is playing."""
        if not dancer_indices:
            return 0

        tag = f"{prefix} " if prefix else ""
        crowd_factor = max(1, self.state.city_demand // 90)
        crowd_factor += max(0, (self.state.reputation - 40) // 20)

        if crowd_factor <= 0:
            return 0

        rand = rng.random if rng is not None else random.random
        has_bouncer = self.has_bouncer()
        security_level = self.state.upgrades.get("security_suite", 0)
        bounce_chance = min(0.9, 0.65 + 0.08 * security_level) if has_bouncer else 0.0
        touch_probability = 0.18

        total_dances = 0
        summaries: List[str] = []

        for idx in dancer_indices:
            dancer = Performer(**self.state.performers[idx])
            if dancer.energy <= 0:
                continue

            skill_bonus = max(0, dancer.skill - 5) // 3
            loyalty_bonus = max(0, dancer.loyalty - 6) // 3
            max_dances = min(4, crowd_factor + skill_bonus + loyalty_bonus)
            max_dances = min(max_dances, dancer.energy)

            if max_dances <= 0:
                continue

            success_dances = 0
            touch_incidents = 0
            ejected = False
            attempts = 0

            while attempts < max_dances and dancer.energy > 0:
                dancer.energy -= 1
                attempts += 1
                success_dances += 1

                if rand() < touch_probability:
                    touch_incidents += 1
                    if has_bouncer and rand() < bounce_chance:
                        success_dances -= 1
                        ejected = True
                        self.state.reputation = max(0, self.state.reputation - 1)
                        print(
                            f"{tag}🚨 Bouncer intervened during {dancer.name}'s private dance and escorted the patron out."
                        )
                        break
                    penalty = 1 if has_bouncer else 2
                    self.state.ethics_score = max(0, self.state.ethics_score - penalty)

            self.state.performers[idx] = asdict(dancer)

            if success_dances > 0:
                total_dances += success_dances
                summary = (
                    f"♪ {dancer.name} sold {success_dances} private dance"
                    f"{'s' if success_dances != 1 else ''}."
                )
                if touch_incidents and not ejected:
                    summary += f" ({touch_incidents} boundary warning{'s' if touch_incidents != 1 else ''} issued.)"
                summaries.append(summary)
            if ejected and success_dances == 0:
                summaries.append(
                    f"⚠ {dancer.name}'s private set ended early after a boundary breach."
                )
            elif ejected and success_dances > 0:
                summaries.append(
                    f"⚠ {dancer.name}'s private set wrapped early after a boundary breach."
                )

        if total_dances == 0:
            return 0

        revenue = total_dances * 20
        for line in summaries:
            print(f"{tag}{line}")
        print(f"{tag}💸 Private dances revenue: {total_dances} x $20 = ${revenue}")
        return revenue

    def _event_meets_prerequisites(self, event_id: str, meta: Dict, chain_depth: int) -> bool:
        cooldown_until = self.state.event_cooldowns.get(event_id, 0)
        if self.state.day < cooldown_until:
            return False

        prereqs = meta.get("prerequisites", {})
        if prereqs.get("min_reputation") and self.state.reputation < prereqs["min_reputation"]:
            return False
        if prereqs.get("min_performers") and len(self.state.performers) < prereqs["min_performers"]:
            return False
        if prereqs.get("has_upgrade") and self.state.upgrades.get(prereqs["has_upgrade"], 0) == 0:
            return False
        if prereqs.get("min_ethics") and self.state.ethics_score < prereqs["min_ethics"]:
            return False

        if chain_depth > 0 and meta.get("risk_rating", 3) >= 5:
            return False

        return True

    def _compute_event_weight(self, event_id: str, meta: Dict, buffs: Dict[str, int], chain_depth: int) -> float:
        weight = float(meta.get("weight", 1.0))
        if weight <= 0:
            return 0.0

        risk_rating = meta.get("risk_rating", 3)
        risk_level = self.state.risk_level
        if risk_level == "bold":
            weight *= 1.0 + 0.2 * (risk_rating - 3)
        elif risk_level == "conservative":
            if risk_rating > 3:
                weight *= max(0.25, 1.0 - 0.25 * (risk_rating - 3))
            else:
                weight *= 1.05

        if chain_depth > 0:
            weight *= max(0.35, 0.8 - 0.1 * chain_depth)
            if risk_rating >= 4:
                weight *= 0.6

        tags = meta.get("tags", [])
        money = self.state.money

        if "business" in tags:
            if money < 2000:
                weight *= 1.3
            elif money > 10000:
                weight *= 0.8

        if "moral" in tags:
            if self.state.ethics_score < 45:
                weight *= 1.25
            elif self.state.ethics_score > 75:
                weight *= 0.85

        if "crisis" in tags:
            rep_gap = max(0, 60 - self.state.reputation)
            weight *= 1.0 + rep_gap / 150.0
            sec_lvl = self.state.upgrades.get("security_suite", 0)
            if sec_lvl:
                weight *= max(0.35, 1.0 - 0.12 * sec_lvl)
            if buffs.get("conflict_prevention", 0):
                weight *= 0.7

        if "opportunity" in tags:
            weight *= 1.0 + self.state.reputation / 160.0
            if self.state.upgrades.get("marketing", 0) > 0:
                weight *= 1.1

        if "relationship" in tags:
            if len(self.state.performers) <= 1:
                weight *= 0.3
            if buffs.get("loyalty_boost", 0):
                weight *= 0.85

        if self.state.event_history:
            if event_id == self.state.event_history[-1]:
                weight *= 0.2
            recent = self.state.event_history[-3:]
            if event_id in recent:
                weight *= 0.4
            occurrences = self.state.event_history.count(event_id)
            if occurrences:
                weight *= max(0.25, 1.0 - 0.1 * occurrences)

        days_since = self.state.day - self.state.last_event_day if self.state.last_event_day else self.state.day
        weight *= 1.0 + min(0.5, max(0, days_since - 1) * 0.05)

        weight *= random.uniform(0.85, 1.15)
        return max(0.0, weight)

    def _build_event_pool(self, buffs: Dict[str, int], chain_depth: int) -> List[Tuple[str, Dict, float]]:
        pool: List[Tuple[str, Dict, float]] = []
        for event_id, meta in self.event_registry.items():
            if not self._event_meets_prerequisites(event_id, meta, chain_depth):
                continue
            weight = self._compute_event_weight(event_id, meta, buffs, chain_depth)
            if weight > 0:
                pool.append((event_id, meta, weight))
        return pool

    def _generate_event_context(self, event_id: str, meta: Dict, chain_depth: int) -> Dict:
        days_since = self.state.day - self.state.last_event_day if self.state.last_event_day else self.state.day
        risk_scale = {"conservative": 0.88, "standard": 1.0, "bold": 1.18}[self.state.risk_level]
        intensity = random.uniform(0.85, 1.15) * risk_scale
        intensity *= max(0.7, 1.0 - 0.12 * chain_depth)
        intensity = round(intensity, 2)
        if intensity < 0.92:
            severity = "low"
        elif intensity > 1.08:
            severity = "high"
        else:
            severity = "medium"
        return {
            "id": event_id,
            "tags": list(meta.get("tags", [])),
            "risk_rating": meta.get("risk_rating", 3),
            "intensity": intensity,
            "severity": severity,
            "chain_depth": chain_depth,
            "days_since_last_event": days_since,
            "variant_seed": random.randint(1, 9999),
            "club_money": self.state.money,
            "reputation": self.state.reputation,
            "ethics": self.state.ethics_score,
            "city_demand": self.state.city_demand
        }

    def trigger_random_event(self, chain_depth: int = 0) -> bool:
        """Trigger a random event using the event registry system."""
        buffs = self.get_active_buffs()
        event_pool = self._build_event_pool(buffs, chain_depth)
        if not event_pool:
            return False

        weights = [item[2] for item in event_pool]
        selection_index = random.choices(range(len(event_pool)), weights=weights, k=1)[0]
        selected_id, selected_meta, _ = event_pool[selection_index]

        cooldown_days = selected_meta.get("cooldown", 7)
        self.state.event_cooldowns[selected_id] = self.state.day + cooldown_days

        if selected_id not in self.state.completed_events:
            self.state.completed_events.append(selected_id)

        context = self._generate_event_context(selected_id, selected_meta, chain_depth)
        selected_meta["handler"](context)

        self.state.last_event_day = self.state.day
        self.state.event_history.append(selected_id)
        if len(self.state.event_history) > MAX_EVENT_HISTORY:
            self.state.event_history = self.state.event_history[-MAX_EVENT_HISTORY:]
        return True
    
    def event_vip_visitor(self, context: Dict):
        """A VIP visitor arrives"""
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        high_offer = max(700, int(random.randint(1700, 2600) * intensity))
        alt_offer = max(350, int(random.randint(600, 1100) * (0.9 + 0.1 * intensity)))
        ethics_penalty = random.randint(8, 12)
        ethics_alt_gain = random.randint(4, 6)
        ethics_decline_gain = random.randint(1, 3)
        rep_gain_high = random.randint(3, 6)
        rep_gain_alt = random.randint(2, 4)

        print("\n🌟 --- SPECIAL EVENT: VIP VISITOR --- 🌟")
        print("A wealthy patron has arrived at your club!")
        print("They're impressed and want to make a private booking.")
        print(f"\nThe request feels {severity.upper()} tonight.")
        
        print(f"\n1. Accept the booking (+${high_offer}, -{ethics_penalty} ethics)")
        print("2. Politely decline (small ethics boost)")
        print(f"3. Offer an ethical alternative (+${alt_offer}, +{ethics_alt_gain} ethics)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            self.state.money += high_offer
            self.state.ethics_score = max(0, self.state.ethics_score - ethics_penalty)
            self.state.reputation = min(100, self.state.reputation + rep_gain_high)
            print("\n✓ You accepted. Money gained, but at what cost?")
        elif choice == '2':
            print("\n✓ You maintained your principles.")
            self.state.ethics_score = min(100, self.state.ethics_score + ethics_decline_gain)
        elif choice == '3':
            self.state.money += alt_offer
            self.state.ethics_score = min(100, self.state.ethics_score + ethics_alt_gain)
            self.state.reputation = min(100, self.state.reputation + rep_gain_alt)
            print("\n✓ A wise compromise! They accepted your alternative.")
        
        input("\nPress Enter to continue...")
    
    def event_equipment_failure(self, context: Dict):
        """Equipment breaks down"""
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        print("\n⚠️ --- EVENT: EQUIPMENT FAILURE --- ⚠️")
        print("Your sound system has failed mid-performance!")
        print(f"Severity assessment: {severity.capitalize()}.")
        
        ss_lvl = self.state.upgrades.get("sound_system", 0)
        base_cost = random.randint(420, 680)
        repair_cost = max(100, int(base_cost * intensity))
        if ss_lvl:
            repair_cost = max(80, int(repair_cost * (1.0 - 0.15 * ss_lvl)))
        cancel_rep_loss = max(5, int(8 * intensity))
        continue_rep_loss = max(3, int(5 * intensity))
        continue_ethics_loss = max(2, int(3 * intensity))
        cancel_ethics_gain = random.randint(3, 6)
        repair_ethics_gain = random.randint(2, 4)
        
        print(f"\n1. Pay for immediate repair (${repair_cost})")
        print(f"2. Cancel the night (refund customers, -{cancel_rep_loss} reputation, +{cancel_ethics_gain} ethics)")
        print(f"3. Continue without sound (-{continue_rep_loss} reputation, -{continue_ethics_loss} ethics)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            if self.state.money >= repair_cost:
                self.state.money -= repair_cost
                self.state.ethics_score = min(100, self.state.ethics_score + repair_ethics_gain)
                print("\n✓ Equipment repaired! The show goes on.")
            else:
                print("\n✗ Not enough money! Forced to cancel.")
                self.state.reputation = max(0, self.state.reputation - cancel_rep_loss)
        elif choice == '2':
            self.state.reputation = max(0, self.state.reputation - cancel_rep_loss)
            self.state.ethics_score = min(100, self.state.ethics_score + cancel_ethics_gain)
            print("\n✓ Customers appreciate your honesty.")
        elif choice == '3':
            self.state.reputation = max(0, self.state.reputation - continue_rep_loss)
            self.state.ethics_score = max(0, self.state.ethics_score - continue_ethics_loss)
            print("\n✓ The night continues, but customers are disappointed.")
        
        input("\nPress Enter to continue...")
    
    def event_talent_scout(self, context: Dict):
        """A talent scout is interested in one of your performers."""
        if not self.state.performers:
            return
        
        print("\n🎬 --- EVENT: TALENT SCOUT --- 🎬")
        target = random.choice(self.state.performers)
        perf = Performer(**target)
        intensity = context.get("intensity", 1.0)
        base_offer = perf.skill * 750 + random.randint(400, 1400)
        offer = max(600, int(base_offer * intensity))
        downtime = max(2, int(round(3 * intensity)))
        rep_gain = random.randint(2, 5)
        ethics_gain = random.randint(2, 4)
        
        print(f"A talent scout wants to hire {perf.name} for an external gig!")
        print(f"They're offering ${offer} but {perf.name} will be unavailable for {downtime} days.")
        
        print("\n1. Accept the offer (gain money, lose performer temporarily)")
        print("2. Decline to keep your roster intact")
        print("3. Negotiate for a better deal (requires relationship > 7)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            self.state.money += offer
            perf.energy = max(0, perf.energy - downtime)
            idx = self.state.performers.index(target)
            self.state.performers[idx] = asdict(perf)
            self.state.reputation = min(100, self.state.reputation + rep_gain)
            print(f"\n✓ {perf.name} takes the gig. Money earned and reputation boosted!")
        elif choice == '2':
            perf.loyalty = min(10, perf.loyalty + 1)
            idx = self.state.performers.index(target)
            self.state.performers[idx] = asdict(perf)
            print(f"\n✓ {perf.name} appreciates your loyalty.")
            self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
        elif choice == '3':
            if self.state.relationships.get(perf.name, 0) > 7:
                bonus_multiplier = 1.25 + max(-0.1, (intensity - 1.0) * 0.2)
                better_offer = int(offer * bonus_multiplier)
                self.state.money += better_offer
                perf.energy = max(0, perf.energy - max(1, downtime - 1))
                idx = self.state.performers.index(target)
                self.state.performers[idx] = asdict(perf)
                self.state.reputation = min(100, self.state.reputation + rep_gain + 1)
                print(f"\n✓ Negotiation successful! Earned ${better_offer} with shorter absence.")
            else:
                print(f"\n✗ {perf.name} doesn't trust you enough for negotiations. Offer declined.")
        
        input("\nPress Enter to continue...")
    
    def event_health_inspection(self, context: Dict):
        """Health inspector shows up unannounced."""
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        print("\n🏥 --- EVENT: HEALTH INSPECTION --- 🏥")
        print("A city health inspector has arrived for a surprise inspection!")
        print(f"Inspection intensity: {severity.capitalize()}.")
        
        # Base pass chance
        pass_chance = 0.6 - (intensity - 1.0) * 0.2
        
        # VIP lounge upgrade helps
        vip_lvl = self.state.upgrades.get("vip_lounge", 0)
        if vip_lvl > 0:
            pass_chance += 0.15 * vip_lvl
        
        # Ethics score influences
        if self.state.ethics_score > 70:
            pass_chance += 0.15
        elif self.state.ethics_score < 40:
            pass_chance -= 0.15

        pass_chance = max(0.1, min(0.95, pass_chance))
        
        passed = random.random() < pass_chance
        
        if passed:
            print("\n✓ Your club passes with flying colors!")
            self.state.reputation = min(100, self.state.reputation + 5)
            self.state.ethics_score = min(100, self.state.ethics_score + 3)
        else:
            print("\n✗ The inspector found violations!")
            fine = max(500, int(random.randint(800, 1500) * (0.9 + intensity * 0.2)))
            print(f"Fine: ${fine}")
            print("\n1. Pay the fine")
            print("2. Contest it (risks reputation)")
            
            choice = input("\nYour decision: ").strip()
            
            if choice == '1':
                self.state.money -= fine
                self.state.reputation = max(0, self.state.reputation - 3)
                print("\n✓ Fine paid. Work on improvements.")
            elif choice == '2':
                contest_success = max(0.15, min(0.5, 0.35 - (intensity - 1.0) * 0.1))
                if random.random() < contest_success:
                    print("\n✓ You successfully contested! No fine.")
                    self.state.ethics_score = min(100, self.state.ethics_score + 5)
                else:
                    self.state.money -= int(fine * 1.5)
                    self.state.reputation = max(0, self.state.reputation - 8)
                    print("\n✗ Contest failed. Fine increased and reputation damaged.")
        
        input("\nPress Enter to continue...")
    
    def event_media_coverage(self, context: Dict):
        """Media wants to cover your club."""
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        print("\n📰 --- EVENT: MEDIA COVERAGE --- 📰")
        print("A local media outlet wants to feature your club!")
        print(f"Media interest level: {severity.capitalize()}.")
        
        print("\n1. Accept interview (exposure, but reveals details)")
        print("2. Decline politely")
        exclusive_cost = max(300, int(500 * (0.9 + 0.1 * intensity)))
        print(f"3. Offer exclusive VIP night for journalists (costs ${exclusive_cost})")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            rep_gain = max(5, int(random.randint(8, 15) * (0.9 + 0.15 * intensity)))
            self.state.reputation = min(100, self.state.reputation + rep_gain)
            print(f"\n✓ Great coverage! Reputation +{rep_gain}")
            
            # Chance of ethics scrutiny
            if self.state.ethics_score < 50:
                print("⚠️ However, some ethical concerns were raised...")
                self.state.ethics_score = max(0, self.state.ethics_score - 5)
        elif choice == '2':
            print("\n✓ You maintain privacy.")
        elif choice == '3':
            if self.state.money >= exclusive_cost:
                self.state.money -= exclusive_cost
                rep_gain = max(8, int(random.randint(12, 20) * (0.95 + 0.1 * intensity)))
                ethics_gain = random.randint(4, 6)
                self.state.reputation = min(100, self.state.reputation + rep_gain)
                self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
                print(f"\n✓ Exclusive event was a hit! Reputation +{rep_gain}")
            else:
                print("\n✗ Not enough money for exclusive event.")
        
        input("\nPress Enter to continue...")
    
    def event_performer_breakthrough(self, context: Dict):
        """One of your performers has a major breakthrough."""
        if not self.state.performers:
            return
        
        print("\n⭐ --- EVENT: PERFORMER BREAKTHROUGH --- ⭐")
        target = random.choice(self.state.performers)
        perf = Performer(**target)
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        
        print(f"{perf.name} has achieved a creative breakthrough!")
        print(f"They've developed a new signature style ({severity} impact).")
        
        skill_gain = 1
        loyalty_gain = 1
        if intensity > 1.1:
            skill_gain = 3
            loyalty_gain = 2
        elif intensity > 0.95:
            skill_gain = 2
            loyalty_gain = 2
        perf.skill = min(10, perf.skill + skill_gain)
        perf.loyalty = min(10, perf.loyalty + loyalty_gain)
        self.state.relationships[perf.name] = min(10, self.state.relationships.get(perf.name, 5) + loyalty_gain)
        
        idx = self.state.performers.index(target)
        self.state.performers[idx] = asdict(perf)
        
        self.state.reputation = min(100, self.state.reputation + 5 + max(0, skill_gain - 2))
        
        print(f"\n✓ {perf.name}'s skill increased to {perf.skill}/10!")
        print("Their loyalty and your relationship also improved.")
        print("Club reputation has grown from their innovation!")
        
        input("\nPress Enter to continue...")
    
    def event_rival_club(self, context: Dict):
        """Rival club tries to poach performers"""
        if not self.state.performers:
            return
        
        print("\n🎯 --- EVENT: RIVAL CLUB --- 🎯")
        target = random.choice(self.state.performers)
        perf = Performer(**target)
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        raise_amount = max(120, int(random.randint(150, 280) * intensity))
        
        print(f"A rival club is trying to poach {perf.name}!")
        print(f"They're offering ${perf.salary + raise_amount}/day ({severity} pressure).")
        
        print(f"\n1. Match their offer (+${raise_amount}/day salary)")
        print("2. Let them go (lose performer)")
        print("3. Appeal to loyalty (requires relationship > 7)")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            perf.salary += raise_amount
            idx = self.state.performers.index(target)
            self.state.performers[idx] = asdict(perf)
            print(f"\n✓ {perf.name} stays! Salary increased.")
        elif choice == '2':
            self.state.performers.remove(target)
            del self.state.relationships[perf.name]
            print(f"\n✗ {perf.name} has left for the rival club.")
        elif choice == '3':
            loyalty_threshold = 7 + (1 if intensity > 1.1 else 0)
            loyalty_gain = 2 if intensity < 1.05 else 1
            current_rel = self.state.relationships.get(perf.name, 0)
            if current_rel > loyalty_threshold:
                perf.loyalty = min(10, perf.loyalty + loyalty_gain)
                idx = self.state.performers.index(target)
                self.state.performers[idx] = asdict(perf)
                self.state.relationships[perf.name] = min(10, current_rel + loyalty_gain)
                print(f"\n✓ {perf.name} chooses to stay loyal to you!")
                self.state.ethics_score = min(100, self.state.ethics_score + 3)
            else:
                self.state.performers.remove(target)
                del self.state.relationships[perf.name]
                print(f"\n✗ {perf.name} doesn't feel loyal enough to stay.")
        
        input("\nPress Enter to continue...")
    
    def event_performer_conflict(self, context: Dict):
        """Two performers have a conflict"""
        if len(self.state.performers) < 2:
            return
        
        print("\n⚡ --- EVENT: PERFORMER CONFLICT --- ⚡")
        perf1_data, perf2_data = random.sample(self.state.performers, 2)
        perf1 = Performer(**perf1_data)
        perf2 = Performer(**perf2_data)
        intensity = context.get("intensity", 1.0)
        severity = context.get("severity", "medium")
        penalty = 2 if intensity > 0.95 else 1
        reward = penalty + (1 if intensity > 1.1 else 0)
        
        print(f"{perf1.name} and {perf2.name} are having a heated argument!")
        print(f"The conflict is affecting the club atmosphere ({severity} severity).")
        
        print("\n1. Side with " + perf1.name)
        print("2. Side with " + perf2.name)
        print("3. Mediate and find middle ground")
        print("4. Fire both to set an example")
        
        choice = input("\nYour decision: ").strip()
        
        if choice == '1':
            self.state.relationships[perf1.name] = min(10, 
                self.state.relationships[perf1.name] + reward)
            self.state.relationships[perf2.name] = max(1, 
                self.state.relationships[perf2.name] - penalty)
            print(f"\n✓ You sided with {perf1.name}. {perf2.name} is upset.")
        elif choice == '2':
            self.state.relationships[perf2.name] = min(10, 
                self.state.relationships[perf2.name] + reward)
            self.state.relationships[perf1.name] = max(1, 
                self.state.relationships[perf1.name] - penalty)
            print(f"\n✓ You sided with {perf2.name}. {perf1.name} is upset.")
        elif choice == '3':
            self.state.relationships[perf1.name] = min(10, 
                self.state.relationships[perf1.name] + max(1, reward - 1))
            self.state.relationships[perf2.name] = min(10, 
                self.state.relationships[perf2.name] + max(1, reward - 1))
            ethics_gain = 5 + (1 if intensity < 0.9 else 0)
            self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
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
    
    def automation_menu(self):
        """Automation management menu"""
        try:
            from auto_manager import create_auto_manager, AutomationLevel, AutomationStrategy
        except ImportError:
            print("\n✗ Automation module not available!")
            input("Press Enter to continue...")
            return
        
        if not hasattr(self, 'auto_manager') or self.auto_manager is None:
            print("\n--- AUTOMATION SETUP ---")
            print("Available automation levels:")
            levels = list(AutomationLevel)
            for i, level in enumerate(levels, 1):
                descriptions = {
                    AutomationLevel.NONE: "Manual control only",
                    AutomationLevel.BASIC: "Basic staff management",
                    AutomationLevel.MODERATE: "Staff + recruitment + upgrades",
                    AutomationLevel.ADVANCED: "All features + strategic decisions",
                    AutomationLevel.FULL: "Complete automation"
                }
                print(f"  {i}. {level.value.title()} - {descriptions[level]}")
            
            while True:
                try:
                    choice = int(input("\nSelect automation level (1-5): "))
                    if 1 <= choice <= len(levels):
                        selected_level = levels[choice - 1]
                        break
                    else:
                        print("Invalid choice.")
                except ValueError:
                    print("Please enter a number.")
            
            print("\nAvailable strategies:")
            strategies = list(AutomationStrategy)
            for i, strategy in enumerate(strategies, 1):
                descriptions = {
                    AutomationStrategy.BALANCED: "Balance all aspects",
                    AutomationStrategy.PROFIT: "Focus on money generation",
                    AutomationStrategy.ETHICS: "Prioritize ethical choices",
                    AutomationStrategy.GROWTH: "Focus on expansion",
                    AutomationStrategy.REPUTATION: "Maximize reputation"
                }
                print(f"  {i}. {strategy.value.title()} - {descriptions[strategy]}")
            
            while True:
                try:
                    choice = int(input("\nSelect strategy (1-5): "))
                    if 1 <= choice <= len(strategies):
                        selected_strategy = strategies[choice - 1]
                        break
                    else:
                        print("Invalid choice.")
                except ValueError:
                    print("Please enter a number.")
            
            self.auto_manager = create_auto_manager(
                club_manager=self,
                level_name=selected_level.value,
                strategy_name=selected_strategy.value
            )
            print(f"\n✓ Automation configured: {selected_level.value} level, {selected_strategy.value} strategy")
        
        while True:
            print("\n--- AUTOMATION MANAGER ---")
            print(f"Current Level: {self.auto_manager.automation_level.value}")
            print(f"Current Strategy: {self.auto_manager.strategy.value}")
            print(f"Decisions Made: {self.auto_manager.auto_decisions}")
            
            print("\n1. Run Single Automated Turn")
            print("2. Run Multiple Turns")
            print("3. Change Automation Level")
            print("4. Change Strategy")
            print("5. View Automation Report")
            print("6. Disable Automation")
            print("7. Back to Main Menu")
            
            choice = input("\nChoose action: ").strip()
            
            if choice == '1':
                print("\nRunning automated turn...")
                actions = self.auto_manager.auto_manage_turn()
                
                print("\n--- AUTOMATION RESULTS ---")
                if actions["staff_actions"]:
                    print("Staff Actions:")
                    for action in actions["staff_actions"]:
                        print(f"  • {action}")
                
                if actions["recruitment"]:
                    print("Recruitment:")
                    for action in actions["recruitment"]:
                        print(f"  • {action}")
                
                if actions["upgrades"]:
                    print("Upgrades:")
                    for action in actions["upgrades"]:
                        print(f"  • {action}")
                
                if actions["strategic_decisions"]:
                    print("Strategic Decisions:")
                    for action in actions["strategic_decisions"]:
                        print(f"  • {action}")
                
                if actions["decisions_made"] == 0:
                    print("No automated actions taken this turn.")
                else:
                    print(f"\nTotal decisions made: {actions['decisions_made']}")
                
                input("\nPress Enter to continue...")
            
            elif choice == '2':
                while True:
                    try:
                        turns = int(input("How many turns to run? (1-20): "))
                        if 1 <= turns <= 20:
                            break
                        else:
                            print("Please enter 1-20.")
                    except ValueError:
                        print("Please enter a number.")
                
                print(f"\nRunning {turns} automated turns...")
                results = self.auto_manager.simulate_multiple_turns(turns)
                
                print("\n--- SIMULATION RESULTS ---")
                for result in results:
                    print(f"Turn {result['turn']}: ${result['money']} | "
                          f"Rep: {result['reputation']} | "
                          f"Staff: {result['performers']} | "
                          f"Actions: {result['actions']['decisions_made']}")
                
                input("\nPress Enter to continue...")
            
            elif choice == '3':
                levels = list(AutomationLevel)
                print("\nSelect new automation level:")
                for i, level in enumerate(levels, 1):
                    print(f"  {i}. {level.value.title()}")
                
                try:
                    choice_idx = int(input("Choice: ")) - 1
                    if 0 <= choice_idx < len(levels):
                        self.auto_manager.set_automation_level(levels[choice_idx])
                        print(f"✓ Automation level changed to {levels[choice_idx].value}")
                    else:
                        print("Invalid choice.")
                except ValueError:
                    print("Invalid input.")
                
                input("Press Enter to continue...")
            
            elif choice == '4':
                strategies = list(AutomationStrategy)
                print("\nSelect new strategy:")
                for i, strategy in enumerate(strategies, 1):
                    print(f"  {i}. {strategy.value.title()}")
                
                try:
                    choice_idx = int(input("Choice: ")) - 1
                    if 0 <= choice_idx < len(strategies):
                        self.auto_manager.set_strategy(strategies[choice_idx])
                        print(f"✓ Strategy changed to {strategies[choice_idx].value}")
                    else:
                        print("Invalid choice.")
                except ValueError:
                    print("Invalid input.")
                
                input("Press Enter to continue...")
            
            elif choice == '5':
                report = self.auto_manager.get_automation_report()
                print("\n--- AUTOMATION REPORT ---")
                for key, value in report.items():
                    print(f"{key.replace('_', ' ').title()}: {value}")
                
                input("\nPress Enter to continue...")
            
            elif choice == '6':
                confirm = input("Disable automation? (y/n): ").strip().lower()
                if confirm == 'y':
                    self.auto_manager = None
                    print("✓ Automation disabled.")
                    return
            
            elif choice == '7':
                return
    
    def main_menu(self):
        """Display main game menu"""
        while self.running:
            self.display_header()
            
            print("1. Recruit Performer")
            print("2. Manage Performers")
            print("3. Run Club Night")
            print("4. Manage Upgrades")
            print("5. Advance Day")
            print("6. View Statistics")
            print("7. Automation Manager")
            print("8. Save Game")
            print("9. Exit Game")
            
            choice = input("\nChoose an action: ").strip()
            
            if choice == '1':
                self.recruit_performer()
            elif choice == '2':
                self.manage_performers()
            elif choice == '3':
                self.run_club_night()
            elif choice == '4':
                self.manage_upgrades()
            elif choice == '5':
                self.advance_day()
            elif choice == '6':
                self.view_stats()
            elif choice == '7':
                self.automation_menu()
            elif choice == '8':
                self.save_game()
            elif choice == '9':
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
