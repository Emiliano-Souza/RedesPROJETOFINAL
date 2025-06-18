<?php

namespace App\Models;

use App\Core\Database;
use App\Services\FileStorage;
use PDO;

class RequestModel {
    private $db;
    private $fileStorage;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->fileStorage = new FileStorage();
    }
    
    /**
     * Create a new service request
     */
    public function create($data, $files = []) {
        try {
            $this->db->beginTransaction();
            
            // Insert request data
            $stmt = $this->db->prepare("
                INSERT INTO service_requests (title, description, location, user_id)
                VALUES (:title, :description, :location, :user_id)
            ");
            
            $stmt->execute([
                ':title' => $data['title'],
                ':description' => $data['description'],
                ':location' => $data['location'],
                ':user_id' => $data['user_id']
            ]);
            
            $requestId = $this->db->lastInsertId();
            
            // Handle file uploads if any
            if (!empty($files)) {
                $this->saveRequestPhotos($requestId, $files);
            }
            
            $this->db->commit();
            return $requestId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Save request photos
     */
    private function saveRequestPhotos($requestId, $files) {
        // Handle multiple files
        foreach ($files as $file) {
            // Save file to storage
            $result = $this->fileStorage->saveFile($file, $requestId);
            
            if ($result) {
                // Save file reference in database
                $stmt = $this->db->prepare("
                    INSERT INTO request_photos (request_id, file_path)
                    VALUES (:request_id, :file_path)
                ");
                
                $stmt->execute([
                    ':request_id' => $requestId,
                    ':file_path' => json_encode($result) // Store the full result as JSON
                ]);
            }
        }
    }
    
    /**
     * Get all service requests
     */
    public function getAll($filters = []) {
        $sql = "
            SELECT r.*, u.name as client_name, u.email as client_email,
                   sp.name as provider_name, sp.rating as provider_rating
            FROM service_requests r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN service_providers sp ON r.provider_id = sp.id
        ";
        
        $conditions = [];
        $params = [];
        
        // Apply filters
        if (!empty($filters['status'])) {
            $conditions[] = "r.status = :status";
            $params[':status'] = $filters['status'];
        }
        
        if (!empty($filters['user_id'])) {
            $conditions[] = "r.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        
        if (!empty($filters['provider_id'])) {
            $conditions[] = "r.provider_id = :provider_id";
            $params[':provider_id'] = $filters['provider_id'];
        }
        
        // Add WHERE clause if conditions exist
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        
        // Add ordering
        $sql .= " ORDER BY r.created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get photos for each request
        foreach ($requests as &$request) {
            $request['photos'] = $this->getRequestPhotos($request['id']);
        }
        
        return $requests;
    }
    
    /**
     * Get a single service request by ID
     */
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT r.*, u.name as client_name, u.email as client_email,
                   sp.name as provider_name, sp.rating as provider_rating
            FROM service_requests r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN service_providers sp ON r.provider_id = sp.id
            WHERE r.id = :id
        ");
        
        $stmt->execute([':id' => $id]);
        $request = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($request) {
            // Get photos for the request
            $request['photos'] = $this->getRequestPhotos($id);
        }
        
        return $request;
    }
    
    /**
     * Get photos for a request
     */
    private function getRequestPhotos($requestId) {
        $stmt = $this->db->prepare("
            SELECT * FROM request_photos
            WHERE request_id = :request_id
        ");
        
        $stmt->execute([':request_id' => $requestId]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Process photos to get URLs
        $processedPhotos = [];
        foreach ($photos as $photo) {
            $fileData = json_decode($photo['file_path'], true);
            
            if (is_array($fileData) && isset($fileData['url'])) {
                $processedPhotos[] = [
                    'id' => $photo['id'],
                    'url' => $fileData['url'],
                    'path' => $fileData['path'],
                    'storage' => $fileData['storage']
                ];
            } else {
                // Fallback for old format
                $processedPhotos[] = [
                    'id' => $photo['id'],
                    'url' => $this->fileStorage->getFileUrl($photo['file_path']),
                    'path' => $photo['file_path'],
                    'storage' => 'local'
                ];
            }
        }
        
        return $processedPhotos;
    }
    
    /**
     * Update a service request
     */
    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        
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
        
        $sql = "UPDATE service_requests SET " . implode(", ", $fields) . " WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
    
    /**
     * Accept a service request by a provider
     */
    public function acceptRequest($requestId, $providerId) {
        $stmt = $this->db->prepare("
            UPDATE service_requests
            SET provider_id = :provider_id, status = 'accepted'
            WHERE id = :id AND status = 'pending'
        ");
        
        return $stmt->execute([
            ':id' => $requestId,
            ':provider_id' => $providerId
        ]);
    }
    
    /**
     * Complete a service request
     */
    public function completeRequest($requestId, $providerId) {
        $stmt = $this->db->prepare("
            UPDATE service_requests
            SET status = 'completed'
            WHERE id = :id AND provider_id = :provider_id AND status = 'accepted'
        ");
        
        return $stmt->execute([
            ':id' => $requestId,
            ':provider_id' => $providerId
        ]);
    }
    
    /**
     * Cancel a service request
     */
    public function cancelRequest($requestId, $userId) {
        $stmt = $this->db->prepare("
            UPDATE service_requests
            SET status = 'cancelled'
            WHERE id = :id AND (user_id = :user_id OR provider_id = :user_id) AND status IN ('pending', 'accepted')
        ");
        
        return $stmt->execute([
            ':id' => $requestId,
            ':user_id' => $userId
        ]);
    }
    
    /**
     * Delete a service request and its photos
     */
    public function delete($id) {
        try {
            $this->db->beginTransaction();
            
            // Get photos first to delete files
            $photos = $this->getRequestPhotos($id);
            
            // Delete photos from storage
            foreach ($photos as $photo) {
                $this->fileStorage->deleteFile($photo['path'], $photo['storage']);
            }
            
            // Delete photo records from database
            $stmt = $this->db->prepare("DELETE FROM request_photos WHERE request_id = :id");
            $stmt->execute([':id' => $id]);
            
            // Delete the request
            $stmt = $this->db->prepare("DELETE FROM service_requests WHERE id = :id");
            $result = $stmt->execute([':id' => $id]);
            
            $this->db->commit();
            return $result;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}