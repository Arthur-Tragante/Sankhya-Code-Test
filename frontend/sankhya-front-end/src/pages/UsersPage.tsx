import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/UsersPage.scss';
import UserList from '../components/UserList';

interface User {
  id: number;
  nome: string;
  email: string;
}

const UsersPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (page: number, search: string) => {
    const params = new URLSearchParams({
      skip: (page * 5).toString(),
      limit: '5',
      search,
    });

    const response = await fetch(`http://127.0.0.1:8000/usuarios/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      alert('Erro ao buscar usuários');
    }
  }, [token]);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  const handleEdit = useCallback((userId: number) => {
    navigate(`/users/edit/${userId}`);
  }, [navigate]);

  const handleDelete = useCallback(async (userId: number) => {
    const response = await fetch(`http://127.0.0.1:8000/usuarios/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    } else {
      alert('Erro ao excluir usuário');
    }
  }, [token]);

  const handleAddUser = useCallback(() => {
    navigate('/users/add');
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="users-container">
      <h1>Usuários</h1>
      <button onClick={handleAddUser}>Adicionar Usuário</button>
      <input
        type="text"
        placeholder="Buscar por nome ou email"
        value={search}
        onChange={handleSearchChange}
      />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          Anterior
        </button>
        <span>Página {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>
          Próxima
        </button>
      </div>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default UsersPage;
