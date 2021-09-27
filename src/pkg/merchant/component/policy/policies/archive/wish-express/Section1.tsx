import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const fineUSDAmount = (value: number) => `${formatCurrency(value, "USD")}&ast;`;

const Section1 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Wish Express orders must be fulfilled within ${5} calendar ` +
        i`days and confirmed delivered within ${5} working days ` +
        i`(exceptions apply to certain destination countries) from ` +
        i`the order released date`
      }
      subSectionNumber={`${sectionNumber}.1`}
      currentSection={currentSection}
    >
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Working days are defined as Monday through Friday. Weekends and ` +
          i`[USPS Postal holidays]` +
          i`(https://about.usps.com/news/events-calendar/postal-holidays.htm) ` +
          i`will not be considered as working days. Note that all ` +
          i`Wish Express orders must also be fulfilled (i.e., marked “shipped”) ` +
          i`within ${5} calendar days from the order released time, per ` +
          i`[Merchant Policy 5.1](${"#5.1"}). ` +
          i`All orders, including Wish Express orders, are also subject to the ` +
          i`[Merchant Policy 5.5 - Late Confirmed Fulfillment Policy](${"#5.5"}), ` +
          i`which states that if an order is not confirmed shipped by the ` +
          i`carrier within ${168} hours of the time the order is released, ` +
          i`then the merchant will be penalized ${20}% of the order value, ` +
          i`or ${fineUSDAmount(1)}, whichever is greater. This ` +
          i`policy is only applicable to confirmed fulfilled orders where ` +
          i`(merchant price per item + shipping price per item) is less than ` +
          i`${fineUSDAmount(100)}. However, if a Wish Express order ` +
          i`is confirmed delivery by the carrier within the required arrival ` +
          i`time frame, the penalty will be reversed.`
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
          i`${fineUSDAmount(2)} per violating order due ` +
          i`to merchant-initiated cancellation and/or refund before fulfillment.`
        }
      />
      <p className={css(styles.subsectionEnd)}>
        <Link href="/policy#wish_express" openInNewTab>
          See examples and learn more
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
