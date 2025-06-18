<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\UserModel;
use App\Models\ProviderModel;

class UserController extends Controller {
    private $userModel;
    private $providerModel;
    
    public function __construct() {
        parent::__construct();
        $this->userModel = new UserModel();
        $this->providerModel = new ProviderModel();
    }
    
    /**
     * User login
     */
    public function login() {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'Email and password are required'
                ], 400);
            }
            
            // Authenticate user
            $user = $this->userModel->authenticate($data['email'], $data['password']);
            
            if (!$user) {
                return $this->json([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ], 401);
            }
            
            // If user is a provider, get provider data
            if ($user['role'] === 'provider') {
                $provider = $this->providerModel->getByUserId($user['id']);
                if ($provider) {
                    $user['provider'] = $provider;
                }
            }
            
            // Generate a simple token (in a real app, use JWT or similar)
            $token = bin2hex(random_bytes(32));
            
            // In a real app, store this token in a database or Redis
            // For now, we'll just return it
            
            return $this->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * User registration
     */
    public function register() {
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
            $requiredFields = ['name', 'email', 'password', 'role'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->json([
                        'success' => false,
                        'message' => "Missing required field: $field"
                    ], 400);
                }
            }
            
            // Check if email already exists
            $existingUser = $this->userModel->getByEmail($data['email']);
            if ($existingUser) {
                return $this->json([
                    'success' => false,
                    'message' => 'Email already in use'
                ], 409);
            }
            
            // Prepare provider data if role is provider
            $providerData = null;
            if ($data['role'] === 'provider' && isset($data['provider'])) {
                $providerData = $data['provider'];
                unset($data['provider']);
            }
            
            // Register user
            $userId = $this->userModel->register($data, $providerData);
            
            return $this->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'id' => $userId
                ]
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get user profile
     */
    public function profile($id) {
        try {
            $user = $this->userModel->getById($id);
            
            if (!$user) {
                return $this->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            // Remove password from response
            unset($user['password']);
            
            // If user is a provider, get provider data
            if ($user['role'] === 'provider') {
                $provider = $this->providerModel->getByUserId($user['id']);
                if ($provider) {
                    $user['provider'] = $provider;
                }
            }
            
            return $this->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to fetch user profile: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update user profile
     */
    public function updateProfile($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                return $this->json([
                    'success' => false,
                    'message' => 'Invalid request data'
                ], 400);
            }
            
            // Check if user exists
            $user = $this->userModel->getById($id);
            if (!$user) {
                return $this->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            // If updating email, check if it's already in use
            if (isset($data['email']) && $data['email'] !== $user['email']) {
                $existingUser = $this->userModel->getByEmail($data['email']);
                if ($existingUser) {
                    return $this->json([
                        'success' => false,
                        'message' => 'Email already in use'
                    ], 409);
                }
            }
            
            // Extract provider data if present
            $providerData = null;
            if (isset($data['provider'])) {
                $providerData = $data['provider'];
                unset($data['provider']);
            }
            
            // Update user
            $this->userModel->update($id, $data);
            
            // Update provider data if user is a provider
            if ($user['role'] === 'provider' && $providerData) {
                $provider = $this->providerModel->getByUserId($id);
                if ($provider) {
                    $this->providerModel->update($provider['id'], $providerData);
                }
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Change user password
     */
    public function changePassword($id) {
        try {
            // Get JSON data from request body
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data['current_password']) || !isset($data['new_password'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'Current password and new password are required'
                ], 400);
            }
            
            // Check if user exists
            $user = $this->userModel->getById($id);
            if (!$user) {
                return $this->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            // Verify current password
            if (!password_verify($data['current_password'], $user['password'])) {
                return $this->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 401);
            }
            
            // Update password
            $this->userModel->update($id, [
                'password' => $data['new_password']
            ]);
            
            return $this->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Failed to change password: ' . $e->getMessage()
            ], 500);
        }
    }
}