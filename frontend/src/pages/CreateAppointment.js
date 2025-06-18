import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    providerId: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    // Carregar prestadores disponíveis
    const mockProviders = [
      { id: 1, name: 'João Silva', services: 'Encanamento, Elétrica' },
      { id: 2, name: 'Maria Oliveira', services: 'Pintura, Limpeza' },
      { id: 3, name: 'Carlos Santos', services: 'Montagem de Móveis, Carpintaria' }
    ];
    
    setProviders(mockProviders);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar dados
      if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.providerId) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      
      // Criar objeto de data para início e fim
      const startDate = new Date(`${formData.date}T${formData.startTime}`);
      const endDate = new Date(`${formData.date}T${formData.endTime}`);
      
      // Validar horários
      if (endDate <= startDate) {
        throw new Error('O horário de término deve ser posterior ao horário de início');
      }
      
      // Encontrar o prestador selecionado
      const selectedProvider = providers.find(p => p.id === parseInt(formData.providerId));
      
      // Criar novo agendamento
      const newAppointment = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        status: formData.status,
        client: {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone || '(00) 00000-0000'
        },
        provider: {
          id: selectedProvider.id,
          name: selectedProvider.name
        }
      };
      
      // Salvar no localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      appointments.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      // Redirecionar para a agenda
      alert('Agendamento criado com sucesso!');
      navigate('/schedule');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Novo Agendamento</h2>
              <span className="badge bg-light text-primary">Versão Offline</span>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título do Agendamento</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Conserto de torneira"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="providerId" className="form-label">Prestador de Serviço</label>
                  <select
                    className="form-select"
                    id="providerId"
                    name="providerId"
                    value={formData.providerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um prestador</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.services}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="date" className="form-label">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="startTime" className="form-label">Horário de Início</label>
                    <input
                      type="time"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="endTime" className="form-label">Horário de Término</label>
                    <input
                      type="time"
                      className="form-control"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Local</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Rua Principal, 123, Centro"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Descreva os detalhes do serviço..."
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/schedule')}
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
                        Criando...
                      </>
                    ) : 'Criar Agendamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAppointment;