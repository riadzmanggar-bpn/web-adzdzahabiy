/* ==========================================================
   UNIVERSAL SLIDER
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sliders =
        document.querySelectorAll("[data-slider]");


    sliders.forEach(function (slider) {

        initSlider(slider);

    });

});


/* ==========================================================
   INITIALIZE
========================================================== */

function initSlider(slider) {

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


    /* ======================================================
       DATA
    ====================================================== */

    const slides =
        Array.from(items).map(function (item) {

            return {

                image:
                    item.dataset.image,

                link:
                    item.dataset.link || "#",

                alt:
                    item.dataset.alt || ""

            };

        });


    /* ======================================================
       DOTS
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


        dotsContainer.appendChild(dot);

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


            display.style.opacity = "1";

        }, 300);


        updateDots();

    }


    /* ======================================================
       UPDATE DOTS
    ====================================================== */

    function updateDots() {

        const dots =
            dotsContainer.querySelectorAll(
                ".slider-dot"
            );


        dots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });

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
       START
    ====================================================== */

    showSlide(0);

    startSlider();

}