import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Schedule.css';

function ScheduleSimple() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProvider = currentUser.role === 'provider';
  
  useEffect(() => {
    // Carregar eventos da agenda
    loadEvents();
  }, [currentDate, view]);
  
  const loadEvents = () => {
    setLoading(true);
    
    // Carregar do localStorage
    setTimeout(() => {
      const storedEvents = JSON.parse(localStorage.getItem('appointments') || '[]');
      setEvents(storedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
      setLoading(false);
    }, 500);
  };
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getDaysInWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para começar na segunda-feira
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  
  const handleStatusUpdate = (eventId, newStatus) => {
    // Atualizar no localStorage
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    );
    
    localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    // Atualizar o evento selecionado se estiver aberto
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({ ...prev, status: newStatus }));
    }
  };
  
  const renderDayView = () => {
    const hoursOfDay = Array.from({ length: 14 }, (_, i) => i + 7); // 7h às 20h
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="day-view">
        <div className="time-slots">
          {hoursOfDay.map(hour => (
            <div key={hour} className="time-slot">
              <div className="hour-label">{`${hour}:00`}</div>
              <div className="hour-content">
                {dayEvents
                  .filter(event => {
                    const eventHour = event.start.getHours();
                    return eventHour === hour;
                  })
                  .map(event => (
                    <div 
                      key={event.id} 
                      className={`event-item ${event.status}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-time">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      <div className="event-title">{event.title}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const days = getDaysInWeek();
    
    return (
      <div className="week-view">
        <div className="week-header">
          {days.map((day, index) => (
            <div key={index} className="day-header">
              <div className="day-name">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
              <div className="day-number">{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="week-body">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={index} className="day-column">
                {dayEvents.length === 0 ? (
                  <div className="no-events">Sem compromissos</div>
                ) : (
                  dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`event-item ${event.status}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-time">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      <div className="event-title">{event.title}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="event-details-overlay">
        <div className="event-details-modal">
          <div className="event-details-header">
            <h3>{selectedEvent.title}</h3>
            <button className="close-button" onClick={closeEventDetails}>×</button>
          </div>
          <div className="event-details-content">
            <div className="event-detail">
              <i className="fas fa-calendar me-2"></i>
              <span>{formatDate(selectedEvent.start)}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-clock me-2"></i>
              <span>{formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-map-marker-alt me-2"></i>
              <span>{selectedEvent.location}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-info-circle me-2"></i>
              <span>{selectedEvent.description}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-user me-2"></i>
              <span>Cliente: {selectedEvent.client.name}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-phone me-2"></i>
              <span>{selectedEvent.client.phone}</span>
            </div>
            <div className="event-detail">
              <i className="fas fa-tag me-2"></i>
              <span className={`status-badge ${selectedEvent.status}`}>
                {selectedEvent.status === 'confirmed' ? 'Confirmado' : 
                 selectedEvent.status === 'pending' ? 'Pendente' : 
                 selectedEvent.status === 'completed' ? 'Concluído' : 'Cancelado'}
              </span>
            </div>
          </div>
          <div className="event-details-actions">
            <Link to={`/messages/${selectedEvent.client.id}`} className="btn btn-outline-primary">
              <i className="fas fa-comment me-1"></i> Mensagem
            </Link>
            {selectedEvent.status === 'pending' && (
              <button 
                className="btn btn-success"
                onClick={() => handleStatusUpdate(selectedEvent.id, 'confirmed')}
              >
                <i className="fas fa-check me-1"></i> Confirmar
              </button>
            )}
            {selectedEvent.status !== 'cancelled' && (
              <button 
                className="btn btn-outline-danger"
                onClick={() => handleStatusUpdate(selectedEvent.id, 'cancelled')}
              >
                <i className="fas fa-times me-1"></i> Cancelar
              </button>
            )}
            {selectedEvent.status === 'confirmed' && (
              <button 
                className="btn btn-outline-success"
                onClick={() => handleStatusUpdate(selectedEvent.id, 'completed')}
              >
                <i className="fas fa-check-double me-1"></i> Concluir
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-5">
      <div className="schedule-container">
        <div className="schedule-header">
          <div className="schedule-title-section">
            <h1>Minha Agenda</h1>
            <div className="schedule-subtitle">
              {isProvider ? 'Gerencie seus compromissos com clientes' : 'Acompanhe seus agendamentos de serviços'}
            </div>
            <div className="current-date">
              <i className="fas fa-calendar-alt me-2"></i>
              {formatDate(currentDate)}
            </div>
          </div>
          <div className="schedule-controls">
            <div className="view-controls">
              <button 
                className={`btn ${view === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('day')}
              >
                <i className="fas fa-calendar-day me-1"></i> Dia
              </button>
              <button 
                className={`btn ${view === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('week')}
              >
                <i className="fas fa-calendar-week me-1"></i> Semana
              </button>
            </div>
            <div className="navigation-controls">
              <button className="btn btn-outline-secondary" onClick={handlePrevious} title="Anterior">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="btn btn-outline-primary" onClick={handleToday} title="Hoje">
                <i className="fas fa-calendar-check me-1"></i> Hoje
              </button>
              <button className="btn btn-outline-secondary" onClick={handleNext} title="Próximo">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="schedule-summary">
          <div className="summary-item">
            <div className="summary-value">{events.filter(e => e.status === 'confirmed').length}</div>
            <div className="summary-label">Confirmados</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{events.filter(e => e.status === 'pending').length}</div>
            <div className="summary-label">Pendentes</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{events.filter(e => e.status === 'completed').length}</div>
            <div className="summary-label">Concluídos</div>
          </div>
        </div>
        
        <div className="schedule-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p>Carregando sua agenda...</p>
            </div>
          ) : (
            <>
              {view === 'day' && renderDayView()}
              {view === 'week' && renderWeekView()}
            </>
          )}
        </div>
        
        <div className="schedule-footer">
          <div className="footer-content">
            <div className="legend">
              <h5 className="legend-title">Status dos Agendamentos</h5>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="status-dot confirmed"></span>
                  <span>Confirmado</span>
                </div>
                <div className="legend-item">
                  <span className="status-dot pending"></span>
                  <span>Pendente</span>
                </div>
                <div className="legend-item">
                  <span className="status-dot completed"></span>
                  <span>Concluído</span>
                </div>
                <div className="legend-item">
                  <span className="status-dot cancelled"></span>
                  <span>Cancelado</span>
                </div>
              </div>
            </div>
            
            <div className="footer-actions">
              <Link to="/create-appointment" className="btn btn-success me-2">
                <i className="fas fa-plus me-1"></i> Novo Agendamento
              </Link>
              <Link to="/dashboard" className="btn btn-outline-primary">
                <i className="fas fa-arrow-left me-1"></i> Voltar ao Painel
              </Link>
            </div>
          </div>
          
          <div className="footer-info">
            <p>
              <i className="fas fa-info-circle me-1"></i> 
              {isProvider 
                ? "Clique em um agendamento para ver detalhes e atualizar seu status." 
                : "Clique em um agendamento para ver detalhes e entrar em contato com o prestador."}
            </p>
          </div>
        </div>
      </div>
      
      {selectedEvent && renderEventDetails()}
    </div>
  );
}

export default ScheduleSimple;