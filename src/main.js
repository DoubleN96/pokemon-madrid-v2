import * as THREE from 'three';
import { AREAS, MAP_SIZE, SPECIES, STAGES, STARTERS, WILD_TABLE } from './game-data.js';

const SAVE_KEY = 'pokemon-madrid-v2-threed-save';
const INTERNAL_WIDTH = 480;
const INTERNAL_HEIGHT = 320;

const canvas = document.getElementById('game');
const worldStatusEl = document.getElementById('world-status');
const areaNameEl = document.getElementById('area-name');
const objectiveTextEl = document.getElementById('objective-text');
const playerLevelEl = document.getElementById('player-level');
const playerCoinsEl = document.getElementById('player-coins');
const playerBadgesEl = document.getElementById('player-badges');
const playerBallsEl = document.getElementById('player-balls');
const playerPotionsEl = document.getElementById('player-potions');
const partyListEl = document.getElementById('party-list');
const interactionPanelEl = document.getElementById('interaction-panel');
const interactionTitleEl = document.getElementById('interaction-title');
const interactionTextEl = document.getElementById('interaction-text');
const starterScreenEl = document.getElementById('starter-screen');
const starterOptionsEl = document.getElementById('starter-options');
const battleScreenEl = document.getElementById('battle-screen');
const battleTypeEl = document.getElementById('battle-type');
const enemyNameEl = document.getElementById('enemy-name');
const enemyLevelEl = document.getElementById('enemy-level');
const enemyHpBarEl = document.getElementById('enemy-hp-bar');
const enemyHpTextEl = document.getElementById('enemy-hp-text');
const playerMonNameEl = document.getElementById('player-mon-name');
const playerMonLevelEl = document.getElementById('player-mon-level');
const playerHpBarEl = document.getElementById('player-hp-bar');
const playerHpTextEl = document.getElementById('player-hp-text');
const enemyChipEl = document.getElementById('enemy-chip');
const playerChipEl = document.getElementById('player-chip');
const battleLogListEl = document.getElementById('battle-log-list');
const menuScreenEl = document.getElementById('menu-screen');
const menuContentEl = document.getElementById('menu-content');

const AREA_PREVIEWS = {
  tetuan: './assets/project-palladium/maps/new-bark-town.png',
  plaza: './assets/project-palladium/maps/cherrygrove-city.png',
  castellana: './assets/project-palladium/maps/route-29.png',
  liga: './assets/project-palladium/maps/violet-city-gym.png'
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb8d878);
scene.fog = new THREE.Fog(0xb8d878, 10, 24);

const camera = new THREE.OrthographicCamera(-10, 10, 6.5, -6.5, 0.1, 60);
camera.position.set(9, 16, 13);
camera.lookAt(9, 0, 9);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  powerPreference: 'high-performance'
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(1);

const textureLoader = new THREE.TextureLoader();
const areaTextures = {};
let worldBackdrop = null;

scene.add(new THREE.AmbientLight(0xffffff, 1.1));
const sun = new THREE.DirectionalLight(0xfff4c8, 0.65);
sun.position.set(12, 20, 8);
scene.add(sun);

const worldGroup = new THREE.Group();
scene.add(worldGroup);

const tileMeshes = new Map();
const pedestalMeshes = new Map();
const itemMarkers = new Map();
const npcMarkers = new Map();
const portalMarkers = new Map();

function configureTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

Object.entries(AREA_PREVIEWS).forEach(([areaId, src]) => {
  areaTextures[areaId] = textureLoader.load(src, configureTexture);
});

const state = {
  starterChosen: false,
  currentArea: 'tetuan',
  flags: {
    talkedToMother: false,
    metGaldos: false,
    beatPablo: false,
    sawLegendary: false
  },
  collectedItems: [],
  consumedRewards: [],
  player: {
    x: 9,
    z: 10,
    facing: 'down',
    level: 5,
    coins: 120,
    balls: 5,
    potions: 3,
    badges: [],
    party: [],
    activePartyIndex: 0,
    completedStages: []
  },
  movement: {
    isMoving: false,
    fromX: 9,
    fromZ: 10,
    toX: 9,
    toZ: 10,
    progress: 1
  },
  battle: null,
  menuOpen: false
};

function currentArea() {
  return AREAS[state.currentArea];
}

function defaultMon(speciesName, level = 5) {
  const species = SPECIES[speciesName];
  const maxHp = species.baseHp + level * 4;
  return {
    species: speciesName,
    level,
    maxHp,
    hp: maxHp,
    attack: species.attack + level,
    defense: species.defense + Math.floor(level / 2),
    skill: species.skill
  };
}

