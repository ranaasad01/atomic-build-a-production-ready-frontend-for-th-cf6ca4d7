"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight, Check, X, Clock, AlertCircle, FileText, Search, Star, Eye, GitBranch, Download, Upload, Bold, Italic, List, AlignLeft, AlignCenter, Minus, Plus, Sparkles, Activity, CheckCircle, Circle, ArrowRight, Save, Edit, User } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInRight } from "@/lib/motion";
import { getBandForScore, QUALITY_BANDS, type QualityBand } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOCUMENT = {
  id: "doc-001",
  projectId: "proj-001",
  projectName: "Coastal Wetland Restoration EIS",
  title: "Environmental Impact Statement — Section 4: Wetland Hydrology Analysis",
  type: "Environmental Impact Statement",
  readinessScore: 87,
  targetBand: "Filing" as QualityBand,
  status: "In Review" as const,
  unsourcedClaims: 6,
  wordCount: 4218,
  lastModified: "2024-06-12T14:32:00Z",
  author: "Dr. Sarah Chen",
  version: 7,
  agency: "EPA Region 9",
  deadline: "2024-08-15",
};

const MOCK_CONTENT = `4.1 Hydrological Baseline Assessment

The study area encompasses approximately 847 acres of coastal wetland habitat along the northern shoreline of San Francisco Bay. Baseline hydrological conditions were assessed using a combination of field measurements, remote sensing data, and hydrodynamic modeling conducted between March 2022 and November 2023.

Tidal inundation patterns were characterized using continuous water level recorders deployed at six monitoring stations distributed across the project footprint. Mean higher high water (MHHW) elevations range from 1.2 m to 1.8 m NAVD88 across the study area, reflecting the complex microtopography characteristic of restored tidal wetlands.

4.2 Salinity Gradient Analysis

Salinity measurements collected during the monitoring period indicate a well-defined gradient from polyhaline conditions near the bay margin to mesohaline and oligohaline zones in the upper marsh. Surface water salinity ranged from 28 ppt at the tidal inlet to 4 ppt at the freshwater confluence point approximately 2.3 km inland.

The salinity regime supports a diverse assemblage of halophytic vegetation communities, including Spartina foliosa, Salicornia pacifica, and Distichlis spicata in the lower marsh zones, transitioning to Schoenoplectus acutus and Typha spp. in the upper marsh and freshwater transition areas.

4.3 Sediment Transport and Accretion Rates

Vertical accretion rates were measured using feldspar marker horizons established at twelve locations across the study area. Mean annual accretion rates of 6.2 mm/yr were recorded in the lower marsh, declining to 3.8 mm/yr in the upper marsh zones. These rates are consistent with regional estimates and suggest the wetland system is maintaining elevation relative to current sea level rise projections.

Suspended sediment concentrations in tidal waters averaged 142 mg/L during flood tides, providing sufficient sediment supply to support continued accretion under moderate sea level rise scenarios. However, projected increases in sea level rise rates under RCP 8.5 scenarios may exceed the accretion capacity of upper marsh zones by 2075.

4.4 Groundwater Interactions

Shallow groundwater monitoring wells installed at eight locations indicate a strong hydraulic connection between the wetland surface water and the underlying unconfined aquifer. Groundwater levels fluctuate in response to tidal forcing, with tidal efficiency coefficients ranging from 0.3 to 0.7 depending on distance from tidal channels and sediment permeability.

The groundwater system plays a critical role in maintaining soil moisture conditions during neap tide periods and drought years, supporting vegetation communities that would otherwise be stressed by extended dry periods.`;

const MOCK_SOURCES = [
  { id: "src-001", title: "NOAA Tidal Datum Reference 2023", url: "https://tidesandcurrents.noaa.gov", type: "Government", attached: true, claimId: "claim-001" },
  { id: "src-002", title: "EPA Wetland Delineation Manual", url: "https://epa.gov/wetlands", type: "Regulatory", attached: true, claimId: "claim-002" },
  { id: "src-003", title: "San Francisco Bay Regional Water Quality Control Board Basin Plan", url: "https://waterboards.ca.gov", type: "Regulatory", attached: false, claimId: null },
  { id: "src-004", title: "Callaway et al. (2012) Sediment Accretion in SF Bay Marshes", url: "https://doi.org/10.1007/s12237-012-9508-9", type: "Peer-reviewed", attached: true, claimId: "claim-003" },
  { id: "src-005", title: "IPCC AR6 Sea Level Rise Projections", url: "https://ipcc.ch/ar6", type: "Scientific", attached: false, claimId: null },
];

