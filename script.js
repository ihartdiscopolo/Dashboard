  let allData = [];
  let serverData = [];

fetch("status.json")
  .then(response => response.json())
  .then(data => {
    allData = data; 
    renderCards(allData);
  })
  .catch(error => console.error("Error loading JSON:", error));

  fetch("stats.json")
  .then(response => response.json())
  .then(data => {
    serverData = data;
      console.log(serverData);
      renderProgressBars(serverData);
  })
  .catch(error => console.error("Error loading JSON:", error));

function renderCards(data) {
  const container = document.querySelector("#card-container");
  container.innerHTML = ""; 
  console.log(data);
  data.forEach(item => {
    const card = document.createElement("a");
    card.href= "https://" + item.url;
    card.target = "_blank";
    card.classList.add("card");

    const status = Number(item.status);

    if (status >= 200 && status <= 299) {
      card.classList.add("status-2xx");
    } 
    else if (status >= 300 && status <= 399) {
      card.classList.add("status-3xx");
    } 
    else if (status >= 400 && status <= 499) {
      card.classList.add("status-4xx");
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
  const memTotal = parseInt(serverData.server.get.result.stat.mem.total, 10);
  const memUsed  = parseInt(serverData.server.get.result.stat.mem.used, 10);
  const memPercent = (memUsed / memTotal) * 100;

  if (memPercent >= 80 && memPercent < 90) {
    memClass = "orange";
  } else if (memPercent >= 90) {
    memClass = "red";
  } else {
    memClass = "green";
  }

  const diskTotal = parseInt(serverData.server.get.result.stat.diskspace.device.total, 10);
  const diskUsed  = parseInt(serverData.server.get.result.stat.diskspace.device.used, 10);
  const diskPercent = (diskUsed / diskTotal) * 100;

  if (diskPercent >= 80 && diskPercent < 90) {
    diskClass = "orange";
  } else if (diskPercent >= 90) {
    diskClass = "red";
  } else {
    diskClass = "green";
  }

  const bar = document.querySelector("footer");
  bar.innerHTML = ""
  bar.innerHTML = `
  <div class="memoryBar ${memClass}">
    <p>Memory:</p>
    <progress max="${memTotal}" value="${memUsed}"></progress>
    <p>${memPercent.toFixed(2)}%</p>
  </div>
  <div class="diskBar ${diskClass}">
    <p>Disk:</p>
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
});
