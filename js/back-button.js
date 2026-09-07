/* ==========================================================
   TOMBOL KEMBALI
========================================================== */

document.addEventListener("click", function (event) {

    const button =
        event.target.closest("#backButton");

    if (!button) return;


    /* ------------------------------------------------------
       KEMBALI KE HALAMAN SEBELUMNYA
    ------------------------------------------------------ */

    if (
        document.referrer &&
        document.referrer.startsWith(
            window.location.origin
        )
    ) {

        history.back();

    } else {

        /* --------------------------------------------------   
           JIKA PAGE DIBUKA LANGSUNG
        -------------------------------------------------- */

        const isPages =
            window.location.pathname.includes("/pages/");

        window.location.href =
            isPages
                ? "../index.html"
                : "index.html";

    }

});