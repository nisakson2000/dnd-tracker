/**
 * playerBattleMapTools.js
 * Battle map and positioning utilities for player mode.
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// 1. MEASUREMENT_RULES
// ---------------------------------------------------------------------------

export const MEASUREMENT_RULES = {
  standard: {
    id: "standard",
    label: "Standard (PHB)",
    feetPerSquare: 5,
    diagonal: "equal",
    description: "Every square, including diagonals, costs 5 ft.",
    formula: (dx, dy) => Math.max(dx, dy), // in squares
  },
  variant: {
    id: "variant",
    label: "Variant Diagonal (DMG)",
    feetPerSquare: 5,
    diagonal: "alternating",
    description:
      "First diagonal counts as 5 ft, second as 10 ft, alternating (1-2-1-2…).",
    formula: (dx, dy) => {
      // Chebyshev distance with alternating extra cost on diagonals
      const straight = Math.abs(dx - dy) < 0 ? 0 : Math.abs(dx - dy); // unused directly
      const diagonalSteps = Math.min(Math.abs(dx), Math.abs(dy));
      const straightSteps = Math.abs(Math.abs(dx) - Math.abs(dy));
      // Every pair of diagonal steps costs 15 ft total (5+10); odd last diagonal = 5 ft
      const diagCost =
        Math.floor(diagonalSteps / 2) * 3 + (diagonalSteps % 2) * 1; // in squares-equivalent
      return diagCost + straightSteps;
    },
  },
  euclidean: {
    id: "euclidean",
    label: "Euclidean",
    feetPerSquare: 5,
    diagonal: "true",
    description:
      "True Euclidean distance. Best for theatre-of-the-mind or hex maps.",
    formula: (dx, dy) => Math.sqrt(dx * dx + dy * dy), // in squares
  },
};

// ---------------------------------------------------------------------------
// 2. COVER_TYPES
// ---------------------------------------------------------------------------

export const COVER_TYPES = {
  none: {
    id: "none",
    label: "No Cover",
    acBonus: 0,
    dexSaveBonus: 0,
    description: "No protection from attacks or area effects.",
    visualHint: "No border highlight",
  },
  half: {
    id: "half",
    label: "Half Cover",
    acBonus: 2,
    dexSaveBonus: 2,
    description:
      "A low wall, large furniture, or another creature provides half cover. +2 bonus to AC and DEX saving throws.",
    visualHint: "Yellow dashed border on token/tile",
  },
  three_quarters: {
    id: "three_quarters",
    label: "Three-Quarters Cover",
    acBonus: 5,
    dexSaveBonus: 5,
    description:
      "A portcullis, arrow slit, or thick tree trunk provides three-quarters cover. +5 bonus to AC and DEX saving throws.",
    visualHint: "Orange solid border on token/tile",
  },
  full: {
    id: "full",
    label: "Full Cover",
    acBonus: null, // cannot be targeted
    dexSaveBonus: null,
    description:
      "Completely concealed by a wall, floor, ceiling, or solid obstruction. Cannot be targeted directly by attacks or spells.",
    visualHint: "Red solid border; token greyed out",
  },
};

// ---------------------------------------------------------------------------
// 3. MOVEMENT_COSTS
// ---------------------------------------------------------------------------

export const MOVEMENT_COSTS = {
  normal: {
    id: "normal",
    label: "Normal Terrain",
    costMultiplier: 1,
    description: "Open ground, roads, light vegetation. 1:1 movement cost.",
    requiresSpecialSpeed: false,
  },
  difficult: {
    id: "difficult",
    label: "Difficult Terrain",
    costMultiplier: 2,
    description:
      "Mud, rubble, shallow water, dense undergrowth. Costs 2 ft of movement per 1 ft traveled.",
    requiresSpecialSpeed: false,
  },
  climbing: {
    id: "climbing",
    label: "Climbing (no Climb Speed)",
    costMultiplier: 2,
    description:
      "Climbing without a climb speed costs 2 ft of movement per 1 ft. Combine with difficult terrain for 3 ft per 1 ft.",
    requiresSpecialSpeed: false,
    specialSpeedKey: "climbSpeed",
    specialSpeedMultiplier: 1,
  },
  swimming: {
    id: "swimming",
    label: "Swimming (no Swim Speed)",
    costMultiplier: 2,
    description:
      "Swimming without a swim speed costs 2 ft of movement per 1 ft. A DC 10 STR (Athletics) check may be required.",
    requiresSpecialSpeed: false,
    specialSpeedKey: "swimSpeed",
    specialSpeedMultiplier: 1,
  },
  crawling: {
    id: "crawling",
    label: "Crawling",
    costMultiplier: 2,
    description:
      "Crawling (while prone and moving) costs 2 ft of movement per 1 ft.",
    requiresSpecialSpeed: false,
  },
  standing_from_prone: {
    id: "standing_from_prone",
    label: "Standing from Prone",
    costMultiplier: null, // special: costs half movement speed
    costType: "half_speed",
    description:
      "Standing up from the prone condition costs movement equal to half your speed. If you have 0 movement remaining you cannot stand.",
    requiresSpecialSpeed: false,
  },
};

// ---------------------------------------------------------------------------
// 4. CONDITION_TOKEN_COLORS
// ---------------------------------------------------------------------------

export const CONDITION_TOKEN_COLORS = {
  blinded: {
    condition: "Blinded",
    color: "#6b7280",
    style: "solid",
    description:
      "Grey border — the creature cannot see; attacks against it have advantage.",
  },
  charmed: {
    condition: "Charmed",
    color: "#ec4899",
    style: "solid",
    description:
      "Pink border — the creature is charmed by another; cannot attack the charmer.",
  },
  frightened: {
    condition: "Frightened",
    color: "#f59e0b",
    style: "solid",
    description:
      "Amber border — the creature has disadvantage on checks/attacks while the source is in sight.",
  },
  grappled: {
    condition: "Grappled",
    color: "#a78bfa",
    style: "solid",
    description:
      "Violet border — speed reduced to 0; ends if grappler is incapacitated.",
  },
  incapacitated: {
    condition: "Incapacitated",
    color: "#9ca3af",
    style: "solid",
    description:
      "Cool grey border — cannot take actions or reactions.",
  },
  invisible: {
    condition: "Invisible",
    color: "#e2e8f0",
    style: "dashed",
    description:
      "White dashed border (semi-transparent token) — impossible to see without special sense.",
  },
  paralyzed: {
    condition: "Paralyzed",
    color: "#fbbf24",
    style: "solid",
    description:
      "Yellow border — incapacitated; attacks against it within 5 ft are auto-crits.",
  },
  petrified: {
    condition: "Petrified",
    color: "#78716c",
    style: "solid",
    description:
      "Stone grey border — transformed into solid inanimate substance.",
  },
  poisoned: {
    condition: "Poisoned",
    color: "#22c55e",
    style: "solid",
    description:
      "Green border — disadvantage on attack rolls and ability checks.",
  },
  prone: {
    condition: "Prone",
    color: "#f97316",
    style: "solid",
    description:
      "Orange border — disadvantage on attacks; attacks within 5 ft have advantage against it.",
  },
  restrained: {
    condition: "Restrained",
    color: "#3b82f6",
    style: "solid",
    description:
      "Blue border — speed 0; attack rolls against it have advantage, its attacks have disadvantage.",
  },
  stunned: {
    condition: "Stunned",
    color: "#eab308",
    style: "solid",
    description:
      "Gold border — incapacitated; fails STR/DEX saves; attacks against it have advantage.",
  },
  unconscious: {
    condition: "Unconscious",
    color: "#ef4444",
    style: "solid",
    description:
      "Red border — incapacitated, drops everything, falls prone; attacks within 5 ft are auto-crits.",
  },
};

// ---------------------------------------------------------------------------
// 5. AREA_OF_EFFECT
// ---------------------------------------------------------------------------

export const AREA_OF_EFFECT = {
  line: {
    id: "line",
    label: "Line",
    width: 5, // ft
    description:
      "A line is 5 ft wide. Extend from the origin point to the specified length. Any creature whose space is crossed is affected.",
    gridMeasurement:
      "Draw a 1-square-wide corridor from origin in a straight direction. Length ÷ 5 = number of squares.",
    parameters: ["length"],
  },
  cone: {
    id: "cone",
    label: "Cone",
    angle: 53.13, // degrees — PHB cone approximation
    description:
      "A cone originates at a point and widens at 53.13° (approximately 1:1 width-to-length ratio). At any given distance L, the width is also L.",
    gridMeasurement:
      "On a grid, count a square as affected if its centre falls within the cone. Width at end equals the length. Use a 45° approximation for hex/square grids.",
    parameters: ["length"],
  },
  cube: {
    id: "cube",
    label: "Cube",
    description:
      "A cube extends from an origin point or from the edge of a space. The edge length defines all three dimensions.",
    gridMeasurement:
      "Edge length ÷ 5 = squares per side. Origin can be a corner, an edge, or a point in space per the spell description.",
    parameters: ["edgeLength"],
  },
  sphere: {
    id: "sphere",
    label: "Sphere / Circle",
    description:
      "A sphere radiates outward from a point. On a 2D map this appears as a circle. A square is included if its centre is within the radius.",
    gridMeasurement:
      "Radius ÷ 5 = radius in squares. Count a square as inside the sphere if the distance from the origin to its centre ≤ radius.",
    parameters: ["radius"],
  },
  cylinder: {
    id: "cylinder",
    label: "Cylinder",
    description:
      "A cylinder has a circular cross-section (defined by radius) and a vertical height. On a flat map, treat the same as a sphere/circle per floor.",
    gridMeasurement:
      "Radius ÷ 5 = radius in squares. Height is relevant for flying or multi-level combat. Measure circle on each affected vertical layer.",
    parameters: ["radius", "height"],
  },
};

// ---------------------------------------------------------------------------
// 6. TOKEN_STATUS_MARKERS
// ---------------------------------------------------------------------------

export const TOKEN_STATUS_MARKERS = {
  bloodied: {
    id: "bloodied",
    label: "Bloodied",
    trigger: "hp_50_percent",
    ringColor: "#ef4444",
    ringStyle: "solid",
    opacity: 1,
    overlay: null,
    animate: false,
    description: "HP has dropped to 50% or below. Red ring around token.",
  },
  critical: {
    id: "critical",
    label: "Critical",
    trigger: "hp_25_percent",
    ringColor: "#ef4444",
    ringStyle: "solid",
    opacity: 1,
    overlay: null,
    animate: true,
    animationType: "pulse",
    description:
      "HP has dropped to 25% or below. Pulsing red ring indicates imminent danger.",
  },
  dead: {
    id: "dead",
    label: "Dead",
    trigger: "hp_zero_failed_saves",
    ringColor: "#1f2937",
    ringStyle: "solid",
    opacity: 0.5,
    overlay: "skull",
    animate: false,
    description:
      "Creature is dead. Skull overlay; token desaturated and semi-transparent.",
  },
  concentrating: {
    id: "concentrating",
    label: "Concentrating",
    trigger: "concentration_active",
    ringColor: "#3b82f6",
    ringStyle: "solid",
    opacity: 1,
    overlay: null,
    animate: false,
    description:
      "Creature is maintaining concentration on a spell. Blue ring around token.",
  },
  hidden: {
    id: "hidden",
    label: "Hidden",
    trigger: "hidden_from_enemies",
    ringColor: null,
    ringStyle: null,
    opacity: 0.4,
    overlay: null,
    animate: false,
    description:
      "Creature is hidden. Token rendered at 40% opacity (visible to owning player/DM only).",
  },
};

// ---------------------------------------------------------------------------
// EXPORTED UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * calculateDistance
 * Returns the distance in feet between two grid positions.
 *
 * @param {number} x1         - Origin column (grid squares, 0-indexed)
 * @param {number} y1         - Origin row (grid squares, 0-indexed)
 * @param {number} x2         - Target column
 * @param {number} y2         - Target row
 * @param {number} gridSize   - Feet per grid square (default 5)
 * @param {string} diagonalRule - "standard" | "variant" | "euclidean"
 * @returns {number} Distance in feet
 */
