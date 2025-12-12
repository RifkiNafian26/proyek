<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

// Authz: admin only
if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}
$role = $_SESSION['role'] ?? 'user';
if ($role !== 'admin') {
  http_response_code(403);
  echo json_encode(['success' => false, 'message' => 'Forbidden']);
  exit;
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($id <= 0 || !in_array($action, ['approve', 'reject'], true)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Invalid request']);
  exit;
}

$newStatus = $action === 'approve' ? 'approved' : 'rejected';

$stmt = mysqli_prepare($conn, 'UPDATE adoption_applications SET status = ? WHERE id = ?');
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'DB error']);
  exit;
}
mysqli_stmt_bind_param($stmt, 'si', $newStatus, $id);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {
  echo json_encode(['success' => true, 'status' => $newStatus]);
} else {
  http_response_code(404);
  echo json_encode(['success' => false, 'message' => 'Submission not found']);
}
?>
