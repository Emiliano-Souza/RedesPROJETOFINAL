import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Autenticação simples de administrador
    if (username === 'admin' && password === 'admin') {
      // Simular atraso de chamada de API
      setTimeout(() => {
        // Em um aplicativo real, você armazenaria o token no localStorage ou context
        localStorage.setItem('adminToken', 'admin-token-example');
        localStorage.setItem('userRole', 'admin');
        setLoading(false);
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      setLoading(false);
      setError('Nome de usuário ou senha inválidos');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <i className="fas fa-shield-alt"></i>
          <h2>Painel Administrativo</h2>
          <p>Digite suas credenciais para acessar o painel administrativo</p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-admin-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Entrando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Entrar
              </>
            )}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>Esqueceu sua senha? Entre em contato com o administrador do sistema.</p>
          <p className="back-to-site">
            <a href="/">
              <i className="fas fa-arrow-left"></i> Voltar ao site principal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;