export function calculateDistance(
  x1,
  y1,
  x2,
  y2,
  gridSize = 5,
  diagonalRule = "standard"
) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const rule = MEASUREMENT_RULES[diagonalRule] ?? MEASUREMENT_RULES.standard;
  const distanceInSquares = rule.formula(dx, dy);
  return distanceInSquares * gridSize;
}

/**
 * getCoverBonus
 * Returns the AC and DEX save bonuses granted by a cover type.
 *
 * @param {string} coverType - "none" | "half" | "three_quarters" | "full"
 * @returns {{ acBonus: number|null, dexSaveBonus: number|null, label: string, description: string }}
 */
export function getCoverBonus(coverType) {
  const cover = COVER_TYPES[coverType];
  if (!cover) {
    console.warn(`getCoverBonus: unknown coverType "${coverType}"`);
    return COVER_TYPES.none;
  }
  return {
    acBonus: cover.acBonus,
    dexSaveBonus: cover.dexSaveBonus,
    label: cover.label,
    description: cover.description,
    visualHint: cover.visualHint,
  };
}

/**
 * getMovementCost
 * Returns how many feet of movement it costs to travel 1 foot through the given terrain.
 * Handles special speeds (climb/swim) that reduce cost back to 1:1.
 *
 * @param {string}  terrainType     - Key from MOVEMENT_COSTS
 * @param {boolean} hasClimbSpeed   - Creature has a designated climb speed
 * @param {boolean} hasSwimSpeed    - Creature has a designated swim speed
 * @returns {{ costPerFoot: number|string, label: string, description: string }}
 */
