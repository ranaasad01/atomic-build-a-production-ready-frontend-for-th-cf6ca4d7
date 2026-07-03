"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { FileText, AlertCircle, CheckCircle, Clock, ChevronRight, ChevronDown, Search, Filter, Plus, GitBranch, Layers, Zap, MoreHorizontal, Eye, Trash2, Download, ArrowUpDown, Star, Users, BookOpen, Phone, Map, Settings, Activity, TrendingUp, AlertTriangle, X, Check, RefreshCw, Package, Send } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import {
  QUALITY_BANDS,
  FILING_STAGES,
  getBandForScore,
  type FilingStage,
  type QualityBand,
} from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT = {
  id: "proj-001",
  name: "Coastal Wetlands Restoration EIS",
  agency: "EPA Region 9",
  location: "Marin County, CA",
  deadline: "2024-09-15",
  status: "In Review",
  readinessScore: 87,
  currentStage: "Cross-check" as FilingStage,
  documentCount: 12,
  description:
    "Environmental Impact Statement for the proposed coastal wetlands restoration project along the Marin County shoreline.",
};

const DOCUMENTS = [
  {
    id: "doc-001",
    title: "Environmental Impact Statement — Executive Summary",
    type: "EIS",
    readinessScore: 91,
    targetBand: "Filing" as QualityBand,
    status: "In Review" as const,
    unsourcedClaims: 2,
    wordCount: 4820,
    lastModified: "2024-07-12",
    author: "Dr. Sarah Chen",
    version: 3,
  },
  {
    id: "doc-002",
    title: "Biological Resources Assessment",
    type: "Assessment",
    readinessScore: 86,
    targetBand: "Working" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 7,
    wordCount: 11340,
    lastModified: "2024-07-10",
    author: "Marcus Webb",
    version: 2,
  },
  {
    id: "doc-003",
    title: "Water Quality Analysis Report",
    type: "Report",
    readinessScore: 93,
    targetBand: "Filing" as QualityBand,
    status: "Approved" as const,
    unsourcedClaims: 0,
    wordCount: 7650,
    lastModified: "2024-07-08",
    author: "Dr. Sarah Chen",
    version: 4,
  },
  {
    id: "doc-004",
    title: "Socioeconomic Impact Analysis",
    type: "Analysis",
    readinessScore: 84,
    targetBand: "Working" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 12,
    wordCount: 5920,
    lastModified: "2024-07-09",
    author: "Priya Nair",
    version: 1,
  },
  {
    id: "doc-005",
    title: "Mitigation Monitoring and Reporting Program",
    type: "Program",
    readinessScore: 96,
    targetBand: "Regulator" as QualityBand,
    status: "Approved" as const,
    unsourcedClaims: 0,
    wordCount: 3210,
    lastModified: "2024-07-05",
    author: "Marcus Webb",
    version: 5,
  },
  {
    id: "doc-006",
    title: "Air Quality Conformity Determination",
    type: "Determination",
    readinessScore: 88,
    targetBand: "Filing" as QualityBand,
    status: "In Review" as const,
    unsourcedClaims: 4,
    wordCount: 6100,
    lastModified: "2024-07-11",
    author: "Priya Nair",
    version: 2,
  },
  {
    id: "doc-007",
    title: "Cultural Resources Survey",
    type: "Survey",
    readinessScore: 82,
    targetBand: "Research" as QualityBand,
    status: "Draft" as const,
    unsourcedClaims: 9,
    wordCount: 4400,
    lastModified: "2024-07-07",
    author: "Dr. Sarah Chen",
    version: 1,
  },
  {
    id: "doc-008",
    title: "Noise Impact Assessment",
    type: "Assessment",
    readinessScore: 90,
    targetBand: "Filing" as QualityBand,
    status: "In Review" as const,
    unsourcedClaims: 1,
    wordCount: 3870,
    lastModified: "2024-07-13",
    author: "Marcus Webb",
    version: 3,
  },
];

const ATTENTION_ITEMS = [
  {
    id: "a1",
    severity: "high" as const,
    message: "Socioeconomic Impact Analysis has 12 unsourced claims",
    doc: "doc-004",
  },
  {
    id: "a2",
    severity: "high" as const,
    message: "Cultural Resources Survey below Research band threshold",
    doc: "doc-007",
  },
  {
    id: "a3",
    severity: "medium" as const,
    message: "Air Quality Conformity Determination needs 2 more points for Filing band",
    doc: "doc-006",
  },
  {
    id: "a4",
    severity: "low" as const,
    message: "Biological Resources Assessment has 7 unsourced claims pending review",
    doc: "doc-002",
  },
];

