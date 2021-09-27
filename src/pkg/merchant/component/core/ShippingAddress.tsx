//
//  component/ShippingAddress.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/31/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import { formatPhoneNumber } from "@toolkit/phone-number";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ShippingDetails } from "@merchant/api/orders"; // eslint-disable-line local-rules/no-merchant-import

export type ShippingAddressProps = BaseProps & {
  readonly shippingDetails: ShippingDetails;
  readonly shouldDisplayCustomerIdentityNumber?: boolean;
  readonly customerIdentityNumberName?: string | null | undefined;
  readonly customerIdentityNumber?: string | null | undefined;
  readonly disableCopy?: boolean;
};

@observer
class ShippingAddress extends Component<ShippingAddressProps> {
  static demoProps: ShippingAddressProps = {
    shippingDetails: {
      /* eslint-disable-next-line local-rules/unwrapped-i18n */
      name: "John Appleseeed",
      street_address1: "1 Sansome Street",
      street_address2: "41st Floor",
      // eslint-disable-next-line local-rules/unwrapped-i18n
      city: "San Francisco",
      state: "CA",
      zipcode: "94104",
      country: "CA",
      country_code: "CA",
      phone_number: "(555) 123-3219",
    },
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      line: {
        fontSize: 16,
        lineHeight: 1.5,
      },
    });
  }

  @computed
  get copyText() {
    const {
      shippingDetails,
      shouldDisplayCustomerIdentityNumber,
      customerIdentityNumberName,
      customerIdentityNumber,
    } = this.props;

    return `
      ${shippingDetails.name || ""}
      ${shippingDetails.street_address1}
      ${shippingDetails.street_address2 || ""}
      ${shippingDetails.city}${
      shippingDetails.state ? `, ${shippingDetails.state}` : ""
    }
      ${shippingDetails.zipcode || ""}
      ${shippingDetails.country}
      ${
        shippingDetails.neighborhood
          ? i`Neighborhood: ${shippingDetails.neighborhood}`
          : ""
      }
      ${
        shippingDetails.phone_number
          ? i`Phone Number: ${formatPhoneNumber(shippingDetails.phone_number)}`
          : ""
      }
      ${
        shouldDisplayCustomerIdentityNumber
          ? `${customerIdentityNumberName}: ${customerIdentityNumber || i`N/A`}`
          : ""
      }
    `;
  }

  render() {
    const {
      disableCopy,
      shippingDetails,
      shouldDisplayCustomerIdentityNumber,
      customerIdentityNumberName,
      customerIdentityNumber,
      className,
    } = this.props;

    return (
      <CopyButton
        className={css(className)}
        text={this.copyText}
        copyOnBodyClick
        disabled={disableCopy}
      >
        <div className={css(this.styles.root)}>
          <div className={css(this.styles.line)}>
            <i>{shippingDetails.name}</i>
          </div>
          <div className={css(this.styles.line)}>
            {shippingDetails.street_address1}
          </div>
          {shippingDetails.street_address2 && (
            <div className={css(this.styles.line)}>
              {shippingDetails.street_address2}
            </div>
          )}
          <div className={css(this.styles.line)} />
          <div className={css(this.styles.line)}>
            {shippingDetails.city}
            {shippingDetails.state ? `, ${shippingDetails.state}` : ""}
            {shippingDetails.zipcode ? `, ${shippingDetails.zipcode}` : ""}
          </div>
          <div className={css(this.styles.line)}>{shippingDetails.country}</div>
          {shippingDetails.neighborhood && (
            <div className={css(this.styles.line)}>
              Neighborhood: {shippingDetails.neighborhood}
            </div>
          )}
          {shippingDetails.phone_number && (
            <div className={css(this.styles.line)}>
              Phone Number: {formatPhoneNumber(shippingDetails.phone_number)}
            </div>
          )}
          {shouldDisplayCustomerIdentityNumber && (
            <div className={css(this.styles.line)}>
              {customerIdentityNumberName}: {customerIdentityNumber || i`N/A`}
            </div>
          )}
        </div>
      </CopyButton>
    );
  }
}

export default ShippingAddress;
