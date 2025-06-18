<?php

namespace App\Models;

use App\Core\Model;
use App\Models\Appointment;

class AppointmentModel extends Model {
    protected $table = 'appointments';
    
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY start_time");
        return $stmt->fetchAll(\PDO::FETCH_CLASS, Appointment::class);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetchObject(Appointment::class);
    }
    
    public function getByUserId($userId) {
        $stmt = $this->db->prepare("SELECT a.*, u.name as client_name, u.email as client_email, 
                                   sp.name as provider_name 
                                   FROM {$this->table} a
                                   JOIN users u ON a.user_id = u.id
                                   JOIN service_providers sp ON a.provider_id = sp.id
                                   WHERE a.user_id = :user_id
                                   ORDER BY a.start_time");
        $stmt->execute(['user_id' => $userId]);
        $appointments = $stmt->fetchAll(\PDO::FETCH_CLASS, Appointment::class);
        
        // Formatar os dados para incluir informações do cliente
        foreach ($appointments as $appointment) {
            $appointment->client = [
                'id' => $appointment->user_id,
                'name' => $appointment->client_name,
                'email' => $appointment->client_email
            ];
            $appointment->provider = [
                'id' => $appointment->provider_id,
                'name' => $appointment->provider_name
            ];
        }
        
        return $appointments;
    }
    
    public function getByProviderId($providerId) {
        $stmt = $this->db->prepare("SELECT a.*, u.name as client_name, u.email as client_email, 
                                   sp.name as provider_name 
                                   FROM {$this->table} a
                                   JOIN users u ON a.user_id = u.id
                                   JOIN service_providers sp ON a.provider_id = sp.id
                                   WHERE a.provider_id = :provider_id
                                   ORDER BY a.start_time");
        $stmt->execute(['provider_id' => $providerId]);
        $appointments = $stmt->fetchAll(\PDO::FETCH_CLASS, Appointment::class);
        
        // Formatar os dados para incluir informações do cliente
        foreach ($appointments as $appointment) {
            $appointment->client = [
                'id' => $appointment->user_id,
                'name' => $appointment->client_name,
                'email' => $appointment->client_email
            ];
            $appointment->provider = [
                'id' => $appointment->provider_id,
                'name' => $appointment->provider_name
            ];
        }
        
        return $appointments;
    }
    
    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} 
                                   (title, description, start_time, end_time, location, 
                                    user_id, provider_id, request_id, status) 
                                   VALUES 
                                   (:title, :description, :start_time, :end_time, :location, 
                                    :user_id, :provider_id, :request_id, :status)");
        
        $stmt->execute([
            'title' => $data['title'],
            'description' => $data['description'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'location' => $data['location'],
            'user_id' => $data['user_id'],
            'provider_id' => $data['provider_id'],
            'request_id' => $data['request_id'] ?? null,
            'status' => $data['status'] ?? 'pending'
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $fields = [];
        $params = ['id' => $id];
        
        foreach ($data as $key => $value) {
            if ($key !== 'id') {
                $fields[] = "{$key} = :{$key}";
                $params[$key] = $value;
            }
        }
        
        $fieldsStr = implode(', ', $fields);
        $stmt = $this->db->prepare("UPDATE {$this->table} SET {$fieldsStr} WHERE id = :id");
        
        return $stmt->execute($params);
    }
    
    public function updateStatus($id, $status) {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET status = :status WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'status' => $status
        ]);
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}