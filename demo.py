#!/usr/bin/env python3
"""Showcase demos for Underground Club Manager.

The module contains two demo modes:
1. ``run_demo`` – an automated multi-day simulation driven by automation
	heuristics.
2. ``demo_game`` – a curated, story-driven walkthrough of key mechanics.
"""

from __future__ import annotations

import random
import sys
import time
from dataclasses import asdict
from typing import Dict

from game import (
	ClubManager,
	Performer,
	PerformerType,
	Gender,
	generate_full_name,
	PERSONALITY_TRAITS,
)


class AutomatedClubManager(ClubManager):
	"""Non-interactive manager that makes reasonable automated decisions."""

	def __init__(self, seed: int | None = None):
		if seed is not None:
			random.seed(seed)
		super().__init__()
		self.demo_log_prefix = "[AUTO]"

	# ----- Automation helpers -------------------------------------------------

	def bootstrap_team(self, target_size: int = 4) -> None:
		"""Recruit performers until the roster reaches the desired size."""
		attempt_guard = 0
		while len(self.state.performers) < target_size and attempt_guard < 20:
			if not self.auto_recruit_performer():
				break
			attempt_guard += 1

	def auto_recruit_performer(self) -> bool:
		"""Recruit a performer without user prompts using simple heuristics."""
		type_counts: Dict[str, int] = {}
		for pdata in self.state.performers:
			role = pdata.get("performer_type")
			key = role.value if isinstance(role, PerformerType) else str(role)
			type_counts[key] = type_counts.get(key, 0) + 1

		performer_type = min(
			PerformerType,
			key=lambda ptype: type_counts.get(ptype.value, 0),
		)

		gender = random.choice(list(Gender))
		num_traits = random.randint(2, 3)
		traits = random.sample(PERSONALITY_TRAITS, num_traits)

		name = generate_full_name()
		skill = random.randint(4, 8)
		salary = skill * 100 + random.randint(80, 160)

		if "Natural Talent" in traits:
			skill = min(10, skill + 1)
		if "Hardworking" in traits:
			salary = int(salary * 0.9)
		if "Arrogant" in traits:
			salary = int(salary * 1.2)

		onboarding_cost = salary * 7
		if self.state.money < onboarding_cost:
			return False

		performer = Performer(
			name=name,
			performer_type=performer_type,
			gender=gender,
			traits=traits,
			skill=skill,
			loyalty=random.randint(4, 7),
			energy=10,
			salary=salary,
			reputation=0,
		)
		self.state.performers.append(asdict(performer))
		self.state.relationships[name] = random.randint(4, 6)
		self.state.money -= onboarding_cost

		print(
			f"{self.demo_log_prefix} Hired {name} ({gender.value}, {performer_type.value}) "
			f"for ${salary}/day"
		)
		return True

	def auto_manage_roster(self) -> None:
		"""Train or rest performers based on current stamina and skills."""
		for idx, pdata in enumerate(list(self.state.performers)):
			perf = Performer(**pdata)

			# Promote whenever eligible and affordable.
			promo_info = self.can_promote(perf)
			if promo_info and self.state.money >= promo_info["cost"]:
				self.promote_performer(idx)
				perf = Performer(**self.state.performers[idx])

			if perf.energy <= 4:
				perf.rest()
			elif perf.skill < 8 and self.state.money >= 100:
				if perf.train():
					self.state.money -= 100
			elif perf.energy < 8:
				perf.rest()

			self.state.performers[idx] = asdict(perf)

	# ----- Overridden interactive methods ------------------------------------

	def set_risk_level(self) -> None:  # type: ignore[override]
		"""Pick a nightly risk profile without prompting the user."""
		if self.state.money < 2000:
			self.state.risk_level = "bold"
		elif self.state.reputation > 70 and self.state.money > 8000:
			self.state.risk_level = "bold"
		elif self.state.reputation < 45:
			self.state.risk_level = "conservative"
		else:
			self.state.risk_level = "standard"

	# ----- Automated event handlers ------------------------------------------

	def event_vip_visitor(self, context: Dict) -> None:  # type: ignore[override]
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
		print(f"Intensity: {severity}, offer vibe: {intensity}")

		if self.state.ethics_score < 35:
			choice = "3"
		elif self.state.money < 1500:
			choice = "1"
		else:
			choice = "3"

		if choice == "1":
			self.state.money += high_offer
			self.state.ethics_score = max(0, self.state.ethics_score - ethics_penalty)
			self.state.reputation = min(100, self.state.reputation + rep_gain_high)
			decision = "Accepted high-roller booking"
		elif choice == "2":
			self.state.ethics_score = min(100, self.state.ethics_score + ethics_decline_gain)
			decision = "Declined to stay principled"
		else:
			self.state.money += alt_offer
			self.state.ethics_score = min(100, self.state.ethics_score + ethics_alt_gain)
			self.state.reputation = min(100, self.state.reputation + rep_gain_alt)
			decision = "Offered ethical alternative"

		print(f"{self.demo_log_prefix} {decision}.")

	def event_equipment_failure(self, context: Dict) -> None:  # type: ignore[override]
		intensity = context.get("intensity", 1.0)
		severity = context.get("severity", "medium")
		print("\n⚠️ --- EVENT: EQUIPMENT FAILURE --- ⚠️")
		print(f"Severity: {severity}")

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

		if self.state.money >= repair_cost:
			choice = "repair"
		elif self.state.ethics_score > 60:
			choice = "cancel"
		else:
			choice = "continue"

		if choice == "repair":
			self.state.money -= repair_cost
			self.state.ethics_score = min(100, self.state.ethics_score + repair_ethics_gain)
			print(f"{self.demo_log_prefix} Paid ${repair_cost} for immediate repairs.")
		elif choice == "cancel":
			self.state.reputation = max(0, self.state.reputation - cancel_rep_loss)
			self.state.ethics_score = min(100, self.state.ethics_score + cancel_ethics_gain)
			print(f"{self.demo_log_prefix} Canceled the night to stay honest.")
		else:
			self.state.reputation = max(0, self.state.reputation - continue_rep_loss)
			self.state.ethics_score = max(0, self.state.ethics_score - continue_ethics_loss)
			print(f"{self.demo_log_prefix} Kept the show going despite issues.")

	def event_talent_scout(self, context: Dict) -> None:  # type: ignore[override]
		if not self.state.performers:
			return

		intensity = context.get("intensity", 1.0)
		print("\n🎬 --- EVENT: TALENT SCOUT --- 🎬")
		target_data = random.choice(self.state.performers)
		perf = Performer(**target_data)
		base_offer = perf.skill * 750 + random.randint(400, 1400)
		offer = max(600, int(base_offer * intensity))
		downtime = max(2, int(round(3 * intensity)))
		rep_gain = random.randint(2, 5)
		ethics_gain = random.randint(2, 4)

		if self.state.money < 2000:
			decision = "accept"
		elif self.state.relationships.get(perf.name, 5) > 7:
			decision = "negotiate"
		else:
			decision = "decline"

		if decision == "accept":
			self.state.money += offer
			perf.energy = max(0, perf.energy - downtime)
			self.state.reputation = min(100, self.state.reputation + rep_gain)
			action_desc = f"Accepted offer worth ${offer}"
		elif decision == "negotiate":
			better_offer = int(offer * (1.2 + 0.05 * intensity))
			self.state.money += better_offer
			perf.energy = max(0, perf.energy - max(1, downtime - 1))
			self.state.reputation = min(100, self.state.reputation + rep_gain + 1)
			action_desc = f"Negotiated up to ${better_offer}"
		else:
			perf.loyalty = min(10, perf.loyalty + 1)
			self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
			action_desc = "Declined to keep roster stable"

		idx = self.state.performers.index(target_data)
		self.state.performers[idx] = asdict(perf)
		print(f"{self.demo_log_prefix} {action_desc} for {perf.name}.")

	def event_health_inspection(self, context: Dict) -> None:  # type: ignore[override]
		intensity = context.get("intensity", 1.0)
		severity = context.get("severity", "medium")
		print("\n🏥 --- EVENT: HEALTH INSPECTION --- 🏥")
		print(f"Intensity: {severity}")

		pass_chance = 0.6 - (intensity - 1.0) * 0.2
		vip_lvl = self.state.upgrades.get("vip_lounge", 0)
		if vip_lvl > 0:
			pass_chance += 0.15 * vip_lvl
		if self.state.ethics_score > 70:
			pass_chance += 0.15
		elif self.state.ethics_score < 40:
			pass_chance -= 0.15
		pass_chance = max(0.1, min(0.95, pass_chance))

		passed = random.random() < pass_chance
		if passed:
			self.state.reputation = min(100, self.state.reputation + 5)
			self.state.ethics_score = min(100, self.state.ethics_score + 3)
			print(f"{self.demo_log_prefix} Passed inspection with ease.")
			return

		fine = max(500, int(random.randint(800, 1500) * (0.9 + intensity * 0.2)))
		if self.state.money < fine * 1.5:
			choice = "pay"
		else:
			choice = "contest"

		if choice == "pay":
			self.state.money -= fine
			self.state.reputation = max(0, self.state.reputation - 3)
			print(f"{self.demo_log_prefix} Paid ${fine} fine and moved on.")
		else:
			contest_success = max(0.15, min(0.5, 0.35 - (intensity - 1.0) * 0.1))
			if random.random() < contest_success:
				self.state.ethics_score = min(100, self.state.ethics_score + 5)
				print(f"{self.demo_log_prefix} Contested the fine successfully.")
			else:
				self.state.money -= int(fine * 1.5)
				self.state.reputation = max(0, self.state.reputation - 8)
				print(f"{self.demo_log_prefix} Contest failed; paid increased penalties.")

	def event_media_coverage(self, context: Dict) -> None:  # type: ignore[override]
		intensity = context.get("intensity", 1.0)
		severity = context.get("severity", "medium")
		print("\n📰 --- EVENT: MEDIA COVERAGE --- 📰")
		exclusive_cost = max(300, int(500 * (0.9 + 0.1 * intensity)))

		if self.state.money > exclusive_cost + 1000 and self.state.ethics_score > 55:
			choice = "exclusive"
		elif self.state.reputation < 55:
			choice = "accept"
		else:
			choice = "decline"

		if choice == "accept":
			rep_gain = max(5, int(random.randint(8, 15) * (0.9 + 0.15 * intensity)))
			self.state.reputation = min(100, self.state.reputation + rep_gain)
			if self.state.ethics_score < 50:
				self.state.ethics_score = max(0, self.state.ethics_score - 5)
			print(f"{self.demo_log_prefix} Accepted interview; reputation +{rep_gain}.")
		elif choice == "exclusive":
			rep_gain = max(8, int(random.randint(12, 20) * (0.95 + 0.1 * intensity)))
			ethics_gain = random.randint(4, 6)
			self.state.money -= exclusive_cost
			self.state.reputation = min(100, self.state.reputation + rep_gain)
			self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
			print(
				f"{self.demo_log_prefix} Hosted exclusive night (${exclusive_cost}); "
				f"reputation +{rep_gain}."
			)
		else:
			print(f"{self.demo_log_prefix} Politely declined media spotlight.")

	def event_performer_breakthrough(self, context: Dict) -> None:  # type: ignore[override]
		if not self.state.performers:
			return
		super().event_performer_breakthrough(context)

	def event_rival_club(self, context: Dict) -> None:  # type: ignore[override]
		if not self.state.performers:
			return

		intensity = context.get("intensity", 1.0)
		severity = context.get("severity", "medium")
		print("\n🎯 --- EVENT: RIVAL CLUB --- 🎯")

		target = random.choice(self.state.performers)
		perf = Performer(**target)
		raise_amount = max(120, int(random.randint(150, 280) * intensity))

		if self.state.money > raise_amount * 40:
			decision = "match"
		elif self.state.relationships.get(perf.name, 0) > 7:
			decision = "appeal"
		else:
			decision = "let_go"

		if decision == "match":
			perf.salary += raise_amount
			action = f"Matched rival offer for {perf.name}."
			idx = self.state.performers.index(target)
			self.state.performers[idx] = asdict(perf)
		elif decision == "appeal":
			current_rel = self.state.relationships.get(perf.name, 5)
			perf.loyalty = min(10, perf.loyalty + 2)
			self.state.relationships[perf.name] = min(10, current_rel + 2)
			self.state.ethics_score = min(100, self.state.ethics_score + 3)
			idx = self.state.performers.index(target)
			self.state.performers[idx] = asdict(perf)
			action = f"Appealed to loyalty; {perf.name} stayed."
		else:
			self.state.performers.remove(target)
			self.state.relationships.pop(perf.name, None)
			action = f"Could not retain {perf.name}; they left."

		print(f"{self.demo_log_prefix} {action}")

	def event_performer_conflict(self, context: Dict) -> None:  # type: ignore[override]
		if len(self.state.performers) < 2:
			return

		intensity = context.get("intensity", 1.0)
		perf1_data, perf2_data = random.sample(self.state.performers, 2)
		perf1 = Performer(**perf1_data)
		perf2 = Performer(**perf2_data)
		penalty = 2 if intensity > 0.95 else 1
		reward = penalty + (1 if intensity > 1.1 else 0)

		print("\n⚡ --- EVENT: PERFORMER CONFLICT --- ⚡")

		choice = "mediate"
		if self.state.relationships.get(perf1.name, 5) < 4:
			choice = "side2"
		if self.state.relationships.get(perf2.name, 5) < 4:
			choice = "side1"

		rel1 = self.state.relationships.get(perf1.name, 5)
		rel2 = self.state.relationships.get(perf2.name, 5)

		if choice == "side1":
			self.state.relationships[perf1.name] = min(10, rel1 + reward)
			self.state.relationships[perf2.name] = max(1, rel2 - penalty)
			print(f"{self.demo_log_prefix} Sided with {perf1.name}.")
		elif choice == "side2":
			self.state.relationships[perf2.name] = min(10, rel2 + reward)
			self.state.relationships[perf1.name] = max(1, rel1 - penalty)
			print(f"{self.demo_log_prefix} Sided with {perf2.name}.")
		else:
			self.state.relationships[perf1.name] = min(10, rel1 + max(1, reward - 1))
			self.state.relationships[perf2.name] = min(10, rel2 + max(1, reward - 1))
			ethics_gain = 5 + (1 if intensity < 0.9 else 0)
			self.state.ethics_score = min(100, self.state.ethics_score + ethics_gain)
			print(f"{self.demo_log_prefix} Mediated the dispute fairly.")

	# ----- Automated nightly loop -------------------------------------------

	def run_club_night(self) -> None:  # type: ignore[override]
		if not self.state.performers:
			print("\n✗ No performers available to run the club tonight.")
			return

		print("\n--- RUNNING CLUB NIGHT (AUTO) ---")
		self.set_risk_level()
		print(f"{self.demo_log_prefix} Risk posture: {self.state.risk_level}")

		patrons = self.generate_patrons()
		print(f"Crowd size tonight: {len(patrons)} patrons.")
		sample = ', '.join(p.name for p in patrons[: min(6, len(patrons))])
		if sample:
			print(f"Guests spotted: {sample}")
		if any(p.get("performer_type") == PerformerType.SECURITY or p.get("performer_type") == "security" for p in self.state.performers):
			print("Security team active and vigilant.")

		total_income = 0
		total_expenses = 0
		music_playing = False
		dancers_for_privates: list[int] = []

		for idx, pdata in enumerate(list(self.state.performers)):
			perf = Performer(**pdata)
			income = perf.work()
			total_expenses += perf.salary

			if income > 0:
				bonus = 0
				if "Crowd Pleaser" in perf.traits:
					bonus = int(income * 0.15)
				elif "Stage Presence" in perf.traits:
					bonus = int(income * 0.10)
				elif "Natural Talent" in perf.traits:
					bonus = int(income * 0.08)
				elif "Charismatic" in perf.traits:
					bonus = int(income * 0.05)
				income += bonus

				if perf.performer_type == PerformerType.DJ:
					music_playing = True
				if perf.performer_type == PerformerType.DANCER:
					dancers_for_privates.append(idx)

				income = int(income * (self.state.city_demand / 100.0))
				ptype_key = perf.performer_type.value if isinstance(perf.performer_type, PerformerType) else str(perf.performer_type)
				trend_pct = self.state.genre_trend.get(ptype_key, 0) / 100.0
				income = int(income * (1.0 + trend_pct))

				ss_lvl = self.state.upgrades.get("sound_system", 0)
				if ss_lvl:
					income = int(income * (1.0 + ss_lvl * self.upgrade_catalog["sound_system"]["income_pct"]))

				risk_income = {"conservative": 0.95, "standard": 1.0, "bold": 1.05}[self.state.risk_level]
				income = int(income * risk_income)

				buffs = self.get_active_buffs()
				if buffs.get("income_boost", 0) > 0 and perf.performer_type.value == PerformerType.SINGER.value:
					income = int(income * (1.0 + 0.15 * buffs["income_boost"]))

				total_income += income
				print(f"✓ {perf.name} shined, bringing in ${income}")
			else:
				print(f"✗ {perf.name} was exhausted and could not perform.")

			self.state.performers[idx] = asdict(perf)

		if music_playing and dancers_for_privates:
			private_revenue = self._process_private_dances(dancers_for_privates, prefix=self.demo_log_prefix)
			if private_revenue:
				total_income += private_revenue

		base_event_prob = 0.3
		if self.has_bouncer():
			base_event_prob = max(0.1, base_event_prob - 0.1)
		risk_mod = {"conservative": -0.12, "standard": 0.0, "bold": 0.10}[self.state.risk_level]
		sec_lvl = self.state.upgrades.get("security_suite", 0)
		sec_reduction = sec_lvl * self.upgrade_catalog["security_suite"]["event_prob_reduction"]
		days_since_last = self.state.day - self.state.last_event_day if self.state.last_event_day else self.state.day
		drought_bonus = min(0.25, max(0, days_since_last - 1) * 0.04)
		event_prob = max(0.05, min(0.9, base_event_prob + risk_mod - sec_reduction + drought_bonus))
		if random.random() < event_prob:
			if self.trigger_random_event():
				if self.state.risk_level == "bold" and random.random() < 0.35:
					self.trigger_random_event(chain_depth=1)

		crowd_bonus = self.calculate_crowd_bonus(patrons)
		if crowd_bonus:
			print(f"Crowd bonus adds ${crowd_bonus} to tonight's revenue.")

		net_income = total_income + crowd_bonus - total_expenses
		self.state.money += net_income

		print("\n--- NIGHT RESULTS ---")
		print(f"Income: ${total_income} | Expenses: ${total_expenses} | Net: ${net_income}")

		if net_income > 0:
			rep_gain = min(5, net_income // 200)
			self.state.reputation = min(100, self.state.reputation + rep_gain)
			if rep_gain:
				print(f"Reputation improved by {rep_gain}.")

	def advance_day(self) -> None:  # type: ignore[override]
		self.state.day += 1

		total_expenses = sum(Performer(**p).salary for p in self.state.performers)
		buffs = self.get_active_buffs()
		if buffs.get("expense_reduction", 0) > 0:
			reduction = int(total_expenses * 0.10 * buffs["expense_reduction"])
			total_expenses -= reduction
			print(f"{self.demo_log_prefix} Expense reduction saved ${reduction} today.")

		self.state.money -= total_expenses

		if self.state.reputation > 60:
			self.state.reputation = max(50, self.state.reputation - 1)
		elif self.state.reputation < 40:
			self.state.reputation = min(50, self.state.reputation + 1)

		if buffs.get("reputation_gain", 0) > 0:
			rep_boost = 2 * buffs["reputation_gain"]
			self.state.reputation = min(100, self.state.reputation + rep_boost)
			print(f"{self.demo_log_prefix} Artistic Director bonus: +{rep_boost} reputation.")

		if self.state.day % 7 == 1:
			self.adjust_weekly_economy()
			sorted_trend = sorted(self.state.genre_trend.items(), key=lambda kv: kv[1], reverse=True)
			hot = f"{sorted_trend[0][0]} ({sorted_trend[0][1]}%)" if sorted_trend else "-"
			cold = f"{sorted_trend[-1][0]} ({sorted_trend[-1][1]}%)" if sorted_trend else "-"
			print(f"Market shift -> City demand: {self.state.city_demand}% | Hot: {hot} | Cold: {cold}")

		print(f"Day {self.state.day} kicks off. Daily overhead: ${total_expenses}")

		if self.state.money < 0:
			print("💀 Club is bankrupt! Simulation halts.")
			self.running = False

	# ---------------------------------------------------------------------

	def simulate_day(self) -> None:
		"""Run one automated cycle consisting of prep, show, and wrap-up."""
		if self.running:
			self.auto_manage_roster()
			if len(self.state.performers) < 4 and self.state.money > 1500:
				self.auto_recruit_performer()
			self.run_club_night()
			self.advance_day()


def run_demo(days: int = 14, seed: int = 42) -> None:
	"""Execute an automated demonstration for the requested number of days."""
	manager = AutomatedClubManager(seed=seed)
	manager.bootstrap_team()

	print("\n================ AUTOMATED DEMO START ================" )
	for _ in range(days):
		if not manager.running:
			break
		manager.simulate_day()
		time.sleep(0.1)

	print("\n================= DEMO SUMMARY =================")
	print(
		f"Days survived: {manager.state.day} | Bank: ${manager.state.money} | "
		f"Reputation: {manager.state.reputation} | Ethics: {manager.state.ethics_score}"
	)
	print(f"Total performers: {len(manager.state.performers)}")


def demo_game() -> None:
	"""Run a curated six-day walkthrough of the core mechanics."""
	print("\n" + "=" * 70)
	print("🎭 UNDERGROUND CLUB MANAGER - SCRIPTED DEMO 🎭".center(70))
	print("=" * 70)

	game = ClubManager()

	print("\n📖 DEMO SCENARIO: Building Your Diverse Club Empire")
	print("-" * 70)

	print("\n[DAY 1] Starting with $5,000. Time to build our diverse team!\n")
	time.sleep(1)

	dancer = Performer(
		name="Aria Star",
		performer_type=PerformerType.DANCER,
		gender=Gender.FEMALE,
		traits=["Charismatic", "Stage Presence"],
		skill=7,
		loyalty=6,
		energy=10,
		salary=400,
		reputation=0,
	)
	game.state.performers.append(asdict(dancer))
	game.state.relationships[dancer.name] = 5
	game.state.money -= dancer.salary * 7
	print(f"✓ Hired {dancer.name} ({dancer.gender.value}, Dancer)")
	print(f"   Skill: {dancer.skill}/10 | Traits: {', '.join(dancer.traits)}")

	dj = Performer(
		name="DJ Nova",
		performer_type=PerformerType.DJ,
		gender=Gender.NON_BINARY,
		traits=["Creative", "Tech Savvy"],
		skill=6,
		loyalty=7,
		energy=10,
		salary=350,
		reputation=0,
	)
	game.state.performers.append(asdict(dj))
	game.state.relationships[dj.name] = 5
	game.state.money -= dj.salary * 7
	print(f"✓ Hired {dj.name} ({dj.gender.value}, DJ)")
	print(f"   Skill: {dj.skill}/10 | Traits: {', '.join(dj.traits)}")

	print(f"\n💰 Remaining money: ${game.state.money}")
	time.sleep(2)

	print("\n[DAY 2] Time for our first club night!\n")
	game.state.day = 2
	time.sleep(1)

	total_income = 0
	for idx, perf_data in enumerate(list(game.state.performers)):
		perf = Performer(**perf_data)
		income = perf.work()
		total_income += income
		print(f"🎵 {perf.name} ({perf.gender.value}) performed! Income: ${income}")
		game.state.performers[idx] = asdict(perf)

	total_expenses = sum(Performer(**p).salary for p in game.state.performers)
	net = total_income - total_expenses
	game.state.money += net
	game.state.reputation += 3

	print("\n📊 Night Results:")
	print(f"   Income: ${total_income}")
	print(f"   Expenses: ${total_expenses}")
	print(f"   Net Profit: ${net}")
	print(f"   Reputation: {game.state.reputation}/100 (+3)")
	time.sleep(2)

	print("\n[DAY 3] Investing in performer development\n")
	game.state.day = 3
	time.sleep(1)

	dancer_data = game.state.performers[0]
	dancer = Performer(**dancer_data)
	old_skill = dancer.skill
	dancer.train()
	game.state.performers[0] = asdict(dancer)
	game.state.money -= 100

	print(f"📚 {dancer.name} trained!")
	print(f"   Skill: {old_skill}/10 → {dancer.skill}/10")
	print("   Training cost: $100")
	print(f"   Remaining money: ${game.state.money}")
	time.sleep(2)

	print("\n[DAY 4] Building team morale and relationships\n")
	game.state.day = 4
	time.sleep(1)

	for perf_data in game.state.performers:
		perf = Performer(**perf_data)
		old_rel = game.state.relationships[perf.name]
		game.state.relationships[perf.name] = min(10, old_rel + 1)
		print(f"💬 Had a great conversation with {perf.name} ({perf.gender.value})")
		print(
			f"   Relationship: {old_rel}/10 → {game.state.relationships[perf.name]}/10"
		)
	time.sleep(2)

	print("\n[DAY 5] Expanding the team with more diversity!\n")
	game.state.day = 5
	time.sleep(1)

	singer = Performer(
		name="Luna Voice",
		performer_type=PerformerType.SINGER,
		gender=Gender.TRANSGENDER,
		traits=["Vocal Powerhouse", "Passionate", "Inspiring"],
		skill=8,
		loyalty=5,
		energy=10,
		salary=500,
		reputation=0,
	)
	game.state.performers.append(asdict(singer))
	game.state.relationships[singer.name] = 5
	game.state.money -= singer.salary * 7
	print(f"✓ Hired {singer.name} ({singer.gender.value}, Singer)")
	print(f"   Skill: {singer.skill}/10 | Traits: {', '.join(singer.traits)}")
	print(f"💰 Money: ${game.state.money}")
	time.sleep(2)

	print("\n[DAY 6] Big club night with full diverse crew!\n")
	game.state.day = 6
	time.sleep(1)

	for i, perf_data in enumerate(list(game.state.performers)):
		perf = Performer(**perf_data)
		if perf.energy < 5:
			perf.rest()
			print(f"😴 {perf.name} rested. Energy: {perf.energy}/10")
			game.state.performers[i] = asdict(perf)

	time.sleep(1)
	print("\n🎉 Club night in progress...")

	total_income = 0
	for idx, perf_data in enumerate(list(game.state.performers)):
		perf = Performer(**perf_data)
		income = perf.work()
		total_income += income
		trait_info = f" ({perf.traits[0]})" if perf.traits else ""
		print(
			f"⭐ {perf.name} ({perf.gender.value}, {perf.performer_type.value}): "
			f"${income}{trait_info}"
		)
		game.state.performers[idx] = asdict(perf)

	total_expenses = sum(Performer(**p).salary for p in game.state.performers)
	net = total_income - total_expenses
	game.state.money += net
	game.state.reputation += 5

	print("\n📊 Night Results:")
	print(f"   Total Income: ${total_income}")
	print(f"   Total Expenses: ${total_expenses}")
	print(f"   Net Profit: ${net}")
	print(f"   Reputation: {game.state.reputation}/100 (+5)")
	time.sleep(2)

	print("\n[EVENT] 🌟 VIP Visitor Arrives!")
	print("-" * 70)
	print("A wealthy patron wants to book your club for a private event.")
	print("They're offering $2,000 but requesting some questionable activities.")
	time.sleep(2)

	print("\n💭 DECISION: Offer ethical alternative entertainment")
	print("   Result: +$800, +5 Ethics, +3 Reputation")
	game.state.money += 800
	game.state.ethics_score += 5
	game.state.reputation += 3
	time.sleep(2)

	print("\n" + "=" * 70)
	print("📈 FINAL STATISTICS".center(70))
	print("=" * 70)
	print(f"\n💰 Money: ${game.state.money}")
	print(f"⭐ Reputation: {game.state.reputation}/100")
	print(f"✨ Ethics Score: {game.state.ethics_score}/100")
	print(f"👥 Team Size: {len(game.state.performers)} performers")

	print("\n🎭 YOUR DIVERSE TEAM:")
	for perf_data in game.state.performers:
		perf = Performer(**perf_data)
		rel = game.state.relationships[perf.name]
		print(f"   • {perf.name} ({perf.gender.value}, {perf.performer_type.value})")
		print(
			f"     Skill: {perf.skill}/10 | Loyalty: {perf.loyalty}/10 | "
			f"Relationship: {rel}/10"
		)
		print(f"     Traits: {', '.join(perf.traits)}")

	print("\n🌈 DIVERSITY STATISTICS:")
	gender_counts: Dict[str, int] = {}
	for perf_data in game.state.performers:
		perf = Performer(**perf_data)
		gender = perf.gender.value
		gender_counts[gender] = gender_counts.get(gender, 0) + 1

	for gender, count in gender_counts.items():
		print(f"   {gender.capitalize()}: {count}")

	print("\n" + "=" * 70)
	print("✓ DEMO COMPLETE - You've built an inclusive, successful club!".center(70))
	print("=" * 70)

	print("\n💡 Key Features Demonstrated:")
	print("   ✓ Diverse gender representation (5 gender options)")
	print("   ✓ 50+ unique personality traits")
	print("   ✓ Trait-based performance bonuses")
	print("   ✓ Performer recruitment and management")
	print("   ✓ Skill training and development")
	print("   ✓ Energy and rest management")
	print("   ✓ Relationship building")
	print("   ✓ Financial management")
	print("   ✓ Reputation system")
	print("   ✓ Ethical decision-making")
	print("   ✓ Event system with moral choices")

	print("\n📝 To play the full game, run: python game.py")
	print("\n")


def main() -> None:
	"""Entry point for running the demo module from the command line."""
	mode = sys.argv[1].lower() if len(sys.argv) > 1 else "auto"
	if mode in {"scripted", "story"}:
		demo_game()
	else:
		run_demo()


if __name__ == "__main__":
	main()
