<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class UserModel {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Create a new user
     */
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO users (name, email, password, role)
            VALUES (:name, :email, :password, :role)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':password' => password_hash($data['password'], PASSWORD_DEFAULT),
            ':role' => $data['role'] ?? 'client'
        ]);
        
        return $this->db->lastInsertId();
    }
    
    /**
     * Get all users
     */
    public function getAll($filters = []) {
        $sql = "SELECT * FROM users";
        
        $conditions = [];
        $params = [];
        
        // Apply filters
        if (!empty($filters['role'])) {
            $conditions[] = "role = :role";
            $params[':role'] = $filters['role'];
        }
        
        // Add WHERE clause if conditions exist
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        
        // Add ordering
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get a single user by ID
     */
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get a user by email
     */
    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Update a user
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        
        // Handle password separately
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        // Build dynamic update fields
        foreach ($data as $key => $value) {
            if ($key !== 'id') {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
    
    /**
     * Delete a user
     */
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
    
    /**
     * Authenticate a user
     */
    public function authenticate($email, $password) {
        $user = $this->getByEmail($email);
        
        if ($user && password_verify($password, $user['password'])) {
            // Remove password from the returned data
            unset($user['password']);
            return $user;
        }
        
        return false;
    }
    
    /**
     * Register a new user and create provider profile if needed
     */
    public function register($userData, $providerData = null) {
        try {
            $this->db->beginTransaction();
            
            // Create user
            $userId = $this->create($userData);
            
            // If user is a provider, create provider profile
            if ($userData['role'] === 'provider' && $providerData) {
                $providerModel = new ProviderModel();
                $providerData['user_id'] = $userId;
                $providerModel->create($providerData);
            }
            
            $this->db->commit();
            return $userId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}