 let allData = []; 

fetch("status.json")
  .then(response => response.json())
  .then(data => {
    allData = data; 
    renderCards(allData);
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
      <p class="status">${item.status}</p>
    `;

    container.appendChild(card);

    const urlBox = card.querySelector(".url");
  });
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
