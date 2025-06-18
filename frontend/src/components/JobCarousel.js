import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/JobCarousel.css';

const JobCarousel = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Em uma implementação real, isso buscaria da sua API
        // const response = await api.get('/api/requests/active');
        // setJobs(response.data.data);
        
        // Dados de exemplo para demonstração
        setJobs([
          {
            id: 1,
            title: 'Consertar Torneira com Vazamento',
            description: 'Torneira do banheiro está vazando há 2 dias. Preciso de reparo urgente.',
            location: 'Centro, Rua Principal, 123',
            price_estimate: 'R$150-250',
            created_at: '10/06/2023',
            image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 2,
            title: 'Instalação de Tomada Elétrica',
            description: 'Preciso instalar 3 novas tomadas no escritório de casa.',
            location: 'Zona Oeste, Av. Carvalho, 456',
            price_estimate: 'R$200-300',
            created_at: '09/06/2023',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45249ff78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 3,
            title: 'Montagem de Armários de Cozinha',
            description: 'Preciso de ajuda para montar e instalar 5 armários de cozinha da IKEA.',
            location: 'Zona Norte, Rua dos Pinheiros, 789',
            price_estimate: 'R$400-600',
            created_at: '08/06/2023',
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          },
          {
            id: 4,
            title: 'Cortar Grama e Limpeza de Jardim',
            description: 'Preciso de corte de grama regular e limpeza dos canteiros do jardim.',
            location: 'Zona Leste, Rua das Flores, 321',
            price_estimate: 'R$150-200',
            created_at: '07/06/2023',
            image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar os serviços');
        setLoading(false);
        console.error('Erro ao buscar serviços:', err);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="job-carousel-container">
      <h2 className="section-title">Serviços Disponíveis</h2>
      <p className="section-subtitle">Encontre sua próxima oportunidade</p>
      
      <div id="jobCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {jobs.map((job, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={job.id}>
              <div className="job-card">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={job.image} className="job-image" alt={job.title} />
                  </div>
                  <div className="col-md-8">
                    <div className="job-card-body">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-description">{job.description}</p>
                      <div className="job-details">
                        <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                        <p><i className="fas fa-dollar-sign"></i> {job.price_estimate}</p>
                        <p><i className="fas fa-calendar-alt"></i> Publicado: {job.created_at}</p>
                      </div>
                      <Link to={`/requests/${job.id}`} className="btn btn-primary">Ver Detalhes</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#jobCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#jobCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>
      
      <div className="text-center mt-4">
        <Link to="/requests" className="btn btn-outline-primary">Ver Todos os Serviços</Link>
      </div>
    </div>
  );
};

export default JobCarousel;