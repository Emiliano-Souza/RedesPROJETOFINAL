import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitializeData() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Inicializar dados de exemplo para a agenda
    const initializeAppointments = () => {
      // Verificar se já existem agendamentos
      const existingAppointments = localStorage.getItem('appointments');
      
      if (!existingAppointments) {
        // Criar dados de exemplo
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        
        const sampleAppointments = [
          {
            id: 1,
            title: 'Consertar torneira',
            description: 'Torneira da cozinha com vazamento',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(),
            location: 'Rua Principal, 123 - Centro',
            status: 'confirmed',
            client: {
              id: 5,
              name: 'Sara Johnson',
              phone: '(11) 98765-4321'
            },
            provider: {
              id: 1,
              name: 'João Silva'
            }
          },
          {
            id: 2,
            title: 'Instalação elétrica',
            description: 'Instalação de 3 tomadas no escritório',
            start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0).toISOString(),
            end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0).toISOString(),
            location: 'Av. Carvalho, 456 - Zona Oeste',
            status: 'confirmed',
            client: {
              id: 6,
              name: 'Roberto Marrom',
              phone: '(11) 91234-5678'
            },
            provider: {
              id: 1,
              name: 'João Silva'
            }
          },
          {
            id: 3,
            title: 'Montagem de móveis',
            description: 'Montagem de estante e escrivaninha',
            start: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 10, 0).toISOString(),
            end: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 13, 0).toISOString(),
            location: 'Rua Maple, 321 - Zona Norte',
            status: 'pending',
            client: {
              id: 7,
              name: 'Emily Davis',
              phone: '(11) 99876-5432'
            },
            provider: {
              id: 2,
              name: 'Maria Oliveira'
            }
          }
        ];
        
        localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
      }
    };
    
    // Inicializar dados
    initializeAppointments();
    
    // Redirecionar após inicialização
    setTimeout(() => {
      setLoading(false);
      navigate('/schedule');
    }, 1500);
  }, [navigate]);
  
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
      <h3 className="mt-3">Inicializando dados da agenda...</h3>
      <p className="text-muted">Por favor, aguarde.</p>
    </div>
  );
}

export default InitializeData;