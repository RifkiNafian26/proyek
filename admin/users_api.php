<?php
session_start();
header('Content-Type: application/json');
// Prevent notices/warnings from breaking JSON output
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
require_once __DIR__ . '/../config.php';

// Require login
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Require admin role
$role = $_SESSION['role'] ?? 'user';
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// Fetch users from DB
$sql = "SELECT id_user, nama, email, role FROM user ORDER BY id_user DESC LIMIT 500";
$res = mysqli_query($conn, $sql);

if (!$res) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'details' => mysqli_error($conn)]);
    exit;
}

$items = [];
while ($row = mysqli_fetch_assoc($res)) {
    // Normalize fields for frontend
    $items[] = [
        'id' => isset($row['id_user']) ? (int)$row['id_user'] : 0,
        'name' => $row['nama'] ?? '',
        'email' => $row['email'] ?? '',
        'role' => $row['role'] ?? '',
        // Some schemas may have created_at/registered_at; if absent, leave null
        'registered' => $row['created_at'] ?? null,
        // Status derived if available in schema; default to 'active'
        'status' => ($row['status'] ?? 'active')
    ];
}

echo json_encode(['data' => $items]);
exit;
?>
