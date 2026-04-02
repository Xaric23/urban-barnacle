import argparse
import json
import math
import random
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

STRUCTURE_TYPES = ["^F_TRIFLOOR", "^F_WALL", "^F_CEILING", "^F_PILLAR", "^F_DOOR"]
DECOR_TYPES = ["^F_PILLAR"]
BASE_FLAG = "^BASE_FLAG"

# NMS enforces a hard cap of 16,383 placed objects per base.
NMS_OBJECT_LIMIT = 16_383


@dataclass
class GeneratorConfig:
    base_name: str = "ExtremeBase_10k_Alive"
    output_file: str = "ExtremeBase_10k_Alive.json"
    floors: int = 4
    width: int = 50
    depth: int = 50
    spacing: float = 2.0
    layer_height: float = 3.0
    drone_ratio: float = 0.1
    seed: Optional[int] = None
    galactic_address: str = "0x0000000000000000"
    base_position: Tuple[float, float, float] = field(default=(0.0, 0.0, 0.0))
    forward: Tuple[float, float, float] = field(default=(0.0, 0.0, 1.0))

    def __post_init__(self) -> None:
        if self.floors < 1:
            raise ValueError(f"floors must be >= 1, got {self.floors}")
        if self.width < 1:
            raise ValueError(f"width must be >= 1, got {self.width}")
        if self.depth < 1:
            raise ValueError(f"depth must be >= 1, got {self.depth}")
        if self.spacing <= 0:
            raise ValueError(f"spacing must be > 0, got {self.spacing}")
        if self.layer_height <= 0:
            raise ValueError(f"layer_height must be > 0, got {self.layer_height}")
        if not 0.0 <= self.drone_ratio <= 1.0:
            raise ValueError(f"drone_ratio must be in [0, 1], got {self.drone_ratio}")

    @property
    def total_objects(self) -> int:
        """Total number of objects that will be generated (including the base flag)."""
        return 1 + self.floors * self.width * self.depth


def _make_vector_jittered(rng: random.Random, y_value: float = 1.0) -> Tuple[List[float], List[float]]:
    """Return a jittered (up, at) orientation pair.

    The *at* vector is a proper spherical-coordinate unit vector so that NMS
    accepts the orientation without silently discarding or corrupting the part.
    """
    up = [
        rng.uniform(-0.001, 0.001),
        y_value + rng.uniform(-0.0001, 0.0001),
        rng.uniform(-0.001, 0.001),
    ]
    theta = rng.uniform(0, 2 * math.pi)
    phi = rng.uniform(-0.2, 0.2)
    at = [
        math.cos(theta) * math.cos(phi),
        math.sin(phi),
        math.sin(theta) * math.cos(phi),
    ]
    return up, at


def _make_object(
    rng: random.Random,
    object_id: str,
    x: float,
    y: float,
    z: float,
    timestamp: int,
    user_data: int,
) -> Dict:
    up, at = _make_vector_jittered(rng)
    return {
        "Timestamp": timestamp,
        "ObjectID": object_id,
        "UserData": user_data,
        "Position": [round(x, 6), round(y, 6), round(z, 6)],
        "Up": up,
        "At": at,
    }


def _make_base_flag(timestamp: int) -> Dict:
    return {
        "Timestamp": timestamp,
        "ObjectID": BASE_FLAG,
        "UserData": 0,
        "Position": [0.0, 0.0, 0.0],
        "Up": [0.0, 1.0, 0.0],
        "At": [0.0, 0.0, 1.0],
    }


def _make_structure(rng: random.Random, x: float, y: float, z: float, timestamp: int) -> Dict:
    obj_type = rng.choice(STRUCTURE_TYPES)
    user_data = rng.randint(30, 50)
    return _make_object(rng, obj_type, x, y, z, timestamp, user_data)


def _make_drone(rng: random.Random, x: float, y: float, z: float, timestamp: int) -> Dict:
    obj_type = rng.choice(DECOR_TYPES)
    user_data = rng.randint(100, 200)
    return _make_object(rng, obj_type, x, y, z, timestamp, user_data)


