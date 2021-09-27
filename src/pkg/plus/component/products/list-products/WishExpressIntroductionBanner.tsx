import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { Card, H4 } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import WishExpressIntroductionModal from "@plus/component/wish-express/introduction/WishExpressIntroductionModal";
import { useUIStateBool } from "@toolkit/ui-state";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useLogger } from "@toolkit/logger";

type Props = BaseProps & {};

const WishExpressIntroductionBanner: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
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
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <div className={css(styles.content)}>
        <H4 className={css(styles.title)}>Wish Express</H4>
        <div className={css(styles.description)}>
          Offer fast shipping to customers and gain more exposure on Wish with
          the new Wish Express shipping feature
        </div>
        <div className={css(styles.buttonContainer)}>
          <Button onClick={() => new WishExpressIntroductionModal({}).render()}>
            Learn more
          </Button>
          <div
            onClick={async () => {
              actionLogger.info({
                action: "CLICK_LEARN_MORE_HOME_PAGE",
              });
              await setDismissBanner(true);
            }}
            className={css(styles.dismiss)}
          >
            Dismiss
          </div>
        </div>
      </div>
      <Illustration
        name="wishExpressTruckSideways"
        className={css(styles.illustration)}
        alt={i`Wish Express truck`}
      />
    </Card>
  );
};

export default observer(WishExpressIntroductionBanner);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          padding: 20,
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          "@media (min-width: 900px)": {
            maxWidth: "60%",
          },
        },
        illustration: {
          alignSelf: "flex-end",
          "@media (max-width: 900px)": {
            display: "none",
          },
          // Need image to stay at this width. Its hidden on small
          // screen via media query above.
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 250,
        },
        title: {
          fontSize: 20,
        },
        description: {
          margin: "15px 0px",
        },
        dismiss: {
          alignSelf: "center",
          margin: "10px 0px",
          fontSize: 16,
          color: textDark,
          cursor: "pointer",
          "@media (min-width: 650px)": {
            marginLeft: 15,
          },
        },
        buttonContainer: {
          display: "flex",
          "@media (max-width: 650px)": {
            flexDirection: "column",
          },
          "@media (min-width: 650px)": {
            flexDirection: "row",
          },
        },
      }),
    [textDark]
  );
};
