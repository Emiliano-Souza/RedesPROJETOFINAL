<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\AppointmentModel;

class AppointmentController extends Controller {
    private $appointmentModel;
    
    public function __construct() {
        $this->appointmentModel = new AppointmentModel();
    }
    
    public function index() {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        $userId = $_SESSION['user_id'];
        $userRole = $_SESSION['user_role'];
        $providerId = $_SESSION['provider_id'] ?? null;
        
        // Obter agendamentos com base no papel do usuário
        if ($userRole === 'provider' && $providerId) {
            $appointments = $this->appointmentModel->getByProviderId($providerId);
        } else {
            $appointments = $this->appointmentModel->getByUserId($userId);
        }
        
        echo json_encode($appointments);
    }
    
    public function show($id) {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        $appointment = $this->appointmentModel->getById($id);
        
        if (!$appointment) {
            http_response_code(404);
            echo json_encode(['error' => 'Appointment not found']);
            return;
        }
        
        // Verificar se o usuário tem permissão para ver este agendamento
        $userId = $_SESSION['user_id'];
        $userRole = $_SESSION['user_role'];
        $providerId = $_SESSION['provider_id'] ?? null;
        
        if ($userRole !== 'admin' && 
            $appointment->user_id != $userId && 
            $appointment->provider_id != $providerId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        echo json_encode($appointment);
    }
    
    public function create() {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        // Obter dados do corpo da requisição
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar dados
        if (!isset($data['title']) || !isset($data['start_time']) || 
            !isset($data['end_time']) || !isset($data['location']) || 
            !isset($data['provider_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        // Definir o usuário atual como cliente
        $data['user_id'] = $_SESSION['user_id'];
        
        // Criar o agendamento
        $appointmentId = $this->appointmentModel->create($data);
        
        if ($appointmentId) {
            $appointment = $this->appointmentModel->getById($appointmentId);
            http_response_code(201);
            echo json_encode($appointment);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create appointment']);
        }
    }
    
    public function update($id) {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        // Obter o agendamento existente
        $appointment = $this->appointmentModel->getById($id);
        
        if (!$appointment) {
            http_response_code(404);
            echo json_encode(['error' => 'Appointment not found']);
            return;
        }
        
        // Verificar se o usuário tem permissão para atualizar este agendamento
        $userId = $_SESSION['user_id'];
        $userRole = $_SESSION['user_role'];
        $providerId = $_SESSION['provider_id'] ?? null;
        
        if ($userRole !== 'admin' && 
            $appointment->user_id != $userId && 
            $appointment->provider_id != $providerId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        // Obter dados do corpo da requisição
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Atualizar o agendamento
        $success = $this->appointmentModel->update($id, $data);
        
        if ($success) {
            $updatedAppointment = $this->appointmentModel->getById($id);
            echo json_encode($updatedAppointment);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update appointment']);
        }
    }
    
    public function updateStatus($id) {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        // Obter o agendamento existente
        $appointment = $this->appointmentModel->getById($id);
        
        if (!$appointment) {
            http_response_code(404);
            echo json_encode(['error' => 'Appointment not found']);
            return;
        }
        
        // Verificar se o usuário tem permissão para atualizar este agendamento
        $userId = $_SESSION['user_id'];
        $userRole = $_SESSION['user_role'];
        $providerId = $_SESSION['provider_id'] ?? null;
        
        if ($userRole !== 'admin' && 
            $appointment->user_id != $userId && 
            $appointment->provider_id != $providerId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        // Obter dados do corpo da requisição
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        // Atualizar o status do agendamento
        $success = $this->appointmentModel->updateStatus($id, $data['status']);
        
        if ($success) {
            $updatedAppointment = $this->appointmentModel->getById($id);
            echo json_encode($updatedAppointment);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update appointment status']);
        }
    }
    
    public function delete($id) {
        // Verificar se o usuário está autenticado
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }
        
        // Obter o agendamento existente
        $appointment = $this->appointmentModel->getById($id);
        
        if (!$appointment) {
            http_response_code(404);
            echo json_encode(['error' => 'Appointment not found']);
            return;
        }
        
        // Verificar se o usuário tem permissão para excluir este agendamento
        $userId = $_SESSION['user_id'];
        $userRole = $_SESSION['user_role'];
        
        if ($userRole !== 'admin' && $appointment->user_id != $userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
        
        // Excluir o agendamento
        $success = $this->appointmentModel->delete($id);
        
        if ($success) {
            http_response_code(204); // No Content
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete appointment']);
        }
    }
}