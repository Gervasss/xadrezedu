import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { learningModules } from '../../data/curriculum';
import { summarizeProgress } from '../../data/lessonProgress';
import { useLessonProgress } from '../../components/hooks/useLessonProgress';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import './HomePage.css';

// Apresenta os módulos e o progresso confirmado do aluno autenticado.
export default function HomePage({ user }: { user: User }) {
  const progress = useLessonProgress(user.uid);
  const summary = summarizeProgress(learningModules.flatMap((module) => module.lessons.map((lesson) => lesson.id)), progress.completed);
  const ready = progress.status === 'ready';
  const displayName = user.displayName?.trim() || user.email?.split('@')[0] || 'Enxadrista';
  const firstName = displayName.split(/\s+/)[0];

  return (
    <div className="home-page">
      <DashboardHeader user={user} />

      <main className="main-wrapper">
        <div className="content-container">
          {/* Saudação e resumo geral variam conforme o estado do progresso carregado. */}
          <section className="hero-banner" aria-labelledby="welcome-title">
            <div className="hero-content">
            <div className="hero-text-area">
              <p className="hero-subtitle"><span className="material-symbols-outlined" aria-hidden="true">school</span> Jornada do Iniciante</p>
              <h1 id="welcome-title" className="hero-title">Olá, {firstName}! Pronto para o próximo lance?</h1>
              <p className="hero-desc" aria-live="polite">
                {progress.status === 'loading' && 'Buscando seu progresso. Se estiver sem conexão, aguarde a reconexão.'}
                {progress.status === 'error' && 'Seu progresso está indisponível no momento.'}
                {ready && (summary.completed === 0
                  ? 'Você ainda não concluiu nenhuma lição. Conheça os módulos da sua jornada abaixo.'
                  : summary.completed === summary.total
                    ? 'Você concluiu todas as lições desta trilha. Parabéns pelo aprendizado!'
                    : `Você concluiu ${summary.completed} de ${summary.total} lições da sua jornada.`)}
              </p>
              <div className="hero-actions">
                <a href="#modulos" className="btn-continue"><span className="material-symbols-outlined" aria-hidden="true">menu_book</span>Ver módulos de aprendizado</a>
              
              </div>
            </div>
            {ready && <div className="hero-stats-grid">
              <div className="stat-box"><span className="stat-val highlight">{summary.percent}%</span><span className="stat-lbl">Progresso da trilha</span></div>
              <div className="stat-box"><span className="stat-val">{summary.completed}/{summary.total}</span><span className="stat-lbl">Lições concluídas</span></div>
            </div>}
            </div>
            <svg className="hero-bg-svg" aria-hidden="true" fill="currentColor" viewBox="0 0 200 200">
          {/* Permite tentar novamente quando a consulta do progresso falha. */}
              <path d="M45,180 L155,180 L145,160 L55,160 Z M65,150 L135,150 L125,100 C125,80 140,75 140,55 C140,40 125,30 100,30 C75,30 60,40 60,55 C60,75 75,80 75,100 Z" />
            </svg>
          </section>

          {progress.status === 'error' && <div className="session-error" role="alert">
            <p>Não foi possível consultar suas conclusões. Tente novamente para atualizar os indicadores.</p>
            <button type="button" className="btn-retry" onClick={progress.retry}>Tentar novamente</button>
          </div>}

          {/* Lista os módulos com progresso próprio e links para estudar ou revisar cada lição. */}
          <section id="modulos" className="modules-col" aria-labelledby="modules-title">
            <div className="section-header">
              <div>
              <h2 id="modules-title" className="section-title">Seus Módulos de Aprendizado</h2>
              <p className="section-desc">Aprenda com exemplos no tabuleiro e resolva os exercícios para concluir cada lição.</p>
              </div>
              <span className="section-badge">{learningModules.length} Módulos</span>
            </div>
            {learningModules.map((module, index) => {
              const moduleProgress = summarizeProgress(module.lessons.map((lesson) => lesson.id), progress.completed);
              return <article className="module-card" key={module.id}>
                <div className="mod-head">
                <div>
                    <div className="mod-tags">
                      <span className={moduleProgress.completed > 0 && ready ? 'tag-active' : 'tag-next'}>
                        {ready && moduleProgress.percent === 100 ? 'Concluído' : ready && moduleProgress.completed > 0 ? 'Em Progresso' : 'Disponível'}
                      </span>
                      <p className="mod-subtitle">Módulo {String(index + 1).padStart(2, '0')} • {index === 0 ? 'Nível Fundacional' : 'Táticas & Conclusão'}</p>
                    </div>
                    <h3 className="mod-title">{module.title}</h3>
                  </div>
                  <span className="mod-progress-text">{ready ? `${moduleProgress.percent}% concluído` : '—'}</span>
                </div>
                {ready && <progress className="module-progress" value={moduleProgress.completed} max={moduleProgress.total}
                  aria-label={`Progresso em ${module.title}`} />}
                <p className="mod-desc">{module.description}</p>
                <ol className="lesson-list">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const completed = ready && progress.completed.has(lesson.id);
                    return <li className="lesson-item" key={lesson.id}>
                      <div className="lesson-info">
                        <span className={`lesson-icon ${completed ? 'done' : ''}`} aria-hidden="true">{completed ? '✓' : lessonIndex + 1}</span>
                        <Link className="lesson-title" to={`/licoes/${lesson.id}`}>{lesson.title}</Link>
                      </div>
                      <span className={`lesson-status ${completed ? 'done' : ''}`}>
                        {completed ? 'Concluída' : ready ? 'Não concluída' : 'Conclusão não verificada'}
                      </span>
                      <Link className="btn-practice" to={`/licoes/${lesson.id}`}>{completed ? 'Revisar' : 'Estudar'}</Link>
                    </li>;
                  })}
                </ol>
                <p className="mod-footer">{ready
                  ? `${moduleProgress.completed} de ${moduleProgress.total} lições concluídas`
                  : progress.status === 'loading' ? 'Consultando progresso…' : 'Progresso indisponível'}</p>
              </article>;
            })}
          </section>
        </div>
      </main>
      {/* Informações institucionais e links auxiliares da aplicação. */}
      <footer className="footer-area">
        <div className="footer-content">
          <div className="footer-left">
            <strong>xadrezEdu</strong>
            <span>© {new Date().getFullYear()}. Aprenda xadrez de forma descomplicada.</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
