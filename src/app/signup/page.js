"use client";
import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [step, setStep] = useState("choose"); // choose, tenant, landlord, verify
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    agreed: false,
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(selectedRole);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed.");
      setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      localStorage.setItem("patamtaani_user", JSON.stringify(data.user));
window.location.href = role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <Link href="/" className="text-xl font-black">
          <span className="text-white">Pata</span>
          <span className="text-[#FF6B35]">Mtaani</span>
        </Link>
        <p className="text-sm text-[#888]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6B35] hover:underline">Log in</Link>
        </p>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">

        {/* STEP 1 — CHOOSE ROLE */}
        {step === "choose" && (
          <div className="w-full max-w-lg text-center">
            <h1 className="text-3xl font-black mb-3">Join PataMtaani</h1>
            <p className="text-[#888] mb-10">Tell us who you are to get started.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect("tenant")}
                className="bg-[#111111] border border-[#2a2a2a] hover:border-[#FF6B35] rounded-2xl p-8 text-left transition group"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-[#FF6B35] transition">I'm looking for a house</h2>
                <p className="text-sm text-[#888]">Browse affordable listings in your neighborhood.</p>
              </button>
              <button
                onClick={() => handleRoleSelect("landlord")}
                className="bg-[#111111] border border-[#2a2a2a] hover:border-[#FF6B35] rounded-2xl p-8 text-left transition group"
              >
                <div className="text-4xl mb-4">🏠</div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-[#FF6B35] transition">I'm a landlord</h2>
                <p className="text-sm text-[#888]">List your property and reach thousands of tenants.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — SIGNUP FORM */}
        {(step === "tenant" || step === "landlord") && (
          <div className="w-full max-w-md">
            <button onClick={() => setStep("choose")} className="text-sm text-[#888] hover:text-white mb-6 flex items-center gap-1 transition">
              ← Back
            </button>
            <h1 className="text-3xl font-black mb-2">
              {step === "tenant" ? "Find your next home" : "List your property"}
            </h1>
            <p className="text-[#888] mb-8">Create your free PataMtaani account.</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Kamau"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712 345678"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  name="agreed"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="mt-1 accent-[#FF6B35]"
                />
                <label htmlFor="agreed" className="text-sm text-[#888]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#FF6B35] hover:underline">Terms and Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3 — OTP VERIFICATION */}
        {step === "verify" && (
          <div className="w-full max-w-md text-center">
            <div className="text-5xl mb-6">📧</div>
            <h1 className="text-3xl font-black mb-3">Check your email</h1>
            <p className="text-[#888] mb-8">
              We sent a 6-digit verification code to <span className="text-white font-medium">{formData.email}</span>. Enter it below to verify your account.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-4 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-center text-2xl tracking-widest"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}