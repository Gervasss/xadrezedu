import { useSyncExternalStore } from 'react';
import LoginPageMobile from '../../components/LoginPageMobile/LoginPageMobile';
import LoginPageDesktop from '../../components/LoginPageDesktop/LoginPageDesktop';

const mobileQuery = '(max-width: 767px)';

// Mantém a assinatura da consulta de viewport sincronizada com o React.
function subscribeToViewport(onChange: () => void) {
  const mediaQuery = window.matchMedia(mobileQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

// Retorna se a viewport atual deve usar a experiência móvel de login.
function isMobileViewport() {
  return window.matchMedia(mobileQuery).matches;
}

// Seleciona o formulário de login adequado ao tamanho da tela.
export default function LoginPage({ authenticated = false }: { authenticated?: boolean }) {
  const isMobile = useSyncExternalStore(subscribeToViewport, isMobileViewport, () => true);

  if (isMobile) {
    return <LoginPageMobile authenticated={authenticated} />;
  }
  return <LoginPageDesktop authenticated={authenticated} />;
}
