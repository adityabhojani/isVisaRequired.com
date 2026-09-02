import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function TermsPage() {
  useSEO({
    title: "Terms of Service | Is Visa Required?",
    description: "Terms of service for isvisarequired.com — rules for using our free visa requirement checker.",
    canonical: "https://www.isvisarequired.com/terms",
  });

  const updated = "May 3, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using isvisarequired.com ("the Site", "we", "us"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              isvisarequired.com provides a free, informational tool that displays visa requirement data for international travel. The Site covers 195 passports and 195 destination countries. The service is provided free of charge.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Accuracy of Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong className="text-foreground">Visa requirements change frequently.</strong> While we strive to keep our data accurate and up to date, we make no warranties, express or implied, regarding the accuracy, completeness, or timeliness of the information provided.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The visa requirement data on this site is sourced from publicly available datasets and is provided for informational purposes only. It is <strong className="text-foreground">not</strong> official legal or immigration advice.
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium text-foreground bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              ⚠️ Always verify visa requirements directly with the official embassy, consulate, or government immigration authority of your destination country before making any travel arrangements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              To the fullest extent permitted by law, isvisarequired.com and its operators shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Any loss, damage, or inconvenience arising from reliance on information displayed on the Site</li>
              <li>Denial of entry at a border or port of entry based on information from this Site</li>
              <li>Costs associated with travel cancellations, visa rejections, or changes in visa policy</li>
              <li>Any indirect, incidental, consequential, or punitive damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Permitted Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You may use this Site for personal, non-commercial, informational purposes. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Scrape, copy, or redistribute our data commercially without written permission</li>
              <li>Use the Site in any way that could damage, disable, or overburden our servers</li>
              <li>Attempt to gain unauthorised access to any part of the Site or its systems</li>
              <li>Use the Site to transmit spam, malware, or any harmful content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, design, code, and branding on this Site is the property of isvisarequired.com unless otherwise stated. The underlying visa dataset is sourced from the open-source ilyankou/passport-index-dataset under its respective licence. You may not reproduce or redistribute Site content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Site may contain links to third-party websites (including embassy and government sites). We have no control over and assume no responsibility for the content or practices of any third-party sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Modifications to the Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Site at any time without notice. We may also update these Terms at any time. Continued use of the Site following changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved in the courts of the jurisdiction in which the Site operator is located.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us through the Site.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
