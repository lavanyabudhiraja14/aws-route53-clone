"use client";

import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AwsSmile } from "@/components/AwsLogo";
import { Field, PrimaryButton, inputClass } from "@/components/ui";

export default function LoginPage() {
  const { login, ready, authenticated } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#232f3e] text-sm text-white/80">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eaeded]">
      <header className="flex h-10 items-center bg-[#232f3e] px-4">
        <AwsSmile className="h-5 w-14" />
      </header>
      <div className="flex flex-1 items-start justify-center px-4 py-16">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-sm border border-[#d5dbdb] bg-white p-8 shadow-sm"
        >
          <h1 className="mb-1 text-[22px] font-normal text-[#16191f]">Sign in</h1>
          <p className="mb-6 text-[13px] text-[#545b64]">
            Amazon Web Services Management Console (mock)
          </p>
          {error ? (
            <div className="mb-4 rounded-sm border border-[#d13212] bg-[#fdf3f1] px-3 py-2 text-[13px] text-[#d13212]">
              {error}
            </div>
          ) : (
            <div className="mb-4 rounded-sm border border-[#d5dbdb] bg-[#fafafa] px-3 py-2 text-[12px] text-[#545b64]">
              Mock credentials are pre-filled: <strong>admin</strong> / <strong>admin123</strong>
            </div>
          )}
          <Field label="Root user email address or IAM username">
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          <PrimaryButton type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
