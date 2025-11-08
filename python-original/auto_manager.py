#!/usr/bin/env python3
"""
Automated Club Manager Module for Underground Club Manager Game

This module provides AI-driven automation for various club management tasks,
allowing players to enable partial or full automation of their nightclub operations.
"""

import random
from typing import Dict, List, Optional, Tuple
from dataclasses import asdict
from enum import Enum

from game import (
    ClubManager, Performer, PerformerType, Gender, GameState,
    generate_full_name
)
from traits import PERSONALITY_TRAITS


class AutomationLevel(Enum):
    """Levels of automation available"""
    NONE = "none"
    BASIC = "basic"          # Basic staff management
    MODERATE = "moderate"    # + recruitment, upgrades
    ADVANCED = "advanced"    # + strategic decisions
    FULL = "full"           # Complete automation


class AutomationStrategy(Enum):
    """Different strategic approaches for automation"""
    BALANCED = "balanced"      # Balance all aspects
    PROFIT = "profit"         # Focus on money generation
    ETHICS = "ethics"         # Prioritize ethical choices
    GROWTH = "growth"         # Focus on expansion and upgrades
    REPUTATION = "reputation" # Maximize reputation gains


class AutoClubManager:
    """
    Automated management system for the nightclub.
    Can handle staff management, recruitment, upgrades, and strategic decisions.
    """
    
    def __init__(self, club_manager: ClubManager, automation_level: AutomationLevel = AutomationLevel.BASIC, 
                 strategy: AutomationStrategy = AutomationStrategy.BALANCED):
        self.club_manager = club_manager
        self.automation_level = automation_level
        self.strategy = strategy
        self.decisions_log: List[str] = []
        
        # Strategy-specific parameters
        self.strategy_params = self._build_strategy_params()
        
        # Performance tracking
        self.auto_decisions = 0
        self.money_saved = 0
        self.reputation_gained = 0
        
    def _build_strategy_params(self) -> Dict:
        """Build strategy-specific parameters for decision making."""
        base_params = {
            "min_cash_reserve": 1000,
            "max_performers": 8,
            "min_performers": 3,
            "target_skill_avg": 6.5,
            "upgrade_priority": ["sound_system", "marketing", "vip_lounge", "security_suite"],
            "risk_preference": "standard"
        }
        
        if self.strategy == AutomationStrategy.PROFIT:
            base_params.update({
                "min_cash_reserve": 500,
                "max_performers": 6,
                "target_skill_avg": 7.0,
                "upgrade_priority": ["sound_system", "vip_lounge", "marketing", "security_suite"],
                "risk_preference": "bold"
            })
        elif self.strategy == AutomationStrategy.ETHICS:
            base_params.update({
                "min_cash_reserve": 2000,
                "max_performers": 10,
                "target_skill_avg": 6.0,
                "upgrade_priority": ["security_suite", "marketing", "sound_system", "vip_lounge"],
                "risk_preference": "conservative"
            })
        elif self.strategy == AutomationStrategy.GROWTH:
            base_params.update({
                "min_cash_reserve": 800,
                "max_performers": 12,
                "target_skill_avg": 7.5,
                "upgrade_priority": ["marketing", "sound_system", "vip_lounge", "security_suite"],
                "risk_preference": "standard"
            })
        elif self.strategy == AutomationStrategy.REPUTATION:
            base_params.update({
                "min_cash_reserve": 1500,
                "max_performers": 8,
                "target_skill_avg": 8.0,
                "upgrade_priority": ["marketing", "security_suite", "sound_system", "vip_lounge"],
                "risk_preference": "conservative"
            })
            
        return base_params
    
    def auto_manage_turn(self) -> Dict[str, any]:
        """
        Execute one turn of automated management.
        Returns a summary of actions taken.
        """
        actions_taken = {
            "staff_actions": [],
            "recruitment": [],
            "upgrades": [],
            "strategic_decisions": [],
            "money_spent": 0,
            "decisions_made": 0
        }
        
        if self.automation_level == AutomationLevel.NONE:
            return actions_taken
        
        # Basic level: Staff management
        if self.automation_level.value in ["basic", "moderate", "advanced", "full"]:
            staff_actions = self._auto_manage_staff()
            actions_taken["staff_actions"] = staff_actions
            actions_taken["decisions_made"] += len(staff_actions)
        
        # Moderate level: Recruitment and basic upgrades
        if self.automation_level.value in ["moderate", "advanced", "full"]:
            recruitment = self._auto_recruitment()
            upgrades = self._auto_upgrades()
            actions_taken["recruitment"] = recruitment
            actions_taken["upgrades"] = upgrades
            actions_taken["decisions_made"] += len(recruitment) + len(upgrades)
        
        # Advanced level: Strategic decisions
        if self.automation_level.value in ["advanced", "full"]:
            strategic = self._auto_strategic_decisions()
            actions_taken["strategic_decisions"] = strategic
            actions_taken["decisions_made"] += len(strategic)
        
        # Full level: Complete automation including event responses
        if self.automation_level == AutomationLevel.FULL:
            # This would hook into event system for automated responses
            pass
        
        self.auto_decisions += actions_taken["decisions_made"]
        return actions_taken
    
    def _auto_manage_staff(self) -> List[str]:
        """Automatically manage existing staff (training, rest, relationship building)."""
        actions = []
        
        for i, perf_data in enumerate(self.club_manager.state.performers):
            perf = Performer(**perf_data)
            
            # Priority 1: Rest tired performers
            if perf.energy <= 3:
                perf.rest()
                self.club_manager.state.performers[i] = asdict(perf)
                actions.append(f"Rested {perf.name} (energy was {perf.energy - 3})")
                continue
            
            # Priority 2: Train performers if we have money and they need skill
            target_skill = self.strategy_params["target_skill_avg"]
            training_cost = 100
            
            if (perf.skill < target_skill and 
                perf.energy >= 3 and 
                self.club_manager.state.money >= training_cost + self.strategy_params["min_cash_reserve"]):
                
                if perf.train():
                    self.club_manager.state.money -= training_cost
                    self.club_manager.state.performers[i] = asdict(perf)
                    actions.append(f"Trained {perf.name} (skill now {perf.skill})")
            
            # Priority 3: Build relationships with low-loyalty performers
            if (perf.loyalty <= 6 and 
                self.club_manager.state.relationships.get(perf.name, 5) <= 7):
                
                # Simulate relationship building
                current_rel = self.club_manager.state.relationships.get(perf.name, 5)
                self.club_manager.state.relationships[perf.name] = min(10, current_rel + 1)
                perf.loyalty = min(10, perf.loyalty + 1)
                self.club_manager.state.performers[i] = asdict(perf)
                actions.append(f"Built relationship with {perf.name} (loyalty now {perf.loyalty})")
        
        return actions
    
    def _auto_recruitment(self) -> List[str]:
        """Automatically recruit new performers when needed."""
        actions = []
        current_count = len(self.club_manager.state.performers)
        min_performers = self.strategy_params["min_performers"]
        max_performers = self.strategy_params["max_performers"]
        
        if current_count >= max_performers:
            return actions
        
        # Count performers by type
        type_counts = {}
        for perf_data in self.club_manager.state.performers:
            ptype = perf_data.get("performer_type")
            if isinstance(ptype, str):
                type_counts[ptype] = type_counts.get(ptype, 0) + 1
            else:
                type_counts[ptype.value] = type_counts.get(ptype.value, 0) + 1
        
        # Ensure we have at least one of each critical type
        critical_types = [PerformerType.SECURITY, PerformerType.BARTENDER]
        needed_types = []
        
        for ptype in critical_types:
            if type_counts.get(ptype.value, 0) == 0:
                needed_types.append(ptype)
        
        # Add general recruitment if below minimum
        if current_count < min_performers:
            # Prefer types we don't have enough of
            all_types = list(PerformerType)
            for ptype in all_types:
                if type_counts.get(ptype.value, 0) <= 1 and len(needed_types) < (min_performers - current_count):
                    if ptype not in needed_types:
                        needed_types.append(ptype)
        
        # Recruit needed performers
        for ptype in needed_types[:2]:  # Limit to 2 per turn
            if self._try_recruit_performer(ptype):
                actions.append(f"Recruited {ptype.value}")
        
        return actions
    
    def _try_recruit_performer(self, performer_type: PerformerType) -> bool:
        """Attempt to recruit a specific type of performer."""
        # Generate candidate
        gender = random.choice(list(Gender))
        num_traits = random.randint(2, 3)
        traits = random.sample(PERSONALITY_TRAITS, num_traits)
        name = generate_full_name()
        skill = random.randint(3, 8)
        salary = skill * 100 + random.randint(50, 150)
        
        # Apply trait modifiers
        if "Natural Talent" in traits:
            skill = min(10, skill + 1)
        if "Hardworking" in traits:
            salary = int(salary * 0.9)
        if "Arrogant" in traits:
            salary = int(salary * 1.2)
        
        total_cost = salary * 7  # One week advance
        
        # Check if we can afford and want this performer
        if self.club_manager.state.money < total_cost + self.strategy_params["min_cash_reserve"]:
            return False
        
        # Strategy-based hiring decisions
        if self.strategy == AutomationStrategy.PROFIT and salary > skill * 110:
            return False  # Too expensive for profit strategy
        
        if self.strategy == AutomationStrategy.ETHICS and "Arrogant" in traits:
            return False  # Avoid difficult personalities for ethics strategy
        
        # Hire the performer
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
        
        self.club_manager.state.performers.append(asdict(performer))
        self.club_manager.state.relationships[name] = 5
        self.club_manager.state.money -= total_cost
        
        return True
    
    def _auto_upgrades(self) -> List[str]:
        """Automatically purchase upgrades based on strategy."""
        actions = []
        available_money = self.club_manager.state.money - self.strategy_params["min_cash_reserve"]
        
        if available_money < 500:
            return actions
        
        upgrade_priority = self.strategy_params["upgrade_priority"]
        
        for upgrade_id in upgrade_priority:
            if upgrade_id not in self.club_manager.upgrade_catalog:
                continue
                
            upgrade_data = self.club_manager.upgrade_catalog[upgrade_id]
            current_level = self.club_manager.state.upgrades.get(upgrade_id, 0)
            
            if current_level >= upgrade_data["max_level"]:
                continue
            
            cost = int(upgrade_data["base_cost"] * (1.5 ** current_level))
            
            if available_money >= cost:
                self.club_manager.state.money -= cost
                self.club_manager.state.upgrades[upgrade_id] = current_level + 1
                available_money -= cost
                actions.append(f"Upgraded {upgrade_data['name']} to level {current_level + 1}")
                
                # Only one upgrade per turn for moderate automation
                if self.automation_level == AutomationLevel.MODERATE:
                    break
        
        return actions
    
    def _auto_strategic_decisions(self) -> List[str]:
        """Make high-level strategic decisions."""
        actions = []
        
        # Promote eligible performers
        promotion_actions = self._auto_promotions()
        actions.extend(promotion_actions)
        
        # Fire underperforming staff (advanced strategy)
        firing_actions = self._auto_firing_decisions()
        actions.extend(firing_actions)
        
        # Adjust risk level based on strategy
        risk_action = self._auto_risk_adjustment()
        if risk_action:
            actions.append(risk_action)
        
        return actions
    
    def _auto_promotions(self) -> List[str]:
        """Automatically promote eligible performers."""
        actions = []
        
        for i, perf_data in enumerate(self.club_manager.state.performers):
            perf = Performer(**perf_data)
            promo_info = self.club_manager.can_promote(perf)
            
            if promo_info and self.club_manager.state.money >= promo_info["cost"] + self.strategy_params["min_cash_reserve"]:
                if self.club_manager.promote_performer(i):
                    actions.append(f"Promoted {perf.name} to {promo_info['title']}")
        
        return actions
    
    def _auto_firing_decisions(self) -> List[str]:
        """Decide whether to fire underperforming staff."""
        actions = []
        
        if len(self.club_manager.state.performers) <= self.strategy_params["min_performers"]:
            return actions
        
        # Only fire in advanced automation and specific strategies
        if self.strategy not in [AutomationStrategy.PROFIT, AutomationStrategy.GROWTH]:
            return actions
        
        for i, perf_data in enumerate(self.club_manager.state.performers[:]):  # Copy list for safe iteration
            perf = Performer(**perf_data)
            
            # Fire criteria: low skill, low loyalty, high salary
            should_fire = (
                perf.skill <= 4 and 
                perf.loyalty <= 4 and 
                perf.salary > perf.skill * 120 and
                len(self.club_manager.state.performers) > self.strategy_params["min_performers"]
            )
            
            if should_fire:
                # Remove performer
                actual_index = None
                for idx, p in enumerate(self.club_manager.state.performers):
                    if p.get("name") == perf.name:
                        actual_index = idx
                        break
                
                if actual_index is not None:
                    self.club_manager.state.performers.pop(actual_index)
                    if perf.name in self.club_manager.state.relationships:
                        del self.club_manager.state.relationships[perf.name]
                    self.club_manager.state.ethics_score = max(0, self.club_manager.state.ethics_score - 3)
                    actions.append(f"Fired {perf.name} (poor performance)")
                    break  # Only fire one per turn
        
        return actions
    
    def _auto_risk_adjustment(self) -> Optional[str]:
        """Automatically adjust risk level based on strategy and current state."""
        preferred_risk = self.strategy_params["risk_preference"]
        current_risk = self.club_manager.state.risk_level
        
        if current_risk != preferred_risk:
            self.club_manager.state.risk_level = preferred_risk
            return f"Adjusted risk level to {preferred_risk}"
        
        return None
    
    def get_automation_report(self) -> Dict[str, any]:
        """Get a report on automation performance."""
        return {
            "automation_level": self.automation_level.value,
            "strategy": self.strategy.value,
            "total_decisions": self.auto_decisions,
            "money_impact": self.money_saved,
            "reputation_impact": self.reputation_gained,
            "current_performers": len(self.club_manager.state.performers),
            "current_money": self.club_manager.state.money,
            "current_reputation": self.club_manager.state.reputation,
            "current_ethics": self.club_manager.state.ethics_score
        }
    
    def set_automation_level(self, level: AutomationLevel):
        """Change the automation level."""
        self.automation_level = level
        self.decisions_log.append(f"Changed automation to {level.value}")
    
    def set_strategy(self, strategy: AutomationStrategy):
        """Change the automation strategy."""
        self.strategy = strategy
        self.strategy_params = self._build_strategy_params()
        self.decisions_log.append(f"Changed strategy to {strategy.value}")
    
    def simulate_multiple_turns(self, num_turns: int) -> List[Dict]:
        """Simulate multiple turns of automation for testing."""
        results = []
        
        for turn in range(num_turns):
            # Simulate night income (simplified)
            base_income = len(self.club_manager.state.performers) * 300
            expenses = sum(p.get("salary", 100) for p in self.club_manager.state.performers)
            net_income = base_income - expenses
            self.club_manager.state.money += net_income
            
            # Run automation
            actions = self.auto_manage_turn()
            
            # Advance day
            self.club_manager.state.day += 1
            
            results.append({
                "turn": turn + 1,
                "day": self.club_manager.state.day,
                "actions": actions,
                "money": self.club_manager.state.money,
                "reputation": self.club_manager.state.reputation,
                "performers": len(self.club_manager.state.performers)
            })
        
        return results


def create_auto_manager(club_manager: ClubManager, 
                       level_name: str = "basic", 
                       strategy_name: str = "balanced") -> AutoClubManager:
    """
    Factory function to create an AutoClubManager with string parameters.
    
    Args:
        club_manager: The main ClubManager instance
        level_name: Automation level ("none", "basic", "moderate", "advanced", "full")
        strategy_name: Strategy type ("balanced", "profit", "ethics", "growth", "reputation")
    """
    try:
        level = AutomationLevel(level_name.lower())
    except ValueError:
        level = AutomationLevel.BASIC
    
    try:
        strategy = AutomationStrategy(strategy_name.lower())
    except ValueError:
        strategy = AutomationStrategy.BALANCED
    
    return AutoClubManager(club_manager, level, strategy)


# Example usage and testing functions
if __name__ == "__main__":
    # This would be used for testing the automation system
    print("AutoClubManager module loaded successfully!")
    print("Available automation levels:", [level.value for level in AutomationLevel])
    print("Available strategies:", [strategy.value for strategy in AutomationStrategy])