"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import {
  QUALITY_BANDS,
  getBandForScore,
  FILING_STAGES,
  type Project,
  type ProjectStatus,
  type FilingStage,
} from "@/lib/data";
import { Search, Plus, Filter, ArrowUpDown, ChevronDown, X, FileText, Calendar, Building2, Clock, CheckCircle, AlertCircle, Archive, Layers, TrendingUp, Activity, BarChart2, ChevronRight } from 'lucide-react';
import { useTranslations } from "next-intl";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-001",
    name: "Coastal Wetlands Restoration EIS",
    agency: "EPA Region 9",
    documentCount: 14,
    deadline: "2024-09-15",
    status: "Active",
    readinessScore: 87,
    currentStage: "Anchor Sources",
    description:
      "Environmental Impact Statement for the coastal wetlands restoration project spanning 340 acres in San Diego County.",
    location: "San Diego, CA",
    createdAt: "2024-01-10",
    updatedAt: "2024-06-18",
  },
  {
    id: "proj-002",
    name: "Highway 101 Expansion CEQA",
    agency: "Caltrans District 5",
    documentCount: 22,
    deadline: "2024-08-01",
    status: "In Review",
    readinessScore: 91,
    currentStage: "Improve Quality",
    description:
      "CEQA documentation for the 12-mile expansion of Highway 101 through Santa Barbara County.",
    location: "Santa Barbara, CA",
    createdAt: "2023-11-05",
    updatedAt: "2024-06-20",
  },
  {
    id: "proj-003",
    name: "Solar Farm Permit Package",
    agency: "BLM California",
    documentCount: 9,
    deadline: "2024-10-30",
    status: "Active",
    readinessScore: 83,
    currentStage: "Review",
    description:
      "Permit application for a 200MW utility-scale solar installation on federal land in the Mojave Desert.",
    location: "Mojave, CA",
    createdAt: "2024-02-20",
    updatedAt: "2024-06-15",
  },
  {
    id: "proj-004",
    name: "Port Expansion NEPA Review",
    agency: "Army Corps of Engineers",
    documentCount: 31,
    deadline: "2024-07-20",
    status: "Filing Ready",
    readinessScore: 96,
    currentStage: "Assemble Package",
    description:
      "NEPA environmental review for the Port of Long Beach container terminal expansion project.",
    location: "Long Beach, CA",
    createdAt: "2023-08-14",
    updatedAt: "2024-06-21",
  },
  {
    id: "proj-005",
    name: "Groundwater Remediation Plan",
    agency: "DTSC California",
    documentCount: 7,
    deadline: "2024-12-01",
    status: "Active",
    readinessScore: 85,
    currentStage: "Cross-check",
    description:
      "Remedial Action Plan for contaminated groundwater plume at former industrial site in Fresno.",
    location: "Fresno, CA",
    createdAt: "2024-03-01",
    updatedAt: "2024-06-17",
  },
  {
    id: "proj-006",
    name: "Wind Energy FERC Filing",
    agency: "FERC",
    documentCount: 18,
    deadline: "2024-06-30",
    status: "Submitted",
    readinessScore: 98,
    currentStage: "File & Track",
    description:
      "Federal Energy Regulatory Commission filing for a 150MW offshore wind energy project.",
    location: "Offshore, OR",
    createdAt: "2023-06-01",
    updatedAt: "2024-06-10",
  },
  {
    id: "proj-007",
    name: "Urban Infill Air Quality Study",
    agency: "SCAQMD",
    documentCount: 5,
    deadline: "2025-02-15",
    status: "Active",
    readinessScore: 82,
    currentStage: "Capture",
    description:
      "Air quality impact assessment for a mixed-use urban infill development in downtown Los Angeles.",
    location: "Los Angeles, CA",
    createdAt: "2024-05-10",
    updatedAt: "2024-06-19",
  },
  {
    id: "proj-008",
    name: "Mining Reclamation SMARA",
    agency: "CDFW",
    documentCount: 12,
    deadline: "2024-11-10",
    status: "Archived",
    readinessScore: 90,
    currentStage: "File & Track",
    description:
      "Surface Mining and Reclamation Act compliance package for closed aggregate mine in Riverside County.",
    location: "Riverside, CA",
    createdAt: "2023-04-22",
    updatedAt: "2024-03-30",
  },
];

const STAT_CARDS = [
  {
    label: "Total Projects",
    value: 8,
    icon: Layers,
    color: "text-blue-600",
    bg: "bg-blue-50",
    delta: "+2 this month",
    deltaUp: true,
  },
  {
    label: "Filing Ready",
    value: 1,
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    delta: "1 pending review",
    deltaUp: true,
  },
  {
    label: "Avg. Readiness",
    value: "89.5",
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    delta: "+3.2 pts this week",
    deltaUp: true,
  },
  {
    label: "Deadlines Soon",
    value: 3,
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    delta: "Within 30 days",
    deltaUp: false,
  },
];

