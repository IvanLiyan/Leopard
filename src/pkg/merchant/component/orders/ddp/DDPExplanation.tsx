/*eslint-disable local-rules/unnecessary-list-usage*/

import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type DDPExplanationProps = {
  readonly pcVatRequired: boolean;
} & BaseProps;

@observer
class DDPExplanation extends Component<DDPExplanationProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        fontFamily: fonts.proxima,
        fontSize: 12,
        lineHeight: 1.33,
      },
      listItem: {
        fontFamily: fonts.proxima,
        fontSize: 12,
        lineHeight: 1.33,
      },
    });
  }

  @computed
  get title() {
    return (
      <>
        <strong>Pay Customer VAT "PC-VAT" required</strong>
      </>
    );
  }

  @computed
  get body() {
    const { pcVatRequired = false } = this.props;
    return (
      <>
        {pcVatRequired ? (
          <p>
            This order is required to utilize one of the Confirmed Delivery
            Shipping Carriers for UK-bound orders that provides Delivered At
            Place Plus (DAP+) service or one of the WishPost logistics channels
            that offer support to pay Value Added Tax (VAT) on behalf of
            customers, who will remain the importers of record:
          </p>
        ) : (
          <p>
            This order bound for the European Union (EU) is required to utilize
            one of the following acceptable shipping carriers or one of the
            WishPost logistics channels that provides Delivered Duty Paid (DDP)
            service and offers support to pay Value Added Tax (VAT) on behalf of
            customers. The merchant should remain the importer of records:
          </p>
        )}
        <ol>
          <li className={css(this.styles.listItem)}>
            <div>For non-WishPost merchants:</div>
            {pcVatRequired ? (
              <ul>
                <li className={css(this.styles.listItem)}>
                  Please utilize one of the Confirmed Delivery Shipping Carriers
                  for UK-bound orders that provides Delivered at Place Plus
                  (DAP+).
                </li>
              </ul>
            ) : (
              <ul>
                <li className={css(this.styles.listItem)}>
                  <Link href={zendeskURL("360034845594")}>
                    A list of acceptable shipping carriers that ship to the EU
                    and provide DDP service
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {pcVatRequired ? (
            <li className={css(this.styles.listItem)}>
              <div>For WishPost merchants:</div>
              <ul>
                <li className={css(this.styles.listItem)}>
                  EQ-Express Parcel GC
                </li>
                <li className={css(this.styles.listItem)}>
                  EQ-Express Parcel SC
                </li>
                <li className={css(this.styles.listItem)}>
                  CNE-Standard Express
                </li>
                <li className={css(this.styles.listItem)}>
                  CNE-Economy Express
                </li>
                <li className={css(this.styles.listItem)}>
                  CNE–Priority Express
                </li>
                <li className={css(this.styles.listItem)}>
                  CNE–Standard Express-B EU
                </li>
              </ul>
            </li>
          ) : (
            <li className={css(this.styles.listItem)}>
              <div>For WishPost merchants:</div>
              <ul>
                <li className={css(this.styles.listItem)}>
                  Sunyou European Express Parcel
                </li>
                <li className={css(this.styles.listItem)}>
                  EQ-Express Parcel-HV-GC
                </li>
                <li className={css(this.styles.listItem)}>
                  EQ-Expressparcel-HV-SC
                </li>
              </ul>
            </li>
          )}
        </ol>
        {pcVatRequired ? (
          <p>
            The VAT amount collected from the customer will be remitted to the
            merchant when the merchant receives payment for this order (VAT
            amount will subsequently be forwarded to the freight forwarder).
          </p>
        ) : (
          <p>
            The VAT amount collected from customers will be remitted to the
            merchant when the merchant receives payment for this order (VAT
            amount will subsequently be forwarded to the freight forwarder).
          </p>
        )}
      </>
    );
  }

  render() {
    const { className, style } = this.props;

    return (
      <div className={css(this.styles.root, className, style)}>
        {this.title}
        {this.body}
        <Link href={zendeskURL("360034845594")} openInNewTab>
          Learn more
        </Link>
      </div>
    );
  }
}
export default DDPExplanation;
