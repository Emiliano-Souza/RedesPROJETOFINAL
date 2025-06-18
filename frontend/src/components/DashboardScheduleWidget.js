import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DashboardScheduleWidget() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Carregar próximos eventos da agenda
    loadUpcomingEvents();
  }, []);
  
  const loadUpcomingEvents = () => {
    setLoading(true);
    
    // Carregar do localStorage
    setTimeout(() => {
      const storedEvents = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Filtrar apenas eventos futuros e ordenar por data
      const now = new Date();
      const futureEvents = storedEvents
        .filter(event => new Date(event.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3); // Pegar apenas os 3 próximos
      
      setUpcomingEvents(futureEvents);
      setLoading(false);
    }, 500);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success">Confirmado</span>;
      case 'pending':
        return <span className="badge bg-warning">Pendente</span>;
      case 'completed':
        return <span className="badge bg-primary">Concluído</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelado</span>;
      default:
        return <span className="badge bg-secondary">Desconhecido</span>;
    }
  };
  
  return (
    <div className="card shadow h-100">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Próximos Agendamentos</h5>
        <Link to="/schedule" className="btn btn-sm btn-outline-primary">
          Ver Todos
        </Link>
      </div>
      
      <div className="card-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2 text-muted">Carregando agendamentos...</p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-calendar-times fa-2x text-muted mb-3"></i>
            <p>Nenhum agendamento próximo.</p>
            <Link to="/create-appointment" className="btn btn-sm btn-primary">
              <i className="fas fa-plus me-1"></i> Criar Agendamento
            </Link>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {upcomingEvents.map(event => (
              <div key={event.id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="mb-0">{event.title}</h6>
                  {getStatusBadge(event.status)}
                </div>
                <div className="small text-muted mb-2">
                  <i className="fas fa-map-marker-alt me-1"></i> {event.location}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="small">
                    <i className="fas fa-calendar me-1"></i> {formatDate(event.start)}
                    <br />
                    <i className="fas fa-clock me-1"></i> {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                  <Link to="/schedule" className="btn btn-sm btn-outline-secondary">
                    Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-footer bg-white text-center">
        <Link to="/create-appointment" className="btn btn-primary btn-sm">
          <i className="fas fa-plus me-1"></i> Novo Agendamento
        </Link>
      </div>
    </div>
  );
}

export default DashboardScheduleWidget;