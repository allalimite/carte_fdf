<?php
include('php/clientlogin.php');

if(empty($_GET['user']) || empty($_GET['password'])){
    echo 'error';
} else {
    $user = $_GET['user'];
    $password = $_GET['password'];
    echo ClientLogin::getAuthToken(urldecode($user), urldecode($password));
}

?>
