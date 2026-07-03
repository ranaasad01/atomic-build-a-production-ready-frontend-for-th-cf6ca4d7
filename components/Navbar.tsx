"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, FileText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: "route" | "anchor"
  ) {
    if (type === "anchor") {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function getHref(href: string, type: "route" | "anchor") {
    if (type === "anchor") {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  function isActive(href: string, type: "route" | "anchor") {
    if (type === "anchor") return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.type);
            return (
              <Link
                key={link.href}
                href={getHref(link.href, link.type)}
                onClick={(e) => handleNavClick(e, link.href, link.type)}
                className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${link.highlight ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : ""}`}
              >
                {link.label}
                {active && !link.highlight && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-slate-100"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.type);
                return (
                  <Link
                    key={link.href}
                    href={getHref(link.href, link.type)}
                    onClick={(e) => {
                      handleNavClick(e, link.href, link.type);
                      setMobileOpen(false);
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <Link
                  href="/sign-in"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/"
                  className="rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}