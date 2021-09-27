import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HeroBanner } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import * as banners from "./banners";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { ThemeWrapper, useTheme } from "@merchant/stores/ThemeStore";

export type HomeBannerProps = BaseProps;

const HomeBanner = (props: HomeBannerProps) => {
  const { className, style } = props;
  const styles = useStylesheet(props);
  const { bannerStore, dimenStore } = useStore();

  useEffect(() => {
    bannerStore.fetchBannerItems();
  }, [bannerStore]);

  if (!bannerStore.bannerItemsLoaded) {
    return (
      <div className={css(styles.loadingIndicator)}>
        <LoadingIndicator />
      </div>
    );
  }

  const contentMarginX = dimenStore.screenInnerWidth < 1450 ? 50 : 310;

  return (
    <ThemeWrapper>
      <HeroBanner
        className={css(styles.root, className, style)}
        contentMarginX={contentMarginX}
        autoScrollIntervalSecs={10}
      >
        {bannerStore.bannerItems.map((item, idx) => {
          const BannerComponent = banners[item.component];
          const { componentProps, id, shouldShow, component, ...itemProps } =
            item;
          return (
            <HeroBanner.Item key={id} id={id} {...itemProps}>
              <BannerComponent {...componentProps} />
            </HeroBanner.Item>
          );
        })}
      </HeroBanner>
    </ThemeWrapper>
  );
};

export default observer(HomeBanner);

const useStylesheet = (props: HomeBannerProps) => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "100%",
        },
        loadingIndicator: {
          height: 233,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: textWhite,
        },
      }),
    [textWhite],
  );
};