function evolveIfNeeded(mon) {
  if (mon.species === 'Chulapon' && mon.level >= 16) mon.species = 'ChulaponPlus';
  if (mon.species === 'ChulaponPlus' && mon.level >= 36) mon.species = 'Castizon';
  if (mon.species === 'Gatolegre' && mon.level >= 16) mon.species = 'GatolegrePlus';
  if (mon.species === 'GatolegrePlus' && mon.level >= 36) mon.species = 'Gatonoche';
  if (mon.species === 'Azulejin' && mon.level >= 16) mon.species = 'Azulejon';
  if (mon.species === 'Azulejon' && mon.level >= 36) mon.species = 'Mayolicon';
  const data = SPECIES[mon.species];
  mon.attack = data.attack + mon.level;
  mon.defense = data.defense + Math.floor(mon.level / 2);
  mon.skill = data.skill;
  mon.maxHp = data.baseHp + mon.level * 4;
  mon.hp = Math.min(mon.hp, mon.maxHp);
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!saved) return;
    if (saved.player) state.player = { ...state.player, ...saved.player };
    if (saved.flags) state.flags = { ...state.flags, ...saved.flags };
    if (saved.collectedItems) state.collectedItems = saved.collectedItems;
    if (saved.consumedRewards) state.consumedRewards = saved.consumedRewards;
    if (saved.starterChosen != null) state.starterChosen = saved.starterChosen;
    if (saved.currentArea && AREAS[saved.currentArea]) state.currentArea = saved.currentArea;
  } catch (_error) {
    // ignore malformed save
  }
}

function isInsidePatch(x, z, patch) {
  return x >= patch.x1 && x <= patch.x2 && z >= patch.z1 && z <= patch.z2;
}

function isGrass(x, z) {
  return currentArea().grassPatches.some((patch) => isInsidePatch(x, z, patch));
}

function isBlocked(x, z) {
  if (x < 0 || z < 0 || x >= MAP_SIZE || z >= MAP_SIZE) return true;
  return currentArea().blockedTiles.some((block) => isInsidePatch(x, z, block));
}

function stageById(id) {
  return STAGES.find((stage) => stage.id === id);
}

function nextStage() {
  return STAGES.find((stage) => !state.player.completedStages.includes(stage.id)) || null;
}

function currentWildTier() {
  return Math.min(3, state.player.badges.length);
}

function pickWildSpecies() {
  const table = WILD_TABLE[currentArea().wildTable][currentWildTier()];
  return table[Math.floor(Math.random() * table.length)];
}

function hpWidth(mon) {
  return `${Math.max(0, (mon.hp / mon.maxHp) * 100)}%`;
}

function addBattleLog(text) {
  const line = document.createElement('p');
  line.textContent = text;
  battleLogListEl.prepend(line);
}

function rewardOnce(id) {
  if (state.consumedRewards.includes(id)) return false;
  state.consumedRewards.push(id);
  return true;
}

function rewardPlayer(reward, id = null) {
  if (id && !rewardOnce(id)) return;
  if (!reward) return;
  if (reward.type === 'item') state.player[reward.key] += reward.amount;
}

function nearestDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}

function currentObjective() {
  if (!state.flags.talkedToMother) return 'Habla con Mama en Bravo Murillo 37.';
  if (!state.flags.metGaldos) return 'Entra al laboratorio y habla con el Profesor Galdos.';
  if (!state.flags.beatPablo) return 'Derrota a Pablo cerca del Metro de Madrid.';
  const next = nextStage();
  if (next) return `Siguiente combate: ${next.name} - ${next.title}.`;
  if (!state.flags.sawLegendary) return 'Busca a Orson Regio en la Liga Team Piso.';
  return 'Has despejado la campaña principal de este slice.';
}

function renderHud() {
  areaNameEl.textContent = currentArea().name;
  objectiveTextEl.textContent = currentObjective();
  playerLevelEl.textContent = String(state.player.level);
  playerCoinsEl.textContent = String(state.player.coins);
  playerBadgesEl.textContent = String(state.player.badges.length);
  playerBallsEl.textContent = String(state.player.balls);
  playerPotionsEl.textContent = String(state.player.potions);

  partyListEl.innerHTML = '';
  state.player.party.forEach((mon, index) => {
    const slot = document.createElement('div');
    slot.className = `party-slot ${index === state.player.activePartyIndex ? 'active' : ''}`;
    slot.innerHTML = `<strong>${mon.species}</strong><br />Nv ${mon.level} · HP ${mon.hp}/${mon.maxHp}`;
    slot.addEventListener('click', () => {
      state.player.activePartyIndex = index;
      renderHud();
      saveGame();
    });
    partyListEl.appendChild(slot);
  });

  const nearest = getInteraction();
  if (nearest) {
    interactionPanelEl.classList.remove('hidden');
    interactionTitleEl.textContent = nearest.title;
    interactionTextEl.textContent = nearest.text;
  } else {
    interactionPanelEl.classList.add('hidden');
  }
}

