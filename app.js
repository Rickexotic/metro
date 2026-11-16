/* ==================================================
   OUTSIDE COMMERCIAL FRAMEWORK
   APP
   ================================================== */

const CONFIG = {

    AUTOPLAY_DELAY: 5000

};

let slides = [];

let currentSlide = 0;

let autoplay = false;

let autoplayTimer = null;

let ambientEnabled = false;

/* ==================================================
   START
   ================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        const content = await loadContent();

        renderSlides(content);

        initializeIntro();

        initializeTheme();

        initializeAudio();

    }

);

/* ==================================================
   CONTENT
   ================================================== */

async function loadContent() {

    const response =
        await fetch(
            "data/content.json"
        );

    return response.json();

}

/* ==================================================
   RENDER
   ================================================== */

function renderSlides(content) {

    const container =
        document.getElementById(
            "slidesContainer"
        );

    slides = [];

    content.slides.forEach(

        (slide, index) => {

            const section =
                document.createElement(
                    "section"
                );

            section.className =
                "slide";

            section.id =
                `slide-${index + 1}`;

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
   INTRO
   ================================================== */

function initializeIntro() {

    const autoButton =
        document.getElementById(
            "autoMode"
        );

    const manualButton =
        document.getElementById(
            "manualMode"
        );

    autoButton.addEventListener(

        "click",

        () => {

            autoplay = true;

            startExperience();

        }

    );

    manualButton.addEventListener(

        "click",

        () => {

            autoplay = false;

            startExperience();

        }

    );

}

async function startExperience() {

    const text =
        "Outside Co.";

    const typed =
        document.getElementById(
            "typedText"
        );

    const typingAudio =
        document.getElementById(
            "typingAudio"
        );

    typed.textContent = "";

    try {

        typingAudio.currentTime =
            0;

        typingAudio.play();

    } catch {}

    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        typed.textContent +=
            text[i];

        await delay(120);

    }

    await delay(500);

    document
        .getElementById(
            "outsideLogo"
        )
        .classList.add(
            "visible"
        );

    await delay(1600);

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

    if (autoplay) {

        startAutoplay();

    }

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

    const windowEl =
        document.getElementById(
            "pageWindow"
        );

    windowEl.innerHTML = "";

    slides.forEach(

        (slide, index) => {

            const link =
                document.createElement(
                    "a"
                );

            link.href = "#";

            link.textContent =
                String(index + 1)
                    .padStart(
                        2,
                        "0"
                    );

            link.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    stopAutoplay();

                    activateSlide(
                        index
                    );

                }

            );

            windowEl.append(
                link
            );

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
            "presentationMode"
        )
        .addEventListener(
            "click",
            toggleAutoplay
        );

    updatePagination();

}

function updatePagination() {

    const links =
        document.querySelectorAll(
            "#pageWindow a"
        );

    links.forEach(
        link =>
            link.classList.remove(
                "active"
            )
    );

    if (
        links[currentSlide]
    ) {

        links[currentSlide]
            .classList.add(
                "active"
            );

    }

    updateProgress();

}

/* ==================================================
   AUTOPLAY
   ================================================== */

function startAutoplay() {

    autoplay = true;

    updateModeIcon();

    autoplayTimer =
        setInterval(

            nextSlide,

            CONFIG.AUTOPLAY_DELAY

        );

}

function stopAutoplay() {

    autoplay = false;

    clearInterval(
        autoplayTimer
    );

    autoplayTimer = null;

    updateModeIcon();

}

function toggleAutoplay() {

    if (autoplay) {

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
        autoplay

            ? "iconos/pause-circle.svg"

            : "iconos/play-circle.svg";

}

/* ==================================================
   AUDIO
   ================================================== */

function initializeAudio() {

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

    if (ambientEnabled) {

        music.volume = 0.2;

        music.play();

    } else {

        music.pause();

    }

}

/* ==================================================
   THEME
   ================================================== */

function initializeTheme() {

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

            }

        );

}

/* ==================================================
   PROGRESS
   ================================================== */

function updateProgress() {

    const value =

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

        `${value}%`;

}

/* ==================================================
   HELPERS
   ================================================== */

function delay(ms) {

    return new Promise(

        resolve =>

            setTimeout(
                resolve,
                ms
            )

    );

}
