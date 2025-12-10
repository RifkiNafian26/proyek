<?php
require_once 'config.php';

// Update animal data with correct values
$updates = [
    [
        'id' => 1,
        'weight' => '50',
        'height' => '10'
    ],
    [
        'id' => 2,
        'weight' => '5',
        'height' => '30'
    ]
];

foreach ($updates as $update) {
    $query = "UPDATE hewan SET weight = ?, height = ? WHERE id_hewan = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ssi", $update['weight'], $update['height'], $update['id']);
    
    if (mysqli_stmt_execute($stmt)) {
        echo "Updated animal ID {$update['id']}: weight={$update['weight']} kg, height={$update['height']} cm<br>";
    } else {
        echo "Error updating animal ID {$update['id']}: " . mysqli_error($conn) . "<br>";
    }
}

echo "<hr>";
echo "<h3>Updated Data:</h3>";
$query = "SELECT id_hewan, namaHewan, breed, age, color, weight, height FROM hewan ORDER BY id_hewan";
$result = mysqli_query($conn, $query);

echo "<table border='1' cellpadding='5'>";
echo "<tr><th>ID</th><th>Name</th><th>Breed</th><th>Age</th><th>Color</th><th>Weight</th><th>Height</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>{$row['id_hewan']}</td>";
    echo "<td>{$row['namaHewan']}</td>";
    echo "<td>{$row['breed']}</td>";
    echo "<td>{$row['age']}</td>";
    echo "<td>{$row['color']}</td>";
    echo "<td>{$row['weight']}</td>";
    echo "<td>{$row['height']}</td>";
    echo "</tr>";
}
echo "</table>";
?>
<!DOCTYPE html>
<html>
<head>
    <title>Fix Animal Data</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; margin-top: 10px; }
        th { background-color: #5f6f52; color: white; }
    </style>
</head>
<body>
    <p><a href="adopt/animalprofile.php?id=1">View Dog Profile</a> | <a href="adopt/animalprofile.php?id=2">View Cat Profile</a></p>
</body>
</html>