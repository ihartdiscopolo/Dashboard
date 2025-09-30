function enableVerticalScroll(
    speed = 0.5,
    pauseDuration = 100
) {
    const container = document.querySelector("#card-container");
    if (!container) return;

    let offset = container.scrollTop;
    let direction = 1; // 1 = down, -1 = up
    let paused = false;
    let pauseTimer = 0;

    container.style.overflowY = "hidden";

    container.addEventListener("mouseenter", () => {
        paused = true;
        container.style.overflowY = "auto"; // allow manual scroll
    });

    container.addEventListener("mouseleave", () => {
        paused = false;
        container.style.overflowY = "hidden"; // resume auto-scroll
    });

    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return; // nothing to scroll

    function step() {
    if (!paused) {
        if (pauseTimer > 0) {
            pauseTimer -= 16; // ~60fps frame
        } else {
            offset += speed * direction;

            // recheck maxScroll in case layout changed
            const maxScroll = container.scrollHeight - container.clientHeight;

            if (direction === 1 && offset >= maxScroll) {
                offset = maxScroll;
                direction = -1;
                pauseTimer = pauseDuration;
            } else if (direction === -1 && offset <= 0) {
                offset = 0;
                direction = 1;
                pauseTimer = pauseDuration;
            }

            container.scrollTop = Math.round(offset); // clamp to integer
        }
    } else {
        offset = container.scrollTop; // resume from manual scroll
    }

    requestAnimationFrame(step);
}

    requestAnimationFrame(step);
}
