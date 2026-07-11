"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const FAQS = {
  tenants: [
    { q: "How do I find a house on PataMtaani?", a: "Simply go to the Listings page, type your estate or area in the search bar, and browse the results. You can filter by house type, price range, and verified listings only." },
    { q: "Is it free to search for a house?", a: "Yes, completely free. Browsing and searching listings on PataMtaani costs nothing. You only need an account to save listings." },
    { q: "How do I contact a landlord?", a: "On each listing page you will find a Call button and a WhatsApp button. Simply tap the one you prefer and you'll be connected to the landlord directly." },
    { q: "Are the listings verified and trustworthy?", a: "Listings from verified landlords are marked with a green verified badge. We strongly recommend contacting verified landlords and always visiting the property before making any payment." },
    { q: "What do I do if a listing turns out to be fake?", a: "Use the Report button on the listing page to flag it immediately. Our team will review and remove it within 24 hours." },
  ],
  landlords: [
    { q: "How do I list my house on PataMtaani?", a: "Create a free landlord account, go to your dashboard, click Add Listing, fill in the details and submit. Your listing goes live immediately." },
    { q: "How much does it cost to list?", a: "Listing is completely free. You only pay if you want to get verified or boost your listing to appear at the top of search results." },
    { q: "What does getting verified mean and how do I get verified?", a: "A verified badge means PataMtaani has confirmed you are a legitimate landlord. Tenants trust verified listings more. Go to your dashboard and click Get Verified to start the process." },
    { q: "How do boosted listings work?", a: "When you boost a listing, it appears at the top of search results in your area for the duration you pay for. This gets you significantly more visibility and tenant inquiries." },
    { q: "How do tenants contact me?", a: "Tenants contact you directly via call or WhatsApp using the number you provided during signup. No middleman, no extra fees." },
  ],
  general: [
    { q: "What is PataMtaani?", a: "PataMtaani is a hyperlocal rental marketplace for everyday Kenyans. We connect tenants looking for affordable housing with landlords in their neighborhood." },
    { q: "Which areas does PataMtaani cover?", a: "We currently focus on Nairobi and surrounding areas including Kiambu, Machakos, and Kajiado. We are expanding to Mombasa, Kisumu, Nakuru, and Eldoret soon." },
    { q: "How do I report a problem or complaint?", a: "You can use the Contact page to reach our team, or use the Report button on any listing. We take all reports seriously." },
  ],
};

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#111111] transition">
        <span className="font-medium text-sm">{question}</span>
        <span className={`text-[#FF6B35] transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="px-5 pb-4 text-sm text-[#888] leading-relaxed border-t border-[#2a2a2a] pt-4">{answer}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="faq" />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3">Frequently Asked Questions</h1>
          <p className="text-[#888]">Everything you need to know about PataMtaani.</p>
        </div>

        <div className="space-y-10">
          {[
            { title: "For Tenants", key: "tenants" },
            { title: "For Landlords", key: "landlords" },
            { title: "General", key: "general" },
          ].map((section) => (
            <div key={section.key}>
              <h2 className="text-[#FF6B35] font-semibold text-sm uppercase tracking-widest mb-4">{section.title}</h2>
              <div className="space-y-2">
                {FAQS[section.key].map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-center">
          <p className="font-semibold mb-2">Still have questions?</p>
          <p className="text-[#888] text-sm mb-4">We're happy to help. Reach out to us directly.</p>
          <Link href="/contact" className="bg-[#FF6B35] text-white px-6 py-2.5 rounded-xl hover:bg-[#E8521A] transition font-medium text-sm">Contact Us</Link>
        </div>
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