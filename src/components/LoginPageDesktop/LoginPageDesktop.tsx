import { Navigate } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import logo from '../../assets/logo_xadrezedu1.png';
import './LoginPageDeesktop.css';

// Renderiza o formulário de autenticação otimizado para telas desktop.
export default function LoginPageDesktop({ authenticated = false }: { authenticated?: boolean }) {
    const { isLogin, showPassword, setShowPassword, name, setName, email, setEmail, password, setPassword, remember, setRemember, busy, error, message, emailInput, switchMode, handleSubmit, handleGoogle, handleResetPassword } = useLoginForm();

    if (authenticated && !busy && !message) return <Navigate to="/inicio" replace />;

    return (
        <div className="login-desktop">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="header-logo">
                        <img
                            alt="xadrezEdu Logo"
                            src={logo}
                        />
                        <span>xadrezEdu</span>
                    </div>
                    <div className="header-actions">
                        <div className="header-btn">
                            <span className="material-symbols-outlined text-[20px]">language</span>
                            <span>PT-BR</span>
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </div>

                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="main-wrapper">
                <div className="content-container">
                    <div className="grid-layout">

                        {/* Hero Section (Left) */}
                        <div className="hero-section">
                            <div className="hero-badge">
                                <span className="pulse-dot"></span>
                                <span>Plataforma Educativa de Xadrez</span>
                            </div>
                            <div>
                                <h1 className="hero-title">
                                    Domine o tabuleiro do <span className="highlight">zero ao mestre</span>
                                </h1>
                                <br></br>
                                <p className="hero-desc">
                                    Aprenda táticas, aberturas e finais com metodologia interativa e desafios adaptados ao seu ritmo.
                                </p>
                            </div>
                           
                        </div>

                        {/* Auth Card Section (Right) */}
                        <div className="auth-section">
                            <div className="auth-card">

                                {/* Auth Header */}
                                <div className="auth-card-header">
                                    <div className="header-logo">
                                        <img
                                            alt="xadrezEdu Logo"
                                            src={logo}
                                        />
                                        <span>xadrezEdu</span>
                                    </div>
                                    <span className="secure-badge">Acesso Seguro</span>
                                </div>

                                {/* Tabs Switcher */}
                                <div className="tabs-container">
                                    <button
                                        type="button"
                                        onClick={() => switchMode(true)}
                                        disabled={busy}
                                        aria-pressed={isLogin}
                                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                                    >
                                        Entrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => switchMode(false)}
                                        disabled={busy}
                                        aria-pressed={!isLogin}
                                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                                    >
                                        Criar Conta
                                    </button>
                                </div>

                                {/* Social Login Button */}
                                <button type="button" className="social-btn" onClick={handleGoogle} disabled={busy}>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                                    </svg>
                                    <span>Continuar com o Google</span>
                                </button>

                                {/* Divider */}
                                <div className="divider">
                                    <div className="divider-line"></div>
                                    <span className="divider-text">ou continue com e-mail</span>
                                </div>

                                {/* Main Form */}
                                {error && <p className="auth-error" role="alert">{error}</p>}
                                {message && <p className="auth-message" role="status">{message}</p>}
                                <form className="auth-form" onSubmit={handleSubmit} aria-busy={busy}>

                                    {/* Name Field (Register only) */}
                                    {!isLogin && (
                                        <div className="form-group">
                                            <label htmlFor="input-name" className="input-label">Nome completo</label>
                                            <div className="input-wrapper">
                                                <span className="material-symbols-outlined input-icon">person</span>
                                                <input
                                                    type="text"
                                                    id="input-name"
                                                    name="name"
                                                    autoComplete="name"
                                                    value={name}
                                                    onChange={(event) => setName(event.target.value)}
                                                    required
                                                    disabled={busy}
                                                    placeholder="Como quer ser chamado?"
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    <div className="form-group">
                                        <label htmlFor="input-email" className="input-label">E-mail</label>
                                        <div className="input-wrapper">
                                            <span className="material-symbols-outlined input-icon">mail</span>
                                            <input
                                                type="email"
                                                id="input-email"
                                                ref={emailInput}
                                                name="email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                required
                                                disabled={busy}
                                                placeholder="seu.email@exemplo.com"
                                                className="input-field"
                                            />
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
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="input-password"
                                                name="password"
                                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                minLength={isLogin ? undefined : 6}
                                                required
                                                disabled={busy}
                                                placeholder="••••••••"
                                                className="input-field"
                                                style={{ paddingRight: '2.5rem' }} // Space for the eye icon
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                                aria-label="Alternar visibilidade da senha"
                                                aria-pressed={showPassword}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? "visibility_off" : "visibility"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form Options (Remember Me / SSL) */}
                                    <div className="form-options">
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} disabled={busy} className="checkbox-input" />
                                            <span>Lembrar de mim</span>
                                        </label>
                                        <span className="ssl-badge">
                                            <span className="material-symbols-outlined">shield</span>
                                            SSL 256-bit
                                        </span>
                                    </div>

                                    {/* Submit Button */}
                                    <button type="submit" className="submit-btn" disabled={busy}>
                                        <span>{busy ? 'Aguarde…' : isLogin ? "Entrar na Minha Conta" : "Criar Minha Conta Grátis"}</span>
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </button>
                                </form>

                              

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
