import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

const FBSFeeLandingContainer = () => {
  const styles = useStyleSheet();

  const renderFeeSection = () => (
    <>
      <Text weight="bold" className={css(styles.header)}>
        Fees
      </Text>
      <div className={css(styles.description)}>
        <p>
          A summary of the fees you may incur is given below. These fees will be
          charged on a monthly basis and deducted from your payment.
        </p>
        <p>
          Note that, to participate in FBS, merchants need to ship their
          inventory to one of the Fulfillment By Wish (FBW) warehouses.
        </p>
        <p>
          Therefore, some of the fees listed are incurred through FBW warehouse
          operations.
        </p>
      </div>

      <table className={css(styles.table)}>
        <tbody>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBS Service Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fee per order to deliver inventory from FBW warehouses to stores
                for customers to pick up
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW One-time Shipping Plan Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fixed fee to cover initial processing fees and pick up (if
                available)
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW Storage Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                A storage charge for each item you have in the warehouse.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW Outbound Fulfillment Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fixed fee per order to cover outbound fulfillment.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                Packaging Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fixed fee per order if not properly packaged.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW Retrieval Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                If you decide you want to retrieve an item from the warehouse,
                you may be charged a fee to do this.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW Disposal Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fee if merchant requests inventory disposal.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBW SKU Relabel Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                Fixed fee per unit if merchant requests label change.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderPaymentSection = () => (
    <>
      <Text weight="bold" className={css(styles.header)}>
        Payment
      </Text>
      <table className={css(styles.table)}>
        <tbody>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>Product Cost</div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                You will be paid the product cost (as specified in product
                details) for each sale.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>
                FBS Service Fees
              </div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                The FBS Service Fees detailed above will be deducted from your
                payments.
              </div>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <div className={css(styles.text, styles.bold)}>FBW Fees</div>
            </td>
            <td className={css(styles.td)}>
              <div className={css(styles.text)}>
                The FBW fees detailed above will be deducted from your payments.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderRefundSection = () => {
    const refundPolicyStr = i`Wish's Refund Policy`;
    const linkUrl = "/policy/home";
    return (
      <>
        <Text weight="bold" className={css(styles.header)}>
          Refunds
        </Text>
        <div className={css(styles.descriptionContainer)}>
          <Markdown
            className={css(styles.description)}
            text={
              i`The standard refund policy will apply to any refunds on FBS ` +
              i`orders. For more information, see [${refundPolicyStr}](${linkUrl})`
            }
            openLinksInNewTab
          />
        </div>
      </>
    );
  };

  const renderRegionalSection = () => (
    <>
      <Text weight="bold" className={css(styles.header)}>
        Links to Regional FBS Fees
      </Text>
      <table className={css(styles.table)}>
        <tbody>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <Text weight="bold" className={css(styles.text, styles.bold)}>
                FBS-North America
              </Text>
            </td>
            <td className={css(styles.td)}>
              <Link href={"/fbs/fees/north-america"} openInNewTab>
                Click to View Fees
              </Link>
            </td>
          </tr>
          <tr className={css(styles.tr)}>
            <td className={css(styles.td)}>
              <Text weight="bold" className={css(styles.text, styles.bold)}>
                FBS-Europe
              </Text>
            </td>
            <td className={css(styles.td)}>
              <Link href={"/fbs/fees/europe"} openInNewTab>
                Click to View Fees
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.pageContent)}>
        <Text weight="bold" className={css(styles.pageHeader)}>
          FBS General Fee and Payment Information
        </Text>
        {renderRegionalSection()}
        {renderFeeSection()}
        {renderPaymentSection()}
        {renderRefundSection()}
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const { pageBackground, borderPrimary, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          justifyContent: "center",
          alignItems: "center",
          padding: "24px 40px",
          display: "flex",
          flexDirection: "column",
          marginBottom: "45px",
          backgroundColor: pageBackground,
        },
        pageContent: {},
        header: {
          fontSize: 20,
          color: textBlack,
          marginTop: 25,
          marginBottom: 25,
        },
        card: {
          marginBottom: 24,
          padding: 24,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: 42,
        },
        table: {
          width: "100%",
          fontSize: 16,
          border: `1px solid ${borderPrimary}`,
        },
        bold: {
          color: textBlack,
        },
        td: {
          padding: "10px 24px",
          border: `1px solid ${borderPrimary}`,
        },
        text: {
          color: textDark,
        },
        horizontal: {
          display: "flex",
        },
        vertical: {
          display: "flex",
          flexDirection: "column",
        },
        tr: {},
        pageHeader: {
          fontSize: 32,
          color: textBlack,
          marginBottom: 20,
        },
        descriptionContainer: {
          display: "flex",
        },
        description: {
          marginRight: "10px",
        },
        pageDescription: {
          marginTop: 20,
          marginBottom: 20,
          fontSize: 16,
          color: textDark,
        },
      }),
    [pageBackground, borderPrimary, textBlack, textDark]
  );
};

export default observer(FBSFeeLandingContainer);
