<?php
/**
 * Script para garantir que o banco de dados exista
 * Este script verifica se o banco de dados 'zap_serv' existe
 * Se não existir, cria o banco e copia os dados do 'marido_aluguel'
 */

// Carregar configurações
$config = require __DIR__ . '/../app/config/database.php';

try {
    // Conectar ao servidor MySQL sem especificar um banco de dados
    $pdo = new PDO(
        "mysql:host={$config['host']};charset={$config['charset']}", 
        $config['username'], 
        $config['password'], 
        $config['options']
    );
    
    // Verificar se o banco de dados 'zap_serv' existe
    $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'zap_serv'");
    $dbExists = $stmt->fetchColumn();
    
    if (!$dbExists) {
        echo "Criando banco de dados 'zap_serv'...\n";
        
        // Criar o banco de dados
        $pdo->exec("CREATE DATABASE IF NOT EXISTS zap_serv");
        
        // Verificar se o banco de dados original existe
        $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'marido_aluguel'");
        $originalDbExists = $stmt->fetchColumn();
        
        if ($originalDbExists) {
            echo "Copiando tabelas e dados de 'marido_aluguel' para 'zap_serv'...\n";
            
            // Obter lista de tabelas do banco original
            $pdo->exec("USE marido_aluguel");
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Copiar cada tabela para o novo banco
            foreach ($tables as $table) {
                echo "Copiando tabela: {$table}\n";
                
                // Obter estrutura da tabela
                $stmt = $pdo->query("SHOW CREATE TABLE {$table}");
                $tableDefinition = $stmt->fetch(PDO::FETCH_ASSOC);
                $createTableSql = $tableDefinition['Create Table'];
                
                // Criar tabela no novo banco
                $pdo->exec("USE zap_serv");
                $pdo->exec($createTableSql);
                
                // Copiar dados
                $pdo->exec("INSERT INTO zap_serv.{$table} SELECT * FROM marido_aluguel.{$table}");
            }
            
            echo "Migração concluída com sucesso!\n";
        } else {
            echo "Banco de dados original 'marido_aluguel' não encontrado.\n";
        }
    } else {
        echo "Banco de dados 'zap_serv' já existe.\n";
    }
    
    echo "Verificação de banco de dados concluída.\n";
    
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage() . "\n";
}