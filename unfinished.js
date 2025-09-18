let allData = [];

fetch("status.json")
  .then(response => response.json())
  .then(data => {
    allData = data;
    renderCards(allData);
  })
  .catch(error => console.error("Error loading JSON:", error));

function cancelAllMarquees() {
  document.querySelectorAll('.url').forEach(el => {
    if (el._marqueeRafId) {
      cancelAnimationFrame(el._marqueeRafId);
      el._marqueeRafId = null;
    }
  });
}

function renderCards(data) {
  cancelAllMarquees();

  const container = document.querySelector("#card-container");
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    const status = Number(item.status);

    if (status >= 200 && status <= 299) {
      card.classList.add("status-2xx");
    } else if (status >= 300 && status <= 399) {
      card.classList.add("status-3xx");
    } else if (status >= 400 && status <= 499) {
      card.classList.add("status-4xx");
    } else if (status >= 500 && status <= 599) {
      card.classList.add("status-5xx");
    } else if (status >= 100 && status <= 199) {
      card.classList.add("status-1xx");
    }

    card.innerHTML = `
      <p class="url"><span>${escapeHtml(item.url)}</span></p>
      <p class="status">${item.status}</p>
    `;

    container.appendChild(card);

    // const urlBox = card.querySelector(".url");
    // setupAutoScroll(urlBox);
    setupAutoScroll(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("status-filter");

  filter.addEventListener("change", () => {
    const value = filter.value;
    if (value === "all") {
      renderCards(allData);
    } else {
      const [min, max] = value.split("-").map(Number);
      const filtered = allData.filter(item => {
        const status = Number(item.status);
        return status >= min && status <= max;
      });
      renderCards(filtered);
    }
  });
});

function setupAutoScroll(scrollBox) {
  const textSpan = scrollBox.querySelector("span");
  if (!textSpan) return;

  let speed = 0.5; 
  let direction = 1;   // 1 = right, -1 = left
  let pos = 0;
  // let pausedCards = new Set(); // track which cards are paused

  function animate() {
    const boxWidth = scrollBox.clientWidth;
    const textWidth = textSpan.offsetWidth;

    pos += speed * direction;
    textSpan.style.transform = `translateX(${pos}px)`;

    console.log(scrollBox.scrollLeft);
    // if (Math.abs(pos) >= textWidth) {
    if (scrollBox.scrollLeft + scrollBox.clientWidth >= scrollBox.scrollWidth) {
      // pos = 0;
      direction = -1;
    } else if (scrollBox.scrollLeft <= 0) {
      direction = 1;
    }

    textSpan.style.transform = `translateX(${pos}px)`;

    scrollBox._rafId = requestAnimationFrame(animate);
  }

  scrollBox.addEventListener("mouseenter", () => {
    if (scrollBox._rafId) cancelAnimationFrame(scrollBox._rafId);
  });

  scrollBox.addEventListener("mouseleave", () => {
    scrollBox._rafId = requestAnimationFrame(animate);
  });

  scrollBox._rafId = requestAnimationFrame(animate);
}

let resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  // debounce re-initialization a bit
  resizeTimeout = setTimeout(() => {
    // cancel existing and re-setup
    document.querySelectorAll('.url').forEach(el => {
      if (el._marqueeRafId) {
        cancelAnimationFrame(el._marqueeRafId);
        el._marqueeRafId = null;
      }
      setupAutoScroll(el);
    });
  }, 150);
});

/* small helper to avoid injecting raw HTML if url contains < or & */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}