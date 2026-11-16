/* ==================================================
   OUTSIDE COMMERCIAL FRAMEWORK
   APP
   ================================================== */

const CONFIG = {
    AUTOPLAY_DELAY: 5000
};

let presentationData = null;
let slides = [];

let currentSlide = 0;

let autoplayEnabled = false;
let autoplayTimer = null;

let ambientEnabled = false;

/* ==================================================
   START
   ================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

async function initializeApp() {

    presentationData =
        await loadContent();

    renderSlides();

    bindIntro();

    bindTheme();

    bindAudio();

    bindShare();

    bindActions();

}

/* ==================================================
   DATA
   ================================================== */

async function loadContent() {

    const response =
        await fetch(
            "data/content.json"
        );

    return response.json();

}

/* ==================================================
   INTRO
   ================================================== */

function bindIntro() {

    document
        .getElementById(
            "autoMode"
        )
        .addEventListener(

            "click",

            async () => {

                autoplayEnabled =
                    true;

                await startExperience();

                startAutoplay();

            }

        );

    document
        .getElementById(
            "manualMode"
        )
        .addEventListener(

            "click",

            async () => {

                autoplayEnabled =
                    false;

                await startExperience();

            }

        );

}

async function startExperience() {

    await playTyping();

    await revealLogo();

    document
        .getElementById(
            "intro"
        )
        .classList.add(
            "hidden"
        );

    activateSlide(0);

    buildPagination();

}

async function playTyping() {

    const text =
        "Outside Co.";

    const target =
        document.getElementById(
            "typedText"
        );

    const audio =
        document.getElementById(
            "typingAudio"
        );

    target.textContent = "";

    try {

        audio.currentTime = 0;

        await audio.play();

    } catch (e) {}

    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        target.textContent +=
            text[i];

        await wait(100);

    }

}

async function revealLogo() {

    const logo =
        document.getElementById(
            "outsideLogo"
        );

    logo.classList.add(
        "visible"
    );

    await wait(1600);

}

/* ==================================================
   SLIDES
   ================================================== */

function renderSlides() {

    const container =
        document.getElementById(
            "slidesContainer"
        );

    slides = [];

    presentationData.slides.forEach(

        slide => {

            const section =
                document.createElement(
                    "section"
                );

            section.className =
                "slide";

            section.innerHTML = `

                <div class="slide-content">

                    <div class="eyebrow">

                        ${slide.eyebrow || ""}

                    </div>

                    <h1>

                        ${slide.title}

                    </h1>

                    <p>

                        ${slide.text || ""}

                    </p>

                </div>

            `;

            container.append(
                section
            );

            slides.push(
                section
            );

        }

    );

}

function activateSlide(index) {

    slides.forEach(

        slide =>
            slide.classList.remove(
                "active"
            )

    );

    currentSlide = index;

    slides[index]
        .classList.add(
            "active"
        );

    updatePagination();

    updateProgress();

    updateClosing();

}

function nextSlide() {

    if (
        currentSlide >=
        slides.length - 1
    ) {

        stopAutoplay();

        return;

    }

    activateSlide(
        currentSlide + 1
    );

}

function previousSlide() {

    activateSlide(

        Math.max(
            0,
            currentSlide - 1
        )

    );

}

/* ==================================================
   PAGINATION
   ================================================== */

function buildPagination() {

    const pageWindow =
        document.getElementById(
            "pageWindow"
        );

    pageWindow.innerHTML = "";

    slides.forEach(

        (slide, index) => {

            const link =
                document.createElement(
                    "a"
                );

            link.href = "#";

            link.textContent =
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                );

            link.addEventListener(

                "click",

                e => {

                    e.preventDefault();

                    stopAutoplay();

                    activateSlide(
                        index
                    );

                }

            );

            pageWindow.append(
                link
            );

        }

    );

    document
        .getElementById(
            "goNext"
        )
        .addEventListener(

            "click",

            () => {

                stopAutoplay();

                nextSlide();

            }

        );

    document
        .getElementById(
            "goPrevious"
        )
        .addEventListener(

            "click",

            () => {

                stopAutoplay();

                previousSlide();

            }

        );

    document
        .getElementById(
            "presentationMode"
        )
        .addEventListener(

            "click",

            toggleAutoplay

        );

}

