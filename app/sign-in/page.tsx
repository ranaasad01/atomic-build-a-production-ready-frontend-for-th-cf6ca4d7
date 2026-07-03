"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Eye, EyeOff, ArrowRight, Shield, CheckCircle, Lock } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

const FEATURES = [
  {
    icon: Shield,
    title: "SOC 2 Compliant",
    description: "Enterprise-grade security for sensitive regulatory data.",
  },
  {
    icon: CheckCircle,
    title: "Audit-Ready",
    description: "Every action logged and traceable for compliance reviews.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description: "Granular permissions for consultants, reviewers, and managers.",
  },
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email === "wrong@example.com") {
        setError("Invalid email or password. Please try again.");
      } else {
        setSuccess(true);
      }
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between bg-slate-900 p-12 relative overflow-hidden"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.18)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.12)_0%,_transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.5) 39px,rgba(255,255,255,0.5) 40px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Center content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-md"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4"
          >
            Compliance Workspace
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight text-balance mb-5"
          >
            Regulatory filings, done with confidence.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-base leading-relaxed mb-10"
          >
            {APP_TAGLINE}
          </motion.p>

          <motion.div variants={staggerContainer} className="space-y-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 border border-white/10">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">
                      {feature.title}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10"
        >
          <blockquote className="border-l-2 border-blue-500 pl-4">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "FilingDesk cut our permit preparation time by 40%. The readiness scoring alone is worth it."
            </p>
            <footer className="mt-2 text-xs text-slate-500">
              Sarah Chen, Senior Environmental Consultant at Meridian EHS
            </footer>
          </blockquote>
        </motion.div>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <div className="mb-8 flex lg:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm group-hover:bg-blue-500 transition-colors">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-slate-900 tracking-tight">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="w-full max-w-sm"
        >
          {success ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-sm text-slate-500 mb-6">
                You have signed in successfully. Redirecting to your dashboard.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
                  Sign in to {APP_NAME}
                </h1>
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Request access
                  </Link>
                </p>
              </div>

              {/* Demo hint */}
              <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs font-medium text-blue-700 mb-0.5">
                  Demo credentials
                </p>
                <p className="text-xs text-blue-600">
                  Use any email (except wrong@example.com) and any password to sign in.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/"
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe((v) => !v)}
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                      rememberMe
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                      >
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-slate-600 select-none cursor-pointer" onClick={() => setRememberMe((v) => !v)}>
                    Keep me signed in for 30 days
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-100 bg-red-50 px-4 py-3"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or continue with</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* SSO options */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                >
                  <svg className="h-4 w-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </motion.button>
              </div>

              {/* SAML SSO */}
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                >
                  Sign in with SAML SSO
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
                By signing in, you agree to our{" "}
                <Link href="/" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}