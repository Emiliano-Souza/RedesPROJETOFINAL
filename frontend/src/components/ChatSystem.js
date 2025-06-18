import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatSystem.css';

const ChatSystem = ({ userId, recipientId, recipientName, recipientAvatar }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Dados de exemplo para demonstração
  useEffect(() => {
    setIsLoading(true);
    // Simular chamada de API para obter histórico de chat
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender_id: recipientId,
          text: "Olá! Vi sua solicitação de serviço. Quando você gostaria que eu fosse dar uma olhada?",
          timestamp: "2023-06-10T10:30:00",
          attachments: []
        },
        {
          id: 2,
          sender_id: userId,
          text: "Oi! Obrigado por responder. Amanhã à tarde funcionaria para você?",
          timestamp: "2023-06-10T10:35:00",
          attachments: []
        },
        {
          id: 3,
          sender_id: recipientId,
          text: "Sim, estou disponível depois das 14h. Aqui está uma foto de um trabalho semelhante que fiz recentemente.",
          timestamp: "2023-06-10T10:40:00",
          attachments: [
            {
              id: 1,
              type: "image",
              url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
            }
          ]
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userId, recipientId]);

  // Rolar para o final quando as mensagens mudarem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && attachments.length === 0) return;

    const message = {
      id: messages.length + 1,
      sender_id: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      attachments: attachments
    };

    // Em um aplicativo real, você enviaria isso para sua API
    // api.post('/messages', message)
    //   .then(response => {
    //     setMessages([...messages, response.data]);
    //     setNewMessage('');
    //     setAttachments([]);
    //   })
    //   .catch(error => console.error('Erro ao enviar mensagem:', error));

    // Para fins de demonstração, vamos apenas atualizar o estado diretamente
    setMessages([...messages, message]);
    setNewMessage('');
    setAttachments([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Visualizar arquivos
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(newMessage + emoji);
  };

  return (
    <div className="chat-system">
      <div className="chat-header">
        <img 
          src={recipientAvatar || "https://via.placeholder.com/40"} 
          alt={recipientName} 
          className="avatar"
        />
        <div className="chat-header-info">
          <h3>{recipientName}</h3>
          <span className="status online">Online</span>
        </div>
      </div>
      
      <div className="chat-messages">
        {isLoading ? (
          <div className="loading-messages">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p>Carregando conversa...</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender_id === userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="message-attachments">
                    {message.attachments.map(attachment => (
                      <div key={attachment.id} className="attachment">
                        {attachment.type === 'image' ? (
                          <img 
                            src={attachment.url} 
                            alt="Anexo" 
                            onClick={() => window.open(attachment.url, '_blank')}
                          />
                        ) : (
                          <div className="file-attachment">
                            <i className="fas fa-file"></i>
                            <span>{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-preview">
              {attachment.type === 'image' ? (
                <img src={attachment.url} alt="Pré-visualização do anexo" />
              ) : (
                <div className="file-preview">
                  <i className="fas fa-file"></i>
                  <span>{attachment.name}</span>
                </div>
              )}
              <button 
                className="remove-attachment" 
                onClick={() => removeAttachment(attachment.id)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <div className="emoji-picker">
          <button type="button" className="emoji-btn">
            <i className="far fa-smile"></i>
          </button>
          <div className="emoji-dropdown">
            {['😊', '👍', '🙏', '❤️', '👌', '👏', '🔧', '🛠️', '🏠'].map(emoji => (
              <span 
                key={emoji} 
                className="emoji" 
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        
        <button 
          type="button" 
          className="attachment-btn"
          onClick={() => fileInputRef.current.click()}
        >
          <i className="fas fa-paperclip"></i>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
        
        <button type="submit" className="send-btn">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatSystem;