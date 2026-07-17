import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "About Us | PataMtaani",
  description: "PataMtaani is Kenya's hyperlocal rental marketplace built for everyday Kenyans. Find affordable homes in your neighborhood.",
};

export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="about" />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-4">Built for the Kenya <span className="text-[#FF6B35]">that actually exists.</span></h1>
          <p className="text-[#888] text-lg leading-relaxed">Not the Kenya of luxury apartments and corporate job boards — but the Kenya of bedsitters, mama fuas, fundis, and neighborhood WhatsApp groups.</p>
        </div>

        <div className="space-y-8">

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">The Problem</h2>
            <p className="text-[#f5f0eb] leading-relaxed">Millions of everyday Kenyans are locked out of the online rental market. Websites like BuyRentKenya and Jumia House are dominated by listings for high-end apartments going for Ksh 50,000 and above. The person looking for a decent bedsitter in Umoja or a single room in Githurai in the Ksh 3,000–20,000 range has no online resource to turn to. They have to physically walk the streets, ask neighbors, or rely on word of mouth.</p>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">The Solution</h2>
            <p className="text-[#f5f0eb] leading-relaxed">PataMtaani is a hyperlocal community marketplace built specifically for everyday Kenyans. We connect people within their own communities, focusing on the low to mid-range market that has been completely ignored by existing platforms. Pata means find, and Mtaani means in the hood. That is exactly what we do.</p>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-[#FF6B35]">Our Mission</h2>
            <p className="text-[#f5f0eb] leading-relaxed mb-4">To connect everyday Kenyans with affordable homes and trusted local services, right in their own neighborhoods.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {[
                { icon: "🏠", title: "Affordable Rentals", desc: "Bedsitters, single rooms, and one bedrooms for real Kenyans." },
                { icon: "✓", title: "Verified Landlords", desc: "Trust and safety built into every listing." },
                { icon: "📍", title: "Hyperlocal", desc: "Search by estate. Find what's in your neighborhood." },
              ].map((item, i) => (
                <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-[#888]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">Who We Are</h2>
            <p className="text-[#f5f0eb] leading-relaxed">PataMtaani was founded by Finlay N. Mwangi with one goal — to make finding a home in your neighborhood as easy as sending a WhatsApp message. It's currently a one-person effort, built by someone who believes technology should work for every Kenyan, not just those who can afford Westlands rents, and who is building this for his own community first.</p>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">Who It's For</h2>
            <p className="text-[#f5f0eb] leading-relaxed">If you're a tenant looking for a bedsitter, single room, or one-bedroom in the Ksh 3,000–20,000 range, PataMtaani is built with you in mind. If you're a landlord or caretaker managing rentals in these areas, listing with us is free and takes a few minutes.</p>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">What's Coming</h2>
            <p className="text-[#f5f0eb] leading-relaxed mb-4">Rentals are just the beginning. We are building a full neighborhood ecosystem — connecting tenants and landlords is step one. Next, we are bringing trusted local service providers to the platform: mama fuas, plumbers, electricians, fundis, and more. All searchable by estate. All verified. All right in your hood.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🧺", label: "Mama Fua" },
                { icon: "🔧", label: "Plumbers" },
                { icon: "⚡", label: "Electricians" },
                { icon: "🪚", label: "Fundis" },
              ].map((s, i) => (
                <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <p className="text-xs text-[#888]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-[#FF6B35]">Our Values</h2>
            <div className="space-y-3">
              {[
                { title: "Community first", desc: "We build for neighborhoods, not corporations. Every decision we make starts with the question: does this help the everyday Kenyan?" },
                { title: "Trust and transparency", desc: "Verified landlords, honest listings, and real prices. No hidden fees, no agents, no middlemen." },
                { title: "Accessibility", desc: "PataMtaani works on basic Android phones and Kenyan internet speeds. If it doesn't work in Githurai, it doesn't ship." },
                { title: "Safety", desc: "We take fraudulent listings seriously. Our report system, verification process, and admin review are all designed to protect tenants from being scammed." },
              ].map((v, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">{v.title}</p>
                    <p className="text-[#888] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-6 text-center">
            <p className="text-lg font-bold text-[#FF6B35] mb-2">Proudly Kenyan</p>
            <p className="text-[#f5f0eb] mb-4">PataMtaani is built from the ground up for our neighborhoods, our people, and our way of life.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/listings" className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">Browse Listings</Link>
              <Link href="/contact" className="bg-transparent border border-[#FF6B35]/40 text-[#FF6B35] hover:bg-[#FF6B35]/10 font-semibold px-6 py-2.5 rounded-xl transition text-sm">Get in Touch</Link>
            </div>
          </div>

        </div>
      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
          <div className="flex items-center gap-6 text-sm text-[#888]">
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