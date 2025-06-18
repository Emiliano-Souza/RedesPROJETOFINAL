<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\RequestModel;

class RequestController extends Controller {
    private $requestModel;
    
    public function __construct() {
        parent::__construct();
        $this->requestModel = new RequestModel();
    }
    
    /**
     * Get all service requests
     */
    public function index() {
        try {
            $filters = [];
            
            // Apply filters from query parameters
            if (isset($_GET['status'])) {
                $filters['status'] = $_GET['status'];
            }
            
            if (isset($_GET['user_id'])) {
                $filters['user_id'] = $_GET['user_id'];
            }
            
            if (isset($_GET['provider_id'])) {
                $filters['provider_id'] = $_GET['provider_id'];
            }
            
            $requests = $this->requestModel->getAll($filters);
            
            return $this->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch requests: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get a single service request
     */
    public function show($id) {
        try {
            $request = $this->requestModel->getById($id);
            
            if (!$request) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'data' => $request
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new service request
     */
    public function create() {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                // Fallback to POST data if JSON is not available
                $data = $_POST;
            }
            
            // Validate request data
            $requiredFields = ['title', 'description', 'location', 'user_id'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->json([
                        'success' => false,
                        'message' => "Missing required field: $field"
                    ], 400);
                }
            }
            
            // Handle file uploads
            $files = [];
            if (isset($_FILES['photos'])) {
                // Multiple files
                if (is_array($_FILES['photos']['name'])) {
                    $fileCount = count($_FILES['photos']['name']);
                    
                    for ($i = 0; $i < $fileCount; $i++) {
                        if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                            $files[] = [
                                'name' => $_FILES['photos']['name'][$i],
                                'type' => $_FILES['photos']['type'][$i],
                                'tmp_name' => $_FILES['photos']['tmp_name'][$i],
                                'error' => $_FILES['photos']['error'][$i],
                                'size' => $_FILES['photos']['size'][$i]
                            ];
                        }
                    }
                } 
                // Single file
                else if ($_FILES['photos']['error'] === UPLOAD_ERR_OK) {
                    $files[] = $_FILES['photos'];
                }
            }
            
            // Create the request
            $requestId = $this->requestModel->create($data, $files);
            
            return $this->json([
                'success' => true,
                'message' => 'Request created successfully',
                'data' => [
                    'id' => $requestId
                ]
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to create request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update a service request
     */
    public function update($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                return $this->json([
                    'success' => false,
                    'message' => 'Invalid request data'
                ], 400);
            }
            
            // Update the request
            $success = $this->requestModel->update($id, $data);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found or no changes made'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Request updated successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to update request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Accept a service request
     */
    public function accept($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['provider_id'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider ID is required'
                ], 400);
            }
            
            // Accept the request
            $success = $this->requestModel->acceptRequest($id, $data['provider_id']);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found or already accepted'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Request accepted successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to accept request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Complete a service request
     */
    public function complete($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['provider_id'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider ID is required'
                ], 400);
            }
            
            // Complete the request
            $success = $this->requestModel->completeRequest($id, $data['provider_id']);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found or not in accepted status'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Request completed successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to complete request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cancel a service request
     */
    public function cancel($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['user_id'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'User ID is required'
                ], 400);
            }
            
            // Cancel the request
            $success = $this->requestModel->cancelRequest($id, $data['user_id']);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found or cannot be cancelled'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Request cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to cancel request: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete a service request
     */
    public function delete($id) {
        try {
            $success = $this->requestModel->delete($id);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Request deleted successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to delete request: ' . $e->getMessage()
            ], 500);
        }
    }
}