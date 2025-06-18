-- Schedule table for appointments
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    request_id INT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE SET NULL
);

-- Add some sample appointments
INSERT INTO appointments (title, description, start_time, end_time, location, user_id, provider_id, request_id, status) VALUES
('Consertar torneira', 'Torneira da cozinha com vazamento', '2023-11-20 09:00:00', '2023-11-20 10:30:00', 'Rua Principal, 123 - Centro', 1, 1, 1, 'confirmed'),
('Instalação elétrica', 'Instalação de 3 tomadas no escritório', '2023-11-21 14:00:00', '2023-11-21 16:00:00', 'Av. Carvalho, 456 - Zona Oeste', 1, 1, 2, 'confirmed'),
('Montagem de móveis', 'Montagem de estante e escrivaninha', '2023-11-22 10:00:00', '2023-11-22 13:00:00', 'Rua Maple, 321 - Zona Norte', 1, 1, 3, 'pending');