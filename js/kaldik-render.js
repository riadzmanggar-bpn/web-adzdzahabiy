/* ==========================================================
   KALDIK RENDER
   RTQ AL IMAM ADZ DZAHABIY

   File tambahan.
   TIDAK mengubah kaldik.js asli.

   Fungsi:
   - Membaca kaldik.json
   - Menampilkan kalender Hijriah
   - Menampilkan kegiatan akademik
   - Menampilkan detail kegiatan
========================================================== */

(function () {

    "use strict";


    /* ======================================================
       KONFIGURASI PERIODE KALDIK
       Syawal 1447 H
       sampai
       Ramadhan 1448 H
    ====================================================== */

    const START_YEAR = 1447;
    const START_MONTH = 10; // Syawal

    const END_YEAR = 1448;
    const END_MONTH = 9;    // Ramadhan


/* ======================================================
   POSISI BULAN AKTIF
   Otomatis mengikuti bulan Hijriah saat ini
====================================================== */

const todayHijri = moment();

let currentYear =
    todayHijri.iYear();

let currentMonth =
    todayHijri.iMonth() + 1;


/* ======================================================
   BATASI AGAR TETAP DALAM PERIODE KALDIK
====================================================== */

if (
    currentYear < START_YEAR ||
    (
        currentYear === START_YEAR &&
        currentMonth < START_MONTH
    )
) {

    currentYear = START_YEAR;
    currentMonth = START_MONTH;

}


if (
    currentYear > END_YEAR ||
    (
        currentYear === END_YEAR &&
        currentMonth > END_MONTH
    )
) {

    currentYear = END_YEAR;
    currentMonth = END_MONTH;

}

    /* ======================================================
       DATA KALDIK
    ====================================================== */

    let kaldikEvents = {};


    /* ======================================================
       ELEMENT HTML
    ====================================================== */

    const monthName =
        document.getElementById("kaldik-month-name");

    const monthYear =
        document.getElementById("kaldik-month-year");

    const gregorianRange =
        document.getElementById("kaldik-gregorian-range");

    const daysContainer =
        document.getElementById("kaldik-days");

    const prevButton =
        document.getElementById("kaldik-prev");

    const nextButton =
        document.getElementById("kaldik-next");


    /* ======================================================
       WARNA EVENT
    ====================================================== */

    const EVENT_COLORS = {

        administrasi: "#607d8b",

        kbm: "#16804d",

        uhab: "#2196f3",

        ujian: "#9c27b0",

        libur: "#e53935",

        dauroh: "#f59e0b",

        classmeeting: "#795548",

        rapot: "#607d8b",

        musabaqoh: "#00897b",

        pendaftaran: "#c0a04b"

    };


    /* ======================================================
       NAMA TIPE EVENT
    ====================================================== */

    const EVENT_TYPE_NAMES = {

        administrasi:
            "Administrasi",

        kbm:
            "Kegiatan Belajar Mengajar",

        uhab:
            "UHAB",

        ujian:
            "Ujian",

        libur:
            "Libur",

        dauroh:
            "Dauroh",

        classmeeting:
            "Classmeeting",

        rapot:
            "Rapot",

        musabaqoh:
            "Musabaqoh",

        pendaftaran:
            "Pendaftaran"

    };


    /* ======================================================
       FORMAT KEY TANGGAL
    ====================================================== */

    function makeDateKey(
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
       AMBIL EVENT PADA TANGGAL
    ====================================================== */

    function getEventsForDate(
        year,
        month,
        date
    ) {

        const currentKey =
            makeDateKey(
                year,
                month,
                date
            );


        const events = [];


        Object.entries(kaldikEvents)
            .forEach(
                ([startKey, event]) => {

                    const endKey =
                        event.end || startKey;


                    if (
                        currentKey >= startKey &&
                        currentKey <= endKey
                    ) {

                        events.push({

                            start:
                                startKey,

                            end:
                                endKey,

                            title:
                                event.title,

                            type:
                                event.type || "administrasi"

                        });

                    }

                }
            );


        return events;

    }


    /* ======================================================
       FORMAT TANGGAL HIJRIAH
    ====================================================== */

    function formatHijriDate(
        year,
        month,
        date
    ) {

        const monthNames =
            KaldikCalendar.months;


        return (
            `${date} ` +
            `${monthNames[month - 1]} ` +
            `${year} H`
        );

    }


    /* ======================================================
       FORMAT RENTANG MASEHI
    ====================================================== */

    function formatGregorianRange(
        startDate,
        endDate
    ) {

        const start =
            moment(startDate);

        const end =
            moment(endDate);


        const startMonth =
            start.format("MMMM");

        const endMonth =
            end.format("MMMM");


        const startYear =
            start.format("YYYY");

        const endYear =
            end.format("YYYY");


        if (
            startMonth === endMonth &&
            startYear === endYear
        ) {

            return `${startMonth} ${startYear}`;

        }


        if (
            startYear === endYear
        ) {

            return (
                `${startMonth} – ` +
                `${endMonth} ` +
                `${startYear}`
            );

        }


        return (
            `${startMonth} ${startYear} – ` +
            `${endMonth} ${endYear}`
        );

    }


    /* ======================================================
       CEK BULAN PERTAMA
    ====================================================== */

    function isFirstMonth() {

        return (
            currentYear === START_YEAR &&
            currentMonth === START_MONTH
        );

    }


    /* ======================================================
       CEK BULAN TERAKHIR
    ====================================================== */

    function isLastMonth() {

        return (
            currentYear === END_YEAR &&
            currentMonth === END_MONTH
        );

    }


    /* ======================================================
       BULAN SEBELUMNYA
    ====================================================== */

    function previousMonth() {

        if (isFirstMonth()) {

            return;

        }


        currentMonth--;


        if (currentMonth < 1) {

            currentMonth = 12;
            currentYear--;

        }


        renderCalendar();

    }


    /* ======================================================
       BULAN BERIKUTNYA
    ====================================================== */

    function nextMonth() {

        if (isLastMonth()) {

            return;

        }


        currentMonth++;


        if (currentMonth > 12) {

            currentMonth = 1;
            currentYear++;

        }


        renderCalendar();

    }


    /* ======================================================
       CEK HARI INI
    ====================================================== */

    function isToday(
        gregorianDate
    ) {

        const today =
            moment();


        return (
            gregorianDate.format("YYYY-MM-DD") ===
            today.format("YYYY-MM-DD")
        );

    }


    /* ======================================================
       BUAT SATU TANGGAL
    ====================================================== */

    function createDay(
        hijriDate,
        gregorianDate
    ) {

        const day =
            document.createElement("div");


        day.className =
            "kaldik-day";


        const dateKey =
            makeDateKey(
                currentYear,
                currentMonth,
                hijriDate
            );


        day.dataset.hijri =
            dateKey;


        day.dataset.day =
            gregorianDate.day();


        /* --------------------------------------------------
           HARI INI
        -------------------------------------------------- */

        if (
            isToday(
                gregorianDate
            )
        ) {

            day.classList.add(
                "today"
            );

        }


        /* --------------------------------------------------
           ISI DASAR
        -------------------------------------------------- */

        day.innerHTML = `

            <span class="kaldik-day-hijri">
                ${hijriDate}
            </span>

        `;


        /* --------------------------------------------------
           EVENT
        -------------------------------------------------- */

        const events =
            getEventsForDate(
                currentYear,
                currentMonth,
                hijriDate
            );


        if (
            events.length > 0
        ) {

            events.forEach(
                event => {

                    const eventElement =
                        document.createElement("div");


                    eventElement.className =
                        "kaldik-day-event";


                    const color =
                        EVENT_COLORS[event.type] ||
                        "#16804d";


                    eventElement.style.color =
                        color;


                    eventElement.textContent =
                        event.title;


                    day.appendChild(
                        eventElement
                    );

                }
            );

        }


        /* --------------------------------------------------
           KLIK TANGGAL
        -------------------------------------------------- */

        day.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".kaldik-day.selected"
                    )
                    .forEach(
                        selectedDay => {

                            selectedDay.classList.remove(
                                "selected"
                            );

                        }
                    );


                day.classList.add(
                    "selected"
                );


                showEventDetail(
                    currentYear,
                    currentMonth,
                    hijriDate,
                    gregorianDate,
                    events
                );

            }
        );


        return day;

    }


    /* ======================================================
       DETAIL EVENT
    ====================================================== */

    function showEventDetail(
        year,
        month,
        date,
        gregorianDate,
        events
    ) {

        let detail =
            document.querySelector(
                ".kaldik-event-detail"
            );


        /* --------------------------------------------------
           JIKA BELUM ADA DI HTML
        -------------------------------------------------- */

        if (!detail) {

            detail =
                document.createElement("div");

            detail.className =
                "kaldik-event-detail";


            const calendarCard =
                document.querySelector(
                    ".kaldik-main-card"
                );


            if (calendarCard) {

                calendarCard.appendChild(
                    detail
                );

            }

        }


        /* --------------------------------------------------
           TIDAK ADA EVENT
        -------------------------------------------------- */

        if (
            events.length === 0
        ) {

            detail.innerHTML = `

                <div class="kaldik-event-empty">

                    Tidak ada kegiatan
                    pada tanggal ini.

                </div>

            `;


            return;

        }


        /* --------------------------------------------------
           HEADER TANGGAL
        -------------------------------------------------- */

        let html = `

            <div class="kaldik-event-date">

                <strong>
                    ${formatHijriDate(
                        year,
                        month,
                        date
                    )}
                </strong>

                <span>
                    ${gregorianDate.format(
                        "DD MMMM YYYY"
                    )}
                </span>

            </div>

            <div class="kaldik-event-list">

        `;


        /* --------------------------------------------------
           DAFTAR EVENT
        -------------------------------------------------- */

        events.forEach(
            event => {

                const color =
                    EVENT_COLORS[event.type] ||
                    "#16804d";


                const typeName =
                    EVENT_TYPE_NAMES[event.type] ||
                    "Kegiatan";


                html += `

                    <div class="kaldik-event">

                        <div
                            class="kaldik-event-color"
                            style="
                                background:${color};
                            "
                        ></div>

                        <div>

                            <div
                                class="kaldik-event-name"
                            >
                                ${event.title}
                            </div>

                            <div
                                class="kaldik-event-type"
                            >
                                ${typeName}
                            </div>

                        </div>

                    </div>

                `;

            }
        );


        html += `
            </div>
        `;


        detail.innerHTML =
            html;

    }


    /* ======================================================
       RENDER KALENDER
    ====================================================== */

    function renderCalendar() {

        if (
            !window.KaldikCalendar
        ) {

            console.error(
                "KaldikCalendar tidak ditemukan."
            );

            return;

        }


        const info =
            KaldikCalendar.getMonthInfo(
                currentYear,
                currentMonth
            );


        /* --------------------------------------------------
           HEADER
        -------------------------------------------------- */

        monthName.textContent =
            info.monthName;


        monthYear.textContent =
            `${info.year} H`;


        gregorianRange.textContent =
            formatGregorianRange(
                info.startGregorian,
                info.endGregorian
            );


        /* --------------------------------------------------
           KOSONGKAN TANGGAL
        -------------------------------------------------- */

        daysContainer.innerHTML =
            "";


        /* --------------------------------------------------
           TANGGAL 1
        -------------------------------------------------- */

        const firstDate =
            KaldikCalendar.hijriToGregorian(
                currentYear,
                currentMonth,
                1
            );


        const firstDay =
            firstDate.day();


        /* --------------------------------------------------
           KOTAK KOSONG SEBELUM TANGGAL 1
        -------------------------------------------------- */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("div");


            empty.className =
                "kaldik-day kaldik-day-empty";


            daysContainer.appendChild(
                empty
            );

        }


        /* --------------------------------------------------
           SEMUA TANGGAL
        -------------------------------------------------- */

        for (
            let date = 1;
            date <= info.days;
            date++
        ) {

            const gregorianDate =
                KaldikCalendar.hijriToGregorian(
                    currentYear,
                    currentMonth,
                    date
                );


            const day =
                createDay(
                    date,
                    gregorianDate
                );


            daysContainer.appendChild(
                day
            );

        }


        /* --------------------------------------------------
           NAVIGASI
        -------------------------------------------------- */

        prevButton.disabled =
            isFirstMonth();


        nextButton.disabled =
            isLastMonth();


        /* --------------------------------------------------
           RESET DETAIL
        -------------------------------------------------- */

        const detail =
            document.querySelector(
                ".kaldik-event-detail"
            );


        if (detail) {

            detail.innerHTML = `

                <div class="kaldik-event-empty">

                    Pilih tanggal untuk melihat
                    kegiatan akademik.

                </div>

            `;

        }

    }


    /* ======================================================
       LOAD KALDIK.JSON
    ====================================================== */

    async function loadKaldikData() {

        try {

            const response =
                await fetch(
                    "../data/kaldik.json"
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            kaldikEvents =
                await response.json();


            console.log(
                "Kaldik JSON berhasil dimuat.",
                kaldikEvents
            );


            renderCalendar();

        }

        catch (error) {

            console.error(
                "Gagal memuat kaldik.json:",
                error
            );


            /* ------------------------------------------
               TETAP TAMPILKAN KALENDER
            ------------------------------------------ */

            renderCalendar();

        }

    }


    /* ======================================================
       EVENT BUTTON
    ====================================================== */

    prevButton.addEventListener(
        "click",
        previousMonth
    );


    nextButton.addEventListener(
        "click",
        nextMonth
    );


    /* ======================================================
       INIT
    ====================================================== */

    loadKaldikData();


})();