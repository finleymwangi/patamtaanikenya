"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function PaymentBanner({ user }) {
  const [paying, setPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [polling, setPolling] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    setPaymentMessage("");
    try {
      const res = await fetch("/api/payments/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landlord_id: user.id, phone: user.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment.");
      setPaymentMessage("✅ M-Pesa prompt sent to " + user.phone + ". Enter your PIN to complete payment.");
      setPolling(true);
      pollPaymentStatus(data.checkout_request_id);
    } catch (err) {
      setPaymentMessage("❌ " + err.message);
    } finally {
      setPaying(false);
    }
  };

  const pollPaymentStatus = (id) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch("/api/payments/mpesa/status?checkout_request_id=" + id);
        const data = await res.json();
        if (data.status === "completed") {
          setPaymentMessage("🎉 Payment confirmed! Your account is now verified. Refresh the page to see your badge.");
          clearInterval(interval);
          setPolling(false);
        } else if (data.status === "failed") {
          setPaymentMessage("❌ Payment was not completed. Please try again.");
          clearInterval(interval);
          setPolling(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
      if (attempts >= 10) {
        clearInterval(interval);
        setPolling(false);
      }
    }, 5000);
  };

  return (
    <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-5 mb-8">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-[#FF6B35] mb-1">🎉 ID Approved — Complete Your Verification</p>
          <p className="text-sm text-[#888]">Your ID has been verified. Pay Ksh 200/month via M-Pesa to activate your verified badge.</p>
        </div>
        <button onClick={handlePay} disabled={paying || polling} className="bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition whitespace-nowrap text-sm shrink-0">
          {paying ? "Sending..." : polling ? "Waiting..." : "Pay Ksh 200"}
        </button>
      </div>
      {paymentMessage && (
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f0eb]">{paymentMessage}</div>
      )}
    </div>
  );
}

