import React from 'react'

const TermsAndCondition = () => {
  return (
    <div className='lg:mt-14 lg:ml-60 min-h-screen font-[Poppins] bg-gray-50 p-8'>

      {/* Header Section */}
      <div className="mb-8">
        {/* Logo Section */}
        <div className=" p-6 flex justify-center rounded-t-lg">
          <img
            src="/Highlands.svg"
            alt="Highlands Church"
            className="h-16"
          />
        </div>

        {/* Contact Info Section */}
        <div className="bg-purple-700 text-white py-4 text-center">
          <p className="text-sm">505-513 Hume St, Toowoomba • (07) 4617 6555</p>
          <p className="text-sm">www.highlandschurch.org.au/campus</p>
        </div>

      </div>

      <div className="max-w-full">
        <div className="space-y-6 text-gray-700">

          <div>
            <h1 className="text-3xl font-semibold text-purple-700 mb-4">UGive — Terms & Conditions</h1>
            <p className="font-semibold">Effective Date: 2 December 2025</p>
          </div>

          <p>
            Welcome to <strong>UGive</strong>. By downloading, accessing or using the UGive app ("the App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the App. "UGive" for the purpose of these terms and conditions refers to both the app and the host entity, Highlands Church.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">1. Purpose of the App</h2>
            <p>
              UGive is a platform designed to enable positive communication, expressions of appreciation, and generosity through the sharing and delivery of physical and/or digital cards, messages and gifts.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">2. User Eligibility</h2>
            <p className="mb-2">By using the App, you confirm that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are at least 16 years of age (or older if required by local law), and</li>
              <li>You have the capacity to enter into this agreement.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">3. Use of Contact Details</h2>
            <p className="mb-2">
              By using UGive, you consent to the collection and use of your contact information (including name, email address, phone number and/or delivery details) for the purposes of:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Facilitating the delivery of cards and communications between users.</li>
              <li>Contacting you in relation to activity within the App (including delivery coordination and service updates).</li>
              <li>Providing support or resolving issues relating to your use of the App.</li>
            </ul>
            <p>
              Your contact details will <strong>not be sold or shared with third parties for marketing purposes</strong> unrelated to the operation of UGive. We take reasonable steps to protect your personal information in accordance with applicable privacy laws (see our Privacy Policy for details).
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">4. Acceptable Use</h2>
            <p className="mb-2">
              You agree to use UGive in a manner that is respectful, constructive, and lawful. You must not use the App to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Post or transmit any abusive, harassing, defamatory, threatening, obscene, or hateful content.</li>
              <li>Bully, intimidate, or target individuals or groups.</li>
              <li>Communicate explicit material, profanity, or offensive language.</li>
              <li>Violate any law or encourage harmful conduct.</li>
              <li>Misuse the platform to spam or deceive other users.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">5. Right to Remove Users</h2>
            <p className="mb-2">
              UGive reserves the right to <strong>suspend or permanently remove any user</strong> from the App, at our sole discretion, without notice, if:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>These Terms are breached.</li>
              <li>Content or behaviour is deemed harmful, offensive, or inconsistent with the spirit and purpose of the platform.</li>
              <li>The safety, wellbeing, or dignity of other users is compromised.</li>
            </ul>
            <p>Any content associated with removed accounts may also be deleted.</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">6. Content Responsibility</h2>
            <p>
              All content shared within UGive remains the responsibility of the user who creates it. UGive does not endorse or verify messages sent between users and accepts no liability for the content of user communications.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">7. App Availability</h2>
            <p>
              UGive aims to maintain reliable service but does not guarantee uninterrupted or error-free operation. We may suspend, update or discontinue the App at any time without notice.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">8. Limitation of Liability</h2>
            <p className="mb-2">To the maximum extent permitted by law:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>UGive is not liable for any indirect, incidental or consequential loss arising from your use of the App.</li>
              <li>UGive does not guarantee delivery timelines or outcomes related to card delivery dependent on user coordination or third-party services.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">9. Intellectual Property & Responsible Use</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All intellectual property in the UGive App — including our software, branding, designs and content formats — belongs to UGive. Using the App doesn't give you ownership of any of this — it simply gives you permission to use it as intended.</li>
              <li>We grant you a personal, non-exclusive licence to use the App in line with these Terms. Please don't copy, modify, distribute, reverse engineer, scrape data from, or misuse any part of the App or our intellectual property without written permission.</li>
              <li>You are responsible for how you use the App. To the extent allowed by law, UGive isn't liable for losses linked to misuse of the platform, and you agree to indemnify UGive against claims arising from breaches of these Terms.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">10. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the App after changes are published constitutes acceptance of the updated Terms.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-purple-700 mb-4">11. Contact</h2>
            <p className="mb-2">For questions about these Terms or the operation of the App, please contact:</p>
            <p className="font-semibold">UGive Support</p>
            <p>hello@ugive.com.au</p>
          </div>

          <div className="mt-8 p-4 bg-purple-50 border-l-4 border-purple-700 rounded">
            <p className="italic text-gray-700">
              By using UGive, you confirm that you have read, understood, and agree to these Terms & Conditions.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TermsAndCondition