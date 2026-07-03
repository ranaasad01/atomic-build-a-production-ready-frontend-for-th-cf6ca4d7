"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  getBandForScore,
  FILING_STAGES,
  type FilingStage,
  type QualityBand,
} from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { FileText, AlertTriangle, CheckCircle, Clock, Plus, GitCompare, Zap, Package, MoreHorizontal, Search, Filter, ChevronDown, ChevronRight, BookOpen, Hash, Users, FlaskConical, Map, ClipboardList, Layers, X, Check, ArrowUpRight, RefreshCw, Trash2, Download, Eye, Edit3, AlertCircle, Star, TrendingUp, Calendar, User } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MockDocument {
  id: string;
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

interface AttentionItem {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
  docTitle: string;
  action: string;
}

interface ContextGuidance {
  id: string;
  title: string;
  source: string;
  summary: string;
}

interface ContextNumber {
  id: string;
  label: string;
  value: string;
  unit: string;
  source: string;
}

interface ContextContact {
  id: string;
  name: string;
  role: string;
  agency: string;
  email: string;
}

interface ContextStudy {
  id: string;
  title: string;
  year: string;
  author: string;
  relevance: string;
}

interface ContextPlan {
  id: string;
  title: string;
  version: string;
  status: string;
}

interface ContextProcedure {
  id: string;
  title: string;
  code: string;
  description: string;
}

interface ContextSection {
  id: string;
  title: string;
  regulation: string;
  requirement: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROJECT = {
  id: "proj-001",
  name: "Riverside Industrial Expansion EIS",
  agency: "EPA Region 9",
  deadline: "2024-09-15",
  status: "Active",
  readinessScore: 87,
  currentStage: "Cross-check" as FilingStage,
  location: "Sacramento, CA",
  description:
    "Environmental Impact Statement for the proposed industrial expansion along the Sacramento River corridor.",
};

const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "doc-001",
    title: "Air Quality Impact Assessment",
    type: "Assessment",
    readinessScore: 91,
    targetBand: "Filing",
    status: "In Review",
    unsourcedClaims: 3,
    wordCount: 8420,
    lastModified: "2024-07-12",
    author: "Dr. Sarah Chen",
    version: 4,
  },
  {
    id: "doc-002",
    title: "Wetlands Delineation Report",
    type: "Report",
    readinessScore: 86,
    targetBand: "Working",
    status: "Draft",
    unsourcedClaims: 11,
    wordCount: 5130,
    lastModified: "2024-07-10",
    author: "Marcus Webb",
    version: 2,
  },
  {
    id: "doc-003",
    title: "Noise & Vibration Study",
    type: "Study",
    readinessScore: 95,
    targetBand: "Regulator",
    status: "Approved",
    unsourcedClaims: 0,
    wordCount: 6780,
    lastModified: "2024-07-08",
    author: "Dr. Sarah Chen",
    version: 6,
  },
  {
    id: "doc-004",
    title: "Biological Resources Survey",
    type: "Survey",
    readinessScore: 83,
    targetBand: "Working",
    status: "Draft",
    unsourcedClaims: 18,
    wordCount: 9200,
    lastModified: "2024-07-11",
    author: "Priya Nair",
    version: 1,
  },
  {
    id: "doc-005",
    title: "Cultural Resources Assessment",
    type: "Assessment",
    readinessScore: 90,
    targetBand: "Filing",
    status: "In Review",
    unsourcedClaims: 5,
    wordCount: 4350,
    lastModified: "2024-07-09",
    author: "James Okafor",
    version: 3,
  },
  {
    id: "doc-006",
    title: "Hydrology & Water Quality Report",
    type: "Report",
    readinessScore: 88,
    targetBand: "Filing",
    status: "In Review",
    unsourcedClaims: 7,
    wordCount: 7640,
    lastModified: "2024-07-13",
    author: "Marcus Webb",
    version: 3,
  },
];