const MOCK_UNSOURCED_CLAIMS = [
  { id: "claim-001", text: "Mean annual accretion rates of 6.2 mm/yr were recorded in the lower marsh", paragraph: "4.3", severity: "high", suggestion: "Cite feldspar marker horizon study data or Callaway et al. (2012)" },
  { id: "claim-002", text: "Suspended sediment concentrations in tidal waters averaged 142 mg/L", paragraph: "4.3", severity: "high", suggestion: "Reference field measurement data from monitoring report" },
  { id: "claim-003", text: "projected increases in sea level rise rates under RCP 8.5 scenarios may exceed the accretion capacity", paragraph: "4.3", severity: "medium", suggestion: "Cite IPCC AR6 or NOAA sea level rise technical report" },
  { id: "claim-004", text: "Tidal efficiency coefficients ranging from 0.3 to 0.7", paragraph: "4.4", severity: "medium", suggestion: "Reference groundwater monitoring well data report" },
  { id: "claim-005", text: "847 acres of coastal wetland habitat", paragraph: "4.1", severity: "low", suggestion: "Cite project boundary survey or GIS analysis report" },
  { id: "claim-006", text: "Surface water salinity ranged from 28 ppt at the tidal inlet to 4 ppt", paragraph: "4.2", severity: "high", suggestion: "Reference field salinity monitoring data" },
];

const MOCK_AI_SUGGESTIONS = [
  {
    id: "sug-001",
    type: "clarity",
    original: "Mean higher high water (MHHW) elevations range from 1.2 m to 1.8 m NAVD88 across the study area",
    suggested: "Mean higher high water (MHHW) elevations range from 1.2 m to 1.8 m (NAVD88 datum) across the study area, reflecting a 0.6 m vertical range driven by microtopographic variation.",
    reason: "Adding datum clarification and quantifying the range improves regulatory clarity.",
    impact: "+1.2 readiness",
    status: "pending" as const,
    category: "Precision",
  },
  {
    id: "sug-002",
    type: "completeness",
    original: "Salinity measurements collected during the monitoring period indicate a well-defined gradient",
    suggested: "Salinity measurements collected during the 20-month monitoring period (March 2022 to November 2023) indicate a well-defined longitudinal gradient",
    reason: "Specifying the monitoring duration strengthens the evidentiary basis for the gradient characterization.",
    impact: "+0.8 readiness",
    status: "pending" as const,
    category: "Completeness",
  },
  {
    id: "sug-003",
    type: "regulatory",
    original: "The groundwater system plays a critical role in maintaining soil moisture conditions",
    suggested: "The groundwater system plays a critical role in maintaining soil moisture conditions consistent with 33 CFR Part 328 wetland hydrology criteria, particularly during neap tide periods and drought years.",
    reason: "Explicit regulatory citation (33 CFR Part 328) directly addresses EPA review criteria for wetland delineation.",
    impact: "+2.1 readiness",
    status: "accepted" as const,
    category: "Regulatory Alignment",
  },
  {
    id: "sug-004",
    type: "structure",
    original: "However, projected increases in sea level rise rates under RCP 8.5 scenarios may exceed the accretion capacity of upper marsh zones by 2075.",
    suggested: "However, under high-emission RCP 8.5 scenarios, projected sea level rise rates of 8–12 mm/yr by mid-century may exceed the measured accretion capacity of upper marsh zones (3.8 mm/yr), posing a long-term resilience risk by 2075. Adaptive management measures are addressed in Section 7.",
    reason: "Quantifying the gap between SLR projections and accretion rates, and cross-referencing Section 7, strengthens the impact analysis.",
    impact: "+1.8 readiness",
    status: "rejected" as const,
    category: "Impact Analysis",
  },
];

