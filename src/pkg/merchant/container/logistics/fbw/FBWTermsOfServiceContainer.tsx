import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Markdown } from "@ContextLogic/lego";
import { H3Markdown } from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const URL_TOS = "/terms-of-service";
const URL_3PL_REP_LIST =
  "https://s3-us-west-1.amazonaws.com/sweeper-production-merchant-fbw/FBW+Prohibited+Items.pdf";
const URL_3PL_TERMS =
  "https://s3-us-west-1.amazonaws.com/sweeper-production-merchant-fbw/360zebra+Global+Fulfillment+Services+Agreement.pdf";

const FBWTermsOfServiceContainer = () => {
  const styles = useStylesheet();

  /* eslint-disable local-rules/unnecessary-list-usage */
  return (
    <div className={css(styles.root)}>
      <H3Markdown text={i`Fulfillment By Wish Terms and Conditions`} />
      <Markdown
        className={css(styles.welcomeText)}
        text={
          i`By submitting products to be offered by you through ContextLogic Inc.’s ` +
          i`(**“Wish”**) Fulfillment By Wish Service (the **“FBW Service”**) you ` +
          i`agree to be bound by all of the following terms, including those ` +
          i`additional terms and conditions and policies referenced herein ` +
          i`and/or available by hyperlink (collectively, ` +
          i`the **“FBW Terms”**). For clarity, these FBW Terms are in addition to, and ` +
          i`not in lieu of, the Merchant Terms of Service and Agreement available at ` +
          i`[https://merchant.wish.com/terms-of-service](${URL_TOS}) ` +
          i`(**“Merchant Terms”**), which are incorporated by ` +
          i`reference herein. In the event of a conflict between the FBW Terms ` +
          i`and the Merchant Terms, the Merchant Terms shall govern.`
        }
        openLinksInNewTab
      />
      <ol>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Shipment.** Wish will review the products you list for inclusion in the ` +
              i`FBW Service (**“FBW Products”**) and the quantity of such products listed ` +
              i`for inclusion in the FBW Service. You shall ship such quantity of FBW ` +
              i`Products to the corresponding third party logistics provider selected by you ` +
              i`(**“3PL Service Provider”**) only after Wish provides written confirmation ` +
              i`that such quantity of FBW Products may be enrolled in the FBW Service. You ` +
              i`shall not ship any additional FBW Products to such 3PL Service Provider ` +
              i`(including, without limitation, to replenish FBW Products delivered ` +
              i`to purchasers) unless and until you submit such additional quantities ` +
              i`for inclusion in the FBW Service and Wish provides written acceptance ` +
              i`for their enrollment in the FBW Service. You shall be responsible for ` +
              i`arranging and bearing all costs of shipping your FBW Products to the ` +
              i`corresponding 3PL Service Provider and paying all related taxes, duties ` +
              i`and other governmental assessments.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Approved Products and Restricted Products.** You agree not to ship any ` +
              i`products to a 3PL Service Provider in violation of its restricted ` +
              i`items policies. ` +
              i`A representative list of various 3PL Service Provider’s restricted items ` +
              i`(which may be updated by Wish or a 3PL Service Provider from time to time) ` +
              i`can be found [here](${URL_3PL_REP_LIST}) . It is your responsibility to ` +
              i`ensure that the products ` +
              i`you ship to a 3PL Service Provider comply with such 3PL Service Provider’s ` +
              i`restricted items policy, and Wish’s acceptance of your products’ enrollment ` +
              i`into the FBW Service does not mean that such products are acceptable to ship to ` +
              i`each 3PL Service Provider. Without limiting any other remedies available ` +
              i`to Wish, ` +
              i`Wish may cause any item shipped by you to a 3PL Service Provider in violation ` +
              i`of its restricted items policy to be returned to you at your expense.`
            }
            openLinksInNewTab
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**3PL Terms.** Each 3PL Service Provider has its own terms and conditions ` +
              i`governing such 3PL Service Provider’s receipt, storage, and delivery of your ` +
              i`FBW Products (**“3PL Terms”**). By selecting a 3PL Service Provider when you ` +
              i`list FBW Products for enrollment in the FBW Service, you agree (for the benefit ` +
              i`of the corresponding 3PL Service Provider) to all of the 3PL Terms ` +
              i`corresponding ` +
              i`to such 3PL Service Provider. You also acknowledge that the 3PL Terms represent ` +
              i`an agreement solely between you and the corresponding 3PL Service Provider and ` +
              i`that Wish is not bound by or a party to such 3PL Terms in any way (except as a ` +
              i`third party beneficiary of your obligations under such 3PL Terms). ` +
              i`The 3PL Terms ` +
              i`for each 3PL Service Provider can be found [here](${URL_3PL_TERMS}) or as otherwise provided to you by Wish or the 3PL.`
            }
            openLinksInNewTab
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Fulfillment.** When a purchaser orders one of your FBW Products ` +
              i`through Wish’s FBW Service, you agree to fulfill such order from ` +
              i`your inventory of FBW Products held by the corresponding 3PL Service ` +
              i`Provider. You hereby authorize Wish to instruct the 3PL Service ` +
              i`Provider to deliver such FBW Product to such purchaser.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Modifications.** Wish may change these FBW Terms or any 3PL Terms at ` +
              i`any time. If Wish does so, it will use reasonable efforts to bring such ` +
              i`change to your attention by sending you an email, placing a notice on ` +
              i`the FBW Service, or by some other means. If any modification is ` +
              i`unacceptable to you, your only recourse is to discontinue your use of ` +
              i`the FBW Service. Your continued use of the ` +
              i`FBW Service following Wish’s notification to you of a modification ` +
              i`(regardless of whether we ` +
              i`notify you of such modification in advance), will constitute binding ` +
              i`acceptance of the modification.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Revocation; Limitation.** Wish may, in its sole discretion, revoke or limit ` +
              i`in any way your right to participate in the FBW Service.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Disclaimer.** You agree that Wish shall not be responsible or liable for any ` +
              i`loss or damage of any sort incurred in connection the acts or omissions of a ` +
              i`3PL Service Provider or its agents or otherwise for any lost, damaged or ` +
              i`undelivered FBW Products (whether in shipment to the 3PL Service Provider, in ` +
              i`storage at the 3PL Service Provider’s facilities, in delivery to a ` +
              i`purchaser, or otherwise).`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Indemnity.** To the fullest extent allowed by applicable law, you agree to ` +
              i`indemnify and hold Wish, its affiliates, officers, agents, employees, and ` +
              i`partners harmless from and against any and all claims, liabilities, damages ` +
              i`(actual and consequential), losses and expenses (including attorneys’ fees) ` +
              i`arising from or in any way related to (a) your use of the FBW Service, (b) ` +
              i`FBW Products, or (c) your breach of any 3PL Terms, these FBW Terms, or any ` +
              i`other terms between you and Wish.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Payment.** You agree to Wish’s Merchant payment policy available at ` +
              i`[here](${zendeskURL(
                "204531588-What-Is-Wish-s-Payment-Policy-"
              )}). ` +
              i`You are responsible for any other 3PL Service Provider fees related to ` +
              i`your FBW Products (including, without limitation, any fees for storage, ` +
              i`return of products, or receipt of products not in conformance with the 3PL ` +
              i`Terms) (**“Additional 3PL Fees”**). Further, you hereby authorize Wish to ` +
              i`pay any Additional 3PL Fees that Wish, in its sole discretion, determines ` +
              i`that you owe a 3PL Service Provider (whether for violation of the 3PL Terms ` +
              i`or otherwise). You agree to fully reimburse Wish for such payments.`
            }
            openLinksInNewTab
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Disposal.** You hereby authorize Wish to instruct a 3PL Service Provider ` +
              i`to dispose of your FBW Products, if, in Wish’s discretion, Additional 3PL ` +
              i`Fees (e.g., for storage) in connection with such FBW Products will or ` +
              i`may exceed the amounts payable by Wish to you. You shall be responsible ` +
              i`for any fees charged by the 3PL Service Provider for such disposal and ` +
              i`such fees shall be deemed Additional 3PL Fees for all purposes of these ` +
              i`FBW Terms.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Transport.** Wish may, in its sole discretion, transport any or all ` +
              i`of your FBW Products from one 3PL Service Provider location to another ` +
              i`such location (including within the same 3PL Service Provider’s facility), ` +
              i`or from your current 3PL Service Provider’s location to another location ` +
              i`of Wish’s choosing.`
            }
          />
        </li>
        <li>
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`**Offset.** Without limiting any remedy available to Wish, you agree ` +
              i`that Wish may offset any and/or all of the following against any ` +
              i`amounts payable to you (whether pursuant to the FBW Service or ` +
              i`otherwise): (a) the amount of any of your reimbursement obligations to ` +
              i`Wish, (b) the amount of any of your indemnification obligations to Wish, ` +
              i`and/or (c) the amount of any damages suffered by Wish (as determined in ` +
              i`Wish’s reasonable discretion) as a result of your breach of any 3PL ` +
              i`Terms, these FBW Terms, or any other terms between you and Wish.`
            }
          />
        </li>
      </ol>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  const { dimenStore } = useStore();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "24px 40px",
          display: "flex",
          flexDirection: "column",
          marginBottom: "45px",
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
          backgroundColor: pageBackground,
        },
        welcomeText: {
          marginTop: 10,
        },
      }),
    [pageBackground, dimenStore.pageGuideX]
  );
};

export default observer(FBWTermsOfServiceContainer);
