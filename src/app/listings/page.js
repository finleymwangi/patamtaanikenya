"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Browse Rentals in Nairobi | PataMtaani",
  description: "Search affordable bedsitters, single rooms, and apartments for rent across Nairobi neighborhoods. Filter by estate, price, and house type.",
};

export default function Listings() {
  const [search, setSearch] = useState("");
  const [houseType, setHouseType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (houseType) params.append("house_type", houseType);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (verifiedOnly) params.append("verified_only", "true");
      const res = await fetch(`/api/listings/get?${params.toString()}`);
      const data = await res.json();
      if (data.success) setListings(data.listings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const sorted = [...listings].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar active="listings" />

      <div className="px-6 py-6 border-b border-[#2a2a2a] bg-[#111111]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchListings()}
            placeholder="Search by estate e.g. Githurai, Umoja, Kitengela..."
            className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-5 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition"
          />
          <button onClick={fetchListings} className="bg-[#FF6B35] hover:bg-[#E8521A] text-white px-6 py-3 rounded-xl transition text-sm font-medium">
            Search
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className="bg-[#1a1a1a] border border-[#2a2a2a] text-white px-6 py-3 rounded-xl hover:border-[#FF6B35] transition text-sm font-medium">
            {showFilters ? "Hide Filters" : "Filters"} ⚙️
          </button>
        </div>

        {showFilters && (
          <div className="max-w-6xl mx-auto mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select value={houseType} onChange={(e) => setHouseType(e.target.value)} className="bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-sm">
              <option value="">All Types</option>
              <option value="studio">Studio Apartment</option>
              <option value="bedsitter">Bedsitter</option>
              <option value="single_room">Single Room</option>
              <option value="double_room">Double Room</option>
              <option value="one_bedroom">One Bedroom</option>
              <option value="two_bedroom">Two Bedroom</option>
              <option value="three_bedroom">Three Bedroom</option>
            </select>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price (Ksh)" className="bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-sm" />
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price (Ksh)" className="bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#888] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-sm" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0a0a0a] border border-[#2a2a2a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B35] transition text-sm">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="flex items-center gap-2 col-span-2 md:col-span-4">
              <input type="checkbox" id="verified" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-[#FF6B35]" />
              <label htmlFor="verified" className="text-sm text-[#888]">Show verified listings only</label>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-8 max-w-6xl mx-auto">
        <p className="text-sm text-[#888] mb-6">
          <span className="text-white font-semibold">{sorted.length}</span> listings found
          {search && <span> in <span className="text-[#FF6B35]">{search}</span></span>}
        </p>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-pulse">🏠</div>
            <p className="text-[#888]">Loading listings...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">No listings found</h2>
            <p className="text-[#888]">Try a different estate or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((listing) => {
              const photos = Array.isArray(listing.photos) ? listing.photos : [];
              return (
                <Link href={`/listings/${listing.id}`} key={listing.id}>
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition cursor-pointer group h-full">
                    <div className="h-48 bg-[#1a1a1a] group-hover:bg-[#1e1e1e] transition overflow-hidden">
                      {photos[0] ? (
                        <img src={photos[0]} alt={listing.location} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] px-2 py-1 rounded-full capitalize">
                          {listing.house_type?.replace(/_/g, " ")}
                        </span>
                        {listing.is_verified && (
                          <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{listing.location}</h3>
                      <p className="text-sm text-[#888] mb-3 line-clamp-2">{listing.description}</p>
                      <p className="text-[#FF6B35] font-bold text-lg">Ksh {listing.price?.toLocaleString()}/mo</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a] mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black">
            <span className="text-white">Pata</span>
            <span className="text-[#FF6B35]">Mtaani</span>
          </span>
          <div className="flex items-center gap-6 text-sm text-[#888]">
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