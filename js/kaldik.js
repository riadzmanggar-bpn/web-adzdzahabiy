/* ==========================================================
   KALDIK RTQ AL IMAM ADZ DZAHABIY
   Mesin Kalender Hijriah
   Menggunakan moment.js + moment-hijri.js
========================================================== */

(function () {

    "use strict";


    /* ======================================================
       NAMA BULAN HIJRIAH
    ====================================================== */

    const HIJRI_MONTHS = [
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
       KONVERSI TANGGAL
    ====================================================== */

    function hijriToGregorian(
        year,
        month,
        date
    ) {

        return moment(
            `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
            "iYYYY-iMM-iDD"
        );

    }


    /* ======================================================
       JUMLAH HARI DALAM BULAN HIJRIAH
    ====================================================== */

    function daysInHijriMonth(
        year,
        month
    ) {

        const lastDay =
            hijriToGregorian(
                year,
                month,
                1
            ).endOf("iMonth");

        return lastDay.iDate();

    }


    /* ======================================================
       INFORMASI BULAN
    ====================================================== */

    function getMonthInfo(
        year,
        month
    ) {

        const firstDay =
            hijriToGregorian(
                year,
                month,
                1
            );

        const lastDay =
            firstDay.clone()
                .endOf("iMonth");


        return {

            year: year,

            month: month,

            monthName:
                HIJRI_MONTHS[month - 1],

            days:
                lastDay.iDate(),

            startGregorian:
                firstDay.format("YYYY-MM-DD"),

            endGregorian:
                lastDay.format("YYYY-MM-DD")

        };

    }


    /* ======================================================
       CETAK INFORMASI BULAN
    ====================================================== */

    function showMonth(
        year,
        month
    ) {

        const info =
            getMonthInfo(
                year,
                month
            );


        console.log(
            "===================================="
        );

        console.log(
            `${info.monthName} ${info.year} H`
        );

        console.log(
            `Jumlah hari : ${info.days}`
        );

        console.log(
            `Masehi awal : ${info.startGregorian}`
        );

        console.log(
            `Masehi akhir: ${info.endGregorian}`
        );

        console.log(
            "===================================="
        );


        return info;

    }


    /* ======================================================
       TAMPILKAN RENTANG KALDIK
       SYAWAL 1447 - RAMADHAN 1448
    ====================================================== */

    function testKaldik() {

        console.clear();

        console.log(
            "KALDIK RTQ AL IMAM ADZ DZAHABIY"
        );

        console.log(
            "Kalender Hijriah"
        );

        console.log(
            "===================================="
        );


        const months = [];


        /*
           Syawal 1447
           sampai
           Ramadhan 1448
        */

        for (
            let year = 1447;
            year <= 1448;
            year++
        ) {

            const startMonth =
                year === 1447
                    ? 10
                    : 1;

            const endMonth =
                year === 1448
                    ? 9
                    : 12;


            for (
                let month = startMonth;
                month <= endMonth;
                month++
            ) {

                const info =
                    getMonthInfo(
                        year,
                        month
                    );


                months.push(info);


                console.log(
                    `${info.monthName} ${info.year} H`
                );

                console.log(
                    `  ${info.days} hari`
                );

                console.log(
                    `  ${info.startGregorian} → ${info.endGregorian}`
                );

            }

        }


        console.log(
            "===================================="
        );

        console.log(
            `Total bulan: ${months.length}`
        );


        return months;

    }


    /* ======================================================
       API GLOBAL
    ====================================================== */

    window.KaldikCalendar = {

        months:
            HIJRI_MONTHS,

        days:
            DAYS,

        hijriToGregorian,

        daysInHijriMonth,

        getMonthInfo,

        showMonth,

        testKaldik

    };


})();