const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "a1",
    severity: "high",
    message: "18 unsourced claims detected",
    docTitle: "Biological Resources Survey",
    action: "Anchor Sources",
  },
  {
    id: "a2",
    severity: "high",
    message: "Score below target band",
    docTitle: "Wetlands Delineation Report",
    action: "Improve Quality",
  },
  {
    id: "a3",
    severity: "medium",
    message: "11 unsourced claims detected",
    docTitle: "Wetlands Delineation Report",
    action: "Anchor Sources",
  },
  {
    id: "a4",
    severity: "medium",
    message: "5 unsourced claims need review",
    docTitle: "Cultural Resources Assessment",
    action: "Review",
  },
  {
    id: "a5",
    severity: "low",
    message: "Version 1 — needs peer review",
    docTitle: "Biological Resources Survey",
    action: "Review",
  },
];

const CONTEXT_GUIDANCE: ContextGuidance[] = [
  {
    id: "g1",
    title: "NEPA Environmental Impact Statement Requirements",
    source: "40 CFR Part 1502",
    summary:
      "Federal requirements for EIS preparation including scope, alternatives analysis, and public comment periods.",
  },
  {
    id: "g2",
    title: "EPA Region 9 Air Quality Guidance",
    source: "EPA-R9-AQ-2023-01",
    summary:
      "Regional guidance for air quality modeling and dispersion analysis in California air basins.",
  },
  {
    id: "g3",
    title: "Section 404 Wetlands Permitting",
    source: "33 USC 1344",
    summary:
      "Army Corps of Engineers requirements for dredge and fill activities in waters of the United States.",
  },
];

const CONTEXT_NUMBERS: ContextNumber[] = [
  {
    id: "n1",
    label: "PM2.5 Annual Standard",
    value: "12",
    unit: "μg/m³",
    source: "NAAQS 2023",
  },
  {
    id: "n2",
    label: "Noise Threshold (Residential)",
    value: "65",
    unit: "dB(A)",
    source: "EPA Noise Guidelines",
  },
  {
    id: "n3",
    label: "Wetland Buffer Zone",
    value: "100",
    unit: "feet",
    source: "State Water Board",
  },
  {
    id: "n4",
    label: "Project Area",
    value: "142.7",
    unit: "acres",
    source: "Site Survey 2024",
  },
];

const CONTEXT_CONTACTS: ContextContact[] = [
  {
    id: "c1",
    name: "Jennifer Marsh",
    role: "Project Lead",
    agency: "EPA Region 9",
    email: "j.marsh@epa.gov",
  },
  {
    id: "c2",
    name: "Robert Tran",
    role: "Wetlands Specialist",
    agency: "Army Corps of Engineers",
    email: "r.tran@usace.army.mil",
  },
  {
    id: "c3",
    name: "Angela Reyes",
    role: "Air Quality Analyst",
    agency: "CARB",
    email: "a.reyes@arb.ca.gov",
  },
];

const CONTEXT_STUDIES: ContextStudy[] = [
  {
    id: "s1",
    title: "Sacramento River Corridor Baseline Study",
    year: "2022",
    author: "UC Davis Environmental Lab",
    relevance: "Baseline ecological conditions",
  },
  {
    id: "s2",
    title: "Industrial Emissions Impact on Urban Air Quality",
    year: "2023",
    author: "CARB Research Division",
    relevance: "Air quality modeling reference",
  },
];

const CONTEXT_PLANS: ContextPlan[] = [
  {
    id: "p1",
    title: "Stormwater Pollution Prevention Plan",
    version: "v2.1",
    status: "Approved",
  },
  {
    id: "p2",
    title: "Spill Prevention Control & Countermeasure Plan",
    version: "v1.4",
    status: "In Review",
  },
  {
    id: "p3",
    title: "Habitat Mitigation & Monitoring Plan",
    version: "v1.0",
    status: "Draft",
  },
];

const CONTEXT_PROCEDURES: ContextProcedure[] = [
  {
    id: "pr1",
    title: "Air Quality Sampling Protocol",
    code: "AQ-SOP-001",
    description: "Standard operating procedure for ambient air quality sampling.",
  },
  {
    id: "pr2",
    title: "Wetland Delineation Method",
    code: "WL-SOP-003",
    description: "Field methodology for wetland boundary determination per Corps manual.",
  },
];

