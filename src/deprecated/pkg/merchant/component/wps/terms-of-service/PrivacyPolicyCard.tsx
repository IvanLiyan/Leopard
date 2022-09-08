/*
 * PrivacyPolicyCard.tsx
 *
 * Created by Jonah Dlin on Tue Apr 20 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

/*eslint-disable local-rules/unnecessary-list-usage*/
import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

/* Lego */
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { Markdown } from "@ContextLogic/lego";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@toolkit/styling";
import {
  PrivacyPolicySectionId,
  TermsOfUseSectionId,
} from "@toolkit/wps/terms-of-service";
import { wishURL } from "@toolkit/url";

/* Merchant Components */
import {
  TosCard,
  TosH1,
  TosH2,
  TosH3,
  TosUnderline,
  TosP,
  TosSection,
} from "./TosAtoms";

import Link from "@next-toolkit/Link";

type Props = BaseProps;

const Toc1Id = `${PrivacyPolicySectionId}-section-1`;
const Toc2Id = `${PrivacyPolicySectionId}-section-2`;
const Toc3Id = `${PrivacyPolicySectionId}-section-3`;
const Toc4Id = `${PrivacyPolicySectionId}-section-4`;
const Toc5Id = `${PrivacyPolicySectionId}-section-5`;
const Toc6Id = `${PrivacyPolicySectionId}-section-6`;
const Toc7Id = `${PrivacyPolicySectionId}-section-7`;
const Toc8Id = `${PrivacyPolicySectionId}-section-8`;
const Toc9Id = `${PrivacyPolicySectionId}-section-9`;
const Toc10Id = `${PrivacyPolicySectionId}-section-10`;
const Toc11Id = `${PrivacyPolicySectionId}-section-11`;
const Toc12Id = `${PrivacyPolicySectionId}-section-12`;
const Toc13Id = `${PrivacyPolicySectionId}-section-13`;

