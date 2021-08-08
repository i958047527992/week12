<?php
require_once('conn.php');
header('Content-type:application/json;charset=utf-8');
header('Access-Control-Allow-Origin:*');
if (
  empty($_GET['id'])
) {
  $json = array(
    'ok' => false,
    'message' => 'Please send id in url!'
  );

  $response = json_encode($json);
  echo $response;
  die();
}


$id = intval($_GET['id']);

$sql = 'SELECT todos_content 
FROM yiluan_w12_todo 
WHERE id=?';
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$result = $stmt->execute();

if (!$result) {
  $json = array(
    'ok'=> false,
    'message'=> $conn->error
  );
  $response = json_encode($json);
  echo $response;
  die();
}
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$todos_content = $row['todos_content'];

$json = array(
  'ok'=> true,
  'todos_content'=> $todos_content
);
$response = json_encode($json);
echo $response;

?>