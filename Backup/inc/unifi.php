<?php
$ch = curl_init("https://api.ui.com/v1/hosts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // like -k
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-KEY: C5zisWdwA8MU6SaNnGb4bQdsYmKCIatC",
    "Accept: application/json"
]);
$response = curl_exec($ch);
curl_close($ch);

// save response to file
file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/unifi.json", $response);

// return response as JSON to browser too
header("Content-Type: application/json");
echo $response;