import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://127.0.0.1:8000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
      navigate('/users');
    } else {
      alert('Invalid email or password');
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};
