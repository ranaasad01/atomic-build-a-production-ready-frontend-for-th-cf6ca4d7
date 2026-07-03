"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CheckCircle, Circle, Lock, FileText, Upload, Send, ClipboardCheck, ChevronRight, ChevronLeft, AlertCircle, Check, X, Download, Eye, Shield, Calendar, User, Building, Hash, Star, ArrowRight, Info } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { QUALITY_BANDS, getBandForScore, FILING_STAGES } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT = {
  id: "proj-001",
  name: "Riverside Industrial Expansion EIR",
  agency: "California CEQA / DTSC",
  location: "Riverside County, CA",
  deadline: "2024-03-15",
  readinessScore: 91,
  documentCount: 14,
};

const DOCUMENTS = [
  { id: "doc-001", title: "Air Quality Impact Assessment", readinessScore: 93, status: "Approved", type: "Technical Report" },
  { id: "doc-002", title: "Biological Resources Survey", readinessScore: 91, status: "Approved", type: "Technical Report" },
  { id: "doc-003", title: "Noise Impact Analysis", readinessScore: 90, status: "Approved", type: "Technical Report" },
  { id: "doc-004", title: "Traffic Impact Study", readinessScore: 88, status: "In Review", type: "Technical Report" },
  { id: "doc-005", title: "Hydrology and Water Quality Report", readinessScore: 92, status: "Approved", type: "Technical Report" },
  { id: "doc-006", title: "Cultural Resources Assessment", readinessScore: 95, status: "Approved", type: "Technical Report" },
  { id: "doc-007", title: "Hazardous Materials Assessment", readinessScore: 89, status: "In Review", type: "Technical Report" },
  { id: "doc-008", title: "Project Description and Alternatives", readinessScore: 94, status: "Approved", type: "Core Document" },
  { id: "doc-009", title: "Mitigation Monitoring Program", readinessScore: 91, status: "Approved", type: "Core Document" },
  { id: "doc-010", title: "Notice of Preparation Response Summary", readinessScore: 96, status: "Approved", type: "Correspondence" },
];

const SIGNATORIES = [
  { id: "sig-001", name: "Dr. Sarah Chen", role: "Principal Environmental Scientist", required: true },
  { id: "sig-002", name: "Marcus Webb", role: "Project Manager", required: true },
  { id: "sig-003", name: "Jennifer Okafor", role: "Legal Counsel", required: false },
];

const SUBMISSION_AGENCIES = [
  { id: "ag-001", name: "California Department of Toxic Substances Control", code: "DTSC", portal: "https://dtsc.ca.gov/portal", required: true },
  { id: "ag-002", name: "Riverside County Planning Department", code: "RCPD", portal: "https://rctlma.org/planning", required: true },
  { id: "ag-003", name: "State Clearinghouse (OPR)", code: "SCH", portal: "https://ceqanet.opr.ca.gov", required: true },
];

