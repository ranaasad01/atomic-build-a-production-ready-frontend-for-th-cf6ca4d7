"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CheckCircle, Circle, Upload, Lock, FileText, Send, ThumbsUp, ChevronRight, ChevronLeft, AlertCircle, Download, Eye, Pen, Shield, Package, Clock, User, Building, Calendar, Hash, CheckSquare, XCircle, Info, Loader2, Star } from 'lucide-react';
import { getBandForScore, QUALITY_BANDS } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepId =
  | "certify"
  | "sign"
  | "lock"
  | "file"
  | "submit"
  | "acknowledge";

interface Step {
  id: StepId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface SectionReadiness {
  id: string;
  title: string;
  type: string;
  score: number;
  status: "Approved" | "In Review" | "Draft";
  author: string;
  wordCount: number;
  unsourcedClaims: number;
}

interface SignatureState {
  name: string;
  title: string;
  organization: string;
  date: string;
  agreed: boolean;
  signatureFile: string | null;
}

interface SubmissionDetails {
  agencyName: string;
  portalUrl: string;
  referenceNumber: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  notes: string;
  deliveryMethod: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT_NAME = "Riverside Industrial Park — Phase II EIS";
const PROJECT_AGENCY = "EPA Region 9";
const PROJECT_ID = "proj-001";

const SECTIONS: SectionReadiness[] = [
  {
    id: "sec-001",
    title: "Executive Summary",
    type: "Summary",
    score: 96,
    status: "Approved",
    author: "Dr. Sarah Chen",
    wordCount: 3240,
    unsourcedClaims: 0,
  },
  {
    id: "sec-002",
    title: "Project Description & Purpose",
    type: "Narrative",
    score: 94,
    status: "Approved",
    author: "Marcus Webb",
    wordCount: 5810,
    unsourcedClaims: 0,
  },
  {
    id: "sec-003",
    title: "Affected Environment — Air Quality",
    type: "Technical",
    score: 91,
    status: "Approved",
    author: "Dr. Sarah Chen",
    wordCount: 7420,
    unsourcedClaims: 1,
  },
  {
    id: "sec-004",
    title: "Affected Environment — Water Resources",
    type: "Technical",
    score: 93,
    status: "Approved",
    author: "Priya Nair",
    wordCount: 6890,
    unsourcedClaims: 0,
  },
  {
    id: "sec-005",
    title: "Biological Resources Assessment",
    type: "Technical",
    score: 90,
    status: "In Review",
    author: "James Okafor",
    wordCount: 8150,
    unsourcedClaims: 2,
  },
  {
    id: "sec-006",
    title: "Cultural Resources Survey",
    type: "Technical",
    score: 88,
    status: "In Review",
    author: "Dr. Lena Marsh",
    wordCount: 4320,
    unsourcedClaims: 3,
  },
  {
    id: "sec-007",
    title: "Environmental Consequences — Alternatives",
    type: "Analysis",
    score: 92,
    status: "Approved",
    author: "Marcus Webb",
    wordCount: 9600,
    unsourcedClaims: 0,
  },
  {
    id: "sec-008",
    title: "Mitigation Measures",
    type: "Regulatory",
    score: 95,
    status: "Approved",
    author: "Priya Nair",
    wordCount: 4780,
    unsourcedClaims: 0,
  },
  {
    id: "sec-009",
    title: "Cumulative Impacts Analysis",
    type: "Analysis",
    score: 89,
    status: "In Review",
    author: "Dr. Sarah Chen",
    wordCount: 5230,
    unsourcedClaims: 2,
  },
  {
    id: "sec-010",
    title: "Public Involvement Summary",
    type: "Procedural",
    score: 97,
    status: "Approved",
    author: "James Okafor",
    wordCount: 2890,
    unsourcedClaims: 0,
  },
  {
    id: "sec-011",
    title: "References & Bibliography",
    type: "Supporting",
    score: 98,
    status: "Approved",
    author: "Dr. Lena Marsh",
    wordCount: 1640,
    unsourcedClaims: 0,
  },
  {
    id: "sec-012",
    title: "Appendix A — Technical Data Tables",
    type: "Appendix",
    score: 93,
    status: "Approved",
    author: "Marcus Webb",
    wordCount: 3100,
    unsourcedClaims: 0,
  },
];

const LOCK_SNAPSHOT = {
  generatedAt: "2024-06-14 09:42:11 UTC",
  packageId: "PKG-2024-0614-001",
  totalDocuments: 12,
  totalPages: 487,
  totalWords: 63070,
  sha256: "a3f8c2d1e9b047f6a2c8d3e1f0b9a7c4d2e8f1a3b5c7d9e0f2a4b6c8d0e2f4a6",
  format: "PDF/A-3b",
  sizeKb: 18420,
  signatories: ["Dr. Sarah Chen", "Marcus Webb"],
};

const PACKAGE_STEPS = [
  { label: "Compiling documents", done: true },
  { label: "Applying formatting standards", done: true },
  { label: "Embedding source citations", done: true },
  { label: "Generating table of contents", done: true },
  { label: "Running final quality check", done: true },
  { label: "Creating PDF/A-3b archive", done: true },
  { label: "Computing integrity hash", done: true },
  { label: "Package ready for submission", done: true },
];

const ACKNOWLEDGEMENT = {
  confirmationNumber: "EPA-R9-EIS-2024-00847",
  receivedAt: "2024-06-14 14:23:07 UTC",
  agency: "EPA Region 9",
  reviewer: "Regional Compliance Office",
  estimatedReviewDays: 45,
  nextAction: "Await Notice of Completeness (NOC) within 30 days.",
  contactEmail: "r9-eis-intake@epa.gov",
  contactPhone: "(415) 947-8000",
};

// ─── Step Config ──────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "certify",
    label: "Certify",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Review section readiness and certify package completeness",
  },
  {
    id: "sign",
    label: "Sign",
    icon: <Pen className="h-4 w-4" />,
    description: "Upload authorized signature and confirm signatory details",
  },
  {
    id: "lock",
    label: "Lock",
    icon: <Lock className="h-4 w-4" />,
    description: "Lock the package snapshot and generate integrity hash",
  },
  {
    id: "file",
    label: "File",
    icon: <Package className="h-4 w-4" />,
    description: "Generate the final filing package for submission",
  },
  {
    id: "submit",
    label: "Submit",
    icon: <Send className="h-4 w-4" />,
    description: "Enter submission details and dispatch to the agency portal",
  },
  {
    id: "acknowledge",
    label: "Acknowledge",
    icon: <ThumbsUp className="h-4 w-4" />,
    description: "Confirm receipt and record the agency acknowledgement",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function scoreColor(score: number): string {
  if (score >= 95) return "text-emerald-700";
  if (score >= 90) return "text-indigo-700";
  if (score >= 85) return "text-blue-700";
  return "text-amber-700";
}

function scoreBg(score: number): string {
  if (score >= 95) return "bg-emerald-50 border-emerald-200";
  if (score >= 90) return "bg-indigo-50 border-indigo-200";
  if (score >= 85) return "bg-blue-50 border-blue-200";
  return "bg-amber-50 border-amber-200";
}

function statusBadge(status: SectionReadiness["status"]) {
  if (status === "Approved")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "In Review")
    return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-slate-100 text-slate-600 border border-slate-200";
}

const panelVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -32, transition: { duration: 0.22, ease: "easeIn" } },
};

