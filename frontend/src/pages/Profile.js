import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProvider = currentUser.role === 'provider';
  
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
        id: currentUser.id || 1,
        name: currentUser.name || 'Usuário',
        email: currentUser.email || 'usuario@exemplo.com',
        role: currentUser.role || 'client',
        phone: '(11) 98765-4321',
        address: 'Rua Principal, 123 - Centro',
        bio: isProvider 
          ? 'Profissional com mais de 10 anos de experiência em serviços de manutenção residencial.'
          : 'Cliente da plataforma desde 2023.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        skills: isProvider ? ['Encanamento', 'Elétrica', 'Montagem de Móveis'] : [],
        rating: isProvider ? 4.8 : 0,
        completedJobs: isProvider ? 27 : 5,
        memberSince: '2023',
        reviews: isProvider ? [
          {
            id: 1,
            client: 'Maria Santos',
            rating: 5,
            comment: 'Excelente trabalho! Rápido e eficiente.',
            date: '15/06/2023'
          },
          {
            id: 2,
            client: 'Carlos Oliveira',
            rating: 4,
            comment: 'Bom serviço, apenas um pouco atrasado.',
            date: '10/06/2023'
          },
          {
            id: 3,
            client: 'Ana Pereira',
            rating: 5,
            comment: 'Muito profissional e atencioso. Recomendo!',
            date: '05/06/2023'
          }
        ] : []
      };
      
      setUserData(mockUserData);
      setLoading(false);
    }, 800);
  };
  
  if (loading || !userData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando seu perfil...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        {/* Coluna da esquerda - Informações do perfil */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <img 
                  src={userData.avatar} 
                  alt={userData.name} 
                  className="rounded-circle img-fluid" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #3498db' }}
                />
              </div>
              <h3 className="card-title mb-0">{userData.name}</h3>
              <p className="text-muted mb-1">{userData.email}</p>
              <p className="text-muted">{userData.phone}</p>
              
              {isProvider && (
                <div className="d-flex justify-content-center mb-3">
                  <div className="px-3">
                    <h5 className="mb-0">{userData.completedJobs}</h5>
                    <small className="text-muted">Serviços</small>
                  </div>
                  <div className="px-3 border-start">
                    <h5 className="mb-0">{userData.rating}</h5>
                    <small className="text-muted">
                      <i className="fas fa-star text-warning"></i> Avaliação
                    </small>
                  </div>
                </div>
              )}
              
              <Link to="/profile/edit" className="btn btn-primary w-100">
                <i className="fas fa-edit me-2"></i> Editar Perfil
              </Link>
            </div>
          </div>
          
          {isProvider && (
            <>
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Minhas Habilidades</h5>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {userData.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary p-2">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Disponibilidade</h5>
                  <div className="mt-3">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="availabilitySwitch" defaultChecked />
                      <label className="form-check-label" htmlFor="availabilitySwitch">
                        Disponível para novos serviços
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Informações Pessoais</h5>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-map-marker-alt me-2 text-primary"></i> Endereço</span>
                  <span className="text-muted">{userData.address}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-calendar me-2 text-primary"></i> Membro desde</span>
                  <span className="text-muted">{userData.memberSince}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-user me-2 text-primary"></i> Tipo de conta</span>
                  <span className="badge bg-info">
                    {userData.role === 'provider' ? 'Prestador' : 'Cliente'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Coluna da direita - Conteúdo principal */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title">Sobre Mim</h4>
              <p className="card-text">{userData.bio}</p>
            </div>
          </div>
          
          {isProvider && userData.reviews && userData.reviews.length > 0 && (
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">Avaliações de Clientes</h4>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <i className="fas fa-star text-warning"></i>
                      <span className="ms-1 fw-bold">{userData.rating}</span>
                    </div>
                    <span className="text-muted">({userData.reviews.length} avaliações)</span>
                  </div>
                </div>
                
                {userData.reviews.map(review => (
                  <div key={review.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <h5 className="mb-0">{review.client}</h5>
                      <small className="text-muted">{review.date}</small>
                    </div>
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                        ></i>
                      ))}
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isProvider && (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">Histórico de Solicitações</h4>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Prestador</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>15/06/2023</td>
                        <td>Consertar torneira</td>
                        <td>João Silva</td>
                        <td><span className="badge bg-success">Concluído</span></td>
                      </tr>
                      <tr>
                        <td>10/06/2023</td>
                        <td>Instalação elétrica</td>
                        <td>Ana Pereira</td>
                        <td><span className="badge bg-primary">Em andamento</span></td>
                      </tr>
                      <tr>
                        <td>05/06/2023</td>
                        <td>Montagem de móveis</td>
                        <td>Carlos Santos</td>
                        <td><span className="badge bg-success">Concluído</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-4">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/dashboard')}
            >
              <i className="fas fa-arrow-left me-2"></i> Voltar ao Painel
            </button>
            
            <Link to="/profile/edit" className="btn btn-primary">
              <i className="fas fa-edit me-2"></i> Editar Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;