function renderBattle() {
  const battle = state.battle;
  if (!battle) {
    battleScreenEl.classList.add('hidden');
    return;
  }
  battleScreenEl.classList.remove('hidden');

  const enemy = battle.enemyTeam[battle.enemyIndex];
  const player = state.player.party[state.player.activePartyIndex];

  battleTypeEl.textContent = battle.type === 'wild' ? 'Encuentro salvaje' : 'Combate de entrenador';
  enemyNameEl.textContent = enemy.species;
  enemyLevelEl.textContent = `Nivel ${enemy.level}`;
  enemyHpTextEl.textContent = `HP ${enemy.hp} / ${enemy.maxHp}`;
  enemyHpBarEl.style.width = hpWidth(enemy);
  enemyChipEl.textContent = SPECIES[enemy.species].emoji;

  playerMonNameEl.textContent = player.species;
  playerMonLevelEl.textContent = `Nivel ${player.level}`;
  playerHpTextEl.textContent = `HP ${player.hp} / ${player.maxHp}`;
  playerHpBarEl.style.width = hpWidth(player);
  playerChipEl.textContent = SPECIES[player.species].emoji;
}

function renderMenu() {
  if (!state.menuOpen) {
    menuScreenEl.classList.add('hidden');
    return;
  }
  menuScreenEl.classList.remove('hidden');
  const next = nextStage();
  const preview = AREA_PREVIEWS[state.currentArea];
  menuContentEl.innerHTML = `
    <p><strong>Zona actual:</strong> ${currentArea().name}</p>
    <p><strong>Siguiente objetivo:</strong> ${next ? `${next.name} - ${next.title}` : 'Liga despejada'}</p>
    <p><strong>Inventario:</strong> ${state.player.balls} Pokeballs · ${state.player.potions} Pociones</p>
    <p><strong>Medallas:</strong> ${state.player.badges.join(', ') || 'Ninguna'}</p>
    <p><strong>Equipo:</strong> ${state.player.party.map((mon) => `${mon.species} Nv${mon.level}`).join(', ') || 'Vacio'}</p>
    <p><strong>Flags:</strong> madre ${state.flags.talkedToMother ? 'ok' : 'pendiente'} · Galdos ${state.flags.metGaldos ? 'ok' : 'pendiente'} · Pablo ${state.flags.beatPablo ? 'ok' : 'pendiente'} · Orson ${state.flags.sawLegendary ? 'visto' : 'pendiente'}</p>
    <p><strong>Controles:</strong> Flechas/WASD mover · X interactuar · Z atras/huir · Shift cambiar lead · Enter menu.</p>
    <div class="area-preview">
      <img src="${preview}" alt="Preview ${currentArea().name}" />
    </div>
    <p class="asset-credit"><strong>Assets visibles:</strong> Project Palladium resource pack via Team Aqua's Asset Repo. Credito al equipo Project Palladium y autores indicados en sus README.</p>
  `;
}

function spawnBattle(type, payload) {
  battleLogListEl.innerHTML = '';
  state.battle = {
    type,
    enemyTeam: payload.team.map((entry, index) =>
      typeof entry === 'string' ? defaultMon(entry, payload.baseLevel + index) : entry
    ),
    enemyIndex: 0,
    trainerStageId: payload.stageId || null,
    canRun: type === 'wild',
    rewardCoins: payload.rewardCoins || 0
  };
  addBattleLog(payload.opening);
  renderBattle();
}

function tryWildEncounter() {
  if (!isGrass(state.player.x, state.player.z)) return;
  if (Math.random() > 0.18) return;
  const species = pickWildSpecies();
  const level = 3 + currentWildTier() + Math.floor(Math.random() * 3);
  spawnBattle('wild', {
    team: [defaultMon(species, level)],
    baseLevel: level,
    opening: `Un ${species} salvaje aparecio entre la hierba alta.`
  });
}

function levelUpParty(amount = 1) {
  state.player.party.forEach((mon) => {
    mon.level += amount;
    evolveIfNeeded(mon);
    mon.hp = mon.maxHp;
  });
}

function completeStage(stageId, reward) {
  if (state.player.completedStages.includes(stageId)) return;
  state.player.completedStages.push(stageId);
  state.player.badges.push(reward);
  state.player.level += 1;
  state.player.coins += 120;
  levelUpParty(1);
}

