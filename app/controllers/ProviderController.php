<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\ProviderModel;
use App\Models\RequestModel;

class ProviderController extends Controller {
    private $providerModel;
    private $requestModel;
    
    public function __construct() {
        parent::__construct();
        $this->providerModel = new ProviderModel();
        $this->requestModel = new RequestModel();
    }
    
    /**
     * Get all service providers
     */
    public function index() {
        try {
            $filters = [];
            
            // Apply filters from query parameters
            if (isset($_GET['services'])) {
                $filters['services'] = $_GET['services'];
            }
            
            if (isset($_GET['rating'])) {
                $filters['rating'] = $_GET['rating'];
            }
            
            $providers = $this->providerModel->getAll($filters);
            
            return $this->json([
                'success' => true,
                'data' => $providers
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch providers: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get a single service provider
     */
    public function show($id) {
        try {
            $provider = $this->providerModel->getById($id);
            
            if (!$provider) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider not found'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'data' => $provider
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch provider: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get a provider by user ID
     */
    public function getByUserId($userId) {
        try {
            $provider = $this->providerModel->getByUserId($userId);
            
            if (!$provider) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider not found'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'data' => $provider
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch provider: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new service provider
     */
    public function create() {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                return $this->json([
                    'success' => false,
                    'message' => 'Invalid request data'
                ], 400);
            }
            
            // Validate required fields
            $requiredFields = ['user_id', 'name', 'services'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->json([
                        'success' => false,
                        'message' => "Missing required field: $field"
                    ], 400);
                }
            }
            
            // Create the provider
            $providerId = $this->providerModel->create($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Provider created successfully',
                'data' => [
                    'id' => $providerId
                ]
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to create provider: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update a service provider
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
            
            // Update the provider
            $success = $this->providerModel->update($id, $data);
            
            if (!$success) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider not found or no changes made'
                ], 404);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Provider updated successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to update provider: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get provider requests
     */
    public function getRequests($id) {
        try {
            // Check if provider exists
            $provider = $this->providerModel->getById($id);
            
            if (!$provider) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider not found'
                ], 404);
            }
            
            // Get requests for this provider
            $requests = $this->requestModel->getAll(['provider_id' => $id]);
            
            return $this->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch provider requests: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get provider dashboard data
     */
    public function getDashboard($id) {
        try {
            // Check if provider exists
            $provider = $this->providerModel->getById($id);
            
            if (!$provider) {
                return $this->json([
                    'success' => false,
                    'message' => 'Provider not found'
                ], 404);
            }
            
            // Get active requests
            $activeRequests = $this->requestModel->getAll([
                'provider_id' => $id,
                'status' => 'accepted'
            ]);
            
            // Get completed requests
            $completedRequests = $this->requestModel->getAll([
                'provider_id' => $id,
                'status' => 'completed'
            ]);
            
            // Get available requests (pending)
            $availableRequests = $this->requestModel->getAll([
                'status' => 'pending'
            ]);
            
            return $this->json([
                'success' => true,
                'data' => [
                    'provider' => $provider,
                    'stats' => $provider['stats'],
                    'active_requests' => $activeRequests,
                    'completed_requests' => $completedRequests,
                    'available_requests' => $availableRequests
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }
}