<?php
header('Content-Type: application/json');
session_start();

$response = [
    'is_logged_in' => false,
    'user_name' => '',
    'user_email' => '',
    'user_id' => null,
    'role' => null
];

if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    $response['is_logged_in'] = true;
    $response['user_id'] = $_SESSION['user_id'];
    $response['user_name'] = $_SESSION['user_name'];
    $response['user_email'] = $_SESSION['user_email'];
    if (isset($_SESSION['role'])) {
        $response['role'] = $_SESSION['role'];
    }
}

echo json_encode($response);
?>