function endBattleWin() {
  const battle = state.battle;
  if (battle.type === 'trainer' && battle.trainerStageId) {
    const stage = stageById(battle.trainerStageId);
    completeStage(stage.id, stage.reward);
    worldStatusEl.textContent = `Has derrotado a ${stage.name}. ${stage.reward} conseguida.`;
  } else if (battle.type === 'trainer') {
    state.player.coins += battle.rewardCoins || 40;
    worldStatusEl.textContent = 'Combate importante ganado.';
  } else {
    state.player.coins += 20;
    worldStatusEl.textContent = 'Combate ganado.';
  }
  state.battle = null;
  renderHud();
  renderBattle();
  saveGame();
}

function forceWildEncounter(species = pickWildSpecies(), level = 4 + currentWildTier()) {
  spawnBattle('wild', {
    team: [defaultMon(species, level)],
    baseLevel: level,
    opening: `Debug: aparece ${species} salvaje.`
  });
}

function swapToHealthyMon() {
  const nextIndex = state.player.party.findIndex((mon, index) => mon.hp > 0 && index !== state.player.activePartyIndex);
  if (nextIndex >= 0) {
    state.player.activePartyIndex = nextIndex;
    addBattleLog(`Sale ${state.player.party[nextIndex].species}.`);
    renderHud();
    renderBattle();
    return true;
  }
  return false;
}

function enemyTurn() {
  const battle = state.battle;
  if (!battle) return;
  const enemy = battle.enemyTeam[battle.enemyIndex];
  const player = state.player.party[state.player.activePartyIndex];
  const damage = Math.max(3, enemy.attack - Math.floor(player.defense / 3) + Math.floor(Math.random() * 4));
  player.hp = Math.max(0, player.hp - damage);
  addBattleLog(`${enemy.species} usa ${enemy.skill} y causa ${damage} de dano.`);
  if (player.hp <= 0) {
    addBattleLog(`${player.species} cae debilitado.`);
    if (!swapToHealthyMon()) {
      const spawn = currentArea().spawn;
      worldStatusEl.textContent = 'Has sido derrotado. Vuelves al punto seguro del area.';
      state.player.x = spawn.x;
      state.player.z = spawn.z;
      state.player.party.forEach((mon) => {
        mon.hp = mon.maxHp;
      });
      state.battle = null;
    }
  }
  renderHud();
  renderBattle();
  saveGame();
}

function playerAction(action) {
  const battle = state.battle;
  if (!battle) return;
  const enemy = battle.enemyTeam[battle.enemyIndex];
  const player = state.player.party[state.player.activePartyIndex];

  if (action === 'attack') {
    const damage = Math.max(4, player.attack - Math.floor(enemy.defense / 3) + Math.floor(Math.random() * 5));
    enemy.hp = Math.max(0, enemy.hp - damage);
    addBattleLog(`${player.species} golpea y hace ${damage} de dano.`);
  }

  if (action === 'skill') {
    const damage = Math.max(6, player.attack + 4 - Math.floor(enemy.defense / 4) + Math.floor(Math.random() * 6));
    enemy.hp = Math.max(0, enemy.hp - damage);
    addBattleLog(`${player.species} usa ${player.skill} y causa ${damage} de dano.`);
  }

  if (action === 'potion') {
    if (state.player.potions <= 0) {
      addBattleLog('No te quedan pociones.');
      return;
    }
    state.player.potions -= 1;
    player.hp = Math.min(player.maxHp, player.hp + 18);
    addBattleLog(`Usas una pocion sobre ${player.species}.`);
  }

  if (action === 'switch') {
    if (state.player.party.length <= 1) {
      addBattleLog('No tienes otro Pokemon para cambiar.');
      return;
    }
    state.player.activePartyIndex = (state.player.activePartyIndex + 1) % state.player.party.length;
    addBattleLog(`Cambias a ${state.player.party[state.player.activePartyIndex].species}.`);
    renderHud();
    renderBattle();
    enemyTurn();
    return;
  }

  if (action === 'ball') {
    if (battle.type !== 'wild') {
      addBattleLog('No puedes capturar Pokemon de entrenador.');
      return;
    }
    if (state.player.balls <= 0) {
      addBattleLog('No te quedan Pokeballs.');
      return;
    }
    if (state.player.party.length >= 6) {
      addBattleLog('Tu equipo esta lleno.');
      return;
    }
    state.player.balls -= 1;
    const catchChance = 0.35 + (1 - enemy.hp / enemy.maxHp) * 0.45;
    if (Math.random() < catchChance) {
      state.player.party.push({ ...enemy });
      addBattleLog(`Captura completada: ${enemy.species} se une al equipo.`);
      state.battle = null;
      worldStatusEl.textContent = `${enemy.species} ha sido capturado.`;
      renderHud();
      renderBattle();
      saveGame();
      return;
    }
    addBattleLog('La Pokeball se mueve... pero el Pokemon escapa.');
  }

  if (action === 'run') {
    if (!battle.canRun) {
      addBattleLog('No puedes huir de un combate importante.');
      return;
    }
    state.battle = null;
    worldStatusEl.textContent = 'Escapas del combate salvaje.';
    renderBattle();
    saveGame();
    return;
  }

  renderBattle();

  if (enemy.hp <= 0) {
    addBattleLog(`${enemy.species} ha sido derrotado.`);
    if (battle.enemyIndex < battle.enemyTeam.length - 1) {
      battle.enemyIndex += 1;
      const next = battle.enemyTeam[battle.enemyIndex];
      addBattleLog(`${next.species} entra en combate.`);
      renderBattle();
      return;
    }
    endBattleWin();
    return;
  }

  enemyTurn();
}