const CONTEXT_SECTIONS: ContextSection[] = [
  {
    id: "sec1",
    title: "Section 3.1 — Air Quality",
    regulation: "CEQA Guidelines §15064.3",
    requirement: "Quantitative analysis of criteria pollutants and GHG emissions.",
  },
  {
    id: "sec2",
    title: "Section 3.4 — Biological Resources",
    regulation: "ESA Section 7",
    requirement: "Formal consultation for listed species and critical habitat.",
  },
  {
    id: "sec3",
    title: "Section 3.7 — Cultural Resources",
    regulation: "NHPA Section 106",
    requirement: "Identification and evaluation of historic properties.",
  },
];

// ─── Utility helpers ──────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function scoreColor(score: number): string {
  if (score >= 95) return "#10b981";
  if (score >= 90) return "#6366f1";
  if (score >= 85) return "#3b82f6";
  if (score >= 82) return "#f59e0b";
  return "#94a3b8";
}

function scoreTrack(score: number): string {
  if (score >= 95) return "#d1fae5";
  if (score >= 90) return "#e0e7ff";
  if (score >= 85) return "#dbeafe";
  if (score >= 82) return "#fef3c7";
  return "#f1f5f9";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessRing({
  score,
  size = 48,
  strokeWidth = 4,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);
  const color = scoreColor(score);
  const track = scoreTrack(score);

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function LargeGauge({ score }: { score: number }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);
  const color = scoreColor(score);
  const track = scoreTrack(score);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
          Ready
        </span>
      </div>
    </div>
  );
}

function BandChip({ score }: { score: number }) {
  const band = getBandForScore(score);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border",
        band.bgColor,
        band.color,
        band.borderColor
      )}
    >
      {band.label}
    </span>
  );
}

function StatusBadge({ status }: { status: MockDocument["status"] }) {
  const map: Record<MockDocument["status"], string> = {
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    "In Review": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Filed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
        map[status]
      )}
    >
      {status}
    </span>
  );
}

function SeverityDot({ severity }: { severity: AttentionItem["severity"] }) {
  const map = {
    high: "bg-red-500",
    medium: "bg-amber-400",
    low: "bg-slate-300",
  };
  return (
    <span
      className={cn("mt-1 h-2 w-2 flex-shrink-0 rounded-full", map[severity])}
    />
  );
}

