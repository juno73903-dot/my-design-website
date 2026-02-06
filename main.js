const langButtons = document.querySelectorAll(".lang-btn");
const profileGrid = document.getElementById("profile-grid");
const educationEl = document.getElementById("education");
const expertiseEl = document.getElementById("expertise-chips");
const projectsEl = document.getElementById("projects-grid");
const ruralEl = document.getElementById("rural-grid");
const approachEl = document.getElementById("approach");
const contactEl = document.getElementById("contact-card");
const ruralLightbox = document.getElementById("rural-lightbox");
const ruralLightboxImage = document.getElementById("rural-lightbox-image");
const ruralLightboxCaption = document.getElementById("rural-lightbox-caption");

let ruralLightboxProject = 0;
let ruralLightboxIndex = 0;
let ruralLightboxImages = [];
let ruralLightboxTitle = "";

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
      (project, index) => {
        const coverIndexMap = { 0: 1, 1: 1, 2: 0, 3: 3, 4: 1 };
        const coverIndex = coverIndexMap[index] ?? 0;
        const coverImage = project?.images?.effect?.[coverIndex] || project?.images?.effect?.[0];
        const cover = coverImage?.thumb || coverImage?.full || "";
        const coverHtml = cover ? `<div class="project-cover"><img src="${cover}" alt="${project.title}" loading="lazy" /></div>` : "";
        return `
        <a class="project-card" href="project-${index + 1}.html">
          ${coverHtml}
          <div class="project-meta">${project.meta}</div>
          <div class="project-title">${project.title}</div>
          <div class="project-desc">${project.desc}</div>
          <div class="tag-row">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </a>
      `;
      }
    )
    .join("");

  ruralEl.innerHTML = ruralData[lang]
    .map((item, projectIndex) => {
      const bodyHtml = Array.isArray(item.body)
        ? item.body.map((paragraph) => `<p>${paragraph}</p>`).join("")
        : `<p>${item.body}</p>`;
      const thumbs = (item.images || []).slice(0, 3);
      const countLabel = i18n[lang]?.rural?.count?.replace("{count}", item.images?.length || 0) || "";
      return `
        <div class="rural-card">
          <div class="rural-card-title">${item.title}</div>
          <div class="rural-card-body">${bodyHtml}</div>
          <div class="rural-thumbs">
            ${thumbs
              .map(
                (src, index) =>
                  `<img src="${src}" alt="${item.title}" loading="lazy" data-project="${projectIndex}" data-image="${index}" />`
              )
              .join("")}
          </div>
          <div class="rural-count">${countLabel}</div>
        </div>
      `;
    })
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

function openRuralLightbox(projectIndex, imageIndex, lang) {
  const project = ruralData[lang][projectIndex];
  ruralLightboxImages = project?.images || [];
  ruralLightboxTitle = project?.title || "";
  ruralLightboxProject = projectIndex;
  ruralLightboxIndex = imageIndex;
  const src = ruralLightboxImages[ruralLightboxIndex];
  if (!src) return;
  ruralLightboxImage.src = src;
  ruralLightboxImage.alt = ruralLightboxTitle;
  ruralLightboxCaption.textContent = `${ruralLightboxTitle} · ${ruralLightboxIndex + 1}/${ruralLightboxImages.length}`;
  ruralLightbox.classList.add("open");
  ruralLightbox.setAttribute("aria-hidden", "false");
}

function closeRuralLightbox() {
  ruralLightbox.classList.remove("open");
  ruralLightbox.setAttribute("aria-hidden", "true");
}

function stepRuralLightbox(delta) {
  if (!ruralLightboxImages.length) return;
  ruralLightboxIndex = (ruralLightboxIndex + delta + ruralLightboxImages.length) % ruralLightboxImages.length;
  const src = ruralLightboxImages[ruralLightboxIndex];
  ruralLightboxImage.src = src;
  ruralLightboxCaption.textContent = `${ruralLightboxTitle} · ${ruralLightboxIndex + 1}/${ruralLightboxImages.length}`;
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

ruralEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  const projectIndex = Number(target.dataset.project);
  const imageIndex = Number(target.dataset.image);
  const lang = localStorage.getItem("lang") || "zh";
  openRuralLightbox(projectIndex, imageIndex, lang);
});

document.querySelectorAll("[data-lightbox-close]").forEach((btn) => {
  btn.addEventListener("click", closeRuralLightbox);
});

document.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => stepRuralLightbox(-1));
document.querySelector("[data-lightbox-next]")?.addEventListener("click", () => stepRuralLightbox(1));

document.addEventListener("keydown", (event) => {
  if (!ruralLightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeRuralLightbox();
  if (event.key === "ArrowLeft") stepRuralLightbox(-1);
  if (event.key === "ArrowRight") stepRuralLightbox(1);
});

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



