"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Careers | PataMtaani",
  description: "Join the PataMtaani team and help build Kenya's neighborhood rental marketplace.",
};

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();
        if (data.success) setCareers(data.careers);
      } catch (err) {
        console.error("Failed to fetch careers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="careers" />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3">Careers at PataMtaani</h1>
          <p className="text-[#888] text-lg max-w-xl mx-auto">Help us build Kenya's neighborhood rental platform. Join a team that cares about community.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#888]">Loading opportunities...</div>
        ) : careers.length === 0 ? (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2">No open positions right now</h2>
            <p className="text-[#888] mb-6">We're growing fast and will be hiring soon. Check back or reach out to introduce yourself — we'd love to hear from you.</p>
            <Link href="/contact" className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
              Get in Touch
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {careers.map((job) => (
              <div key={job.id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition">
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#888]">
                      {job.department && <span>{job.department}</span>}
                      <span>{job.location || "Nairobi, Kenya"}</span>
                      <span className="bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 px-2 py-0.5 rounded-full text-xs">{job.type || "Full-time"}</span>
                    </div>
                  </div>
                  <span className="text-[#888] shrink-0">{expandedId === job.id ? "▲" : "▼"}</span>
                </button>
                {expandedId === job.id && (
                  <div className="border-t border-[#2a2a2a] p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">About this role</h4>
                      <p className="text-[#888] leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>
                    {job.requirements && (
                      <div>
                        <h4 className="font-semibold mb-2">Requirements</h4>
                        <p className="text-[#888] leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                      </div>
                    )}
                    <Link
                      href={`/contact?subject=${encodeURIComponent("Application: " + job.title)}&message=${encodeURIComponent("Hi, I would like to apply for the " + job.title + " position at PataMtaani. Here is a bit about me:\n\n")}`}
                      className="inline-block bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
                    >
                      Apply for this role →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
          <div className="flex gap-6 text-sm text-[#888]">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
          <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}