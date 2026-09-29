import type { LessonContent } from '../../types/lesson';

// Conteúdo pedagógico indexado pelo mesmo ID usado no catálogo de módulos e nas rotas.
export const lessonContent: Record<string, LessonContent> = {
  'tabuleiro-coordenadas': {
    paragraphs: [
      'O tabuleiro tem 64 casas: oito colunas e oito fileiras. As colunas recebem letras de a até h; as fileiras, números de 1 até 8. Cada casa tem um endereço, como e4.',
      'Com as brancas do seu lado, a coluna a fica à esquerda e a fileira 1 fica embaixo. A casa do canto inferior direito, h1, é clara. A dama começa em uma casa da sua própria cor: dama branca em d1 e dama preta em d8.',
    ],
    exercises: [
      { title: 'Encontre e4', instruction: 'Clique na casa e4.', hint: 'Procure a coluna e e suba até a quarta fileira.', explanation: 'e4 é uma das quatro casas centrais, junto de d4, d5 e e5.', target: 'e4' },
      { title: 'Oriente o tabuleiro', instruction: 'Clique na casa h1.', hint: 'É o canto inferior direito, ocupado pela torre branca.', explanation: 'h1 é clara. Ao montar um tabuleiro, deixe uma casa clara à sua direita.', target: 'h1' },
    ],
    question: 'Qual endereço indica a coluna c e a sexta fileira?', answers: ['f3', 'c6', '6c'], correctAnswer: 1,
    answerExplanation: 'A letra vem primeiro e indica a coluna; o número indica a fileira: c6.',
  },
  'peao-promocao': {
    paragraphs: [
      'O peão avança uma casa em direção ao lado adversário e captura uma casa na diagonal. No primeiro movimento, pode avançar duas casas se ambas estiverem livres. Ele nunca volta para trás.',
      'Ao chegar à última fileira, o peão deve ser promovido a dama, torre, bispo ou cavalo. Não é necessário que essa peça tenha sido capturada. Neste exercício, a promoção será para dama.',
      'En passant é uma captura especial: se um peão adversário avançar duas casas e parar ao lado do seu peão na quinta fileira (para as brancas), você pode capturá-lo como se tivesse avançado uma só. A captura precisa ser feita imediatamente no lance seguinte.',
    ],
    exercises: [
      { title: 'Avance pelo centro', instruction: 'Mova o peão de e2 para e4. Depois da resposta das pretas, avance para e5.', hint: 'Selecione e2 e depois e4. Após ...a6, selecione e4 e depois e5.', explanation: 'O avanço duplo só estava disponível na casa inicial. Depois, o peão avançou uma casa.', steps: [{ move: 'e2e4', reply: 'a7a6' }, { move: 'e4e5' }] },
      { title: 'Promova um peão', instruction: 'Avance o peão de a7 para a8 e transforme-o em dama.', hint: 'Selecione a7 e depois a8. A promoção para dama é automática neste exercício.', explanation: 'Na oitava fileira, o peão foi substituído por uma dama.', fen: '7k/P7/8/8/8/8/8/7K w - - 0 1', steps: [{ move: 'a7a8q' }] },
      { title: 'Capture en passant', instruction: 'As pretas acabaram de jogar d7–d5. Capture esse peão com o peão de e5.', hint: 'Mova e5 para d6, a casa atravessada pelo peão preto.', explanation: 'O peão branco chegou a d6 e o peão preto saiu de d5. Essa captura só era possível imediatamente após o avanço duplo.', fen: '7k/8/8/3pP3/8/8/8/7K w - d6 0 2', steps: [{ move: 'e5d6' }] },
    ],
    question: 'Como um peão captura normalmente?', answers: ['Uma casa na diagonal para a frente', 'Duas casas em linha reta', 'Uma casa para trás'], correctAnswer: 0,
    answerExplanation: 'O avanço é reto; a captura normal é uma casa na diagonal para a frente.',
  },
  cavalo: {
    paragraphs: [
      'O cavalo se move em L: duas casas em uma direção e uma na perpendicular. Cada movimento termina em uma casa de cor diferente da inicial.',
      'Ele é a única peça que pode saltar sobre outras peças. Pode cair em uma casa vazia ou capturar uma peça adversária, mas não pode ocupar uma casa com uma peça da própria cor.',
    ],
    exercises: [
      { title: 'Salte sobre os peões', instruction: 'Desenvolva o cavalo de g1 para f3.', hint: 'Selecione o cavalo em g1. Os peões à frente não bloqueiam o salto para f3.', explanation: 'O cavalo entrou no jogo sem precisar mover os peões antes.', steps: [{ move: 'g1f3' }] },
      { title: 'Reconheça o L', instruction: 'Mova o cavalo de d4 para f5.', hint: 'Duas colunas para a direita e uma fileira para cima.', explanation: 'De d4 a f5 há um movimento em L. As casas de origem e destino têm cores diferentes.', fen: '7k/8/8/8/3N4/8/8/7K w - - 0 1', steps: [{ move: 'd4f5' }] },
    ],
    question: 'Qual peça pode saltar sobre outras peças?', answers: ['Bispo', 'Torre', 'Cavalo'], correctAnswer: 2,
    answerExplanation: 'O cavalo salta. Bispos, torres e damas precisam de caminhos livres.',
  },
  'dama-torres-bispos': {
    paragraphs: [
      'A torre se move pelas fileiras e colunas. O bispo se move pelas diagonais e permanece sempre na mesma cor de casa. A dama combina os movimentos da torre e do bispo.',
      'Essas peças podem percorrer várias casas, mas não saltam obstáculos. Para capturar, param na casa da peça adversária. Não podem continuar além dela no mesmo lance.',
    ],
    exercises: [
      { title: 'Uma coluna aberta', instruction: 'Mova a torre de a1 para a8.', hint: 'A coluna a está livre. Clique em a1 e em a8.', explanation: 'A torre percorreu uma coluna inteira sem encontrar obstáculos.', fen: '7k/8/8/8/8/8/8/R6K w - - 0 1', steps: [{ move: 'a1a8' }] },
      { title: 'Uma diagonal livre', instruction: 'Mova o bispo de c1 para h6.', hint: 'Siga a diagonal c1–d2–e3–f4–g5–h6.', explanation: 'O bispo permaneceu na mesma cor de casa durante o movimento.', fen: '7k/8/8/8/8/8/8/2B4K w - - 0 1', steps: [{ move: 'c1h6' }] },
      { title: 'A força da dama', instruction: 'Mova a dama de d1 para d5.', hint: 'A dama também pode se mover em linha reta, como uma torre.', explanation: 'Além das diagonais, a dama pode usar qualquer fileira ou coluna livre.', fen: '7k/8/8/8/8/8/8/3Q3K w - - 0 1', steps: [{ move: 'd1d5' }] },
    ],
    question: 'Qual peça combina os movimentos da torre e do bispo?', answers: ['Cavalo', 'Dama', 'Rei'], correctAnswer: 1,
    answerExplanation: 'A dama percorre linhas retas e diagonais, desde que o caminho esteja livre.',
  },
  'rei-roque': {
    paragraphs: [
      'O rei anda uma casa em qualquer direção. Ele nunca pode entrar em uma casa atacada. Os dois reis não podem ficar lado a lado, pois atacariam um ao outro.',
      'No roque, o rei anda duas casas em direção a uma torre e ela passa para a casa ao lado dele. Rei e torre não podem ter se movido; as casas entre eles devem estar vazias. O rei não pode estar em xeque, atravessar uma casa atacada ou terminar em xeque.',
      'No roque pequeno das brancas, o rei vai de e1 a g1 e a torre de h1 a f1. No grande, o rei vai a c1 e a torre de a1 a d1.',
    ],
    exercises: [
      { title: 'Faça o roque pequeno', instruction: 'Mova o rei de e1 para g1. A torre se moverá junto.', hint: 'Selecione o rei, não a torre. Neste tabuleiro, as condições do roque estão satisfeitas.', explanation: 'O rei chegou a g1 e a torre a f1. O roque conta como um único lance.', fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', steps: [{ move: 'e1g1' }] },
      { title: 'Saia da linha de ataque', instruction: 'O rei está em xeque na coluna e. Mova-o de e1 para f1.', hint: 'A torre preta ataca a coluna e. f1 está fora dessa coluna.', explanation: 'O rei saiu do xeque. Fazer roque enquanto está em xeque seria ilegal.', fen: '4r2k/8/8/8/8/8/8/4K3 w - - 0 1', steps: [{ move: 'e1f1' }] },
    ],
    question: 'É permitido fazer roque enquanto seu rei está em xeque?', answers: ['Sim, se a torre estiver livre', 'Sim, uma vez por partida', 'Não'], correctAnswer: 2,
    answerExplanation: 'Primeiro é preciso sair do xeque por outro lance legal.',
  },
  'xeque-defesas': {
    paragraphs: [
      'Xeque significa que o rei está atacado. A resposta precisa eliminar a ameaça: mover o rei, capturar a peça atacante ou bloquear a linha de ataque com outra peça.',
      'Nem toda defesa serve em toda posição. Não se bloqueia um ataque de cavalo. Em xeque duplo, o rei precisa se mover. Se nenhuma resposta legal eliminar o xeque, é xeque-mate e a partida termina.',
    ],
    exercises: [
      { title: 'Bloqueie o ataque', instruction: 'Interponha o bispo de d1 em e2 para proteger o rei.', hint: 'A torre em e8 ataca o rei em e1. Coloque o bispo no caminho.', explanation: 'O bispo bloqueou a coluna e. O rei deixou de estar em xeque.', fen: '4r2k/8/8/8/8/8/8/3BK3 w - - 0 1', steps: [{ move: 'd1e2' }] },
      { title: 'Capture o atacante', instruction: 'Capture a torre em e2 com o rei em e1.', hint: 'A torre não está protegida nesta posição. O rei pode capturá-la.', explanation: 'Capturar a peça atacante também elimina o xeque, desde que o rei não fique atacado.', fen: '7k/8/8/8/8/8/4r3/4K3 w - - 0 1', steps: [{ move: 'e1e2' }] },
    ],
    question: 'O que caracteriza o xeque-mate?', answers: ['O rei está atacado e não há defesa legal', 'A dama foi capturada', 'O rei está sem movimentos, mas não está atacado'], correctAnswer: 0,
    answerExplanation: 'Mate exige xeque e ausência de defesa legal. Sem xeque e sem lances legais, ocorre afogamento: empate.',
  },
  'mate-pastor': {
    paragraphs: [
      'O mate do pastor explora f7, uma casa inicialmente defendida apenas pelo rei preto. A dama e o bispo brancos podem coordenar um ataque contra ela.',
      'Na sequência guiada, as pretas cometem um erro ao jogar ...Cf6 sem resolver a ameaça em f7. Isso não é uma vitória forçada desde a posição inicial: há várias defesas.',
      'Observe ameaças antes de desenvolver automaticamente. Na segunda posição, ...g6 bloqueia a diagonal da dama h5–f7 e a ataca. A dama precisa recuar ou escolher outro plano.',
    ],
    exercises: [
      { title: 'Veja a combinação', instruction: 'Jogue e2–e4, f1–c4, d1–h5 e h5–f7. As pretas responderão automaticamente.', hint: 'A dama captura em f7 protegida pelo bispo em c4.', explanation: 'Dxf7 é mate nesta posição: o rei não pode capturar a dama protegida pelo bispo.', steps: [{ move: 'e2e4', reply: 'e7e5' }, { move: 'f1c4', reply: 'b8c6' }, { move: 'd1h5', reply: 'g8f6' }, { move: 'h5f7' }] },
      { title: 'Defenda com as pretas', instruction: 'Agora você joga de pretas. Avance g7 para g6 para bloquear a ameaça.', hint: 'O peão em g6 interrompe a diagonal h5–g6–f7.', explanation: 'O ataque imediato em f7 foi interrompido. Continue atento e desenvolva as peças.', setup: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], steps: [{ move: 'g7g6' }] },
    ],
    question: 'Por que f7 é um alvo no começo da partida?', answers: ['Porque não pode receber um peão', 'Porque inicialmente só o rei preto a defende', 'Porque a dama não pode defendê-la nunca'], correctAnswer: 1,
    answerExplanation: 'Na posição inicial, apenas o rei defende f7. A coordenação de duas peças pode criar uma ameaça.',
  },
  'cravada-garfo': {
    paragraphs: [
      'Um garfo ataca duas ou mais peças ao mesmo tempo. O cavalo é especialmente útil para isso, por seu movimento diferente das outras peças.',
      'Uma cravada limita o movimento de uma peça porque há algo importante atrás dela. Se atrás dela estiver o rei, a peça não pode se mover de forma que exponha o rei ao ataque: é uma cravada absoluta.',
    ],
    exercises: [
      { title: 'Ataque duplo de cavalo', instruction: 'Mova o cavalo de d5 para c7, atacando o rei e a torre.', hint: 'Em c7, o cavalo ataca e8 e a8.', explanation: 'O rei está em xeque e a torre também é atacada. A resposta ao xeque tem prioridade.', fen: 'r3k3/8/8/3N4/8/8/8/7K w - - 0 1', steps: [{ move: 'd5c7' }] },
      { title: 'Crave o cavalo', instruction: 'Mova o bispo de c3 para b4 e alinhe-o ao cavalo e ao rei.', hint: 'A diagonal é b4–c5–d6–e7–f8.', explanation: 'O cavalo em e7 está entre o bispo e o rei f8. Não pode saltar e deixar o rei exposto.', fen: '5k2/4n3/8/8/8/2B5/8/7K w - - 0 1', steps: [{ move: 'c3b4' }] },
    ],
    question: 'O que é um garfo?', answers: ['Uma troca de torres', 'Um tipo de roque', 'Um ataque simultâneo a duas ou mais peças'], correctAnswer: 2,
    answerExplanation: 'Uma só peça cria várias ameaças ao mesmo tempo.',
  },
  'trocas-material': {
    paragraphs: [
      'Uma referência comum é: peão vale 1, cavalo e bispo cerca de 3, torre 5 e dama 9. O rei não tem valor de troca: sua segurança determina a partida.',
      'Antes de capturar, observe se o adversário pode recapturar e compare o material dos dois lados. Esses valores são aproximados: atividade, segurança do rei e ameaças de mate também importam.',
    ],
    exercises: [
      { title: 'Ganhe material', instruction: 'Capture a dama em d5 com o peão de e4.', hint: 'Peões capturam na diagonal. Selecione e4 e d5.', explanation: 'Um peão capturou uma dama sem recaptura imediata nesta posição.', fen: '7k/8/8/3q4/4P3/8/8/7K w - - 0 1', steps: [{ move: 'e4d5' }] },
      { title: 'Avalie a recaptura', instruction: 'Capture a torre em a8 com a torre de a1. Observe a resposta do rei preto.', hint: 'A coluna a está livre, mas o rei em b8 protege a torre preta.', explanation: 'Após Txa8, o rei recaptura em a8. Cada lado perdeu uma torre: a troca foi equivalente em material.', fen: 'rk6/8/8/8/8/8/8/R6K w - - 0 1', steps: [{ move: 'a1a8', reply: 'b8a8' }] },
    ],
    question: 'Pelos valores aproximados, trocar um cavalo por uma torre ganha quanto material?', answers: ['2 pontos', '5 pontos', 'Nenhum'], correctAnswer: 0,
    answerExplanation: 'A torre vale aproximadamente 5 e o cavalo 3: a diferença é 2.',
  },
  'partida-guiada': {
    paragraphs: [
      'Vamos combinar os fundamentos em uma sequência de abertura: ocupar o centro, desenvolver cavalo e bispo e proteger o rei com o roque. As respostas das pretas são fixas para fins didáticos; este exercício não é uma partida contra inteligência artificial.',
      'Não existe uma sequência que sirva para toda partida. Antes de cada lance, verifique se seu rei está em xeque, se há peças ameaçadas e o que o último lance adversário mudou.',
      'Para encerrar a revisão, resolva uma posição de mate em uma jogada. O rei precisa estar em xeque e não ter uma fuga ou defesa legal.',
    ],
    exercises: [
      { title: 'Construa uma posição segura', instruction: 'Jogue e2–e4, g1–f3, f1–c4 e faça o roque e1–g1. As pretas responderão a cada etapa.', hint: 'Depois de desenvolver cavalo e bispo, o caminho para o roque estará livre.', explanation: 'Você ocupou o centro, desenvolveu peças e fez o roque. A partida continuaria a partir desta posição.', steps: [{ move: 'e2e4', reply: 'e7e5' }, { move: 'g1f3', reply: 'b8c6' }, { move: 'f1c4', reply: 'g8f6' }, { move: 'e1g1' }] },
      { title: 'Finalize com mate', instruction: 'Mova a dama de g6 para g7 para dar xeque-mate.', hint: 'O rei branco em f6 protege g7. A dama também cobre as casas de fuga.', explanation: 'Dg7 é xeque-mate: a dama está protegida e o rei preto não tem defesa legal.', fen: '7k/8/5KQ1/8/8/8/8/8 w - - 0 1', steps: [{ move: 'g6g7' }] },
    ],
    question: 'Qual é um bom plano geral de abertura?', answers: ['Mover apenas a dama repetidamente', 'Ocupar o centro, desenvolver peças e proteger o rei', 'Capturar qualquer peça sem calcular a resposta'], correctAnswer: 1,
    answerExplanation: 'Esses objetivos ajudam suas peças a trabalhar juntas, sem dispensar a análise das ameaças concretas.',
  },
};
