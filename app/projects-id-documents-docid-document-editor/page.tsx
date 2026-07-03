"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight, Check, X, Clock, User, FileText, AlertCircle, Star, Eye, GitBranch, Download, Upload, Search, Plus, Minus, Edit, Activity, AlertTriangle, Info, Sparkles, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { getBandForScore, QUALITY_BANDS, type QualityBand } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOC = {
  id: "doc-001",
  projectId: "proj-001",
  title: "Environmental Impact Assessment — Phase II",
  type: "Environmental Assessment",
  readinessScore: 87,
  targetBand: "Filing" as QualityBand,
  status: "In Review" as const,
  unsourcedClaims: 4,
  wordCount: 6842,
  lastModified: "2024-06-12",
  author: "Dr. Sarah Chen",
  version: 3,
};

const MOCK_VERSIONS = [
  {
    id: "v3",
    version: 3,
    label: "v3 — Current",
    author: "Dr. Sarah Chen",
    date: "2024-06-12",
    changes: "Added groundwater analysis section, resolved 3 unsourced claims.",
    isCurrent: true,
  },
  {
    id: "v2",
    version: 2,
    label: "v2",
    author: "James Okafor",
    date: "2024-06-08",
    changes: "Revised air quality modeling results, updated mitigation table.",
    isCurrent: false,
  },
  {
    id: "v1",
    version: 1,
    label: "v1 — Initial",
    author: "Dr. Sarah Chen",
    date: "2024-06-01",
    changes: "Initial draft submitted for internal review.",
    isCurrent: false,
  },
];

const MOCK_SUGGESTIONS = [
  {
    id: "s1",
    type: "improve" as const,
    original:
      "The site shows elevated levels of contaminants which may pose risks.",
    suggested:
      "Site monitoring data (Table 3.2) indicates benzene concentrations of 0.42 mg/L, exceeding the EPA MCL of 0.005 mg/L by a factor of 84, posing significant groundwater risk.",
    reason: "Quantify the claim with specific data references for regulatory credibility.",
    section: "Section 3 — Groundwater Analysis",
    accepted: null as boolean | null,
  },
  {
    id: "s2",
    type: "source" as const,
    original:
      "Studies have shown that phytoremediation can reduce contaminant levels significantly.",
    suggested:
      "Phytoremediation has demonstrated 60–85% reduction in TPH concentrations over 18–36 month periods (USEPA, 2023; ITRC, 2022).",
    reason: "Unsourced claim — add peer-reviewed citations to satisfy anchor source requirements.",
    section: "Section 5 — Remediation Strategy",
    accepted: null as boolean | null,
  },
  {
    id: "s3",
    type: "clarity" as const,
    original:
      "The proposed remediation approach will be implemented in a timely manner.",
    suggested:
      "Remediation activities will commence within 30 days of permit issuance and reach operational status within 90 days, per the project schedule (Appendix B).",
    reason: "Vague timeline — regulators require specific, enforceable commitments.",
    section: "Section 5 — Remediation Strategy",
    accepted: null as boolean | null,
  },
  {
    id: "s4",
    type: "improve" as const,
    original:
      "Noise impacts during construction are expected to be minimal.",
    suggested:
      "Construction noise levels are projected at 68 dBA at the nearest receptor (150 m), within the EPA's daytime limit of 70 dBA (40 CFR Part 204). Monitoring will occur weekly.",
    reason: "Substantiate 'minimal' with measured projections and regulatory thresholds.",
    section: "Section 6 — Construction Impacts",
    accepted: null as boolean | null,
  },
];

const MOCK_SOURCES = [
  {
    id: "src-1",
    title: "EPA Groundwater Monitoring Guidelines",
    type: "Regulatory",
    year: "2023",
    linked: true,
  },
  {
    id: "src-2",
    title: "ITRC Phytoremediation Technical Overview",
    type: "Technical",
    year: "2022",
    linked: true,
  },
  {
    id: "src-3",
    title: "State Air Quality Standards — Title 17",
    type: "Regulatory",
    year: "2024",
    linked: false,
  },
  {
    id: "src-4",
    title: "Site Characterization Report (2023)",
    type: "Study",
    year: "2023",
    linked: true,
  },
];

