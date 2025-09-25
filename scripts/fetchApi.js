async function fetchUnifi() {
    const res = await fetch("inc/unifi.php");
    const data = await res.json();
    console.log("Unifi:", data);
}

async function fetchMeraki() {
    const res = await fetch("inc/meraki.php");
    const data = await res.json();
    console.log("Meraki:", data);
}

// run immediately + every 60s
fetchUnifi();
fetchMeraki();
setInterval(fetchUnifi, 60000);
setInterval(fetchMeraki, 60000);
