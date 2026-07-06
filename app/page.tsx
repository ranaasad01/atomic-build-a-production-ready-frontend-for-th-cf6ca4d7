"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  QUALITY_BANDS,
  FILING_STAGES,
} from "@/lib/data";
import { ArrowRight, CheckCircle, FileText, Shield, Zap, Users, BarChart2, Clock, Star, ChevronRight, Activity, Layers, Search, Lock } from 'lucide-react';

// ─── Inline mock data ────────────────────────────────────────────────────────

const features = [
  {
    icon: Layers,
    title: "Seven-Stage Filing Workflow",
    description:
      "Guide every project from raw capture through final submission with a structured, auditable pipeline that keeps your team aligned.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Activity,
    title: "Live Readiness Scoring",
    description:
      "Every document carries a real-time readiness score mapped to four quality bands. Know exactly where you stand before the regulator does.",
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Search,
    title: "AI Cross-Check Engine",
    description:
      "Automatically surface unsourced claims, conflicting data, and missing citations across your entire filing package in seconds.",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: Shield,
    title: "Immutable Audit Trail",
    description:
      "Every edit, approval, and submission is logged with actor, timestamp, and context. Nothing is ever permanently deleted.",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Context Manager",
    description:
      "Centralize guidance documents, key numbers, agency contacts, studies, and procedures so your team always references the right source.",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    icon: Lock,
    title: "Locked Filing Packages",
    description:
      "Certify, sign, lock, and submit packages with a cryptographic snapshot. Regulators receive a tamper-evident record every time.",
    accent: "bg-rose-50 text-rose-600",
  },
];