const CONTEXT_GUIDANCE = [
  {
    id: "g1",
    title: "NEPA Section 102 Requirements",
    source: "40 CFR Part 1502",
    tags: ["NEPA", "EIS"],
  },
  {
    id: "g2",
    title: "Coastal Zone Management Act Compliance",
    source: "16 U.S.C. § 1451",
    tags: ["Coastal", "CZM"],
  },
  {
    id: "g3",
    title: "Section 404 Wetlands Permit Guidance",
    source: "33 U.S.C. § 1344",
    tags: ["Wetlands", "404"],
  },
];

const CONTEXT_NUMBERS = [
  { id: "n1", label: "Project Area", value: "847 acres" },
  { id: "n2", label: "Wetland Restoration Target", value: "312 acres" },
  { id: "n3", label: "Buffer Zone Width", value: "150 ft minimum" },
  { id: "n4", label: "Species of Concern", value: "14 identified" },
];

const CONTEXT_CONTACTS = [
  {
    id: "c1",
    name: "Regional Director, EPA Region 9",
    org: "U.S. EPA",
    email: "region9@epa.gov",
  },
  {
    id: "c2",
    name: "Army Corps of Engineers Lead",
    org: "USACE SF District",
    email: "sf.district@usace.army.mil",
  },
  {
    id: "c3",
    name: "CA Coastal Commission Liaison",
    org: "CACC",
    email: "coastal@coastal.ca.gov",
  },
];

const CONTEXT_STUDIES = [
  {
    id: "s1",
    title: "Marin Coastal Habitat Baseline Study (2022)",
    author: "USFWS",
  },
  {
    id: "s2",
    title: "Tidal Wetland Carbon Sequestration Analysis",
    author: "NOAA",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[parseInt(parts[1] ?? "1", 10) - 1] ?? "";
  return `${month} ${parseInt(parts[2] ?? "1", 10)}, ${parts[0]}`;
}

function daysUntil(dateStr: string): number {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return 0;
  const target = new Date(
    parseInt(parts[0] ?? "2024", 10),
    parseInt(parts[1] ?? "1", 10) - 1,
    parseInt(parts[2] ?? "1", 10)
  );
  const now = new Date(2024, 6, 14); // fixed reference date to avoid hydration issues
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessRing({
  score,
  size = 64,
  strokeWidth = 5,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);
  const band = getBandForScore(score);

  const strokeColor =
    band.label === "Regulator"
      ? "#10b981"
      : band.label === "Filing"
      ? "#6366f1"
      : band.label === "Working"
      ? "#3b82f6"
      : "#f59e0b";

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
      />
    </svg>
  );
}

function BandChip({ band }: { band: ReturnType<typeof getBandForScore> }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        band.bgColor,
        band.color,
        band.borderColor
      )}
    >
      {band.label}
    </span>
  );
}

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
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      )}
    >
      {status}
    </span>
  );
}

function LargeReadinessGauge({ score }: { score: number }) {
  const band = getBandForScore(score);
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - pct);

  const strokeColor =
    band.label === "Regulator"
      ? "#10b981"
      : band.label === "Filing"
      ? "#6366f1"
      : band.label === "Working"
      ? "#3b82f6"
      : "#f59e0b";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
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
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{score}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <BandChip band={band} />
      <p className="text-center text-xs text-slate-500">Overall Readiness</p>
    </div>
  );
}