const STATUS_OPTIONS: ProjectStatus[] = [
  "Active",
  "In Review",
  "Filing Ready",
  "Submitted",
  "Archived",
];

const SORT_OPTIONS = [
  { label: "Deadline (Soonest)", value: "deadline-asc" },
  { label: "Deadline (Latest)", value: "deadline-desc" },
  { label: "Readiness (High)", value: "readiness-desc" },
  { label: "Readiness (Low)", value: "readiness-asc" },
  { label: "Name (A–Z)", value: "name-asc" },
  { label: "Updated (Recent)", value: "updated-desc" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDeadline(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[parseInt(parts[1] ?? "1", 10) - 1] ?? "";
  const day = parseInt(parts[2] ?? "1", 10);
  const year = parts[0] ?? "";
  return `${month} ${day}, ${year}`;
}

function daysUntil(dateStr: string): number {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return 999;
  const target = new Date(
    parseInt(parts[0] ?? "2024", 10),
    parseInt(parts[1] ?? "1", 10) - 1,
    parseInt(parts[2] ?? "1", 10)
  );
  const now = new Date(2024, 5, 22); // fixed reference date to avoid hydration issues
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatusConfig(status: ProjectStatus) {
  switch (status) {
    case "Active":
      return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: Activity };
    case "In Review":
      return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: Clock };
    case "Filing Ready":
      return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle };
    case "Submitted":
      return { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", icon: FileText };
    case "Archived":
      return { color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", icon: Archive };
  }
}

function getStageIndex(stage: FilingStage): number {
  return FILING_STAGES.indexOf(stage);
}

// ─── Readiness Ring ───────────────────────────────────────────────────────────

function ReadinessRing({
  score,
  size = 56,
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
      : "#f59e0b";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color: strokeColor, fontSize: size < 48 ? 9 : 11 }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Stage Progress Bar ───────────────────────────────────────────────────────

function StageProgress({ stage }: { stage: FilingStage }) {
  const idx = getStageIndex(stage);
  const total = FILING_STAGES.length;
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-slate-500">{stage}</span>
        <span className="text-xs text-slate-400">
          {idx + 1}/{total}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-slate-100">
        <div
          className="h-1 rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Band Chip ────────────────────────────────────────────────────────────────

function BandChip({ score }: { score: number }) {
  const band = getBandForScore(score);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${band.color} ${band.bgColor} ${band.borderColor}`}
    >
      {band.label}
    </span>
  );
}

// ─── New Project Modal ────────────────────────────────────────────────────────

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">New Project</h2>
            <p className="text-xs text-slate-500">Start a new compliance filing workspace</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Coastal Wetlands Restoration EIS"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Agency
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g. EPA Region 9"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Diego, CA"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project scope..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const days = daysUntil(project.deadline);
  const isUrgent = days >= 0 && days <= 14;
  const isPast = days < 0;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/projects/${project.id}`}
            className="block text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600 group-hover:text-blue-600"
          >
            {project.name}
          </Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{project.agency}</span>
          </div>
        </div>
        <ReadinessRing score={project.readinessScore} size={52} />
      </div>

      {/* Description */}
      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
        {project.description}
      </p>

      {/* Stage Progress */}
      <StageProgress stage={project.currentStage} />

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <BandChip score={project.readinessScore} />
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}
        >
          <StatusIcon className="h-3 w-3" />
          {project.status}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {project.documentCount} docs
          </span>
          <span
            className={`flex items-center gap-1 ${
              isPast ? "text-red-600" : isUrgent ? "text-amber-600" : "text-slate-500"
            }`}
          >
            <Calendar className="h-3 w-3" />
            {isPast
              ? `${Math.abs(days)}d overdue`
              : days === 0
              ? "Due today"
              : `${days}d left`}
          </span>
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-0.5 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100"
        >
          Open <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Readiness Distribution Chart ─────────────────────────────────────────────

function ReadinessDistribution({ projects }: { projects: Project[] }) {
  const bands = QUALITY_BANDS.map((band) => ({
    ...band,
    count: projects.filter(
      (p) => p.readinessScore >= band.min && p.readinessScore <= band.max
    ).length,
  }));
  const belowCount = projects.filter((p) => p.readinessScore < 82).length;
  const maxCount = Math.max(...bands.map((b) => b.count), belowCount, 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Readiness Distribution</h3>
          <p className="text-xs text-slate-500">Projects by quality band</p>
        </div>
        <BarChart2 className="h-4 w-4 text-slate-400" />
      </div>
      <div className="space-y-3">
        {bands.map((band) => (
          <div key={band.label} className="flex items-center gap-3">
            <span className={`w-20 shrink-0 text-xs font-medium ${band.color}`}>
              {band.label}
            </span>
            <div className="flex-1 rounded-full bg-slate-100 h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(band.count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className={`h-2 rounded-full ${
                  band.label === "Regulator"
                    ? "bg-emerald-500"
                    : band.label === "Filing"
                    ? "bg-indigo-500"
                    : band.label === "Working"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
            </div>
            <span className="w-4 shrink-0 text-right text-xs font-semibold text-slate-700">
              {band.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Score range: 82–100+</span>
          <span>{projects.length} total projects</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stage Pipeline ───────────────────────────────────────────────────────────

function StagePipeline({ projects }: { projects: Project[] }) {
  const stageCounts = FILING_STAGES.map((stage) => ({
    stage,
    count: projects.filter((p) => p.currentStage === stage).length,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Filing Pipeline</h3>
          <p className="text-xs text-slate-500">Projects by current stage</p>
        </div>
        <Activity className="h-4 w-4 text-slate-400" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {stageCounts.map((item, idx) => (
          <div key={item.stage} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-full items-center justify-center rounded-md text-sm font-bold transition-all ${
                item.count > 0
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.count}
            </div>
            <span className="text-center text-[9px] leading-tight text-slate-500 hidden lg:block">
              {item.stage.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1 overflow-x-auto">
        {FILING_STAGES.map((stage, idx) => (
          <div key={stage} className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-slate-400">{stage}</span>
            {idx < FILING_STAGES.length - 1 && (
              <ChevronRight className="h-3 w-3 text-slate-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsDashboardPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [sortBy, setSortBy] = useState("deadline-asc");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...MOCK_PROJECTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "deadline-asc":
          return a.deadline.localeCompare(b.deadline);
        case "deadline-desc":
          return b.deadline.localeCompare(a.deadline);
        case "readiness-desc":
          return b.readinessScore - a.readinessScore;
        case "readiness-asc":
          return a.readinessScore - b.readinessScore;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "updated-desc":
          return b.updatedAt.localeCompare(a.updatedAt);
        default:
          return 0;
      }
    });

    return result;
  }, [search, statusFilter, sortBy]);

  const avgReadiness =
    MOCK_PROJECTS.length > 0
      ? (
          MOCK_PROJECTS.reduce((sum, p) => sum + p.readinessScore, 0) /
          MOCK_PROJECTS.length
        ).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence>
        {showNewProject && (
          <NewProjectModal onClose={() => setShowNewProject(false)} />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your compliance filing workspaces and track submission readiness.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewProject(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Project
          </motion.button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={scaleIn}
                whileHover={{ y: -1 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">{card.label}</span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {card.label === "Avg. Readiness" ? avgReadiness : card.value}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    card.deltaUp ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {card.delta}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <ReadinessDistribution projects={MOCK_PROJECTS} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StagePipeline projects={MOCK_PROJECTS} />
          </motion.div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeIn}
          className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                showFilters || statusFilter !== "All"
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
              {statusFilter !== "All" && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-600 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* View mode */}
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5 overflow-hidden"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Status:</span>
                  {(["All", ...STATUS_OPTIONS] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s as ProjectStatus | "All")}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        statusFilter === s
                          ? "border-blue-300 bg-blue-600 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  {statusFilter !== "All" && (
                    <button
                      onClick={() => setStatusFilter("All")}
                      className="ml-2 text-xs text-slate-400 underline hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {filtered.length === MOCK_PROJECTS.length
              ? `${MOCK_PROJECTS.length} projects`
              : `${filtered.length} of ${MOCK_PROJECTS.length} projects`}
          </p>
          {(search || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Project Grid / List */}
        {filtered.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">No projects found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-2"
          >
            {filtered.map((project) => {
              const statusConfig = getStatusConfig(project.status);
              const StatusIcon = statusConfig.icon;
              const days = daysUntil(project.deadline);
              const isUrgent = days >= 0 && days <= 14;
              const isPast = days < 0;

              return (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-blue-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <ReadinessRing score={project.readinessScore} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600"
                      >
                        {project.name}
                      </Link>
                      <BandChip score={project.readinessScore} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {project.agency}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {project.documentCount} docs
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {project.currentStage}
                      </span>
                    </div>
                  </div>
                  <div className="hidden items-center gap-3 sm:flex">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {project.status}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isPast
                          ? "text-red-600"
                          : isUrgent
                          ? "text-amber-600"
                          : "text-slate-500"
                      }`}
                    >
                      {isPast
                        ? `${Math.abs(days)}d overdue`
                        : days === 0
                        ? "Due today"
                        : `${days}d left`}
                    </span>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeInUp}
          className="mt-10 flex items-center justify-center"
        >
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Start a new project
          </button>
        </motion.div>
      </div>
    </div>
  );
}