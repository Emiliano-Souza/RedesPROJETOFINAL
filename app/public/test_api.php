<?php
// Arquivo para testar a API diretamente

// Habilitar exibição de erros
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Definir cabeçalhos CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Se for uma requisição OPTIONS, retornar apenas os cabeçalhos
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Dados de teste
$testData = [
    'title' => 'Teste de API',
    'description' => 'Descrição de teste',
    'location' => 'Local de teste',
    'user_id' => 1
];

// Simular resposta de sucesso
echo json_encode([
    'success' => true,
    'message' => 'Request created successfully',
    'data' => [
        'id' => 999
    ]
]);