const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  hover: {
    y: -2,
    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.10)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar({
  selectedStage,
  filterStatus,
  setFilterStatus,
  filterBand,
  setFilterBand,
}: {
  selectedStage: FilingStage;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterBand: string;
  setFilterBand: (v: string) => void;
}) {
  const currentIdx = FILING_STAGES.indexOf(MOCK_PROJECT.currentStage);

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex w-64 flex-shrink-0 flex-col gap-4 overflow-y-auto"
    >
      {/* Readiness Gauge */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Project Readiness
        </p>
        <div className="flex flex-col items-center gap-2">
          <LargeGauge score={MOCK_PROJECT.readinessScore} />
          <BandChip score={MOCK_PROJECT.readinessScore} />
          <p className="text-center text-xs text-slate-500">
            {MOCK_PROJECT.agency}
          </p>
          <div className="mt-1 w-full rounded-lg bg-slate-50 p-2 text-center">
            <p className="text-[10px] text-slate-400">Deadline</p>
            <p className="text-xs font-semibold text-slate-700">
              Sep 15, 2024
            </p>
          </div>
        </div>
      </div>

      {/* What Needs Attention */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-3 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Needs Attention
          </p>
        </div>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2.5"
        >
          {ATTENTION_ITEMS.map((item) => (
            <motion.li
              key={item.id}
              variants={fadeInUp}
              className="flex items-start gap-2"
            >
              <SeverityDot severity={item.severity} />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-tight text-slate-700">
                  {item.message}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                  {item.docTitle}
                </p>
                <button className="mt-0.5 text-[10px] font-medium text-blue-600 hover:text-blue-700">
                  {item.action} →
                </button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Filing Stage Progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Filing Progress
        </p>
        <ol className="space-y-1.5">
          {FILING_STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <li key={stage} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    done
                      ? "text-emerald-600"
                      : active
                      ? "text-blue-700"
                      : "text-slate-400"
                  )}
                >
                  {stage}
                </span>
                {active && (
                  <span className="ml-auto rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700">
                    Active
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-3 flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filters
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-500">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Filed">Filed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-500">
              Quality Band
            </label>
            <select
              value={filterBand}
              onChange={(e) => setFilterBand(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Bands</option>
              <option value="Research">Research</option>
              <option value="Working">Working</option>
              <option value="Filing">Filing</option>
              <option value="Regulator">Regulator</option>
            </select>
          </div>
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
  doc: MockDocument;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const band = getBandForScore(doc.readinessScore);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={cn(
        "relative rounded-xl border bg-white p-4 transition-colors",
        selected
          ? "border-blue-400 ring-2 ring-blue-100"
          : "border-slate-200"
      )}
    >
      {/* Select checkbox */}
      <button
        onClick={() => onSelect(doc.id)}
        className={cn(
          "absolute left-3 top-3 flex h-4 w-4 items-center justify-center rounded border transition-colors",
          selected
            ? "border-blue-500 bg-blue-500"
            : "border-slate-300 bg-white hover:border-blue-400"
        )}
        aria-label={selected ? "Deselect document" : "Select document"}
      >
        {selected && <Check className="h-2.5 w-2.5 text-white" />}
      </button>

      <div className="ml-6 flex items-start justify-between gap-3">
        {/* Left content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <BandChip score={doc.readinessScore} />
            <StatusBadge status={doc.status} />
            {doc.unsourcedClaims > 0 && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                <AlertCircle className="h-2.5 w-2.5" />
                {doc.unsourcedClaims} unsourced
              </span>
            )}
          </div>
          <Link
            href={`/projects/${MOCK_PROJECT.id}/documents/${doc.id}`}
            className="block text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors"
          >
            {doc.title}
          </Link>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {doc.type} · v{doc.version} · {(doc.wordCount ?? 0).toLocaleString()} words
          </p>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {doc.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {doc.lastModified}
            </span>
          </div>
        </div>

        {/* Readiness ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative flex items-center justify-center">
            <ReadinessRing score={doc.readinessScore} size={44} strokeWidth={4} />
            <span className="absolute text-[11px] font-bold text-slate-800">
              {doc.readinessScore}
            </span>
          </div>
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
            Score
          </span>
        </div>
      </div>

      {/* Target band progress */}
      <div className="ml-6 mt-3 flex items-center gap-2">
        <span className="text-[10px] text-slate-400">Target:</span>
        <span
          className={cn(
            "text-[10px] font-semibold",
            band.color
          )}
        >
          {doc.targetBand}
        </span>
        <div className="flex-1 rounded-full bg-slate-100 h-1">
          <div
            className="h-1 rounded-full transition-all"
            style={{
              width: `${Math.min(100, ((doc.readinessScore - 82) / (100 - 82)) * 100)}%`,
              backgroundColor: scoreColor(doc.readinessScore),
            }}
          />
        </div>
        <Link
          href={`/projects/${MOCK_PROJECT.id}/documents/${doc.id}`}
          className="flex items-center gap-0.5 text-[10px] font-medium text-blue-600 hover:text-blue-700"
        >
          <Edit3 className="h-2.5 w-2.5" />
          Edit
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Center Panel ─────────────────────────────────────────────────────────────

function CenterPanel({
  selectedIds,
  setSelectedIds,
  filterStatus,
  filterBand,
}: {
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  filterStatus: string;
  filterBand: string;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("lastModified");
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [crossCheckRunning, setCrossCheckRunning] = useState(false);
  const [crossCheckDone, setCrossCheckDone] = useState(false);

  const filtered = MOCK_DOCUMENTS.filter((doc) => {
    const matchSearch =
      search === "" ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "" || doc.status === filterStatus;
    const matchBand =
      filterBand === "" ||
      getBandForScore(doc.readinessScore).label === filterBand;
    return matchSearch && matchStatus && matchBand;
  }).sort((a, b) => {
    if (sortBy === "score") return b.readinessScore - a.readinessScore;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "unsourced") return b.unsourcedClaims - a.unsourcedClaims;
    return b.lastModified.localeCompare(a.lastModified);
  });

  const allSelected =
    filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function runCrossCheck() {
    setCrossCheckRunning(true);
    setCrossCheckDone(false);
    setTimeout(() => {
      setCrossCheckRunning(false);
      setCrossCheckDone(true);
    }, 2000);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {/* Toolbar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="lastModified">Recent</option>
            <option value="score">Score</option>
            <option value="title">Title</option>
            <option value="unsourced">Unsourced</option>
          </select>

          <div className="h-5 w-px bg-slate-200" />

          {/* Action buttons */}
          <Link
            href={`/projects/${MOCK_PROJECT.id}/documents/new`}
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Document
          </Link>

          <button
            onClick={runCrossCheck}
            disabled={crossCheckRunning}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
              crossCheckDone
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            {crossCheckRunning ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : crossCheckDone ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {crossCheckRunning
              ? "Checking..."
              : crossCheckDone
              ? "Checked"
              : "Cross Check"}
          </button>

          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50">
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </button>

          <Link
            href={`/projects/${MOCK_PROJECT.id}/filing`}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Package className="h-3.5 w-3.5" />
            Filing Readiness
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowBulkMenu((v) => !v)}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              More
            </button>
            <AnimatePresence>
              {showBulkMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]"
                >
                  {[
                    { icon: Download, label: "Export All" },
                    { icon: TrendingUp, label: "Quality Report" },
                    { icon: Eye, label: "Preview Package" },
                    { icon: Trash2, label: "Archive Selected" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => setShowBulkMenu(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5"
          >
            <span className="text-xs font-semibold text-blue-700">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-blue-200" />
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
              <Zap className="h-3 w-3" />
              Bulk Cross-check
            </button>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
              <Download className="h-3 w-3" />
              Export
            </button>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
              <ArrowUpRight className="h-3 w-3" />
              Move Stage
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select all row */}
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={toggleAll}
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            allSelected
              ? "border-blue-500 bg-blue-500"
              : "border-slate-300 bg-white hover:border-blue-400"
          )}
        >
          {allSelected && <Check className="h-2.5 w-2.5 text-white" />}
        </button>
        <span className="text-[11px] text-slate-400">
          {filtered.length} document{filtered.length !== 1 ? "s" : ""}
        </span>
        {crossCheckDone && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <CheckCircle className="h-3 w-3" />
            Cross-check complete
          </span>
        )}
      </div>

      {/* Document list */}
      {filtered.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"
        >
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No documents found</p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search or filters
          </p>
          <Link
            href={`/projects/${MOCK_PROJECT.id}/documents/new`}
            className="mt-4 flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Document
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filtered.map((doc) => (
            <motion.div key={doc.id} variants={fadeInUp}>
              <DocumentCard
                doc={doc}
                selected={selectedIds.has(doc.id)}
                onSelect={toggleOne}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

type ContextTab =
  | "Guidance"
  | "Numbers"
  | "Contacts"
  | "Studies"
  | "Plans"
  | "Procedures"
  | "Sections";

const CONTEXT_TABS: { id: ContextTab; icon: React.ElementType; label: string }[] = [
  { id: "Guidance", icon: BookOpen, label: "Guidance" },
  { id: "Numbers", icon: Hash, label: "Numbers" },
  { id: "Contacts", icon: Users, label: "Contacts" },
  { id: "Studies", icon: FlaskConical, label: "Studies" },
  { id: "Plans", icon: Map, label: "Plans" },
  { id: "Procedures", icon: ClipboardList, label: "Procedures" },
  { id: "Sections", icon: Layers, label: "Sections" },
];

function RightSidebar() {
  const [activeTab, setActiveTab] = useState<ContextTab>("Guidance");
  const [copied, setCopied] = useState(false);

  function handleCopyBriefing() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex w-72 flex-shrink-0 flex-col gap-4 overflow-y-auto"
    >
      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Project Context
            </p>
            <button
              onClick={handleCopyBriefing}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                copied
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Star className="h-3 w-3" />
              )}
              {copied ? "Copied!" : "Copy Briefing"}
            </button>
          </div>
        </div>

        {/* Tab icons */}
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 py-2">
          {CONTEXT_TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={label}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                activeTab === id
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === "Guidance" && (
                <div className="space-y-3">
                  {CONTEXT_GUIDANCE.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <p className="text-[11px] font-semibold text-slate-800">
                        {g.title}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-blue-600">
                        {g.source}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                        {g.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Numbers" && (
                <div className="space-y-2">
                  {CONTEXT_NUMBERS.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-[11px] font-medium text-slate-700">
                          {n.label}
                        </p>
                        <p className="text-[10px] text-slate-400">{n.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {n.value}
                        </p>
                        <p className="text-[10px] text-slate-400">{n.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Contacts" && (
                <div className="space-y-2">
                  {CONTEXT_CONTACTS.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {(c.name ?? "").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-800">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{c.role}</p>
                          <p className="text-[10px] font-medium text-blue-600">
                            {c.agency}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Studies" && (
                <div className="space-y-3">
                  {CONTEXT_STUDIES.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <p className="text-[11px] font-semibold text-slate-800">
                        {s.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {s.author} · {s.year}
                      </p>
                      <p className="mt-1 text-[10px] text-blue-600">
                        {s.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Plans" && (
                <div className="space-y-2">
                  {CONTEXT_PLANS.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-700">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{p.version}</p>
                      </div>
                      <span
                        className={cn(
                          "ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          p.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "In Review"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Procedures" && (
                <div className="space-y-3">
                  {CONTEXT_PROCEDURES.map((pr) => (
                    <div
                      key={pr.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-600">
                          {pr.code}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-slate-800">
                        {pr.title}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                        {pr.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Sections" && (
                <div className="space-y-3">
                  {CONTEXT_SECTIONS.map((sec) => (
                    <div
                      key={sec.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <p className="text-[11px] font-semibold text-slate-800">
                        {sec.title}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-indigo-600">
                        {sec.regulation}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                        {sec.requirement}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Link to full context manager */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href={`/projects/${MOCK_PROJECT.id}/context`}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[11px] font-medium text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowUpRight className="h-3 w-3" />
              Manage All Context
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectWorkspacePage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBand, setFilterBand] = useState("");
  const [selectedStage] = useState<FilingStage>(MOCK_PROJECT.currentStage);

  const handleSetSelectedIds = useCallback((ids: Set<string>) => {
    setSelectedIds(ids);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Link href="/" className="hover:text-slate-600">
                  Dashboard
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-600 font-medium">
                  {MOCK_PROJECT.name}
                </span>
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                {MOCK_PROJECT.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {MOCK_PROJECT.agency}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Due Sep 15, 2024
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    MOCK_PROJECT.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {MOCK_PROJECT.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${MOCK_PROJECT.id}/audit`}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50"
              >
                <Clock className="h-3.5 w-3.5" />
                Audit Trail
              </Link>
              <Link
                href={`/projects/${MOCK_PROJECT.id}/filing`}
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
              >
                <Package className="h-3.5 w-3.5" />
                Filing Package
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-5 items-start">
          {/* Left sidebar */}
          <div className="hidden lg:block">
            <LeftSidebar
              selectedStage={selectedStage}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterBand={filterBand}
              setFilterBand={setFilterBand}
            />
          </div>

          {/* Center */}
          <CenterPanel
            selectedIds={selectedIds}
            setSelectedIds={handleSetSelectedIds}
            filterStatus={filterStatus}
            filterBand={filterBand}
          />

          {/* Right sidebar */}
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}