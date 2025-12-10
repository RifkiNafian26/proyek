<?php
require 'config.php';

// Get user by email
$email = 'test@example.com'; // Ganti dengan email yang ada di database
$query_sql = "SELECT * FROM user WHERE email = ?";
$stmt = mysqli_prepare($conn, $query_sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) == 1) {
    $row = mysqli_fetch_assoc($result);
    echo "<pre>";
    echo "User found:\n";
    echo "ID: " . $row['id_user'] . "\n";
    echo "Email: " . $row['email'] . "\n";
    echo "Nama: " . $row['nama'] . "\n";
    echo "Password from DB: " . $row['password'] . "\n";
    echo "Password length: " . strlen($row['password']) . "\n";
    echo "</pre>";
    
    // Test password verification
    $testPassword = 'password123'; // Ganti dengan password yang ingin ditest
    echo "<h3>Testing password: '$testPassword'</h3>";
    echo "<pre>";
    
    // Test 1: password_verify
    $result1 = password_verify($testPassword, $row['password']);
    echo "password_verify result: " . ($result1 ? 'TRUE' : 'FALSE') . "\n";
    
    // Test 2: plain comparison
    $result2 = ($testPassword === $row['password']);
    echo "Plain comparison result: " . ($result2 ? 'TRUE' : 'FALSE') . "\n";
    
    // Test 3: md5 comparison
    $result3 = (md5($testPassword) === $row['password']);
    echo "MD5 comparison result: " . ($result3 ? 'TRUE' : 'FALSE') . "\n";
    
    // Test 4: show md5
    echo "MD5 of test password: " . md5($testPassword) . "\n";
    
    echo "</pre>";
} else {
    echo "User not found with email: $email";
}

mysqli_close($conn);
?>
