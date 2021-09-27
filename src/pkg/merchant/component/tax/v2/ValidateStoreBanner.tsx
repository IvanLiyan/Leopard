import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ValidateStoreBannerProps = BaseProps & {
  readonly verificationRequired: boolean;
};

const ValidateStoreBanner: React.FC<ValidateStoreBannerProps> = ({
  className,
  style,
  verificationRequired,
}: ValidateStoreBannerProps) => {
  const styles = useStylesheet();

  return (
    <Banner
      className={css(className, style)}
      sentiment="warning"
      text={
        <div className={css(styles.bannerTextContainer)}>
          {verificationRequired ? (
            <>
              <div
                className={css(styles.bannerText)}
                style={{ fontWeight: fonts.weightBold }}
              >
                Validate your store to gain access to Tax Settings
              </div>
              <div className={css(styles.bannerText)}>
                We need a few more details from you to validate your store's
                ownership and help your business correctly set up and report
                taxes.
              </div>
              <Button
                href="/seller-profile-verification"
                style={{ marginTop: 12 }}
              >
                Validate my store
              </Button>
            </>
          ) : (
            <>
              <div
                className={css(styles.bannerText)}
                style={{ fontWeight: fonts.weightBold }}
              >
                Provide your country/region of domicile to gain access to Tax
                Settings
              </div>
              <div className={css(styles.bannerText)}>
                We need a few more details from you to help your business
                correctly set up and report taxes.
              </div>
              <Button href="/kyc-verification" style={{ marginTop: 12 }}>
                Continue
              </Button>
            </>
          )}
        </div>
      }
      showTopBorder
      contentAlignment="left"
    />
  );
};

export default observer(ValidateStoreBanner);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        bannerTextContainer: {
          display: "flex",
          textAlign: "left",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        bannerText: {
          marginBottom: 4,
          color: textBlack,
        },
      }),
    [textBlack]
  );
};
