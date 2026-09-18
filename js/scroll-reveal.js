/* ==========================================================
   SCROLL REVEAL
   RTQ AL IMAM ADZ DZAHABIY
========================================================== */


/* ==========================================================
   INTERSECTION OBSERVER
========================================================== */

let scrollRevealObserver = null;


/* ==========================================================
   TEXT REVEAL PER 1 / 2 BARIS

   CARA PAKAI:

   data-reveal="right"
   data-delay="0.2s"
   data-reveal-text="1"

   Desktop / tablet:
   Text reveal per baris.

   Mobile:
   Text reveal per baris dimatikan agar wrapping
   paragraf tetap natural.
========================================================== */

function setupTextLineReveal(element) {


    /* ------------------------------------------------------
       Hanya aktif jika data-reveal-text digunakan
    ------------------------------------------------------ */

    if (!element.dataset.revealText) {
        return;
    }


    /* ------------------------------------------------------
       MOBILE
       Jangan pecah teks menjadi group per baris.
       Biarkan paragraf mengikuti lebar layar.
    ------------------------------------------------------ */

    if (window.innerWidth <= 767.98) {
        return;
    }


    /* ------------------------------------------------------
       Jangan dipasang dua kali
    ------------------------------------------------------ */

    if (
        element.dataset.textRevealReady === "true"
    ) {
        return;
    }


    const groupSize =
        parseInt(
            element.dataset.revealText
        ) || 2;


    /* ------------------------------------------------------
       Simpan HTML asli
       Agar <strong>, <em>, <a>, dll tetap terjaga.
    ------------------------------------------------------ */

    const originalHTML =
        element.innerHTML.trim();


    if (!originalHTML) {
        return;
    }


    element.dataset.textRevealOriginal =
        originalHTML;


    /* ======================================================
       CLONE SEMENTARA
       Untuk mendeteksi posisi setiap kata
    ====================================================== */

    const temp =
        element.cloneNode(true);


    temp.style.position =
        "absolute";

    temp.style.visibility =
        "hidden";

    temp.style.pointerEvents =
        "none";

    temp.style.width =
        element.getBoundingClientRect().width + "px";

    temp.style.height =
        "auto";

    temp.style.left =
        "-99999px";

    temp.style.top =
        "0";


    document.body.appendChild(
        temp
    );


    /* ======================================================
       AMBIL SEMUA TEXT NODE
    ====================================================== */

    const walker =
        document.createTreeWalker(
            temp,
            NodeFilter.SHOW_TEXT
        );


    const textNodes = [];

    let node;


    while (
        node = walker.nextNode()
    ) {

        if (
            node.textContent.trim()
        ) {

            textNodes.push(
                node
            );

        }

    }


    /* ======================================================
       PECAH TEXT NODE MENJADI KATA
    ====================================================== */

    const wordElements = [];


    textNodes.forEach(
        function (textNode) {

            const text =
                textNode.textContent;


            const words =
                text.split(
                    /(\s+)/
                );


            const fragment =
                document.createDocumentFragment();


            words.forEach(
                function (part) {

                    if (!part) {
                        return;
                    }


                    /* SPASI */

                    if (
                        /^\s+$/.test(part)
                    ) {

                        fragment.appendChild(
                            document.createTextNode(
                                part
                            )
                        );

                        return;

                    }


                    /* KATA */

                    const span =
                        document.createElement(
                            "span"
                        );


                    span.textContent =
                        part;


                    span.className =
                        "text-reveal-word";


                    fragment.appendChild(
                        span
                    );


                    wordElements.push(
                        span
                    );

                }
            );


            textNode.parentNode.replaceChild(
                fragment,
                textNode
            );

        }
    );


    /* ======================================================
       DETEKSI POSISI BARIS
    ====================================================== */

    const lines = [];

    let currentLine = [];

    let currentTop = null;


    wordElements.forEach(
        function (word) {

            const rect =
                word.getBoundingClientRect();


            const top =
                Math.round(
                    rect.top
                );


            if (
                currentTop === null ||
                Math.abs(
                    top - currentTop
                ) <= 2
            ) {

                currentLine.push(
                    word
                );

            } else {

                lines.push(
                    currentLine
                );

                currentLine = [
                    word
                ];

            }


            currentTop =
                top;

        }
    );


    if (
        currentLine.length
    ) {

        lines.push(
            currentLine
        );

    }


    /* ======================================================
       HAPUS CLONE
    ====================================================== */

    document.body.removeChild(
        temp
    );


    /* ======================================================
       JIKA GAGAL DETEKSI
    ====================================================== */

    if (!lines.length) {
        return;
    }


    /* ======================================================
       BERSIHKAN ELEMENT ASLI
    ====================================================== */

    element.innerHTML = "";


    /* ======================================================
       BANGUN KEMBALI GROUP
    ====================================================== */

    for (
        let i = 0;
        i < lines.length;
        i += groupSize
    ) {


        const group =
            document.createElement(
                "span"
            );


        group.className =
            "text-reveal-group";


        const groupLines =
            lines.slice(
                i,
                i + groupSize
            );


        /* ==================================================
           MASUKKAN KEMBALI KATA
        ================================================== */

        groupLines.forEach(
            function (
                line,
                lineIndex
            ) {


                line.forEach(
                    function (
                        word,
                        wordIndex
                    ) {


                        /* ----------------------------------
                           Pertahankan formatting
                           <strong>, <em>, <a>, dll.
                        ---------------------------------- */

                        let formattedWord =
                            word.cloneNode(
                                true
                            );


                        const formattingParents =
                            [];


                        let parent =
                            word.parentElement;


                        while (
                            parent &&
                            parent !== temp
                        ) {


                            if (
                                [
                                    "STRONG",
                                    "B",
                                    "EM",
                                    "I",
                                    "U",
                                    "MARK",
                                    "SMALL",
                                    "SUB",
                                    "SUP",
                                    "A"
                                ].includes(
                                    parent.tagName
                                )
                            ) {

                                formattingParents.unshift(
                                    parent
                                );

                            }


                            parent =
                                parent.parentElement;

                        }


                        /* ----------------------------------
                           Bangun kembali formatting
                        ---------------------------------- */

                        formattingParents.forEach(
                            function (
                                parentElement
                            ) {


                                const wrapper =
                                    parentElement.cloneNode(
                                        false
                                    );


                                wrapper.innerHTML =
                                    "";


                                wrapper.appendChild(
                                    formattedWord
                                );


                                formattedWord =
                                    wrapper;

                            }
                        );


                        group.appendChild(
                            formattedWord
                        );


                        /* ----------------------------------
                           SPASI ANTAR KATA
                        ---------------------------------- */

                        if (
                            wordIndex <
                            line.length - 1
                        ) {

                            group.appendChild(
                                document.createTextNode(
                                    " "
                                )
                            );

                        }

                    }
                );


                /* --------------------------------------
                   SPASI ANTAR BARIS
                -------------------------------------- */

                if (
                    lineIndex <
                    groupLines.length - 1
                ) {

                    group.appendChild(
                        document.createTextNode(
                            " "
                        )
                    );

                }

            }
        );


        /* ==================================================
           ARAH BERGANTIAN
        ================================================== */

        const groupIndex =
            Math.floor(
                i / groupSize
            );


        if (
            groupIndex % 2 === 0
        ) {

            group.classList.add(
                "text-reveal-right"
            );

        } else {

            group.classList.add(
                "text-reveal-left"
            );

        }


        /* ==================================================
           DELAY
        ================================================== */

        const baseDelay =
            parseFloat(
                element.dataset.delay ||
                "0"
            );


        const extraDelay =
            groupIndex * 0.5;


        group.style.transitionDelay =
            (
                baseDelay +
                extraDelay
            ) + "s";


        element.appendChild(
            group
        );

    }


    element.dataset.textRevealReady =
        "true";

}


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


    /* ------------------------------------------------------
       TEXT REVEAL
    ------------------------------------------------------ */

    setupTextLineReveal(
        element
    );


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
       OBSERVE
    ====================================================== */

    if (
        scrollRevealObserver
    ) {

        scrollRevealObserver.observe(
            element
        );

    }

}


/* ==========================================================
   INIT SCROLL REVEAL
========================================================== */

function initScrollReveal() {


    const revealElements =
        document.querySelectorAll(
            "[data-reveal], [data-reveal-text]"
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


                                    /* ----------------------------------
                                       ELEMENT TERLIHAT
                                    ---------------------------------- */

                                    entry.target.classList.add(
                                        "is-visible"
                                    );


                                    /* ----------------------------------
                                       TEXT REVEAL
                                    ---------------------------------- */

                                    if (
                                        entry.target.dataset.revealText
                                    ) {


                                        const textGroups =
                                            entry.target.querySelectorAll(
                                                ".text-reveal-group"
                                            );


                                        textGroups.forEach(
                                            function (group) {

                                                group.classList.add(
                                                    "text-reveal-visible"
                                                );

                                            }
                                        );

                                    }


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
                           Mobile  : 80px
                        ---------------------------------- */

                        rootMargin:
                            window.innerWidth <= 767.98
                                ? "0px 0px 80px 0px"
                                : "0px 0px 150px 0px"

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
                                            "[data-reveal], [data-reveal-text]"
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
                                                "[data-reveal], [data-reveal-text]"
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