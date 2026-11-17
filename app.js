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
   BOOT
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

const autoBtn =
    document.getElementById(
        "autoMode"
    );

const manualBtn =
    document.getElementById(
        "manualMode"
    );

if (!autoBtn || !manualBtn) {

    console.error(
        "No se encontraron autoMode o manualMode"
    );

    return;

}

autoBtn.addEventListener(
   
        "click",

        async () => {

            autoplayEnabled =
                true;

            await startIntro();

        }

    );

    manualBtn.addEventListener(

        "click",

        async () => {

            autoplayEnabled =
                false;

            await startIntro();

        }

    );

}

async function startIntro() {

    document
        .getElementById(
            "introSelector"
        )
        .classList.add(
            "hidden"
        );

    const search =
        document.getElementById(
            "searchStage"
        );

    search.classList.add(
        "active"
    );

    await playTyping();

    await wait(500);

    search.classList.remove(
        "active"
    );

    const logoStage =
        document.getElementById(
            "logoStage"
        );

    logoStage.classList.add(
        "active"
    );

    const logo =
        document.getElementById(
            "outsideLogo"
        );

    logo.classList.add(
        "visible"
    );

    await wait(2000);

    logo.classList.remove(
        "visible"
    );

    await wait(600);

    document
        .getElementById(
            "intro"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "sideNav"
        )
        .classList.remove(
            "hidden"
        );

    activateSlide(0);

    buildPagination();

   if (
    autoplayEnabled
) {

    startAutoplay();

}
else {

    const music =
        document.getElementById(
            "ambientAudio"
        );

    if (music) {

        music.pause();

        music.currentTime = 0;

    }

}

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

        await wait(120);

    }

}

/* ==================================================
   RENDER
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

/* ==================================================
   SLIDES
   ================================================== */

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

        (_, index) => {

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

    const windowStart =
        Math.max(
            0,
            Math.min(
                currentSlide - 2,
                slides.length - 5
            )
        );

    links.forEach(

        (link, index) => {

            link.classList.remove(
                "active"
            );

            link.style.display =
                index >= windowStart &&
                index < windowStart + 5
                    ? "block"
                    : "none";

        }

    );

    links[currentSlide]
        ?.classList.add(
            "active"
        );

}

/* ==================================================
   AUTOPLAY
   ================================================== */

function startAutoplay() {

    clearInterval(
        autoplayTimer
    );

    autoplayEnabled =
        true;

    const music =
        document.getElementById(
            "ambientAudio"
        );

    if (music) {

        music.volume = 0.2;

        music.play()
            .catch(() => {});

    }

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

    /* detener música */

    const music =
        document.getElementById(
            "ambientAudio"
        );

    if (music) {

        music.pause();

        music.currentTime = 0;

    }

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

    document
        .getElementById(
            "presentationModeIcon"
        )
        .src =

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

    logo.src =

        document.body.classList.contains(
            "dark"
        )

        ? "assets/outside-logo-white.png"

        : "assets/outside-logo-black.png";

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
   PDF / SAVE
   ================================================== */

function bindActions() {

    document
        .getElementById(
            "pdfBtn"
        )
        .addEventListener(

            "click",

            () => window.print()

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
                document.documentElement.outerHTML
            ],

            {
                type:"text/html"
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

                location.href =
                    `mailto:?subject=${document.title}&body=${location.href}`;

            }

        );

    document
        .getElementById(
            "whatsappBtn"
        )
        .addEventListener(

            "click",

            () => {

                window.open(

                    `https://wa.me/?text=${encodeURIComponent(document.title + " " + location.href)}`,

                    "_blank"

                );

            }

        );

}

/* ==================================================
   CLOSING
   ================================================== */

function updateClosing() {

    const panel =
        document.getElementById(
            "presentationActions"
        );

    if (
        currentSlide ===
        slides.length - 1
    ) {

        panel.classList.remove(
            "hidden"
        );

    } else {

        panel.classList.add(
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
