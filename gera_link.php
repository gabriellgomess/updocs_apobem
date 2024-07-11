<?php
header("Access-Control-Allow-Origin: *");


$to = '5551997073430';

$id = '132816';


$token = (base64_encode($id));
$msg = "Anexe seus documentos https://apobem.com.br/updocs/?c=".$token;

$url_sms = 'https://sms.comtele.com.br/api/v2/send';
$metodo = 'POST';

@$data_corpo = "{
		\"Receivers\" : \"{$to}\",
		\"Content\" : \"{$msg}\"
		}
	}"; 


	$orignal_parse = parse_url($url_sms, PHP_URL_HOST);
	$get = stream_context_create(array("ssl" => array("capture_peer_cert" => TRUE)));
	$read = stream_socket_client(
		"ssl://".$orignal_parse.":443", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $get
	);
	$cont = stream_context_get_params($read);
	openssl_x509_export($cont["options"]["ssl"]["peer_certificate"],$certificado);

	

	$curl = curl_init();
	curl_setopt_array($curl, array(
		CURLOPT_URL => $url_sms,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				//CURLOPT_USERPWD => 'usuario:senha',
		CURLOPT_CUSTOMREQUEST => $metodo,
		//CURLOPT_POSTFIELDS => (http_build_query($data_url) != '') ? http_build_query($data_url) : '', // url
		CURLOPT_POSTFIELDS => ($data_corpo != '') ? $data_corpo : '', // corpo do envio
		//CURLINFO_CONTENT_TYPE => 'application/x-www-form-urlencoded"',
				//===========================
				// Certificado SSL do servidor remoto
				//=========================== 
		CURLOPT_SSL_VERIFYPEER => false,
		CURLOPT_SSL_VERIFYHOST => 0,
		//CURLOPT_CAINFO => $certificado,
			    //===========================
		CURLOPT_HTTPHEADER => array(
			"Accept: application/json",
			"auth-key: 18fff0a5-ff86-4195-afdd-b9cadd411c72",
			"Content-Type: application/json",
			"cache-control: no-cache"
		),
	));

	$resposta = curl_exec($curl);
	$erro = curl_error($curl);
	curl_close($curl);
	
	// echo $msg;
	
	$respostaJson = json_decode($resposta);
	$Success = $respostaJson->Success;
	if ($erro) {
		echo json_encode($erro, true);
	} else {
		if($Success == true){echo "<img src='images/ok.png' style='height: 32px; margin-left: 6px;'>";}else{echo "Mensagem não enviada. ".$respostaJson->Message;}
	}
?>