async function fetchUnifi() {
    try {
        const res = await fetch("api/unifi.php");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Unifi:", data);
    } catch (err) {
        console.error("Failed to fetch Unifi:", err);
    }
}

async function fetchMeraki() {
    try {
        const res = await fetch("api/meraki.php");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Meraki:", data);
    } catch (err) {
        console.error("Failed to fetch Meraki:", err);
    }
}

// run immediately + every 60s
fetchUnifi();
fetchMeraki();
setInterval(fetchUnifi, 60000);
setInterval(fetchMeraki, 60000);