import type { Metadata } from 'next';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about GetYourYT, the free YouTube video downloader. Discover how it works, our mission, and our commitment to privacy and quality.',
  alternates: {
    canonical: 'https://getyouryt.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#DC2626]">GetYour</span>
              <span className="text-foreground">YT</span>
            </span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">About GetYourYT</h1>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">What is GetYourYT?</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is a free, fast, and reliable online tool that allows anyone to download YouTube videos in HD quality. We built this service because we believe people should have a simple way to save the YouTube content they love for personal use, offline viewing, or creative projects. Unlike many other downloaders that are cluttered with intrusive ads, require account registration, or impose artificial download limits, GetYourYT was designed from the ground up to be clean, straightforward, and genuinely free. You simply paste a YouTube video link, and within seconds you get access to all available quality options, from standard definition all the way up to full HD and beyond. No sign-up forms, no hidden paywalls, and no confusing multi-step processes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed">
                The process is remarkably simple and takes just a few seconds. First, find a YouTube video you want to download and copy its share link. This can be any publicly available YouTube video, and our service supports all common URL formats including the standard youtube.com video links, short youtu.be links, and embedded video links. Next, paste the copied link into the input field on our homepage and click the Download button. Our system will instantly analyze the video and present you with all available download options. You will see each quality level available, from 360p up to 1080p or higher, along with information about the codec, bitrate, and estimated file size. Choose your preferred quality, and the download will begin immediately. The entire process typically takes less than five seconds from start to finish.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to provide the most accessible, reliable, and user-friendly YouTube video downloading experience on the web. We believe that useful tools should not be hidden behind paywalls or require users to jump through hoops. YouTube has become one of the world&apos;s most popular platforms for creative expression, and we think people should be able to save the content that matters to them without hassle. We are committed to maintaining GetYourYT as a completely free service with no hidden costs, no premium tiers, and no artificial limitations on the number of downloads. Every feature we build is designed with the user experience first, ensuring that our tool remains the fastest and easiest way to download YouTube videos in HD quality. We also take pride in offering detailed quality information so users can make informed choices about which version of a video to save.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Why People Use GetYourYT</h2>
              <p className="text-muted-foreground leading-relaxed">
                There are many reasons people choose GetYourYT over other YouTube downloaders. Content creators use it to save their own videos for backup purposes or to repurpose content across different platforms. Educators and researchers download YouTube videos to use as examples in presentations, academic papers, or classroom discussions. Casual users simply want to save funny, inspiring, or informative videos to watch later when they are offline. Travelers download videos to access content without using mobile data. Parents save videos to share with their children in a controlled environment. What sets GetYourYT apart is our commitment to providing every available quality option with full technical details, our clean and ad-reasonable interface, and our consistent reliability. Users also appreciate that we do not require any personal information or account creation, making the process as frictionless as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Technology Behind It</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is built on modern web technologies to ensure speed, reliability, and security. Our backend leverages YouTube&apos;s public API endpoints to retrieve video metadata and generate download links, all processed in real-time with no caching of user data. The frontend is built with Next.js and React, providing a fast, responsive, and accessible user interface that works seamlessly across all devices and browsers. We use server-side rendering and edge caching where appropriate to deliver near-instant page loads. Our infrastructure is designed for high availability, with redundant systems that ensure the service remains operational even during traffic spikes. We also implement security best practices including encrypted connections, input validation, and rate limiting to protect both our users and our systems. The entire architecture is optimized for minimal latency, ensuring that your downloads start as quickly as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Commitment to Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Privacy is not an afterthought at GetYourYT; it is a fundamental design principle. We do not require user accounts, which means we never collect names, email addresses, or any other personal information during the core download process. The YouTube URLs you submit are processed in real-time and are never stored in any persistent database. We do not track which videos you download, and we do not build profiles of user behavior. Our use of analytics is limited to anonymous, aggregated data that helps us improve service performance and reliability. We use advertising to support the free nature of our service, but we work to ensure that ads are reasonable and non-intrusive. For full details about our data practices, please review our Privacy Policy. We believe that a free service does not have to come at the cost of your privacy.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} GetYourYT. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/dmca" className="hover:text-foreground transition-colors">DMCA</a>
              <a href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
