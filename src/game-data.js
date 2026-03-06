export const MAP_SIZE = 18;

export const STARTERS = ['Chulapon', 'Gatolegre', 'Azulejin'];

export const SPECIES = {
  Chulapon: { emoji: 'CP', color: 0xb65d35, baseHp: 26, attack: 9, defense: 5, skill: 'Golpe Castizo' },
  Gatolegre: { emoji: 'GL', color: 0x574d8f, baseHp: 23, attack: 8, defense: 4, skill: 'Mofa Nocturna' },
  Azulejin: { emoji: 'AZ', color: 0x4c99c8, baseHp: 28, attack: 7, defense: 7, skill: 'Chorro Ceramico' },
  ChulaponPlus: { emoji: 'C+', color: 0xa14b27, baseHp: 33, attack: 12, defense: 7, skill: 'Gancho Verbenero' },
  Castizon: { emoji: 'CZ', color: 0x7e3619, baseHp: 42, attack: 15, defense: 10, skill: 'Orgullo Castizo' },
  GatolegrePlus: { emoji: 'G+', color: 0x6255aa, baseHp: 30, attack: 11, defense: 6, skill: 'Arañazo Sombrio' },
  Gatonoche: { emoji: 'GN', color: 0x43306d, baseHp: 40, attack: 14, defense: 8, skill: 'Leyenda Urbana' },
  Azulejon: { emoji: 'A+', color: 0x3d8ab8, baseHp: 35, attack: 10, defense: 11, skill: 'Muro de Mayolica' },
  Mayolicon: { emoji: 'MY', color: 0x256f9e, baseHp: 45, attack: 12, defense: 14, skill: 'Cupula Azul' },
  Pikachu: { emoji: 'PI', color: 0xf2d14a, baseHp: 20, attack: 9, defense: 3, skill: 'Impactrueno' },
  Psyduck: { emoji: 'PS', color: 0xf4cf6d, baseHp: 24, attack: 7, defense: 4, skill: 'Confusion' },
  Gastly: { emoji: 'GA', color: 0x6f69c9, baseHp: 18, attack: 10, defense: 2, skill: 'Tinieblas' },
  Eevee: { emoji: 'EE', color: 0xae7a4a, baseHp: 22, attack: 7, defense: 4, skill: 'Placaje' },
  Dratini: { emoji: 'DR', color: 0x86a8ff, baseHp: 26, attack: 8, defense: 4, skill: 'Cola Dragon' },
  Rotom: { emoji: 'RO', color: 0xff9f38, baseHp: 24, attack: 9, defense: 5, skill: 'Chispa' },
  Gardevoir: { emoji: 'GV', color: 0x7ddcbe, baseHp: 30, attack: 9, defense: 7, skill: 'Brillo Magico' },
  Lucario: { emoji: 'LU', color: 0x7392f7, baseHp: 32, attack: 11, defense: 7, skill: 'Esfera Aural' },
  Dragonite: { emoji: 'DN', color: 0xe2a54b, baseHp: 36, attack: 12, defense: 8, skill: 'Hiperrayo' },
  Metagross: { emoji: 'MG', color: 0x8fb2e8, baseHp: 38, attack: 13, defense: 10, skill: 'Puño Meteoro' },
  Garchomp: { emoji: 'GC', color: 0x5d7fb7, baseHp: 36, attack: 13, defense: 8, skill: 'Tierra Viva' },
  MrMime: { emoji: 'MM', color: 0xffbfd9, baseHp: 30, attack: 10, defense: 6, skill: 'Pantalla Rota' },
  Metroño: { emoji: 'MT', color: 0x9ba0ad, baseHp: 34, attack: 10, defense: 11, skill: 'Eco del Tunel' },
  Rosalaño: { emoji: 'RS', color: 0xef7fa5, baseHp: 27, attack: 8, defense: 6, skill: 'Polen Castizo' },
  Ratamad: { emoji: 'RM', color: 0x8f7358, baseHp: 21, attack: 8, defense: 4, skill: 'Mordisco Callejero' },
  Pichoneta: { emoji: 'PH', color: 0xc9ccd6, baseHp: 18, attack: 7, defense: 3, skill: 'Picotazo Atocha' },
  OrsonRegio: { emoji: 'OR', color: 0x8a4a26, baseHp: 48, attack: 16, defense: 11, skill: 'Rugido Imperial' }
};