function updatePagination() {

    const links =
        Array.from(
            document.querySelectorAll(
                "#pageWindow a"
            )
        );

    links.forEach(
        link =>
            link.classList.remove(
                "active"
            )
    );

    const start =
        Math.max(
            0,
            Math.min(
                currentSlide - 2,
                slides.length - 5
            )
        );

    links.forEach(

        (link, index) => {

            const visible =
                index >= start &&
                index < start + 5;

            link.style.display =
                visible
                    ? "block"
                    : "none";

        }

    );

    if (
        links[currentSlide]
    ) {

        links[currentSlide]
            .classList.add(
                "active"
            );

    }

}

/* ==================================================
   AUTOPLAY
   ================================================== */

function startAutoplay() {

    stopAutoplay();

    autoplayEnabled =
        true;

    updateModeIcon();

    autoplayTimer =
        setInterval(

            nextSlide,

            CONFIG.AUTOPLAY_DELAY

        );

}

function stopAutoplay() {

    clearInterval(
        autoplayTimer
    );

    autoplayTimer = null;

    autoplayEnabled =
        false;

    updateModeIcon();

}

function toggleAutoplay() {

    if (
        autoplayEnabled
    ) {

        stopAutoplay();

    } else {

        startAutoplay();

    }

}

function updateModeIcon() {

    const icon =
        document.getElementById(
            "presentationModeIcon"
        );

    icon.src =
        autoplayEnabled

            ? "iconos/pause-circle.svg"

            : "iconos/play-circle.svg";

}

/* ==================================================
   AUDIO
   ================================================== */

function bindAudio() {

    document
        .getElementById(
            "audioToggle"
        )
        .addEventListener(

            "click",

            toggleAudio

        );

}

function toggleAudio() {

    const music =
        document.getElementById(
            "ambientAudio"
        );

    ambientEnabled =
        !ambientEnabled;

    if (
        ambientEnabled
    ) {

        music.volume = 0.2;

        music.play();

    } else {

        music.pause();

    }

}

/* ==================================================
   THEME
   ================================================== */

function bindTheme() {

    document
        .getElementById(
            "themeToggle"
        )
        .addEventListener(

            "click",

            () => {

                document.body
                    .classList.toggle(
                        "dark"
                    );

                updateLogo();

            }

        );

}

function updateLogo() {

    const logo =
        document.getElementById(
            "outsideLogo"
        );

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        logo.src =
            "assets/outside-logo-white.png";

    } else {

        logo.src =
            "assets/outside-logo-black.png";

    }

}

/* ==================================================
   PROGRESS
   ================================================== */

function updateProgress() {

    const percent =

        (
            (
                currentSlide + 1
            )
            /
            slides.length
        ) * 100;

    document
        .getElementById(
            "progressBar"
        )
        .style.height =
            `${percent}%`;

}

/* ==================================================
   ACTIONS
   ================================================== */

function bindActions() {

    document
        .getElementById(
            "pdfBtn"
        )
        .addEventListener(

            "click",

            () => {

                window.print();

            }

        );

    document
        .getElementById(
            "saveBtn"
        )
        .addEventListener(

            "click",

            savePresentation

        );

}

function savePresentation() {

    const blob =
        new Blob(

            [
                document
                    .documentElement
                    .outerHTML
            ],

            {
                type:
                    "text/html"
            }

        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "outside-metro.html";

    link.click();

}

/* ==================================================
   SHARE
   ================================================== */

function bindShare() {

    const menu =
        document.getElementById(
            "shareMenu"
        );

    document
        .getElementById(
            "shareBtn"
        )
        .addEventListener(

            "click",

            () => {

                menu.classList.toggle(
                    "open"
                );

            }

        );

    document
        .getElementById(
            "mailBtn"
        )
        .addEventListener(

            "click",

            () => {

                const url =
                    encodeURIComponent(
                        location.href
                    );

                const title =
                    encodeURIComponent(
                        document.title
                    );

                location.href =
                    `mailto:?subject=${title}&body=${url}`;

            }

        );

    document
        .getElementById(
            "whatsappBtn"
        )
        .addEventListener(

            "click",

            () => {

                const text =
                    encodeURIComponent(
                        `${document.title} ${location.href}`
                    );

                window.open(

                    `https://wa.me/?text=${text}`,

                    "_blank"

                );

            }

        );

}

/* ==================================================
   CLOSING
   ================================================== */

function updateClosing() {

    const actions =
        document.getElementById(
            "presentationActions"
        );

    if (
        currentSlide ===
        slides.length - 1
    ) {

        actions.classList.remove(
            "hidden"
        );

    } else {

        actions.classList.add(
            "hidden"
        );

    }

}

/* ==================================================
   HELPERS
   ================================================== */

function wait(ms) {

    return new Promise(

        resolve =>
            setTimeout(
                resolve,
                ms
            )

    );

}
