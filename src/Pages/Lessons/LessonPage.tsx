import { useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { learningModules } from '../../data/curriculum';
import { lessonContent } from './lessonContent';
import InteractiveBoard from './InteractiveBoard';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import { progressErrorMessage } from '../../firebase/progressErrors';
import './LessonPage.css';

// Resolve a lição pela rota e apresenta um estado de retorno para IDs desconhecidos.
export default function LessonPage({ user }: { user: User }) {
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});

  const { lessonId = '' } = useParams();
  // O catálogo define a navegação; o conteúdo complementar fornece os exercícios da aula.
  const lesson = learningModules.flatMap((module) => module.lessons).find((item) => item.id === lessonId);
  return <>
    {/* Mantém o cabeçalho do dashboard visível e trata IDs inválidos sem montar a lição. */}
    <DashboardHeader user={user} />
    {!lesson || !lessonContent[lessonId]
      ? <main className="lesson-page"><h1>Lição não encontrada</h1><Link to="/inicio">Voltar aos módulos</Link></main>
      : <Lesson key={`${user.uid}:${lessonId}`} user={user} lessonId={lessonId} title={lesson.title} />}
  </>;
}

// Coordena exercícios, revisão final e persistência da conclusão da lição.
function Lesson({ user, lessonId, title }: { user: User; lessonId: string; title: string }) {
  const content = lessonContent[lessonId];
  // A ordem dos módulos e das aulas também determina qual lição será sugerida em seguida.
  const module = learningModules.find((item) => item.lessons.some((lesson) => lesson.id === lessonId))!;
  const allLessons = learningModules.flatMap((item) => item.lessons);
  const nextLesson = allLessons[allLessons.findIndex((item) => item.id === lessonId) + 1];

  // Este estado representa a tentativa atual; só a conclusão salva no Firestore persiste entre visitas.
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const pending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const practiceComplete = exerciseIndex === content.exercises.length - 1 && exerciseDone;
  const canComplete = practiceComplete && answer === content.correctAnswer;

  // Grava a conclusão validada sem substituir a data de uma conclusão anterior.
  async function completeLesson() {
    // Evita gravações repetidas e exige que prática e revisão tenham sido concluídas corretamente.
    if (!canComplete || pending.current || saved) return;
    if (!navigator.onLine) { setSaveError('Você está sem conexão. Reconecte-se e tente salvar novamente.'); return; }
    pending.current = true;
    setSaving(true);
    setSaveError('');
    try {
      const reference = doc(db, 'users', user.uid, 'lessonProgress', lessonId);
      // A transação mantém a data original se a lição já estiver concluída.
      await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(reference);
        if (existing.data()?.status === 'completed' && existing.data()?.completedAt instanceof Timestamp) return;
        transaction.set(reference, {
          status: 'completed', completedAt: serverTimestamp(),
          exerciseCount: content.exercises.length, reviewCorrect: true, contentVersion: 1,
        });
      });
      setSaved(true);
    } catch (error) {
      console.error('Falha ao salvar a conclusão no Firestore:', error);
      setSaveError(`${progressErrorMessage(error)} Seus exercícios continuam resolvidos nesta tela.`);
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return <main className="lesson-page">
      {/* Navegação de retorno e identificação do módulo atual. */}
      <DashboardHeader user={user} />
    <header className="lesson-header">
      <Link to="/inicio">← Voltar aos módulos</Link>
      <span>{module.title}</span>
    </header>
    {/* Apresentação textual da lição antes da prática. */}
    <section className="lesson-intro">
      <span className="lesson-eyebrow">Aprenda e pratique</span>
      <h1>{title}</h1>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    {/* Instruções e tabuleiro acompanham o exercício selecionado. */}
    <section className="lesson-practice" aria-labelledby="exercise-title">
      <div className="exercise-copy">
        <span className="lesson-eyebrow">Exercício {exerciseIndex + 1} de {content.exercises.length}</span>
        <h2 id="exercise-title" ref={heading} tabIndex={-1}>{content.exercises[exerciseIndex].title}</h2>
        <p>{content.exercises[exerciseIndex].instruction}</p>
        <progress value={exerciseIndex + (exerciseDone ? 1 : 0)} max={content.exercises.length} aria-label="Exercícios resolvidos nesta lição" />
        <p className="lesson-note">Os lances das pretas, quando indicados, são respostas guiadas. O tabuleiro aceita apenas a solução pedida para esta atividade.</p>
        {exerciseIndex < content.exercises.length - 1 && <button className="lesson-primary" type="button" disabled={!exerciseDone} onClick={() => {
          setExerciseIndex(exerciseIndex + 1); setExerciseDone(false); heading.current?.focus();
        }}>Próximo exercício →</button>}
      </div>
      <InteractiveBoard key={exerciseIndex} exercise={content.exercises[exerciseIndex]} disabled={saving || saved}
        onComplete={() => setExerciseDone(true)} onReset={() => { setExerciseDone(false); setAnswer(null); }} />
    </section>
      {/* A revisão só aparece depois de resolver o último exercício. */}
    {practiceComplete && <section className="lesson-review" aria-labelledby="review-title">
      <h2 id="review-title">Confira o que aprendeu</h2>
      <fieldset disabled={saving || saved}>
        <legend>{content.question}</legend>
        {content.answers.map((option, index) => <label key={option} className="review-option">
          <input type="radio" name="review" checked={answer === index} onChange={() => setAnswer(index)} />{option}
        </label>)}
      </fieldset>
      {answer !== null && <p role="status" className={canComplete ? 'review-correct' : 'review-incorrect'}>
        {canComplete ? content.answerExplanation : 'Ainda não. Releia a explicação e tente outra resposta.'}
      </p>}
      {!saved && <button className="lesson-primary" type="button" disabled={!canComplete || saving} onClick={() => void completeLesson()}>
        {saving ? 'Salvando conclusão…' : 'Concluir e salvar lição'}
      </button>}
      {saveError && <p className="review-incorrect" role="alert">{saveError}</p>}
      {/* Confirmação e próximos caminhos são apresentados após a gravação concluir. */}
      {saved && <div className="lesson-saved" role="status">
        <h3>Lição concluída e salva!</h3><p>Seu progresso já pode ser consultado no dashboard.</p>
        <div className="lesson-next-links"><Link to="/inicio">Ver meu progresso</Link>{nextLesson && <Link to={`/licoes/${nextLesson.id}`}>Próxima lição →</Link>}</div>
      </div>}
    </section>}
  </main>;
}
