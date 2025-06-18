<?php

class User {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmail($email) {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->db->prepare('
            INSERT INTO users 
            (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        ');
        
        // In a real app, you would hash the password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $data['role']
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function authenticate($email, $password) {
        $user = $this->getByEmail($email);
        
        if ($user && password_verify($password, $user['password'])) {
            // Remove password from the returned data
            unset($user['password']);
            return $user;
        }
        
        return false;
    }
}