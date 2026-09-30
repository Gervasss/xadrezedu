import { useEffect, useState } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { learningModules } from '../../data/curriculum';
import { completedLessonIds } from '../../data/lessonProgress';
import { progressErrorMessage } from '../../firebase/progressErrors';

const knownIds = learningModules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
type ProgressState = {
  uid: string;
  status: 'loading' | 'ready' | 'error';
  completed: Set<string>;
  error?: string;
};

// Assina o progresso confirmado do usuário e expõe estados de carregamento, erro e repetição.
export function useLessonProgress(uid: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ProgressState>({ uid, status: 'loading', completed: new Set() });

  useEffect(() => onSnapshot(collection(db, 'users', uid, 'lessonProgress'),
    { includeMetadataChanges: true },
    (snapshot) => {
      // Não apresente cache vazio ou escritas pendentes como progresso confirmado.
      if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      const records = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          lessonId: document.id,
          status: data.status,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toMillis() : null,
        };
      });
      setState({ uid, status: 'ready', completed: completedLessonIds(records, knownIds) });
    },
    (error) => {
      console.error('Falha ao consultar o progresso no Firestore:', error);
      setState({ uid, status: 'error', completed: new Set(), error: progressErrorMessage(error) });
    },
  ), [uid, attempt]);

  // Reinicia o estado e recria a assinatura para consultar o progresso novamente.
  function retry() {
    setState({ uid, status: 'loading', completed: new Set() });
    setAttempt((value) => value + 1);
  }

  return { ...(state.uid === uid ? state : { uid, status: 'loading' as const, completed: new Set<string>() }), retry };
}
