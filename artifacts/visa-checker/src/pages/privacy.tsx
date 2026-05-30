import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy | Is Visa Required?",
    description: "Privacy policy for isvisarequired.com — how we collect, use, and protect your information.",
    canonical: "https://www.isvisarequired.com/privacy",
  });

  const updated = "May 3, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              isvisarequired.com ("we", "us", "our") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights. By using this website you agree to this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect limited, anonymised data to improve the site:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Usage data</strong> — pages visited, time on site, browser type, device type, and country (via Google Analytics 4). This data is anonymised and aggregated.</li>
              <li><strong className="text-foreground">Interaction events</strong> — which passport/destination combinations are checked (country codes only, no personal data).</li>
              <li><strong className="text-foreground">Cookies</strong> — we use analytics cookies (Google Analytics) and a cookie to remember your consent preference. We do not use advertising tracking cookies until AdSense is enabled.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do <strong className="text-foreground">not</strong> collect names, email addresses, passport numbers, or any personally identifiable information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To understand how the site is used and improve its features</li>
              <li>To identify which country pairs are most searched so we can prioritise data accuracy</li>
              <li>To monitor site performance and fix errors</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not sell, rent, or share your information with third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use the following types of cookies:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-2 text-foreground font-semibold">Cookie</th>
                    <th className="text-left px-4 py-2 text-foreground font-semibold">Purpose</th>
                    <th className="text-left px-4 py-2 text-foreground font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 text-muted-foreground font-mono text-xs">cookie_consent</td>
                    <td className="px-4 py-2 text-muted-foreground">Stores your cookie preference</td>
                    <td className="px-4 py-2 text-muted-foreground">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-muted-foreground font-mono text-xs">_ga, _ga_*</td>
                    <td className="px-4 py-2 text-muted-foreground">Google Analytics — anonymised usage statistics</td>
                    <td className="px-4 py-2 text-muted-foreground">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You can decline analytics cookies using the banner shown on your first visit. You can also clear cookies at any time via your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Google Analytics 4</strong> — anonymised website analytics. Google's privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">policies.google.com/privacy</a></li>
              <li><strong className="text-foreground">Google Fonts</strong> — fonts loaded from Google's servers. No personal data is retained by Google from font requests.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights (GDPR & CCPA)</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Depending on your location, you may have rights including:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>The right to access data we hold about you</li>
              <li>The right to request deletion of your data</li>
              <li>The right to withdraw consent for analytics cookies at any time</li>
              <li>The right to opt out of the sale of personal information (we do not sell data)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Since we collect no personally identifiable information, most of these rights are satisfied by default. To withdraw analytics consent, clear your browser cookies or contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Anonymised analytics data is retained in Google Analytics for 14 months (the minimum configurable period). Consent preferences stored in your browser persist for 1 year or until you clear cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              This site is not directed at children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. The "last updated" date at the top will reflect any changes. Continued use of the site after updates constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any privacy-related questions, please contact us via the information on the site. We will respond within 30 days.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
