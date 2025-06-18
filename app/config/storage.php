<?php

return [
    // MinIO configuration
    'minio' => [
        'endpoint' => 'http://file-storage:9000',
        'key' => 'minio_user',
        'secret' => 'minio_password',
        'region' => 'us-east-1',
        'bucket' => 'service-requests',
        'use_path_style_endpoint' => true,
    ],
    
    // Local storage path for temporary files
    'local' => [
        'uploads_path' => '/var/www/uploads',
    ],
];