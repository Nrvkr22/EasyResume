// Theme Toggle 
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

// Dynamic Sections 
document.addEventListener("click", (e) => {
  if (e.target.id === "addEducation") {
    const section = document.getElementById("educationSection");
    const newEdu = document.createElement("div");
    newEdu.classList.add("edu-item", "mb-3", "p-3", "border", "rounded");
    newEdu.innerHTML = `
      <input type="text" class="form-control mb-2 edu-degree" placeholder="Degree">
      <input type="text" class="form-control mb-2 edu-institute" placeholder="Institution">
      <input type="text" class="form-control mb-2 edu-year" placeholder="Year">
    `;
    section.appendChild(newEdu);
  }

  if (e.target.id === "addExperience") {
    const section = document.getElementById("experienceSection");
    const newExp = document.createElement("div");
    newExp.classList.add("exp-item", "mb-3", "p-3", "border", "rounded");
    newExp.innerHTML = `
      <input type="text" class="form-control mb-2 exp-title" placeholder="Job Title">
      <input type="text" class="form-control mb-2 exp-company" placeholder="Company">
      <input type="text" class="form-control mb-2 exp-duration" placeholder="Duration (e.g., 2020-2022)">
      <textarea class="form-control exp-desc" rows="2" placeholder="Description"></textarea>
    `;
    section.appendChild(newExp);
  }
});

// Save Resume Data
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

// Load Resume Data
if (window.location.pathname.includes("preview.html")) {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");

  document.getElementById("previewName").textContent = data.name || "";
  document.getElementById("previewTitle").textContent = data.title || "";
  document.getElementById("previewEmail").textContent = data.email || "";
  document.getElementById("previewPhone").textContent = data.phone || "";
  document.getElementById("previewSummary").textContent = data.summary || "";
  document.getElementById("previewSkills").textContent = data.skills || "";
  
// Render multiple education entries
  const eduContainer = document.getElementById("previewEducation");
  eduContainer.innerHTML = (data.education || []).map(e =>
    `<div><strong>${e.degree}</strong>  ${e.institute} (${e.year})</div>`
  ).join("");

// Render multiple experience entries
  const expContainer = document.getElementById("previewExperience");
  expContainer.innerHTML = (data.experience || []).map(e =>
    `<div class="mb-2"><strong>${e.title}</strong> at ${e.company} (${e.duration})<br><small>${e.desc}</small></div>`
  ).join("");

  const downloadBtn = document.getElementById("downloadPDF");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const element = document.getElementById("resumePreview");
      const opt = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

// Generate PDF and clear data after download completes
    html2pdf().from(element).set(opt).save().then(() => {
      localStorage.removeItem("resumeData");
    });
  });
}}