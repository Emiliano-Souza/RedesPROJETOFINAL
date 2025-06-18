<?php

namespace App\Models;

class Appointment {
    public $id;
    public $title;
    public $description;
    public $start_time;
    public $end_time;
    public $location;
    public $user_id;
    public $provider_id;
    public $request_id;
    public $status;
    public $created_at;
    public $updated_at;
    
    // Dados adicionais para exibição
    public $client;
    public $provider;
}