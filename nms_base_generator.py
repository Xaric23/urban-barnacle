import json
import random
import time
import math
from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional

STRUCTURE_TYPES = ["^F_TRIFLOOR", "^F_WALL", "^F_CEILING", "^F_PILLAR", "^F_DOOR"]
DECOR_TYPES = ["^F_PILLAR"]
BASE_FLAG = "^BASE_FLAG"


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
    base_position: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    forward: Tuple[float, float, float] = (0.0, 0.0, 1.0)


def make_vector_jittered(y_value: float = 1.0) -> Tuple[List[float], List[float]]:
    up = [
        random.uniform(-0.001, 0.001),
        y_value + random.uniform(-0.0001, 0.0001),
        random.uniform(-0.001, 0.001),
    ]
    theta = random.uniform(0, 2 * math.pi)
    phi = random.uniform(-0.2, 0.2)
    at = [
        math.cos(theta) * math.cos(phi),
        random.uniform(-0.001, 0.001),
        math.sin(theta) * math.cos(phi),
    ]
    return up, at


def make_object(object_id: str, x: float, y: float, z: float, timestamp: int, user_data: int) -> Dict:
    up, at = make_vector_jittered()
    return {
        "Timestamp": timestamp,
        "ObjectID": object_id,
        "UserData": user_data,
        "Position": [round(x, 6), round(y, 6), round(z, 6)],
        "Up": up,
        "At": at,
    }


def make_base_flag(timestamp: int) -> Dict:
    return {
        "Timestamp": timestamp,
        "ObjectID": BASE_FLAG,
        "UserData": 0,
        "Position": [0.0, 0.0, 0.0],
        "Up": [0.0, 1.0, 0.0],
        "At": [0.0, 0.0, 1.0],
    }


def make_structure(x: float, y: float, z: float, timestamp: int) -> Dict:
    obj_type = random.choice(STRUCTURE_TYPES)
    user_data = random.randint(30, 50)
    return make_object(obj_type, x, y, z, timestamp, user_data)


def make_drone(x: float, y: float, z: float, timestamp: int) -> Dict:
    obj_type = random.choice(DECOR_TYPES)
    user_data = random.randint(100, 200)
    return make_object(obj_type, x, y, z, timestamp, user_data)


def generate_base(config: GeneratorConfig) -> Dict:
    if config.seed is not None:
        random.seed(config.seed)

    now = int(time.time())
    objects = [make_base_flag(now)]
    idx = 1

    for floor in range(config.floors):
        y = floor * config.layer_height
        for i in range(config.width):
            for j in range(config.depth):
                x = i * config.spacing
                z = j * config.spacing
                if random.random() < config.drone_ratio:
                    px = x + random.uniform(-1.0, 1.0)
                    py = y + random.uniform(1.0, 2.0)
                    pz = z + random.uniform(-1.0, 1.0)
                    objects.append(make_drone(px, py, pz, now + idx))
                else:
                    objects.append(make_structure(x, y, z, now + idx))
                idx += 1

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
    payload = generate_base(config)
    with open(config.output_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4)
    return config.output_file


if __name__ == "__main__":
    config = GeneratorConfig()
    path = save_base(config)
    print(f"Saved {path}")
