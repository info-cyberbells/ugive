import React from 'react'

const PrivacyPolicy = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const isAuthenticated = token && user;
  return (
    <div
      className={`min-h-screen font-[Poppins] bg-gray-50 p-8 
      ${isAuthenticated ? "lg:mt-14 lg:ml-60" : ""}`}
    >
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
      {/* END OF HEADER */}
      <div className="max-w-full">
        <h1 className="text-3xl font-semibold text-[#6955A5] mb-8">PRIVACY POLICY</h1>

        <div className="space-y-6 text-gray-700">
          <p>
            Highlands Church (Highlands) as part of Christian Outreach Centre (trading as International Network of Churches), ABN 79 400 419 737 recognises that the right to privacy of all persons is very important. This Privacy Policy sets out the key elements of how we comply with the Australian Privacy Principles, particularly in terms of the treatment of personal information that we collect and/or hold. Highlands must comply with the Australian Privacy Act, and the Australian Privacy Principles, as amended from time to time.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">SECOND GENERATION PRIVACY POLICY</h2>
            <p>
              Highlands has adopted a "whole of organisation" privacy policy. Notwithstanding this, some parts of Highlands operations, particularly our educational and childcare ministries, have developed specific Privacy Policies for their day-to-day operations. As stated previously, all Highlands Privacy Policy documents must comply with the relevant legislation.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">LEGISLATION</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Privacy Act 1988 (Cth)</li>
              <li>Privacy Amendment (Enhancing Privacy Protection) Act 2012</li>
              <li>Notifiable Data Breaches (NDB) Scheme</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">ACKNOWLEDGEMENT OF OUR PRIVACY POLICY</h2>
            <p className="mb-4">
              Our obligation under the Privacy Amendment (Enhancing Privacy Protection) Act 2012 is to comply with Australian Privacy Principle 1.4 which requires us to set out our policies on the management of personal information in a clearly expressed document which is free of charge to anyone who asks for it.
            </p>
            <p className="mb-4">
              Without limiting the generality of the above statement, a person's use of the Highlands website constitutes an acknowledgement that they have been made aware of our privacy policy.
            </p>
            <p className="mb-4">
              We respect your personal information and your right to privacy. This Privacy Policy describes the information that may be collected by us and how we protect your personal information.
            </p>
            <p>
              Should there be, in any specific case, any inconsistency between this statement and the Act, this statement shall be interpreted, in respect of that case, to give effect to, and comply with the legislation.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">EXCEPTION IN RELATION TO EMPLOYEE RECORDS</h2>
            <p>
              Under the Privacy Act, the Australian Privacy Principles do not apply to an employee record held by the employing entity. As a result, this Privacy Policy does not apply to Highlands treatment of an employee record, where the treatment is directly related to a current or former employment relationship between Highlands and an employee.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">THE KIND OF PERSONAL INFORMATION WE COLLECT AND HOLD</h2>
            <p className="mb-4">
              Personal information is information or an opinion about an identified or reasonably identifiable individual. We may collect non-personal information from you, such as browser type, operating system, and web pages visited to help us manage our web site.
            </p>
            <p className="mb-4">
              Many of our church services & conference meetings are recorded. Testimonials, song performances, baptism services and leadership meetings are further examples of recordings that may be made by Highlands & ministries.
            </p>
            <p className="mb-4">
              Images of people attending and participating in our services, events and/or conferences, or other recordings, for example as above, may be used or shown in part for promotional purposes, resource material and commercial activities.
            </p>
            <p className="font-semibold">
              By attending such church services and / or conference sessions, or being involved in testimonials for example, you agree to Highlands using your image and personal information in these recordings.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">HOW WE COLLECT AND HOLD PERSONAL INFORMATION</h2>
            <p className="mb-4">
              We use cookies and other Internet technologies to manage our website, social media platforms and certain online products and services. We do not use these technologies to collect or store personal information unless you have opted in to such a feature.
            </p>
            <p className="mb-2">
              Our Internet server logs the following information which is provided by your browser for statistical purposes only:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>The type of browser and operating system you are using</li>
              <li>Your Internet Service Provider and top level domain name</li>
              <li>The address of any referring web site; and</li>
              <li>Your computer's IP address.</li>
            </ul>
            <p>
              All this information is used by Highlands for aggregated statistical analyses or systems administration purposes only. No attempt will be made to identify users or their browsing activities, except where required by or under law.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">COOKIES</h2>
            <p className="mb-4">
              A "cookie" is a packet of information that allows Highlands server to identify and interact more effectively with your computer.
            </p>
            <p>
              When you access our web site, we send you a temporary or "session cookie" that gives you a unique identification number. A different identification number is sent each time you use our website. Cookies do not identify individual users, although they do identify a user's Internet browser type and your Internet Service Provider. Shortly after you end your interaction with our web site, the cookie expires. This means it no longer exists on your computer and therefore cannot be used for further identification or access to your computer. Without cookies certain personalised services cannot be provided to users of our website, accordingly you may not be able to take full advantage of all of Highlands website features if cookies have been disabled.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">LINKS TO OTHER SITES</h2>
            <p>
              The Highlands website may contain links to other external sites. We are ultimately not responsible for the privacy practises or the content of such external web sites. We encourage you to read and understand the privacy policies on those websites prior to providing any information to them.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">SEARCHES</h2>
            <p>
              Search terms that you enter when using our search engine are collected but are not associated with any other information that we collect.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">THE PURPOSES FOR WHICH WE COLLECT, HOLD, USE AND DISCLOSE PERSONAL INFORMATION</h2>
            <p className="mb-4">
              We use personal information you provide only for purposes consistent with the reason you provided it, or for a directly related purpose. Generally we will not use your personal information to market to you unless we have either your implied or express consent but in situations where it is impractical to obtain your prior consent, we will ensure you have an ability to opt out of such future communications.
            </p>
            <p className="mb-4">
              We do not share your personal information with other organisations unless you give us your express consent, or where sharing is otherwise required or permitted by law, or where this is necessary on a temporary basis to enable our contractors to perform specific functions.
            </p>
            <p className="mb-2">
              Generally, Highlands will collect personal information directly from you, only to the extent necessary to provide a product or service, or to carry out our internal administrative operations. We may collect personal information from you when:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>You fill in an application form (including but not limited to expressions of interest, volunteer, nomination for ordination, course);</li>
              <li>Register for a conference or event;</li>
              <li>Make a donation;</li>
              <li>Open a new account or become a signatory with INC Invest;</li>
              <li>Acquiring goods or services;</li>
              <li>Register with Highlands;</li>
              <li>Access social media platforms;</li>
              <li>Participate in local church and ministry activities;</li>
              <li>Participate in surveys (including but not limited to feedback, National Church Life Surveys);</li>
              <li>Participate in personal assessment (including but not limited to personality, giftings, behaviourial);</li>
              <li>Pastoral, mentoring, supervision or coaching meetings;</li>
              <li>Deal with us over the telephone;</li>
              <li>E-mail us;</li>
              <li>Ask us to contact you after visiting our web site; or</li>
              <li>Have contact with us in person.</li>
            </ul>
            <p className="mb-2">
              You may also be able to transact with us anonymously where this is lawful and practicable. We will collect personal information from you by lawful and fair means and not in an unreasonably intrusive way. We will use your personal information only for the particular purpose that you provided it, or for a directly related purpose. We may otherwise use your personal information where that other use is:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Required or permitted by law; or</li>
              <li>With your express or implied consent.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">PASTORAL CARE & BROADER HIGHLANDS CONNECTEDNESS</h2>
            <p className="mb-4">
              If you provide your personal information to Highlands, you consent to being contacted generally for Pastoral Care and follow-up by Highlands.
            </p>
            <p>
              If you provide personal information to Highlands for any other reason, for example those stated above, this information may be shared within Highlands for the development of other products and services of Highlands, and to improve our general ability to assist church attendees and the wider community. The personal information collected through surveys is only used for analytical purposes.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">DIRECT MARKETING AND YOUR PRIVACY</h2>
            <p>
              From time to time, we may use the personal information we collect from you to advise you of, for example, conferences, events, products and/or services, which we believe may be of interest to you. We may then contact you to let you know about these products and services and how they may benefit you. We will generally only do this with your consent and we will always give you a choice to opt out of receiving such information in the future.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">DIRECT MAIL</h2>
            <p>
              Where we use your personal information to send you marketing information via the post we may do so with your implied consent or, if this is impracticable, we will ensure that you are provided with an opportunity to tick an "opt out" box to ensure you do not receive such future communications. By not ticking a clearly displayed "opt out" box, we will assume we have your implied consent to receive similar marketing communications in the future.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">ELECTRONIC MARKETING</h2>
            <p>
              Where we use your personal information to send you marketing information by e-mail, SMS, MMS or other electronic means we may do so with your express or implied consent. You may give us your express consent by, for example, ticking a box on an electronic or paper form where we seek your permission to send you electronic or other marketing information. Consent may be implied from our existing business relationship or where you have directly or indirectly provided us with your electronic address.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">VIDEOS/PHOTOGRAPHS</h2>
            <p>
              Images of individuals in photographs or film are treated as personal information under the Privacy Act where the person's identity is clear or can reasonably be worked out from that image. We uphold that all photographs and video footage of individuals will be used solely for Highlands related purposes including at times promotion. Both video and still photography are an active part of the church life, ministries, activities and services. Highlands uses video and still photography for church related purposes or promotions. In accordance with the privacy act an individual's consent will be sought if the photograph or video records sensitive information about the individual. Where practically possible Highlands will seek the consent of individuals in other cases. If you would like to have a video or still image removed from any material, please contact us using the contact details set out below.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">YOUR PRIVACY PREFERENCES AND CHOICES</h2>
            <p>
              Every personalised marketing contact sent or made by Highlands will include a means by which customers may opt out of receiving further marketing information. You may instruct us at any time to remove any previous consent you provided to receive marketing communications from us.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">INFORMATION SHARING</h2>
            <p className="mb-2">
              We have a strict duty to maintain the privacy of all personal information we hold about you. However, certain exceptions do apply. For example, where disclosure of your personal information is:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authorised or required by law, e.g. disclosure to various government departments and agencies such as the Australian Taxation Office, Centrelink, Child Support Agency or disclosure to courts under subpoena.</li>
              <li>In the public interest, e.g. where a crime, fraud or misdemeanour is committed or suspected, and disclosure against the customer's rights to confidentiality is justified.</li>
              <li>With your consent, this may be implied or express, verbal or written.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">USE OF THIRD-PARTY SERVICE PROVIDERS</h2>
            <p>
              When we temporarily provide personal information to companies who perform services for us, such as specialist information technology companies, mail houses or other contractors to Highlands we require those companies to protect your personal information as diligently as we do.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">UPDATING YOUR INFORMATION</h2>
            <p>
              It is inevitable that some personal information which we hold will become out of date. We will take reasonable steps to ensure that the personal information which we hold remains accurate and, if you advise us of a change of details, we will amend our records accordingly.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">ACCESS TO YOUR PERSONAL INFORMATION</h2>
            <p className="mb-4">
              Highlands will, upon your request, and subject to applicable privacy laws, provide you with access to your personal information that is held by us. However, we ask that you identify, as clearly as possible, the type/s of information requested.
            </p>
            <p>
              Highlands will deal with your request to provide access to your personal information within a reasonable time of receipt of your request. Highlands will not charge you for lodging such a request, but we may recover from you our reasonable costs incurred in supplying you with access to this information.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">EXCEPTIONS</h2>
            <p className="mb-2">
              Your right to access your personal information is not absolute. In certain circumstances, the law permits us to refuse your request to provide you with access to your personal information, such as circumstances where:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access would pose a serious threat to the life or health of any individual;</li>
              <li>Access would have an unreasonable impact on the privacy of others;</li>
              <li>The request is frivolous or vexatious;</li>
              <li>The information relates to a commercially sensitive decision making process;</li>
              <li>Access would be unlawful; or</li>
              <li>Access may prejudice enforcement activities, a security function or commercial negotiations.</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">COLLECTING SENSITIVE INFORMATION</h2>
            <p>
              Sometimes we may need to collect sensitive information about you, for example, to handle a complaint. This might include information about your health, racial or ethnic origin, political opinions, religious beliefs, sexual orientation or criminal history.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">SECURITY</h2>
            <p className="mb-4">
              Reasonable steps will be taken to keep secure any personal information which is held.
            </p>
            <p className="mb-4">
              Personal information, held electronically, is stored in a secure server or secure files.
            </p>
            <p className="mb-4">
              Security measures are taken to protect your information from unauthorised access and against unlawful processing, accidental loss, destruction and damage.
            </p>
            <p className="mb-4">
              Where we have given you, or where you have chosen security codes (username, password, memorable word or PIN), which enable you to use any online service, you are responsible for keeping these security details confidential.
            </p>
            <p>
              Should Highlands discover a breach of data held, reasonable steps will be taken to notify those affected by the breach as soon as possible including how the breach occurred, possible effect and data affected, time of breach/es and remedies taken in accordance with the Notifiable Data Breaches(NDB) scheme.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">CHANGING THIS POLICY</h2>
            <p>
              We may amend this Privacy Policy from time to time. Any amendments to this policy will be effective immediately once it is posted to our website at www.HighlandsChurch.au.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-medium text-[#6955A5] mb-4">CONTACT DETAILS AND CONCERNS</h2>
            <p className="mb-4">
              Highlands is committed to working to obtain a fair resolution of any complaint or concern about privacy. To contact us with a compliment or complaint or a privacy question, you can:
            </p>
            <p>
              Write to us at: PO Box 7239, Kearneys Spring QLD 4350 or call our Highlands office (07) 4617 6555.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy