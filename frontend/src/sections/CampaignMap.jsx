import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin, Search, Eye, EyeOff, Users, Scroll, Crosshair,
  Swords, Home, Castle, Skull, Church, Trees, Mountain,
  Building2, BookOpen, Shield, Compass, ZoomIn, ZoomOut,
  X, ChevronRight, AlertCircle, Loader2, Layers, ImagePlus, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Wifi } from 'lucide-react';
import { getNPCs } from '../api/npcs';
import { getQuests } from '../api/quests';
import { getLoreNotes } from '../api/lore';
import { getOverview } from '../api/overview';
import { useAppMode } from '../contexts/ModeContext';
import { useParty } from '../contexts/PartyContext';

// ─── Map background images (CC-licensed, see assets/maps/ATTRIBUTION.md) ────
import mapGoblinMine from '../assets/maps/goblin-mine.jpg';
import mapCursedVillage from '../assets/maps/cursed-village.jpg';
import mapDragonCoast from '../assets/maps/dragon-coast.jpg';
import mapFeywildCrossing from '../assets/maps/feywild-forest.jpg';
import mapShadowAcademy from '../assets/maps/shadow-academy.jpg';
import mapSiegeIronhold from '../assets/maps/siege-ironhold.jpg';

// ─── Location type config ───────────────────────────────────────────
const LOCATION_TYPES = {
  town:       { color: '#4ade80', label: 'Town',       icon: Home },
  city:       { color: '#60a5fa', label: 'City',       icon: Building2 },
  dungeon:    { color: '#ef4444', label: 'Dungeon',    icon: Skull },
  inn:        { color: '#f59e0b', label: 'Inn',        icon: Home },
  temple:     { color: '#c084fc', label: 'Temple',     icon: Church },
  wilderness: { color: '#22c55e', label: 'Wilderness', icon: Trees },
  lair:       { color: '#dc2626', label: 'Lair',       icon: Skull },
  road:       { color: '#8b7355', label: 'Road',       icon: Compass },
  campus:     { color: '#818cf8', label: 'Campus',     icon: BookOpen },
  fortress:   { color: '#94a3b8', label: 'Fortress',   icon: Shield },
  district:   { color: '#38bdf8', label: 'District',   icon: Building2 },
  landmark:   { color: '#a78bfa', label: 'Landmark',   icon: Mountain },
  shop:       { color: '#fbbf24', label: 'Shop',       icon: Home },
  outskirts:  { color: '#86efac', label: 'Outskirts',  icon: Trees },
  other:      { color: '#9ca3af', label: 'Other',      icon: MapPin },
};

function getLocationType(type) {
  return LOCATION_TYPES[type] || LOCATION_TYPES.other;
}

