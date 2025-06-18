<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class ProviderModel {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Create a new service provider
     */
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO service_providers (user_id, name, services, description)
            VALUES (:user_id, :name, :services, :description)
        ");
        
        $stmt->execute([
            ':user_id' => $data['user_id'],
            ':name' => $data['name'],
            ':services' => is_array($data['services']) ? json_encode($data['services']) : $data['services'],
            ':description' => $data['description'] ?? ''
        ]);
        
        return $this->db->lastInsertId();
    }
    
    /**
     * Get all service providers
     */
    public function getAll($filters = []) {
        $sql = "
            SELECT sp.*, u.email, u.created_at as user_created_at
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
        ";
        
        $conditions = [];
        $params = [];
        
        // Apply filters
        if (!empty($filters['services'])) {
            $services = is_array($filters['services']) ? $filters['services'] : [$filters['services']];
            $serviceConditions = [];
            
            foreach ($services as $index => $service) {
                $paramName = ":service{$index}";
                $serviceConditions[] = "sp.services LIKE {$paramName}";
                $params[$paramName] = "%{$service}%";
            }
            
            if (!empty($serviceConditions)) {
                $conditions[] = "(" . implode(" OR ", $serviceConditions) . ")";
            }
        }
        
        if (!empty($filters['rating'])) {
            $conditions[] = "sp.rating >= :rating";
            $params[':rating'] = $filters['rating'];
        }
        
        // Add WHERE clause if conditions exist
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        
        // Add ordering
        $sql .= " ORDER BY sp.rating DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Process services from JSON to array
        foreach ($providers as &$provider) {
            if (isset($provider['services'])) {
                $provider['services'] = json_decode($provider['services'], true);
            }
            
            // Get provider stats
            $provider['stats'] = $this->getProviderStats($provider['id']);
        }
        
        return $providers;
    }
    
    /**
     * Get a single service provider by ID
     */
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT sp.*, u.email, u.created_at as user_created_at
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
            WHERE sp.id = :id
        ");
        
        $stmt->execute([':id' => $id]);
        $provider = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($provider) {
            // Convert services from JSON to array
            if (isset($provider['services'])) {
                $provider['services'] = json_decode($provider['services'], true);
            }
            
            // Get provider stats
            $provider['stats'] = $this->getProviderStats($id);
            
            // Get provider reviews
            $provider['reviews'] = $this->getProviderReviews($id);
        }
        
        return $provider;
    }
    
    /**
     * Get a service provider by user ID
     */
    public function getByUserId($userId) {
        $stmt = $this->db->prepare("
            SELECT sp.*, u.email, u.created_at as user_created_at
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
            WHERE sp.user_id = :user_id
        ");
        
        $stmt->execute([':user_id' => $userId]);
        $provider = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($provider) {
            // Convert services from JSON to array
            if (isset($provider['services'])) {
                $provider['services'] = json_decode($provider['services'], true);
            }
            
            // Get provider stats
            $provider['stats'] = $this->getProviderStats($provider['id']);
            
            // Get provider reviews
            $provider['reviews'] = $this->getProviderReviews($provider['id']);
        }
        
        return $provider;
    }
    
    /**
     * Update a service provider
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        
        // Process services if it's an array
        if (isset($data['services']) && is_array($data['services'])) {
            $data['services'] = json_encode($data['services']);
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
        
        $sql = "UPDATE service_providers SET " . implode(", ", $fields) . " WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
    
    /**
     * Get provider statistics
     */
    private function getProviderStats($providerId) {
        // Count total requests
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total_requests,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_requests,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
                SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as active_requests
            FROM service_requests
            WHERE provider_id = :provider_id
        ");
        
        $stmt->execute([':provider_id' => $providerId]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get average rating
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
            FROM reviews
            WHERE provider_id = :provider_id
        ");
        
        $stmt->execute([':provider_id' => $providerId]);
        $ratingStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            'total_requests' => (int)$stats['total_requests'],
            'completed_requests' => (int)$stats['completed_requests'],
            'pending_requests' => (int)$stats['pending_requests'],
            'active_requests' => (int)$stats['active_requests'],
            'avg_rating' => $ratingStats['avg_rating'] ? round((float)$ratingStats['avg_rating'], 1) : 0,
            'review_count' => (int)$ratingStats['review_count']
        ];
    }
    
    /**
     * Get provider reviews
     */
    private function getProviderReviews($providerId) {
        $stmt = $this->db->prepare("
            SELECT r.*, u.name as client_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.provider_id = :provider_id
            ORDER BY r.created_at DESC
        ");
        
        $stmt->execute([':provider_id' => $providerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Update provider rating based on reviews
     */
    public function updateRating($providerId) {
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as avg_rating
            FROM reviews
            WHERE provider_id = :provider_id
        ");
        
        $stmt->execute([':provider_id' => $providerId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && $result['avg_rating']) {
            $stmt = $this->db->prepare("
                UPDATE service_providers
                SET rating = :rating
                WHERE id = :id
            ");
            
            return $stmt->execute([
                ':id' => $providerId,
                ':rating' => round((float)$result['avg_rating'], 2)
            ]);
        }
        
        return false;
    }
}