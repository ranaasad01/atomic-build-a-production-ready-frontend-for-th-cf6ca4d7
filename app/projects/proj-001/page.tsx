"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import {
  QUALITY_BANDS,
  FILING_STAGES,
  getBandForScore,
  type FilingStage,
  type QualityBand,
} from "@/lib/data";
import { FileText, AlertCircle, CheckCircle, Clock, Search, Filter, Plus, ChevronRight, ChevronDown, MoreHorizontal, Zap, Shield, Activity, ArrowRight, Eye, Edit, Trash2, Download, Upload, Star, AlertTriangle, Check, X, Sparkles, Layout, FileCode, GitBranch, Circle, Square, ArrowUp, ArrowDown, Bell, Settings, User, Calendar, Folder, FolderOpen, Info } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT = {
  id: "proj-001",
  name: "Coastal Wetlands Impact Assessment",
  agency: "EPA Region 9",
  documentCount: 12,
  deadline: "2024-03-15",
  status: "In Review" as const,
  readinessScore: 87,
  currentStage: "Cross-check" as FilingStage,
  description:
    "Comprehensive environmental impact assessment for the proposed coastal development project in San Diego County. Covers wetlands delineation, species surveys, and mitigation planning.",
  location: "San Diego County, CA",
  createdAt: "2024-01-08",
  updatedAt: "2024-02-14",
  permitNumber: "EPA-R9-2024-0042",
  projectManager: "Dr. Sarah Chen",
  clientName: "Pacific Coast Development LLC",
};

const DOCUMENTS = [
  {
    id: "doc-001",
    title: "Wetlands Delineation Report",
    type: "Technical Report",
    readinessScore: 91,
    targetBand: "Filing" as QualityBand,
    status: "In Review" as const,
    unsourcedClaims: 2,
    wordCount: 8420,
    lastModified: "2024-02-14",
    author: "Dr. Sarah Chen",
    version: 3,
  },
  {
    id: "doc-002",
    title: "Species Survey Summary",
    type: "Survey Report",
    readinessScore: 86,
    targetBand: "Working" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 7,
    wordCount: 5130,
    lastModified: "2024-02-12",
    author: "James Okafor",
    version: 2,
  },
  {
    id: "doc-003",
    title: "Mitigation Plan",
    type: "Planning Document",
    readinessScore: 83,
    targetBand: "Filing" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 11,
    wordCount: 3870,
    lastModified: "2024-02-10",
    author: "Maria Vasquez",
    version: 1,
  },
  {
    id: "doc-004",
    title: "Water Quality Analysis",
    type: "Technical Report",
    readinessScore: 95,
    targetBand: "Regulator" as QualityBand,
    status: "Approved" as const,
    unsourcedClaims: 0,
    wordCount: 6240,
    lastModified: "2024-02-08",
    author: "Dr. Sarah Chen",
    version: 4,
  },
  {
    id: "doc-005",
    title: "Air Quality Impact Study",
    type: "Impact Study",
    readinessScore: 88,
    targetBand: "Filing" as QualityBand,
    status: "In Review" as const,
    unsourcedClaims: 3,
    wordCount: 4560,
    lastModified: "2024-02-13",
    author: "Tom Nguyen",
    version: 2,
  },
  {
    id: "doc-006",
    title: "Cultural Resources Assessment",
    type: "Assessment",
    readinessScore: 79,
    targetBand: "Working" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 14,
    wordCount: 2980,
    lastModified: "2024-02-09",
    author: "Lisa Park",
    version: 1,
  },
  {
    id: "doc-007",
    title: "Noise Impact Analysis",
    type: "Impact Study",
    readinessScore: 90,
    targetBand: "Filing" as QualityBand,
    status: "Approved" as const,
    unsourcedClaims: 1,
    wordCount: 3210,
    lastModified: "2024-02-07",
    author: "James Okafor",
    version: 3,
  },
  {
    id: "doc-008",
    title: "Traffic Study",
    type: "Technical Report",
    readinessScore: 84,
    targetBand: "Working" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 5,
    wordCount: 4100,
    lastModified: "2024-02-11",
    author: "Maria Vasquez",
    version: 2,
  },
];