const MOCK_VERSIONS = [
  { id: "v7", version: 7, date: "2024-06-12T14:32:00Z", author: "Dr. Sarah Chen", changes: "Added groundwater interaction analysis (Section 4.4). Updated salinity gradient data.", score: 87, wordCount: 4218 },
  { id: "v6", version: 6, date: "2024-06-08T09:15:00Z", author: "Marcus Webb", changes: "Revised sediment transport section with updated accretion rate data from Q1 2024 monitoring.", score: 84, wordCount: 3980 },
  { id: "v5", version: 5, date: "2024-05-29T16:45:00Z", author: "Dr. Sarah Chen", changes: "Incorporated peer review comments. Expanded tidal inundation analysis.", score: 82, wordCount: 3750 },
  { id: "v4", version: 4, date: "2024-05-20T11:00:00Z", author: "James Okafor", changes: "Initial salinity gradient section added. Baseline hydrological data integrated.", score: 79, wordCount: 3200 },
  { id: "v3", version: 3, date: "2024-05-10T08:30:00Z", author: "Dr. Sarah Chen", changes: "Structural reorganization. Separated hydrology baseline from sediment analysis.", score: 76, wordCount: 2900 },
  { id: "v2", version: 2, date: "2024-04-28T13:20:00Z", author: "Marcus Webb", changes: "Draft content for Sections 4.1 and 4.2. Placeholder data replaced with field measurements.", score: 72, wordCount: 2100 },
  { id: "v1", version: 1, date: "2024-04-15T10:00:00Z", author: "James Okafor", changes: "Initial document creation. Outline and section headers established.", score: 65, wordCount: 800 },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessRing({ score, size = 64 }: { score: number; size?: number }) {
  const band = getBandForScore(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, ((score - 60) / 40) * 100));
  const offset = circumference - (pct / 100) * circumference;

  const strokeColor =
    score >= 95 ? "#10b981" :
    score >= 90 ? "#6366f1" :
    score >= 85 ? "#3b82f6" :
    "#f59e0b";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={strokeColor} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-800">{score}</span>
    </div>
  );
}

