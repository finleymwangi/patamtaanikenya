import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar active="terms" />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">Terms and Conditions</h1>
        <p className="text-[#888] mb-12">Last updated: July 2026</p>

        <div className="space-y-8 text-[#f5f0eb]">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using PataMtaani, you agree to be bound by these Terms and Conditions and all applicable Kenyan laws and regulations. If you do not agree with any part of these terms, please do not use our platform."
            },
            {
              title: "2. Who Can Use PataMtaani",
              content: "PataMtaani is available to individuals who are 18 years or older and residing in Kenya. By creating an account, you confirm that you meet this requirement, that the information you provide is accurate and truthful, and that you will keep your account information up to date."
            },
            {
              title: "3. Landlord Responsibilities",
              content: "Landlords are solely responsible for ensuring that all listing information is accurate, complete, and not misleading. This includes rental price, location, photos, amenities, and availability. Fraudulent or misleading listings will result in immediate account suspension or termination. PataMtaani is not a party to any rental agreement and is not responsible for any disputes, losses, or damages arising between landlords and tenants."
            },
            {
              title: "4. Tenant Responsibilities",
              content: "Tenants are responsible for conducting their own due diligence before committing to any rental. We strongly advise visiting the property in person, verifying the landlord's identity, and never sending any money before physically confirming a property is genuine. PataMtaani is not liable for any financial or personal losses resulting from interactions with landlords on the platform."
            },
            {
              title: "5. Verification",
              content: "Landlord verification is currently offered free of charge. PataMtaani reserves the right to reject a verification application if the submitted documents do not meet our standards or if the identity cannot be confirmed. Verification does not constitute an endorsement or guarantee of a landlord's listings or conduct."
            },
            {
              title: "6. Intellectual Property",
              content: "All content on PataMtaani, including the platform design, logo, branding, and written content, is the property of PataMtaani and is protected under Kenyan intellectual property law. You may not copy, reproduce, distribute, or use any part of the platform for commercial purposes without our written permission. Content you submit to the platform, such as listing photos and descriptions, remains your property, but you grant PataMtaani a non-exclusive licence to display and use that content for platform operations."
            },
            {
              title: "7. Prohibited Activities",
              content: "You may not use PataMtaani to post false, misleading, or duplicate listings; impersonate another person or entity; harass, threaten, or abuse other users; scrape or extract data from the platform; engage in fraudulent activity of any kind; or violate any applicable Kenyan law. Violation of these rules will result in immediate account termination and, where applicable, reporting to relevant authorities."
            },
            {
              title: "8. Account Termination",
              content: "PataMtaani reserves the right to suspend or permanently terminate any account at any time, with or without notice, if we determine that the account has violated these Terms, poses a risk to other users, or is being used for fraudulent purposes. You may also delete your own account at any time through your account settings."
            },
            {
              title: "9. Dispute Resolution",
              content: "In the event of a dispute between users of the platform, PataMtaani encourages resolution through direct communication. PataMtaani does not arbitrate disputes between landlords and tenants but may, at its discretion, investigate reports of misconduct and take appropriate action including account suspension. Any legal disputes involving PataMtaani directly shall be resolved under the laws of Kenya, in the courts of Nairobi."
            },
            {
              title: "10. Limitation of Liability",
              content: "PataMtaani is a marketplace platform and is not a party to any transaction, agreement, or dispute between landlords and tenants. We are not liable for any direct, indirect, or consequential loss, damage, or dispute arising from the use of our platform, including losses arising from fraudulent listings, failed tenancy agreements, or interruptions to platform service."
            },
            {
              title: "11. Governing Law",
              content: "These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Kenya. By using PataMtaani, you consent to the exclusive jurisdiction of the Kenyan courts for any disputes arising from these terms or your use of the platform."
            },
            {
              title: "12. Changes to Terms",
              content: "PataMtaani reserves the right to update these Terms and Conditions at any time. We will notify users of significant changes through the platform or by email where possible. Continued use of the platform after changes are posted constitutes your acceptance of the updated Terms."
            },
            {
              title: "13. Contact",
              content: "For questions or concerns about these Terms and Conditions, contact us at patamtaanikenya@gmail.com."
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
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-xs text-[#888]">© 2026 PataMtaani. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}