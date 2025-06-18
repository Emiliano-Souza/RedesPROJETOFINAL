import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProvider = currentUser.role === 'provider';
  
  useEffect(() => {
    // Carregar solicitações do localStorage
    loadRequests();
  }, [filter]);
  
  const loadRequests = () => {
    setLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      // Obter solicitações do localStorage
      let storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      
      console.log("Solicitações carregadas:", storedRequests);
      
      // Aplicar filtros
      if (filter !== 'all') {
        storedRequests = storedRequests.filter(req => req.status === filter);
      }
      
      setRequests(storedRequests);
      setLoading(false);
    }, 500);
  };
  
  // Função para inicializar dados de exemplo
  const initializeExampleData = () => {
    const exampleRequests = [
      {
        id: 1,
        title: "Reparo de Torneira",
        category: "Encanamento",
        description: "Torneira da cozinha com vazamento constante",
        location: "Rua das Flores, 123",
        status: "pending",
        urgency: "normal",
        created_at: new Date().toISOString(),
        images: []
      },
      {
        id: 2,
        title: "Instalação de Lâmpadas",
        category: "Elétrica",
        description: "Preciso instalar 5 lâmpadas LED no teto da sala",
        location: "Av. Principal, 456",
        status: "accepted",
        urgency: "low",
        created_at: new Date().toISOString(),
        images: []
      },
      {
        id: 3,
        title: "Montagem de Móveis",
        category: "Montagem",
        description: "Montagem de guarda-roupa e cama",
        location: "Rua dos Pinheiros, 789",
        status: "completed",
        urgency: "high",
        created_at: new Date().toISOString(),
        images: []
      }
    ];
    
    localStorage.setItem('requests', JSON.stringify(exampleRequests));
    alert("Dados de exemplo inicializados com sucesso!");
    loadRequests();
  };
  
  const handleStatusChange = (requestId, newStatus) => {
    // Atualizar status no localStorage
    const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updatedRequests = storedRequests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    
    // Atualizar estado
    setRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
    );
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning">Pendente</span>;
      case 'accepted':
        return <span className="badge bg-primary">Aceito</span>;
      case 'completed':
        return <span className="badge bg-success">Concluído</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelado</span>;
      default:
        return <span className="badge bg-secondary">Desconhecido</span>;
    }
  };
  
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Solicitações de Serviço</h1>
        <div>
          <button onClick={initializeExampleData} className="btn btn-outline-secondary me-2">
            <i className="fas fa-database me-2"></i>Inicializar Dados
          </button>
          <Link to="/create-request" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Nova Solicitação
          </Link>
        </div>
      </div>
      
      <div className="card shadow">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                Todas
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('pending')}
              >
                Pendentes
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'accepted' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('accepted')}
              >
                Aceitas
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('completed')}
              >
                Concluídas
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-3">Carregando solicitações...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
              <h3>Nenhuma solicitação encontrada</h3>
              <p className="text-muted">
                {filter !== 'all' 
                  ? `Não há solicitações com o status selecionado.` 
                  : `Clique em "Nova Solicitação" para criar uma.`}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Localização</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request.id}>
                      <td>
                        <div className="fw-bold">{request.title}</div>
                        <div className="small text-muted">{request.category}</div>
                        {request.images && request.images.length > 0 && (
                          <div className="mt-2">
                            <img 
                              src={request.images[0].data} 
                              alt="Imagem da solicitação" 
                              className="img-thumbnail" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            {request.images.length > 1 && (
                              <span className="badge bg-secondary ms-2">+{request.images.length - 1}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{request.location}</td>
                      <td>{new Date(request.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <div className="btn-group">
                          <Link to={`/requests/${request.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye me-1"></i> Ver
                          </Link>
                          
                          {request.status === 'pending' && (
                            <>
                              {isProvider && (
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleStatusChange(request.id, 'accepted')}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleStatusChange(request.id, 'cancelled')}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          
                          {request.status === 'accepted' && (
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusChange(request.id, 'completed')}
                            >
                              <i className="fas fa-check-double"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceRequests;