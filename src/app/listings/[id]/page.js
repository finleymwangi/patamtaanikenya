"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ListingDetail({ params }) {
  const { id } = use(params);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savingListing, setSavingListing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("patamtaani_user");
    let parsedUser = null;
    if (stored) {
      parsedUser = JSON.parse(stored);
      setUser(parsedUser);
    }

    const fetchListing = async () => {
      try {
        const viewerParam = parsedUser ? "&viewer_id=" + parsedUser.id : "";
        const res = await fetch("/api/listings/single?id=" + id + viewerParam);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Listing not found.");
        setListing(data.listing);
        setIsOwner(!!data.isOwner);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();

    if (parsedUser) {
      const checkSaved = async () => {
        try {
          const res = await fetch("/api/listings/saved?tenant_id=" + parsedUser.id);
          const data = await res.json();
          if (data.success) {
            const isSaved = data.saved.some((s) => s.listing_id === id);
            setSaved(isSaved);
          }
        } catch (err) {
          console.error("Failed to check saved status:", err);
        }
      };
      checkSaved();
    }
  }, [id]);

const handleSubmitReport = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/listings/" + id;
      return;
    }
    if (!reportReason) {
      alert("Please select a reason.");
      return;
    }
    setSubmittingReport(true);
    try {
      const res = await fetch("/api/listings/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: id,
          reported_by: user.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit report.");
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportForm(false);
        setReportSuccess(false);
        setReportReason("");
        setReportDetails("");
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/listings/" + id;
      return;
    }
    setSavingListing(true);
    try {
      const res = await fetch("/api/listings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: user.id, listing_id: id }),
      });
      const data = await res.json();
      if (data.success) setSaved(data.saved);
      else if (data.error) alert(data.error);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSavingListing(false);
    }
  };

  const handleWhatsappClick = async () => {
    try {
      await fetch("/api/listings/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id }),
      });
    } catch (err) {
      console.error("WhatsApp click tracking failed:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-[#888]">Loading listing...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Listing not found</h2>
          <p className="text-[#888] mb-6">This listing may have been removed.</p>
          <Link href="/listings" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E8521A] transition">
            Browse Listings
          </Link>
        </div>
      </main>
    );
  }

  const amenities = typeof listing.amenities === "string" ? JSON.parse(listing.amenities) : listing.amenities || {};
  const photos = Array.isArray(listing.photos) ? listing.photos : [];
  const houseType = (listing.house_type || "").replace(/_/g, " ");
  const price = (listing.price || 0).toLocaleString();
  const rawPhone = (listing.contact_phone || listing.users?.phone || "").replace(/[^0-9]/g, "");
  const waPhone = rawPhone.startsWith("0") ? "254" + rawPhone.slice(1) : rawPhone;
  const waText = encodeURIComponent("Hi, I saw your listing on PataMtaani - " + houseType + " in " + listing.location + " for Ksh " + price + "/mo. Is it still available?");
  const waLink = waPhone ? "https://wa.me/" + waPhone + "?text=" + waText : "https://wa.me/?text=" + waText;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="listings" />

      {isOwner && (
        <div className="bg-[#FF6B35]/10 border-b border-[#FF6B35]/20 px-6 py-3 text-center text-sm text-[#FF6B35]">
          This is your own listing. You're viewing it as the landlord — views and saves won't count.
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">
        {photos.length > 0 && (
          <div className="mb-8 relative">
            {!isOwner && (
              <button
                onClick={handleSave}
                disabled={savingListing}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-xl transition"
              >
                {saved ? "❤️" : "🤍"}
              </button>
            )}
            <div className="h-64 md:h-96 rounded-2xl overflow-hidden mb-3">
              <img src={photos[activePhoto]} alt="listing" className="w-full h-full object-cover" />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {photos.map((photo, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)} className={"shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition " + (activePhoto === i ? "border-[#FF6B35]" : "border-transparent")}>
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {photos.length === 0 && (
          <div className="h-64 md:h-80 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-6xl mb-8 relative">
            {!isOwner && (
              <button
                onClick={handleSave}
                disabled={savingListing}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-xl transition"
              >
                {saved ? "❤️" : "🤍"}
              </button>
            )}
            🏠
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] px-3 py-1 rounded-full capitalize">{houseType}</span>
                {listing.users?.is_verified && (
                  <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 px-3 py-1 rounded-full">Verified Landlord</span>
                )}
              </div>
              <h1 className="text-3xl font-black mb-1">{listing.apartment_name || listing.location}</h1>
              <p className="text-[#888]">{listing.location}, {listing.estate}</p>
            </div>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
              <p className="text-[#888] text-sm mb-1">Monthly Rent</p>
              <p className="text-4xl font-black text-[#FF6B35]">Ksh {price}<span className="text-lg text-[#888] font-normal">/mo</span></p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">About this place</h2>
              <p className="text-[#888] leading-relaxed">{listing.description || "No description provided."}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "water", label: "Water" },
                  { key: "electricity", label: "Electricity" },
                  { key: "parking", label: "Parking" },
                  { key: "security", label: "Security" },
                  { key: "wifi", label: "WiFi" },
                ].map((item) => (
                  <div key={item.key} className={"flex items-center gap-2 px-4 py-3 rounded-xl border text-sm " + (amenities[item.key] ? "border-green-500/30 text-green-400 bg-green-500/5" : "border-[#2a2a2a] text-[#444]")}>
                    {item.label} {amenities[item.key] ? "✓" : "✗"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {isOwner ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 sticky top-24 text-center">
                <h2 className="font-bold mb-2">Your Listing</h2>
                <p className="text-sm text-[#888] mb-4">{listing.views || 0} views so far</p>
                <Link href="/dashboard/landlord" className="w-full bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold py-3 rounded-xl transition text-sm text-center block">
                  Manage in Dashboard
                </Link>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 sticky top-24">
                <h2 className="font-bold mb-4">Contact Landlord</h2>
                <div className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-black text-xl mb-3">🏠</div>
                <p className="font-semibold mb-1">{listing.contact_name || listing.users?.full_name || "Landlord"}</p>
                <p className="text-sm text-[#888] mb-6">Member of PataMtaani</p>
                <div className="space-y-3">
                  {user ? (
                    <a href={waLink} onClick={handleWhatsappClick} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition text-sm text-center block">
                      WhatsApp Landlord
                    </a>
                  ) : (
                    <Link href={"/login?redirect=/listings/" + id} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold py-3 rounded-xl transition text-sm text-center block">
                      Log in to Contact
                    </Link>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={savingListing}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FF6B35] text-white font-semibold py-3 rounded-xl transition text-sm text-center"
                  >
                    {saved ? "❤️ Saved" : "🤍 Save Listing"}
                  </button>
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="w-full bg-transparent border border-red-500/20 hover:bg-red-500/10 text-red-400 font-medium py-2.5 rounded-xl transition text-xs text-center"
                  >
                    🚩 Report this listing
                  </button>
                </div>
                <p className="text-xs text-[#888] text-center mt-4">Always meet in a safe place. Never send money before viewing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a] mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
          <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
        </div>
      </footer>
      {showReportForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-6">
            {reportSuccess ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold">Report submitted</p>
                <p className="text-sm text-[#888] mt-1">Our team will review this shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Report this listing</h2>
                  <button onClick={() => setShowReportForm(false)} className="text-[#888] hover:text-white text-xl">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#888] mb-1.5 block">Reason</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                    >
                      <option value="">Select a reason</option>
                      <option value="fake_listing">Fake or misleading listing</option>
                      <option value="already_rented">Already rented / unavailable</option>
                      <option value="scam">Suspected scam</option>
                      <option value="wrong_info">Wrong price or details</option>
                      <option value="inappropriate">Inappropriate content</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#888] mb-1.5 block">Additional details (optional)</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={3}
                      placeholder="Tell us more..."
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowReportForm(false)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-3 rounded-xl hover:border-[#FF6B35] transition">Cancel</button>
                    <button onClick={handleSubmitReport} disabled={submittingReport} className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                      {submittingReport ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}