"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyOTPForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]$/.test(value) && value !== "") return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      localStorage.setItem("patamtaani_user", JSON.stringify(data.user));
      router.push(data.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code.");
      setResendMessage("✓ New code sent! Check your email.");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-black">
          <span className="text-white">Pata</span>
          <span className="text-[#FF6B35]">Mtaani</span>
        </Link>
        <h2 className="text-xl font-bold mt-6 mb-2">Check your email</h2>
        <p className="text-[#888] text-sm leading-relaxed">
          We sent a 6-digit verification code to<br />
          <span className="text-white font-medium">{email || "your email"}</span>
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold bg-[#111111] border border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
          />
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {resendMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">
          {resendMessage}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || otp.join("").length !== 6}
        className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mb-4"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <div className="text-center text-sm">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#FF6B35] hover:underline disabled:opacity-50 font-medium"
          >
            {resendLoading ? "Sending..." : "Didn't receive it? Resend code"}
          </button>
        ) : (
          <p className="text-[#888]">
            Resend code in <span className="text-white font-medium">{timer}s</span>
          </p>
        )}
      </div>

      <p className="text-center text-xs text-[#888] mt-6">
        Wrong email?{" "}
        <Link href="/signup" className="text-[#FF6B35] hover:underline">
          Go back to sign up
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <Suspense fallback={
        <div className="text-center">
          <div className="text-2xl font-black mb-4">
            <span className="text-white">Pata</span>
            <span className="text-[#FF6B35]">Mtaani</span>
          </div>
          <p className="text-[#888]">Loading...</p>
        </div>
      }>
        <VerifyOTPForm />
      </Suspense>
    </main>
  );
}