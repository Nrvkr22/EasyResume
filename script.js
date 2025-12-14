const downloadBtn = document.getElementById("downloadPDF");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const resume = document.getElementById("resumePreview");

    const options = {
      margin: 0,
      filename: "Resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf().from(resume).set(options).save();
  });
}
