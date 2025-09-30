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

async function fetchPlesk() {
    try {
        const res = await fetch("api/pleskdata.php");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Plesk:", data);
    } catch (err) {
        console.error("Failed to fetch Plesk:", err);
    }
}

// run immediately + every 60s
fetchUnifi();
fetchMeraki();
setInterval(fetchUnifi, 60000);
setInterval(fetchMeraki, 60000);

// run immediately + every 5 minutes
setInterval(fetchMeraki, 300000); 