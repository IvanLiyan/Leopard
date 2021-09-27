/* eslint-disable local-rules/unnecessary-list-usage */
// Lints disabled:
// Using li/ul to bullet a list

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Accordion, Card, Link, Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencySettingsHelpProps = BaseProps & {
  readonly allowedMigration: string | null | undefined;
  readonly currentCurrency: string;
};

type HeaderProps = BaseProps & {
  readonly text: string;
};

const Header = (props: HeaderProps) => {
  const styles = useStylesheet();
  const { text } = props;

  return (
    <Text className={css(styles.headerText)} weight="medium">
      {text}
    </Text>
  );
};

export const CurrencySettingsHelp = (props: CurrencySettingsHelpProps) => {
  const styles = useStylesheet();
  const { allowedMigration, currentCurrency } = props;

  const [impactSectionExpanded, setImpactSectionExpanded] = useState(false);
  const [keepInMindSectionExpanded, setKeepInMindSectionExpanded] = useState(
    false
  );
  const displayExtraInfo =
    allowedMigration != "USD" && allowedMigration != "CNY" && allowedMigration;

  const currencyCodeAndSymbol = allowedMigration
    ? `${allowedMigration} (${getCurrencySymbol(allowedMigration)})`
    : "N/A";

  let faqLink = zendeskURL("360044761734");
  switch (allowedMigration) {
    case "EUR": {
      faqLink = zendeskURL("360044549073");
    }
    case "BRL": {
      faqLink = zendeskURL("360050840413");
    }
    case "CAD": {
      faqLink = zendeskURL("360056676394");
    }
    case "AUD": {
      faqLink = zendeskURL("360058553913");
    }
    case "JPY": {
      faqLink = zendeskURL("360056675734");
    }
    case "MXN": {
      faqLink = zendeskURL("360056673194");
    }
  }
  const faqLinkStr = `([${i`here`}](${faqLink}))`;
  const productLink = `[${i`Products`}](/product)`;
  const taxLink = `[${i`Tax Reports`}](/tax/reports)`;
  const merchantSupport = `[merchant_support@wish.com](mailto:merchant_support@wish.com)`;

  return (
    <Card className={css(styles.panelCard)}>
      <Accordion
        header={() => (
          <Header text={i`How does Currency Settings affect my store?`} />
        )}
        isOpen={impactSectionExpanded}
        onOpenToggled={setImpactSectionExpanded}
        headerPadding="22px 13px"
        chevronSize={11}
      >
        <ul className={css(styles.bullets)}>
          <li className={css(styles.bullet)}>
            Merchants have the ability to set their product and shipping prices
            in the currency indicated as their stores’ Local Currency Code on
            this page.
          </li>
          {allowedMigration == "BRL" ? (
            <li className={css(styles.bullet)}>
              <Markdown
                text={
                  i`Orders that are available for fulfillment will be paid in ${currentCurrency}, converted from ${allowedMigration} ` +
                  i`based on the ${allowedMigration} cost of a product as seen on the ${productLink} pages and the latest ` +
                  i`${currentCurrency} <> ${allowedMigration} exchange rate at time of payment disbursement.`
                }
              />
            </li>
          ) : (
            <li className={css(styles.bullet)}>
              <Markdown
                text={
                  i`Orders that are available for fulfillment will be ` +
                  i`paid in ${currentCurrency}. The ${currentCurrency} value ` +
                  i`is based on the ${currentCurrency} cost of a product as seen on the ${productLink} page.`
                }
              />
            </li>
          )}
          {displayExtraInfo && (
            <li className={css(styles.bullet)}>
              <Markdown
                text={
                  i`You can learn more about the ${allowedMigration} Local Currency Code ` +
                  i`and other related details ${faqLinkStr}.`
                }
              />
            </li>
          )}
          <li className={css(styles.bullet)}>
            <Markdown
              text={
                i`Taxes collected on behalf of merchants, if any, will be paid to ` +
                i`merchants in ${currentCurrency}. For the exact tax amount that ` +
                i`merchants are liable to remit to each tax authority, please visit ` +
                i`${taxLink}.`
              }
            />
          </li>
        </ul>
      </Accordion>
      {displayExtraInfo && (
        <Accordion
          header={() => (
            <Header
              text={
                i`What should I keep in mind when conducting ` +
                i`my business in ${currencyCodeAndSymbol}? `
              }
            />
          )}
          isOpen={keepInMindSectionExpanded}
          onOpenToggled={setKeepInMindSectionExpanded}
          headerPadding="22px 13px"
          chevronSize={11}
        >
          <span className={css(styles.firstSpanBullet)}>
            After you update your store’s Local Currency Code, the switch from
            USD ($) to {currencyCodeAndSymbol} for your store will be completed
            6 calendar days after the day you initiate the update on this page.
          </span>
          <span className={css(styles.spanBullet)}>
            Upon completion, your existing product and shipping prices will be
            automatically converted to {currencyCodeAndSymbol} based on the
            average exchange rate during the 30 calendar days immediately prior
            to the day you initiate the update to the Local Currency Code.
          </span>
          <span className={css(styles.spanBullet)}>
            <Markdown text={i`Click ${faqLinkStr} for examples.`} />
          </span>
          <span className={css(styles.spanBullet)}>
            {allowedMigration == "BRL" ? (
              <Markdown
                text={i`As you conduct business in ${currencyCodeAndSymbol}, please 
                  note that PayPal and Payoneer are the only payment providers 
                  that allow ${currencyCodeAndSymbol} to be converted to 
                  USD ($) payments.`}
              />
            ) : (
              <Markdown
                text={i`As you conduct business in ${currencyCodeAndSymbol}, 
                  please note that Paypal is the only payment provider 
                  for receiving payments in ${currencyCodeAndSymbol}`}
              />
            )}
          </span>
          <span className={css(styles.spanBullet)}>
            Please note that once the update is completed, you will not be able
            to switch your store’s Local Currency Code back to USD ($).
          </span>
          <span className={css(styles.spanBullet)}>
            <Markdown
              text={
                i`For additional help, please reach out to ` +
                i`${merchantSupport}.`
              }
            />
          </span>
        </Accordion>
      )}
      <Link href="/documentation/api/v2#product" openInNewTab>
        <Accordion
          header={() => (
            <Header text={i`API Integration with Localized Currency`} />
          )}
          onOpenToggled={(isOpen) =>
            window.open("/documentation/api/v2#product", "_blank")
          }
          headerPadding="22px 13px"
          chevronSize={11}
        />
      </Link>
      {displayExtraInfo && (
        <Link href={faqLink} openInNewTab>
          <Accordion
            header={() => (
              <Header text={i`${allowedMigration} Localized Currency FAQ`} />
            )}
            onOpenToggled={(isOpen) => window.open("/product", "_blank")}
            headerPadding="22px 13px"
            chevronSize={11}
          />
        </Link>
      )}
    </Card>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 4,
        },
        headerText: {
          color: palettes.textColors.Ink,
          fontSize: 14,
        },
        bullets: {
          marginTop: 20,
        },
        bullet: {
          marginLeft: 16,
          marginBottom: 12,
        },
        firstSpanBullet: {
          marginLeft: 24,
          marginBottom: 12,
          marginTop: 20,
        },
        spanBullet: {
          marginLeft: 24,
          marginBottom: 12,
        },
        panelCard: {
          marginLeft: 20,
          fontSize: 14,
          maxWidth: 500,
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.DarkInk,
        },
      }),
    []
  );
