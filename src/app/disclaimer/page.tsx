import type { Metadata } from 'next';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Read the GetYourYT disclaimer regarding the use of our free YouTube video downloader, including important legal and usage information.',
  alternates: {
    canonical: 'https://getyouryt.com/disclaimer',
  },
};

export default function DisclaimerPage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Disclaimer</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: March 4, 2026</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">General Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The information and services provided by GetYourYT are available for general informational and personal use purposes only. While we strive to ensure that our service operates smoothly and accurately, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the service or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk. We shall not be held liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this service. It is your responsibility to ensure that any content downloaded through our service is used in accordance with all applicable local, state, national, and international laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Not Affiliated with YouTube or Google</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT is an independent, third-party service and is not affiliated with, endorsed by, sponsored by, or connected to YouTube, Google LLC, or any of their subsidiaries or affiliates in any way whatsoever. YouTube and the YouTube logo are registered trademarks of Google LLC. Any references to YouTube on our website are made solely for the purpose of describing the functionality of our service, namely that it allows users to download videos from the YouTube platform. No endorsement, sponsorship, or approval by YouTube or Google should be inferred from the use of their name or marks on our website. We do not have any business relationship with YouTube or Google, and they do not endorse, control, or have any responsibility for our service, its content, or its operations. Any opinions, views, or positions expressed on our website are our own and do not reflect the opinions, views, or positions of YouTube or Google.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">No Endorsement</h2>
              <p className="text-muted-foreground leading-relaxed">
                The fact that GetYourYT allows users to download publicly available YouTube videos does not constitute an endorsement of any video content, creator, or viewpoint expressed in those videos. We do not review, curate, or screen the videos that users choose to download through our service. The availability of a video for download through GetYourYT does not indicate that we approve of, support, or agree with the content of that video. Similarly, the inclusion of any YouTube creator&apos;s content in our service does not imply any endorsement or recommendation of that creator. We are a neutral technical tool, and our service is content-agnostic. Users exercise their own judgment and bear sole responsibility for the content they choose to download and how they use it thereafter. We do not endorse any political views, social positions, or personal opinions expressed in videos downloaded through our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">User Responsibility for Downloaded Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users of GetYourYT bear sole and exclusive responsibility for the content they download and how they use it. When you download a video through our service, you are solely responsible for ensuring that your use of that video complies with all applicable copyright laws, intellectual property rights, privacy rights, and other legal requirements. Downloading a video does not transfer any copyright or intellectual property rights to you. The original content creator retains all rights to their work. You must obtain appropriate permissions or licenses before reusing, redistributing, modifying, or commercially exploiting any downloaded content. GetYourYT is not responsible for any legal consequences that may arise from your use of downloaded content. If you are unsure whether your intended use of a downloaded video is legal, you should consult with a qualified legal professional before proceeding. We encourage all users to respect the creative work of content creators and to use downloaded content responsibly and ethically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Fair Use Notice</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetYourYT acknowledges the doctrine of fair use as codified in Section 107 of the United States Copyright Act and similar provisions in other jurisdictions. Fair use permits limited use of copyrighted material without having to acquire permission from the copyright holder for purposes such as commentary, criticism, news reporting, teaching, scholarship, or research. Whether a particular use constitutes fair use depends on a case-by-case analysis considering factors including the purpose and character of the use, the nature of the copyrighted work, the amount and substantiality of the portion used, and the effect of the use on the potential market for the copyrighted work. Our service is intended to facilitate legitimate fair use of publicly available content, such as saving videos for personal offline viewing, using clips for commentary or criticism, or preserving content for educational purposes. However, we cannot and do not make determinations about whether any particular use of downloaded content qualifies as fair use. Users must make their own fair use assessments and accept responsibility for their use of downloaded material.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites or services that are not owned or controlled by GetYourYT. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that GetYourYT shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such third-party websites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit. The inclusion of any link on our website does not imply our endorsement, recommendation, or favoring of the linked website or any association with its operators. If you decide to access any third-party website linked from our service, you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">As-Is Basis</h2>
              <p className="text-muted-foreground leading-relaxed">
                The GetYourYT service is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, timely, secure, or error-free. We do not warrant that the results obtained from the use of the service will be accurate, reliable, or complete. We do not guarantee that any errors in the service will be corrected. You understand and agree that your use of the service is at your sole discretion and risk, and that you will be solely responsible for any damage to your computer system or loss of data that results from the use of the service. No advice or information, whether oral or written, obtained by you from GetYourYT or through the service shall create any warranty not expressly stated in this disclaimer. This as-is basis applies to all aspects of the service, including but not limited to availability, speed, quality of downloads, and accuracy of video information.
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
