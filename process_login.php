<?php
// 1. Headers for React/CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

session_start();
require "config/database.php"; 

// --- NEW FIX: Initialize the class connection ---
$database = new Database();
$db = $database->connect();

// 2. Read JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data && !empty($data['username'])) {
    $username = $data['username'];
    $password = $data['password'];

    try {
        // 3. Prepare the SQL using PDO syntax (for admin login)
        $stmt = $db->prepare("SELECT * FROM admin_users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        // 4. Fetch the admin user
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        // 5. Verify password (with hashed password)
        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_id'] = $admin['id'];

            echo json_encode([
                "success" => true,
                "message" => "Admin login successful",
                "username" => $admin['username']
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Invalid username or password"
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No data received"]);
}
exit();
