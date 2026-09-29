/** Lance esperado do aluno e resposta guiada opcional do exercício. */
export interface MoveStep {
  move: string;
  reply?: string;
}

/** Configuração e instruções de um exercício de tabuleiro. */
export interface BoardExercise {
  title: string;
  instruction: string;
  hint: string;
  explanation: string;
  /** Posição inicial opcional em formato FEN. */
  fen?: string;
  /** Lances aplicados à posição inicial antes do exercício. */
  setup?: string[];
  /** Casa que deve ser localizada em exercícios de coordenadas. */
  target?: string;
  /** Sequência esperada em exercícios de movimentação. */
  steps?: MoveStep[];
}

/** Conteúdo textual, exercícios e pergunta de revisão de uma lição. */
export interface LessonContent {
  paragraphs: string[];
  exercises: BoardExercise[];
  question: string;
  answers: string[];
  correctAnswer: number;
  answerExplanation: string;
}

/** Registro de progresso recebido do armazenamento para uma lição. */
export interface LessonRecord {
  lessonId: string;
  status: unknown;
  completedAt: number | null;
}

/** Totais e percentual de conclusão de um conjunto de lições. */
export interface ProgressSummary {
  completed: number;
  total: number;
  percent: number;
}