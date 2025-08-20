<?php
// Troque pelo seu e-mail
$destino = "testesaga000@gmail.com";
$assunto = "Pedido realizado pelo site";
$pedido = isset($_POST['pedido']) ? $_POST['pedido'] : '';
$valor = isset($_POST['valor']) ? $_POST['valor'] : '';
$mensagem = "Pedido:\n$pedido\nValor total: $valor";

// Envia o e-mail
if(mail($destino, $assunto, $mensagem)) {
    echo "ok";
} else {
    echo "erro";
}
?>