// ─── Sub-panels ───────────────────────────────────────────────────────────────

function CertifyPanel() {
  const approved = SECTIONS.filter((s) => s.status === "Approved").length;
  const inReview = SECTIONS.filter((s) => s.status === "In Review").length;
  const avgScore =
    Math.round(
      (SECTIONS.reduce((a, s) => a + s.score, 0) / SECTIONS.length) * 10
    ) / 10;
  const band = getBandForScore(Math.round(avgScore));

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary row */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          {
            label: "Total Sections",
            value: SECTIONS.length,
            icon: <FileText className="h-4 w-4 text-slate-400" />,
            sub: "in package",
          },
          {
            label: "Approved",
            value: approved,
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
            sub: "sections",
          },
          {
            label: "In Review",
            value: inReview,
            icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
            sub: "sections",
          },
          {
            label: "Avg. Readiness",
            value: `${avgScore}`,
            icon: <Star className="h-4 w-4 text-indigo-500" />,
            sub: band.label,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {stat.icon}
              {stat.label}
            </div>
            <div className="mt-1.5 text-2xl font-semibold text-slate-900">
              {stat.value}
            </div>
            <div className="text-xs text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Section readiness grid */}
      <motion.div variants={fadeInUp}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Section Readiness Grid
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Section
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Author
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                  Score
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                  Unsourced
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SECTIONS.map((sec) => {
                const band = getBandForScore(sec.score);
                return (
                  <tr
                    key={sec.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {sec.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{sec.type}</td>
                    <td className="px-4 py-3 text-slate-500">{sec.author}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                          scoreBg(sec.score),
                          scoreColor(sec.score)
                        )}
                      >
                        {sec.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          statusBadge(sec.status)
                        )}
                      >
                        {sec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sec.unsourcedClaims > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 border border-red-200">
                          <AlertCircle className="h-3 w-3" />
                          {sec.unsourcedClaims}
                        </span>
                      ) : (
                        <span className="text-emerald-500">
                          <CheckCircle className="mx-auto h-4 w-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Certification notice */}
      <motion.div
        variants={fadeInUp}
        className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
      >
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800">
          By proceeding, you certify that all sections listed above have been
          reviewed for accuracy, completeness, and regulatory compliance. Sections
          marked "In Review" will be included with their current scores.
        </p>
      </motion.div>
    </motion.div>
  );
}

function SignPanel({
  sig,
  setSig,
  dragActive,
  setDragActive,
}: {
  sig: SignatureState;
  setSig: React.Dispatch<React.SetStateAction<SignatureState>>;
  dragActive: boolean;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setSig((prev) => ({ ...prev, signatureFile: file.name }));
      }
    },
    [setSig, setDragActive]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSig((prev) => ({ ...prev, signatureFile: file.name }));
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {[
          {
            label: "Full Legal Name",
            key: "name" as const,
            placeholder: "Dr. Sarah Chen",
            icon: <User className="h-4 w-4 text-slate-400" />,
          },
          {
            label: "Title / Role",
            key: "title" as const,
            placeholder: "Principal Environmental Scientist",
            icon: <Star className="h-4 w-4 text-slate-400" />,
          },
          {
            label: "Organization",
            key: "organization" as const,
            placeholder: "EcoPath Consulting Group",
            icon: <Building className="h-4 w-4 text-slate-400" />,
          },
          {
            label: "Signature Date",
            key: "date" as const,
            placeholder: "",
            icon: <Calendar className="h-4 w-4 text-slate-400" />,
            type: "date",
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              {field.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                {field.icon}
              </span>
              <input
                type={field.type ?? "text"}
                value={sig[field.key] as string}
                onChange={(e) =>
                  setSig((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Signature upload dropzone */}
      <motion.div variants={fadeInUp}>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Signature File (PNG, SVG, or PDF)
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all",
            dragActive
              ? "border-blue-400 bg-blue-50"
              : sig.signatureFile
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
          )}
        >
          {sig.signatureFile ? (
            <>
              <CheckCircle className="mb-2 h-8 w-8 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700">
                {sig.signatureFile}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                Signature file attached
              </p>
              <button
                onClick={() =>
                  setSig((prev) => ({ ...prev, signatureFile: null }))
                }
                className="mt-3 text-xs text-slate-500 underline hover:text-slate-700"
              >
                Remove
              </button>
            </>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">
                Drop signature file here
              </p>
              <p className="mt-1 text-xs text-slate-400">
                or click to browse — PNG, SVG, PDF up to 5 MB
              </p>
              <label className="mt-4 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                Browse Files
                <input
                  type="file"
                  accept=".png,.svg,.pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
      </motion.div>

      {/* Agreement checkbox */}
      <motion.div
        variants={fadeInUp}
        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      >
        <input
          id="agree"
          type="checkbox"
          checked={sig.agreed}
          onChange={(e) =>
            setSig((prev) => ({ ...prev, agreed: e.target.checked }))
          }
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="agree" className="text-sm text-slate-700 leading-relaxed">
          I certify under penalty of law that this document and all attachments
          were prepared under my direction or supervision in accordance with a
          system designed to assure that qualified personnel properly gather and
          evaluate the information submitted. The information submitted is, to
          the best of my knowledge and belief, true, accurate, and complete.
        </label>
      </motion.div>
    </motion.div>
  );
}

function LockPanel() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <Lock className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Package Locked Successfully
            </p>
            <p className="text-xs text-emerald-600">
              Snapshot generated and integrity hash computed
            </p>
          </div>
        </div>
      </motion.div>

      {/* Snapshot details */}
      <motion.div variants={fadeInUp}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Lock Snapshot
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {[
            {
              label: "Package ID",
              value: LOCK_SNAPSHOT.packageId,
              icon: <Hash className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Generated At",
              value: LOCK_SNAPSHOT.generatedAt,
              icon: <Clock className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Total Documents",
              value: `${LOCK_SNAPSHOT.totalDocuments} sections`,
              icon: <FileText className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Total Pages",
              value: `${LOCK_SNAPSHOT.totalPages} pages`,
              icon: <FileText className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Total Words",
              value: `${(LOCK_SNAPSHOT.totalWords ?? 0).toLocaleString("en-US")} words`,
              icon: <FileText className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Archive Format",
              value: LOCK_SNAPSHOT.format,
              icon: <Package className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "File Size",
              value: `${((LOCK_SNAPSHOT.sizeKb ?? 0) / 1024).toFixed(1)} MB`,
              icon: <Download className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Signatories",
              value: (LOCK_SNAPSHOT.signatories ?? []).join(", "),
              icon: <User className="h-4 w-4 text-slate-400" />,
            },
          ].map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                i !== 0 && "border-t border-slate-100"
              )}
            >
              <div className="flex items-center gap-2 text-sm text-slate-500">
                {row.icon}
                {row.label}
              </div>
              <span className="text-sm font-medium text-slate-800">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SHA-256 hash */}
      <motion.div variants={fadeInUp}>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          SHA-256 Integrity Hash
        </h3>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3">
          <Shield className="h-4 w-4 flex-shrink-0 text-emerald-400" />
          <code className="flex-1 break-all font-mono text-xs text-emerald-300">
            {LOCK_SNAPSHOT.sha256}
          </code>
          <button className="flex-shrink-0 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700">
            Copy
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          This hash uniquely identifies the locked package. Any modification to
          the package will produce a different hash.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">
          <Eye className="h-4 w-4" />
          Preview Package
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Download Archive
        </button>
      </motion.div>
    </motion.div>
  );
}

function FilePanel() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Package Generation
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {PACKAGE_STEPS.map((step, i) => (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                i !== 0 && "border-t border-slate-100"
              )}
            >
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span className="flex-1 text-sm text-slate-700">{step.label}</span>
              <span className="text-xs text-emerald-600 font-medium">Done</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Package summary */}
      <motion.div
        variants={fadeInUp}
        className="rounded-xl border border-indigo-200 bg-indigo-50 p-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-800">
              {PROJECT_NAME}
            </p>
            <p className="mt-0.5 text-xs text-indigo-600">
              {LOCK_SNAPSHOT.packageId} · {LOCK_SNAPSHOT.format}
            </p>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            Ready
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { label: "Sections", value: LOCK_SNAPSHOT.totalDocuments },
            { label: "Pages", value: LOCK_SNAPSHOT.totalPages },
            {
              label: "Size",
              value: `${((LOCK_SNAPSHOT.sizeKb ?? 0) / 1024).toFixed(1)} MB`,
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-semibold text-indigo-900">
                {stat.value}
              </div>
              <div className="text-xs text-indigo-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Download Filing Package
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">
          <Eye className="h-4 w-4" />
          Preview PDF
        </button>
      </motion.div>
    </motion.div>
  );
}

function SubmitPanel({
  details,
  setDetails,
}: {
  details: SubmissionDetails;
  setDetails: React.Dispatch<React.SetStateAction<SubmissionDetails>>;
}) {
  const fields: {
    label: string;
    key: keyof SubmissionDetails;
    placeholder: string;
    icon: React.ReactNode;
    type?: string;
  }[] = [
    {
      label: "Agency Name",
      key: "agencyName",
      placeholder: "EPA Region 9",
      icon: <Building className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Agency Portal URL",
      key: "portalUrl",
      placeholder: "https://epa.gov/r9/submit",
      icon: <Send className="h-4 w-4 text-slate-400" />,
      type: "url",
    },
    {
      label: "Reference / Docket Number",
      key: "referenceNumber",
      placeholder: "EPA-R9-EIS-2024-00847",
      icon: <Hash className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Submitter Name",
      key: "submitterName",
      placeholder: "Dr. Sarah Chen",
      icon: <User className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Submitter Email",
      key: "submitterEmail",
      placeholder: "s.chen@ecopath.com",
      icon: <Send className="h-4 w-4 text-slate-400" />,
      type: "email",
    },
    {
      label: "Submitter Phone",
      key: "submitterPhone",
      placeholder: "+1 (415) 555-0192",
      icon: <User className="h-4 w-4 text-slate-400" />,
      type: "tel",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              {field.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                {field.icon}
              </span>
              <input
                type={field.type ?? "text"}
                value={details[field.key] as string}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Delivery method */}
      <motion.div variants={fadeInUp}>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Delivery Method
        </label>
        <select
          value={details.deliveryMethod}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, deliveryMethod: e.target.value }))
          }
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="portal">Agency Online Portal</option>
          <option value="email">Secure Email</option>
          <option value="courier">Certified Courier</option>
          <option value="hand">Hand Delivery</option>
        </select>
      </motion.div>

      {/* Notes */}
      <motion.div variants={fadeInUp}>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Submission Notes (optional)
        </label>
        <textarea
          value={details.notes}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
          placeholder="Any additional context for the receiving agency..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Submitting this package is a legally binding action. Ensure all
          details are correct before proceeding. A copy will be retained in the
          audit trail.
        </p>
      </motion.div>
    </motion.div>
  );
}

