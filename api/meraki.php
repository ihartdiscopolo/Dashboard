<?php
header("Content-Type: application/json");

$ch = curl_init("https://api.meraki.com/api/v1/organizations"); // adjust endpoint

$headers = [
    "X-Cisco-Meraki-API-Key: 383fb74eaf6a0381b756b50f9e628e9d41c4c6f4",
    "Accept: application/json"
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode === 200) {
    echo $response;
} else {
    echo json_encode([
        "error" => "API request failed",
        "status" => $httpcode,
        "response" => $response
    ]);
}