function getNearbyPortal() {
  return currentArea().portals.find((entry) => nearestDistance({ x: state.player.x, z: state.player.z }, entry) <= 1);
}

function getInteraction() {
  const pos = { x: state.player.x, z: state.player.z };
  const area = currentArea();

  const npc = area.npcs.find((entry) => nearestDistance(pos, entry) <= 1);
  if (npc) {
    return { kind: 'npc', npc, title: npc.title, text: npc.text };
  }

  const item = area.items.find((entry) => nearestDistance(pos, entry) <= 0 && !state.collectedItems.includes(entry.id));
  if (item) {
    return { kind: 'item', item, title: item.title, text: `${item.text} Pulsa X para recogerlo.` };
  }

  const portal = getNearbyPortal();
  if (portal) {
    const locked = portal.requiresStage && !state.player.completedStages.includes(portal.requiresStage);
    return {
      kind: 'portal',
      portal,
      title: portal.title,
      text: locked ? 'Todavia no puedes usar este acceso.' : portal.text,
      locked
    };
  }

  if (area.specialTiles.center && nearestDistance(pos, area.specialTiles.center) <= 1) {
    return { kind: 'center', title: 'Centro Team Piso', text: 'Pulsa X para curar al equipo completo.' };
  }

  if (area.specialTiles.sign && nearestDistance(pos, area.specialTiles.sign) <= 1) {
    return { kind: 'sign', title: 'Cartel de ruta', text: `Zona: ${area.name}. Sigue el objetivo principal para progresar.` };
  }

  if (area.specialTiles.homeDoor && nearestDistance(pos, area.specialTiles.homeDoor) <= 1) {
    return { kind: 'home', title: 'Bravo Murillo 37', text: 'Tu casa. Aun quedan demasiadas cosas por resolver.' };
  }

  if (area.specialTiles.labDoor && nearestDistance(pos, area.specialTiles.labDoor) <= 1) {
    return { kind: 'lab', title: 'Laboratorio del Profesor Galdos', text: 'Pulsa X para hablar con el profesor y revisar tu MadratNav.' };
  }

  if (area.specialTiles.rival && !state.flags.beatPablo && nearestDistance(pos, area.specialTiles.rival) <= 1) {
    return { kind: 'rival', title: 'Pablo', text: 'Tu rival de siempre. Pulsa X para aceptar el combate.' };
  }

  if (area.specialTiles.legendary && state.player.completedStages.includes('marcelino') && nearestDistance(pos, area.specialTiles.legendary) <= 1) {
    return { kind: 'legendary', title: 'Orson Regio', text: 'Pulsa X para desafiar al legendario final.' };
  }

  const pedestal = area.pedestals.find((entry) => nearestDistance(pos, entry) <= 1);
  if (pedestal) {
    const stage = stageById(pedestal.stageId);
    const next = nextStage();
    const unlocked = next && next.id === stage.id;
    const completed = state.player.completedStages.includes(stage.id);
    return {
      kind: 'stage',
      stage,
      unlocked,
      completed,
      title: completed ? `${stage.name} completado` : unlocked ? `${stage.name} disponible` : `${stage.name} bloqueado`,
      text: completed ? stage.text : unlocked ? `${stage.title}. Pulsa X para combatir.` : 'Todavia no puedes desafiar este gimnasio.'
    };
  }

  return null;
}

function clearWorld() {
  while (worldGroup.children.length > 0) {
    const child = worldGroup.children.pop();
    if (!child) break;
    worldGroup.remove(child);
  }
  tileMeshes.clear();
  pedestalMeshes.clear();
  itemMarkers.clear();
  npcMarkers.clear();
  portalMarkers.clear();
  worldBackdrop = null;
}

function buildTile(x, z, color, height = 0.08, opacity = 0.32) {
  const geometry = new THREE.BoxGeometry(1, height, 1);
  const material = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    transparent: true,
    opacity
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2 - 0.44, z);
  worldGroup.add(mesh);
  tileMeshes.set(`${x},${z}`, mesh);
}

