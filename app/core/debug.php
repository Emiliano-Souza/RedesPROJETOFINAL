<?php

/**
 * Debug helper functions
 */

/**
 * Log debug information to a file
 */
function debug_log($message, $data = null) {
    $logDir = __DIR__ . '/../logs';
    
    // Create logs directory if it doesn't exist
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }
    
    $logFile = $logDir . '/debug.log';
    
    // Format the log message
    $timestamp = date('Y-m-d H:i:s');
    $formattedMessage = "[{$timestamp}] {$message}";
    
    if ($data !== null) {
        $formattedData = is_array($data) || is_object($data) 
            ? print_r($data, true) 
            : $data;
        $formattedMessage .= "\nData: {$formattedData}";
    }
    
    $formattedMessage .= "\n\n";
    
    // Write to log file
    file_put_contents($logFile, $formattedMessage, FILE_APPEND);
}

/**
 * Debug function to dump and die
 */
function dd($data) {
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
    die();
}