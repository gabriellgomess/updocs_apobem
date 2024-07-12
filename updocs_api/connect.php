<?php

try {
    $dsn = 'mysql:host=10.100.0.22;dbname=sistema';
    $username = 'root';
    $password = 'Theredpil2001';
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
    $pdo->exec("SET NAMES utf8");
} catch (PDOException $e) {
    die('Could not connect: ' . $e->getMessage());
}
