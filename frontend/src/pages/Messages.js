import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Messages.css';

function Messages() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Obter dados do usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    // Carregar contatos
    loadContacts();
  }, []);
  
  useEffect(() => {
    // Carregar mensagens quando o contato ativo muda
    if (activeContact) {
      loadMessages(activeContact.id);
      scrollToBottom();
    }
  }, [activeContact]);
  
  useEffect(() => {
    // Definir contato ativo com base no ID da URL
    if (contactId && contacts.length > 0) {
      const contact = contacts.find(c => c.id === parseInt(contactId));
      if (contact) {
        setActiveContact(contact);
      }
    } else if (contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0]);
    }
  }, [contactId, contacts]);
  
  const loadContacts = () => {
    setLoading(true);
    
    // Simular chamada de API para carregar contatos
    setTimeout(() => {
      const mockContacts = [
        {
          id: 1,
          name: 'Sara Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          lastMessage: 'Olá, quando você pode vir consertar minha torneira?',
          timestamp: '10:30',
          unread: 2,
          role: 'client'
        },
        {
          id: 2,
          name: 'Roberto Marrom',
          avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
          lastMessage: 'O serviço ficou ótimo, obrigado!',
          timestamp: 'Ontem',
          unread: 0,
          role: 'client'
        },
        {
          id: 3,
          name: 'Ana Silva',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          lastMessage: 'Você está disponível na próxima semana?',
          timestamp: '08/06',
          unread: 1,
          role: 'provider'
        }
      ];
      
      setContacts(mockContacts);
      setLoading(false);
    }, 1000);
  };
  
  const loadMessages = (contactId) => {
    // Simular chamada de API para carregar mensagens
    setTimeout(() => {
      const mockMessages = [
        {
          id: 1,
          senderId: currentUser.id,
          receiverId: contactId,
          text: 'Olá, tudo bem?',
          timestamp: '10:15'
        },
        {
          id: 2,
          senderId: contactId,
          receiverId: currentUser.id,
          text: 'Olá! Tudo ótimo e com você?',
          timestamp: '10:16'
        },
        {
          id: 3,
          senderId: currentUser.id,
          receiverId: contactId,
          text: 'Estou bem! Gostaria de saber se você está disponível para um serviço de encanamento na próxima semana.',
          timestamp: '10:18'
        },
        {
          id: 4,
          senderId: contactId,
          receiverId: currentUser.id,
          text: 'Sim, estou disponível. Que dia seria melhor para você?',
          timestamp: '10:20'
        },
        {
          id: 5,
          senderId: currentUser.id,
          receiverId: contactId,
          text: 'Terça-feira pela manhã seria ideal.',
          timestamp: '10:22'
        },
        {
          id: 6,
          senderId: contactId,
          receiverId: currentUser.id,
          text: 'Perfeito! Posso ir às 9h. Qual é o endereço?',
          timestamp: '10:25'
        },
        {
          id: 7,
          senderId: currentUser.id,
          receiverId: contactId,
          text: 'Rua Principal, 123, Apartamento 45. Obrigado pela disponibilidade!',
          timestamp: '10:28'
        },
        {
          id: 8,
          senderId: contactId,
          receiverId: currentUser.id,
          text: 'Olá, quando você pode vir consertar minha torneira?',
          timestamp: '10:30'
        }
      ];
      
      setMessages(mockMessages);
    }, 500);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeContact) return;
    
    // Adicionar nova mensagem à lista
    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: activeContact.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Atualizar último contato
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === activeContact.id 
          ? { ...contact, lastMessage: newMessage, timestamp: 'Agora', unread: 0 }
          : contact
      )
    );
    
    // Rolar para o final da conversa
    scrollToBottom();
  };
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleContactClick = (contact) => {
    setActiveContact(contact);
    
    // Atualizar URL
    navigate(`/messages/${contact.id}`);
    
    // Marcar mensagens como lidas
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      )
    );
  };
  
  const formatTimestamp = (timestamp) => {
    return timestamp;
  };
  
  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-header">
          <h2>Mensagens</h2>
        </div>
        
        {loading ? (
          <div className="loading-contacts">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="no-contacts">
            <p>Nenhum contato encontrado</p>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="contact-avatar">
                  <img src={contact.avatar} alt={contact.name} />
                  {contact.role === 'provider' && (
                    <span className="contact-badge provider">
                      <i className="fas fa-tools"></i>
                    </span>
                  )}
                  {contact.role === 'client' && (
                    <span className="contact-badge client">
                      <i className="fas fa-user"></i>
                    </span>
                  )}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-message">{contact.lastMessage}</div>
                </div>
                <div className="contact-meta">
                  <div className="contact-time">{contact.timestamp}</div>
                  {contact.unread > 0 && (
                    <div className="contact-unread">{contact.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="messages-content">
        {activeContact ? (
          <>
            <div className="messages-header">
              <div className="active-contact">
                <img src={activeContact.avatar} alt={activeContact.name} className="contact-avatar-sm" />
                <div className="active-contact-info">
                  <div className="active-contact-name">{activeContact.name}</div>
                  <div className="active-contact-status">Online</div>
                </div>
              </div>
              <div className="messages-actions">
                <button className="btn-icon">
                  <i className="fas fa-phone"></i>
                </button>
                <button className="btn-icon">
                  <i className="fas fa-video"></i>
                </button>
                <button className="btn-icon">
                  <i className="fas fa-info-circle"></i>
                </button>
              </div>
            </div>
            
            <div className="messages-body">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.senderId === currentUser.id ? 'outgoing' : 'incoming'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="messages-footer">
              <form onSubmit={handleSendMessage} className="message-form">
                <button type="button" className="btn-icon">
                  <i className="fas fa-paperclip"></i>
                </button>
                <input 
                  type="text" 
                  placeholder="Digite sua mensagem..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input"
                />
                <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <div className="no-conversation-content">
              <i className="fas fa-comments"></i>
              <h3>Selecione um contato para iniciar uma conversa</h3>
              <p>Escolha um contato da lista à esquerda para ver suas mensagens</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;