const STEPS = [
  { id: "certify", label: "Certify", icon: ClipboardCheck, description: "Review section readiness and certify completeness" },
  { id: "sign", label: "Sign", icon: User, description: "Collect required signatures from authorized personnel" },
  { id: "lock", label: "Lock", icon: Lock, description: "Lock the package and generate a tamper-evident snapshot" },
  { id: "file", label: "File", icon: FileText, description: "Generate the final filing package for submission" },
  { id: "submit", label: "Submit", icon: Send, description: "Submit to regulatory agencies via portal or mail" },
  { id: "acknowledge", label: "Acknowledge", icon: CheckCircle, description: "Record agency acknowledgment and receipt numbers" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#6366f1" : score >= 85 ? "#3b82f6" : "#f59e0b";

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepIndicator({ steps, currentStep }: { steps: typeof STEPS; currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isUpcoming = idx > currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "border-blue-600 bg-blue-600 text-white",
                  isCurrent && "border-blue-600 bg-white text-blue-600 shadow-md shadow-blue-100",
                  isUpcoming && "border-slate-200 bg-white text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isCompleted && "text-blue-600",
                  isCurrent && "text-slate-900",
                  isUpcoming && "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 w-8 transition-all duration-500 sm:w-12 md:w-16",
                  idx < currentStep ? "bg-blue-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step Panels ──────────────────────────────────────────────────────────────

function CertifyStep() {
  const [certified, setCertified] = useState(false);
  const approvedDocs = DOCUMENTS.filter((d) => d.status === "Approved");
  const reviewDocs = DOCUMENTS.filter((d) => d.status === "In Review");

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Section Readiness Grid</h2>
        <p className="mt-1 text-sm text-slate-500">
          Review all documents before certifying the package is complete and ready for signature.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Documents", value: DOCUMENTS.length, color: "text-slate-900" },
          { label: "Approved", value: approvedDocs.length, color: "text-emerald-700" },
          { label: "In Review", value: reviewDocs.length, color: "text-amber-700" },
          { label: "Avg. Readiness", value: `${Math.round(DOCUMENTS.reduce((a, d) => a + d.readinessScore, 0) / DOCUMENTS.length)}`, color: "text-indigo-700" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className={cn("mt-1 text-2xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Document grid */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document Readiness</p>
        </div>
        <div className="divide-y divide-slate-100">
          {DOCUMENTS.map((doc) => {
            const band = getBandForScore(doc.readinessScore);
            return (
              <div key={doc.id} className="flex items-center gap-4 px-4 py-3">
                <div className="relative flex-shrink-0">
                  <ReadinessRing score={doc.readinessScore} size={36} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
                    {doc.readinessScore}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.type}</p>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", band.bgColor, band.borderColor, band.color)}>
                  {band.label}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    doc.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}
                >
                  {doc.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certification checkbox */}
      <div className={cn("rounded-xl border p-5 transition-all", certified ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}>
        <label className="flex cursor-pointer items-start gap-3">
          <div
            onClick={() => setCertified((v) => !v)}
            className={cn(
              "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all",
              certified ? "border-emerald-600 bg-emerald-600" : "border-slate-300 bg-white"
            )}
          >
            {certified && <Check className="h-3 w-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              I certify that all documents have been reviewed and this filing package is complete and accurate to the best of my knowledge.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              By checking this box, you confirm that the package meets all regulatory requirements for submission to {PROJECT.agency}.
            </p>
          </div>
        </label>
      </div>

      {reviewDocs.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {reviewDocs.length} document{reviewDocs.length > 1 ? "s" : ""} still in review
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              You can proceed, but unresolved documents may affect submission acceptance.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SignStep() {
  const [signatures, setSignatures] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  function toggleSig(id: string) {
    setSignatures((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function simulateUpload(id: string) {
    setUploadedFiles((prev) => ({ ...prev, [id]: `signature_${id}.png` }));
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Collect Signatures</h2>
        <p className="mt-1 text-sm text-slate-500">
          Required signatories must sign before the package can be locked. Upload signature images or mark as signed.
        </p>
      </div>

      <div className="space-y-4">
        {SIGNATORIES.map((sig) => {
          const isSigned = !!signatures[sig.id];
          const hasFile = !!uploadedFiles[sig.id];

          return (
            <motion.div
              key={sig.id}
              whileHover={{ y: -1 }}
              className={cn(
                "rounded-xl border p-5 transition-all",
                isSigned ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold", isSigned ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                    {sig.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{sig.name}</p>
                    <p className="text-sm text-slate-500">{sig.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sig.required && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Required</span>
                  )}
                  {isSigned && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" /> Signed
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {hasFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>{uploadedFiles[sig.id]}</span>
                    <button
                      onClick={() => setUploadedFiles((prev) => { const n = { ...prev }; delete n[sig.id]; return n; })}
                      className="ml-1 text-slate-400 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => simulateUpload(sig.id)}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Signature
                  </button>
                )}
                <button
                  onClick={() => toggleSig(sig.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isSigned
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isSigned ? "Undo Signature" : "Mark as Signed"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
          <p className="text-sm text-blue-800">
            All required signatories must sign before proceeding to the Lock step. Optional signatories can be added later via amendment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LockStep() {
  const [locked, setLocked] = useState(false);
  const [snapshotId] = useState("SNAP-2024-0315-A7F2");

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Lock Package Snapshot</h2>
        <p className="mt-1 text-sm text-slate-500">
          Locking creates a tamper-evident snapshot of all documents. No changes can be made after locking without creating a new version.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-full transition-all", locked ? "bg-emerald-100" : "bg-slate-100")}>
            <Lock className={cn("h-7 w-7 transition-colors", locked ? "text-emerald-600" : "text-slate-400")} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{locked ? "Package Locked" : "Package Unlocked"}</p>
            <p className="text-sm text-slate-500">
              {locked ? `Snapshot ID: ${snapshotId}` : "Ready to lock when all signatures are collected"}
            </p>
          </div>
        </div>

        {locked && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Snapshot ID", value: snapshotId },
                { label: "Documents", value: `${DOCUMENTS.length} files` },
                { label: "Hash Algorithm", value: "SHA-256" },
                { label: "Locked By", value: "Dr. Sarah Chen" },
                { label: "Lock Time", value: "2024-03-15 09:42 UTC" },
                { label: "Package Size", value: "47.3 MB" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setLocked((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              locked
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            )}
          >
            <Lock className="h-4 w-4" />
            {locked ? "Unlock Package" : "Lock Package Now"}
          </button>
          {locked && (
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Download Snapshot
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Once locked, any modification to documents will require unlocking and re-signing. This action is logged in the audit trail.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FileStep() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  }

  const packageFiles = [
    { name: "Riverside_EIR_Main_Report.pdf", size: "18.4 MB", type: "Core" },
    { name: "Riverside_EIR_Technical_Appendices.pdf", size: "22.1 MB", type: "Appendix" },
    { name: "Riverside_EIR_Mitigation_Monitoring.pdf", size: "3.2 MB", type: "Core" },
    { name: "Riverside_EIR_Signatures.pdf", size: "0.8 MB", type: "Certification" },
    { name: "Riverside_EIR_Manifest.json", size: "0.04 MB", type: "Metadata" },
  ];

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Generate Filing Package</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compile all approved documents, signatures, and metadata into a submission-ready package.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Package Configuration</p>
            <p className="text-sm text-slate-500">Riverside Industrial Expansion EIR — Final Package</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">v1.0 Final</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Documents", value: DOCUMENTS.length },
            { label: "Signatories", value: SIGNATORIES.length },
            { label: "Target Agencies", value: SUBMISSION_AGENCIES.length },
            { label: "Total Size", value: "47.3 MB" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={handleGenerate}
            disabled={generating || generated}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              generated
                ? "bg-emerald-100 text-emerald-700"
                : generating
                ? "cursor-wait bg-blue-400 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {generating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : generated ? (
              <>
                <Check className="h-4 w-4" />
                Package Generated
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Package
              </>
            )}
          </button>
        </div>
      </div>

      {generated && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Package Contents</p>
          </div>
          <div className="divide-y divide-slate-100">
            {packageFiles.map((file) => (
              <div key={file.name} className="flex items-center gap-4 px-4 py-3">
                <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{file.size}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{file.type}</span>
                <button className="text-slate-400 transition-colors hover:text-blue-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 px-4 py-3">
            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              <Download className="h-4 w-4" />
              Download Complete Package (.zip)
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SubmitStep() {
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [trackingNums, setTrackingNums] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<Record<string, string>>({});

  function toggleSubmit(id: string) {
    setSubmitted((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setTracking(id: string, val: string) {
    setTrackingNums((prev) => ({ ...prev, [id]: val }));
  }

  function setMethodFor(id: string, val: string) {
    setMethod((prev) => ({ ...prev, [id]: val }));
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Submit to Agencies</h2>
        <p className="mt-1 text-sm text-slate-500">
          Submit the filing package to each required regulatory agency. Record submission method and tracking numbers.
        </p>
      </div>

      <div className="space-y-4">
        {SUBMISSION_AGENCIES.map((agency) => {
          const isSubmitted = !!submitted[agency.id];
          const currentMethod = method[agency.id] ?? "portal";

          return (
            <motion.div
              key={agency.id}
              whileHover={{ y: -1 }}
              className={cn(
                "rounded-xl border p-5 transition-all",
                isSubmitted ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold", isSubmitted ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                    {agency.code}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{agency.name}</p>
                    <a href={agency.portal} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {agency.portal}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {agency.required && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Required</span>
                  )}
                  {isSubmitted && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" /> Submitted
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Submission Method</label>
                  <select
                    value={currentMethod}
                    onChange={(e) => setMethodFor(agency.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="portal">Online Portal</option>
                    <option value="email">Email</option>
                    <option value="mail">Physical Mail</option>
                    <option value="hand">Hand Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Tracking / Reference Number</label>
                  <input
                    type="text"
                    value={trackingNums[agency.id] ?? ""}
                    onChange={(e) => setTracking(agency.id, e.target.value)}
                    placeholder="e.g. DTSC-2024-00123"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => toggleSubmit(agency.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isSubmitted
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSubmitted ? "Mark Unsubmitted" : "Mark as Submitted"}
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-50">
                  <Eye className="h-3.5 w-3.5" />
                  View Portal
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AcknowledgeStep() {
  const [ackNotes, setAckNotes] = useState("");
  const [receipts, setReceipts] = useState<Record<string, string>>({
    "ag-001": "DTSC-ACK-2024-00891",
    "ag-002": "",
    "ag-003": "SCH-2024-031501",
  });
  const [ackDates, setAckDates] = useState<Record<string, string>>({
    "ag-001": "2024-03-16",
    "ag-002": "",
    "ag-003": "2024-03-17",
  });

  function setReceipt(id: string, val: string) {
    setReceipts((prev) => ({ ...prev, [id]: val }));
  }

  function setAckDate(id: string, val: string) {
    setAckDates((prev) => ({ ...prev, [id]: val }));
  }

  const allAcknowledged = SUBMISSION_AGENCIES.filter((a) => a.required).every(
    (a) => (receipts[a.id] ?? "").trim().length > 0 && (ackDates[a.id] ?? "").trim().length > 0
  );

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Record Agency Acknowledgment</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter receipt numbers and acknowledgment dates from each agency. This completes the filing workflow.
        </p>
      </div>

      <div className="space-y-4">
        {SUBMISSION_AGENCIES.map((agency) => {
          const hasReceipt = (receipts[agency.id] ?? "").trim().length > 0;
          const hasDate = (ackDates[agency.id] ?? "").trim().length > 0;
          const isComplete = hasReceipt && hasDate;

          return (
            <div
              key={agency.id}
              className={cn(
                "rounded-xl border p-5 transition-all",
                isComplete ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold", isComplete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                    {isComplete ? <Check className="h-4 w-4" /> : agency.code.charAt(0)}
                  </div>
                  <p className="font-medium text-slate-900">{agency.name}</p>
                </div>
                {isComplete && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Acknowledged</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Receipt / Confirmation Number</label>
                  <input
                    type="text"
                    value={receipts[agency.id] ?? ""}
                    onChange={(e) => setReceipt(agency.id, e.target.value)}
                    placeholder="e.g. DTSC-ACK-2024-00891"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Acknowledgment Date</label>
                  <input
                    type="date"
                    value={ackDates[agency.id] ?? ""}
                    onChange={(e) => setAckDate(agency.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Additional Notes</label>
        <textarea
          value={ackNotes}
          onChange={(e) => setAckNotes(e.target.value)}
          rows={3}
          placeholder="Record any agency comments, conditions, or follow-up actions required..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {allAcknowledged && (
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Filing Complete</p>
              <p className="text-sm text-emerald-700">
                All required agencies have acknowledged receipt. This project is now fully filed.
              </p>
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Download Filing Certificate
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STEP_COMPONENTS = [CertifyStep, SignStep, LockStep, FileStep, SubmitStep, AcknowledgeStep];

export default function FilingPackagePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const StepComponent = STEP_COMPONENTS[currentStep] ?? CertifyStep;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  function goNext() {
    if (!isLast) setCurrentStep((s) => s + 1);
  }

  function goPrev() {
    if (!isFirst) setCurrentStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building className="h-4 w-4" />
            <span>{PROJECT.agency}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-medium">{PROJECT.name}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Filing Package</h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete each step to prepare and submit your regulatory filing package.
          </p>

          {/* Project meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Deadline: <span className="font-medium text-slate-900">{PROJECT.deadline}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Hash className="h-4 w-4 text-slate-400" />
              <span>{PROJECT.documentCount} documents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="relative flex-shrink-0">
                <ReadinessRing score={PROJECT.readinessScore} size={28} />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-700">
                  {PROJECT.readinessScore}
                </span>
              </div>
              <span className={cn("text-sm font-semibold", scoreColor(PROJECT.readinessScore))}>
                {PROJECT.readinessScore}% Ready
              </span>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {getBandForScore(PROJECT.readinessScore).label} Band
            </span>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <StepIndicator steps={STEPS} currentStep={currentStep} />
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-900">{STEPS[currentStep]?.label}</p>
            <p className="text-xs text-slate-500">{STEPS[currentStep]?.description}</p>
          </div>
        </motion.div>

        {/* Step content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-6 flex items-center justify-between"
        >
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              isFirst
                ? "cursor-not-allowed text-slate-300"
                : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === currentStep ? "w-6 bg-blue-600" : idx < currentStep ? "w-2 bg-blue-300" : "w-2 bg-slate-200"
                )}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={isLast}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              isLast
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            )}
          >
            {isLast ? "Complete" : "Next Step"}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </motion.div>

        {/* Step overview */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <motion.button
                key={step.id}
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  isCurrent && "border-blue-200 bg-blue-50 shadow-sm",
                  isCompleted && "border-emerald-200 bg-emerald-50",
                  !isCurrent && !isCompleted && "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", isCurrent ? "bg-blue-600" : isCompleted ? "bg-emerald-600" : "bg-slate-100")}>
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Icon className={cn("h-3.5 w-3.5", isCurrent ? "text-white" : "text-slate-500")} />
                  )}
                </div>
                <p className={cn("mt-2 text-xs font-semibold", isCurrent ? "text-blue-700" : isCompleted ? "text-emerald-700" : "text-slate-600")}>
                  {step.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-400 line-clamp-2">{step.description}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}