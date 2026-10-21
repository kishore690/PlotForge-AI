import { getPreferences } from "./preferencesService";

export async function openStoryPdf({ title, genre, generatedStory }) {
  const { jsPDF } = await import("jspdf");
  const safeTitle = (title || "plotforge-story")
    .normalize("NFKD")
    .replace(/[^\w -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "plotforge-story";
  const accents = { dark: [102, 252, 241], midnight: [52, 104, 180], crimson: [174, 36, 60] };
  const accent = accents[getPreferences().appearance] || accents.dark;
  const paper = [11, 12, 16];
  const ink = [197, 198, 199];
  const muted = [154, 164, 174];
  const rule = [52, 65, 77];
  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 64;
  const contentWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 42;
  let pageNumber = 1;

  const safeText = (value) => String(value || "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/…/g, "...")
    .replace(/\u00a0/g, " ");
  const paintPage = () => {
    pdf.setFillColor(...paper);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setFillColor(...accent);
    pdf.rect(0, 0, pageWidth, 5, "F");
    pdf.setDrawColor(...rule);
    pdf.setLineWidth(0.6);
    pdf.line(margin, footerY - 13, pageWidth - margin, footerY - 13);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...muted);
    pdf.text("PLOTFORGE AI", margin, footerY + 4);
    pdf.text(String(pageNumber), pageWidth - margin, footerY + 4, { align: "right" });
  };
  const addPage = () => {
    pdf.addPage();
    pageNumber += 1;
    paintPage();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...accent);
    pdf.text(safeText(title || "Untitled Story"), margin, 38, { maxWidth: contentWidth });
    pdf.setDrawColor(...rule);
    pdf.line(margin, 51, pageWidth - margin, 51);
    return 76;
  };
  const ensureRoom = (y, height) => (y + height > footerY - 22 ? addPage() : y);

  pdf.setDocumentProperties({
    title: safeText(title || "Untitled Story"),
    subject: `${safeText(genre)} story`,
    author: "PlotForge AI",
  });
  paintPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...accent);
  pdf.text("PLOTFORGE AI  /  STORY", margin, 55);

  pdf.setFont("times", "bold");
  pdf.setFontSize(27);
  pdf.setTextColor(...ink);
  const titleLines = pdf.splitTextToSize(safeText(title || "Untitled Story"), contentWidth);
  let y = 98;
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 31 + 9;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...accent);
  pdf.text(safeText(genre || "STORY").toLocaleUpperCase(), margin, y);
  y += 20;
  pdf.setDrawColor(...rule);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 27;

  const paragraphs = safeText(generatedStory || "")
    .split(/\r?\n/)
    .map((raw) => raw.trim())
    .filter(Boolean);
  for (const rawParagraph of paragraphs) {
    const heading = rawParagraph.match(/^#{1,3}\s+(.+)$/);
    const bullet = rawParagraph.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    const paragraph = (heading?.[1] || bullet?.[1] || rawParagraph)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");

    if (heading) {
      const size = heading[0].startsWith("# ") ? 16 : 13;
      pdf.setFont("times", "bold");
      pdf.setFontSize(size);
      pdf.setTextColor(...ink);
      const lines = pdf.splitTextToSize(paragraph, contentWidth);
      y = ensureRoom(y, lines.length * (size + 4) + 18);
      pdf.text(lines, margin, y);
      y += lines.length * (size + 4) + 12;
      continue;
    }

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(...ink);
    const indent = bullet ? 15 : 0;
    const lines = pdf.splitTextToSize(paragraph, contentWidth - indent);
    const leading = 17;
    y = ensureRoom(y, Math.min(lines.length, 2) * leading);
    for (let index = 0; index < lines.length; index += 1) {
      y = ensureRoom(y, leading);
      if (bullet && index === 0) {
        pdf.setFillColor(...accent);
        pdf.circle(margin + 3, y - 4, 1.7, "F");
      }
      pdf.text(lines[index], margin + indent, y);
      y += leading;
    }
    y += 7;
  }

  const url = URL.createObjectURL(pdf.output("blob"));
  const preview = window.open(url, "_blank", "noopener,noreferrer");
  if (!preview) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 5 * 60 * 1000);
}
