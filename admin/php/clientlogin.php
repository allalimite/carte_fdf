<?php

include_once "constants.php";

class ClientLogin {

    public static function getAuthToken($username, $password) {
        $clientlogin_curl = curl_init();
        curl_setopt($clientlogin_curl, CURLOPT_URL, 'https://www.google.com/accounts/ClientLogin');
        curl_setopt($clientlogin_curl, CURLOPT_POST, true);
        $post_fields = "Email=" . $username . "&Passwd=" . $password . "&service=fusiontables&accountType=HOSTED_OR_GOOGLE&source=fds-fdsmap-1.0";
        curl_setopt($clientlogin_curl, CURLOPT_POSTFIELDS, $post_fields);
        curl_setopt($clientlogin_curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($clientlogin_curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($clientlogin_curl, CURLOPT_RETURNTRANSFER, 1);

        $token = curl_exec($clientlogin_curl);
        curl_close($clientlogin_curl);
        $token_array = explode("=", $token);
        $token = str_replace("\n", "", $token_array[3]);
        return $token;
    }

}

class FTClientLogin {

    function __construct($token) {
        $this->token = $token;
    }

    function query($query, $gsessionid = null, $recursedOnce = false) {

        $url = SCOPE;
        $query = "sql=" . urlencode($query);

        $fusiontables_curl = curl_init();
        if (preg_match("/^select|^show tables|^describe/i", $query)) {
            $url .= "?" . $query;
            if ($gsessionid) {
                $url .= "&gsessionid=$gsessionid";
            }
            curl_setopt($fusiontables_curl, CURLOPT_HTTPHEADER, array("Authorization: GoogleLogin auth=" . $this->token));
        } else {
            if ($gsessionid) {
                $url .= "?gsessionid=$gsessionid";
            }

            //set header
            curl_setopt($fusiontables_curl, CURLOPT_HTTPHEADER, array(
                "Content-length: " . strlen($query),
                "Content-type: application/x-www-form-urlencoded",
                "Authorization: GoogleLogin auth=" . $this->token
            ));

            //set post = true and add query to postfield
            curl_setopt($fusiontables_curl, CURLOPT_POST, true);
            curl_setopt($fusiontables_curl, CURLOPT_POSTFIELDS, $query);
        }

        curl_setopt($fusiontables_curl, CURLOPT_URL, $url);
        curl_setopt($fusiontables_curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($fusiontables_curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($fusiontables_curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($fusiontables_curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($fusiontables_curl);
        curl_close($fusiontables_curl);
        
        //If the result contains moved Temporarily, retry
        if (strpos($result, '302 Moved Temporarily') !== false) {
            preg_match("/(gsessionid=)([\w|-]+)/", $result, $matches);

            if (!$matches[2]) {
                return false;
            }

            if ($recursedOnce === false) {
                return $this->query($url, $matches[2], true);
            }
            return false;
        
        } 
        return $result;
    }
    
    function queryJSON($query) {

        $url = SCOPE;
        $query = "sql=" . urlencode($query). "&jsonCallback=?";

        $fusiontables_curl = curl_init();
        if (preg_match("/^select|^show tables|^describe/i", $query)) {
            $url .= "?" . $query;
            curl_setopt($fusiontables_curl, CURLOPT_HTTPHEADER, array("Authorization: GoogleLogin auth=" . $this->token));
        } else {
            //set header
            curl_setopt($fusiontables_curl, CURLOPT_HTTPHEADER, array(
                "Content-length: " . strlen($query),
                "Content-type: application/x-www-form-urlencoded",
                "Authorization: GoogleLogin auth=" . $this->token
            ));

            //set post = true and add query to postfield
            curl_setopt($fusiontables_curl, CURLOPT_POST, true);
            curl_setopt($fusiontables_curl, CURLOPT_POSTFIELDS, $query);
        }

        curl_setopt($fusiontables_curl, CURLOPT_URL, $url);
        curl_setopt($fusiontables_curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($fusiontables_curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($fusiontables_curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($fusiontables_curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($fusiontables_curl);
        curl_close($fusiontables_curl);
        
        //If the result contains moved Temporarily, retry
        if (strpos($result, '302 Moved Temporarily') !== false) {
            preg_match("/(gsessionid=)([\w|-]+)/", $result, $matches);
            return false;
        } 
        return $result;
    }

}

?>
