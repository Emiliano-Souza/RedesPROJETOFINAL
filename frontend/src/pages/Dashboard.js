import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('client'); // ou 'provider', 'admin'
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    completedRequests: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [notification, setNotification] = useState(null);

  // Obter dados do usuário do localStorage
  const [user, setUser] = useState({
    id: 1,
    name: 'Usuário',
    email: 'usuario@exemplo.com',
    role: userType,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['Encanamento', 'Elétrica', 'Montagem de Móveis'],
    rating: 4.8,
    completedJobs: 27
  });
  
  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(prevUser => ({
        ...prevUser,
        id: userData.id || prevUser.id,
        name: userData.name || prevUser.name,
        email: userData.email || prevUser.email,
        role: userData.role || prevUser.role
      }));
      
      // Definir o tipo de usuário com base no papel
      let initialUserType = userData.role || 'client';
      
      // Se o usuário tentar acessar o painel de administrador sem ser admin, redirecionar para o painel de cliente
      if (initialUserType === 'admin' && userRole !== 'admin') {
        initialUserType = 'client';
      }
      
      setUserType(initialUserType);
    }
  }, []);

  useEffect(() => {
    // Simular chamada de API para buscar dados
    setLoading(true);
    setTimeout(() => {
      // Dados de exemplo
      if (userType === 'client') {
        setRequests([
          {
            id: 1,
            title: 'Consertar torneira com vazamento',
            description: 'Torneira da cozinha está vazando e precisa de reparo',
            status: 'pending',
            created_at: '10/06/2023',
            location: 'Rua Principal, 123'
          },
          {
            id: 2,
            title: 'Pintar sala de estar',
            description: 'Preciso pintar as paredes, teto e rodapés da sala',
            status: 'accepted',
            created_at: '08/06/2023',
            location: 'Rua Principal, 123',
            provider: {
              id: 3,
              name: 'Miguel Wilson',
              rating: 4.8
            }
          },
          {
            id: 3,
            title: 'Instalar ventilador de teto',
            description: 'Preciso instalar um novo ventilador de teto no quarto',
            status: 'completed',
            created_at: '05/06/2023',
            location: 'Rua Principal, 123',
            provider: {
              id: 2,
              name: 'Ana Silva',
              rating: 4.9
            }
          }
        ]);
        
        setStats({
          pendingRequests: 1,
          completedRequests: 1,
          totalSpent: 250,
          averageRating: 4.5
        });
      } else if (userType === 'provider') {
        setRequests([
          {
            id: 4,
            title: 'Consertar tomada elétrica',
            description: 'Tomada da sala não está funcionando',
            status: 'pending',
            created_at: '09/06/2023',
            location: 'Rua Carvalho, 456',
            category: 'Elétrica',
            price_estimate: 'R$150-200',
            urgency: 'high',
            client: {
              id: 5,
              name: 'Sara Johnson',
              rating: 4.6
            }
          },
          {
            id: 5,
            title: 'Cortar grama',
            description: 'Preciso cortar a grama do jardim da frente e dos fundos',
            status: 'accepted',
            created_at: '07/06/2023',
            location: 'Rua Pinheiros, 789',
            category: 'Jardinagem',
            price_estimate: 'R$100-150',
            urgency: 'normal',
            client: {
              id: 6,
              name: 'Roberto Marrom',
              rating: 4.2
            }
          },
          {
            id: 6,
            title: 'Montar móveis',
            description: 'Preciso de ajuda para montar uma estante e uma escrivaninha',
            status: 'completed',
            created_at: '04/06/2023',
            location: 'Rua Maple, 321',
            category: 'Montagem de Móveis',
            price_estimate: 'R$200-300',
            urgency: 'normal',
            client: {
              id: 7,
              name: 'Emily Davis',
              rating: 4.9
            }
          },
          {
            id: 7,
            title: 'Instalação de prateleiras',
            description: 'Preciso instalar 4 prateleiras na parede do escritório',
            status: 'pending',
            created_at: '10/06/2023',
            location: 'Av. Central, 567',
            category: 'Montagem de Móveis',
            price_estimate: 'R$150-200',
            urgency: 'low',
            client: {
              id: 8,
              name: 'Carlos Mendes',
              rating: 4.7
            }
          },
          {
            id: 8,
            title: 'Reparo em vazamento de pia',
            description: 'Pia do banheiro está com vazamento na conexão',
            status: 'pending',
            created_at: '11/06/2023',
            location: 'Rua das Flores, 890',
            category: 'Encanamento',
            price_estimate: 'R$100-180',
            urgency: 'high',
            client: {
              id: 9,
              name: 'Mariana Costa',
              rating: 4.5
            }
          }
        ]);
        
        setStats({
          pendingRequests: 3,
          completedRequests: 1,
          totalEarnings: 350,
          averageRating: 4.8
        });
      } else if (userType === 'admin') {
        setRequests([
          {
            id: 7,
            title: 'Consertar pia do banheiro',
            description: 'Pia está entupida e não drena',
            status: 'pending',
            created_at: '10/06/2023',
            location: 'Rua Cedro, 111',
            client: {
              id: 8,
              name: 'David Wilson'
            }
          },
          {
            id: 8,
            title: 'Instalar nova luminária',
            description: 'Preciso substituir a luminária da sala de jantar',
            status: 'accepted',
            created_at: '08/06/2023',
            location: 'Rua Bétula, 222',
            client: {
              id: 9,
              name: 'Lisa Taylor'
            },
            provider: {
              id: 10,
              name: 'Tom Harris'
            }
          }
        ]);
        
        setStats({
          totalUsers: 25,
          totalProviders: 8,
          totalRequests: 42,
          activeRequests: 15
        });
      }
      
      setLoading(false);
    }, 1000);
  }, [userType]);

  const renderClientDashboard = () => (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Solicitações Pendentes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completedRequests}</h3>
            <p>Serviços Concluídos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>R${stats.totalSpent}</h3>
            <p>Total Gasto</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.averageRating}</h3>
            <p>Avaliação Média</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/create-request" className="btn btn-primary">
          <i className="fas fa-plus me-1"></i> Nova Solicitação
        </Link>
        <Link to="/initialize-data" className="btn btn-success">
          <i className="fas fa-calendar-alt me-1"></i> Minha Agenda
        </Link>
        <Link to="/messages" className="btn btn-outline-primary">
          <i className="fas fa-envelope me-1"></i> Mensagens
        </Link>
        <Link to="/profile" className="btn btn-outline-primary">
          <i className="fas fa-user me-1"></i> Meu Perfil
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={activeTab === 'pending' ? 'active' : ''} 
            onClick={() => setActiveTab('pending')}
          >
            Pendentes
          </button>
          <button 
            className={activeTab === 'active' ? 'active' : ''} 
            onClick={() => setActiveTab('active')}
          >
            Ativos
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''} 
            onClick={() => setActiveTab('completed')}
          >
            Concluídos
          </button>
        </div>

        <div className="request-list">
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando suas solicitações...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="no-requests">
              <i className="fas fa-clipboard-list"></i>
              <p>Nenhuma solicitação de serviço encontrada</p>
              <Link to="/create-request" className="btn btn-primary">Crie Sua Primeira Solicitação</Link>
            </div>
          ) : (
            requests.map(request => (
              <div key={request.id} className={`request-card status-${request.status}`}>
                <div className="request-header">
                  <h3>{request.title}</h3>
                  <span className={`status-badge ${request.status}`}>
                    {request.status === 'pending' ? 'Pendente' : 
                     request.status === 'accepted' ? 'Aceito' : 
                     request.status === 'completed' ? 'Concluído' : 
                     request.status === 'cancelled' ? 'Cancelado' : request.status}
                  </span>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-details">
                  <p><i className="fas fa-map-marker-alt"></i> {request.location}</p>
                  <p><i className="fas fa-calendar-alt"></i> {request.created_at}</p>
                  {request.provider && (
                    <p>
                      <i className="fas fa-user-hard-hat"></i> 
                      {request.provider.name} 
                      <span className="rating">
                        <i className="fas fa-star"></i> {request.provider.rating}
                      </span>
                    </p>
                  )}
                </div>
                <div className="request-actions">
                  <Link to={`/requests/${request.id}`} className="btn btn-sm btn-outline-primary">
                    Ver Detalhes
                  </Link>
                  {request.provider && (
                    <Link to={`/messages/${request.provider.id}`} className="btn btn-sm btn-outline-secondary">
                      <i className="fas fa-comment me-1"></i> Mensagem
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

  // Função para aceitar um serviço
  const handleAcceptService = (requestId) => {
    setLoading(true);
    // Simulando uma chamada de API
    setTimeout(() => {
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
      );
      setNotification({
        type: 'success',
        message: 'Serviço aceito com sucesso! O cliente foi notificado.'
      });
      
      // Atualizar estatísticas
      setStats(prevStats => ({
        ...prevStats,
        pendingRequests: prevStats.pendingRequests - 1
      }));
      
      setLoading(false);
    }, 800);
  };

  // Função para marcar um serviço como concluído
  const handleCompleteService = (requestId) => {
    setLoading(true);
    // Simulando uma chamada de API
    setTimeout(() => {
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'completed' } : req
        )
      );
      setStats(prevStats => ({
        ...prevStats,
        completedRequests: prevStats.completedRequests + 1,
        totalEarnings: prevStats.totalEarnings + 150 // Valor de exemplo
      }));
      setNotification({
        type: 'success',
        message: 'Serviço marcado como concluído! Aguardando avaliação do cliente.'
      });
      setLoading(false);
    }, 800);
  };

  const renderProviderDashboard = () => (
    <>
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}
      
      <div className="provider-profile mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className="provider-rating me-3">
                <span className="rating-value">{user.rating}</span>
                <i className="fas fa-star text-warning"></i>
              </div>
              <div>
                <h4 className="mb-0">Perfil Profissional</h4>
                <p className="text-muted mb-0">{user.completedJobs} serviços concluídos</p>
              </div>
              <Link to="/profile/edit" className="btn btn-outline-primary ms-auto">
                <i className="fas fa-edit me-1"></i> Editar Perfil
              </Link>
            </div>
            
            <h5>Minhas Habilidades</h5>
            <div className="skills-container mb-3">
              {user.skills.map((skill, index) => (
                <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
                  {skill}
                </span>
              ))}
              <Link to="/profile/edit" className="badge bg-primary p-2 text-decoration-none">
                <i className="fas fa-plus me-1"></i> Adicionar
              </Link>
            </div>
            
            <div className="availability-status">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="availabilitySwitch" defaultChecked />
                <label className="form-check-label" htmlFor="availabilitySwitch">
                  Disponível para novos serviços
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Serviços Disponíveis</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.completedRequests}</h3>
            <p>Serviços Concluídos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>R${stats.totalEarnings}</h3>
            <p>Ganhos Totais</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.averageRating}</h3>
            <p>Avaliação</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/requests" className="btn btn-primary">
          <i className="fas fa-search me-1"></i> Buscar Serviços
        </Link>
        <Link to="/initialize-data" className="btn btn-success">
          <i className="fas fa-calendar-alt me-1"></i> Inicializar Agenda
        </Link>
        <Link to="/messages" className="btn btn-outline-primary">
          <i className="fas fa-envelope me-1"></i> Mensagens
        </Link>
        <Link to="/profile" className="btn btn-outline-primary">
          <i className="fas fa-user me-1"></i> Meu Perfil
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={activeTab === 'active' ? 'active' : ''} 
            onClick={() => setActiveTab('active')}
          >
            Serviços Ativos
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''} 
            onClick={() => setActiveTab('completed')}
          >
            Concluídos
          </button>
          <button 
            className={activeTab === 'earnings' ? 'active' : ''} 
            onClick={() => setActiveTab('earnings')}
          >
            Ganhos
          </button>
        </div>

        <div className="request-list">
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando seus serviços...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="no-requests">
              <i className="fas fa-clipboard-list"></i>
              <p>Nenhum serviço encontrado</p>
              <Link to="/requests" className="btn btn-primary">Buscar Serviços</Link>
            </div>
          ) : (
            <>
              {activeTab === 'earnings' ? (
                <div className="earnings-section p-3">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">Resumo de Ganhos</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <div className="earnings-stat">
                            <h6>Este Mês</h6>
                            <h3>R$ {stats.totalEarnings}</h3>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="earnings-stat">
                            <h6>Pendente</h6>
                            <h3>R$ 180</h3>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="earnings-stat">
                            <h6>Total Histórico</h6>
                            <h3>R$ 2.450</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h5>Histórico de Pagamentos</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Serviço</th>
                          <th>Cliente</th>
                          <th>Valor</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>15/06/2023</td>
                          <td>Montagem de móveis</td>
                          <td>Emily Davis</td>
                          <td>R$ 150</td>
                          <td><span className="badge bg-success">Pago</span></td>
                        </tr>
                        <tr>
                          <td>10/06/2023</td>
                          <td>Reparo elétrico</td>
                          <td>Roberto Marrom</td>
                          <td>R$ 200</td>
                          <td><span className="badge bg-success">Pago</span></td>
                        </tr>
                        <tr>
                          <td>05/06/2023</td>
                          <td>Instalação de prateleiras</td>
                          <td>Sara Johnson</td>
                          <td>R$ 180</td>
                          <td><span className="badge bg-warning text-dark">Pendente</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                requests
                  .filter(request => {
                    if (activeTab === 'active') return request.status === 'accepted';
                    if (activeTab === 'completed') return request.status === 'completed';
                    return true; // overview tab shows all
                  })
                  .map(request => (
                    <div key={request.id} className={`request-card status-${request.status}`}>
                      <div className="request-header">
                        <h3>{request.title}</h3>
                        <span className={`status-badge ${request.status}`}>
                          {request.status === 'pending' ? 'Pendente' : 
                          request.status === 'accepted' ? 'Aceito' : 
                          request.status === 'completed' ? 'Concluído' : 
                          request.status === 'cancelled' ? 'Cancelado' : request.status}
                        </span>
                      </div>
                      <p className="request-description">{request.description}</p>
                      <div className="request-details">
                        <p><i className="fas fa-map-marker-alt"></i> {request.location}</p>
                        <p><i className="fas fa-calendar-alt"></i> {request.created_at}</p>
                        {request.client && (
                          <p><i className="fas fa-user"></i> {request.client.name}</p>
                        )}
                        {request.status === 'accepted' && (
                          <p><i className="fas fa-clock"></i> Prazo estimado: 2 dias</p>
                        )}
                        {request.status === 'completed' && (
                          <p><i className="fas fa-dollar-sign"></i> Valor: R$ 150</p>
                        )}
                      </div>
                      <div className="request-actions">
                        <Link to={`/requests/${request.id}`} className="btn btn-sm btn-outline-primary">
                          Ver Detalhes
                        </Link>
                        {request.status === 'pending' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleAcceptService(request.id)}
                          >
                            <i className="fas fa-check"></i> Aceitar Serviço
                          </button>
                        )}
                        {request.status === 'accepted' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleCompleteService(request.id)}
                          >
                            <i className="fas fa-check-double"></i> Marcar como Concluído
                          </button>
                        )}
                        {request.client && (
                          <Link to={`/messages/${request.client.id}`} className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-comment me-1"></i> Mensagem
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total de Usuários</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-hard-hat"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProviders}</h3>
            <p>Prestadores de Serviço</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRequests}</h3>
            <p>Total de Solicitações</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeRequests}</h3>
            <p>Solicitações Ativas</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn btn-primary">
          <i className="fas fa-user-plus"></i> Adicionar Usuário
        </button>
        <button className="btn btn-outline-primary">
          <i className="fas fa-cog"></i> Configurações do Sistema
        </button>
        <button className="btn btn-outline-primary">
          <i className="fas fa-chart-bar"></i> Relatórios
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Usuários
          </button>
          <button 
            className={activeTab === 'requests' ? 'active' : ''} 
            onClick={() => setActiveTab('requests')}
          >
            Solicitações
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''} 
            onClick={() => setActiveTab('reports')}
          >
            Relatórios
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="request-list">
              <h3>Solicitações de Serviço Recentes</h3>
              {loading ? (
                <div className="loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p>Carregando solicitações...</p>
                </div>
              ) : (
                requests.map(request => (
                  <div key={request.id} className={`request-card status-${request.status}`}>
                    <div className="request-header">
                      <h3>{request.title}</h3>
                      <span className={`status-badge ${request.status}`}>
                        {request.status === 'pending' ? 'Pendente' : 
                         request.status === 'accepted' ? 'Aceito' : 
                         request.status === 'completed' ? 'Concluído' : 
                         request.status === 'cancelled' ? 'Cancelado' : request.status}
                      </span>
                    </div>
                    <p className="request-description">{request.description}</p>
                    <div className="request-details">
                      <p><i className="fas fa-map-marker-alt"></i> {request.location}</p>
                      <p><i className="fas fa-calendar-alt"></i> {request.created_at}</p>
                      {request.client && (
                        <p><i className="fas fa-user"></i> Cliente: {request.client.name}</p>
                      )}
                      {request.provider && (
                        <p><i className="fas fa-user-hard-hat"></i> Prestador: {request.provider.name}</p>
                      )}
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-sm btn-outline-primary">
                        Ver Detalhes
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-flag"></i> Sinalizar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="admin-users">
              <h3>Gerenciamento de Usuários</h3>
              <p>Interface de gerenciamento de usuários estaria aqui</p>
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div className="admin-requests">
              <h3>Gerenciamento de Solicitações</h3>
              <p>Interface de gerenciamento de solicitações estaria aqui</p>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="admin-reports">
              <h3>Relatórios</h3>
              <p>Interface de relatórios estaria aqui</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-welcome">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div>
            <h2>Bem-vindo, {user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        
        <div className="role-selector">
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
            className="form-select"
          >
            <option value="client">Painel do Cliente</option>
            <option value="provider">Painel do Prestador</option>
            {localStorage.getItem('userRole') === 'admin' && (
              <option value="admin">Painel do Administrador</option>
            )}
          </select>
        </div>
      </div>

      {userType === 'client' && renderClientDashboard()}
      {userType === 'provider' && renderProviderDashboard()}
      {userType === 'admin' && renderAdminDashboard()}
    </div>
  );
}

export default Dashboard;