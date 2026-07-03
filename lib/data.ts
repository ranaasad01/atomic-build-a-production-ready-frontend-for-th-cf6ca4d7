export const APP_NAME = "FilingDesk";
export const APP_TAGLINE = "From draft to final submission, without the chaos.";
export const APP_DESCRIPTION =
  "FilingDesk is a compliance workspace that helps environmental consultants, engineering firms, and permit managers prepare regulatory filing packages with confidence.";

export interface NavLink {
  label: string;
  href: string;
  type: "route" | "anchor";
  highlight?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/", type: "route" },
  { label: "Projects", href: "/projects/proj-001", type: "route" },
  { label: "Audit Trail", href: "/projects/proj-001/audit", type: "route" },
  { label: "Context", href: "/projects/proj-001/context", type: "route" },
];

export type QualityBand = "Research" | "Working" | "Filing" | "Regulator";

export interface QualityBandConfig {
  label: QualityBand;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const QUALITY_BANDS: QualityBandConfig[] = [
  {
    label: "Research",
    min: 82,
    max: 85,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Early-stage research quality. Needs significant work.",
  },
  {
    label: "Working",
    min: 85,
    max: 88,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Working draft quality. Progressing toward filing readiness.",
  },
  {
    label: "Filing",
    min: 90,
    max: 93,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    description: "Filing-ready quality. Meets submission standards.",
  },
  {
    label: "Regulator",
    min: 95,
    max: 100,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Regulator-grade quality. Exceeds submission standards.",
  },
];

export function getBandForScore(score: number): QualityBandConfig {
  const band = QUALITY_BANDS.find((b) => score >= b.min && score <= b.max);
  return (
    band ||
    (score < 82
      ? {
          label: "Research",
          min: 0,
          max: 82,
          color: "text-slate-600",
          bgColor: "bg-slate-100",
          borderColor: "border-slate-200",
          description: "Below research threshold.",
        }
      : QUALITY_BANDS[QUALITY_BANDS.length - 1])
  );
}

export type FilingStage =
  | "Capture"
  | "Review"
  | "Anchor Sources"
  | "Cross-check"
  | "Improve Quality"
  | "Assemble Package"
  | "File & Track";

export const FILING_STAGES: FilingStage[] = [
  "Capture",
  "Review",
  "Anchor Sources",
  "Cross-check",
  "Improve Quality",
  "Assemble Package",
  "File & Track",
];

export type ProjectStatus =
  | "Active"
  | "In Review"
  | "Filing Ready"
  | "Submitted"
  | "Archived";

export interface Project {
  id: string;
  name: string;
  agency: string;
  documentCount: number;
  deadline: string;
  status: ProjectStatus;
  readinessScore: number;
  currentStage: FilingStage;
  description: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  title: string;
  type: string;
  readinessScore: number;
  targetBand: QualityBand;
  status: "Draft" | "In Review" | "Approved" | "Filed";
  unsourcedClaims: number;
  wordCount: number;
  lastModified: string;
  author: string;
  version: number;
}

export interface AuditEntry {
  id: string;
  projectId: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
  category:
    | "document"
    | "filing"
    | "review"
    | "system"
    | "user"
    | "submission";
}

export interface ContextItem {
  id: string;
  projectId: string;
  type:
    | "guidance"
    | "number"
    | "contact"
    | "study"
    | "plan"
    | "procedure"
    | "section";
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}