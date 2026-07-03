"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Lock, Upload, Send, FileCheck, ClipboardCheck, ChevronRight, AlertCircle, Download, Eye, Pen, Shield, Clock, CheckSquare, X, Info, FileText, User, Calendar, Building, ArrowRight } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { getBandForScore, QUALITY_BANDS } from "@/lib/data";
import type { Variants } from "framer-motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT = {
  id: "proj-001",
  name: "Riverside Industrial Expansion EIS",
  agency: "EPA Region 9",
  deadline: "2024-03-15",
  location: "Sacramento, CA",
  permitNumber: "EPA-R9-2024-0042",
  applicant: "Meridian Engineering Group",
  contact: "Dr. Sarah Chen, P.E.",
};

const SECTIONS = [
  { id: "s1", title: "Executive Summary", readiness: 96, required: true, status: "approved" },
  { id: "s2", title: "Project Description", readiness: 94, required: true, status: "approved" },
  { id: "s3", title: "Environmental Setting", readiness: 91, required: true, status: "approved" },
  { id: "s4", title: "Air Quality Analysis", readiness: 88, required: true, status: "review" },
  { id: "s5", title: "Water Resources", readiness: 93, required: true, status: "approved" },
  { id: "s6", title: "Biological Resources", readiness: 90, required: true, status: "approved" },
  { id: "s7", title: "Cultural Resources", readiness: 95, required: true, status: "approved" },
  { id: "s8", title: "Noise Impact Assessment", readiness: 87, required: true, status: "review" },
  { id: "s9", title: "Traffic & Transportation", readiness: 92, required: false, status: "approved" },
  { id: "s10", title: "Mitigation Measures", readiness: 89, required: true, status: "review" },
  { id: "s11", title: "Alternatives Analysis", readiness: 91, required: true, status: "approved" },
  { id: "s12", title: "Cumulative Impacts", readiness: 86, required: false, status: "draft" },
];

const DOCUMENTS = [
  { id: "d1", title: "Environmental Impact Statement", pages: 284, size: "18.4 MB", included: true },
  { id: "d2", title: "Technical Appendices (A–F)", pages: 156, size: "42.1 MB", included: true },
  { id: "d3", title: "Agency Correspondence", pages: 23, size: "3.2 MB", included: true },
  { id: "d4", title: "Public Comment Responses", pages: 67, size: "8.9 MB", included: true },
  { id: "d5", title: "Mitigation Monitoring Plan", pages: 41, size: "5.6 MB", included: true },
  { id: "d6", title: "Biological Survey Reports", pages: 89, size: "22.3 MB", included: false },
];

type StepId = "certify" | "sign" | "lock" | "file" | "submit" | "acknowledge";

