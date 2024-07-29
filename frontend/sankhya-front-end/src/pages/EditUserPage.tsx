import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/EditUserPage.scss';

interface User {
  id: number;
  nome: string;
  email: string;
}

const EditUserPage: React.FC = () => {
  const { token } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
        setNome(data.nome);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Erro ao buscar usuário');
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        navigate('/users');
      } else {
        alert('Erro ao atualizar usuário');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erro ao atualizar usuário');
    } finally {
      setIsLoading(false);
    }
  }, [userId, nome, email, senha, token, navigate]);

  const handleBack = () => {
    navigate('/users');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-user-container">
      <h1>Editar Usuário</h1>
      <form onSubmit={handleUpdate}>
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
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
