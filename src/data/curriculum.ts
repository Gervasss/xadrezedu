export const learningModules = [
  {
    id: 'fundamentos',
    title: 'Fundamentos do tabuleiro e movimento das peças',
    description: 'Conheça o tabuleiro, os movimentos das peças e as regras para começar a jogar.',
    lessons: [
      { id: 'tabuleiro-coordenadas', title: 'O tabuleiro e as coordenadas' },
      { id: 'peao-promocao', title: 'O peão e a promoção' },
      { id: 'cavalo', title: 'O cavalo e seu movimento' },
      { id: 'dama-torres-bispos', title: 'A dama, as torres e os bispos' },
      { id: 'rei-roque', title: 'O rei e o roque' },
    ],
  },
  {
    id: 'taticas',
    title: 'Táticas iniciais, xeque e xeque-mate',
    description: 'Entenda as ameaças ao rei, as defesas e os primeiros recursos táticos.',
    lessons: [
      { id: 'xeque-defesas', title: 'O xeque e como responder' },
      { id: 'mate-pastor', title: 'O mate do pastor e como se defender' },
      { id: 'cravada-garfo', title: 'Cravada e garfo' },
      { id: 'trocas-material', title: 'Trocas favoráveis e contagem de material' },
      { id: 'partida-guiada', title: 'Partida guiada' },
    ],
  },
];
