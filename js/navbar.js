/* ==========================================================
   GLOBAL NAVBAR + FOOTER
   RTQ AL IMAM ADZ DZAHABIY
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       TENTUKAN LOKASI HALAMAN
    ====================================================== */

    const isPages =
        window.location.pathname.includes("/pages/");

    const base =
        isPages ? "../" : "";

    const componentPath =
        isPages
            ? "../components/"
            : "components/";


    /* ======================================================
       LINK WEBSITE
    ====================================================== */

    const links = {

        home: "index.html",

        profil: "profil.html",

        program: "program.html",

        ra: "ra.html",

        rb: "rb.html",

        mu: "mu.html",

        mw: "mw.html",

        muy: "muy.html",

        ibadah: "ibadah.html",

        berita: "berita.html",

        galeri: "galeri.html",

        kontak: "kontak.html"

    };


    /* ======================================================
       FUNGSI SET LINK
    ====================================================== */

    function setLinks(container) {

        if (!container) return;


        /* --------------------------------------------------
           MENU UTAMA
        -------------------------------------------------- */

        container
            .querySelectorAll("[data-link]")
            .forEach(link => {

                const target =
                    link.dataset.link;

                if (!links[target]) return;


                const url =
                    target === "home"

                        ? base + "index.html"

                        : base +
                          "pages/" +
                          links[target];


                link.href = url;

            });


        /* --------------------------------------------------
           DROPDOWN PROFIL
        -------------------------------------------------- */

        container
            .querySelectorAll("[data-profile]")
            .forEach(link => {

                const section =
                    link.dataset.profile;


                link.href =
                    base +
                    "pages/profil.html#" +
                    section;

            });

    }


    /* ======================================================
       LOAD NAVBAR
    ====================================================== */

    const navbarContainer =
        document.getElementById("global-navbar");

    if (navbarContainer) {

        fetch(componentPath + "navbar.html")

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Navbar tidak ditemukan."
                    );
                }

                return response.text();

            })

            .then(html => {

                navbarContainer.innerHTML =
                    html;


                /* ------------------------------------------
                   LOGO NAVBAR
                ------------------------------------------ */

                const logo =
                    navbarContainer
                        .querySelector(".logo");

                if (logo) {

                    logo.src =
                        base +
                        "images/logo-rtq.png";

                }


                /* ------------------------------------------
                   SET LINK NAVBAR
                ------------------------------------------ */

                setLinks(
                    navbarContainer
                );


                /* ------------------------------------------
                   MENU AKTIF
                ------------------------------------------ */

                const currentPath =
                    window.location.pathname;


                navbarContainer
                    .querySelectorAll(".nav-link")
                    .forEach(link => {

                        const href =
                            link.getAttribute("href");

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

                        } catch (error) {

                            console.error(
                                "Navbar active link:",
                                error
                            );

                        }

                    });

            })

            .catch(error => {

                console.error(
                    "Global Navbar:",
                    error
                );

            });

    }


    /* ======================================================
       LOAD FOOTER
    ====================================================== */

    const footerContainer =
        document.getElementById("global-footer");

    if (footerContainer) {

        fetch(componentPath + "footer.html")

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Footer tidak ditemukan."
                    );
                }

                return response.text();

            })

            .then(html => {

                footerContainer.innerHTML =
                    html;


                /* ------------------------------------------
                   LOGO FOOTER
                ------------------------------------------ */

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


                /* ------------------------------------------
                   SET LINK FOOTER
                ------------------------------------------ */

                setLinks(
                    footerContainer
                );

            })

            .catch(error => {

                console.error(
                    "Global Footer:",
                    error
                );

            });

    }

});