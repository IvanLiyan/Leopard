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

const AddResponsiblePersonTerms = (props: Props) => {
  const { style, className } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Text weight="semibold" className={css(styles.agreement)}>
        As a merchant selling to EU and Northern Ireland consumers, I declare:
      </Text>
      {/* eslint-disable local-rules/unnecessary-list-usage */}
      <ol className={css(styles.row, styles.ol)}>
        <li className={css(styles.li)}>
          For each product and product category covered by each nominated
          Responsible Person:
        </li>
        <ol type="a" className={css(styles.olCustom, styles.section2)}>
          <li className={css(styles.li)}>
            The Responsible Person's name, registered trade name, or registered
            trademark and contact details, including the postal address, shall
            be on each product(s) or on its packaging, the parcel, or any
            accompanying and required documentation;
          </li>
          <li className={css(styles.li)}>
            The Responsible Person shall have access to, or maintain, a record
            of any legally required information and/or documentation, including
            applicable Declaration(s) of Conformity (or Declaration(s) of
            Performance) and technical documents to demonstrate conformity of
            the relevant products; and
          </li>
          <li className={css(styles.li)}>
            The Responsible Person agrees to undertake all necessary obligations
            required under applicable laws and regulations, including but not
            limited to:
          </li>
          <ol type="i" className={css(styles.olCustom, styles.section3)}>
            <li className={css(styles.li)}>
              retaining adequate copies of the above-mentioned files in a
              language easily understood by relevant market surveillance
              authorities;
            </li>
            <li className={css(styles.li)}>
              cooperating with market surveillance authorities upon any requests
              for information;
            </li>
            <li className={css(styles.li)}>
              informing market surveillance authorities of any reportable risks
              related to their relevant product(s); and/or
            </li>
            <li className={css(styles.li)}>
              undertaking any necessary remedial or corrective measures should
              their product(s) be non-conforming.
            </li>
          </ol>
        </ol>
        <li className={css(styles.li)}>
          I will notify Wish of any material changes to the Responsible Person
        </li>
        <li className={css(styles.li)}>
          To the best of my belief and understanding, all the information I have
          submitted on this form is true and correct, and I am aware that
          providing false information could result in the closure of my account,
          in addition to potentially additional consequences punishable by law
          or regulation, such as fines and/or debarment from conducting
          e-commerce transactions online.
        </li>
      </ol>
      {/* eslint-enable local-rules/unnecessary-list-usage */}
    </Layout.FlexColumn>
  );
};

export default observer(AddResponsiblePersonTerms);

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
          listStyle: "none",
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
        section2: {
          ":nth-child(1n) > li": {
            ":before": {
              content: "'(' counter(item, lower-latin) ') '",
            },
          },
        },
        section3: {
          ":nth-child(1n) > li": {
            ":before": {
              content: "'(' counter(item, lower-roman) ') '",
            },
          },
        },
      }),
    [textBlack],
  );
};
