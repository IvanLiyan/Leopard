import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Link, StaggeredFadeIn, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import MerchantAppTable from "@merchant/component/external/merchant-apps/store/MerchantAppTable";

const MerchantAppStoreContainer = () => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <StaggeredFadeIn animationDurationMs={800}>
        <div className={css(styles.header)}>
          <WelcomeHeader
            title={() => (
              <Text weight="bold" className={css(styles.title)}>
                Wish App Store
              </Text>
            )}
            body={() => (
              <div className={css(styles.headerWrapper)}>
                <Text weight="regular" className={css(styles.description)}>
                  Level up your merchant experience by finding apps that help
                  you better manage your store.
                </Text>
                <div className={css(styles.promotionWrapper)}>
                  <div className={css(styles.promotionText)}>
                    Spot an opportunity?
                  </div>
                  <Link
                    openInNewTab
                    href="/partner-developer"
                    className={css(styles.promotionAction)}
                  >
                    Develop an app for Wish.
                  </Link>
                </div>
              </div>
            )}
            paddingY={"35px"}
            hideBorder
          />
        </div>
        <MerchantAppTable />
      </StaggeredFadeIn>
    </div>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        header: {
          paddingTop: 15,
          backgroundColor: palettes.textColors.White,
        },
        title: {
          fontSize: 32,
          lineHeight: 1.25,
          color: palettes.textColors.Ink,
        },
        description: {
          fontSize: 20,
          lineHeight: 1.4,
          color: palettes.textColors.Ink,
          marginRight: 10,
        },
        headerWrapper: {
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        },
        promotionWrapper: {
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          "@media (max-width: 900px)": { marginTop: 10 },
        },
        promotionText: {
          fontSize: 14,
          marginRight: 5,
          color: palettes.textColors.Ink,
          lineHeight: 1.43,
        },
        promotionAction: {
          fontSize: 14,
        },
      }),
    []
  );

export default observer(MerchantAppStoreContainer);
