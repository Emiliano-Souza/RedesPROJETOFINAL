import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Verificar o estado de login ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  
  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ZAP Serv
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Início</Link>
          </li>
          <li className="nav-item">
            <Link to="/requests" className="nav-link">Serviços</Link>
          </li>
          {isLoggedIn && user ? (
            <>
              {user.role === 'client' && (
                <li className="nav-item">
                  <Link to="/create-request" className="nav-link">Solicitar Serviço</Link>
                </li>
              )}
              {user.role === 'provider' && (
                <li className="nav-item">
                  <Link to="/requests" className="nav-link">Buscar Serviços</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Painel</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.name}
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/dashboard">Meu Painel</Link></li>
                  {user.role === 'provider' && (
                    <li><Link className="dropdown-item" to="/provider-profile">Meu Perfil</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item">Sair</button></li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Entrar</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-register">Cadastrar</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;