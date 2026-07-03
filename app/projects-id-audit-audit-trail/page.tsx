"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, FileText, User, CheckCircle, AlertCircle, Clock, Upload, Edit, Eye, Lock, Send, Archive, Plus, RefreshCw, ChevronDown, ChevronRight, Calendar, Activity, Shield, Layers } from 'lucide-react';
import { fadeInUp, staggerContainer, fadeIn } from "@/lib/motion";
import { type Variants } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditCategory =
  | "document"
  | "filing"
  | "review"
  | "system"
  | "user"
  | "submission";

interface AuditEntry {
  id: string;
  projectId: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  details: string;
  category: AuditCategory;
  metadata?: Record<string, string>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "ae-001",
    projectId: "proj-001",
    action: "Document Approved",
    actor: "Sarah Chen",
    actorRole: "Senior Consultant",
    timestamp: "2024-06-12T14:32:00Z",
    details: "Air Quality Impact Assessment approved after final review cycle.",
    category: "review",
    metadata: { document: "Air Quality Impact Assessment", version: "v3.2", score: "92" },
  },
  {
    id: "ae-002",
    projectId: "proj-001",
    action: "Filing Package Locked",
    actor: "Marcus Webb",
    actorRole: "Project Manager",
    timestamp: "2024-06-12T13:15:00Z",
    details: "Filing package locked for submission. Snapshot created at version 4.1.",
    category: "filing",
    metadata: { packageId: "PKG-2024-0612", documents: "7", totalPages: "214" },
  },
  {
    id: "ae-003",
    projectId: "proj-001",
    action: "Cross-check Completed",
    actor: "AI Engine",
    actorRole: "System",
    timestamp: "2024-06-12T11:48:00Z",
    details: "Automated cross-check identified 3 unsourced claims across 2 documents.",
    category: "system",
    metadata: { unsourcedClaims: "3", documentsScanned: "7", duration: "42s" },
  },
  {
    id: "ae-004",
    projectId: "proj-001",
    action: "Document Uploaded",
    actor: "Priya Nair",
    actorRole: "Environmental Analyst",
    timestamp: "2024-06-12T10:05:00Z",
    details: "Stormwater Management Plan uploaded. Initial readiness score: 84.",
    category: "document",
    metadata: { document: "Stormwater Management Plan", size: "2.4 MB", pages: "38" },
  },
  {
    id: "ae-005",
    projectId: "proj-001",
    action: "Signature Added",
    actor: "Dr. James Okafor",
    actorRole: "Principal Engineer",
    timestamp: "2024-06-11T16:55:00Z",
    details: "Digital signature applied to Noise Impact Study. Certification complete.",
    category: "filing",
    metadata: { document: "Noise Impact Study", signatureType: "Digital", certLevel: "PE" },
  },
  {
    id: "ae-006",
    projectId: "proj-001",
    action: "Review Comment Added",
    actor: "Sarah Chen",
    actorRole: "Senior Consultant",
    timestamp: "2024-06-11T15:20:00Z",
    details: "Added 4 review comments to Biological Resources Report. Flagged Section 3.2 for revision.",
    category: "review",
    metadata: { document: "Biological Resources Report", comments: "4", section: "3.2" },
  },
  {
    id: "ae-007",
    projectId: "proj-001",
    action: "Stage Advanced",
    actor: "Marcus Webb",
    actorRole: "Project Manager",
    timestamp: "2024-06-11T14:00:00Z",
    details: "Project advanced from 'Anchor Sources' to 'Cross-check' stage.",
    category: "system",
    metadata: { fromStage: "Anchor Sources", toStage: "Cross-check" },
  },
  {
    id: "ae-008",
    projectId: "proj-001",
    action: "Source Anchored",
    actor: "Priya Nair",
    actorRole: "Environmental Analyst",
    timestamp: "2024-06-11T11:30:00Z",
    details: "EPA Method 8260B cited and anchored to 3 claims in Groundwater Assessment.",
    category: "document",
    metadata: { document: "Groundwater Assessment", source: "EPA Method 8260B", claims: "3" },
  },
  {
    id: "ae-009",
    projectId: "proj-001",
    action: "User Invited",
    actor: "Marcus Webb",
    actorRole: "Project Manager",
    timestamp: "2024-06-10T09:45:00Z",
    details: "Dr. James Okafor invited to project as Principal Engineer.",
    category: "user",
    metadata: { invitedUser: "Dr. James Okafor", role: "Principal Engineer", email: "j.okafor@firm.com" },
  },
  {
    id: "ae-010",
    projectId: "proj-001",
    action: "Document Version Created",
    actor: "Priya Nair",
    actorRole: "Environmental Analyst",
    timestamp: "2024-06-10T08:20:00Z",
    details: "New version v2.0 of Air Quality Impact Assessment created after major revision.",
    category: "document",
    metadata: { document: "Air Quality Impact Assessment", version: "v2.0", previousVersion: "v1.3" },
  },
  {
    id: "ae-011",
    projectId: "proj-001",
    action: "Deep Review Initiated",
    actor: "AI Engine",
    actorRole: "System",
    timestamp: "2024-06-09T17:10:00Z",
    details: "AI deep review completed for Biological Resources Report. 12 improvement suggestions generated.",
    category: "system",
    metadata: { document: "Biological Resources Report", suggestions: "12", scoreImprovement: "+4.2" },
  },
  {
    id: "ae-012",
    projectId: "proj-001",
    action: "Submission Acknowledged",
    actor: "EPA Region 9",
    actorRole: "Regulator",
    timestamp: "2024-06-09T14:00:00Z",
    details: "Submission receipt acknowledged by EPA Region 9. Reference number assigned.",
    category: "submission",
    metadata: { agency: "EPA Region 9", referenceNo: "EPA-R9-2024-0892", receivedAt: "2024-06-09" },
  },
  {
    id: "ae-013",
    projectId: "proj-001",
    action: "Package Submitted",
    actor: "Marcus Webb",
    actorRole: "Project Manager",
    timestamp: "2024-06-09T13:30:00Z",
    details: "Filing package PKG-2024-0609 submitted to EPA Region 9 via electronic portal.",
    category: "submission",
    metadata: { packageId: "PKG-2024-0609", agency: "EPA Region 9", method: "Electronic Portal" },
  },
  {
    id: "ae-014",
    projectId: "proj-001",
    action: "Project Created",
    actor: "Marcus Webb",
    actorRole: "Project Manager",
    timestamp: "2024-06-08T09:00:00Z",
    details: "Project 'Riverside Industrial Expansion EIR' created. Initial stage: Capture.",
    category: "system",
    metadata: { agency: "EPA Region 9", deadline: "2024-07-15", stage: "Capture" },
  },
  {
    id: "ae-015",
    projectId: "proj-001",
    action: "Edit Accepted",
    actor: "Sarah Chen",
    actorRole: "Senior Consultant",
    timestamp: "2024-06-08T11:45:00Z",
    details: "Accepted 6 of 12 AI-suggested edits in Noise Impact Study. Readiness improved to 89.",
    category: "review",
    metadata: { document: "Noise Impact Study", accepted: "6", rejected: "6", newScore: "89" },
  },
];

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  AuditCategory,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  document: {
    label: "Document",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  filing: {
    label: "Filing",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    icon: <Layers className="h-3.5 w-3.5" />,
  },
  review: {
    label: "Review",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <Eye className="h-3.5 w-3.5" />,
  },
  system: {
    label: "System",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    icon: <Activity className="h-3.5 w-3.5" />,
  },
  user: {
    label: "User",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: <User className="h-3.5 w-3.5" />,
  },
  submission: {
    label: "Submission",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: <Send className="h-3.5 w-3.5" />,
  },
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  "Document Approved": <CheckCircle className="h-4 w-4 text-emerald-600" />,
  "Filing Package Locked": <Lock className="h-4 w-4 text-indigo-600" />,
  "Cross-check Completed": <RefreshCw className="h-4 w-4 text-slate-500" />,
  "Document Uploaded": <Upload className="h-4 w-4 text-blue-600" />,
  "Signature Added": <Shield className="h-4 w-4 text-indigo-600" />,
  "Review Comment Added": <Edit className="h-4 w-4 text-amber-600" />,
  "Stage Advanced": <ChevronRight className="h-4 w-4 text-slate-500" />,
  "Source Anchored": <Plus className="h-4 w-4 text-blue-600" />,
  "User Invited": <User className="h-4 w-4 text-purple-600" />,
  "Document Version Created": <FileText className="h-4 w-4 text-blue-600" />,
  "Deep Review Initiated": <Activity className="h-4 w-4 text-slate-500" />,
  "Submission Acknowledged": <CheckCircle className="h-4 w-4 text-emerald-600" />,
  "Package Submitted": <Send className="h-4 w-4 text-emerald-600" />,
  "Project Created": <Plus className="h-4 w-4 text-blue-600" />,
  "Edit Accepted": <CheckCircle className="h-4 w-4 text-emerald-600" />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateKey(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

function groupByDate(entries: AuditEntry[]): Record<string, AuditEntry[]> {
  const groups: Record<string, AuditEntry[]> = {};
  for (const entry of entries) {
    const key = formatDateKey(entry.timestamp);
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}

function getInitials(name: string): string {
  return (name ?? "")
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS: Record<string, string> = {
  "Sarah Chen": "bg-rose-100 text-rose-700",
  "Marcus Webb": "bg-blue-100 text-blue-700",
  "Priya Nair": "bg-violet-100 text-violet-700",
  "Dr. James Okafor": "bg-amber-100 text-amber-700",
  "AI Engine": "bg-slate-100 text-slate-600",
  "EPA Region 9": "bg-emerald-100 text-emerald-700",
};

function avatarColor(actor: string): string {
  return AVATAR_COLORS[actor] ?? "bg-slate-100 text-slate-600";
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariant}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className={`rounded-lg p-1.5 ${color}`}>{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </motion.div>
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: AuditCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bgColor} ${cfg.borderColor}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Metadata Row ─────────────────────────────────────────────────────────────

function MetadataRow({ data }: { data: Record<string, string> }) {
  const entries = Object.entries(data ?? {});
  if (entries.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 border border-slate-100"
        >
          <span className="font-medium text-slate-400">{k}:</span>
          {v}
        </span>
      ))}
    </div>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────

function TimelineEntry({
  entry,
  isLast,
}: {
  entry: AuditEntry;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const icon = ACTION_ICONS[entry.action] ?? <Clock className="h-4 w-4 text-slate-400" />;

  return (
    <motion.div
      variants={itemVariant}
      className="relative flex gap-4"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-100" />
      )}

      {/* Icon bubble */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-6px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{entry.action}</span>
              <CategoryBadge category={entry.category} />
            </div>
            <span className="text-xs text-slate-400 tabular-nums">{formatTime(entry.timestamp)}</span>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{entry.details}</p>

          {/* Actor */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${avatarColor(entry.actor)}`}
            >
              {getInitials(entry.actor)}
            </div>
            <span className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">{entry.actor}</span>
              {" · "}
              {entry.actorRole}
            </span>
          </div>

          {/* Metadata toggle */}
          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
                {expanded ? "Hide" : "Show"} details
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
                    <MetadataRow data={entry.metadata} />
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

// ─── Date Group ───────────────────────────────────────────────────────────────

function DateGroup({ dateKey, entries }: { dateKey: string; entries: AuditEntry[] }) {
  const label = formatDate(dateKey + "T12:00:00Z");
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">{label}</span>
        </div>
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs text-slate-400">{entries.length} {entries.length === 1 ? "event" : "events"}</span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="space-y-0"
      >
        {entries.map((entry, idx) => (
          <TimelineEntry key={entry.id} entry={entry} isLast={idx === entries.length - 1} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: AuditCategory[] = ["document", "filing", "review", "system", "user", "submission"];

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | "all">("all");
  const [selectedActor, setSelectedActor] = useState<string>("all");

  const actors = useMemo(() => {
    const set = new Set(MOCK_AUDIT_ENTRIES.map((e) => e.actor));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_AUDIT_ENTRIES.filter((entry) => {
      const matchesSearch =
        search.trim() === "" ||
        entry.action.toLowerCase().includes(search.toLowerCase()) ||
        entry.details.toLowerCase().includes(search.toLowerCase()) ||
        entry.actor.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || entry.category === selectedCategory;
      const matchesActor =
        selectedActor === "all" || entry.actor === selectedActor;
      return matchesSearch && matchesCategory && matchesActor;
    });
  }, [search, selectedCategory, selectedActor]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const sortedDateKeys = useMemo(
    () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
    [grouped]
  );

  // Stats
  const totalEvents = MOCK_AUDIT_ENTRIES.length;
  const submissionEvents = MOCK_AUDIT_ENTRIES.filter((e) => e.category === "submission").length;
  const systemEvents = MOCK_AUDIT_ENTRIES.filter((e) => e.category === "system").length;
  const uniqueActors = new Set(MOCK_AUDIT_ENTRIES.map((e) => e.actor)).size;

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
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                <span>Riverside Industrial Expansion EIR</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-slate-700">Audit Trail</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Audit Trail
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                A complete, immutable record of every action taken on this project.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
              <Download className="h-4 w-4" />
              Export Log
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <StatCard
            label="Total Events"
            value={totalEvents}
            icon={<Activity className="h-4 w-4" />}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Submissions"
            value={submissionEvents}
            icon={<Send className="h-4 w-4" />}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="System Actions"
            value={systemEvents}
            icon={<RefreshCw className="h-4 w-4" />}
            color="bg-slate-100 text-slate-600"
          />
          <StatCard
            label="Contributors"
            value={uniqueActors}
            icon={<User className="h-4 w-4" />}
            color="bg-purple-50 text-purple-600"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions, actors, details..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AuditCategory | "all")}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Actor filter */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="all">All Actors</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Result count */}
          <span className="text-xs text-slate-400 ml-auto">
            {filtered.length} of {totalEvents} events
          </span>
        </motion.div>

        {/* Category legend */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8 flex flex-wrap gap-2"
        >
          {ALL_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? "all" : cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? `${cfg.color} ${cfg.bgColor} ${cfg.borderColor} shadow-sm`
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}
        </motion.div>

        {/* Timeline */}
        {sortedDateKeys.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center"
          >
            <AlertCircle className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No events match your filters</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your search or category selection.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedActor("all");
              }}
              className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {sortedDateKeys.map((dateKey) => (
              <DateGroup key={dateKey} dateKey={dateKey} entries={grouped[dateKey] ?? []} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-400"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>This audit log is immutable. No entries can be modified or deleted.</span>
        </motion.div>
      </div>
    </div>
  );
}