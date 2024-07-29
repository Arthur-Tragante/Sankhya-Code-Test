import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  nome: string;
  email: string;
}

const useUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (page: number, search: string) => {
    const params = new URLSearchParams({
      skip: (page * 5).toString(),
      limit: '5',
      search,  // Usar 'search' como nome do parâmetro
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

  return {
    users,
    page,
    search,
    setPage,
    setSearch,
    fetchUsers,
    setUsers,
  };
};

export default useUsers;
