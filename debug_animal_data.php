<?php
require_once 'config.php';

// Get animal with ID 2
$query = "SELECT * FROM hewan WHERE id_hewan = 2";
$result = mysqli_query($conn, $query);
$animal = mysqli_fetch_assoc($result);

echo "<pre>";
echo "Animal Data from Database:\n";
print_r($animal);
echo "</pre>";

echo "<hr>";
echo "<h3>Individual Fields:</h3>";
echo "Breed: " . $animal['breed'] . "<br>";
echo "Age: " . $animal['age'] . "<br>";
echo "Color: " . $animal['color'] . "<br>";
echo "Weight: " . $animal['weight'] . "<br>";
echo "Height: " . $animal['height'] . "<br>";
?>