const workflowSteps = [
  {
    stage: "Capture",
    description: "Import documents, assign authors, and set target quality bands.",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  {
    stage: "Review",
    description: "Structured peer review with inline comments and version tracking.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    stage: "Anchor Sources",
    description: "Attach citations to every claim. AI flags anything unsourced.",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  {
    stage: "Cross-check",
    description: "Automated consistency scan across the full package.",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  {
    stage: "Improve Quality",
    description: "Accept AI suggestions, resolve flags, and push scores higher.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    stage: "Assemble Package",
    description: "Generate the final filing package with a section readiness grid.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    stage: "File & Track",
    description: "Submit, acknowledge receipt, and monitor regulator response.",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
];

const testimonials = [
  {
    quote:
      "FilingDesk cut our CEQA package preparation time by 40%. The readiness scoring alone saved us from two near-misses with the state agency.",
    name: "Dr. Mara Okonkwo",
    role: "Senior Environmental Consultant",
    company: "Meridian Environmental Group",
    initials: "MO",
    color: "bg-blue-600",
  },
  {
    quote:
      "We manage permits across six counties. Having every guidance document, key number, and agency contact in one place is a game-changer for our team.",
    name: "James Whitfield",
    role: "Permit Manager",
    company: "Pacific Basin Engineering",
    initials: "JW",
    color: "bg-indigo-600",
  },
  {
    quote:
      "The audit trail gives our clients confidence. When a regulator asks who changed what and when, we have a complete, immutable answer in seconds.",
    name: "Sofia Reyes",
    role: "Principal Engineer",
    company: "Clearwater Compliance Partners",
    initials: "SR",
    color: "bg-emerald-600",
  },
];

const stats = [
  { value: "40%", label: "Faster package preparation", icon: Zap },
  { value: "98%", label: "First-submission acceptance rate", icon: CheckCircle },
  { value: "12k+", label: "Documents filed successfully", icon: FileText },
  { value: "300+", label: "Firms trust FilingDesk", icon: Users },
];

const qualityBandData = [
  {
    label: "Research",
    range: "82–85",
    description: "Early-stage drafts. Significant gaps remain.",
    color: "bg-amber-400",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    width: "w-[55%]",
  },
  {
    label: "Working",
    range: "85–88",
    description: "Progressing toward filing readiness.",
    color: "bg-blue-400",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    width: "w-[70%]",
  },
  {
    label: "Filing",
    range: "90–93",
    description: "Meets submission standards.",
    color: "bg-indigo-500",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    width: "w-[85%]",
  },
  {
    label: "Regulator",
    range: "95+",
    description: "Exceeds regulator expectations.",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    width: "w-full",
  },
];

const faqs = [
  {
    q: "Who is FilingDesk built for?",
    a: "Environmental consultants, engineering firms, and permit managers who prepare regulatory filing packages for state and federal agencies.",
  },
  {
    q: "How does readiness scoring work?",
    a: "Each document is scored across sourcing completeness, review status, cross-check results, and quality band targets. The project score is a weighted aggregate.",
  },
  {
    q: "Is the audit trail tamper-proof?",
    a: "Yes. Every action is appended to an immutable log with actor identity, timestamp, and full context. Records are never modified or deleted.",
  },
  {
    q: "Can I use FilingDesk for multiple agencies?",
    a: "Absolutely. Each project is scoped to an agency, and the Context Manager lets you maintain separate guidance sets, contacts, and procedures per project.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function ReadinessRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 95
      ? "#10b981"
      : score >= 90
      ? "#6366f1"
      : score >= 85
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
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MockProjectCard({
  name,
  agency,
  score,
  status,
  docs,
  deadline,
  stage,
}: {
  name: string;
  agency: string;
  score: number;
  status: string;
  docs: number;
  deadline: string;
  stage: string;
}) {
  const statusColors: Record<string, string> = {
    Active: "bg-blue-50 text-blue-700 border-blue-200",
    "In Review": "bg-amber-50 text-amber-700 border-amber-200",
    "Filing Ready": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Submitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const cls = statusColors[status] ?? "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{agency}</p>
        </div>
        <div className="relative flex-shrink-0">
          <ReadinessRing score={score} size={48} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
            {score}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}
        >
          {status}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          {docs} docs
        </span>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="font-medium text-slate-700">{stage}</span>
          <span>Due {deadline}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Subtle grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-60"
        />
        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-blue-50 opacity-60 blur-3xl"
        />

        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-xl"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700" style={{ color: "#ef4444" }} >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Built for environmental compliance teams
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="mt-5 text-4xl font-bold tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
              >
                Regulatory filings that{" "}
                <span className="text-blue-600">reach the regulator ready.</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-5 text-lg leading-relaxed text-slate-600 text-pretty"
              >
                {APP_DESCRIPTION}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/projects/proj-001"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Open a project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects/proj-001/filing"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  See filing workflow
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500"
              >
                {["No credit card required", "SOC 2 Type II", "HIPAA-ready"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      {item}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>

            {/* Right: mock UI */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInRight}
              className="relative"
            >
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Mock toolbar */}
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-slate-400">
                    FilingDesk — Projects Dashboard
                  </span>
                </div>

                {/* Mock project cards */}
                <div className="grid grid-cols-2 gap-3 p-4">
                  <MockProjectCard
                    name="Bayshore CEQA EIR"
                    agency="California DTSC"
                    score={91}
                    status="Filing Ready"
                    docs={14}
                    deadline="Mar 15"
                    stage="Assemble Package"
                  />
                  <MockProjectCard
                    name="Ridgeline Air Permit"
                    agency="BAAQMD"
                    score={87}
                    status="In Review"
                    docs={9}
                    deadline="Apr 2"
                    stage="Cross-check"
                  />
                  <MockProjectCard
                    name="Delta Wetlands 404"
                    agency="US Army Corps"
                    score={96}
                    status="Submitted"
                    docs={22}
                    deadline="Feb 28"
                    stage="File & Track"
                  />
                  <MockProjectCard
                    name="Eastport Stormwater"
                    agency="Regional RWQCB"
                    score={83}
                    status="Active"
                    docs={6}
                    deadline="May 10"
                    stage="Anchor Sources"
                  />
                </div>

                {/* Mock readiness bar */}
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      Portfolio readiness
                    </span>
                    <span className="font-semibold text-blue-600">89.3 avg</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: "89.3%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                className="absolute -bottom-4 -left-4 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Package accepted
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Delta Wetlands 404 — US Army Corps
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 divide-x divide-y divide-slate-200 md:grid-cols-4 md:divide-y-0"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="flex flex-col items-center gap-2 px-6 py-8 text-center"
                >
                  <Icon className="h-5 w-5 text-blue-500" />
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-sm text-slate-500">{stat.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Quality Bands ─────────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: bands visual */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.1)]">
                <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quality Band System
                </p>
                <div className="space-y-4">
                  {qualityBandData.map((band) => (
                    <div key={band.label}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${band.textColor} ${band.bgColor} ${band.borderColor}`}
                          >
                            {band.label}
                          </span>
                          <span className="text-xs text-slate-500">
                            {band.range}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {band.description}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${band.color} ${band.width} transition-all duration-700`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock document row */}
                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Air Quality Impact Assessment
                        </p>
                        <p className="text-[10px] text-slate-500">
                          3 unsourced claims
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                        Filing
                      </span>
                      <div className="relative">
                        <ReadinessRing score={91} size={36} />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
                          91
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInRight}
              className="order-1 lg:order-2"
            >
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Readiness scoring
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
                Know your filing quality before the regulator does.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Every document in FilingDesk carries a live readiness score mapped
                to four quality bands. Research, Working, Filing, and Regulator
                grade. Your team always knows the gap between where a document is
                and where it needs to be.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Scores update in real time as you edit and source claims",
                  "Target band is set per document, not per project",
                  "Bulk readiness view across the entire filing package",
                  "Regulator-grade threshold enforced before package lock",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/projects/proj-001"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  See it in the workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Workflow stages ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Seven-stage pipeline
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
              A structured path from raw draft to filed package.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              FilingDesk enforces a proven workflow so nothing slips through the
              cracks. Each stage has clear entry criteria, automated checks, and a
              readiness gate before you advance.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {workflowSteps.map((step, i) => (
              <motion.div
                key={step.stage}
                variants={scaleIn}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`relative rounded-xl border p-5 ${step.color} transition-shadow duration-300 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${step.dot}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {step.stage}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="mt-10 text-center"
          >
            <Link
              href="/projects/proj-001/filing"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
            >
              Explore the filing stepper
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              Platform capabilities
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Everything a compliance team needs, nothing it does not.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.12)]"
                >
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="about" className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Customer stories
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Trusted by the teams who file the hardest packages.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.12)]"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
            >
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                Common questions
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 text-balance sm:text-4xl">
                Answers to the questions your team will ask.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                FilingDesk is purpose-built for regulatory compliance workflows.
                Here are the questions we hear most from new teams.
              </p>
              <div className="mt-8">
                <Link
                  href="/projects/proj-001"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                >
                  Start your first project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {faqs.map((faq) => (
                <motion.div
                  key={faq.q}
                  variants={fadeInUp}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-slate-900">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-blue-600 py-20 md:py-28">
        {/* Subtle pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-blue-500 opacity-30 blur-3xl"
        />

        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl"
            >
              Your next filing package deserves a better process.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg leading-relaxed text-blue-100"
            >
              Join over 300 environmental and engineering firms that use
              FilingDesk to prepare, review, and submit regulatory packages with
              confidence.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/projects/proj-001"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md"
              >
                Open the workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects/proj-001/audit"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-400 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-blue-300 hover:bg-blue-500"
              >
                View audit trail
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-xs text-blue-200"
            >
              No credit card required. Full access to all features during trial.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}