export function getMovementCost(
  terrainType,
  hasClimbSpeed = false,
  hasSwimSpeed = false
) {
  const terrain = MOVEMENT_COSTS[terrainType];
  if (!terrain) {
    console.warn(`getMovementCost: unknown terrainType "${terrainType}"`);
    return { costPerFoot: 1, label: "Unknown", description: "Defaulting to normal terrain." };
  }

  let costPerFoot;

  if (terrain.costType === "half_speed") {
    costPerFoot = "half_speed"; // caller must subtract speed/2 from remaining movement
  } else if (terrainType === "climbing" && hasClimbSpeed) {
    costPerFoot = MOVEMENT_COSTS.climbing.specialSpeedMultiplier ?? 1;
  } else if (terrainType === "swimming" && hasSwimSpeed) {
    costPerFoot = MOVEMENT_COSTS.swimming.specialSpeedMultiplier ?? 1;
  } else {
    costPerFoot = terrain.costMultiplier;
  }

  return {
    costPerFoot,
    label: terrain.label,
    description: terrain.description,
  };
}

/**
 * getConditionColor
 * Returns the token border color (and style) for a given condition name.
 *
 * @param {string} conditionName - e.g. "blinded", "charmed" (case-insensitive)
 * @returns {{ color: string, style: string, condition: string, description: string } | null}
 */
