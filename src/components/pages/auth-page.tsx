"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTrendoraStore } from "@/store/trendora-store";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const signIn = useTrendoraStore((state) => state.signIn);
  const signUp = useTrendoraStore((state) => state.signUp);

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "login") {
      const result = signIn({ email: form.email, password: form.password });
      setMessage(result.message);
      if (result.ok) {
        router.push(result.role === "admin" ? "/admin" : "/profile");
      }
      return;
    }

    const result = signUp(form);
    setMessage(result.message);
    if (result.ok) {
      router.push("/profile");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div className="surface rounded-[2rem] border p-8 shadow-soft lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold">
          {mode === "login" ? "Login to your Trendora account" : "Sign up for a smarter shopping journey"}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {mode === "login"
            ? "Use the demo user or admin credentials to explore protected profile, checkout, and dashboard experiences."
            : "Create a customer account to save wishlist items, review products, and place demo orders."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "signup" ? (
            <>
              <label className="grid gap-2 text-sm font-medium">
                Full name
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Phone
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required />
              </label>
            </>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required />
          </label>

          {message ? <p className="rounded-2xl border px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}

          <button type="submit" className="rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>

      <div className="surface rounded-[2rem] border p-8 shadow-glow lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Demo Access</p>
        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.5rem] border bg-white/70 p-5 dark:bg-slate-900/70">
            <h2 className="font-semibold">Customer Account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Email: anaya@trendora.in</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Password: trendora123</p>
          </div>
          <div className="rounded-[1.5rem] border bg-white/70 p-5 dark:bg-slate-900/70">
            <h2 className="font-semibold">Admin Account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Email: admin@trendora.in</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Password: admin123</p>
          </div>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-accent">
            {mode === "login" ? "Sign up here" : "Login here"}
          </Link>
        </p>
      </div>
    </div>
  );
}
