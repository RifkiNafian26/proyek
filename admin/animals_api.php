<?php
// Ensure clean JSON output (no warnings/notices before headers)
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config.php';

// Optional: gate to admin if needed (commented out if not using sessions here)
// session_start();
// if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
//     http_response_code(403);
//     echo json_encode(['data' => [], 'error' => 'Forbidden']);
//     exit;
// }

if (!isset($conn) || !$conn) {
    http_response_code(500);
    echo json_encode(['data' => [], 'error' => 'DB connection failed']);
    exit;
}

$sql = 'SELECT id_hewan, namaHewan, jenis, breed, color, age, status, main_photo, uploaded_by_user_id FROM hewan ORDER BY id_hewan DESC';
$result = mysqli_query($conn, $sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['data' => [], 'error' => mysqli_error($conn)]);
    exit;
}

$out = [];
while ($row = mysqli_fetch_assoc($result)) {
    $out[] = $row;
}

echo json_encode(['data' => $out]);
exit;
