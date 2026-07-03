"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileText } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, navLinks } from "@/lib/data";
import { fadeInUp } from "@/lib/motion";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/", type: "route" as const },
      { label: "Projects", href: "/projects/proj-001", type: "route" as const },
      { label: "Context Manager", href: "/projects/proj-001/context", type: "route" as const },
      { label: "Audit Trail", href: "/projects/proj-001/audit", type: "route" as const },
    ],
  },
  {
    title: "Workflow",
    links: [
      { label: "Filing Package", href: "/projects/proj-001/filing", type: "route" as const },
      { label: "Document Editor", href: "/projects/proj-001/documents/doc-001", type: "route" as const },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about", type: "anchor" as const },
      { label: "Privacy", href: "#privacy", type: "anchor" as const },
      { label: "Terms", href: "#terms", type: "anchor" as const },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  function getHref(href: string, type: "route" | "anchor") {
    if (type === "anchor") {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: "route" | "anchor"
  ) {
    if (type === "anchor" && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5"
        >
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              {APP_TAGLINE}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Built for environmental consultants, engineering firms, and permit managers.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={getHref(link.href, link.type)}
                      onClick={(e) => handleClick(e, link.href, link.type)}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Compliance workspace for regulatory professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}