function buildLandmark(landmark) {
  const geometry = new THREE.BoxGeometry(landmark.width, 1.35, landmark.depth);
  const material = new THREE.MeshStandardMaterial({ color: landmark.color, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(landmark.x, 0.42, landmark.z);
  worldGroup.add(mesh);
}

function buildBackdrop(areaId) {
  const texture = areaTextures[areaId];
  if (!texture) return;
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  base.rotation.x = -Math.PI / 2;
  base.position.set((MAP_SIZE - 1) / 2, -0.48, (MAP_SIZE - 1) / 2);
  worldGroup.add(base);
  worldBackdrop = base;
}

function makePixelTrainerTexture(primary = '#d94143', secondary = '#3356d7', skin = '#f7d7b5') {
  const paint = document.createElement('canvas');
  paint.width = 16;
  paint.height = 24;
  const ctx = paint.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 16, 24);
  ctx.fillStyle = secondary;
  ctx.fillRect(4, 0, 8, 3);
  ctx.fillRect(3, 3, 10, 2);
  ctx.fillStyle = skin;
  ctx.fillRect(4, 5, 8, 5);
  ctx.fillStyle = primary;
  ctx.fillRect(3, 10, 10, 7);
  ctx.fillRect(2, 12, 2, 6);
  ctx.fillRect(12, 12, 2, 6);
  ctx.fillStyle = '#24324a';
  ctx.fillRect(4, 17, 3, 7);
  ctx.fillRect(9, 17, 3, 7);
  return configureTexture(new THREE.CanvasTexture(paint));
}

function buildWorld() {
  clearWorld();
  const area = currentArea();
  scene.background = new THREE.Color(area.id === 'liga' ? 0xa5b4ff : 0xb8d878);
  scene.fog = new THREE.Fog(area.id === 'liga' ? 0xa5b4ff : 0xb8d878, 8, 22);
  buildBackdrop(area.id);

  for (let z = 0; z < MAP_SIZE; z += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      if (isGrass(x, z)) buildTile(x, z, 0x69b84c, 0.08, 0.28);
      if (area.specialTiles.center && x === area.specialTiles.center.x && z === area.specialTiles.center.z) buildTile(x, z, 0xeaeff6, 0.09, 0.9);
      if (area.specialTiles.sign && x === area.specialTiles.sign.x && z === area.specialTiles.sign.z) buildTile(x, z, 0xb27039, 0.09, 0.88);
    }
  }

  area.landmarks.forEach(buildLandmark);

  area.pedestals.forEach((pedestal) => {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.48, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: pedestal.color, flatShading: true })
    );
    base.position.set(pedestal.x, 0.5, pedestal.z);
    worldGroup.add(base);
    pedestalMeshes.set(pedestal.stageId, base);
  });

  area.npcs.forEach((npc) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makePixelTrainerTexture('#7f7fe7', '#f1c456', '#f5ddc0'),
        transparent: true
      })
    );
    sprite.scale.set(1.1, 1.5, 1);
    sprite.position.set(npc.x, 0.2, npc.z);
    const marker = sprite;
    worldGroup.add(marker);
    npcMarkers.set(npc.id, marker);
  });

  area.items.forEach((item) => {
    const marker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28),
      new THREE.MeshStandardMaterial({ color: 0xffdc4e, emissive: 0x664c00, flatShading: true })
    );
    marker.position.set(item.x, 0.18, item.z);
    worldGroup.add(marker);
    itemMarkers.set(item.id, marker);
  });

  area.portals.forEach((portal) => {
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.12, 0.9),
      new THREE.MeshStandardMaterial({ color: portal.color, emissive: portal.color, emissiveIntensity: 0.28, flatShading: true })
    );
    marker.position.set(portal.x, -0.18, portal.z);
    worldGroup.add(marker);
    portalMarkers.set(portal.id, marker);
  });
}

function transitionToArea(areaId, x, z) {
  state.currentArea = areaId;
  state.player.x = x;
  state.player.z = z;
  state.movement.isMoving = false;
  state.movement.progress = 1;
  buildWorld();
  worldStatusEl.textContent = `Llegas a ${currentArea().name}.`;
  renderHud();
  saveGame();
}

