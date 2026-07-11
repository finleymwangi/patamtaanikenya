"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SERVICES = [
  { icon: "🧺", label: "Mama Fua", desc: "Reliable laundry services in your neighborhood." },
  { icon: "🏠", label: "House Help", desc: "Trusted house girls and domestic workers near you." },
  { icon: "👮", label: "Watchman", desc: "Security personnel for your home or compound." },
  { icon: "🔧", label: "Plumber", desc: "Fix leaks, pipes, and water issues fast." },
  { icon: "⚡", label: "Electrician", desc: "Wiring, repairs, and installations done right." },
  { icon: "📱", label: "Phone Repair", desc: "Screen replacements and phone fixes near you." },
  { icon: "🪚", label: "Fundi", desc: "Carpentry, masonry, and general construction work." },
  { icon: "🧹", label: "Cleaning", desc: "Deep cleaning services for homes and apartments." },
];

export default function Services() {
  const router = useRouter();

  const handleGetNotified = () => {
    router.push("/contact?subject=Get+Notified+About+Services.&message=I+want+to+know+when+you+add+more+services.");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="services" />

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="inline-block bg-[#1a1a1a] border border-[#2a2a2a] text-[#FF6B35] text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            🔧 Local Services
          </div>
          <h1 className="text-5xl font-black mb-4">
            Find Trusted Services
            <span className="text-[#FF6B35]"> Mtaani</span>
          </h1>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">
            From mama fua to fundis — find reliable local service providers right in your neighborhood. No referrals needed.
          </p>
        </div>

        <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-6 text-center mb-12">
          <p className="text-[#FF6B35] font-bold text-lg mb-1">🚀 Coming Soon</p>
          <p className="text-[#888]">We're currently onboarding service providers in Nairobi. Be the first to know when this launches.</p>
          <button
            onClick={handleGetNotified}
            className="inline-block mt-4 bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
          >
            Get Notified
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((service, i) => (
            <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-center hover:border-[#FF6B35] transition cursor-pointer group">
              <div className="text-4xl mb-3">{service.icon}</div>
              <p className="font-semibold mb-1">{service.label}</p>
              <p className="text-xs text-[#888]">{service.desc}</p>
            </div>
          ))}
        </div>

      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a] mt-8">
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