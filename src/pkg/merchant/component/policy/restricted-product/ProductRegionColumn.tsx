import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Flag, Popover } from "@merchant/component/core";

/* Merchant Components */
import { CountryAndRegionType } from "@merchant/component/policy/restricted-product/RestrictedProduct";
import RegionCountriesTooltip from "@merchant/component/policy/restricted-product/RegionCountriesTooltip";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RestrictedProductRequestState } from "@schema/types";

type ProductRegionColumnProps = BaseProps & {
  readonly countryAndRegion: CountryAndRegionType;
  readonly state: RestrictedProductRequestState | null;
};

const ProductRegionColumn = ({
  countryAndRegion,
  state,
}: ProductRegionColumnProps) => {
  const styles = useStylesheet();
  const { surfaceLight, textBlack } = useTheme();

  if (!state) {
    return <div></div>;
  }

  if (state != "APPROVED") {
    return <div>--</div>;
  }

  const text: String = countryAndRegion.regionName;

  return (
    <div>
      {!countryAndRegion.isACountry ? (
        <Popover
          popoverContent={() => (
            <RegionCountriesTooltip regionCode={countryAndRegion.regionCode} />
          )}
          position="top left"
          contentWidth={400}
        >
          <Label
            width={80}
            textColor={textBlack}
            backgroundColor={surfaceLight}
          >
            <div className={css(styles.region)}>{text}</div>
          </Label>
        </Popover>
      ) : (
        <Label width={80} textColor={textBlack} backgroundColor={surfaceLight}>
          <Flag
            countryCode={countryAndRegion.regionCode}
            className={css(styles.flag)}
          />
          {text}
        </Label>
      )}
    </div>
  );
};

export default ProductRegionColumn;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        region: {
          margin: 8,
        },
        flag: {
          width: 25,
          height: 15,
          margin: "8px 8px 8px 0px",
        },
      }),
    []
  );
};
