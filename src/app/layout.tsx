import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SettingsModal from "@/components/modals/SettingsModal";
import { Toaster } from "@/components/ui/sonner";
import { themeScript } from "@/lib/theme-script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkUserSyncProvider } from "@/components/providers/ClerkUserSyncProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Cinetron — Cinema Discovery & AI Companion",
    template: "%s | Cinetron",
  },
  description:
    "Discover movies and television series with editorial curation, AI-powered mood recommendations, watchlists, and interactive cinema games.",
  keywords: [
    "movies",
    "cinema",
    "tv shows",
    "film database",
    "movie recommendations",
    "AI movie discovery",
    "watchlist",
    "trailers",
  ],
  authors: [{ name: "Ameer Hasan" }],
  creator: "Cinetron",
  publisher: "Cinetron",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Cinetron",
    title: "Cinetron — Cinema Discovery & AI Companion",
    description:
      "Discover movies and television series with editorial curation, AI-powered recommendations, and personalized watchlists.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinetron — Cinema Discovery & AI Companion",
    description:
      "Discover movies and television series with editorial curation and AI-powered recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <meta name="application-name" content="Cinetron" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <ClerkProvider>
          <ClerkUserSyncProvider>
            <Providers>
              <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
                <Navbar />
                <SettingsModal />
                <Toaster />
                <main className="relative z-10 flex-1 w-full">{children}</main>
                <Footer />
                <SpeedInsights />
              </div>
            </Providers>
          </ClerkUserSyncProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
