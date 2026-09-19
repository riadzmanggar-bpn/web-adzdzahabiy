/* ==========================================================
   SCROLL REVEAL
   RTQ AL IMAM ADZ DZAHABIY
========================================================== */


/* ==========================================================
   INTERSECTION OBSERVER
========================================================== */

let scrollRevealObserver = null;
let footerRevealObserver = null;


/* ==========================================================
   PASANG REVEAL PADA ELEMENT
========================================================== */

function setupRevealElement(element) {


    /* ------------------------------------------------------
       Jangan dipasang dua kali
    ------------------------------------------------------ */

    if (
        element.dataset.revealReady === "true"
    ) {
        return;
    }

    element.dataset.revealReady =
        "true";


    /* ======================================================
       PASANG DELAY
    ====================================================== */

    const delay =
        element.dataset.delay;


    if (delay) {


        let finalDelay =
            delay;


        /* ----------------------------------------------
           MOBILE
           Percepat delay
        ---------------------------------------------- */

        if (
            window.innerWidth <= 767.98
        ) {

            const seconds =
                parseFloat(
                    delay
                );


            if (
                !isNaN(seconds)
            ) {

                finalDelay =
                    (
                        seconds * 0.7
                    ) + "s";

            }

        }


        element.style.transitionDelay =
            finalDelay;

    }


    /* ======================================================
       OBSERVER TIDAK TERSEDIA
    ====================================================== */

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        element.classList.add(
            "is-visible"
        );

        return;

    }


    /* ======================================================
       PILIH OBSERVER
    ====================================================== */

    if (
        element.classList.contains(
            "footer-bottom-reveal"
        )
    ) {

        if (
            footerRevealObserver
        ) {

            footerRevealObserver.observe(
                element
            );

        }

    } else {


        if (
            scrollRevealObserver
        ) {

            scrollRevealObserver.observe(
                element
            );

        }

    }

}


/* ==========================================================
   INIT SCROLL REVEAL
========================================================== */

function initScrollReveal() {


    const revealElements =
        document.querySelectorAll(
            "[data-reveal]"
        );


    revealElements.forEach(
        function (element) {

            setupRevealElement(
                element
            );

        }
    );

}


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ==================================================
           BUAT INTERSECTION OBSERVER
        ================================================== */

        if (
            "IntersectionObserver"
            in window
        ) {


            /* ==============================================
               OBSERVER UTAMA
            ============================================== */

            scrollRevealObserver =
                new IntersectionObserver(

                    function (
                        entries,
                        observer
                    ) {


                        entries.forEach(
                            function (entry) {


                                if (
                                    entry.isIntersecting
                                ) {


                                    entry.target.classList.add(
                                        "is-visible"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },


                    {

                        threshold:
                            0.05,


                        /* ----------------------------------
                           Desktop : 150px
                           Mobile  : -20%
                        ---------------------------------- */

                        rootMargin:
                            window.innerWidth <= 767.98
                                ? "0px 0px -20% 0px"
                                : "0px 0px 150px 0px"

                    }

                );


            /* ==============================================
               OBSERVER KHUSUS FOOTER PALING BAWAH
            ============================================== */

            footerRevealObserver =
                new IntersectionObserver(

                    function (
                        entries,
                        observer
                    ) {


                        entries.forEach(
                            function (entry) {


                                if (
                                    entry.isIntersecting
                                ) {


                                    entry.target.classList.add(
                                        "is-visible"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },


                    {

                        threshold:
                            0.05,


                        /* ----------------------------------
                           Footer bottom :
                           Desktop : 150px
                           Mobile  : 300px
                        ---------------------------------- */

                        rootMargin:
                            "0px 0px 300px 0px"

                    }

                );

        }


        /* ==================================================
           ELEMENT YANG SUDAH ADA
        ================================================== */

        initScrollReveal();


        /* ==================================================
           DETEKSI KOMPONEN DINAMIS
        ================================================== */

        const mutationObserver =
            new MutationObserver(
                function (mutations) {


                    mutations.forEach(
                        function (mutation) {


                            mutation.addedNodes.forEach(
                                function (node) {


                                    if (
                                        node.nodeType !== 1
                                    ) {

                                        return;

                                    }


                                    /* ----------------------------------
                                       Element itu sendiri
                                    ---------------------------------- */

                                    if (
                                        node.matches &&
                                        node.matches(
                                            "[data-reveal]"
                                        )
                                    ) {

                                        setupRevealElement(
                                            node
                                        );

                                    }


                                    /* ----------------------------------
                                       Anak-anaknya
                                    ---------------------------------- */

                                    if (
                                        node.querySelectorAll
                                    ) {


                                        const children =
                                            node.querySelectorAll(
                                                "[data-reveal]"
                                            );


                                        children.forEach(
                                            function (element) {

                                                setupRevealElement(
                                                    element
                                                );

                                            }
                                        );

                                    }

                                }
                            );

                        }
                    );

                }
            );


        /* ==================================================
           AMATI SELURUH BODY
        ================================================== */

        mutationObserver.observe(
            document.body,
            {
                childList:true,
                subtree:true
            }
        );

    }
);