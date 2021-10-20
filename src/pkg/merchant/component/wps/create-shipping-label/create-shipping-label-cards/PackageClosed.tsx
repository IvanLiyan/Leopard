/*
 * PackageClosed.tsx
 *
 * Created by Jonah Dlin on Mon Feb 08 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import {
  WeightUnitNames,
  LengthUnitNames,
  roundPackageDimension,
} from "@toolkit/wps/create-shipping-label";

/* Merchant Components */
import Separator from "@merchant/component/wps/create-shipping-label/Separator";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShipFromClosed: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  const { packageState } = state;

  const {
    packageType,
    weight,
    width,
    height,
    length,
    applyToAllVariations,
    weightUnit,
    lengthUnit,
  } = packageState;

  const dimensionString = useMemo(() => {
    if (
      width == null ||
      height == null ||
      length == null ||
      packageType === "LARGE_ENVELOPE"
    ) {
      return null;
    }

    const unit = LengthUnitNames[lengthUnit];
    return `${roundPackageDimension(width)}${unit} x ${roundPackageDimension(
      height,
    )}${unit} x ${roundPackageDimension(length)}${unit}`;
  }, [lengthUnit, width, height, length, packageType]);

  if (weight == null) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.dimensions)}>
        <Text className={css(styles.text)} weight="semibold">
          Weight
        </Text>
        <Text className={css(styles.text)}>{`${roundPackageDimension(weight)}${
          WeightUnitNames[weightUnit]
        }`}</Text>
        {dimensionString && (
          <>
            <Text className={css(styles.text)} weight="semibold">
              Dimensions
            </Text>
            <Text className={css(styles.text)}>{dimensionString}</Text>
          </>
        )}
      </div>
      {applyToAllVariations && (
        <>
          <Separator className={css(styles.separator)} />
          <Text className={css(styles.text)}>
            Your package weight and dimension is applied to all the variations
            of this product
          </Text>
        </>
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        dimensions: {
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          columnGap: "80px",
          rowGap: 8,
        },
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        separator: {
          margin: "16px 0px",
        },
      }),
    [textDark],
  );
};

export default observer(ShipFromClosed);
