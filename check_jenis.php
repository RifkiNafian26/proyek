<?php
require_once 'config.php';

// Get all unique values in jenis column
$query = "SELECT DISTINCT jenis FROM hewan";
$result = mysqli_query($conn, $query);

echo "<h3>Nilai unik di kolom 'jenis':</h3>";
echo "<ul>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<li>'" . htmlspecialchars($row['jenis']) . "'</li>";
}
echo "</ul>";

// Get sample animals
echo "<hr><h3>Sample animals:</h3>";
$query = "SELECT id_hewan, namaHewan, jenis FROM hewan LIMIT 5";
$result = mysqli_query($conn, $query);

echo "<table border='1' cellpadding='5'>";
echo "<tr><th>ID</th><th>Nama</th><th>Jenis</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>{$row['id_hewan']}</td>";
    echo "<td>{$row['namaHewan']}</td>";
    echo "<td>'{$row['jenis']}'</td>";
    echo "</tr>";
}
echo "</table>";
?>
