import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');
    
    // Verificar se é uma rota administrativa
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (!token && !adminToken) {
      // Redirecionar para a página de login se não estiver autenticado
      navigate('/login');
      return;
    }
    
    // Verificar permissões para rotas administrativas
    if (isAdminRoute && userRole !== 'admin') {
      console.log('Acesso não autorizado ao painel administrativo');
      navigate('/'); // Redirecionar para a página inicial
      return;
    }
  }, [navigate, location]);
  
  // Verificar se o token existe antes de renderizar os filhos
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const userRole = localStorage.getItem('userRole');
  
  // Verificar se é uma rota administrativa
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (!token && !adminToken) {
    // Não renderizar nada enquanto redireciona
    return null;
  }
  
  // Verificar permissões para rotas administrativas
  if (isAdminRoute && userRole !== 'admin') {
    return null; // Não renderizar nada enquanto redireciona
  }
  
  // Renderizar os filhos se o usuário estiver autenticado e tiver permissão
  return <>{children}</>;
};

export default AuthGuard;