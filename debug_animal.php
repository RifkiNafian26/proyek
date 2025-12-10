<?php
require_once 'config.php';

// Get animal with ID 1
$query = "SELECT * FROM hewan WHERE id_hewan = 1";
$result = mysqli_query($conn, $query);
$animal = mysqli_fetch_assoc($result);

echo "<pre>";
echo "Data hewan dengan ID 1:\n\n";
print_r($animal);
echo "</pre>";

mysqli_close($conn);
?>
