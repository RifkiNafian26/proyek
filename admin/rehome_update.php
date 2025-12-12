<?php
session_start();
require_once '../config.php';

// Check if admin
$role = $_SESSION['role'] ?? '';
if ($role !== 'admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$notes = isset($_POST['notes']) ? $_POST['notes'] : null;

if ($id === 0 || !$status) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Validate status
$valid_statuses = ['submitted', 'in_review', 'approved', 'rejected', 'withdrawn'];
if (!in_array($status, $valid_statuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid status']);
    exit;
}

// Update status
$query = "UPDATE rehome_submissions SET status = ?, admin_notes = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "ssi", $status, $notes, $id);

if (mysqli_stmt_execute($stmt)) {
    // If status is approved, create notification
    if ($status === 'approved') {
        // Optional: Insert notification untuk user
        // Or send email notification
    }
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
    header('Location: rehome_detail.php?id=' . $id . '&updated=1');
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
