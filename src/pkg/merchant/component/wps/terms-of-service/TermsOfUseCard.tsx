/*
 * TermsOfUseCard.tsx
 *
 * Created by Jonah Dlin on Tue Apr 20 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

/* eslint-disable local-rules/use-formatCurrency */
/* eslint-disable local-rules/unnecessary-list-usage */
import React from "react";
import { observer } from "mobx-react";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TosCard, TosH1, TosSection, TosP } from "./TosAtoms";
import { css } from "@toolkit/styling";
import { Markdown } from "@ContextLogic/lego";
import { PrivacyPolicySectionId } from "@toolkit/wps/terms-of-service";

import Link from "@next-toolkit/Link";

type Props = BaseProps;

const TermsOfUseCard: React.FC<Props> = ({ className, style }: Props) => {
  const jamsArbitrationLink =
    "http://www.jamsadr.com/rules-comprehensive-arbitration/";
  return (
    <TosCard className={css(className, style)}>
      <TosSection>
        <TosH1>Terms and Conditions</TosH1>
      </TosSection>

      <TosSection>
        <TosP>
          <Markdown
            text={
              i`These Wish Parcel program Terms and Conditions (the "**Terms and Conditions**" ` +
              i`or "**Agreement**") govern use of the Services (as defined below). By ` +
              i`registering and/or using the Services in any manner, including without ` +
              i`limitation, by creating an account, using the Application (as defined below) ` +
              i`or using the Services for logistics fulfilment services made available by ` +
              i`ContextLogic Inc. ("**Wish**" or "**we**" or "**us**"), Wish Parcel Merchants ` +
              i`(as defined below) ("**you**"), accept and agree to be bound by these Terms ` +
              i`and Conditions, including those additional terms and conditions, policies and ` +
              i`guidelines referenced herein and/or published or made available by Wish. If ` +
              i`you are entering into these Terms and Conditions on behalf of a company, ` +
              i`business or other legal entity, you represent that you have the authority to ` +
              i`bind such entity and its affiliates to these Terms and Conditions, in which ` +
              i`case the terms "you" or "your" shall refer to such entity and its affiliates. ` +
              i`If you do not have such authority, or if you do not agree with these Terms and ` +
              i`Conditions you must not accept this Agreement and may not use the Services.`
            }
          />
        </TosP>
        <TosP>
          <Markdown
            openLinksInNewTab
            text={
              i`If you have a Merchant account with Wish, your use of the Services is also ` +
              i`governed by the [Merchant Terms of Service and Agreement](/terms-of-service) ` +
              i`("Merchant Terms"). If there is a conflict between the Merchant Terms and ` +
              i`these Terms and Conditions as it relates to the use of the Services or the ` +
              i`Wish Parcel Program, the Merchant Terms shall control to the extent of the ` +
              i`conflict. If you do not have a Merchant account with Wish and you only have a ` +
              i`Wish Parcel account with Wish, your use of the Services is governed by this ` +
              i`Agreement.`
            }
          />
        </TosP>
        <TosP>
          <Markdown
            text={
              i`**Please note that Section 21 of these Terms and Conditions contain an ` +
              i`arbitration clause and class action waiver. By agreeing to the Agreement, you ` +
              i`agree to resolve all disputes through binding individual arbitration, which ` +
              i`means that you waive any right to have those disputes decided by a judge or ` +
              i`jury, and that you waive your right to participate in class actions, class ` +
              i`arbitrations, or representative actions. Please read Section 21 carefully.**`
            }
          />
        </TosP>
      </TosSection>
      <TosSection>
        <ol>
          <li>
            <Markdown text={i`**Definitions.**`} />
          </li>
          <ol style={{ listStyleType: "none" }}>
            <li>
              <Markdown
                text={
                  i`1.1. "**Parties**" means ContextLogic Inc. and its corporate affiliates and ` +
                  i`you. In this Agreement we refer to ContextLogic and its corporate affiliates ` +
                  i`as "Wish" or "we" or "us." Your location determines the ContextLogic entity ` +
                  i`with whom you have a contract: if your residence is in the United States, you ` +
                  i`are contracting with ContextLogic Inc., a U.S. company, and these Terms and ` +
                  i`Conditions govern your use of the Services. The ContextLogic entity you ` +
                  i`contract with may change as we expand or change our business. We refer to ` +
                  i`entities that list and sell items on Wish’s marketplace platform as ` +
                  i`"Merchant(s)."`
                }
              />
            </li>
            <li>
              <Markdown
                openLinksInNewTab
                text={
                  i`1.2. "**Application**" means any website, and/or any mobile application ` +
                  i`including, without limitation, [merchant.wish.com](merchant.wish.com), ` +
                  i`[parcel.wish.com](parcel.wish.com), that Wish offers to support the Services.`
                }
              />
            </li>
            <li>
              <Markdown
                openLinksInNewTab
                text={
                  i`1.3. "**Wish Parcel Merchant**" means you if you list and sells items on any ` +
                  i`marketplace platform, other online channels, or in brick and mortar stores or ` +
                  i`locations and are seeking logistics fulfilment services under this Agreement ` +
                  i`and through the Application. If you list and sells items on Wish’s marketplace ` +
                  i`platform, Wish’s [Merchant Terms](https://merchant.wish.com/terms-of-service) ` +
                  i`also apply to you.`
                }
              />
            </li>
            <li>
              <Markdown
                text={
                  i`1.4. "**Products**" means the products that are not owned or manufactured by ` +
                  i`Wish that you seek logistics fulfilment service offerings for by and when ` +
                  i`using the Application.`
                }
              />
            </li>
            <li>
              <Markdown
                text={
                  i`1.5. "**Services**" means the Application relating to Wish’s "Wish Parcel" ` +
                  i`program, including Wish Parcel Service Offerings, and any related Wish ` +
                  i`programs or services.`
                }
              />
            </li>
            <li>
              <Markdown
                text={
                  i`1.6. "**Third Party Service Provider**" means carriers or other third party ` +
                  i`logistics services providers (e.g., UPS).`
                }
              />
            </li>
          </ol>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Use of Application.** You must abide by Wish's applicable policies and ` +
                  i`guidelines stated in these Terms and Conditions and the Wish policy and ` +
                  i`guideline documents listed below (which are incorporated into these Terms and ` +
                  i`Conditions by reference), each of which, in addition to these Terms and ` +
                  i`Conditions, may be updated by Wish, or Third Party Service Providers, from ` +
                  i`time to time in its sole discretion without notice to you:`
                }
              />
            </TosP>
          </li>
          <ul style={{ listStyleType: "circle" }}>
            <li>
              <Link openInNewTab href={"/api-partner-terms-of-service"}>
                Wish API Terms of Service
              </Link>
            </li>
            <li>
              <Link
                openInNewTab
                href={
                  "https://s3-us-west-1.amazonaws.com/sweeper-production-merchant-fbw/FBW+Prohibited+Items.pdf"
                }
              >
                Prohibited and Restricted Product Guidelines
              </Link>
            </li>
            <li>
              Any applicable carrier or other third party logistics service
              provider’s terms of service, including those applicable to the
              distribution or shipment of Products ("Third Party Service
              Provider Terms")
            </li>
            <li>
              All other policies or guidelines published or made available by
              Wish in connection with the Services.
            </li>
          </ul>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Eligibility.** Wish's Services are available only to, and may only be used ` +
                  i`by, individuals who are at least 18 years and who can form legally binding ` +
                  i`contracts under applicable law. You represent and warrant that you are at ` +
                  i`least 18 years old and that all registration information you submit is ` +
                  i`accurate and truthful. Wish may, in its sole discretion, refuse to offer ` +
                  i`access to or use of the Service to any person or entity or change its ` +
                  i`eligibility criteria at any time. This provision is void where prohibited by ` +
                  i`law and the right to access the Application and/or Service is revoked in such ` +
                  i`jurisdictions. Wish reserves the right, to the extent permitted by applicable ` +
                  i`laws and to the extent available, to conduct background checks verifying your ` +
                  i`eligibility to participate in the Service.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Logistics Services Offerings.** The Wish Parcel program provides a range of ` +
                  i`logistics services offerings to you, including placing logistics orders, ` +
                  i`facilitating generating shipping labels, tracking logistics information, ` +
                  i`settling freight and other shipping-related fees, including duties and taxes ` +
                  i`from third party carriers, if applicable, and using various third party ` +
                  i`carriers or other logistics service providers’ services via the Application. ` +
                  i`As further specified on the Application you are entitled to (i) use of the ` +
                  i`Services in compliance with this Agreement via the Application and as set ` +
                  i`forth in these Terms and Conditions (including Wish's policies and/or ` +
                  i`guidelines incorporated herein by reference); (ii) use the logistics service ` +
                  i`offerings to fulfill orders for Products using the Application and in ` +
                  i`accordance with these Terms and Conditions (including Wish's policies and/or ` +
                  i`guidelines as incorporated herein by reference and the terms, policies or ` +
                  i`guidelines of any third party carrier or other third party logistics service ` +
                  i`provider offered through the Application ("Third Party Service Provider ` +
                  i`Terms")), and (iii) perform such other services relating to the foregoing ` +
                  i`activities as set forth on the Application and in these Terms and Conditions ` +
                  i`(including Wish's policies and/or guidelines incorporated herein by reference ` +
                  i`and Third Party Service Provider Terms) or otherwise reasonably requested by ` +
                  i`Wish (collectively, Wish Parcel Service Offerings"). Wish reserves the right, ` +
                  i`in Wish's sole discretion, to cancel your unconfirmed or inactive accounts ` +
                  i`and/or to refuse to offer the Application and/or Services to you, for any (or ` +
                  i`no) reason and at any time. In no event shall title to any Product orders you ` +
                  i`fulfil using Wish Parcel Service Offerings transfer to Wish, even if Wish ` +
                  i`takes possession of Product in connection with any sale, return, or ` +
                  i`disposition of abandoned Products, including any Products that are not ` +
                  i`retrieved by a customer.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Product Loss.** Any claims by you for loss or damage to Products that may ` +
                  i`occur when using Wish Parcel Service Offerings must be submitted to the ` +
                  i`applicable Third Party Service Provider in accordance with the Third Party ` +
                  i`Service Provider’s Terms. Wish shall not be responsible for any product loss.`
                }
              />
            </TosP>
          </li>
          <li>
            <Markdown text={i`**Fees; Taxes.**`} />
          </li>
          <ol style={{ listStyleType: "none" }}>
            <li>
              <TosP>
                <Markdown text={i`6.1 **Fees.**`} />
              </TosP>
              <TosP>
                You will be charged fees or other payments for Wish Parcel
                Service Offerings based on the specific form of logistics
                fulfilment services you choose and its related payment policy.
                You will be separately informed in Application, or by an email,
                regarding relevant fees with applicable taxes for the Wish
                Parcel Services you choose to use. This information is available
                to you in your Wish Merchant account or your Wish Parcel
                Account, as the case may be, under Account {">"} Legal in the
                Application, or as otherwise communicated to you by Wish.
                Payment of logistics service fees to Wish for Wish Parcel
                Service Offerings must be made prepaid. You understand and agree
                that Wish may hold these prepaid funds for a specified period of
                time until after the logistics service is completed and all
                related shipping and logistics fees are settled with any third
                party carriers and/or other third party logistics providers.
              </TosP>
              <TosP>
                Payment to Wish by you for Wish Parcel Service Offerings is
                considered made and complete upon transmission to Wish of the
                payment amount owed to Wish for Wish Parcel Service Offerings
                using the payment method you have selected (e.g., PayPal, or
                others as may be added or removed from the Application from time
                to time). Each payment provider or processor may have its own
                terms of use or other legal requirements, and Wish does not
                guarantee and is not responsible for any services provided by
                such payment provider or processor (including, without
                limitation, any remittance of payment, security protocols or
                obligations by or to you, accurate and timely disbursal of
                payments made by or to you, non- availability of services, etc.,
                of such payment provider or processor). Risk of loss from and
                nonpayment by the payment provider or processor remains with
                you.
              </TosP>
              <TosP>
                For any amounts that we determine you owe us, we may (a) charge
                your account or any payment instrument you provide to us; (b)
                offset any amounts that are payable by you to us (in
                reimbursement or otherwise) against any payments we may make to
                you or amounts we may owe you; (c) invoice you for amounts due
                to us, in which case you will pay the invoiced amounts upon
                receipt; (d) reverse any credits to you; or (e) collect payment
                or reimbursement from you by any other lawful means. If we
                determine that your account has been used to engage in
                deceptive, fraudulent, or illegal activity, or to violate our
                policies, then we may in our sole discretion permanently
                withhold any payments to you. In addition, we may require that
                you pay other amounts to secure the performance of your
                obligations under this Agreement or to mitigate the risk of
                returns, chargebacks, claims, disputes, violations of our terms
                or policies, or other risks to Wish or third parties. These
                amounts may be refundable or nonrefundable in the manner we
                determine, and failure to comply with terms of this Agreement,
                including any applicable policies, may result in their
                forfeiture.
              </TosP>
              <TosP>
                If Wish determines that your actions or performance may result
                in returns, chargebacks, claims, disputes, violations of our
                terms or policies, or other risks to Wish or third parties, then
                Wish may in its sole discretion charge fees or withhold any
                payments or refunds to you for as long as Wish determines any
                related risks to Wish or third parties persist. Transactions for
                which Wish cannot confirm delivery of Products may be ineligible
                for refunds or reimbursement.
              </TosP>
            </li>
            <li>
              <TosP>
                <Markdown text={i`6.2 **Taxes.**`} />
              </TosP>
              <TosP>
                You will be solely responsible for the remittance to the proper
                taxing authorities of all tax or similar taxes due, if any, with
                respect to this agreement. You will be solely liable for, and
                will indemnify and hold Wish harmless against, all tax liability
                (including interest, penalties, and costs and expenses,
                including without limitation reasonable attorneys’ fees)
                assessed on you related to this Agreement.
              </TosP>
            </li>
          </ol>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Termination.** This Agreement may be terminated: (i) by either Party in the ` +
                  i`event of the other Party’s material breach if such breach is not cured within ` +
                  i`ten (10) days after terminating Party’s written notice to the breaching Party; ` +
                  i`(ii) by you, for any reason (or no reason at all), by thirty (30) days’ ` +
                  i`advance written notice to Wish; and (iii) By Wish, for any reason (or no ` +
                  i`reason at all), by written notice to you or no notice at all. Any customer ` +
                  i`orders in effect through the Application and/or Service prior to termination ` +
                  i`shall not be affected by termination and such orders will continue to be ` +
                  i`governed by the terms of this Agreement.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Breach; Remedies.** Without limiting any other rights or remedies, Wish may ` +
                  i`(without notice to you and without refunding any fees or payments to you): ` +
                  i`issue a warning to you, warn Wish's community of your actions, temporarily or ` +
                  i`indefinitely restrict or prohibit your access to the Services, temporarily or ` +
                  i`indefinitely suspend, freeze or terminate your account(s), cause payments or ` +
                  i`account balances due to you, if any, to be withheld or forfeited, take any ` +
                  i`other actions as may be required by law, and/or take technical and legal steps ` +
                  i`to keep you off the Application and from participating in the Service if: 1) ` +
                  i`you breach these Terms and Conditions (including, without limitation, any ` +
                  i`terms, policies or guidelines incorporated herein, including Third Party ` +
                  i`Service Provider Terms); 2) Wish is unable to verify or authenticate any of ` +
                  i`your personal information; 3) Wish is unable to verify or suspects you of ` +
                  i`underdeclaring shipping weighs or dimensions on Products for which you are ` +
                  i`using the Wish Parcel Service Offerings to ship; or 4) Wish believes or ` +
                  i`suspects that you are acting inconsistently with the letter or spirit of ` +
                  i`Wish's policies, including but not limited to shipping Products in violation ` +
                  i`of these Terms and Conditions, any Third Party Service Provider’s Terms, or ` +
                  i`any applicable law, rules and regulations; and/or 4) Wish believes or suspects ` +
                  i`you have engaged in improper or fraudulent activity in connection with using ` +
                  i`the Application and/or Services, or your actions may cause legal liability or ` +
                  i`financial loss to Wish or third parties.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Indemnification.** Wish hereby agrees to defend, indemnify and hold harmless ` +
                  i`you and your respective affiliates, and their respective directors, officers, ` +
                  i`employees, and agents from and against any and all third party claims (each, a ` +
                  i`"**Claim**") brought against you to the extent that the Claim arises from ` +
                  i`allegations that Wish’s Application infringes or misappropriates a third ` +
                  i`party’s intellectual property rights.`
                }
              />
            </TosP>
            <TosP>
              You hereby agree to defend, indemnify and hold harmless Wish and
              its respective affiliates, and their respective directors,
              officers, employees, and agents from and against any Claim arising
              out of or resulting from: (a) your negligence; (b) any personal
              injury, death or property damage (to the extent the injury or
              death or property damage is not caused by Wish); (c) your taxes;
              or (d) your willful misconduct.
            </TosP>
            <TosP>
              The foregoing indemnification obligations shall only apply if the
              indemnifying party is promptly notified of the applicable Claims
              (provided the failure to promptly notify shall only relieve the
              indemnifying party of its obligations to the extent it can
              demonstrate material prejudice from such failure) and is given
              reasonable assistance and sole control over defense and settlement
              of the applicable Claims. Notwithstanding the above, you may not
              consent to the entry of any judgment or enter into any settlement
              of Claims on behalf of Wish without Wish’s prior written consent.
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Insurance.** If requested by Wish, then within thirty (30) days thereafter, ` +
                  i`you will maintain at your expense throughout the term of this Agreement, ` +
                  i`general commercial, umbrella or excess liability insurance with the limits per ` +
                  i`occurrence and in aggregate requested by us covering liabilities caused by or ` +
                  i`occurring in conjunction with the operation of your business, including ` +
                  i`products, products/completed operations and bodily injury, with policy(ies) ` +
                  i`naming Wish and its Affiliates and assignees as additional insureds. At our ` +
                  i`request, you will provide to us certificates of insurance for the coverage. ` +
                  i`Failure of Wish to obtain a certificate of insurance from you will not relieve ` +
                  i`you of your insurance obligations.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Confidential Information.** You understand and agree that during the Term ` +
                  i`you may be furnished with or otherwise have access to information, whether ` +
                  i`disclosed in writing, orally or by other means, that Wish considers to be ` +
                  i`confidential, including but not limited to business, financial and technical ` +
                  i`information, plans, software, systems, reports, forecasts, prices, trade ` +
                  i`secrets, processes and know-how, whether tangible or intangible (the ` +
                  i`"**Confidential Information**"). The Confidential Information includes, ` +
                  i`without limitation, any data and information relating to Wish’s logistics ` +
                  i`programs, Merchants or customers. Notwithstanding the foregoing, Confidential ` +
                  i`Information shall not include information which: (i) is or becomes generally ` +
                  i`publicly available through no act or omission of you; or (ii) you rightfully ` +
                  i`obtains from third parties without restriction as evidenced by written ` +
                  i`records. You agree to: (a) use the Confidential Information only for the ` +
                  i`purpose of performing its obligations hereunder; and (b) secure, protect and ` +
                  i`maintain the confidentiality of the Confidential Information using at least as ` +
                  i`great a degree of care as it uses to maintain the confidentiality of its own ` +
                  i`most confidential information, but in no event less than reasonable care. You ` +
                  i`shall not reproduce Confidential Information except as necessary in ` +
                  i`furtherance of the purpose of these Terms and Conditions. You may release ` +
                  i`Confidential Information required to be disclosed by law only pursuant to a ` +
                  i`duly authorized subpoena, court order or government authority and provided ` +
                  i`that you notify Wish prior to disclosure (if legally permissible) and allows ` +
                  i`Wish the opportunity to seek a protective order or other appropriate remedy ` +
                  i`protecting its Confidential Information from disclosure, and to the extent you ` +
                  i`are then required to disclose any such Confidential Information, it shall ` +
                  i`limit its disclosure thereof to the greatest extent possible under the ` +
                  i`circumstances.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={i`**Privacy.** Please refer to the [Wish Parcel Privacy Policy](${PrivacyPolicySectionId}) to understand how Wish collects
                and uses your personal information.`}
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Anti-Corruption; Compliance.** You must comply with all applicable ` +
                  i`anti-corruption laws and regulations concerning bribery, money laundering, ` +
                  i`corruption, terrorist financing, and financial recordkeeping (including but ` +
                  i`not limited to, the United States Foreign Corrupt Practices Act and the United ` +
                  i`Kingdom Bribery Act). You must not offer, promise, give, or accept a bribe or ` +
                  i`anything of value, either directly or indirectly, to government officials to ` +
                  i`encourage them to act improperly or to reward them for doing so, or obtain or ` +
                  i`provide undue or improper advantages to anyone for any reason. You agree to ` +
                  i`comply with all export, import, and trade control laws, regulations and orders ` +
                  i`applicable to the export, re-export, transfer, import, sale or use of ` +
                  i`Products. Without limiting the foregoing, you represent and warrant that you ` +
                  i`are not and shall not sell, transfer, export or re-export to, or otherwise ` +
                  i`provide Products under this Agreement, directly or indirectly, (i) to any ` +
                  i`country (or national or government thereof), state, territory, or region, that ` +
                  i`is subject to sanctions measures issued or adopted from time to time by U.S. ` +
                  i`Department of the Treasury’s Office of Foreign Assets Control ("OFAC") ` +
                  i`(currently Cuba, Iran, North Korea, Syria, and the Crimea region of Ukraine) ` +
                  i`or any other applicable sanctions, including the sanctions laws of any other ` +
                  i`country with jurisdiction over you (collectively, "Sanctions"); (ii) to any ` +
                  i`person to whom delivery is prohibited under Trade Control Laws or Sanctions, ` +
                  i`including, without limitation, to any person or entity identified on (A) the ` +
                  i`Denied Persons List as maintained by the U.S. Department of Commerce Bureau of ` +
                  i`Industry and Security or (B) the list of Specially Designated Nationals and ` +
                  i`Blocked Persons as maintained by OFAC, or (iii) for any end-use prohibited ` +
                  i`under Trade Control Laws or Sanctions, including, without limitation, for any ` +
                  i`missile, chemical weapons or nuclear end uses).`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Warranty Disclaimer.** EXCEPT AS EXPRESSLY STATED IN THESE TERMS AND ` +
                  i`CONDITIONS, NEITHER PARTY MAKES (AND HEREBY DISCLAIMS) ANY EXPRESS OR IMPLIED ` +
                  i`WARRANTY, INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF MERCHANTABILITY, ` +
                  i`NONINFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Limitation of Liability.** TO THE FULLEST EXTENT PERMITTED BY APPLICABLE ` +
                  i`LAW, IN NO EVENT SHALL WISH BE LIABLE TO YOU IN CONNECTION WITH THE SERVICES ` +
                  i`AND THESE TERMS AND CONDITIONS, REGARDLESS OF THE FORM OR THEORY OF ACTION, ` +
                  i`FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, PUNITIVE, SPECIAL, OR OTHER ` +
                  i`SIMILAR DAMAGES, HOWEVER CAUSED, REGARDLESS OF WHETHER SUCH PARTY HAS BEEN ` +
                  i`ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR LOSSES. FURTHER, WISH’S ` +
                  i`AGGREGATE LIABILITY SHALL NOT EXCEED THE PAYMENTS YOU PAID TO WISH DURING THE ` +
                  i`SIX (6) MONTH PERIOD PRIOR TO THE DATE THE CAUSE OF ACTION OR CLAIM AROSE, OR, ` +
                  i`IF NO FEES APPLY, ONE HUNDRED ($100) U.S. DOLLARS.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Publicity and Use of Wish Marks.** You may not use Wish’s name, trademarks, ` +
                  i`or logos (the "Wish Marks") without Wish’s prior written consent. If Wish ` +
                  i`approves your use of the Wish Marks, you shall (a) only use the Wish Marks in ` +
                  i`accordance with any quality standards and usage guidelines, as may be ` +
                  i`prescribed by Wish from time to time, and (b) immediately cease all use of the ` +
                  i`Wish Marks when requested by Wish. Without limiting the foregoing, you may ` +
                  i`not use the Wish Marks in any manner or in connection with any products or ` +
                  i`services that are (i) misleading, defamatory, libelous, obscene, vulgar, ` +
                  i`profane, scandalous, or otherwise objectionable; (ii) used in connection with ` +
                  i`any material that infringes the rights of any third party, including without ` +
                  i`limitation intellectual property rights; or (iii) offered by any company other ` +
                  i`than Wish.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**License to Wish.** You grant Wish a worldwide royalty-free, perpetual, ` +
                  i`non-exclusive, sublicensable, transferable (through multiple tiers), license ` +
                  i`to use, publish, disclose, display, reproduce, perform, display, transfer and ` +
                  i`otherwise distribute, synchronize, broadcast, adapt, modify, excerpt, analyze, ` +
                  i`re-format, create derivative works of, and otherwise commercially or ` +
                  i`non-commercially exploit in any manner your Content (as defined below) in any ` +
                  i`medium or in any format and for any purpose, including, without limitation, ` +
                  i`for the advertising, marketing, or promotion of Wish, the Services, the ` +
                  i`Application, or the Wish Parcel Services Offerings. "Content" shall be defined ` +
                  i`to mean data, text, descriptions, pricing, information, usernames, graphics, ` +
                  i`images, pictures, photographs, profiles, business names, audio, video, ` +
                  i`products, items, listings, links, names, images, likenesses, trademarks, ` +
                  i`service marks, copyrights and other materials that you submit, post, display, ` +
                  i`or use in connection with the Services, the Application, or the Wish Parcel ` +
                  i`Services Offerings.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                openLinksInNewTab
                text={
                  i`**Referral Programs.** Wish may offer referral programs and may allow you to ` +
                  i`participate in such referral programs. You acknowledge and agree that Wish may ` +
                  i`terminate referral programs or your participation in a referral program at any ` +
                  i`time and that your participation will be governed by the [Wish Referral ` +
                  i`Program Terms](https://www.promoter.wish.com/terms-and-conditions) and/or ` +
                  i`other program terms, as applicable.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Beta, Pilot or Trial Programs.** From time to time, Wish may, in its sole ` +
                  i`discretion, invite you to participate in a pilot or trial program or to use ` +
                  i`beta features that are in development and not yet available to all Wish Parcel ` +
                  i`users ("Beta Programs"). Beta Programs may be subject to additional terms and ` +
                  i`conditions which Wish will provide to you prior to your use of the Beta ` +
                  i`Programs. Such Beta Programs and all communications or materials (oral or ` +
                  i`written) relating to Beta Programs will be considered Wish Confidential ` +
                  i`Information and subject to the confidentiality provisions in these Terms and ` +
                  i`Conditions. You agree that you will not make any public statements or disclose ` +
                  i`your participation in any of the Beta Programs without Wish’s prior written ` +
                  i`consent. Wish makes no representations or warranties regarding the Beta ` +
                  i`Programs. Wish may change, cancel or discontinue the Beta Programs at any ` +
                  i`time, in Wish’s sole discretion. To the extent permitted by applicable law, ` +
                  i`Wish will have no liability for any harm or damage arising out of or in ` +
                  i`connection with a Beta Program.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Relationship of Parties.** You shall perform any and all services under ` +
                  i`these Terms and Conditions as an independent contractor. Nothing in these ` +
                  i`Terms and Conditions shall be construed to express or imply a joint venture, ` +
                  i`partnership, principal/agent, affiliate, fiduciary or employer/employee ` +
                  i`relationship between Wish and you.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                openLinksInNewTab
                text={
                  i`**Dispute Resolution.** These Terms and Conditions shall be governed by and ` +
                  i`construed in accordance with the laws of the State of California (without ` +
                  i`regard to the conflicts of laws provisions thereof or the UN Convention on the ` +
                  i`International Sale of Goods). You and Wish agree that any dispute, claim or ` +
                  i`controversy arising from or relating to the subject matter of these Terms and ` +
                  i`Conditions shall be finally settled by binding arbitration in San Francisco, ` +
                  i`California before one commercial arbitrator with substantial experience in ` +
                  i`resolving commercial contract disputes, in accordance with the JAMS’s ` +
                  i`Comprehensive Arbitration Rules and Procedures then in effect and currently ` +
                  i`available at [http://www.jamsadr.com/rules-comprehensive-arbitration/](${jamsArbitrationLink}) ` +
                  i`unless the amount of claim as specified by the claimant in the arbitration ` +
                  i`does not exceed $250,000 (in which case the JAMS Streamlined Arbitration Rules ` +
                  i`and Procedures then in effect and currently available ` +
                  i`at [http://www.jamsadr.com/rules-streamlined-arbitration/](${jamsArbitrationLink}) ` +
                  i`shall apply). Notwithstanding the foregoing, each party shall have the right ` +
                  i`to pursue injunctive or other equitable relief from any court of competent ` +
                  i`jurisdiction at any time. The JAMS’s rules are also available ` +
                  i`at [www.jamsadr.com](www.jamsadr.com) or by calling JAMS at 800-352-5267. If ` +
                  i`JAMS is not available to arbitrate, the parties will select an alternative ` +
                  i`arbitral forum. The arbitration will be conducted in English and shall be the ` +
                  i`exclusive forum for resolving such dispute. Judgment upon the award rendered ` +
                  i`by such arbitrator may be entered in any court of competent jurisdiction. In ` +
                  i`any dispute, the prevailing party will be entitled to recover costs and ` +
                  i`attorneys’ fees.`
                }
              />
            </TosP>
            <TosP>
              <Markdown
                text={
                  i`**YOU AND WISH HEREBY WAIVE ANY CONSTITUTUONAL AND STATUTORY RIGHTS TO SUE IN ` +
                  i`COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR JURY. Any arbitration under this ` +
                  i`Agreement will take place on an individual basis; class, mass, consolidated or ` +
                  i`combined actions or arbitrations or proceeding as a private attorney general ` +
                  i`are not permitted. You and Wish are each waiving the right to trial by jury. ` +
                  i`You and Wish are further giving up the ability to participate in a class, ` +
                  i`mass, consolidated or combined action or arbitration.**`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Electronic Communications.** You agree to receive communications from Wish ` +
                  i`electronically, such as emails, texts, mobile push notices, or notices and ` +
                  i`message on the Application and/or as part of the Service, and to retain copies ` +
                  i`of these communications for your records. You agree that all terms and ` +
                  i`conditions, agreements, notices, disclosures, and other communications and ` +
                  i`documents that Wish provides to you electronically will have the same legal ` +
                  i`effect that such communications or documents would have if they were set forth ` +
                  i`in "writing."`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Modification.** Wish may unilaterally change these Terms and Conditions (or ` +
                  i`any policy or guideline published by Wish) at any time and in our sole ` +
                  i`discretion. If Wish does so, it will attempt to bring such change to the ` +
                  i`attention of you by sending such party an email, placing a notice on the ` +
                  i`Application, in any policy or other document, or by some other means made ` +
                  i`available to you. In addition, the Third Party Service Providers (e.g., UPS) ` +
                  i`who provide logistics services as part of the Wish Parcel Service may change ` +
                  i`their Third Party Service Provider Terms at any time in their sole discretion. ` +
                  i`You are responsible for reviewing these Terms and Conditions (or any policy or ` +
                  i`guideline published by Wish) and Third Party Provider Terms and informing ` +
                  i`yourself of all applicable modifications, changes or notices. Any such change ` +
                  i`or modification will be effective upon the posting of a new set of terms on or ` +
                  i`within our Application, in any policy or other document, or by some other ` +
                  i`means made available to you (which we may do with or without notice to you) ` +
                  i`and will apply to all Products arranged to be shipped after such posting. ` +
                  i`Except as set forth in this Section 21, no changes or modifications or waivers ` +
                  i`are to be made to these Terms and Conditions unless evidenced in writing and ` +
                  i`signed for and on behalf of both parties.`
                }
              />
            </TosP>
          </li>
          <li>
            <TosP>
              <Markdown
                text={
                  i`**Miscellaneous.** You agree to comply with all applicable laws, rules and ` +
                  i`regulations. You may not assign its rights or obligations under these Terms ` +
                  i`and Conditions without the consent of Wish. Wish may freely assign its rights ` +
                  i`and/or obligation under these Terms and Conditions. The failure of either ` +
                  i`party to enforce its rights under these Terms and Conditions shall not be ` +
                  i`construed as a waiver of such rights. These Terms and Conditions supersede all ` +
                  i`proposals, oral or written, all negotiations, conversations, or discussions ` +
                  i`between or among the parties relating to the subject matter of these Terms and ` +
                  i`Conditions and all past dealing or industry custom. In the event that any ` +
                  i`provision of these Terms and Conditions shall be determined to be illegal or ` +
                  i`unenforceable, that provision will be limited or eliminated to the minimum ` +
                  i`extent necessary so that these Terms and Conditions shall otherwise remain in ` +
                  i`full force and effect and enforceable. Sections 1-3, 5-11, 14-17, 21 and 23-24 ` +
                  i`will survive the termination or expiration of these Terms and Conditions. ` +
                  i`Neither party shall have any express or implied right or authority to assume ` +
                  i`or create any obligations on behalf of or in the name of the other party or to ` +
                  i`bind the other party to any contract, agreement or undertaking with any third ` +
                  i`party. Headings and captions are for convenience only and are not to be used ` +
                  i`in interpretation of these Terms and Conditions.`
                }
              />
            </TosP>
          </li>
        </ol>
      </TosSection>
    </TosCard>
  );
};

export default observer(TermsOfUseCard);
