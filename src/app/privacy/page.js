import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="privacy" />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-[#888] mb-2">Operated by Finlay N. Mwangi, individual sole proprietor, based in Kenya.</p>
        <p className="text-[#888] mb-12">Last updated: July 2026</p>

        <div className="space-y-8">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you voluntarily provide when creating an account, including your full name, email address, and phone number. Landlords additionally provide listing information such as photos, location, and pricing, and may optionally provide a caretaker or agent's name and phone number if listing on their behalf. Landlords also submit a photo of their National ID or Passport (front and back) for verification. We also collect usage data such as listings viewed, listings saved, and WhatsApp clicks on listings. This data is used to improve your experience and the platform."
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your personal information to operate and improve the PataMtaani platform; send account verification codes and important notifications by email; enable landlords and tenants to connect through the platform; review verification requests submitted by landlords; process the Ksh 200/month landlord verification fee via M-Pesa; respond to contact form submissions and support requests; and monitor platform activity for safety, fraud prevention, and quality control."
            },
            {
              title: "3. Sharing of Information",
              content: "We do not sell your personal information to third parties under any circumstances. Landlord contact details such as phone numbers (or a designated caretaker/agent's details, if a listing uses the Contact Override feature) are only made available to logged-in users on individual listing pages. We may share limited information with trusted third-party service providers who help us operate the platform, such as Resend for email delivery, Supabase for database and file storage, and Safaricom's Daraja API for M-Pesa payments. These providers are contractually or technically limited to using your data only for the purposes we specify."
            },
            {
              title: "4. Data Protection",
              content: "PataMtaani complies with the Kenya Data Protection Act 2019. We take reasonable and appropriate technical measures to protect your personal information from unauthorized access, disclosure, loss, or misuse. Passwords are stored using industry-standard bcrypt hashing and are never stored or transmitted in plain text. Sensitive documents such as ID verification photos are stored in private, access-controlled storage and are only viewed by PataMtaani admin staff for verification purposes, via secure time-limited links."
            },
            {
              title: "5. Security Breach Notification",
              content: "In the event of a data breach that is likely to result in a risk to your rights and freedoms, PataMtaani will notify affected users and the Office of the Data Protection Commissioner of Kenya as required under the Kenya Data Protection Act 2019. We will communicate the nature of the breach, the data affected, and the steps we are taking to address it."
            },
            {
              title: "6. How Your Session Is Kept",
              content: "PataMtaani does not use cookies. Your login session is stored locally in your browser (local storage) rather than on our servers. This means logging out, or clearing your browser data, will end your session and you will need to log in again."
            },
            {
              title: "7. Third-Party Services",
              content: "PataMtaani uses the following third-party services to operate: Supabase for database and file storage, Resend for email delivery of OTPs and notifications, and Safaricom's Daraja API for M-Pesa payments. We plan to activate Africa's Talking for SMS-based verification in the future; until then, all OTPs are sent by email. When you use the WhatsApp contact button on a listing, you will be redirected to WhatsApp, which is governed by Meta's own privacy policy. We are not responsible for the data practices of external platforms."
            },
            {
              title: "8. Children's Privacy",
              content: "PataMtaani is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a user is under 18, we will immediately suspend their account and delete their data. If you believe a minor has registered on our platform, please contact us at patamtaanikenya@gmail.com."
            },
            {
              title: "9. Your Rights",
              content: "Under the Kenya Data Protection Act 2019, you have the right to access the personal information we hold about you; request correction of inaccurate or incomplete data; request deletion of your personal data; object to or restrict how we process your data; and withdraw consent at any time. You can update or delete your account directly from your dashboard. For anything else, contact us at patamtaanikenya@gmail.com."
            },
            {
              title: "10. Retention",
              content: "We retain your personal information for as long as your account is active or as needed to provide our services. If you delete your account, we will remove your personal data from our active systems within a reasonable time, except where we are required by law to retain certain records, such as payment records."
            },
            {
              title: "11. Changes to This Policy",
              content: "We may update this Privacy Policy from time to time to reflect changes in our practices or Kenyan law — for example, as we activate SMS-based OTPs or introduce new payment methods. We will notify you of significant changes by email or through a prominent notice on the platform. The date at the top of this page will always reflect when the policy was last updated."
            },
            {
              title: "12. Contact",
              content: "For questions about this Privacy Policy or how we handle your personal data, contact our team at patamtaanikenya@gmail.com. We aim to respond to all privacy-related enquiries within 5 business days."
            },
          ].map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-[#FF6B35] mb-2">{section.title}</h2>
              <p className="text-[#888] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="px-6 py-8 border-t border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black"><span className="text-white">Pata</span><span className="text-[#FF6B35]">Mtaani</span></span>
          <div className="flex gap-6 text-sm text-[#888]">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}