export const WILD_TABLE = {
  tetuan: [
    ['Ratamad', 'Pichoneta', 'Rosalaño', 'Psyduck'],
    ['Gastly', 'Pikachu', 'Eevee', 'Metroño'],
    ['Dratini', 'Rotom', 'Psyduck', 'Rosalaño'],
    ['Gastly', 'Dratini', 'Rotom', 'Metroño']
  ],
  plaza: [
    ['Ratamad', 'Pichoneta', 'Rosalaño'],
    ['Pikachu', 'Eevee', 'Gastly'],
    ['Rotom', 'Psyduck', 'Rosalaño'],
    ['Dratini', 'Rotom', 'Gastly']
  ],
  castellana: [
    ['Pikachu', 'Eevee', 'Metroño'],
    ['Gastly', 'Rotom', 'Psyduck'],
    ['Rotom', 'Dratini', 'Rosalaño'],
    ['Dratini', 'Rotom', 'Gastly']
  ],
  liga: [
    ['Gastly', 'Rotom', 'Metroño'],
    ['Rotom', 'Dratini', 'Lucario'],
    ['Dragonite', 'Gardevoir', 'Rotom'],
    ['Dragonite', 'Metagross', 'Garchomp']
  ]
};

export const STAGES = [
  {
    id: 'matilde',
    name: 'Matilde',
    title: 'Gimnasio de Plaza Mayor',
    text: 'Primer gimnasio. Combate limpio y tutorial real de líderes.',
    quote: 'Madrid empieza por sus plazas. Si no puedes con esto, no podrás con la ciudad.',
    reward: 'Medalla Villa',
    team: ['Ratamad', 'Chulapon']
  },
  {
    id: 'eduardo',
    name: 'Eduardo',
    title: 'Lider del Ego Mesetario',
    text: 'Segundo líder. Cobra poco pero se cree Elon Musk.',
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
    team: ['Rosalaño', 'Gardevoir']
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
    team: ['MrMime', 'Metroño', 'Lucario']
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

export const AREAS = {
  tetuan: {
    id: 'tetuan',
    name: 'Tetuan y Bravo Murillo',
    baseColor: 0xd8d0c0,
    wildTable: 'tetuan',
    spawn: { x: 9, z: 10 },
    specialTiles: {
      center: { x: 9, z: 2 },
      sign: { x: 8, z: 5 },
      homeDoor: { x: 2, z: 15 },
      labDoor: { x: 15, z: 15 },
      rival: { x: 6, z: 11 },
      metro: { x: 9, z: 6 }
    },
    grassPatches: [
      { x1: 1, z1: 1, x2: 5, z2: 6 },
      { x1: 10, z1: 1, x2: 16, z2: 6 },
      { x1: 1, z1: 9, x2: 4, z2: 13 },
      { x1: 11, z1: 11, x2: 16, z2: 16 }
    ],
    blockedTiles: [
      { x1: 0, z1: 0, x2: 0, z2: 17 },
      { x1: 17, z1: 0, x2: 17, z2: 17 },
      { x1: 0, z1: 0, x2: 17, z2: 0 },
      { x1: 0, z1: 17, x2: 17, z2: 17 },
      { x1: 1, z1: 14, x2: 3, z2: 16 },
      { x1: 13, z1: 14, x2: 16, z2: 16 },
      { x1: 6, z1: 7, x2: 12, z2: 10 }
    ],
    portals: [
      { id: 'to-plaza', x: 9, z: 1, title: 'Salida a Plaza Mayor', text: 'Pulsa X para viajar a Plaza Mayor.', toArea: 'plaza', toX: 9, toZ: 15, color: 0xff8750 },
      { id: 'to-castellana', x: 16, z: 8, title: 'Ruta Castellana', text: 'Pulsa X para ir a la Ruta Castellana.', toArea: 'castellana', toX: 1, toZ: 8, color: 0x4f81ff },
      { id: 'to-liga', x: 9, z: 6, title: 'Metro de Madrid', text: 'Pulsa X para bajar hacia la Liga Team Piso.', toArea: 'liga', toX: 2, toZ: 15, color: 0x0047ab, requiresStage: 'rafael' }
    ],
    npcs: [
      {
        id: 'madre',
        x: 2,
        z: 14,
        title: 'Mama',
        text: 'Tu padre desaparecio en las galerias. El profesor Galdos quiere verte. No tardes y llevate una pocion.',
        reward: { type: 'item', key: 'potions', amount: 1 }
      },
      {
        id: 'galdos',
        x: 15,
        z: 14,
        title: 'Profesor Galdos',
        text: 'Madrid esta lleno de Pokemon e historias. Observa, captura y vuelve con datos para tu MadratNav.'
      },
      {
        id: 'vecina',
        x: 5,
        z: 15,
        title: 'Vecina de Tetuan',
        text: 'Arturo siempre ayudaba con la compra. Si le ves ahi abajo, dile que seguimos esperando.'
      }
    ],
    items: [
      { id: 'balls-1', x: 10, z: 15, title: 'Pokeballs', text: 'Encuentras 3 Pokeballs en una mochila olvidada.', reward: { type: 'item', key: 'balls', amount: 3 } },
      { id: 'potions-1', x: 12, z: 12, title: 'Pocion', text: 'Debajo de un banco roto hay una pocion.', reward: { type: 'item', key: 'potions', amount: 1 } }
    ],
    landmarks: [
      { kind: 'home', x: 2, z: 15, width: 3, depth: 2, color: 0xc9745e, label: 'Bravo Murillo 37' },
      { kind: 'lab', x: 15, z: 15, width: 3, depth: 2, color: 0xa8b8d8, label: 'Laboratorio Galdos' },
      { kind: 'center', x: 9, z: 2, width: 3, depth: 2, color: 0xf3f3f3, label: 'Centro Team Piso' },
      { kind: 'metro', x: 9, z: 6, width: 2, depth: 1, color: 0x0047ab, label: 'Metro de Madrid' }
    ],
    pedestals: []
  },
  plaza: {
    id: 'plaza',
    name: 'Plaza Mayor',
    baseColor: 0xe4c9a9,
    wildTable: 'plaza',
    spawn: { x: 9, z: 15 },
    specialTiles: {
      sign: { x: 9, z: 15 }
    },
    grassPatches: [
      { x1: 1, z1: 11, x2: 4, z2: 16 },
      { x1: 13, z1: 11, x2: 16, z2: 16 }
    ],
    blockedTiles: [
      { x1: 0, z1: 0, x2: 0, z2: 17 },
      { x1: 17, z1: 0, x2: 17, z2: 17 },
      { x1: 0, z1: 0, x2: 17, z2: 0 },
      { x1: 0, z1: 17, x2: 17, z2: 17 }
    ],
    portals: [
      { id: 'plaza-return', x: 9, z: 16, title: 'Regreso a Tetuan', text: 'Pulsa X para volver a Tetuan.', toArea: 'tetuan', toX: 9, toZ: 2, color: 0xff8750 },
      { id: 'plaza-castellana', x: 16, z: 8, title: 'Salida a Ruta Castellana', text: 'Pulsa X para continuar hacia la Ruta Castellana.', toArea: 'castellana', toX: 1, toZ: 8, color: 0x4f81ff, requiresStage: 'matilde' }
    ],
    npcs: [
      {
        id: 'guia-plaza',
        x: 6,
        z: 13,
        title: 'Guia Castizo',
        text: 'La plaza es la primera criba. Si derrotas a Matilde, Madrid te empieza a respetar.'
      }
    ],
    items: [
      { id: 'plaza-potion', x: 3, z: 13, title: 'Pocion', text: 'Un comerciante olvido una pocion en un puesto cerrado.', reward: { type: 'item', key: 'potions', amount: 1 } }
    ],
    landmarks: [
      { kind: 'square', x: 9, z: 8, width: 8, depth: 8, color: 0xb7583b, label: 'Plaza Mayor' }
    ],
    pedestals: [
      { stageId: 'matilde', x: 9, z: 7, color: 0xd4b45f }
    ]
  },
  castellana: {
    id: 'castellana',
    name: 'Ruta Castellana',
    baseColor: 0xd4d9bf,
    wildTable: 'castellana',
    spawn: { x: 1, z: 8 },
    specialTiles: {
      sign: { x: 2, z: 8 }
    },
    grassPatches: [
      { x1: 1, z1: 1, x2: 5, z2: 5 },
      { x1: 12, z1: 1, x2: 16, z2: 5 },
      { x1: 1, z1: 12, x2: 5, z2: 16 },
      { x1: 12, z1: 12, x2: 16, z2: 16 }
    ],
    blockedTiles: [
      { x1: 0, z1: 0, x2: 0, z2: 17 },
      { x1: 17, z1: 0, x2: 17, z2: 17 },
      { x1: 0, z1: 0, x2: 17, z2: 0 },
      { x1: 0, z1: 17, x2: 17, z2: 17 }
    ],
    portals: [
      { id: 'castellana-return-tetuan', x: 0, z: 8, title: 'Regreso a Tetuan', text: 'Pulsa X para volver a Tetuan.', toArea: 'tetuan', toX: 15, toZ: 8, color: 0x4f81ff },
      { id: 'castellana-return-plaza', x: 8, z: 17, title: 'Desvio a Plaza Mayor', text: 'Pulsa X para volver a Plaza Mayor.', toArea: 'plaza', toX: 15, toZ: 8, color: 0xff8750 },
      { id: 'castellana-liga', x: 16, z: 8, title: 'Acceso a Liga Team Piso', text: 'Pulsa X para entrar en la Liga Team Piso.', toArea: 'liga', toX: 2, toZ: 15, color: 0x2b3b88, requiresStage: 'rafael' }
    ],
    npcs: [
      {
        id: 'coach-castellana',
        x: 8,
        z: 10,
        title: 'Coach de Ruta',
        text: 'Aqui te curtes. Eduardo, Cortina, Blanca y Rafael no regalan nada.'
      }
    ],
    items: [
      { id: 'castellana-balls', x: 10, z: 9, title: 'Pokeballs', text: 'Encuentras 2 Pokeballs junto a una mochila deportiva.', reward: { type: 'item', key: 'balls', amount: 2 } }
    ],
    landmarks: [
      { kind: 'avenue', x: 8, z: 8, width: 4, depth: 14, color: 0x7f868e, label: 'Paseo Castellana' }
    ],
    pedestals: [
      { stageId: 'eduardo', x: 4, z: 8, color: 0xf3c841 },
      { stageId: 'cortina', x: 8, z: 4, color: 0x57c7e8 },
      { stageId: 'blanca', x: 13, z: 8, color: 0xffb7ea },
      { stageId: 'rafael', x: 8, z: 13, color: 0x888888 }
    ]
  },
  liga: {
    id: 'liga',
    name: 'Liga Team Piso',
    baseColor: 0xc5c7ea,
    wildTable: 'liga',
    spawn: { x: 2, z: 15 },
    specialTiles: {
      sign: { x: 2, z: 15 },
      legendary: { x: 16, z: 9 }
    },
    grassPatches: [
      { x1: 1, z1: 1, x2: 3, z2: 3 },
      { x1: 14, z1: 1, x2: 16, z2: 3 }
    ],
    blockedTiles: [
      { x1: 0, z1: 0, x2: 0, z2: 17 },
      { x1: 17, z1: 0, x2: 17, z2: 17 },
      { x1: 0, z1: 0, x2: 17, z2: 0 },
      { x1: 0, z1: 17, x2: 17, z2: 17 }
    ],
    portals: [
      { id: 'liga-return', x: 1, z: 16, title: 'Salida de la Liga', text: 'Pulsa X para regresar a Tetuan.', toArea: 'tetuan', toX: 9, toZ: 7, color: 0x0047ab }
    ],
    npcs: [
      {
        id: 'ujier-liga',
        x: 3,
        z: 14,
        title: 'Ujier de la Liga',
        text: 'Si has llegado hasta aqui ya no juegas al barrio. Aqui entras en historia.'
      }
    ],
    items: [
      { id: 'liga-potion', x: 6, z: 15, title: 'Super reserva', text: 'Encuentras 2 pociones antes del Alto Mando.', reward: { type: 'item', key: 'potions', amount: 2 } }
    ],
    landmarks: [
      { kind: 'league', x: 9, z: 8, width: 10, depth: 12, color: 0x5d65b9, label: 'Liga Team Piso' }
    ],
    pedestals: [
      { stageId: 'alex', x: 4, z: 14, color: 0x6d75ff },
      { stageId: 'alvaro', x: 9, z: 14, color: 0xff8248 },
      { stageId: 'adrian', x: 14, z: 13, color: 0x7f4dca },
      { stageId: 'marcelino', x: 9, z: 8, color: 0xf04f3a }
    ]
  }
};
