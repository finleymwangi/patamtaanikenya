"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();

  const startTimer = () => {
    setOtpTimer(60);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (step === "code") startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error("Server error. Please try again."); }
      if (!res.ok) throw new Error(data.error || "Failed to send code.");
      setStep("code");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error("Server error. Please try again."); }
      if (!res.ok) throw new Error(data.error || "Invalid or expired code.");
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error("Server error."); }
      if (!res.ok) throw new Error(data.error || "Failed to resend.");
      setOtp("");
      startTimer();
      setMessage("✓ New code sent!");
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error("Server error. Please try again."); }
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <Link href="/" className="text-xl font-black">
          <span className="text-white">Pata</span>
          <span className="text-[#FF6B35]">Mtaani</span>
        </Link>
        <Link href="/login" className="text-sm text-[#888] hover:text-white transition">Back to Login</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* STEP 1 — ENTER EMAIL */}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔐</div>
                <h1 className="text-3xl font-black mb-2">Forgot your password?</h1>
                <p className="text-[#888]">Enter your email and we'll send you a 6-digit reset code.</p>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="text-sm text-[#888] mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@email.com"
                    required
                    className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {loading ? "Sending code..." : "Send Reset Code"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — ENTER CODE */}
          {step === "code" && (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">📧</div>
                <h1 className="text-3xl font-black mb-2">Enter reset code</h1>
                <p className="text-[#888]">
                  We sent a 6-digit code to <span className="text-white font-medium">{email}</span>. Enter it below.
                </p>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              {message && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  inputMode="numeric"
                  required
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-4 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-center text-2xl tracking-widest"
                />
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
              <div className="text-center mt-4 text-sm">
                {canResend ? (
                  <button onClick={handleResend} disabled={resendLoading} className="text-[#FF6B35] hover:underline disabled:opacity-50 font-medium">
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>
                ) : (
                  <p className="text-[#888]">Resend code in <span className="text-white font-medium tabular-nums">{otpTimer}s</span></p>
                )}
              </div>
              <div className="text-center mt-3">
                <button onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="text-sm text-[#888] hover:text-white transition">← Use a different email</button>
              </div>
            </>
          )}

          {/* STEP 3 — NEW PASSWORD */}
          {step === "reset" && (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔑</div>
                <h1 className="text-3xl font-black mb-2">Create new password</h1>
                <p className="text-[#888]">Choose a strong password for your account.</p>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm text-[#888] mb-1.5 block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#888] mb-1.5 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* STEP 4 — DONE */}
          {step === "done" && (
            <div className="text-center">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-black mb-3">Password reset!</h1>
              <p className="text-[#888] mb-8">Your password has been updated successfully. You can now log in with your new password.</p>
              <Link href="/login" className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-8 py-3 rounded-xl transition inline-block">
                Go to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}