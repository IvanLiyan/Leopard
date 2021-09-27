import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

export type FbsInventoryTipProp = BaseProps & {
  readonly inventoryNumber: number;
  readonly buttonOnClick: () => unknown;
};

const FbsInventoryTip = observer((props: FbsInventoryTipProp) => {
  const styles = useStyleSheet();
  const { inventoryNumber, buttonOnClick } = props;
  const { primary } = useTheme();

  if (inventoryNumber <= 0) {
    return null;
  }

  return (
    <Tip className={css(styles.alert)} color={primary} icon="tip">
      <div className={css(styles.wrapper)}>
        <div className={css(styles.text)}>
          <Markdown
            text={
              i`We selected some of your products from your **FBW inventory** ` +
              i`and enrolled them into the Fulfillment By Store (FBS) program. ` +
              i`These FBS products will be stocked in Wish's partner stores across ` +
              i`the world.`
            }
            className={css(styles.text)}
          />
        </div>
        <SecondaryButton
          text={i`View Details`}
          className={css(styles.button)}
          onClick={buttonOnClick}
        />
      </div>
    </Tip>
  );
});

export default FbsInventoryTip;

const useStyleSheet = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideX;
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        },
        text: {
          fontSize: 14,
          color: textBlack,
        },
        button: {
          minWidth: 160,
        },
        alert: {
          marginTop: 20,
          marginBottom: 10,
          marginLeft: pageX,
          marginRight: pageX,
        },
      }),
    [pageX, textBlack]
  );
};
