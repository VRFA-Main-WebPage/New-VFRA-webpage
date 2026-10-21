import type { LucideIcon } from "lucide-react";
import {
  Smartphone,
  Monitor,
  HardDrive,
  MessageSquare,
  Video,
  Globe,
  Users,
  Send,
  Mail,
  Phone,
  Car,
  Network,
  Package,
  Shield,
  Cloud,
  GitBranch,
  Bitcoin,
  ScanFace,
  Mic,
  Languages,
  FileCheck,
  Gavel,
  FileText,
  GraduationCap,
  Scale,
  Building2,
} from "lucide-react";

export type ServiceCategory =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G";

export type AudienceBadge = "LEA" | "Lawyers" | "Both";

export interface VFRAService {
  number: number;
  title: string;
  category: ServiceCategory;
  audience: AudienceBadge;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
  showRegisterCase?: boolean;
}

export const SERVICE_CATEGORIES: Record<
  ServiceCategory,
  { label: string; description: string }
> = {
  A: {
    label: "Digital Forensics & Device Analysis",
    description:
      "Device extraction, imaging, recovery, and examination with chain-of-custody discipline.",
  },
  B: {
    label: "Intelligence, OSINT & SOCMINT",
    description:
      "Open-source and social intelligence support for authorized investigations.",
  },
  C: {
    label: "Network, Application & Cyber Forensics",
    description:
      "Network, application, cloud, and penetration-assessment forensic workflows.",
  },
  D: {
    label: "Financial Fraud, Blockchain & Cryptocurrency Analysis",
    description:
      "Fund-flow and digital-asset analysis for fraud and financial crime matters.",
  },
  E: {
    label: "AI, Media & Content Forensics",
    description:
      "Media authenticity, voice, and translation support for evidence review.",
  },
  F: {
    label: "Legal Support, Court Services & Certification",
    description:
      "Court-ready documentation, certification, and expert support services.",
  },
  G: {
    label: "Training, Capacity Building & Corporate Services",
    description:
      "Professional training and corporate incident response programmes.",
  },
};

