/* eslint-disable local-rules/unwrapped-i18n */

/* eslint-disable local-rules/use-markdown */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import boostLogo from "@assets/img/product-boost/terms_page_logo.svg";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { wishURL } from "@toolkit/url";
/* Toolkit */

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { StyleSheet } from "aphrodite";

export default observer((props: BaseProps) => {
  const { className, style } = props;
  const styles = useStyleSheet();
  const merchantTermsOfService = "/terms-of-service";
  const policyCurrency = "/policy/currency";
  const wishMainURL = wishURL("");

  /*eslint-disable local-rules/unnecessary-list-usage*/

  /*eslint-disable local-rules/no-hardcoded-wish-link*/
  return (
    <div className={css(className, style)}>
      <div className={css(styles.imageContainer)}>
        <img
          draggable={false}
          src={boostLogo}
          className={css(styles.logoImage)}
          width={700}
        />
      </div>
      <h1>ProductBoost Addendum</h1>
      <p>
        <Markdown
          openLinksInNewTab
          text={
            i`This ProductBoost Addendum (the "Addendum") contains the ` +
            i`terms and conditions that govern your access to and use of ` +
            i`various services relating to the advertising and promotion of` +
            i` your products and/or brand (collectively, the "ProductBoost Services")` +
            i` on the website(s), services or applications, including, ` +
            i`without limitation, the website at [${wishMainURL}](${wishMainURL}) ` +
            i`and app offered under the name Wish, and the websites and apps offered` +
            i` by us, including without limitation under the names Geek, Cute, Home, ` +
            i`and Mama (collectively, the “Services”), offered by ContextLogic Inc.` +
            i` (collectively, “Wish,” “we,” or is”). This Addendum modifies and` +
            i` supplements the existing Merchant Terms of Services agreement between you ` +
            i`and Wish, which currently is available at` +
            i` [the “Terms”](${merchantTermsOfService}).`
          }
        />
      </p>
      <p>
        Should you elect to use or otherwise take advantage of these
        ProductBoost Services, in addition to being bound by the Terms and all
        documents and policies incorporated therein, the ProductBoost Addendum
        shall also apply to you and you agree to be bound by them. In the event
        of conflict between this ProductBoost Addendum and the Terms, this
        ProductBoost Addendum shall control as it relates to the ProductBoost
        Services; however, nothing in this ProductBoost Addendum removes any of
        your obligations or any of Wish’s rights with respect to any other
        Terms.
      </p>
      <p>
        “Ads” means an advertisement provided by you for display on the
        Services.
      </p>
      <p>
        “Merchant Page” means the web page on the Services registered to or
        associated with your products and/or brand.
      </p>
      <p>
        “Confidential Information” means data and information relating to us or
        to the ProductBoost Services that is not known to the general public or
        other data or information collected, received or derived by you in
        connection with the ProductBoost Services.
      </p>
      <p>
        “Intellectual Property Right” means any patent, copyright, trademark,
        trade name, service mark, domain name, moral right, trade secret right,
        publicity right or any other intellectual property right.
      </p>
      <p>
        “Materials” means any content, information, data, images, videos and
        other materials provided or made available by you to us in connection
        with the ProductBoost Services.
      </p>
      <h2>ProductBoost Services:</h2>
      <p>
        The ProductBoost Services include a variety of self-service and fully
        managed tools and services that enable you to advertise and promote your
        brand and/or products on our sites, or on or in connection with
        third-party sites or platforms, from time to time. Without limiting your
        responsibility for your Materials and use of the ProductBoost Services,
        we reserve the right to determine and control all aspects (including all
        functionality) of the ProductBoost Services and any Services, as well as
        the right to re-design, modify, discontinue offering or restrict access
        to any or all aspects of any of them at any time at our sole discretion
        without notice. Additionally, we may at any time remove you from the
        ProductBoost Services or suspend, reject or remove any of your
        Materials, your Merchant Page or your Ads without notice. Although any
        or all aspects of the ProductBoost Services may be offered without
        charge, we reserve the right to charge for any or all aspects of the
        ProductBoost Services at any time.
      </p>
      <h2>Your Merchant Page and Your Ads:</h2>
      <p>
        Your Merchant Page and Ads may be displayed on any part of the Services
        as we determine. Except as otherwise agreed upon, we do not guarantee
        that your Merchant Page or Ads will be displayed on or made available
        through any portion of the Services, nor do we guarantee that your
        Merchant Page or Ads will appear in any particular position or rank. In
        addition, we do not guarantee any impressions from the display of your
        Ads or any sales of products on the Services. As between you and us, you
        are solely responsible for all obligations, risks, liabilities and other
        aspects related to the Materials and your use of the ProductBoost
        Services.
      </p>
      <p>
        You may request that we cancel an individual campaign for your Ads, and
        we will do so reasonably promptly after receiving your request. Any fees
        previously paid in connection with the cancelled campaign (including any
        upfront flat fee) will not be refunded, and any fees accrued in
        connection with the cancelled campaign as of the date of cancellation
        will be payable as described below.
      </p>
      <h2>ProductBoost Services Requirements:</h2>
      <p>
        Your Materials will be provided or made available to us in connection
        with the ProductBoost Services in the format and using the interface,
        feeds, APIs or other mechanisms we require and in accordance with our
        applicable policies. Your Materials will be complete, accurate and
        up-to-date, and you will promptly update your Materials as necessary to
        ensure they at all times remain complete, accurate and up-to-date. It is
        your responsibility to keep backups of your Materials, and we are not
        responsible for loss of your Materials or any information for any
        reason.
      </p>
      <p>
        In addition, you hereby consent to us (1) sending you e-mails or other
        communications relating to the ProductBoost Services from time to time;
        and (2) monitoring, recording, using, and disclosing to third parties
        information contained in or about your Materials, your Merchant Page and
        your Ads that we obtain in connection with your use of the ProductBoost
        Services.
      </p>
      <p>
        In addition to the prohibitions and other requirements set out in the
        Terms, you agree that you:
      </p>
      <ol type="a">
        <li>
          Will ensure that your Materials do not relate to, contain, or
          otherwise seek to advertise or promote any products or services that
          are prohibited by our applicable policies; and
        </li>
        <li>
          Will not, directly or indirectly, engage in any fraudulent,
          impermissible, inappropriate or unlawful activities in connection with
          your participation in or use of the ProductBoost Services, including:
          (i) generating fraudulent, repetitive or otherwise invalid clicks,
          impressions, queries or other interactions, whether through the use of
          automated applications or otherwise; (ii) other than through reporting
          offered by us under the ProductBoost Services, collecting any user
          information from any Service or retrieving, extracting, indexing or
          caching any portion of any Service, whether through the use of
          automated applications or otherwise; (iii) submitting any of your
          Materials that are inappropriate, obscene, defamatory or unlawful, or
          that infringe or misappropriate the proprietary rights, including
          Intellectual Property Rights, of any third party; (iv) submitting any
          of your Materials for your Ads that are directed at children under 13
          years of age, as defined by COPPA; (v) engaging in any acts or
          practices that are unfair or deceptive in connection with your
          Merchant Page or your Ads, including submitting any of your Materials
          that are unfair, deceptive, misleading, or that contain false or
          inaccurate information or unsubstantiated claims; (vi) targeting
          communications of any kind on the basis of the intended recipient
          being a user of the Services; (vii) interfering with the proper
          working of any Service, the ProductBoost Services or our systems;
          (viii) transmitting any viruses, “Trojan horses” or other harmful
          code; or (ix) attempting to bypass any mechanism we use to detect or
          prevent such activities.
        </li>
      </ol>
      <h2>Payment:</h2>
      <p>
        <Markdown
          openLinksInNewTab
          text={
            i`You agree to pay us the applicable fees we calculate for your use` +
            i` of the ProductBoost Services or any part of them. You agree to pay us` +
            i` the applicable fees for your use of the ProductBoost ` +
            i`Services in the manner described in ` +
            i`the [CurrencyPolicy](${policyCurrency}). All click and impression ` +
            i`counts in connection with your Ads will be measured solely by us, ` +
            i`and our measurements will be used as the sole basis for determining` +
            i` delivery of your Ads and amounts due. For any amounts you owe us, ` +
            i`we may (a) offset any amounts that are payable by you to us against` +
            i` any payments we may make to you in connection ` +
            i`with the Wish Marketplace, or (b) invoice you for amounts due to us` +
            i` under this Agreement, in which case you will ` +
            i`pay the invoiced amounts within 30 days of the date of the ` +
            i`applicable invoice. You will reimburse us for all ` +
            i`fees incurred in connection with our collection of amounts payable` +
            i` and past due. You waive all claims related ` +
            i`to the fees we charge, unless made within 60 days after the` +
            i` date charged. You understand third parties may generate ` +
            i`impressions or clicks on your Ads for improper purposes,` +
            i` and you accept this risk.`
          }
        />
      </p>
    </div>
  );
});

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        logoImage: {
          maxWidth: 700,
        },
        imageContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    []
  );
};
