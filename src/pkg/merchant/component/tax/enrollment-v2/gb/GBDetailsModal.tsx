/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Alert, Markdown } from "@ContextLogic/lego";

export type Props = BaseProps;

const GBDetailsModalContent = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Beginning on **January 1, 2021**, Wish generally collects and ` +
          i`remits taxes on your behalf. In other words, Wish will ` +
          i`calculate, collect, and remit VAT on all orders bound for ` +
          i`United Kingdom.`
        }
      />
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`All merchants selling into United Kingdom are required to provide ` +
          i`the ship-from locations before January 1, 2021. Failure to do so ` +
          i`will result in the VAT amount based on the standard tax rate ` +
          i`(${20}%) being collected and remitted on your behalf.`
        }
      />
      <Markdown
        className={css(styles.paragraph)}
        text={i`**Standard tax rate:** ${20}%`}
      />
      <Alert
        className={css(styles.alert)}
        sentiment="info"
        text={() => (
          <div className={css(styles.tip)}>
            <div className={css(styles.tipText, styles.tipHeader)}>
              For merchants who declare that their ship-from location for Great
              Britain-bound orders is outside of the United Kingdom (including
              Northern Ireland):
            </div>
            <div className={css(styles.tipText)}>1.</div>
            <div className={css(styles.tipText)}>
              If the customer-paid price of the consignment is less than or
              equal to £{135.01} (excluding all other customer payments such as
              shipping, insurance, and taxes), Wish will calculate, collect, and
              remit VAT on your behalf.
            </div>
            <div className={css(styles.tipText)}>2.</div>
            <div className={css(styles.tipText)}>
              If the customer-paid price of the consignment is £{135.01} or more
              (excluding all other customer payments such as shipping,
              insurance, and taxes), the customer will be deemed as the importer
              of record and be responsible for remitting import VAT at Great
              Britain's border. Wish may, in some cases, collect VAT and
              facilitate this process directly with the shipping carrier so that
              the customer does not need to pay import VAT at the border.
            </div>
          </div>
        )}
      />
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`For merchants domiciled in the United Kingdom, please set up ` +
          i`your Tax Settings for United Kingdom by January 1, 2021. Once ` +
          i`your settings are reviewed and approved, Wish will still ` +
          i`calculate and collect VAT on relevant orders, but the VAT ` +
          i`amount will be remitted to merchants instead of being remitted ` +
          i`directly to the tax authority by Wish. Failure to complete Tax ` +
          i`Settings for United Kingdom will result in the VAT amount based ` +
          i`on the standard tax rate (${20}%) being collected and remitted ` +
          i`on your behalf.`
        }
      />
    </div>
  );
};

export default class GBDetailsModal extends Modal {
  constructor() {
    super(() => null);

    this.setHeader({
      title: i`United Kingdom`,
    });

    this.setWidthPercentage(0.5);
    this.setMaxHeight(800);
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return <GBDetailsModalContent />;
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "48px 40px 56px 40px",
        },
        paragraph: {
          fontSize: 16,
          lineHeight: 1.5,
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        alert: {
          marginBottom: 24,
        },
        tip: {
          display: "grid",
          gridTemplateColumns: "12px auto",
          rowGap: 8,
          columnGap: "8px",
        },
        tipText: {
          fontSize: 14,
          lineHeight: "20px",
        },
        tipHeader: {
          gridColumn: "1 / 3",
        },
      }),
    []
  );
};