const ATTENTION_ITEMS = [
  {
    id: "a1",
    severity: "high" as const,
    message: "Mitigation Plan has 11 unsourced claims",
    doc: "Mitigation Plan",
    docId: "doc-003",
    action: "Anchor Sources",
  },
  {
    id: "a2",
    severity: "high" as const,
    message: "Cultural Resources Assessment below Research band",
    doc: "Cultural Resources Assessment",
    docId: "doc-006",
    action: "Improve Quality",
  },
  {
    id: "a3",
    severity: "medium" as const,
    message: "Species Survey has 7 unsourced claims",
    doc: "Species Survey Summary",
    docId: "doc-002",
    action: "Anchor Sources",
  },
  {
    id: "a4",
    severity: "medium" as const,
    message: "Deadline in 29 days — 4 docs below Filing band",
    doc: null,
    docId: null,
    action: "Review All",
  },
  {
    id: "a5",
    severity: "low" as const,
    message: "Air Quality Impact Study pending final review",
    doc: "Air Quality Impact Study",
    docId: "doc-005",
    action: "Review",
  },
];

const CONTEXT_ITEMS = {
  guidance: [
    { id: "g1", title: "EPA Wetlands Delineation Manual (2010)", source: "EPA" },
    { id: "g2", title: "CEQA Guidelines Section 15380", source: "State" },
    { id: "g3", title: "Section 404 Permit Requirements", source: "USACE" },
  ],
  numbers: [
    { id: "n1", title: "Wetland Area", value: "4.7 acres" },
    { id: "n2", title: "Buffer Zone", value: "100 ft" },
    { id: "n3", title: "Species Count", value: "23 identified" },
  ],
  contacts: [
    { id: "c1", name: "EPA Region 9 Contact", role: "Permit Coordinator", email: "r9permits@epa.gov" },
    { id: "c2", name: "USACE LA District", role: "Section 404 Lead", email: "usace.la@army.mil" },
  ],
};

const STAGE_PROGRESS = [
  { stage: "Capture" as FilingStage, complete: true, pct: 100 },
  { stage: "Review" as FilingStage, complete: true, pct: 100 },
  { stage: "Anchor Sources" as FilingStage, complete: false, pct: 65 },
  { stage: "Cross-check" as FilingStage, complete: false, pct: 40 },
  { stage: "Improve Quality" as FilingStage, complete: false, pct: 20 },
  { stage: "Assemble Package" as FilingStage, complete: false, pct: 0 },
  { stage: "File & Track" as FilingStage, complete: false, pct: 0 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function ReadinessRing({
  score,
  size = 48,
  strokeWidth = 4,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const band = getBandForScore(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max((score - 75) / 25, 0), 1);
  const offset = circumference * (1 - pct);

  const strokeColor =
    score >= 95
      ? "#10b981"
      : score >= 90
      ? "#6366f1"
      : score >= 85
      ? "#3b82f6"
      : score >= 82
      ? "#f59e0b"
      : "#94a3b8";

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
      />
    </svg>
  );
}

function BandChip({ band }: { band: QualityBandConfig }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
        band.bgColor,
        band.color,
        band.borderColor
      )}
    >
      {band.label}
    </span>
  );
}

