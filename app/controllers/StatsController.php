<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\RequestModel;
use App\Models\ProviderModel;
use App\Models\UserModel;

class StatsController extends Controller {
    private $requestModel;
    private $providerModel;
    private $userModel;
    
    public function __construct() {
        $this->requestModel = new RequestModel();
        $this->providerModel = new ProviderModel();
        $this->userModel = new UserModel();
    }
    
    /**
     * Get platform statistics
     */
    public function getStats() {
        try {
            // Count active requests
            $stmt = $this->requestModel->db->query("SELECT COUNT(*) as count FROM service_requests WHERE status = 'pending'");
            $requestCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];
            
            // Count providers
            $stmt = $this->providerModel->db->query("SELECT COUNT(*) as count FROM service_providers");
            $providerCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];
            
            // Count users
            $stmt = $this->userModel->db->query("SELECT COUNT(*) as count FROM users");
            $userCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];
            
            // Count completed requests
            $stmt = $this->requestModel->db->query("SELECT COUNT(*) as count FROM service_requests WHERE status = 'completed'");
            $completedCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];
            
            return $this->success([
                'requestCount' => (int)$requestCount,
                'providerCount' => (int)$providerCount,
                'userCount' => (int)$userCount,
                'completedCount' => (int)$completedCount
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch statistics: ' . $e->getMessage(), 500);
        }
    }
}