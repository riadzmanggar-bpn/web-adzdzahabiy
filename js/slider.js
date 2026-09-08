/* ==========================================================
   UNIVERSAL SLIDER
   Mendukung:
   1. Image Slider
   2. Card Slider
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sliders =
        document.querySelectorAll("[data-slider]");


    sliders.forEach(function (slider) {

        initSlider(slider);

    });

});


/* ==========================================================
   INITIALIZE SLIDER
========================================================== */

function initSlider(slider) {

    const type =
        slider.dataset.sliderType || "image";


    if (type === "cards") {

        initCardSlider(slider);

    } else {

        initImageSlider(slider);

    }

}


/* ==========================================================
   CARD SLIDER
========================================================== */

function initCardSlider(slider) {

    const slides =
        slider.querySelectorAll(
            "[data-slider-slide]"
        );


    const dotsContainer =
        slider.querySelector(
            "[data-slider-dots]"
        );


    if (!slides.length) {
        return;
    }


    let currentIndex = 0;

    let timer;


    /* ======================================================
       BUAT BULLET
    ====================================================== */

    slides.forEach(function (_, index) {

        const dot =
            document.createElement("button");

        dot.type = "button";

        dot.className =
            "slider-dot";


        dot.setAttribute(
            "aria-label",
            "Tampilkan highlight " +
            (index + 1)
        );


        dot.addEventListener(
            "click",
            function () {

                showSlide(index);

                restartSlider();

            }
        );


        if (dotsContainer) {

            dotsContainer.appendChild(dot);

        }

    });


    /* ======================================================
       TAMPILKAN SLIDE
    ====================================================== */

    function showSlide(index) {

        if (
            index < 0 ||
            index >= slides.length
        ) {
            return;
        }


        currentIndex = index;


        slides.forEach(
            function (slide, slideIndex) {

                slide.classList.toggle(
                    "active",
                    slideIndex === currentIndex
                );

            }
        );


        updateDots();

    }


    /* ======================================================
       UPDATE BULLET
    ====================================================== */

    function updateDots() {

        if (!dotsContainer) {
            return;
        }


        const dots =
            dotsContainer.querySelectorAll(
                ".slider-dot"
            );


        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    /* ======================================================
       AUTO PLAY
    ====================================================== */

    function startSlider() {

        const interval =
            parseInt(
                slider.dataset.interval,
                10
            ) || 5000;


        timer =
            setInterval(function () {

                let next =
                    currentIndex + 1;


                if (
                    next >= slides.length
                ) {

                    next = 0;

                }


                showSlide(next);

            }, interval);

    }


    /* ======================================================
       RESTART
    ====================================================== */

    function restartSlider() {

        clearInterval(timer);

        startSlider();

    }


    /* ======================================================
       INITIAL
    ====================================================== */

    showSlide(0);

    startSlider();

}


/* ==========================================================
   IMAGE SLIDER
   Untuk donasi dan slider gambar lainnya
========================================================== */

function initImageSlider(slider) {

    const items =
        slider.querySelectorAll(
            "[data-slider-item]"
        );


    const display =
        slider.querySelector(
            "[data-slider-display]"
        );


    const link =
        slider.querySelector(
            "[data-slider-link]"
        );


    const dotsContainer =
        slider.querySelector(
            "[data-slider-dots]"
        );


    if (
        !items.length ||
        !display
    ) {

        return;

    }


    let currentIndex = 0;

    let timer;


    const slides =
        Array.from(items).map(
            function (item) {

                return {

                    image:
                        item.dataset.image,

                    link:
                        item.dataset.link || "#",

                    alt:
                        item.dataset.alt || ""

                };

            }
        );


    /* ======================================================
       BUAT BULLET
    ====================================================== */

    slides.forEach(function (_, index) {

        const dot =
            document.createElement("button");

        dot.type = "button";

        dot.className =
            "slider-dot";


        dot.setAttribute(
            "aria-label",
            "Tampilkan gambar " +
            (index + 1)
        );


        dot.addEventListener(
            "click",
            function () {

                showSlide(index);

                restartSlider();

            }
        );


        if (dotsContainer) {

            dotsContainer.appendChild(dot);

        }

    });


    /* ======================================================
       SHOW SLIDE
    ====================================================== */

    function showSlide(index) {

        currentIndex = index;


        const slide =
            slides[currentIndex];


        display.style.opacity = "0";


        setTimeout(function () {

            display.src =
                slide.image;

            display.alt =
                slide.alt;


            if (link) {

                link.href =
                    slide.link;

            }


            display.style.opacity =
                "1";

        }, 300);


        updateDots();

    }


    /* ======================================================
       UPDATE DOTS
    ====================================================== */

    function updateDots() {

        if (!dotsContainer) {
            return;
        }


        const dots =
            dotsContainer.querySelectorAll(
                ".slider-dot"
            );


        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    /* ======================================================
       AUTO PLAY
    ====================================================== */

    function startSlider() {

        const interval =
            parseInt(
                slider.dataset.interval,
                10
            ) || 5000;


        timer =
            setInterval(function () {

                let next =
                    currentIndex + 1;


                if (
                    next >= slides.length
                ) {

                    next = 0;

                }


                showSlide(next);

            }, interval);

    }


    /* ======================================================
       RESTART
    ====================================================== */

    function restartSlider() {

        clearInterval(timer);

        startSlider();

    }


    /* ======================================================
       INITIAL
    ====================================================== */

    showSlide(0);

    startSlider();

}