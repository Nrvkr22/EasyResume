// ===== Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const setTheme = (dark) => {
    if (dark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "🔆";
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    }
  };

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark");

  themeToggle.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark-mode"));
  });
}

// ===== Helper: Create entry block with remove button =====
function createEntryBlock(className, innerHTML) {
  const block = document.createElement("div");
  block.classList.add("entry-block", className);
  block.innerHTML = `
    <button type="button" class="btn-remove-entry" title="Remove">&times;</button>
    ${innerHTML}
  `;
  block.querySelector(".btn-remove-entry").addEventListener("click", () => {
    block.style.opacity = "0";
    block.style.transform = "translateY(-10px)";
    block.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    setTimeout(() => block.remove(), 250);
  });
  return block;
}

// ===== Dynamic Sections: Add Education / Experience =====
document.addEventListener("click", (e) => {
  if (e.target.id === "addEducation") {
    const section = document.getElementById("educationSection");
    const block = createEntryBlock("edu-item", `
      <input type="text" class="form-control mb-2 edu-degree" placeholder="Degree">
      <input type="text" class="form-control mb-2 edu-institute" placeholder="Institution">
      <input type="text" class="form-control edu-year" placeholder="Year">
    `);
    section.appendChild(block);
  }

  if (e.target.id === "addExperience") {
    const section = document.getElementById("experienceSection");
    const block = createEntryBlock("exp-item", `
      <input type="text" class="form-control mb-2 exp-title" placeholder="Job Title">
      <input type="text" class="form-control mb-2 exp-company" placeholder="Company">
      <input type="text" class="form-control mb-2 exp-duration" placeholder="Duration (e.g., 2020 – 2022)">
      <textarea class="form-control exp-desc" rows="2" placeholder="Description"></textarea>
    `);
    section.appendChild(block);
  }
});

// ===== Save Resume Data =====
const saveButton = document.getElementById("saveResume");
if (saveButton) {
  saveButton.addEventListener("click", () => {
    const education = Array.from(document.querySelectorAll(".edu-item")).map(e => ({
      degree: e.querySelector(".edu-degree").value,
      institute: e.querySelector(".edu-institute").value,
      year: e.querySelector(".edu-year").value,
    }));

    const experience = Array.from(document.querySelectorAll(".exp-item")).map(e => ({
      title: e.querySelector(".exp-title").value,
      company: e.querySelector(".exp-company").value,
      duration: e.querySelector(".exp-duration").value,
      desc: e.querySelector(".exp-desc").value,
    }));

    const resumeData = {
      name: document.getElementById("fullName").value,
      title: document.getElementById("designation").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      summary: document.getElementById("summary").value,
      education,
      experience,
      skills: document.getElementById("skills").value,
    };

    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    window.location.href = "preview.html";
  });
}

// ===== Populate Builder Form (for edit-back) =====
if (window.location.pathname.includes("builder.html")) {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");
  if (data.name) {
    document.getElementById("fullName").value = data.name || "";
    document.getElementById("designation").value = data.title || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("summary").value = data.summary || "";
    document.getElementById("skills").value = data.skills || "";

    // Populate first education entry
    const firstEdu = document.querySelector(".edu-item");
    if (firstEdu && data.education && data.education.length > 0) {
      firstEdu.querySelector(".edu-degree").value = data.education[0].degree || "";
      firstEdu.querySelector(".edu-institute").value = data.education[0].institute || "";
      firstEdu.querySelector(".edu-year").value = data.education[0].year || "";
    }

    // Add remaining education entries
    if (data.education && data.education.length > 1) {
      const eduSection = document.getElementById("educationSection");
      for (let i = 1; i < data.education.length; i++) {
        const block = createEntryBlock("edu-item", `
          <input type="text" class="form-control mb-2 edu-degree" placeholder="Degree" value="${data.education[i].degree || ''}">
          <input type="text" class="form-control mb-2 edu-institute" placeholder="Institution" value="${data.education[i].institute || ''}">
          <input type="text" class="form-control edu-year" placeholder="Year" value="${data.education[i].year || ''}">
        `);
        eduSection.appendChild(block);
      }
    }

    // Populate first experience entry
    const firstExp = document.querySelector(".exp-item");
    if (firstExp && data.experience && data.experience.length > 0) {
      firstExp.querySelector(".exp-title").value = data.experience[0].title || "";
      firstExp.querySelector(".exp-company").value = data.experience[0].company || "";
      firstExp.querySelector(".exp-duration").value = data.experience[0].duration || "";
      firstExp.querySelector(".exp-desc").value = data.experience[0].desc || "";
    }

    // Add remaining experience entries
    if (data.experience && data.experience.length > 1) {
      const expSection = document.getElementById("experienceSection");
      for (let i = 1; i < data.experience.length; i++) {
        const block = createEntryBlock("exp-item", `
          <input type="text" class="form-control mb-2 exp-title" placeholder="Job Title" value="${data.experience[i].title || ''}">
          <input type="text" class="form-control mb-2 exp-company" placeholder="Company" value="${data.experience[i].company || ''}">
          <input type="text" class="form-control mb-2 exp-duration" placeholder="Duration" value="${data.experience[i].duration || ''}">
          <textarea class="form-control exp-desc" rows="2" placeholder="Description">${data.experience[i].desc || ''}</textarea>
        `);
        expSection.appendChild(block);
      }
    }
  }
}

