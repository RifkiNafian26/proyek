<?php
session_start();
require 'config.php';
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// Get user by email only
$query_sql = "SELECT * FROM user WHERE email = ?";
$stmt = mysqli_prepare($conn, $query_sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) == 1) {
    $row = mysqli_fetch_assoc($result);
    
    // Verify password - support multiple formats
    $passwordMatch = false;
    
    // Try password_verify first (for bcrypt hashed passwords)
    if (password_verify($password, $row['password'])) {
        $passwordMatch = true;
    } 
    // Try MD5 comparison
    elseif (md5($password) === $row['password']) {
        $passwordMatch = true;
    }
    // Try plain text comparison
    elseif ($password === $row['password']) {
        $passwordMatch = true;
    }
    
    // Log for debugging
    error_log("Login attempt - Email: $email, Password: $password, DB Password: {$row['password']}, Match: " . ($passwordMatch ? 'YES' : 'NO'));
    
    if ($passwordMatch) {
        // Store user info in session
        $_SESSION['user_id'] = $row['id_user'];
        $_SESSION['user_email'] = $row['email'];
        $_SESSION['user_name'] = $row['nama'];
        if (isset($row['role']) && $row['role'] !== '') {
            $_SESSION['role'] = $row['role'];
        }
        
        echo json_encode(['success' => true, 'message' => 'Login successful', 'role' => $_SESSION['role'] ?? null]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    error_log("Login failed - User not found with email: $email");
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}

mysqli_close($conn);
?>