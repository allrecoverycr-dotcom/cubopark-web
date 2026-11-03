<?php
// Recibe el formulario de contacto de cuboparkcr.com y lo envía por correo.
// Buzón que recibe las solicitudes del formulario.
$TO = 'info@cuboparkcr.com';
$FROM = 'info@cuboparkcr.com'; // buzón existente del dominio (Hostinger exige un remitente del propio dominio)

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
if (!empty($_POST['web'])) { echo json_encode(['ok' => true]); exit; } // trampa anti-spam (campo oculto)
// Segunda trampa: los robots envían el formulario en menos de 3 segundos.
$ts = isset($_POST['ts']) ? (int)$_POST['ts'] : 0;
if ($ts > 0 && (time() * 1000 - $ts) < 3000) { echo json_encode(['ok' => true]); exit; }

function clean($k, $max = 500) {
  $v = isset($_POST[$k]) ? trim((string)$_POST[$k]) : '';
  $v = str_replace(["\r", "\n"], ' ', $v);
  return mb_substr(strip_tags($v), 0, $max);
}
$nombre   = clean('nombre', 120);
$empresa  = clean('empresa', 120);
$correo   = clean('correo', 160);
$telefono = clean('telefono', 40);
$interes  = clean('interes', 40);
$tipos    = ['info' => 'Solicitar información', 'visita' => 'Solicitar visita', 'alquiler' => 'Condiciones de alquiler'];
$tipo     = $tipos[clean('tipo', 20)] ?? 'Solicitar información';
$idioma   = clean('idioma', 2);
$mensaje  = isset($_POST['mensaje']) ? mb_substr(strip_tags(trim((string)$_POST['mensaje'])), 0, 3000) : '';

if ($nombre === '' || $telefono === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo json_encode(['ok' => false]); exit;
}

$asunto = 'Cubo Park · ' . $tipo . ': ' . $interes . ' · ' . $nombre;
$cuerpo = "Nueva solicitud desde cuboparkcr.com\n\n"
  . "Tipo de solicitud: $tipo\nPropiedad: $interes\nNombre: $nombre\nEmpresa: $empresa\nCorreo: $correo\nTeléfono: $telefono\nIdioma: $idioma\n\nMensaje:\n$mensaje\n";
$headers = [
  'From: Cubo Park <' . $FROM . '>',
  'Reply-To: ' . $correo,
  'Content-Type: text/plain; charset=UTF-8',
];
$ok = @mail($TO, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, implode("\r\n", $headers));
if (!$ok) http_response_code(500);
echo json_encode(['ok' => (bool)$ok]);