function AcknowledgePanel() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Success banner */}
      <motion.div
        variants={scaleIn}
        className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-emerald-900">
          Submission Acknowledged
        </h3>
        <p className="mt-2 max-w-md text-sm text-emerald-700">
          Your filing package has been received by {ACKNOWLEDGEMENT.agency}.
          Keep your confirmation number for your records.
        </p>
        <div className="mt-5 rounded-xl border border-emerald-300 bg-white px-6 py-3">
          <p className="text-xs text-slate-500">Confirmation Number</p>
          <p className="mt-0.5 font-mono text-lg font-bold text-slate-900">
            {ACKNOWLEDGEMENT.confirmationNumber}
          </p>
        </div>
      </motion.div>

      {/* Details */}
      <motion.div variants={fadeInUp}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Acknowledgement Details
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {[
            {
              label: "Received At",
              value: ACKNOWLEDGEMENT.receivedAt,
              icon: <Clock className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Agency",
              value: ACKNOWLEDGEMENT.agency,
              icon: <Building className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Reviewing Office",
              value: ACKNOWLEDGEMENT.reviewer,
              icon: <User className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Estimated Review",
              value: `${ACKNOWLEDGEMENT.estimatedReviewDays} business days`,
              icon: <Calendar className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Agency Contact",
              value: ACKNOWLEDGEMENT.contactEmail,
              icon: <Send className="h-4 w-4 text-slate-400" />,
            },
            {
              label: "Agency Phone",
              value: ACKNOWLEDGEMENT.contactPhone,
              icon: <User className="h-4 w-4 text-slate-400" />,
            },
          ].map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                i !== 0 && "border-t border-slate-100"
              )}
            >
              <div className="flex items-center gap-2 text-sm text-slate-500">
                {row.icon}
                {row.label}
              </div>
              <span className="text-sm font-medium text-slate-800">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next action */}
      <motion.div
        variants={fadeInUp}
        className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
      >
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-800">Next Step</p>
          <p className="mt-0.5 text-sm text-blue-700">
            {ACKNOWLEDGEMENT.nextAction}
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50">
          <Eye className="h-4 w-4" />
          View Audit Trail
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FilingPackagePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [dragActive, setDragActive] = useState(false);

  const [sig, setSig] = useState<SignatureState>({
    name: "Dr. Sarah Chen",
    title: "Principal Environmental Scientist",
    organization: "EcoPath Consulting Group",
    date: "2024-06-14",
    agreed: false,
    signatureFile: null,
  });

  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails>(
    {
      agencyName: "EPA Region 9",
      portalUrl: "https://epa.gov/r9/eis-submit",
      referenceNumber: "EPA-R9-EIS-2024-00847",
      submitterName: "Dr. Sarah Chen",
      submitterEmail: "s.chen@ecopath.com",
      submitterPhone: "+1 (415) 555-0192",
      notes: "",
      deliveryMethod: "portal",
    }
  );

  const canProceed = (): boolean => {
    const step = STEPS[currentStep];
    if (!step) return false;
    if (step.id === "sign") {
      return sig.agreed && sig.name.trim().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= currentStep || completedSteps.has(index)) {
      setCurrentStep(index);
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span>Projects</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-xs">{PROJECT_NAME}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-medium">Filing Package</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Filing Package
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {PROJECT_NAME} · {PROJECT_AGENCY}
          </p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-stretch overflow-x-auto">
              {STEPS.map((step, index) => {
                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                const isClickable =
                  index <= currentStep || completedSteps.has(index);

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      "relative flex flex-1 flex-col items-center gap-1.5 px-3 py-4 text-center transition-all min-w-[80px]",
                      isCurrent
                        ? "bg-blue-50"
                        : isCompleted
                        ? "bg-emerald-50/50 hover:bg-emerald-50"
                        : "bg-white hover:bg-slate-50",
                      !isClickable && "cursor-not-allowed opacity-50",
                      index !== 0 && "border-l border-slate-100"
                    )}
                  >
                    {/* Step indicator */}
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                        isCurrent
                          ? "bg-blue-600 text-white shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isCurrent
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-emerald-700"
                          : "text-slate-400"
                      )}
                    >
                      {step.label}
                    </span>
                    {/* Active underline */}
                    {isCurrent && (
                      <motion.div
                        layoutId="step-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        transition={{ type: "spring", duration: 0.4 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Step description */}
        <motion.div
          key={currentStep + "-desc"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {currentStepData?.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Step {currentStep + 1} of {STEPS.length}: {currentStepData?.label}
            </p>
            <p className="text-xs text-slate-500">
              {currentStepData?.description}
            </p>
          </div>
        </motion.div>

        {/* Panel */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {currentStepData?.id === "certify" && <CertifyPanel />}
              {currentStepData?.id === "sign" && (
                <SignPanel
                  sig={sig}
                  setSig={setSig}
                  dragActive={dragActive}
                  setDragActive={setDragActive}
                />
              )}
              {currentStepData?.id === "lock" && <LockPanel />}
              {currentStepData?.id === "file" && <FilePanel />}
              {currentStepData?.id === "submit" && (
                <SubmitPanel
                  details={submissionDetails}
                  setDetails={setSubmissionDetails}
                />
              )}
              {currentStepData?.id === "acknowledge" && <AcknowledgePanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center justify-between"
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50",
              currentStep === 0 && "cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === currentStep
                    ? "w-6 bg-blue-600"
                    : completedSteps.has(i)
                    ? "w-1.5 bg-emerald-400"
                    : "w-1.5 bg-slate-200"
                )}
              />
            ))}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700",
                !canProceed() && "cursor-not-allowed opacity-50"
              )}
            >
              {currentStep === STEPS.length - 2 ? "Submit" : "Continue"}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4" />
              Complete
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}