def generate_base(config: GeneratorConfig) -> Dict:
    """Generate and return the full base payload as a dictionary."""
    total = config.total_objects
    if total > NMS_OBJECT_LIMIT:
        print(
            f"WARNING: This configuration produces {total:,} objects, which exceeds "
            f"the NMS limit of {NMS_OBJECT_LIMIT:,}. The base may be truncated in-game."
        )

    rng = random.Random(config.seed)
    now = int(time.time())
    objects: List[Dict] = [_make_base_flag(now)]
    idx = 1

    total_cells = config.floors * config.width * config.depth
    report_every = max(1, total_cells // 10)

    print(f"Generating {total:,} objects across {config.floors} floor(s)…")
    for floor in range(config.floors):
        y = floor * config.layer_height
        for i in range(config.width):
            for j in range(config.depth):
                cell = floor * config.width * config.depth + i * config.depth + j
                if cell % report_every == 0:
                    pct = int(100 * cell / total_cells)
                    print(f"  {pct:3d}%  floor {floor + 1}/{config.floors}, cell {cell:,}/{total_cells:,}")

                x = i * config.spacing
                z = j * config.spacing
                if rng.random() < config.drone_ratio:
                    px = x + rng.uniform(-1.0, 1.0)
                    py = y + rng.uniform(1.0, 2.0)
                    pz = z + rng.uniform(-1.0, 1.0)
                    objects.append(_make_drone(rng, px, py, pz, now + idx))
                else:
                    objects.append(_make_structure(rng, x, y, z, now + idx))
                idx += 1

    print(f"  100%  done — {len(objects):,} objects generated.")

    bx, by, bz = config.base_position
    return {
        "BaseVersion": 4,
        "OriginalBaseVersion": 4,
        "GalacticAddress": config.galactic_address,
        "Position": [bx, by, bz],
        "Forward": list(config.forward),
        "UserData": 0,
        "LastUpdateTimestamp": now,
        "Objects": objects,
        "RID": "",
        "Owner": {
            "LID": "",
            "UID": "",
            "USN": "",
            "PTK": "",
            "TS": now,
        },
        "Name": config.base_name,
        "BaseType": {"PersistentBaseTypes": "HomePlanetBase"},
        "LastEditedById": "0",
        "LastEditedByUsername": "",
    }


def save_base(config: GeneratorConfig) -> str:
    """Generate the base and write it to *config.output_file*. Returns the path."""
    payload = generate_base(config)
    with open(config.output_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4)
    return config.output_file


def _parse_args() -> GeneratorConfig:
    parser = argparse.ArgumentParser(
        description="Generate a No Man's Sky base JSON file.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--base-name", default="ExtremeBase_10k_Alive", help="In-game base name")
    parser.add_argument("--output-file", default="ExtremeBase_10k_Alive.json", help="Output JSON path")
    parser.add_argument("--floors", type=int, default=4, help="Number of floors")
    parser.add_argument("--width", type=int, default=50, help="Grid width (cells)")
    parser.add_argument("--depth", type=int, default=50, help="Grid depth (cells)")
    parser.add_argument("--spacing", type=float, default=2.0, help="Cell spacing in metres")
    parser.add_argument("--layer-height", type=float, default=3.0, help="Height per floor in metres")
    parser.add_argument("--drone-ratio", type=float, default=0.1, help="Fraction of cells that become drones [0–1]")
    parser.add_argument("--seed", type=int, default=None, help="RNG seed for reproducible output")
    parser.add_argument("--galactic-address", default="0x0000000000000000", help="Galactic address string")
    args = parser.parse_args()
    return GeneratorConfig(
        base_name=args.base_name,
        output_file=args.output_file,
        floors=args.floors,
        width=args.width,
        depth=args.depth,
        spacing=args.spacing,
        layer_height=args.layer_height,
        drone_ratio=args.drone_ratio,
        seed=args.seed,
        galactic_address=args.galactic_address,
    )


if __name__ == "__main__":
    cfg = _parse_args()
    path = save_base(cfg)
    print(f"Saved → {path}")
