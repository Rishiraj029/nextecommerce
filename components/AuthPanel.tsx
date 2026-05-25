"use client";

import { useState } from "react";
import { Loader2, LogIn, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function AuthPanel() {
  const { user, loading, refresh, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
    const body =
      mode === "signup"
        ? {
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
          }
        : {
            email: form.get("email"),
            password: form.get("password"),
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        const email = (form.get("email") as string) || "";

        if (mode === "signin" && data.redirectToSignup) {
          setSavedEmail(email);
          setMode("signup");
          setError(data.message || "Please sign up to continue.");
          return;
        }

        throw new Error(data.message || "Request failed");
      }

      await refresh();
      setOpen(false);
      setSavedEmail("");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  if (user) {
    return (
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-700">
              Signed in as <span className="font-semibold text-gray-900">{user.name}</span>
              <span className="text-gray-500"> ({user.email})</span>
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                My orders
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!open ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">
              Optional — create an account to save order history. Browse without signing in.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setOpen(true);
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setOpen(true);
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    mode === "signin"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    mode === "signup"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  Sign up
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {mode === "signup" && (
                <div className="sm:col-span-2">
                  <label htmlFor="auth-name" className="block text-xs font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    name="name"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div className={mode === "signup" ? "" : "sm:col-span-2"}>
                <label htmlFor="auth-email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  key={`email-${savedEmail}-${mode}`}
                  defaultValue={savedEmail}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "signup" ? "Create account" : "Sign in"}
                </button>
                <p className="text-xs text-gray-500">
                  Accounts saved in MongoDB
                </p>
              </div>
            </form>

            {error && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
