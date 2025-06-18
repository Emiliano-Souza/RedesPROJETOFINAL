import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ZAP Serv</h3>
          <p>Conectando profissionais e clientes desde 2023</p>
        </div>
        
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/requests">Serviços Disponíveis</Link></li>
            <li><Link to="/create-request">Solicitar Serviço</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Conta</h3>
          <ul>
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/register">Cadastrar</Link></li>
            <li><Link to="/dashboard">Painel</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ZAP Serv. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;