<?php

class Request {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAll() {
        $stmt = $this->db->query('SELECT * FROM service_requests ORDER BY created_at DESC');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare('SELECT * FROM service_requests WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->db->prepare('
            INSERT INTO service_requests 
            (title, description, location, user_id, status, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ');
        
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['location'],
            $data['user_id'],
            'pending'
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function updateStatus($id, $status, $providerId = null) {
        $sql = 'UPDATE service_requests SET status = ?';
        $params = [$status];
        
        if ($providerId !== null) {
            $sql .= ', provider_id = ?';
            $params[] = $providerId;
        }
        
        $sql .= ' WHERE id = ?';
        $params[] = $id;
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
}