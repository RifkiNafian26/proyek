<?php
require_once 'config.php';

// Check if the jenis_hewan column exists
$result = mysqli_query($conn, "DESCRIBE hewan");
$columns = [];
while ($row = mysqli_fetch_assoc($result)) {
    $columns[] = $row['Field'];
}

if (!in_array('jenis_hewan', $columns)) {
    // Add jenis_hewan column if it doesn't exist
    $alter_query = "ALTER TABLE hewan ADD COLUMN jenis_hewan VARCHAR(50) AFTER breed";
    
    if (mysqli_query($conn, $alter_query)) {
        echo "✅ Column 'jenis_hewan' added successfully to table 'hewan'";
    } else {
        echo "❌ Error adding column: " . mysqli_error($conn);
    }
} else {
    echo "✅ Column 'jenis_hewan' already exists";
}

// Close connection
mysqli_close($conn);
?>