export const VFRA_SERVICES: VFRAService[] = [
  {
    number: 1,
    title: "Mobile Device Extraction & Unlocking",
    category: "A",
    audience: "Both",
    description:
      "Structured mobile extraction and analysis workflows for lawfully obtained devices.",
    capabilities: [
      "Logical & physical extraction support",
      "App and messaging artefact review",
      "Integrity-focused reporting",
    ],
    icon: Smartphone,
    showRegisterCase: true,
  },
  {
    number: 2,
    title: "Computer & Laptop Forensics",
    category: "A",
    audience: "Both",
    description:
      "Workstation and storage media examination for civil, corporate, and criminal matters.",
    capabilities: [
      "Disk imaging and verification",
      "User activity reconstruction",
      "Evidence preservation guidance",
    ],
    icon: Monitor,
    showRegisterCase: true,
  },
  {
    number: 3,
    title: "Data Recovery",
    category: "A",
    audience: "Both",
    description:
      "Recovery assistance for damaged, deleted, or inaccessible digital storage.",
    capabilities: [
      "Media assessment",
      "Recovery attempt documentation",
      "Recovered data handover protocols",
    ],
    icon: HardDrive,
    showRegisterCase: true,
  },
  {
    number: 4,
    title: "Chat & Messaging Recovery (WhatsApp / Telegram)",
    category: "A",
    audience: "Both",
    description:
      "Messaging artefact recovery, WhatsApp chat extraction, deleted conversations, and review from devices and lawful data sources.",
    capabilities: [
      "WhatsApp & Telegram message recovery",
      "Chat timeline reconstruction",
      "Attachment and metadata review",
      "Export for case documentation",
    ],
    icon: MessageSquare,
    showRegisterCase: true,
  },
  {
    number: 5,
    title: "CCTV & Video Forensics",
    category: "A",
    audience: "Both",
    description:
      "Video evidence enhancement, frame analysis, and integrity review.",
    capabilities: [
      "Footage authentication support",
      "Timeline correlation",
      "Court-ready visual exhibits",
    ],
    icon: Video,
    showRegisterCase: true,
  },
  {
    number: 6,
    title: "Open Source Intelligence (OSINT)",
    category: "B",
    audience: "Both",
    description:
      "OSINT collection and analysis for authorized professional investigations.",
    capabilities: [
      "Entity and digital footprint mapping",
      "Source validation",
      "Structured intelligence briefs",
    ],
    icon: Globe,
    showRegisterCase: true,
  },
  {
    number: 7,
    title: "Social Media Intelligence (SOCMINT)",
    category: "B",
    audience: "Both",
    description:
      "Social platform intelligence support within lawful investigation boundaries.",
    capabilities: [
      "Profile and activity analysis",
      "Content preservation guidance",
      "Investigation-ready summaries",
    ],
    icon: Users,
    showRegisterCase: true,
  },
  {
    number: 8,
    title: "Telegram Intelligence (VFRA-TTI / TTI)",
    category: "B",
    audience: "LEA",
    description:
      "Lawful Telegram intelligence support for authorized law enforcement or government investigation use only.",
    capabilities: [
      "Authorized workflow documentation",
      "Intelligence correlation support",
      "Institutional reporting formats",
    ],
    icon: Send,
    showRegisterCase: false,
  },
  {
    number: 9,
    title: "Email Investigation & Header Analysis",
    category: "B",
    audience: "Both",
    description:
      "Email artefact review including header analysis and routing reconstruction.",
    capabilities: [
      "Header and metadata parsing",
      "Phishing pattern identification",
      "Evidence packaging for counsel",
    ],
    icon: Mail,
    showRegisterCase: true,
  },
  {
    number: 10,
    title: "Phone Number & Subscriber Intelligence (CDR Analysis)",
    category: "B",
    audience: "Both",
    description:
      "Telecom and CDR (Call Detail Record) intelligence support using lawfully obtained subscriber records, call logs, and cell site data.",
    capabilities: [
      "CDR & Call Detail Record analysis",
      "Tower dump & cell site correlation",
      "Subscriber record correlation",
      "Call/SMS pattern analysis",
      "Documentation for legal review",
    ],
    icon: Phone,
    showRegisterCase: true,
  },
  {
    number: 11,
    title: "Vehicle & Registration Intelligence",
    category: "B",
    audience: "Both",
    description:
      "Vehicle and registration intelligence support for authorized investigations.",
    capabilities: [
      "Record correlation",
      "Movement pattern assistance",
      "Case summary documentation",
    ],
    icon: Car,
    showRegisterCase: true,
  },
  {
    number: 12,
    title: "Network Forensics & Traffic Analysis",
    category: "C",
    audience: "Both",
    description:
      "Network log and traffic analysis for incident and fraud investigations.",
    capabilities: [
      "Packet and log review",
      "Intrusion timeline assistance",
      "Technical finding reports",
    ],
    icon: Network,
    showRegisterCase: true,
  },
  {
    number: 13,
    title: "APK Analysis for Application Fraud",
    category: "C",
    audience: "Both",
    description:
      "Mobile application forensic analysis for fraud and malicious behaviour cases.",
    capabilities: [
      "Static and dynamic review",
      "Permission and API mapping",
      "Malware indicator documentation",
    ],
    icon: Package,
    showRegisterCase: true,
  },
  {
    number: 14,
    title: "Website Penetration Testing & Reconnaissance",
    category: "C",
    audience: "Both",
    description:
      "Authorized security assessment and reconnaissance for institutional clients.",
    capabilities: [
      "Scoped testing programmes",
      "Vulnerability documentation",
      "Remediation guidance reports",
    ],
    icon: Shield,
    showRegisterCase: false,
  },
  {
    number: 15,
    title: "Cloud & Application Data Forensics",
    category: "C",
    audience: "Both",
    description:
      "Cloud and SaaS data acquisition support under lawful authorization.",
    capabilities: [
      "Account artefact extraction",
      "Access log review",
      "Cross-platform correlation",
    ],
    icon: Cloud,
    showRegisterCase: true,
  },
  {
    number: 16,
    title: "Fund Flow Graphical Analysis",
    category: "D",
    audience: "Both",
    description:
      "Visual fund-flow mapping and transaction pattern analysis for fraud matters.",
    capabilities: [
      "Account linkage diagrams",
      "Transaction clustering",
      "Investigation-ready exhibits",
    ],
    icon: GitBranch,
    showRegisterCase: true,
  },
  {
    number: 17,
    title: "Blockchain & Cryptocurrency Fraud Analysis",
    category: "D",
    audience: "Both",
    description:
      "On-chain analysis support for cryptocurrency fraud tracking and blockchain asset investigations.",
    capabilities: [
      "Crypto fraud tracking & transaction tracing",
      "Wallet and transaction tracing",
      "Exchange flow documentation",
      "Technical briefs for counsel",
    ],
    icon: Bitcoin,
    showRegisterCase: true,
  },
  {
    number: 18,
    title: "Deepfake & AI-Generated Media Detection",
    category: "E",
    audience: "Both",
    description:
      "Media authenticity assessment for suspected synthetic or manipulated content.",
    capabilities: [
      "Authenticity screening workflows",
      "Technical indicator documentation",
      "Expert review support",
    ],
    icon: ScanFace,
    showRegisterCase: true,
  },
  {
    number: 19,
    title: "Voice Recording Forensics & Transcription",
    category: "E",
    audience: "Both",
    description:
      "Audio evidence review, enhancement, and transcription assistance.",
    capabilities: [
      "Audio integrity checks",
      "Transcription and timestamps",
      "Court exhibit preparation",
    ],
    icon: Mic,
    showRegisterCase: true,
  },
  {
    number: 20,
    title: "Translation Services",
    category: "E",
    audience: "Both",
    description:
      "Forensic translation support for multilingual digital evidence.",
    capabilities: [
      "Certified translation coordination",
      "Context-aware terminology",
      "Documentation for proceedings",
    ],
    icon: Languages,
    showRegisterCase: false,
  },
  {
    number: 21,
    title: "Section 65B / BSA 2023 Certification",
    category: "F",
    audience: "Lawyers",
    description:
      "Electronic evidence certification support under applicable Indian evidence frameworks.",
    capabilities: [
      "65B certificate preparation guidance",
      "Evidence handling documentation",
      "Counsel-ready compliance notes",
    ],
    icon: FileCheck,
    showRegisterCase: false,
  },
  {
    number: 22,
    title: "Expert Witness Testimony & Court Support",
    category: "F",
    audience: "Lawyers",
    description:
      "Expert assistance for hearings, depositions, and technical examination.",
    capabilities: [
      "Expert testimony coordination",
      "Technical cross-examination prep",
      "Court appearance support",
    ],
    icon: Gavel,
    showRegisterCase: false,
  },
  {
    number: 23,
    title: "Court-Ready Forensic Report Production",
    category: "F",
    audience: "Both",
    description:
      "Structured forensic reporting designed for legal and institutional review.",
    capabilities: [
      "Methodology documentation",
      "Exhibit packaging",
      "Revision and review cycles",
    ],
    icon: FileText,
    showRegisterCase: true,
  },
  {
    number: 24,
    title: "Law Enforcement Training Programmes",
    category: "G",
    audience: "LEA",
    description:
      "Capacity-building programmes for authorized law enforcement personnel.",
    capabilities: [
      "Hands-on forensic labs",
      "Toolchain familiarization",
      "Case workflow training",
    ],
    icon: GraduationCap,
    showRegisterCase: false,
  },
  {
    number: 25,
    title: "Legal Professional & Bar Association Training",
    category: "G",
    audience: "Lawyers",
    description:
      "Training for advocates and legal teams on digital evidence fundamentals.",
    capabilities: [
      "Evidence admissibility overview",
      "Forensic report interpretation",
      "Case strategy workshops",
    ],
    icon: Scale,
    showRegisterCase: false,
  },
  {
    number: 26,
    title: "Corporate Digital Forensics & Incident Response",
    category: "G",
    audience: "Both",
    description:
      "Corporate incident response and forensic readiness support programmes.",
    capabilities: [
      "Breach response assistance",
      "Evidence preservation playbooks",
      "Executive briefing reports",
    ],
    icon: Building2,
    showRegisterCase: false,
  },
];

