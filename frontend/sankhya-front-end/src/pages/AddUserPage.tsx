import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/AddUserPage.scss';

const AddUserPage: React.FC = () => {
  const { token } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        navigate('/users');
      } else {
        alert('Erro ao adicionar usuário');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Erro ao adicionar usuário');
    } finally {
      setIsLoading(false);
    }
  }, [token, nome, email, senha, navigate]);

  const handleBack = () => {
    navigate('/users');
  };

  return (
    <div className="add-user-container">
      <h1>Adicionar Usuário</h1>
      <form onSubmit={handleAddUser}>
        <div className="form-group">
          <label>Nome</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            disabled={isLoading}
          />
        </div>
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
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            disabled={isLoading}
          />
        </div>
        <div className="buttons">
          <button type="button" className="back-button" onClick={handleBack}>
            Voltar
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;
