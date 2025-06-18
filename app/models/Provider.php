<?php

class Provider {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAll() {
        $stmt = $this->db->query('SELECT id, name, services, rating FROM service_providers');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare('SELECT * FROM service_providers WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByUserId($userId) {
        $stmt = $this->db->prepare('SELECT * FROM service_providers WHERE user_id = ?');
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->db->prepare('
            INSERT INTO service_providers 
            (user_id, name, services, description) 
            VALUES (?, ?, ?, ?)
        ');
        
        $stmt->execute([
            $data['user_id'],
            $data['name'],
            $data['services'],
            $data['description']
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function updateRating($id) {
        // Calculate average rating from reviews
        $stmt = $this->db->prepare('
            SELECT AVG(rating) as avg_rating 
            FROM reviews 
            WHERE provider_id = ?
        ');
        
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && isset($result['avg_rating'])) {
            $stmt = $this->db->prepare('UPDATE service_providers SET rating = ? WHERE id = ?');
            return $stmt->execute([$result['avg_rating'], $id]);
        }
        
        return false;
    }
}