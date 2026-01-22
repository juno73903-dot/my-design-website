const langButtons = document.querySelectorAll(".lang-btn");
const projectMeta = document.getElementById("project-meta");
const projectTitle = document.getElementById("project-title");
const projectDesc = document.getElementById("project-desc");
const projectTags = document.getElementById("project-tags");
const projectGallery = document.getElementById("project-gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxCloseEls = document.querySelectorAll("[data-lightbox-close]");

const projectIndex = Number.parseInt(document.body.dataset.projectIndex, 10);
const categoryKey = document.body.dataset.category;
let activeImages = [];
let activeIndex = 0;

function updateI18n(lang) {
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
}

function normalizeImages(images) {
  if (Array.isArray(images)) {
    return {
      effect: images,
      plan: [],
      analysis: []
    };
  }
  return {
    effect: images && images.effect ? images.effect : [],
    plan: images && images.plan ? images.plan : [],
    analysis: images && images.analysis ? images.analysis : []
  };
}

function getThumb(item) {
  return typeof item === "string" ? item : item.thumb;
}

function getFull(item) {
  return typeof item === "string" ? item : item.full;
}

function updateProject(lang) {
  const project = projectsData[lang] && projectsData[lang][projectIndex];
  if (!project) {
    projectTitle.textContent = "Project not found";
    return;
  }

  projectMeta.textContent = project.meta;
  projectTitle.textContent = project.title;
  projectDesc.textContent = project.desc;
  projectTags.innerHTML = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  const imagesByCategory = normalizeImages(project.images || []);
  activeImages = imagesByCategory[categoryKey] || [];

  projectGallery.innerHTML = activeImages.length
    ? activeImages
        .map((item, index) => {
          const thumb = encodeURI(getThumb(item));
          return `<img src="${thumb}" alt="${project.title}" loading="lazy" data-image-index="${index}" />`;
        })
        .join("")
    : `<div class="project-gallery-empty">${i18n[lang].projectPage.empty}</div>`;

  const categoryLabel = i18n[lang].projectPage[categoryKey] || i18n[lang].projectPage.gallery;
  document.title = `${project.title} | ${categoryLabel}`;
}

function openLightbox(index) {
  if (!activeImages.length || !lightboxImage || !lightboxCaption || !lightbox) {
    return;
  }
  activeIndex = index;
  const current = activeImages[activeIndex];
  lightboxImage.src = encodeURI(getFull(current));
  lightboxImage.alt = projectTitle.textContent;
  lightboxCaption.textContent = `${activeIndex + 1} / ${activeImages.length}`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  if (!activeImages.length) {
    return;
  }
  activeIndex = (activeIndex + 1) % activeImages.length;
  openLightbox(activeIndex);
}

function showPrev() {
  if (!activeImages.length) {
    return;
  }
  activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
  openLightbox(activeIndex);
}

function setLanguage(lang) {
  langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
  updateI18n(lang);
  updateProject(lang);
  localStorage.setItem("lang", lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

projectGallery.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) {
    return;
  }
  const index = Number.parseInt(target.dataset.imageIndex, 10);
  if (!Number.isNaN(index)) {
    openLightbox(index);
  }
});

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", showPrev);
}
if (lightboxNext) {
  lightboxNext.addEventListener("click", showNext);
}
lightboxCloseEls.forEach((el) => el.addEventListener("click", closeLightbox));

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) {
    return;
  }
  if (event.key === "Escape") {
    closeLightbox();
  }
  if (event.key === "ArrowRight") {
    showNext();
  }
  if (event.key === "ArrowLeft") {
    showPrev();
  }
});

const storedLang = localStorage.getItem("lang") || "zh";
setLanguage(storedLang);