export function getConditionColor(conditionName) {
  const key = conditionName?.toLowerCase().replace(/\s+/g, "_");
  const entry = CONDITION_TOKEN_COLORS[key];
  if (!entry) {
    console.warn(`getConditionColor: unknown condition "${conditionName}"`);
    return null;
  }
  return { ...entry };
}

/**
 * calculateAoE
 * Returns the set of grid squares (as {col, row} objects) affected by an area of effect.
 *
 * @param {string} shape    - "line" | "cone" | "cube" | "sphere" | "cylinder"
 * @param {{ col: number, row: number }} origin - Grid origin square (0-indexed)
 * @param {Object} size     - Shape-specific dimensions in feet:
 *                            line:     { length }
 *                            cone:     { length }
 *                            cube:     { edgeLength }
 *                            sphere:   { radius }
 *                            cylinder: { radius, height } (height informational only for 2D)
 * @param {number} gridSize - Feet per grid square (default 5)
 * @param {number} [directionDeg=0] - Direction angle in degrees (0 = east/right) for line/cone
 * @returns {{ squares: Array<{col:number,row:number}>, meta: Object }}
 */
export function calculateAoE(shape, origin, size, gridSize = 5, directionDeg = 0) {
  const squares = [];
  const aoe = AREA_OF_EFFECT[shape];

  if (!aoe) {
    console.warn(`calculateAoE: unknown shape "${shape}"`);
    return { squares, meta: {} };
  }

  const { col: ox, row: oy } = origin;
  const dirRad = (directionDeg * Math.PI) / 180;

  switch (shape) {
    case "line": {
      const lengthSquares = (size.length ?? 30) / gridSize;
      const lineWidthSquares = (aoe.width ?? 5) / gridSize; // typically 1
      // Step along direction vector
      for (let i = 1; i <= lengthSquares; i++) {
        const cx = ox + Math.round(Math.cos(dirRad) * i);
        const cy = oy + Math.round(Math.sin(dirRad) * i);
        // Include perpendicular squares for width > 1
        const halfW = Math.floor(lineWidthSquares / 2);
        for (let w = -halfW; w <= halfW; w++) {
          const px = cx + Math.round(Math.sin(dirRad) * w);
          const py = cy - Math.round(Math.cos(dirRad) * w);
          if (!squares.find((s) => s.col === px && s.row === py)) {
            squares.push({ col: px, row: py });
          }
        }
      }
      break;
    }

    case "cone": {
      const lengthSquares = (size.length ?? 15) / gridSize;
      const halfAngle = (aoe.angle / 2) * (Math.PI / 180); // ~26.57°
      for (let dc = -lengthSquares; dc <= lengthSquares; dc++) {
        for (let dr = -lengthSquares; dr <= lengthSquares; dr++) {
          const dist = Math.sqrt(dc * dc + dr * dr);
          if (dist > lengthSquares) continue;
          // Angle from direction to this square
          const squareAngle = Math.atan2(dr, dc);
          let angleDiff = squareAngle - dirRad;
          // Normalize to [-π, π]
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
          if (Math.abs(angleDiff) <= halfAngle) {
            squares.push({ col: ox + dc, row: oy + dr });
          }
        }
      }
      break;
    }

    case "cube": {
      const halfEdge = ((size.edgeLength ?? 15) / gridSize) / 2;
      // Origin is one corner; iterate over edge-length squares
      const edgeSq = (size.edgeLength ?? 15) / gridSize;
      for (let dc = 0; dc < edgeSq; dc++) {
        for (let dr = 0; dr < edgeSq; dr++) {
          squares.push({ col: ox + dc, row: oy + dr });
        }
      }
      void halfEdge; // suppress unused warning — alternative centred usage possible
      break;
    }

    case "sphere":
    case "cylinder": {
      const radiusSquares = (size.radius ?? 10) / gridSize;
      for (let dc = -Math.ceil(radiusSquares); dc <= Math.ceil(radiusSquares); dc++) {
        for (let dr = -Math.ceil(radiusSquares); dr <= Math.ceil(radiusSquares); dr++) {
          // Use centre-to-centre Euclidean distance
          const dist = Math.sqrt(dc * dc + dr * dr);
          if (dist <= radiusSquares) {
            squares.push({ col: ox + dc, row: oy + dr });
          }
        }
      }
      break;
    }

    default:
      break;
  }

  return {
    squares,
    meta: {
      shape,
      origin,
      size,
      gridSize,
      directionDeg,
      squareCount: squares.length,
      label: aoe.label,
    },
  };
}

