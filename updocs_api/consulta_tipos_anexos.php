<?php

// Debug PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'connect.php';

if (!$pdo) {
    echo json_encode(['error' => 'Falha na conexão com o banco de dados']);
    exit;
}

$_POST = json_decode(file_get_contents('php://input'), true);

// Verifique se empregador está definido e não vazio
if (!isset($_POST['empregador']) || empty($_POST['empregador'])) {
    echo json_encode(['error' => 'Empregador não definido ou vazio']);
    exit;
}

$empregador = $_POST['empregador'];

try {
    $query = "SELECT * FROM sys_vendas_anexos_tipos WHERE tipo_orgao LIKE :empregador ORDER BY tipo_nome ASC";
    $stmt = $pdo->prepare($query);
    $empregador_like = '%' . $empregador . '%';
    $stmt->bindParam(':empregador', $empregador_like, PDO::PARAM_STR);

    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Nenhum resultado encontrado']);
    }
} catch (PDOException $e) {
    $error_info = [
        'error' => 'Erro na consulta',
        'message' => $e->getMessage(),
        'query' => $query // Inclui a consulta SQL para depuração
    ];
    echo json_encode($error_info);
}
?>
