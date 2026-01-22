const langButtons = document.querySelectorAll(".lang-btn");
const projectMeta = document.getElementById("project-meta");
const projectTitle = document.getElementById("project-title");
const projectDesc = document.getElementById("project-desc");
const projectTags = document.getElementById("project-tags");
const categoryLinks = document.getElementById("category-links");

const projectIndex = Number.parseInt(document.body.dataset.projectIndex, 10);

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
  document.title = `${project.title} | ${i18n[lang].projectPage.title}`;

  const imagesByCategory = normalizeImages(project.images || []);
  const items = [
    { key: "effect", label: i18n[lang].projectPage.effect, count: imagesByCategory.effect.length },
    { key: "plan", label: i18n[lang].projectPage.plan, count: imagesByCategory.plan.length },
    { key: "analysis", label: i18n[lang].projectPage.analysis, count: imagesByCategory.analysis.length }
  ];

  categoryLinks.innerHTML = items
    .map(
      (item) => `
        <a class="category-link" href="project-${projectIndex + 1}-${item.key}.html">
          ${item.label} <span class="category-count">${item.count}</span>
        </a>
      `
    )
    .join("");
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

const storedLang = localStorage.getItem("lang") || "zh";
setLanguage(storedLang);
