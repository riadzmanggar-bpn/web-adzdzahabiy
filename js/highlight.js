/* ==========================================================
   HIGHLIGHT TERBARU
   3 CARD AUTO ROTATION
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("highlightCards");

    const timerBar =
        document.getElementById("highlightTimerBar");

    const dotsContainer =
        document.getElementById("highlightDots");


    if (!container) return;


    const cards =
        Array.from(
            container.querySelectorAll(".highlight-card")
        );


    if (!cards.length) return;


    const INTERVAL = 5000;

    let current = 0;

    let timer = null;

    let animationFrame = null;

    let startTime = null;


    /* ======================================================
       BUAT DOT
    ====================================================== */

    cards.forEach(function (_, index) {

        const dot =
            document.createElement("span");

        dot.className =
            "highlight-dot";

        if (index === 0) {
            dot.classList.add("active");
        }

        dotsContainer.appendChild(dot);

    });


    const dots =
        Array.from(
            dotsContainer.querySelectorAll(".highlight-dot")
        );


    /* ======================================================
       DESKTOP
       TAMPILKAN 3 CARD SEKALIGUS
    ====================================================== */

    function renderDesktop() {

        cards.forEach(function (card, index) {

            card.classList.remove("is-visible");

            /*
             * 3 card yang aktif:
             * current
             * current + 1
             * current + 2
             */

            const position =
                (index - current + cards.length)
                % cards.length;

            if (position < 3) {

                card.classList.add("is-visible");

            }

        });

    }


    /* ======================================================
       MOBILE
       HANYA 1 CARD
    ====================================================== */

    function renderMobile() {

        cards.forEach(function (card, index) {

            card.classList.toggle(
                "is-visible",
                index === current
            );

        });

    }


    /* ======================================================
       RENDER
    ====================================================== */

    function render() {

        if (
            window.innerWidth <= 767
        ) {

            renderMobile();

        } else {

            renderDesktop();

        }


        dots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === current
            );

        });

    }


    /* ======================================================
       TIMER ANIMATION
    ====================================================== */

    function animateTimer(timestamp) {

        if (!startTime) {

            startTime = timestamp;

        }


        const elapsed =
            timestamp - startTime;


        const progress =
            Math.min(
                elapsed / INTERVAL,
                1
            );


        timerBar.style.width =
            (progress * 100) + "%";


        if (progress < 1) {

            animationFrame =
                requestAnimationFrame(
                    animateTimer
                );

        }

    }


    /* ======================================================
       NEXT
    ====================================================== */

    function next() {

        current++;

        if (current >= cards.length) {

            current = 0;

        }


        render();


        startTimer();

    }


    /* ======================================================
       START TIMER
    ====================================================== */

    function startTimer() {

        clearTimeout(timer);

        cancelAnimationFrame(
            animationFrame
        );


        startTime = null;

        timerBar.style.width = "0%";


        animationFrame =
            requestAnimationFrame(
                animateTimer
            );


        timer =
            setTimeout(
                next,
                INTERVAL
            );

    }


    /* ======================================================
       CLICK DOT
    ====================================================== */

    dots.forEach(function (dot, index) {

        dot.addEventListener(
            "click",
            function () {

                current = index;

                render();

                startTimer();

            }
        );

    });


    /* ======================================================
       RESIZE
    ====================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    render,
                    150
                );

        }
    );


    /* ======================================================
       START
    ====================================================== */

    render();

    startTimer();

});