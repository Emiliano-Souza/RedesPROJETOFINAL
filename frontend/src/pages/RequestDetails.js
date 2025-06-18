import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProvider = currentUser.role === 'provider';
  
  useEffect(() => {
    // Carregar detalhes da solicitação
    loadRequestDetails();
  }, [id]);
  
  const loadRequestDetails = () => {
    setLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      // Obter solicitações do localStorage
      const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      console.log("ID buscado:", id);
      console.log("Solicitações armazenadas:", storedRequests);
      
      const foundRequest = storedRequests.find(req => req.id.toString() === id.toString());
      
      console.log("Solicitação encontrada:", foundRequest);
      
      if (foundRequest) {
        setRequest(foundRequest);
      } else {
        console.error("Solicitação não encontrada com ID:", id);
      }
      
      setLoading(false);
    }, 500);
  };
  
  const handleStatusChange = (newStatus) => {
    // Atualizar status no localStorage
    const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updatedRequests = storedRequests.map(req => 
      req.id.toString() === id ? { ...req, status: newStatus } : req
    );
    
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    
    // Atualizar estado
    setRequest(prev => ({ ...prev, status: newStatus }));
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
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando detalhes da solicitação...</p>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Solicitação não encontrada
        </div>
        <Link to="/requests" className="btn btn-primary mt-3">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Solicitações
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">{request.title}</h1>
              {getStatusBadge(request.status)}
            </div>
            
            <div className="card-body">
              <div className="mb-4">
                <h5 className="text-muted mb-3">Detalhes da Solicitação</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="fw-bold">Categoria</div>
                    <div>{request.category || 'Não especificada'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="fw-bold">Urgência</div>
                    <div>
                      {request.urgency === 'low' && 'Baixa'}
                      {request.urgency === 'normal' && 'Normal'}
                      {request.urgency === 'high' && 'Alta'}
                      {request.urgency === 'emergency' && 'Emergência'}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="fw-bold">Localização</div>
                    <div>{request.location}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="fw-bold">Data de Criação</div>
                    <div>{new Date(request.created_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-muted mb-3">Descrição</h5>
                <p>{request.description}</p>
              </div>
              
              {request.images && request.images.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-muted mb-3">Imagens</h5>
                  
                  <div className="position-relative mb-3">
                    <img 
                      src={request.images[activeImage].data} 
                      alt={`Imagem ${activeImage + 1}`}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                    />
                    
                    {request.images.length > 1 && (
                      <>
                        <button 
                          className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                          onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : request.images.length - 1))}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button 
                          className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                          onClick={() => setActiveImage(prev => (prev < request.images.length - 1 ? prev + 1 : 0))}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {request.images.length > 1 && (
                    <div className="d-flex gap-2 overflow-auto py-2">
                      {request.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image.data} 
                          alt={`Miniatura ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${index === activeImage ? 'border-primary' : ''}`}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderWidth: index === activeImage ? '3px' : '1px'
                          }}
                          onClick={() => setActiveImage(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Ações</h5>
            </div>
            <div className="card-body">
              {request.status === 'pending' && (
                <div className="d-grid gap-2">
                  {isProvider && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleStatusChange('accepted')}
                    >
                      <i className="fas fa-check me-2"></i>
                      Aceitar Solicitação
                    </button>
                  )}
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar Solicitação
                  </button>
                </div>
              )}
              
              {request.status === 'accepted' && (
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusChange('completed')}
                  >
                    <i className="fas fa-check-double me-2"></i>
                    Marcar como Concluído
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar Solicitação
                  </button>
                </div>
              )}
              
              {(request.status === 'completed' || request.status === 'cancelled') && (
                <div className="alert alert-info mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Esta solicitação está {request.status === 'completed' ? 'concluída' : 'cancelada'} e não pode ser modificada.
                </div>
              )}
            </div>
          </div>
          
          <div className="d-grid">
            <Link to="/requests" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Voltar para Solicitações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;