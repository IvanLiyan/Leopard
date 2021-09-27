import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const fineUSDAmount = (value: number) => `${formatCurrency(value, "USD")}&ast;`;

const Section1 = ({
  className,
  sectionNumber,
  announcementsMap,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Wish Express orders must be fulfilled within ${5} calendar ` +
        i`days and confirmed delivered within ${5} business days ` +
        i`(exceptions apply to certain destination countries) from ` +
        i`the order-release date`
      }
      subSectionNumber={`${sectionNumber}.1`}
      announcementsMap={announcementsMap}
      currentSection={currentSection}
    >
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Wish Express orders must be fulfilled (i.e., marked “shipped”) ` +
          i`within ${5} calendar days from the order-release date, per ` +
          i`[Merchant Policy 5.1](${"#5.1"}). ` +
          i`Wish Express orders also must be confirmed delivered within ` +
          i`${5} business days from the order-release date, subject to ` +
          i`any exceptions that may apply. Business days are defined as ` +
          i`Monday through Friday, and weekends and ` +
          i`[USPS Postal holidays](${"https://about.usps.com/news/events-calendar/postal-holidays.htm"}) ` +
          i`will not be considered business days.`
        }
        openLinksInNewTab={(href: string) => href[0] != "#"}
      />
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`All orders, including Wish Express orders, are also subject ` +
          i`to the [Merchant Policy 5.5 - Late Confirmed Fulfillment Policy](${"#5.5"}).`
        }
        openLinksInNewTab={(href: string) => href[0] != "#"}
      />
      <p>
        Orders refunded due to merchants being unable to fulfill them will be
        considered pre-fulfillment cancellations, which includes both
        auto-refunded orders due to late fulfillment and merchant-initiated
        refunds due to merchants’ inability to fulfill the orders for any
        reason.
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Based on Wish's [Fulfillment Policy](${"#fulfillment"}), ` +
          i`merchants will be penalized ${fineUSDAmount(50)} ` +
          i`per auto-refund due to late fulfillment, and ` +
          i`${fineUSDAmount(2)} per merchant-initiated cancellation ` +
          i`and/or refund before fulfillment.`
        }
      />
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("231264967")} openInNewTab>
          Learn more
        </Link>
      </p>
    </PolicySubSection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        paragraph: {
          marginBottom: 10,
        },
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    []
  );

export default observer(Section1);
