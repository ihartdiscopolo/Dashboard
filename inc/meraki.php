<?php
$ch = curl_init("https://api.meraki.com/api/v1/organizations");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Cisco-Meraki-API-Key: 383fb74eaf6a0381b756b50f9e628e9d41c4c6f4",
    "Accept: application/json"
]);
$response = curl_exec($ch);
curl_close($ch);

// save response to file
file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/scripts/meraki.json", $response);


// return response as JSON to browser too
header("Content-Type: application/json");
echo $response;