type QualityBandConfig = ReturnType<typeof getBandForScore>;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    "In Review": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Filed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
        map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      )}
    >
      {status}
    </span>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar() {
  const overallScore = PROJECT.readinessScore;
  const band = getBandForScore(overallScore);

  return (
    <motion.aside
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto"
    >
      {/* Readiness Gauge */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Overall Readiness
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <ReadinessRing score={overallScore} size={80} strokeWidth={6} />
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900">{overallScore}</span>
            </div>
          </div>
          <BandChip band={band} />
          <p className="text-center text-xs text-slate-500">{band.description}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-xs text-slate-500">Docs Ready</p>
            <p className="text-sm font-semibold text-slate-900">
              {DOCUMENTS.filter((d) => d.readinessScore >= 90).length}/{DOCUMENTS.length}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-xs text-slate-500">Unsourced</p>
            <p className="text-sm font-semibold text-slate-900">
              {DOCUMENTS.reduce((s, d) => s + d.unsourcedClaims, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* What Needs Attention */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Needs Attention
        </p>
        <div className="flex flex-col gap-2">
          {ATTENTION_ITEMS.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border p-2.5 text-xs",
                item.severity === "high"
                  ? "border-red-100 bg-red-50"
                  : item.severity === "medium"
                  ? "border-amber-100 bg-amber-50"
                  : "border-slate-100 bg-slate-50"
              )}
            >
              <div className="flex items-start gap-1.5">
                {item.severity === "high" ? (
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                ) : item.severity === "medium" ? (
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                ) : (
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                )}
                <p
                  className={cn(
                    "leading-snug",
                    item.severity === "high"
                      ? "text-red-700"
                      : item.severity === "medium"
                      ? "text-amber-700"
                      : "text-slate-600"
                  )}
                >
                  {item.message}
                </p>
              </div>
              {item.docId && (
                <Link
                  href={`/projects/proj-001/documents/${item.docId}`}
                  className="mt-1.5 flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filing Stage Progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Filing Progress
        </p>
        <div className="flex flex-col gap-2">
          {STAGE_PROGRESS.map((sp, i) => (
            <div key={sp.stage} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {sp.complete ? (
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                  ) : sp.pct > 0 ? (
                    <Circle className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Circle className="h-3 w-3 text-slate-300" />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      sp.stage === PROJECT.currentStage
                        ? "font-semibold text-blue-700"
                        : sp.complete
                        ? "text-slate-500"
                        : "text-slate-400"
                    )}
                  >
                    {sp.stage}
                  </span>
                </div>
                {sp.pct > 0 && (
                  <span className="text-xs text-slate-400">{sp.pct}%</span>
                )}
              </div>
              {sp.pct > 0 && !sp.complete && (
                <div className="ml-4 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${sp.pct}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function RightSidebar() {
  const [activeTab, setActiveTab] = useState<"guidance" | "numbers" | "contacts">("guidance");

  return (
    <motion.aside
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto"
    >
      {/* Project Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Project Context
        </p>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Agency</span>
            <span className="font-medium text-slate-800">{PROJECT.agency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Permit #</span>
            <span className="font-medium text-slate-800">{PROJECT.permitNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Location</span>
            <span className="font-medium text-slate-800">{PROJECT.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Deadline</span>
            <span className="font-medium text-red-600">{PROJECT.deadline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Manager</span>
            <span className="font-medium text-slate-800">{PROJECT.projectManager}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client</span>
            <span className="font-medium text-slate-800 text-right max-w-[120px] truncate">{PROJECT.clientName}</span>
          </div>
        </div>
        <Link
          href="/projects/proj-001/context"
          className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
        >
          <span>Manage Context</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Context Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex border-b border-slate-100">
          {(["guidance", "numbers", "contacts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-xs font-medium capitalize transition-colors",
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-3">
          {activeTab === "guidance" && (
            <div className="flex flex-col gap-2">
              {CONTEXT_ITEMS.guidance.map((g) => (
                <div key={g.id} className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs font-medium text-slate-700 leading-snug">{g.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{g.source}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "numbers" && (
            <div className="flex flex-col gap-2">
              {CONTEXT_ITEMS.numbers.map((n) => (
                <div key={n.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                  <span className="text-xs text-slate-600">{n.title}</span>
                  <span className="text-xs font-semibold text-slate-900">{n.value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "contacts" && (
            <div className="flex flex-col gap-2">
              {CONTEXT_ITEMS.contacts.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs font-medium text-slate-700">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.role}</p>
                  <p className="mt-0.5 text-xs text-blue-600">{c.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Quick Actions
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/projects/proj-001/filing"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
          >
            <Upload className="h-3.5 w-3.5" />
            Assemble Filing Package
          </Link>
          <Link
            href="/projects/proj-001/audit"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Activity className="h-3.5 w-3.5" />
            View Audit Trail
          </Link>
          <button className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" />
            Export Package
          </button>
          <button className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <Sparkles className="h-3.5 w-3.5" />
            AI Cross-check All
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  selected,
  onSelect,
}: {
  doc: (typeof DOCUMENTS)[0];
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const band = getBandForScore(doc.readinessScore);
  const targetBandConfig = QUALITY_BANDS.find((b) => b.label === doc.targetBand) ?? band;
  const atTarget = doc.readinessScore >= targetBandConfig.min;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -1, boxShadow: "0 4px 20px -4px rgba(0,0,0,0.12)" }}
      className={cn(
        "group relative rounded-xl border bg-white p-4 transition-all duration-200",
        selected
          ? "border-blue-300 ring-1 ring-blue-200"
          : "border-slate-200 hover:border-slate-300",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)]"
      )}
    >
      {/* Checkbox */}
      <div className="absolute left-3 top-3">
        <button
          onClick={() => onSelect(doc.id)}
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            selected
              ? "border-blue-500 bg-blue-500"
              : "border-slate-300 bg-white opacity-0 group-hover:opacity-100"
          )}
        >
          {selected && <Check className="h-2.5 w-2.5 text-white" />}
        </button>
      </div>

      <div className="flex items-start gap-3 pl-5">
        {/* Readiness Ring */}
        <div className="relative flex shrink-0 items-center justify-center">
          <ReadinessRing score={doc.readinessScore} size={44} strokeWidth={3.5} />
          <div className="absolute flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-800">{doc.readinessScore}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/projects/proj-001/documents/${doc.id}`}
                className="block truncate text-sm font-semibold text-slate-900 hover:text-blue-700"
              >
                {doc.title}
              </Link>
              <p className="mt-0.5 text-xs text-slate-500">{doc.type}</p>
            </div>
            <button className="shrink-0 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <BandChip band={band} />
            <StatusBadge status={doc.status} />
            {doc.unsourcedClaims > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                <AlertCircle className="h-2.5 w-2.5" />
                {doc.unsourcedClaims} unsourced
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>{(doc.wordCount ?? 0).toLocaleString()} words</span>
              <span>v{doc.version}</span>
              <span>{doc.author}</span>
            </div>
            <span>{doc.lastModified}</span>
          </div>

          {/* Target band progress */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Target: <span className={targetBandConfig.color}>{doc.targetBand}</span>
              </span>
              {atTarget ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="h-3 w-3" />
                  At target
                </span>
              ) : (
                <span className="text-slate-400">
                  {targetBandConfig.min - doc.readinessScore} pts needed
                </span>
              )}
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  atTarget ? "bg-emerald-500" : "bg-blue-500"
                )}
                style={{
                  width: `${Math.min(
                    ((doc.readinessScore - 75) / (targetBandConfig.max - 75)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectWorkspacePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("readiness");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [crossCheckRunning, setCrossCheckRunning] = useState(false);
  const [crossCheckDone, setCrossCheckDone] = useState(false);

  const statusOptions = ["All", "Draft", "In Review", "Approved", "Filed"];

  const filteredDocs = useMemo(() => {
    let docs = [...DOCUMENTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      docs = docs.filter((d) => d.status === statusFilter);
    }
    if (sortBy === "readiness") {
      docs.sort((a, b) => b.readinessScore - a.readinessScore);
    } else if (sortBy === "modified") {
      docs.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    } else if (sortBy === "title") {
      docs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "unsourced") {
      docs.sort((a, b) => b.unsourcedClaims - a.unsourcedClaims);
    }
    return docs;
  }, [search, statusFilter, sortBy]);

  function toggleDoc(id: string) {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (selectedDocs.length === filteredDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocs.map((d) => d.id));
    }
  }

  function runCrossCheck() {
    setCrossCheckRunning(true);
    setCrossCheckDone(false);
    setTimeout(() => {
      setCrossCheckRunning(false);
      setCrossCheckDone(true);
    }, 2200);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-700">
                Dashboard
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-slate-900">{PROJECT.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                {PROJECT.status}
              </span>
              <span className="text-xs text-slate-400">
                Stage: <span className="font-medium text-slate-700">{PROJECT.currentStage}</span>
              </span>
              <Link
                href="/projects/proj-001/filing"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                <Upload className="h-3.5 w-3.5" />
                Assemble Package
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-2"
          >
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {PROJECT.name}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">{PROJECT.description}</p>
          </motion.div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-5">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>

          {/* Center — Document List */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mb-4 flex flex-col gap-3"
            >
              {/* Top row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="readiness">Sort: Readiness</option>
                  <option value="modified">Sort: Modified</option>
                  <option value="title">Sort: Title</option>
                  <option value="unsourced">Sort: Unsourced</option>
                </select>
              </div>

              {/* Action toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAll}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <Square className="h-3 w-3" />
                    {selectedDocs.length === filteredDocs.length && filteredDocs.length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  {selectedDocs.length > 0 && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="text-xs text-slate-500">
                          {selectedDocs.length} selected
                        </span>
                        <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
                          Bulk Review
                        </button>
                        <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50">
                          Export
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={runCrossCheck}
                    disabled={crossCheckRunning}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-sm transition-all",
                      crossCheckRunning
                        ? "border border-blue-200 bg-blue-50 text-blue-600"
                        : crossCheckDone
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {crossCheckRunning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </motion.div>
                        Running...
                      </>
                    ) : crossCheckDone ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Cross-check Done
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" />
                        AI Cross-check
                      </>
                    )}
                  </button>
                  <Link
                    href="/projects/proj-001/filing"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Filing Readiness
                  </Link>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Document
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Cross-check result banner */}
            <AnimatePresence>
              {crossCheckDone && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                      AI Cross-check complete. Found 3 consistency issues across 2 documents.
                    </p>
                  </div>
                  <button
                    onClick={() => setCrossCheckDone(false)}
                    className="text-emerald-500 hover:text-emerald-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Document Grid */}
            {filteredDocs.length === 0 ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"
              >
                <FileText className="mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No documents found</p>
                <p className="mt-1 text-xs text-slate-400">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {filteredDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    selected={selectedDocs.includes(doc.id)}
                    onSelect={toggleDoc}
                  />
                ))}
              </motion.div>
            )}

            {/* Summary bar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm"
            >
              <span>
                {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""} shown
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Avg readiness:{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredDocs.length > 0
                      ? Math.round(
                          filteredDocs.reduce((s, d) => s + d.readinessScore, 0) /
                            filteredDocs.length
                        )
                      : 0}
                  </span>
                </span>
                <span>
                  Total unsourced:{" "}
                  <span className="font-semibold text-red-600">
                    {filteredDocs.reduce((s, d) => s + d.unsourcedClaims, 0)}
                  </span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Add Document</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Document Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Biological Assessment"
                    defaultValue=""
                    onChange={() => {}}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Document Type
                  </label>
                  <select
                    defaultValue="Technical Report"
                    onChange={() => {}}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Technical Report</option>
                    <option>Survey Report</option>
                    <option>Impact Study</option>
                    <option>Planning Document</option>
                    <option>Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Target Quality Band
                  </label>
                  <select
                    defaultValue="Filing"
                    onChange={() => {}}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {QUALITY_BANDS.map((b) => (
                      <option key={b.label} value={b.label}>
                        {b.label} ({b.min}–{b.max})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Upload File (optional)
                  </label>
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 py-6">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Upload className="h-5 w-5 text-slate-400" />
                      <p className="text-xs text-slate-500">
                        Drag and drop or{" "}
                        <span className="text-blue-600">browse files</span>
                      </p>
                      <p className="text-xs text-slate-400">PDF, DOCX up to 50MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Add Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}