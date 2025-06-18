<?php

class FileStorage {
    private $config;
    
    public function __construct() {
        $this->config = require __DIR__ . '/../config/storage.php';
    }
    
    /**
     * Save a file to the local storage
     */
    public function saveLocal($file, $requestId) {
        $uploadPath = $this->config['local']['uploads_path'] . '/' . $requestId;
        
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        
        $fileName = basename($file['name']);
        $destination = $uploadPath . '/' . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return $destination;
        }
        
        return false;
    }
    
    /**
     * Save a file to MinIO storage
     * Note: This is a placeholder for the actual implementation
     */
    public function saveToMinio($file, $requestId) {
        // In a real implementation, you would use AWS SDK to upload to MinIO
        // For now, we'll just return a mock URL
        return 'http://file-storage:9000/service-requests/' . $requestId . '/' . basename($file['name']);
    }
    
    /**
     * Get a file URL from MinIO
     */
    public function getFileUrl($path) {
        // In a real implementation, you would generate a pre-signed URL
        return 'http://file-storage:9000/' . $path;
    }
}