// ===== Load Resume Data on Preview Page =====
if (window.location.pathname.includes("preview.html")) {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");

  // Header
  document.getElementById("previewName").textContent = data.name || "Your Name";
  document.getElementById("previewTitle").textContent = data.title || "";

  // Contact
  const emailEl = document.getElementById("contactEmail");
  const phoneEl = document.getElementById("contactPhone");
  if (data.email) emailEl.innerHTML = `✉ ${data.email}`;
  if (data.phone) phoneEl.innerHTML = `☎ ${data.phone}`;

  // Summary
  const summarySection = document.getElementById("sectionSummary");
  if (data.summary) {
    document.getElementById("previewSummary").textContent = data.summary;
  } else {
    summarySection.style.display = "none";
  }

  // Skills (rendered as tags)
  const skillsSection = document.getElementById("sectionSkills");
  const skillsContainer = document.getElementById("previewSkills");
  if (data.skills && data.skills.trim()) {
    const skillsArr = data.skills.split(",").map(s => s.trim()).filter(s => s);
    skillsContainer.innerHTML = skillsArr.map(s => `<span class="skill-tag">${s}</span>`).join("");
  } else {
    skillsSection.style.display = "none";
  }

  // Education
  const eduSection = document.getElementById("sectionEducation");
  const eduContainer = document.getElementById("previewEducation");
  if (data.education && data.education.length > 0 && data.education.some(e => e.degree)) {
    eduContainer.innerHTML = data.education
      .filter(e => e.degree)
      .map(e => `
        <div class="resume-entry">
          <div class="resume-entry-header">
            <h4>${e.degree}</h4>
            <span>${e.year || ''}</span>
          </div>
          <div class="resume-entry-sub">${e.institute || ''}</div>
        </div>
      `).join("");
  } else {
    eduSection.style.display = "none";
  }

  // Experience
  const expSection = document.getElementById("sectionExperience");
  const expContainer = document.getElementById("previewExperience");
  if (data.experience && data.experience.length > 0 && data.experience.some(e => e.title)) {
    expContainer.innerHTML = data.experience
      .filter(e => e.title)
      .map(e => `
        <div class="resume-entry">
          <div class="resume-entry-header">
            <h4>${e.title}</h4>
            <span>${e.duration || ''}</span>
          </div>
          <div class="resume-entry-sub">${e.company || ''}</div>
          ${e.desc ? `<p class="resume-entry-desc">${e.desc}</p>` : ''}
        </div>
      `).join("");
  } else {
    expSection.style.display = "none";
  }

  // ===== Download PDF =====
  const downloadBtn = document.getElementById("downloadPDF");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const element = document.getElementById("resumeOutput");
      const fileName = (data.name || "resume").replace(/\s+/g, "_") + "_Resume.pdf";

      const opt = {
        margin:      [0, 0, 0, 0],
        filename:    fileName,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:   { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Temporarily ensure white background for PDF
      element.style.boxShadow = 'none';
      html2pdf().from(element).set(opt).save().then(() => {
        element.style.boxShadow = '';
      });
    });
  }

  // ===== Edit Resume Button =====
  const editBtn = document.getElementById("editResume");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      window.location.href = "builder.html";
    });
  }
}