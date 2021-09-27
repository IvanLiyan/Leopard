import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observable } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Button, Link, Layout, Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly isEuDomicileOrValidated?: boolean | undefined;
};

const EuVATDetailsModalContent = (props: Props) => {
  const { className, style, isEuDomicileOrValidated } = props;
  const styles = useStylesheet();

  const formattedPrice = formatCurrency(150, "EUR");

  const notValidatedMessage = (
    <Layout.FlexColumn>
      <Markdown
        className={css(styles.text)}
        text={
          i`Wish will calculate, collect, and remit VAT on orders shipped from outside ` +
          i`of the European Union (EU) where the customer-paid price per consignment ` +
          i`is **less than or equal to ${formattedPrice}** via Wish’s IOSS. Wish will ` +
          i`also calculate, collect, and remit VAT on orders shipped within the EU ` +
          i`(i.e., from and to the EU) regardless of the customer-paid price per ` +
          i`consignment via Wish’s OSS.`
        }
      />
      <Markdown
        className={css(styles.text)}
        text={
          i`If the customer-paid price for a consignment shipped from outside of the ` +
          i`EU is **greater than ${formattedPrice}**, Wish will consider you (the ` +
          i`merchant) to be the importer of record whereby Wish will calculate and ` +
          i`collect VAT and remit it to you who will be responsible for remitting VAT ` +
          i`at the border.`
        }
      />
      <Markdown
        className={css(styles.text)}
        text={
          i`For the determination of the ${formattedPrice} threshold, the customer-paid ` +
          i`price of the consignment is considered excluding the customer ` +
          i`payments such as shipping and taxes. For tax calculation however, the VAT ` +
          i`amount will be calculated on the total customer-paid price including ` +
          i`shipping.`
        }
      />
      <Link
        className={css(styles.text)}
        href={zendeskURL("4402351430043")}
        openInNewTab
      >
        Learn more
      </Link>
    </Layout.FlexColumn>
  );

  const validatedMessage = (
    <Layout.FlexColumn>
      <Markdown
        className={css(styles.text)}
        text={
          i`Wish will calculate, collect, and remit VAT on orders shipped from outside ` +
          i`of the European Union (EU) where the customer-paid price per consignment ` +
          i`is **less than or equal to ${formattedPrice}**. However, Wish will ` +
          i`calculate and collect VAT on orders shipped from within the EU regardless ` +
          i`of the price only if you (the merchant) activate Tax Settings for the EU ` +
          i`countries to which the goods are shipped. You will still be responsible ` +
          i`for remitting collected VAT for EU countries that are activated through ` +
          i`the Tax Settings.`
        }
      />
      <Markdown
        className={css(styles.text)}
        text={
          i`If the customer-paid price for a consignment shipped from outside of the ` +
          i`EU is **greater than ${formattedPrice}**, Wish will consider ` +
          i`you (the merchant) to be the importer of record whereby Wish will ` +
          i`calculate and collect VAT and remit it to you who will be responsible for ` +
          i`remitting VAT at the border.`
        }
      />
      <Markdown
        className={css(styles.text)}
        text={
          i`For the determination of the ${formattedPrice} threshold, the ` +
          i`customer-paid price of the consignment is considered excluding the ` +
          i`customer payments such as shipping and taxes. For tax calculation ` +
          i`however, the VAT will be calculated on the total customer-paid price ` +
          i`including shipping.`
        }
      />
      <Link
        className={css(styles.text)}
        href={zendeskURL("4402351430043")}
        openInNewTab
      >
        Learn more
      </Link>
    </Layout.FlexColumn>
  );
  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      {isEuDomicileOrValidated ? validatedMessage : notValidatedMessage}
      <Illustration
        className={css(styles.cheeringEu)}
        name="cheeringEu"
        alt={i`Cheering EU Illustration`}
      />
    </Layout.FlexColumn>
  );
};

export default class EuVATDetailsModal extends Modal {
  props: Props;

  @observable
  isEuDomicileOrValidated: boolean | undefined;

  constructor(props: Props) {
    super(() => null);
    this.isEuDomicileOrValidated = props.isEuDomicileOrValidated;

    this.setHeader({
      title: this.isEuDomicileOrValidated
        ? i`European Union`
        : i`European Union - MPF`,
    });

    this.setWidthPercentage(0.5);

    this.setRenderFooter(() => (
      <Layout.FlexColumn>
        <Button
          onClick={() => this.closeModal()}
          disabled={false}
          style={{ padding: "7px 15px" }}
        >
          Close
        </Button>
      </Layout.FlexColumn>
    ));

    this.props = props;
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return (
      <EuVATDetailsModalContent
        isEuDomicileOrValidated={this.isEuDomicileOrValidated}
      />
    );
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "24px 36px 0px 36px",
        },
        text: {
          padding: "12px 10px",
        },
        cheeringEu: {
          marginTop: 20,
          objectFit: "cover",
          objectPosition: "0px 100%",
        },
      }),
    []
  );
};
