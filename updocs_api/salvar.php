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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// $_POST = json_decode(file_get_contents('php://input'), true);

$cliente_cpf = $_POST['cliente_cpf'];
$tipo_documento = $_POST['tipo_documento'];

// echo json_encode($_POST);
// exit;

// Verifique se cliente_cpf e tipo_documento estão definidos e não estão vazios
if (empty($cliente_cpf) || empty($tipo_documento)) {
    echo json_encode(['error' => 'Parâmetros inválidos']);
    exit;
}

try {
    // Capturando o tipo de documento enviado
    $query = "SELECT tipo_nome FROM sys_vendas_anexos_tipos WHERE tipo_id = :tipo_documento";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':tipo_documento', $tipo_documento, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(['error' => 'Tipo de documento não encontrado']);
        exit;
    }

    if (isset($_FILES['documento-upload'])) {
        $uploaded_file = $_FILES['documento-upload'];
        upload_file_to_dir($pdo, $uploaded_file, $cliente_cpf, $tipo_documento);
    } else {
        echo json_encode(['error' => 'Arquivo não enviado']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Erro na consulta: ' . $e->getMessage()]);
}

function upload_file_to_dir($pdo, $uploaded_file, $cliente_cpf, $documento_tipo = 0) {
    $main_directory = "/var/www/html/updocs/upload/clientes/" . $cliente_cpf . "/";
    $anexo_nome = $uploaded_file["name"];

    $temp = explode(".", $anexo_nome);
    $extension = end($temp);
    array_pop($temp);
    $temp = implode("", $temp);
    $anexo_nome = $temp . "_" . time() . "." . $extension;

    $file_directory = $main_directory . $anexo_nome;

    $anexo_data = date("Y-m-d H:i:s");
    $anexo_caminho = "https://apobem.com.br/updocs/upload/clientes/" . $cliente_cpf . "/" . $anexo_nome;
    $anexo_tipo = $uploaded_file['type'];
    $anexo_documento = $documento_tipo;

    if (!file_exists($main_directory)) {
        mkdir($main_directory, 0755, true);
    }

    if (move_uploaded_file($uploaded_file['tmp_name'], $file_directory)) {
        try {
            $sql = "INSERT INTO sys_cliente_anexos (anexo_cpf, anexo_nome, anexo_caminho, anexo_data, anexo_usuario, anexo_tipo, anexo_documento) 
                    VALUES (:anexo_cpf, :anexo_nome, :anexo_caminho, :anexo_data, 'cliente.final', :anexo_tipo, :anexo_documento)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':anexo_cpf', $cliente_cpf, PDO::PARAM_STR);
            $stmt->bindParam(':anexo_nome', $anexo_nome, PDO::PARAM_STR);
            $stmt->bindParam(':anexo_caminho', $anexo_caminho, PDO::PARAM_STR);
            $stmt->bindParam(':anexo_data', $anexo_data, PDO::PARAM_STR);
            $stmt->bindParam(':anexo_tipo', $anexo_tipo, PDO::PARAM_STR);
            $stmt->bindParam(':anexo_documento', $anexo_documento, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['success' => 1]);
            } else {
                echo json_encode(['error' => 'Erro ao inserir registro no banco de dados']);
            }

        } catch (PDOException $e) {
            echo json_encode(['error' => 'Erro na inserção: ' . $e->getMessage()]);
        }

    } else {
        echo json_encode(['error' => 'Erro ao mover o arquivo']);
    }
}
?>
