import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="text-2xl font-black mb-12">
        <span className="text-white">Pata</span>
        <span className="text-[#FF6B35]">Mtaani</span>
      </Link>
      <p className="text-8xl font-black text-[#FF6B35] mb-4">404</p>
      <h1 className="text-2xl font-bold mb-3">Looks like this page got lost in the hood.</h1>
      <p className="text-[#888] mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link href="/" className="bg-[#FF6B35] hover:bg-[#E8521A] text-white font-semibold px-6 py-3 rounded-xl transition">Go Home</Link>
        <Link href="/listings" className="bg-[#111111] border border-[#2a2a2a] hover:border-[#FF6B35] text-white font-medium px-6 py-3 rounded-xl transition">Browse Listings</Link>
      </div>
    </main>
  );
}