<?php

// debug php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// liberar total cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include "connect.php";

$_POST = json_decode(file_get_contents('php://input'), true);

$vendas_id = $_POST['vendas_id'];

try {

    $sql = "SELECT vendas_id, clients_cpf, cliente_nome, cliente_empregador FROM sys_vendas 
    INNER JOIN sys_inss_clientes ON sys_vendas.clients_cpf = sys_inss_clientes.cliente_cpf 
    WHERE vendas_id = :vendas_id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':vendas_id', $vendas_id, PDO::PARAM_STR);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($row);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}

// Close connection
$pdo = null;
?>