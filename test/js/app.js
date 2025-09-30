function init() {
    buildApp();
    setTimeout(() => {
        init(); // schedule next
    }, 300000);
}

function buildApp() {
    const accentColor = "#274690";

    function createElement(tag, { text = "", html = "", styles = {}, children = [], classes = [] } = {}) {
        const el = document.createElement(tag);

        // Add plain text if provided (only if html is not set)
        if (text && !html) el.innerText = text;

        // Add raw HTML if provided
        if (html) el.innerHTML = html;

        // Add styles
        if (styles && typeof styles === "object") {
            Object.assign(el.style, styles);
        }

        // Add classes
        if (classes) {
            if (Array.isArray(classes)) {
                classes.forEach(cls => el.classList.add(cls));
            } else if (typeof classes === "string") {
                el.classList.add(classes);
            }
        }

        // Append children (after text/html)
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === "string") {
                    el.appendChild(document.createTextNode(child));
                } else {
                    el.appendChild(child);
                }
            });
        }

        return el;
    }
    function createProgressBar({ prefix = "", suffix = "", value = 50, max = 100, styles = {}, classes = [] } = {}) {
        let progressBarContainer = createElement('div');

        const progress = document.createElement('progress');
        progress.value = value;
        progress.max = max;

        // Apply custom styles
        if (styles && typeof styles === 'object') {
            Object.assign(progress.style, styles);
        }

        // Add classes
        if (classes) {
            if (Array.isArray(classes)) classes.forEach(cls => progress.classList.add(cls));
            else if (typeof classes === 'string') progress.classList.add(classes);
        }

        if (prefix !== "") {
            const titleEl = createElement('span', {
                text: prefix,
                styles: {
                    margin: "0 5px",
                }
            });
            progressBarContainer.appendChild(titleEl);
        }
        progressBarContainer.appendChild(progress);
        if (suffix !== "") {
            const titleEl = createElement('span', {
                text: suffix,
                styles: {
                    margin: "0 5px",
                }
            });
            progressBarContainer.appendChild(titleEl);
        }

        return progressBarContainer;
    }
    function getColors(value) {
        let bgColor = "";

        if (value >= 0 && value <= 99) bgColor = "#ffffff";       // white
        else if (value >= 100 && value <= 199) bgColor = "#cccccc"; // gray
        else if (value >= 200 && value <= 299) bgColor = "#28a745"; // green
        else if (value >= 300 && value <= 399) bgColor = "#274690"; // blue
        else if (value >= 400 && value <= 499) bgColor = "#d70016"; // red
        else if (value >= 500 && value <= 599) bgColor = "#fd7e14"; // orange
        else bgColor = "#ffffff"; // fallback

        // Determine readable text color (black on light, white on dark)
        const darkColors = ["#28a745", "#274690", "#d70016", "#fd7e14"];
        const textColor = darkColors.includes(bgColor) ? "white" : "black";

        return { bgColor, textColor };
    }
    function enableAutoScroll() {
        document.querySelectorAll('.scrolling-text').forEach(container => {
            const span = container.querySelector('span');
            if (!span) return;

            // Ensure container hides overflow and spans remain inline
            container.style.overflow = 'hidden';
            span.style.display = 'inline-block';
            span.style.whiteSpace = 'nowrap';

            const containerWidth = container.clientWidth;
            const textWidth = span.scrollWidth;

            if (textWidth <= containerWidth) return; // no scrolling needed

            let offset = 0;
            let direction = 1;
            const speed = .1;

            function step() {
                offset += speed * direction;

                if (offset >= textWidth - containerWidth) direction = -1;
                if (offset <= 0) direction = 1;

                span.style.transform = `translateX(-${offset}px)`;
                requestAnimationFrame(step);
            }

            step();
        });
    }
    function enableVerticalScroll(containerSelector, speed = 0.3, pauseDuration = 1000) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        let offset = container.scrollTop;
        let direction = 1; // 1 = down, -1 = up
        let paused = false;
        let pauseTimer = 0;

        container.style.overflowY = "hidden";

        container.addEventListener('mouseenter', () => {
            paused = true;
            container.style.overflowY = "auto"; // allow manual scroll
        });

        container.addEventListener('mouseleave', () => {
            paused = false;
            container.style.overflowY = "hidden"; // resume auto-scroll
        });

        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll <= 0) return; // nothing to scroll

        function step(timestamp) {
            if (!paused) {
                if (pauseTimer > 0) {
                    pauseTimer -= 16; // approx. one frame (~60fps)
                } else {
                    offset += speed * direction;

                    if (offset >= maxScroll) {
                        offset = maxScroll;
                        direction = -1;
                        pauseTimer = pauseDuration;
                    }

                    if (offset <= 0) {
                        offset = 0;
                        direction = 1;
                        pauseTimer = pauseDuration;
                    }

                    container.scrollTop = offset;
                }
            } else {
                offset = container.scrollTop; // continue from current scroll
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
    async function createDataContainerFromJSON(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error("Failed to fetch JSON");
            const data = await response.json(); // your array of objects

            if (jsonUrl === "https://pleskdata.qnimbus.nl/plesk_status.json") {
                const dataContainer = data.map((item, i) => {
                    const { bgColor, textColor } = getColors(item.status);

                    return createElement('div', {
                        styles: {
                            margin: "4px",
                            backgroundColor: "#f9f9f9",
                            whiteSpace: "nowrap",
                            overflowX: "auto",
                            overflowY: "hidden",
                            borderRadius: "8px",
                            padding: "5px",
                            boxShadow: "0 2px 4px #ccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: bgColor,
                            color: textColor,
                        },
                        html: `<div class="scrolling-text"><span>${item.url}</span></div>`,
                    });
                });

                return dataContainer;
            } else if (jsonUrl === "https://pleskdata.qnimbus.nl/plesk_stats.json") {
                return [
                    createProgressBar({
                        prefix: "Memory Usage",
                        suffix: `${((data.server.get.result.stat.mem.used/data.server.get.result.stat.mem.total)*100).toFixed()}%`,
                        value: data.server.get.result.stat.mem.used,
                        max: data.server.get.result.stat.mem.total
                    }),
                    createProgressBar({
                        prefix: "Storage Usage",
                        suffix: `${((data.server.get.result.stat.diskspace.device.used/data.server.get.result.stat.diskspace.device.total)*100).toFixed()}%`,
                        value: data.server.get.result.stat.diskspace.device.used,
                        max: data.server.get.result.stat.diskspace.device.total
                    }),
                ];
            }
        } catch (error) {
            console.error("Error loading JSON:", error);
            return [];
        }
    }

    (async () => {
        const header = createElement('div', {
            styles: {
                height: "10vh",
                lineHeight: "100%",
                textAlign: "center",
                backgroundColor: accentColor,
                color: "white",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            children: [
                createElement('h1', { text: "Plesk Dashboard" })
            ],
        });
        const page = createElement('div', {
            styles: {
                height: "85vh",
            },
            children: [
                createElement('div', {
                    styles: { height: "100%", overflow: "auto" },
                    classes: "vertical-scroll-wrapper",
                    children: [
                        createElement('div', {
                            styles: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" },
                            classes: "vertical-scroll-grid",
                            children: await createDataContainerFromJSON('https://pleskdata.qnimbus.nl/plesk_status.json')
                        })
                    ]
                })
            ]
        });
        const footer = createElement('div', {
            styles: {
                height: "5vh",
                textAlign: "center",
                backgroundColor: accentColor,
                color: "white",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                fontSize: ".8em",
            },
            children: await createDataContainerFromJSON('https://pleskdata.qnimbus.nl/plesk_stats.json')
        });

        document.getElementById('app').replaceChildren(header, page, footer);
        enableVerticalScroll('.vertical-scroll-wrapper', .1);
        enableAutoScroll();
    })();
}