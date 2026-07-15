import type { Metadata } from 'next';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the GetYourYT Privacy Policy to understand how we collect, use, and protect your information when you use our free YouTube video downloader.',
  alternates: {
    canonical: 'https://getyouryt.com/privacy',
  },
};

export default function PrivacyPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: March 4, 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is designed with privacy as a core principle. When you use our service to download YouTube videos, we collect the absolute minimum amount of data necessary to provide the functionality you request. Specifically, we temporarily process the YouTube video URL you submit in order to retrieve video information and generate download links. These URLs are not stored in any permanent database and are purged from server memory as soon as the download process completes. We also collect anonymous usage statistics such as the total number of downloads processed, general geographic regions of our users (country-level only), and aggregate performance metrics. This statistical data contains no personally identifiable information and cannot be traced back to any individual user or specific video download.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                The limited information we process is used exclusively to deliver and improve the GetYourYT service. When you submit a YouTube video URL, that URL is used solely to fetch the video information you requested and to generate the appropriate download links. We do not build user profiles, we do not track individual browsing behavior across sessions, and we do not create any form of user database. Anonymous usage statistics are used to monitor service health, plan capacity improvements, and understand general usage patterns so we can make GetYourYT better for everyone. We will never sell, rent, trade, or otherwise share any information with third parties for marketing or advertising purposes. Our use of data is strictly limited to operational necessities and service improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">3. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT may use third-party services that operate independently and have their own privacy policies. Google AdSense is used to display advertisements on our website. Google and its partners may use cookies and similar technologies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google Ads Settings. We may also use analytics services such as Google Analytics to help us understand how visitors interact with our website. These services may collect information such as your IP address, browser type, pages visited, and time spent on the site. This data is aggregated and anonymized, meaning it cannot be used to identify you personally. We encourage you to review the privacy policies of these third-party services to understand their data practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">4. Cookies Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website uses cookies and similar tracking technologies to enhance your experience and support essential functionality. Essential cookies are used to maintain your session and remember your preferences, such as your selected theme (light or dark mode). These cookies are necessary for the website to function properly and cannot be disabled. Additionally, third-party advertising partners such as Google AdSense may set their own cookies to deliver relevant advertisements and track ad performance. You can control cookie preferences through your browser settings. Most browsers allow you to block or delete cookies, and you can also opt out of personalized advertising through industry opt-out tools. Please note that disabling certain cookies may affect the functionality or appearance of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not retain any personal data or YouTube video URLs beyond what is necessary to fulfill your immediate request. Video URLs submitted to our service are processed in real-time and are not stored in any persistent storage system. Once your download is complete, the URL and associated video metadata are automatically purged from our servers. Anonymous aggregate statistics, such as total download counts and performance metrics, are retained indefinitely for operational purposes, but these statistics contain no personally identifiable information. Server access logs, which may contain IP addresses, are retained for a maximum of 30 days and are used solely for security monitoring and debugging purposes. After this retention period, logs are permanently deleted.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">6. Children&apos;s Privacy (COPPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is not directed at children under the age of 13, and we do not knowingly collect personal information from children. In compliance with the Children&apos;s Online Privacy Protection Act (COPPA) and other applicable regulations, we do not intentionally gather data from minors. If we become aware that a child under 13 has provided us with personal information, we will take immediate steps to delete such information from our systems. Parents or guardians who believe their child has interacted with our service and may have provided personal information are encouraged to contact us at privacy@getyouryt.com so we can promptly address the situation. We recommend that parents and guardians supervise their children&apos;s internet usage and discuss safe online practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your jurisdiction, you may have certain rights regarding your personal data. These may include the right to access, correct, or delete personal information we hold about you; the right to restrict or object to the processing of your data; the right to data portability; and the right to withdraw consent at any time where processing is based on consent. If you are a resident of the European Union, you have the right to lodge a complaint with a supervisory authority. If you are a resident of California, you have rights under the California Consumer Privacy Act (CCPA). Because we collect minimal data and do not maintain user accounts, most of these rights are automatically satisfied by our data handling practices. However, if you have any questions or wish to exercise any of these rights, please contact us at privacy@getyouryt.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please do not hesitate to reach out. We are committed to transparency and will respond to all privacy-related inquiries promptly. You can contact our privacy team by email at privacy@getyouryt.com. We aim to respond to all inquiries within 30 business days. For general support questions, you may also reach us at support@getyouryt.com. We may update this Privacy Policy from time to time to reflect changes in our practices or applicable regulations. Any updates will be posted on this page with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
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
