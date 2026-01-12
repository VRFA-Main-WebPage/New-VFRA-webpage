import jsPDF from "jspdf";
import QRCode from "qrcode";

interface CertificateData {
  certificateNumber: string;
  recipientName: string;
  certificateType: string;
  courseName?: string;
  issueDate: string;
  expiryDate?: string;
  signingAuthorityName: string;
  signingAuthorityDesignation?: string;
  logoUrl?: string;
  signatureUrl?: string;
  additionalNotes?: string;
  verificationUrl?: string;
}

const certificateTypeLabels: Record<string, string> = {
  completion: "Certificate of Completion",
  achievement: "Certificate of Achievement",
  participation: "Certificate of Participation",
  training: "Training Certificate",
  internship: "Internship Certificate",
  excellence: "Certificate of Excellence",
};

const COMPANY_NAME = "VFRA";
const COMPANY_FULL_NAME = "Vigilant Forensic Research and Analytics Pvt. Ltd.";
const COMPANY_WEBSITE = "vfra.in";
const BRAND_COLOR = { r: 211, g: 170, b: 90 }; // Gold #D3AA5A

const generateQRCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 100,
      margin: 1,
      color: {
        dark: "#D3AA5A",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
};

export const generateCertificatePDF = async (data: CertificateData): Promise<jsPDF> => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Background color
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Border decorations
  doc.setDrawColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b); // Gold color
  doc.setLineWidth(2);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Inner border
  doc.setLineWidth(0.5);
  doc.setDrawColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b, 50);
  doc.rect(margin + 5, margin + 5, pageWidth - margin * 2 - 10, pageHeight - margin * 2 - 10);

  // Corner decorations
  const cornerSize = 20;
  doc.setDrawColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.setLineWidth(1);
  // Top left
  doc.line(margin, margin + cornerSize, margin, margin);
  doc.line(margin, margin, margin + cornerSize, margin);
  // Top right
  doc.line(pageWidth - margin - cornerSize, margin, pageWidth - margin, margin);
  doc.line(pageWidth - margin, margin, pageWidth - margin, margin + cornerSize);
  // Bottom left
  doc.line(margin, pageHeight - margin - cornerSize, margin, pageHeight - margin);
  doc.line(margin, pageHeight - margin, margin + cornerSize, pageHeight - margin);
  // Bottom right
  doc.line(pageWidth - margin - cornerSize, pageHeight - margin, pageWidth - margin, pageHeight - margin);
  doc.line(pageWidth - margin, pageHeight - margin - cornerSize, pageWidth - margin, pageHeight - margin);

  let currentY = margin + 20;

  // Logo (if provided)
  if (data.logoUrl) {
    try {
      const img = await loadImage(data.logoUrl);
      const logoWidth = 40;
      const logoHeight = 25;
      doc.addImage(img, "PNG", pageWidth / 2 - logoWidth / 2, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 8;
    } catch (error) {
      console.error("Failed to load logo:", error);
    }
  }

  // Company Name
  doc.setFontSize(14);
  doc.setTextColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_NAME, pageWidth / 2, currentY, { align: "center" });
  currentY += 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(COMPANY_FULL_NAME, pageWidth / 2, currentY, { align: "center" });
  currentY += 15;

  // Certificate Title
  const certTitle = certificateTypeLabels[data.certificateType] || "Certificate";
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(certTitle, pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  // Decorative line
  doc.setDrawColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
  currentY += 12;

  // "This is to certify that"
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("This is to certify that", pageWidth / 2, currentY, { align: "center" });
  currentY += 12;

  // Recipient Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND_COLOR.r, BRAND_COLOR.g, BRAND_COLOR.b);
  doc.text(data.recipientName, pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  // Course/Program name
  if (data.courseName) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("has successfully completed the program", pageWidth / 2, currentY, { align: "center" });
    currentY += 8;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(`"${data.courseName}"`, pageWidth / 2, currentY, { align: "center" });
    currentY += 10;
  } else {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("has been awarded this certificate", pageWidth / 2, currentY, { align: "center" });
    currentY += 10;
  }

  // Additional notes
  if (data.additionalNotes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(data.additionalNotes, pageWidth - margin * 4);
    doc.text(lines, pageWidth / 2, currentY, { align: "center" });
    currentY += lines.length * 5 + 5;
  }

  // Date section
  const dateY = pageHeight - margin - 45;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);

  const formattedIssueDate = new Date(data.issueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.text(`Issue Date: ${formattedIssueDate}`, margin + 30, dateY);

  if (data.expiryDate) {
    const formattedExpiryDate = new Date(data.expiryDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`Valid Until: ${formattedExpiryDate}`, margin + 30, dateY + 5);
  }

  // Certificate number
  doc.text(`Certificate No: ${data.certificateNumber}`, margin + 30, dateY + (data.expiryDate ? 10 : 5));

  // QR Code for verification
  const verificationUrl = data.verificationUrl || `${window.location.origin}/verify?id=${data.certificateNumber}`;
  try {
    const qrCodeDataUrl = await generateQRCode(verificationUrl);
    const qrSize = 25;
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = pageHeight - margin - 35;
    doc.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Scan to verify", pageWidth / 2, pageHeight - margin - 5, { align: "center" });
  } catch (error) {
    console.error("Failed to add QR code:", error);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Verify at: ${COMPANY_WEBSITE}/verify`, pageWidth / 2, pageHeight - margin - 8, { align: "center" });
  }

  // Signature section
  const signatureY = pageHeight - margin - 40;
  const signatureX = pageWidth - margin - 70;

  // Signature image (if provided)
  if (data.signatureUrl) {
    try {
      const img = await loadImage(data.signatureUrl);
      doc.addImage(img, "PNG", signatureX, signatureY - 15, 50, 20);
    } catch (error) {
      console.error("Failed to load signature:", error);
    }
  }

  // Signature line
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(signatureX, signatureY + 10, signatureX + 50, signatureY + 10);

  // Signing authority
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(data.signingAuthorityName, signatureX + 25, signatureY + 17, { align: "center" });

  if (data.signingAuthorityDesignation) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(data.signingAuthorityDesignation, signatureX + 25, signatureY + 22, { align: "center" });
  }

  return doc;
};

const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};

export const downloadCertificatePDF = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

export const getCertificatePDFBlob = (doc: jsPDF): Blob => {
  return doc.output("blob");
};
