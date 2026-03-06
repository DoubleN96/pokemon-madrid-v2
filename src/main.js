import * as THREE from 'three';
import {
  GRASS_PATCHES,
  MAP_SIZE,
  PEDESTALS,
  SPECIAL_TILES,
  SPECIES,
  STAGES,
  WILD_TABLE
} from './game-data.js';

const SAVE_KEY = 'pokemon-madrid-v2-threed-save';

const canvas = document.getElementById('game');
const worldStatusEl = document.getElementById('world-status');
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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ad9ff);
scene.fog = new THREE.Fog(0x9ad9ff, 12, 32);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(9, 13, 15);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xffffff, 0.95));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(12, 20, 10);
scene.add(sun);

const worldGroup = new THREE.Group();
scene.add(worldGroup);

const tileMeshes = new Map();
const pedestalMeshes = new Map();

const state = {
  starterChosen: false,
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

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!saved) return;
    Object.assign(state, saved);
  } catch (_error) {
    // ignore malformed save
  }
}

function isGrass(x, z) {
  return GRASS_PATCHES.some(
    (patch) => x >= patch.x1 && x <= patch.x2 && z >= patch.z1 && z <= patch.z2
  );
}

function isPedestal(x, z) {
  return PEDESTALS.find((pedestal) => pedestal.x === x && pedestal.z === z);
}

