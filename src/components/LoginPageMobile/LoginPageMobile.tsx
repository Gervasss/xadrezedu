import { Navigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import logo from '../../assets/logo_xadrezedu1.png';
import './LoginPageMobile.css';

// Renderiza o formulário de autenticação otimizado para telas móveis.
export default function LoginPageMobile({ authenticated = false }: { authenticated?: boolean }) {
    const { isLogin, showPassword, setShowPassword, name, setName, email, setEmail, password, setPassword, remember, setRemember, busy, error, message, emailInput, switchMode, handleSubmit, handleGoogle, handleResetPassword } = useLoginForm();

    if (authenticated && !busy && !message) return <Navigate to="/inicio" replace />;

    return (
        <div className="login-mobile app-wrapper">
            <main className="main-content">
                {/* Header & Brand Showcase */}
                <section className="header-section">
                    <div className="logo-container">
                        <img alt="xadrezEdu Logo" className="logo-img" src={logo} />
                    </div>
                    <div className="brand-text">
                        <h1 className="brand-title">Domine o tabuleiro!</h1>
                        <p className="brand-subtitle">
                            Aprenda xadrez do zero, passo a passo e de forma divertida.
                        </p>
                    </div>
         
                </section>

                {/* Interactive Auth Card Container */}
                <section className="auth-card">
                    {/* Tab Pill Switcher */}
                    <div className="tab-container">
                        <button type="button" onClick={() => switchMode(true)} disabled={busy}
                            aria-pressed={isLogin} className={`tab-btn ${isLogin ? 'active' : ''}`}>
                            Entrar
                        </button>
                        <button type="button" onClick={() => switchMode(false)} disabled={busy}
                            aria-pressed={!isLogin} className={`tab-btn ${!isLogin ? 'active' : ''}`}>
                            Criar Conta
                        </button>
                    </div>

                    {/* Social Auth CTA */}
                    <button type="button" className="social-btn" onClick={handleGoogle} disabled={busy}>
                        <svg className="social-icon" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                        </svg>
                        <span>Continuar com o Google</span>
                    </button>

                    {/* Visual Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">ou continue com e-mail</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Interactive Form */}
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    {message && <p className="auth-message" role="status">{message}</p>}
                    <form className="form" onSubmit={handleSubmit} aria-busy={busy}>
                        {/* Full Name */}
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="input-name" className="input-label">Nome Completo</label>
                                <div className="input-wrapper">
                                    <span className="material-symbols-outlined input-icon">person</span>
                                    <input type="text" id="input-name" name="name" autoComplete="name"
                                        value={name} onChange={(event) => setName(event.target.value)}
                                        required disabled={busy} placeholder="Como podemos te chamar?" className="input-field" />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="input-email" className="input-label">E-mail</label>
                            <div className="input-wrapper">
                                <span className="material-symbols-outlined input-icon">mail</span>
                                <input type="email" id="input-email" ref={emailInput} name="email" autoComplete="email"
                                    value={email} onChange={(event) => setEmail(event.target.value)}
                                    required disabled={busy} placeholder="seu.email@exemplo.com" className="input-field" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <div className="form-header">
                                <label htmlFor="input-password" className="input-label">Senha</label>
                                {isLogin && (
                                    <button type="button" className="forgot-link" onClick={handleResetPassword} disabled={busy}>Esqueceu a senha?</button>
                                )}
                            </div>
                            <div className="input-wrapper">
                                <span className="material-symbols-outlined input-icon">lock</span>
                                <input type={showPassword ? "text" : "password"} id="input-password" name="password"
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    value={password} onChange={(event) => setPassword(event.target.value)}
                                    minLength={isLogin ? undefined : 6} required disabled={busy}
                                    placeholder="Sua senha secreta" className="input-field" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="input-action" aria-label="Alternar visibilidade de senha" aria-pressed={showPassword}>
                                    <span className="material-symbols-outlined">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} disabled={busy} className="checkbox-input" />
                                <span>Lembrar de mim</span>
                            </label>
                        </div>

                        {/* Primary CTA */}
                        <button type="submit" className="btn-primary" disabled={busy}>
                            <span>{busy ? 'Aguarde…' : isLogin ? "Entrar na Minha Conta" : "Começar Jornada no Xadrez"}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>
                </section>

            </main>
        </div>
    );
}
