import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/LoginPage.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login]);

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
