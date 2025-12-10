<?php
require_once 'config.php';

// Get table structure
$query = "DESCRIBE hewan";
$result = mysqli_query($conn, $query);

echo "<h3>Kolom tabel 'hewan':</h3>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";

while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>{$row['Field']}</td>";
    echo "<td>{$row['Type']}</td>";
    echo "<td>{$row['Null']}</td>";
    echo "<td>{$row['Key']}</td>";
    echo "<td>{$row['Default']}</td>";
    echo "<td>{$row['Extra']}</td>";
    echo "</tr>";
}

echo "</table>";

// Get sample data
echo "<hr><h3>Sample data:</h3>";
$query = "SELECT * FROM hewan LIMIT 1";
$result = mysqli_query($conn, $query);
$row = mysqli_fetch_assoc($result);

echo "<pre>";
print_r($row);
echo "</pre>";
?>