/**
 * getTokenStatus
 * Determines which status markers should be displayed on a token.
 *
 * @param {number}   currentHP   - Current hit points
 * @param {number}   maxHP       - Maximum hit points
 * @param {string[]} conditions  - Array of active condition names (from CONDITION_TOKEN_COLORS keys)
 * @param {Object}   [flags={}]  - Optional flags: { isConcentrating, isHidden, isDead }
 * @returns {{
 *   markers: Array<typeof TOKEN_STATUS_MARKERS[string]>,
 *   conditionColors: Array<{ condition:string, color:string, style:string }>,
 *   hpPercent: number
 * }}
 */
export function getTokenStatus(currentHP, maxHP, conditions = [], flags = {}) {
  const markers = [];
  const hpPercent = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;

  // HP-based markers (evaluated from most severe to least; only show the highest)
  if (flags.isDead || currentHP <= 0) {
    markers.push(TOKEN_STATUS_MARKERS.dead);
  } else if (hpPercent <= 25) {
    markers.push(TOKEN_STATUS_MARKERS.critical);
  } else if (hpPercent <= 50) {
    markers.push(TOKEN_STATUS_MARKERS.bloodied);
  }

  // Concentration
  if (flags.isConcentrating) {
    markers.push(TOKEN_STATUS_MARKERS.concentrating);
  }

  // Hidden
  if (flags.isHidden) {
    markers.push(TOKEN_STATUS_MARKERS.hidden);
  }

  // Condition colors
  const conditionColors = conditions
    .map((c) => getConditionColor(c))
    .filter(Boolean);

  return {
    markers,
    conditionColors,
    hpPercent: Math.round(hpPercent * 10) / 10,
  };
}
