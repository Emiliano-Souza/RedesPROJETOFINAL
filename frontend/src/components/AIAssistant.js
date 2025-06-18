import React, { useState } from 'react';
import '../styles/AIAssistant.css';

const AIAssistant = ({ onSuggestionAccept }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [assistantVisible, setAssistantVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simular chamada de API para serviço de IA
    setTimeout(() => {
      // Gerar sugestões com base na consulta
      if (query.toLowerCase().includes('vazamento') || query.toLowerCase().includes('torneira')) {
        setSuggestions({
          serviceType: 'Encanamento',
          title: 'Reparo de Torneira',
          description: 'Tenho uma torneira com vazamento no banheiro que precisa de reparo. A água está pingando constantemente e causando danos.',
          priceEstimate: 'R$150-250',
          timeEstimate: '1-2 horas',
          requiredSkills: ['Encanamento', 'Reparo de torneiras', 'Ferramentas básicas']
        });
      } else if (query.toLowerCase().includes('elétric') || query.toLowerCase().includes('tomada')) {
        setSuggestions({
          serviceType: 'Elétrica',
          title: 'Instalação de Tomada Elétrica',
          description: 'Preciso instalar uma nova tomada elétrica no escritório de casa. A parede é de drywall e existem outras tomadas próximas.',
          priceEstimate: 'R$200-300',
          timeEstimate: '2-3 horas',
          requiredSkills: ['Trabalho elétrico', 'Fiação', 'Conhecimento de circuitos']
        });
      } else if (query.toLowerCase().includes('pint') || query.toLowerCase().includes('parede')) {
        setSuggestions({
          serviceType: 'Pintura',
          title: 'Pintura de Parede Interna',
          description: 'Preciso pintar as paredes da sala de estar. O ambiente tem aproximadamente 15x20 metros com teto de 2,70m. Já comprei a tinta.',
          priceEstimate: 'R$500-800',
          timeEstimate: '1-2 dias',
          requiredSkills: ['Pintura', 'Preparação de superfície', 'Trabalho detalhado']
        });
      } else {
        setSuggestions({
          serviceType: 'Serviços Gerais',
          title: 'Reparos Gerais em Casa',
          description: 'Preciso de ajuda com vários pequenos reparos em casa, incluindo consertar uma porta que range, reparar um pequeno buraco na parede e ajustar portas de armários.',
          priceEstimate: 'R$200-400',
          timeEstimate: '3-4 horas',
          requiredSkills: ['Reparos gerais', 'Carpintaria básica', 'Reparo de drywall']
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleAcceptSuggestion = () => {
    if (suggestions && onSuggestionAccept) {
      onSuggestionAccept(suggestions);
      setSuggestions(null);
      setQuery('');
    }
  };

  const toggleAssistant = () => {
    setAssistantVisible(!assistantVisible);
  };

  return (
    <>
      <button 
        className="ai-assistant-toggle" 
        onClick={toggleAssistant}
        title="Assistente IA"
      >
        <i className="fas fa-robot"></i>
      </button>
      
      <div className={`ai-assistant ${assistantVisible ? 'visible' : ''}`}>
        <div className="ai-assistant-header">
          <h3>Assistente IA</h3>
          <button className="close-btn" onClick={toggleAssistant}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="ai-assistant-content">
          <p className="ai-intro">
            Descreva o que você precisa, e eu sugerirei o melhor tipo de serviço, 
            custo estimado e ajudarei a criar sua solicitação.
          </p>
          
          <form onSubmit={handleSubmit} className="ai-form">
            <div className="input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ex: Tenho uma torneira vazando no banheiro..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
          </form>
          
          {isLoading && (
            <div className="ai-loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Analisando sua solicitação...</p>
            </div>
          )}
          
          {suggestions && !isLoading && (
            <div className="ai-suggestions">
              <h4>Serviço Sugerido</h4>
              
              <div className="suggestion-item">
                <span className="label">Tipo de Serviço:</span>
                <span className="value">{suggestions.serviceType}</span>
              </div>
              
              <div className="suggestion-item">
                <span className="label">Título:</span>
                <span className="value">{suggestions.title}</span>
              </div>
              
              <div className="suggestion-item">
                <span className="label">Descrição:</span>
                <span className="value">{suggestions.description}</span>
              </div>
              
              <div className="suggestion-item">
                <span className="label">Custo Estimado:</span>
                <span className="value">{suggestions.priceEstimate}</span>
              </div>
              
              <div className="suggestion-item">
                <span className="label">Tempo Estimado:</span>
                <span className="value">{suggestions.timeEstimate}</span>
              </div>
              
              <div className="suggestion-item">
                <span className="label">Habilidades Necessárias:</span>
                <span className="value">{suggestions.requiredSkills.join(', ')}</span>
              </div>
              
              <div className="suggestion-actions">
                <button 
                  className="btn-accept" 
                  onClick={handleAcceptSuggestion}
                >
                  Usar Esta Sugestão
                </button>
                <button 
                  className="btn-reject" 
                  onClick={() => setSuggestions(null)}
                >
                  Recomeçar
                </button>
              </div>
            </div>
          )}
          
          <div className="ai-tips">
            <h5>Dicas:</h5>
            <ul>
              <li>Seja específico sobre o problema que está enfrentando</li>
              <li>Mencione o local em sua casa</li>
              <li>Inclua medidas ou quantidades relevantes</li>
              <li>Descreva o quão urgente é o problema</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;