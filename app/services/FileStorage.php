<?php

namespace App\Services;

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

class FileStorage {
    private $config;
    private $s3Client;
    
    public function __construct() {
        $this->config = require __DIR__ . '/../config/storage.php';
        
        // Initialize S3 client for MinIO
        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region'  => $this->config['minio']['region'],
            'endpoint' => $this->config['minio']['endpoint'],
            'use_path_style_endpoint' => $this->config['minio']['use_path_style_endpoint'],
            'credentials' => [
                'key'    => $this->config['minio']['key'],
                'secret' => $this->config['minio']['secret'],
            ],
        ]);
    }
    
    /**
     * Save a file to the appropriate storage
     */
    public function saveFile($file, $requestId) {
        try {
            // Try to save to MinIO first
            $result = $this->saveToMinio($file, $requestId);
            if ($result) {
                return $result;
            }
        } catch (\Exception $e) {
            // Log the error
            error_log("MinIO upload failed: " . $e->getMessage());
        }
        
        // Fallback to local storage
        return $this->saveLocal($file, $requestId);
    }
    
    /**
     * Save a file to the local storage
     */
    private function saveLocal($file, $requestId) {
        $uploadPath = $this->config['local']['uploads_path'] . '/' . $requestId;
        
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        
        // Generate a unique filename to prevent overwriting
        $fileName = uniqid() . '_' . basename($file['name']);
        $destination = $uploadPath . '/' . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return [
                'path' => $destination,
                'url' => $this->getFileUrl($destination),
                'storage' => 'local'
            ];
        }
        
        return false;
    }
    
    /**
     * Save a file to MinIO storage
     */
    private function saveToMinio($file, $requestId) {
        // Generate a unique key for the file
        $fileName = uniqid() . '_' . basename($file['name']);
        $key = $requestId . '/' . $fileName;
        
        try {
            // Upload the file to MinIO
            $result = $this->s3Client->putObject([
                'Bucket' => $this->config['minio']['bucket'],
                'Key'    => $key,
                'SourceFile' => $file['tmp_name'],
                'ContentType' => $file['type'],
            ]);
            
            return [
                'path' => $key,
                'url' => $this->getMinioUrl($key),
                'storage' => 'minio'
            ];
        } catch (S3Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Get a file URL from storage
     */
    public function getFileUrl($path) {
        // For local files, convert to URL
        if (strpos($path, $this->config['local']['uploads_path']) === 0) {
            return str_replace($this->config['local']['uploads_path'], '/uploads', $path);
        }
        
        // For MinIO files, generate a URL
        return $this->getMinioUrl($path);
    }
    
    /**
     * Generate a pre-signed URL for MinIO objects
     */
    private function getMinioUrl($key) {
        try {
            $command = $this->s3Client->getCommand('GetObject', [
                'Bucket' => $this->config['minio']['bucket'],
                'Key'    => $key
            ]);
            
            // Create a pre-signed URL that will expire in 1 hour
            $presignedRequest = $this->s3Client->createPresignedRequest($command, '+1 hour');
            return (string) $presignedRequest->getUri();
        } catch (S3Exception $e) {
            error_log("Failed to generate pre-signed URL: " . $e->getMessage());
            return $this->config['minio']['endpoint'] . '/' . $this->config['minio']['bucket'] . '/' . $key;
        }
    }
    
    /**
     * Delete a file from storage
     */
    public function deleteFile($path, $storage = 'local') {
        if ($storage === 'local') {
            if (file_exists($path)) {
                return unlink($path);
            }
        } else if ($storage === 'minio') {
            try {
                $result = $this->s3Client->deleteObject([
                    'Bucket' => $this->config['minio']['bucket'],
                    'Key'    => $path,
                ]);
                return true;
            } catch (S3Exception $e) {
                error_log("Failed to delete file from MinIO: " . $e->getMessage());
                return false;
            }
        }
        return false;
    }
}