const MOCK_CONTENT_SECTIONS = [
  {
    id: "sec-1",
    heading: "1. Executive Summary",
    content:
      "This Environmental Impact Assessment (EIA) evaluates the potential environmental consequences of the proposed industrial facility expansion at the Riverside Commerce Park, located at 4200 Industrial Blvd, Sacramento, CA 95820. The assessment covers air quality, groundwater, surface water, noise, biological resources, and cultural resources in accordance with CEQA Guidelines (14 CCR §15000 et seq.) and applicable federal regulations.\n\nThe project proponent, Meridian Industrial Partners LLC, proposes to expand the existing warehouse complex by 240,000 square feet and install a new wastewater pre-treatment system. Construction is anticipated to begin Q3 2024 and reach operational status by Q2 2025.",
    hasUnsourced: false,
    readiness: 94,
  },
  {
    id: "sec-2",
    heading: "2. Project Description",
    content:
      "The proposed project involves the following primary components:\n\n• Expansion of Building C by 120,000 sq ft (north elevation)\n• Construction of a new 40,000 sq ft cold storage facility\n• Installation of a 500,000 GPD wastewater pre-treatment system\n• Reconfiguration of truck access routes and loading dock expansion\n• Installation of 2.4 MW rooftop solar array\n\nThe project site encompasses approximately 18.4 acres within the existing industrial park boundary. No off-site land acquisition is required. The project will generate approximately 340 permanent jobs and 180 construction-phase positions.",
    hasUnsourced: false,
    readiness: 91,
  },
  {
    id: "sec-3",
    heading: "3. Groundwater Analysis",
    content:
      "Site monitoring data indicates elevated concentrations of volatile organic compounds (VOCs) in the shallow aquifer underlying the project site. The site shows elevated levels of contaminants which may pose risks to groundwater quality and nearby receptors.\n\nMonitoring wells MW-01 through MW-08 were sampled in March 2024 following USEPA SW-846 protocols. Results indicate benzene, toluene, ethylbenzene, and xylene (BTEX) compounds at concentrations requiring remediation prior to project commencement.",
    hasUnsourced: true,
    readiness: 78,
  },
  {
    id: "sec-4",
    heading: "4. Air Quality Assessment",
    content:
      "Air quality modeling was conducted using AERMOD version 23112 in accordance with EPA Guideline on Air Quality Models (40 CFR Part 51, Appendix W). Emission factors were derived from AP-42 Chapter 13.2.2 for fugitive dust and EPA MOVES3 for mobile source emissions.\n\nProject construction emissions are estimated at 4.2 tons/year PM10 and 2.8 tons/year PM2.5, below the SCAQMD significance thresholds of 15 tons/year and 10 tons/year respectively. Operational emissions from the expanded facility are projected at 8.6 tons/year NOx, requiring Best Available Control Technology (BACT) analysis.",
    hasUnsourced: false,
    readiness: 93,
  },
  {
    id: "sec-5",
    heading: "5. Remediation Strategy",
    content:
      "Studies have shown that phytoremediation can reduce contaminant levels significantly. The proposed remediation approach will be implemented in a timely manner following regulatory approval.\n\nA multi-phase remediation program is proposed, combining in-situ chemical oxidation (ISCO) for source zone treatment with monitored natural attenuation (MNA) for dissolved-phase plume management. The remediation system design is detailed in the Corrective Action Plan (CAP) submitted concurrently with this EIA.",
    hasUnsourced: true,
    readiness: 72,
  },
  {
    id: "sec-6",
    heading: "6. Construction Impacts",
    content:
      "Noise impacts during construction are expected to be minimal. Construction activities will be limited to weekday hours between 7:00 AM and 6:00 PM per Sacramento County Noise Ordinance Section 8.68.060.\n\nTraffic impacts during construction peak are estimated at 85 additional daily truck trips on Industrial Blvd, representing a 12% increase over baseline. A Construction Traffic Management Plan (CTMP) will be implemented to minimize conflicts with existing operations.",
    hasUnsourced: true,
    readiness: 81,
  },
];

