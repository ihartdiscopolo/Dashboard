let allData = [];
let serverData = [];
const title = document.querySelector("title");

function init() {
  renderCards()
  renderProgressBars()
  setTimeout(() => {
    init()
  }, 600000);
}

//fetch("api/pleskdata.php?file=plesk_status")
fetch("https://pleskdata.qnimbus.nl/plesk_status.json")
  .then(response => response.json())
  .then(data => {
    allData = data; 
    renderCards(allData);
  })
  .catch(error => console.error("Error loading JSON:", error));

  //fetch("api/pleskdata.php?file=plesk_stats")
fetch("https://pleskdata.qnimbus.nl/plesk_stats.json")
  .then(response => response.json())
  .then(data => {
    serverData = data.server.get.result.stat;
      // console.log(serverData);
      renderProgressBars(serverData);
  })
  .catch(error => console.error("Error loading JSON:", error));

function renderCards(data) {
  const container = document.querySelector("#card-container");
  container.innerHTML = ""; 
  // console.log(data);
  data.forEach(item => {
    const card = document.createElement("a");
    card.href= "https://" + item.url;
    card.target = "_blank";
    card.classList.add("card");

    const status = Number(item.status);
	
	if (status < 100) {
	  card.classList.add("status-0xx");
	}
    else if (status >= 200 && status <= 299) {
      card.classList.add("status-2xx");
    } 
    else if (status >= 300 && status <= 399) {
      card.classList.add("status-3xx");
    } 
    else if (status >= 400 && status <= 499) {
      card.classList.add("status-4xx");
      title.innerHTML = `404 ${item.url} DOWN`
    } 
    else if (status >= 500 && status <= 599) {
      card.classList.add("status-5xx");
    } 
    else if (status >= 100 && status <= 199) {
      card.classList.add("status-1xx");
    }

    card.innerHTML = `
      <p class="url">${item.url}</p>
    `;

    container.appendChild(card);

    const urlBox = card.querySelector(".url");
  });
}

function renderProgressBars(serverData) {
  fetchPlesk()
  const memTotal = parseInt(serverData.mem.total, 10);
  const memUsed  = parseInt(serverData.mem.used, 10);
  const memPercent = (memUsed / memTotal) * 100;

  if (memPercent >= 80 && memPercent < 90) {
    memClass = "orange";
  } else if (memPercent >= 90) {
    memClass = "red";
  } else {
    memClass = "green";
  }

  const diskTotal = parseInt(serverData.diskspace.device.total, 10);
  const diskUsed  = parseInt(serverData.diskspace.device.used, 10);
  const diskPercent = (diskUsed / diskTotal) * 100;

  if (diskPercent >= 80 && diskPercent < 90) {
    diskClass = "orange";
  } else if (diskPercent >= 90) {
    diskClass = "red";
  } else {
    diskClass = "green";
  }

  const barUp = document.querySelector(".footUp");
  barUp.innerHTML = ""
  barUp.innerHTML = `
  <div class="memoryBar ${memClass}">
    <p>Memory used:</p>
    <progress max="${memTotal}" value="${memUsed}"></progress>
    <p>${memPercent.toFixed(2)}%</p>
  </div>
  <div class="diskBar ${diskClass}">
    <p>Diskspace used:</p>
    <progress max="${diskTotal}" value="${diskUsed}"></progress>
    <p>${diskPercent.toFixed(2)}%</p>
  </div>
  `
}

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("status-filter");

filter.addEventListener("change", () => {
  const value = filter.value;
  if (value === "all") {
    renderCards(allData);
  } 
  else {
    const [min, max] = value.split("-").map(Number);
    const filtered = allData.filter(item => {
      const status = Number(item.status);
      return status >= min && status <= max;
    });
    renderCards(filtered);
  }
});

const themeSelect = document.getElementById("theme-select");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeSelect.value = "dark";
}

themeSelect.addEventListener("change", (e) => {
  if (e.target.value === "dark") {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
  
});
});
