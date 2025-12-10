<?php
/**
 * Script untuk mengupdate password yang ada di database menjadi hashed password
 * Jalankan script ini SEKALI SAJA setelah implementasi password hashing
 * Setelah selesai, hapus atau amankan file ini
 */

require 'config.php';

echo "<h2>Password Update Script</h2>";
echo "<p>Mengupdate password yang belum di-hash...</p>";

// Get all users with plain text passwords
$query = "SELECT id_user, email, password FROM user";
$result = mysqli_query($conn, $query);

if (!$result) {
    die("Query error: " . mysqli_error($conn));
}

$updated = 0;
$skipped = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $id = $row['id_user'];
    $email = $row['email'];
    $current_password = $row['password'];
    
    // Check if password is already hashed (bcrypt hash starts with $2y$ and is 60 characters)
    if (strlen($current_password) == 60 && substr($current_password, 0, 4) == '$2y$') {
        echo "- User $email: Password sudah di-hash, skip<br>";
        $skipped++;
        continue;
    }
    
    // Hash the plain text password
    $hashed_password = password_hash($current_password, PASSWORD_BCRYPT);
    
    // Update database
    $update_query = "UPDATE user SET password = ? WHERE id_user = ?";
    $stmt = mysqli_prepare($conn, $update_query);
    mysqli_stmt_bind_param($stmt, "si", $hashed_password, $id);
    
    if (mysqli_stmt_execute($stmt)) {
        echo "✓ User $email: Password berhasil di-hash<br>";
        $updated++;
    } else {
        echo "✗ User $email: Gagal update - " . mysqli_error($conn) . "<br>";
    }
    
    mysqli_stmt_close($stmt);
}

echo "<hr>";
echo "<p><strong>Selesai!</strong></p>";
echo "<p>Total updated: $updated user(s)</p>";
echo "<p>Total skipped (sudah di-hash): $skipped user(s)</p>";
echo "<p style='color: red;'><strong>PENTING: Hapus file ini setelah selesai!</strong></p>";

mysqli_close($conn);
?>
