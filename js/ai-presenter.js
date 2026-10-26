
/* =========================================
   REUSABLE AI ROBOT PRESENTER
   Component : components/ai-presenter.html
   CSS       : css/ai-presenter.css
========================================= */

(async function () {
    "use strict";

    // Cari URL file JS ini untuk menentukan lokasi komponen.
    const currentScript = document.currentScript;
    const scriptURL = currentScript
        ? currentScript.src
        : new URL("ai-presenter.js", window.location.href).href;

    const componentURL = new URL(
        "../components/ai-presenter.html",
        scriptURL
    );

    const cssURL = new URL(
        "../css/ai-presenter.css",
        scriptURL
    );

    // Muat CSS satu kali.
    if (!document.querySelector("[data-ai-presenter-css]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssURL.href;
        link.dataset.aiPresenterCss = "true";
        document.head.appendChild(link);
    }

    async function init() {
        const mounts = document.querySelectorAll("[data-ai-presenter]");

        if (!mounts.length) {
            console.warn("AI Presenter: elemen [data-ai-presenter] tidak ditemukan.");
            return;
        }

        let html;

        try {
            const response = await fetch(componentURL);

            if (!response.ok) {
                throw new Error(
                    `Gagal memuat komponen: ${response.status} ${response.statusText}`
                );
            }

            html = await response.text();
        } catch (error) {
            console.error("AI Presenter:", error);

            mounts.forEach(mount => {
                mount.textContent =
                    "Panel AI Presenter gagal dimuat. Periksa path file.";
            });

            return;
        }

        mounts.forEach(mount => {
            mount.innerHTML = html;
            setupPresenter(mount);
        });
    }

    function setupPresenter(mount) {
        const panel = mount.querySelector(".ai-presenter");

        // Selector konten dapat ditentukan per halaman.
        const contentSelector =
            mount.dataset.content || ".news-detail-content";

        const content = document.querySelector(contentSelector);

        if (!panel) {
            console.error("AI Presenter: markup .ai-presenter tidak ditemukan.");
            return;
        }

        const get = name =>
            panel.querySelector(`[data-speech="${name}"]`);

        const playBtn = get("play");
        const pauseBtn = get("pause");
        const resumeBtn = get("resume");
        const stopBtn = get("stop");
        const voiceSelect = get("voice");
        const rateInput = get("rate");
        const rateValue = get("rate-value");
        const statusText = get("status");
        const progressBar = get("progress");

        if (
            !playBtn || !pauseBtn || !resumeBtn || !stopBtn ||
            !voiceSelect || !rateInput || !rateValue ||
            !statusText || !progressBar
        ) {
            console.error(
                "AI Presenter: periksa elemen data-speech di ai-presenter.html."
            );
            return;
        }

        if (!content) {
            statusText.textContent =
                `Konten berita "${contentSelector}" tidak ditemukan.`;

            playBtn.disabled = true;
            console.error(
                `AI Presenter: selector konten ${contentSelector} tidak ditemukan.`
            );
            return;
        }

        if (!("speechSynthesis" in window) ||
            !("SpeechSynthesisUtterance" in window)) {
            statusText.textContent =
                "Browser ini tidak mendukung pembacaan suara.";

            playBtn.disabled = true;
            return;
        }

        const synth = window.speechSynthesis;

        let voices = [];
        let paragraphs = [];
        let currentIndex = 0;
        let sessionId = 0;
        let isPlaying = false;
        let isPaused = false;

        function setStatus(message) {
            statusText.textContent = message;
        }

        function updateButtons() {
            playBtn.disabled = isPlaying && !isPaused;
            pauseBtn.disabled = !isPlaying || isPaused;
            resumeBtn.disabled = !isPlaying || !isPaused;
            stopBtn.disabled = !isPlaying;
        }

        function clearHighlight() {
            content.querySelectorAll(".speech-current").forEach(el => {
                el.classList.remove("speech-current");
            });
        }

        function getNewsElements() {
            return Array.from(
                content.querySelectorAll(
                    "h1, h2, h3, h4, p, li, figcaption"
                )
            ).filter(element => {
                if (element.closest(".ai-presenter")) return false;

                if (element.closest(
                    "[hidden], script, style, nav, button"
                )) {
                    return false;
                }

                return element.textContent.trim().length > 0;
            });
        }


        function loadVoices() {
            const previousValue = voiceSelect.value;

            voices = synth.getVoices();
            voiceSelect.replaceChildren();

            if (!voices.length) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Suara browser belum tersedia";
                voiceSelect.appendChild(option);
                return;
            }

            // Urutkan agar suara Indonesia tampil lebih dahulu.
            const sortedVoices = [...voices].sort((a, b) => {
                const aIndonesian = a.lang.toLowerCase().startsWith("id");
                const bIndonesian = b.lang.toLowerCase().startsWith("id");

                if (aIndonesian && !bIndonesian) return -1;
                if (!aIndonesian && bIndonesian) return 1;

                return a.name.localeCompare(b.name);
            });

            sortedVoices.forEach(voice => {
                const option = document.createElement("option");

                option.value = `${voice.name}|${voice.lang}`;
                option.textContent = `${voice.name} (${voice.lang})`;

                voiceSelect.appendChild(option);
            });

            const previousExists = sortedVoices.some(voice =>
                `${voice.name}|${voice.lang}` === previousValue
            );

            // Utamakan suara Indonesia bila tersedia.
            const defaultVoice = sortedVoices.find(voice =>
                voice.lang.toLowerCase().startsWith("id")
            ) || sortedVoices[0];

            voiceSelect.value = previousExists
                ? previousValue
                : `${defaultVoice.name}|${defaultVoice.lang}`;
        }

        function getSelectedVoice() {
            return voices.find(voice =>
                `${voice.name}|${voice.lang}` === voiceSelect.value
            ) || null;
        }

        // Muat suara saat tersedia.
        loadVoices();
        synth.addEventListener("voiceschanged", loadVoices);


        function speakNext(activeSession) {
            if (
                activeSession !== sessionId ||
                !isPlaying ||
                isPaused
            ) {
                return;
            }

            if (currentIndex >= paragraphs.length) {
                isPlaying = false;
                isPaused = false;

                clearHighlight();
                panel.classList.remove("is-speaking");
                progressBar.style.width = "100%";

                setStatus("Pembacaan berita selesai.");
                updateButtons();
                return;
            }

            const element = paragraphs[currentIndex];
            const text = element.textContent.trim();

            if (!text) {
                currentIndex++;
                speakNext(activeSession);
                return;
            }

            clearHighlight();
            element.classList.add("speech-current");

            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            progressBar.style.width =
                `${(currentIndex / paragraphs.length) * 100}%`;

            const utterance = new SpeechSynthesisUtterance(text);
            const voice = getSelectedVoice();

            utterance.lang = voice ? voice.lang : "id-ID";

            if (voice) {
                utterance.voice = voice;
            }

            utterance.rate = Number(rateInput.value);
            utterance.pitch = 1;
            utterance.volume = 1;

            setStatus(
                `Membacakan bagian ${currentIndex + 1} dari ${paragraphs.length}`
            );

            utterance.onend = () => {
                if (
                    activeSession !== sessionId ||
                    !isPlaying
                ) {
                    return;
                }

                currentIndex++;
                speakNext(activeSession);
            };

            utterance.onerror = event => {
                if (activeSession !== sessionId) return;

                if (
                    event.error === "canceled" ||
                    event.error === "interrupted"
                ) {
                    return;
                }

                isPlaying = false;
                isPaused = false;

                clearHighlight();
                panel.classList.remove("is-speaking");

                setStatus("Suara gagal diputar. Silakan coba lagi.");
                updateButtons();
            };

            synth.speak(utterance);
        }

        // PLAY
        playBtn.addEventListener("click", () => {
            sessionId++;
            synth.cancel();

            paragraphs = getNewsElements();
            currentIndex = 0;
            isPlaying = true;
            isPaused = false;

            clearHighlight();
            panel.classList.add("is-speaking");
            progressBar.style.width = "0%";

            updateButtons();

            if (!paragraphs.length) {
                isPlaying = false;
                panel.classList.remove("is-speaking");

                setStatus("Konten berita tidak ditemukan.");
                updateButtons();
                return;
            }

            speakNext(sessionId);
        });

        // PAUSE
        pauseBtn.addEventListener("click", () => {
            if (!isPlaying || isPaused) return;

            synth.pause();
            isPaused = true;

            setStatus("Pembacaan dijeda.");
            updateButtons();
        });

        // RESUME
        resumeBtn.addEventListener("click", () => {
            if (!isPlaying || !isPaused) return;

            isPaused = false;
            synth.resume();

            setStatus("Melanjutkan pembacaan...");
            updateButtons();
        });

        // STOP
        stopBtn.addEventListener("click", () => {
            sessionId++;
            synth.cancel();

            isPlaying = false;
            isPaused = false;
            currentIndex = 0;

            clearHighlight();
            panel.classList.remove("is-speaking");
            progressBar.style.width = "0%";

            setStatus("Pembacaan dihentikan.");
            updateButtons();
        });

        // KECEPATAN
        rateInput.addEventListener("input", () => {
            rateValue.textContent =
                `${Number(rateInput.value).toFixed(1)}×`;
        });

        // GANTI SUARA
        voiceSelect.addEventListener("change", () => {
            if (!isPlaying) return;

            const wasPaused = isPaused;

            sessionId++;
            synth.cancel();

            isPaused = false;
            speakNext(sessionId);

            if (wasPaused) {
                // Perubahan suara melanjutkan dari bagian saat ini.
                // Jika ingin menjeda kembali, tekan tombol Pause.
                setStatus("Suara diganti. Tekan Pause jika diperlukan.");
            }
        });

        loadVoices();
        synth.addEventListener("voiceschanged", loadVoices);

        updateButtons();
    }

    // Tunggu DOM siap sebelum mencari elemen pemanggil.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
