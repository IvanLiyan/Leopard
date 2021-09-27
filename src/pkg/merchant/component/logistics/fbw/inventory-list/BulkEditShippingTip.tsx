import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { useLogger } from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type BulkEditShippingTipProps = BaseProps;

const BulkEditShippingTip = (props: BulkEditShippingTipProps) => {
  const styles = useStylesheet(props);
  const clickLogger = useLogger("FBW_RECOMMENDATION_DASHBOARD_CLICK");
  const onClick = () => {
    clickLogger.info({
      action: "bulk-edit-fbw-shipping",
    });
    const bulkEditUrl = "/bulk-edit-fbw-shipping-price";
    window.open(bulkEditUrl, "_blank");
  };

  return (
    <Tip
      className={css(styles.root)}
      color={palettes.coreColors.WishBlue}
      icon="tip"
    >
      <div className={css(styles.wrapper)}>
        <div className={css(styles.text)}>
          <Markdown
            text={
              i`Edit shipping prices for **multiple products** via CSV files` +
              i` by uploading csv file!`
            }
            className={css(styles.text)}
          />
        </div>
        <SecondaryButton
          text={i`View Details`}
          className={css(styles.button)}
          onClick={onClick}
        />
      </div>
    </Tip>
  );
};

export default observer(BulkEditShippingTip);

const useStylesheet = (props: BulkEditShippingTipProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        wrapper: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        },
        text: {
          fontSize: 14,
          color: palettes.textColors.Ink,
        },
        button: {
          minWidth: 160,
        },
      }),
    []
  );
};
