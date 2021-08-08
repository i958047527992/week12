<?php
require_once('conn.php');
header('Content-type:application/json;charset=utf-8');
header('Access-Control-Allow-Origin:*');
if (
  empty($_POST['todos'])  
) {
  $json = array(
    'ok' => false,
    'message' => 'Please input todos!'
  );

  $response = json_encode($json);
  echo $response;
  die();
}

$todos = $_POST['todos'];

$sql = 'INSERT into yiluan_w12_todo(todos_content)
  values (?)';
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $todos);
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
$id = $stmt->insert_id;
$json = array(
  'ok'=> true,
  'message'=> 'success',
  'id'=> $id
);
$response = json_encode($json);
echo $response;

?>