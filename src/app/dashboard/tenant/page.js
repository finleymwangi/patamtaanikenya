"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState("saved");
  const [user, setUser] = useState(null);
  const [savedListings, setSavedListings] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [profileForm, setProfileForm] = useState({ full_name: "", email: "", phone: "", new_password: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [tenantNotifications, setTenantNotifications] = useState([]);
  const [loadingTenantNotifs, setLoadingTenantNotifs] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patamtaani_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== "tenant") {
      router.push("/login");
      return;
    }
    setUser(parsedUser);
    setProfileForm({
      full_name: parsedUser.full_name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      new_password: "",
    });
    fetchSavedListings(parsedUser.id);
    fetchTenantNotifications(parsedUser.id);
    checkNewListings(parsedUser.id);
    fetchRecentlyViewed(parsedUser.id);
  }, []);

const fetchRecentlyViewed = async (tenantId) => {
    setLoadingRecent(true);
    try {
      const res = await fetch("/api/listings/recently-viewed?tenant_id=" + tenantId);
      const data = await res.json();
      if (data.success) setRecentlyViewed(data.viewed);
    } catch (err) {
      console.error("Failed to fetch recently viewed:", err);
    } finally {
      setLoadingRecent(false);
    }
  };

const fetchTenantNotifications = async (tenantId) => {
    setLoadingTenantNotifs(true);
    try {
      const res = await fetch("/api/tenant-notifications/get?tenant_id=" + tenantId);
      const data = await res.json();
      if (data.success) setTenantNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch tenant notifications:", err);
    } finally {
      setLoadingTenantNotifs(false);
    }
  };

  const checkNewListings = async (tenantId) => {
    try {
      await fetch("/api/tenant-notifications/new-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId }),
      });
      // Refresh notifications after check
      fetchTenantNotifications(tenantId);
    } catch (err) {
      console.error("Failed to check new listings:", err);
    }
  };

  const handleMarkTenantNotifsRead = async () => {
    try {
      await fetch("/api/tenant-notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: user.id }),
      });
      fetchTenantNotifications(user.id);
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const fetchSavedListings = async (tenantId) => {
    setLoadingSaved(true);
    try {
      const res = await fetch("/api/listings/saved?tenant_id=" + tenantId);
      const data = await res.json();
      if (data.success) setSavedListings(data.saved);
    } catch (err) {
      console.error("Failed to fetch saved listings:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleUnsave = async (listingId) => {
    try {
      await fetch("/api/listings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: user.id, listing_id: listingId }),
      });
      fetchSavedListings(user.id);
    } catch (err) {
      console.error("Failed to unsave:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("patamtaani_user");
    router.push("/");
  };

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          full_name: profileForm.full_name,
          email: profileForm.email,
          phone: profileForm.phone,
          new_password: profileForm.new_password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      localStorage.setItem("patamtaani_user", JSON.stringify(data.user));
      setUser(data.user);
      setProfileForm((prev) => ({ ...prev, new_password: "" }));
      setProfileMessage("✓ Profile updated successfully!");
    } catch (err) {
      setProfileMessage(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all saved listings. This cannot be undone.")) return;
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account.");
      localStorage.removeItem("patamtaani_user");
      router.push("/");
    } catch (err) {
      alert(err.message);
      setDeletingAccount(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar active="dashboard" />

      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1">Mambo, {user.full_name?.split(" ")[0]} 👋</h1>
          <p className="text-[#888]">Manage your saved listings and profile.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <p className="text-[#888] text-sm mb-1">Saved Listings</p>
            <p className="text-3xl font-black text-[#FF6B35]">{savedListings.length}</p>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <p className="text-[#888] text-sm mb-1">Recently Viewed</p>
            <p className="text-3xl font-black text-[#FF6B35]">{recentlyViewed.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-[#2a2a2a]">
          {["saved", "recent", "notifications", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-[#888] hover:text-white"
              }`}
            >
              {tab === "saved" ? "Saved Listings" : tab === "recent" ? "Recently Viewed" : tab === "notifications" ? (
                <span className="flex items-center gap-1">
                  Notifications
                  {tenantNotifications.some(n => !n.is_read) && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35] inline-block"></span>
                  )}
                </span>
              ) : "My Profile"}
            </button>
          ))}
        </div>

        {/* SAVED LISTINGS */}
        {activeTab === "saved" && (
          <div>
            {loadingSaved ? (
              <div className="text-center py-20 text-[#888]">Loading saved listings...</div>
            ) : savedListings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold mb-2">No saved listings yet</h2>
                <p className="text-[#888] mb-6">Start browsing and save listings you like.</p>
                <Link href="/listings" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E8521A] transition">
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map((item) => {
                  const listing = item.listings;
                  if (!listing) return null;
                  const photos = Array.isArray(listing.photos) ? listing.photos : [];
                  return (
                    <div key={item.listing_id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition">
                      <Link href={"/listings/" + listing.id}>
                        <div className="h-40 bg-[#1a1a1a] flex items-center justify-center text-4xl overflow-hidden">
                          {photos[0] ? (
                            <img src={photos[0]} alt={listing.location} className="w-full h-full object-cover" />
                          ) : (
                            "🏠"
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] px-2 py-1 rounded-full capitalize">
                          {(listing.house_type || "").replace(/_/g, " ")}
                        </span>
                        <p className="font-semibold mt-2 mb-1">{listing.location}</p>
                        <p className="text-[#FF6B35] font-bold mb-3">Ksh {(listing.price || 0).toLocaleString()}/mo</p>
                        <div className="flex gap-2">
                          <Link href={"/listings/" + listing.id} className="flex-1 bg-[#FF6B35] text-white text-sm py-2 rounded-lg text-center hover:bg-[#E8521A] transition font-medium">
                            View
                          </Link>
                          <button onClick={() => handleUnsave(listing.id)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-sm py-2 rounded-lg hover:border-red-500 hover:text-red-400 transition">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RECENTLY VIEWED */}
        {activeTab === "recent" && (
          <div>
            {loadingRecent ? (
              <div className="text-center py-20 text-[#888]">Loading recently viewed...</div>
            ) : recentlyViewed.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🕐</div>
                <h2 className="text-xl font-bold mb-2">No recently viewed listings</h2>
                <p className="text-[#888] mb-6">Listings you view will appear here.</p>
                <Link href="/listings" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E8521A] transition">
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map((listing) => {
                  const photos = Array.isArray(listing.photos) ? listing.photos : [];
                  return (
                    <Link href={"/listings/" + listing.id} key={listing.id + "-" + listing.viewed_at}>
                      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition h-full">
                        <div className="h-40 bg-[#1a1a1a] flex items-center justify-center text-4xl overflow-hidden">
                          {photos[0] ? (
                            <img src={photos[0]} alt={listing.location} className="w-full h-full object-cover" />
                          ) : (
                            "🏠"
                          )}
                        </div>
                        <div className="p-4">
                          <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] px-2 py-1 rounded-full capitalize">
                            {(listing.house_type || "").replace(/_/g, " ")}
                          </span>
                          <p className="font-semibold mt-2 mb-1">{listing.location}</p>
                          <p className="text-[#FF6B35] font-bold">Ksh {(listing.price || 0).toLocaleString()}/mo</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            {tenantNotifications.some(n => !n.is_read) && (
              <div className="flex justify-end mb-4">
                <button onClick={handleMarkTenantNotifsRead} className="text-sm text-[#FF6B35] hover:underline">
                  Mark all as read
                </button>
              </div>
            )}
            {loadingTenantNotifs ? (
              <div className="text-center py-20 text-[#888]">Loading notifications...</div>
            ) : tenantNotifications.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔔</div>
                <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
                <p className="text-[#888] mb-6">We'll notify you when new listings appear in areas you've browsed, or when we act on a report you've filed.</p>
                <Link href="/listings" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#E8521A] transition">
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tenantNotifications.map((notif) => {
                  const icons = {
                    new_listing_in_area: "🏠",
                    report_update: "📋",
                  };
                  return (
                    <div key={notif.id} className={"bg-[#111111] border rounded-xl p-4 flex items-start gap-3 " + (notif.is_read ? "border-[#2a2a2a]" : "border-[#FF6B35]/30")}>
                      <div className="text-lg shrink-0">{icons[notif.type] || "🔔"}</div>
                      <div className="flex-1">
                        <p className="text-sm text-[#f5f0eb]">{notif.message}</p>
                        <p className="text-xs text-[#888] mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                        {notif.type === "new_listing_in_area" && notif.listing_id && (
                          <Link href={"/listings/" + notif.listing_id} className="text-xs text-[#FF6B35] hover:underline mt-1 block">
                            View listing →
                          </Link>
                        )}
                      </div>
                      {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-1.5 shrink-0"></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-md">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={profileForm.new_password}
                  onChange={handleProfileChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
                />
              </div>
              {profileMessage && (
                <div className={"text-sm px-4 py-3 rounded-xl " + (profileMessage.startsWith("✓") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400")}>
                  {profileMessage}
                </div>
              )}
              <button onClick={handleProfileSave} disabled={savingProfile} className="w-full bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={handleDeleteAccount} disabled={deletingAccount} className="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 font-medium py-3 rounded-xl transition text-sm">
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}