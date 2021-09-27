import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { H7Markdown } from "@ContextLogic/lego";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const SellOnWishBanner: React.FC<BaseProps> = (props: BaseProps) => {
  const styles = useStylesheet();

  const faqLink =
    "https://localfaq.wish.com/hc/en-us/categories/360003081833-Sell-on-Wish";
  return (
    <BaseHomeBanner
      {...props}
      title={i`Sell on Wish today for free`}
      body={
        <H7Markdown
          className={css(styles.body)}
          text={
            i`Use CSV uploads to upload multiple products and reach thousands ` +
            i`of customers. Find out more [here](${faqLink})`
          }
        />
      }
      illustration="uploadProductIcon"
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 18,
        },
      }),
    []
  );
};

export default observer(SellOnWishBanner);
