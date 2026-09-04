/* ==========================================================
   GRAFIK DATA SANTRI RTQ AL IMAM ADZ DZAHABIY
   Tahun Ajaran 1447/1448 H

   File : grafik-santri-1447-1448H.js

   Data:
   Putra : 234
   Putri : 193
   Total : 427
========================================================== */

(function () {

    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        const canvas = document.getElementById("studentChart");

        if (!canvas) {
            return;
        }


        /* ======================================================
           DATA SANTRI 1447/1448 H
        ====================================================== */

        const labels = [

            "RA Kelas 1",
            "RA Kelas 2",
            "RB Kelas 1",
            "RB Kelas 2",

            "Ula Kelas 1",
            "Ula Kelas 2",
            "Ula Kelas 3",
            "Ula Kelas 4",
            "Ula Kelas 5",
            "Ula Kelas 6",

            "MW Kelas 7",
            "MW Kelas 8",
            "MW Kelas 9",

            "MU Kelas 10",
            "MU Kelas 11",
            "MU Kelas 12"

        ];


        /* ======================================================
           DATA PUTRA
        ====================================================== */

        const putra = [

            16,
            18,
            10,
            10,

            21,
            17,
            21,
            19,
            10,
            23,

            23,
            12,
            20,

            14,
            9,
            8

        ];


        /* ======================================================
           DATA PUTRI
        ====================================================== */

        const putri = [

            null,
            null,
            null,
            null,

            24,
            14,
            19,
            22,
            14,
            17,

            10,
            21,
            9,

            12,
            7,
            7

        ];


        /* ======================================================
           PLUGIN ANGKA DI ATAS BATANG
        ====================================================== */

        const studentDataLabels = {

            id: "studentDataLabels",

            afterDatasetsDraw(chart) {

                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, datasetIndex) {

                    const meta = chart.getDatasetMeta(datasetIndex);

                    meta.data.forEach(function (bar, index) {

                        const value = dataset.data[index];

                        if (
                            value === null ||
                            value === undefined
                        ) {
                            return;
                        }

                        ctx.save();

                        ctx.font = "600 12px Arial";

                        ctx.textAlign = "center";

                        ctx.textBaseline = "bottom";

                        ctx.fillStyle = "#444";

                        ctx.fillText(
                            value,
                            bar.x,
                            bar.y - 5
                        );

                        ctx.restore();

                    });

                });

            }

        };


        /* ======================================================
           CHART
        ====================================================== */

        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Putra",

                        data: putra,

                        borderWidth: 0,

                        borderRadius: 3,

                        categoryPercentage: 0.72,

                        barPercentage: 0.82
                    },

                    {
                        label: "Putri",

                        data: putri,

                        borderWidth: 0,

                        borderRadius: 3,

                        categoryPercentage: 0.72,

                        barPercentage: 0.82
                    }

                ]

            },


            plugins: [

                studentDataLabels

            ],


            options: {

                responsive: true,

                maintainAspectRatio: false,


                layout: {

                    padding: {

                        top: 30,

                        right: 10,

                        left: 10,

                        bottom: 10

                    }

                },


                plugins: {

                    legend: {

                        display: true,

                        position: "top",
                        
                        align: 'start'

                    },


                    tooltip: {

                        callbacks: {

                            label: function (context) {

                                return (
                                    " " +
                                    context.dataset.label +
                                    ": " +
                                    context.raw +
                                    " santri"
                                );

                            }

                        }

                    }

                },


                scales: {

                    x: {

                        stacked: false,


                        grid: {

                            display: false

                        },


                        ticks: {

                            maxRotation: 45,

                            minRotation: 45,

                            font: {

                                size: 11

                            }

                        }

                    },


                    y: {

                        beginAtZero: true,

                        suggestedMax: 30,


                        ticks: {

                            stepSize: 5

                        },


                        title: {

                            display: true,

                            text: "Jumlah Santri"

                        }

                    }

                }

            }

        });

    });

})();