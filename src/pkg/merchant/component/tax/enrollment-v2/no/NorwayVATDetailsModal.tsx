/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Markdown } from "@ContextLogic/lego";
import { MultilineAlert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* SVGs */
import cheeringIllustration from "@assets/img/illustration-cheering-international-crowd.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps;

const NorwayVATDetailsModalContent = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Markdown
        className={css(styles.topText)}
        text={
          i`Wish will calculate, collect, and remit VAT on orders ` +
          i`where the customer-paid price per item is  ` +
          i`**less than ${formatCurrency(
            3000,
            "NOK",
          )}** (excluding all other customer ` +
          i`payments such as shipping, insurance, and taxes).`
        }
      />
      <MultilineAlert
        className={css(styles.alert)}
        lines={[
          i`If the customer-paid price for an item is greater than or ` +
            i`equal to ${formatCurrency(
              3000,
              "NOK",
            )}, the customer will be deemed as the importer ` +
            i` of record and be responsible for remitting import VAT at the ` +
            i`Norwegian border. `,
          i`For tax calculation purposes, the value ` +
            i`of the item is determined at the point of sales and excludes all ` +
            i`other customer payments such as shipping, insurance, and taxes.`,
        ]}
        sentiment="info"
      />
      <img
        className={css(styles.cheeringIllustration)}
        src={cheeringIllustration}
      />
    </div>
  );
};

export default class NorwayVATDetailsModal extends Modal {
  constructor() {
    super(() => null);

    this.setHeader({
      title: i`Norway`,
    });

    this.setWidthPercentage(0.5);
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return <NorwayVATDetailsModalContent />;
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 36px 0px 36px",
        },
        topText: {
          padding: "12px 10px",
        },
        alert: {
          paddingVertical: 12,
        },
        cheeringIllustration: {
          marginTop: 20,
          objectFit: "cover",
          objectPosition: "0px 100%",
        },
        line: {
          margin: 0,
          marginBottom: 24,
          padding: 0,
        },
      }),
    [],
  );
};
