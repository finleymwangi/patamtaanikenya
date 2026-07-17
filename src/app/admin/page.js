"use client";
import { useState, useEffect } from "react";

const TABS = ["overview", "listings", "users", "verifications", "messages", "reports", "payments", "careers", "reviews"];

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listingSearch, setListingSearch] = useState({ apartment: "", area: "", houseType: "", landlordContact: "" });
  const [listingSort, setListingSort] = useState("newest");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState({ name: "", email: "", phone: "", date: "" });
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userVerifiedFilter, setUserVerifiedFilter] = useState("all");

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  const [reviewing, setReviewing] = useState(null);

  const [expandedListing, setExpandedListing] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [togglingVerified, setTogglingVerified] = useState(null);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  const [deletingFromReport, setDeletingFromReport] = useState(null);
  const [togglingReportListing, setTogglingReportListing] = useState(null);

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(null);

  const [careers, setCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [careerForm, setCareerForm] = useState({ title: "", department: "", location: "Nairobi, Kenya", type: "Full-time", description: "", requirements: "" });
  const [submittingCareer, setSubmittingCareer] = useState(false);

  const [adminReviews, setAdminReviews] = useState([]);
  const [loadingAdminReviews, setLoadingAdminReviews] = useState(false);

  // Profile deep-dive modal
  const [profileModal, setProfileModal] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Inline listing preview modal
  const [listingPreview, setListingPreview] = useState(null);

  // Persist admin session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("patamtaani_admin");
    if (savedAuth === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) {
      sessionStorage.setItem("patamtaani_admin", "true");
    }
  }, [authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Invalid credentials.");
      else setAuthenticated(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();
      if (data.success) setActivity(data.activities);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const res = await fetch("/api/admin/listings");
      const data = await res.json();
      if (data.success) setListings(data.listings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchVerificationRequests = async () => {
    setLoadingVerifications(true);
    try {
      const res = await fetch("/api/admin/verification/list");
      const data = await res.json();
      if (data.success) setVerificationRequests(data.requests);
    } catch (err) {
      console.error("Failed to fetch verifications:", err);
    } finally {
      setLoadingVerifications(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      if (data.success) setReports(data.reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) setPayments(data.payments);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/admin/messages/list");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

const fetchCareers = async () => {
    setLoadingCareers(true);
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (data.success) setCareers(data.careers);
    } catch (err) {
      console.error("Failed to fetch careers:", err);
    } finally {
      setLoadingCareers(false);
    }
  };

  const fetchAdminReviews = async () => {
    setLoadingAdminReviews(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) setAdminReviews(data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoadingAdminReviews(false);
    }
  };

  const openProfileModal = async (userId) => {
    setProfileModal(userId);
    setProfileData(null);
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/admin/users/profile?user_id=" + userId);
      const data = await res.json();
      if (data.success) setProfileData(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchStats();
    fetchActivity();
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.removeItem("patamtaani_admin");
        setAuthenticated(false);
      }, 15 * 60 * 1000);
    };
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    if (activeTab === "listings") fetchListings();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "verifications") fetchVerificationRequests();
    if (activeTab === "reports") fetchReports();
    if (activeTab === "payments") fetchPayments();
    if (activeTab === "messages") fetchMessages();
    if (activeTab === "careers") fetchCareers();
    if (activeTab === "reviews") fetchAdminReviews();
  }, [authenticated, activeTab]);

  const handleResolveReport = async (reportId, status) => {
    try {
      const res = await fetch("/api/admin/reports/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update.");
      fetchReports();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteListingFromReport = async (listingId, reportId) => {
    if (!confirm("Delete this listing permanently?")) return;
    setDeletingFromReport(reportId);
    try {
      const reportedBy = reports.find((rep) => rep.id === reportId)?.reported_by;
      const res = await fetch("/api/admin/listings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      await handleResolveReport(reportId, "resolved");
      // Notify the reporter that the listing was removed
      if (reportedBy) {
        await fetch("/api/tenant-notifications/new-listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: reportedBy }),
        });
      }
      fetchReports();
      fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingFromReport(null);
    }
  };

  const handleToggleListingFromReport = async (listingId, currentStatus, reportId) => {
    setTogglingReportListing(reportId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/listings/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      fetchReports();
      fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingReportListing(null);
    }
  };

  const handleReview = async (requestId, landlordId, decision) => {
    setReviewing(requestId);
    try {
      const res = await fetch("/api/admin/verification/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId, landlord_id: landlordId, decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to review.");
      fetchVerificationRequests();
      fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setReviewing(null);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm("Delete this listing permanently?")) return;
    try {
      const res = await fetch("/api/admin/listings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      fetchListings();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleListingStatus = async (listingId, currentStatus) => {
    setTogglingStatus(listingId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/listings/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      fetchListings();
      fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleToggleVerified = async (userId, currentVerified) => {
    setTogglingVerified(userId);
    try {
      const res = await fetch("/api/admin/users/toggle-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, is_verified: !currentVerified }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update.");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingVerified(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user and all their data permanently?")) return;
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      fetchUsers();
      fetchStats();
      setProfileModal(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkMessageRead = async (messageId) => {
    try {
      await fetch("/api/admin/messages/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId }),
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleCareerSubmit = async () => {
    setSubmittingCareer(true);
    try {
      const method = editingCareer ? "PUT" : "POST";
      const body = editingCareer
        ? { id: editingCareer.id, ...careerForm }
        : careerForm;

      const res = await fetch("/api/admin/careers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setShowCareerForm(false);
      setEditingCareer(null);
      setCareerForm({ title: "", department: "", location: "Nairobi, Kenya", type: "Full-time", description: "", requirements: "" });
      fetchCareers();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingCareer(false);
    }
  };

  const handleToggleCareer = async (id, currentStatus) => {
    try {
      const career = careers.find((c) => c.id === id);
      await fetch("/api/admin/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...career, id, is_active: !currentStatus }),
      });
      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!confirm("Delete this job posting permanently?")) return;
    try {
      await fetch("/api/admin/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendReply = async (msg) => {
    if (!replyText.trim()) { alert("Please write a reply first."); return; }
    setSendingReply(msg.id);
    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: msg.id, to_email: msg.email, to_name: msg.name, reply_text: replyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reply.");
      setReplyText("");
      setExpandedMessage(null);
      fetchMessages();
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingReply(null);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-2xl font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
            <p className="text-[#888] text-sm mt-2">Admin Access</p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" required className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
            <button type="submit" disabled={loading} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            {loadingAdminReviews ? (
              <div className="text-center py-12 text-[#888]">Loading reviews...</div>
            ) : adminReviews.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No reviews yet.</div>
            ) : adminReviews.map((r) => (
              <div key={r.id} className={"bg-[#111111] border rounded-xl p-4 " + (r.is_approved ? "border-green-500/20" : "border-[#2a2a2a]")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{r.name}</p>
                      <span className="text-xs text-[#888]">{r.role} · {r.location}</span>
                      <span className={"text-xs px-2 py-0.5 rounded-full " + (r.is_approved ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20")}>
                        {r.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-[#888] leading-relaxed">"{r.review}"</p>
                    <p className="text-xs text-[#888] mt-2">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/reviews", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: r.id, is_approved: !r.is_approved }),
                        });
                        fetchAdminReviews();
                      }}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-1.5 rounded-lg hover:border-[#FF6B35] transition"
                    >
                      {r.is_approved ? "Unapprove" : "Approve"}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this review?")) return;
                        await fetch("/api/admin/reviews", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: r.id }),
                        });
                        fetchAdminReviews();
                      }}
                      className="bg-[#1a1a1a] border border-red-500/30 text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
    );
  }

  const STATS_DISPLAY = stats ? [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Landlords", value: stats.totalLandlords },
    { label: "Total Tenants", value: stats.totalTenants },
    { label: "Total Listings", value: stats.totalListings },
    { label: "Active Listings", value: stats.activeListings },
    { label: "Pending Verifications", value: stats.pendingVerifications },
    { label: "Total Revenue", value: "Ksh " + stats.totalRevenue.toLocaleString() },
  ] : [];

  const filteredListings = listings.filter((l) => {
    if (listingSearch.apartment && !(l.apartment_name || "").toLowerCase().includes(listingSearch.apartment.toLowerCase())) return false;
    if (listingSearch.area && !((l.location || "") + " " + (l.estate || "")).toLowerCase().includes(listingSearch.area.toLowerCase())) return false;
    if (listingSearch.houseType && l.house_type !== listingSearch.houseType) return false;
    if (listingSearch.landlordContact) {
      const contact = listingSearch.landlordContact.toLowerCase();
      if (!(l.users?.email || "").toLowerCase().includes(contact) && !(l.users?.phone || "").toLowerCase().includes(contact)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (listingSort === "most_viewed") return (b.views || 0) - (a.views || 0);
    if (listingSort === "most_saved") return (b.save_count || 0) - (a.save_count || 0);
    if (listingSort === "price_high") return (b.price || 0) - (a.price || 0);
    if (listingSort === "price_low") return (a.price || 0) - (b.price || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredUsers = users.filter((u) => {
    if (userSearch.name && !(u.full_name || "").toLowerCase().includes(userSearch.name.toLowerCase())) return false;
    if (userSearch.email && !(u.email || "").toLowerCase().includes(userSearch.email.toLowerCase())) return false;
    if (userSearch.phone && !(u.phone || "").toLowerCase().includes(userSearch.phone.toLowerCase())) return false;
    if (userSearch.date && new Date(u.created_at).toISOString().split("T")[0] !== userSearch.date) return false;
    if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
    if (userVerifiedFilter === "verified" && !u.is_verified) return false;
    if (userVerifiedFilter === "unverified" && u.is_verified) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#0a0a0a] z-50">
        <span className="text-xl font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span> <span className="text-xs text-[#888] font-normal">Admin</span></span>
        <button onClick={() => setAuthenticated(false)} className="text-sm text-[#FF6B35] hover:underline">Log Out</button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {loadingStats ? (
            <div className="col-span-7 text-center text-[#888] py-4">Loading stats...</div>
          ) : STATS_DISPLAY.map((stat, i) => (
            <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4">
              <p className="text-[#888] text-xs mb-1">{stat.label}</p>
              <p className="text-xl font-black text-[#FF6B35]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 border-b border-[#2a2a2a] overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? "border-[#FF6B35] text-[#FF6B35]" : "border-transparent text-[#888] hover:text-white"}`}>
              {tab}
              {tab === "verifications" && verificationRequests.length > 0 && <span className="ml-2 bg-[#FF6B35] text-white text-xs px-1.5 py-0.5 rounded-full">{verificationRequests.length}</span>}
              {tab === "messages" && messages.some(m => !m.is_read) && <span className="ml-2 bg-[#FF6B35] text-white text-xs px-1.5 py-0.5 rounded-full">{messages.filter(m => !m.is_read).length}</span>}
              {tab === "reports" && reports.filter(r => r.status === "pending").length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{reports.filter(r => r.status === "pending").length}</span>}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {loadingStats ? (
              <div className="text-center py-12 text-[#888]">Loading overview...</div>
            ) : stats && (
              <>
                {/* Action alerts */}
                {(stats.pendingReports > 0 || stats.pendingVerifications > 0 || stats.unreadMessages > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.pendingReports > 0 && (
                      <button onClick={() => setActiveTab("reports")} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-left hover:bg-red-500/20 transition">
                        <p className="text-red-400 font-bold text-2xl">{stats.pendingReports}</p>
                        <p className="text-red-400 text-sm">Pending Reports — action needed</p>
                      </button>
                    )}
                    {stats.pendingVerifications > 0 && (
                      <button onClick={() => setActiveTab("verifications")} className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-left hover:bg-yellow-500/20 transition">
                        <p className="text-yellow-400 font-bold text-2xl">{stats.pendingVerifications}</p>
                        <p className="text-yellow-400 text-sm">Pending Verifications — action needed</p>
                      </button>
                    )}
                    {stats.unreadMessages > 0 && (
                      <button onClick={() => setActiveTab("messages")} className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-2xl p-4 text-left hover:bg-[#FF6B35]/20 transition">
                        <p className="text-[#FF6B35] font-bold text-2xl">{stats.unreadMessages}</p>
                        <p className="text-[#FF6B35] text-sm">Unread Messages — action needed</p>
                      </button>
                    )}
                  </div>
                )}

                {/* Growth this week */}
                {/* User growth breakdown */}
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-3">👤 User Growth</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "New Users (24h)", value: stats.newUsers1d },
                      { label: "New Users (7d)", value: stats.newUsers7d },
                      { label: "New Users (30d)", value: stats.newUsers30d },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                        <p className="text-[#888] text-xs mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-[#FF6B35]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tenant growth */}
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-3">🏠 Tenant Growth</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "New Tenants (24h)", value: stats.newTenants1d },
                      { label: "New Tenants (7d)", value: stats.newTenants7d },
                      { label: "New Tenants (30d)", value: stats.newTenants30d },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                        <p className="text-[#888] text-xs mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-[#FF6B35]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Landlord growth */}
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-3">🔑 Landlord Growth</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "New Landlords (24h)", value: stats.newLandlords1d },
                      { label: "New Landlords (7d)", value: stats.newLandlords7d },
                      { label: "New Landlords (30d)", value: stats.newLandlords30d },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                        <p className="text-[#888] text-xs mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-[#FF6B35]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue */}
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-3">💰 Revenue</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Revenue (24h)", value: "Ksh " + stats.revenue1d.toLocaleString() },
                      { label: "Revenue (7d)", value: "Ksh " + stats.revenue7d.toLocaleString() },
                      { label: "Revenue (30d)", value: "Ksh " + stats.revenue30d.toLocaleString() },
                    ].map((s, i) => (
                      <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                        <p className="text-[#888] text-xs mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-[#FF6B35]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "New Listings (7d)", value: stats.newListings7d, icon: "🏠" },
                    { label: "Dead Listings (0 views)", value: stats.deadListings, icon: "💤" },
                    { label: "Most Active Estate", value: stats.topEstate ? stats.topEstate + " (" + stats.topEstateCount + ")" : "—", icon: "📍" },
                    { label: "Total Revenue", value: "Ksh " + stats.totalRevenue.toLocaleString(), icon: "💰" },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                      <p className="text-2xl mb-2">{s.icon}</p>
                      <p className="text-[#888] text-xs mb-1">{s.label}</p>
                      <p className="text-xl font-black text-[#FF6B35]">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Most viewed + most saved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.mostViewedListing && (
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                      <p className="text-xs text-[#888] uppercase tracking-widest mb-3">🔥 Most Viewed Listing</p>
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0">
                          {stats.mostViewedListing.photos?.[0] ? <img src={stats.mostViewedListing.photos[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{(stats.mostViewedListing.apartment_name || stats.mostViewedListing.house_type?.replace("_", " "))} — {stats.mostViewedListing.location}</p>
                          <p className="text-[#FF6B35] font-bold">{stats.mostViewedListing.views || 0} views</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {stats.mostSavedListing && (
                    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                      <p className="text-xs text-[#888] uppercase tracking-widest mb-3">❤️ Most Saved Listing</p>
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0">
                          {stats.mostSavedListing.photos?.[0] ? <img src={stats.mostSavedListing.photos[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{(stats.mostSavedListing.apartment_name || stats.mostSavedListing.house_type?.replace("_", " "))} — {stats.mostSavedListing.location}</p>
                          <p className="text-[#FF6B35] font-bold">{stats.mostSavedListing.save_count} saves</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top landlord */}
                {stats.topLandlord && (
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">🏆 Top Landlord by Listings</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{stats.topLandlord.full_name}</p>
                        <p className="text-sm text-[#888]">{stats.topLandlord.email} · {stats.topLandlord.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FF6B35] font-black text-2xl">{stats.topLandlord.listing_count}</p>
                        <p className="text-xs text-[#888]">listings</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity feed */}
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-4">⚡ Recent Activity</p>
                  {loadingActivity ? (
                    <div className="text-center py-4 text-[#888] text-sm">Loading activity...</div>
                  ) : activity.length === 0 ? (
                    <p className="text-[#888] text-sm">No activity yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {activity.map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-lg shrink-0">{a.icon}</span>
                          <div>
                            <p className="text-sm text-[#f5f0eb]">{a.message}</p>
                            <p className="text-xs text-[#888]">{new Date(a.time).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* LISTINGS */}
        {activeTab === "listings" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <input type="text" placeholder="Search apartment name..." value={listingSearch.apartment} onChange={(e) => setListingSearch((p) => ({ ...p, apartment: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
              <input type="text" placeholder="Search area / estate..." value={listingSearch.area} onChange={(e) => setListingSearch((p) => ({ ...p, area: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
              <select value={listingSearch.houseType} onChange={(e) => setListingSearch((p) => ({ ...p, houseType: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition">
                <option value="">All House Types</option>
                <option value="studio">Studio Apartment</option>
                <option value="bedsitter">Bedsitter</option>
                <option value="single_room">Single Room</option>
                <option value="double_room">Double Room</option>
                <option value="one_bedroom">One Bedroom</option>
                <option value="two_bedroom">Two Bedroom</option>
                <option value="three_bedroom">Three Bedroom</option>
              </select>
              <input type="text" placeholder="Search landlord email/phone..." value={listingSearch.landlordContact} onChange={(e) => setListingSearch((p) => ({ ...p, landlordContact: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-[#888]">Sort by:</span>
              <select value={listingSort} onChange={(e) => setListingSort(e.target.value)} className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition">
                <option value="newest">Newest</option>
                <option value="most_viewed">Most Viewed</option>
                <option value="most_saved">Most Saved</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <span className="text-sm text-[#888]">{filteredListings.length} of {listings.length} listings</span>
            </div>
            <div className="space-y-3">
              {loadingListings ? (
                <div className="text-center py-12 text-[#888]">Loading listings...</div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No listings match your search.</div>
              ) : filteredListings.map((listing) => {
                const photos = Array.isArray(listing.photos) ? listing.photos : [];
                const isExpanded = expandedListing === listing.id;
                return (
                  <div key={listing.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedListing(isExpanded ? null : listing.id)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-xl">
                          {photos[0] ? <img src={photos[0]} alt="" className="w-full h-full object-cover" /> : "🏠"}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{listing.apartment_name ? listing.apartment_name + " — " : ""}{listing.house_type?.replace("_", " ")} — {listing.location}</p>
                          <p className="text-sm text-[#888]">Ksh {listing.price?.toLocaleString()}/mo · <button onClick={(e) => { e.stopPropagation(); openProfileModal(listing.users?.id || listing.landlord_id); }} className="text-[#FF6B35] hover:underline">{listing.users?.full_name || "Unknown landlord"}</button> · {listing.status} · {listing.views || 0} views · {listing.save_count} saves</p>
                        </div>
                      </div>
                      <span className="text-[#888] text-sm shrink-0">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-[#2a2a2a] p-4 space-y-3">
                        {photos.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {photos.map((p, i) => <img key={i} src={p} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0" />)}
                          </div>
                        )}
                        <p className="text-sm text-[#888]">{listing.description || "No description."}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-[#888]">Estate: <span className="text-white">{listing.estate}</span></p>
                          <p className="text-[#888]">Status: <span className="text-white capitalize">{listing.status}</span></p>
                          <p className="text-[#888]">Landlord email: <span className="text-white">{listing.users?.email}</span></p>
                          <p className="text-[#888]">Landlord phone: <span className="text-white">{listing.users?.phone}</span></p>
                          <p className="text-[#888]">Posted: <span className="text-white">{new Date(listing.created_at).toLocaleString()}</span></p>
                          <p className="text-[#888]">Landlord verified: <span className="text-white">{listing.users?.is_verified ? "Yes" : "No"}</span></p>
                        </div>
                        <div className="flex gap-3 pt-2 flex-wrap">
                          <button onClick={() => setListingPreview(listing)} className="bg-[#1a1a1a] border border-[#FF6B35]/30 text-[#FF6B35] text-sm px-4 py-2 rounded-lg hover:bg-[#FF6B35]/10 transition">Preview Listing</button>
                          <button onClick={() => handleToggleListingStatus(listing.id, listing.status)} disabled={togglingStatus === listing.id} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FF6B35] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
                            {togglingStatus === listing.id ? "..." : listing.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button onClick={() => handleDeleteListing(listing.id)} className="bg-[#1a1a1a] border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <input type="text" placeholder="Search by name..." value={userSearch.name} onChange={(e) => setUserSearch((p) => ({ ...p, name: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
              <input type="text" placeholder="Search by email..." value={userSearch.email} onChange={(e) => setUserSearch((p) => ({ ...p, email: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
              <input type="text" placeholder="Search by phone..." value={userSearch.phone} onChange={(e) => setUserSearch((p) => ({ ...p, phone: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-[#888] px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
              <input type="date" value={userSearch.date} onChange={(e) => setUserSearch((p) => ({ ...p, date: e.target.value }))} className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
            </div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition">
                <option value="all">All Roles</option>
                <option value="tenant">Tenants</option>
                <option value="landlord">Landlords</option>
              </select>
              <select value={userVerifiedFilter} onChange={(e) => setUserVerifiedFilter(e.target.value)} className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition">
                <option value="all">Verified & Unverified</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
              <span className="text-sm text-[#888]">{filteredUsers.length} of {users.length} users</span>
            </div>
            <div className="space-y-3">
              {loadingUsers ? (
                <div className="text-center py-12 text-[#888]">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No users match your search.</div>
              ) : filteredUsers.map((u) => {
                const isExpanded = expandedUser === u.id;
                return (
                  <div key={u.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedUser(isExpanded ? null : u.id)}>
                      <div>
                        <p className="font-semibold">{u.full_name} {u.is_verified && <span className="text-green-400 text-xs">✓ Verified</span>}</p>
                        <p className="text-sm text-[#888]">{u.email} · {u.phone} · {u.role}</p>
                      </div>
                      <span className="text-[#888] text-sm shrink-0">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-[#2a2a2a] p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-[#888]">Joined: <span className="text-white">{new Date(u.created_at).toLocaleString()}</span></p>
                          <p className="text-[#888]">Email verified: <span className="text-white">{u.email_verified ? "Yes" : "No"}</span></p>
                          <p className="text-[#888]">Last login: <span className="text-white">{u.last_login ? new Date(u.last_login).toLocaleString() : "Never"}</span></p>
                          {u.role === "landlord" && (
                            <p className="text-[#888]">Verified on: <span className={u.verified_at ? "text-green-400" : "text-white"}>{u.verified_at ? new Date(u.verified_at).toLocaleString() : "Not verified"}</span></p>
                          )}
                          {u.role === "landlord" && <p className="text-[#888]">Listings posted: <span className="text-white">{u.listing_count}</span></p>}
                          {u.role === "tenant" && <p className="text-[#888]">Listings saved: <span className="text-white">{u.saved_count}</span></p>}
                        </div>
                        <div className="flex gap-3 pt-2 flex-wrap">
                          <button onClick={() => openProfileModal(u.id)} className="bg-[#1a1a1a] border border-[#FF6B35]/30 text-[#FF6B35] text-sm px-4 py-2 rounded-lg hover:bg-[#FF6B35]/10 transition">View Full Profile</button>
                          {u.role === "landlord" && (
                            <button onClick={() => handleToggleVerified(u.id, u.is_verified)} disabled={togglingVerified === u.id} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FF6B35] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
                              {togglingVerified === u.id ? "..." : u.is_verified ? "Remove Verified Badge" : "Mark as Verified"}
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u.id)} className="bg-[#1a1a1a] border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition">Delete User</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VERIFICATIONS */}
        {activeTab === "verifications" && (
          <div>
            {loadingVerifications ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">Loading verification requests...</div>
            ) : verificationRequests.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold mb-2">No pending verifications</h2>
                <p className="text-[#888]">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verificationRequests.map((req) => (
                  <div key={req.id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-48 flex flex-col gap-2 shrink-0">
                      <div className="h-24 bg-[#1a1a1a] rounded-xl overflow-hidden">
                        <img src={req.id_photo_signed_url} alt="ID front" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-24 bg-[#1a1a1a] rounded-xl overflow-hidden">
                        <img src={req.id_photo_back_signed_url} alt="ID back" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <button onClick={() => openProfileModal(req.landlord_id)} className="font-semibold mb-1 text-[#FF6B35] hover:underline block">{req.users?.full_name || "Unknown"}</button>
                      <p className="text-sm text-[#888] mb-1">{req.users?.email}</p>
                      <p className="text-sm text-[#888] mb-1">{req.users?.phone}</p>
                      <p className="text-sm text-[#888] mb-3">{req.listing_count} listing{req.listing_count !== 1 ? "s" : ""} posted</p>
                      <p className="text-xs text-[#888] mb-4">Submitted: {new Date(req.created_at).toLocaleString()}</p>
                      <div className="flex gap-3">
                        <button onClick={() => handleReview(req.id, req.landlord_id, "approved")} disabled={reviewing === req.id} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                          {reviewing === req.id ? "..." : "✓ Approve"}
                        </button>
                        <button onClick={() => handleReview(req.id, req.landlord_id, "rejected")} disabled={reviewing === req.id} className="bg-[#1a1a1a] border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 text-red-400 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                          {reviewing === req.id ? "..." : "✕ Reject"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-3">
            {loadingMessages ? (
              <div className="text-center py-12 text-[#888]">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No messages yet.</div>
            ) : messages.map((msg) => {
              const isExpanded = expandedMessage === msg.id;
              return (
                <div key={msg.id} className={"bg-[#111111] border rounded-xl overflow-hidden " + (msg.is_read ? "border-[#2a2a2a]" : "border-[#FF6B35]/30")}>
                  <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => { setExpandedMessage(isExpanded ? null : msg.id); if (!msg.is_read) handleMarkMessageRead(msg.id); }}>
                    <div>
                      <p className="font-semibold">{msg.name} {!msg.is_read && <span className="text-[#FF6B35] text-xs">● New</span>}</p>
                      <p className="text-sm text-[#888]">{msg.email} · {msg.subject}</p>
                    </div>
                    <span className="text-[#888] text-sm shrink-0">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-[#2a2a2a] p-4 space-y-4">
                      <p className="text-sm text-[#f5f0eb] leading-relaxed">{msg.message}</p>
                      <p className="text-xs text-[#888]">Received: {new Date(msg.created_at).toLocaleString()}</p>
                      <div>
                        {msg.admin_reply && (
                          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl p-4 mb-4">
                            <p className="text-xs text-[#FF6B35] uppercase tracking-widest mb-2">Your reply — sent {new Date(msg.replied_at).toLocaleString()}</p>
                            <p className="text-sm text-[#f5f0eb] leading-relaxed whitespace-pre-wrap">{msg.admin_reply}</p>
                          </div>
                        )}
                        <label className="text-sm text-[#888] mb-1.5 block">{msg.admin_reply ? "Send another reply" : "Reply to"} {msg.name}</label>
                          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} placeholder="Write your reply..." className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition resize-none mb-3" />
                          <button onClick={() => handleSendReply(msg)} disabled={sendingReply === msg.id} className="bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                            {sendingReply === msg.id ? "Sending..." : "Send Reply"}
                          </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {loadingReports ? (
              <div className="text-center py-12 text-[#888]">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No reports yet.</div>
            ) : reports.map((r) => {
              const isExpanded = expandedReport === r.id;
              const photos = Array.isArray(r.listings?.photos) ? r.listings.photos : [];
              return (
                <div key={r.id} className={"bg-[#111111] border rounded-xl overflow-hidden " + (r.status === "pending" ? "border-red-500/30" : "border-[#2a2a2a]")}>
                  <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedReport(isExpanded ? null : r.id)}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold capitalize">{r.listings?.house_type?.replace("_", " ")} — {r.listings?.location || "Unknown listing"}</p>
                        {r.report_count > 1 && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">{r.report_count} reports</span>}
                        <span className={"text-xs px-2 py-0.5 rounded-full capitalize " + (r.status === "pending" ? "bg-red-500/10 text-red-400 border border-red-500/20" : r.status === "resolved" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-[#2a2a2a] text-[#888]")}>{r.status}</span>
                      </div>
                      <p className="text-sm text-[#888]">Reason: <span className="text-white capitalize">{(r.reason || "").replace(/_/g, " ")}</span> · Reported by {r.reporter?.full_name || "Unknown"}</p>
                    </div>
                    <span className="text-[#888] text-sm shrink-0">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-[#2a2a2a] p-4 space-y-4">
                      <div className="bg-[#0a0a0a] rounded-xl p-4 space-y-3">
                        <p className="text-xs text-[#888] uppercase tracking-widest mb-2">Reported Listing</p>
                        {photos.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {photos.slice(0, 4).map((p, i) => <img key={i} src={p} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0" />)}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-[#888]">Location: <span className="text-white">{r.listings?.location}</span></p>
                          <p className="text-[#888]">Estate: <span className="text-white">{r.listings?.estate}</span></p>
                          <p className="text-[#888]">Status: <span className="text-white capitalize">{r.listings?.status}</span></p>
                          <p className="text-[#888]">Price: <span className="text-white">Ksh {r.listings?.price?.toLocaleString()}/mo</span></p>
                        </div>
                        <button onClick={() => setListingPreview(r.listings)} className="text-sm text-[#FF6B35] hover:underline">Preview listing →</button>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-xl p-4">
                        <p className="text-xs text-[#888] uppercase tracking-widest mb-2">Landlord</p>
                        <button onClick={() => openProfileModal(r.listings?.landlord_id)} className="font-semibold text-[#FF6B35] hover:underline block">{r.landlord?.full_name || "Unknown"}</button>
                        <p className="text-sm text-[#888]">{r.landlord?.email} · {r.landlord?.phone}</p>
                      </div>
                      <div className="bg-[#0a0a0a] rounded-xl p-4">
                        <p className="text-xs text-[#888] uppercase tracking-widest mb-2">Reporter</p>
                        <button onClick={() => openProfileModal(r.reported_by)} className="font-semibold text-[#FF6B35] hover:underline block">{r.reporter?.full_name || "Unknown"}</button>
                        <p className="text-sm text-[#888]">{r.reporter?.email}</p>
                        {r.details && <p className="text-sm text-[#888] mt-2">"{r.details}"</p>}
                        <p className="text-xs text-[#888] mt-2">{new Date(r.created_at).toLocaleString()}</p>
                      </div>
                      {r.status === "pending" && (
                        <div className="flex flex-wrap gap-3 pt-1">
                          <button onClick={() => handleToggleListingFromReport(r.listing_id, r.listings?.status, r.id)} disabled={togglingReportListing === r.id} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FF6B35] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                            {togglingReportListing === r.id ? "..." : r.listings?.status === "active" ? "Deactivate Listing" : "Activate Listing"}
                          </button>
                          <button onClick={() => handleDeleteListingFromReport(r.listing_id, r.id)} disabled={deletingFromReport === r.id} className="bg-[#1a1a1a] border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 text-red-400 text-sm font-semibold px-4 py-2 rounded-lg transition">
                            {deletingFromReport === r.id ? "Deleting..." : "Delete Listing"}
                          </button>
                          <button onClick={() => handleResolveReport(r.id, "resolved")} className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Mark Resolved</button>
                          <button onClick={() => handleResolveReport(r.id, "dismissed")} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-sm font-semibold px-4 py-2 rounded-lg hover:border-[#FF6B35] transition">Dismiss</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

{/* CAREERS */}
        {activeTab === "careers" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => { setShowCareerForm(true); setEditingCareer(null); setCareerForm({ title: "", department: "", location: "Nairobi, Kenya", type: "Full-time", description: "", requirements: "" }); }}
                className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
              >
                + Post a Job
              </button>
            </div>

            {showCareerForm && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 mb-6 space-y-4">
                <h3 className="font-bold">{editingCareer ? "Edit Job" : "New Job Posting"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#888] mb-1 block">Job Title</label>
                    <input type="text" value={careerForm.title} onChange={(e) => setCareerForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Software Engineer" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1 block">Department</label>
                    <input type="text" value={careerForm.department} onChange={(e) => setCareerForm(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Engineering" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1 block">Location</label>
                    <input type="text" value={careerForm.location} onChange={(e) => setCareerForm(p => ({ ...p, location: e.target.value }))} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] mb-1 block">Type</label>
                    <select value={careerForm.type} onChange={(e) => setCareerForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#888] mb-1 block">Description</label>
                  <textarea value={careerForm.description} onChange={(e) => setCareerForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the role..." className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition resize-none" />
                </div>
                <div>
                  <label className="text-xs text-[#888] mb-1 block">Requirements</label>
                  <textarea value={careerForm.requirements} onChange={(e) => setCareerForm(p => ({ ...p, requirements: e.target.value }))} rows={3} placeholder="List the requirements..." className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35] transition resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowCareerForm(false); setEditingCareer(null); }} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-2 rounded-lg hover:border-[#FF6B35] transition text-sm">Cancel</button>
                  <button onClick={handleCareerSubmit} disabled={submittingCareer} className="flex-1 bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition text-sm">
                    {submittingCareer ? "Saving..." : editingCareer ? "Save Changes" : "Post Job"}
                  </button>
                </div>
              </div>
            )}

            {loadingCareers ? (
              <div className="text-center py-12 text-[#888]">Loading...</div>
            ) : careers.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No job postings yet. Click "Post a Job" to add one.</div>
            ) : (
              <div className="space-y-3">
                {careers.map((job) => (
                  <div key={job.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{job.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${job.is_active ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-[#888]">{job.department} · {job.location} · {job.type}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setEditingCareer(job); setCareerForm({ title: job.title, department: job.department || "", location: job.location || "Nairobi, Kenya", type: job.type || "Full-time", description: job.description, requirements: job.requirements || "" }); setShowCareerForm(true); }} className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-1.5 rounded-lg hover:border-[#FF6B35] transition">Edit</button>
                      <button onClick={() => handleToggleCareer(job.id, job.is_active)} className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-1.5 rounded-lg hover:border-[#FF6B35] transition">{job.is_active ? "Deactivate" : "Activate"}</button>
                      <button onClick={() => handleDeleteCareer(job.id)} className="bg-[#1a1a1a] border border-red-500/30 text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-3">
            {loadingPayments ? (
              <div className="text-center py-12 text-[#888]">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center text-[#888]">No payments yet.</div>
            ) : payments.map((p) => (
              <div key={p.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.users?.full_name || "Unknown"} — {p.payment_type}</p>
                  <p className="text-sm text-[#888]">{p.status} · {new Date(p.created_at).toLocaleString()}</p>
                </div>
                <p className="text-[#FF6B35] font-bold">Ksh {p.amount?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROFILE DEEP-DIVE MODAL */}
      {profileModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold">User Profile</h2>
              <button onClick={() => { setProfileModal(null); setProfileData(null); }} aria-label="Close profile" className="text-[#888] hover:text-white text-xl">✕</button>
            </div>
            {loadingProfile ? (
              <div className="p-8 text-center text-[#888]">Loading profile...</div>
            ) : profileData ? (
              <div className="p-6 space-y-6">
                {/* Basic info */}
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-bold">{profileData.user.full_name} {profileData.user.is_verified && <span className="text-green-400 text-sm">✓ Verified</span>}</p>
                      <p className="text-[#888] text-sm capitalize">{profileData.user.role}</p>
                    </div>
                    <span className="bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 text-xs px-3 py-1 rounded-full capitalize">{profileData.user.role}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-[#888]">Email: <span className="text-white">{profileData.user.email}</span></p>
                    <p className="text-[#888]">Phone: <span className="text-white">{profileData.user.phone}</span></p>
                    <p className="text-[#888]">Joined: <span className="text-white">{new Date(profileData.user.created_at).toLocaleString()}</span></p>
                    <p className="text-[#888]">Email verified: <span className="text-white">{profileData.user.email_verified ? "Yes" : "No"}</span></p>
                    <p className="text-[#888]">Last login: <span className="text-white">{profileData.user.last_login ? new Date(profileData.user.last_login).toLocaleString() : "Never"}</span></p>
                    {profileData.user.role === "landlord" && (
                      <p className="text-[#888]">Verified on: <span className={profileData.user.verified_at ? "text-green-400" : "text-white"}>{profileData.user.verified_at ? new Date(profileData.user.verified_at).toLocaleString() : "Not verified yet"}</span></p>
                    )}
                  </div>
                </div>

                {/* Landlord: listings */}
                {profileData.user.role === "landlord" && profileData.listings.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Listings ({profileData.listings.length})</p>
                    <div className="space-y-2">
                      {profileData.listings.map((l) => {
                        const photos = Array.isArray(l.photos) ? l.photos : [];
                        return (
                          <div key={l.id} className="bg-[#0a0a0a] rounded-xl p-3 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-lg">
                              {photos[0] ? <img src={photos[0]} alt="" className="w-full h-full object-cover" /> : "🏠"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm capitalize">{l.apartment_name || (l.house_type?.replace("_", " "))} — {l.location}</p>
                              <p className="text-xs text-[#888]">Ksh {l.price?.toLocaleString()}/mo · {l.views || 0} views · {l.save_count} saves · <span className={l.status === "active" ? "text-green-400" : "text-red-400"}>{l.status}</span></p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Landlord: reports against their listings */}
                {profileData.user.role === "landlord" && profileData.reports.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Reports Against This Landlord ({profileData.reports.length})</p>
                    <div className="space-y-2">
                      {profileData.reports.map((r) => (
                        <div key={r.id} className="bg-[#0a0a0a] rounded-xl p-3">
                          <p className="text-sm font-medium capitalize">{(r.reason || "").replace(/_/g, " ")}</p>
                          <p className="text-xs text-[#888]">{r.listings?.location} · {r.status} · {new Date(r.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tenant: saved listings */}
                {profileData.user.role === "tenant" && profileData.savedListings.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Saved Listings ({profileData.savedListings.length})</p>
                    <div className="space-y-2">
                      {profileData.savedListings.map((s) => {
                        const l = s.listings;
                        if (!l) return null;
                        return (
                          <div key={s.listing_id} className="bg-[#0a0a0a] rounded-xl p-3">
                            <p className="text-sm font-medium capitalize">{l.house_type?.replace("_", " ")} — {l.location}</p>
                            <p className="text-xs text-[#888]">Ksh {l.price?.toLocaleString()}/mo · {l.status}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tenant: recently viewed */}
                {profileData.user.role === "tenant" && profileData.recentlyViewed.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Recently Viewed ({profileData.recentlyViewed.length})</p>
                    <div className="space-y-2">
                      {profileData.recentlyViewed.map((v, i) => {
                        const l = v.listings;
                        if (!l) return null;
                        return (
                          <div key={i} className="bg-[#0a0a0a] rounded-xl p-3">
                            <p className="text-sm font-medium capitalize">{l.house_type?.replace("_", " ")} — {l.location}</p>
                            <p className="text-xs text-[#888]">Ksh {l.price?.toLocaleString()}/mo · Viewed {new Date(v.created_at).toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tenant: reports filed */}
                {profileData.user.role === "tenant" && profileData.filedReports.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Reports Filed ({profileData.filedReports.length})</p>
                    <div className="space-y-2">
                      {profileData.filedReports.map((r) => (
                        <div key={r.id} className="bg-[#0a0a0a] rounded-xl p-3">
                          <p className="text-sm font-medium capitalize">{(r.reason || "").replace(/_/g, " ")}</p>
                          <p className="text-xs text-[#888]">{r.listings?.location} · {r.status} · {new Date(r.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-[#2a2a2a]">
                  {profileData.user.role === "landlord" && (
                    <button onClick={() => handleToggleVerified(profileData.user.id, profileData.user.is_verified)} disabled={togglingVerified === profileData.user.id} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FF6B35] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition">
                      {profileData.user.is_verified ? "Remove Verified Badge" : "Mark as Verified"}
                    </button>
                  )}
                  <button onClick={() => handleDeleteUser(profileData.user.id)} className="bg-[#1a1a1a] border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition">Delete Account</button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#888]">Failed to load profile.</div>
            )}
          </div>
        </div>
      )}

      {/* INLINE LISTING PREVIEW MODAL */}
      {listingPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold">Listing Preview</h2>
              <button onClick={() => setListingPreview(null)} aria-label="Close listing preview" className="text-[#888] hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {(() => {
                const photos = Array.isArray(listingPreview.photos) ? listingPreview.photos : [];
                const amenities = typeof listingPreview.amenities === "string" ? JSON.parse(listingPreview.amenities) : listingPreview.amenities || {};
                return (
                  <>
                    {photos.length > 0 && (
                      <div>
                        <div className="h-56 rounded-xl overflow-hidden mb-2">
                          <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        {photos.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {photos.slice(1).map((p, i) => <img key={i} src={p} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0" />)}
                          </div>
                        )}
                      </div>
                    )}
                    {photos.length === 0 && <div className="h-40 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-5xl">🏠</div>}
                    <div>
                      <h3 className="text-2xl font-black mb-1">{listingPreview.apartment_name || listingPreview.location}</h3>
                      <p className="text-[#888]">{listingPreview.location}, {listingPreview.estate}</p>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-xl p-4">
                      <p className="text-[#888] text-sm mb-1">Monthly Rent</p>
                      <p className="text-3xl font-black text-[#FF6B35]">Ksh {(listingPreview.price || 0).toLocaleString()}<span className="text-lg text-[#888] font-normal">/mo</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">About this place</p>
                      <p className="text-[#888] text-sm leading-relaxed">{listingPreview.description || "No description."}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Amenities</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["water", "electricity", "parking", "security", "wifi"].map((a) => (
                          <div key={a} className={"flex items-center gap-2 px-3 py-2 rounded-lg border text-sm capitalize " + (amenities[a] ? "border-green-500/30 text-green-400" : "border-[#2a2a2a] text-[#777]")}>
                            {a} {amenities[a] ? "✓" : "✗"}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-[#0a0a0a] rounded-xl p-4">
                      <p className="text-[#888]">Views: <span className="text-white">{listingPreview.views || 0}</span></p>
                      <p className="text-[#888]">Status: <span className="text-white capitalize">{listingPreview.status}</span></p>
                      <p className="text-[#888]">Type: <span className="text-white capitalize">{(listingPreview.house_type || "").replace("_", " ")}</span></p>
                      <p className="text-[#888]">Posted: <span className="text-white">{listingPreview.created_at ? new Date(listingPreview.created_at).toLocaleDateString() : "—"}</span></p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}