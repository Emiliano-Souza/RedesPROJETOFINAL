import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles.css';
import './styles/navbar.css';
import './styles/Dashboard.css';
import './styles/Messages.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);