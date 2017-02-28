<?php

include('php/clientlogin.php');

function toJSON($txt) {
    $json = "[";
    $row_array = explode("\n", $txt);
    for ($row_index = 0; $row_index < count($row_array) - 1; $row_index++) {
        $row = $row_array[$row_index];
        $col_array = str_getcsv($row, ",", '"');
        $json = $json . "[";
        for ($col_index = 0; $col_index < count($col_array); $col_index++) {
            $json = $json . json_encode($col_array[$col_index]);
            if ($col_index < count($col_array) - 1) {
                $json = $json . ",";
            }
        }
        $json = $json . "]";
        if ($row_index < count($row_array) - 2) {
            $json = $json . ",";
        }
    }
    $json = $json . "]";
    echo $json;
}

if (empty($_POST['query']) || empty($_POST['token'])) {
    echo 'Bad arguments';
} else {
    try {
        $sql = str_replace("\\'", "'", $_POST['query']) ;
        $token = $_POST['token'];
        $ftclient = new FTClientLogin($token);
        $res = $ftclient->query($sql);
        echo $res;
    } catch (Exception $e) {
        echo 'Exception reçue : ', $e->getMessage(), "\n";
    }
}
?>
