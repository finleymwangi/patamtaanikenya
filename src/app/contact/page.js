"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const subject = searchParams.get("subject") || "";
    const message = searchParams.get("message") || "";
    if (subject || message) {
      setFormData((prev) => ({ ...prev, subject, message }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        {submitted ? (
          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
            <p className="text-[#888]">We usually respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Your Name", name: "name", type: "text", placeholder: "John Kamau" },
              { label: "Email Address", name: "email", type: "email", placeholder: "john@email.com" },
              { label: "Subject", name: "subject", type: "text", placeholder: "What is this about?" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm text-[#888] mb-1.5 block">{field.label}</label>
                <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} required className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
              </div>
            ))}
            <div>
              <label className="text-sm text-[#888] mb-1.5 block">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Tell us what's on your mind..." required className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition resize-none" />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-bold mb-4">Direct Contact</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl flex items-center justify-center text-[#FF6B35]">📧</div>
              <div>
                <p className="text-xs text-[#888] mb-0.5">Email</p>
                <a href="mailto:patamtaanikenya@gmail.com" className="font-medium text-[#FF6B35] hover:underline">
                  Email Us!😊
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl flex items-center justify-center text-[#FF6B35]">💬</div>
              <div>
                <p className="text-xs text-[#888] mb-0.5">WhatsApp</p>
                <a
                  href="https://wa.me/254114146895?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#FF6B35] hover:underline"
                  >
                    Talk To Us On WhatsApp!😊
                  </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-bold mb-2">Response Time</h3>
          <p className="text-[#888] text-sm">We usually respond within 24 hours on weekdays. For urgent matters, reach us on WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="contact" />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black mb-3">Get in Touch</h1>
          <p className="text-[#888] text-lg">Got a question, complaint, or just want to say hi? We're right here.</p>
        </div>
        <Suspense fallback={<div className="text-center text-[#888]">Loading...</div>}>
          <ContactForm />
        </Suspense>
      </div>
      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
          <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}