import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { formatPhoneNumber } from "@toolkit/phone-number";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ShippingDetailsSchema } from "@schema/types";

interface ShippingDetails {
  name: ShippingDetailsSchema["name"];
  streetAddress1: ShippingDetailsSchema["streetAddress1"];
  streetAddress2?: ShippingDetailsSchema["streetAddress2"];
  city: ShippingDetailsSchema["city"];
  state?: ShippingDetailsSchema["state"];
  zipcode?: ShippingDetailsSchema["zipcode"];
  countryCode: ShippingDetailsSchema["countryCode"];
  neighborhood?: ShippingDetailsSchema["neighborhood"];
  phoneNumber?: ShippingDetailsSchema["phoneNumber"];
}

export type ShippingAddressProps = BaseProps & {
  readonly shippingDetails: ShippingDetails;
  readonly customerCPF?: string | null | undefined;
  readonly disableCopy?: boolean;
};

const ShippingAddress: React.FC<ShippingAddressProps> = (
  props: ShippingAddressProps
) => {
  const { disableCopy, shippingDetails, customerCPF, className } = props;
  const styles = useStylesheet();

  const copyText: string = useMemo((): string => {
    // "as any" for now until we unify the CountryCode type from
    // `toolkit/countries.ts` with the GQL one.
    const countryName = getCountryName(shippingDetails.countryCode as any);
    return `
      ${shippingDetails.name || ""}
      ${shippingDetails.streetAddress1}
      ${shippingDetails.streetAddress2 || ""}
      ${shippingDetails.city}${
      shippingDetails.state ? `, ${shippingDetails.state}` : ""
    }
      ${shippingDetails.zipcode || ""}
      ${countryName}
      ${
        shippingDetails.neighborhood
          ? i`Neighborhood: ${shippingDetails.neighborhood}`
          : ""
      }
      ${
        shippingDetails.phoneNumber
          ? i`Phone Number: ${formatPhoneNumber(shippingDetails.phoneNumber)}`
          : ""
      }
      ${customerCPF ? i`Customer CPF: ${customerCPF}` : ""}
    `;
  }, [shippingDetails, customerCPF]);

  return (
    <CopyButton
      className={css(className)}
      text={copyText}
      copyOnBodyClick
      disabled={disableCopy}
    >
      <div className={css(styles.root)}>
        <div className={css(styles.line)}>
          <i>{shippingDetails.name}</i>
        </div>
        <div className={css(styles.line)}>{shippingDetails.streetAddress1}</div>
        {shippingDetails.streetAddress2 && (
          <div className={css(styles.line)}>
            {shippingDetails.streetAddress2}
          </div>
        )}
        <div className={css(styles.line)} />
        <div className={css(styles.line)}>
          {shippingDetails.city}
          {shippingDetails.state ? `, ${shippingDetails.state}` : ""}
          {shippingDetails.zipcode ? `, ${shippingDetails.zipcode}` : ""}
        </div>
        <div className={css(styles.line)}>{shippingDetails.countryCode}</div>
        {shippingDetails.neighborhood && (
          <div className={css(styles.line)}>
            Neighborhood: {shippingDetails.neighborhood}
          </div>
        )}
        {shippingDetails.phoneNumber && (
          <div className={css(styles.line)}>
            Phone Number: {formatPhoneNumber(shippingDetails.phoneNumber)}
          </div>
        )}
        {customerCPF && (
          <div className={css(styles.line)}>Customer CPF: {customerCPF}</div>
        )}
      </div>
    </CopyButton>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        line: {
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    []
  );

export default observer(ShippingAddress);