const PrivacyPolicyCard: React.FC<Props> = ({ className, style }: Props) => {
  useMountEffect(() => {
    configureAnchors({ offset: 0, scrollDuration: 200 });
  });

  const wpsTosLink = `#${TermsOfUseSectionId}`;

  const toc1Link = `#${Toc1Id}`;
  const toc2Link = `#${Toc2Id}`;
  const toc3Link = `#${Toc3Id}`;
  const toc4Link = `#${Toc4Id}`;
  const toc5Link = `#${Toc5Id}`;
  const toc6Link = `#${Toc6Id}`;
  const toc7Link = `#${Toc7Id}`;
  const toc8Link = `#${Toc8Id}`;
  const toc9Link = `#${Toc9Id}`;
  const toc10Link = `#${Toc10Id}`;
  const toc11Link = `#${Toc11Id}`;
  const toc12Link = `#${Toc12Id}`;
  const toc13Link = `#${Toc13Id}`;

  return (
    <TosCard className={css(className, style)}>
      <TosSection>
        <TosH1>Privacy Policy</TosH1>
      </TosSection>

      <TosSection>
        <TosP>Last Updated: Apr 22, 2021</TosP>
        <TosP>
          This Privacy Policy applies to the Wish Parcel Service, which is
          operated by ContextLogic Inc. and located at parcel.wish.com (or
          accessible via merchant.wish.com or your enterprise resource platform
          (ERP) if you are a Wish merchant) ("Services"). This Privacy Policy
          uses the terms "our" "us" and "we" to refer to ContextLogic Inc. and
          "you" or "user(s)" to refer to individuals described by the
          information that ContextLogic collects and uses, such as consumers and
          merchants. Please read this document carefully to learn more about how
          we collect, use, share, and protect information, including information
          that may describe you personally.
        </TosP>
        <TosP>
          <Markdown
            text={
              i`This Privacy Policy does not apply to the practices of ` +
              i`companies we don't own or control, or people that we don't ` +
              i`manage. For example, it does not apply to the use of ` +
              i`information by third parties with whom we partner to provide ` +
              i`shipping services to you. By registering to use the ` +
              i`Services, you acknowledge and agree that your information ` +
              i`may be shared with these third parties. Any capitalized ` +
              i`terms we use in this Privacy Policy without defining them ` +
              i`have the definitions given to them in the [Wish Parcel Terms ` +
              i`and Conditions](${wpsTosLink}) which govern your use of the ` +
              i`Services.`
            }
          />
        </TosP>
        <TosP>
          Wish Parcel Service allows users to ship products to consumers. We
          collect and use information from you and consumers to facilitate the
          shipping of products to consumers.
        </TosP>
        <TosP>
          By using or accessing the Services, you acknowledge that we will
          collect, use, and share your information as described in this Privacy
          Policy. You have choices about whether to provide us with information
          and how we use that information. You may choose not to provide us with
          information, but your choice(s) may prevent you from using the
          Services or limit your use of certain features. See Section 7 for more
          information about your choices.
        </TosP>
        <TosP>
          We're constantly trying to improve our Services, so we may need to
          update this Privacy Policy. We may update this Privacy Policy to
          reflect changes in the law, the Services, our companies, or advances
          in technology. We will alert you to a change by placing a notice on
          the Services or by sending an email. Our use of the information we
          collect is subject to the Privacy Policy in effect at the time such
          information is used.
        </TosP>
      </TosSection>

      <TosSection>
        <TosH2>Table of Contents</TosH2>
        <TosP>
          <Link href={toc1Link}>1. INFORMATION WE COLLECT & USE</Link>
        </TosP>
        <TosP>
          <Link href={toc2Link}>2. HOW WE USE INFORMATION & LAWFUL BASES</Link>
        </TosP>
        <TosP>
          <Link href={toc3Link}>
            3. LOCATION OF DATA PROCESSING - UNITED STATES AND ELSEWHERE
          </Link>
        </TosP>
        <TosP>
          <Link href={toc4Link}>4. RETENTION OF PERSONAL DATA/INFORMATION</Link>
        </TosP>
        <TosP>
          <Link href={toc5Link}>5. INFORMATION SHARING</Link>
        </TosP>
        <TosP>
          <Link href={toc6Link}>6. SECURITY</Link>
        </TosP>
        <TosP>
          <Link href={toc7Link}>7. CHOICES</Link>
        </TosP>
        <TosP>
          <Link href={toc8Link}>8. RIGHTS</Link>
        </TosP>
        <TosP>
          <Link href={toc9Link}>9. PRIVACY COMPLAINTS</Link>
        </TosP>
        <TosP>
          <Link href={toc10Link}>10. CHILDREN'S PRIVACY</Link>
        </TosP>
        <TosP>
          <Link href={toc11Link}>11. DO NOT TRACK</Link>
        </TosP>
        <TosP>
          <Link href={toc12Link}>12. CONTACT INFORMATION</Link>
        </TosP>
        <TosP>
          <Link href={toc13Link}>
            13. SUPPLEMENTAL PRIVACY NOTICE FOR CALIFORNIA RESIDENTS
          </Link>
        </TosP>
      </TosSection>

      <ScrollableAnchor id={Toc1Id}>
        <TosSection>
          <TosH2>1. INFORMATION WE COLLECT & USE</TosH2>
          <TosP>
            Some of the information we collect is actively provided by you, such
            as when you fill out a field or form. Some is collected
            automatically (typically from devices). And some may be collected
            from other sources.
          </TosP>
          <TosSection>
            <TosH3>1.2 Information You Provide</TosH3>
            <TosP>
              When you use the Services you provide information to us, such as
              when you create an account or purchase services. Examples of the
              information you may provide are:
            </TosP>
            <ul>
              <li>Your name</li>
              <li>Company name</li>
              <li>Email address</li>
              <li>Payment method or payment account</li>
              <li>Shipping address or business address</li>
              <li>Phone number</li>
              <li>Password</li>
              <li>Name and shipping address of package recipients</li>
            </ul>
          </TosSection>
          <TosSection>
            <TosH3>1.3 Information We Collect Automatically</TosH3>
            <TosP>
              When you use the Services, including when you visit a Wish Parcel
              Service site, we automatically collect information about how you
              use the Services and the devices you use to access the Services.
              We may also generate information about you, such as an Account ID
              number. Examples of the information we may collect automatically
              are:
            </TosP>
            <ul>
              <li>IP Address</li>
              <li>Location information</li>
              <li>
                Unique Identifiers, including MAC Address, Ad IDs, and device
                attributes, such as operating system and browser type, and usage
                patterns.
              </li>
              <li>
                Usage Data, such as: web log data, referring and exit pages and
                URLs, platform type, number of clicks, domain names, landing
                pages, pages and content viewed and the order of those pages,
                the amount of time spent on particular pages, the date and time
                you used our Services, the frequency of your use of our
                Services, error logs, and other similar information.
              </li>
            </ul>
          </TosSection>
          <TosSection>
            <TosH3>1.4 Analytics, Advertising & Technical Data</TosH3>
            <TosP>
              We or our service providers or business partners may collect and
              use various pieces of information in an automated way to support
              analytics and advertising operations.
            </TosP>
            <TosP>
              <Markdown
                openLinksInNewTab
                text={
                  i`Analytics - We use analytics tools and providers to ` +
                  i`understand better how individuals and their devices interact ` +
                  i`with the Services. Google Analytics is important to our ` +
                  i`analytics - [How Google uses data when you visit a partner ` +
                  i`site or app](https://policies.google.com/technologies/partner-sites).`
                }
              />
            </TosP>
            <TosP>
              Cookies and Related Technologies - We and others may use cookies,
              which are text files containing small amounts of information that
              are downloaded on your device, or related technologies, such as
              web beacons, local shared objects and tracking pixels to store or
              collect information ("Cookies"). Cookies can help us and others
              learn about your online activity including on other sites or
              services. For example, web beacons allow ad networks to provide
              aggregated auditing, research and reporting for us and for
              advertisers. Web beacons also enable ad networks to serve targeted
              advertisements to you when you visit other websites. Because your
              web browser must request these advertisements and web beacons from
              the ad network's servers, these companies can view, edit, or set
              their own cookies, just as if you had requested a web page from
              their site.
            </TosP>
            <TosP>
              We do not have access to Cookies placed or read by Advertisers,
              and this Privacy Policy does not govern the use of those cookies
              and related technologies. See the Choice information in Section 7
              for more information.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>1.5 Third-Party Links and Integrations</TosH3>
            <TosP>
              The Services may include links to, or integrate with, third-party
              websites, apps, APIs, or technologies, which may have privacy
              policies that differ from our own. We are not responsible for the
              practices of such third parties.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>1.6 Other Sources</TosH3>
            <TosP>
              We may gather information, including demographic and statistical
              information, from third parties such as business partners,
              marketers, researchers, analysts. We may attribute this
              information to you based on your assignment to certain statistical
              groups. We may use this information to supplement the other
              information that we collect in order to improve our products,
              analytics, and advertising.
            </TosP>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc2Id}>
        <TosSection>
          <TosH2>2. HOW WE USE INFORMATION & LAWFUL BASES</TosH2>
          <TosSection>
            <TosH3>2.1 Use</TosH3>
            <TosP>
              In general, we collect, use, and store ("process") your
              information to provide the Services, to fix and improve the
              Services, to develop new services, and to market our companies and
              their products and services. Some specific examples of how we use
              information are:
            </TosP>
            <ul>
              <li>
                Setup and manage accounts, including identification and
                authentication
              </li>
              <li>Collect or make a payment</li>
              <li>Process or support fulfillment of orders</li>
              <li>
                Communicate with you - using email, sms, push notifications or
                platform messaging (like Whatsapp) - about your account or to
                market product listings, features, or events
              </li>
              <li>
                Advertise and market the Services, including in email or other
                channels
              </li>
              <li>Test changes in the Services and develop new features</li>
              <li>
                Analyze use of the Services and personalize content, including
                ads and prices
              </li>
              <li>
                Provide support, including addressing questions and problems
                users or consumers may have with the Services, or resolving
                disputes
              </li>
              <li>
                Prevent, detect, investigate and respond to fraud, unauthorized
                access/use of the Services, breaches of terms and policies, or
                other wrongful behavior
              </li>
              <li>
                Comply with any procedures, laws, and regulations which apply to
                us, including those that set retention periods
              </li>
            </ul>
          </TosSection>
          <TosSection>
            <TosH3>2.2 Other Uses - Deidentified Data</TosH3>
            <TosP>
              We may take steps to limit or prevent identification of any
              particular user or device in sets of data, such as by combining
              information relating to many individuals ("aggregation") or
              removing or changing pieces of information about each individual.
              We may use de-identified data to help support our research and
              marketing efforts. This Privacy Policy does not apply to our use
              of such de-identified information.
            </TosP>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc3Id}>
        <TosSection>
          <TosH2>
            3. LOCATION OF DATA PROCESSING - UNITED STATES AND ELSEWHERE
          </TosH2>
          <TosP>
            Information that we collect and use may be processed outside of your
            country or region. When we share personal information with
            Affiliates or with third parties in other countries, we apply
            appropriate safeguards.
          </TosP>
          <TosP>By using the Services you:</TosP>
          <ul>
            <li>
              Acknowledge that your information will be processed as described
              in this Privacy Policy; and
            </li>
            <li>
              Consent to having your information transferred to our Affiliates
              and facilities in the United States or elsewhere or to facilities
              of third parties with whom we share information as described in
              this Privacy Policy.
            </li>
          </ul>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc4Id}>
        <TosSection>
          <TosH2>4. RETENTION OF PERSONAL DATA/INFORMATION</TosH2>
          <TosP>
            We keep your information for the time period required to complete
            the purposes for which it is processed or to satisfy legal retention
            requirements. The length of time for which we retain information
            depends on the purposes for which we collected and use it or the
            requirements of applicable laws.
          </TosP>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc5Id}>
        <TosSection>
          <TosH2>5. INFORMATION SHARING</TosH2>
          <TosP>
            We may disclose information about you or your use of the Services
            with the types of recipients described below.
          </TosP>
          <TosSection>
            <TosH3>5.1 Service Providers/Agents and Partners</TosH3>
            <TosP>
              We engage and/or partner with other companies and people to help
              us provide the Service and may need to share information with them
              so they can complete their work. Sometimes these companies are
              selected by you (and may have their own policies regarding their
              services and your data). Sometimes these companies are selected by
              us. For example: we may use a payment processing company to
              receive or deliver payments; or we may use a cloud services
              provider to store data.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>5.2 Affiliates</TosH3>
            <TosP>
              We may share your information with other companies under common
              ownership or control with ContextLogic Inc. ("Affiliates"). These
              Affiliates use your information as described in this Privacy
              Policy.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>5.3 Business Transfers</TosH3>
            <TosP>
              We may choose to buy or sell assets and may share or transfer user
              information (including personal information) in connection with
              the evaluation of and entry into such transactions. Also, if we
              (or our assets) are acquired, or if we go out of business, enter
              bankruptcy, or go through some other change of control, user
              information could be one of the assets transferred to or acquired
              by a third-party.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>5.4 Legal Requirements, Protection of Wish and Others</TosH3>
            <TosP>
              <Markdown
                text={
                  i`We reserve the right to access, read, preserve, and disclose ` +
                  i`any information that we in good faith believe is necessary to ` +
                  i`comply with law or court order; enforce or apply our ` +
                  i`[Wish Parcel Terms and Conditions](${wpsTosLink}) and other ` +
                  i`agreements; or protect the rights, property, or safety of ` +
                  i`ContextLogic Inc., our employees, our users, or others.`
                }
              />
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>5.5 Consent</TosH3>
            <TosP>
              We may share your information in other ways if you have asked us
              to do so or have given consent.
            </TosP>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc6Id}>
        <TosSection>
          <TosH2>6. SECURITY</TosH2>
          <TosP>
            <Markdown
              text={
                i`**6.1** Accounts are protected by a password for your ` +
                i`privacy and security. We recommend that you choose an ` +
                i`appropriate password, safeguard your password and limit ` +
                i`access to the devices on which you access your account.`
              }
            />
          </TosP>
          <TosP>
            <Markdown
              text={
                i`**6.2** We use reasonable organizational and technical ` +
                i`measures intended to protect the privacy of your account and ` +
                i`personal information we use or store, but the Internet and ` +
                i`our Services are not 100% secure. We cannot guarantee ` +
                i`complete privacy or security for the information that you ` +
                i`provide or that we collect.`
              }
            />
          </TosP>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc7Id}>
        <TosSection>
          <TosH2>7. CHOICES</TosH2>
          <TosSection>
            <TosH3>7.1 Access, Review, Correct</TosH3>
            <TosP>
              Through your account "Settings" you are able to access, edit or
              delete information you've provided to us, including:
            </TosP>
            <ul>
              <li>Name</li>
              <li>Physical address</li>
              <li>Phone number</li>
            </ul>
            <TosP>
              The information available in Settings and your options may change
              as the Services change.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>7.2 Marketing Communication Opt-out</TosH3>
            <TosP>
              To manage your preferences or opt-out of marketing communications
              you can use any of the following methods.
            </TosP>
            <ul>
              <li>
                Electronic Promotional Offers: If you do not want to receive
                emails from us regarding special promotions or offers, you may
                follow the unsubscribe options at the bottom of each email.
              </li>
              <li>
                Mobile Promotional Offers: When you provide us with your mobile
                number for marketing purposes, we may send you certain marketing
                alerts via text message. Consent is not a requirement to use the
                services and standard data and message rates will apply. If you
                no longer wish to receive mobile alerts from us, you can follow
                the instructions provided in those messages or otherwise reply
                STOP to any alert we send.
              </li>
            </ul>
          </TosSection>
          <TosSection>
            <TosH3>7.3 Location Information</TosH3>
            <TosP>
              If you do not want us to see or access your device location, you
              can turn off location sharing on your device, change your device
              privacy settings, or decline to share location on your browser.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>7.4 Cookies & Analytics</TosH3>
            <ul>
              <li>
                You may be able to opt-out of certain web beacon tracking and
                other Cookie activity by adjusting the settings on your browser,
                including Do Not Track settings.
              </li>
              <li>
                <Markdown
                  openLinksInNewTab
                  text={
                    i`To opt-out of Google Analytics you can install the [Google ` +
                    i`Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout).`
                  }
                />
              </li>
            </ul>
          </TosSection>
          <TosSection>
            <TosH3>7.5 Ads</TosH3>
            <TosP>Choices for tailored advertising:</TosP>
            <ul>
              <li>
                To exercise choices for tailored advertising, please visit the
                following sites. If you opt-out, you may still receive
                advertising content, but it will not be tailored to you.
              </li>
              <ul>
                <li>
                  <Markdown
                    openLinksInNewTab
                    text={
                      i`Network Advertising Initiative (NAI) - You may use the NAI opt` +
                      i`out [here](https://www.networkadvertising.org/choices/), ` +
                      i`which will allow you to opt out of seeing personalized` +
                      i`ads from NAI member companies.`
                    }
                  />
                </li>
                <li>
                  <Markdown
                    openLinksInNewTab
                    text={
                      i`Digital Advertising Alliance (DAA) - You may opt out of` +
                      i`receiving personalized ads from certain companies that perform` +
                      i`ad targeting services, using the DAA [here](https://www.aboutads.info/choices/).`
                    }
                  />
                </li>
                <li>
                  <Markdown
                    openLinksInNewTab
                    text={
                      i`European Interactive Advertising Digital Alliance (EDAA) - You` +
                      i`can learn more about online advertising and opt out at the [Your` +
                      i`Online Choices](https://www.youronlinechoices.com/) website.`
                    }
                  />
                </li>
              </ul>
              <li>
                For mobile devices, please read your operating system's
                instructions for complete instructions.
              </li>
              <ul>
                <li>
                  <Markdown
                    openLinksInNewTab
                    text={
                      i`See the [NAI guide](https://www.networkadvertising.org/mobile-choice/) ` +
                      i`to mobile device options for ad preferences`
                    }
                  />
                </li>
              </ul>
            </ul>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc8Id}>
        <TosSection>
          <TosH2>8. RIGHTS</TosH2>
          <TosP>
            Depending on your residence or location you may have certain rights
            related to the collection and use of your personal information/data.
          </TosP>
          <TosSection>
            <TosH3>8.1 California Residents</TosH3>
            <TosP>
              <Markdown
                openLinksInNewTab
                text={
                  i`If you are a California resident, you may have certain rights. ` +
                  i`For more information, see our [Supplemental Privacy Notice for ` +
                  i`California Residents in section 13](${wishURL(
                    `/privacy_policy#section-13`
                  )}) below.`
                }
              />
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>8.2 Nevada Residents</TosH3>
            <TosP>
              Under Nevada law, certain Nevada consumers may opt out of the sale
              of "personally identifiable information" for monetary
              consideration to a person for that person to license or sell such
              information to additional persons. "Personally identifiable
              information" includes first and last name, address, email address,
              phone number, Social Security Number, or an identifier that allows
              a specific person to be contacted either physically or online.
            </TosP>
            <TosP>
              We do not engage in such activity; however, if you are a Nevada
              resident who has purchased or leased goods or services from us,
              you may submit a request to opt out of any potential future sales
              under Nevada law by emailing wps-privacy@wish.com. Please note we
              will take reasonable steps to verify your identity and the
              authenticity of the request. Once verified, we will maintain your
              request in the event our practices change.
            </TosP>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc9Id}>
        <TosSection>
          <TosH2>9. PRIVACY COMPLAINTS</TosH2>
          <TosP>
            <Markdown
              text={
                i`We are committed to resolving valid complaints *about your ` +
                i`privacy or our collection or use of your personal information*. ` +
                i`For questions or complaints regarding our data use practices or ` +
                i`Privacy Policy, please contact us using the email address listed ` +
                i`in Section 12 of this Privacy Policy.`
              }
            />
          </TosP>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc10Id}>
        <TosSection>
          <TosH2>10. CHILDREN'S PRIVACY</TosH2>
          <TosP>
            We do not knowingly collect or solicit "personal information" (as
            defined by the U.S. Children's Online Privacy Protection Act) from
            anyone under the age of 13. If you are under 13, please do not
            attempt to register for the Services or send any personal
            information about yourself to us. If we learn that we have collected
            personal information from a child under age 13, we will delete that
            information. If you believe that a child under 13 may have provided
            us personal information, please contact us at wps-privacy@wish.com.
          </TosP>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc11Id}>
        <TosSection>
          <TosH2>11. DO NOT TRACK</TosH2>
          <TosP>
            Your browser may offer you a "Do Not Track" option, which allows you
            to signal to operators of websites and web applications and services
            (including tailored advertising services) that you do not want your
            online activities tracked over time and across different websites.
            Our Services do not support Do Not Track requests at this time,
            which means that we collect information about your online activity
            both while you are using the Services and after you leave our
            Services.
          </TosP>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc12Id}>
        <TosSection>
          <TosH2>12. CONTACT INFORMATION</TosH2>
          <TosP>
            If you have any questions or concerns regarding this Privacy Policy
            or ContextLogic's use of your data, please send a detailed message
            to wps-privacy@wish.com. Other concerns, such as about an order
            placed, should be sent through standard support channels. You may
            also write to us at (please specify that your inquiry pertains to
            Wish Parcel Service):
          </TosP>
          <ul>
            <li>
              ContextLogic Inc., 1 Sansome Street, 33rd Floor, San Francisco, CA
              94104-4418
            </li>
          </ul>
        </TosSection>
      </ScrollableAnchor>

      <ScrollableAnchor id={Toc13Id}>
        <TosSection>
          <TosH2>
            13. SUPPLEMENTAL PRIVACY NOTICE FOR CALIFORNIA RESIDENTS
          </TosH2>
          <TosP>
            This Supplemental Privacy Notice is in addition to the information
            in our Privacy Policy above, and applies solely to California
            residents.
          </TosP>
          <TosSection>
            <TosH3>13.1 Summary of Information We Collect</TosH3>
            <TosP>
              California law requires us to disclose information regarding the
              categories of personal information that we have collected about
              California consumers, the categories of sources from which the
              information was collected, the business or commercial purposes (as
              those terms are defined by applicable law) for which the
              information was collected, and the categories of parties with whom
              we share personal information.
            </TosP>
            <TosP>
              We or our service providers may collect the below categories of
              information for the following business or commercial purposes (as
              those terms are defined in applicable law):
            </TosP>
            <ul>
              <li>Our or our service provider's operational purposes;</li>
              <li>
                Auditing consumer interactions on our site (e.g., measuring ad
                impressions);
              </li>
              <li>
                Detecting, protecting against, and prosecuting security
                incidents and fraudulent or illegal activity;
              </li>
              <li>Bug detection and error reporting;</li>
              <li>
                Customizing content that we or our service providers display on
                the Services (e.g., contextual ads);
              </li>
              <li>
                Providing the Services (e.g., account servicing and maintenance,
                order processing and fulfillment, customer service, advertising
                and marketing, analytics, and communication about the Services);
              </li>
              <li>
                Improving our existing Services and developing new services
                (e.g., by conducting research to develop new products or
                features);
              </li>
              <li>
                Other uses that advance our commercial or economic interests,
                such as third-party advertising and communicating with you about
                relevant offers from third-party partners;
              </li>
              <li>Other uses about which we notify you.</li>
            </ul>
            <TosP>
              Examples of these types of uses are identified below. We may also
              use the below categories of personal information for compliance
              with applicable laws and regulations, and we may combine the
              information we collect ("aggregate") or remove pieces of
              information ("de-identify") to limit or prevent identification of
              any particular user or device.
            </TosP>
            <ol>
              <li>
                Category: Identifiers, such as: account information, name, email
                address, shipping address, phone number, or social network
                account and profile data.
              </li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Your use of our services/automatic collection</li>
                  <li>Agents/service providers</li>
                  <li>Affiliates</li>
                  <li>Third parties</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Process/fulfill orders</li>
                  <li>Fixing and improving the Services</li>
                  <li>Collecting/making payment</li>
                  <li>Personalizing content</li>
                  <li>Marketing and advertising</li>
                  <li>Communicating with you</li>
                  <li>Analyzing use of the Service</li>
                  <li>Support services</li>
                  <li>
                    Preventing, detecting, investigating, and responding to
                    fraud, unauthorized access/use of the Services, breaches of
                    terms and policies
                  </li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Affiliates</li>
                  <li>Consumers</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <li>
                Category: Commercial information (such as transaction data)
              </li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Your use of our services/automatic collection</li>
                  <li>Agents/service providers</li>
                  <li>Affiliates</li>
                  <li>Third parties</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Process/fulfill orders</li>
                  <li>Fixing and improving the Services</li>
                  <li>Collecting payment</li>
                  <li>Personalizing content</li>
                  <li>Marketing and advertising</li>
                  <li>Communicating with you</li>
                  <li>Analyzing use of the Service</li>
                  <li>Support services</li>
                  <li>
                    Preventing, detecting, investigating, and responding to
                    fraud, unauthorized access/use of the Services, breaches of
                    terms and policies.
                  </li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third-Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Affiliates</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <li>
                Category: Financial data (such as payment method or financial
                account information)
              </li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Agents/service providers</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Collecting/making payment</li>
                  <li>Analyzing use of the Service</li>
                  <li>Support services</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third-Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Third parties</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                </ol>
              </ol>
              <li>
                Category: Internet or other network or device activity (such as
                IP address, unique device, advertising, and app identifiers,
                browsing history or other usage data)
              </li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Your use of our services/automatic collection</li>
                  <li>Agents/service providers</li>
                  <li>Third parties</li>
                  <li>Affiliates</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Fixing and improving the Services</li>
                  <li>Collecting payment</li>
                  <li>Personalizing content</li>
                  <li>Marketing and advertising</li>
                  <li>Communicating with you</li>
                  <li>Analyzing use of the Service</li>
                  <li>
                    Preventing, detecting, investigating, and responding to
                    fraud, unauthorized access/use of the Services, breaches of
                    terms and policies
                  </li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third-Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Affiliates</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <li>Category: Location information</li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Your use of our services/automatic collection</li>
                  <li>Agents/service providers</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Fixing and improving the Services</li>
                  <li>Collecting payment</li>
                  <li>Personalizing content</li>
                  <li>Marketing and advertising</li>
                  <li>Communicating with you</li>
                  <li>Analyzing use of the Service</li>
                  <li>Finding local features and services</li>
                  <li>
                    Preventing, detecting, investigating, and responding to
                    fraud, unauthorized access/use of the Services, breaches of
                    terms and policies
                  </li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third-Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Affiliates</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <li>
                Category: Other information that identifies or can be reasonably
                associated with you
              </li>
              <ol type="a">
                <li>
                  <TosUnderline>Categories of Sources</TosUnderline>
                </li>
                <ol type="i">
                  <li>Individuals/You</li>
                  <li>Your use of our services/automatic collection</li>
                  <li>Agents/service providers</li>
                  <li>Affiliates</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>Examples of Uses</TosUnderline>
                </li>
                <ol type="i">
                  <li>Providing the Services</li>
                  <li>Fixing and improving the Services</li>
                  <li>Collecting payment</li>
                  <li>Personalizing content</li>
                  <li>Marketing and advertising</li>
                  <li>Communicating with you</li>
                  <li>Analyzing use of the Service</li>
                  <li>
                    Preventing, detecting, investigating, and responding to
                    fraud, unauthorized access/use of the Services, breaches of
                    terms and policies
                  </li>
                </ol>
              </ol>
              <ol type="a">
                <li>
                  <TosUnderline>
                    Categories of Third-Parties With Which We May Share That
                    Information
                  </TosUnderline>
                </li>
                <ol type="i">
                  <li>Service providers/Agents</li>
                  <li>Affiliates</li>
                  <li>Partners (e.g., to provide shipping services to you)</li>
                  <li>Third parties</li>
                </ol>
              </ol>
            </ol>
          </TosSection>
          <TosSection>
            <TosH3>13.2 Rights</TosH3>
            <TosP>
              If you are a California resident, you may have certain rights.
              California law may permit you to request that we:
            </TosP>
            <ul>
              <li>
                Provide you the categories of personal information we have
                collected or disclosed about you in the last twelve months; the
                categories of sources of such information; the business or
                commercial purpose for collecting or selling your personal
                information; and the categories of third parties with whom we
                shared personal information.
              </li>
              <li>
                Provide access to and/or a copy of certain information we hold
                about you.
              </li>
              <li>Delete certain information we have about you.</li>
            </ul>
            <TosP>
              You may have the right to receive information about the financial
              incentives that we offer to you. You also have the right to not be
              discriminated against (as provided for in applicable law) for
              exercising certain of your rights. Certain information may be
              exempt from such requests under applicable law. We need certain
              types of information so that we can provide the Services to you.
              If you ask us to delete it, you may no longer be able to access or
              use the Services.
            </TosP>
            <TosP>
              For more information about how to access, review, and correct your
              account information; opt out of certain marketing, advertising,
              location collection, and cookies; and deactivate your account, see
              Section 7 of this Privacy Policy (above).
            </TosP>
            <TosP>
              If you would like to exercise any of your California consumer
              rights, please submit a request at wps-privacy@wish.com. You will
              be required to verify your identity before we fulfill your
              request. To do so, you will typically need to demonstrate control
              of the relevant account and show California residence. You can
              also designate an authorized agent to make a request on your
              behalf. To do so, you must provide us with written authorization
              or a power of attorney, signed by you, for the agent to act on
              your behalf. You will still need to verify your identity directly
              with us.
            </TosP>
          </TosSection>
          <TosSection>
            <TosH3>13.3 California Shine the Light</TosH3>
            <TosP>
              If you are a California resident, you may ask for a list of third
              parties that have received your information for direct marketing
              purposes during the previous calendar year. This list also
              contains the types of information shared. We provide this list at
              no cost. To make such a request, contact us at
              wps-privacy@wish.com.
            </TosP>
          </TosSection>
        </TosSection>
      </ScrollableAnchor>
    </TosCard>
  );
};

export default observer(PrivacyPolicyCard);
