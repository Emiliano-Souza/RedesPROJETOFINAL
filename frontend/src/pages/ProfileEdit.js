import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: []
  });
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProvider = currentUser.role === 'provider';
  
  // Lista de habilidades disponíveis para prestadores
  const availableSkills = [
    'Encanamento', 'Elétrica', 'Montagem de Móveis', 'Pintura',
    'Jardinagem', 'Limpeza', 'Carpintaria', 'Alvenaria',
    'Instalação de Ar Condicionado', 'Conserto de Eletrodomésticos'
  ];
  
  useEffect(() => {
    // Carregar dados do usuário
    loadUserData();
  }, []);
  
  const loadUserData = () => {
    setLoading(true);
    
    // Simular chamada de API para carregar dados do usuário
    setTimeout(() => {
      // Dados de exemplo
      const mockUserData = {
        name: currentUser.name || 'Usuário',
        email: currentUser.email || 'usuario@exemplo.com',
        phone: '(11) 98765-4321',
        address: 'Rua Principal, 123 - Centro',
        bio: isProvider 
          ? 'Profissional com mais de 10 anos de experiência em serviços de manutenção residencial.'
          : 'Cliente da plataforma desde 2023.',
        skills: isProvider ? ['Encanamento', 'Elétrica', 'Montagem de Móveis'] : []
      };
      
      setUserData(mockUserData);
      setLoading(false);
    }, 800);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillChange = (skill) => {
    if (!isProvider) return;
    
    setUserData(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular chamada de API para atualizar perfil
    setTimeout(() => {
      // Atualizar dados do usuário no localStorage
      const updatedUser = {
        ...currentUser,
        name: userData.name,
        email: userData.email
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
      
      setLoading(false);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1000);
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {notification && (
            <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
              {notification.message}
              <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
            </div>
          )}
          
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Editar Perfil</h2>
            </div>
            
            <div className="card-body">
              {loading && !userData.name ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3">Carregando seus dados...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Endereço</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Sobre Mim</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="3"
                      value={userData.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  {isProvider && (
                    <div className="mb-4">
                      <label className="form-label">Habilidades</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {userData.skills.map((skill, index) => (
                          <span key={index} className="badge bg-primary p-2">
                            {skill}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              style={{ fontSize: '0.5rem' }}
                              onClick={() => handleSkillChange(skill)}
                            ></button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex flex-wrap gap-2">
                            {availableSkills
                              .filter(skill => !userData.skills.includes(skill))
                              .map((skill, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className="badge bg-light text-dark border-0"
                                  onClick={() => handleSkillChange(skill)}
                                >
                                  <i className="fas fa-plus me-1"></i> {skill}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/dashboard')}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Salvando...
                        </>
                      ) : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;