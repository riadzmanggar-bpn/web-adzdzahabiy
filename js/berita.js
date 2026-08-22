/* ==========================================================
   SISTEM BERITA
   RTQ AL IMAM ADZ DZAHABIY
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================
   DAFTAR BERITA
   ========================================================== */

const daftarBerita = [

    "berita/berita-classmeeting.html",
    "berita/donasi-aceh-2025.html",

    // Berita berikutnya tambahkan di sini
    // "berita/berita-xxxx2.html",
    // "berita/berita-xxxx3.html"

];

    /* ======================================================
       CEK HALAMAN
    ====================================================== */

    const isBeritaDetail =
        window.location.pathname.includes("/pages/berita/");


    const featuredContainer =
        document.getElementById(
            "news-featured-container"
        );


    const latestContainer =
        document.getElementById(
            "news-latest-container"
        );


    /* ======================================================
       HALAMAN DETAIL BERITA
       
       Khusus:
       /pages/berita/berita-xxxx.html

       navbar.js TIDAK dipakai di sini.
       berita.js yang mengurus navbar + footer.
    ====================================================== */

    if (isBeritaDetail) {

        loadDetailNavbar();

        return;

    }


    /* ======================================================
       HALAMAN BERITA.HTML
    ====================================================== */

    if (
        featuredContainer ||
        latestContainer
    ) {

        loadBerita();

    }



    /* ======================================================
       LOAD SEMUA BERITA
    ====================================================== */

    async function loadBerita() {

        const berita = [];


        for (const file of daftarBerita) {

            try {

                const response =
                    await fetch(file);


                if (!response.ok) {

                    throw new Error(
                        "File tidak ditemukan: " +
                        file
                    );

                }


                const html =
                    await response.text();


                /* ==========================================
                   CARI BERITA_DATA
                ========================================== */

                const match =
                    html.match(
                        /window\.BERITA_DATA\s*=\s*({[\s\S]*?});/
                    );


                if (!match) {

                    console.warn(
                        "BERITA_DATA tidak ditemukan:",
                        file
                    );

                    continue;

                }


                const data =
                    Function(
                        '"use strict"; return (' +
                        match[1] +
                        ')'
                    )();


                /* ------------------------------------------
                   LINK DEFAULT
                ------------------------------------------ */

                if (!data.link) {

                    data.link = file;

                }


                berita.push(data);


            }

            catch (error) {

                console.error(
                    "Gagal memuat berita:",
                    file,
                    error
                );

            }

        }


        /* ==================================================
           URUTKAN BERDASARKAN TANGGAL TERBARU
        ================================================== */

        berita.sort(function (a, b) {

            return (
                new Date(b.tanggal) -
                new Date(a.tanggal)
            );

        });


        /* ==================================================
           TAMPILKAN
        ================================================== */

        if (berita.length > 0) {

            renderFeatured(
                berita[0]
            );

            renderLatest(
                berita
            );

        }

    }


    /* ======================================================
       FEATURED
       
       Selalu mengikuti berita paling baru.
    ====================================================== */

    function renderFeatured(berita) {

        if (!featuredContainer) {

            return;

        }


        featuredContainer.innerHTML = `

            <div class="news-featured-item active">

                <div class="row align-items-center g-4">


                    <!-- ==================================
                         GAMBAR
                    ================================== -->

                    <div class="col-lg-6">

                        <div class="news-featured-image">

                            <img
                                src="${escapeHTML(
                                    berita.gambar
                                )}"
                                alt="${escapeHTML(
                                    berita.judul
                                )}"
                            >

                        </div>

                    </div>


                    <!-- ==================================
                         INFORMASI
                    ================================== -->

                    <div class="col-lg-6">

                        <span class="news-category">

                            ${escapeHTML(
                                berita.kategori
                            )}

                        </span>


                        <h2>

                            ${escapeHTML(
                                berita.judul
                            )}

                        </h2>


                        <div class="news-date">

                            <i class="bi bi-calendar3"></i>

                            ${formatTanggal(
                                berita.tanggal
                            )}

                        </div>


                        ${
                            berita.lokasi
                            ? `

                                <div class="news-date">

                                    <i class="bi bi-geo-alt"></i>

                                    ${escapeHTML(
                                        berita.lokasi
                                    )}

                                </div>

                            `
                            : ""
                        }


                        <p>

                            ${escapeHTML(
                                berita.ringkasan
                            )}

                        </p>


                        <a
                            href="${escapeHTML(
                                berita.link
                            )}"
                            class="btn btn-success"
                        >

                            Baca Selengkapnya

                            <i
                                class="bi bi-arrow-right ms-1"
                            ></i>

                        </a>

                    </div>

                </div>

            </div>

        `;

    }


    /* ======================================================
       BERITA TERKINI
    ====================================================== */

    function renderLatest(berita) {

        if (!latestContainer) {

            return;

        }


        latestContainer.innerHTML = "";


        berita.forEach(function (item) {


            const col =
                document.createElement(
                    "div"
                );


            col.className =
                "col-lg-4 col-md-6";


            col.innerHTML = `

                <article class="news-card">


                    <!-- ==============================
                         GAMBAR
                    ============================== -->

                    <div class="news-card-image">

                        <img
                            src="${escapeHTML(
                                item.gambar
                            )}"
                            alt="${escapeHTML(
                                item.judul
                            )}"
                        >

                    </div>


                    <!-- ==============================
                         ISI
                    ============================== -->

                    <div class="news-card-body">


                        <span class="news-category">

                            ${escapeHTML(
                                item.kategori
                            )}

                        </span>


                        <h3>

                            ${escapeHTML(
                                item.judul
                            )}

                        </h3>


                        <div class="news-date">

                            <i class="bi bi-calendar3"></i>

                            ${formatTanggal(
                                item.tanggal
                            )}

                        </div>


                        ${
                            item.lokasi
                            ? `

                                <div class="news-date">

                                    <i class="bi bi-geo-alt"></i>

                                    ${escapeHTML(
                                        item.lokasi
                                    )}

                                </div>

                            `
                            : ""
                        }


                        <p>

                            ${escapeHTML(
                                item.ringkasan
                            )}

                        </p>


                        <a
                            href="${escapeHTML(
                                item.link
                            )}"
                            class="news-read-more"
                        >

                            Baca Selengkapnya

                            <i
                                class="bi bi-arrow-right"
                            ></i>

                        </a>


                    </div>

                </article>

            `;


            latestContainer.appendChild(
                col
            );

        });

    }


    /* ======================================================
       FORMAT TANGGAL
    ====================================================== */

    function formatTanggal(tanggal) {

        const date =
            new Date(
                tanggal + "T00:00:00"
            );


        return date.toLocaleDateString(
            "id-ID",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* ======================================================
       AMANKAN HTML
    ====================================================== */

    function escapeHTML(value) {

        if (
            value === undefined ||
            value === null
        ) {

            return "";

        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ======================================================
       NAVBAR + FOOTER
       KHUSUS /pages/berita/
    ====================================================== */

    function loadDetailNavbar() {

        const base =
            "../../";


        const componentPath =
            "../../components/";


        const links = {

            home: "index.html",

            profil: "profil.html",

            program: "program.html",

            taklim: "jadwal-taklim.html",

            ra: "ra.html",

            rb: "rb.html",

            mu: "mu.html",

            mw: "mw.html",

            muy: "muy.html",

            ibadah: "ibadah.html",

            berita: "berita.html",

            galeri: "galeri.html",

            kontak: "kontak.html",

            donasi: "donasi.html",

            daftar: "daftar.html"

        };


        /* ==================================================
           SET LINK
        ================================================== */

        function setLinks(container) {

            if (!container) return;


            container
                .querySelectorAll("[data-link]")
                .forEach(function (link) {

                    const target =
                        link.dataset.link;


                    if (!links[target]) {
                        return;
                    }


                    link.href =
                        target === "home"

                            ? base +
                              "index.html"

                            : base +
                              "pages/" +
                              links[target];

                });


            /* ----------------------------------------------
               PROFIL
            ---------------------------------------------- */

            container
                .querySelectorAll("[data-profile]")
                .forEach(function (link) {

                    const section =
                        link.dataset.profile;


                    link.href =
                        base +
                        "pages/profil.html#" +
                        section;

                });

        }


        /* ==================================================
           NAVBAR
        ================================================== */

        const navbarContainer =
            document.getElementById(
                "global-navbar"
            );


        if (navbarContainer) {

            fetch(
                componentPath +
                "navbar.html"
            )

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Navbar tidak ditemukan."
                        );

                    }


                    return response.text();

                })

                .then(function (html) {

                    navbarContainer.innerHTML =
                        html;


                    /* LOGO */

                    const logo =
                        navbarContainer
                            .querySelector(
                                ".logo"
                            );


                    if (logo) {

                        logo.src =
                            base +
                            "images/logo-rtq.png";

                    }


                    /* LINK */

                    setLinks(
                        navbarContainer
                    );


                    /* MENU AKTIF */

                    const currentPath =
                        window.location.pathname;


                    navbarContainer
                        .querySelectorAll(
                            ".nav-link"
                        )
                        .forEach(
                            function (link) {

                                const href =
                                    link.getAttribute(
                                        "href"
                                    );


                                if (
                                    !href ||
                                    href === "#"
                                ) {

                                    return;

                                }


                                try {

                                    const linkUrl =
                                        new URL(
                                            href,
                                            window.location.href
                                        );


                                    if (
                                        linkUrl.pathname ===
                                        currentPath
                                    ) {

                                        link.classList.add(
                                            "active"
                                        );

                                    }

                                }

                                catch (error) {

                                    console.error(
                                        "Navbar active link:",
                                        error
                                    );

                                }

                            }
                        );

                })

                .catch(function (error) {

                    console.error(
                        "Berita Navbar:",
                        error
                    );

                });

        }


        /* ==================================================
           FOOTER
        ================================================== */

        const footerContainer =
            document.getElementById(
                "global-footer"
            );


        if (footerContainer) {

            fetch(
                componentPath +
                "footer.html"
            )

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Footer tidak ditemukan."
                        );

                    }


                    return response.text();

                })

                .then(function (html) {

                    footerContainer.innerHTML =
                        html;


                    /* LOGO FOOTER */

                    const footerLogo =
                        footerContainer
                            .querySelector(
                                "[data-footer-logo]"
                            );


                    if (footerLogo) {

                        footerLogo.src =
                            base +
                            "images/RTQ Emas.png";

                    }


                    /* LINK FOOTER */

                    setLinks(
                        footerContainer
                    );

                })

                .catch(function (error) {

                    console.error(
                        "Berita Footer:",
                        error
                    );

                });

        }

    }

});