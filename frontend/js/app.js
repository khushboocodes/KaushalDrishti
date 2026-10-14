class AppCoordinator {
  constructor() {
    this.currentView = "command-center";
    this.viewInstances = {
      "command-center": window.CommandCenterModule,
      "district-explorer": window.DistrictExplorerModule,
      "trade-deep-dive": window.TradeDeepDiveModule,
      "alert-center": window.AlertCenterModule,
      "simulator": window.SimulatorModule,
      "export-hub": window.ExportHubModule
    };
  }

  async init() {
    // 1. Initialize i18n
    if (window.i18n) {
      await window.i18n.init();
    }

    // 2. Bind Navigation
    this.bindNavigation();

    // 3. Bind Theme Toggle
    this.bindTheme();

    // 4. Bind Language Toggle
    this.bindLanguage();

    // 5. Initial View Load
    await this.switchView("command-center");
  }

  bindNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = link.getAttribute("data-view");
        this.switchView(targetView);
      });
    });
  }

  bindTheme() {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;

    const savedTheme = localStorage.getItem("kd_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("kd_theme", next);
    });
  }

  bindLanguage() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        window.i18n.setLanguage(lang);
      });
    });
  }

  async switchView(viewName, params = {}) {
    if (!this.viewInstances[viewName]) {
      console.warn("View not found:", viewName);
      return;
    }

    this.currentView = viewName;

    // Update nav active state
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-view") === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Hide all view containers, show target container
    document.querySelectorAll(".view-container").forEach(c => c.classList.add("hidden"));
    
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.remove("hidden");
      await this.viewInstances[viewName].init(`view-${viewName}`, params);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppCoordinator();
  window.app.init();
});
