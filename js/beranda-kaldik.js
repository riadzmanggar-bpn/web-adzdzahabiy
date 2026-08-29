/* ==========================================================
   HOME DATE
   RTQ AL IMAM ADZ DZAHABIY

   Menampilkan:
   - Hari
   - Tanggal Hijriah
   - Bulan + tahun Hijriah
   - Kegiatan akademik hari ini
========================================================== */

(function () {

    "use strict";


    /* ======================================================
       ELEMENT
    ====================================================== */

    const weekdayElement =
        document.getElementById(
            "home-date-weekday"
        );


    const hijriElement =
        document.getElementById(
            "home-date-hijri"
        );


    const monthElement =
        document.getElementById(
            "home-date-month"
        );


    const eventElement =
        document.getElementById(
            "home-date-event"
        );


    /* ======================================================
       CEK ELEMENT
    ====================================================== */

    if (
        !weekdayElement ||
        !hijriElement ||
        !monthElement ||
        !eventElement
    ) {

        console.warn(
            "Element kalender beranda tidak ditemukan."
        );

        return;

    }


    /* ======================================================
       NAMA HARI
    ====================================================== */

    const DAYS = [

        "Ahad",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"

    ];


    /* ======================================================
       NAMA BULAN HIJRIAH
    ====================================================== */

    const MONTHS = [

        "Muharram",
        "Safar",
        "Rabiul Awal",
        "Rabiul Akhir",
        "Jumadil Awal",
        "Jumadil Akhir",
        "Rajab",
        "Sya'ban",
        "Ramadhan",
        "Syawal",
        "Dzulqa'dah",
        "Dzulhijjah"

    ];


    /* ======================================================
       FORMAT KEY HIJRIAH
    ====================================================== */

    function makeKey(
        year,
        month,
        date
    ) {

        return (
            `${year}-` +
            `${String(month).padStart(2, "0")}-` +
            `${String(date).padStart(2, "0")}`
        );

    }


    /* ======================================================
       CARI KEGIATAN HARI INI
    ====================================================== */

    function getTodayEvents(
        year,
        month,
        date,
        data
    ) {

        const currentKey =
            makeKey(
                year,
                month,
                date
            );


        const events = [];


        Object.entries(data)
            .forEach(
                ([startKey, event]) => {

                    const endKey =
                        event.end ||
                        startKey;


                    if (
                        currentKey >= startKey &&
                        currentKey <= endKey
                    ) {

                        events.push(event);

                    }

                }
            );


        return events;

    }


    /* ======================================================
       RENDER
    ====================================================== */

    function render(data) {

        const today =
            moment();


        /* --------------------------------------------------
           TANGGAL HIJRIAH
        -------------------------------------------------- */

        const hijriYear =
            today.iYear();


        const hijriMonth =
            today.iMonth() + 1;


        const hijriDate =
            today.iDate();


        /* --------------------------------------------------
           HARI
        -------------------------------------------------- */

        weekdayElement.textContent =
            DAYS[today.day()];


        /* --------------------------------------------------
           ANGKA TANGGAL
        -------------------------------------------------- */

        hijriElement.textContent =
            hijriDate;


        /* --------------------------------------------------
           BULAN + TAHUN
        -------------------------------------------------- */

        monthElement.textContent =
            `${MONTHS[hijriMonth - 1]} ${hijriYear} H`;


        /* --------------------------------------------------
           KEGIATAN
        -------------------------------------------------- */

        const events =
            getTodayEvents(
                hijriYear,
                hijriMonth,
                hijriDate,
                data
            );


        eventElement.innerHTML =
            "";


        if (
            events.length === 0
        ) {

            eventElement.style.display =
                "none";

            return;

        }


        eventElement.style.display =
            "block";


        events.forEach(
            event => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.textContent =
                    event.title;


                eventElement.appendChild(
                    item
                );

            }
        );

    }


    /* ======================================================
       LOAD KALDIK.JSON
    ====================================================== */

    async function load() {

        try {

            const response =
                await fetch(
                    "data/kaldik.json"
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            render(data);

        }

        catch (error) {

            console.error(
                "Gagal memuat kalender akademik:",
                error
            );

        }

    }


    /* ======================================================
       START
    ====================================================== */

    load();


})();