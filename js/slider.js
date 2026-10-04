/* ==========================================================
   UNIVERSAL SLIDER
   Mendukung:
   1. Image Slider
   2. Highlight / Content Slider
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

    /*
       Semua slider sekarang menggunakan
       sistem data-slider-item.

       Jika masih ada slider lama dengan
       data-slider-type="cards", tetap didukung.
    */

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
   SISTEM LAMA
   Tetap dipertahankan agar halaman lain
   tidak rusak.
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
   IMAGE / CONTENT SLIDER
   Digunakan oleh:
   - Donasi
   - Highlight Beranda
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


    const links =
        slider.querySelectorAll(
            "[data-slider-link]"
        );


    const dotsContainer =
        slider.querySelector(
            "[data-slider-dots]"
        );


    /*
       Elemen tambahan untuk Highlight.
       Tidak wajib ada pada slider Donasi.
    */

    const badge =
        slider.querySelector(
            "[data-slider-badge]"
        );


    const date =
        slider.querySelector(
            "[data-slider-date]"
        );


    const title =
        slider.querySelector(
            "[data-slider-title]"
        );


    const description =
        slider.querySelector(
            "[data-slider-description]"
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
       AMBIL DATA SLIDE
    ====================================================== */

    const slides =
        Array.from(items).map(
            function (item) {

                return {

                    image:
                        item.dataset.image,

                    link:
                        item.dataset.link || "#",

                    alt:
                        item.dataset.alt || "",

                    badge:
                        item.dataset.badge || "",

                    date:
                        item.dataset.date || "",

                    title:
                        item.dataset.title || "",

                    description:
                        item.dataset.description || ""

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
            "Tampilkan slide " +
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

        if (
            index < 0 ||
            index >= slides.length
        ) {

            return;

        }


        currentIndex = index;


        const slide =
            slides[currentIndex];


        /*
           Fade hanya jika slider mempunyai
           lebih dari satu slide.
        */

        display.style.opacity = "0";


        setTimeout(function () {

            display.src =
                slide.image;

            display.alt =
                slide.alt;


            /* ==============================================
               UPDATE SEMUA LINK
            ============================================== */

            links.forEach(function (link) {

                link.href =
                    slide.link;

            });


            /* ==============================================
               UPDATE BADGE
               Hanya Highlight yang punya elemen ini.
            ============================================== */

            if (badge) {

                badge.textContent =
                    slide.badge;

            }


            /* ==============================================
               UPDATE TANGGAL
            ============================================== */

            if (date) {

                date.textContent =
                    slide.date;

            }


            /* ==============================================
               UPDATE JUDUL
            ============================================== */

            if (title) {

                title.textContent =
                    slide.title;

            }


            /* ==============================================
               UPDATE DESKRIPSI
            ============================================== */

            if (description) {

                description.textContent =
                    slide.description;

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

/* ==========================================================
   HIGHLIGHT BERANDA
   DESKTOP = 3 CARD
   MOBILE  = 1 CARD
   ROTASI  = 1 CARD SETIAP 5 DETIK
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("highlightCards");

    const timerBar =
        document.getElementById("highlightTimerBar");

    const dotsContainer =
        document.getElementById("highlightDots");


    if (!container) {
        return;
    }


    const cards =
        Array.from(
            container.querySelectorAll(".highlight-card")
        );

        /* ======================================================
        TOMBOL PANAH
        ====================================================== */

        const prevButton =
            document.createElement("button");

        const nextButton =
            document.createElement("button");


        prevButton.type = "button";
        nextButton.type = "button";


        prevButton.className =
            "highlight-arrow highlight-arrow-prev";

        nextButton.className =
            "highlight-arrow highlight-arrow-next";


        prevButton.innerHTML = "&#10094;";
        nextButton.innerHTML = "&#10095;";


        prevButton.setAttribute(
            "aria-label",
            "Berita sebelumnya"
        );

        nextButton.setAttribute(
            "aria-label",
            "Berita berikutnya"
        );


        container.parentElement.insertBefore(
            prevButton,
            container
        );

        container.parentElement.insertBefore(
            nextButton,
            container.nextSibling
        );

    if (!cards.length) {
        return;
    }


    const interval = 5000;

    let currentIndex = 0;

    let timer = null;


    /* ======================================================
       JUMLAH CARD TERLIHAT
    ====================================================== */

    function getVisibleCount() {

        if (window.innerWidth <= 767) {
            return 1;
        }

        return Math.min(3, cards.length);

    }


    /* ======================================================
       BUAT DOT
       1 CARD = 1 DOT
    ====================================================== */

    function createDots() {

        if (!dotsContainer) {
            return;
        }

        dotsContainer.innerHTML = "";


        cards.forEach(function (_, index) {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "highlight-dot";


            dot.setAttribute(
                "aria-label",
                "Tampilkan posisi " + (index + 1)
            );


            dot.addEventListener(
                "click",
                function () {

                    currentIndex = index;

                    showCards();

                    restartTimer();

                }
            );


            dotsContainer.appendChild(dot);

        });

    }


    /* ======================================================
       TAMPILKAN CARD
    ====================================================== */
    function showCards() {

        const visibleCount =
            window.innerWidth <= 767
                ? 1
                : Math.min(3, cards.length);


        cards.forEach(function (card, index) {

            const relativeIndex =
                (
                    index -
                    currentIndex +
                    cards.length
                ) % cards.length;


            const shouldShow =
                relativeIndex < visibleCount;


            card.classList.toggle(
                "is-visible",
                shouldShow
            );


            /*
            * Atur urutan card yang tampil.
            *
            * currentIndex = 0
            * 1 - 2 - 3
            *
            * currentIndex = 1
            * 2 - 3 - 4
            *
            * currentIndex = 2
            * 3 - 4 - 5
            *
            * currentIndex = 3
            * 4 - 5 - 1
            *
            * currentIndex = 4
            * 5 - 1 - 2
            */

            card.style.order =
                relativeIndex;

        });


        updateDots();

    }


    /* ======================================================
       UPDATE DOT
    ====================================================== */

    function updateDots() {

        if (!dotsContainer) {
            return;
        }


        const dots =
            dotsContainer.querySelectorAll(
                ".highlight-dot"
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
       NEXT
    ====================================================== */

    function nextSlide() {

        if (
            cards.length <=
            getVisibleCount()
        ) {
            return;
        }


        /*
         * MAJU TEPAT 1 CARD
         */

        currentIndex =
            (currentIndex + 1) %
            cards.length;


        showCards();

        resetTimerBar();

    }


    /* ======================================================
    PREVIOUS
    ====================================================== */

    function prevSlide() {

        if (
            cards.length <=
            getVisibleCount()
        ) {
            return;
        }


        currentIndex =
            (
                currentIndex -
                1 +
                cards.length
            ) % cards.length;


        showCards();

        resetTimerBar();

    }

    /* ======================================================
    EVENT TOMBOL PANAH
    ====================================================== */

    prevButton.addEventListener(
        "click",
        function () {

            prevSlide();

            restartTimer();

        }
    );


    nextButton.addEventListener(
        "click",
        function () {

            nextSlide();

            restartTimer();

        }
    );

    /* ======================================================
    SWIPE MOBILE
    ====================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    container.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    container.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;


            const swipeDistance =
                touchEndX -
                touchStartX;


            /*
            * Swipe kiri
            * → berita berikutnya
            */

            if (swipeDistance < -50) {

                nextSlide();

                restartTimer();

            }


            /*
            * Swipe kanan
            * → berita sebelumnya
            */

            if (swipeDistance > 50) {

                prevSlide();

                restartTimer();

            }

        },
        {
            passive: true
        }
    );

    /* ======================================================
       TIMER BAR
    ====================================================== */

    function resetTimerBar() {

        if (!timerBar) {
            return;
        }


        if (
            cards.length <=
            getVisibleCount()
        ) {

            timerBar.style.transition =
                "none";

            timerBar.style.width =
                "0%";

            return;

        }


        timerBar.style.transition =
            "none";

        timerBar.style.width =
            "0%";


        void timerBar.offsetWidth;


        timerBar.style.transition =
            "width " +
            interval +
            "ms linear";

        timerBar.style.width =
            "100%";

    }


    /* ======================================================
       START TIMER
    ====================================================== */

    function startTimer() {

        clearInterval(timer);


        if (
            cards.length <=
            getVisibleCount()
        ) {
            return;
        }


        timer =
            setInterval(
                nextSlide,
                interval
            );

    }


    /* ======================================================
       RESTART TIMER
    ====================================================== */

    function restartTimer() {

        clearInterval(timer);

        resetTimerBar();

        startTimer();

    }


    /* ======================================================
       RESIZE
    ====================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(
                    function () {

                        showCards();

                        restartTimer();

                    },
                    150
                );

        }
    );


    /* ======================================================
       INITIAL
    ====================================================== */

    createDots();

    showCards();

    resetTimerBar();

    startTimer();

});