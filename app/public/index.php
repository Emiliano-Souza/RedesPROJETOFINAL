<?php
// Bootstrap the application

// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoloader
spl_autoload_register(function ($class) {
    // Convert namespace to file path
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../';
    
    // Does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    // Get the relative class name
    $relative_class = substr($class, $len);
    
    // Replace namespace separators with directory separators
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    // If the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

// Create app instance
$app = new App\Core\App();
$router = $app->getRouter();

// Define routes
$router->get('/api/stats', 'StatsController@getStats');

// Request routes
$router->get('/api/requests', 'RequestController@getAll');
$router->get('/api/requests/active', 'RequestController@getActive');
$router->get('/api/requests/{id}', 'RequestController@getById');
$router->post('/api/requests', 'RequestController@create');
$router->put('/api/requests', 'RequestController@updateStatus');

// Provider routes
$router->get('/api/providers', 'ProviderController@getAll');
$router->get('/api/providers/{id}', 'ProviderController@getById');
$router->get('/api/providers/{id}/requests', 'ProviderController@getRequests');
$router->post('/api/providers', 'ProviderController@create');
$router->post('/api/providers/accept', 'ProviderController@acceptRequest');

// User routes
$router->get('/api/users/{id}', 'UserController@getProfile');
$router->post('/api/register', 'UserController@register');
$router->post('/api/login', 'UserController@login');

// Appointment routes
$router->get('/api/appointments', 'AppointmentController@index');
$router->get('/api/appointments/{id}', 'AppointmentController@show');
$router->post('/api/appointments', 'AppointmentController@create');
$router->put('/api/appointments/{id}', 'AppointmentController@update');
$router->put('/api/appointments/{id}/status', 'AppointmentController@updateStatus');
$router->delete('/api/appointments/{id}', 'AppointmentController@delete');

// Run the application
$app->run();