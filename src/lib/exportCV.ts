import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function safeColor(value: string, fallback: string) {
  return value.includes("oklch") ? fallback : value;
}

function inlineComputedStylesFromSource(source: Element, target: HTMLElement) {
  const computed = window.getComputedStyle(source);
  target.removeAttribute("class");
  target.style.color = safeColor(computed.color, "#000000");
  target.style.backgroundColor = safeColor(computed.backgroundColor, "transparent");
  target.style.fontFamily = computed.fontFamily;
  target.style.fontSize = computed.fontSize;
  target.style.fontWeight = computed.fontWeight;
  target.style.fontStyle = computed.fontStyle;
  target.style.lineHeight = computed.lineHeight;
  target.style.letterSpacing = computed.letterSpacing;
  target.style.textAlign = computed.textAlign;
  target.style.textTransform = computed.textTransform;
  target.style.padding = computed.padding;
  target.style.margin = computed.margin;
  target.style.width = computed.width;
  target.style.minHeight = computed.minHeight;
  target.style.height = computed.height;
  target.style.display = computed.display;
  target.style.flexDirection = computed.flexDirection;
  target.style.justifyContent = computed.justifyContent;
  target.style.alignItems = computed.alignItems;
  target.style.gap = computed.gap;
  target.style.listStyleType = computed.listStyleType;
  target.style.borderTopWidth = computed.borderTopWidth;
  target.style.borderRightWidth = computed.borderRightWidth;
  target.style.borderBottomWidth = computed.borderBottomWidth;
  target.style.borderLeftWidth = computed.borderLeftWidth;
  target.style.borderTopStyle = computed.borderTopStyle;
  target.style.borderRightStyle = computed.borderRightStyle;
  target.style.borderBottomStyle = computed.borderBottomStyle;
  target.style.borderLeftStyle = computed.borderLeftStyle;
}

function cloneForCapture(element: HTMLElement) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.border = "0";
  iframe.style.width = `${element.scrollWidth}px`;
  iframe.style.height = `${element.scrollHeight}px`;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("Could not create export frame");
  }

  doc.open();
  doc.write('<!DOCTYPE html><html><head></head><body style="margin:0;background:#fff"></body></html>');
  doc.close();

  const clone = element.cloneNode(true) as HTMLElement;
  const sourceNodes = [element, ...element.querySelectorAll("*")];
  const targetNodes = [clone, ...clone.querySelectorAll("*")];

  sourceNodes.forEach((source, index) => {
    inlineComputedStylesFromSource(source, targetNodes[index] as HTMLElement);
  });

  doc.body.appendChild(clone);
  return { clone, iframe };
}

async function captureElement(element: HTMLElement) {
  const { clone, iframe } = cloneForCapture(element);

  try {
    return await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
        clonedDoc.documentElement.style.backgroundColor = "#ffffff";
        clonedDoc.body.style.backgroundColor = "#ffffff";
      },
    });
  } finally {
    iframe.remove();
  }
}

export async function exportCVAsPNG(element: HTMLElement, filename: string) {
  const canvas = await captureElement(element);
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportCVAsPDF(element: HTMLElement, filename: string) {
  const canvas = await captureElement(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= A4_HEIGHT_MM;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= A4_HEIGHT_MM;
  }

  pdf.save(filename);
}
