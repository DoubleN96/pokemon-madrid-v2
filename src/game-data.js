export const MAP_SIZE = 18;

export const SPECIES = {
  Charmander: { emoji: 'CH', color: 0xff7a36, baseHp: 24, attack: 8, defense: 4, skill: 'Ascuas' },
  Squirtle: { emoji: 'SQ', color: 0x5ba7ff, baseHp: 28, attack: 6, defense: 6, skill: 'Pistola Agua' },
  Bulbasaur: { emoji: 'BU', color: 0x61cc72, baseHp: 26, attack: 7, defense: 5, skill: 'Latigo Cepa' },
  Pikachu: { emoji: 'PI', color: 0xf2d14a, baseHp: 20, attack: 9, defense: 3, skill: 'Impactrueno' },
  Psyduck: { emoji: 'PS', color: 0xf4cf6d, baseHp: 24, attack: 7, defense: 4, skill: 'Confusion' },
  Gastly: { emoji: 'GA', color: 0x6f69c9, baseHp: 18, attack: 10, defense: 2, skill: 'Tinieblas' },
  Eevee: { emoji: 'EE', color: 0xae7a4a, baseHp: 22, attack: 7, defense: 4, skill: 'Placaje' },
  Dratini: { emoji: 'DR', color: 0x86a8ff, baseHp: 26, attack: 8, defense: 4, skill: 'Cola Dragon' },
  Rotom: { emoji: 'RO', color: 0xff9f38, baseHp: 24, attack: 9, defense: 5, skill: 'Chispa' },
  Gardevoir: { emoji: 'GV', color: 0x7ddcbe, baseHp: 30, attack: 9, defense: 7, skill: 'Brillo Magico' },
  Lucario: { emoji: 'LU', color: 0x7392f7, baseHp: 32, attack: 11, defense: 7, skill: 'Esfera Aural' },
  Dragonite: { emoji: 'DN', color: 0xe2a54b, baseHp: 36, attack: 12, defense: 8, skill: 'Hiperrayo' },
  Metagross: { emoji: 'MG', color: 0x8fb2e8, baseHp: 38, attack: 13, defense: 10, skill: 'Punio Meteoro' },
  Garchomp: { emoji: 'GC', color: 0x5d7fb7, baseHp: 36, attack: 13, defense: 8, skill: 'Tierra Viva' },
  MrMime: { emoji: 'MM', color: 0xffbfd9, baseHp: 30, attack: 10, defense: 6, skill: 'Pantalla Rota' },
  Snorlax: { emoji: 'SN', color: 0x5d7c8c, baseHp: 42, attack: 10, defense: 9, skill: 'Golpe Cuerpo' }
};

export const WILD_TABLE = [
  ['Pikachu', 'Eevee', 'Psyduck'],
  ['Gastly', 'Pikachu', 'Eevee'],
  ['Dratini', 'Rotom', 'Psyduck'],
  ['Gastly', 'Dratini', 'Rotom']
];

export const STAGES = [
  {
    id: 'eduardo',
    name: 'Eduardo',
    title: 'Lider del Ego Mesetario',
    text: 'Primer lider. Cobra poco pero se cree Elon Musk.',
    quote: 'Espero que hayas traido tu autoestima, porque yo la necesito para vivir.',
    reward: 'Medalla Ego',
    team: ['Eevee', 'Pikachu']
  },
  {
    id: 'cortina',
    name: 'Cortina',
    title: 'Lider de la Disolucion Gastrica',
    text: 'Caos fisico, moral y acuatico.',
    quote: 'No se si es nervios, ansiedad o gastroenteritis, pero voy a darte asco.',
    reward: 'Medalla Nausea',
    team: ['Psyduck', 'Gastly']
  },
  {
    id: 'blanca',
    name: 'Blanca',
    title: 'Lider del Contrato Dulce',
    text: 'Te gana con dulzura, educacion y jurisprudencia.',
    quote: 'Te ganare con dulzura, educacion... y jurisprudencia.',
    reward: 'Medalla Contrato',
    team: ['Eevee', 'Gardevoir']
  },
  {
    id: 'rafael',
    name: 'Rafael Robledo',
    title: 'Lider de las Finanzas Oscuras',
    text: 'Carisma peligroso y acero corrupto.',
    quote: 'Te voy a vender un plan de pensiones mientras te debilito.',
    reward: 'Medalla Corrupta',
    team: ['Rotom', 'Lucario']
  },
  {
    id: 'alex',
    name: 'Alex',
    title: 'Alto Mando Digital',
    text: 'Programador romantico, electrico y caotico.',
    quote: 'No he elegido esto, pero aqui estoy.',
    reward: 'Llave Liga',
    team: ['Rotom', 'Pikachu', 'Gardevoir']
  },
  {
    id: 'alvaro',
    name: 'Alvaro Alonso',
    title: 'Planificador Total',
    text: 'Todo esta ya modelado en una celda de Excel.',
    quote: 'Tu derrota esta prevista en la celda F46 del Excel.',
    reward: 'Acceso al campeon',
    team: ['Gardevoir', 'Lucario', 'Dragonite']
  },
  {
    id: 'adrian',
    name: 'Adrian Barrera',
    title: 'Movimiento Schizo',
    text: 'Villano principal. Quiere imponer la Reforma Perfecta.',
    quote: 'Mi perfeccion esta al alcance de todos... si hacen EXACTAMENTE lo que yo digo.',
    reward: 'Fin del Movimiento',
    team: ['MrMime', 'Gardevoir', 'Lucario']
  },
  {
    id: 'marcelino',
    name: 'Marcelino',
    title: 'Campeon Supremo del Caos Eficiente',
    text: 'Cierre final del juego.',
    quote: 'Este combate te lo cierro hoy o nunca. Pero siempre gano.',
    reward: 'Trofeo Hispania Nova',
    team: ['Metagross', 'Dragonite', 'Garchomp']
  }
];

export const PEDESTALS = [
  { stageId: 'eduardo', x: 4, z: 3, color: 0xf3c841 },
  { stageId: 'cortina', x: 13, z: 3, color: 0x57c7e8 },
  { stageId: 'blanca', x: 3, z: 9, color: 0xffb7ea },
  { stageId: 'rafael', x: 14, z: 8, color: 0x888888 },
  { stageId: 'alex', x: 4, z: 14, color: 0x6d75ff },
  { stageId: 'alvaro', x: 9, z: 14, color: 0xff8248 },
  { stageId: 'adrian', x: 14, z: 13, color: 0x7f4dca },
  { stageId: 'marcelino', x: 9, z: 8, color: 0xf04f3a }
];

export const SPECIAL_TILES = {
  center: { x: 9, z: 3 },
  sign: { x: 9, z: 5 }
};

export const GRASS_PATCHES = [
  { x1: 1, z1: 1, x2: 6, z2: 6 },
  { x1: 11, z1: 1, x2: 16, z2: 6 },
  { x1: 1, z1: 11, x2: 6, z2: 16 },
  { x1: 11, z1: 11, x2: 16, z2: 16 }
];
