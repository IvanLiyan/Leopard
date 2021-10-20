import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Type Imports */
import { RestrictedProductRegionCode } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import EuropeCountriesModal from "@merchant/component/policy/restricted-product/EuropeCountriesModal";

type RegionCountriesTooltipProps = BaseProps & {
  readonly regionCode?: RestrictedProductRegionCode | null;
};

const RegionCountriesTooltip = ({
  regionCode,
}: RegionCountriesTooltipProps) => {
  const styles = useStylesheet();
  const { surfaceLight, textLight } = useTheme();

  return (
    <div>
      {regionCode == "NA" && (
        <div className={css(styles.root)}>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="CA" className={css(styles.flag)} />
                {i`Canada`}
              </Label>
            </div>
          </div>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="US" className={css(styles.flag)} />
                {i`United States`}
              </Label>
            </div>
          </div>
        </div>
      )}
      {regionCode == "LA" && (
        <div className={css(styles.root)}>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="AR" className={css(styles.flag)} />
                {i`Argentina`}
              </Label>
            </div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="BR" className={css(styles.flag)} />
                {i`Brazil`}
              </Label>
            </div>
          </div>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="CO" className={css(styles.flag)} />
                {i`Colombia`}
              </Label>
            </div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="MX" className={css(styles.flag)} />
                {i`Mexico`}
              </Label>
            </div>
          </div>
        </div>
      )}
      {regionCode == "EU" && (
        <div className={css(styles.root)}>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="FR" className={css(styles.flag)} />
                {i`France`}
              </Label>
            </div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="DE" className={css(styles.flag)} />
                {i`Germany`}
              </Label>
            </div>
          </div>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="IT" className={css(styles.flag)} />
                {i`Italy`}
              </Label>
            </div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="ES" className={css(styles.flag)} />
                {i`Spain`}
              </Label>
            </div>
          </div>
          <div>
            <div className={css(styles.section)}>
              <Label textColor={textLight} backgroundColor={surfaceLight}>
                <Flag countryCode="GB" className={css(styles.flag)} />
                {i`United Kingdom`}
              </Label>
            </div>
            <div className={css(styles.section)}>
              <div
                onClick={() => {
                  new EuropeCountriesModal({}).render();
                }}
                className={css(styles.text)}
              >
                +24 more
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionCountriesTooltip;

const useStylesheet = () => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingLeft: 8,
          paddingBottom: 8,
        },
        section: {
          display: "inline-block",
          padding: "8px 8px 0px 0px",
        },
        flag: {
          width: 25,
          height: 15,
          margin: "8px 8px 8px 0px",
        },
        text: {
          padding: 4,
          fontSize: 12,
          color: primary,
          cursor: "pointer",
        },
      }),
    [primary],
  );
};
