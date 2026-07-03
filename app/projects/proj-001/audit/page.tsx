"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, CheckCircle, Upload, User, Settings, Send, AlertCircle, Search, Filter, ChevronDown, Download, RefreshCw, Eye, Edit, Trash2, Plus, Star, Activity, Calendar, Tag } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { type Variants } from "framer-motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type AuditCategory =
  | "document"
  | "filing"
  | "review"
  | "system"
  | "user"
  | "submission";

interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  date: string;
  details: string;
  category: AuditCategory;
  metadata?: Record<string, string>;
}

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "ae-001",
    action: "Document uploaded",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-12T09:14:00Z",
    date: "2024-06-12",
    details: "Uploaded 'Air Quality Impact Assessment v3.2' (DOCX, 2.4 MB)",
    category: "document",
    metadata: { document: "Air Quality Impact Assessment", version: "3.2", size: "2.4 MB" },
  },
  {
    id: "ae-002",
    action: "Cross-check initiated",
    actor: "FilingDesk AI",
    actorRole: "System",
    timestamp: "2024-06-12T09:16:22Z",
    date: "2024-06-12",
    details: "Automated cross-check started for 'Air Quality Impact Assessment'. Found 7 unsourced claims.",
    category: "review",
    metadata: { document: "Air Quality Impact Assessment", unsourced: "7" },
  },
  {
    id: "ae-003",
    action: "Readiness score updated",
    actor: "FilingDesk AI",
    actorRole: "System",
    timestamp: "2024-06-12T09:17:05Z",
    date: "2024-06-12",
    details: "Readiness score changed from 84 to 87 after source anchoring on 'Stormwater Management Plan'.",
    category: "system",
    metadata: { document: "Stormwater Management Plan", from: "84", to: "87" },
  },
  {
    id: "ae-004",
    action: "Comment added",
    actor: "Marcus Webb",
    actorRole: "Senior Engineer",
    timestamp: "2024-06-12T10:02:44Z",
    date: "2024-06-12",
    details: "Added review comment on Section 4.2: 'Baseline data needs citation from EPA 2023 report.'",
    category: "review",
    metadata: { section: "4.2", document: "Air Quality Impact Assessment" },
  },
  {
    id: "ae-005",
    action: "Source anchored",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-12T11:30:10Z",
    date: "2024-06-12",
    details: "Anchored 3 sources to 'Noise Impact Study'. EPA 2023 Annual Report, OSHA Standard 1910.95, State Reg §4.7.",
    category: "document",
    metadata: { document: "Noise Impact Study", sources: "3" },
  },
  {
    id: "ae-006",
    action: "Stage advanced",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-12T14:00:00Z",
    date: "2024-06-12",
    details: "Project stage advanced from 'Anchor Sources' to 'Cross-check'. All primary documents sourced.",
    category: "filing",
    metadata: { from: "Anchor Sources", to: "Cross-check" },
  },
  {
    id: "ae-007",
    action: "User invited",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-12T15:22:00Z",
    date: "2024-06-12",
    details: "Invited 'priya.nair@envirotech.com' as Reviewer to the project.",
    category: "user",
    metadata: { email: "priya.nair@envirotech.com", role: "Reviewer" },
  },
  {
    id: "ae-008",
    action: "Document approved",
    actor: "Marcus Webb",
    actorRole: "Senior Engineer",
    timestamp: "2024-06-11T16:45:00Z",
    date: "2024-06-11",
    details: "'Wetlands Delineation Report' approved after final review. Readiness score: 92.",
    category: "review",
    metadata: { document: "Wetlands Delineation Report", score: "92" },
  },
  {
    id: "ae-009",
    action: "Version created",
    actor: "Priya Nair",
    actorRole: "Reviewer",
    timestamp: "2024-06-11T14:10:00Z",
    date: "2024-06-11",
    details: "Created version 2.1 of 'Traffic Impact Analysis' after incorporating agency feedback.",
    category: "document",
    metadata: { document: "Traffic Impact Analysis", version: "2.1" },
  },
  {
    id: "ae-010",
    action: "Deep review completed",
    actor: "FilingDesk AI",
    actorRole: "System",
    timestamp: "2024-06-11T13:00:00Z",
    date: "2024-06-11",
    details: "Deep review of 'Biological Resources Survey' completed. 12 improvement suggestions generated.",
    category: "review",
    metadata: { document: "Biological Resources Survey", suggestions: "12" },
  },
  {
    id: "ae-011",
    action: "Context item added",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-11T10:30:00Z",
    date: "2024-06-11",
    details: "Added key number: 'PM2.5 Annual Standard = 12 µg/m³' to project context.",
    category: "system",
    metadata: { type: "Key Number", value: "PM2.5 Annual Standard = 12 µg/m³" },
  },
  {
    id: "ae-012",
    action: "Filing package generated",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-10T17:00:00Z",
    date: "2024-06-10",
    details: "Draft filing package generated. 8 documents included. Package ID: PKG-2024-0610.",
    category: "filing",
    metadata: { packageId: "PKG-2024-0610", documents: "8" },
  },
  {
    id: "ae-013",
    action: "Signature uploaded",
    actor: "Marcus Webb",
    actorRole: "Senior Engineer",
    timestamp: "2024-06-10T16:20:00Z",
    date: "2024-06-10",
    details: "PE stamp and signature uploaded for 'Stormwater Management Plan'. License #CA-PE-48821.",
    category: "submission",
    metadata: { document: "Stormwater Management Plan", license: "CA-PE-48821" },
  },
  {
    id: "ae-014",
    action: "Document locked",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-10T15:45:00Z",
    date: "2024-06-10",
    details: "Locked snapshot of 'Air Quality Impact Assessment v3.2'. SHA-256: a3f9...c12e.",
    category: "submission",
    metadata: { document: "Air Quality Impact Assessment", hash: "a3f9...c12e" },
  },
  {
    id: "ae-015",
    action: "Project created",
    actor: "Sarah Chen",
    actorRole: "Lead Consultant",
    timestamp: "2024-06-08T08:00:00Z",
    date: "2024-06-08",
    details: "Project 'Riverside Industrial Expansion — CEQA Filing' created. Agency: California Air Resources Board.",
    category: "system",
    metadata: { agency: "California Air Resources Board" },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  AuditCategory,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  document: {
    label: "Document",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  filing: {
    label: "Filing",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: <Send className="h-3.5 w-3.5" />,
  },
  review: {
    label: "Review",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Eye className="h-3.5 w-3.5" />,
  },
  system: {
    label: "System",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: <Settings className="h-3.5 w-3.5" />,
  },
  user: {
    label: "User",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: <User className="h-3.5 w-3.5" />,
  },
  submission: {
    label: "Submission",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
};

const ACTOR_COLORS: Record<string, string> = {
  "Sarah Chen": "bg-blue-600",
  "Marcus Webb": "bg-indigo-600",
  "Priya Nair": "bg-purple-600",
  "FilingDesk AI": "bg-emerald-600",
};

function getActorInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  }
  return name.slice(0, 2).toUpperCase();
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[(month ?? 1) - 1]} ${day}, ${year}`;
}

function groupByDate(entries: AuditEntry[]): Record<string, AuditEntry[]> {
  const groups: Record<string, AuditEntry[]> = {};
  for (const entry of entries) {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date]!.push(entry);
  }
  return groups;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariant}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: AuditCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Actor Avatar ─────────────────────────────────────────────────────────────

function ActorAvatar({ name }: { name: string }) {
  const bg = ACTOR_COLORS[name] ?? "bg-slate-500";
  return (
    <div
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${bg}`}
      title={name}
    >
      {getActorInitials(name)}
    </div>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────

