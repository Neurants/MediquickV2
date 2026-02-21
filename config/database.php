<?php
class Database {
    private $host = "localhost";
    private $db_name = "mediquick_erp";
    private $username = "root";
    private $password = "";
    public $conn;

    public function connect() {
        $this->conn = null;

        try {
            // Connect to MySQL server
            $this->conn = new PDO(
                "mysql:host=" . $this->host,
                $this->username,
                $this->password
            );

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Import schema.sql
            $sqlFile = __DIR__ . '/schema.sql';

            if (file_exists($sqlFile)) {
                $query = file_get_contents($sqlFile);
                $this->conn->exec($query);
            }

            // Use the database
            $this->conn->exec("USE " . $this->db_name);

        } catch (PDOException $e) {
            die("Database Error: " . $e->getMessage());
        }

        return $this->conn;
    }
}
?>
