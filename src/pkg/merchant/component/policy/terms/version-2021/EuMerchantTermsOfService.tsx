/* eslint-disable local-rules/unnecessary-list-usage */
/* eslint-disable local-rules/use-formatCurrency */

/* External Libraries */
import moment from "moment/moment";

/* eslint-disable local-rules/use-markdown */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { wishURL } from "@toolkit/url";
import { formatDatetimeLocalized } from "@toolkit/datetime";

import { Datetime } from "@schema/types";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type EuMerchantTermsOfServiceProps = BaseProps & {
  readonly releaseDate?: Pick<Datetime, "unix">;
};

export default observer((props: EuMerchantTermsOfServiceProps) => {
  const { className, style, releaseDate } = props;
  const dateFormat = "MMMM D, YYYY";
  // Defaults to October 04, 2021.
  const effectiveDate = useMemo(
    () => moment.unix(releaseDate?.unix || 1633320000),
    [releaseDate]
  );
  const continueUsageDate = useMemo(
    () => moment(effectiveDate).add(30, "days"),
    [effectiveDate]
  );
  const previousTosUrl = "/terms-of-service?version=4";
  const cnTosUrl = "/terms-of-service?country=CN&version=5";
  const generalTosUrl = "/terms-of-service?country=NA&version=5";
  const partnersTosUrl = "/api-partner-terms-of-service";
  const wishPostTosUrl = "https://www.wishpost.cn/welcome/#/terms-of-service";
  const policyHomeUrl = "/policy/home";
  const taxPolicyUrl = "/tax/policy";
  const policyFeesUrl = "/policy/fees_and_payments";
  const wishPrivacyPolicyUrl = wishURL("/privacy_policy");
  const wishExpressTosUrl = "/wish-express/tos";
  const fbwTosUrl = "/fbw/tos";
  const wishLocalTermsUrl = wishURL("/local/terms");
  const wishLocalInviteTermsUrl = wishURL("/local/invite/en-terms");
  const productBoostTosUrl = "/product-boost/tos";
  const wpsTosUrl = "https://parcel.wish.com/wpstos";
  const wishTermsUrl = wishURL("/terms");
  const merchantNoticesEmail = "mailto:merchant_notices@wish.com";
  const returnPolicyUrl = wishURL("/return_policy");
  const productBoostUrl = "/product-boost";

  return (
    <div className={css(className, style)}>
      <Markdown
        openLinksInNewTab
        text={
          i`**Important Note: This Merchant Terms of Service and Agreement applies to ` +
          i`merchants who reside in the European Union and the United Kingdom. ` +
          i`(Please find the Merchant Terms of Service and Agreement for China ` +
          i`[here](${cnTosUrl}), and the Merchant Terms of ` +
          i`Service and Agreement for anywhere other than the European Union, the ` +
          i`United Kingdom, and China [here](${generalTosUrl}).) **`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**The version of the Merchant Terms of Service and Agreement in English is ` +
          i`the definitive legal version. This Merchant Terms of Service and Agreement ` +
          i`was updated on ${formatDatetimeLocalized(
            effectiveDate,
            dateFormat
          )}, and ` +
          i`is effective upon new users as of that date. If you registered before ` +
          i`${formatDatetimeLocalized(
            effectiveDate,
            dateFormat
          )}, your use of the ` +
          i`Services will be governed by the terms below as of ` +
          i`${formatDatetimeLocalized(continueUsageDate, dateFormat)}.** To ` +
          i`view the previous terms, click [here](${previousTosUrl}).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**The above “Important Note” constitutes an integral part of this Merchant ` +
          i`Terms of Service and Agreement. **`
        }
      />

      <div>
        <h1>Merchant Terms of Service and Agreement</h1>
      </div>

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Please read this Merchant Terms of Service and Agreement (“**terms of ` +
          i`service**” or “**Terms**”) carefully before using services, including, ` + // eslint-disable-next-line local-rules/no-hardcoded-wish-link
          i`without limitation, the website at https://www.wish.com, the app offered ` +
          i`under the name Wish, and all other websites, apps, and services offered by ` +
          i`or through us pursuant to this Agreement (as defined below) (collectively, ` +
          i`the “**Services**”) offered by ContextLogic Inc. (“**Wish**,” “**we**,” ` +
          i`and “**us**”). Unless otherwise agreed to in writing by you and Wish, by ` +
          i`registering for or otherwise using the Services in any manner, including, ` +
          i`but not limited to, visiting or browsing the Services, you agree to be ` +
          i`bound by and comply with these Terms, and all additional terms and ` +
          i`conditions (“**Additional Terms**”) and policies and guidelines ` +
          i`(“**Policies**”) referenced herein or published or made available by Wish, ` +
          i`in each case to the extent such Additional Terms and Policies are ` +
          i`applicable to your use of the Services or activities on the Wish platform, ` +
          i`including, without limitation, the following provisions of these Terms: ` +
          i`(a) receiving communications and conducting transactions electronically, ` +
          i`(b) disclaimers of warranties, (c) damage and remedy exclusions and ` +
          i`limitations, (d) binding arbitration, and (e) choice of Dutch law.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The Additional Terms and Policies include, but are not limited to, the ` +
          i`following.`
        }
      />

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Wish API Terms of Service](${partnersTosUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`[Merchant Policies](${policyHomeUrl}) (including all ` +
              i`subsections incorporated therein)`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Wish Merchant Tax Policy](${taxPolicyUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Fees and Payments Policy](${policyFeesUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Privacy Policy](${wishPrivacyPolicyUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Wish Express Qualifications and Terms](${wishExpressTosUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[WishPost](${wishPostTosUrl}) Platform Service Agreement`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Fulfillment By Wish Terms and Conditions](${fbwTosUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`[Wish Local Participant Terms and ` +
              i`Conditions](${wishLocalTermsUrl})`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Wish Local Retailer Referral Terms of Use](${wishLocalInviteTermsUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[ProductBoost Addendum](${productBoostTosUrl})`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`[Wish Parcel Terms and Conditions](${wpsTosUrl})`}
          />
        </li>
      </ul>
      <p>&nbsp;</p>
      <Markdown
        openLinksInNewTab
        text={
          i`All Additional Terms and Policies are hereby specifically incorporated ` +
          i`herein by reference, and the Terms, together with all Additional Terms and ` +
          i`Policies, form the entire agreement between you and Wish (the ` +
          i`“**Agreement**”) with respect to the subject matter hereof and supersede ` +
          i`all prior agreements. To the extent that the Terms conflict with any other ` +
          i`Additional Terms or Policies provided by or through us, the Additional ` +
          i`Terms or Policies, respectively, shall control to the extent of the ` +
          i`conflict. Any additional terms and conditions you may propose in any order ` +
          i`confirmation or other documentation are rejected and shall have no effect ` +
          i`unless expressly agreed to by us in a separate written agreement with you. ` +
          i``
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`This Agreement sets forth the terms and conditions legally binding on you ` +
          i`(“**you**” or “**Merchant**”) acting as a merchant or other business ` +
          i`account user (including as a participant in our “Wish Local” program, as ` +
          i`set forth in the [Wish Local Participant Terms and ` +
          i`Conditions](${wishLocalTermsUrl}), or as a wholesale purchaser or ` +
          i`seller) of our website(s), applications, (“**apps**”), and Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Please note that Sections 8 and 9 of the Terms contain an arbitration ` +
          i`clause and class action waiver. By agreeing to the Agreement, you agree to ` +
          i`resolve all Disputes (defined below) through binding individual ` +
          i`arbitration, which means that you waive any right to have those Disputes ` +
          i`decided by a judge or jury, and that you waive your right to participate ` +
          i`in class actions, class arbitrations, or representative actions. Please ` +
          i`read Sections 8 and 9 carefully.**`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>1. Wish Is a Marketplace</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`As applicable under Applicable Laws, you understand and agree that Wish is ` +
          i`a marketplace and as such is not responsible or liable for any content, ` +
          i`data, text, information, usernames, graphics, images, photographs, ` +
          i`profiles, audio, video, items, products, services, listings, links, or ` +
          i`information posted or provided by you, other merchants, or other third ` +
          i`parties on or through Wish or any of the Services. You use the Services at ` +
          i`your own risk. You will comply with these Terms and all Additional Terms ` +
          i`and Policies applicable to any products or services you provide through or ` +
          i`offer in connection with the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`As applicable under Applicable Laws, to the fullest extent permitted by ` +
          i`law, you and your Affiliates (defined below) waive claims related to, and ` +
          i`agree that Wish and Wish’s Affiliates, including any of their officers, ` +
          i`directors, employees, consultants, or agents, are not responsible for: (a) ` +
          i`any statements, guarantees, representations, or warranties made by you or ` +
          i`any third party through the Services, including with respect to any ` +
          i`product, service, or expected transactions, and including merchantability, ` +
          i`fitness for any particular purposes, or any other express or implied ` +
          i`warranties; (b) implied warranties based on the transaction process, the ` +
          i`performance of the contract, trading practices, or course of dealing; or ` +
          i`(c) any duties, responsibilities, rights, claims, or tort reliefs, whether ` +
          i`or not they are due to Wish’s or any of its Affiliates’ negligence. ` +
          i`“**Affiliate**” shall mean, with respect to any person or entity, any ` +
          i`other person or entity that directly or indirectly controls, is controlled ` +
          i`by, or is under common control with that person or entity.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`If you have a dispute with any third party over any product, service, ` +
          i`offering, or interaction over the Services, you agree not to make any ` +
          i`claim of any kind or nature against Wish or its Affiliates with respect to ` +
          i`such dispute, no matter whether any claims, requirements, or compensation ` +
          i`of damages are known, insured, or released, as applicable under Applicable ` +
          i`Laws.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>2. Membership Eligibility</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`**Age:** Wish’s Services are available only to, and may only be used by, ` +
          i`individuals who are at least 18 years old, and who can form legally ` +
          i`binding contracts under Applicable Laws. You represent and warrant that ` +
          i`(a) you are at least 18 years old, (b) you can form legally binding ` +
          i`contracts under relevant Applicable Laws, and (c) all registration ` +
          i`information you submit is accurate and truthful. Wish may refuse to offer ` +
          i`access to or use of the Services to any person or entity or change its ` +
          i`eligibility criteria at any time as provided herein. This provision is ` +
          i`void where prohibited by Applicable Laws, and the right to access the ` +
          i`Services is revoked in such jurisdictions.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Compliance:** You agree to comply with all applicable laws, rules, ` +
          i`regulations, ordinances, orders, licenses, permits, judgments, decisions, ` +
          i`and other requirements of any governmental authority, whether domestic, ` +
          i`international, federal, state, local, or provincial, and whether in effect ` +
          i`now or in the future and as may be amended from time to time, including ` +
          i`but not limited to the European Union, European Union Member States and ` +
          i`United Kingdom (“**Applicable Laws**”), including with respect to ` +
          i`e-commerce, privacy, intellectual property, use of the Services, ` +
          i`marketing, sale and provision of any products or services by you, ` +
          i`representations, warranties and quality assurance of any products or ` +
          i`services provided by you, online conduct, and acceptable content. Except ` +
          i`as set forth in Sections 16 and 17 herein, you are responsible for the ` +
          i`calculation and collection of all applicable taxes.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Additional Terms and Policies: **In addition, you represent, warrant, ` +
          i`and covenant that you will comply with Wish’s Additional Terms and ` +
          i`Policies stated in these Terms or otherwise provided by Wish. You are ` +
          i`required to review these Additional Terms and Policies so you understand ` +
          i`your obligations to Wish and requirements for using the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You represent, warrant, covenant, promise, and guarantee that during the ` +
          i`period of registration and this Agreement: (a) you are legally established ` +
          i`in accordance with Applicable Laws, validly existing, and in good ` +
          i`operation; (b) you have all the necessary legal qualifications, rights, ` +
          i`capabilities, and authorities to sign this Agreement, fulfill duties ` +
          i`accordingly, and grant rights, licensing, and authority required by this ` +
          i`Agreement, and have the permissions, approvals, and licenses required by ` +
          i`your business and the sale of the items in all relevant countries; (c) you ` +
          i`and your Affiliates will comply with all Applicable Laws to fulfill your ` +
          i`rights and duties under this Agreement; (d) you are in full compliance ` +
          i`with all Applicable Laws when offering or fulfilling any products or ` +
          i`services for sale through, or relating to, the Services, including, ` +
          i`without limitation, the countries where you ship from and the countries ` +
          i`where you ship to; (e) you shall maintain such records as are necessary ` +
          i`pursuant to such Applicable Laws and shall promptly on request make them ` +
          i`available for inspection by any relevant authority that is entitled to ` +
          i`inspect them; (f) you shall monitor any changes in the Applicable Laws ` +
          i`which may impact the sale of the products or services through, or relating ` +
          i`to, the Services; (g) you shall directly notify Wish by email and in ` +
          i`writing of any investigation and potential claim that are instigated by ` +
          i`any regulator in relation to any products or services offered through, or ` +
          i`relating to, the Services; (h) you shall promptly remove any and all ` +
          i`offerings of products and services from the Services whenever they ` +
          i`infringe or otherwise violate any Applicable Laws, become otherwise ` +
          i`prohibited in the relevant countries, or under the [Merchant ` +
          i`Policies](${policyHomeUrl}) (or any updated version of the ` +
          i`[Merchant Policies](${policyHomeUrl}) made available to you) ` +
          i`(unless Wish has permitted eligible merchants the ability to sell ` +
          i`restricted items in specific regions based on new or additional ` +
          i`requirements being met); and (i) you and your financial institution(s) are ` +
          i`not subject to Sanctions or otherwise designated on any list of prohibited ` +
          i`or restricted parties or owned or controlled by any such party, including, ` +
          i`but not limited to, the lists maintained by the United Nations Security ` +
          i`Council, the US Government (e.g., the US Department of Treasury’s ` +
          i`Specially Designated Nationals list and Foreign Sanctions Evaders list, ` +
          i`and the US Department of Commerce’s Entity List), the European Union or ` +
          i`its Member States, the United Kingdom, or other applicable government ` +
          i`authority.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish may prohibit or restrict the items a merchant may list and offer on ` +
          i`the Wish platform.  Wish may permit eligible merchants to sell restricted ` +
          i`items in specific regions provided that new or additional requirements ` +
          i`determined by Wish are met.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish may also offer from time-to-time certain beta merchant programs in ` +
          i`its discretion, which may include as many or as few merchants, and ` +
          i`commence or expire, as Wish determines is appropriate for the beta ` +
          i`merchant program.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Additionally, should you register an account, make purchases, or otherwise ` +
          i`use our Services in a capacity other than as a merchant, seller, or ` +
          i`distributor (e.g., as a purchasing consumer or retail customer), you agree ` +
          i`to be bound by Wish’s [Terms of Use](${wishTermsUrl}) and ` +
          i`[Privacy Policy](${wishPrivacyPolicyUrl}) and those [Terms of ` +
          i`Use](${wishTermsUrl}) and [Privacy ` +
          i`Policy](${wishPrivacyPolicyUrl}) shall govern such conduct.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Modifications to the Agreement: **Because relevant Applicable Laws as ` +
          i`well as the business environment, periodically change, Wish reserves the ` +
          i`right to amend the Terms and the Additional Terms and Policies at any ` +
          i`time, as set forth herein. In that instance, Wish will provide thirty (30) ` +
          i`days’ advance notice of any such amendment if required by Applicable Laws ` +
          i`to do so. The notice will be provided via electronic mail, the Wish ` +
          i`Merchant Dashboard, the Wish Application Program Interface (“**Wish ` +
          i`API**”), or other commercially reasonable means. Regarding any such ` +
          i`amendment, you agree that the continuation of your use of the Services ` +
          i`after receipt of the notice of such amendment shall constitute your ` +
          i`acknowledgement and acceptance of any and all such changes, and it shall ` +
          i`also constitute adequate consideration to support such change(s), which ` +
          i`shall automatically be incorporated into this Agreement as of the ` +
          i`effective date stated in the amendment.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Unless otherwise permitted by Applicable Laws, you agree that any ` +
          i`amendment will only apply to Disputes that arise after the effective date ` +
          i`of such amendment unless you have expressly agreed to such amendment.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Prior to the effective date of such proposed amendment, you may opt out of ` +
          i`any proposed amendment by sending a timely written notice of your decision ` +
          i`to opt out to the following address: General Counsel, ContextLogic Inc., ` +
          i`One Sansome Street, 33rd Fl., San Francisco, CA 94104, or by email to ` +
          i`[merchant_notices@wish.com](${merchantNoticesEmail}). Wish reserves ` +
          i`the right to cancel, within reason, your account and terminate your access ` +
          i`to the Services if you do not agree to any proposed amendment, with proper ` +
          i`notice.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Password and Account Security:** You are required to keep your password ` +
          i`secure. You are fully responsible for all activity, liability, and damage ` +
          i`resulting from your failure to maintain password confidentiality. You ` +
          i`agree to immediately notify Wish of any unauthorized use or access of your ` +
          i`password or your account or any other breach of security of your account. ` +
          i`You also agree that Wish cannot and will not be liable for any loss or ` +
          i`damage arising from your failure to keep your password secure or any ` +
          i`unauthorized access of or other breach of security of your account. You ` +
          i`agree not to provide your username and password information in combination ` +
          i`to any other party other than Wish without Wish’s express written ` +
          i`permission. You further agree not to use the same username or password for ` +
          i`your Wish account that you use for any other account on any other ` +
          i`platform.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Account Information:** You must keep your account information up to date ` +
          i`and accurate at all times, including a valid name, address, phone number, ` +
          i`and email address. To sell items on Wish you must provide and maintain ` +
          i`valid payment information, such as a valid PayPal account. As applicable ` +
          i`under Applicable Laws, you authorize us (and will provide us documentation ` +
          i`evidencing your authorization upon our request) to verify your information ` +
          i`(including any updated information), to obtain credit reports about you ` +
          i`from time to time, to obtain credit authorizations from the issuer of your ` +
          i`credit card, and, in limited circumstances, to charge your credit card or ` +
          i`debit your bank account for any sums payable by you to us (in ` +
          i`reimbursement or otherwise). You also agree to provide Wish any additional ` +
          i`information or authorizations as may be necessary for Wish to provide the ` +
          i`Services or for you to fulfill your obligations under this Agreement, ` +
          i`including all applicable Additional Terms and Policies. All payments to ` +
          i`you will be remitted to your bank account through a payment service ` +
          i`provider you designate or by other means specified by us, as applicable ` +
          i`under Applicable Laws. Depending on the payment method you choose, you may ` +
          i`be required to provide a valid United States tax identification number via ` +
          i`Form W-9 or proof of residency outside the United States via Form ` +
          i`W-8BEN/W-8BEN-E.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Account Transfer:** You may not transfer or sell your Wish Merchant ` +
          i`account, username, or associated payment provider or processor account to ` +
          i`another party. If you are registering as a business entity, you personally ` +
          i`guarantee that you have the authority to bind the entity to this ` +
          i`Agreement.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Right to Refuse Service:** Wish reserves the right to cancel unconfirmed ` +
          i`or inactive accounts or to refuse to offer the Services to you for any ` +
          i`violation or suspected violation of this Agreement or Applicable Laws, ` +
          i`with or without notice to you. We may also discontinue the Services or any ` +
          i`part of the Services and delete all data or other information associated ` +
          i`with your account (including any materials you may submit to us). We ` +
          i`assume no liability for any information removed from the Services, and we ` +
          i`reserve the right to permanently restrict access to the Services or your ` +
          i`account. You agree that you do not have any rights in the Services and ` +
          i`that we have no liability to you if the Services are discontinued or if ` +
          i`you are no longer able to access the Services or any information that was ` +
          i`previously made available to you on the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Closing Your Account:** You have the right to close your account. If you ` +
          i`choose to close your account, please contact ` +
          i`[merchant_notices@wish.com](${merchantNoticesEmail}). You will then ` +
          i`receive a confirmation once your account has been closed. If Wish is ` +
          i`unable to close your account at this time, you also will receive an email ` +
          i`detailing why your account cannot be closed and any additional steps or ` +
          i`information that may be required from you before closing your account. The ` +
          i`closure of your account does not preclude Wish from pursuing legal action ` +
          i`against you for any violation or suspected violation of this Agreement ` +
          i`(including any Additional Terms or Policies) or any Applicable Laws, or ` +
          i`initiating collection of fees or other payments due to Wish.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>3. Fees and Payment</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`**Fees: **Wish will collect or receive fees, payments, or other amounts ` +
          i`from you, for your use of or access to the Services, as set forth in its ` +
          i`Policy on [Fees and Payments](${policyFeesUrl}) or as otherwise ` +
          i`communicated to you by Wish. Except as set forth in Sections 16 and 17 ` +
          i`herein, you are responsible for paying all fees and applicable taxes ` +
          i`associated with using and selling on Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`As a merchant, you also may incur fees through the use of various payment ` +
          i`providers or processors. Any such payment provider or processor fees will ` +
          i`be determined by any agreement you may have with a payment provider or ` +
          i`processor, and Wish is not responsible for reviewing, advising on, or ` +
          i`paying any such fees.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Payment: **Wish will make payments to you, in connection with your use ` +
          i`of the Services, as set forth in this Agreement and its [Fees and Payments ` +
          i`Policy](${policyFeesUrl}) or as otherwise communicated to you ` +
          i`by Wish. You understand and agree that Wish’s obligation to pay you is ` +
          i`expressly subject to the terms of and your compliance with this Agreement ` +
          i`and is conditioned upon Wish’s successful receipt of funds from Wish users ` +
          i`who purchase items through the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Payment by Wish to you is considered made and complete upon transmission ` +
          i`by Wish of the payment amount owed to you pursuant to this Agreement and ` +
          i`[Fees and Payments Policy](${policyFeesUrl}) or as otherwise ` +
          i`communicated to you by Wish, to the payment provider or processor you have ` +
          i`selected (e.g., UMPAY, PayEco, AllPay, Payoneer, PayPal China, Bill.com, ` +
          i`PingPong, or others as may be added or removed from time to time) ` +
          i`irrespective of your receipt of payment from the payment provider or ` +
          i`processor. Each payment provider or processor may have its own terms of ` +
          i`use or other legal requirements, and Wish does not guarantee and is not ` +
          i`responsible for any services provided by such payment provider or ` +
          i`processor (including, without limitation, any remittance of payment, ` +
          i`security protocols or obligations to the merchant, accurate and timely ` +
          i`disbursal of payments to the merchant, non-availability of services, etc., ` +
          i`of such payment provider or processor). Risk of loss and nonpayment from ` +
          i`the payment provider or processor remains with you as the merchant.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In addition to the above, Wish may elect to delay the remittance and ` +
          i`withhold the amounts payable to merchants, or any other payment due under ` +
          i`this Agreement or its [Fees and Payments ` +
          i`Policy](${policyFeesUrl}) or as otherwise communicated to you ` +
          i`by Wish, until such time as Wish receives valid confirmation of product ` +
          i`delivery. Transactions for which Wish cannot confirm valid delivery may be ` +
          i`ineligible for payment and may subject your account balance to temporary ` +
          i`or permanent holds or account suspension.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In the event that Wish elects to remit an amount to you before the ` +
          i`eligible payment date for such amount through a discretionary advance or ` +
          i`advance made through your payment processor or provider (hereinafter, a ` +
          i`“**Discretionary Advance**”), Wish may reduce your payment by the amount ` +
          i`of the Discretionary Advance either immediately or as soon thereafter as ` +
          i`Wish deems practicable.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Moreover, if Wish determines that your actions or performance may result ` +
          i`in returns, chargebacks, claims, disputes, violations or suspected ` +
          i`violations of this Agreement, or other risks to Wish or third parties, or ` +
          i`reflect pending or otherwise unrecoupable balances, then Wish may withhold ` +
          i`and/or set off or offset any payments to you for as long as Wish ` +
          i`determines such conditions or any related risks to Wish or third parties ` +
          i`persist. For any amounts that we determine you owe us, we may (a) charge ` +
          i`your account or any payment instrument you provide to us; (b) set off or ` +
          i`offset any amounts that are payable by you to us (in reimbursement, ` +
          i`converting balances in your account to Wish, or otherwise) against any ` +
          i`payments we may make to you or amounts we may owe you; (c) invoice you for ` +
          i`amounts due to us, in which case you will pay the invoiced amounts upon ` +
          i`receipt; (d) reverse any credits to you; or (e) collect payment or ` +
          i`reimbursement from you by any other lawful means, as applicable under ` +
          i`Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`If we determine that your account has been used to engage in deceptive, ` +
          i`fraudulent, or other illegal activity, or to violate this Agreement, then ` +
          i`we may permanently withhold and/or set off or offset and retain any ` +
          i`payments that otherwise may have been payable to you. In addition, we may ` +
          i`require that you pay other amounts to secure the performance of your ` +
          i`obligations under this Agreement or to mitigate the risk of returns, ` +
          i`chargebacks, claims, disputes, violations or suspected violations of this ` +
          i`Agreement, or other risks to Wish or third parties. These amounts may be ` +
          i`refundable or nonrefundable in the manner we determine, which may include ` +
          i`converting balances in your account to Wish, and failure to comply with ` +
          i`this Agreement, including any applicable Policies, may result in their ` +
          i`forfeiture.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>4. Appointment of Wish as Limited Payment Collection Agent</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You hereby appoint Wish as your payment collection agent, solely for the ` +
          i`limited purpose of accepting funds from Wish users who purchase items ` +
          i`through the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that any funds resulting from a Wish user’s purchase of any ` +
          i`product or service through the Services and received by Wish from a Wish ` +
          i`user shall be considered the same as a payment made directly to you by a ` +
          i`Wish user. You further agree that you will provide the purchased products ` +
          i`or services to the Wish user in the agreed-upon manner as if you have ` +
          i`received the payment directly from the Wish user. You agree that Wish may ` +
          i`refund the Wish user in accordance with Wish’s [Return ` +
          i`Policy](${returnPolicyUrl}). As stated above, you understand and ` +
          i`agree that Wish’s obligation to pay you is subject to and conditioned upon ` +
          i`successful receipt of the associated funds from Wish users who purchase ` +
          i`items through the Services. Wish guarantees payments to you only for such ` +
          i`amounts that have been successfully received by Wish from Wish users in ` +
          i`accordance with this Agreement and Wish’s [Terms of ` +
          i`Use](${wishTermsUrl}) and that are not subject to refunds ` +
          i`made to Wish users. In accepting appointment as your limited payment ` +
          i`collection agent, Wish assumes no liability for any of your acts or ` +
          i`omissions (including, without limitation, any violation by you of this ` +
          i`Agreement or any Applicable Laws).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that any obligation of a Wish user to pay you for the purchase ` +
          i`of any products or services through the Services is extinguished upon the ` +
          i`Wish user’s payment of the funds to Wish, upon which Wish then is ` +
          i`responsible for remitting the funds to you in the manner described in this ` +
          i`Agreement, the [Fees and Payments](${policyFeesUrl}) Policy, or ` +
          i`as otherwise communicated by Wish to you. Your funds are not eligible for ` +
          i`payment to you unless and until all terms in this Agreement, the [Fees and ` +
          i`Payments](${policyFeesUrl}) Policy, and Wish’s [Terms of ` +
          i`Use](${wishTermsUrl}) are satisfied. In the event that Wish ` +
          i`does not remit any such payment or funds to you, you will have recourse ` +
          i`only against Wish and not the Wish user directly.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that Wish may honor any governmental or judicial order ` +
          i`attaching, garnishing, or levying upon funds otherwise payable to you ` +
          i`hereunder and that any payment to a governmental authority or a third ` +
          i`party pursuant to a court order by Wish as required by such order shall ` +
          i`relieve Wish of any obligation to pay such funds to you.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You further agree that Wish shall have no obligation to invest such funds ` +
          i`for your account and that you shall not be entitled to any interest earned ` +
          i`on such funds while such funds are in the possession of Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish shall have the right to offset its obligation to pay you such funds ` +
          i`to satisfy any obligation then owing by you to Wish. Wish shall otherwise ` +
          i`have no interest in the funds that it holds for you as paying agent, and ` +
          i`any liability for taxation or otherwise related to such funds shall be ` +
          i`entirely yours.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish will disburse funds owed hereunder to you upon your written ` +
          i`instruction and shall have the right to rely on such written instruction. ` +
          i`Under no circumstance shall Wish be obligated to advance to you funds it ` +
          i`does not hold as your paying agent.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish reserves the right to resign as your paying agent and cancel your ` +
          i`account at any time.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>5. Listing and Selling</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`**Listing Description:** By listing any product or service on the ` +
          i`Services, you warrant that you and all aspects of such product or service ` +
          i`comply with this Agreement (including all Additional Terms and Policies) ` +
          i`and other published policies, and relevant Applicable Laws. You also ` +
          i`warrant that you may legally sell or provide such product or service in ` +
          i`all locations that you list your product or service for sale. You are ` +
          i`solely responsible for accurately describing your products and services ` +
          i`and all terms of sale in your Wish shop. Your listings may only include ` +
          i`content relevant to the sale of that product or service. All products and ` +
          i`services must be listed in an appropriate category with appropriate tags. ` +
          i`Each listing must truthfully, accurately, and completely describe the ` +
          i`product(s) or service(s) for sale in that listing. If the “in stock” ` +
          i`quantity is more than one, all products in that listing must be identical. ` +
          i`Wish does not have any responsibility for, or obligations related to, the ` +
          i`descriptions of your products or services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Shop Policies:** Wish may permit you, in certain circumstances, to ` +
          i`outline shop policies for your Wish shop. These policies may include, for ` +
          i`example, shipping, returns, payment, and selling policies. You must create ` +
          i`reasonable policies in good faith and must abide at all times in ` +
          i`compliance with such policies. You are prohibited from creating any ` +
          i`policies that are deceptive or inaccurate. All shop policies must comply ` +
          i`with Wish’s respective Additional Terms and Policies and all Applicable ` +
          i`Laws. You are solely responsible for reviewing Wish’s Policies to ensure ` +
          i`that your shop policies remain in compliance with Wish’s Policies and for ` +
          i`ensuring that your shop policies remain in compliance with all Applicable ` +
          i`Laws. You are responsible for enforcing your own shop policies. In the ` +
          i`event of conflict between your shop policies and the Terms or any other ` +
          i`Wish Additional Terms or Policies, the Terms or the appropriate Wish ` +
          i`Additional Terms or Policies shall control as it relates to your use of ` +
          i`the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Binding Sale:** All sales are binding. You agree to all applicable ` +
          i`provisions related to sales as outlined in the Additional Terms and ` +
          i`Policies. You are obligated to ship the applicable order in a prompt ` +
          i`manner after a sale is made over the Services or you otherwise complete ` +
          i`the transaction with the applicable buyer. The cost arising from not ` +
          i`completing orders in time shall be undertaken by you.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Third Party Service Providers**: To the extent you use any third party ` +
          i`to assist or facilitate any portion of your use of the Services, ` +
          i`including, without limitation, your listings, sales, fulfillment, system ` +
          i`notifications or changes, customer support, or other functions, you agree ` +
          i`that you shall be responsible for, and Wish shall not be liable for, any ` +
          i`acts, conduct, errors, omissions, losses, claims, or other issues ` +
          i`resulting from your use of such third party’s services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Fee Avoidance:** The price stated in each product or service listing ` +
          i`description must be an accurate representation of the sale. You may charge ` +
          i`reasonable shipping and handling fees to cover the costs for packaging and ` +
          i`mailing products. You may not charge excessive shipping fees or otherwise ` +
          i`avoid fees. You may not do anything intended to avoid or having the effect ` +
          i`of avoiding any fees due to Wish, or otherwise intended to violate this ` +
          i`Agreement, including, without limitation, altering a product’s or ` +
          i`service’s price after a sale, misrepresenting the location of a product or ` +
          i`service, using another merchant’s account without permission, or arranging ` +
          i`a sale outside of the Wish platform to avoid paying fees to Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Nonconformity, Defects, or Other Issues with Items:** You understand and ` +
          i`agree that Wish is not the seller of any product or service you list for ` +
          i`sale, and that Wish has no control over and does not give any commitment ` +
          i`relating to the existence, quality, safety, genuineness, legality, or any ` +
          i`other aspect of such product or service, the truth or accuracy of any ` +
          i`information or materials you provide to Wish or make available to Wish ` +
          i`customers related to such product or service, the ability of a Wish ` +
          i`customer to pay for the product or service, or whether the Wish customer ` +
          i`may return or seek a refund or cancellation for such product or service, ` +
          i`and you further understand and agree that Wish will have no liability ` +
          i`related to your product or service.  You are also responsible for any ` +
          i`nonconformity or defect in, or any recall (public or private, voluntary or ` +
          i`mandatory) of, as well as any other safety concerns related to, the ` +
          i`products or services you list for sale. You will notify Wish as soon as ` +
          i`you become aware of, or reasonably suspect, any nonconformity or defect in ` +
          i`or safety concerns or recall related to your products. If we determine ` +
          i`that the performance of your obligations under this Agreement may result ` +
          i`in returns, claims, disputes, or violations of this Agreement, or cause ` +
          i`any other risks to us or third parties, then we may mitigate them, ` +
          i`including by determining whether a customer will receive a refund, ` +
          i`adjustment, or replacement for any of your products or services for as ` +
          i`long as we determine any related risks to us or third parties persist. If ` +
          i`you offer a product for sale through our Services that requires a warning ` +
          i`under California Health & Safety Code Section 25249.6 (a “**Proposition 65 ` +
          i`Warning**”), you (a) will provide in your listing such warning in the ` +
          i`manner compliant with Applicable Laws, (b) agree that our display of a ` +
          i`Proposition 65 Warning on a product detail page is confirmation of our ` +
          i`receipt of that warning, and (c) will only revise or remove a Proposition ` +
          i`65 Warning for a product when the prior warning is no longer legally ` +
          i`required.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**No Transfer of Title: **In no event shall title to any products transfer ` +
          i`to Wish, even if Wish takes possession of a product in connection with any ` +
          i`sale, product return, or disposition of abandoned products, including any ` +
          i`products that are not retrieved by a customer for more than fifteen (15) ` +
          i`days as set forth below.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Customer Support:**  Wish may provide you with a mode by which you may ` +
          i`receive and respond to inquiries from Wish users, including questions ` +
          i`about product issues, shipping, delivery, returns, and refunds. In such ` +
          i`event, you understand and agree that Wish may establish certain ` +
          i`service-level agreements (“**SLAs**”) related to your responses (e.g., ` +
          i`timing to respond, types of permitted communications with customers, etc.) ` +
          i`to which you will be required to adhere.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You further agree that Wish, in its sole discretion (and including in the ` +
          i`event you do not respond in accordance with an SLA), also may, but is not ` +
          i`obligated to, provide support to customers as a service to you, including ` +
          i`with respect to complaint intake and answering questions about logistics ` +
          i`(including shipping, delivery, returns, and refunds), without taking title ` +
          i`to any products, and provision of such support shall not, and shall not be ` +
          i`deemed to, transfer title to Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Disposition of Returned and Abandoned Products:** Any products that are ` +
          i`returned to or not retrieved from any local store, warehouse, or other ` +
          i`facility of Wish or any of its other merchants, agents, or third party ` +
          i`providers, including any customer product orders made as part of the Wish ` +
          i`Local program as set forth in the [Wish Local Participant Terms and ` +
          i`Conditions](${wishLocalTermsUrl}) (including, but not limited to, ` +
          i`Wish Pickup, home delivery, or curbside pickup) that are not retrieved for ` +
          i`more than thirty (30) days after the product is delivered to the ` +
          i`designated Wish Local location, shall be deemed abandoned. Upon such ` +
          i`abandonment, Wish, directly or through its designee, shall have the right ` +
          i`to take possession of and relist, sell, donate, recycle, destroy, or ` +
          i`otherwise dispose of any such abandoned products. Except as specifically ` +
          i`set forth below with respect to any such abandoned products that are ` +
          i`relisted or sold by Wish, title to each such disposed product will ` +
          i`transfer to Wish or a third party it selects (such as a charity), at no ` +
          i`cost to Wish or such third party, free and clear of any liens, claims, ` +
          i`security interests, or other encumbrances to the extent required to ` +
          i`dispose of the product, and Wish shall have the right to retain any ` +
          i`proceeds Wish may receive from such disposal and to withhold and/or set ` +
          i`off or offset any payments to you for all costs incurred by Wish in ` +
          i`connection with such disposal.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Should Wish relist or sell any such abandoned product, Merchant ` +
          i`understands and agrees that, for any relisted or sold product: (a) Wish ` +
          i`shall not, and in no way be deemed to, take legal title to such product, ` +
          i`(b) should Wish then complete a subsequent sale of such product, Merchant ` +
          i`will not receive any payment beyond any payment that Merchant had been ` +
          i`eligible to receive and already received for such product, and (c) Wish ` +
          i`may use the same product listing, Merchant identification, and any other ` +
          i`information previously used by Merchant in connection with any relisting ` +
          i`or other disposition of any product for such product.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`AS APPLICABLE UNDER APPLICABLE LAWS, WISH DISCLAIMS ANY DUTIES OF A BAILEE ` +
          i`OR WAREHOUSEMAN, AND YOU WAIVE ALL RIGHTS AND REMEDIES OF A BAILOR ARISING ` +
          i`UNDER ANY APPLICABLE LAWS (WHETHER ARISING UNDER COMMON LAW, CIVIL LAW, ` +
          i`STATUE, OR OTHERWISE) RELATING TO ANY POSSESSION, STORAGE, SHIPMENT, OR ` +
          i`DISPOSAL OF YOUR PRODUCTS BY WISH, OUR AFFILIATES, OR ANY OF OUR OR THEIR ` +
          i`DESIGNEES, CONTRACTORS, OR AGENTS.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Disposition of Products in Compliance with Legal Requirement:** Wish, ` +
          i`directly or through its designee, shall have the right to take possession ` +
          i`and dispose of products to comply with any Applicable Laws or any order or ` +
          i`other requirement of any court, arbitrator, or other governmental ` +
          i`authority and to withhold and/or set off or offset any payments to you for ` +
          i`all costs incurred by Wish in connection with such disposal. Such action ` +
          i`shall not, and shall not be deemed to, transfer title to Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Third Party Platforms: **Wish has or may enter into relationships with ` +
          i`third parties that support the marketing, sale, and fulfillment of any ` +
          i`Merchant’s products and services through such third parties’ platforms and ` +
          i`applications or channels of trade (“**Third Party Platforms**”), either as ` +
          i`part of, or as a separate offering from, the Services. You acknowledge and ` +
          i`agree that Wish may, and you hereby expressly authorize Wish to, market, ` +
          i`promote, publish, display, offer for sale, sell, or fulfill your products ` +
          i`and services through any Third Party Platform, whether as part of the ` +
          i`Services or separate from the Services, whether concurrently with or in ` +
          i`lieu of the Services, or whether you are required to create an account ` +
          i`with any Third Party Platform.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Other:** Wish generally strives for equal treatment of the Wish ` +
          i`merchants. However, Wish might differentiate merchants for reasons ` +
          i`including the following: (i) products offered by Wish merchants that ` +
          i`participate in the paid ` +
          i`[ProductBoost](${productBoostUrl}) service might be favored due ` +
          i`to economic and commercial reasons; (ii) products offered by merchants ` +
          i`with high ratings may be favored over those offered by merchants with ` +
          i`lower ratings; (iii) products offered by merchants with low refund rates ` +
          i`may be favored over those offered by merchants with higher refund rates; ` +
          i`(iv) products offered by merchants in regions in close proximity to a Wish ` +
          i`customer may be favored over products offered outside those regions; (v) ` +
          i`products offered by Wish or its Affiliated companies might be favored for ` +
          i`economic and commercial reasons; (vi) products whose merchants offer ` +
          i`faster shipping options may be favored over products whose merchants offer ` +
          i`slower shipping options; (vii) products whose merchants offer lower prices ` +
          i`may be favored over merchants offering the same product for more; (viii) ` +
          i`the length of relationship between Wish and its merchants; or (ix) the ` +
          i`nature of the product sold or the volume of sales by the Wish merchant. ` +
          i`Favored treatment may include scenarios such as higher position in ` +
          i`rankings; increased direct or indirect remuneration to the merchant for ` +
          i`use of the Services; or other merchandising support. Wish encourages its ` +
          i`merchants to provide Wish customers with the fastest shipping options and ` +
          i`lowest prices possible.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish product listings, including those resulting from user searches, are ` +
          i`ranked according to various factors. These factors are determined solely ` +
          i`by Wish, are designed to help ensure that Wish customers see the items ` +
          i`that they might find most relevant, and, in addition to the foregoing ` +
          i`bases for differentiating between merchants, may also consider a Wish ` +
          i`customer’s prior engagement with Wish, a Wish customer’s prior orders and ` +
          i`search history, the terms used in a Wish customer’s search query, Wish’s ` +
          i`attempts to expand and understand the appeal or interest in new product ` +
          i`categories or offerings, a Wish customer’s location, the Wish merchant’s ` +
          i`rating, the historical revenue per impression of the product or service ` +
          i`listing, the Wish merchant’s refund rate, whether a Wish merchant ` +
          i`participates in the paid ` +
          i`[ProductBoost](${productBoostUrl}) service (which participation ` +
          i`might increase the ranking of a merchant’s listing), and the overall ` +
          i`standing of the Wish merchant on the Wish platform.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You acknowledge and agree that, as part of the Services provided to you, ` +
          i`Wish may use its algorithms, know-how, and other systems to set the final ` +
          i`price of each item shown to a Wish customer. This final price may be ` +
          i`lower, higher, or the same as the listing price you provide, and you ` +
          i`acknowledge and agree that Wish may retain any amounts collected from Wish ` +
          i`customers that exceed your or any other merchant’s listing price.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>
          6. Prohibited, Questionable, and Infringing Items and Activities
        </h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You are solely responsible for your conduct and activities on or relating ` +
          i`to the Services and any and all data, text, descriptions, pricing, ` +
          i`information, usernames, graphics, images, photographs, profiles, audio, ` +
          i`video, products, items, listings, links, names, trademarks, service marks, ` +
          i`copyrights, and other content that you submit, post, or display on the ` +
          i`Services (collectively, “**Content**”).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Your Content, use of (or activity on) the Services, and products sold over ` +
          i`the Services shall not:`
        }
      />

      <ol>
        <li>
          <Markdown
            openLinksInNewTab
            text={i`Be false, inaccurate, or misleading;`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`Be obscene or contain unwarranted pornography, nudity, or adult material;`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Contain or transmit any code of a destructive nature that may damage, ` +
              i`detrimentally interfere with, surreptitiously intercept, or expropriate ` +
              i`any system, data, or personal information;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Contain images that are not related to the product or service you are ` +
              i`offering;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Infringe upon, misappropriate, dilute, or otherwise violate any third ` +
              i`party’s copyright, patent, trademark, trade secret, or other intellectual ` +
              i`property or proprietary rights or rights of publicity; such prohibited ` +
              i`behavior includes (without limitation): (a) selling or displaying items ` +
              i`portraying the likeness of a celebrity (including portraits, pictures, ` +
              i`names, signatures, and autographs); (b) selling or displaying items ` +
              i`bearing a third party brand or trademark that you are not authorized to ` +
              i`display in such manner; or (c) selling any pirated video or recording;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`List any item on Wish (or consummate any transaction) or link directly or ` +
              i`indirectly to, reference, or contain descriptions of goods or services ` +
              i`that (a) are prohibited under these Terms, any Additional Terms or ` +
              i`Policies (including the [Merchant Policies](${policyHomeUrl})), ` +
              i`Wish’s [Terms of Use](${wishTermsUrl}), or any document ` +
              i`incorporated herein or therein, or are prohibited in any other Wish Policy ` +
              i`documents (unless and to the extent Wish determines you are an eligible ` +
              i`merchant permitted to sell restricted items in specific regions based on ` +
              i`new or additional requirements being met); (b) are prohibited in any of ` +
              i`the countries in which the items are offered for sale; or (c) could cause ` +
              i`Wish to violate any Applicable laws, or that violate these Terms, any ` +
              i`Additional Terms or Policies (including the [Merchant ` +
              i`Policies](${policyHomeUrl})), Wish’s [Terms of ` +
              i`Use](${wishTermsUrl}), or any document incorporated herein or ` +
              i`therein;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Violate these Terms, any Additional Terms or Policies (including the ` +
              i`[Merchant Policies](${policyHomeUrl})), Wish’s [Terms of ` +
              i`Use](${wishTermsUrl}), any document incorporated herein or ` +
              i`therein, the policies of app stores where Wish’s apps are available ` +
              i`(including Google Play and the Apple App Store), or any Applicable Laws ` +
              i`(including, but not limited to, those governing export control, consumer ` +
              i`protection, unfair competition, anti-discrimination, or false ` +
              i`advertising);`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Involve the sale of items that have been identified by any regulator that ` +
              i`has jurisdiction in the countries in which the items are offered as ` +
              i`hazardous to consumers and therefore subject to a recall, including, but ` +
              i`not limited to, the European Commission’s Directorate General for Justice ` +
              i`and Consumers for European Union and the UK’s Chartered Trading Standards ` +
              i`Institute;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Be defamatory, libelous, unlawfully threatening, unlawfully harassing, ` +
              i`impersonate or intimidate any person (including Wish staff or other ` +
              i`merchants), or falsely state or otherwise misrepresent your affiliation ` +
              i`with any person or entity, through, for example, the use of similar email ` +
              i`address, nicknames, or creation of a false account(s), or any other method ` +
              i`or device;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Decompile, reverse engineer, disassemble, or otherwise attempt to obtain ` +
              i`the source code or underlying ideas or information of or relating to the ` +
              i`Services;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`“Crawl,” “scrape,” or “spider” any page, data, or portion of or relating ` +
              i`to the Services through any means;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Violate the security of any computer network or crack any passwords or ` +
              i`security encryption codes;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Modify, adapt, or hack the Services or modify another website so as to ` +
              i`falsely imply that it is associated with Wish;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Post fraudulent, inaccurate, or misleading reviews of merchants or items ` +
              i`(and instead shall always disclose all information a reasonable shopper ` +
              i`would want to know about your review, including whether you were provided ` +
              i`any compensation or other benefit to write your review);`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Attempt to manipulate the manner in which Wish categorizes, ranks or ` +
              i`displays stores or listings with dishonest or unfair activities, ` +
              i`including, without limitation, by accepting fraudulent orders, encouraging ` +
              i`or engaging in provision of inauthentic or fake reviews, or by making ` +
              i`material changes to a listing after it was published (e.g., to the item or ` +
              i`its price);`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Solicit business for, direct sales to, or promote any website, service, or ` +
              i`entity outside of the Services;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Violate the privacy rights of, or contain personal information about, any ` +
              i`individual; or`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Violate any Applicable Laws relating to export, import, or trade control ` +
              i`or the export, re-export, transfer, import, sale, or use of products or ` +
              i`services sold under this Agreement (collectively, “**Trade Control ` +
              i`Laws**”). Without limiting the foregoing, you shall not sell, transfer, ` +
              i`export or re-export to, or otherwise provide products or services under ` +
              i`this Agreement, directly or indirectly, (a) to any country (or national or ` +
              i`government thereof), state, territory, or region that is subject to ` +
              i`sanctions measures issued or adopted from time to time by the U.S. ` +
              i`Department of the Treasury’s Office of Foreign Assets Control (“**OFAC**”) ` +
              i`(currently Cuba, Iran, North Korea, Syria, and the Crimea region of ` +
              i`Ukraine) or any other applicable sanctions, including the sanctions laws ` +
              i`of any other country having jurisdiction, including the European Union and ` +
              i`the United Kingdom (collectively, “**Sanctions**”); (b) to any person to ` +
              i`whom delivery or provision of products or services is prohibited under ` +
              i`Trade Control Laws or Sanctions, including, without limitation, to (i) any ` +
              i`person or entity identified on the Denied Persons List as maintained by ` +
              i`the U.S. Department of Commerce Bureau of Industry and Security or (ii) ` +
              i`any person or entity identified on the list of Specially Designated ` +
              i`Nationals and Blocked Persons as maintained by OFAC, or any other ` +
              i`regulator that has jurisdiction in the countries in which the items are ` +
              i`offered, including China, the European Union and the United Kingdom, or ` +
              i`(c) for any end use prohibited under Trade Control Laws or Sanctions, ` +
              i`including, without limitation, for any missile, chemical weapons, or ` +
              i`nuclear end uses.`
            }
          />
        </li>
      </ol>

      <p>&nbsp;</p>

      <div>
        <h2>7. Content</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`**License:** You hereby grant Wish a royalty-free, non-exclusive, ` +
          i`worldwide, perpetual, sublicensable (through multiple tiers), irrevocable ` +
          i`right and license to use, disclose, reproduce, perform, display, transfer, ` +
          i`and otherwise distribute, synchronize, broadcast, adapt, modify, excerpt, ` +
          i`analyze, re-format, create derivative works of, and otherwise commercially ` +
          i`or non-commercially exploit in any manner your Content in any medium or in ` +
          i`any format and for any purpose, including, without limitation, for the ` +
          i`advertising, marketing, or promotion of Wish, any Services, or any future ` +
          i`product or service, including on or through any Third Party Platform or ` +
          i`any other third party service or social media platform, and to copy, ` +
          i`publish, display, promote, market, offer for sale, and sell your products ` +
          i`and services through any Third Party Platform. For the sake of clarity, ` +
          i`nothing in this Agreement will prevent or impair our right to use your ` +
          i`Content without your consent to the extent that such use is allowable ` +
          i`without a license from you or your Affiliates under Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Waiver:** Without limiting the foregoing license, and as applicable ` +
          i`under relevant Applicable Laws, you hereby irrevocably waive any and all ` +
          i`rights of privacy or publicity, or other rights of a similar nature, in ` +
          i`connection with the commercial exploitation of all and any portion of your ` +
          i`Content, consistent with this Agreement. To the extent included in your ` +
          i`Content, you hereby consent to the use of your name and any other names, ` +
          i`trade names, fictitious names, trademarks and service marks, likenesses, ` +
          i`performances, voices, and identities (or that of any minor who you are ` +
          i`responsible for) for any and all purposes in connection with Wish’s ` +
          i`exercise of the license rights granted herein. You waive any right to ` +
          i`inspect or approve any such use Content. You expressly release and hold ` +
          i`harmless Wish, its Affiliates, and its and their officers, agents, ` +
          i`employees, customers, users, licensors, suppliers, and partners from any ` +
          i`and all claims, demands, and liabilities by reason of their exercise of ` +
          i`such license rights. Wish may alter, modify, or combine all or any portion ` +
          i`of the Content with other works, and you hereby waive any claim that any ` +
          i`version of the Content portrayed consistent with this Agreement ` +
          i`constitutes a distortion, mutilation, or disparagement or contains ` +
          i`unauthorized variations of the Content. You shall not have the right to ` +
          i`approve or enjoin the use of the Content in accordance with this ` +
          i`Agreement. Wish will have no obligation to use the Content and no ` +
          i`obligation to pay you for any use of the Content in accordance with this ` +
          i`Agreement. You understand that any use of the Content will be in reliance ` +
          i`on the above consent and release.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Warranty:** You represent, warrant, and covenant that you are the sole ` +
          i`and exclusive owner of all Content; that you have the right and authority ` +
          i`to grant to us the foregoing Content license, consent, and waiver and all ` +
          i`other rights and licenses that you grant to us under this Agreement; and ` +
          i`that our exercise of such rights and licenses do not and will not infringe ` +
          i`or otherwise violate any copyright, trademark, right of publicity, or ` +
          i`other intellectual property or proprietary right owned by you or any third ` +
          i`party.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Reposting Content:** You acknowledge and agree that by posting Content ` +
          i`on Wish, it is possible for Wish or an outside website or a third party to ` +
          i`repost that Content, whether through the Services, any Third Party ` +
          i`Platform, or any other website or media.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Business Data, Personal Data:** Wish collects and generates a variety of ` +
          i`data in order to provide, market, and improve the Services, and to market ` +
          i`your Wish Local store(s).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Business Data: Wish collects, generates, and stores a variety of data that ` +
          i`is not personal data (“**Business Data**”). Business Data can include ` +
          i`information about: merchants and their stores; merchant accounts; merchant ` +
          i`activity, including fulfillment data (e.g., tracking data on packages), ` +
          i`compliance with Wish Policies or participation in Wish programs such as ` +
          i`[ProductBoost](${productBoostUrl}) or those related to ` +
          i`fulfillment, and Content; user interest in products or Services described ` +
          i`by listings, including purchases, as well as user satisfaction with ` +
          i`products or services and the purchase experience (e.g., customer reviews ` +
          i`and refunds); and Merchant services providers such as enterprise resource ` +
          i`planning providers (“**ERPs**”) or payment services providers ` +
          i`(“**PSPs**”).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish can access most Business Data and may permit its service providers to ` +
          i`access certain Business Data to help provide the Services. Wish may share ` +
          i`Business Data (including allowing access through technical means such as ` +
          i`application programming interfaces (“**APIs**”) as instructed by a ` +
          i`merchant, such as with merchant PSPs or ERPs. Merchants can access ` +
          i`detailed information regarding their accounts, stores, and activity by ` +
          i`logging into their Wish accounts or their accounts with applicable service ` +
          i`providers such as a carrier or PSP. Merchants can access data regarding ` +
          i`the stores or listings of other Merchants by registering a user account ` +
          i`and navigating to stores and listings of interest.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Personal Data: Wish’s [Privacy ` +
          i`Policy](${wishPrivacyPolicyUrl}) describes in detail the personal ` +
          i`data Wish collects about you, the uses of such data, the manner in which ` +
          i`it may be shared, and the choices you may have about those personal data ` +
          i`processing activities.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Protection of User Data:** When you use the Services, such as when you ` +
          i`fulfill a purchase, you may obtain personal data from or about a Wish user ` +
          i`(“**User Data**”). Your use, disclosure, and protection of User Data shall ` +
          i`comply with the Applicable Laws related to the privacy, security, use, ` +
          i`transfer, collection, or other processing of personal information, ` +
          i`including, without limitation, Europe’s General Data Protection Regulation ` +
          i`((EU) 2016/679) (“**GDPR**”); the UK’s Data Protection Act 2018 ` +
          i`(“**DPA**”) and the GDPR as it forms part of the laws of the United ` +
          i`Kingdom by virtue of section 3 of the European Union (Withdrawal) Act 2018 ` +
          i`(“**UK GDPR**”); the California Consumer Privacy Act (“**CCPA**”); ` +
          i`Brazil’s Lei Geral de Proteção de Dados (“**LGPD**”), and Cybersecurity ` +
          i`Law of the People’s Republic of China (collectively, “**Privacy and ` +
          i`Security Laws**”). You are solely responsible for understanding and ` +
          i`complying with your obligations under Privacy and Security Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`When processing personal data falling under the scope of the GDPR, the UK ` +
          i`GDPR, and the DPA, we act as a data controller of any customer personal ` +
          i`data collected via the Services. We comply with all the obligations ` +
          i`related to any data controller pursuant to the GDPR, the UK GDPR, and the ` +
          i`DPA. You are controllers of the customer personal data that are strictly ` +
          i`necessary to fulfill orders and may not use any such customer personal ` +
          i`data (including contact information) for any purpose other than fulfilling ` +
          i`orders or providing customer service in connection with the Services. ` +
          i`Generally, you may not use such data in any way inconsistent with ` +
          i`Applicable Laws. You must keep customer personal data confidential at all ` +
          i`times and comply with the obligations related to any data controller ` +
          i`pursuant to the GDPR, the UK GDPR, and the DPA and any United Kingdom or ` +
          i`European Union Member States laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Regardless of the origin of the User Data, unless you have a valid legal ` +
          i`basis, such as consent from the individuals described by User Data as ` +
          i`required by applicable Privacy and Security Laws, you shall solely use and ` +
          i`disclose User Data in connection with the corresponding transaction with ` +
          i`such user (e.g., shipping and fulfillment) or as necessary to meet your ` +
          i`statutory legal requirements, such as tax and reporting requirements. You ` +
          i`shall employ reasonable and appropriate measures to safeguard User Data ` +
          i`from misuse, loss, destruction, or unauthorized access or use, and you are ` +
          i`solely responsible for any failure to appropriately safeguard this ` +
          i`information or any failures of the protections you have in place. You ` +
          i`acknowledge and agree that if Wish determines that additional agreements ` +
          i`are necessary for compliance with applicable Privacy and Security Laws, ` +
          i`you will promptly review and accept such agreements or cease using the ` +
          i`Services or applicable portions thereof, such as sales into the European ` +
          i`Union or the United Kingdom.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Without limiting the foregoing, you shall not upload, access, or use ` +
          i`tracking technologies (such as browser cookies, web beacons, or flash ` +
          i`cookies) as part of any item listing.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish does not assume any responsibilities for disputes between you and ` +
          i`your customers for using User Data without authorization or in violation ` +
          i`of these Terms, Additional Terms, Policies, or applicable Privacy and ` +
          i`Security Laws. You are solely responsible for responding to any requests ` +
          i`received by users to access or delete their personal information, or in ` +
          i`response to any other similar right granted under applicable Privacy and ` +
          i`Security Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`**Your Personal Data and Business Data – Legal Requirements Protection of ` +
          i`Wish and Others:** You acknowledge and agree that your own personal data ` +
          i`will be collected and used as described in applicable provisions of Wish’s ` +
          i`[Privacy Policy](${wishPrivacyPolicyUrl}) and as permitted by Privacy ` +
          i`and Security Laws. In particular, Wish reserves the right to access, read, ` +
          i`preserve, and disclose any Business Data (including Content), personal ` +
          i`data, or other information that Wish believes is necessary to comply with ` +
          i`any Applicable Laws or court order; respond to legal, regulatory, or ` +
          i`commercial claims; enforce or apply Wish’s policies, guidelines, or other ` +
          i`agreements; validate information about you or provided by you when you ` +
          i`register as a merchant; or protect the rights, property, or safety of ` +
          i`Wish, its employees, users, or others. In connection with your use of the ` +
          i`Services, and subject to the above, you understand and agree that Wish may ` +
          i`disclose certain information about you to suppliers, service providers, ` +
          i`consumers, regulators, or other third parties, including, without ` +
          i`limitation, your:`
        }
      />

      <ul>
        <li>
          <Markdown openLinksInNewTab text={i`Name`} />
        </li>

        <li>
          <Markdown openLinksInNewTab text={i`Email address`} />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`Payment method or financial account information`}
          />
        </li>

        <li>
          <Markdown openLinksInNewTab text={i`Shipping address`} />
        </li>

        <li>
          <Markdown openLinksInNewTab text={i`Phone number`} />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Geolocation data (including business name, street address (number and ` +
              i`name), postal code, city, state, country, or latitude and longitude ` +
              i`coordinates)`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`Social network account credentials`}
          />
        </li>

        <li>
          <Markdown openLinksInNewTab text={i`Sales information`} />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`Wish identifications or usernames`}
          />
        </li>
      </ul>

      <Markdown
        openLinksInNewTab
        text={i`[View Privacy Policy](${wishPrivacyPolicyUrl})`}
      />

      <p>&nbsp;</p>

      <div>
        <h2>8. Arbitration</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You and Wish understand and agree that this arbitration section operates ` +
          i`as a separate and distinct arbitration agreement (“**Arbitration ` +
          i`Agreement**”) that is severable from the remainder of this Agreement and ` +
          i`is enforceable regardless of the enforceability of any other provision of ` +
          i`the Agreement. Consideration for this provision includes, without ` +
          i`limitation, the parties’ mutual agreement to arbitrate claims. As noted ` +
          i`above, this agreement to arbitrate shall survive any termination, ` +
          i`cancellation, or expiration of the Agreement.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You and Wish agree that any dispute, controversy, or claim arising out of ` +
          i`or relating to your use of Wish, to any products or services sold or ` +
          i`distributed by or through Wish, to the Agreement, or to the Content, or ` +
          i`user submissions (public, personal, or limited audience) on Wish, shall be ` +
          i`resolved only by final and binding, bilateral arbitration, subject to the ` +
          i`exceptions below.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You and Wish agree that this Arbitration Agreement shall govern all ` +
          i`questions as to whether a dispute is subject to arbitration.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`“**Disputes**” shall include, but are not limited to, any claims or ` +
          i`controversies between you and Wish against each other related in any way ` +
          i`to or arising in any way out of or from the Agreement, the Services, the ` +
          i`Content, Submissions (public, personal, or limited audience), including, ` +
          i`but not limited to, sales, payments, returns, refunds, cancellations, ` +
          i`defects, policies (including violations or suspected violations thereof), ` +
          i`fulfilment, privacy, advertising, or any communications between you and ` +
          i`Wish, even if the claim arises after you or Wish has terminated the ` +
          i`Services or a user account. Disputes also include, but are not limited to, ` +
          i`claims that: (a) you bring against our employees, agents, Affiliates, or ` +
          i`other representatives; or (b) that Wish brings against you. Disputes also ` +
          i`include, but are not limited to, (i) claims in any way related to or ` +
          i`arising out of any aspect of the relationship between you and Wish, ` +
          i`whether based in contract, tort, statute, fraud, warranty, ` +
          i`misrepresentation, advertising claims, or any other legal theory; (ii) ` +
          i`claims that arose before the Agreement or out of prior Agreement(s) with ` +
          i`Wish; (iii) claims that are subject to on-going litigation; or (iv) claims ` +
          i`that arise after the termination of the Agreement.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.1 Initial Dispute Resolution</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`Most Disputes can be resolved without resorting to arbitration. In the ` +
          i`event of a Dispute, you and Wish each agree to first provide the other a ` +
          i`written notice (“**Notice of Dispute**”), which shall contain: (a) a ` +
          i`written description of the problem and relevant documents and supporting ` +
          i`information; (b) a statement of the specific relief sought; and (c) the ` +
          i`contact information of the party giving it. A Notice of Dispute must be ` +
          i`sent to: One Sansome Street, San Francisco, CA 94104 or emailed at ` +
          i`[merchant_notices@wish.com](${merchantNoticesEmail}). Wish will ` +
          i`provide a Notice of Dispute to you via the email address associated with ` +
          i`your Wish User ID, Merchant ID, or other information provided to Wish by ` +
          i`you.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You and Wish agree to use their best efforts to resolve the Dispute ` +
          i`through consultation with one another, and good faith negotiations shall ` +
          i`be a condition to either party initiating a lawsuit or arbitration. If an ` +
          i`agreement cannot be reached within forty-five (45) days of receipt of the ` +
          i`Notice of Dispute, you or Wish may commence an arbitration proceeding.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Except as provided below, no party shall be entitled to commence or ` +
          i`maintain any action in a court of law upon any matter in dispute until ` +
          i`such matter has been submitted and determined as provided here, and then ` +
          i`only for the enforcement of such arbitration award. Notwithstanding this ` +
          i`mediation and arbitration policy, either party may apply to a court of ` +
          i`competent jurisdiction as necessary to enforce an arbitration award, or to ` +
          i`seek a temporary restraining order or preliminary injunction to ensure ` +
          i`that the relief sought in arbitration is not rendered ineffectual during ` +
          i`the pendency of, or after the rendition of, a decision in any arbitration ` +
          i`proceeding. The institution of any action shall not constitute a waiver of ` +
          i`the right or obligation of any party to submit any claim seeking relief ` +
          i`other than injunctive or enforcement relief to arbitration. Further, any ` +
          i`party seeking to enforce an award of an arbitrator shall submit the award ` +
          i`under seal to maintain protections of confidential information, and you ` +
          i`and Wish hereby agree and consent to the filing of such a submission, ` +
          i`motion, or order under seal.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Notwithstanding the foregoing, Disputes concerning patents, copyrights, ` +
          i`moral rights, trademarks, and trade secrets and claims of piracy or ` +
          i`unauthorized use of the Services shall not be subject to arbitration, and ` +
          i`the notice and good-faith negotiation required by this Section shall not ` +
          i`apply to those types of Disputes.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.2 Binding Arbitration Process and Procedure</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`Except as provided herein, any Dispute will be finally resolved only by ` +
          i`binding arbitration.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Any arbitration will be filed with and administered by the International ` +
          i`Chamber of Commerce (“**ICC**”) under its rules and procedures, which are ` +
          i`available at the ICC website. If the ICC is not available to arbitrate, ` +
          i`the parties will select an alternative arbitral forum. If there is a ` +
          i`conflict between the ICC rules (or the rules of the alternative arbitral ` +
          i`forum selected by the parties) and the rules set forth in this Arbitration ` +
          i`Agreement, the rules set forth in this Arbitration Agreement will govern.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Notwithstanding the rules of the ICC, the following will apply to all ` +
          i`arbitration actions:`
        }
      />

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`The Arbitration Agreement and the arbitration will be governed by Dutch ` +
              i`Laws.`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`The arbitration will be conducted in English.`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`The parties agree that time is of the essence.`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`The arbitration will take place in Amsterdam, Netherlands.`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`The parties will be allotted equal time to present their respective cases, ` +
              i`including cross-examinations.`
            }
          />
        </li>
      </ul>

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In addition to the foregoing and notwithstanding the rules of the ICC, ` +
          i`certain procedures will apply depending on the amount in controversy. For ` +
          i`controversies and claims in which the amount in controversy is **less than ` +
          i`five million (5,000,000) dollars**, the following procedures will apply:`
        }
      />

      <p>&nbsp;</p>

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`The arbitration will occur within one hundred eighty (180) days from the ` +
              i`date on which the arbitrator is appointed and will last no more than five ` +
              i`(5) business days.`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`There will be one (1) arbitrator selected from the panel provided by the ` +
              i`ICC, using the ICC rules for arbitrator selection.`
            }
          />
        </li>
      </ul>

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`For controversies and claims in which the amount in controversy is **equal ` +
          i`to or exceeds five million (5,000,000) dollars,** the following procedures ` +
          i`will apply:`
        }
      />

      <p>&nbsp;</p>

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`There will be three (3) arbitrators selected from the panel provided by ` +
              i`the ICC, using the ICC rules for arbitrator selection.`
            }
          />
        </li>
      </ul>

      <Markdown
        openLinksInNewTab
        text={
          i`If Wish’s or your claim is solely for **monetary relief of ten thousand ` +
          i`(10,000) dollars or less** and does not include a request for any type of ` +
          i`equitable remedy, the party bringing the claim may choose whether the ` +
          i`arbitration of the claim will be conducted through a telephonic hearing or ` +
          i`by an in-person hearing under the ICC rules, solely based on documents ` +
          i`submitted to the arbitrator.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You or Wish may choose to pursue a claim in small claims court with ` +
          i`jurisdiction and venue over you if Wish otherwise qualifies for such small ` +
          i`claims court and the claim does not include a request for any type of ` +
          i`equitable relief. However, if you decide to pursue a claim in small claims ` +
          i`court, you agree to still provide Wish with advance notice by email to ` +
          i`[merchant_notices@wish.com](${merchantNoticesEmail}) and by U.S. Mail ` +
          i`to General Counsel, ContextLogic Inc., One Sansome Street, 33rd Fl., San ` +
          i`Francisco, CA 94104.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`To the extent the filing fee for the arbitration exceeds the cost of ` +
          i`filing a lawsuit, Wish will pay the additional cost. Wish shall also bear ` +
          i`the cost of any arbitration fees, unless the arbitrator finds your claims, ` +
          i`defenses, or other fee-generating activity to be asserted or conducted for ` +
          i`an improper purpose or frivolous. You are responsible for all other ` +
          i`additional costs that you may incur in the arbitration, including, without ` +
          i`limitation, attorneys’ fees and expert witness costs unless Wish is ` +
          i`specifically required to pay such fees under Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`This Agreement, including this Arbitration Agreement, does not prevent you ` +
          i`from bringing your Dispute to the attention of any relevant government ` +
          i`agency. Such agencies can, if the Applicable Laws allow, seek relief ` +
          i`against Wish on your behalf.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The parties agree and understand that maintaining confidentiality of ` +
          i`Disputes and Dispute resolution is of the utmost importance and agree that ` +
          i`Wish has valuable trade secrets and proprietary and confidential ` +
          i`information. The parties agree to take all necessary steps to protect from ` +
          i`public disclosure such trade secrets and proprietary and confidential ` +
          i`information.`
        }
      />

      <h3>8.3 Authority of Arbitrator</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator has the authority to determine jurisdiction and ` +
          i`arbitrability issues as a preliminary matter, except the arbitrator shall ` +
          i`not have the authority to determine whether the arbitration can proceed on ` +
          i`behalf of or against a class. The arbitrator, and not any court or agency, ` +
          i`shall have exclusive authority to resolve any Dispute related to the ` +
          i`interpretation, applicability, enforceability, or formation of this ` +
          i`Arbitration Agreement, including, but not limited to, any claim that all ` +
          i`or any part of this Arbitration Agreement is void or voidable. The ` +
          i`arbitrator will decide the rights and liabilities, if any, of you and ` +
          i`Wish.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitration proceeding will not be consolidated with any other matters ` +
          i`or joined with any other proceedings or parties.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator shall have the authority to grant motions dispositive of ` +
          i`all or part of any claim or Dispute.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator shall have the authority to award monetary damages ` +
          i`available to an individual under Applicable Laws, the arbitral forum’s ` +
          i`rules, and this Agreement (including the Arbitration Agreement), except ` +
          i`that the arbitrator will have no authority to award punitive damages. Each ` +
          i`party hereby waives any right to seek or recover punitive damages with ` +
          i`respect to any Dispute resolved by arbitration, except where an applicable ` +
          i`statute or other law allows for punitive damages.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator shall have the authority to grant any nonmonetary remedy or ` +
          i`relief available to an individual under Applicable Laws, the arbitral ` +
          i`forum’s rules, and this Agreement (including the Arbitration Agreement).`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator shall issue a written award and statement of decision ` +
          i`describing the essential findings and conclusions on which any award (or ` +
          i`decision not to render an award) is based, including the calculation of ` +
          i`any damages awarded. The arbitrator shall follow the Applicable Laws. The ` +
          i`arbitrator has the same authority to award relief on an individual basis ` +
          i`that a judge in a court of law would have. The award of the arbitrator is ` +
          i`final and binding upon you and us.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.4 Parents, Subsidiaries, Affiliates</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`This Arbitration Agreement will also apply to any claims asserted by you ` +
          i`against any present or future parent, subsidiary, or Affiliate of Wish, or ` +
          i`any employee, officer, director, or investor of Wish, and to any claims ` +
          i`asserted by any of them against you, to the extent that any such claims ` +
          i`arise out of or relate to this Agreement (such as with respect to their ` +
          i`validity or enforceability), the Services, any person’s access to or use ` +
          i`of the Services, or the provision of Content, products, services, or ` +
          i`technology on or through the Services.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.5 Changes to This Arbitration Section</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish reserves the right to amend the Arbitration Agreement. In that ` +
          i`instance, Wish will provide thirty (30) days’ advance notice of any such ` +
          i`amendment if required by law to do so. The notice will be provided via ` +
          i`electronic mail, the Wish Merchant Dashboard, the Wish API, or other ` +
          i`commercially reasonable means. With regard to any such amendment, you ` +
          i`agree that the continuation of your use of the Services, after receipt of ` +
          i`the notice of such amendment, shall constitute your acknowledgement and ` +
          i`acceptance of any and all such changes, and it shall also constitute ` +
          i`adequate consideration to support such change(s), which shall ` +
          i`automatically be incorporated into this Arbitration Agreement as of the ` +
          i`effective date stated in the amendment.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Unless otherwise permitted by Applicable Laws, you agree that any ` +
          i`amendment will only apply to Disputes that arise after the effective date ` +
          i`of such amendment unless you have expressly agreed to such amendment.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Prior to the effective date of such proposed amendment, you may opt out of ` +
          i`any proposed amendment by sending a timely written notice of your decision ` +
          i`to opt out to the following address: General Counsel, ContextLogic Inc., ` +
          i`One Sansome Street, 33rd Fl., San Francisco, CA 94104, or by email to ` +
          i`[merchant_notices@wish.com](${merchantNoticesEmail}). Wish may ` +
          i`terminate the Agreement of any Merchant who does not agree to a proposed ` +
          i`amendment to this Section 8.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.6 Severability</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`Subject to Section 9, titled “Waiver of Class or Consolidated Actions,” if ` +
          i`any part or parts of this Arbitration Agreement are found under the law to ` +
          i`be invalid or unenforceable, then such specific part or parts shall be of ` +
          i`no force and effect and shall be severed, and the remainder of the ` +
          i`Arbitration Agreement shall continue in full force and effect.`
        }
      />

      <p>&nbsp;</p>

      <h3>8.7 Survival of Arbitration Agreement</h3>

      <Markdown
        openLinksInNewTab
        text={
          i`This Arbitration Agreement will survive the termination or expiration of ` +
          i`this Agreement or your relationship with Wish.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>9. Waiver of Class or Consolidated Actions</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish and you agree that any Dispute will be brought in an individual ` +
          i`capacity, and not on behalf of, or as part of, any purported class, ` +
          i`consolidated, or representative proceeding. Wish and you further agree to ` +
          i`not participate in any consolidated, class, or representative proceeding ` +
          i`(existing or future) brought by any third party arising out of or relating ` +
          i`to any dispute with a third party.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`The arbitrator cannot combine more than one person’s or entity’s claims ` +
          i`into a single case, and cannot preside over any consolidated, class, or ` +
          i`representative proceeding (unless we agree otherwise). And the ` +
          i`arbitrator’s decision or award in one person’s or entity’s case can only ` +
          i`impact the person or entity that brought the claim, not other Wish users, ` +
          i`and cannot be used to decide other disputes with other users.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`If any clause within this Waiver of Class or Consolidated Actions Section ` +
          i`is found to be illegal or unenforceable, that specific clause will be ` +
          i`severed from this Section, and the remainder of its provisions will be ` +
          i`given full force and effect.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`This Waiver of Class or Consolidated Actions Section will also apply to ` +
          i`any claims asserted by you against any present or future parent, ` +
          i`subsidiary, or Affiliate of Wish, or any employee, officer, director, or ` +
          i`investor of Wish, and to any claims asserted by any of them against you, ` +
          i`to the extent that any such claim is a Dispute.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`This Waiver of Class or Consolidated Actions Section shall survive any ` +
          i`termination of your account or the Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Wish may try to help you resolve disputes with third parties. Wish does so ` +
          i`in Wish’s sole discretion, and Wish has no obligation to resolve disputes ` +
          i`between you and other users or between you and outside parties. In the ` +
          i`event that you have a dispute with one or more other users or other ` +
          i`outside parties, you release Wish, its officers, employees, agents, and ` +
          i`successors from any and all claims, demands, and damages of every kind or ` +
          i`nature, known or unknown, suspected or unsuspected, disclosed or ` +
          i`undisclosed, arising out of or in any way related to such disputes or our ` +
          i`Services.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Please note that this clause may not be applicable, especially in European ` +
          i`Union or the United Kingdom jurisdictions that do not have class or ` +
          i`consolidated action options.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`If Wish has posted or provided a translation of the English language ` +
          i`version of this Agreement, you agree that the translation is provided for ` +
          i`convenience only and that the English language version will govern your ` +
          i`uses of the Services or the Sites.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>10. Wish’s Intellectual Property</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`The materials displayed or performed or available on or through the ` +
          i`Services, including, but not limited to, text, graphics, data, articles, ` +
          i`photos, images, illustrations, user submissions, and so forth are ` +
          i`protected by copyright or other intellectual property laws. You promise to ` +
          i`abide by all copyright notices, trademark rules, information, and ` +
          i`restrictions contained in such Content you access through the Services and ` +
          i`all Applicable Laws relating thereto, and you won’t access, use, copy, ` +
          i`reproduce, modify, create derivative works from, translate, publish, ` +
          i`broadcast, synchronize, transmit, distribute, perform, upload, display, ` +
          i`license, sell, or otherwise exploit for any purpose any Content not owned ` +
          i`by you, (a) without the prior written consent of the owner of that Content ` +
          i`or (b) in a way that violates someone else’s (including Wish’s) rights.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>11. Access and Interference</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Much of the information on Wish is updated on a real-time basis and is ` +
          i`proprietary or is licensed to Wish by Wish’s merchants or third parties. ` +
          i`You agree that you will not use any robot, spider, scraper, or other ` +
          i`automated means to access Wish for any purpose whatsoever, except to the ` +
          i`extent expressly permitted by and in compliance with this Agreement, ` +
          i`including the [Wish API Terms of Service](${partnersTosUrl}), ` +
          i`without Wish’s prior express written permission. Additionally, you agree ` +
          i`that you will not:`
        }
      />

      <p>&nbsp;</p>

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Take any action that imposes, or may impose, as determined by Wish, an ` +
              i`unreasonable or disproportionately large load on Wish’s infrastructure; or`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`Interfere or attempt to interfere with the proper working of the Services ` +
              i`or any activities conducted on the Services.`
            }
          />
        </li>
      </ul>

      <p>&nbsp;</p>

      <div>
        <h2>12. Restriction, Suspension, and Termination for Convenience</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`We may restrict or suspend your use of any Services or restrict or suspend ` +
          i`this Agreement. At the time of the restriction or suspension taking ` +
          i`effect, we shall provide you with a statement of reasons (i.e., facts or ` +
          i`circumstances leading to the restriction or suspension) for that decision. ` +
          i`You shall act in a commercially reasonable manner, in accordance with ` +
          i`Applicable Laws; as such, we may restrict or suspend without notice your ` +
          i`use of any Services or restrict or suspend this Agreement in the event ` +
          i`that we believe that you do not act in a commercially reasonable manner.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`We may terminate your use of any Services or terminate this Agreement for ` +
          i`convenience with thirty (30) days’ advance notice prior to the termination ` +
          i`taking effect, with a statement of reasons (i.e., facts or circumstances ` +
          i`leading to the termination) for that decision. This notice period shall ` +
          i`not apply where we (a) are subject to Applicable Laws that require us to ` +
          i`terminate the Agreement or the Services without respect to that notice ` +
          i`period; (b) exercise a right of termination under an imperative reason ` +
          i`pursuant to Applicable Laws; or (c) can demonstrate that you have breached ` +
          i`the Agreement.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In the case of restriction, suspension, or termination for convenience, we ` +
          i`shall give you the opportunity to clarify the facts and circumstances in ` +
          i`the framework of the internal complaint-handling process as set forth in ` +
          i`Section 8 of these Terms. However, you shall act in a commercially ` +
          i`reasonable manner and in accordance with Applicable Laws; as such, we may ` +
          i`restrict, suspend or terminate without notice your use of any Services or ` +
          i`restrict, suspend or terminate this Agreement in the event that we believe ` +
          i`that you do not act in a commercially reasonable manner.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>13. Breach</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Without limiting any other remedies, Wish may, without notice, and without ` +
          i`refunding any fees, (a) delay or immediately remove Content, (b) warn ` +
          i`Wish’s community of your actions, (c) issue a warning to you, (d) ` +
          i`restrict, suspend, freeze, or terminate your selling privileges, (e) ` +
          i`prohibit your access to the Services, (f) temporarily or indefinitely ` +
          i`suspend or freeze your account privileges, (g) terminate or delete your ` +
          i`account, (h) issue penalties against you, (i) cause payments to you to be ` +
          i`withheld or forfeited, (j) take technical and legal steps to keep you off ` +
          i`the Services, (k) permanently withhold and/or set off or offset and retain ` +
          i`any payments that otherwise may have been payable to you, (l) issue ` +
          i`refunds to customers, or (m) take any other actions as may be permitted by ` +
          i`any Applicable Laws that Wish determines to be necessary and appropriate ` +
          i`under the circumstances if: (i) you breach this Agreement (including, ` +
          i`without limitation, any Additional Terms or Policies incorporated herein); ` +
          i`(ii) Wish is unable to verify or authenticate any of your personal ` +
          i`information or Content; (iii) Wish believes that you are acting ` +
          i`inconsistently with the letter or spirit of Wish’s Policies, you have ` +
          i`engaged in improper or fraudulent activity in connection with Wish, or ` +
          i`your actions may cause legal liability or financial loss to Wish or other ` +
          i`merchants using the Services; (iv) your account remains unconfirmed; (v) ` +
          i`your account remains inactive for a period of one hundred eighty (180) ` +
          i`days; (vi) Wish determines that your account has been used to engage in ` +
          i`deceptive, fraudulent, or illegal activity, or to substantially violate ` +
          i`this Agreement (including any of our Additional Terms or Policies); (vii) ` +
          i`Wish determines that the performance of your obligations under this ` +
          i`Agreement may result in returns, claims, disputes, violations of this ` +
          i`Agreement (including any of our Additional Terms or Policies), or cause ` +
          i`any other risks to Wish, its customers  or other third parties; or (viii) ` +
          i`Wish determines, suspects, or is informed that you are selling goods or ` +
          i`engaging in acts in violation of the prohibited activities defined under ` +
          i`Section 5 of this Agreement (including, without limitation, selling goods ` +
          i`that are counterfeit, illegal, or violate third party rights) or that you ` +
          i`are otherwise violating this Agreement or any Applicable Laws or other ` +
          i`requirement of any court, arbitrator, or other governmental authority.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>14. Liability Limit</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Parties are only liable for damages suffered as a result of fraud, willful ` +
          i`misconduct, or gross negligence.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In case of minor negligence, the parties are only liable for (a) injury to ` +
          i`life, body, or health; or (b) foreseeable typically occurring damages ` +
          i`resulting from the breach of a fundamental contractual obligation, as ` +
          i`applicable under Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Certain jurisdictions do not allow limitations on implied warranties or ` +
          i`the exclusion or limitation of certain damages. If these laws apply to you ` +
          i`despite Section 28 of this Agreement, the above applies only to the ` +
          i`fullest extent permitted by Applicable Laws.`
        }
      />

      <div>
        <h2>15. Indemnity</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`To the fullest extent allowed by Applicable Laws, you release us and agree ` +
          i`to indemnify, defend, and hold Wish, its Affiliates, and its officers, ` +
          i`agents, employees, customers, users, licensors, suppliers, and partners ` +
          i`harmless from and against any and all claims, suits, investigations, ` +
          i`liabilities, damages (actual and consequential), losses, penalties, costs, ` +
          i`and expenses (including attorneys’ fees) arising from or in any way ` +
          i`related to (a) your actual or alleged breach of any representations, ` +
          i`warranties, covenants, or obligations in this Agreement; (b) your ` +
          i`products, services, or Content, including, without limitation, any actual ` +
          i`or alleged infringement or other violation of any intellectual property or ` +
          i`other proprietary rights, violation of any privacy right, right of ` +
          i`publicity, or third party agreement, violation of any Applicable Laws, ` +
          i`personal injury, death, or property damage related thereto, use of any ` +
          i`reposting of any Content you provide, and Wish’s exercise of the license ` +
          i`rights granted to Wish under this Agreement; (c) your use of the Services ` +
          i`(including any actions taken by a third party using your account); (d) ` +
          i`your acts and omissions; and (e) Your Taxes (as defined below). Wish may ` +
          i`in its sole discretion elect to defend, and control the defense and ` +
          i`settlement of, any indemnified claim. If you defend any indemnified claim, ` +
          i`you will use counsel reasonably satisfactory to us to defend such ` +
          i`indemnified claim. If at any time we reasonably determine that any ` +
          i`indemnified claim might adversely affect us, we may take control of the ` +
          i`defense. You may not consent to the entry of any judgment or enter into ` +
          i`any settlement of a claim without our prior written consent. Wish may ` +
          i`deduct from your account any amounts incurred in defending or settling any ` +
          i`indemnified claim and any damages or other amounts awarded in connection ` +
          i`with any indemnified claim.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`To the fullest extent allowed by Applicable Laws, we release you and agree ` +
          i`to indemnify, defend, and hold you, your officers, directors, employees, ` +
          i`and agents harmless from and against any and all claims, suits, ` +
          i`investigations, liabilities, damages (actual and consequential), losses, ` +
          i`penalties, costs, and expenses (including attorneys’ fees) arising from or ` +
          i`in any way related our noncompliance with Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`“**Your Taxes**” means any and all sales, goods and services, use, excise, ` +
          i`premium, import, export, value-added, consumption, and other taxes, ` +
          i`regulatory fees, levies (specifically including environmental levies), or ` +
          i`charges and duties assessed, incurred, or required to be collected or paid ` +
          i`for any reason in connection with your use of the Services, any ` +
          i`advertisement, offer or sale of products, services, or Content by you on ` +
          i`or through or in connection with the Services. This defined term also ` +
          i`means any of the types of taxes, duties, levies, or fees mentioned above ` +
          i`that are imposed on or collectible by Wish or any of its Affiliates in ` +
          i`connection with or as a result of fulfillment services, including the ` +
          i`storage of inventory or packaging of products, services, or Content and ` +
          i`other materials owned by you and stored by Wish, shipping, or other ` +
          i`actions by Wish. “Your Taxes”, however, does not include any taxes ` +
          i`collected and remitted by Wish as disclosed in the [Tax ` +
          i`Policy](${taxPolicyUrl}).`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>16. Insurance</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`If requested by Wish, within thirty (30) days after such request, you will ` +
          i`maintain at your expense throughout the remainder of the Term general ` +
          i`commercial, umbrella, or excess liability insurance with the limits per ` +
          i`occurrence and in aggregate requested by us covering liabilities caused by ` +
          i`or occurring in conjunction with the operation of your business, including ` +
          i`products, products/completed operations, and bodily injury, with a policy ` +
          i`or policies naming Wish and its Affiliates and assignees as additional ` +
          i`insureds. At our request, you will provide to us certificates of insurance ` +
          i`for the coverage.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>17. Taxes; Legal Compliance</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`As between the parties, you will be responsible for the collection, ` +
          i`reporting, and payment of any and all of Your Taxes, except to the extent ` +
          i`that Wish chooses or is required to calculate, collect, and remit taxes ` +
          i`according to Applicable Laws.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Notwithstanding or limiting in any way the foregoing, you shall comply ` +
          i`with all Applicable Laws regarding your use of any of the Services and, if ` +
          i`applicable, your listing, solicitation of offers to purchase, and sale of ` +
          i`items. In addition, you will be responsible for paying, withholding, ` +
          i`filing, and reporting all taxes, duties, and other governmental ` +
          i`assessments associated with your activity in connection with the Services, ` +
          i`provided that Wish may, in its sole discretion, do any of the foregoing on ` +
          i`your behalf or for itself as it sees fit.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`For direct shipments from outside the European Union to customers in the ` +
          i`European Union, Wish may provide you with its Import One Stop Shop ` +
          i`(''IOSS'') number. You understand and agree that you will only use this ` +
          i`IOSS number in relation to sales carried out via the Wish online ` +
          i`marketplace. If you use the IOSS number of Wish inappropriately in any ` +
          i`way, Wish may, at its sole discretion, withhold or offset retaining ` +
          i`amounts otherwise due to you, issue a penalty, suspend your account, or ` +
          i`take any other actions Wish deems appropriate for so long as Wish in its ` +
          i`sole discretion believes that you used the Wish IOSS number in an ` +
          i`inappropriate way. Inappropriate usage of the IOSS number includes, but is ` +
          i`not limited to, the following scenarios:`
        }
      />

      <ul>
        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`you use the IOSS number of Wish for shipments related to sales carried out ` +
              i`outside the Wish online platform (for instance, where you sell and ship ` +
              i`goods to a customer in the European Union via another online marketplace);`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`you do not transmit the Wish IOSS VAT number to your freight forwarder in ` +
              i`a secure manner;`
            }
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={i`you communicate the Wish IOSS VAT number to other persons; or`}
          />
        </li>

        <li>
          <Markdown
            openLinksInNewTab
            text={
              i`you publish the Wish IOSS VAT number anywhere (for example an internet ` +
              i`website).`
            }
          />
        </li>
      </ul>

      <p>&nbsp;</p>

      <div>
        <h2>18. Customs Duty and Indirect Taxes</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`In an effort to remain compliant with respective consumer legislations, we ` +
          i`strongly encourage you to maintain good standing with respect to customs ` +
          i`and indirect taxes, where applicable.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`Due to separate and applicable tax jurisdictions, purchases may be subject ` +
          i`to specific sales, customs duty, goods and services taxes (GST), or ` +
          i`value-added taxes (VAT), and the shipping time and associated cost may ` +
          i`increase.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`In an effort to maintain compliance with U.S. or international tax law, ` +
          i`Wish may require you to provide a valid indirect tax registration number ` +
          i`to sell on our marketplace, and you may be required to remit indirect ` +
          i`taxes as the result of conducting business. As a result, we strongly ` +
          i`encourage you to consult your own tax experts and register for indirect ` +
          i`taxes based on your acts and circumstances.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that you are responsible for all indirect tax collection and ` +
          i`payment among all parties of this Agreement, unless Wish chooses to ` +
          i`collect and remit tax as disclosed in its [Tax ` +
          i`Policy](${taxPolicyUrl}) and in compliance with Applicable ` +
          i`Laws.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>19. Severability</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`If any provision of this Agreement is held unenforceable, then such ` +
          i`provision will be modified to reflect the parties’ intention. All ` +
          i`remaining provisions of this Agreement shall remain in full force and ` +
          i`effect.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>20. Survival</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Provisions that, by their nature, should survive termination of this ` +
          i`Agreement shall survive termination. By way of example, all of the ` +
          i`following will survive termination: any obligation you have to pay us or ` +
          i`indemnify us, any limitations on our liability, any confidentiality ` +
          i`obligations, any terms regarding Wish’s ownership or intellectual property ` +
          i`rights, or any terms regarding Disputes between us. The failure of either ` +
          i`you or us to exercise, in any way, any right herein shall not be deemed a ` +
          i`waiver of any further rights hereunder.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>21. Export</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You will not directly or indirectly export, re-export, transmit, or cause ` +
          i`to be exported, re-exported or transmitted, any commodities, software or ` +
          i`technology to any country, individual, corporation, organization, or ` +
          i`entity to which such export, re-export, or transmission is restricted or ` +
          i`prohibited, including any country, individual, corporation, organization, ` +
          i`or entity under Sanctions or embargoes administered by the United Nations, ` +
          i`the U.S. Departments of State, Treasury, or Commerce, the European Union, ` +
          i`the United Kingdom, or any other applicable government authority.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>22. Confidentiality</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`During the course of your use of the Services, you may receive information ` +
          i`relating to us or to the Services that is not known to the general public, ` +
          i`including personal information related to Wish users (“**Confidential ` +
          i`Information**”). You agree that: (a) all Confidential Information will ` +
          i`remain Wish’s exclusive property; (b) you will use Confidential ` +
          i`Information only as is reasonably necessary for your participation in the ` +
          i`Services; (c) you will not otherwise disclose Confidential Information to ` +
          i`any other person or entity; and (d) you will take all reasonable measures ` +
          i`to protect the Confidential Information against any use or disclosure that ` +
          i`is not expressly permitted in this Agreement. If there is a breach of ` +
          i`Confidential Information, you agree to notify Wish immediately upon your ` +
          i`discovery of such breach and to cooperate fully in Wish’s investigation, ` +
          i`mitigation, and remediation of the breach. You are solely responsible for ` +
          i`reimbursing Wish for any and all costs associated with a breach of ` +
          i`Confidential Information. You may not issue any press release or make any ` +
          i`public statement related to the Services, or use our name, trademarks, or ` +
          i`logo, in any way (including in promotional material) without our advance ` +
          i`written permission, or misrepresent or embellish the relationship between ` +
          i`us in any way.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>23. Use of Wish Transaction Information</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You will not, and will cause your Affiliates not to, directly or ` +
          i`indirectly: (a) disclose any Wish Transaction Information (defined below), ` +
          i`except that you may disclose that information solely as necessary for you ` +
          i`to perform your obligations under this Agreement if you ensure that every ` +
          i`recipient uses the information only for that purpose and complies with the ` +
          i`restrictions applicable to you related to that information; (b) use any ` +
          i`Wish Transaction Information for any marketing or promotional purposes ` +
          i`whatsoever, or otherwise in any way inconsistent with Wish’s [Privacy ` +
          i`Policy](${wishPrivacyPolicyUrl}) or any Applicable Laws; (c) contact ` +
          i`a person or entity that has ordered your product, service, or Content with ` +
          i`the intent to collect any amounts in connection therewith or to influence ` +
          i`that person or entity to make an alternative transaction; (d) disparage ` +
          i`us, our Affiliates, or any of our or their respective products or services ` +
          i`or any customer; or (e) target communications of any kind on the basis of ` +
          i`the intended recipient being a Wish user. In addition, you may only use ` +
          i`tools and methods that we designate to communicate with Wish users ` +
          i`regarding transactions, including for the purpose of scheduling, ` +
          i`communicating, or cancelling the fulfillment of products, services, or ` +
          i`Content. “**Wish Transaction Information**” means, collectively, order ` +
          i`information and any other data or information acquired by you or your ` +
          i`Affiliates from Wish, its Affiliates, or otherwise as a result of this ` +
          i`Agreement, the transactions contemplated by this Agreement, or the ` +
          i`parties’ performance under this Agreement.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>24. Force Majeure</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`We will not be liable for any delay or failure to perform any of our ` +
          i`obligations under this Agreement by reasons, events, or other matters ` +
          i`beyond our reasonable control.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>25. Relationship of Parties</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You and Wish are independent contractors, and nothing in this Agreement ` +
          i`will create any partnership, joint venture, agency, franchise, sales ` +
          i`representative, or employment relationship between us. You will have no ` +
          i`authority to make or accept any offers or representations on Wish’s ` +
          i`behalf. This Agreement will not create an exclusive relationship between ` +
          i`you and Wish. Nothing expressed or mentioned in or implied from this ` +
          i`Agreement is intended or will be construed to give to any person other ` +
          i`than the parties to this Agreement any legal or equitable right, remedy, ` +
          i`or claim under or in respect to this Agreement. This Agreement and all of ` +
          i`the representations, warranties, covenants, conditions, and provisions in ` +
          i`this Agreement are intended to be and are for the sole and exclusive ` +
          i`benefit of Wish, you, and customers. You will be solely responsible for ` +
          i`all obligations associated with the use of any third party service or ` +
          i`feature that you permit us to use on your behalf, including compliance ` +
          i`with any applicable terms of use. You will not make any statement, whether ` +
          i`on your site or otherwise, that would contradict anything in this Section ` +
          i`25.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>26. Electronic Communications</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that all notices required to be given under these Terms or any ` +
          i`Additional Terms or Policies, and other communications from Wish, may be ` +
          i`given electronically, including, without limitation, through emails, ` +
          i`texts, mobile push notices, or notices and messages provided on or through ` +
          i`the Services, the Wish Merchant Dashboard, or the Wish API, and you agree ` +
          i`to retain copies of these communications for your records. You agree that ` +
          i`all terms and conditions, agreements, notices, disclosures, and other ` +
          i`communications and documents that Wish provides to you electronically will ` +
          i`have the same legal effect that such communications or documents would ` +
          i`have if they were set forth in “writing.”`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>27. Assignment</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`You agree that Wish may assign all of its rights and duties under this ` +
          i`Agreement to an Affiliate of Wish, and in such event, Wish will notify you ` +
          i`of such assignment by email or other written notification. You may not ` +
          i`assign any of your rights and duties under this Agreement to any other ` +
          i`party without the prior express written consent of Wish.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>28. Choice of Law; Jurisdiction and Venue</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`Jurisdiction and venue of any matter not subject to arbitration, as stated ` +
          i`in Section 8, shall reside exclusively in Amsterdam, Netherlands, and ` +
          i`nowhere else, except that any action to enforce a judgment may be brought ` +
          i`in any court of competent jurisdiction.`
        }
      />

      <p>&nbsp;</p>

      <Markdown
        openLinksInNewTab
        text={
          i`This Agreement is to be construed in accordance with and governed by the ` +
          i`substantive law of the Netherlands, without regard to its choice of law ` +
          i`principles.`
        }
      />

      <p>&nbsp;</p>

      <div>
        <h2>29. Suggestions and Other Information</h2>
      </div>

      <Markdown
        openLinksInNewTab
        text={
          i`If you or any of your Affiliates elect to provide or make available ` +
          i`suggestions, comments, ideas, improvements, or other feedback or materials ` +
          i`to us (collectively, “**Submissions**”), Wish will consider such ` +
          i`Submissions to be non-confidential and non-proprietary. Wish shall have no ` +
          i`obligations concerning the Submissions, and Wish will be free to, and you ` +
          i`hereby grant to Wish a royalty-free, non-exclusive, worldwide, perpetual, ` +
          i`sublicensable (through multiple tiers), irrevocable right and license to, ` +
          i`use, disclose, reproduce, perform, display, transfer, and otherwise ` +
          i`distribute, synchronize, broadcast, adapt, modify, excerpt, analyze, ` +
          i`re-format, create derivative works of, and otherwise commercially or ` +
          i`non-commercially exploit any of the foregoing Submissions in any manner, ` +
          i`in any medium, and in any format and for any purpose, including, without ` +
          i`limitation, for the advertising, marketing, or promotion of Wish, any ` +
          i`Services, or any future product or service, without any restriction or ` +
          i`compensation to you. If we make suggestions on using the Services, you are ` +
          i`responsible for any actions you take based on our suggestions.`
        }
      />

      <p>&nbsp;</p>

      <p>&nbsp;</p>

      <p>&nbsp;</p>
    </div>
  );
});