const SCORE_BREAKDOWN = [
  { label: "Source Coverage", score: 82, weight: 25 },
  { label: "Regulatory Alignment", score: 91, weight: 30 },
  { label: "Completeness", score: 88, weight: 20 },
  { label: "Clarity & Precision", score: 85, weight: 15 },
  { label: "Internal Consistency", score: 90, weight: 10 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ReadinessRing({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) {
  const band = getBandForScore(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

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
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-800">{score}</span>
    </div>
  );
}

function BandChip({ score }: { score: number }) {
  const band = getBandForScore(score);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${band.bgColor} ${band.color} ${band.borderColor}`}
    >
      {band.label}
    </span>
  );
}

function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
}: {
  suggestion: (typeof MOCK_SUGGESTIONS)[0];
  onAccept: () => void;
  onReject: () => void;
}) {
  const typeConfig = {
    improve: {
      icon: ArrowUp,
      label: "Improve",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    source: {
      icon: FileText,
      label: "Add Source",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    clarity: {
      icon: Edit,
      label: "Clarity",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    },
  };

  const cfg = typeConfig[suggestion.type];
  const Icon = cfg.icon;

  if (suggestion.accepted === true) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.6 }}
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
      >
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Accepted</span>
        </div>
      </motion.div>
    );
  }

  if (suggestion.accepted === false) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.6 }}
        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="flex items-center gap-2 text-slate-500">
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">Rejected</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      className={`rounded-xl border p-4 ${cfg.border} bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
          <Icon className="h-3 w-3" />
          {cfg.label}
        </div>
        <span className="text-xs text-slate-400">{suggestion.section}</span>
      </div>

      <div className="mb-2 space-y-2">
        <div className="rounded-lg bg-red-50 p-2.5">
          <p className="text-xs font-medium text-red-600 mb-1">Original</p>
          <p className="text-xs text-slate-700 leading-relaxed">{suggestion.original}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-2.5">
          <p className="text-xs font-medium text-emerald-600 mb-1">Suggested</p>
          <p className="text-xs text-slate-700 leading-relaxed">{suggestion.suggested}</p>
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-500 leading-relaxed">{suggestion.reason}</p>

      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-emerald-700 active:scale-95"
        >
          <Check className="h-3 w-3" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
        >
          <X className="h-3 w-3" />
          Reject
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentEditorPage() {
  const [activeTab, setActiveTab] = useState<"editor" | "compare" | "history">("editor");
  const [rightPanel, setRightPanel] = useState<"score" | "sources" | "suggestions" | "review">("suggestions");
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [selectedVersion, setSelectedVersion] = useState("v3");
  const [compareVersion, setCompareVersion] = useState("v2");
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sourceSearch, setSourceSearch] = useState("");
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [editorContent, setEditorContent] = useState(
    MOCK_CONTENT_SECTIONS.map((s) => s.content).join("\n\n")
  );

  const band = getBandForScore(MOCK_DOC.readinessScore);
  const targetBandConfig = QUALITY_BANDS.find((b) => b.label === MOCK_DOC.targetBand);

  const pendingSuggestions = suggestions.filter((s) => s.accepted === null).length;
  const acceptedSuggestions = suggestions.filter((s) => s.accepted === true).length;

  const handleAccept = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accepted: true } : s))
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accepted: false } : s))
    );
  }, []);

  const handleScan = useCallback(() => {
    setScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2200);
  }, []);

  const filteredSources = MOCK_SOURCES.filter((src) =>
    src.title.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const weightedScore = Math.round(
    SCORE_BREAKDOWN.reduce((acc, item) => acc + (item.score * item.weight) / 100, 0)
  );

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-slate-50">
      {/* ── Top Bar ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/projects/proj-001"
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Project</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h1 className="text-sm font-semibold text-slate-900 line-clamp-1 max-w-[280px]">
              {MOCK_DOC.title}
            </h1>
          </div>
          <BandChip score={MOCK_DOC.readinessScore} />
        </div>

        <div className="flex items-center gap-2">
          {/* Version selector */}
          <div className="relative">
            <button
              onClick={() => setShowVersionDropdown((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <GitBranch className="h-3.5 w-3.5" />
              v{MOCK_DOC.version}
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showVersionDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] overflow-hidden"
                >
                  {MOCK_VERSIONS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVersion(v.id);
                        setShowVersionDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        selectedVersion === v.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{v.label}</span>
                        {v.isCurrent && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{v.author} · {v.date}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>

          <button className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
            <Check className="h-3.5 w-3.5" />
            Save Draft
          </button>
        </div>
      </motion.div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4">
        {(["editor", "compare", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab === "editor" && "Editor"}
            {tab === "compare" && "Compare Versions"}
            {tab === "history" && "Version History"}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 py-2">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
            <ReadinessRing score={MOCK_DOC.readinessScore} size={24} />
            <span className="text-xs font-semibold text-slate-700">
              {MOCK_DOC.readinessScore} Readiness
            </span>
          </div>
          {MOCK_DOC.unsourcedClaims > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                {MOCK_DOC.unsourcedClaims} unsourced
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Editor / Compare / History ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "editor" && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 overflow-hidden"
              >
                {/* Section Navigator */}
                <div className="hidden w-52 flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
                  <div className="p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Sections
                    </p>
                    <div className="space-y-0.5">
                      {MOCK_CONTENT_SECTIONS.map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => setSelectedSection(sec.id)}
                          className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
                            selectedSection === sec.id
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium leading-tight line-clamp-2">
                              {sec.heading}
                            </span>
                            {sec.hasUnsourced && (
                              <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-500" />
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <div className="h-1 flex-1 rounded-full bg-slate-100">
                              <div
                                className="h-1 rounded-full bg-blue-500"
                                style={{ width: `${sec.readiness}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">{sec.readiness}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editor Area */}
                <div className="flex flex-1 flex-col overflow-y-auto">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-b border-slate-100 bg-white px-4 py-2">
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <span className="text-xs font-bold">B</span>
                    </button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <span className="text-xs italic">I</span>
                    </button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <span className="text-xs underline">U</span>
                    </button>
                    <div className="mx-1 h-4 w-px bg-slate-200" />
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <span className="text-xs font-mono">H1</span>
                    </button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <span className="text-xs font-mono">H2</span>
                    </button>
                    <div className="mx-1 h-4 w-px bg-slate-200" />
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {MOCK_DOC.wordCount.toLocaleString("en-US")} words
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">
                        Last saved {MOCK_DOC.lastModified}
                      </span>
                    </div>
                  </div>

                  {/* Document Content */}
                  <div className="flex-1 px-8 py-8 max-w-3xl mx-auto w-full">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      {MOCK_CONTENT_SECTIONS.map((sec) => (
                        <motion.div
                          key={sec.id}
                          variants={cardVariants}
                          className={`group relative rounded-xl border p-6 transition-all ${
                            selectedSection === sec.id
                              ? "border-blue-300 bg-blue-50/30 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]"
                              : "border-slate-200 bg-white hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                          }`}
                          onClick={() => setSelectedSection(sec.id)}
                        >
                          {sec.hasUnsourced && (
                            <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5">
                              <AlertTriangle className="h-3 w-3 text-amber-600" />
                              <span className="text-xs font-medium text-amber-700">Unsourced claims</span>
                            </div>
                          )}
                          <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">{sec.heading}</h2>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-slate-400">Readiness: {sec.readiness}</span>
                              <BandChip score={sec.readiness} />
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                            {sec.content}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "compare" && (
              <motion.div
                key="compare"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 overflow-hidden"
              >
                <div className="flex flex-1 gap-0 overflow-hidden">
                  {/* Left version */}
                  <div className="flex flex-1 flex-col overflow-y-auto border-r border-slate-200">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-slate-400" />
                        <select
                          value={compareVersion}
                          onChange={(e) => setCompareVersion(e.target.value)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {MOCK_VERSIONS.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-xs text-slate-400">
                        {MOCK_VERSIONS.find((v) => v.id === compareVersion)?.date ?? ""}
                      </span>
                    </div>
                    <div className="p-6 space-y-4">
                      {MOCK_CONTENT_SECTIONS.slice(0, 3).map((sec) => (
                        <div key={sec.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                          <h3 className="mb-2 text-sm font-semibold text-slate-800">{sec.heading}</h3>
                          <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line line-clamp-6">
                            {sec.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right version (current) */}
                  <div className="flex flex-1 flex-col overflow-y-auto">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-blue-50 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">v3 — Current</span>
                      </div>
                      <span className="text-xs text-blue-500">{MOCK_DOC.lastModified}</span>
                    </div>
                    <div className="p-6 space-y-4">
                      {MOCK_CONTENT_SECTIONS.slice(0, 3).map((sec, i) => (
                        <div
                          key={sec.id}
                          className={`rounded-xl border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
                            i === 2
                              ? "border-emerald-200 bg-emerald-50/40"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <h3 className="mb-2 text-sm font-semibold text-slate-800">{sec.heading}</h3>
                          {i === 2 && (
                            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1.5">
                              <Plus className="h-3 w-3 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">
                                Added groundwater monitoring data with EPA references
                              </span>
                            </div>
                          )}
                          <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line line-clamp-6">
                            {sec.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <div className="mx-auto max-w-2xl">
                  <h2 className="mb-6 text-base font-semibold text-slate-900">Version History</h2>
                  <div className="relative space-y-0">
                    {MOCK_VERSIONS.map((v, idx) => (
                      <motion.div
                        key={v.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.08 }}
                        className="relative flex gap-4 pb-8 last:pb-0"
                      >
                        {idx < MOCK_VERSIONS.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200" />
                        )}
                        <div
                          className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            v.isCurrent
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {v.isCurrent ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">{v.label}</span>
                              {v.isCurrent && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">{v.date}</span>
                          </div>
                          <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            {v.author}
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600">{v.changes}</p>
                          {!v.isCurrent && (
                            <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                              Restore this version
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel ── */}
        <div className="hidden w-80 flex-shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white xl:flex">
          {/* Panel Tabs */}
          <div className="flex border-b border-slate-200">
            {(
              [
                { key: "suggestions", label: "AI Review", icon: Sparkles },
                { key: "score", label: "Score", icon: Activity },
                { key: "sources", label: "Sources", icon: FileText },
                { key: "review", label: "Deep Review", icon: Eye },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setRightPanel(key)}
                className={`flex flex-1 flex-col items-center gap-0.5 px-2 py-2.5 text-center transition-colors ${
                  rightPanel === key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {rightPanel === "suggestions" && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">AI Suggestions</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {pendingSuggestions} pending · {acceptedSuggestions} accepted
                      </p>
                    </div>
                    <button
                      onClick={handleScan}
                      disabled={scanning}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-60"
                    >
                      {scanning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-3 w-3" />
                          </motion.div>
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          Re-scan
                        </>
                      )}
                    </button>
                  </div>

                  {scanComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">
                        Scan complete — {suggestions.length} suggestions found
                      </span>
                    </motion.div>
                  )}

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {suggestions.map((s) => (
                      <SuggestionCard
                        key={s.id}
                        suggestion={s}
                        onAccept={() => handleAccept(s.id)}
                        onReject={() => handleReject(s.id)}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {rightPanel === "score" && (
                <motion.div
                  key="score"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <ReadinessRing score={MOCK_DOC.readinessScore} size={72} />
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{MOCK_DOC.readinessScore}</p>
                      <BandChip score={MOCK_DOC.readinessScore} />
                      <p className="mt-1 text-xs text-slate-500">
                        Target: <span className="font-medium text-slate-700">{MOCK_DOC.targetBand}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-slate-600">Score Breakdown</p>
                    <div className="space-y-2.5">
                      {SCORE_BREAKDOWN.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-slate-600">{item.label}</span>
                            <span className="text-xs font-semibold text-slate-800">{item.score}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                              className={`h-1.5 rounded-full ${
                                item.score >= 90
                                  ? "bg-emerald-500"
                                  : item.score >= 85
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">Quality Bands</p>
                    {QUALITY_BANDS.map((b) => (
                      <div
                        key={b.label}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                          b.label === band.label
                            ? `${b.bgColor} ${b.borderColor}`
                            : "border-slate-100 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {b.label === band.label && (
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                          <span className={`text-xs font-medium ${b.label === band.label ? b.color : "text-slate-500"}`}>
                            {b.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {b.min}–{b.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {rightPanel === "sources" && (
                <motion.div
                  key="sources"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Attached Sources</h3>
                    <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>

                  <div className="mb-3 relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search sources..."
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      <span className="font-medium">{MOCK_DOC.unsourcedClaims} unsourced claims</span> detected. Scan to locate them.
                    </p>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {filteredSources.map((src) => (
                      <motion.div
                        key={src.id}
                        variants={cardVariants}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-800 leading-tight">{src.title}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">{src.type}</span>
                              <span className="text-[10px] text-slate-300">·</span>
                              <span className="text-[10px] text-slate-400">{src.year}</span>
                            </div>
                          </div>
                          <div
                            className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              src.linked
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {src.linked ? "Linked" : "Unlinked"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <button
                    onClick={handleScan}
                    className="mt-4 w-full rounded-xl border border-dashed border-slate-300 py-3 text-xs font-medium text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Scan for unsourced claims
                  </button>
                </motion.div>
              )}

              {rightPanel === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Deep Review</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      AI-powered analysis against regulatory requirements and filing standards.
                    </p>
                  </div>

                  <div className="mb-4 space-y-2">
                    {[
                      { label: "CEQA Compliance", status: "pass", detail: "All required sections present" },
                      { label: "Source Coverage", status: "warn", detail: "4 claims lack citations" },
                      { label: "Quantitative Claims", status: "warn", detail: "3 claims need data references" },
                      { label: "Internal Consistency", status: "pass", detail: "No contradictions detected" },
                      { label: "Regulatory Thresholds", status: "pass", detail: "All thresholds cited correctly" },
                      { label: "Mitigation Measures", status: "fail", detail: "Section 5 mitigation incomplete" },
                    ].map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-start gap-3 rounded-xl border p-3 ${
                          check.status === "pass"
                            ? "border-emerald-200 bg-emerald-50"
                            : check.status === "warn"
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        {check.status === "pass" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : check.status === "warn" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              check.status === "pass"
                                ? "text-emerald-800"
                                : check.status === "warn"
                                ? "text-amber-800"
                                : "text-red-800"
                            }`}
                          >
                            {check.label}
                          </p>
                          <p
                            className={`text-[10px] mt-0.5 ${
                              check.status === "pass"
                                ? "text-emerald-600"
                                : check.status === "warn"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {check.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-slate-700">Reviewer Notes</p>
                    <p className="text-xs leading-relaxed text-slate-600">
                      Document is progressing well. Priority actions: resolve unsourced claims in Sections 3 and 5, complete mitigation measure table, and add quantitative noise projections to Section 6.
                    </p>
                  </div>

                  <button className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                    Run Full Deep Review
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Document Meta Footer */}
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Author</p>
                <p className="font-medium text-slate-700">{MOCK_DOC.author}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <p className="font-medium text-slate-700">{MOCK_DOC.status}</p>
              </div>
              <div>
                <p className="text-slate-400">Version</p>
                <p className="font-medium text-slate-700">v{MOCK_DOC.version}</p>
              </div>
              <div>
                <p className="text-slate-400">Words</p>
                <p className="font-medium text-slate-700">{MOCK_DOC.wordCount.toLocaleString("en-US")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}