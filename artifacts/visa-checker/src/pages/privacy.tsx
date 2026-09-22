import type { ReactNode } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Every statement on this page was checked against the code and the live site
// on 16 September 2026: what each form stores, what each third party receives,
// every cookie and browser-storage key, and what the server logs. If you add a
// form, a tracker, an email provider or a third-party script, update this page
// in the same change. In particular:
//   - turning on email (RESEND_API_KEY) makes Resend a recipient of email addresses;
//   - turning on Google Analytics, Microsoft Clarity or AdSense adds cookies and
//     third parties (the cookie banner will also appear);
//   - moving Clerk to production keys changes the Clerk cookies listed below.

const UPDATED = "16 September 2026";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead className="bg-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="text-left px-4 py-2 text-foreground font-semibold align-bottom">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2 text-muted-foreground align-top">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Strong = ({ children }: { children: ReactNode }) => <strong className="text-foreground">{children}</strong>;
const Code = ({ children }: { children: ReactNode }) => <code className="font-mono text-xs">{children}</code>;
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{children}</a>
);
const Int = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="underline underline-offset-2 hover:text-foreground">{children}</a>
);

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy | Is Visa Required?",
    description:
      "What isvisarequired.com collects, which services receive it, the cookies we use, how long we keep information and how to ask us to delete it.",
    canonical: "https://www.isvisarequired.com/privacy",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {UPDATED}</p>

          <Section id="summary" title="The short version">
            <ul className="list-disc pl-5 space-y-2">
              <li>You can use the visa checker, guides and tools without an account and without giving us your name or email address.</li>
              <li>We only store an email address if you give us one: for a visa alert, for email updates, or on the contact form.</li>
              <li>We don't sell personal information, and we don't use advertising cookies or advertising trackers.</li>
              <li>Like any website, pages are delivered by a hosting provider and load a few outside services, which receive technical information such as your IP address. They are all listed below.</li>
            </ul>
          </Section>

          <Section id="who" title="1. Who we are">
            <p>
              This policy covers isvisarequired.com ("we", "us"), an independent visa-information website. We are not a
              government body or a visa agency. To contact us about anything in this policy, use our{" "}
              <Int href="/contact">contact form</Int>.
            </p>
          </Section>

          <Section id="you-give" title="2. Information you give us">
            <p>We only receive this information when you choose to use the feature concerned.</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <Strong>Visa change alerts.</Strong> When you ask to be told if a visa rule changes, we store your email
                address together with the passport country and destination country of each alert, and the date you set it
                up. Because of the passport country, an alert can indicate your nationality. If you are signed in, the alert
                is also linked to your account.
              </li>
              <li>
                <Strong>Email updates.</Strong> If you sign up with the form at the bottom of our pages, we store your email
                address and the date you signed up.
              </li>
              <li>
                <Strong>Contact and correction messages.</Strong> When you use the <Int href="/contact">contact form</Int>, we
                store your message, the date, and your email address if you choose to give one so that we can reply.
              </li>
              <li>
                <Strong>Accounts.</Strong> Creating an account is optional. Accounts are run by our sign-in provider, Clerk
                (see section 5). To create one you currently provide an email address, a phone number, a username and a
                password, and optionally your first and last name; your email address and phone number are confirmed with a
                one-time code. Alternatively you can sign in with Apple, Facebook or Google, in which case that company shares
                your basic profile details, such as your name and email address, with Clerk. We never see or store your
                password.
              </li>
              <li>
                <Strong>My Travels.</Strong> If you are signed in and mark countries as visited, we store those countries
                against your account. If you are not signed in, your list stays in your browser and is never sent to us.
              </li>
            </ul>
          </Section>

          <Section id="automatic" title="3. Information collected automatically">
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <Strong>Hosting and request logs.</Strong> Our site is hosted by Vercel. Each time your browser requests a
                page or file, Vercel receives your IP address, browser and device details (the "user agent"), the address
                requested including any search parameters, and the time. Our own server logs record which address was
                requested (without search parameters), whether the request worked, your user agent, the country Vercel
                places you in, and a fingerprint of your browser's connection settings (a "JA4" hash) that helps us tell
                automated scrapers from people — but not your IP address. When you check visa requirements, the
                log also records the country codes you checked. When someone signs up for email
                updates, the log records a partly hidden version of the email address. If a technical error stops us saving
                something you submitted, the error log can contain what you submitted.
              </li>
              <li>
                <Strong>Abuse protection.</Strong> To stop automated abuse, our server counts requests from each IP address.
                This count is kept only in memory, normally for a minute or two, and is never saved.
              </li>
              <li>
                <Strong>Website analytics.</Strong> We use Vercel Web Analytics to see how many people visit and which pages
                they use. For each page view it receives the address of the page, including search parameters (for example the
                countries you selected), the website that referred you, and your IP address and user agent, from which Vercel
                works out your country, device type, browser and operating system. It does not use cookies, and we cannot see
                individual visitors in it.
              </li>
            </ul>
            <p>
              Our pages instruct your browser not to tell other websites which of our pages you came from when you follow a
              link or when a page loads an outside service.
            </p>
          </Section>

          <Section id="cookies" title="4. Cookies and browser storage">
            <p>
              We don't use advertising or analytics cookies. The cookies below come from Clerk, our sign-in provider. They are
              set when you open a page of the interactive visa checker, even if you never sign in; our guide and
              visa-requirement pages don't load Clerk. They are used to keep sign-in working and secure.
            </p>
            <Table
              head={["Name", "Set by", "What it does", "How long"]}
              rows={[
                [<Code>__client_uat</Code>, "Clerk", "Records whether this browser is signed in.", "At least a year, renewed as you use the site"],
                [<Code>__clerk_db_jwt</Code>, "Clerk", "Identifies this browser to Clerk so that sign-in works.", "About a year, renewed as you use the site"],
                [<Code>__session</Code>, "Clerk", "Keeps you signed in. Only set once you sign in.", "Until you sign out"],
                [<Code>__clerk_redirect_count</Code>, "Clerk (via our server)", "Prevents sign-in redirect loops.", "2 seconds"],
                [<Code>__cf_bm</Code>, "Cloudflare, on Clerk's servers", "Bot protection for Clerk's service.", "30 minutes"],
              ]}
            />
            <p>
              Some cookies above can appear with an extra suffix on their name; they do the same job. We also keep a few
              items in your browser's local storage. These stay on your device and are not sent to us:
            </p>
            <Table
              head={["Name", "What it stores"]}
              rows={[
                [<Code>my_travels</Code>, "The countries you marked as visited while not signed in."],
                [<Code>trip_planner_trips</Code>, "Up to five trips you saved in the trip planner."],
                [<Code>announcement_dismissed_…</Code>, "That you closed a site announcement."],
                [<Code>cookie_consent</Code>, "Your choice, if we ever ask you to accept optional cookies."],
                [<Code>__clerk_environment</Code>, "Clerk's public sign-in settings, so the sign-in form loads faster."],
              ]}
            />
            <p>
              Local storage has no expiry date: it stays until you clear your browser's data for this site. You can delete
              cookies and local storage at any time in your browser settings; if you do, you will be signed out.
            </p>
            <p>
              We don't currently use any cookies or tools that need your consent, which is why we don't show a cookie banner.
              If we add optional analytics in future, we will ask first and it will not run unless you accept.
            </p>
          </Section>

          <Section id="third-parties" title="5. Services that receive information">
            <Table
              head={["Service", "When", "What it receives"]}
              rows={[
                [
                  <><Strong>Vercel</Strong> — <Ext href="https://vercel.com/legal/privacy-notice">privacy notice</Ext></>,
                  "Every visit. Hosting, request logs, website analytics and storage for images on our blog.",
                  "IP address, user agent, pages requested and the information in section 3.",
                ],
                [
                  <><Strong>Clerk</Strong> — <Ext href="https://clerk.com/legal/privacy">privacy policy</Ext></>,
                  "Pages of the interactive visa checker, and whenever you sign up or sign in.",
                  "IP address, user agent and the cookies above; your account details if you create an account.",
                ],
                [
                  <><Strong>Cloudflare</Strong> — <Ext href="https://www.cloudflare.com/privacypolicy/">privacy policy</Ext></>,
                  "Protects Clerk's service, and may run a verification check when you create an account.",
                  "IP address, user agent and the browser signals needed for the check.",
                ],
                [
                  <><Strong>Apple, Facebook or Google</Strong></>,
                  "Only if you choose to sign in with one of them.",
                  "The fact that you are signing in to our site through Clerk. Their own privacy policies apply.",
                ],
                [
                  <><Strong>Google Fonts</Strong> — <Ext href="https://developers.google.com/fonts/faq/privacy">privacy FAQ</Ext></>,
                  "Every page, to display our fonts.",
                  "IP address and user agent.",
                ],
                [
                  <><Strong>jsDelivr</Strong> — <Ext href="https://www.jsdelivr.com/terms/privacy-policy">privacy policy</Ext></>,
                  "When a world map is shown.",
                  "IP address and user agent.",
                ],
                [
                  <><Strong>Wikimedia (Wikipedia)</Strong> — <Ext href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy">privacy policy</Ext></>,
                  "Destination pages and \"things to do\" sections, and the photos in our blog posts.",
                  "IP address, user agent and which photos are requested. Wikimedia may set its own cookie.",
                ],
                [
                  <Strong>Our database host</Strong>,
                  "Whenever you submit something in section 2.",
                  "Stores the information described in section 2 on our behalf.",
                ],
              ]}
            />
            <p>
              Several of these providers are based in the United States, so your information may be processed outside the
              country you live in.
            </p>
          </Section>

          <Section id="use" title="6. How we use information, and why we're allowed to">
            <ul className="list-disc pl-5 space-y-2">
              <li><Strong>To run the site and its features</Strong>, including accounts and My Travels. Where you have an account, this is necessary to provide the service you signed up for; otherwise it is in our legitimate interest in operating the site.</li>
              <li><Strong>To send you the visa alerts or email updates you asked for.</Strong> We rely on your consent, which you can withdraw at any time (see section 8). We use these email addresses for nothing else.</li>
              <li><Strong>To reply to your messages and fix incorrect visa information</Strong>, in our legitimate interest in keeping the site accurate.</li>
              <li><Strong>To keep the site secure, prevent abuse and fix problems</Strong>, in our legitimate interest in running a reliable service.</li>
              <li><Strong>To understand, in aggregate, how the site is used</Strong>, in our legitimate interest in improving it.</li>
            </ul>
            <p>We don't sell personal information, share it for advertising, or use it to build advertising profiles.</p>
          </Section>

          <Section id="retention" title="7. How long we keep it">
            <ul className="list-disc pl-5 space-y-2">
              <li><Strong>Visa alerts and email updates:</Strong> until you ask us to delete them. Removing or unsubscribing from an alert stops it, but the record stays until you ask us to delete it.</li>
              <li><Strong>Contact and correction messages:</Strong> until you ask us to delete them, or we delete them.</li>
              <li><Strong>My Travels (signed in):</Strong> unticking a country deletes it straight away. Deleting your account does not automatically delete your list, so ask us if you want it removed.</li>
              <li><Strong>Accounts:</Strong> kept by Clerk until you delete your account.</li>
              <li><Strong>Request and error logs:</Strong> kept by Vercel according to its own retention practices.</li>
              <li><Strong>Local storage:</Strong> on your device until you clear it.</li>
            </ul>
          </Section>

          <Section id="rights" title="8. Your choices and rights">
            <p>Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>find out what personal information we hold about you and get a copy of it;</li>
              <li>have it corrected or deleted;</li>
              <li>object to, or ask us to limit, how we use it;</li>
              <li>withdraw your consent at any time, for example to stop an alert or email updates;</li>
              <li>complain to your local data protection authority.</li>
            </ul>
            <p>
              <Strong>How to use them.</Strong> Send us a request through the <Int href="/contact">contact form</Int> and
              include the email address it concerns. We may ask you to confirm that the email address is yours, and we will
              respond within 30 days.
            </p>
            <p>
              You can also act yourself: if you created a visa alert while signed in you can remove it on the{" "}
              <Int href="/alerts">Visa alerts</Int> page; you can delete your account from your account settings; and you can
              clear cookies and local storage in your browser.
            </p>
          </Section>

          <Section id="security" title="9. Security">
            <p>
              Our site is served over an encrypted (HTTPS) connection. Passwords are handled by Clerk and never reach our
              servers, and access to the information we store is limited to the people who run the site. No method of storing
              or sending information online is completely secure, so we can't guarantee absolute security.
            </p>
          </Section>

          <Section id="children" title="10. Children">
            <p>This site is not directed at children under 13, and we do not knowingly collect personal information from them.</p>
          </Section>

          <Section id="changes" title="11. Changes to this policy">
            <p>
              We will update this page when what we collect or the services we use change, and change the "last updated" date
              at the top.
            </p>
          </Section>

          <Section id="contact" title="12. Contact">
            <p>
              For any question about privacy, or to use your rights, please use our <Int href="/contact">contact form</Int>.
            </p>
          </Section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
