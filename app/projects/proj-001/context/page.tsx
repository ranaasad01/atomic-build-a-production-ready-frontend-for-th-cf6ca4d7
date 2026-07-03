"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { BookOpen, Hash, Users, FlaskConical, Map, ClipboardList, Layers, Plus, Search, Edit2, Trash2, Copy, ChevronDown, ChevronRight, Tag, ExternalLink, X, Check, FileText, AlertCircle, Info } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { type ContextItem } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContextType =
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
  type: ContextType;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONTEXT_ITEMS: LocalContextItem[] = [
  // Guidance
  {
    id: "ctx-001",
    projectId: "proj-001",
    type: "guidance",
    title: "EPA 40 CFR Part 122 — NPDES Permit Requirements",
    content:
      "National Pollutant Discharge Elimination System permits are required for any point source discharge to waters of the United States. Applicants must demonstrate compliance with technology-based and water quality-based effluent limitations. Applications must be submitted at least 180 days before the permit is needed.",
    source: "EPA 40 CFR Part 122",
    tags: ["NPDES", "discharge", "EPA", "permit"],
    createdAt: "2024-01-10",
    updatedAt: "2024-03-15",
    author: "Sarah Chen",
  },
  {
    id: "ctx-002",
    projectId: "proj-001",
    type: "guidance",
    title: "CEQA Guidelines — Initial Study Checklist",
    content:
      "The California Environmental Quality Act requires lead agencies to prepare an Initial Study to determine whether a project may have a significant effect on the environment. The checklist must address aesthetics, agriculture, air quality, biological resources, cultural resources, energy, geology, greenhouse gas emissions, hazards, hydrology, land use, mineral resources, noise, population, public services, recreation, transportation, tribal cultural resources, utilities, and wildfire.",
    source: "CEQA Guidelines §15063",
    tags: ["CEQA", "California", "environmental", "initial study"],
    createdAt: "2024-01-12",
    updatedAt: "2024-03-20",
    author: "Marcus Webb",
  },
  {
    id: "ctx-003",
    projectId: "proj-001",
    type: "guidance",
    title: "Section 404 Wetland Delineation Standards",
    content:
      "Wetland delineation under Section 404 of the Clean Water Act requires identification of three parameters: hydrophytic vegetation, hydric soils, and wetland hydrology. All three must be present for an area to be classified as a jurisdictional wetland. The Corps of Engineers Wetlands Delineation Manual (1987) and applicable regional supplements govern the methodology.",
    source: "USACE Wetlands Delineation Manual 1987",
    tags: ["Section 404", "wetlands", "USACE", "delineation"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-28",
    author: "Sarah Chen",
  },
  // Key Numbers
  {
    id: "ctx-004",
    projectId: "proj-001",
    type: "number",
    title: "Maximum Daily Discharge Limit — TSS",
    content:
      "Total Suspended Solids maximum daily discharge limit is 100 mg/L as established by the Regional Water Quality Control Board. Monthly average limit is 45 mg/L. Exceedances must be reported within 24 hours.",
    source: "RWQCB Order No. 2023-0042",
    tags: ["TSS", "discharge", "limit", "water quality"],
    createdAt: "2024-01-18",
    updatedAt: "2024-03-01",
    author: "Marcus Webb",
  },
  {
    id: "ctx-005",
    projectId: "proj-001",
    type: "number",
    title: "Project Area — Total Disturbed Acreage",
    content:
      "Total project disturbance footprint is 47.3 acres, of which 12.8 acres are within the 100-year floodplain. Impervious surface increase is 8.4 acres. These figures trigger SWPPP requirements and Conditional Letter of Map Revision (CLOMR) review.",
    source: "Site Survey Report, January 2024",
    tags: ["acreage", "floodplain", "SWPPP", "impervious"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    author: "Elena Vasquez",
  },
  {
    id: "ctx-006",
    projectId: "proj-001",
    type: "number",
    title: "Groundwater Depth — Seasonal High",
    content:
      "Seasonal high groundwater depth is 4.2 feet below ground surface (bgs) based on monitoring well data from February–April 2023. This depth is critical for septic system setback calculations and foundation design. Depth to groundwater in summer months averages 11.7 feet bgs.",
    source: "Geotechnical Investigation Report, March 2023",
    tags: ["groundwater", "depth", "seasonal", "monitoring"],
    createdAt: "2024-01-22",
    updatedAt: "2024-02-10",
    author: "Sarah Chen",
  },
  // Contacts
  {
    id: "ctx-007",
    projectId: "proj-001",
    type: "contact",
    title: "Regional Water Quality Control Board — Permit Coordinator",
    content:
      "Primary contact for NPDES permit questions and submissions. Preferred contact method is email. Response time is typically 5–10 business days. Pre-application meetings can be scheduled with 2 weeks notice.\n\nName: Jennifer Morales\nTitle: Senior Environmental Scientist\nEmail: jennifer.morales@waterboards.ca.gov\nPhone: (916) 555-0142\nOffice: Sacramento, CA",
    source: "RWQCB Staff Directory 2024",
    tags: ["RWQCB", "NPDES", "permit", "contact"],
    createdAt: "2024-01-25",
    updatedAt: "2024-03-10",
    author: "Marcus Webb",
  },
  {
    id: "ctx-008",
    projectId: "proj-001",
    type: "contact",
    title: "US Army Corps of Engineers — Sacramento District",
    content:
      "Section 404 permit applications and jurisdictional determinations. Pre-application meetings strongly recommended for projects with wetland impacts greater than 0.1 acres.\n\nName: Robert Tanaka\nTitle: Project Manager, Regulatory Division\nEmail: robert.tanaka@usace.army.mil\nPhone: (916) 555-0287\nOffice: 1325 J Street, Sacramento, CA 95814",
    source: "USACE Sacramento District Directory",
    tags: ["USACE", "Section 404", "wetlands", "regulatory"],
    createdAt: "2024-01-25",
    updatedAt: "2024-02-15",
    author: "Elena Vasquez",
  },
  // Studies
  {
    id: "ctx-009",
    projectId: "proj-001",
    type: "study",
    title: "Phase I Environmental Site Assessment",
    content:
      "Phase I ESA conducted per ASTM E1527-21 standard. No Recognized Environmental Conditions (RECs) identified. Two Historical RECs (HRECs) noted related to former agricultural chemical storage on the northeast parcel. Vapor encroachment screening recommended prior to grading. Report date: November 2023.",
    source: "EnviroTech Associates, Phase I ESA Report, Nov 2023",
    tags: ["Phase I", "ESA", "RECs", "ASTM"],
    createdAt: "2024-01-28",
    updatedAt: "2024-01-28",
    author: "Sarah Chen",
  },
  {
    id: "ctx-010",
    projectId: "proj-001",
    type: "study",
    title: "Biological Resources Assessment — Special Status Species",
    content:
      "Survey conducted April–June 2023 during optimal detection window. Three special-status plant species detected: Congdon's tarplant (CNPS List 1B.1), Showy madia (CNPS List 4.2), and Alkali milk-vetch (CRPR 1B.2). No listed wildlife species detected. Focused surveys for Swainson's hawk recommended prior to vegetation removal.",
    source: "BioSurvey Inc., Biological Resources Assessment, July 2023",
    tags: ["biology", "special status", "CNPS", "survey"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-20",
    author: "Marcus Webb",
  },
  // Plans
  {
    id: "ctx-011",
    projectId: "proj-001",
    type: "plan",
    title: "Stormwater Pollution Prevention Plan (SWPPP)",
    content:
      "SWPPP prepared per Construction General Permit (CGP) Order 2022-0057-DWQ requirements. Best Management Practices (BMPs) include fiber rolls, silt fencing, construction entrance stabilization, and concrete washout areas. Qualified SWPPP Practitioner (QSP) designated: Marcus Webb, QSP #12847. Annual inspection schedule established.",
    source: "SWPPP Document v2.1, February 2024",
    tags: ["SWPPP", "stormwater", "BMP", "CGP"],
    createdAt: "2024-02-05",
    updatedAt: "2024-03-18",
    author: "Marcus Webb",
  },
  {
    id: "ctx-012",
    projectId: "proj-001",
    type: "plan",
    title: "Mitigation Monitoring and Reporting Program (MMRP)",
    content:
      "MMRP establishes 23 mitigation measures across biological, cultural, noise, and air quality resource areas. Monitoring frequency ranges from pre-construction verification to ongoing construction monitoring to post-construction compliance reporting. Responsible parties identified for each measure. Reporting due quarterly to lead agency.",
    source: "MMRP Final, March 2024",
    tags: ["MMRP", "mitigation", "monitoring", "CEQA"],
    createdAt: "2024-02-08",
    updatedAt: "2024-03-22",
    author: "Elena Vasquez",
  },
  // Procedures
  {
    id: "ctx-013",
    projectId: "proj-001",
    type: "procedure",
    title: "Pre-Construction Biological Survey Protocol",
    content:
      "1. Schedule surveys with qualified biologist minimum 72 hours before ground disturbance.\n2. Conduct pre-construction clearance survey within 24 hours of vegetation removal.\n3. Establish 50-foot buffer around any active raptor nests.\n4. Document survey results on standardized form and submit to project biologist within 24 hours.\n5. Halt work immediately if listed species detected and notify project manager and agency within 1 hour.",
    source: "Project Biological Monitoring Plan, Section 4",
    tags: ["biology", "pre-construction", "survey", "protocol"],
    createdAt: "2024-02-10",
    updatedAt: "2024-03-05",
    author: "Sarah Chen",
  },
  {
    id: "ctx-014",
    projectId: "proj-001",
    type: "procedure",
    title: "Permit Application Submission Checklist",
    content:
      "1. Verify all required forms are complete and signed by authorized representative.\n2. Confirm payment of applicable fees (NPDES: $2,500; Section 404: $100–$25,000 based on impact).\n3. Attach all required technical reports and supporting documentation.\n4. Submit original plus two copies to agency (or electronic submission where accepted).\n5. Retain proof of submission and track application number.\n6. Calendar follow-up date 30 days after submission.",
    source: "Internal SOP-ENV-007",
    tags: ["submission", "checklist", "permit", "procedure"],
    createdAt: "2024-02-12",
    updatedAt: "2024-03-12",
    author: "Marcus Webb",
  },
  // Sections
  {
    id: "ctx-015",
    projectId: "proj-001",
    type: "section",
    title: "Executive Summary — Project Description",
    content:
      "The proposed project involves the development of a 47.3-acre mixed-use commercial and light industrial facility in Sacramento County, California. The project includes construction of approximately 285,000 square feet of building area, associated parking, landscaping, and infrastructure improvements. The project site is located at the intersection of Industrial Boulevard and Commerce Drive, within the City of Elk Grove Sphere of Influence.",
    source: "Project Description, Section 1.0",
    tags: ["executive summary", "project description", "scope"],
    createdAt: "2024-02-15",
    updatedAt: "2024-03-25",
    author: "Elena Vasquez",
  },
  {
    id: "ctx-016",
    projectId: "proj-001",
    type: "section",
    title: "Regulatory Setting — Federal Requirements",
    content:
      "Federal regulatory requirements applicable to this project include: Clean Water Act Section 404 (wetland fill), Clean Water Act Section 402 (NPDES stormwater), Endangered Species Act Section 7 consultation (if federal nexus), and National Historic Preservation Act Section 106 (if federal funding or permit). The project does not involve federal land ownership or federal funding, limiting federal nexus primarily to USACE Section 404 jurisdiction.",
    source: "Regulatory Setting, Section 3.1",
    tags: ["regulatory", "federal", "CWA", "ESA"],
    createdAt: "2024-02-18",
    updatedAt: "2024-03-28",
    author: "Sarah Chen",
  },
];

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  ContextType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  guidance: {
    label: "Guidance",
    icon: BookOpen,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Regulatory guidance documents and standards",
  },
  number: {
    label: "Key Numbers",
    icon: Hash,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Critical numeric thresholds and measurements",
  },
  contact: {
    label: "Contacts",
    icon: Users,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Agency contacts and key stakeholders",
  },
  study: {
    label: "Studies",
    icon: FlaskConical,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Technical studies and assessments",
  },
  plan: {
    label: "Plans",
    icon: Map,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Project plans and programs",
  },
  procedure: {
    label: "Procedures",
    icon: ClipboardList,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    description: "Standard operating procedures and protocols",
  },
  section: {
    label: "Sections",
    icon: Layers,
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    description: "Document sections and boilerplate text",
  },
};

const ALL_TYPES: ContextType[] = [
  "guidance",
  "number",
  "contact",
  "study",
  "plan",
  "procedure",
  "section",
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const month = months[parseInt(parts[1] ?? "1", 10) - 1] ?? "";
  const day = parseInt(parts[2] ?? "1", 10);
  const year = parts[0] ?? "";
  return `${month} ${day}, ${year}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ type }: { type: ContextType }) {
  const cfg = CATEGORY_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        cfg.color,
        cfg.bgColor,
        cfg.borderColor
      )}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
      <Tag className="h-2.5 w-2.5" />
      {tag}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  mode: "add" | "edit";
  item: Partial<LocalContextItem>;
  onClose: () => void;
  onSave: (item: LocalContextItem) => void;
}

function ContextModal({ mode, item, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<{
    type: ContextType;
    title: string;
    content: string;
    source: string;
    tags: string;
  }>({
    type: (item.type as ContextType) ?? "guidance",
    title: item.title ?? "",
    content: item.content ?? "",
    source: item.source ?? "",
    tags: (item.tags ?? []).join(", "),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.content.trim()) e.content = "Content is required.";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    const saved: LocalContextItem = {
      id: item.id ?? `ctx-${Date.now()}`,
      projectId: "proj-001",
      type: form.type,
      title: form.title.trim(),
      content: form.content.trim(),
      source: form.source.trim() || undefined,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: item.createdAt ?? "2024-04-01",
      updatedAt: "2024-04-01",
      author: item.author ?? "You",
    };
    onSave(saved);
  }

  return (
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
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {mode === "add" ? "Add Context Item" : "Edit Context Item"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Category
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as ContextType }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CATEGORY_CONFIG[t].label}
                </option>
              ))}
            </select>
          </div>
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Enter a descriptive title..."
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                errors.title
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-blue-500"
              )}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              rows={5}
              placeholder="Enter the context content..."
              className={cn(
                "w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                errors.content
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-blue-500"
              )}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content}</p>
            )}
          </div>
          {/* Source */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Source
            </label>
            <input
              type="text"
              value={form.source}
              onChange={(e) =>
                setForm((f) => ({ ...f, source: e.target.value }))
              }
              placeholder="e.g. EPA 40 CFR Part 122"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Tags{" "}
              <span className="font-normal text-slate-400">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) =>
                setForm((f) => ({ ...f, tags: e.target.value }))
              }
              placeholder="e.g. NPDES, discharge, EPA"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            {mode === "add" ? "Add Item" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Context Item Card ────────────────────────────────────────────────────────

interface ItemCardProps {
  item: LocalContextItem;
  onEdit: (item: LocalContextItem) => void;
  onDelete: (id: string) => void;
  onCopy: (item: LocalContextItem) => void;
}

function ContextItemCard({ item, onEdit, onDelete, onCopy }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    onCopy(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const preview = item.content.length > 160
    ? item.content.slice(0, 160) + "..."
    : item.content;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -1 }}
      className="group rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.1)]"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <CategoryBadge type={item.type} />
              {item.source && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <ExternalLink className="h-3 w-3" />
                  {item.source}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 leading-snug">
              {item.title}
            </h3>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy as briefing"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => onEdit(item)}
              title="Edit"
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Archive"
              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
          {expanded ? item.content : preview}
        </p>
        {item.content.length > 160 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronDown className="h-3 w-3 rotate-180" />
                Show less
              </>
            ) : (
              <>
                <ChevronRight className="h-3 w-3" />
                Show more
              </>
            )}
          </button>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
          <span className="text-xs text-slate-400">
            By {item.author} · Updated {formatDate(item.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Briefing Toast ───────────────────────────────────────────────────────────

function BriefingToast({
  item,
  onClose,
}: {
  item: LocalContextItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Copied as briefing
              </p>
              <p className="mt-0.5 text-xs text-slate-500 truncate">
                {item.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Archive this item?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nothing is permanently deleted. You can restore it from the audit trail.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Archive
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContextPage() {
  const [items, setItems] = useState<LocalContextItem[]>(MOCK_CONTEXT_ITEMS);
  const [activeType, setActiveType] = useState<ContextType | "all">("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    item: Partial<LocalContextItem>;
  }>({ open: false, mode: "add", item: {} });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [briefingItem, setBriefingItem] = useState<LocalContextItem | null>(
    null
  );

  // Filtered items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchType = activeType === "all" || item.type === activeType;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.source ?? "").toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchType && matchSearch;
    });
  }, [items, activeType, search]);

  // Counts per type
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    ALL_TYPES.forEach((t) => {
      c[t] = items.filter((i) => i.type === t).length;
    });
    return c;
  }, [items]);

  function handleSave(saved: LocalContextItem) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModal({ open: false, mode: "add", item: {} });
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (deleteId) {
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setDeleteId(null);
    }
  }

  function handleCopy(item: LocalContextItem) {
    setBriefingItem(item);
    setTimeout(() => setBriefingItem(null), 3500);
  }

  // Group filtered items by type for the "all" view
  const grouped = useMemo(() => {
    if (activeType !== "all") return null;
    const groups: Record<ContextType, LocalContextItem[]> = {
      guidance: [],
      number: [],
      contact: [],
      study: [],
      plan: [],
      procedure: [],
      section: [],
    };
    filtered.forEach((item) => {
      groups[item.type].push(item);
    });
    return groups;
  }, [activeType, filtered]);

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
                <span>Projects</span>
                <ChevronRight className="h-3 w-3" />
                <span>Riverside Commerce Park</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900 font-medium">
                  Context Manager
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Context Manager
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage regulatory guidance, key numbers, contacts, studies,
                plans, procedures, and document sections for this project.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setModal({ open: true, mode: "add", item: {} })
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
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
            {ALL_TYPES.map((type) => {
              const cfg = CATEGORY_CONFIG[type];
              const Icon = cfg.icon;
              const count = counts[type] ?? 0;
              return (
                <motion.button
                  key={type}
                  variants={itemVariants}
                  onClick={() =>
                    setActiveType(activeType === type ? "all" : type)
                  }
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                    activeType === type
                      ? cn(cfg.bgColor, cfg.borderColor, cfg.color)
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-lg font-bold leading-none">
                    {count}
                  </span>
                  <span className="text-xs font-medium leading-tight">
                    {cfg.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-14 z-30">
        <div className="mx-auto max-w-screen-xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search context items..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Type filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveType("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  activeType === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                All ({counts.all ?? 0})
              </button>
              {ALL_TYPES.map((type) => {
                const cfg = CATEGORY_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() =>
                      setActiveType(activeType === type ? "all" : type)
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      activeType === type
                        ? cn(cfg.bgColor, cfg.color, "border", cfg.borderColor)
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {cfg.label} ({counts[type] ?? 0})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Info className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No context items found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              {search
                ? `No items match "${search}". Try a different search term.`
                : "Add your first context item to get started."}
            </p>
            {!search && (
              <button
                onClick={() =>
                  setModal({ open: true, mode: "add", item: {} })
                }
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            )}
          </motion.div>
        ) : activeType !== "all" ? (
          // Single type view
          <motion.div
            key={activeType}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item) => (
              <ContextItemCard
                key={item.id}
                item={item}
                onEdit={(i) =>
                  setModal({ open: true, mode: "edit", item: i })
                }
                onDelete={handleDelete}
                onCopy={handleCopy}
              />
            ))}
          </motion.div>
        ) : (
          // Grouped "all" view
          <div className="space-y-10">
            {ALL_TYPES.map((type) => {
              const typeItems = grouped?.[type] ?? [];
              if (typeItems.length === 0) return null;
              const cfg = CATEGORY_CONFIG[type];
              const Icon = cfg.icon;
              return (
                <motion.section
                  key={type}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUp}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border",
                        cfg.bgColor,
                        cfg.borderColor
                      )}
                    >
                      <Icon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {cfg.label}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {cfg.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "ml-auto rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        cfg.color,
                        cfg.bgColor,
                        cfg.borderColor
                      )}
                    >
                      {typeItems.length}
                    </span>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {typeItems.map((item) => (
                      <ContextItemCard
                        key={item.id}
                        item={item}
                        onEdit={(i) =>
                          setModal({ open: true, mode: "edit", item: i })
                        }
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                      />
                    ))}
                  </motion.div>
                </motion.section>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal.open && (
          <ContextModal
            key="context-modal"
            mode={modal.mode}
            item={modal.item}
            onClose={() => setModal({ open: false, mode: "add", item: {} })}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <DeleteConfirm
            key="delete-confirm"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>

      <BriefingToast
        item={briefingItem}
        onClose={() => setBriefingItem(null)}
      />
    </div>
  );
}