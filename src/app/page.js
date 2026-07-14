"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", role: "Tenant", location: "", review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 w-12 h-12 bg-[#FF6B35] hover:bg-[#E8521A] text-white rounded-full flex items-center justify-center text-xl shadow-lg transition z-50"
    >
      ↑
    </button>
  );
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem("patamtaani_cookies");
    if (!accepted) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#2a2a2a] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
      <p className="text-sm text-[#888] text-center sm:text-left">We use cookies to improve your experience on PataMtaani. <Link href="/privacy" className="text-[#FF6B35] hover:underline">Learn more</Link></p>
      <div className="flex gap-3 shrink-0">
        <button onClick={() => { localStorage.setItem("patamtaani_cookies", "declined"); setVisible(false); }} className="text-sm text-[#888] hover:text-white transition px-4 py-2 border border-[#2a2a2a] rounded-lg">Decline</button>
        <button onClick={() => { localStorage.setItem("patamtaani_cookies", "accepted"); setVisible(false); }} className="text-sm bg-[#FF6B35] hover:bg-[#E8521A] text-white px-4 py-2 rounded-lg transition font-medium">Accept</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/listings/get?limit=6");
        const data = await res.json();
        if (data.success) setFeaturedListings(data.listings.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchFeatured();
  }, []);

  const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/listings?search=" + encodeURIComponent(searchQuery.trim()));
    } else {
      router.push("/listings");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar active="home" />

      {/* HERO */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#1a1a1a] border border-[#2a2a2a] text-[#FF6B35] text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          🏠 Kenya's Neighborhood Rental Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
          Find Your Next Home
          <span className="text-[#FF6B35]"> in the Hood</span>
        </h1>
        <p className="text-[#888] text-lg mb-10 max-w-2xl mx-auto">
          Bedsitters, single rooms, and affordable apartments listed by real landlords — searchable by estate, filtered by price. No agents, no hassle.
        </p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by estate e.g. Githurai, Umoja, Kitengela..."
            className="flex-1 bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-5 py-4 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
          />
          <button type="submit" className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-8 py-4 rounded-xl transition">
            Search
          </button>
        </form>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link href="/listings" className="text-[#FF6B35] text-sm hover:underline">View all →</Link>
        </div>
        {loadingListings ? (
          <div className="text-center py-12 text-[#888]">Loading listings...</div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-[#888] mb-4">No listings yet. Be the first to post one!</p>
            <Link href="/signup?role=landlord" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E8521A] transition text-sm">
              Post a Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => {
              const photos = Array.isArray(listing.photos) ? listing.photos : [];
              return (
                <Link href={"/listings/" + listing.id} key={listing.id}>
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition cursor-pointer group h-full">
                    <div className="h-48 bg-[#1a1a1a] flex items-center justify-center text-4xl overflow-hidden">
                      {photos[0] ? (
                        <img src={photos[0]} alt={listing.location} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        "🏠"
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#888] capitalize">{(listing.house_type || "").replace(/_/g, " ")}</span>
                        {listing.is_verified && (
                          <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 px-2 py-0.5 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="font-semibold mb-1">{listing.apartment_name || listing.location}</p>
                      <p className="text-xs text-[#888] mb-1">{listing.location}</p>
                      <p className="text-[#FF6B35] font-bold">Ksh {(listing.price || 0).toLocaleString()}/mo</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 bg-[#111111] border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[#FF6B35] font-semibold mb-6 text-sm uppercase tracking-widest">For Tenants</h3>
              <div className="space-y-6">
                {["Search your area or estate", "Browse listings and compare prices", "Contact the landlord directly"].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <p className="text-[#f5f0eb] pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#FF6B35] font-semibold mb-6 text-sm uppercase tracking-widest">For Landlords</h3>
              <div className="space-y-6">
                {["Create a free account", "Post your listing with photos", "Get contacted by tenants directly"].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <p className="text-[#f5f0eb] pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Local Services</h2>
          <Link href="/services" className="text-[#FF6B35] text-sm hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🧺", label: "Mama Fua" },
            { icon: "🏠", label: "House Help" },
            { icon: "🔧", label: "Plumber" },
            { icon: "⚡", label: "Electrician" },
          ].map((service, i) => (
            <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-center hover:border-[#FF6B35] transition cursor-pointer">
              <div className="text-3xl mb-3">{service.icon}</div>
              <p className="text-sm font-medium">{service.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY PATAMTAANI */}
      <section className="px-6 py-16 bg-[#111111] border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Why PataMtaani</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "✓", title: "Verified Landlords", desc: "Landlords who go through our verification process are badged and trusted." },
              { icon: "💰", title: "Affordable Listings", desc: "We focus on the real Kenyan market — bedsitters, single rooms, one bedrooms." },
              { icon: "📍", title: "Hyperlocal Search", desc: "Search by estate or area. Find what's available right in your neighborhood." },
              { icon: "📱", title: "Mobile Friendly", desc: "Built for your Android phone and Kenyan internet speeds. Fast and lightweight." },
            ].map((item, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] flex items-center justify-center font-bold mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[#888]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "I found my bedsitter in Githurai in two days. I didn't have to walk anywhere.", name: "James M.", role: "Tenant", location: "Githurai" },
            { quote: "I listed my house on a Monday and had three people calling by Wednesday.", name: "Mary W.", role: "Landlord", location: "Umoja" },
            { quote: "Finally a platform that has houses normal people can actually afford.", name: "Brian K.", role: "Tenant", location: "Kitengela" },
          ].map((t, i) => (
            <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <p className="text-[#f5f0eb] mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-[#888]">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* REVIEWS */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">What People Say</h2>
        <p className="text-[#888] text-center mb-12">Real experiences from real Kenyans in the hood.</p>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {reviews.map((r) => (
              <div key={r.id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
                <p className="text-[#f5f0eb] mb-6 leading-relaxed">"{r.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm">{r.name[0]}</div>
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-[#888]">{r.role} · {r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review submission form */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2 text-center">Share Your Experience</h3>
          <p className="text-[#888] text-sm text-center mb-6">Tell us how PataMtaani helped you find a home or a tenant.</p>

          {reviewMessage ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-4 rounded-xl text-center">
              {reviewMessage}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#888] mb-1.5 block">Your Name</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="John Kamau"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#888] mb-1.5 block">I am a</label>
                  <select
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                  >
                    <option value="Tenant">Tenant</option>
                    <option value="Landlord">Landlord</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Your Location / Estate</label>
                <input
                  type="text"
                  value={reviewForm.location}
                  onChange={(e) => setReviewForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Githurai, Nairobi"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Your Review</label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm((p) => ({ ...p, review: e.target.value }))}
                  rows={3}
                  placeholder="Tell us how PataMtaani helped you..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition resize-none"
                />
              </div>
              <button
                onClick={async () => {
                  if (!reviewForm.name || !reviewForm.location || !reviewForm.review) {
                    alert("Please fill in all fields.");
                    return;
                  }
                  setSubmittingReview(true);
                  try {
                    const res = await fetch("/api/reviews", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(reviewForm),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setReviewMessage(data.message);
                      setReviewForm({ name: "", role: "Tenant", location: "", review: "" });
                    }
                  } catch (err) {
                    console.error("Review submit error:", err);
                  } finally {
                    setSubmittingReview(false);
                  }
                }}
                disabled={submittingReview}
                className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#FF6B35]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Have a house to rent?</h2>
            <p className="text-white/80">List it free today and reach thousands of tenants in your area.</p>
          </div>
          <Link href="/signup?role=landlord" className="bg-white text-[#FF6B35] font-bold px-8 py-4 rounded-xl hover:bg-[#f5f0eb] transition whitespace-nowrap">
            List Your House
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 pt-12 pb-6 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <span className="text-xl font-black">
                <span className="text-white">Pata</span>
                <span className="text-[#FF6B35]">Mtaani</span>
              </span>
              <p className="text-xs text-[#888] mt-2 leading-relaxed">Proudly Kenyan. Built for the hood. Connecting tenants and landlords across Nairobi.</p>
            </div>

            {/* Links */}
            <div>
              <p className="text-xs text-white font-semibold uppercase tracking-widest mb-4">Platform</p>
              <div className="space-y-2">
                <Link href="/listings" className="block text-sm text-[#888] hover:text-white transition">Listings</Link>
                <Link href="/services" className="block text-sm text-[#888] hover:text-white transition">Services</Link>
                <Link href="/signup?role=landlord" className="block text-sm text-[#888] hover:text-white transition">Post a Listing</Link>
                <Link href="/signup" className="block text-sm text-[#888] hover:text-white transition">Sign Up</Link>
              </div>
            </div>

            <div>
              <p className="text-xs text-white font-semibold uppercase tracking-widest mb-4">Company</p>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-[#888] hover:text-white transition">About Us</Link>
                <Link href="/contact" className="block text-sm text-[#888] hover:text-white transition">Contact</Link>
                <Link href="/faq" className="block text-sm text-[#888] hover:text-white transition">FAQ</Link>
                <Link href="/careers" className="block text-sm text-[#888] hover:text-white transition">Careers</Link>
                <Link href="/terms" className="block text-sm text-[#888] hover:text-white transition">Terms</Link>
                <Link href="/privacy" className="block text-sm text-[#888] hover:text-white transition">Privacy Policy</Link>
              </div>
            </div>

            <div>
              <p className="text-xs text-white font-semibold uppercase tracking-widest mb-4">Follow Us</p>
              <div className="space-y-3">
                {/* ===== ADD YOUR SOCIAL MEDIA URLS BELOW ===== */}
                <a href="https://x.com/patamtaanike" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#888] hover:text-white transition group">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#FF6B35] flex items-center justify-center transition shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  Twitter / X
                </a>
                <a href="https://www.facebook.com/share/18C13uBFxw/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#888] hover:text-white transition group">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#FF6B35] flex items-center justify-center transition shrink-0">
                    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  Facebook
                </a>
                <a href="https://www.instagram.com/patamtaanikenya?igsh=MWdiaDloa3p6cW4wZg==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#888] hover:text-white transition group">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#FF6B35] flex items-center justify-center transition shrink-0">
                    <svg viewBox="0 0 24 24" fill="url(#ig-gradient)" className="w-4 h-4">
                      <defs>
                        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433"/>
                          <stop offset="25%" stopColor="#e6683c"/>
                          <stop offset="50%" stopColor="#dc2743"/>
                          <stop offset="75%" stopColor="#cc2366"/>
                          <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  Instagram
                </a>
                <a href="tiktok.com/@patamtaanike" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#888] hover:text-white transition group">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#FF6B35] flex items-center justify-center transition shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  TikTok
                </a>
                <a href="https://wa.me/254711531747" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[#888] hover:text-white transition group">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#FF6B35] flex items-center justify-center transition shrink-0">
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
            <p className="text-xs text-[#888]">Made with ❤️ in Nairobi, Kenya</p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
      <CookieConsent />

    </main>
  );
}