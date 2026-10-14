class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("kd_lang") || "en";
    this.dictionaries = { en: {}, hi: {} };
    this.isLoaded = false;
  }

  async init() {
    try {
      const [enRes, hiRes] = await Promise.all([
        fetch("/locales/en.json"),
        fetch("/locales/hi.json")
      ]);
      this.dictionaries.en = await enRes.json();
      this.dictionaries.hi = await hiRes.json();
      this.isLoaded = true;
      this.applyTranslations();
    } catch (err) {
      console.warn("I18n loading failed, using fallback:", err);
    }
  }

  setLanguage(lang) {
    if (lang === "en" || lang === "hi") {
      this.currentLang = lang;
      localStorage.setItem("kd_lang", lang);
      this.applyTranslations();
      document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    }
  }

  t(key, fallback = "") {
    const dict = this.dictionaries[this.currentLang] || this.dictionaries.en;
    return dict[key] || fallback || key;
  }

  applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === "INPUT" && el.getAttribute("placeholder")) {
          el.setAttribute("placeholder", translation);
        } else {
          el.textContent = translation;
        }
      }
    });

    // Update active button state
    document.querySelectorAll(".lang-btn").forEach(btn => {
      if (btn.getAttribute("data-lang") === this.currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

window.i18n = new I18nManager();
