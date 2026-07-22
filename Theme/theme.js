// Global theme manager
(function () {
  const THEME_KEY = "theme";

  const defaultTheme = "light";

  function apply(theme) {
    if (!theme) theme = defaultTheme;
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme } }),
      );
    } catch (e) {
      console.error("Falha ao aplicar tema:", e);
    }
  }

  function get() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem(THEME_KEY) ||
      defaultTheme
    );
  }

  function toggle() {
    const next = get() === "dark" ? "light" : "dark";
    apply(next);
    return next;
  }

  function init() {
    const saved = localStorage.getItem(THEME_KEY) || defaultTheme;
    // apply immediately
    document.documentElement.setAttribute("data-theme", saved);
    // small delay to allow CSS to pick up before any animated changes
    requestAnimationFrame(() => {
      window.dispatchEvent(
        new CustomEvent("themeinit", { detail: { theme: saved } }),
      );
    });
    return saved;
  }

  // Expose API
  window.Theme = {
    init,
    apply,
    get,
    toggle,
  };

  // auto init
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