// ─── Premade campaign map data ──────────────────────────────────────
const PREMADE_MAPS = {
  'The Goblin Mine': {
    bounds: { width: 900, height: 700 },
    backgroundImage: mapGoblinMine,
    locations: [
      { id: 'brindlewood', name: 'Brindlewood Village', type: 'town', x: 250, y: 380, description: 'A small farming village along the North Trade Road, known for its apple orchards and friendly folk.' },
      { id: 'dusty-flagon', name: 'The Dusty Flagon Inn', type: 'inn', x: 290, y: 340, parent: 'brindlewood', description: 'The only tavern in Brindlewood. Warm hearth, cold ale, and plenty of rumors.' },
      { id: 'shrine-morning', name: 'Shrine of the Morning Light', type: 'temple', x: 210, y: 340, parent: 'brindlewood', description: 'A modest stone shrine tended by a single acolyte. Offers healing and blessings to travelers.' },
      { id: 'iron-fang-mine', name: 'Iron Fang Mine', type: 'dungeon', x: 650, y: 200, description: 'An abandoned iron mine now occupied by goblins. Three levels deep with increasingly dangerous tunnels.' },
      { id: 'north-trade-road', name: 'North Trade Road', type: 'road', x: 450, y: 460, description: 'The main trade artery connecting Saltmere to Crosshaven. Recently plagued by goblin raids.' },
      { id: 'forest-entrance', name: 'Forest Near Mine Entrance', type: 'wilderness', x: 530, y: 280, description: 'Dense woodland surrounding the mine entrance. Goblin sentries lurk among the trees.' },
      { id: 'thornhill-ridge', name: 'Thornhill Ridge', type: 'wilderness', x: 750, y: 120, description: 'A rocky ridge overlooking the mine. Offers a vantage point but treacherous footing.' },
      { id: 'saltmere', name: 'Saltmere (distant)', type: 'town', x: 100, y: 560, description: 'A larger market town to the south. Merchants from here have reported missing caravans.' },
      { id: 'crosshaven', name: 'Crosshaven (distant)', type: 'town', x: 800, y: 560, description: 'A crossroads town to the east. News of the goblin threat has reached its walls.' },
    ],
    paths: [
      { from: 'saltmere', to: 'brindlewood', style: 'road' },
      { from: 'brindlewood', to: 'crosshaven', style: 'road' },
      { from: 'brindlewood', to: 'forest-entrance', style: 'trail' },
      { from: 'forest-entrance', to: 'iron-fang-mine', style: 'trail' },
      { from: 'iron-fang-mine', to: 'thornhill-ridge', style: 'trail' },
      { from: 'brindlewood', to: 'north-trade-road', style: 'road' },
    ],
  },

  'The Cursed Village': {
    bounds: { width: 900, height: 700 },
    backgroundImage: mapCursedVillage,
    locations: [
      { id: 'hollowmere', name: 'Hollowmere Village', type: 'town', x: 400, y: 300, description: 'A fog-shrouded village where the dead have begun to rise. Fear grips every household.' },
      { id: 'cemetery', name: 'Hollowmere Cemetery', type: 'dungeon', x: 600, y: 180, description: 'The ancient village graveyard. Freshly disturbed graves and an oppressive aura of necromancy.' },
      { id: 'sleeping-fox', name: 'The Sleeping Fox', type: 'inn', x: 360, y: 260, parent: 'hollowmere', description: 'A cozy inn with a nervous innkeeper. The common room buzzes with frightened whispers.' },
      { id: 'crooked-lantern', name: 'The Crooked Lantern', type: 'shop', x: 440, y: 260, parent: 'hollowmere', description: 'An eccentric bookshop filled with occult tomes. The owner knows more than she lets on.' },
      { id: 'guard-barracks', name: 'Guard Barracks', type: 'fortress', x: 350, y: 350, parent: 'hollowmere', description: 'A small stone building housing the village guard. Morale is dangerously low.' },
      { id: 'old-marga', name: "Old Marga's Hut", type: 'outskirts', x: 200, y: 420, description: 'A ramshackle hut on the village outskirts. Old Marga is rumored to practice folk magic.' },
      { id: 'stillwater-lake', name: 'Stillwater Lake', type: 'wilderness', x: 150, y: 250, description: 'An eerily calm lake. On moonless nights, strange lights drift beneath the surface.' },
      { id: 'thorne-mausoleum', name: 'Thorne Mausoleum', type: 'dungeon', x: 650, y: 130, parent: 'cemetery', description: 'The grand mausoleum of the Thorne family. Something stirs within its sealed doors.' },
      { id: 'hidden-crypt', name: 'Hidden Crypt', type: 'dungeon', x: 700, y: 80, parent: 'cemetery', description: 'A secret crypt beneath the Thorne Mausoleum. The source of the undead curse lies here.' },
    ],
    paths: [
      { from: 'hollowmere', to: 'cemetery', style: 'trail' },
      { from: 'cemetery', to: 'thorne-mausoleum', style: 'trail' },
      { from: 'thorne-mausoleum', to: 'hidden-crypt', style: 'hidden' },
      { from: 'hollowmere', to: 'old-marga', style: 'trail' },
      { from: 'hollowmere', to: 'stillwater-lake', style: 'trail' },
    ],
  },

  'The Dragon Coast': {
    bounds: { width: 1000, height: 750 },
    backgroundImage: mapDragonCoast,
    locations: [
      { id: 'dragontide', name: 'Dragontide', type: 'city', x: 400, y: 350, description: 'A bustling port city built around a natural harbor. Trade, intrigue, and danger fill its streets.' },
      { id: 'harbor-district', name: 'Harbor District', type: 'district', x: 350, y: 400, parent: 'dragontide', description: 'The beating heart of Dragontide. Ships from across the coast dock here daily.' },
      { id: 'market-quarter', name: 'Market Quarter', type: 'district', x: 440, y: 310, parent: 'dragontide', description: 'Busy markets selling everything from spices to spell components.' },
      { id: 'council-hill', name: 'Council Hill', type: 'landmark', x: 400, y: 280, parent: 'dragontide', description: 'The seat of government. The Council of Captains meets in the grand hall atop the hill.' },
      { id: 'docks-district', name: 'Docks District', type: 'district', x: 300, y: 440, parent: 'dragontide', description: 'Rougher than the Harbor District. Warehouses, fishmongers, and shady deals.' },
      { id: 'pier-13', name: 'Pier 13', type: 'landmark', x: 250, y: 480, parent: 'dragontide', description: 'An infamous pier known as a smuggling hub. The harbormaster turns a blind eye for a price.' },
      { id: 'sirens-rest', name: "The Siren's Rest Tavern", type: 'inn', x: 360, y: 360, parent: 'dragontide', description: 'A lively tavern popular with sailors and adventurers. The owner is a retired pirate.' },
      { id: 'blackwater-estate', name: 'Blackwater Estate', type: 'landmark', x: 500, y: 260, parent: 'dragontide', description: 'A foreboding mansion belonging to the mysterious Blackwater family.' },
      { id: 'arcane-consortium', name: 'Arcane Consortium Tower', type: 'campus', x: 460, y: 380, parent: 'dragontide', description: 'A tall spire of blue stone. The local mages guild operates from here.' },
      { id: 'thunderclaw-cliffs', name: 'Thunderclaw Cliffs', type: 'lair', x: 750, y: 150, description: 'Jagged sea cliffs battered by storms. A young dragon has claimed the highest cave as its lair.' },
      { id: 'sapphire-coast', name: 'Sapphire Coast', type: 'wilderness', x: 600, y: 500, description: 'A stretch of beautiful coastline with hidden coves and treacherous rocks.' },
      { id: 'saltspray', name: 'Saltspray Village', type: 'town', x: 700, y: 400, description: 'A small fishing village east of Dragontide. Simple folk who fear the dragon above all.' },
    ],
    paths: [
      { from: 'dragontide', to: 'saltspray', style: 'road' },
      { from: 'saltspray', to: 'thunderclaw-cliffs', style: 'trail' },
      { from: 'dragontide', to: 'sapphire-coast', style: 'road' },
      { from: 'sapphire-coast', to: 'saltspray', style: 'trail' },
      { from: 'harbor-district', to: 'docks-district', style: 'road' },
      { from: 'docks-district', to: 'pier-13', style: 'road' },
    ],
  },

  'The Feywild Crossing': {
    bounds: { width: 950, height: 700 },
    backgroundImage: mapFeywildCrossing,
    locations: [
      { id: 'havenbrook', name: 'Havenbrook', type: 'town', x: 250, y: 400, description: 'A peaceful farming village on the edge of the Whimsy Wood. Recently troubled by strange fey incursions.' },
      { id: 'wynn-farm', name: 'Wynn Farm - North Field', type: 'landmark', x: 300, y: 340, description: 'Ground zero of the Feywild breach. Crops grow in impossible colors and time flows strangely.' },
      { id: 'bushel-barrel', name: 'The Bushel and Barrel', type: 'inn', x: 220, y: 440, parent: 'havenbrook', description: 'The village tavern. A gathering place for worried farmers and curious travelers.' },
      { id: 'village-hall', name: 'Village Hall', type: 'landmark', x: 280, y: 440, parent: 'havenbrook', description: 'Where the village council meets. Currently the center of crisis management.' },
      { id: 'temple-chauntea', name: 'Temple of Chauntea', type: 'temple', x: 200, y: 380, parent: 'havenbrook', description: 'A rustic temple devoted to the harvest goddess. The priest senses the natural order unraveling.' },
      { id: 'briar-gate', name: 'The Feywild Threshold - Briar Gate', type: 'landmark', x: 500, y: 280, description: 'A shimmering archway of living thorns. The crossing point between the Material Plane and the Feywild.' },
      { id: 'amber-pavilion', name: 'The Amber Pavilion', type: 'temple', x: 700, y: 180, description: 'A magnificent fey court of golden light. The Archfey holds audience here amid eternal twilight.' },
      { id: 'whimsy-wood', name: 'Whimsy Wood', type: 'wilderness', x: 450, y: 350, description: 'An enchanted forest where the boundary between planes is thin. Trees whisper and paths shift.' },
      { id: 'gossamer-bridge', name: 'Gossamer Bridge', type: 'landmark', x: 600, y: 230, description: 'A bridge of spun moonlight spanning a bottomless chasm in the Feywild.' },
      { id: 'standing-stones', name: 'Standing Stones', type: 'landmark', x: 350, y: 280, description: 'Ancient menhirs carved with druidic runes. They resonate with fey energy since the breach.' },
    ],
    paths: [
      { from: 'havenbrook', to: 'wynn-farm', style: 'trail' },
      { from: 'havenbrook', to: 'whimsy-wood', style: 'trail' },
      { from: 'wynn-farm', to: 'standing-stones', style: 'trail' },
      { from: 'standing-stones', to: 'briar-gate', style: 'fey' },
      { from: 'whimsy-wood', to: 'briar-gate', style: 'trail' },
      { from: 'briar-gate', to: 'gossamer-bridge', style: 'fey' },
      { from: 'gossamer-bridge', to: 'amber-pavilion', style: 'fey' },
    ],
  },

  'The Shadow Academy': {
    bounds: { width: 900, height: 700 },
    backgroundImage: mapShadowAcademy,
    locations: [
      { id: 'valdris-academy', name: 'Valdris Academy', type: 'campus', x: 400, y: 350, description: 'A prestigious academy of the arcane arts, perched in the Silvermist Valley. Something dark festers within.' },
      { id: 'headmaster-tower', name: "Headmaster's Tower", type: 'landmark', x: 400, y: 250, parent: 'valdris-academy', description: 'The tallest spire of the academy. The Headmaster has not been seen for days.' },
      { id: 'grand-archive', name: 'Grand Archive', type: 'campus', x: 320, y: 310, parent: 'valdris-academy', description: 'A vast library containing centuries of magical knowledge. Some sections are sealed.' },
      { id: 'restricted-wing', name: 'Restricted Wing', type: 'dungeon', x: 280, y: 270, parent: 'valdris-academy', description: 'A forbidden section of the Archive. Wards have been failing, and shadows seep from the cracks.' },
      { id: 'dormitories', name: 'Student Dormitories', type: 'landmark', x: 480, y: 400, parent: 'valdris-academy', description: 'Where students live and study. Nightmares have become increasingly common.' },
      { id: 'praxis-yards', name: 'Praxis Yards', type: 'landmark', x: 350, y: 420, parent: 'valdris-academy', description: 'Open training grounds for practical spellwork. Scorch marks and ward circles cover the stone.' },
      { id: 'shadow-classroom', name: 'Shadow Studies Classroom', type: 'campus', x: 460, y: 300, parent: 'valdris-academy', description: 'Where shadow magic is taught. The room has grown darker and colder each week.' },
      { id: 'faculty-towers', name: 'Faculty Towers', type: 'landmark', x: 340, y: 370, parent: 'valdris-academy', description: 'Private quarters and offices for the senior faculty. Tensions run high.' },
      { id: 'silvermist-valley', name: 'Silvermist Valley', type: 'wilderness', x: 650, y: 500, description: 'The misty valley surrounding the academy. Strange shadow creatures have been spotted at night.' },
      { id: 'the-hollow', name: 'The Hollow', type: 'dungeon', x: 200, y: 150, description: 'A shadow demiplane accessible through the Restricted Wing. The source of the creeping darkness.' },
    ],
    paths: [
      { from: 'valdris-academy', to: 'silvermist-valley', style: 'road' },
      { from: 'grand-archive', to: 'restricted-wing', style: 'hidden' },
      { from: 'restricted-wing', to: 'the-hollow', style: 'hidden' },
      { from: 'headmaster-tower', to: 'shadow-classroom', style: 'road' },
      { from: 'dormitories', to: 'praxis-yards', style: 'road' },
    ],
  },

  'The Siege of Ironhold': {
    bounds: { width: 950, height: 750 },
    backgroundImage: mapSiegeIronhold,
    locations: [
      { id: 'mt-anvilspire', name: 'Mount Anvilspire', type: 'landmark', x: 400, y: 100, description: 'A towering peak of black stone. The dwarven city of Ironhold is carved into its face.' },
      { id: 'upper-city', name: 'Ironhold Upper City', type: 'fortress', x: 400, y: 200, description: 'The seat of dwarven nobility. Grand halls and the Throne Room overlook the lower levels.' },
      { id: 'middle-city', name: 'Ironhold Middle City', type: 'fortress', x: 400, y: 300, description: 'The commercial heart of Ironhold. Forges, markets, and guildhalls bustle with activity.' },
      { id: 'lower-city', name: 'Ironhold Lower City', type: 'fortress', x: 400, y: 400, description: 'The first line of defense. Barracks, armories, and the great Eastern Wall.' },
      { id: 'throne-hall', name: 'Throne Hall', type: 'landmark', x: 340, y: 180, parent: 'upper-city', description: 'Where the Dwarven King holds court. Ancient banners line the walls.' },
      { id: 'war-council', name: 'War Council Chamber', type: 'landmark', x: 460, y: 180, parent: 'upper-city', description: 'A strategic command center with a massive relief map of the surrounding terrain.' },
      { id: 'eastern-wall', name: 'Eastern Wall', type: 'fortress', x: 550, y: 400, description: 'The great defensive wall facing the orc siege camp. Under constant bombardment.' },
      { id: 'siege-camp', name: 'Siege Camp', type: 'lair', x: 700, y: 450, description: 'The massive orc encampment. Thousands of warriors, siege engines, and war drums.' },
      { id: 'bloodtide-tent', name: 'Bloodtide War Tent', type: 'lair', x: 750, y: 400, parent: 'siege-camp', description: 'The command tent of Warchief Bloodtide. Guarded by his elite warriors.' },
      { id: 'bone-circle', name: 'Bone Circle', type: 'temple', x: 700, y: 520, parent: 'siege-camp', description: 'A ritual circle of bones where orc shamans call upon dark powers.' },
      { id: 'sealed-tunnels', name: 'Sealed Tunnels', type: 'dungeon', x: 300, y: 500, description: 'Ancient tunnels beneath Ironhold, sealed generations ago. Something lurks in the deep.' },
      { id: 'aboleth-vault', name: "Aboleth's Vault", type: 'dungeon', x: 200, y: 600, description: 'A flooded cavern deep beneath the mountain. An aboleth of immense age waits here.' },
      { id: 'hot-springs', name: 'Hot Springs', type: 'wilderness', x: 250, y: 350, description: 'Natural hot springs used by dwarves for centuries. Tunnels branch off into the deep.' },
    ],
    paths: [
      { from: 'mt-anvilspire', to: 'upper-city', style: 'road' },
      { from: 'upper-city', to: 'middle-city', style: 'road' },
      { from: 'middle-city', to: 'lower-city', style: 'road' },
      { from: 'lower-city', to: 'eastern-wall', style: 'road' },
      { from: 'eastern-wall', to: 'siege-camp', style: 'trail' },
      { from: 'lower-city', to: 'sealed-tunnels', style: 'hidden' },
      { from: 'sealed-tunnels', to: 'aboleth-vault', style: 'hidden' },
      { from: 'lower-city', to: 'hot-springs', style: 'trail' },
      { from: 'hot-springs', to: 'sealed-tunnels', style: 'hidden' },
    ],
  },
};

