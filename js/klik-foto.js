
/* ==========================================================
   KLIK FOTO — LIGHTBOX BERITA & PRESTASI
========================================================== */

(function () {
    "use strict";

    function initKlikFoto() {

        // Area foto yang didukung
        const selectorFoto = [
            ".news-detail-section img",
            ".prestasi-gallery-item img"
        ].join(", ");

        // Cegah inisialisasi berulang
        if (document.documentElement.dataset.lightboxReady === "true") {
            return;
        }

        document.documentElement.dataset.lightboxReady = "true";

        // Buat lightbox
        const lightbox = document.createElement("div");

        lightbox.className = "foto-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Pratinjau foto");

        lightbox.innerHTML = `
            <button
                class="foto-lightbox-tutup"
                type="button"
                aria-label="Tutup foto">
                &times;
            </button>

            <img src="" alt="">
        `;

        document.body.appendChild(lightbox);

        const fotoBesar = lightbox.querySelector("img");

        const tombolTutup = lightbox.querySelector(
            ".foto-lightbox-tutup"
        );

        let elemenSebelumnya = null;

        // CSS Lightbox
        const style = document.createElement("style");

        style.textContent = `

            /* FOTO YANG BISA DIPERBESAR */
            .news-detail-section img,
            .prestasi-gallery-item img {
                cursor: zoom-in;
                transition: filter .25s ease;
            }

            .news-detail-section img:hover,
            .prestasi-gallery-item img:hover {
                filter: brightness(.94);
            }

            /* LIGHTBOX */
            .foto-lightbox {
                position: fixed;
                inset: 0;
                z-index: 999999;

                display: none;
                align-items: center;
                justify-content: center;

                padding: 24px;
                background: rgba(0, 0, 0, .92);
            }

            .foto-lightbox.aktif {
                display: flex;
            }

            .foto-lightbox img {
                display: block;

                max-width: 96vw;
                max-height: 92vh;

                width: auto;
                height: auto;

                object-fit: contain;

                border-radius: 4px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, .4);

                cursor: zoom-out;
            }

            /* TOMBOL TUTUP */
            .foto-lightbox-tutup {
                position: absolute;
                top: 14px;
                right: 22px;
                z-index: 2;

                width: 44px;
                height: 44px;

                border: 1px solid rgba(255,255,255,.5);
                border-radius: 50%;

                background: rgba(255,255,255,.12);
                color: white;

                font-size: 30px;
                line-height: 1;

                cursor: pointer;
            }

            .foto-lightbox-tutup:hover {
                background: rgba(255,255,255,.25);
            }

            /* RESPONSIVE */
            @media (max-width: 576px) {

                .foto-lightbox {
                    padding: 10px;
                }

                .foto-lightbox img {
                    max-width: 98vw;
                    max-height: 88vh;
                }

                .foto-lightbox-tutup {
                    top: 10px;
                    right: 10px;
                }
            }
        `;

        document.head.appendChild(style);


        // BUKA FOTO
        function bukaFoto(img) {

            if (!img.src || img.src.startsWith("data:")) {
                return;
            }

            elemenSebelumnya = document.activeElement;

            fotoBesar.src = img.currentSrc || img.src;
            fotoBesar.alt = img.alt || "Foto dokumentasi";

            lightbox.classList.add("aktif");

            document.body.style.overflow = "hidden";

            tombolTutup.focus();
        }


        // TUTUP FOTO
        function tutupFoto() {

            lightbox.classList.remove("aktif");

            document.body.style.overflow = "";

            fotoBesar.removeAttribute("src");

            if (
                elemenSebelumnya &&
                typeof elemenSebelumnya.focus === "function"
            ) {
                elemenSebelumnya.focus();
            }
        }


        // KLIK FOTO BERITA & PRESTASI
        document.addEventListener("click", function (event) {

            const img = event.target.closest(selectorFoto);

            if (!img) return;

            // Abaikan gambar yang menjadi tombol atau link
            if (img.closest("a, button")) return;

            bukaFoto(img);
        });


        // TOMBOL TUTUP
        tombolTutup.addEventListener("click", tutupFoto);


        // KLIK AREA GELAP ATAU FOTO BESAR
        lightbox.addEventListener("click", function (event) {

            if (
                event.target === lightbox ||
                event.target === fotoBesar
            ) {
                tutupFoto();
            }
        });


        // TOMBOL ESCAPE
        document.addEventListener("keydown", function (event) {

            if (!lightbox.classList.contains("aktif")) return;

            if (event.key === "Escape") {
                tutupFoto();
            }
        });


        console.log(
            "Lightbox Berita & Prestasi berhasil diinisialisasi."
        );
    }


    // INISIALISASI
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initKlikFoto
        );

    } else {

        initKlikFoto();

    }

})();
