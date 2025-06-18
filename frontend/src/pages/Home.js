import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCarousel from '../components/JobCarousel';
import api from '../services/api';

function Home() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    requestCount: 0,
    providerCount: 0
  });

  useEffect(() => {
    // Isso normalmente buscaria dados da API
    // Por enquanto vamos apenas simular
    setLoading(true);
    setTimeout(() => {
      setStats({
        requestCount: 12,
        providerCount: 5
      });
      setLoading(false);
    }, 500);
    
    // Em uma implementação real:
    // api.get('/stats').then(response => {
    //   setStats(response.data);
    //   setLoading(false);
    // }).catch(error => {
    //   console.error('Erro ao buscar estatísticas:', error);
    //   setLoading(false);
    // });
  }, []);

  return (
    <div className="container">
      <header className="header py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">ZAP Serv - Profissionais para sua casa</h1>
            <p className="lead my-4">Conecte-se com profissionais qualificados para todos os serviços que você precisa. Publique um trabalho e encontre especialistas na sua região.</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Link to="/create-request" className="btn btn-primary btn-lg px-4 me-md-2">Publicar Serviço</Link>
              <Link to="/requests" className="btn btn-outline-secondary btn-lg px-4">Ver Serviços</Link>
            </div>
          </div>
          <div className="col-lg-6">
            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Serviços de manutenção" 
                 className="img-fluid rounded-3 shadow" />
          </div>
        </div>
      </header>
      
      {/* Seção de Carrossel de Trabalhos */}
      <JobCarousel />
      
      <section className="stats py-5">
        <h2 className="section-title">Estatísticas da Plataforma</h2>
        {loading ? (
          <p className="text-center">Carregando estatísticas...</p>
        ) : (
          <div className="row text-center mt-4">
            <div className="col-md-4">
              <div className="stat-card p-4 bg-white rounded shadow-sm">
                <i className="fas fa-tools fa-3x text-primary mb-3"></i>
                <h3 className="display-6 fw-bold">{stats.requestCount}</h3>
                <p className="text-muted">Solicitações Ativas</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card p-4 bg-white rounded shadow-sm">
                <i className="fas fa-user-hard-hat fa-3x text-primary mb-3"></i>
                <h3 className="display-6 fw-bold">{stats.providerCount}</h3>
                <p className="text-muted">Prestadores de Serviço</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card p-4 bg-white rounded shadow-sm">
                <i className="fas fa-star fa-3x text-primary mb-3"></i>
                <h3 className="display-6 fw-bold">4.8</h3>
                <p className="text-muted">Avaliação Média</p>
              </div>
            </div>
          </div>
        )}
      </section>
      
      <section className="how-it-works py-5">
        <h2 className="section-title text-center mb-5">Como Funciona</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="step-number mb-3">1</div>
                <h3 className="card-title">Publique seu Serviço</h3>
                <p className="card-text">Descreva o que você precisa e envie fotos para obter orçamentos precisos.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="step-number mb-3">2</div>
                <h3 className="card-title">Encontre Profissionais</h3>
                <p className="card-text">Profissionais qualificados na sua região responderão com orçamentos e disponibilidade.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="step-number mb-3">3</div>
                <h3 className="card-title">Serviço Concluído</h3>
                <p className="card-text">Escolha o melhor profissional, tenha seu serviço realizado e deixe uma avaliação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section py-5 my-5 bg-primary text-white rounded">
        <div className="text-center p-4">
          <h2 className="fw-bold mb-3">Pronto para começar?</h2>
          <p className="lead mb-4">Junte-se a milhares de clientes satisfeitos que encontraram o profissional perfeito para suas necessidades.</p>
          <Link to="/register" className="btn btn-light btn-lg px-4">Cadastre-se Agora</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;