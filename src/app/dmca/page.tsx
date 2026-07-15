import type { Metadata } from 'next';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA / Copyright Policy',
  description:
    'Learn about the GetYourYT DMCA and copyright policy, including how to file a DMCA takedown notice and counter-notification procedure.',
  alternates: {
    canonical: 'https://getyouryt.com/dmca',
  },
};

export default function DmcaPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">DMCA / Copyright Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: March 4, 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Copyright Infringement Notification Procedure</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (DMCA), we will respond expeditiously to claims of copyright infringement committed using our service. If you are a copyright owner, or are authorized to act on behalf of one, and you believe that your copyrighted work has been copied in a way that constitutes copyright infringement that is accessible through the GetYourYT service, you may submit a written notification of claimed infringement to our designated copyright agent. Upon receipt of a valid and complete notice, we will take appropriate action, which may include removing or disabling access to the allegedly infringing material. We take all credible claims of copyright infringement seriously and will act promptly to address valid notices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">How to File a DMCA Notice</h2>
              <p className="text-muted-foreground leading-relaxed">
                To file a DMCA takedown notice with GetYourYT, you must provide a written communication that includes all of the following elements. Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages. Accordingly, if you are not sure whether the material infringes your copyrights, please consult with an attorney first. Your DMCA notice must include: a physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed; identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site; identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material; information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address; a statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and a statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Counter-Notification Procedure</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you believe that your content was removed or disabled as a result of a mistake or misidentification, you may submit a counter-notification. Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity was removed or disabled by mistake or misidentification may be subject to liability. Your counter-notification must include: your physical or electronic signature; identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or disabled; a statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled; your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in your district, or if you are outside the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided notification of alleged infringement. Upon receipt of a valid counter-notification, we will forward it to the party who submitted the original DMCA notice and restore the removed material within 10 to 14 business days, unless the copyright owner files a court action against you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Designated Copyright Agent</h2>
              <p className="text-muted-foreground leading-relaxed">
                All DMCA notices and counter-notifications should be sent to our designated copyright agent. You may contact our copyright agent using the following information. Please ensure that your notice includes all required elements as described above, as incomplete notices may not be processed. We strongly recommend using email for the fastest response time, as our copyright agent monitors this inbox regularly. When submitting a notice, please include &quot;DMCA Notice&quot; or &quot;DMCA Counter-Notice&quot; in the subject line of your email to ensure it is routed to the correct department. Our designated copyright agent can be reached at copyright@getyouryt.com. We will acknowledge receipt of your notice within two business days and will process valid notices promptly, typically within five business days. Please note that sending a DMCA notice to any other email address or through any other channel may delay processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Repeat Infringer Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                In accordance with the DMCA and other applicable laws, GetYourYT has adopted a policy of terminating access for users or account holders who are repeat infringers of copyright. While our service does not require user accounts, we track infringing activity through IP addresses and other technical means. A repeat infringer is defined as a user who has been the subject of two or more valid DMCA takedown notices. When we receive a valid DMCA notice, we document the infringing activity. If the same user is the subject of additional valid DMCA notices, we will take progressively severe actions, which may include permanently blocking access to our service from the infringing party&apos;s IP address or implementing other technical measures to prevent further infringement. We also reserve the right to terminate access immediately in cases of egregious or large-scale copyright infringement, even on the first offense. We are committed to working collaboratively with copyright owners to address infringement concerns while also protecting the rights of users who may be wrongly accused.
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