function TimelineEntry({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[entry.category];

  return (
    <motion.div variants={itemVariant} className="relative flex gap-4">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[13px] top-8 h-full w-px bg-slate-100" />
      )}

      {/* Icon dot */}
      <div
        className={`relative z-10 mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg}`}
      >
        <span className={cfg.color}>{cfg.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_-4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_6px_16px_-6px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <ActorAvatar name={entry.actor} />
              <div>
                <span className="text-sm font-semibold text-slate-900">{entry.action}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-500">{entry.actor}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{entry.actorRole}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CategoryBadge category={entry.category} />
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {formatTime(entry.timestamp)}
              </span>
            </div>
          </div>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{entry.details}</p>

          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                />
                {expanded ? "Hide" : "Show"} metadata
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(entry.metadata).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                        >
                          <Tag className="h-3 w-3 text-slate-400" />
                          <span className="font-medium text-slate-500">{k}:</span> {v}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: AuditCategory[] = [
  "document", "filing", "review", "system", "user", "submission",
];

const ALL_ACTORS = Array.from(new Set(AUDIT_ENTRIES.map((e) => e.actor)));

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | "all">("all");
  const [selectedActor, setSelectedActor] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return AUDIT_ENTRIES.filter((entry) => {
      const matchSearch =
        search.trim() === "" ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.details.toLowerCase().includes(search.toLowerCase()) ||
        entry.actor.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || entry.category === selectedCategory;
      const matchActor =
        selectedActor === "all" || entry.actor === selectedActor;
      return matchSearch && matchCategory && matchActor;
    });
  }, [search, selectedCategory, selectedActor]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  // Stats
  const totalEvents = AUDIT_ENTRIES.length;
  const todayCount = AUDIT_ENTRIES.filter((e) => e.date === "2024-06-12").length;
  const uniqueActors = new Set(AUDIT_ENTRIES.map((e) => e.actor)).size;
  const aiActions = AUDIT_ENTRIES.filter((e) => e.actor === "FilingDesk AI").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Projects</span>
                <span className="text-slate-300">/</span>
                <span>Riverside Industrial Expansion</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-medium">Audit Trail</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Audit Trail
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Complete history of every action taken on this project. Nothing is permanently deleted.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <StatCard
            label="Total Events"
            value={totalEvents}
            sub="All time"
            icon={<Activity className="h-4.5 w-4.5 text-blue-600" />}
            accent="bg-blue-50"
          />
          <StatCard
            label="Today"
            value={todayCount}
            sub="June 12, 2024"
            icon={<Calendar className="h-4.5 w-4.5 text-indigo-600" />}
            accent="bg-indigo-50"
          />
          <StatCard
            label="Contributors"
            value={uniqueActors}
            sub="Unique actors"
            icon={<User className="h-4.5 w-4.5 text-purple-600" />}
            accent="bg-purple-50"
          />
          <StatCard
            label="AI Actions"
            value={aiActions}
            sub="Automated events"
            icon={<Star className="h-4.5 w-4.5 text-emerald-600" />}
            accent="bg-emerald-50"
          />
        </motion.div>

        {/* Category Summary Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Events by Category
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const count = AUDIT_ENTRIES.filter((e) => e.category === cat).length;
              const cfg = CATEGORY_CONFIG[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(isActive ? "all" : cat)
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? `${cfg.color} ${cfg.bg} ${cfg.border} ring-2 ring-offset-1 ring-blue-300`
                      : `${cfg.color} ${cfg.bg} ${cfg.border} hover:opacity-80`
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                  <span className="ml-0.5 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-semibold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions, details, actors..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all ${
              showFilters
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedActor !== "all") && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                1
              </span>
            )}
          </button>

          {(search || selectedCategory !== "all" || selectedActor !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedActor("all");
              }}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Clear all
            </button>
          )}

          <span className="ml-auto text-xs text-slate-400">
            {filtered.length} of {totalEvents} events
          </span>
        </motion.div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Actor
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedActor("all")}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          selectedActor === "all"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        All actors
                      </button>
                      {ALL_ACTORS.map((actor) => {
                        const bg = ACTOR_COLORS[actor] ?? "bg-slate-500";
                        return (
                          <button
                            key={actor}
                            onClick={() =>
                              setSelectedActor(selectedActor === actor ? "all" : actor)
                            }
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              selectedActor === actor
                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${bg}`}
                            >
                              {getActorInitials(actor)}
                            </span>
                            {actor}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        {sortedDates.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center"
          >
            <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No events match your filters</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedActor("all");
              }}
              className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => {
              const entries = grouped[date] ?? [];
              return (
                <motion.div
                  key={date}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={staggerContainer}
                >
                  {/* Date header */}
                  <motion.div variants={itemVariant} className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {formatDate(date)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      {entries.length} {entries.length === 1 ? "event" : "events"}
                    </span>
                  </motion.div>

                  {/* Entries */}
                  <div className="ml-0">
                    {entries.map((entry, idx) => (
                      <TimelineEntry
                        key={entry.id}
                        entry={entry}
                        isLast={idx === entries.length - 1}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
        >
          <p className="text-xs text-slate-400">
            All events are immutable and permanently retained. This audit trail is cryptographically signed and tamper-evident.
          </p>
        </motion.div>
      </div>
    </div>
  );
}