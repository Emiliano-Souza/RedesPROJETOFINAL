<?php

namespace App\Core;

class Router {
    private $routes = [];
    
    public function get($path, $callback) {
        $this->addRoute('GET', $path, $callback);
    }
    
    public function post($path, $callback) {
        $this->addRoute('POST', $path, $callback);
    }
    
    public function put($path, $callback) {
        $this->addRoute('PUT', $path, $callback);
    }
    
    public function delete($path, $callback) {
        $this->addRoute('DELETE', $path, $callback);
    }
    
    private function addRoute($method, $path, $callback) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'callback' => $callback
        ];
    }
    
    public function resolve() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Handle preflight requests
        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            exit(0);
        }
        
        // Set CORS headers for all responses
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json');
        
        foreach ($this->routes as $route) {
            $pattern = $this->getPatternFromPath($route['path']);
            
            if ($route['method'] === $method && preg_match($pattern, $path, $matches)) {
                array_shift($matches); // Remove the full match
                
                // Parse callback
                if (is_string($route['callback'])) {
                    list($controller, $method) = explode('@', $route['callback']);
                    $controllerClass = "App\\Controllers\\$controller";
                    $controller = new $controllerClass();
                    return call_user_func_array([$controller, $method], $matches);
                } else {
                    return call_user_func_array($route['callback'], $matches);
                }
            }
        }
        
        // No route found
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
    }
    
    private function getPatternFromPath($path) {
        // Convert route parameters to regex patterns
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $path);
        return '#^' . $pattern . '$#';
    }
}