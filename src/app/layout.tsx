import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YouTube Video Downloader - Download YouTube Videos in HD | 1080p, 720p, MP4, MP3",
    template: "%s | GetYourYT",
  },
  description:
    "Download YouTube videos in HD quality for free. Save videos in 1080p, 720p, 480p, MP4 format. Extract audio as MP3. Works on all devices.",
  keywords: [
    "youtube video downloader",
    "download youtube videos",
    "youtube downloader",
    "youtube hd download",
    "youtube mp4 download",
    "save youtube video",
    "get your yt",
    "getyouryt",
    "youtube video saver",
    "youtube 1080p download",
    "youtube video download online",
    "free youtube downloader",
    "youtube audio download",
    "youtube mp3 download",
    "youtube music download",
    "youtube shorts download",
  ],
  authors: [{ name: "GetYourYT" }],
  creator: "GetYourYT",
  publisher: "GetYourYT",
  robots: "index, follow",
  metadataBase: new URL("https://getyouryt.com"),
  alternates: {
    canonical: "https://getyouryt.com",
  },
  openGraph: {
    title: "YouTube Video Downloader - Download YouTube Videos in HD | 1080p, 720p, MP4, MP3",
    description:
      "Download YouTube videos in HD quality for free. No signup required.",
    type: "website",
    locale: "en_US",
    url: "https://getyouryt.com",
    siteName: "GetYourYT",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "GetYourYT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader - Download YouTube Videos in HD | 1080p, 720p, MP4, MP3",
    description:
      "Download YouTube videos in HD quality for free.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  category: "utilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