const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" },
  hover: { y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.06), 0 12px 24px -8px rgba(0,0,0,0.14)" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectWorkspacePage() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("lastModified");
  const [contextTab, setContextTab] = useState<
    "guidance" | "numbers" | "contacts" | "studies"
  >("guidance");
  const [attentionExpanded, setAttentionExpanded] = useState(true);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType, setNewDocType] = useState("EIS");
  const [showCrossCheck, setShowCrossCheck] = useState(false);
  const [crossCheckRunning, setCrossCheckRunning] = useState(false);
  const [crossCheckDone, setCrossCheckDone] = useState(false);

  const days = daysUntil(PROJECT.deadline);

  const filteredDocs = DOCUMENTS.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "readiness") return b.readinessScore - a.readinessScore;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return b.lastModified.localeCompare(a.lastModified);
  });

  const toggleDoc = useCallback((id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedDocs(
      selectedDocs.length === filteredDocs.length
        ? []
        : filteredDocs.map((d) => d.id)
    );
  }, [selectedDocs.length, filteredDocs]);

  const stageIndex = FILING_STAGES.indexOf(PROJECT.currentStage);

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
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                Projects
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-300" />
              <h1 className="text-base font-semibold text-slate-900">
                {PROJECT.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                {PROJECT.status}
              </span>
              <span className="text-xs text-slate-500">
                {days > 0 ? `${days} days until deadline` : "Deadline passed"}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">{PROJECT.agency}</span>
            </div>
          </motion.div>

          {/* Filing Stage Progress */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="pb-4"
          >
            <div className="flex items-center gap-0 overflow-x-auto">
              {FILING_STAGES.map((stage, i) => {
                const isCompleted = i < stageIndex;
                const isCurrent = i === stageIndex;
                const isFuture = i > stageIndex;
                return (
                  <div key={stage} className="flex items-center">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isCompleted
                          ? "text-emerald-700"
                          : isCurrent
                          ? "bg-blue-600 text-white"
                          : "text-slate-400"
                      )}
                    >
                      {isCompleted && (
                        <Check className="h-3 w-3 text-emerald-600" />
                      )}
                      <span className="whitespace-nowrap">{stage}</span>
                    </div>
                    {i < FILING_STAGES.length - 1 && (
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 flex-shrink-0",
                          i < stageIndex ? "text-emerald-400" : "text-slate-200"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-5 py-5">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            className="hidden w-56 flex-shrink-0 xl:block"
          >
            <div className="sticky top-20 space-y-4">
              {/* Readiness Gauge */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <LargeReadinessGauge score={PROJECT.readinessScore} />
                <div className="mt-3 space-y-1.5">
                  {QUALITY_BANDS.map((band) => {
                    const docsInBand = DOCUMENTS.filter(
                      (d) => getBandForScore(d.readinessScore).label === band.label
                    ).length;
                    return (
                      <div key={band.label} className="flex items-center justify-between">
                        <span className={cn("text-xs font-medium", band.color)}>
                          {band.label}
                        </span>
                        <span className="text-xs text-slate-500">{docsInBand} docs</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What Needs Attention */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <button
                  onClick={() => setAttentionExpanded((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3"
                >
                  <span className="text-xs font-semibold text-slate-700">
                    Needs Attention
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform",
                      attentionExpanded ? "rotate-180" : ""
                    )}
                  />
                </button>
                <AnimatePresence>
                  {attentionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 px-3 pb-3">
                        {ATTENTION_ITEMS.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-lg border p-2.5",
                              item.severity === "high"
                                ? "border-red-100 bg-red-50"
                                : item.severity === "medium"
                                ? "border-amber-100 bg-amber-50"
                                : "border-slate-100 bg-slate-50"
                            )}
                          >
                            <div className="flex items-start gap-1.5">
                              <AlertTriangle
                                className={cn(
                                  "mt-0.5 h-3 w-3 flex-shrink-0",
                                  item.severity === "high"
                                    ? "text-red-500"
                                    : item.severity === "medium"
                                    ? "text-amber-500"
                                    : "text-slate-400"
                                )}
                              />
                              <p className="text-xs leading-relaxed text-slate-700">
                                {item.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <p className="mb-2 text-xs font-semibold text-slate-700">Filter by Status</p>
                <div className="space-y-1">
                  {["All", "Draft", "In Review", "Approved", "Filed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={cn(
                        "w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                        statusFilter === s
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── Center Column ─────────────────────────────────────────────── */}
          <motion.main
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="min-w-0 flex-1"
          >
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="readiness">Readiness</option>
                  <option value="title">Title</option>
                </select>
              </div>

              {/* Action buttons */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddDoc(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Document
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCrossCheck(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                AI Cross-check
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                Compare
              </motion.button>

              <Link
                href="/projects/proj-001/filing"
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 shadow-sm transition-colors hover:bg-indigo-100"
              >
                <Package className="h-3.5 w-3.5" />
                Filing Readiness
              </Link>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedDocs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5"
                >
                  <span className="text-xs font-medium text-blue-700">
                    {selectedDocs.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100">
                      <Download className="h-3 w-3" />
                      Export
                    </button>
                    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100">
                      <Eye className="h-3 w-3" />
                      Review All
                    </button>
                    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                      Archive
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedDocs([])}
                    className="ml-auto text-blue-400 transition-colors hover:text-blue-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Select All Row */}
            <div className="mb-2 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={
                  selectedDocs.length === filteredDocs.length &&
                  filteredDocs.length > 0
                }
                onChange={selectAll}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">
                {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Document Cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-2.5"
            >
              {filteredDocs.length === 0 ? (
                <motion.div
                  variants={fadeIn}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"
                >
                  <FileText className="mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No documents found</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                filteredDocs.map((doc) => {
                  const band = getBandForScore(doc.readinessScore);
                  const isSelected = selectedDocs.includes(doc.id);
                  return (
                    <motion.div
                      key={doc.id}
                      variants={fadeInUp}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      <motion.div
                        variants={cardHover}
                        className={cn(
                          "rounded-xl border bg-white transition-colors",
                          isSelected
                            ? "border-blue-300 ring-1 ring-blue-200"
                            : "border-slate-200"
                        )}
                      >
                        <div className="flex items-start gap-3 p-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDoc(doc.id)}
                            className="mt-1 h-3.5 w-3.5 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />

                          {/* Readiness Ring */}
                          <div className="relative flex-shrink-0">
                            <ReadinessRing score={doc.readinessScore} size={44} strokeWidth={4} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-slate-800">
                                {doc.readinessScore}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start gap-2">
                              <Link
                                href={`/projects/proj-001/documents/doc-001`}
                                className="text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600"
                              >
                                {doc.title}
                              </Link>
                              <BandChip band={band} />
                              <StatusBadge status={doc.status} />
                              {doc.unsourcedClaims > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                                  <AlertCircle className="h-3 w-3" />
                                  {doc.unsourcedClaims} unsourced
                                </span>
                              )}
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span>{doc.type}</span>
                              <span className="text-slate-300">·</span>
                              <span>{(doc.wordCount ?? 0).toLocaleString()} words</span>
                              <span className="text-slate-300">·</span>
                              <span>v{doc.version}</span>
                              <span className="text-slate-300">·</span>
                              <span>{doc.author}</span>
                              <span className="text-slate-300">·</span>
                              <span>Modified {formatDate(doc.lastModified)}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    band.label === "Regulator"
                                      ? "bg-emerald-500"
                                      : band.label === "Filing"
                                      ? "bg-indigo-500"
                                      : band.label === "Working"
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                                  )}
                                  style={{ width: `${doc.readinessScore}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">
                                Target: {doc.targetBand}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-shrink-0 items-center gap-1">
                            <Link
                              href={`/projects/proj-001/documents/doc-001`}
                              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              title="Open editor"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              title="More options"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>

            {/* Filing Readiness Summary */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Filing Readiness Overview
                </h2>
                <Link
                  href="/projects/proj-001/filing"
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  View Package
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUALITY_BANDS.map((band) => {
                  const count = DOCUMENTS.filter(
                    (d) => getBandForScore(d.readinessScore).label === band.label
                  ).length;
                  return (
                    <div
                      key={band.label}
                      className={cn(
                        "rounded-lg border p-3",
                        band.bgColor,
                        band.borderColor
                      )}
                    >
                      <p className={cn("text-xs font-semibold", band.color)}>
                        {band.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
                      <p className="text-xs text-slate-500">
                        {band.min}–{band.max} score
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <p className="text-xs text-amber-800">
                  3 documents need to reach Filing band before package assembly. Current overall readiness: {PROJECT.readinessScore}/100.
                </p>
              </div>
            </motion.div>
          </motion.main>

          {/* ── Right Sidebar ─────────────────────────────────────────────── */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="hidden w-64 flex-shrink-0 lg:block"
          >
            <div className="sticky top-20 space-y-4">
              {/* Project Context Header */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-slate-700">
                    Project Context
                  </h2>
                  <Link
                    href="/projects/proj-001/context"
                    className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Manage
                  </Link>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Map className="h-3.5 w-3.5 text-slate-400" />
                    <span>{PROJECT.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{PROJECT.agency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Due {formatDate(PROJECT.deadline)}</span>
                  </div>
                </div>
              </div>

              {/* Context Tabs */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="flex border-b border-slate-100">
                  {(
                    [
                      { key: "guidance", icon: BookOpen, label: "Guidance" },
                      { key: "numbers", icon: Activity, label: "Numbers" },
                      { key: "contacts", icon: Phone, label: "Contacts" },
                      { key: "studies", icon: Star, label: "Studies" },
                    ] as const
                  ).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setContextTab(key)}
                      className={cn(
                        "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                        contextTab === key
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="p-3">
                  <AnimatePresence mode="wait">
                    {contextTab === "guidance" && (
                      <motion.div
                        key="guidance"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        {CONTEXT_GUIDANCE.map((g) => (
                          <div
                            key={g.id}
                            className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                          >
                            <p className="text-xs font-medium text-slate-800">
                              {g.title}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-500">
                              {g.source}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {g.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {contextTab === "numbers" && (
                      <motion.div
                        key="numbers"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        {CONTEXT_NUMBERS.map((n) => (
                          <div
                            key={n.id}
                            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                          >
                            <span className="text-xs text-slate-600">{n.label}</span>
                            <span className="text-xs font-semibold text-slate-900">
                              {n.value}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {contextTab === "contacts" && (
                      <motion.div
                        key="contacts"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        {CONTEXT_CONTACTS.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                          >
                            <p className="text-xs font-medium text-slate-800">
                              {c.name}
                            </p>
                            <p className="text-[10px] text-slate-500">{c.org}</p>
                            <a
                              href={`mailto:${c.email}`}
                              className="mt-0.5 block text-[10px] text-blue-600 transition-colors hover:text-blue-700"
                            >
                              {c.email}
                            </a>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {contextTab === "studies" && (
                      <motion.div
                        key="studies"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2"
                      >
                        {CONTEXT_STUDIES.map((s) => (
                          <div
                            key={s.id}
                            className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                          >
                            <p className="text-xs font-medium text-slate-800">
                              {s.title}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-500">
                              {s.author}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-slate-100 px-3 py-2.5">
                  <button className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100">
                    Copy as Briefing
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <p className="mb-2.5 text-xs font-semibold text-slate-700">Quick Links</p>
                <div className="space-y-1">
                  {[
                    { label: "Audit Trail", href: "/projects/proj-001/audit", icon: Activity },
                    { label: "Filing Package", href: "/projects/proj-001/filing", icon: Package },
                    { label: "Context Manager", href: "/projects/proj-001/context", icon: Settings },
                    { label: "Document Editor", href: "/projects/proj-001/documents/doc-001", icon: FileText },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trend */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">Readiness Trend</p>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[78, 80, 82, 83, 85, 86, 87].map((val, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-sm bg-blue-200 transition-all"
                        style={{ height: `${((val - 75) / 25) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>7 days ago</span>
                  <span className="font-medium text-emerald-600">+9 pts</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ── Add Document Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowAddDoc(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Add Document
                </h2>
                <button
                  onClick={() => setShowAddDoc(false)}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Traffic Impact Analysis"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Document Type
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {["EIS", "Assessment", "Report", "Analysis", "Survey", "Program", "Determination"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAddDoc(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddDoc(false)}
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Create Document
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Cross-check Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showCrossCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!crossCheckRunning) setShowCrossCheck(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <Zap className="h-4 w-4 text-amber-500" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">
                    AI Cross-check
                  </h2>
                </div>
                {!crossCheckRunning && (
                  <button
                    onClick={() => {
                      setShowCrossCheck(false);
                      setCrossCheckDone(false);
                    }}
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {!crossCheckRunning && !crossCheckDone && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Run an AI-powered cross-check across all documents to identify inconsistencies, unsourced claims, and regulatory gaps.
                  </p>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2">
                    {[
                      "Scan for unsourced factual claims",
                      "Check regulatory citation accuracy",
                      "Identify cross-document inconsistencies",
                      "Flag missing required sections",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCrossCheck(false)}
                      className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={runCrossCheck}
                      className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                    >
                      Run Cross-check
                    </button>
                  </div>
                </div>
              )}

              {crossCheckRunning && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-8 w-8 text-amber-500" />
                  </motion.div>
                  <p className="text-sm font-medium text-slate-700">
                    Analyzing {DOCUMENTS.length} documents...
                  </p>
                  <p className="text-xs text-slate-500">
                    Checking citations, claims, and regulatory alignment
                  </p>
                </div>
              )}

              {crossCheckDone && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                      Cross-check complete
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { severity: "high", msg: "35 unsourced claims found across 4 documents" },
                      { severity: "medium", msg: "2 regulatory citations need verification" },
                      { severity: "low", msg: "Minor terminology inconsistencies in 3 documents" },
                      { severity: "info", msg: "All required NEPA sections present" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2 rounded-lg border p-2.5 text-xs",
                          item.severity === "high"
                            ? "border-red-100 bg-red-50 text-red-800"
                            : item.severity === "medium"
                            ? "border-amber-100 bg-amber-50 text-amber-800"
                            : item.severity === "low"
                            ? "border-blue-100 bg-blue-50 text-blue-800"
                            : "border-emerald-100 bg-emerald-50 text-emerald-800"
                        )}
                      >
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        {item.msg}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowCrossCheck(false);
                      setCrossCheckDone(false);
                    }}
                    className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    View Full Report
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}