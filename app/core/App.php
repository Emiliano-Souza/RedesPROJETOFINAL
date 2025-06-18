<?php

namespace App\Core;

class App {
    private $router;
    
    public function __construct() {
        $this->router = new Router();
    }
    
    public function getRouter() {
        return $this->router;
    }
    
    public function run() {
        $this->router->resolve();
    }
}