import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProviderProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    skills: [],
    availability: [],
    hourlyRate: ''
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simular chamada de API para buscar dados do perfil
    setLoading(true);
    setTimeout(() => {
      const mockProfile = {
        id: 1,
        name: 'João Silva',
        email: 'joao@exemplo.com',
        phone: '(11) 98765-4321',
        description: 'Profissional com mais de 10 anos de experiência em serviços de manutenção residencial. Especializado em reparos elétricos e hidráulicos.',
        skills: ['Encanamento', 'Elétrica', 'Montagem de Móveis'],
        availability: ['Segunda-Feira', 'Terça-Feira', 'Quinta-Feira', 'Sexta-Feira'],
        hourlyRate: '80',
        rating: 4.8,
        completedJobs: 27,
        reviews: [
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
        ]
      };
      
      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone,
        description: mockProfile.description,
        skills: [...mockProfile.skills],
        availability: [...mockProfile.availability],
        hourlyRate: mockProfile.hourlyRate
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillChange = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const handleAvailabilityChange = (day) => {
    if (formData.availability.includes(day)) {
      setFormData({
        ...formData,
        availability: formData.availability.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        availability: [...formData.availability, day]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular chamada de API para atualizar perfil
    setTimeout(() => {
      setProfile({
        ...profile,
        ...formData
      });
      setEditMode(false);
      setLoading(false);
      setNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    }, 1000);
  };

  const availableDays = [
    'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 
    'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo'
  ];

  const availableSkills = [
    'Encanamento', 'Elétrica', 'Montagem de Móveis', 'Pintura',
    'Jardinagem', 'Limpeza', 'Carpintaria', 'Alvenaria',
    'Instalação de Ar Condicionado', 'Conserto de Eletrodomésticos'
  ];

  if (loading && !profile) {
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
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}
      
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt={profile.name} 
                  className="rounded-circle img-fluid" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #3498db' }}
                />
              </div>
              <h3 className="card-title mb-0">{profile.name}</h3>
              <p className="text-muted mb-1">{profile.email}</p>
              <p className="text-muted">{profile.phone}</p>
              
              <div className="d-flex justify-content-center mb-3">
                <div className="px-3">
                  <h5 className="mb-0">{profile.completedJobs}</h5>
                  <small className="text-muted">Serviços</small>
                </div>
                <div className="px-3 border-start">
                  <h5 className="mb-0">{profile.rating}</h5>
                  <small className="text-muted">
                    <i className="fas fa-star text-warning"></i> Avaliação
                  </small>
                </div>
              </div>
              
              {!editMode && (
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => setEditMode(true)}
                >
                  <i className="fas fa-edit me-2"></i> Editar Perfil
                </button>
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Minhas Habilidades</h5>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary p-2">{skill}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Disponibilidade</h5>
              <ul className="list-group list-group-flush mt-3">
                {availableDays.map((day, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {day}
                    {profile.availability.includes(day) ? (
                      <span className="badge bg-success rounded-pill">Disponível</span>
                    ) : (
                      <span className="badge bg-secondary rounded-pill">Indisponível</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Valor Hora</h5>
              <h3 className="text-center my-3">R$ {profile.hourlyRate},00</h3>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          {editMode ? (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">Editar Perfil</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome Completo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      name="name"
                      value={formData.name}
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
                        value={formData.email}
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
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição Profissional</label>
                    <textarea 
                      className="form-control" 
                      id="description" 
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Habilidades</label>
                    <div className="d-flex flex-wrap gap-2">
                      {availableSkills.map((skill, index) => (
                        <div key={index} className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={`skill-${index}`}
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleSkillChange(skill)}
                          />
                          <label className="form-check-label" htmlFor={`skill-${index}`}>
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Disponibilidade</label>
                    <div className="row">
                      {availableDays.map((day, index) => (
                        <div key={index} className="col-md-6 mb-2">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`day-${index}`}
                              checked={formData.availability.includes(day)}
                              onChange={() => handleAvailabilityChange(day)}
                            />
                            <label className="form-check-label" htmlFor={`day-${index}`}>
                              {day}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="hourlyRate" className="form-label">Valor Hora (R$)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="hourlyRate" 
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Salvando...
                        </>
                      ) : 'Salvar Alterações'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="card-title">Sobre Mim</h4>
                  <p className="card-text">{profile.description}</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Avaliações de Clientes</h4>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className="fas fa-star text-warning"></i>
                        <span className="ms-1 fw-bold">{profile.rating}</span>
                      </div>
                      <span className="text-muted">({profile.reviews.length} avaliações)</span>
                    </div>
                  </div>
                  
                  {profile.reviews.map(review => (
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
            </>
          )}
          
          <div className="d-flex justify-content-between mt-4">
            <Link to="/dashboard" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-2"></i> Voltar ao Painel
            </Link>
            <Link to="/requests" className="btn btn-primary">
              <i className="fas fa-search me-2"></i> Buscar Serviços
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;