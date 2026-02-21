<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require "config/database.php"; 

// 1. Initialize the Database class and get the connection
$database = new Database();
$db = $database->connect();

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!empty($data['email']) && !empty($data['password'])) {
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $username = explode('@', $email)[0]; 

    try {
        // 2. Use PDO syntax (matches your database.php)
        $sql = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $db->prepare($sql);
        
        // Bind parameters for PDO
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User registered!"]);
        }
    } catch (PDOException $e) {
        // Handle duplicate email or other SQL errors
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Data incomplete."]);
}