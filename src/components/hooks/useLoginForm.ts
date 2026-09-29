import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { authErrorMessage } from '../../firebase/authErrors';

// Centraliza estado, validação e ações de autenticação compartilhados pelos formulários.
export function useLoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Alterna entre entrar e criar conta, limpando dados e mensagens do modo anterior.
  function switchMode(login: boolean) {
    setIsLogin(login);
    setError('');
    setMessage('');
    setPassword('');
    setShowPassword(false);
  }

  // Serializa ações de autenticação e converte falhas Firebase em mensagens da interface.
  async function runAction(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  // Escolhe entre persistência local e de sessão conforme a opção do usuário.
  function persistSession() {
    return setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  }

  // Valida os campos e processa login ou cadastro por e-mail e senha.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLogin && !name.trim()) {
      setError('Informe seu nome para criar a conta.');
      return;
    }
    void runAction(async () => {
      await persistSession();
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try {
          await updateProfile(credential.user, { displayName: name.trim() });
        } catch {
          setIsLogin(true);
          setMessage('Conta criada, mas não foi possível salvar seu nome. Você já pode entrar com seu e-mail e senha.');
          return;
        }
      }
      navigate('/inicio', { replace: true });
    });
  }

  // Autentica com Google usando a persistência escolhida.
  function handleGoogle() {
    void runAction(async () => {
      await persistSession();
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/inicio', { replace: true });
    });
  }

  // Solicita redefinição de senha após validar o endereço de e-mail informado.
  function handleResetPassword() {
    if (!emailInput.current?.reportValidity()) return;
    void runAction(async () => {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Se houver uma conta com esse e-mail, você receberá as instruções para redefinir sua senha. Confira também o spam.');
    });
  }

  return { isLogin, showPassword, setShowPassword, name, setName, email, setEmail, password, setPassword, remember, setRemember, busy, error, message, emailInput, switchMode, handleSubmit, handleGoogle, handleResetPassword };
}
