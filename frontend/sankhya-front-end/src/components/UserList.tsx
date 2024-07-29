import React from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <ul className="list">
      {users.map((user) => (
        <li key={user.id}>
          {user.nome} - {user.email}
          <div>
            <button onClick={() => onEdit(user.id)}>Editar</button>
            <button onClick={() => onDelete(user.id)}>Deletar</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
