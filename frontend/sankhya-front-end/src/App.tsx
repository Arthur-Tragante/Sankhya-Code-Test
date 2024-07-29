import React from 'react';
import './assets/styles/main.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import EditUserPage from './pages/EditUserPage';
import AddUserPage from './pages/AddUserPage';

const PrivateRoute: React.FC<{ element: React.FC }> = ({ element: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
          <Route path="/users/edit/:userId" element={<PrivateRoute element={EditUserPage} />} />
          <Route path="/users/add" element={<PrivateRoute element={AddUserPage} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
