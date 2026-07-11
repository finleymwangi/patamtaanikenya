"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ active }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patamtaani_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patamtaani_user");
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#0a0a0a] z-50">
        <Link href="/" className="text-xl font-black">
          <span className="text-white">Pata</span>
          <span className="text-[#FF6B35]">Mtaani</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={active === link.label.toLowerCase() ? "text-white font-medium" : "text-[#888] hover:text-white transition"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user && (
            <>
              <Link href="/login" className="text-sm text-[#888] hover:text-white transition">Log In</Link>
              <Link href="/signup" className="bg-[#FF6B35] text-white text-sm px-4 py-2 rounded-full hover:bg-[#E8521A] transition font-medium">
                Post a Listing
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                href={user.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant"}
                className="text-sm text-[#888] hover:text-white transition"
              >
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#FF6B35] text-white text-sm px-4 py-2 rounded-full hover:bg-[#E8521A] transition font-medium"
              >
                Log Out
              </button>
            </>
          )}
        </div>

        {/* Mobile: right side */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <button
              onClick={handleLogout}
              className="bg-[#FF6B35] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#E8521A] transition font-medium"
            >
              Log Out
            </button>
          )}
          {!user && (
            <Link href="/signup" className="bg-[#FF6B35] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#E8521A] transition font-medium">
              Post a Listing
            </Link>
          )}
          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#1a1a1a] transition"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute top-0 right-0 h-full w-72 bg-[#111111] border-l border-[#2a2a2a] p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-xl font-black" onClick={() => setMenuOpen(false)}>
                <span className="text-white">Pata</span>
                <span className="text-[#FF6B35]">Mtaani</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="text-[#888] hover:text-white text-2xl">✕</button>
            </div>

            {user && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6">
                <p className="text-xs text-[#888] mb-1">Logged in as</p>
                <p className="font-semibold text-sm">{user.full_name}</p>
                <p className="text-xs text-[#FF6B35] capitalize">{user.role}</p>
              </div>
            )}

            <div className="space-y-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm transition ${
                    active === link.label.toLowerCase()
                      ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
                      : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <Link
                  href={user.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant"}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] transition"
                >
                  My Dashboard
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-[#2a2a2a] space-y-3">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded-xl hover:border-[#FF6B35] transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-[#FF6B35] hover:bg-[#E8521A] text-white text-sm px-4 py-3 rounded-xl transition font-medium"
                  >
                    Post a Listing
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-center bg-[#FF6B35] hover:bg-[#E8521A] text-white text-sm px-4 py-3 rounded-xl transition font-medium"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}