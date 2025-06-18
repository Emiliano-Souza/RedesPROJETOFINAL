-- Script para renomear o banco de dados
-- Execute este script para renomear o banco de dados de 'marido_aluguel' para 'zap_serv'

-- Criar o novo banco de dados
CREATE DATABASE IF NOT EXISTS zap_serv;

-- Copiar todas as tabelas e dados do banco antigo para o novo
-- Nota: Este é um script simplificado, em um ambiente real você precisaria
-- exportar e importar os dados ou usar ferramentas específicas do seu SGBD

-- Após a migração, você pode atualizar a configuração em app/config/database.php
-- para apontar para o novo banco de dados 'zap_serv'