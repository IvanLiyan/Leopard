import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Button } from "@ContextLogic/lego";

import HomePageCard from "./HomePageCard";
import { useUIStateBool } from "@toolkit/ui-state";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";

import WishExpressIntroductionModal from "@plus/component/wish-express/introduction/WishExpressIntroductionModal";
import { useLogger } from "@toolkit/logger";

type Props = BaseProps & {};

const WishExpressIntroCard: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  const {
    value: hideBanner,
    isLoading,
    update: setDismissBanner,
  } = useUIStateBool("DISMISSED_WISH_EXPRESS_INTRO_BANNER");
  const actionLogger = useLogger("PLUS_WISH_EXPRESS_UI");

  if (isLoading || hideBanner) {
    return null;
  }

  return (
    <HomePageCard
      className={css(style, className)}
      title={i`Wish Express`}
      description={
        i`Offer fast shipping to customers and receive more ` +
        i`exposure on Wish with the new Wish Express shipping feature.`
      }
      illustration="wishExpressTruckSideways"
    >
      <div className={css(styles.buttonsContainer)}>
        <Button onClick={() => new WishExpressIntroductionModal({}).render()}>
          Learn More
        </Button>
        <div
          onClick={async () => {
            actionLogger.info({
              action: "CLICK_LEARN_MORE_PRODUCTS_PAGE",
            });
            await setDismissBanner(true);
          }}
          className={css(styles.dismiss)}
        >
          Dismiss
        </div>
      </div>
    </HomePageCard>
  );
};

export default observer(WishExpressIntroCard);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        buttonsContainer: {
          display: "flex",
          flexDirection: "column",
        },
        dismiss: {
          alignSelf: "center",
          margin: "10px 0px",
          fontSize: 16,
          color: textDark,
          cursor: "pointer",
        },
      }),
    [textDark],
  );
};
