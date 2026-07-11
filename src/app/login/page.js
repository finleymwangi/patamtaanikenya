"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || null;

  useEffect(() => {
    const stored = localStorage.getItem("patamtaani_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(user.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem("patamtaani_user", JSON.stringify(data.user));
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(data.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-black">
          <span className="text-white">Pata</span>
          <span className="text-[#FF6B35]">Mtaani</span>
        </Link>
        <p className="text-[#888] text-sm mt-2">Welcome back</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-[#888] mb-1.5 block">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
          />
        </div>
        <div>
          <label className="text-sm text-[#888] mb-1.5 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <Link href="/forgot-password" className="block text-sm text-[#888] hover:text-white transition">
          Forgot your password?
        </Link>
        <p className="text-sm text-[#888]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#FF6B35] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <Suspense fallback={
        <div className="w-full max-w-sm text-center">
          <div className="text-2xl font-black mb-4">
            <span className="text-white">Pata</span>
            <span className="text-[#FF6B35]">Mtaani</span>
          </div>
          <p className="text-[#888]">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}