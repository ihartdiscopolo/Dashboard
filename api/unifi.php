<?php
header("Content-Type: application/json");

$ch = curl_init("https://api.ui.com/v1/hosts");

// replace with your real API key
$headers = [
    "X-API-KEY: C5zisWdwA8MU6SaNnGb4bQdsYmKCIatC",
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
