import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://patamtaani.co.ke"),
  title: {
    default: "PataMtaani — Find Affordable Rentals in Nairobi Neighborhoods",
    template: "%s | PataMtaani",
  },
  description: "Kenya's hyperlocal rental marketplace. Find bedsitters, single rooms, and affordable apartments listed by real landlords in Githurai, Umoja, Kitengela, Kabiria, and more. No agents, no hassle.",
  keywords: [
    "rentals in Nairobi",
    "bedsitter Nairobi",
    "single room Nairobi",
    "affordable apartments Kenya",
    "houses to rent Githurai",
    "houses to rent Umoja",
    "houses to rent Kitengela",
    "PataMtaani",
    "Kenya rental marketplace",
    "landlord Kenya",
    "rent house Nairobi",
  ],
  authors: [{ name: "PataMtaani", url: "https://patamtaani.co.ke" }],
  creator: "PataMtaani",
  publisher: "PataMtaani",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://patamtaani.co.ke",
    siteName: "PataMtaani",
    title: "PataMtaani — Find Affordable Rentals in Nairobi Neighborhoods",
    description: "Kenya's hyperlocal rental marketplace. Find bedsitters, single rooms, and affordable apartments listed by real landlords. No agents, no hassle.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "PataMtaani — Kenya Rental Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PataMtaani — Find Affordable Rentals in Nairobi",
    description: "Kenya's hyperlocal rental marketplace. Find bedsitters, single rooms, and affordable apartments near you.",
    images: ["/icon.png"],
    creator: "@PataMtaaniKE",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://patamtaani.co.ke",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="geo.region" content="KE-110" />
        <meta name="geo.placename" content="Nairobi, Kenya" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}