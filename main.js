const langButtons = document.querySelectorAll(".lang-btn");
const profileGrid = document.getElementById("profile-grid");
const educationEl = document.getElementById("education");
const expertiseEl = document.getElementById("expertise-chips");
const projectsEl = document.getElementById("projects-grid");
const galleryEl = document.getElementById("gallery-grid");
const approachEl = document.getElementById("approach");
const contactEl = document.getElementById("contact-card");

function updateText(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  const entries = document.querySelectorAll("[data-i18n]");
  entries.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const parts = key.split(".");
    let current = i18n[lang];
    parts.forEach((part) => {
      if (current && current[part] !== undefined) {
        current = current[part];
      }
    });
    if (typeof current === "string") {
      node.textContent = current;
    }
  });

  profileGrid.innerHTML = profileData[lang]
    .map((item) => `<div class="profile-item"><span>${item.label}</span><span>${item.value}</span></div>`)
    .join("");

  educationEl.innerHTML = educationData[lang].map((item) => `<div>${item}</div>`).join("");

  expertiseEl.innerHTML = expertiseData[lang]
    .map((item) => `<div class="chip">${item}</div>`)
    .join("");

  projectsEl.innerHTML = projectsData[lang]
    .map(
      (project, index) => `
        <a class="project-card" href="project-${index + 1}.html">
          <div class="project-meta">${project.meta}</div>
          <div class="project-title">${project.title}</div>
          <div class="project-desc">${project.desc}</div>
          <div class="tag-row">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </a>
      `
    )
    .join("");

  galleryEl.innerHTML = galleryData[lang]
    .map(
      (item) => `
        <figure class="gallery-card">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" />
          <figcaption class="gallery-caption">${item.caption}</figcaption>
        </figure>
      `
    )
    .join("");

  approachEl.innerHTML = approachData[lang]
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-body">${item.body}</div>
        </div>
      `
    )
    .join("");

  contactEl.innerHTML = contactData[lang]
    .map((item) => `<div class="contact-row"><span>${item.label}</span><span>${item.value}</span></div>`)
    .join("");

}

function setLanguage(lang) {
  langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
  updateText(lang);
  localStorage.setItem("lang", lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

const storedLang = localStorage.getItem("lang") || "zh";
setLanguage(storedLang);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

if (window.gsap) {
  gsap.from(".hero-text", { opacity: 0, y: 20, duration: 1.1, ease: "power3.out" });
  gsap.from(".hero-card", { opacity: 0, y: 30, duration: 1.1, delay: 0.2, ease: "power3.out" });
  gsap.to(".orb-1", { x: 40, y: -30, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-2", { x: -30, y: 40, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-3", { x: 20, y: 50, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });
}



