/* eslint-disable local-rules/unwrapped-i18n */

/* eslint-disable local-rules/use-markdown */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { wishURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export default observer((props: BaseProps) => {
  const { className, style } = props;

  /*eslint-disable local-rules/unnecessary-list-usage*/

  /*eslint-disable local-rules/no-hardcoded-wish-link*/
  return (
    <div className={css(className, style)}>
      <p>
        <strong>
          These Merchant Terms of Service and Agreement were updated on December
          20, 2018. If you register on or after December 20, 2018, your use of
          the Services is governed by the terms below. If you registered before
          December 20, 2018, your use of the Services will be governed by the
          terms below as of December 27, 2018.
        </strong>
        &nbsp;
        <Link openInNewTab href="/terms-of-service-2016">
          To view the previous terms click here.
        </Link>
      </p>
      <h1>Merchant Terms of Service and Agreement</h1>
      <p>
        Please read these merchant terms of service and agreement (“terms of
        service,” “Terms” or “Agreement”) carefully before using the website,
        applications and services offered by ContextLogic Inc. (“Wish,” “we,”
        and “us”). This agreement sets forth the legally binding terms and
        conditions for your use as a merchant of our website(s), services or
        applications, including, without limitation, the website at
        https://www.wish.com and app offered under the name Wish, and the
        websites and apps offered by us, including without limitation under the
        names Geek, Cute, Home, and Mama (collectively, the “Services”).
      </p>
      <p>
        By registering for or otherwise using the Services in any manner,
        including but not limited to visiting or browsing the Services, you
        agree to be bound by these Terms, including those additional terms and
        conditions and policies referenced herein and/or published or made
        available by Wish.
      </p>
      <p>
        <strong>
          Please note that Paragraph 7, contains an arbitration clause and class
          action waiver. By agreeing to the Terms, you agree to resolve all
          disputes through binding individual arbitration, which means that you
          waive any right to have those disputes decided by a judge or jury, and
          that you waive your right to participate in class actions, class
          arbitrations, or representative actions. Please read Paragraph 7
          carefully.
        </strong>
      </p>
      <h2>1. Wish is a Marketplace</h2>
      <p>
        You understand and agree that Wish is a marketplace and as such is not
        responsible or liable for any content, data, text, information,
        usernames, graphics, images, photographs, profiles, audio, video, items,
        products, listings, links or information posted by you, other merchants
        or outside parties on Wish. You use the Services at your own risk.
      </p>
      <p>
        To the fullest extent permitted by law, you and your Affiliates (defined
        below) waive claims related to, and agree that Wish and Wish’s
        Affiliates, including any of their officers, directors, employees,
        consultants or agents, are not responsible for (a) any statements,
        guarantees, services in this agreement, and expected transactions,
        including merchantability, applying to particular purposes or any
        implied warranties; (b) implied warranties based on the transaction
        process, the performance of the contract or trading practices course of
        dealing; or (c) any duties, responsibilities, rights, claims or tort
        reliefs, whether or not they are due to Wish’s negligence. “Affiliate”“
        shall mean, with respect to any entity, any other entity that directly
        or indirectly controls, is controlled by, or is under common control
        with that entity.
      </p>
      <p>
        If you have disputes with any third party over any product, offering or
        interaction over the Services, you agree not to make any claim of any
        kind or nature against Wish or its Affiliates, no matter whether such
        claims, requirements or compensation of damages are known, ensured or
        released.
      </p>
      <h2>2. Membership Eligibility</h2>
      <p>
        <strong>Age:</strong>
        <span>
          Wish's Services are available only to, and may only be used by,
          individuals who are at least 18 years and who can form legally binding
          contracts under applicable law. You represent and warrant that you are
          at least 18 years old and that all registration information you submit
          is accurate and truthful. Wish may, in its sole discretion, refuse to
          offer access to or use of the Service to any person or entity or
          change its eligibility criteria at any time. This provision is void
          where prohibited by law and the right to access the Service is revoked
          in such jurisdictions.
        </span>
      </p>
      <p>
        Individuals under the age of 18 or who cannot form legally binding
        contracts must at all times use the Services only in conjunction with
        and under the supervision of a parent or legal guardian who is at least
        18 years of age. In this case, the adult is the merchant and is
        responsible for any and all activities.
      </p>
      <p>
        <strong>Compliance:</strong>
        <span>
          You agree to comply with all applicable laws regarding online conduct
          and acceptable content. Except as set forth in Paragraphs 15 and 16
          herein, you are responsible for all applicable taxes. In addition, you
          must abide by Wish's policies stated in these Terms and the Wish
          policy documents listed below (which are incorporated into these Terms
          by reference), each of which, in addition to these Terms, may be
          updated by Wish from time to time in its sole discretion without
          notice to you:
        </span>
      </p>
      <li>
        <Link openInNewTab href="/api-partner-terms-of-service">
          Wish API Terms of Service
        </Link>
      </li>
      <li>
        <Link openInNewTab href="/policy/home">
          Merchant Policies
        </Link>
        (including all subsections incorporated therein)
      </li>
      <li>
        <Link openInNewTab href="/tax/policy">
          Tax Policy
        </Link>
      </li>
      <li>
        <Link openInNewTab href="/policy/fees_and_payments">
          Fees and Payments Policy
        </Link>
      </li>
      <li>
        <Link openInNewTab href={wishURL("/return_policy")}>
          Return Policy
        </Link>
      </li>
      <li>
        <Link openInNewTab href={wishURL("/privacy_policy")}>
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link openInNewTab href="/policy#wish_express">
          Wish Express Qualifications and Terms
        </Link>
      </li>
      <li>
        <Link openInNewTab href="https://www.wishpost.cn/terms-of-service">
          WishPost
        </Link>
      </li>
      <li>
        All other policies or guidelines published or made available by Wish in
        connection with the Services.
      </li>
      <p>
        <span>
          As a legal person, you represent, warrant, promise and guarantee that
          during the period of registration and agreement: (a) you are legally
          established in accordance with applicable law, validly existing and in
          good operation; (b) you have all the necessary legal qualifications,
          rights, capabilities and authorities to sign this agreement, fulfill
          duties accordingly and grant rights, licensing and authority required
          by this agreement, and have the permissions, approvals and licenses
          required by your business and the sale of the items in the relevant
          countries; (c) you and your affiliates will comply with all laws to
          fulfill your rights and duties in this agreement; (d) when offering
          any items for sale through the Services, you are in full compliance
          with all legislation, statutes, regulations and other enactments
          having the force of law and all industry codes, policies or guidelines
          and any applicable direction, statement of practice, policy, rule or
          order given by a regulator which apply from time to time in the
          country from which or to which the items are sold and/or offered
          (“Applicable Laws and Regulations”); (e) you shall maintain such
          records as are necessary pursuant to such Applicable Laws and
          Regulations and shall promptly on request make them available for
          inspection by any relevant authority that is entitled to inspect them;
          (f) you shall monitor any changes in the Applicable Laws and
          Regulations which may impact the sale of the items through the
          Services; (g) you shall directly notify Wish by email and in writing
          of any investigation and potential claim that are instigated by any
          regulator in relation to the items offered through the Services; (h)
          you shall promptly remove any and all offerings of items from the
          Services whenever these infringe the Applicable Laws and Regulations,
          become otherwise prohibited in the relevant countries, and/or when
          these are included in (an updated version of) the Merchant Policies ;
          and (i) you and your financial institution(s) are not subject to
          sanctions or otherwise designated on any list of prohibited or
          restricted parties or owned or controlled by such a party, including
          but not limited to the lists maintained by the United Nations Security
          Council, the US Government (e.g., the US Department of Treasury’s
          Specially Designated Nationals list and Foreign Sanctions Evaders list
          and the US Department of Commerce’s Entity List), the European Union
          or its member states, or other applicable government authority.
        </span>
        &nbsp;
        <Link openInNewTab href="/policy/home">
          View Merchant Policies
        </Link>
      </p>
      <p>
        <span>
          Additionally, should you register an account, make purchases or
          otherwise use our Services in a capacity other than as a merchant,
          seller or distributor (e.g., as a purchasing consumer and/or retail
          customer), you agree to be bound by Wish’s Terms of Use and those
          Terms of Use shall govern such conduct.
        </span>
        &nbsp;
        <Link openInNewTab href={wishURL("/terms")}>
          View Terms of Use
        </Link>
      </p>
      <p>
        <strong>Modifications to Terms and Policies:</strong>
      </p>
      <p>
        We may modify any of the terms and conditions contained in this
        Agreement (or in any policy or guideline published by Wish) at any time
        and in our sole discretion. Any modifications will be effective upon the
        posting of a new set of terms on or within our Services (which we may do
        with or without notice to you). In some cases, we may notify you before
        or after such a change, including without limitation on any of our
        websites or in any merchant policy or other document, or by sending you
        an e-mail or other notification of such modifications. You are
        responsible for reviewing these locations and informing yourself of all
        applicable modifications, changes or notices.
      </p>
      <p>
        IF ANY MODIFICATION IS UNACCEPTABLE TO YOU, YOUR ONLY RECOURSE IS TO
        DISCONTINUE YOUR USE OF THE SERVICES. YOUR CONTINUED USE OF THE SERVICES
        FOLLOWING OUR POSTING OF A MODIFICATION (REGARDLESS OF WHETHER WE NOTIFY
        YOU OF SUCH MODIFICATION IN ADVANCE), WILL CONSTITUTE BINDING ACCEPTANCE
        OF THE MODIFICATION.
      </p>
      <p>
        <strong>Password & Account Security:</strong>
        <span>
          Keep your password secure. You are fully responsible for all activity,
          liability and damage resulting from your failure to maintain password
          confidentiality. You agree to immediately notify Wish of any
          unauthorized use of your password or any breach of security of your
          account. You also agree that Wish cannot and will not be liable for
          any loss or damage arising from your failure to keep your password
          secure or any breach of security of your account. You agree not to
          provide your username and password information in combination to any
          other party other than Wish without Wish's express written permission.
        </span>
      </p>
      <p>
        <strong>Account Information:</strong>
        <span>
          You must keep your account information up-to-date and accurate at all
          times, including a valid name, address, phone number and email
          address. To sell items on Wish you must provide and maintain valid
          payment information such as a valid PayPal account. You authorize us
          (and will provide us documentation evidencing your authorization upon
          our request) to verify your information (including any updated
          information), to obtain credit reports about you from time to time, to
          obtain credit authorizations from the issuer of your credit card, and
          to charge your credit card or debit your bank account for any sums
          payable by you to us (in reimbursement or otherwise). You also agree
          to provide Wish any additional information or authorizations as may be
          necessary for Wish to provide the Services under this Agreement. All
          payments to you will be remitted to your bank account through a
          banking network or by other means specified by us. Depending on the
          payment method you choose, you may be required to provide a valid
          United States tax identification number via Form W-9 or proof of
          residency outside the United States via Form W-8BEN/W-8BEN-E.
        </span>
      </p>
      <p>
        <strong>Account Transfer:</strong>
        <span>
          You may not transfer or sell your Wish merchant account and username
          to another party. If you are registering as a business entity, you
          personally guarantee that you have the authority to bind the entity to
          these Terms.
        </span>
      </p>
      <p>
        <strong>Right to Refuse Service:</strong>
        <span>
          Wish reserves the right, in Wish's sole discretion, to cancel
          unconfirmed or inactive accounts and/or to refuse to offer the
          Services to you, for any (or no) reason and at any time.
        </span>
      </p>
      <h2>3. Fees and Payment</h2>
      <h3>Fees:</h3>
      <p>
        <span>
          Wish will collect fees or other amounts from you, for your use of the
          Services, as set forth in its policy on Fees and Payments or as
          otherwise communicated to you by Wish. Except as set forth in
          Paragraphs 15 and 16 herein, you are responsible for paying all fees
          and applicable taxes associated with using and selling on Wish.
        </span>
        &nbsp;
        <Link openInNewTab href="/policy/fees_and_payments">
          View Fees and Payments
        </Link>
      </p>
      <p>
        The merchant also may incur fees through the use of various payment
        providers or processors. Any such payment provider or processor fees
        will be determined by any agreement the merchant may have with a payment
        provider or processor, and Wish is not responsible for reviewing,
        advising on, or paying any such fees.
      </p>
      <h3>Payment:</h3>
      <p>
        Wish will make payments to you, in connection with your use of the
        Services, as set forth in its policy on Fees and Payments or as
        otherwise communicated to you by Wish.
      </p>
      <p>
        Payment by Wish to you is considered made and complete upon transmission
        by Wish, of the payment amount owed to you, to the payment method you
        have selected (e.g., UMPAY, PayEco, AllPay, Payoneer, PayPal China,
        Bill.com, PingPong, or others as may be added or removed from time to
        time) irrespective of your receipt of payment from the payment provider
        or processor. Each payment provider or processor may have its own terms
        of use or other legal requirements, and Wish does not guarantee and is
        not responsible for any services provided by such payment provider or
        processor (including, without limitation, any remittance of payment,
        security protocols or obligations to the merchant, accurate and timely
        disbursal of payments to the merchant, nonavailbility of services, etc.,
        of such payment provider or processor). Risk of loss and nonpayment from
        the payment provider or processor remains with you as the merchant.
      </p>
      <p>
        In addition to the above, Wish may unilaterally elect to delay the
        remittance and withhold the amounts payable to merchants, or any other
        payment due under the terms of this Agreement or its policy on Fees and
        Payments, until such time as Wish receives confirmation of product
        delivery. Transactions for which Wish cannot confirm delivery may be
        ineligible for payment.
      </p>
      <p>
        In the event that Wish elects to remit an amount to you before the
        eligible payment date for such amount through a discretionary advance or
        advance made through your payment processor or provider (hereinafter a
        “Discretionary Advance”), Wish may reduce merchant’s payment eligibility
        by the amount of the Discretionary Advance either immediately or as soon
        thereafter as reasonably practicable.
      </p>
      <p>
        Moreover, If Wish determines that your actions or performance may result
        in returns, chargebacks, claims, disputes, violations of our terms or
        policies, or other risks to Wish or third parties, then Wish may in its
        sole discretion withhold any payments to you for as long as Wish
        determines any related risks to Wish or third parties persist. For any
        amounts that we determine you owe us, we may (a) charge your account or
        any payment instrument you provide to us; (b) offset any amounts that
        are payable by you to us (in reimbursement or otherwise) against any
        payments we may make to you or amounts we may owe you; (c) invoice you
        for amounts due to us, in which case you will pay the invoiced amounts
        upon receipt; (d) reverse any credits to you; or (e) collect payment or
        reimbursement from you by any other lawful means. If we determine that
        your account has been used to engage in deceptive, fraudulent, or
        illegal activity, or to violate our policies, then we may in our sole
        discretion permanently withhold any payments to you. In addition, we may
        require that you pay other amounts to secure the performance of your
        obligations under this Agreement or to mitigate the risk of returns,
        chargebacks, claims, disputes, violations of our terms or policies, or
        other risks to Wish or third parties. These amounts may be refundable or
        nonrefundable in the manner we determine, and failure to comply with
        terms of this Agreement, including any applicable policies, may result
        in their forfeiture.
      </p>
      <h2>4. Listing and Selling</h2>
      <p>
        <strong>Listing Description:</strong>
        <span>
          By listing an item on the Services you warrant that you and all
          aspects of the item comply with Wish's terms and published policies.
          You also warrant that you may legally sell the item in all locations
          that you list your item for sale. You must accurately describe your
          item and all terms of sale in your Wish shop. Your listings may only
          include text descriptions, graphics, pictures and other content
          relevant to the sale of that item. All items must be listed in an
          appropriate category with appropriate tags. Each listing must
          accurately and completely describe the item/items for sale in that
          listing. If the “in stock” quantity is more than one, all items in
          that listing must be identical.
        </span>
      </p>
      <p>
        <strong>Shop Policies:</strong>
        <span>
          You may outline shop policies for your Wish shop. These policies may
          include, for example, shipping, returns, payment and selling policies.
          You must create reasonable policies in good faith and must abide by
          such policies. All shop policies must comply with Wish's policies. You
          are responsible for enforcing your own shop policies. In the event of
          conflict between your shop policies and the Terms, the Terms shall
          control as it relates to your use of the Services.
        </span>
      </p>
      <p>
        <strong>Binding Sale:</strong> All sales are binding. You are obligated
        to ship the applicable order in a prompt manner after a sale is made
        over the Services or you otherwise complete the transaction with the
        applicable buyer. The cost arising from not completing orders in time
        shall be undertaken by you.
      </p>
      <p>
        Third-Party Service Providers: To the extent you use any third party to
        assist or facilitate any portion of your use of the Services, including
        without limitation your listings, sales, fulfillment, system
        notifications or changes, customer support or other functions, you agree
        that you shall be responsible for and Wish shall not be liable for any
        acts, conduct, errors, omissions, losses, claims or other issues
        resulting from your use of such third party’s services.
      </p>
      <p>
        <strong>Fee Avoidance:</strong>
        <span>
          The price stated in each item listing description must be an accurate
          representation of the sale. Sellers may charge reasonable shipping and
          handling fees to cover the costs for packaging and mailing the items.
          Sellers may not charge excessive shipping fees or otherwise avoid
          fees. You may not do anything intended to or having the effect of
          avoiding any fees due to Wish, or otherwise intended to violate these
          Terms, including without limitation, altering the item's price after a
          sale, misrepresenting the item's location, or using another merchant's
          account without permission.
        </span>
      </p>
      <p>
        <strong>Nonconformity, Defects or Other Issues with Items:</strong>
        <span>
          You are also responsible for any nonconformity or defect in, or any
          recall (public or private, voluntary or mandatory) of, as well as any
          other safety concerns related to, the items you list for sale. You
          will notify Wish as soon as you become aware of any recall related to
          your items.
        </span>
      </p>
      <p>
        If we determine that the performance of your obligations under this
        Agreement may result in returns, claims, disputes, violations of our
        terms or policies, or cause any other risks to Wish, its users or other
        third parties, then Wish (at its sole discretion) may mitigate such
        risks, including, without limitation, by issuing customer refunds,
        issuing penalties, withholding, offsetting or retaining amounts
        otherwise due to you, suspending your account or taking any other
        actions Wish deems appropriate for so long as Wish (in its sole
        discretion) believes your items might pose continued risks to Wish, its
        customers or other third parties.
      </p>
      <p>
        If you offer a product for sale through our Services that requires a
        warning under California Health & Safety Code Section 25249.6 (a
        “Proposition 65 Warning”) you (a) will provide in your listing such
        warning in the manner compliant with applicable law, (b) agree that our
        display of a Proposition 65 Warning on a product detail page is
        confirmation of our receipt of that warning, and (c) will only revise or
        remove a Proposition 65 Warning for a product when the prior warning is
        no longer legally required.
      </p>
      <h2>5. Prohibited, Questionable and Infringing Items and Activities</h2>
      <p>
        You are solely responsible for your conduct and activities on or
        relating to the Services and any and all data, text, information,
        usernames, graphics, images, photographs, profiles, audio, video,
        products, items, listings, and links that you submit, post or display on
        the Services (collectively, “Content”).
      </p>
      <p>
        Your Content, use of (or activity on) the Services, and products sold
        over the Services shall not:
      </p>
      <ol type="a">
        <li>Be false, inaccurate or misleading;</li>
        <li>
          Be obscene or contain unwarranted pornography, nudity, or adult
          material;
        </li>
        <li>
          Contain or transmit any code of a destructive nature that may damage,
          detrimentally interfere with, surreptitiously intercept or expropriate
          any system, data or personal information;
        </li>
        <li>Contain images that are not part of a product listing;</li>
        <li>
          Infringe upon any third-party's copyright, patent, trademark, trade
          secret or other proprietary or intellectual property rights or rights
          of publicity or privacy; such prohibited behavior includes (without
          limitation): 1) selling or displaying items portraying the likeness of
          a celebrity (including portraits, pictures, names, signatures and
          autographs); 2) selling or displaying items bearing a third-party
          brand or trademark that you are not authorized to display in such
          manner or 3) selling any pirated video or recording;
        </li>
        <li>
          <span>
            List any item on Wish (or consummate any transaction), link directly
            or indirectly to, reference or contain descriptions of goods or
            services that (i) are prohibited under these Terms, Wish’s Terms of
            Use, the Merchant Policies or are prohibited in any other policy
            documents as posted by Wish; (ii) are prohibited in any of the
            countries in which the items are offered for sale; or (iii) could
            cause Wish to violate any applicable law, statute, ordinance or
            regulation, or that violates this Terms or any document incorporated
            therein;
          </span>
          <br />
          <Link openInNewTab href={wishURL("/terms")}>
            View Terms of Use
          </Link>
          <br />
          <Link openInNewTab href="/policy/home">
            View Merchant Policies
          </Link>
        </li>
        <li>
          Violate these Terms, the policies referenced herein, the policies of
          app stores where Wish’s apps are available (including Google Play and
          the Apple App Store) or any applicable law, statute, ordinance or
          regulation (including, but not limited to, those governing export
          control, consumer protection, unfair competition, anti-discrimination
          or false advertising);
        </li>
        <li>
          Involve the sale of items that have been identified by the U.S.
          Consumer Products Safety Commission (CPSC) or any other regulator that
          has jurisdiction in the countries in which the items are offered as
          hazardous to consumers and therefore subject to a recall;
        </li>
        <li>
          Be defamatory, libelous, unlawfully threatening, unlawfully harassing,
          impersonate or intimidate any person (including Wish staff or other
          merchants), or falsely state or otherwise misrepresent your
          affiliation with any person, through for example, the use of similar
          email address, nicknames, or creation of false account(s) or any other
          method or device;
        </li>
        <li>
          Decompile, reverse engineer, disassemble or otherwise attempt to
          obtain the source code or underlying ideas or information of or
          relating to the Services;
        </li>
        <li>
          “Crawl,” “scrape,” or “spider” any page, data, or portion of or
          relating to the Services through any means;
        </li>
        <li>
          Violate the security of any computer network, or crack any passwords
          or security encryption codes;
        </li>
        <li>
          Modify, adapt or hack the Services or modify another website so as to
          falsely imply that it is associated with Wish;
        </li>
        <li>
          Post fraudulent, inaccurate or misleading reviews of merchants or
          items (and instead shall always disclose all information a reasonable
          shopper would want to know about your review, including whether you
          were provided any compensation or other benefit to write your review);
        </li>
        <li>
          Solicit business for, direct sales to, or promote any website,
          service, or entity outside of the Services; or
        </li>
        <li>
          Violate any export, import or trade control laws, regulations or
          orders applicable to the export, re-export, transfer, import, sale or
          use of Products sold under this Agreement (collectively, “Trade
          Control Laws”). Without limiting the foregoing, you shall not sell,
          transfer, export or re-export to, or otherwise provide Products under
          this Agreement, directly or indirectly, (i) to any country (or
          national or government thereof), state, territory, or region, that is
          subject to sanctions measures issued or adopted from time to time by
          U.S. Department of the Treasury’s Office of Foreign Assets Control
          (“OFAC”) (currently Cuba, Iran, North Korea, Syria, and the Crimea
          region of Ukraine) or any other applicable sanctions, including the
          sanctions laws of any other country with jurisdiction over Merchant
          (collectively, “Sanctions”); (ii) to any person to whom delivery is
          prohibited under Trade Control Laws or Sanctions, including, without
          limitation, to any person or entity identified on (A) the Denied
          Persons List as maintained by the U.S. Department of Commerce Bureau
          of Industry and Security or (B) the list of Specially Designated
          Nationals and Blocked Persons as maintained by OFAC, or (iii) for any
          end-use prohibited under Trade Control Laws or Sanctions, including,
          without limitation, for any missile, chemical weapons or nuclear end
          uses).
        </li>
      </ol>
      <p>
        If Wish determines in its sole discretion, suspects, or is informed that
        you are selling goods or engaging in acts in violation of the foregoing
        prohibited activities (including, without limitation, selling goods that
        are counterfeit, illegal, or violate third-party rights) then, without
        limiting any of Wish’s rights under these Terms or at law, Wish may in
        its sole discretion suspend, freeze, terminate or restrict your selling
        privileges, issue penalties against you, cause payments to you to be
        withheld or forfeit or take any other actions as Wish may deem to be
        appropriate or as may be required by law.
      </p>
      <h2>6. Content</h2>
      <p>
        <strong>License:</strong>
        <span>
          You hereby grant Wish a royalty-free, non-exclusive, worldwide,
          perpetual, sublicensable (through multiple tiers), irrevocable right
          and license to use, reproduce, perform, display, distribute, adapt,
          modify, excerpt, analyze, re-format, create derivative works of, and
          otherwise commercially or non-commercially exploit in any manner your
          Content in any medium or in any format and for any purpose, including,
          without limitation, for the advertising, marketing, or promotion of
          Wish or the Services. For the sake of clarity, nothing in the Terms
          will prevent or impair our right to use your Content without your
          consent to the extent that such use is allowable without a license
          from you or your Affiliates under applicable law (e.g., fair use under
          United States copyright law, referential use under trademark law, or
          valid license from a third party).
        </span>
      </p>
      <p>
        <strong>Reposting Content:</strong>
        <span>
          By posting Content on Wish, it is possible for an outside website or a
          third party to repost that Content. You agree to indemnify, defend and
          hold Wish harmless for any dispute relating to this use.
        </span>
      </p>
      <p>
        <strong>
          Privacy, Legal Requirements, Protection of Wish and Others:
        </strong>
      </p>
      <p>
        When you use the Services, such as when you fulfill a purchase, you may
        obtain personal information from or about a Wish user (“User Data”).
        Your use of User Data shall comply with applicable data protection law,
        including without limitation Europe’s General Data Protection
        Regulation. Unless you obtain a valid consent from the individuals
        described by User Data, you shall only use User Data in connection with
        the corresponding transaction with such user (e.g. shipping and
        fulfillment) or as necessary to meet your statutory legal requirements,
        such as tax and reporting requirements. You shall employ reasonable and
        appropriate measures to safeguard User Data from misuse, loss,
        destruction or unauthorized access or use. You acknowledge and agree
        that if Wish determines in good faith that additional agreements are
        necessary for compliance with applicable data protection law, you will
        promptly review and accept such agreements or cease using the Services
        or applicable portions thereof, such as sales into the European Union.
      </p>
      <p>
        Without limiting the foregoing, without express opt-in consent from the
        user, you shall not add any Wish user to your email or physical mail
        list, and shall not upload, access or use tracking technologies (such as
        browser cookies, web beacons or flash cookies) as part of any item
        listing. Wish does not assume any responsibilities for disputes between
        you and your customers for using customer information without
        authorization.
      </p>
      <p>
        <span>
          Furthermore, you acknowledge and agree that your own personal
          information will be collected and used as described in Wish's Privacy
          Policy. Wish reserves the right to access, read, preserve, and
          disclose any Content or other information that Wish in good faith
          believes is necessary to comply with law or court order; respond to
          legal, regulatory, or commercial claims; enforce or apply Wish’s
          policies, guidelines or other agreements; or protect the rights,
          property, or safety of Wish, its employees, users, or others. In
          connection with your use of the Services, and subject to the above,
          you understand and agree that Wish may disclose certain information
          about you to suppliers, consumers, regulators or other third-parties,
          including without limitation your:
        </span>
      </p>
      <ul>
        <li>Name</li>
        <li>Email Address</li>
        <li>Payment Method or Financial Account Information</li>
        <li>Shipping Address</li>
        <li>Phone Number</li>
        <li>Social network account credentials</li>
        <li>Sales Information</li>
        <li>Wish identifications or usernames</li>
      </ul>
      <Link openInNewTab href={wishURL("/privacy_policy")}>
        View Privacy Policy
      </Link>
      <h2>7. Arbitration and Class Action Waiver</h2>
      <h3>ARBITRATION:</h3>
      <p>
        PLEASE READ THE FOLLOWING ARBITRATION AGREEMENT IN THIS SECTION
        (“ARBITRATION AGREEMENT”) CAREFULLY. IT REQUIRES YOU TO ARBITRATE MOST
        DISPUTES WITH WISH AND MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS.
      </p>
      <p>
        YOU AND WISH AGREE THAT ANY DISPUTE, CONTROVERSY, OR CLAIM ARISING OUT
        OF, OR RELATING TO YOUR USE OF WISH, TO ANY PRODUCTS OR SERVICES SOLD OR
        DISTRIBUTED BY OR THROUGH WISH, TO THESE TERMS, OR TO THE CONTENT,
        AND/OR USER SUBMISSION (PUBLIC, PERSONAL AND/OR LIMITED AUDIENCE) ON
        WISH SHALL BE RESOLVED ONLY BY FINAL AND BINDING, BILATERAL ARBITRATION,
        subject to the exceptions below.
      </p>
      <p>
        You and Wish agree that these Terms affect interstate commerce and the
        Federal Arbitration Act, 9 U.S.C. § 1, et seq., and federal arbitration
        law apply to this agreement and govern all questions as to whether a
        dispute is subject to arbitration.
      </p>
      <p>
        “Disputes” shall include, but are not limited to, any claims or
        controversies between you and Wish against each other related in any way
        to or arising out of in any way from the Service, the Content,
        Submissions (Public, Personal, and/or Limited Audience), including but
        not limited to sales, returns, refunds, cancellations, defects,
        policies, privacy, advertising, or any communications between you and
        Wish, even if the claim arises after you or Wish has terminated the
        Services or a user account. Disputes also include, but are not limited
        to, claims that: (a) you bring against our employees, agents,
        affiliates, or other representatives; or (b) that Wish brings against
        you. Disputes also include, but are not limited to, (i) claims in any
        way related to or arising out of any aspect of the relationship between
        you and Wish, whether based in contract, tort, statute, fraud, warranty,
        misrepresentation, advertising claims, or any other legal theory; (ii)
        claims that arose before these Terms or out of a prior set of Terms with
        Wish; (iii) claims that are subject to on-going litigation where you are
        not a party or a class member; and/or (iv) claims that arise after the
        termination of these Terms.
      </p>
      <h4>Initial Dispute Resolution</h4>
      <p>
        Most disputes can be resolved without resorting to arbitration. In the
        event of a dispute, you and Wish each agree to first provide the other a
        written notice (“Notice of Dispute”), which shall contain: (a) a written
        description of the problem and relevant documents and supporting
        information; (b) a statement of the specific relief sought; and (c) the
        contact information of the party giving it. A Notice of Dispute must be
        sent to: One Sansome Street, San Francisco, CA 94104 or emailed at
        support@wish.com. Wish will provide a Notice of Dispute to you via the
        email address associated with your Wish User ID, Merchant ID, or other
        information provided to Wish by you.
      </p>
      <p>
        You and Wish agree to use their best efforts to resolve the Dispute
        through consultation with one another, and good faith negotiations shall
        be a condition to either party initiating a lawsuit or arbitration. If
        an agreement cannot be reached within forty-five (45) days of receipt of
        the Notice of Dispute, you or Wish may commence an arbitration
        proceeding.
      </p>
      <p>
        Notwithstanding the foregoing, disputes concerning patents, copyrights,
        moral rights, trademarks, and trade secrets and claims of piracy or
        unauthorized use of the Services shall not be subject to arbitration,
        and the notice and good faith negotiation required by this paragraph
        shall not apply to these types of disputes.
      </p>
      <h4>Binding Arbitration Process and Procedure</h4>
      <p>
        Except as provided herein, if we cannot resolve a dispute informally:
        (1) if you reside in the United States, any dispute will be resolved
        only by binding arbitration to be held in the county in which you reside
        or any other location agreed upon between you and Wish in writing; and
        (2) if you reside outside the United States, you understand and agree
        that arbitration shall be initiated in San Francisco, California. Wish
        and you further agree to submit to the personal jurisdiction of any
        state or federal court in San Francisco, California to compel
        arbitration, stay proceedings pending arbitration, or to confirm,
        modify, vacate, or enter judgment on the award entered by the
        arbitrator. The parties agree to cooperate regarding the enforcement of
        any arbitration judgment rendered in accordance with this Agreement,
        including in connection with the enforcement of such judgment in any
        country outside the United States as applicable.
      </p>
      <p>
        <span>
          To begin an arbitration proceeding, you must send a letter requesting
          arbitration and describing your claim to General Counsel, ContextLogic
          Inc., One Sansome Street, 33rd Fl, San Francisco, CA 94104. The
          arbitration will be conducted by a single arbitrator. Disputes
          involving claims and counterclaims with an amount in controversy under
          $250,000, not inclusive of attorneys' fees and interest, shall be
          subject to JAMS' most current version of the Streamlined Arbitration
          Rules and procedures available at
          http://www.jamsadr.com/rules-streamlined-arbitration/ ; all other
          claims shall be subject to JAMS's most current version of the
          Comprehensive Arbitration Rules and Procedures, available at
          http://www.jamsadr.com/rules-comprehensive-arbitration/ . JAMS's rules
          are also available at www.jamsadr.com or by calling JAMS at
          800-352-5267. If JAMS is not available to arbitrate, the parties will
          select an alternative arbitral forum. If there is a conflict between
          the JAMS Rules (or the rules of the alternative arbitral forum
          selected by the parties) and the rules set forth in this Agreement,
          the rules set forth in this Agreement will govern.
        </span>
        &nbsp;
        <strong>
          ARBITRATION MEANS THAT YOU WAIVE YOUR RIGHT TO A JURY TRIAL.
        </strong>
        &nbsp;
        <span>
          You may, in arbitration, seek any and all remedies otherwise available
          to you pursuant to your state’s law.
        </span>
      </p>
      <Link
        openInNewTab
        href="http://www.jamsadr.com/rules-streamlined-arbitration/"
      >
        http://www.jamsadr.com/rules-streamlined-arbitration/
      </Link>
      <br />
      <Link
        openInNewTab
        href="http://www.jamsadr.com/rules-comprehensive-arbitration/"
      >
        http://www.jamsadr.com/rules-comprehensive-arbitration/
      </Link>
      <br />
      <Link openInNewTab href="http://www.jamsadr.com">
        www.jamsadr.com
      </Link>
      <br />
      <p>
        To the extent the filing fee for the arbitration exceeds the cost of
        filing a lawsuit, Wish will pay the additional cost. Wish shall also
        bear the cost of any arbitration fees, unless the arbitrator finds your
        claims, defenses, or other fee-generating activity to be asserted or
        conducted for an improper purpose or frivolous. You are responsible for
        all other additional costs that you may incur in the arbitration
        including, without limitation, attorney’s fees and expert witness costs
        unless Wish is specifically required to pay such fees under applicable
        law.
      </p>
      <p>
        If Wish’s or your claim is solely for monetary relief of $10,000 or less
        and does not include a request for any type of equitable remedy, the
        party bringing the claim may choose whether the arbitration of the claim
        will be conducted through a telephonic hearing, or by an in-person
        hearing under the JAMS Rules, solely based on documents submitted to the
        arbitrator.
      </p>
      <p>
        You or Wish may choose to pursue a claim in small claims court with
        jurisdiction and venue over you if Wish otherwise qualifies for such
        small claims court and the claim does not include a request for any type
        of equitable relief. However, if you decide to pursue a claim in small
        claims court, you agree to still provide Wish with advance notice by
        email to support@wish.com and by U.S. Mail to General Counsel,
        ContextLogic Inc., One Sansome Street, 33rd Fl, San Francisco, CA 94104.
      </p>
      <p>
        These Terms and this Arbitration Agreement do not prevent you from
        bringing your Dispute to the attention of any federal, state, or local
        government agency. Such agencies can, if the law allows, seek relief
        against Wish on your behalf.
      </p>
      <h4>Authority of Arbitrator</h4>
      <p>
        The arbitrator, and not any federal, state or local court or agency
        shall have exclusive authority to resolve any dispute related to the
        interpretation, applicability, enforceability or formation of this
        Arbitration Agreement including, but not limited to any claim that all
        or any part of this Arbitration Agreement is void or voidable. The
        arbitrator will decide the rights and liabilities, if any, of you and
        Wish. The arbitration proceeding will not be consolidated with any other
        matters or joined with any other proceedings or parties. The arbitrator
        shall have the authority to grant motions dispositive of all or part of
        any claim or dispute. The arbitrator shall have the authority to award
        monetary damages and to grant any non-monetary remedy or relief
        available to an individual under applicable law, the arbitral forum's
        rules, and these Terms (including the Arbitration Agreement). The
        arbitrator shall issue a written award and statement of decision
        describing the essential findings and conclusions on which any award (or
        decision not to render an award) is based, including the calculation of
        any damages awarded. The arbitrator shall follow the applicable law. The
        arbitrator has the same authority to award relief on an individual basis
        that a judge in a court of law would have. The award of the arbitrator
        is final and binding upon you and us.
      </p>
      <h4>Waiver of Jury Trial</h4>
      <p>
        YOU AND WISH HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE
        IN COURT (OTHER THAN SMALL CLAIMS COURT AS PERMITTED HEREIN) AND HAVE A
        TRIAL IN FRONT OF A JUDGE OR A JURY. You and Wish are instead electing
        that all covered claims and disputes shall be resolved by arbitration
        under this Arbitration Agreement, except as specified in above. An
        arbitrator can award on an individual basis the same damages and relief
        as a court and must follow these Terms as a court would. However, there
        is no judge or jury in arbitration, and court review of an arbitration
        award is subject to very limited review.
      </p>
      <h4>30-Day Right to Opt Out</h4>
      <p>
        You have the right to opt out of the provisions of this Arbitration
        Agreement by sending a timely written notice of your decision to opt out
        to the following address: General Counsel, ContextLogic Inc., One
        Sansome Street, 33rd Fl, San Francisco, CA 94104, or by email to{" "}
        support@wish.com, within 30 days after first becoming subject to this
        Arbitration Agreement. Your notice must include your name and address,
        your Wish User ID (if any), Wish Merchant ID, the email address you used
        to set up your Wish account (if you have one), and a clear statement
        that you want to opt out of this Arbitration Agreement. If you opt out
        of this Arbitration Agreement, all other parts of this Agreement will
        continue to apply to you. Opting out of this Arbitration Agreement has
        no effect on any other arbitration agreements that you may currently
        have with us, or may enter into in the future with us.
      </p>
      <h4>Parents, Subsidiaries, Affiliates</h4>
      <p>
        This Arbitration Agreement will also apply to any claims asserted by you
        against any present or future parent, subsidiary, or Affiliate of Wish,
        or any employee, officer, director, or investor of Wish, and to any
        claims asserted by any of them against you, to the extent that any such
        claims arise out of or relate to these Terms (such as with respect to
        their validity or enforceability), the Services, any person’s access to
        and/or use of the Services, and/or the provision of content, products,
        services, and/or technology on or through the Services.
      </p>
      <h4>Changes to This Section</h4>
      <p>
        Wish will provide thirty (30) days' notice of any changes to this
        section by posting on the Wish Services, sending you a message, or
        otherwise notifying you when you are logged into your account.
        Amendments will become effective thirty (30) days after they are posted
        on the Wish website or sent to you.
      </p>
      <p>
        Changes to this section will otherwise apply prospectively only to
        claims arising after the thirtieth (30th) day. If a court or arbitrator
        decides that this subsection on “Changes to This Section” is not
        enforceable or valid, then this subsection shall be severed from the
        sections entitled “Arbitration” and “Class Waiver” and the court or
        arbitrator shall apply the first Arbitration and Class Action Waiver
        sections in existence after you began using the Services.
      </p>
      <h4>Severability</h4>
      <p>
        Subject to the section entitled “Waiver of Class or Consolidated
        Actions,” if any part or parts of this Arbitration Agreement are found
        under the law to be invalid or unenforceable, then such specific part or
        parts shall be of no force and effect and shall be severed and the
        remainder of the Arbitration Agreement shall continue in full force and
        effect.
      </p>
      <h4>Survival of Arbitration Agreement</h4>
      <p>
        This Arbitration Agreement will survive the termination or expiration of
        these Terms or your relationship with Wish.
      </p>
      <h3>WAIVER OF CLASS OR CONSOLIDATED ACTIONS:</h3>
      <p>
        <strong>
          PLEASE READ THIS SECTION CAREFULLY. IT MAY SIGNIFICANTLY AFFECT YOUR
          LEGAL RIGHTS.
        </strong>
      </p>
      <p>
        Wish and you agree that any dispute will be brought in an individual
        capacity, and not on behalf of, or as part of, any purported class,
        consolidated, or representative proceeding. Wish and you further agree
        to not participate in any consolidated, class, or representative
        proceeding (existing or future) brought by any third party arising out
        of or relating to any dispute with a third party.
      </p>
      <p>
        The arbitrator cannot combine more than one person’s or entity’s claims
        into a single case, and cannot preside over any consolidated, class or
        representative proceeding (unless we agree otherwise). And, the
        arbitrator’s decision or award in one person’s or entity’s case can only
        impact the person or entity that brought the claim, not other Wish
        users, and cannot be used to decide other disputes with other users.
      </p>
      <p>
        If any court or arbitrator determines that the
        class/consolidated/representative action waiver set forth in this
        section is void or unenforceable for any reason or that arbitration can
        proceed on a class, consolidated, or representative basis, then the
        disputes, claims, or controversies will not be subject to arbitration
        and must be litigated in federal court located in San Francisco,
        California, or in another forum as agreed upon between you and Wish in
        writing.
      </p>
      <p>
        If any clause within this Waiver of Class or Consolidated Actions
        Section is found to be illegal or unenforceable, that specific clause
        will be severed from this section, and the remainder of its provisions
        will be given full force and effect.
      </p>
      <p>
        This Waiver of Class or Consolidated Actions Section will also apply to
        any claims asserted by you against any present or future parent,
        subsidiary or Affiliate of Wish, or any employee, officer, director, or
        investor of Wish, and to any claims asserted by any of them against you,
        to the extent that any such claims is a dispute.
      </p>
      <p>
        This Waiver of Class or Consolidated Actions Section shall survive any
        termination of your account or the Services.
      </p>
      <p>
        Wish may try to help you resolve disputes with third parties. Wish does
        so in Wish's sole discretion, and Wish has no obligation to resolve
        disputes between you and other users or between you and outside parties.
      </p>
      <p>
        In the event that you have a dispute with one or more other users or
        other outside parties, you release Wish, its officers, employees,
        agents, and successors from claims, demands, and damages of every kind
        or nature, known or unknown, suspected or unsuspected, disclosed or
        undisclosed, arising out of or in any way related to such disputes
        and/or our Services.
      </p>
      <h4>Release</h4>
      <p>
        IF YOU ARE A CALIFORNIA RESIDENT, YOU SHALL AND HEREBY DO WAIVE
        CALIFORNIA CIVIL CODE SECTION 1542, WHICH SAYS: “A GENERAL RELEASE DOES
        NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO
        EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH, IF KNOWN
        BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR.” IF
        YOU ARE NOT A CALIFORNIA RESIDENT, YOU WAIVE YOUR RIGHTS UNDER ANY
        STATUTE OR COMMON LAW PRINCIPLE SIMILAR TO SECTION 1542 THAT GOVERNS
        YOUR RIGHTS IN THE JURISDICTION OF YOUR RESIDENCE.
      </p>
      <p>
        If Wish has posted or provided a translation of the English language
        version of the Terms, you agree that the translation is provided for
        convenience only and that the English language version will govern your
        uses of the Services or the Sites.
      </p>
      <h2>8. Wish's Intellectual Property</h2>
      <p>
        The materials displayed or performed or available on or through the
        Services, including, but not limited to, text, graphics, data, articles,
        photos, images, illustrations, user submissions, and so forth are
        protected by copyright and/or other intellectual property laws. You
        promise to abide by all copyright notices, trademark rules, information,
        and restrictions contained in such content you access through the
        Services, and you won’t use, copy, reproduce, modify, create derivative
        works from, translate, publish, broadcast, transmit, distribute,
        perform, upload, display, license, sell or otherwise exploit for any
        purpose any content not owned by you, (i) without the prior consent of
        the owner of that content or (ii) in a way that violates someone else’s
        (including Wish’s) rights.
      </p>
      <h2>9. Access and Interference</h2>
      <p>
        Much of the information on Wish is updated on a real-time basis and is
        proprietary or is licensed to Wish by Wish's merchants or third-parties.
        You agree that you will not use any robot, spider, scraper or other
        automated means to access Wish for any purpose whatsoever, except to the
        extent expressly permitted by and in compliance with these Terms and
        Wish's API Terms of Service , without Wish's prior express written
        permission. Additionally, you agree that you will not:
      </p>
      <ul>
        <li>
          Take any action that imposes, or may impose, in Wish's sole
          discretion, an unreasonable or disproportionately large load on Wish's
          infrastructure; or
        </li>
        <li>
          Interfere or attempt to interfere with the proper working of the
          Services or any activities conducted on the Services.
        </li>
      </ul>
      <Link openInNewTab href="/api-partner-terms-of-service">
        View Wish's API Terms of Service
      </Link>
      <h2>10. Breach</h2>
      <p>
        Without limiting any other remedies, Wish may, without notice, and
        without refunding any fees, delay or immediately remove Content, warn
        Wish's community of your actions, issue a warning to you, restrict your
        selling privileges, prohibit your access to the Services, temporarily or
        indefinitely suspend or freeze your account privileges, terminate your
        account, issue penalties against you, cause payments to you to be
        withheld or forfeit, take any other actions as may be required by law,
        and/or take technical and legal steps to keep you off the Services if:
        you breach these Terms (including, without limitation, any terms or
        policies incorporated herein); Wish is unable to verify or authenticate
        any of your personal information or Content; or Wish believes that you
        are acting inconsistently with the letter or spirit of Wish's policies,
        have engaged in improper or fraudulent activity in connection with Wish
        or your actions may cause legal liability or financial loss to Wish or
        other merchants using the Services.
      </p>
      <h2>11. Warranty Disclaimer</h2>
      <p>
        TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, ALL SERVICES ARE
        PROVIDED ON AN “AS IS” AND “AS-AVAILABLE” BASIS, WITHOUT ANY WARRANTY OR
        CONDITION, EXPRESS, IMPLIED OR STATUTORY, OF ANY KIND. TO THE FULLEST
        EXTENT ALLOWED BY APPLICABLE LAW, WISH (FOR ITSELF AND ITS AFFILIATES
        AND LICENSORS) EXPRESSLY DISCLAIMS ALL WARRANTIES, REPRESENTATIONS, AND
        CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT
        LIMITATION IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, PERFORMANCE,
        FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT, OR THAT USE OF THE
        SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE. IN ADDITION, NO ADVICE OR
        INFORMATION (ORAL OR WRITTEN) OBTAINED BY YOU FROM WISH SHALL CREATE ANY
        WARRANTY.
      </p>
      <p>
        YOU ACKNOWLEDGE AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY
        APPLICABLE LAW, YOU ASSUME FULL RESPONSIBILITY FOR YOUR USE OF THE
        SERVICES AND THAT ANY INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF
        THE SERVICES MAY NOT BE SECURE AND MAY BE INTERCEPTED OR OTHERWISE
        ACCESSED BY UNAUTHORIZED PARTIES. YOU AGREE THAT, TO THE FULLEST EXTENT
        PERMITTED BY APPLICABLE LAW, WISH IS NOT RESPONSIBLE FOR ANY LOSS OR
        DAMAGE TO YOUR PROPERTY OR DATA THAT RESULTS FROM ANY MATERIALS YOU
        ACCESS OR DOWNLOAD FROM THE SERVICES.
      </p>
      <p>
        IF YOU RELY ON ANY DATA OR INFORMATION OBTAINED THROUGH THE SERVICES,
        YOU DO SO AT YOUR OWN RISK. YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGE OR
        LOSS THAT RESULTS FROM YOUR USE OF SUCH DATA OR INFORMATION.
      </p>
      <p>
        CERTAIN JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES. IF
        THESE LAWS APPLY TO YOU, SOME OR ALL OF THE FOREGOING DISCLAIMERS,
        EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MIGHT HAVE
        ADDITIONAL RIGHTS.
      </p>
      <h2>12. Liability Limit</h2>
      <p>
        TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, UNDER NO CIRCUMSTANCES
        AND UNDER NO LEGAL THEORY (INCLUDING, WITHOUT LIMITATION, TORT,
        CONTRACT, WARRANTY, STRICT LIABILITY, OR OTHERWISE) SHALL WISH (OR ITS
        AFFILIATES OR LICENSORS) BE LIABLE TO YOU OR TO ANY OTHER PERSON FOR ANY
        INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND,
        INCLUDING DAMAGES FOR LOST PROFITS, LOSS OF GOODWILL, WORK STOPPAGE,
        ACCURACY OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION ARISING OUT OF
        OR IN ANY WAY RELATED TO THE SERVICES OR YOUR USE OF OR INABILITY TO USE
        THE SERVICES, EVEN IF WISH, ITS AFFILIATES OR ANY OTHER PERSON HAS BEEN
        ADVISED OF THE POSSIBILITY OF THOSE COSTS OR DAMAGES.
      </p>
      <p>
        THIS DISCLAIMER APPLIES, WITHOUT LIMITATION, TO ANY DAMAGES OR INJURY
        ARISING FROM ANY FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION,
        DELETION, DEFECTS, DELAY IN OPERATION OR TRANSMISSION, COMPUTER VIRUSES,
        FILE CORRUPTION, COMMUNICATION-LINE FAILURE, NETWORK OR SYSTEM OUTAGE,
        YOUR LOSS OF PROFITS, ANY THEFT, DESTRUCTION, UNAUTHORIZED ACCESS TO,
        ALTERATION OF, LOSS OR USE OF, ANY RECORD OR DATA, AND ANY OTHER
        TANGIBLE OR INTANGIBLE LOSS.
      </p>
      <p>
        YOU SPECIFICALLY ACKNOWLEDGE AND AGREE THAT WISH SHALL NOT BE LIABLE FOR
        ANY DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY USER OF THE
        SERVICES.
      </p>
      <p>
        UNDER NO CIRCUMSTANCES WILL THE TOTAL AGGREGATE AMOUNT THAT WISH IS
        LIABLE TO YOU EXCEED (I) $100 OR (II) THE AMOUNTS PAID BY YOU TO WISH IN
        CONNECTION WITH THE SERVICES IN THE THREE (3) MONTH PERIOD PRECEDING
        THIS APPLICABLE CLAIM.
      </p>
      <p>
        THE LIMITATIONS OF DAMAGES SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF
        THE BASIS OF THE BARGAIN BETWEEN WISH AND YOU.
      </p>
      <p>
        CERTAIN JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR
        THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO
        YOU DESPITE THE “GOVERNING LAW” SECTION OF THESE TERMS, THE ABOVE
        APPLIES ONLY TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
      </p>
      <h2>13. Indemnity</h2>
      <p>
        TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, YOU RELEASE US AND
        AGREE TO INDEMNIFY, DEFEND AND HOLD WISH, ITS AFFILIATES, OFFICERS,
        AGENTS, EMPLOYEES, AND PARTNERS HARMLESS FROM AND AGAINST ANY AND ALL
        CLAIMS, LIABILITIES, DAMAGES (ACTUAL AND CONSEQUENTIAL), LOSSES AND
        EXPENSES (INCLUDING ATTORNEYS’ FEES) ARISING FROM OR IN ANY WAY RELATED
        (A) YOUR ACTUAL OR ALLEGED BREACH OF ANY OBLIGATIONS IN THIS AGREEMENT;
        (B) YOUR PRODUCTS, SERVICES OR CONTENT, INCLUDING, WITHOUT LIMITATION,
        ANY ACTUAL OR ALLEGED INFRINGEMENT OR VIOLATION OF ANY INTELLECTUAL
        PROPERTY RIGHTS, VIOLATION OF ANY PRIVACY RIGHT OR THIRD-PARTY
        AGREEMENT, VIOLATION OF ANY APPLICABLE LAWS, RULES, OR REGULATIONS,
        PERSONAL INJURY, DEATH OR PROPERTY DAMAGE RELATED THERETO; (C) YOUR USE
        OF THE SERVICES (INCLUDING ANY ACTIONS TAKEN BY A THIRD PARTY USING YOUR
        ACCOUNT); AND (D) YOUR TAXES (AS DEFINED BELOW). YOU WILL USE COUNSEL
        REASONABLY SATISFACTORY TO US TO DEFEND EACH INDEMNIFIED CLAIM. IF AT
        ANY TIME WE REASONABLY DETERMINE THAT ANY INDEMNIFIED CLAIM MIGHT
        ADVERSELY AFFECT US, WE MAY TAKE CONTROL OF THE DEFENSE AT OUR EXPENSE.
        YOU MAY NOT CONSENT TO THE ENTRY OF ANY JUDGMENT OR ENTER INTO ANY
        SETTLEMENT OF A CLAIM WITHOUT OUR PRIOR WRITTEN CONSENT.
      </p>
      <p>
        <span>
          “Your Taxes” means any and all sales, goods and services, use, excise,
          premium, import, export, value added, consumption, and other taxes,
          regulatory fees, levies (specifically including environmental levies),
          or charges and duties assessed, incurred, or required to be collected
          or paid for any reason in connection with your use of the Services,
          any advertisement, offer or sale of products, services or Content by
          you on or through or in connection with the Services. This defined
          term also means any of the types of taxes, duties, levies, or fees
          mentioned above that are imposed on or collectible by Wish or any of
          its Affiliates in connection with or as a result of fulfillment
          services including the storage of inventory or packaging of products,
          services or Content and other materials owned by you and stored by
          Wish, shipping, or other actions by Wish. “Your Taxes,” however, does
          not include any taxes collected and remitted by Wish as disclosed in
          the Tax Policy.
        </span>
        &nbsp;
        <Link openInNewTab href="/tax/policy">
          View Tax Policy
        </Link>
      </p>
      <h2>14. Insurance</h2>
      <p>
        If requested by Wish, then within thirty (30) days thereafter, you will
        maintain at your expense throughout the remainder of the Term general
        commercial, umbrella or excess liability insurance with the limits per
        occurrence and in aggregate requested by us covering liabilities caused
        by or occurring in conjunction with the operation of your business,
        including products, products/completed operations and bodily injury,
        with policy(ies) naming Wish and its Affiliates and assignees as
        additional insureds. At our request, you will provide to us certificates
        of insurance for the coverage.
      </p>
      <h2>15. Taxes; Legal Compliance</h2>
      <p>
        As between the parties, you will be responsible for the collection,
        reporting, and payment of any and all of Your Taxes, except to the
        extent that Wish chooses or is required to calculate, collect, and remit
        taxes according to applicable law.
      </p>
      <p>
        Notwithstanding or limiting in any way the foregoing, you shall comply
        with all applicable domestic and international laws, statutes,
        ordinances and regulations regarding your use of any Service and, if
        applicable, your listing, solicitation of offers to purchase, and sale
        of items. In addition, you will be responsible for paying, withholding,
        filing, and reporting all taxes, duties, and other governmental
        assessments associated with your activity in connection with the
        Services, provided that the Wish may, in its sole discretion, do any of
        the foregoing on your behalf or for itself as it sees fit.
      </p>
      <h2>16. Customs Duty and Indirect Taxes</h2>
      <p>
        In an effort to remain compliant with respective consumer legislations,
        we strongly encourage you to maintain good standing with respect to
        customs and indirect taxes, where applicable.
      </p>
      <p>
        Due to separate and applicable tax jurisdictions, purchases may be
        subject to specific sales, customs duty, goods and services taxes (GST)
        or value-added taxes (VAT), and the shipping time and associated cost
        may increase.
      </p>
      <p>
        In an effort to maintain compliance with U.S. or international tax law,
        Wish may require you to provide a valid indirect tax registration number
        to sell on our marketplace, and you may be required to remit indirect
        taxes as the result of conducting business. As a result, we strongly
        encourage you to consult your own tax experts and register for indirect
        taxes based on your acts and circumstances.
      </p>
      <p>
        <span>
          You agree that you are responsible for all indirect tax collection and
          payment among all parties of this agreement, unless Wish chooses to
          collect and remit tax as disclosed in its Tax Policy.
        </span>
        &nbsp;
        <Link openInNewTab href="/tax/policy">
          View Tax Policy
        </Link>
      </p>
      <h2>17. Severability</h2>
      <p>
        If any provision of these Terms is held unenforceable, then such
        provision will be modified to reflect the parties' intention. All
        remaining provisions of these Terms shall remain in full force and
        effect.
      </p>
      <h2>18. Survival</h2>
      <p>
        Provisions that, by their nature, should survive termination of these
        Terms shall survive termination. By way of example, all of the following
        will survive termination: any obligation you have to pay us or indemnify
        us, any limitations on our liability, any terms regarding Wish’s
        ownership or intellectual property rights or any terms regarding
        disputes between us. The failure of either you or us to exercise, in any
        way, any right herein shall not be deemed a waiver of any further rights
        hereunder.
      </p>
      <h2>19. Export</h2>
      <p>
        You will not directly or indirectly export, re-export, transmit, or
        cause to be exported, re-exported or transmitted, any commodities,
        software or technology to any country, individual, corporation,
        organization, or entity to which such export, re-export, or transmission
        is restricted or prohibited, including any country, individual,
        corporation, organization, or entity under sanctions or embargoes
        administered by the United Nations, US Departments of State, Treasury or
        Commerce, the European Union, or any other applicable government
        authority.
      </p>
      <h2>20. Confidentiality</h2>
      <p>
        During the course of your use of the Services, you may receive
        information relating to us or to the Services that is not known to the
        general public (“Confidential Information”). You agree that: (a) all
        Confidential Information will remain Wish's exclusive property; (b) you
        will use Confidential Information only as is reasonably necessary for
        your participation in the Services; (c) you will not otherwise disclose
        Confidential Information to any other person or entity; and (d) you will
        take all reasonable measures to protect the Confidential Information
        against any use or disclosure that is not expressly permitted in this
        Agreement. You may not issue any press release or make any public
        statement related to the Services, or use our name, trademarks, or logo,
        in any way (including in promotional material) without our advance
        written permission, or misrepresent or embellish the relationship
        between us in any way.
      </p>
      <h2>21. Use of Wish Transaction Information</h2>
      <p>
        You will not, and will cause your Affiliates not to, directly or
        indirectly: (a) disclose any Wish Transaction Information (defined
        below), except that you may disclose that information solely as
        necessary for you to perform your obligations under this Agreement if
        you ensure that every recipient uses the information only for that
        purpose and complies with the restrictions applicable to you related to
        that information; (b) use any Wish Transaction Information for any
        marketing or promotional purposes whatsoever, or otherwise in any way
        inconsistent with our or your privacy policies or applicable Law; (c)
        contact a person or entity that has ordered your product, service or
        Content with the intent to collect any amounts in connection therewith
        or to influence that person or entity to make an alternative
        transaction; (d) disparage us, our Affiliates, or any of their or our
        respective products or services or any customer; or (e) target
        communications of any kind on the basis of the intended recipient being
        an Wish user. In addition, you may only use tools and methods that we
        designate to communicate with Wish users regarding transactions,
        including for the purpose of scheduling, communicating, or cancelling
        the fulfillment of products, services or Content. “Wish Transaction
        Information” means, collectively, order information and any other data
        or information acquired by you or your Affiliates from Wish, its
        Affiliates, or otherwise as a result of this Agreement, the transactions
        contemplated by this Agreement, or the parties' performance under this
        Agreement.
      </p>
      <h2>22. Force Majeure</h2>
      <p>
        We will not be liable for any delay or failure to perform any of our
        obligations under this Agreement by reasons, events or other matters
        beyond our reasonable control.
      </p>
      <h2>23. Relationship of Parties</h2>
      <p>
        You and Wish are independent contractors, and nothing in this Agreement
        will create any partnership, joint venture, agency, franchise, sales
        representative, or employment relationship between us. You will have no
        authority to make or accept any offers or representations on Wish’s
        behalf. This Agreement will not create an exclusive relationship between
        you and Wish. Nothing expressed or mentioned in or implied from this
        Agreement is intended or will be construed to give to any person other
        than the parties to this Agreement any legal or equitable right, remedy,
        or claim under or in respect to this Agreement. This Agreement and all
        of the representations, warranties, covenants, conditions, and
        provisions in this Agreement are intended to be and are for the sole and
        exclusive benefit of Wish, you, and customers. As between you and Wish,
        you will be solely responsible for all obligations associated with the
        use of any third party service or feature that you permit us to use on
        your behalf, including compliance with any applicable terms of use. You
        will not make any statement, whether on your site or otherwise, that
        would contradict anything in this section.
      </p>
      <h2>24. Electronic Communications</h2>
      <p>
        You agree to receive communications from Wish electronically, such as
        emails, texts, mobile push notices, or notices and message on the
        Services, and to retain copies of these communications for your records.
        You agree that all terms and conditions, agreements, notices,
        disclosures, and other communications and documents that Wish provides
        to you electronically will have the same legal effect that such
        communications or documents would have if they were set forth in
        “writing.”
      </p>
      <h2>25. Assignment</h2>
      <p>
        You agree that Wish may assign all of its rights and duties under this
        Agreement to an Affiliate of Wish, and in such event, Wish will notify
        you of such assignment by email or other written notification. You may
        not assign any of your rights and duties under this Agreement to any
        other party without the prior express written consent of Wish.
      </p>
      <h2>26. Choice of Law</h2>
      <p>
        These Terms are governed by and will be construed under the laws of the
        State of California, without regard to the conflicts of laws provisions
        thereof.
      </p>
      <h2>27. Suggestions and Other Information</h2>
      <p>
        If you or any of your Affiliates elect to provide or make available
        suggestions, comments, ideas, improvements, or other feedback or
        materials to us (collectively, “Submissions”), Wish will consider such
        Submissions to be non-confidential and non-proprietary. Wish shall have
        no obligations concerning the Submissions, and Wish will be free to use,
        disclose, reproduce, modify, license, transfer and otherwise distribute,
        and exploit any of the foregoing Submissions in any manner, without any
        restriction or compensation to you. If we make suggestions on using the
        Services, you are responsible for any actions you take based on our
        suggestions.
      </p>
    </div>
  );
});
