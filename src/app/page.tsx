'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YouTubeInput } from '@/components/youtube/YouTubeInput';
import { YouTubeResultCard } from '@/components/youtube/YouTubeResultCard';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertCircle,
  X,
  Moon,
  Sun,
  Menu,
  Zap,
  Shield,
  Heart,
  Mail,
  LinkIcon,
  ClipboardPaste,
  CheckCircle,
  Music,
  MonitorSmartphone,
  UserX,
  Headphones,
  Film,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { YouTubeVideoInfo } from '@/lib/youtube/types';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'FAQ', href: '#faq' },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '1',
    icon: LinkIcon,
    title: 'Copy the YouTube Video URL',
    description:
      'Open YouTube and find the video you want to download. Copy the video link from the share button or the address bar.',
  },
  {
    step: '2',
    icon: ClipboardPaste,
    title: 'Paste the Link & Click Download',
    description:
      'Paste the YouTube video URL into the input field above and click the Download button to analyze the video.',
  },
  {
    step: '3',
    icon: CheckCircle,
    title: 'Choose Quality & Save the Video',
    description:
      'Select your preferred quality (1080p, 720p, 480p, 360p) and click MP4 to download. Audio-only (MP3) is also available.',
  },
];

const FEATURES = [
  {
    icon: Film,
    title: 'HD Quality Downloads',
    description:
      'Download YouTube videos in all available qualities — 1080p, 720p, 480p, 360p, and more. Get the best resolution for any device.',
    color: '#DC2626',
  },
  {
    icon: UserX,
    title: 'No Registration',
    description:
      'No sign-up, no account needed. Just paste your link and start downloading immediately — completely free.',
    color: '#2563EB',
  },
  {
    icon: MonitorSmartphone,
    title: 'Works on All Devices',
    description:
      'Compatible with desktop, tablet, and mobile. Download YouTube videos from any device, any browser.',
    color: '#7C3AED',
  },
  {
    icon: Zap,
    title: 'Fast Download',
    description:
      'Lightning-fast video extraction and download. 360p and audio formats are available instantly with direct links.',
    color: '#EF4444',
  },
  {
    icon: Headphones,
    title: 'Audio / MP3 Download',
    description:
      'Extract audio from any YouTube video. Download the music or sound as an MP3 file in 48kbps, 128kbps, or 256kbps.',
    color: '#A855F7',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description:
      "We don't store your data or downloaded videos. Your privacy and security are our top priority.",
    color: '#0EA5E9',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How to download YouTube videos?',
    answer:
      'Simply copy the YouTube video URL from the address bar or share button, paste it in the input field above, and click Download. Choose your preferred quality (1080p, 720p, etc.) and the video will be saved to your device.',
  },
  {
    question: 'What video qualities are available?',
    answer:
      'We support all qualities provided by YouTube including 1080P, 720P, 480P, 360P, 240P, and 144P. Audio-only formats are also available in MP3 at 48kbps, 128kbps, and 256kbps. The available qualities depend on the original video upload.',
  },
  {
    question: 'Can I download just the audio from a YouTube video?',
    answer:
      'Yes! When a video is analyzed, you will see audio-only formats in the Audio section. Click the MP3 button to download just the audio track in your preferred bitrate (48kbps, 128kbps, or 256kbps).',
  },
  {
    question: 'Why do 1080P/720P videos need a separate resolve step?',
    answer:
      'YouTube stores HD video (1080P, 720P) and audio as separate streams. Our system needs to process the request through our servers to generate a download link, which takes a few extra seconds. Lower qualities (360P) and audio formats have direct links available instantly.',
  },
  {
    question: 'Can I download private or age-restricted YouTube videos?',
    answer:
      'No, our tool can only download publicly available YouTube videos. Private, unlisted, or age-restricted videos cannot be accessed or downloaded.',
  },
  {
    question: 'Is it free to use?',
    answer:
      'Yes, this tool is completely free to use. There are no hidden charges, premium plans, or download limits. You can download as many videos as you want.',
  },
  {
    question: 'Which YouTube URL formats are supported?',
    answer:
      'We support all common YouTube URL formats including youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/..., youtube.com/embed/..., and youtube.com/live/... links.',
  },
  {
    question: 'Does this work on iPhone and Android?',
    answer:
      'Yes! This tool works on all devices and browsers. On mobile, simply copy the YouTube link from the app, open our website in your browser, paste the link, and download.',
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<YouTubeVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleFetchInfo = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      setVideoData(null);

      try {
        const response = await fetch('/api/youtube/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          setVideoData(data.data);
          toast({
            title: 'Video Found',
            description: `"${data.data.title}" is ready to download`,
          });
        } else {
          setError(
            data.error ||
              'Failed to fetch video info. Please try again.'
          );
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch video info',
            variant: 'destructive',
          });
        }
      } catch {
        setError(
          'Network error. Please check your connection and try again.'
        );
        toast({
          title: 'Network Error',
          description: 'Could not connect to the server',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    setVideoData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-red-600">GetYour</span>
              <span className="text-foreground">YT</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "GetYourYT",
                "url": "https://getyouryt.com",
                "description": "Free YouTube video downloader. Download YouTube videos in HD quality — 1080p, 720p, 480p, MP3.",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "15200"
                }
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": FAQ_ITEMS.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              }),
            }}
          />

          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/5 dark:from-red-600/10 dark:to-red-500/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  YouTube Video
                  <span className="text-red-600"> Downloader</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Download YouTube Videos in HD — All Qualities — MP4 & MP3 — Free
                </p>
              </motion.div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <YouTubeInput
                  onFetch={handleFetchInfo}
                  isLoading={isLoading}
                />
              </motion.div>

              {/* Supported formats */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Supports{' '}
                <span className="font-medium text-foreground/70">
                  youtube.com/watch?v=
                </span>
                ,{' '}
                <span className="font-medium text-foreground/70">
                  youtu.be/
                </span>
                ,{' '}
                <span className="font-medium text-foreground/70">
                  youtube.com/shorts/
                </span>
                ,{' '}
                <span className="font-medium text-foreground/70">
                  youtube.com/live/
                </span>
              </motion.p>
            </div>
          </div>
        </section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 pb-4"
            >
              <div className="max-w-3xl mx-auto">
                <Alert
                  variant="destructive"
                  className="border-red-500/20 bg-red-500/5"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Result */}
        <AnimatePresence>
          {videoData && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              className="container mx-auto px-4 pb-16"
            >
              <div className="max-w-4xl mx-auto">
                <YouTubeResultCard
                  video={videoData}
                  onReset={handleReset}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="container mx-auto px-4 py-16 bg-muted/30"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                How to Download YouTube Videos
              </h2>
            </motion.div>
            <div className="space-y-8">
              {HOW_IT_WORKS_STEPS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i }}
                    className="flex items-start gap-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-lg shadow-red-600/20">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-semibold">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                Why Choose GetYourYT?
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i }}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-600/5 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="container mx-auto px-4 py-16 bg-muted/30"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                  <Film className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-red-600">GetYour</span>
                  <span>YT</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The fastest free YouTube video downloader. Download YouTube videos in HD quality instantly.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    YouTube Video Downloader
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Download HD Videos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    YouTube MP4 Download
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/dmca"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    DMCA
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@getyouryt.com"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-3 w-3" /> support@getyouryt.com
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} GetYourYT. All rights reserved. Not affiliated with YouTube or Google.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with{' '}
              <Heart className="h-3 w-3 text-red-600 fill-red-600" />{' '}
              for the community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
