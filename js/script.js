document.addEventListener("DOMContentLoaded", () => {
  // 1. Etkileşim: Karanlık Mod (Dark Mode) ve Tercih Kaydı
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem("gep1316_theme");

  function applyTheme(theme) {
    if (theme === "dark") {
      rootEl.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.textContent = "☀️ Aydınlık Mod";
        themeToggle.setAttribute("aria-pressed", "true");
      }
    } else {
      rootEl.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.textContent = "🌙 Karanlık Mod";
        themeToggle.setAttribute("aria-pressed", "false");
      }
    }
  }

  applyTheme(savedTheme || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = rootEl.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("gep1316_theme", next);
      applyTheme(next);
    });
  }

  // 2. Etkileşim: Mobil Gezinti Menüsü (Tıklama ve Esc Tuşu Desteği)
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteNav.classList.contains("open")) {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.focus();
      }
    });
  }

  // 3. Etkileşim: Proje Kategori Filtreleme ve Canlı Arama
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectSearch = document.getElementById("projectSearch");
  const projectCards = document.querySelectorAll(".project-card");
  const filterStatus = document.getElementById("filterStatus");
  let activeCategory = "all";

  function filterProjects() {
    if (projectCards.length === 0) return;
    const query = projectSearch ? projectSearch.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const textContent = card.textContent.toLowerCase();
      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const matchesSearch = query === "" || textContent.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (filterStatus) {
      filterStatus.textContent =
        visibleCount > 0
          ? `${visibleCount} çalışma gösteriliyor.`
          : "Aramanızla eşleşen proje bulunamadı.";
    }
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-filter");
        filterProjects();
      });
    });
  }

  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
  }

  // 4. Etkileşim: İletişim Formu Doğrulama ve Geri Bildirim Mesajı
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("senderName");
      const emailInput = document.getElementById("senderEmail");
      const subjectInput = document.getElementById("senderSubject");
      const messageInput = document.getElementById("senderMessage");

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const subjectError = document.getElementById("subjectError");
      const messageError = document.getElementById("messageError");
      const feedback = document.getElementById("contactFeedback");

      nameError.textContent = "";
      emailError.textContent = "";
      subjectError.textContent = "";
      messageError.textContent = "";
      feedback.textContent = "";

      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (nameInput.value.trim().length < 2) {
        nameError.textContent = "Lütfen en az 2 karakterlik ad soyad girin.";
        isValid = false;
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = "Lütfen geçerli bir e-posta adresi girin.";
        isValid = false;
      }

      if (!subjectInput.value) {
        subjectError.textContent = "Lütfen bir konu seçin.";
        isValid = false;
      }

      if (messageInput.value.trim().length < 10) {
        messageError.textContent = "Mesajınız en az 10 karakter uzunluğunda olmalıdır.";
        isValid = false;
      }

      if (isValid) {
        feedback.textContent = `Teşekkürler ${nameInput.value.trim()}, form doğrulandı ve mesajınız başarıyla iletildi!`;
        contactForm.reset();
      }
    });
  }

  // 5. Etkileşim: Ödev 1 — Öğrenci Not Hesaplayıcı Canlı Simülasyonu
  const gradeDemoForm = document.getElementById("gradeDemoForm");
  const demoMessage = document.getElementById("demoMessage");
  const demoRecords = document.getElementById("demoRecords");
  const clearDemoBtn = document.getElementById("clearDemoBtn");
  const ogrenciKayitlari = {};

  function harfNotuBelirle(ortalama) {
    if (ortalama >= 85) return "A";
    if (ortalama >= 70) return "B";
    if (ortalama >= 50) return "C";
    return "F";
  }

  function kayitlariGuncelle() {
    if (!demoRecords) return;
    demoRecords.innerHTML = "";
    Object.keys(ogrenciKayitlari).forEach((isim) => {
      const kayit = ogrenciKayitlari[isim];
      const item = document.createElement("div");
      item.className = "record-item";
      item.innerHTML = `
        <span>${isim}</span>
        <span>Ortalama: ${kayit.ortalama.toFixed(1)} | Harf Notu: ${kayit.harf}</span>
      `;
      demoRecords.appendChild(item);
    });
  }

  if (gradeDemoForm) {
    gradeDemoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isim = document.getElementById("studentName").value.trim();
      const not1Raw = document.getElementById("grade1").value.trim();
      const not2Raw = document.getElementById("grade2").value.trim();

      if (!isim) {
        demoMessage.textContent = "Hata: Lütfen öğrenci adını ve soyadını girin.";
        return;
      }
      if (not1Raw === "") {
        demoMessage.textContent = "Hata: En az 1. not alanını doldurmalısınız.";
        return;
      }

      const gecerliNotlar = [];
      const not1 = Number(not1Raw);
      if (Number.isNaN(not1) || not1 < 0 || not1 > 100) {
        demoMessage.textContent = "Hata: 1. not 0 ile 100 arasında olmalıdır.";
        return;
      }
      gecerliNotlar.push(not1);

      if (not2Raw !== "") {
        const not2 = Number(not2Raw);
        if (Number.isNaN(not2) || not2 < 0 || not2 > 100) {
          demoMessage.textContent = "Hata: 2. not 0 ile 100 arasında olmalıdır.";
          return;
        }
        gecerliNotlar.push(not2);
      }

      const ortalama =
        gecerliNotlar.reduce((toplam, n) => toplam + n, 0) / gecerliNotlar.length;
      const harf = harfNotuBelirle(ortalama);

      ogrenciKayitlari[isim] = { ortalama, harf };
      demoMessage.textContent = `Kaydedildi: ${isim} — Ortalama: ${ortalama.toFixed(1)} (${harf})`;
      kayitlariGuncelle();
      gradeDemoForm.reset();
    });
  }

  if (clearDemoBtn) {
    clearDemoBtn.addEventListener("click", () => {
      Object.keys(ogrenciKayitlari).forEach((key) => delete ogrenciKayitlari[key]);
      demoRecords.innerHTML = "";
      demoMessage.textContent = "Kayıt listesi temizlendi.";
    });
  }
});