function interact() {
  const interaction = getInteraction();
  if (!interaction) return;

  if (interaction.kind === 'npc') {
    const { npc } = interaction;
    worldStatusEl.textContent = npc.text;
    if (npc.id === 'madre') state.flags.talkedToMother = true;
    if (npc.id === 'galdos') state.flags.metGaldos = true;
    rewardPlayer(npc.reward, `npc-${npc.id}`);
    renderHud();
    saveGame();
    return;
  }

  if (interaction.kind === 'item') {
    state.collectedItems.push(interaction.item.id);
    rewardPlayer(interaction.item.reward);
    worldStatusEl.textContent = interaction.item.text;
    const marker = itemMarkers.get(interaction.item.id);
    if (marker) marker.visible = false;
    renderHud();
    saveGame();
    return;
  }

  if (interaction.kind === 'portal') {
    if (interaction.locked) {
      worldStatusEl.textContent = 'El acceso sigue bloqueado. Necesitas avanzar mas en la Liga.';
      return;
    }
    transitionToArea(interaction.portal.toArea, interaction.portal.toX, interaction.portal.toZ);
    return;
  }

  if (interaction.kind === 'center') {
    state.player.party.forEach((mon) => {
      mon.hp = mon.maxHp;
    });
    worldStatusEl.textContent = 'Tu equipo ha sido curado al completo.';
    renderHud();
    saveGame();
    return;
  }

  if (interaction.kind === 'sign' || interaction.kind === 'home') {
    worldStatusEl.textContent = interaction.text;
    renderHud();
    return;
  }

  if (interaction.kind === 'lab') {
    state.flags.metGaldos = true;
    worldStatusEl.textContent = 'Profesor Galdos: captura Pokemon, cruza zonas y limpia la Liga por etapas.';
    renderHud();
    saveGame();
    return;
  }

  if (interaction.kind === 'rival') {
    spawnBattle('trainer', {
      team: ['Ratamad', 'Pichoneta', 'Eevee'],
      baseLevel: 5,
      opening: 'Pablo: "Siempre compitiendo por todo. Vamos a ver si vales para esto."',
      rewardCoins: 55
    });
    state.flags.beatPablo = true;
    saveGame();
    return;
  }

  if (interaction.kind === 'legendary') {
    spawnBattle('trainer', {
      team: [defaultMon('OrsonRegio', 18)],
      baseLevel: 18,
      opening: 'Orson Regio ruge frente al skyline de Madrid.',
      rewardCoins: 180
    });
    state.flags.sawLegendary = true;
    saveGame();
    return;
  }

  if (interaction.kind === 'stage') {
    if (!interaction.unlocked || interaction.completed) {
      worldStatusEl.textContent = interaction.text;
      return;
    }
    spawnBattle('trainer', {
      team: interaction.stage.team,
      baseLevel: 6 + state.player.badges.length * 2,
      stageId: interaction.stage.id,
      opening: `${interaction.stage.name}: "${interaction.stage.quote}"`
    });
  }
}

function moveBy(dx, dz) {
  stepPlayer(dx, dz);
}

function rotateToDirection(dx, dz) {
  if (dx === 1) state.player.facing = 'right';
  if (dx === -1) state.player.facing = 'left';
  if (dz === 1) state.player.facing = 'down';
  if (dz === -1) state.player.facing = 'up';
}

function stepPlayer(dx, dz) {
  if (state.battle || state.menuOpen || state.movement.isMoving) return;
  rotateToDirection(dx, dz);
  const nx = state.player.x + dx;
  const nz = state.player.z + dz;
  if (isBlocked(nx, nz)) return;
  state.movement.isMoving = true;
  state.movement.fromX = state.player.x;
  state.movement.fromZ = state.player.z;
  state.movement.toX = nx;
  state.movement.toZ = nz;
  state.movement.progress = 0;
  state.player.x = nx;
  state.player.z = nz;
  worldStatusEl.textContent = isGrass(nx, nz) ? 'Hierba alta. Puede salir un Pokemon salvaje.' : `Explorando ${currentArea().name}.`;
  renderHud();
  saveGame();
}

function toggleMenu() {
  if (state.battle) return;
  state.menuOpen = !state.menuOpen;
  renderMenu();
}

function cycleLeadMon() {
  if (state.battle || state.player.party.length <= 1) return;
  state.player.activePartyIndex = (state.player.activePartyIndex + 1) % state.player.party.length;
  worldStatusEl.textContent = `Ahora lidera ${state.player.party[state.player.activePartyIndex].species}.`;
  renderHud();
  saveGame();
}

const playerMesh = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: makePixelTrainerTexture(),
    transparent: true
  })
);
playerMesh.scale.set(1.15, 1.65, 1);
scene.add(playerMesh);

function updatePlayerMesh(dt) {
  const speed = 8 * dt;
  if (state.movement.isMoving) {
    state.movement.progress += speed;
    const t = Math.min(1, state.movement.progress);
    playerMesh.position.x = THREE.MathUtils.lerp(state.movement.fromX, state.movement.toX, t);
    playerMesh.position.z = THREE.MathUtils.lerp(state.movement.fromZ, state.movement.toZ, t);
    if (t >= 1) {
      state.movement.isMoving = false;
      tryWildEncounter();
      renderHud();
    }
  } else {
    playerMesh.position.x = state.player.x;
    playerMesh.position.z = state.player.z;
  }

  camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerMesh.position.x + 0.1, speed * 0.9);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, playerMesh.position.z + 4.8, speed * 0.9);
  camera.lookAt(playerMesh.position.x, 0, playerMesh.position.z);
}