export const VFRA_PRODUCTS = [
  {
    id: "investigate",
    name: "InvestiGate",
    tagline: "Investigation workflow platform",
    description:
      "Structured case intake, evidence tracking, and investigation workflow management for authorized professional use.",
    disclaimer:
      "Designed only for lawful, authorized, institutional, professional or legitimate investigation use.",
  },
  {
    id: "tti",
    name: "VFRA-TTI / Telegram Threat Intelligence",
    tagline: "Authorized intelligence workflows",
    description:
      "Lawful Telegram intelligence support for authorized law enforcement or government investigation use only.",
    disclaimer:
      "Available only for lawful, authorized, institutional, or government investigation use. No unauthorized access or surveillance is supported.",
  },
  {
    id: "case-ops",
    name: "VFRA Case & Certificate Operations",
    tagline: "Secure operations portal",
    description:
      "Case registration, tracking, and certificate verification infrastructure for VFRA clients and partners.",
    disclaimer:
      "Designed only for lawful, authorized, institutional, professional or legitimate investigation use.",
  },
];

export const FORENSIC_PROCESS_STEPS = [
  {
    step: 1,
    title: "Confidential Consultation",
    description:
      "Scope, authorization, and engagement terms are documented before any evidence handling.",
  },
  {
    step: 2,
    title: "Evidence Acquisition & Custody Lock",
    description:
      "Chain-of-custody protocols are applied from the point of lawful collection.",
  },
  {
    step: 3,
    title: "Forensic Imaging & Integrity Verification",
    description:
      "Imaging and hash verification preserve evidentiary integrity for review.",
  },
  {
    step: 4,
    title: "Examination & Analysis",
    description:
      "Structured analysis using validated forensic methods and tooling.",
  },
  {
    step: 5,
    title: "Court-Ready Report Generation",
    description:
      "Findings are documented in clear, reviewable formats for legal proceedings.",
  },
  {
    step: 6,
    title: "Expert Testimony & Court Support",
    description:
      "Expert assistance available where required for hearings and examination.",
  },
];

export const HOME_TRUST_METRICS = [
  { value: "24×7", label: "Urgent Case Support", numeric: false },
  { value: "48", label: "Hrs Standard Report Delivery", suffix: " Hrs", numeric: true },
  { value: "20+", label: "Distinct Forensic Services", numeric: false },
  { value: "100%", label: "Court-Admissible Reports", numeric: false },
];

export const HOME_SERVICE_SNAPSHOT = VFRA_SERVICES.filter((s) =>
  [1, 6, 12, 16, 21, 23, 26].includes(s.number)
);