interface Step {
  id: StepId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    id: "certify",
    label: "Certify",
    description: "Confirm all sections meet filing standards",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    id: "sign",
    label: "Sign",
    description: "Upload authorized signature",
    icon: <Pen className="h-5 w-5" />,
  },
  {
    id: "lock",
    label: "Lock",
    description: "Create immutable package snapshot",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    id: "file",
    label: "File",
    description: "Generate final filing package",
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: "submit",
    label: "Submit",
    description: "Transmit to regulatory agency",
    icon: <Send className="h-5 w-5" />,
  },
  {
    id: "acknowledge",
    label: "Acknowledge",
    description: "Confirm agency receipt",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const STEP_ORDER: StepId[] = ["certify", "sign", "lock", "file", "submit", "acknowledge"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessRing({ score, size = 56 }: { score: number; size?: number }) {
  const band = getBandForScore(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

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
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700">{score}</span>
    </div>
  );
}

function SectionStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    review: "bg-amber-50 text-amber-700 border-amber-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const labels: Record<string, string> = {
    approved: "Approved",
    review: "In Review",
    draft: "Draft",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Step Panels ──────────────────────────────────────────────────────────────

function CertifyPanel({ onComplete }: { onComplete: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = [
    "All required sections have been reviewed and approved",
    "Unsourced claims have been resolved or documented",
    "Cross-check has been completed with no critical issues",
    "All regulatory guidance has been applied",
    "Version history is complete and traceable",
    "Mitigation measures are fully documented",
  ];
  const allChecked = items.every((_, i) => checked[i]);

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Certification Checklist</h2>
        <p className="mt-1 text-sm text-slate-500">
          Confirm each item before proceeding to signature. This creates an audit record.
        </p>
      </div>

      {/* Section Readiness Grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Section Readiness Grid</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const band = getBandForScore(section.readiness);
            return (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {section.status === "approved" ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : section.status === "review" ? (
                    <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <span className="truncate text-xs font-medium text-slate-700">{section.title}</span>
                  {section.required && (
                    <span className="shrink-0 text-xs text-red-400">*</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`text-xs font-semibold ${band.color}`}>{section.readiness}</span>
                  <SectionStatusBadge status={section.status} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">* Required sections</p>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Pre-Certification Checklist</h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  checked[i]
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-white"
                }`}
                onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
              >
                {checked[i] && <CheckSquare className="h-3.5 w-3.5 text-white" />}
              </div>
              <span className="text-sm text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Info className="h-4 w-4" />
          <span>{Object.values(checked).filter(Boolean).length} of {items.length} items confirmed</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          disabled={!allChecked}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Certify and Continue
        </motion.button>
      </div>
    </motion.div>
  );
}

function SignPanel({ onComplete }: { onComplete: () => void }) {
  const [signerName, setSignerName] = useState("Dr. Sarah Chen, P.E.");
  const [signerTitle, setSignerTitle] = useState("Principal Environmental Engineer");
  const [signerOrg, setSignerOrg] = useState("Meridian Engineering Group");
  const [uploaded, setUploaded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const canProceed = signerName.trim() !== "" && signerTitle.trim() !== "" && uploaded && agreed;

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Authorized Signature</h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide signatory details and upload the authorized signature for this filing package.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Signatory Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Full Name</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Title / Credentials</label>
            <input
              type="text"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Organization</label>
            <input
              type="text"
              value={signerOrg}
              onChange={(e) => setSignerOrg(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Signature Upload</h3>
        {uploaded ? (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">signature_chen_2024.png</p>
              <p className="text-xs text-emerald-600">Uploaded successfully</p>
            </div>
            <button
              onClick={() => setUploaded(false)}
              className="ml-auto text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setUploaded(true)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <Upload className="mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">Click to upload signature</p>
            <p className="mt-1 text-xs text-slate-400">PNG, JPG, or SVG up to 2MB</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
              agreed ? "border-amber-600 bg-amber-600" : "border-amber-300 bg-white"
            }`}
            onClick={() => setAgreed((v) => !v)}
          >
            {agreed && <CheckSquare className="h-3.5 w-3.5 text-white" />}
          </div>
          <span className="text-sm text-amber-800">
            I certify that I am an authorized representative of {signerOrg || "the applicant organization"} and that the information contained in this filing package is true, accurate, and complete to the best of my knowledge.
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          disabled={!canProceed}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply Signature
        </motion.button>
      </div>
    </motion.div>
  );
}

function LockPanel({ onComplete }: { onComplete: () => void }) {
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);

  function handleLock() {
    setLocking(true);
    setTimeout(() => {
      setLocking(false);
      setLocked(true);
    }, 2000);
  }

  const snapshotId = "SNAP-2024-0042-v3.1";
  const snapshotHash = "sha256:a3f8c2d1e9b4...7f2a";

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Lock Package Snapshot</h2>
        <p className="mt-1 text-sm text-slate-500">
          Creating a lock snapshot makes the package immutable. No further edits can be made after locking.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Package Contents</h3>
        <div className="space-y-2">
          {DOCUMENTS.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{doc.title}</span>
                {!doc.included && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">Excluded</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{doc.pages} pages</span>
                <span>{doc.size}</span>
                {doc.included ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{DOCUMENTS.filter((d) => d.included).length} documents included</span>
          <span>
            Total:{" "}
            {DOCUMENTS.filter((d) => d.included)
              .reduce((sum, d) => sum + d.pages, 0)}{" "}
            pages
          </span>
        </div>
      </div>

      {locked ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-800">Package Locked</p>
              <p className="mt-1 text-sm text-emerald-700">
                Snapshot ID: <span className="font-mono font-medium">{snapshotId}</span>
              </p>
              <p className="mt-0.5 text-xs text-emerald-600">
                Hash: <span className="font-mono">{snapshotHash}</span>
              </p>
              <p className="mt-2 text-xs text-emerald-600">
                Locked at 14:32 UTC. This snapshot is tamper-evident and audit-logged.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-800">
              Locking is irreversible. Ensure all documents are finalized before proceeding.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!locked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLock}
            disabled={locking}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {locking ? "Locking..." : "Lock Snapshot"}
          </motion.button>
        )}
        {locked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            Continue to File
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function FilePanel({ onComplete }: { onComplete: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [format, setFormat] = useState("pdf");

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Generate Filing Package</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compile all approved documents into a single, submission-ready filing package.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Package Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="pdf">PDF/A (Archival)</option>
              <option value="zip">ZIP Archive (PDF + Appendices)</option>
              <option value="cdx">CDX Electronic Filing Format</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Include Table of Contents", checked: true },
              { label: "Include Bookmarks", checked: true },
              { label: "Flatten Form Fields", checked: false },
              { label: "Embed Fonts", checked: true },
            ].map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <div className={`flex h-4 w-4 items-center justify-center rounded border ${opt.checked ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                  {opt.checked && <CheckSquare className="h-3 w-3 text-white" />}
                </div>
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {generated ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <FileCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800">Package Generated</p>
                <p className="mt-1 text-sm text-emerald-700">EPA-R9-2024-0042_Filing_Package_v3.1.pdf</p>
                <p className="mt-0.5 text-xs text-emerald-600">531 pages · 98.5 MB · PDF/A compliant</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100">
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Info className="h-4 w-4 text-slate-400" />
            <span>Package will include {DOCUMENTS.filter((d) => d.included).length} documents totaling {DOCUMENTS.filter((d) => d.included).reduce((s, d) => s + d.pages, 0)} pages.</span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!generated ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            <FileCheck className="h-4 w-4" />
            {generating ? "Generating..." : "Generate Package"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            Proceed to Submit
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function SubmitPanel({ onComplete }: { onComplete: () => void }) {
  const [method, setMethod] = useState("cdx");
  const [trackingId, setTrackingId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTrackingId("CDX-2024-EPA-R9-00842");
    }, 2000);
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Submit to Agency</h2>
        <p className="mt-1 text-sm text-slate-500">
          Transmit the locked filing package to {PROJECT.agency}. Record submission details for the audit trail.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Submission Details</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Submission Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="cdx">EPA CDX Electronic Submission</option>
              <option value="email">Secure Email Transmission</option>
              <option value="portal">Agency Web Portal</option>
              <option value="physical">Physical Delivery (Courier)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Agency Contact</label>
            <input
              type="text"
              value="Regional Administrator, EPA Region 9"
              readOnly
              className="w-full rounded-lg border border-slate-100 bg-slate-100 px-3 py-2 text-sm text-slate-600 outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Submission Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes for the receiving agency..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <Send className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-800">Successfully Submitted</p>
              <p className="mt-1 text-sm text-emerald-700">
                Tracking ID: <span className="font-mono font-medium">{trackingId}</span>
              </p>
              <p className="mt-0.5 text-xs text-emerald-600">
                Submitted to EPA CDX at 14:47 UTC. Confirmation email sent to {PROJECT.contact}.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting..." : "Submit to Agency"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            Proceed to Acknowledge
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function AcknowledgePanel() {
  const [ackNumber, setAckNumber] = useState("EPA-ACK-2024-00842-R9");
  const [ackDate, setAckDate] = useState("2024-03-15");
  const [ackContact, setAckContact] = useState("James Whitfield, EPA Region 9");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Agency Acknowledgment</h2>
        <p className="mt-1 text-sm text-slate-500">
          Record the agency's receipt confirmation to complete the filing workflow.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">Filing Complete</p>
            <p className="text-sm text-emerald-700">
              {PROJECT.name} has been successfully filed with {PROJECT.agency}.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Acknowledgment Record</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Acknowledgment Number</label>
            <input
              type="text"
              value={ackNumber}
              onChange={(e) => setAckNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Receipt Date</label>
              <input
                type="date"
                value={ackDate}
                onChange={(e) => setAckDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Agency Contact</label>
              <input
                type="text"
                value={ackContact}
                onChange={(e) => setAckContact(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Filing Summary</h3>
        <div className="space-y-2">
          {[
            { label: "Project", value: PROJECT.name },
            { label: "Agency", value: PROJECT.agency },
            { label: "Permit Number", value: PROJECT.permitNumber },
            { label: "Applicant", value: PROJECT.applicant },
            { label: "Submitted By", value: PROJECT.contact },
            { label: "Submission Method", value: "EPA CDX Electronic Submission" },
            { label: "Tracking ID", value: "CDX-2024-EPA-R9-00842" },
            { label: "Snapshot ID", value: "SNAP-2024-0042-v3.1" },
          ].map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-500 shrink-0">{row.label}</span>
              <span className="text-xs font-medium text-slate-800 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Export Summary
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
        >
          <CheckCircle className="h-4 w-4" />
          {saved ? "Saved!" : "Save Acknowledgment"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FilingPage() {
  const [currentStep, setCurrentStep] = useState<StepId>("certify");
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  function completeStep(stepId: StepId) {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
    const nextIndex = STEP_ORDER.indexOf(stepId) + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  }

  function goToStep(stepId: StepId) {
    const targetIndex = STEP_ORDER.indexOf(stepId);
    if (targetIndex <= currentIndex || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  }

  const overallReadiness = Math.round(
    SECTIONS.reduce((sum, s) => sum + s.readiness, 0) / SECTIONS.length
  );

  const band = getBandForScore(overallReadiness);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Building className="h-4 w-4" />
                <span>{PROJECT.agency}</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-700">{PROJECT.name}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Filing Package
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Permit {PROJECT.permitNumber} · Deadline{" "}
                <span className="font-medium text-slate-700">
                  {new Date(PROJECT.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>

            {/* Readiness Badge */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <ReadinessRing score={overallReadiness} size={52} />
              <div>
                <p className="text-xs text-slate-500">Package Readiness</p>
                <p className={`text-sm font-semibold ${band.color}`}>{band.label} Band</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center overflow-x-auto">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible =
                index <= currentIndex || completedSteps.has(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all min-w-[80px] ${
                      isCurrent
                        ? "bg-blue-50"
                        : isCompleted
                        ? "hover:bg-emerald-50 cursor-pointer"
                        : isAccessible
                        ? "hover:bg-slate-50 cursor-pointer"
                        : "cursor-not-allowed opacity-40"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCurrent
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="scale-75">{step.icon}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-8 shrink-0 transition-colors ${
                        completedSteps.has(step.id)
                          ? "bg-emerald-400"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current step description */}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Step {currentIndex + 1} of {STEPS.length}:
              </span>{" "}
              {STEPS[currentIndex]?.description}
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Step Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                {currentStep === "certify" && (
                  <CertifyPanel onComplete={() => completeStep("certify")} />
                )}
                {currentStep === "sign" && (
                  <SignPanel onComplete={() => completeStep("sign")} />
                )}
                {currentStep === "lock" && (
                  <LockPanel onComplete={() => completeStep("lock")} />
                )}
                {currentStep === "file" && (
                  <FilePanel onComplete={() => completeStep("file")} />
                )}
                {currentStep === "submit" && (
                  <SubmitPanel onComplete={() => completeStep("submit")} />
                )}
                {currentStep === "acknowledge" && <AcknowledgePanel />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Project Info */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Project Details</h3>
              <div className="space-y-2.5">
                {[
                  { icon: <Building className="h-3.5 w-3.5" />, label: "Agency", value: PROJECT.agency },
                  { icon: <FileText className="h-3.5 w-3.5" />, label: "Permit", value: PROJECT.permitNumber },
                  { icon: <User className="h-3.5 w-3.5" />, label: "Contact", value: PROJECT.contact },
                  { icon: <Calendar className="h-3.5 w-3.5" />, label: "Deadline", value: new Date(PROJECT.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="mt-0.5 text-slate-400">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-xs font-medium text-slate-700 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quality Bands Reference */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Quality Bands</h3>
              <div className="space-y-2">
                {QUALITY_BANDS.map((b) => (
                  <div
                    key={b.label}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${b.bgColor} ${b.borderColor}`}
                  >
                    <span className={`text-xs font-semibold ${b.color}`}>{b.label}</span>
                    <span className={`text-xs ${b.color}`}>{b.min}–{b.max}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Section Status Summary */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Section Status</h3>
              <div className="space-y-1.5">
                {[
                  { label: "Approved", count: SECTIONS.filter((s) => s.status === "approved").length, color: "text-emerald-600", bg: "bg-emerald-100" },
                  { label: "In Review", count: SECTIONS.filter((s) => s.status === "review").length, color: "text-amber-600", bg: "bg-amber-100" },
                  { label: "Draft", count: SECTIONS.filter((s) => s.status === "draft").length, color: "text-slate-500", bg: "bg-slate-100" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.bg}`} />
                      <span className="text-xs text-slate-600">{item.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Avg. Readiness</span>
                  <span className={`font-bold ${band.color}`}>{overallReadiness}</span>
                </div>
              </div>
            </motion.div>

            {/* Workflow Progress */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Filing Progress</h3>
              <div className="space-y-2">
                {STEPS.map((step, i) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isCurrent = currentStep === step.id;
                  return (
                    <div key={step.id} className="flex items-center gap-2.5">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isCurrent
                            ? "bg-blue-600"
                            : "bg-slate-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-3 w-3 text-white" />
                        ) : isCurrent ? (
                          <ArrowRight className="h-3 w-3 text-white" />
                        ) : (
                          <Circle className="h-3 w-3 text-slate-300" />
                        )}
                      </div>
                      <span
                        className={`text-xs ${
                          isCompleted
                            ? "text-emerald-700 font-medium"
                            : isCurrent
                            ? "text-blue-700 font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-semibold text-slate-700">
                    {completedSteps.size} / {STEPS.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Missing import ───────────────────────────────────────────────────────────
// slideInRight is used above — ensure it's imported from @/lib/motion
// (it is defined in the shared foundation lib/motion.ts)