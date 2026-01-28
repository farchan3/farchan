/* =========================
   Farchan — main.js
   - Theme toggle (persisted)
   - Subtle reveal on scroll
   - Footer year
   - No inline scripts required
   ========================= */

(function () {
    "use strict";

    const THEME_KEY = "farchan_theme"; // 'light' | 'dark'
    const root = document.documentElement;

    function systemPrefersDark() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function getSavedTheme() {
        try { return localStorage.getItem(THEME_KEY); } catch { return null; }
    }

    function saveTheme(theme) {
        try { localStorage.setItem(THEME_KEY, theme); } catch {}
    }

    function applyTheme(theme) {
        if (theme === "light" || theme === "dark") {
            root.setAttribute("data-theme", theme);
        } else {
            root.removeAttribute("data-theme"); // fallback to system via CSS
        }

        const btn = document.querySelector("[data-theme-toggle]");
        if (!btn) return;

        const isDark = (theme ? theme === "dark" : systemPrefersDark());
        btn.setAttribute("aria-pressed", String(isDark));

        const ico = btn.querySelector(".theme-ico");
        const label = btn.querySelector(".theme-label");
        if (ico) ico.textContent = isDark ? "☼" : "☾";
        if (label) label.textContent = isDark ? "Light" : "Dark";
    }

    function initTheme() {
        const saved = getSavedTheme();
        applyTheme(saved);

        const btn = document.querySelector("[data-theme-toggle]");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const current = getSavedTheme();
            const isCurrentlyDark = (current ? current === "dark" : systemPrefersDark());
            const next = isCurrentlyDark ? "light" : "dark";
            saveTheme(next);
            applyTheme(next);
        });
    }

    function initReveal() {
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
            return;
        }

        const els = Array.from(document.querySelectorAll("[data-reveal]"));
        if (!("IntersectionObserver" in window) || els.length === 0) {
            els.forEach(el => el.classList.add("is-visible"));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("is-visible");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        els.forEach(el => io.observe(el));
    }

    function initYear() {
        const y = document.querySelector("[data-year]");
        if (y) y.textContent = String(new Date().getFullYear());
    }

    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initReveal();
        initYear();
    });
})();
