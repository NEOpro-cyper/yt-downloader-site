'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Clock, ChevronRight, Send, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground mb-12 max-w-2xl">
              Have a question, suggestion, or need assistance? We would love to hear from you. Use the form below or reach out to us directly via email. Our team typically responds within 24 to 48 hours during business days.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                      Your message has been sent successfully. We will get back to you as soon as possible.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                      Something went wrong. Please try again or email us directly at support@getyouryt.com.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#DC2626] transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#DC2626] transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full h-11 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#DC2626] transition-colors"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#DC2626] transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-8 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-semibold gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Email Addresses */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#DC2626]" />
                    Email Us Directly
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">General Support</p>
                      <a href="mailto:support@getyouryt.com" className="text-sm text-muted-foreground hover:text-[#DC2626] transition-colors">
                        support@getyouryt.com
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Privacy Inquiries</p>
                      <a href="mailto:privacy@getyouryt.com" className="text-sm text-muted-foreground hover:text-[#DC2626] transition-colors">
                        privacy@getyouryt.com
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Legal Matters</p>
                      <a href="mailto:legal@getyouryt.com" className="text-sm text-muted-foreground hover:text-[#DC2626] transition-colors">
                        legal@getyouryt.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#EF4444]" />
                    Response Time
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We aim to respond to all inquiries within 24 to 48 hours during business days. For urgent matters such as copyright complaints or security concerns, we prioritize those and typically respond much faster. Please include as much detail as possible in your message so we can assist you efficiently.
                  </p>
                </div>

                {/* FAQ Link */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#8B5CF6]" />
                    Check Our FAQ
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Many common questions about downloading YouTube videos, supported formats, and how our service works are already answered in our frequently asked questions section.
                  </p>
                  <a
                    href="/#faq"
                    className="text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors flex items-center gap-1"
                  >
                    View FAQ <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
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
