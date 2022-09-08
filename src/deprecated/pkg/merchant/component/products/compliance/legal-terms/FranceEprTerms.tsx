import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps;

const FranceEprTerms = (props: Props) => {
  const { style, className } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Text weight="semibold" className={css(styles.agreement)}>
        As a merchant selling to France consumers, I declare the following:
      </Text>
      {/* eslint-disable local-rules/unnecessary-list-usage */}
      <ol className={css(styles.row, styles.ol)}>
        <li className={css(styles.li)}>
          For each product and product category covered by the scope of
          applicable local Extended Producer Responsibility (EPR) obligations:
        </li>
        <ol className={css(styles.olCustom)}>
          <li className={css(styles.li)}>
            The EPR registration number(s) shall be provided to my buyer(s) upon
            request, and displayed on my website (if any) and/or product listing
            page(s), or any accompanying and required documentation;
          </li>
          <li className={css(styles.li)}>
            The Producer Responsibility Organisation (aka eco-organizations or
            Producer Compliance Schemes (PCS)) and, as the case may be, the
            French administrative authority, shall have access to, or maintain,
            a record of any legally required information and/or documentation,
            including any needed applicable Declaration(s) of Conformity (or
            Declaration(s) of Performance) and/or technical documents of the
            relevant products and/or their packaging, as well as descriptions,
            specifications, and weights of the relevant products/packaging in
            the required unit(s) of measurement(s); and
          </li>
          <li className={css(styles.li)}>
            The Producer Responsibility Organisation I have appointed and
            subscribed to will undertake any and all necessary obligations
            required under applicable local EPR schemes and related laws and
            regulations, including but not limited to, (a) retaining adequate
            copies of the above-mentioned files in a language easily understood
            by relevant authorities; (b) registering my products and/or their
            packaging; (c) collecting requisite data; (d) reporting quantities
            of in-scope products and packaging placed on the relevant market(s)
            to appropriate environmental agencies or regulators; (e) paying any
            associated duty/levy fees; as well as (f) assisting with the
            discharge of any required collection, take-back, and/or recycling
            obligations over the same.
          </li>
        </ol>
        <li className={css(styles.li)}>
          I will notify Wish of any material changes to either my Producer
          Responsibility Organisation (PRO)/Eco-Organization identification, EPR
          Registration Number(s), or in-scope and eligible EPR products, EPR
          product categories, and/or packaging placed on the relevant market.
        </li>
        <li className={css(styles.li)}>
          To the best of my belief, knowledge, and understanding, all the
          information I have submitted on this form (and in the accompanying
          Merchant Dashboard regarding EPR obligations) is true and correct, and
          I am aware that providing false information could result in the
          closure of my Wish merchant account, in addition to potentially
          additional consequences punishable by law or regulation by national or
          local regulators or law enforcement agencies, such as fines and/or
          debarment from conducting e-commerce transactions online.
        </li>
      </ol>
      {/* eslint-enable local-rules/unnecessary-list-usage */}
    </Layout.FlexColumn>
  );
};

export default observer(FranceEprTerms);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        agreement: {
          marginBottom: 16,
        },
        row: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        ol: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        olCustom: {
          counterReset: "item",
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        li: {
          counterIncrement: "item",
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
      }),
    [textBlack]
  );
};
