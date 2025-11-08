import os
import sys
import unittest
from dataclasses import asdict

# Ensure tests can import the local game module regardless of how they are run
sys.path.insert(0, os.path.dirname(__file__))

from game import (
	ClubManager,
	Performer,
	PerformerType,
	Gender,
	Patron,
	generate_full_name,
	compute_checksum,
)


class TestNightclubGame(unittest.TestCase):
	"""Unit tests covering key systems in Underground Club Manager."""

	def test_generate_full_name_unique(self) -> None:
		used_names = set()
		names = [generate_full_name(used_names) for _ in range(40)]
		self.assertEqual(len(names), len(set(names)))

	def test_ensure_bouncer_present(self) -> None:
		mgr = ClubManager()
		has_security = any(
			performer.get("performer_type") == PerformerType.SECURITY
			or performer.get("performer_type") == PerformerType.SECURITY.value
			for performer in mgr.state.performers
		)
		self.assertTrue(has_security)

	def test_checksum_detects_tamper(self) -> None:
		base_payload = {
			"day": 1,
			"money": 1000,
			"reputation": 50,
			"ethics_score": 50,
			"performers": [],
			"relationships": {},
			"story_flags": {},
			"completed_events": [],
		}
		checksum = compute_checksum({**base_payload})
		self.assertIsInstance(checksum, str)
		tampered_payload = {**base_payload, "money": 999999}
		self.assertNotEqual(checksum, compute_checksum({**tampered_payload}))

	def test_promotion_prerequisites(self) -> None:
		mgr = ClubManager()
		perf = Performer(
			name="Test Singer",
			performer_type=PerformerType.SINGER,
			gender=Gender.FEMALE,
			traits=["Talented"],
			skill=3,
			loyalty=5,
			energy=10,
			salary=500,
			reputation=0,
			promotion_level=0,
		)
		self.assertIsNone(mgr.can_promote(perf))
		perf.skill = 7
		promo_info = mgr.can_promote(perf)
		self.assertIsNotNone(promo_info)
		self.assertEqual(promo_info["title"], "Vocal Coach")

	def test_promotion_progression(self) -> None:
		mgr = ClubManager()
		perf = Performer(
			name="Test DJ",
			performer_type=PerformerType.DJ,
			gender=Gender.MALE,
			traits=["Creative"],
			skill=9,
			loyalty=8,
			energy=9,
			salary=600,
			reputation=20,
			promotion_level=0,
		)
		mgr.state.performers.append(asdict(perf))
		mgr.state.money = 50_000
		perf_index = len(mgr.state.performers) - 1
		promoted = mgr.promote_performer(perf_index)
		self.assertTrue(promoted)
		promoted_perf = Performer(**mgr.state.performers[perf_index])
		self.assertEqual(promoted_perf.promotion_level, 1)

	def test_promotion_buffs(self) -> None:
		mgr = ClubManager()
		promoted = Performer(
			name="Master Dancer",
			performer_type=PerformerType.DANCER,
			gender=Gender.FEMALE,
			traits=["Athletic"],
			skill=9,
			loyalty=8,
			energy=10,
			salary=800,
			reputation=40,
			promotion_level=2,
		)
		mgr.state.performers.append(asdict(promoted))
		buffs = mgr.get_active_buffs()
		self.assertGreater(len(buffs), 0)

	def test_event_registry_shape(self) -> None:
		mgr = ClubManager()
		self.assertGreater(len(mgr.event_registry), 0)
		for metadata in mgr.event_registry.values():
			self.assertIn("handler", metadata)
			self.assertIn("tags", metadata)
			self.assertIn("risk_rating", metadata)
			self.assertIn("cooldown", metadata)
			self.assertIn("weight", metadata)

	def test_event_cooldowns(self) -> None:
		mgr = ClubManager()
		mgr.state.day = 5
		event_id = next(iter(mgr.event_registry))
		mgr.state.event_cooldowns[event_id] = 10
		self.assertLess(mgr.state.day, mgr.state.event_cooldowns[event_id])
		mgr.state.day = 11
		self.assertGreaterEqual(mgr.state.day, mgr.state.event_cooldowns[event_id])

	def test_upgrade_catalog(self) -> None:
		mgr = ClubManager()
		self.assertGreater(len(mgr.upgrade_catalog), 0)
		for upgrade_id, data in mgr.upgrade_catalog.items():
			self.assertIn("name", data)
			self.assertIn("desc", data)
			self.assertIn("base_cost", data)
			self.assertIn("max_level", data)

	def test_upgrade_purchase_flow(self) -> None:
		mgr = ClubManager()
		mgr.state.money = 10_000
		upgrade_id = "sound_system"
		base_cost = mgr.upgrade_catalog[upgrade_id]["base_cost"]
		mgr.state.money -= base_cost
		mgr.state.upgrades[upgrade_id] = 1
		self.assertEqual(mgr.state.upgrades[upgrade_id], 1)
		self.assertEqual(mgr.state.money, 10_000 - base_cost)

	def test_upgrade_levels_respect_cap(self) -> None:
		mgr = ClubManager()
		upgrade_id = "vip_lounge"
		max_level = mgr.upgrade_catalog[upgrade_id]["max_level"]
		for level in range(1, max_level + 1):
			mgr.state.upgrades[upgrade_id] = level
			self.assertEqual(mgr.state.upgrades[upgrade_id], level)
		self.assertLessEqual(mgr.state.upgrades[upgrade_id], max_level)

	def test_economy_initialization(self) -> None:
		mgr = ClubManager()
		self.assertGreater(mgr.state.city_demand, 0)
		self.assertLessEqual(mgr.state.city_demand, 200)
		self.assertEqual(len(mgr.state.genre_trend), len(PerformerType))
		for performer_type in PerformerType:
			self.assertIn(performer_type.value, mgr.state.genre_trend)

	def test_economy_adjustment_changes_values(self) -> None:
		mgr = ClubManager()
		initial_demand = mgr.state.city_demand
		initial_trend = dict(mgr.state.genre_trend)
		mgr.adjust_weekly_economy()
		self.assertTrue(
			mgr.state.city_demand != initial_demand
			or mgr.state.genre_trend != initial_trend
		)

	def test_risk_level_setting(self) -> None:
		mgr = ClubManager()
		for risk in ("conservative", "standard", "bold"):
			mgr.state.risk_level = risk
			self.assertEqual(mgr.state.risk_level, risk)

	def test_patron_generation(self) -> None:
		mgr = ClubManager()
		mgr.state.reputation = 60
		patrons = mgr.generate_patrons()
		self.assertGreater(len(patrons), 0)
		valid_archetypes = {
			"general",
			"high_roller",
			"critic",
			"influencer",
			"trendsetter",
		}
		for patron in patrons:
			self.assertIsInstance(patron, Patron)
			self.assertTrue(patron.name)
			self.assertGreater(patron.mood, 0)
			self.assertGreater(patron.spending_power, 0)
			self.assertIn(patron.archetype, valid_archetypes)

	def test_crowd_bonus_calculation(self) -> None:
		mgr = ClubManager()
		patrons = [
			Patron(name="Test1", mood=8, spending_power=100, archetype="general"),
			Patron(name="Test2", mood=7, spending_power=200, archetype="high_roller"),
			Patron(name="Test3", mood=6, spending_power=80, archetype="general"),
		]
		bonus = mgr.calculate_crowd_bonus(patrons)
		self.assertGreater(bonus, 0)
		self.assertIsInstance(bonus, int)

	def test_striptease_routine_bonus(self) -> None:
		perf = Performer(
			name="Velvet Blaze",
			performer_type=PerformerType.DANCER,
			gender=Gender.FEMALE,
			traits=["Charismatic"],
			skill=8,
			loyalty=8,
			energy=8,
			salary=600,
			reputation=10,
			promotion_level=0,
			offers_striptease=True,
			dancer_strip_routine=True,
		)
		base_income = 400
		bonus, ethics_delta, rep_delta, notes = perf.perform_sensual_show(base_income)
		self.assertGreater(bonus, 0)
		self.assertLess(ethics_delta, 0)
		self.assertGreaterEqual(rep_delta, 1)
		self.assertTrue(notes)
		self.assertLess(perf.energy, 8)

	def test_bouncer_is_security(self) -> None:
		mgr = ClubManager()
		self.assertTrue(mgr.has_bouncer())
		bouncer = next(
			(
				performer
				for performer in mgr.state.performers
				if performer.get("performer_type") == PerformerType.SECURITY
				or performer.get("performer_type") == PerformerType.SECURITY.value
			),
			None,
		)
		self.assertIsNotNone(bouncer)

	def test_save_load_new_fields(self) -> None:
		mgr = ClubManager()
		temp_file = "test_new_features.json"
		mgr.state.upgrades = {"sound_system": 2, "vip_lounge": 1}
		mgr.state.city_demand = 120
		mgr.state.genre_trend = {
			"singer": 10,
			"dancer": -5,
			"dj": 0,
			"bartender": 15,
			"security": 0,
		}
		mgr.state.risk_level = "bold"
		mgr.state.event_cooldowns = {
			"vip_visitor": 10,
			"equipment_failure": 15,
		}
		promoted = Performer(
			name="Test Promoted",
			performer_type=PerformerType.SINGER,
			gender=Gender.MALE,
			traits=["Talented"],
			skill=8,
			loyalty=7,
			energy=10,
			salary=800,
			reputation=30,
			promotion_level=2,
		)
		mgr.state.performers.append(asdict(promoted))
		mgr.save_file = temp_file
		mgr.save_game()
		mgr2 = ClubManager()
		mgr2.save_file = temp_file
		self.assertTrue(mgr2.load_game())
		self.assertEqual(mgr2.state.upgrades, mgr.state.upgrades)
		self.assertEqual(mgr2.state.city_demand, mgr.state.city_demand)
		self.assertEqual(mgr2.state.genre_trend, mgr.state.genre_trend)
		self.assertEqual(mgr2.state.risk_level, mgr.state.risk_level)
		self.assertEqual(mgr2.state.event_cooldowns, mgr.state.event_cooldowns)
		loaded_perf = Performer(**mgr2.state.performers[-1])
		self.assertEqual(loaded_perf.promotion_level, 2)
		os.remove(temp_file)


if __name__ == "__main__":
	unittest.main()
