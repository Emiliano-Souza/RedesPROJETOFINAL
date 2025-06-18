import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServiceRequests from './pages/ServiceRequests';
import CreateRequest from './pages/CreateRequestSimple'; // Usando a versão simplificada
import RequestDetails from './pages/RequestDetails'; // Página de detalhes da solicitação
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Schedule from './pages/ScheduleSimple'; // Usando a versão simplificada
import CreateAppointment from './pages/CreateAppointment'; // Página de criação de agendamentos
import InitializeData from './pages/InitializeData'; // Página de inicialização de dados
import AIAssistant from './components/AIAssistant';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requests" element={
              <AuthGuard>
                <ServiceRequests />
              </AuthGuard>
            } />
            <Route path="/requests/:id" element={
              <AuthGuard>
                <RequestDetails />
              </AuthGuard>
            } />
            <Route path="/create-request" element={
              <AuthGuard>
                <CreateRequest />
              </AuthGuard>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/messages" element={
              <AuthGuard>
                <Messages />
              </AuthGuard>
            } />
            <Route path="/messages/:contactId" element={
              <AuthGuard>
                <Messages />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/profile/edit" element={
              <AuthGuard>
                <ProfileEdit />
              </AuthGuard>
            } />
            <Route path="/provider-profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/schedule" element={
              <AuthGuard>
                <Schedule />
              </AuthGuard>
            } />
            <Route path="/create-appointment" element={
              <AuthGuard>
                <CreateAppointment />
              </AuthGuard>
            } />
            <Route path="/initialize-data" element={<InitializeData />} />
            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AIAssistant />
        <Footer />
      </div>
    </Router>
  );
}

export default App;