"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Hash, Users, FlaskConical, Map, ClipboardList, Layers, Plus, Search, Edit2, Trash2, Copy, X, Check, ChevronDown, Tag, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { type Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContextType =
  | "guidance"
  | "number"
  | "contact"
  | "study"
  | "plan"
  | "procedure"
  | "section";

interface ContextItem {
  id: string;
  type: ContextType;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ITEMS: ContextItem[] = [
  {
    id: "ctx-001",
    type: "guidance",
    title: "EPA 40 CFR Part 122 — NPDES Permit Requirements",
    content:
      "All point source discharges to waters of the United States require an NPDES permit. Applications must include discharge characterization, monitoring plans, and best management practices documentation.",
    source: "EPA.gov — 40 CFR Part 122",
    tags: ["NPDES", "EPA", "discharge", "permit"],
    createdAt: "2024-01-10",
    updatedAt: "2024-03-15",
  },
  {
    id: "ctx-002",
    type: "guidance",
    title: "CEQA Initial Study Checklist — Air Quality Thresholds",
    content:
      "Projects exceeding 54 lbs/day of ROG or NOx require a full air quality impact analysis. Mitigation measures must reduce impacts to below significance thresholds per SCAQMD Rule 403.",
    source: "CEQA Guidelines Appendix G",
    tags: ["CEQA", "air quality", "thresholds", "mitigation"],
    createdAt: "2024-01-12",
    updatedAt: "2024-03-20",
  },
  {
    id: "ctx-003",
    type: "number",
    title: "Groundwater Depth — Site Boring B-7",
    content:
      "Groundwater encountered at 18.4 feet below ground surface (bgs) during drilling on March 3, 2024. Seasonal high estimated at 14.2 ft bgs based on historical records.",
    source: "Geotechnical Report, March 2024",
    tags: ["groundwater", "boring", "depth", "seasonal"],
    createdAt: "2024-03-03",
    updatedAt: "2024-03-03",
  },
  {
    id: "ctx-004",
    type: "number",
    title: "Total Impervious Surface Area — Post-Development",
    content:
      "Post-development impervious surface: 3.42 acres (148,975 sq ft). Pre-development: 0.87 acres. Net increase: 2.55 acres triggering Tier 2 stormwater management requirements.",
    source: "Site Plan Rev. 4, February 2024",
    tags: ["impervious", "stormwater", "acreage", "tier-2"],
    createdAt: "2024-02-14",
    updatedAt: "2024-02-28",
  },
  {
    id: "ctx-005",
    type: "contact",
    title: "Sarah Chen — Regional Water Quality Control Board",
    content:
      "Lead permit analyst for Region 4. Primary contact for NPDES permit questions and pre-application meetings. Prefers email for initial inquiries. Response time typically 5–7 business days.",
    source: "Agency Directory 2024",
    tags: ["RWQCB", "Region 4", "NPDES", "analyst"],
    createdAt: "2024-01-08",
    updatedAt: "2024-04-01",
  },
  {
    id: "ctx-006",
    type: "contact",
    title: "Marcus Webb — County Planning Department",
    content:
      "Senior planner handling environmental review for commercial and industrial projects. Direct line: (213) 555-0147. Office hours: Mon–Thu 8am–4pm. Requires 48-hour notice for site visits.",
    source: "County Planning Dept. Staff Directory",
    tags: ["planning", "county", "CEQA", "senior planner"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "ctx-007",
    type: "study",
    title: "Phase II Environmental Site Assessment — Parcel APN 4312-018",
    content:
      "Confirmed TPH-d contamination in soil samples S-3 and S-7 at concentrations of 1,240 mg/kg and 890 mg/kg respectively. Remediation action plan required prior to grading permit issuance.",
    source: "EnviroTech Associates, Report No. ET-2024-0312",
    tags: ["Phase II", "ESA", "TPH", "contamination", "remediation"],
    createdAt: "2024-03-12",
    updatedAt: "2024-03-12",
  },
  {
    id: "ctx-008",
    type: "study",
    title: "Biological Resources Survey — Vernal Pool Assessment",
    content:
      "Two potential vernal pool features identified in the northwest corner of the project site. Fairy shrimp survey required during wet season (Nov–Mar). No listed plant species observed during October survey.",
    source: "EcoSurveys Inc., October 2023",
    tags: ["biology", "vernal pool", "fairy shrimp", "wetlands", "survey"],
    createdAt: "2023-10-28",
    updatedAt: "2024-01-05",
  },
  {
    id: "ctx-009",
    type: "plan",
    title: "Stormwater Pollution Prevention Plan (SWPPP) — Rev. 3",
    content:
      "Approved SWPPP covering 4.1-acre disturbance area. BMPs include fiber rolls, silt fencing, stabilized construction entrance, and concrete washout area. Annual inspection required by QSD.",
    source: "Internal — Project File SW-2024-003",
    tags: ["SWPPP", "BMP", "stormwater", "construction", "QSD"],
    createdAt: "2024-02-01",
    updatedAt: "2024-04-10",
  },
  {
    id: "ctx-010",
    type: "plan",
    title: "Hazardous Materials Business Plan (HMBP) — 2024 Update",
    content:
      "Facility handles diesel fuel (>55 gallons), hydraulic oil, and solvents. Emergency response coordinator: James Ortega. Plan submitted to CERS on January 31, 2024. Next renewal: January 2025.",
    source: "CERS Submission ID: 2024-HMBP-00892",
    tags: ["HMBP", "hazmat", "CERS", "emergency response"],
    createdAt: "2024-01-31",
    updatedAt: "2024-01-31",
  },
  {
    id: "ctx-011",
    type: "procedure",
    title: "Pre-Application Meeting Protocol — RWQCB Region 4",
    content:
      "Submit pre-application package 30 days before requested meeting date. Package must include: project description, site map, preliminary discharge characterization, and list of proposed BMPs. Meeting notes become part of the administrative record.",
    source: "RWQCB Region 4 Applicant Guide, 2023",
    tags: ["pre-application", "RWQCB", "procedure", "meeting"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "ctx-012",
    type: "procedure",
    title: "Document Certification and Wet Signature Requirements",
    content:
      "All permit applications require original wet signatures from the Responsible Official (RO). Electronic signatures accepted for supplemental materials only. RO must be a principal executive officer or authorized representative per 40 CFR 122.22.",
    source: "EPA Permit Application Guidance, 2022",
    tags: ["signature", "certification", "RO", "wet signature"],
    createdAt: "2024-01-18",
    updatedAt: "2024-02-05",
  },
  {
    id: "ctx-013",
    type: "section",
    title: "Section 3.2 — Project Description and Purpose",
    content:
      "The proposed project involves construction of a 48,000 sq ft light industrial facility on a 6.2-acre site. The project includes associated parking, landscaping, and utility infrastructure. The purpose is to provide manufacturing space for precision components.",
    source: "Draft EIR, Chapter 3",
    tags: ["project description", "EIR", "industrial", "section"],
    createdAt: "2024-02-20",
    updatedAt: "2024-04-05",
  },
  {
    id: "ctx-014",
    type: "section",
    title: "Section 5.4 — Cumulative Impacts Analysis",
    content:
      "Cumulative analysis considers 14 related projects within a 1-mile radius. Combined impervious surface increase of 12.3 acres. Cumulative air quality impacts remain below significance thresholds when project mitigation measures are applied.",
    source: "Draft EIR, Chapter 5",
    tags: ["cumulative", "EIR", "impacts", "analysis"],
    createdAt: "2024-03-01",
    updatedAt: "2024-04-08",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  ContextType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    description: string;
  }
> = {
  guidance: {
    label: "Guidance",
    icon: BookOpen,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "Regulatory guidance documents and requirements",
  },
  number: {
    label: "Key Numbers",
    icon: Hash,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "Critical measurements, thresholds, and quantities",
  },
  contact: {
    label: "Contacts",
    icon: Users,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    description: "Agency contacts and key personnel",
  },
  study: {
    label: "Studies",
    icon: FlaskConical,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "Technical studies and assessment reports",
  },
  plan: {
    label: "Plans",
    icon: Map,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    description: "Management plans and compliance documents",
  },
  procedure: {
    label: "Procedures",
    icon: ClipboardList,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    description: "Filing procedures and process requirements",
  },
  section: {
    label: "Sections",
    icon: Layers,
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
    description: "Document sections and narrative content",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return `ctx-${Math.floor(Math.random() * 90000) + 10000}`;
}

function formatDate(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const month = months[parseInt(parts[1] ?? "1", 10) - 1] ?? "";
  return `${month} ${parseInt(parts[2] ?? "1", 10)}, ${parts[0]}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function TypeBadge({ type }: { type: ContextType }) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
      <Tag className="h-2.5 w-2.5" />
      {tag}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  item: ContextItem | null;
  mode: "create" | "edit" | "view";
  onClose: () => void;
  onSave: (item: ContextItem) => void;
}

function ContextModal({ item, mode, onClose, onSave }: ModalProps) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [form, setForm] = useState<ContextItem>(
    item ?? {
      id: "",
      type: "guidance",
      title: "",
      content: "",
      source: "",
      tags: [],
      createdAt: "2024-04-15",
      updatedAt: "2024-04-15",
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [copied, setCopied] = useState(false);

  function handleField<K extends keyof ContextItem>(key: K, value: ContextItem[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave({
      ...form,
      id: isCreate ? generateId() : form.id,
      updatedAt: "2024-04-15",
      createdAt: isCreate ? "2024-04-15" : form.createdAt,
    });
  }

  function copyAsBriefing() {
    const text = `# ${form.title}\n\n${form.content}${form.source ? `\n\nSource: ${form.source}` : ""}${form.tags.length ? `\n\nTags: ${form.tags.join(", ")}` : ""}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${TYPE_CONFIG[form.type].bg}`}
              >
                {(() => {
                  const Icon = TYPE_CONFIG[form.type].icon;
                  return (
                    <Icon
                      className={`h-4 w-4 ${TYPE_CONFIG[form.type].color}`}
                    />
                  );
                })()}
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                {isCreate
                  ? "Add Context Item"
                  : isView
                  ? "Context Item"
                  : "Edit Context Item"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {isView && (
                <button
                  onClick={copyAsBriefing}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy as Briefing"}
                </button>
              )}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
            {/* Type selector */}
            {!isView && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TYPES.map((t) => {
                    const cfg = TYPE_CONFIG[t];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={t}
                        onClick={() => handleField("type", t)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          form.type === t
                            ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Title
              </label>
              {isView ? (
                <p className="text-sm font-semibold text-slate-900">
                  {form.title}
                </p>
              ) : (
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleField("title", e.target.value)}
                  placeholder="Descriptive title for this context item"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              )}
            </div>

            {/* Content */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Content
              </label>
              {isView ? (
                <p className="text-sm leading-relaxed text-slate-700">
                  {form.content}
                </p>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => handleField("content", e.target.value)}
                  placeholder="Detailed content, notes, or extracted information..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              )}
            </div>

            {/* Source */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Source
              </label>
              {isView ? (
                form.source ? (
                  <div className="flex items-center gap-1.5 text-sm text-blue-600">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {form.source}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No source specified</p>
                )
              ) : (
                <input
                  type="text"
                  value={form.source ?? ""}
                  onChange={(e) => handleField("source", e.target.value)}
                  placeholder="Document name, URL, or reference"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(form.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                    {!isView && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </span>
                ))}
                {!isView && (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-600 outline-none focus:border-blue-400 w-24"
                    />
                    <button
                      onClick={addTag}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            {isView && (
              <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                <span>Created {formatDate(form.createdAt)}</span>
                <span>Updated {formatDate(form.updatedAt)}</span>
                <TypeBadge type={form.type} />
              </div>
            )}
          </div>

          {/* Footer */}
          {!isView && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreate ? "Add Item" : "Save Changes"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({
  item,
  onConfirm,
  onCancel,
}: {
  item: ContextItem;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
          <AlertCircle className="h-5 w-5 text-rose-600" />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900">
          Archive this item?
        </h3>
        <p className="mb-5 text-sm text-slate-500">
          "{item.title}" will be archived. Nothing is permanently deleted in FilingDesk.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            Archive
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Context Card ─────────────────────────────────────────────────────────────

function ContextCard({
  item,
  onView,
  onEdit,
  onDelete,
  onCopy,
}: {
  item: ContextItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2 }}
      className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.10)]"
    >
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_CONFIG[item.type].bg}`}
          >
            {(() => {
              const Icon = TYPE_CONFIG[item.type].icon;
              return (
                <Icon
                  className={`h-4 w-4 ${TYPE_CONFIG[item.type].color}`}
                />
              );
            })()}
          </div>
          <div className="min-w-0">
            <button
              onClick={onView}
              className="text-left text-sm font-semibold text-slate-900 leading-snug hover:text-blue-600 transition-colors line-clamp-2"
            >
              {item.title}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleCopy}
            title="Copy as Briefing"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={onEdit}
            title="Edit"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Archive"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <p className="mb-3 text-xs leading-relaxed text-slate-500 line-clamp-3">
        {item.content}
      </p>

      {/* Source */}
      {item.source && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
          <FileText className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{item.source}</span>
        </div>
      )}

      {/* Tags */}
      {(item.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {(item.tags ?? []).slice(0, 4).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {(item.tags ?? []).length > 4 && (
            <span className="text-xs text-slate-400">
              +{(item.tags ?? []).length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <TypeBadge type={item.type} />
        <span className="text-xs text-slate-400">
          {formatDate(item.updatedAt)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ items }: { items: ContextItem[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {ALL_TYPES.map((type) => {
        const count = items.filter((i) => i.type === type).length;
        const cfg = TYPE_CONFIG[type];
        const Icon = cfg.icon;
        return (
          <div
            key={type}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${cfg.bg} ${cfg.border}`}
          >
            <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
            <span className={`text-xs font-semibold ${cfg.color}`}>
              {count}
            </span>
            <span className="text-xs text-slate-500">{cfg.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContextManagerPage() {
  const [items, setItems] = useState<ContextItem[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<ContextType | "all">("all");
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit" | "view";
    item: ContextItem | null;
  }>({ open: false, mode: "create", item: null });
  const [deleteTarget, setDeleteTarget] = useState<ContextItem | null>(null);
  const [sortBy, setSortBy] = useState<"updated" | "title" | "type">("updated");
  const [briefingCopied, setBriefingCopied] = useState(false);

  const filtered = useMemo(() => {
    let result = [...items];
    if (activeType !== "all") {
      result = result.filter((i) => i.type === activeType);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.content.toLowerCase().includes(q) ||
          (i.source ?? "").toLowerCase().includes(q) ||
          (i.tags ?? []).some((t) => t.includes(q))
      );
    }
    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    return result;
  }, [items, activeType, search, sortBy]);

  function openCreate() {
    setModal({ open: true, mode: "create", item: null });
  }

  function openEdit(item: ContextItem) {
    setModal({ open: true, mode: "edit", item });
  }

  function openView(item: ContextItem) {
    setModal({ open: true, mode: "view", item });
  }

  function closeModal() {
    setModal({ open: false, mode: "create", item: null });
  }

  function handleSave(saved: ContextItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === saved.id);
      if (exists) {
        return prev.map((i) => (i.id === saved.id ? saved : i));
      }
      return [saved, ...prev];
    });
    closeModal();
  }

  function handleDelete(item: ContextItem) {
    setDeleteTarget(item);
  }

  function confirmDelete() {
    if (deleteTarget) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  function handleCopy(item: ContextItem) {
    const text = `# ${item.title}\n\n${item.content}${item.source ? `\n\nSource: ${item.source}` : ""}${(item.tags ?? []).length ? `\n\nTags: ${(item.tags ?? []).join(", ")}` : ""}`;
    navigator.clipboard.writeText(text);
  }

  function copyAllAsBriefing() {
    const text = filtered
      .map(
        (item) =>
          `## ${item.title}\n${item.content}${item.source ? `\nSource: ${item.source}` : ""}`
      )
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setBriefingCopied(true);
      setTimeout(() => setBriefingCopied(false), 2500);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Riverside Industrial Park EIR</span>
                <span>/</span>
                <span className="font-medium text-slate-700">
                  Context Manager
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Context Manager
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage guidance, key numbers, contacts, studies, plans, procedures, and document sections for this project.
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={copyAllAsBriefing}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                {briefingCopied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {briefingCopied ? "Copied!" : "Copy All as Briefing"}
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <StatsBar items={items} />
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search context items..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort by</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "updated" | "title" | "type")
                }
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="updated">Last Updated</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </motion.div>

        {/* Type Filter Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6 flex flex-wrap gap-2"
        >
          <button
            onClick={() => setActiveType("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeType === "all"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            All ({items.length})
          </button>
          {ALL_TYPES.map((type) => {
            const cfg = TYPE_CONFIG[type];
            const Icon = cfg.icon;
            const count = items.filter((i) => i.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeType === type
                    ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-700">
              No items found
            </h3>
            <p className="mb-5 text-sm text-slate-400">
              {search
                ? `No context items match "${search}"`
                : "No items in this category yet"}
            </p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add First Item
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item) => (
              <ContextCard
                key={item.id}
                item={item}
                onView={() => openView(item)}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item)}
                onCopy={() => handleCopy(item)}
              />
            ))}
          </motion.div>
        )}

        {/* Result count */}
        {filtered.length > 0 && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Showing {filtered.length} of {items.length} context items
          </p>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal.open && (
          <ContextModal
            key="context-modal"
            item={modal.item}
            mode={modal.mode}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            key="delete-confirm"
            item={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}