function FormFields({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">Apartment / Building Name (optional)</label>
        <input type="text" name="apartment_name" value={formData.apartment_name} onChange={handleChange} placeholder="e.g. John's Apartments" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
      </div>
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">House Type</label>
        <select name="house_type" value={formData.house_type} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition">
          <option value="">Select type</option>
          <option value="studio">Studio Apartment</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="single_room">Single Room</option>
          <option value="one_bedroom">One Bedroom</option>
          <option value="two_bedroom">Two Bedroom</option>
          <option value="three_bedroom">Three Bedroom</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Githurai 44, Nairobi" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
      </div>
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">Estate</label>
        <input type="text" name="estate" value={formData.estate} onChange={handleChange} placeholder="e.g. Githurai" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
      </div>
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">Price per Month (Ksh)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 8000" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
      </div>
      <div>
        <label className="text-sm text-[#888] mb-1.5 block">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe the house..." className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition resize-none" />
      </div>
      <div>
        <label className="text-sm text-[#888] mb-3 block">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {["water", "electricity", "parking", "security", "wifi"].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
              <input type="checkbox" name={amenity} checked={formData[amenity]} onChange={handleChange} className="accent-[#FF6B35]" />
              {amenity}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState("listings");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [saveCounts, setSaveCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [idPhotoFront, setIdPhotoFront] = useState(null);
  const [idPhotoBack, setIdPhotoBack] = useState(null);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [profileForm, setProfileForm] = useState({ full_name: "", email: "", phone: "", new_password: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [formData, setFormData] = useState({
    title: "", apartment_name: "", house_type: "", location: "", estate: "", price: "", description: "",
    water: false, electricity: false, parking: false, security: false, wifi: false,
  });

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patamtaani_user");
    if (!stored) { router.push("/login"); return; }
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== "landlord") { router.push("/login"); return; }
    // Always fetch fresh user data from DB to reflect any admin changes
    fetchFreshUser(parsedUser.id);
    fetchListings(parsedUser.id);
    fetchSaveCounts(parsedUser.id);
    fetchNotifications(parsedUser.id);
    fetchVerificationStatus(parsedUser.id);
  }, []);

  const fetchFreshUser = async (userId) => {
    try {
      const { data: freshUser } = await supabase
        .from("users")
        .select("id, full_name, email, phone, role, is_verified")
        .eq("id", userId)
        .single();
      if (freshUser) {
        localStorage.setItem("patamtaani_user", JSON.stringify(freshUser));
        setUser(freshUser);
        setProfileForm({
          full_name: freshUser.full_name || "",
          email: freshUser.email || "",
          phone: freshUser.phone || "",
          new_password: "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch fresh user:", err);
      // Fallback to localStorage
      const stored = localStorage.getItem("patamtaani_user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setProfileForm({
          full_name: parsedUser.full_name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          new_password: "",
        });
      }
    }
  };

  const fetchListings = async (landlordId) => {
    setLoadingListings(true);
    try {
      const res = await fetch(`/api/listings/get?landlord_id=${landlordId}`);
      const data = await res.json();
      if (data.success) setListings(data.listings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  const getWhatsappClickCount = () => notifications.filter((n) => n.type === "whatsapp_click").length;

  const fetchSaveCounts = async (landlordId) => {
    try {
      const res = await fetch("/api/listings/save-counts?landlord_id=" + landlordId);
      const data = await res.json();
      if (data.success) setSaveCounts(data.counts);
    } catch (err) {
      console.error("Failed to fetch save counts:", err);
    }
  };

  const fetchNotifications = async (landlordId) => {
    setLoadingNotifications(true);
    try {
      const res = await fetch("/api/notifications/get?landlord_id=" + landlordId);
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchVerificationStatus = async (landlordId) => {
    try {
      const res = await fetch("/api/verification/status?landlord_id=" + landlordId);
      const data = await res.json();
      if (data.success) setVerificationStatus(data.request);
    } catch (err) {
      console.error("Failed to fetch verification status:", err);
    }
  };

  const handleMarkRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landlord_id: user.id }),
      });
      fetchNotifications(user.id);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleSubmitVerification = async () => {
    if (!idPhotoFront || !idPhotoBack) {
      alert("Please upload both the front and back of your ID.");
      return;
    }
    setSubmittingVerification(true);
    try {
      const frontFileName = user.id + "/" + Date.now() + "-front-" + idPhotoFront.name;
      const { error: frontError } = await supabase.storage.from("verification-docs").upload(frontFileName, idPhotoFront);
      if (frontError) throw new Error(frontError.message);
      const { data: frontUrlData } = supabase.storage.from("verification-docs").getPublicUrl(frontFileName);

      const backFileName = user.id + "/" + Date.now() + "-back-" + idPhotoBack.name;
      const { error: backError } = await supabase.storage.from("verification-docs").upload(backFileName, idPhotoBack);
      if (backError) throw new Error(backError.message);
      const { data: backUrlData } = supabase.storage.from("verification-docs").getPublicUrl(backFileName);

      const res = await fetch("/api/verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlord_id: user.id,
          id_photo_url: frontUrlData.publicUrl,
          id_photo_back_url: backUrlData.publicUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit.");
      setShowVerifyForm(false);
      setIdPhotoFront(null);
      setIdPhotoBack(null);
      fetchVerificationStatus(user.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingVerification(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 8) { alert("You can only upload up to 8 photos."); return; }
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const uploadPhotos = async (listingId) => {
    if (photos.length === 0) return [];
    setUploadingPhotos(true);
    const urls = [];
    for (const photo of photos) {
      const fileName = `${listingId}/${Date.now()}-${photo.name}`;
      const { error } = await supabase.storage.from("listing-images").upload(fileName, photo, { cacheControl: "3600", upsert: false });
      if (!error) {
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(fileName);
        urls.push(urlData.publicUrl);
      }
    }
    setUploadingPhotos(false);
    return urls;
  };

  const handleAddListingClick = () => {
    if (!verificationStatus) {
      alert("Please submit your ID first before adding a listing. Click 'Submit ID' to get started.");
      setShowVerifyForm(true);
      return;
    }
    setShowAddForm(true);
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlord_id: user?.id,
          apartment_name: formData.apartment_name,
          house_type: formData.house_type,
          location: formData.location,
          estate: formData.estate,
          price: formData.price,
          description: formData.description,
          amenities: {
            water: formData.water,
            electricity: formData.electricity,
            parking: formData.parking,
            security: formData.security,
            wifi: formData.wifi,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create listing.");

      if (photos.length > 0) {
        const photoUrls = await uploadPhotos(data.listing.id);
        if (photoUrls.length > 0) {
          await fetch("/api/listings/update-photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listing_id: data.listing.id, photos: photoUrls }),
          });
        }
      }

      setSubmitSuccess(true);
      fetchListings(user?.id);
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitSuccess(false);
        setPhotos([]);
        setFormData({ title: "", apartment_name: "", house_type: "", location: "", estate: "", price: "", description: "", water: false, electricity: false, parking: false, security: false, wifi: false });
      }, 2000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch("/api/listings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, landlord_id: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete listing.");
      fetchListings(user?.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditOpen = (listing) => {
    setEditingListing(listing);
    const amenities = typeof listing.amenities === "string" ? JSON.parse(listing.amenities) : listing.amenities || {};
    setFormData({
      title: listing.title || "",
      apartment_name: listing.apartment_name || "",
      house_type: listing.house_type || "",
      location: listing.location || "",
      estate: listing.estate || "",
      price: listing.price || "",
      description: listing.description || "",
      water: amenities.water || false,
      electricity: amenities.electricity || false,
      parking: amenities.parking || false,
      security: amenities.security || false,
      wifi: amenities.wifi || false,
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: editingListing.id,
          landlord_id: user?.id,
          apartment_name: formData.apartment_name,
          house_type: formData.house_type,
          location: formData.location,
          estate: formData.estate,
          price: formData.price,
          description: formData.description,
          amenities: {
            water: formData.water,
            electricity: formData.electricity,
            parking: formData.parking,
            security: formData.security,
            wifi: formData.wifi,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update listing.");
      setSubmitSuccess(true);
      fetchListings(user?.id);
      setTimeout(() => {
        setShowEditForm(false);
        setSubmitSuccess(false);
        setEditingListing(null);
      }, 2000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleProfileChange = (e) => setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

  const handleToggleStatus = async (listingId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/listings/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, landlord_id: user?.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      fetchListings(user?.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all your listings. This cannot be undone.")) return;
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

  const hasSubmittedId = verificationStatus !== null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="dashboard" />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Mambo, {user.full_name?.split(" ")[0]} 👋</h1>
            <p className="text-[#888]">Manage your listings and profile.</p>
          </div>
          <button
            onClick={handleAddListingClick}
            className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            + Add Listing
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Listings", value: listings.length },
            { label: "Active Listings", value: listings.filter(l => l.status === "active").length },
            { label: "Total Views", value: listings.reduce((a, b) => a + (b.views || 0), 0) },
            { label: "Total Saves", value: Object.values(saveCounts).reduce((a, b) => a + b, 0) },
            { label: "WhatsApp Clicks", value: getWhatsappClickCount() },
            { label: "Verified", value: user.is_verified ? "Yes" : "No", highlight: true },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <p className="text-[#888] text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.highlight ? "text-yellow-500" : "text-[#FF6B35]"}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* SINGLE verification banner — only one shows at a time */}
        {user.is_verified ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 mb-8 flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold text-green-400 mb-1">You're Verified!</p>
              <p className="text-sm text-[#888]">Tenants can see your verified badge on all your listings.</p>
            </div>
          </div>
        ) : verificationStatus?.status === "approved" ? (
          <PaymentBanner user={user} />
        ) : verificationStatus?.status === "pending" ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-8 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-yellow-400 mb-1">ID Under Review</p>
              <p className="text-sm text-[#888]">We're reviewing your ID. This usually takes 24-48 hours. You can add listings in the meantime.</p>
            </div>
          </div>
        ) : verificationStatus?.status === "rejected" ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-red-400 mb-1">ID Verification Failed</p>
              <p className="text-sm text-[#888]">Your ID could not be verified. Please resubmit with a clearer photo.</p>
            </div>
            <button onClick={() => setShowVerifyForm(true)} className="bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-400 transition whitespace-nowrap text-sm">Resubmit ID</button>
          </div>
        ) : (
          <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#FF6B35] mb-1">Submit Your ID to Start Listing</p>
              <p className="text-sm text-[#888]">You must submit your National ID or Passport before you can post listings. This helps us keep PataMtaani safe and trustworthy.</p>
            </div>
            <button onClick={() => setShowVerifyForm(true)} className="bg-[#FF6B35] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#E8521A] transition whitespace-nowrap text-sm">Submit ID</button>
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-[#2a2a2a]">
          {["listings", "profile", "notifications"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${activeTab === tab ? "border-[#FF6B35] text-[#FF6B35]" : "border-transparent text-[#888] hover:text-white"}`}>
              {tab === "listings" ? "My Listings" : tab === "profile" ? "My Profile" : "Notifications"}
            </button>
          ))}
        </div>

        {activeTab === "listings" && (
          <div className="space-y-4">
            {!hasSubmittedId ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🪪</div>
                <p className="font-semibold mb-2">Submit your ID first</p>
                <p className="text-[#888] mb-6 text-sm">You need to submit your National ID before you can post listings.</p>
                <button onClick={() => setShowVerifyForm(true)} className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition text-sm">Submit ID Now</button>
              </div>
            ) : loadingListings ? (
              <div className="text-center py-12 text-[#888]">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-[#888]">No listings yet. Add your first listing.</p>
              </div>
            ) : listings.map((listing) => {
              const photos = listing.photos || [];
              const saves = saveCounts[listing.id] || 0;
              return (
                <div key={listing.id} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    </div>
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                    {photos[0] ? <img src={photos[0]} alt="listing" className="w-full h-full object-cover rounded-xl" /> : "🏠"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold mb-1 capitalize text-sm sm:text-base">{listing.apartment_name ? listing.apartment_name + " — " : ""}{listing.house_type?.replace(/_/g, " ")} — {listing.location}</p>
                    <p className="text-[#FF6B35] font-bold mb-2">Ksh {listing.price?.toLocaleString()}/mo</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#888]">
                      <span className={`px-2 py-0.5 rounded-full border ${listing.status === "active" ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>{listing.status}</span>
                      <span>{listing.views || 0} views</span>
                      <span>❤️ {saves} saved</span>
                      {photos.length > 0 && <span>{photos.length} photo{photos.length > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-[#2a2a2a]">
                    <button onClick={() => handleToggleStatus(listing.id, listing.status)} className="flex-1 sm:flex-none bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-4 py-2 rounded-lg hover:border-[#FF6B35] transition text-center">
                      {listing.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleEditOpen(listing)} className="flex-1 sm:flex-none bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-4 py-2 rounded-lg hover:border-[#FF6B35] transition text-center">Edit</button>
                    <button onClick={() => handleDelete(listing.id)} className="flex-1 sm:flex-none bg-[#1a1a1a] border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition text-center">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-md">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Full Name</label>
                <input type="text" name="full_name" value={profileForm.full_name} onChange={handleProfileChange} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Email Address</label>
                <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Phone Number</label>
                <input type="tel" name="phone" value={profileForm.phone} onChange={handleProfileChange} maxLength={12} onKeyPress={(e) => { if (!/[0-9+]/.test(e.key)) e.preventDefault(); }} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">New Password</label>
                <input type="password" name="new_password" value={profileForm.new_password} onChange={handleProfileChange} placeholder="Leave blank to keep current password" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition" />
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

        {activeTab === "notifications" && (
          <div>
            {notifications.some(n => !n.is_read) && (
              <div className="flex justify-end mb-4">
                <button onClick={handleMarkRead} className="text-sm text-[#FF6B35] hover:underline">Mark all as read</button>
              </div>
            )}
            {loadingNotifications ? (
              <div className="text-center py-12 text-[#888]">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-[#888]">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((note) => {
                  const icons = { view: "👁️", save: "❤️", milestone: "🎉", whatsapp_click: "💬", verification: "✅", payment_failed: "❌" };
                  return (
                    <div key={note.id} className={"bg-[#111111] border rounded-xl p-4 flex items-start gap-3 " + (note.is_read ? "border-[#2a2a2a]" : "border-[#FF6B35]/30")}>
                      <div className="text-lg shrink-0">{icons[note.type] || "🔔"}</div>
                      <div className="flex-1">
                        <p className="text-sm text-[#f5f0eb]">{note.message}</p>
                        <p className="text-xs text-[#888] mt-1">{new Date(note.created_at).toLocaleString()}</p>
                      </div>
                      {!note.is_read && <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-1.5 shrink-0"></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Listing</h2>
              <button onClick={() => { setShowAddForm(false); setPhotos([]); }} className="text-[#888] hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <FormFields formData={formData} handleChange={handleChange} />
              <div>
                <label className="text-sm text-[#888] mb-1.5 block">Photos ({photos.length}/8)</label>
                <label className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#FF6B35] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
                  <span className="text-2xl mb-2">📷</span>
                  <span className="text-sm text-[#888]">Click to add photos (max 8)</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                </label>
                {photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(photo)} alt="" className="w-full h-16 object-cover rounded-lg" />
                        <button onClick={() => removePhoto(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {submitError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{submitError}</div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddForm(false); setPhotos([]); }} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-3 rounded-xl hover:border-[#FF6B35] transition">Cancel</button>
                <button onClick={handleSubmitListing} disabled={submitting || uploadingPhotos} className="flex-1 bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {uploadingPhotos ? "Uploading photos..." : submitting ? "Submitting..." : submitSuccess ? "✓ Listed!" : "Submit Listing"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditForm && editingListing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Listing</h2>
              <button onClick={() => { setShowEditForm(false); setEditingListing(null); }} className="text-[#888] hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <FormFields formData={formData} handleChange={handleChange} />
              {submitError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{submitError}</div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowEditForm(false); setEditingListing(null); }} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-3 rounded-xl hover:border-[#FF6B35] transition">Cancel</button>
                <button onClick={handleEditSubmit} disabled={submitting} className="flex-1 bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {submitting ? "Saving..." : submitSuccess ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVerifyForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Submit Your ID</h2>
              <button onClick={() => setShowVerifyForm(false)} className="text-[#888] hover:text-white text-xl">✕</button>
            </div>
            <p className="text-sm text-[#888] mb-4">Upload a clear photo of your National ID or Passport. The name on your account ({user.full_name}) must match the name on your ID. This is required before you can post listings.</p>
            <label className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#FF6B35] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition mb-3">
              <span className="text-2xl mb-2">🪪</span>
              <span className="text-sm text-[#888]">{idPhotoFront ? idPhotoFront.name : "Click to upload FRONT of ID"}</span>
              <input type="file" accept="image/*" onChange={(e) => setIdPhotoFront(e.target.files[0])} className="hidden" />
            </label>
            <label className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#FF6B35] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition mb-4">
              <span className="text-2xl mb-2">🪪</span>
              <span className="text-sm text-[#888]">{idPhotoBack ? idPhotoBack.name : "Click to upload BACK of ID"}</span>
              <input type="file" accept="image/*" onChange={(e) => setIdPhotoBack(e.target.files[0])} className="hidden" />
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowVerifyForm(false)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white py-3 rounded-xl hover:border-[#FF6B35] transition">Cancel</button>
              <button onClick={handleSubmitVerification} disabled={submittingVerification} className="flex-1 bg-[#FF6B35] hover:bg-[#E8521A] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                {submittingVerification ? "Submitting..." : "Submit ID"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}