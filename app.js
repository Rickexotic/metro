/* ==================================================
   OUTSIDE COMMERCIAL FRAMEWORK
   APP.JS
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

    autoBtn.addEventListener(
        "click",
        () => {

            autoplayEnabled = true;

            startIntroSequence();

        }
    );

    manualBtn.addEventListener(
        "click",
        () => {

            autoplayEnabled = false;

            startIntroSequence();

        }
    );

}

async function startIntroSequence() {

    disableIntroButtons();

    await playTypingSequence();

    revealLogo();

    await wait(1600);

    hideIntro();

    showNavigation();

    activateSlide(0);

    buildPagination();

    if (autoplayEnabled) {

        startAutoplay();

    }

}

function disableIntroButtons() {

    document
        .querySelectorAll(
            ".intro-mode"
        )
        .forEach(
            btn =>
                btn.disabled = true
        );

}

async function playTypingSequence() {

    const typedText =
        document.getElementById(
            "typedText"
        );

    const typingAudio =
        document.getElementById(
            "typingAudio"
        );

    const text =
        "Outside Co.";

    typedText.textContent = "";

    try {

        typingAudio.currentTime = 0;

        await typingAudio.play();

    } catch (error) {}

    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        typedText.textContent +=
            text[i];

        await wait(120);

    }

}

function revealLogo() {

    document
        .getElementById(
            "outsideLogo"
        )
        .classList.add(
            "visible"
        );

}

function hideIntro() {

    document
        .getElementById(
            "intro"
        )
        .classList.add(
            "hidden"
        );

}

function showNavigation() {

    document
        .getElementById(
            "sideNav"
        )
        .classList.remove(
            "hidden"
        );

}

/* ==================================================
   RENDER
   ================================================== */

function renderSlides() {

    const container =
        document.getElementById(
            "slidesContainer"
        );

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

            container.appendChild(
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

    toggleClosingActions();

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

            const page =
                document.createElement(
                    "a"
                );

            page.href = "#";

            page.textContent =
                String(index + 1)
                .padStart(2, "0");

            page.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    stopAutoplay();

                    activateSlide(
                        index
                    );

                }

            );

            pageWindow.append(
                page
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

    autoplayEnabled = true;

    updateModeIcon();

    autoplayTimer =
        setInterval(

            nextSlide,

            CONFIG.AUTOPLAY_DELAY

        );

}

function stopAutoplay() {

    autoplayEnabled = false;

    clearInterval(
        autoplayTimer
    );

    autoplayTimer = null;

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

    const icon =
        document.getElementById(
            "audioIcon"
        );

    ambientEnabled =
        !ambientEnabled;

    if (
        ambientEnabled
    ) {

        music.volume = 0.2;

        music.play();

        icon.src =
            "iconos/volume-2.svg";

    } else {

        music.pause();

        icon.src =
            "iconos/volume-2.svg";

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

                document.body.classList.toggle(
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
   PROGRESS BAR
   ================================================== */

function updateProgress() {

    const progress =

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
            `${progress}%`;

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

function toggleClosingActions() {

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

function savePresentation() {

    const html =
        document.documentElement.outerHTML;

    const blob =
        new Blob(
            [html],
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

    const shareButton =
        document.getElementById(
            "shareBtn"
        );

    const menu =
        document.getElementById(
            "shareMenu"
        );

    shareButton.addEventListener(
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
