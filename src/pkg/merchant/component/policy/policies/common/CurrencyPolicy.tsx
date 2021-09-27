import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const CurrencyPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySection
      className={className}
      name="currency"
      title={i`Currency`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection>
        <Markdown
          text={
            i`Wish may, in its sole discretion, calculate payments, ` +
            i`fees, disbursements, penalties, or any other amounts due to ` +
            i`or from Merchants (the “Amounts”) based on USD and/or local ` +
            i`currency amounts as defined under [Account > Payment Settings > Currency](${"/settings#currency-settings"}). ` +
            i`Wish generally uses exchange rates obtained from a third party ` +
            i`to make currency conversions. Wish may, in its sole discretion, ` +
            i`adjust or alter the exchange rate when converting from one currency to another.`
          }
          openLinksInNewTab
        />
      </PolicySubSection>

      <PolicySubSection
        title={i`Amounts and Penalties in Local Currency`}
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>Amounts may be issued in the merchant’s local currency or USD.</p>
        <Markdown
          text={
            i`To learn more about the CNY, EUR, or GBP penalty ` +
            i`amounts specifically, please check out the first three FAQ articles ` +
            i`[here](${zendeskURL("360013530933")}).`
          }
          openLinksInNewTab
        />
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchant Payments in Local Currency`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`Merchants may be paid in their local currency as defined under ` +
            i`a merchant’s [Account > Payment Settings > Currency](${"/settings#currency-settings"}).`
          }
          openLinksInNewTab
        />
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`Payments are subject to the existing ` +
            i`[Fees and Payments](${"#fees_and_payments"}) policy.`
          }
        />
        <p>
          {version == "archive"
            ? i`Payment is calculated based on the cost of the product in the ` +
              i`merchant’s local currency.`
            : i`Payments are calculated based on the “Total Cost” of the order ` +
              i`as that column is displayed in the Merchant’s ` +
              i`“Merchant Dashboard Orders” page(s) and expressed in the ` +
              i`Merchant’s local currency.`}
        </p>
        <p className={css(styles.subsectionEnd)}>
          <Link href={zendeskURL("360013530933")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>
    </PolicySection>
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

export default observer(CurrencyPolicy);