function highlightWorld(time) {
  const next = nextStage();
  pedestalMeshes.forEach((mesh, stageId) => {
    const completed = state.player.completedStages.includes(stageId);
    const active = next && next.id === stageId;
    mesh.position.y = active ? 0.5 + Math.sin(time * 0.004) * 0.1 : 0.5;
    mesh.material.emissive = new THREE.Color(completed ? 0x1e6a1e : active ? 0x4224aa : 0x000000);
  });

  itemMarkers.forEach((mesh, itemId) => {
    mesh.visible = !state.collectedItems.includes(itemId);
    mesh.rotation.y += 0.04;
  });

  npcMarkers.forEach((mesh) => {
    mesh.position.y = 0.2 + Math.sin(time * 0.003) * 0.04;
  });

  portalMarkers.forEach((mesh, portalId) => {
    const portal = currentArea().portals.find((entry) => entry.id === portalId);
    const locked = portal?.requiresStage && !state.player.completedStages.includes(portal.requiresStage);
    mesh.material.emissiveIntensity = locked ? 0.06 : 0.28 + Math.sin(time * 0.005) * 0.08;
  });
}

function chooseStarter(speciesName) {
  state.player.party = [defaultMon(speciesName, 5)];
  state.player.activePartyIndex = 0;
  state.starterChosen = true;
  starterScreenEl.classList.add('hidden');
  worldStatusEl.textContent = `${speciesName} se une al equipo. Sal a explorar Tetuan.`;
  renderHud();
  saveGame();
}

function initStarterButtons() {
  STARTERS.forEach((speciesName) => {
    const button = document.createElement('button');
    button.textContent = speciesName;
    button.addEventListener('click', () => chooseStarter(speciesName));
    starterOptionsEl.appendChild(button);
  });
}

document.querySelectorAll('.battle-action').forEach((button) => {
  button.addEventListener('click', () => playerAction(button.dataset.action));
});

document.querySelector('[data-close-menu="true"]').addEventListener('click', () => {
  state.menuOpen = false;
  renderMenu();
});

document.querySelectorAll('#mobile-controls button').forEach((button) => {
  button.addEventListener('click', () => {
    const control = button.dataset.control;
    if (control === 'up') stepPlayer(0, -1);
    if (control === 'down') stepPlayer(0, 1);
    if (control === 'left') stepPlayer(-1, 0);
    if (control === 'right') stepPlayer(1, 0);
    if (control === 'a') interact();
    if (control === 'b') playerAction('run');
    if (control === 'start') toggleMenu();
    if (control === 'select') cycleLeadMon();
  });
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') stepPlayer(0, -1);
  if (key === 'arrowdown' || key === 's') stepPlayer(0, 1);
  if (key === 'arrowleft' || key === 'a') stepPlayer(-1, 0);
  if (key === 'arrowright' || key === 'd') stepPlayer(1, 0);
  if (key === 'x') interact();
  if (key === 'z') playerAction('run');
  if (key === 'enter') toggleMenu();
  if (key === 'shift') cycleLeadMon();
});

function resizeRenderer() {
  const screen = canvas.getBoundingClientRect();
  const aspect = screen.width / screen.height || 1.5;
  const baseHeight = INTERNAL_HEIGHT;
  const baseWidth = Math.round(baseHeight * aspect);
  renderer.setSize(baseWidth, baseHeight, false);
  camera.left = -8.5 * aspect;
  camera.right = 8.5 * aspect;
  camera.top = 6.5;
  camera.bottom = -6.5;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeRenderer);

function animate(time) {
  requestAnimationFrame(animate);
  updatePlayerMesh(0.016);
  highlightWorld(time);
  renderMenu();
  renderer.render(scene, camera);
}

loadGame();
buildWorld();
initStarterButtons();
if (state.starterChosen && state.player.party.length > 0) starterScreenEl.classList.add('hidden');
resizeRenderer();
renderHud();
renderBattle();
renderMenu();
animate(0);

window.__PMV2 = {
  moveBy,
  interact,
  forceWildEncounter,
  battleAction: playerAction,
  getState: () => structuredClone(state),
  setStarter: chooseStarter,
  warp: (areaId, x, z) => {
    if (!AREAS[areaId]) return;
    transitionToArea(areaId, x ?? AREAS[areaId].spawn.x, z ?? AREAS[areaId].spawn.z);
  }
};
