"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { BookOpen, Hash, Users, FlaskConical, Map, ClipboardList, Layers, Plus, Edit2, Trash2, Copy, Search, X, Check, ChevronDown, Tag, ExternalLink, AlertCircle, FileText, Download } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { type ContextItem } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType =
  | "guidance"
  | "number"
  | "contact"
  | "study"
  | "plan"
  | "procedure"
  | "section";

interface LocalContextItem {
  id: string;
  projectId: string;
  type: TabType;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // type-specific fields
  agency?: string;
  effectiveDate?: string;
  value?: string;
  unit?: string;
  regulation?: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  organization?: string;
  author?: string;
  year?: string;
  doi?: string;
  status?: string;
  version?: string;
  approvedBy?: string;
  number?: string;
  pageRange?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ITEMS: LocalContextItem[] = [
  // Guidance
  {
    id: "g-001",
    projectId: "proj-001",
    type: "guidance",
    title: "EPA NEPA Environmental Impact Assessment Guidelines",
    content:
      "Comprehensive guidance for conducting environmental impact assessments under NEPA. Covers scoping, alternatives analysis, and mitigation measures for federal projects.",
    source: "https://www.epa.gov/nepa/guidance",
    tags: ["NEPA", "EIA", "Federal"],
    agency: "EPA",
    effectiveDate: "2023-01-15",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-12",
  },
  {
    id: "g-002",
    projectId: "proj-001",
    type: "guidance",
    title: "Clean Water Act Section 404 Permit Requirements",
    content:
      "Guidance on obtaining Section 404 permits for discharge of dredged or fill material into waters of the United States, including wetlands delineation requirements.",
    source: "https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/",
    tags: ["CWA", "Section 404", "Wetlands", "USACE"],
    agency: "USACE",
    effectiveDate: "2022-06-01",
    createdAt: "2024-01-12",
    updatedAt: "2024-02-20",
  },
  {
    id: "g-003",
    projectId: "proj-001",
    type: "guidance",
    title: "State Air Quality Permit Application Procedures",
    content:
      "State-level procedures for submitting air quality permit applications, including required modeling, monitoring, and public notice requirements.",
    source: "https://state.gov/air-quality/permits",
    tags: ["Air Quality", "State Permit", "Modeling"],
    agency: "State DEQ",
    effectiveDate: "2023-09-01",
    createdAt: "2024-02-01",
    updatedAt: "2024-03-05",
  },
  // Key Numbers
  {
    id: "n-001",
    projectId: "proj-001",
    type: "number",
    title: "PM2.5 Annual NAAQS Standard",
    content: "National Ambient Air Quality Standard for fine particulate matter (PM2.5) annual average.",
    value: "12",
    unit: "µg/m³",
    regulation: "40 CFR Part 50",
    tags: ["PM2.5", "NAAQS", "Air Quality"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "n-002",
    projectId: "proj-001",
    type: "number",
    title: "Wetland Buffer Setback Requirement",
    content: "Minimum buffer distance required from jurisdictional wetland boundaries for construction activities.",
    value: "100",
    unit: "feet",
    regulation: "State Wetland Protection Act §4.2",
    tags: ["Wetlands", "Buffer", "Setback"],
    createdAt: "2024-01-18",
    updatedAt: "2024-02-10",
  },
  {
    id: "n-003",
    projectId: "proj-001",
    type: "number",
    title: "Noise Limit — Residential Zone (Daytime)",
    content: "Maximum permissible noise level for construction activities adjacent to residential zones during daytime hours.",
    value: "65",
    unit: "dB(A)",
    regulation: "Municipal Code §8.44.050",
    tags: ["Noise", "Residential", "Construction"],
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
  },
  {
    id: "n-004",
    projectId: "proj-001",
    type: "number",
    title: "Stormwater Runoff Rate Limit",
    content: "Maximum post-development stormwater runoff rate for 10-year storm event.",
    value: "0.45",
    unit: "cfs/acre",
    regulation: "County Stormwater Ordinance §3.1",
    tags: ["Stormwater", "Runoff", "Hydrology"],
    createdAt: "2024-02-12",
    updatedAt: "2024-03-01",
  },
  // Contacts
  {
    id: "c-001",
    projectId: "proj-001",
    type: "contact",
    title: "EPA Region 9 Project Coordinator",
    content: "Primary EPA contact for NEPA review and coordination on this project.",
    name: "Dr. Sarah Chen",
    role: "Environmental Review Coordinator",
    email: "s.chen@epa.gov",
    phone: "(415) 947-8000",
    organization: "EPA Region 9",
    tags: ["EPA", "NEPA", "Primary Contact"],
    createdAt: "2024-01-08",
    updatedAt: "2024-03-15",
  },
  {
    id: "c-002",
    projectId: "proj-001",
    type: "contact",
    title: "USACE Regulatory Project Manager",
    content: "Army Corps of Engineers contact for Section 404 permit review.",
    name: "James Whitfield",
    role: "Regulatory Project Manager",
    email: "james.whitfield@usace.army.mil",
    phone: "(213) 452-3425",
    organization: "USACE Los Angeles District",
    tags: ["USACE", "Section 404", "Wetlands"],
    createdAt: "2024-01-10",
    updatedAt: "2024-02-28",
  },
  {
    id: "c-003",
    projectId: "proj-001",
    type: "contact",
    title: "State DEQ Air Quality Division",
    content: "State contact for air quality permit review and modeling approval.",
    name: "Maria Gonzalez",
    role: "Air Quality Engineer",
    email: "m.gonzalez@deq.state.gov",
    phone: "(916) 322-8000",
    organization: "State DEQ — Air Division",
    tags: ["DEQ", "Air Quality", "State"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  // Studies
  {
    id: "s-001",
    projectId: "proj-001",
    type: "study",
    title: "Phase I Environmental Site Assessment",
    content:
      "ASTM E1527-21 compliant Phase I ESA identifying recognized environmental conditions (RECs) on the project site. No RECs identified requiring Phase II investigation.",
    author: "GeoEnvironmental Associates",
    year: "2023",
    source: "Internal Report GEA-2023-0412",
    tags: ["Phase I", "ESA", "ASTM"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: "s-002",
    projectId: "proj-001",
    type: "study",
    title: "Biological Resources Survey — Special Status Species",
    content:
      "Protocol-level surveys for federally and state-listed special status species including California tiger salamander, Swainson's hawk, and vernal pool fairy shrimp.",
    author: "Pacific Ecological Services",
    year: "2023",
    doi: "N/A — Proprietary Report",
    source: "PES Report No. 2023-BIO-087",
    tags: ["Biology", "Special Status", "CESA", "ESA"],
    createdAt: "2024-01-08",
    updatedAt: "2024-02-14",
  },
  {
    id: "s-003",
    projectId: "proj-001",
    type: "study",
    title: "Traffic Impact Analysis",
    content:
      "Level of service analysis for 12 study intersections under existing, near-term, and cumulative conditions. Project adds 1,240 daily trips with significant impact at 2 intersections.",
    author: "Fehr & Peers Transportation",
    year: "2024",
    source: "F&P Project No. 24-0156",
    tags: ["Traffic", "LOS", "Transportation"],
    createdAt: "2024-02-01",
    updatedAt: "2024-03-10",
  },
  // Plans
  {
    id: "p-001",
    projectId: "proj-001",
    type: "plan",
    title: "Stormwater Pollution Prevention Plan (SWPPP)",
    content:
      "Construction SWPPP prepared per CGP requirements. Includes BMPs for erosion control, sediment control, and non-stormwater management. Updated for Phase 2 grading.",
    status: "Approved",
    version: "3.1",
    approvedBy: "Regional Water Board",
    tags: ["SWPPP", "Stormwater", "CGP", "BMP"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20",
  },
  {
    id: "p-002",
    projectId: "proj-001",
    type: "plan",
    title: "Dust Control Plan",
    content:
      "Fugitive dust control measures per SCAQMD Rule 403. Includes watering schedules, speed limits, track-out prevention, and wind monitoring triggers.",
    status: "In Review",
    version: "1.2",
    approvedBy: "Pending SCAQMD",
    tags: ["Dust", "SCAQMD", "Rule 403", "Air Quality"],
    createdAt: "2024-02-10",
    updatedAt: "2024-03-18",
  },
  // Procedures
  {
    id: "pr-001",
    projectId: "proj-001",
    type: "procedure",
    title: "Pre-Construction Biological Clearance Survey Protocol",
    content:
      "Step-by-step protocol for conducting pre-construction clearance surveys for special status species. Surveys must be conducted within 72 hours of ground disturbance by a qualified biologist.",
    number: "BIO-PROC-001",
    version: "2.0",
    tags: ["Biology", "Pre-Construction", "Clearance", "Protocol"],
    createdAt: "2024-01-22",
    updatedAt: "2024-02-15",
  },
  {
    id: "pr-002",
    projectId: "proj-001",
    type: "procedure",
    title: "Inadvertent Discovery of Cultural Resources",
    content:
      "Procedure for halting work and notifying the appropriate agencies upon inadvertent discovery of archaeological or cultural resources during ground-disturbing activities.",
    number: "CULT-PROC-001",
    version: "1.0",
    tags: ["Cultural Resources", "Archaeology", "Discovery"],
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
  // Sections
  {
    id: "sec-001",
    projectId: "proj-001",
    type: "section",
    title: "Project Description — Site Location and Setting",
    content:
      "The 47.3-acre project site is located in the unincorporated area of Sacramento County, approximately 2.1 miles northeast of the City of Elk Grove. The site is bounded by Laguna Boulevard to the north, Bruceville Road to the west, agricultural land to the south, and a drainage canal to the east.",
    number: "2.1",
    pageRange: "pp. 2-1 to 2-8",
    tags: ["Project Description", "Site Location", "Setting"],
    createdAt: "2024-01-30",
    updatedAt: "2024-03-22",
  },
  {
    id: "sec-002",
    projectId: "proj-001",
    type: "section",
    title: "Alternatives Analysis — Reduced Footprint Alternative",
    content:
      "The Reduced Footprint Alternative would reduce the project area by approximately 12 acres by eliminating the northern commercial pad. This alternative would avoid impacts to 2.3 acres of seasonal wetlands but would not meet the project objectives for commercial floor area.",
    number: "5.3",
    pageRange: "pp. 5-14 to 5-22",
    tags: ["Alternatives", "Wetlands", "NEPA"],
    createdAt: "2024-02-05",
    updatedAt: "2024-03-15",
  },
];

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS: { type: TabType; label: string; icon: React.ReactNode; plural: string }[] = [
  { type: "guidance", label: "Guidance", icon: <BookOpen className="h-4 w-4" />, plural: "Guidance Documents" },
  { type: "number", label: "Key Numbers", icon: <Hash className="h-4 w-4" />, plural: "Key Numbers" },
  { type: "contact", label: "Contacts", icon: <Users className="h-4 w-4" />, plural: "Contacts" },
  { type: "study", label: "Studies", icon: <FlaskConical className="h-4 w-4" />, plural: "Studies" },
  { type: "plan", label: "Plans", icon: <Map className="h-4 w-4" />, plural: "Plans" },
  { type: "procedure", label: "Procedures", icon: <ClipboardList className="h-4 w-4" />, plural: "Procedures" },
  { type: "section", label: "Sections", icon: <Layers className="h-4 w-4" />, plural: "Document Sections" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Empty Form State ─────────────────────────────────────────────────────────

function emptyForm(type: TabType): Partial<LocalContextItem> {
  const base = {
    type,
    title: "",
    content: "",
    source: "",
    tags: [] as string[],
  };
  switch (type) {
    case "guidance":
      return { ...base, agency: "", effectiveDate: "" };
    case "number":
      return { ...base, value: "", unit: "", regulation: "" };
    case "contact":
      return { ...base, name: "", role: "", email: "", phone: "", organization: "" };
    case "study":
      return { ...base, author: "", year: "", doi: "" };
    case "plan":
      return { ...base, status: "", version: "", approvedBy: "" };
    case "procedure":
      return { ...base, number: "", version: "" };
    case "section":
      return { ...base, number: "", pageRange: "" };
    default:
      return base;
  }
}

// ─── Briefing Generator ───────────────────────────────────────────────────────

function generateBriefing(items: LocalContextItem[], type: TabType): string {
  const tab = TABS.find((t) => t.type === type);
  const label = tab?.plural ?? type;
  const lines: string[] = [
    `FILING DESK — PROJECT BRIEFING`,
    `Section: ${label}`,
    `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    `Total Items: ${items.length}`,
    `${"─".repeat(60)}`,
    "",
  ];

  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.title}`);
    if (item.agency) lines.push(`   Agency: ${item.agency}`);
    if (item.effectiveDate) lines.push(`   Effective: ${item.effectiveDate}`);
    if (item.name) lines.push(`   Contact: ${item.name} — ${item.role ?? ""}`);
    if (item.email) lines.push(`   Email: ${item.email}`);
    if (item.phone) lines.push(`   Phone: ${item.phone}`);
    if (item.organization) lines.push(`   Organization: ${item.organization}`);
    if (item.value) lines.push(`   Value: ${item.value} ${item.unit ?? ""}`);
    if (item.regulation) lines.push(`   Regulation: ${item.regulation}`);
    if (item.author) lines.push(`   Author: ${item.author} (${item.year ?? ""})`);
    if (item.doi) lines.push(`   Reference: ${item.doi}`);
    if (item.status) lines.push(`   Status: ${item.status}`);
    if (item.version) lines.push(`   Version: ${item.version}`);
    if (item.approvedBy) lines.push(`   Approved By: ${item.approvedBy}`);
    if (item.number) lines.push(`   Number: ${item.number}`);
    if (item.pageRange) lines.push(`   Pages: ${item.pageRange}`);
    lines.push(`   ${item.content}`);
    if (item.source) lines.push(`   Source: ${item.source}`);
    if ((item.tags ?? []).length > 0) lines.push(`   Tags: ${item.tags.join(", ")}`);
    lines.push("");
  });

  return lines.join("\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      <Tag className="h-2.5 w-2.5" />
      {tag}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "In Review"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", color)}>
      {status}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } },
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)] border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  open,
  onClose,
  onConfirm,
  itemTitle,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Archive Item">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">This item will be archived</p>
            <p className="mt-1 text-sm text-amber-700">
              Nothing is permanently deleted. You can restore archived items at any time.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Archive <span className="font-medium text-slate-900">&ldquo;{itemTitle}&rdquo;</span>?
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Archive
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Briefing Modal ───────────────────────────────────────────────────────────

function BriefingModal({
  open,
  onClose,
  text,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Copy as Briefing">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          A formatted briefing summary of all visible items. Copy and paste into any document or email.
        </p>
        <pre className="max-h-72 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
          {text}
        </pre>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all",
              copied ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Form Fields ──────────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none";

// ─── Item Form ────────────────────────────────────────────────────────────────

function ItemForm({
  type,
  value,
  onChange,
}: {
  type: TabType;
  value: Partial<LocalContextItem>;
  onChange: (updated: Partial<LocalContextItem>) => void;
}) {
  function set(field: keyof LocalContextItem, val: string) {
    onChange({ ...value, [field]: val });
  }

  function setTags(raw: string) {
    onChange({ ...value, tags: raw.split(",").map((t) => t.trim()).filter(Boolean) });
  }

  return (
    <div className="space-y-4">
      <FormField label="Title" required>
        <input
          className={inputClass}
          placeholder="Enter a descriptive title"
          value={value.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
        />
      </FormField>

      <FormField label="Description / Content" required>
        <textarea
          className={textareaClass}
          rows={4}
          placeholder="Describe this item in detail..."
          value={value.content ?? ""}
          onChange={(e) => set("content", e.target.value)}
        />
      </FormField>

      {/* Type-specific fields */}
      {type === "guidance" && (
        <>
          <FormField label="Agency">
            <input className={inputClass} placeholder="e.g. EPA, USACE, State DEQ" value={value.agency ?? ""} onChange={(e) => set("agency", e.target.value)} />
          </FormField>
          <FormField label="Effective Date">
            <input className={inputClass} type="date" value={value.effectiveDate ?? ""} onChange={(e) => set("effectiveDate", e.target.value)} />
          </FormField>
        </>
      )}

      {type === "number" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Value" required>
              <input className={inputClass} placeholder="e.g. 12" value={value.value ?? ""} onChange={(e) => set("value", e.target.value)} />
            </FormField>
            <FormField label="Unit">
              <input className={inputClass} placeholder="e.g. µg/m³" value={value.unit ?? ""} onChange={(e) => set("unit", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Regulation / Citation">
            <input className={inputClass} placeholder="e.g. 40 CFR Part 50" value={value.regulation ?? ""} onChange={(e) => set("regulation", e.target.value)} />
          </FormField>
        </>
      )}

      {type === "contact" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required>
              <input className={inputClass} placeholder="Dr. Jane Smith" value={value.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            </FormField>
            <FormField label="Role">
              <input className={inputClass} placeholder="Project Manager" value={value.role ?? ""} onChange={(e) => set("role", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Organization">
            <input className={inputClass} placeholder="EPA Region 9" value={value.organization ?? ""} onChange={(e) => set("organization", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email">
              <input className={inputClass} type="email" placeholder="jane@agency.gov" value={value.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <input className={inputClass} placeholder="(415) 555-0100" value={value.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </FormField>
          </div>
        </>
      )}

      {type === "study" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Author / Firm">
              <input className={inputClass} placeholder="GeoEnvironmental Associates" value={value.author ?? ""} onChange={(e) => set("author", e.target.value)} />
            </FormField>
            <FormField label="Year">
              <input className={inputClass} placeholder="2024" value={value.year ?? ""} onChange={(e) => set("year", e.target.value)} />
            </FormField>
          </div>
          <FormField label="DOI / Reference Number">
            <input className={inputClass} placeholder="DOI or internal report number" value={value.doi ?? ""} onChange={(e) => set("doi", e.target.value)} />
          </FormField>
        </>
      )}

      {type === "plan" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Status">
              <select className={inputClass} value={value.status ?? ""} onChange={(e) => set("status", e.target.value)}>
                <option value="">Select status</option>
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Superseded">Superseded</option>
              </select>
            </FormField>
            <FormField label="Version">
              <input className={inputClass} placeholder="e.g. 2.1" value={value.version ?? ""} onChange={(e) => set("version", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Approved By">
            <input className={inputClass} placeholder="Approving agency or person" value={value.approvedBy ?? ""} onChange={(e) => set("approvedBy", e.target.value)} />
          </FormField>
        </>
      )}

      {type === "procedure" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Procedure Number">
              <input className={inputClass} placeholder="e.g. BIO-PROC-001" value={value.number ?? ""} onChange={(e) => set("number", e.target.value)} />
            </FormField>
            <FormField label="Version">
              <input className={inputClass} placeholder="e.g. 1.0" value={value.version ?? ""} onChange={(e) => set("version", e.target.value)} />
            </FormField>
          </div>
        </>
      )}

      {type === "section" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Section Number">
              <input className={inputClass} placeholder="e.g. 2.1" value={value.number ?? ""} onChange={(e) => set("number", e.target.value)} />
            </FormField>
            <FormField label="Page Range">
              <input className={inputClass} placeholder="e.g. pp. 2-1 to 2-8" value={value.pageRange ?? ""} onChange={(e) => set("pageRange", e.target.value)} />
            </FormField>
          </div>
        </>
      )}

      <FormField label="Source / URL">
        <input className={inputClass} placeholder="https://..." value={value.source ?? ""} onChange={(e) => set("source", e.target.value)} />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <input
          className={inputClass}
          placeholder="e.g. NEPA, Air Quality, Federal"
          value={(value.tags ?? []).join(", ")}
          onChange={(e) => setTags(e.target.value)}
        />
      </FormField>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: LocalContextItem;
  onEdit: (item: LocalContextItem) => void;
  onDelete: (item: LocalContextItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -1 }}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {item.number && (
              <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                {item.number}
              </span>
            )}
            <h3 className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</h3>
          </div>

          {/* Type-specific metadata row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {item.agency && <span className="font-medium text-blue-700">{item.agency}</span>}
            {item.name && <span>{item.name}</span>}
            {item.role && <span className="text-slate-400">{item.role}</span>}
            {item.organization && <span>{item.organization}</span>}
            {item.value && (
              <span className="font-mono font-semibold text-slate-800">
                {item.value} <span className="font-normal text-slate-500">{item.unit}</span>
              </span>
            )}
            {item.regulation && <span className="text-slate-400">{item.regulation}</span>}
            {item.author && <span>{item.author}</span>}
            {item.year && <span>{item.year}</span>}
            {item.status && <StatusBadge status={item.status} />}
            {item.version && <span className="text-slate-400">v{item.version}</span>}
            {item.effectiveDate && <span>Effective {item.effectiveDate}</span>}
            {item.pageRange && <span className="text-slate-400">{item.pageRange}</span>}
          </div>

          {/* Content */}
          <p className={cn("mt-2 text-sm text-slate-600 leading-relaxed", !expanded && "line-clamp-2")}>
            {item.content}
          </p>
          {item.content.length > 120 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}

          {/* Contact details */}
          {item.email && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <ExternalLink className="h-3 w-3" />
                {item.email}
              </a>
              {item.phone && <span>{item.phone}</span>}
            </div>
          )}

          {/* Source */}
          {item.source && (
            <div className="mt-2">
              <a
                href={item.source.startsWith("http") ? item.source : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-xs">{item.source}</span>
              </a>
            </div>
          )}

          {/* Tags */}
          {(item.tags ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Archive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ type, onAdd }: { type: TabType; onAdd: () => void }) {
  const tab = TABS.find((t) => t.type === type);
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        {tab?.icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">No {tab?.plural ?? type} yet</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
        Add your first {tab?.label.toLowerCase()} item to build out the project context.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add {tab?.label}
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContextManagerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("guidance");
  const [items, setItems] = useState<LocalContextItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState("");

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<LocalContextItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<LocalContextItem | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<LocalContextItem>>(emptyForm(activeTab));
  const [formError, setFormError] = useState("");

  // Filtered items
  const visibleItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.type === activeTab &&
        !item.deletedAt &&
        (search === "" ||
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.content.toLowerCase().includes(search.toLowerCase()) ||
          (item.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase())))
    );
  }, [items, activeTab, search]);

  const briefingText = useMemo(() => generateBriefing(visibleItems, activeTab), [visibleItems, activeTab]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<TabType, number> = {
      guidance: 0,
      number: 0,
      contact: 0,
      study: 0,
      plan: 0,
      procedure: 0,
      section: 0,
    };
    items.forEach((item) => {
      if (!item.deletedAt) counts[item.type] = (counts[item.type] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  function openAdd() {
    setFormData(emptyForm(activeTab));
    setFormError("");
    setAddOpen(true);
  }

  function openEdit(item: LocalContextItem) {
    setFormData({ ...item });
    setFormError("");
    setEditItem(item);
  }

  function openDelete(item: LocalContextItem) {
    setDeleteItem(item);
  }

  function handleSaveAdd() {
    if (!formData.title?.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.content?.trim()) {
      setFormError("Content is required.");
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const newItem: LocalContextItem = {
      id: generateId(),
      projectId: "proj-001",
      type: activeTab,
      title: formData.title ?? "",
      content: formData.content ?? "",
      source: formData.source ?? "",
      tags: formData.tags ?? [],
      createdAt: now,
      updatedAt: now,
      agency: formData.agency,
      effectiveDate: formData.effectiveDate,
      value: formData.value,
      unit: formData.unit,
      regulation: formData.regulation,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      author: formData.author,
      year: formData.year,
      doi: formData.doi,
      status: formData.status,
      version: formData.version,
      approvedBy: formData.approvedBy,
      number: formData.number,
      pageRange: formData.pageRange,
    };
    setItems((prev) => [newItem, ...prev]);
    setAddOpen(false);
    setFormData(emptyForm(activeTab));
  }

  function handleSaveEdit() {
    if (!editItem) return;
    if (!formData.title?.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.content?.trim()) {
      setFormError("Content is required.");
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    setItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? {
              ...item,
              ...formData,
              updatedAt: now,
            }
          : item
      )
    );
    setEditItem(null);
    setFormData(emptyForm(activeTab));
  }

  function handleDelete() {
    if (!deleteItem) return;
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === deleteItem.id ? { ...item, deletedAt: now } : item
      )
    );
    setDeleteItem(null);
  }

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setSearch("");
    setFormData(emptyForm(tab));
  }

  const currentTab = TABS.find((t) => t.type === activeTab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Riverside Commons Mixed-Use Development</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">Context Manager</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Context Manager
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage guidance, key numbers, contacts, studies, plans, procedures, and document sections for this project.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setBriefingOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
              >
                <Copy className="h-4 w-4" />
                Copy as Briefing
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add {currentTab?.label}
              </button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-7"
          >
            {TABS.map((tab) => (
              <motion.button
                key={tab.type}
                variants={scaleIn}
                onClick={() => handleTabChange(tab.type)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                  activeTab === tab.type
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className={cn("text-sm", activeTab === tab.type ? "text-blue-600" : "text-slate-400")}>
                  {tab.icon}
                </span>
                <span className={cn("text-lg font-bold leading-none", activeTab === tab.type ? "text-blue-700" : "text-slate-800")}>
                  {tabCounts[tab.type]}
                </span>
                <span className={cn("text-xs leading-tight", activeTab === tab.type ? "text-blue-600 font-medium" : "text-slate-500")}>
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => handleTabChange(tab.type)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.type
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                )}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    activeTab === tab.type ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {tabCounts[tab.type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder={`Search ${currentTab?.plural ?? "items"}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
              {search && ` matching "${search}"`}
            </span>
            <button
              onClick={() => setBriefingOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export Briefing
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3"
          >
            {visibleItems.length === 0 ? (
              search ? (
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <Search className="h-10 w-10 text-slate-300 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-900">No results found</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    No items match &ldquo;{search}&rdquo;. Try a different search term.
                  </p>
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                </motion.div>
              ) : (
                <EmptyState type={activeTab} onAdd={openAdd} />
              )
            ) : (
              visibleItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); setFormError(""); }}
        title={`Add ${currentTab?.label}`}
      >
        <div className="space-y-5">
          <ItemForm type={activeTab} value={formData} onChange={setFormData} />
          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => { setAddOpen(false); setFormError(""); }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAdd}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Save {currentTab?.label}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        onClose={() => { setEditItem(null); setFormError(""); }}
        title={`Edit ${currentTab?.label}`}
      >
        <div className="space-y-5">
          <ItemForm type={activeTab} value={formData} onChange={setFormData} />
          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => { setEditItem(null); setFormError(""); }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        itemTitle={deleteItem?.title ?? ""}
      />

      {/* Briefing Modal */}
      <BriefingModal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        text={briefingText}
      />
    </div>
  );
}