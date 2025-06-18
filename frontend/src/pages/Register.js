import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    
    // Em um aplicativo real, você registraria com o backend
    console.log('Registro:', { name, email, password, role });
    
    // Simular registro bem-sucedido
    setTimeout(() => {
      setLoading(false);
      alert('Registro realizado com sucesso!');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Criar uma Conta</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nome Completo</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name"
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>
                
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
                      placeholder="Crie uma senha forte"
                    />
                  </div>
                  <small className="form-text text-muted">
                    A senha deve ter pelo menos 8 caracteres, incluindo letras e números.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role" className="form-label">Eu sou um:</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleClient" 
                        value="client"
                        checked={role === 'client'}
                        onChange={() => setRole('client')}
                      />
                      <label className="form-check-label" htmlFor="roleClient">
                        Cliente
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleProvider" 
                        value="provider"
                        checked={role === 'provider'}
                        onChange={() => setRole('provider')}
                      />
                      <label className="form-check-label" htmlFor="roleProvider">
                        Prestador de Serviços
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="terms" required />
                  <label className="form-check-label" htmlFor="terms">
                    Eu concordo com os <Link to="/terms" className="text-decoration-none">Termos de Serviço</Link> e <Link to="/privacy" className="text-decoration-none">Política de Privacidade</Link>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cadastrando...
                    </>
                  ) : 'Cadastrar'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Já tem uma conta? <Link to="/login" className="text-decoration-none">Entrar</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;