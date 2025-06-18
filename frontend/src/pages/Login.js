import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Em um aplicativo real, você autenticaria com o backend
      console.log('Tentativa de login:', { email, password });
      
      // Simular login bem-sucedido
      // Simular verificação de credenciais
      if (email === 'teste@exemplo.com' && password === 'senha123') {
        // Armazenar dados do usuário
        const userData = {
          id: 1,
          name: 'Usuário Teste',
          email: email,
          role: 'client'
        };
        
        localStorage.setItem('token', 'exemplo-token-jwt');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirecionar para o dashboard
        navigate('/dashboard');
      } else if (email === 'provider@exemplo.com' && password === 'senha123') {
        // Usuário prestador de serviço
        const userData = {
          id: 2,
          name: 'Prestador Teste',
          email: email,
          role: 'provider'
        };
        
        localStorage.setItem('token', 'exemplo-token-jwt-provider');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirecionar para o dashboard
        navigate('/dashboard');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Entrar</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Senha</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      placeholder="Sua senha"
                    />
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label" htmlFor="remember">Lembrar de mim</label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Entrando...
                    </>
                  ) : 'Entrar'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <p>
                  <Link to="/forgot-password" className="text-decoration-none">
                    Esqueceu sua senha?
                  </Link>
                </p>
                <p className="mb-0">
                  Não tem uma conta? <Link to="/register" className="text-decoration-none">Cadastre-se</Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-muted">
              <small>Para fins de teste, use:</small><br/>
              <small>Cliente: teste@exemplo.com / senha123</small><br/>
              <small>Prestador: provider@exemplo.com / senha123</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;