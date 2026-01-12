import jsPDF from "jspdf";
import { OfferLetterType, OfferLetterContent, letterTypeLabels, getTemplateFields } from "./offerLetterTemplates";

const COMPANY_NAME = "VFRA";
const COMPANY_FULL_NAME = "Vigilant Forensic Research and Analytics Pvt. Ltd.";
const COMPANY_EMAIL = "contact@vfraindia.com";
const BRAND_COLOR = { r: 211, g: 170, b: 90 }; // Gold #D3AA5A

export const generateOfferLetterPDF = (
  type: OfferLetterType,
  recipientName: string,
  recipientCompany: string | null,
  recipientDesignation: string | null,
  subject: string,
  content: OfferLetterContent,
  validFrom: string,
  validUntil: string | null
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Helper function to add wrapped text
  const addWrappedText = (text: string, x: number, startY: number, maxWidth: number, lineHeight: number = 7): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
      doc.text(line, x, startY);
      startY += lineHeight;
    });
    return startY;
  };

  // Header
  doc.setFontSize(24);
  doc.setTextColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_NAME, pageWidth / 2, y, { align: "center" });
  
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_FULL_NAME, pageWidth / 2, y, { align: "center" });
  
  // Divider line
  y += 8;
  doc.setDrawColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  
  // Date
  y += 15;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const formattedDate = new Date(validFrom).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Date: ${formattedDate}`, pageWidth - margin, y, { align: "right" });
  
  // Recipient
  y += 15;
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("To:", margin, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(recipientName, margin, y);
  if (recipientDesignation) {
    y += 6;
    doc.text(recipientDesignation, margin, y);
  }
  if (recipientCompany) {
    y += 6;
    doc.text(recipientCompany, margin, y);
  }
  
  // Subject
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Subject: ${subject}`, margin, y);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 1, margin + doc.getTextWidth(`Subject: ${subject}`), y + 1);
  
  // Greeting
  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Dear ${recipientName},`, margin, y);
  
  y += 10;
  y = addWrappedText(
    `We are pleased to present this ${letterTypeLabels[type].toLowerCase()} for your consideration.`,
    margin,
    y,
    contentWidth
  );
  
  // Content fields
  y += 5;
  const fields = getTemplateFields(type);
  fields.forEach((field) => {
    const value = content[field.key];
    if (value) {
      y += 8;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${field.label}:`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      y = addWrappedText(value, margin, y, contentWidth);
    }
  });
  
  // Validity
  if (validUntil) {
    y += 10;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(254, 252, 232); // Light gold background
    doc.roundedRect(margin, y - 5, contentWidth, 15, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Validity: ", margin + 5, y + 5);
    doc.setFont("helvetica", "normal");
    const validUntilFormatted = new Date(validUntil).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`This offer is valid until ${validUntilFormatted}.`, margin + 25, y + 5);
    y += 20;
  }
  
  // Closing
  y += 10;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  y = addWrappedText(
    "We look forward to your positive response and the opportunity to work together.",
    margin,
    y,
    contentWidth
  );
  
  // Signature
  y += 20;
  doc.text("Warm Regards,", margin, y);
  y += 25;
  doc.setFont("helvetica", "bold");
  doc.text(`${COMPANY_NAME} Team`, margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_FULL_NAME, margin, y);
  y += 6;
  doc.text(`Email: ${COMPANY_EMAIL}`, margin, y);
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

export const getPDFBlob = (doc: jsPDF): Blob => {
  return doc.output("blob");
};
