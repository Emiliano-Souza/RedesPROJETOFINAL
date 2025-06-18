<?php

return [
    'host' => 'db',
    'dbname' => 'marido_aluguel', // Mantendo o nome original do banco de dados
    'username' => 'user',
    'password' => 'senha_user',
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];