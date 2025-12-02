<?php
require 'config.php';
$nama = $_POST['nama'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

if ($password !== $confirm_password) {
    die("Password and Confirm Password do not match.");
}

$query_sql = "INSERT INTO user (nama, email, password) VALUES ('$nama', '$email', '$password')";

if (mysqli_query($conn, $query_sql)) {
    header("Location: index.html");
} else {
    echo "Error: " . $query_sql . "<br>" . mysqli_error($conn);
}