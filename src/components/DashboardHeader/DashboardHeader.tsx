import { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { authErrorMessage } from '../../firebase/authErrors';
import logo from '../../assets/logo_xadrezedu1.png';
import './DashboardHeader.css';

// Exibe a navegação autenticada e as ações da conta do usuário.
export default function DashboardHeader({ user }: { user: User }) {
  const location = useLocation();
  const isHome = location.pathname === '/inicio';
  useEffect(() => {
    if (location.pathname === '/inicio' && location.hash === '#modulos') {
      document.getElementById('modulos')?.scrollIntoView();
      
    }
  }, [location.pathname, location.hash]);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const signOutPending = useRef(false);
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const accountToggle = useRef<HTMLElement>(null);
  const displayName = user.displayName?.trim() || user.email?.split('@')[0] || 'Enxadrista';
  const firstName = displayName.split(/\s+/)[0];

  useEffect(() => {
    // Fecha o menu ao clicar fora dele e remove o listener ao desmontar o cabeçalho.
    function closeAccountMenu(event: PointerEvent) {
      if (event.target instanceof Node && accountMenu.current && !accountMenu.current.contains(event.target)) {
        accountMenu.current.open = false;
      }
    }
    document.addEventListener('pointerdown', closeAccountMenu);
    return () => document.removeEventListener('pointerdown', closeAccountMenu);
  }, []);

  // Encerra a sessão uma vez por vez e mantém o erro visível caso o Firebase falhe.
  async function handleSignOut() {
    if (signOutPending.current) return;
    signOutPending.current = true;
    setSigningOut(true);
    setSignOutError('');
    try {
      await signOut(auth);
    } catch (error) {
      setSignOutError(authErrorMessage(error));
      signOutPending.current = false;
      setSigningOut(false);
    }
  }

    return (
      <header className="dashboard-header">
        <div className="dash-header-content">
          <div className="header-left">
            <Link className="logo-link" to="/inicio">
              <img alt="XadrezEdu" src={logo} />
              <span className="logo-text">xadrez<span>Edu</span></span>
            </Link>
            <nav className="nav-menu" aria-label="Navegação principal">
              <Link to="/inicio" className={`nav-link ${isHome ? 'active' : ''}`} aria-current={isHome ? 'page' : undefined}>Início</Link>
              <Link to="/inicio#modulos" className="nav-link">Módulos</Link>
            </nav>
          </div>
          <details className="account-menu" ref={accountMenu} onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.currentTarget.open = false;
              accountToggle.current?.focus();
            }
          }}>
            <summary className="user-profile" ref={accountToggle} aria-label={`Conta de ${displayName}`}>
              <span className="avatar" aria-hidden="true">{firstName.charAt(0).toLocaleUpperCase('pt-BR')}</span>
              <span className="user-name">{displayName}</span>
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="account-panel" aria-busy={signingOut}>
              <strong>{displayName}</strong>
              {signOutError && <p className="header-error" role="alert">{signOutError}</p>}
              {signingOut && <p role="status">Encerrando sua sessão…</p>}
              {user.email && <p className="account-email">{user.email}</p>}
              <button type="button" className="btn-signout" disabled={signingOut} onClick={() => void handleSignOut()}>
                {signingOut ? 'Saindo…' : 'Sair da conta'}
              </button>
            </div>
          </details>
        </div>
      </header>
  );
}