function BandChip({ band }: { band: ReturnType<typeof getBandForScore> }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", band.bgColor, band.color, band.borderColor)}>
      {band.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Draft": "bg-slate-100 text-slate-600 border-slate-200",
    "In Review": "bg-amber-50 text-amber-700 border-amber-200",
    "Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Filed": "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status] ?? "bg-slate-100 text-slate-600 border-slate-200")}>
      {status}
    </span>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-slate-100", className)} />;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function EditorToolbar({ onCommand }: { onCommand: (cmd: string, val?: string) => void }) {
  const tools = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: List, cmd: "insertUnorderedList", label: "Bullet list" },
    { icon: AlignLeft, cmd: "justifyLeft", label: "Align left" },
    { icon: AlignCenter, cmd: "justifyCenter", label: "Align center" },
  ];

  return (
    <div className="flex items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-3 py-1.5">
      {tools.map(({ icon: Icon, cmd, label }) => (
        <button
          key={cmd}
          title={label}
          onMouseDown={(e) => { e.preventDefault(); onCommand(cmd); }}
          className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
      <div className="mx-2 h-4 w-px bg-slate-300" />
      {["H1", "H2", "H3"].map((h) => (
        <button
          key={h}
          title={h}
          onMouseDown={(e) => {
            e.preventDefault();
            onCommand("formatBlock", h.toLowerCase());
          }}
          className="flex h-7 items-center rounded px-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
        >
          {h}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-1">
        <span className="text-xs text-slate-400">4,218 words</span>
      </div>
    </div>
  );
}

// ─── Score Panel ──────────────────────────────────────────────────────────────

function ScorePanel({ doc }: { doc: typeof MOCK_DOCUMENT }) {
  const band = getBandForScore(doc.readinessScore);
  const targetBandConfig = QUALITY_BANDS.find((b) => b.label === doc.targetBand) ?? QUALITY_BANDS[2];
  const gap = targetBandConfig.min - doc.readinessScore;

  return (
    <motion.div variants={slideInRight} initial="hidden" animate="visible" className="flex flex-col gap-4">
      {/* Score */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Readiness</span>
          <StatusBadge status={doc.status} />
        </div>
        <div className="flex items-center gap-4">
          <ReadinessRing score={doc.readinessScore} size={72} />
          <div>
            <div className="text-2xl font-bold text-slate-900">{doc.readinessScore}</div>
            <BandChip band={band} />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Target band</span>
            <BandChip band={targetBandConfig} />
          </div>
          {gap > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Gap to target</span>
              <span className="font-medium text-amber-600">+{gap} pts needed</span>
            </div>
          )}
          {gap <= 0 && (
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3 w-3" />
              <span>Target band reached</span>
            </div>
          )}
        </div>
      </div>

      {/* Band scale */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">Quality Bands</span>
        <div className="space-y-2">
          {QUALITY_BANDS.map((b) => {
            const active = doc.readinessScore >= b.min && doc.readinessScore <= b.max;
            return (
              <div key={b.label} className={cn("flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all", active ? cn(b.bgColor, b.borderColor) : "border-transparent bg-slate-50")}>
                <span className={cn("font-medium", active ? b.color : "text-slate-500")}>{b.label}</span>
                <span className={cn(active ? b.color : "text-slate-400")}>{b.min}–{b.max}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">Document Info</span>
        <dl className="space-y-2 text-xs">
          {[
            { label: "Author", value: doc.author },
            { label: "Version", value: `v${doc.version}` },
            { label: "Agency", value: doc.agency },
            { label: "Deadline", value: formatDate(doc.deadline) },
            { label: "Last modified", value: formatDate(doc.lastModified) },
            { label: "Unsourced claims", value: String(doc.unsourcedClaims), warn: doc.unsourcedClaims > 0 },
          ].map(({ label, value, warn }) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-slate-500">{label}</dt>
              <dd className={cn("font-medium", warn ? "text-amber-600" : "text-slate-800")}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}

// ─── Sources Tab ──────────────────────────────────────────────────────────────

function SourcesTab() {
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [search, setSearch] = useState("");

  const filtered = sources.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggleAttach(id: string) {
    setSources((prev) =>
      prev.map((s) => s.id === id ? { ...s, attached: !s.attached } : s)
    );
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" />
          Add Source
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((src) => (
          <motion.div
            key={src.id}
            layout
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className={cn("mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors", src.attached ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white")}>
              {src.attached && <Check className="h-3 w-3 text-white" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{src.title}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{src.type}</span>
                <span className="truncate text-xs text-slate-400">{src.url}</span>
              </div>
            </div>
            <button
              onClick={() => toggleAttach(src.id)}
              className={cn("flex-shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors", src.attached ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100")}
            >
              {src.attached ? "Detach" : "Attach"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Unsourced Claims Tab ─────────────────────────────────────────────────────

function UnsourcedClaimsTab() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(true);
  const [claims, setClaims] = useState(MOCK_UNSOURCED_CLAIMS);
  const [resolved, setResolved] = useState<string[]>([]);

  function handleScan() {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  }

  function resolve(id: string) {
    setResolved((prev) => [...prev, id]);
  }

  const severityColor: Record<string, string> = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    low: "text-slate-600 bg-slate-100 border-slate-200",
  };

  const activeClaims = claims.filter((c) => !resolved.includes(c.id));

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-700">{activeClaims.length} unsourced claims detected</span>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {scanning ? (
            <>
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="h-3.5 w-3.5" />
              Re-scan
            </>
          )}
        </button>
      </div>

      {scanning && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3">
              <SkeletonBlock className="mb-2 h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!scanning && scanned && (
        <div className="space-y-2">
          {activeClaims.map((claim) => (
            <motion.div
              key={claim.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className={cn("flex-shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize", severityColor[claim.severity])}>
                  {claim.severity}
                </span>
                <span className="text-xs text-slate-400">§{claim.paragraph}</span>
              </div>
              <p className="mb-1.5 text-sm text-slate-700">"{claim.text}"</p>
              <p className="mb-2 text-xs text-slate-500">{claim.suggestion}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => resolve(claim.id)}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  Mark resolved
                </button>
                <button className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100">
                  Find source
                </button>
              </div>
            </motion.div>
          ))}
          {activeClaims.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <p className="text-sm font-medium text-slate-700">All claims resolved</p>
              <p className="text-xs text-slate-400">Every claim in this document has a source attached.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Deep Review Tab ──────────────────────────────────────────────────────────

function DeepReviewTab() {
  const [suggestions, setSuggestions] = useState(MOCK_AI_SUGGESTIONS);
  const [loading, setLoading] = useState(false);

  function handleAccept(id: string) {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "accepted" as const } : s));
  }

  function handleReject(id: string) {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected" as const } : s));
  }

  function handleRunReview() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2500);
  }

  const categoryColor: Record<string, string> = {
    "Precision": "bg-blue-50 text-blue-700 border-blue-200",
    "Completeness": "bg-purple-50 text-purple-700 border-purple-200",
    "Regulatory Alignment": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Impact Analysis": "bg-amber-50 text-amber-700 border-amber-200",
  };

  const pending = suggestions.filter((s) => s.status === "pending");
  const decided = suggestions.filter((s) => s.status !== "pending");

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">AI Deep Review</span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">{pending.length} pending</span>
        </div>
        <button
          onClick={handleRunReview}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Run Review
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <SkeletonBlock className="mb-3 h-4 w-1/3" />
              <SkeletonBlock className="mb-2 h-3 w-full" />
              <SkeletonBlock className="mb-2 h-3 w-5/6" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</p>
              {pending.map((sug) => (
                <motion.div
                  key={sug.id}
                  layout
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", categoryColor[sug.category] ?? "bg-slate-100 text-slate-600 border-slate-200")}>
                      {sug.category}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">{sug.impact}</span>
                  </div>
                  <div className="mb-2 space-y-1.5">
                    <div className="rounded-lg bg-red-50 p-2.5">
                      <p className="text-xs font-medium text-red-600 mb-1">Original</p>
                      <p className="text-xs text-red-800 leading-relaxed">{sug.original}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-2.5">
                      <p className="text-xs font-medium text-emerald-600 mb-1">Suggested</p>
                      <p className="text-xs text-emerald-800 leading-relaxed">{sug.suggested}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">{sug.reason}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(sug.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(sug.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {decided.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Decided</p>
              {decided.map((sug) => (
                <div
                  key={sug.id}
                  className={cn("flex items-center justify-between rounded-xl border p-3", sug.status === "accepted" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")}
                >
                  <div className="flex items-center gap-2">
                    {sug.status === "accepted" ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-xs font-medium text-slate-700">{sug.category}</span>
                  </div>
                  <span className={cn("text-xs font-medium capitalize", sug.status === "accepted" ? "text-emerald-600" : "text-slate-400")}>
                    {sug.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Version History Tab ──────────────────────────────────────────────────────

function VersionHistoryTab({ onCompare }: { onCompare: (v1: typeof MOCK_VERSIONS[0], v2: typeof MOCK_VERSIONS[0]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  function handleCompare() {
    if (selected.length === 2) {
      const v1 = MOCK_VERSIONS.find((v) => v.id === selected[0]);
      const v2 = MOCK_VERSIONS.find((v) => v.id === selected[1]);
      if (v1 && v2) onCompare(v1, v2);
    }
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{MOCK_VERSIONS.length} versions</span>
        {selected.length === 2 && (
          <button
            onClick={handleCompare}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Eye className="h-3.5 w-3.5" />
            Compare selected
          </button>
        )}
      </div>

      <div className="relative space-y-0">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
        {MOCK_VERSIONS.map((v, i) => {
          const isSelected = selected.includes(v.id);
          const isCurrent = i === 0;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex gap-3 pb-4"
            >
              <button
                onClick={() => toggleSelect(v.id)}
                className={cn("relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all", isSelected ? "border-blue-500 bg-blue-500 text-white" : isCurrent ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-blue-300")}
              >
                v{v.version}
              </button>
              <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Current</span>
                    )}
                    <span className="text-xs font-medium text-slate-700">{v.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReadinessRing score={v.score} size={28} />
                    <span className="text-xs text-slate-400">{formatDate(v.date)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{v.changes}</p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                  <span>{v.wordCount.toLocaleString("en-US")} words</span>
                  <span>Score: {v.score}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Compare Modal ────────────────────────────────────────────────────────────

function CompareModal({
  v1,
  v2,
  onClose,
}: {
  v1: typeof MOCK_VERSIONS[0];
  v2: typeof MOCK_VERSIONS[0];
  onClose: () => void;
}) {
  const older = v1.version < v2.version ? v1 : v2;
  const newer = v1.version > v2.version ? v1 : v2;

  const olderContent = `4.1 Hydrological Baseline Assessment

The study area encompasses approximately 847 acres of coastal wetland habitat. Baseline hydrological conditions were assessed using field measurements and remote sensing data conducted between March 2022 and November 2023.

Tidal inundation patterns were characterized using water level recorders at six monitoring stations. Mean higher high water (MHHW) elevations range from 1.2 m to 1.8 m NAVD88.`;

  const newerContent = `4.1 Hydrological Baseline Assessment

The study area encompasses approximately 847 acres of coastal wetland habitat along the northern shoreline of San Francisco Bay. Baseline hydrological conditions were assessed using a combination of field measurements, remote sensing data, and hydrodynamic modeling conducted between March 2022 and November 2023.

Tidal inundation patterns were characterized using continuous water level recorders deployed at six monitoring stations distributed across the project footprint. Mean higher high water (MHHW) elevations range from 1.2 m to 1.8 m NAVD88 across the study area, reflecting the complex microtopography characteristic of restored tidal wetlands.`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Side-by-side Compare</h2>
              <span className="text-sm text-slate-500">v{older.version} vs v{newer.version}</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {[
              { label: `v${older.version}`, author: older.author, date: older.date, score: older.score, content: olderContent },
              { label: `v${newer.version}`, author: newer.author, date: newer.date, score: newer.score, content: newerContent },
            ].map((side) => (
              <div key={side.label} className="flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">{side.label}</span>
                    <span className="text-xs text-slate-500">{side.author}</span>
                    <span className="text-xs text-slate-400">{formatDate(side.date)}</span>
                  </div>
                  <ReadinessRing score={side.score} size={32} />
                </div>
                <div className="h-96 overflow-y-auto p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">{side.content}</pre>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Score change: <span className={cn("font-medium", newer.score > older.score ? "text-emerald-600" : "text-red-600")}>{newer.score > older.score ? "+" : ""}{newer.score - older.score} pts</span></span>
              <span>Words: {older.wordCount.toLocaleString("en-US")} → {newer.wordCount.toLocaleString("en-US")}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "sources" | "claims" | "review" | "history";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "sources", label: "Attach Sources", icon: FileText },
  { id: "claims", label: "Unsourced Claims", icon: AlertCircle },
  { id: "review", label: "Deep Review", icon: Sparkles },
  { id: "history", label: "Version History", icon: Clock },
];

export default function DocumentEditorPage() {
  const [activeTab, setActiveTab] = useState<TabId>("sources");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{ v1: typeof MOCK_VERSIONS[0]; v2: typeof MOCK_VERSIONS[0] } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const doc = MOCK_DOCUMENT;

  function execCommand(cmd: string, val?: string) {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }

  function handleSave() {
    setIsSaving(true);
    setSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  }

  function handleCompare(v1: typeof MOCK_VERSIONS[0], v2: typeof MOCK_VERSIONS[0]) {
    setCompareVersions({ v1, v2 });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-3">
            <Link
              href={`/projects/${doc.projectId}`}
              className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{doc.projectName}</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-800 truncate max-w-xs">{doc.title}</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60"
              >
                {isSaving ? (
                  <><Activity className="h-3.5 w-3.5 animate-pulse" />Saving...</>
                ) : saved ? (
                  <><Check className="h-3.5 w-3.5 text-emerald-500" />Saved</>
                ) : (
                  <><Save className="h-3.5 w-3.5" />Save</>
                )}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50">
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700">
                <Upload className="h-3.5 w-3.5" />
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Editor + Tabs */}
          <div className="flex flex-col gap-6">
            {/* Document title */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{doc.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{doc.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Modified {formatDate(doc.lastModified)} at {formatTime(doc.lastModified)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />v{doc.version}</span>
                <span>·</span>
                <span>{doc.type}</span>
              </div>
            </motion.div>

            {/* Rich text editor */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
            >
              <EditorToolbar onCommand={execCommand} />
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[520px] px-8 py-6 text-sm leading-relaxed text-slate-800 focus:outline-none"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: MOCK_CONTENT.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>").replace(/^/, "<p>").replace(/$/, "</p>") }}
              />
            </motion.div>

            {/* Tabs panel */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
            >
              {/* Tab bar */}
              <div className="flex border-b border-slate-200 overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={cn(
                        "relative flex flex-shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                        isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {id === "claims" && doc.unsourcedClaims > 0 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700">{doc.unsourcedClaims}</span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600"
                          transition={{ type: "spring", duration: 0.3 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activeTab === "sources" && <SourcesTab key="sources" />}
                  {activeTab === "claims" && <UnsourcedClaimsTab key="claims" />}
                  {activeTab === "review" && <DeepReviewTab key="review" />}
                  {activeTab === "history" && <VersionHistoryTab key="history" onCompare={handleCompare} />}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right: Score panel */}
          <div className="flex flex-col gap-4">
            <ScorePanel doc={doc} />
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {compareVersions && (
        <CompareModal
          v1={compareVersions.v1}
          v2={compareVersions.v2}
          onClose={() => setCompareVersions(null)}
        />
      )}
    </div>
  );
}