import type { Metadata } from 'next';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the GetYourYT Terms of Service to understand the rules and guidelines for using our free YouTube video downloader.',
  alternates: {
    canonical: 'https://getyouryt.com/terms',
  },
};

export default function TermsPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: March 4, 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the GetYourYT website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service. These terms apply to all visitors, users, and others who access or use GetYourYT. Your continued use of the service following the posting of any changes to these terms constitutes acceptance of those changes. We recommend that you review these terms periodically to stay informed of any updates. If you have any questions about these terms, please contact us at legal@getyouryt.com before using the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is a free online tool that allows users to download publicly available YouTube videos. Our service processes YouTube video URLs that you provide and retrieves video information including available quality options and download links. The service is provided as-is and is intended for personal, non-commercial use. We do not host, store, or distribute any YouTube videos. We act as a technical intermediary that facilitates the download of content that is already publicly accessible on YouTube. The service supports various YouTube URL formats including standard video links, short links, and share links. We make no guarantees about the availability, speed, or quality of downloads, as these factors depend on YouTube&apos;s infrastructure and the original video upload quality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">
                As a user of GetYourYT, you bear full responsibility for ensuring that your use of downloaded content complies with all applicable laws, regulations, and third-party rights. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the service. You are solely responsible for obtaining any permissions or licenses required for the use of downloaded content. Before downloading and using any YouTube video, you should consider the intellectual property rights of the original content creator and ensure your use falls within legal boundaries, such as fair use or with explicit permission from the rights holder. You must not use the service to download content for commercial redistribution without proper authorization.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">4. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are strictly prohibited from using GetYourYT for any of the following purposes: downloading copyrighted content for commercial redistribution without authorization; using automated scripts, bots, or scraping tools to access the service in a manner that exceeds reasonable usage limits; attempting to reverse engineer, decompile, or otherwise interfere with the technical workings of our service; using the service to download private or restricted YouTube videos that are not publicly accessible; distributing downloaded content in a way that violates the original creator&apos;s rights or YouTube&apos;s terms of service; using the service for any illegal, harmful, fraudulent, or deceptive activity; attempting to gain unauthorized access to our systems or infrastructure; and reselling or sublicensing access to the service. Violation of these prohibitions may result in immediate termination of your access to the service and may expose you to legal liability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content downloaded through GetYourYT remains the intellectual property of its respective owners, typically the original YouTube content creators. GetYourYT does not claim ownership of, nor does it grant any intellectual property rights in, the videos downloaded through our service. The GetYourYT name, logo, website design, and all associated visual elements are the intellectual property of GetYourYT and are protected by applicable intellectual property laws. You may not use our trademarks, logos, or branding without our express written permission. YouTube and the YouTube logo are trademarks of Google LLC. GetYourYT is not affiliated with, endorsed by, or connected to YouTube or Google in any way. Any references to YouTube are made solely for the purpose of describing the functionality of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by applicable law, GetYourYT and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service. This includes, but is not limited to, damages for loss of profits, data, goodwill, or other intangible losses resulting from your access to or use of (or inability to access or use) the service; any conduct or content of any third party on the service; any content obtained from the service; and unauthorized access, use, or alteration of your transmissions or content. In no event shall our total liability to you for all claims arising out of or relating to the use of the service exceed the amount paid by you to GetYourYT during the preceding twelve months, which, given that our service is free, shall be zero dollars.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without any warranties of any kind, whether express or implied. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, timely, secure, or error-free. We do not warrant that the results obtained from the use of the service will be accurate, reliable, or complete. We do not guarantee that any specific video will be available for download, as availability depends on factors beyond our control, including YouTube&apos;s policies and infrastructure. Any reliance on the service is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. If a revision is material, we will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect by posting the updated terms on our website. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the service. We encourage you to review these terms periodically for any changes. Changes to these terms are effective when they are posted on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from or relating to these terms or your use of the service shall be resolved through good-faith negotiation, and if negotiation fails, through binding arbitration in accordance with applicable arbitration rules. You agree to waive any right to a jury trial or to participate in a class action lawsuit. Any claims or disputes must be brought within one year from the date the cause of action arose. If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining terms remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us. We value transparency and are happy to clarify any aspect of these terms. You can reach our legal team by email at legal@getyouryt.com. For general support inquiries, please contact support@getyouryt.com. For copyright-related matters, please refer to our DMCA page or contact copyright@getyouryt.com. We aim to respond to all inquiries within a reasonable timeframe. These Terms of Service constitute the entire agreement between you and GetYourYT regarding the use of our service and supersede any prior agreements or understandings.
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