// ─── Path style helpers ─────────────────────────────────────────────
function getPathStyle(style) {
  switch (style) {
    case 'road':   return { stroke: '#8b7355', strokeWidth: 3, dashArray: '8,4', opacity: 0.7 };
    case 'trail':  return { stroke: '#6b5b3a', strokeWidth: 2, dashArray: '4,6', opacity: 0.5 };
    case 'hidden': return { stroke: '#4a3a6a', strokeWidth: 1.5, dashArray: '2,8', opacity: 0.35 };
    case 'fey':    return { stroke: '#c084fc', strokeWidth: 2, dashArray: '6,3', opacity: 0.6 };
    default:       return { stroke: '#8b7355', strokeWidth: 2, dashArray: '6,4', opacity: 0.5 };
  }
}

// ─── Force-directed layout for homebrew ─────────────────────────────
function forceDirectedLayout(nodes, width, height, iterations = 120) {
  const k = Math.sqrt((width * height) / Math.max(nodes.length, 1));
  const positions = nodes.map((_, i) => ({
    x: width * 0.15 + Math.random() * width * 0.7,
    y: height * 0.15 + Math.random() * height * 0.7,
    vx: 0, vy: 0,
  }));

  for (let iter = 0; iter < iterations; iter++) {
    const temp = 0.1 * (1 - iter / iterations);
    // repulsion
    for (let i = 0; i < nodes.length; i++) {
      positions[i].vx = 0;
      positions[i].vy = 0;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (k * k) / dist;
        positions[i].vx += (dx / dist) * force;
        positions[i].vy += (dy / dist) * force;
      }
    }
    // attraction between related
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].group && nodes[i].group === nodes[j].group) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = (dist * dist) / k * 0.05;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          positions[i].vx += fx;
          positions[i].vy += fy;
          positions[j].vx -= fx;
          positions[j].vy -= fy;
        }
      }
    }
    // apply
    for (let i = 0; i < nodes.length; i++) {
      const mag = Math.sqrt(positions[i].vx ** 2 + positions[i].vy ** 2);
      if (mag > 0) {
        const cap = Math.min(mag, temp * width);
        positions[i].x += (positions[i].vx / mag) * cap;
        positions[i].y += (positions[i].vy / mag) * cap;
      }
      positions[i].x = Math.max(60, Math.min(width - 60, positions[i].x));
      positions[i].y = Math.max(60, Math.min(height - 60, positions[i].y));
    }
  }

  return nodes.map((n, i) => ({ ...n, x: Math.round(positions[i].x), y: Math.round(positions[i].y) }));
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: 'var(--font-ui)',
    color: '#e2e0ea',
    position: 'relative',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'rgba(11,9,20,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    zIndex: 10,
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '5px 10px',
    flex: '0 1 220px',
    minWidth: 140,
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e2e0ea',
    fontFamily: 'var(--font-ui)',
    fontSize: 13,
    width: '100%',
  },
  toggleBtn: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'var(--font-ui)',
    cursor: 'pointer',
    border: active ? '1px solid rgba(155,89,182,0.5)' : '1px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.04)',
    color: active ? '#c084fc' : '#9ca3af',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  }),
  zoomBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(ellipse at center, #2a1f0e 0%, #1a1225 60%, #0b0914 100%)',
    cursor: 'grab',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  detailPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 340,
    height: '100%',
    background: 'rgba(11,9,20,0.95)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backdropFilter: 'blur(12px)',
  },
  detailHeader: {
    padding: '16px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailBody: {
    padding: '14px 18px',
    flex: 1,
    overflowY: 'auto',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9b59b6',
    marginBottom: 8,
    fontFamily: 'var(--font-ui)',
  },
  card: {
    background: 'rgba(11,9,20,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '10px 14px',
    marginBottom: 8,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    background: 'rgba(11,9,20,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '12px 16px',
    zIndex: 15,
    backdropFilter: 'blur(8px)',
    maxWidth: 280,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9b59b6',
    marginBottom: 8,
    fontFamily: 'var(--font-ui)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  npcDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    border: '1px solid rgba(255,255,255,0.3)',
    flexShrink: 0,
  }),
  questMarker: {
    width: 10,
    height: 10,
    borderRadius: 2,
    background: '#f59e0b',
    border: '1px solid rgba(255,255,255,0.3)',
    transform: 'rotate(45deg)',
    flexShrink: 0,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 12,
    color: '#9ca3af',
    fontSize: 14,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 12,
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    padding: 40,
  },
};