function isBlocked(x, z) {
  if (x < 0 || z < 0 || x >= MAP_SIZE || z >= MAP_SIZE) return true;
  return false;
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
  const table = WILD_TABLE[currentWildTier()];
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

function renderHud() {
  playerLevelEl.textContent = String(state.player.level);
  playerCoinsEl.textContent = String(state.player.coins);
  playerBadgesEl.textContent = String(state.player.badges.length);
  playerBallsEl.textContent = String(state.player.balls);
  playerPotionsEl.textContent = String(state.player.potions);

  partyListEl.innerHTML = '';
  state.player.party.forEach((mon, index) => {
    const slot = document.createElement('div');
    slot.className = `party-slot ${index === state.player.activePartyIndex ? 'active' : ''}`;
    slot.innerHTML = `
      <strong>${mon.species}</strong><br />
      Nv ${mon.level} · HP ${mon.hp}/${mon.maxHp}
    `;
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
  menuContentEl.innerHTML = `
    <p><strong>Siguiente objetivo:</strong> ${next ? `${next.name} - ${next.title}` : 'Juego completado'}</p>
    <p><strong>Medallas:</strong> ${state.player.badges.join(', ') || 'Ninguna'}</p>
    <p><strong>Capturados:</strong> ${state.player.party.map((mon) => mon.species).join(', ')}</p>
    <p><strong>Controles:</strong> Flechas/WASD mover, X interactuar, Z atras, Shift cambiar lead.</p>
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
    canRun: type === 'wild'
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

function completeStage(stageId, reward) {
  if (!state.player.completedStages.includes(stageId)) {
    state.player.completedStages.push(stageId);
    state.player.badges.push(reward);
    state.player.level += 1;
    state.player.coins += 100;
  }
}

function endBattleWin() {
  const battle = state.battle;
  if (battle.type === 'trainer') {
    const stage = stageById(battle.trainerStageId);
    completeStage(stage.id, stage.reward);
    worldStatusEl.textContent = `Has derrotado a ${stage.name}. ${stage.reward} conseguida.`;
  } else {
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
  const nextIndex = state.player.party.findIndex((mon) => mon.hp > 0);
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
      worldStatusEl.textContent = 'Has sido derrotado. Team Piso te devuelve al centro.';
      state.player.x = SPECIAL_TILES.center.x;
      state.player.z = SPECIAL_TILES.center.z + 1;
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
    state.player.activePartyIndex =
      (state.player.activePartyIndex + 1) % state.player.party.length;
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
    state.player.balls -= 1;
    const catchChance = 0.35 + (1 - enemy.hp / enemy.maxHp) * 0.45;
    if (Math.random() < catchChance && state.player.party.length < 6) {
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

function nearestDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}

function getInteraction() {
  const pos = { x: state.player.x, z: state.player.z };

  if (nearestDistance(pos, SPECIAL_TILES.center) <= 1) {
    return {
      kind: 'center',
      title: 'Centro Team Piso',
      text: 'Pulsa X para curar al equipo completo.'
    };
  }

  if (nearestDistance(pos, SPECIAL_TILES.sign) <= 1) {
    return {
      kind: 'sign',
      title: 'Cartel de ruta',
      text: 'Hispania Nova: hierba alta, lideres progresivos y Team Piso al fondo.'
    };
  }

  const pedestal = PEDESTALS.find((entry) => nearestDistance(pos, entry) <= 1);
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
      title: completed
        ? `${stage.name} completado`
        : unlocked
          ? `${stage.name} disponible`
          : `${stage.name} bloqueado`,
      text: completed
        ? stage.text
        : unlocked
          ? `${stage.title}. Pulsa X para combatir.`
          : 'Todavia no puedes desafiar este pedestal.'
    };
  }

  return null;
}

function interact() {
  const interaction = getInteraction();
  if (!interaction) return;

  if (interaction.kind === 'center') {
    state.player.party.forEach((mon) => {
      mon.hp = mon.maxHp;
    });
    worldStatusEl.textContent = 'Tu equipo ha sido curado al completo.';
    renderHud();
    saveGame();
    return;
  }

  if (interaction.kind === 'sign') {
    worldStatusEl.textContent = interaction.text;
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
  worldStatusEl.textContent = isGrass(nx, nz)
    ? 'Hierba alta. Puede salir un Pokemon salvaje.'
    : 'Explorando Hispania Nova.';
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
  state.player.activePartyIndex =
    (state.player.activePartyIndex + 1) % state.player.party.length;
  worldStatusEl.textContent = `Ahora lidera ${state.player.party[state.player.activePartyIndex].species}.`;
  renderHud();
  saveGame();
}

function buildTile(x, z, color, height = 0.4) {
  const geometry = new THREE.BoxGeometry(1, height, 1);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2, z);
  worldGroup.add(mesh);
  tileMeshes.set(`${x},${z}`, mesh);
}

function buildWorld() {
  for (let z = 0; z < MAP_SIZE; z += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      let color = 0xd8d0c0;
      if (isGrass(x, z)) color = 0x64b95d;
      if (x === SPECIAL_TILES.center.x && z === SPECIAL_TILES.center.z) color = 0xf2f2f2;
      if (x === SPECIAL_TILES.sign.x && z === SPECIAL_TILES.sign.z) color = 0xd69554;
      buildTile(x, z, color);
    }
  }

  PEDESTALS.forEach((pedestal) => {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.48, 1.2, 10),
      new THREE.MeshStandardMaterial({ color: pedestal.color })
    );
    base.position.set(pedestal.x, 1.0, pedestal.z);
    worldGroup.add(base);
    pedestalMeshes.set(pedestal.stageId, base);
  });
}

const playerMesh = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.9, 0.7),
  new THREE.MeshStandardMaterial({ color: 0xff4343 })
);
body.position.y = 0.75;
const hat = new THREE.Mesh(
  new THREE.BoxGeometry(0.74, 0.18, 0.74),
  new THREE.MeshStandardMaterial({ color: 0x2a47ff })
);
hat.position.y = 1.27;
playerMesh.add(body, hat);
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
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerMesh.position.x + 0.4, speed);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, playerMesh.position.z + 7.8, speed);
  camera.lookAt(playerMesh.position.x, 0.4, playerMesh.position.z + 0.4);
}

function highlightPedestals(time) {
  const next = nextStage();
  pedestalMeshes.forEach((mesh, stageId) => {
    const completed = state.player.completedStages.includes(stageId);
    const active = next && next.id === stageId;
    mesh.position.y = active ? 1 + Math.sin(time * 0.004) * 0.12 : 1;
    mesh.material.emissive = new THREE.Color(
      completed ? 0x1e6a1e : active ? 0x4224aa : 0x000000
    );
  });
}

function initStarterButtons() {
  ['Charmander', 'Squirtle', 'Bulbasaur'].forEach((speciesName) => {
    const button = document.createElement('button');
    button.textContent = speciesName;
    button.addEventListener('click', () => {
      state.player.party = [defaultMon(speciesName, 5)];
      state.player.activePartyIndex = 0;
      state.starterChosen = true;
      starterScreenEl.classList.add('hidden');
      worldStatusEl.textContent = `${speciesName} se une al equipo. Sal a explorar.`;
      renderHud();
      saveGame();
    });
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate(time) {
  requestAnimationFrame(animate);
  updatePlayerMesh(0.016);
  highlightPedestals(time);
  renderMenu();
  renderer.render(scene, camera);
}

loadGame();
buildWorld();
initStarterButtons();
if (state.starterChosen && state.player.party.length > 0) {
  starterScreenEl.classList.add('hidden');
}
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
  setStarter: (name) => {
    state.player.party = [defaultMon(name, 5)];
    state.player.activePartyIndex = 0;
    state.starterChosen = true;
    starterScreenEl.classList.add('hidden');
    renderHud();
    saveGame();
  }
};
