export type OfferLetterType = "client_proposal" | "employment_offer" | "partnership_contract";

export interface OfferLetterContent {
  // Client Proposal fields
  serviceType?: string;
  projectScope?: string;
  deliverables?: string;
  timeline?: string;
  pricing?: string;
  paymentTerms?: string;
  
  // Employment Offer fields
  position?: string;
  department?: string;
  salary?: string;
  startDate?: string;
  benefits?: string;
  workLocation?: string;
  
  // Partnership Contract fields
  partnershipType?: string;
  responsibilities?: string;
  revenueShare?: string;
  duration?: string;
  exclusivity?: string;
  
  // Common fields
  additionalTerms?: string;
}

export const letterTypeLabels: Record<OfferLetterType, string> = {
  client_proposal: "Client Service Proposal",
  employment_offer: "Employment Offer",
  partnership_contract: "Partnership Contract",
};

export const getTemplateFields = (type: OfferLetterType): { key: keyof OfferLetterContent; label: string; multiline?: boolean }[] => {
  const commonFields: { key: keyof OfferLetterContent; label: string; multiline?: boolean }[] = [
    { key: "additionalTerms", label: "Additional Terms & Conditions", multiline: true },
  ];

  switch (type) {
    case "client_proposal":
      return [
        { key: "serviceType", label: "Type of Service" },
        { key: "projectScope", label: "Project Scope", multiline: true },
        { key: "deliverables", label: "Deliverables", multiline: true },
        { key: "timeline", label: "Project Timeline" },
        { key: "pricing", label: "Pricing / Quote" },
        { key: "paymentTerms", label: "Payment Terms" },
        ...commonFields,
      ];
    case "employment_offer":
      return [
        { key: "position", label: "Position / Job Title" },
        { key: "department", label: "Department" },
        { key: "salary", label: "Salary / Compensation" },
        { key: "startDate", label: "Proposed Start Date" },
        { key: "benefits", label: "Benefits Package", multiline: true },
        { key: "workLocation", label: "Work Location" },
        ...commonFields,
      ];
    case "partnership_contract":
      return [
        { key: "partnershipType", label: "Partnership Type" },
        { key: "responsibilities", label: "Roles & Responsibilities", multiline: true },
        { key: "revenueShare", label: "Revenue Share / Compensation" },
        { key: "duration", label: "Contract Duration" },
        { key: "exclusivity", label: "Exclusivity Terms" },
        ...commonFields,
      ];
  }
};

export const generateLetterHTML = (
  type: OfferLetterType,
  recipientName: string,
  recipientCompany: string | null,
  recipientDesignation: string | null,
  subject: string,
  content: OfferLetterContent,
  validFrom: string,
  validUntil: string | null
): string => {
  const fields = getTemplateFields(type);
  
  let bodyContent = "";
  fields.forEach((field) => {
    const value = content[field.key];
    if (value) {
      bodyContent += `<p><strong>${field.label}:</strong><br/>${value.replace(/\n/g, "<br/>")}</p>`;
    }
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #0f172a; }
    .logo span { color: #0d9488; }
    .date { text-align: right; color: #666; margin-bottom: 20px; }
    .recipient { margin-bottom: 30px; }
    .subject { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 20px; text-decoration: underline; }
    .content p { margin-bottom: 15px; }
    .validity { background: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
    .signature { margin-top: 60px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Forensi<span>X</span></div>
    <p>Vigilant Forensic & Investigation Services</p>
  </div>
  
  <div class="date">Date: ${new Date(validFrom).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
  
  <div class="recipient">
    <p><strong>To:</strong><br/>
    ${recipientName}${recipientDesignation ? `<br/>${recipientDesignation}` : ""}${recipientCompany ? `<br/>${recipientCompany}` : ""}</p>
  </div>
  
  <div class="subject">Subject: ${subject}</div>
  
  <p>Dear ${recipientName},</p>
  
  <p>We are pleased to present this ${letterTypeLabels[type].toLowerCase()} for your consideration.</p>
  
  <div class="content">
    ${bodyContent}
  </div>
  
  ${validUntil ? `
  <div class="validity">
    <strong>Validity:</strong> This offer is valid until ${new Date(validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
  </div>
  ` : ""}
  
  <p>We look forward to your positive response and the opportunity to work together.</p>
  
  <div class="signature">
    <p>Warm Regards,</p>
    <br/><br/>
    <p><strong>ForensiX Team</strong><br/>
    Vigilant Forensic & Investigation Services<br/>
    Email: contact@vigilantforensic.com</p>
  </div>
</body>
</html>
  `;
};
