/* eslint-disable local-rules/unwrapped-i18n */

/* eslint-disable local-rules/use-markdown */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { wishURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const MerchantPayoutServiceTerms = (props: BaseProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const privacyPolicyLink = wishURL("/privacy_policy");
  const tosLink = "/terms-of-service";

  /*eslint-disable local-rules/unnecessary-list-usage*/

  /*eslint-disable local-rules/no-hardcoded-wish-link*/
  return (
    <div className={css(className, style)}>
      <h1>Merchant Pay-Out Service Terms - EEA</h1>
      <h2>1. Scope</h2>
      <p>
        Please read these merchant Pay-out service terms - EEA (“Pay-out Terms,”
        or "Pay-out Agreement") carefully before using the payment services
        offered by ContextLogic B.V. (“CLBV,” “we,” “our,” and “us”), a
        subsidiary of ContextLogic Inc. This Pay-out Agreement sets forth the
        legally binding terms and conditions for your use as a merchant of our
        payment service.
      </p>
      <p>
        This Pay-out Agreement is solely about our provision and your use of the
        payment service offered by us (“Service”) and is separate from your
        legal relationship with ContextLogic Inc. regarding your use of the Wish
        marketplace.
      </p>
      <p>
        <Markdown
          openLinksInNewTab
          text={
            i`The essence of our payment service is that we transfer monies from ` +
            i`ContextLogic Inc. to you. These are monies owed to you by ContextLogic ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`Inc. under the [Merchant ToS](${tosLink}). Typically transfers will be made via ` +
            i`CLBV’s separate account(s), into your account with a merchant payment ` +
            i`service provider (“MSP”).`
          }
        />
      </p>
      <h2>2. DEFINITIONS AND INTERPRETATION</h2>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Affiliate</div>
        <div>
          shall mean, with respect to any entity, any other entity that directly
          or indirectly controls, is controlled by, or is under common control
          with that entity.
        </div>
      </div>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Merchant ToS</div>
        <div>
          <Markdown
            openLinksInNewTab
            text={
              i`The Merchant Terms of Service and Agreement of ContextLogic Inc., as ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`available on [https://merchant.wish.com/terms-of-service](${tosLink}).`
            }
          />
        </div>
      </div>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Data Protection Legislation</div>
        <div>
          all applicable privacy and data protection laws including the General
          Data Protection Regulation ((EU) 2016/679) and any applicable national
          implementing laws, regulations and secondary legislation in the
          Netherlands relating to the processing of Personal Data.
        </div>
      </div>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Party / Parties</div>
        <div>A party / the parties to this Pay-out Agreement.</div>
      </div>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Payment Data</div>
        <div>
          Data regarding the payments to you that we process in the performance
          of this Pay-Out Agreement.
        </div>
      </div>
      <div className={css(styles.row)}>
        <div className={css(styles.rowTerm)}>Personal Data</div>
        <div>has the meaning set out in the Data Protection Legislation.</div>
      </div>
      <h2>3. CHARGES</h2>
      <p>
        The Service is ancillary to the merchant services provided by
        ContextLogic Inc.
      </p>
      <h2>4. ELIGIBILITY</h2>
      <p>
        You shall only make use of the Service if you are: (i) a registered
        merchant with its principal place of business in the European Economic
        Area (EEA) or the United Kingdom (UK); (ii) bound to the Merchant ToS;
        and (iii) have been accepted by us as a recipient of the Service, which
        usually takes place after completion of our merchant due diligence / KYC
        process.
      </p>
      <h2>5. EFFECTIVE DATE</h2>
      <p>
        This agreement shall enter into force on the sooner of your request to
        receive the Service or your acceptance of these Pay-out Terms.
      </p>
      <h2>6. SAFEGUARDING MERCHANTS' FUNDS</h2>
      <p>
        We are obligated to safeguard the funds received on your behalf. For
        this purpose, we use a separate entity, Stichting Custodian ContextLogic
        Payments (“Foundation”). Parties acknowledge and agree that Foundation
        shall receive funds on behalf of Parties, and save them in the manner as
        instructed by us. Foundation is not required to verify the correctness
        of these instructions from us. Consequently, each payment made by
        Foundation is made on our instruction, and each incorrect payment is
        therefore the consequence of incorrect instructions to that effect given
        by us. Each (alleged) entitlement to a payment under this Pay-out
        Agreement will therefore be considered an (alleged) entitlement against
        us, and you hereby waive your right to demand such amount from
        Foundation or to take legal action to demand such an amount from
        Foundation. Hereby the Parties irrevocably agree that the Foundation can
        invoke this waiver against you and this right is granted without
        consideration (in Dutch "om niet") and is hence considered accepted
        between the parties. The parties hereby irrevocably and unconditionally
        agree to waive their rights to rescind, terminate, void, annul or
        otherwise invalidate this Section 6 on whatever ground or for whatever
        reason.
      </p>
      <h2>7. YOUR OBLIGATIONS AND ACKNOWLEDGEMENTS</h2>
      <p>
        In order to use our Service you must have an active Wish merchant
        account and an account with an MSP (e.g. Payoneer or Paypal).
      </p>
      <p>
        In order to enable us to comply with anti-terrorism, anti-money
        laundering, financial services, and other laws and regulations, you must
        provide certain KYC information about you, your activities and your
        shareholders ("Registration Information") upon our first request. You
        warrant unconditionally that all Registration Information provided by
        you is correct and up-to-date. You will provide us with at least three
        business days prior written notice of any change of the Registration
        Information. You will on first request from us provide any additional
        information and supporting documentation regarding your activities, such
        as your identity and those of your shareholders, as we may reasonably
        deem necessary to ensure compliance with applicable laws and regulations
        and third party requirements. You agree and acknowledge that we may run
        further checks on your identity, creditworthiness and background by
        contacting and consulting relevant registries and governmental
        authorities.
      </p>
      <p>
        You accept and acknowledge that we only pay out any amounts to you as
        per the determination by ContextLogic Inc. under the Merchant ToS. We
        are not a party to that relationship and any issues regarding the
        amounts and pay-out dates must be resolved directly with ContextLogic
        Inc.
      </p>
      <h2>8. TERM AND TERMINATION</h2>
      <p>
        This agreement shall continue in force until terminated pursuant to
        these Pay-out Terms.
      </p>
      <p>
        These Pay-out Terms shall terminate automatically in case of expiry or
        termination of the Merchant ToS between you and ContextLogic Inc.
      </p>
      <p>
        Either party may terminate these Pay-out Terms for any reason on 10
        business days written notice. Note, however, that merchants with their
        principal place of business in the European Economic Area or the UK
        cannot use the Wish marketplace if no valid and binding Pay-out
        Agreement is in place.
      </p>
      <p>
        We shall also have the right to terminate this Pay-out Agreement or
        suspend our obligations thereunder with immediate effect if:
      </p>
      <ul className={css(styles.list)}>
        <li className={css(styles.listItem)}>
          you commit a material breach of your obligations under these Pay-out
          Terms;
        </li>
        <li className={css(styles.listItem)}>
          we reasonably suspect that you are using the Wish marketplace in
          breach of the Merchant ToS or applicable law, such as the legislation
          in a country where your products are offered from or to;
        </li>
        <li className={css(styles.listItem)}>
          a regulator and / or a bank or payment service provider demands that
          we terminate the provision of services under these Pay-out Terms.
        </li>
      </ul>
      <h2>9. CONFIDENTIALITY</h2>
      <p>
        During the course of your use of the Service, you may receive
        information relating to us or the Service that is not known to the
        general public (“Confidential Information”). You agree that: (a) all
        Confidential Information will remain our exclusive property; (b) you
        will use Confidential Information only as is reasonably necessary for
        your participation in the Service; (c) you will not otherwise disclose
        Confidential Information to any other person or entity; and (d) you will
        take all reasonable measures to protect the Confidential Information
        against any use or disclosure that is not expressly permitted in this
        Pay-out Agreement. You may not issue any press release or make any
        public statement related to the Service, or use our name, trademarks, or
        logo, in any way (including in promotional material) without our advance
        written permission, or misrepresent or embellish the relationship
        between us in any way.
      </p>
      <h2>10. DATA PROTECTION</h2>
      <p>
        Personal Data are processed in the context of the execution of this
        Pay-out Agreement. With respect to the processing of the Personal Data,
        both Parties are controllers within the meaning of Data Protection
        Legislation, insofar as they independently determine the purposes and
        means for the processing. Parties must take appropriate technical and
        organizational measures for the protection of Personal Data. If asked,
        Parties will inform each other of the security measures taken.
      </p>
      <p>
        <Markdown
          openLinksInNewTab
          text={
            i`We are responsible for the protection of Payment Data in our ` +
            i`possession. All processing of personal data by us is subject to our ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[Privacy Policy](${privacyPolicyLink}), and we ` +
            i`will take administrative, technical and physical measures ` +
            i`reasonable from a commercial point of view to protect your Personal ` +
            i`and Payment Data against unauthorized access or unintended loss or ` +
            i`alteration. Notwithstanding the above, we cannot guarantee that ` +
            i`unauthorized third parties will never be able to breach or circumvent ` +
            i`the security measures taken by us and use the Personal and/or Payment ` +
            i`Data for inappropriate purposes. You accept this risk if you provide ` +
            i`us with your Personal Data. `
          }
        />
      </p>
      <p>
        We will process Personal Data in the context of our Services, in
        connection with statutory obligations, and to safeguard the security and
        integrity of, among other things, our organization and the financial
        sector. In processing Payment Data, we work together with different
        financial institutions and with our Affiliates, and we share Personal
        Data with such financial institutions and our Affiliates.
      </p>
      <p>
        We will only make Personal Data available to third parties in the
        context of our Services or if so required by contract, applicable laws
        or regulations.
      </p>
      <h2>11. LIABILITY</h2>
      <p>
        In order for any liability claim to be valid, it must be presented to us
        in writing, whilst giving us a reasonable period to offer an appropriate
        solution. If we are liable in connection with a breach of our
        obligations or for losses otherwise incurred by you as a result of the
        services provided by us under this Pay-out Agreement, such liability
        will at all times be limited to direct loss and exclude any indirect
        loss. Indirect loss includes, but is not limited to, loss of goodwill,
        lost profits, missed (investment) opportunities, and missed savings.
      </p>
      <p>
        Moreover, if and insofar we would be liable to you, such liability will
        be limited in all cases to an amount equal to 1% of the aggregated
        amounts that you received from us under this Pay-out Agreement in the 12
        months preceding the month in which the claim arose. Notwithstanding the
        preceding paragraphs, our liability will in all cases be limited to EUR
        10,000 (ten thousand euros) per annum. Any claim must be brought against
        us within three (3) months after the occurrence of the related incident
        giving rise to the claim became known to you. You agree and acknowledge
        that after expiry of this 3 months period your rights to bring a claim
        shall be waived.
      </p>
      <h2>12. FORCE MAJEURE</h2>
      <p>
        Parties will not be liable in the event of force majeure. “Force
        majeure” means: circumstances or events beyond the control of Parties –
        regardless of whether or not these circumstances were foreseen or
        foreseeable at the time this Pay-out Agreement was entered into – as a
        result of which Parties cannot reasonably be required to comply with
        their obligations under the Pay-out Agreement. These circumstances
        include in any case, but are not limited to: war, fire, natural
        disasters, labour disputes, power outages, strikes, epidemics,
        government rules and/or comparable rules, embargoes, and instructions
        from regulators, non-compliance (due to bankruptcy or other reasons) by
        suppliers, financial institutions, subcontractors or any other third
        party or parties engaged by Parties in performing the Agreement,
        attachments, unavailability of the systems of financial institutions
        and/or telecommunication services and (attempted) unauthorized
        penetration in and/or unauthorized use of the systems, networks and
        databases belonging to us or our Affiliates, and/or financial
        institutions, and/or on which we, depend.
      </p>
      <h2>13. APPLICABILITY OF PAYMENT SERVICES DIRECTIVE</h2>
      <p>
        Title 7B of Book 7 of the Dutch Civil Code (Burgerlijk Wetboek) and
        other laws and regulations implementing Directive (EU) 2015/2366
        (“PSD2”) or its predecessor, Directive 2007/64/EC ("PSD"), are not
        applicable to the extent it is permitted to deviate from relevant
        provisions in relationships with non-consumers, in accordance with
        Article 38 and 61 PSD2 (or Article 30 and 41 PSD).
      </p>
      <h2>14. MISCELLANEOUS</h2>
      <p>
        <strong>Electronic contracting:</strong>
        &nbsp;
        <span>
          Parties agree to exclude the applicability of articles 6:227b and
          6:227c of the Dutch Civil Code, inter alia, the duty to provide
          specific information on e-contracting.
        </span>
      </p>
      <p>
        <strong>Governing Law.</strong>
        &nbsp;
        <span>
          The laws of the Netherlands (excluding its rules governing conflicts
          of laws) shall govern the construction, interpretation and other
          matters arising out of or in connection with this Agreement (whether
          arising in contract, tort, equity or otherwise).
        </span>
      </p>
      <p>
        <strong>Competent Court.</strong>
        &nbsp;
        <span>
          The competent court in Amsterdam, the Netherlands, shall have
          exclusive jurisdiction to settle any dispute in connection with this
          Agreement, without prejudice to the rights of appeal, including an
          appeal to the Supreme Court.
        </span>
      </p>
    </div>
  );
};

export default MerchantPayoutServiceTerms;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          display: "flex",
          alignItems: "baseline",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: 10,
        },
        rowTerm: {
          minWidth: 150,
        },
        list: {
          marginLeft: 50,
        },
        listItem: {
          paddingLeft: 30,
          marginBottom: 10,
        },
      }),
    []
  );
};
