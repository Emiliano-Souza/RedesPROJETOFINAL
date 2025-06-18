<?php

namespace App\Core;

abstract class Controller {
    protected function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        echo json_encode($data);
        exit;
    }
    
    protected function error($message, $statusCode = 400) {
        return $this->json(['error' => $message], $statusCode);
    }
    
    protected function success($data = null, $message = 'Success') {
        return $this->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
    
    protected function getRequestBody() {
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }
    
    protected function validateRequired(array $data, array $fields) {
        $missing = [];
        
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            $this->error('Required fields missing: ' . implode(', ', $missing));
            return false;
        }
        
        return true;
    }
}