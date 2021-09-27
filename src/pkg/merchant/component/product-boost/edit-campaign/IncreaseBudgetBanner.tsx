import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightMedium } from "@toolkit/fonts";

/* SVGs */
import increaseBudgetBannerImg from "@assets/img/product-boost/seasonal-banner/covid_home_page.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type IncreaseBudgetBannerProps = BaseProps & {
  readonly title: string;
};

const IncreaseBudgetBanner = (props: IncreaseBudgetBannerProps) => {
  const { title, className, style } = props;
  const styles = useStylesheet();

  const markDownText =
    i`This campaign’s product category is experiencing high demand right now.` +
    i`To avoid running short on money, add more budget.`;

  return (
    <div className={css(styles.bannerRoot, className, style)}>
      <div className={css(styles.bannerTitleAndContent)}>
        <div className={css(styles.bannerTitle)}>{title}</div>
        <Markdown
          className={css(styles.bannerContent)}
          text={markDownText}
          openLinksInNewTab
        />
      </div>
      <img
        className={css(styles.bannerImageRight)}
        draggable={false}
        src={increaseBudgetBannerImg}
        alt="increaseBudgetBannerImg"
      />
    </div>
  );
};

export default observer(IncreaseBudgetBanner);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        bannerImageRight: {
          margin: "26px 0px 0px 30px",
        },
        bannerRoot: {
          borderRadius: 10,
          backgroundImage:
            "linear-gradient(166.65deg, #001D53 15.89%, #B296FF 88.46%)",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flexGrow: 1,
          objectFit: "contain",
        },
        bannerTitle: {
          fontSize: 26,
          fontWeight: weightBold,
          color: "white",
          lineHeight: 1,
        },
        bannerContent: {
          marginTop: 20,
          fontSize: 16,
          fontWeight: weightMedium,
          color: "white",
        },
        bannerTitleAndContent: {
          display: "flex",
          flexDirection: "column",
          flex: "1 1 min-content",
          margin: 30,
        },
      }),
    []
  );
};