// ─── NPC role colors ────────────────────────────────────────────────
const NPC_ROLE_COLORS = {
  ally: '#4ade80',
  enemy: '#ef4444',
  neutral: '#fbbf24',
  party: '#60a5fa',
};
function npcColor(role) {
  if (!role) return '#9ca3af';
  const lower = role.toLowerCase();
  return NPC_ROLE_COLORS[lower] || '#9ca3af';
}

// ─── Main Component ─────────────────────────────────────────────────
export default function CampaignMap({ characterId }) {
  // ── Mode & Party ───────────────────────────────────
  const { mode: appMode } = useAppMode();
  const party = useParty();
  const isDM = appMode === 'dm';

  // ── State ───────────────────────────────────────────
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [lore, setLore] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [loading, setLoading] = useState(true);

  const [mapData, setMapData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNPCs, setShowNPCs] = useState(true);
  const [showQuests, setShowQuests] = useState(true);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [customMapImage, setCustomMapImage] = useState(null); // user-uploaded map image
  const fileInputRef = useRef(null);
  const [revealedLocations, setRevealedLocations] = useState(new Set()); // DM reveals locations for players

  // Pan & zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  // ── Load custom map image from localStorage ─────────
  useEffect(() => {
    if (!characterId) return;
    const saved = localStorage.getItem(`codex-custom-map-${characterId}`);
    if (saved) setCustomMapImage(saved);
  }, [characterId]);

  const handleMapUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setCustomMapImage(dataUrl);
      localStorage.setItem(`codex-custom-map-${characterId}`, dataUrl);
      toast.success('Custom map image set!');
    };
    reader.readAsDataURL(file);
  }, [characterId]);

  const clearCustomMap = useCallback(() => {
    setCustomMapImage(null);
    localStorage.removeItem(`codex-custom-map-${characterId}`);
    toast.success('Custom map image removed');
  }, [characterId]);

  // ── Data loading ────────────────────────────────────
  useEffect(() => {
    if (!characterId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [npcData, questData, loreData, overviewData] = await Promise.all([
          getNPCs(characterId),
          getQuests(characterId),
          getLoreNotes(characterId),
          getOverview(characterId),
        ]);
        if (cancelled) return;
        setNpcs(npcData || []);
        setQuests(questData || []);
        setLore(loreData || []);
        // Use campaign_name for premade map matching
        const campName = overviewData?.overview?.campaign_name || '';
        const charName = overviewData?.overview?.name || '';

        // If no campaign_name set, try to detect from imported data
        // (handles characters imported before the campaign_name fix)
        let detectedName = campName;
        if (!detectedName) {
          const premadeNames = Object.keys(PREMADE_MAPS);
          // Check lore titles for premade location names (e.g. "Havenbrook", "Ironhold")
          const allText = [
            ...(loreData || []).map(l => l.title + ' ' + (l.body || '')),
            ...(npcData || []).map(n => n.location || ''),
          ].join(' ').toLowerCase();

          for (const name of premadeNames) {
            const mapData = PREMADE_MAPS[name];
            // Check if multiple location names from this premade map appear in the data
            const matches = mapData.locations.filter(loc =>
              !loc.parent && allText.includes(loc.name.toLowerCase())
            );
            if (matches.length >= 2) {
              detectedName = name;
              break;
            }
          }
        }

        setCampaignName(detectedName || charName);
      } catch (err) {
        if (!cancelled) toast.error('Failed to load map data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [characterId]);

  // ── Receive DM's shared map (player mode) ───────────
  useEffect(() => {
    if (isDM || !party.sharedMapState) return;
    const shared = party.sharedMapState;
    setMapData({
      locations: shared.locations || [],
      paths: shared.paths || [],
      bounds: shared.bounds || { width: 900, height: 700 },
    });
    if (shared.revealedLocations) {
      setRevealedLocations(new Set(shared.revealedLocations));
    }
    if (shared.fogOfWar !== undefined) {
      setFogOfWar(shared.fogOfWar);
    }
    setCampaignName(shared.campaignName || '');
  }, [party.sharedMapState, isDM]);

  // ── Build map data ──────────────────────────────────
  useEffect(() => {
    if (loading) return;

    // Check if this is a premade campaign (fuzzy match — includes or exact)
    const nameL = (campaignName || '').toLowerCase().trim();
    const premade = nameL ? Object.entries(PREMADE_MAPS).find(
      ([key]) => {
        const keyL = key.toLowerCase();
        return nameL === keyL || nameL.includes(keyL) || keyL.includes(nameL);
      }
    ) : null;

    if (premade) {
      setMapData(premade[1]);
      // Center the map
      const bounds = premade[1].bounds;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPan({
          x: (rect.width - bounds.width) / 2,
          y: (rect.height - bounds.height) / 2,
        });
      }
      return;
    }

    // Homebrew: extract locations from data
    const locationMap = new Map();

    // From NPCs
    npcs.forEach(npc => {
      if (npc.location && npc.location.trim()) {
        const loc = npc.location.trim();
        if (!locationMap.has(loc)) {
          locationMap.set(loc, { id: slugify(loc), name: loc, type: 'other', group: null, description: '' });
        }
      }
    });

    // From Lore
    lore.forEach(note => {
      if (note.category && note.category.toLowerCase() === 'location') {
        const loc = note.title.trim();
        if (!locationMap.has(loc)) {
          locationMap.set(loc, { id: slugify(loc), name: loc, type: guessLocationType(loc, note.body), group: note.related_to || null, description: note.body || '' });
        } else {
          const existing = locationMap.get(loc);
          existing.description = existing.description || note.body || '';
          existing.type = existing.type === 'other' ? guessLocationType(loc, note.body) : existing.type;
          if (note.related_to) existing.group = note.related_to;
        }
      }
    });

    // From Quests
    quests.forEach(quest => {
      // Try to extract location from quest description or giver
      if (quest.giver) {
        const matchNpc = npcs.find(n => n.name === quest.giver);
        if (matchNpc && matchNpc.location) {
          const loc = matchNpc.location.trim();
          if (!locationMap.has(loc)) {
            locationMap.set(loc, { id: slugify(loc), name: loc, type: 'other', group: null, description: '' });
          }
        }
      }
    });

    if (locationMap.size === 0) {
      setMapData(null);
      return;
    }

    const locationArray = Array.from(locationMap.values());
    const width = 900;
    const height = 700;
    const positioned = forceDirectedLayout(locationArray, width, height);

    // Build paths between locations in same group
    const paths = [];
    const groups = new Map();
    positioned.forEach(loc => {
      if (loc.group) {
        if (!groups.has(loc.group)) groups.set(loc.group, []);
        groups.get(loc.group).push(loc.id);
      }
    });
    groups.forEach(members => {
      for (let i = 0; i < members.length - 1; i++) {
        paths.push({ from: members[i], to: members[i + 1], style: 'trail' });
      }
    });

    setMapData({ locations: positioned, paths, bounds: { width, height } });
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: (rect.width - width) / 2, y: (rect.height - height) / 2 });
    }
  }, [loading, campaignName, npcs, quests, lore]);

  // ── Helpers ─────────────────────────────────────────
  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function guessLocationType(name, body) {
    const text = (name + ' ' + (body || '')).toLowerCase();
    if (/tavern|inn|pub|bar/.test(text)) return 'inn';
    if (/temple|shrine|church|chapel/.test(text)) return 'temple';
    if (/dungeon|cave|crypt|mine|tomb|vault/.test(text)) return 'dungeon';
    if (/city|capital|metropolis/.test(text)) return 'city';
    if (/town|village|hamlet|settlement/.test(text)) return 'town';
    if (/forest|wood|wilderness|swamp|mountain|ridge|lake|coast|river/.test(text)) return 'wilderness';
    if (/castle|fortress|fort|wall|barracks|keep/.test(text)) return 'fortress';
    if (/lair|den|nest|hive/.test(text)) return 'lair';
    if (/academy|school|university|library|college/.test(text)) return 'campus';
    if (/road|path|trail|bridge/.test(text)) return 'road';
    if (/shop|store|market|emporium/.test(text)) return 'shop';
    if (/district|quarter|ward/.test(text)) return 'district';
    return 'other';
  }

  // ── Pan and zoom handlers ─────────────────────────
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-location]') || e.target.closest('[data-npc-pin]')) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ ...pan });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPan({
      x: panStart.x + (e.clientX - dragStart.x),
      y: panStart.y + (e.clientY - dragStart.y),
    });
  }, [dragging, dragStart, panStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.3, Math.min(3, z + delta)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Search filter ─────────────────────────────────
  const filteredLocations = useMemo(() => {
    if (!mapData) return [];
    if (!searchQuery.trim()) return mapData.locations;
    const q = searchQuery.toLowerCase();
    return mapData.locations.filter(l => l.name.toLowerCase().includes(q));
  }, [mapData, searchQuery]);

  const highlightedIds = useMemo(() => new Set(filteredLocations.map(l => l.id)), [filteredLocations]);

  // Focus on search result
  useEffect(() => {
    if (!searchQuery.trim() || !mapData) return;
    const match = mapData.locations.find(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({
        x: rect.width / 2 - match.x * zoom,
        y: rect.height / 2 - match.y * zoom,
      });
    }
  }, [searchQuery, mapData, zoom]);

  // ── NPC location mapping ──────────────────────────
  const npcsByLocation = useMemo(() => {
    const map = new Map();
    if (!mapData) return map;
    npcs.forEach(npc => {
      if (!npc.location) return;
      const loc = mapData.locations.find(l =>
        npc.location.toLowerCase().includes(l.name.toLowerCase()) ||
        l.name.toLowerCase().includes(npc.location.toLowerCase())
      );
      if (loc) {
        if (!map.has(loc.id)) map.set(loc.id, []);
        map.get(loc.id).push(npc);
      }
    });
    return map;
  }, [npcs, mapData]);

  // ── Quest location mapping ────────────────────────
  const questsByLocation = useMemo(() => {
    const map = new Map();
    if (!mapData) return map;
    quests.forEach(quest => {
      if (quest.giver) {
        const giverNpc = npcs.find(n => n.name === quest.giver);
        if (giverNpc && giverNpc.location) {
          const loc = mapData.locations.find(l =>
            giverNpc.location.toLowerCase().includes(l.name.toLowerCase()) ||
            l.name.toLowerCase().includes(giverNpc.location.toLowerCase())
          );
          if (loc) {
            if (!map.has(loc.id)) map.set(loc.id, []);
            map.get(loc.id).push(quest);
          }
        }
      }
    });
    return map;
  }, [quests, npcs, mapData]);

  // ── Lore by location ──────────────────────────────
  const loreByLocation = useMemo(() => {
    const map = new Map();
    if (!mapData) return map;
    lore.forEach(note => {
      const loc = mapData.locations.find(l =>
        l.name.toLowerCase() === note.title?.toLowerCase() ||
        note.related_to?.toLowerCase().includes(l.name.toLowerCase()) ||
        l.name.toLowerCase().includes(note.title?.toLowerCase() || '')
      );
      if (loc) {
        if (!map.has(loc.id)) map.set(loc.id, []);
        map.get(loc.id).push(note);
      }
    });
    return map;
  }, [lore, mapData]);

  // ── Unique location types in current map for legend ─
  const activeTypes = useMemo(() => {
    if (!mapData) return [];
    const types = new Set(mapData.locations.map(l => l.type));
    return Array.from(types).sort();
  }, [mapData]);

  // ── Zoom controls ─────────────────────────────────
  const zoomIn = () => setZoom(z => Math.min(3, z + 0.2));
  const zoomOut = () => setZoom(z => Math.max(0.3, z - 0.2));
  const resetView = () => {
    setZoom(1);
    if (mapData && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({
        x: (rect.width - mapData.bounds.width) / 2,
        y: (rect.height - mapData.bounds.height) / 2,
      });
    }
  };

  // ── Detail panel data ─────────────────────────────
  const selectedLoc = useMemo(() => {
    if (!selectedLocation || !mapData) return null;
    return mapData.locations.find(l => l.id === selectedLocation);
  }, [selectedLocation, mapData]);

  const selectedNPCs = useMemo(() => {
    if (!selectedLocation) return [];
    return npcsByLocation.get(selectedLocation) || [];
  }, [selectedLocation, npcsByLocation]);

  const selectedQuests = useMemo(() => {
    if (!selectedLocation) return [];
    return questsByLocation.get(selectedLocation) || [];
  }, [selectedLocation, questsByLocation]);

  const selectedLore = useMemo(() => {
    if (!selectedLocation) return [];
    return loreByLocation.get(selectedLocation) || [];
  }, [selectedLocation, loreByLocation]);

  // ── Render: Loading ───────────────────────────────
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading campaign map...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── Render: Empty state ───────────────────────────
  if (!mapData || mapData.locations.length === 0) {
    const hasCampaignData = npcs.length > 0 || quests.length > 0 || lore.length > 0;
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <MapPin size={48} style={{ color: '#4b5563', marginBottom: 4 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#c084fc', marginBottom: 8 }}>
            {hasCampaignData ? 'This Campaign Doesn\'t Have a Map Yet' : 'No Campaign Data Found'}
          </div>
          <div style={{ maxWidth: 440, lineHeight: 1.7, color: '#6b7280', fontSize: 13 }}>
            {hasCampaignData ? (
              <>
                To generate a map, add <strong style={{ color: '#9ca3af' }}>location fields</strong> to your NPCs
                or create <strong style={{ color: '#9ca3af' }}>Lore entries</strong> with the "Location" category.
                The map will automatically populate from your campaign data.
              </>
            ) : (
              <>
                Start building your campaign by adding NPCs, quests, and lore entries.
                Premade starter campaigns from <strong style={{ color: '#9ca3af' }}>The Codex</strong> include pre-built interactive maps.
              </>
            )}
          </div>
          {campaignName && (
            <div style={{ marginTop: 12, fontSize: 11, color: '#4b5563' }}>
              Campaign: {campaignName}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Map ───────────────────────────────────
  const { bounds } = mapData;
  const locMap = new Map(mapData.locations.map(l => [l.id, l]));

  return (
    <div style={styles.container}>
      {/* ── Toolbar ─────────────────────────────── */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
          <input
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X
              size={14}
              style={{ color: '#6b7280', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>

        <button style={styles.toggleBtn(showNPCs)} onClick={() => setShowNPCs(v => !v)}>
          <Users size={13} />
          NPCs
        </button>
        <button style={styles.toggleBtn(showQuests)} onClick={() => setShowQuests(v => !v)}>
          <Scroll size={13} />
          Quests
        </button>
        <button style={styles.toggleBtn(fogOfWar)} onClick={() => setFogOfWar(v => !v)}>
          {fogOfWar ? <EyeOff size={13} /> : <Eye size={13} />}
          Fog of War
        </button>
        <button style={styles.toggleBtn(showLegend)} onClick={() => setShowLegend(v => !v)}>
          <Layers size={13} />
          Legend
        </button>

        {/* DM: Share map with connected players */}
        {isDM && party.wsStatus === 'connected' && (
          <button
            style={{
              ...styles.toggleBtn(false),
              background: 'rgba(155,89,182,0.2)',
              borderColor: 'rgba(155,89,182,0.4)',
              color: '#c084fc',
            }}
            onClick={() => {
              party.sendEvent({
                event_type: 'map_sync',
                payload: {
                  campaignName,
                  locations: mapData?.locations || [],
                  paths: mapData?.paths || [],
                  bounds: mapData?.bounds || { width: 900, height: 700 },
                  revealedLocations: [...revealedLocations],
                  fogOfWar,
                },
              });
              toast.success('Map shared with party!', { icon: '\uD83D\uDDFA\uFE0F', duration: 2000 });
            }}
            title="Share this map view with connected players"
          >
            <Wifi size={13} />
            Share Map
          </button>
        )}

        {/* Player: indicator when receiving DM's map */}
        {!isDM && party.sharedMapState && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 10, color: '#4ade80', fontWeight: 600,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
          }}>
            <Wifi size={10} />
            DM Map Synced
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Custom map image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleMapUpload}
        />
        <button
          style={styles.toggleBtn(!!customMapImage)}
          onClick={() => customMapImage ? clearCustomMap() : fileInputRef.current?.click()}
          title={customMapImage ? 'Remove custom map background' : 'Upload a custom map background image'}
        >
          {customMapImage ? <Trash2 size={13} /> : <ImagePlus size={13} />}
          {customMapImage ? 'Remove Map' : 'Upload Map'}
        </button>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button style={styles.zoomBtn} onClick={zoomOut} title="Zoom out"><ZoomOut size={14} /></button>
          <span style={{ fontSize: 11, color: '#6b7280', minWidth: 40, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button style={styles.zoomBtn} onClick={zoomIn} title="Zoom in"><ZoomIn size={14} /></button>
          <button style={{ ...styles.zoomBtn, marginLeft: 4 }} onClick={resetView} title="Reset view">
            <Crosshair size={14} />
          </button>
        </div>
      </div>

      {/* ── Map Canvas ──────────────────────────── */}
      <div
        ref={containerRef}
        style={{ ...styles.mapArea, cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={mapRef}
          style={{
            ...styles.svg,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          width={bounds.width}
          height={bounds.height}
          viewBox={`0 0 ${bounds.width} ${bounds.height}`}
        >
          {/* Background parchment texture */}
          <defs>
            <filter id="parchment-noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="desat" />
              <feBlend in="SourceGraphic" in2="desat" mode="multiply" />
            </filter>
            <radialGradient id="parchment-bg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#3d2b1a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1a1225" stopOpacity="0.1" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow-sm">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
            </filter>
            <clipPath id="map-clip">
              <rect x="0" y="0" width={bounds.width} height={bounds.height} rx="8" />
            </clipPath>
          </defs>

          <rect x="0" y="0" width={bounds.width} height={bounds.height} fill="url(#parchment-bg)" rx="8" />

          {/* Background map image (custom upload takes priority over premade) */}
          {(customMapImage || mapData.backgroundImage) && (
            <>
              <image
                href={customMapImage || mapData.backgroundImage}
                x="0" y="0"
                width={bounds.width}
                height={bounds.height}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#map-clip)"
                opacity="0.7"
                style={{ filter: 'saturate(0.7) brightness(0.55)' }}
              />
              {/* Soft overlay to keep pins and labels readable */}
              <rect
                x="0" y="0"
                width={bounds.width} height={bounds.height}
                fill="rgba(11,9,20,0.3)"
                rx="8"
              />
            </>
          )}

          {/* Decorative compass rose */}
          <g opacity="0.08" transform={`translate(${bounds.width - 80}, ${bounds.height - 80})`}>
            <circle cx="0" cy="0" r="30" fill="none" stroke="#c084fc" strokeWidth="1" />
            <line x1="0" y1="-35" x2="0" y2="35" stroke="#c084fc" strokeWidth="0.8" />
            <line x1="-35" y1="0" x2="35" y2="0" stroke="#c084fc" strokeWidth="0.8" />
            <text x="0" y="-38" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="var(--font-display)">N</text>
            <text x="0" y="46" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="var(--font-display)">S</text>
            <text x="42" y="4" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="var(--font-display)">E</text>
            <text x="-42" y="4" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="var(--font-display)">W</text>
          </g>

          {/* Paths between locations */}
          {mapData.paths.map((path, i) => {
            const from = locMap.get(path.from);
            const to = locMap.get(path.to);
            if (!from || !to) return null;
            const ps = getPathStyle(path.style);
            // Slightly curved paths for organic feel
            const mx = (from.x + to.x) / 2 + (Math.sin(i * 1.7) * 20);
            const my = (from.y + to.y) / 2 + (Math.cos(i * 2.3) * 15);
            return (
              <path
                key={`path-${i}`}
                d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                fill="none"
                stroke={ps.stroke}
                strokeWidth={ps.strokeWidth}
                strokeDasharray={ps.dashArray}
                opacity={ps.opacity}
                strokeLinecap="round"
              />
            );
          })}

          {/* Fog of war overlay */}
          {fogOfWar && mapData.locations.map(loc => {
            const hasNpcs = npcsByLocation.has(loc.id);
            const hasQuests = questsByLocation.has(loc.id);
            const hasLore = loreByLocation.has(loc.id);
            const explored = hasNpcs || hasQuests || hasLore;
            if (explored) return null;
            return (
              <circle
                key={`fog-${loc.id}`}
                cx={loc.x}
                cy={loc.y}
                r={50}
                fill="rgba(11,9,20,0.7)"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Location markers */}
          {mapData.locations.map(loc => {
            const typeConfig = getLocationType(loc.type);
            const isHighlighted = highlightedIds.has(loc.id);
            const isSelected = selectedLocation === loc.id;
            const dimmed = searchQuery.trim() && !isHighlighted;
            const hasNpcPresence = npcsByLocation.has(loc.id);
            const hasQuestPresence = questsByLocation.has(loc.id);

            // Fog of war: dim unexplored
            const isFogged = fogOfWar && !hasNpcPresence && !hasQuestPresence && !loreByLocation.has(loc.id);

            const markerRadius = loc.parent ? 10 : 14;

            return (
              <g
                key={loc.id}
                data-location={loc.id}
                style={{ cursor: 'pointer', opacity: dimmed ? 0.2 : isFogged ? 0.25 : 1, transition: 'opacity 0.2s' }}
                onClick={(e) => { e.stopPropagation(); setSelectedLocation(loc.id === selectedLocation ? null : loc.id); }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={markerRadius + 6}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="4,2"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${loc.x} ${loc.y}`}
                      to={`360 ${loc.x} ${loc.y}`}
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Glow for highlighted search results */}
                {searchQuery.trim() && isHighlighted && (
                  <circle cx={loc.x} cy={loc.y} r={markerRadius + 4} fill={typeConfig.color} opacity="0.15" />
                )}

                {/* Outer ring */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={markerRadius + 2}
                  fill="rgba(11,9,20,0.8)"
                  stroke={typeConfig.color}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={isSelected ? 1 : 0.6}
                />

                {/* Inner marker */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={markerRadius}
                  fill={typeConfig.color}
                  opacity={0.25}
                  stroke={typeConfig.color}
                  strokeWidth={1.5}
                />

                {/* Center icon dot */}
                <circle cx={loc.x} cy={loc.y} r={3} fill={typeConfig.color} opacity={0.9} />

                {/* Label */}
                <text
                  x={loc.x}
                  y={loc.y + markerRadius + 14}
                  textAnchor="middle"
                  fill="#e2e0ea"
                  fontSize={loc.parent ? 9 : 11}
                  fontFamily="var(--font-display)"
                  fontWeight={loc.parent ? 400 : 600}
                  opacity={dimmed ? 0.3 : isFogged ? 0.3 : 0.9}
                  filter="url(#shadow-sm)"
                >
                  {loc.name}
                </text>

                {/* NPC pins */}
                {showNPCs && npcsByLocation.has(loc.id) && (() => {
                  const locNpcs = npcsByLocation.get(loc.id);
                  return locNpcs.slice(0, 5).map((npc, ni) => {
                    const angle = (ni / Math.min(locNpcs.length, 5)) * Math.PI * 2 - Math.PI / 2;
                    const dist = markerRadius + 10;
                    const nx = loc.x + Math.cos(angle) * dist;
                    const ny = loc.y + Math.sin(angle) * dist;
                    return (
                      <g key={`npc-${npc.id}`} data-npc-pin>
                        <circle cx={nx} cy={ny} r={4} fill={npcColor(npc.role)} stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                        <title>{npc.name} ({npc.role})</title>
                      </g>
                    );
                  });
                })()}

                {/* Quest marker */}
                {showQuests && questsByLocation.has(loc.id) && (() => {
                  const activeQuests = (questsByLocation.get(loc.id) || []).filter(q => q.status === 'active');
                  if (activeQuests.length === 0) return null;
                  return (
                    <g>
                      <rect
                        x={loc.x + markerRadius + 2}
                        y={loc.y - markerRadius - 4}
                        width={10}
                        height={10}
                        rx={2}
                        fill="#f59e0b"
                        stroke="rgba(0,0,0,0.5)"
                        strokeWidth={1}
                        transform={`rotate(45, ${loc.x + markerRadius + 7}, ${loc.y - markerRadius + 1})`}
                      />
                      <text
                        x={loc.x + markerRadius + 7}
                        y={loc.y - markerRadius + 4}
                        textAnchor="middle"
                        fill="#000"
                        fontSize={7}
                        fontWeight="bold"
                      >
                        !
                      </text>
                      <title>{activeQuests.length} active quest(s)</title>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {/* ── Legend ──────────────────────────────── */}
        {showLegend && (
          <div style={styles.legendContainer}>
            <div style={styles.legendTitle}>Legend</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px' }}>
              {activeTypes.map(type => {
                const cfg = getLocationType(type);
                return (
                  <div key={type} style={styles.legendItem}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    <span>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
            {showNPCs && (
              <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
                <div style={{ ...styles.legendItem, marginBottom: 2 }}>
                  <div style={styles.npcDot('#4ade80')} />
                  <span>Ally NPC</span>
                </div>
                <div style={{ ...styles.legendItem, marginBottom: 2 }}>
                  <div style={styles.npcDot('#ef4444')} />
                  <span>Enemy NPC</span>
                </div>
                <div style={{ ...styles.legendItem, marginBottom: 2 }}>
                  <div style={styles.npcDot('#fbbf24')} />
                  <span>Neutral NPC</span>
                </div>
              </div>
            )}
            {showQuests && (
              <div style={{ marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
                <div style={styles.legendItem}>
                  <div style={styles.questMarker} />
                  <span>Active Quest</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Detail Panel ───────────────────────── */}
        {selectedLoc && (
          <div style={styles.detailPanel}>
            <div style={styles.detailHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `${getLocationType(selectedLoc.type).color}22`,
                  border: `1px solid ${getLocationType(selectedLoc.type).color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {(() => {
                    const Icon = getLocationType(selectedLoc.type).icon;
                    return <Icon size={16} style={{ color: getLocationType(selectedLoc.type).color }} />;
                  })()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: '#e2e0ea' }}>
                    {selectedLoc.name}
                  </div>
                  <div style={{ fontSize: 11, color: getLocationType(selectedLoc.type).color, fontFamily: 'var(--font-ui)' }}>
                    {getLocationType(selectedLoc.type).label}
                    {selectedLoc.parent && (() => {
                      const parentLoc = locMap.get(selectedLoc.parent);
                      return parentLoc ? ` in ${parentLoc.name}` : '';
                    })()}
                  </div>
                </div>
              </div>
              <X
                size={18}
                style={{ color: '#6b7280', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setSelectedLocation(null)}
              />
            </div>

            <div style={styles.detailBody}>
              {/* Description */}
              {selectedLoc.description && (
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>Description</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: '#b0adc0' }}>
                    {selectedLoc.description}
                  </div>
                </div>
              )}

              {/* Lore entries */}
              {selectedLore.length > 0 && (
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>
                    <BookOpen size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                    Lore ({selectedLore.length})
                  </div>
                  {selectedLore.map(note => (
                    <div key={note.id} style={styles.card}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e0ea', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                        {note.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#8b8698', lineHeight: 1.5 }}>
                        {(note.body || '').substring(0, 200)}{note.body && note.body.length > 200 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NPCs present */}
              {selectedNPCs.length > 0 && (
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>
                    <Users size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                    NPCs Present ({selectedNPCs.length})
                  </div>
                  {selectedNPCs.map(npc => (
                    <div key={npc.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={styles.npcDot(npcColor(npc.role))} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e0ea' }}>{npc.name}</div>
                        <div style={{ fontSize: 11, color: '#8b8698' }}>
                          {npc.race}{npc.npc_class ? ` ${npc.npc_class}` : ''} — {npc.role || 'Unknown'}
                          {npc.status === 'dead' && <span style={{ color: '#ef4444', marginLeft: 6 }}>(Dead)</span>}
                        </div>
                        {npc.description && (
                          <div style={{ fontSize: 11, color: '#6b6578', marginTop: 4, lineHeight: 1.4 }}>
                            {npc.description.substring(0, 120)}{npc.description.length > 120 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Quests */}
              {selectedQuests.length > 0 && (
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>
                    <Scroll size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                    Quests ({selectedQuests.length})
                  </div>
                  {selectedQuests.map(quest => (
                    <div key={quest.id} style={{ ...styles.card, borderLeft: `3px solid ${quest.status === 'active' ? '#f59e0b' : quest.status === 'completed' ? '#4ade80' : '#6b7280'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e0ea', fontFamily: 'var(--font-display)' }}>
                          {quest.title}
                        </div>
                        <span style={{
                          fontSize: 9,
                          padding: '1px 6px',
                          borderRadius: 6,
                          background: quest.status === 'active' ? 'rgba(245,158,11,0.15)' : quest.status === 'completed' ? 'rgba(74,222,128,0.15)' : 'rgba(107,114,128,0.15)',
                          color: quest.status === 'active' ? '#f59e0b' : quest.status === 'completed' ? '#4ade80' : '#6b7280',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}>
                          {quest.status}
                        </span>
                      </div>
                      {quest.giver && (
                        <div style={{ fontSize: 11, color: '#8b8698', marginBottom: 2 }}>
                          Given by: {quest.giver}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: '#6b6578', lineHeight: 1.4 }}>
                        {(quest.description || '').substring(0, 150)}{quest.description && quest.description.length > 150 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty detail state */}
              {!selectedLoc.description && selectedNPCs.length === 0 && selectedQuests.length === 0 && selectedLore.length === 0 && (
                <div style={{ textAlign: 'center', color: '#4b5563', padding: '30px 0', fontSize: 13 }}>
                  <MapPin size={24} style={{ margin: '0 auto 8px', display: 'block', color: '#4b5563' }} />
                  No additional details for this location.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
