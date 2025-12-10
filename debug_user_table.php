<?php
require 'config.php';

echo "<h2>User Table Structure:</h2>";
echo "<pre>";
$result = mysqli_query($conn, "DESCRIBE user");
while ($row = mysqli_fetch_assoc($result)) {
    print_r($row);
}
echo "</pre>";

echo "<h2>All Users:</h2>";
echo "<pre>";
$result = mysqli_query($conn, "SELECT id_user, email, nama, password FROM user");
while ($row = mysqli_fetch_assoc($result)) {
    echo "ID: {$row['id_user']}, Email: {$row['email']}, Nama: {$row['nama']}, Password: {$row['password']} (len: " . strlen($row['password']) . ")\n";
}
echo "</pre>";

mysqli_close($conn);
?>
