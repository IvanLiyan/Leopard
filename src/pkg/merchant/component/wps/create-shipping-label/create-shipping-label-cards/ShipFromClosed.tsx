/*
 * ShipFromClosed.tsx
 *
 * Created by Jonah Dlin on Wed Feb 03 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { getCountryName } from "@toolkit/countries";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShipFromClosed: React.FC<Props> = ({
  className,
  style,
  state: { submittedWarehouse },
}: Props) => {
  const styles = useStylesheet();

  const { line1, line2, line3 } = useMemo(() => {
    if (submittedWarehouse == null) {
      return { line1: null, line2: null, line3: "" };
    }
    const {
      address: {
        countryCode,
        streetAddress1,
        streetAddress2,
        city,
        state: addressState,
        zipcode,
      },
    } = submittedWarehouse;

    const line1 =
      [
        ...(streetAddress1 != null ? [streetAddress1] : []),
        ...(streetAddress2 != null ? [streetAddress2] : []),
      ].join(", ") || null;

    const line2 =
      [
        ...(city != null ? [city] : []),
        ...(addressState != null ? [addressState] : []),
        ...(zipcode != null ? [zipcode] : []),
      ].join(", ") || null;

    const line3 = getCountryName(countryCode);
    return { line1, line2, line3 };
  }, [submittedWarehouse]);

  if (submittedWarehouse == null) {
    return null;
  }

  return (
    <Layout.FlexColumn className={css(className, style)}>
      {line1 != null && <Text className={css(styles.text)}>{line1},</Text>}
      {line2 != null && <Text className={css(styles.text)}>{line2}</Text>}
      <Text className={css(styles.text)}>{line3}</Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
      }),
    [textDark]
  );
};

export default observer(ShipFromClosed);
