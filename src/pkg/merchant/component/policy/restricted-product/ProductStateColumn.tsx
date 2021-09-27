import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import {
  applicationPath,
  RestrictedProductCategoryProps,
  startApplication,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { yellowClock, redX, greenCheckmark, bluePlus } from "@assets/icons";
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ProductStateColumnProps = BaseProps &
  Pick<RestrictedProductCategoryProps, "state" | "rejectedReason">;

const ProductStateColumn = ({
  state,
  rejectedReason,
}: ProductStateColumnProps) => {
  const isNewCategory: boolean = state === null;
  let showRejectedReason: boolean = false;
  let image;
  let text;

  switch (state) {
    case "APPROVED":
      image = greenCheckmark;
      text = i`Approved`;
      break;
    case "REJECTED":
      image = redX;
      text = i`Rejected`;
      showRejectedReason = true;
      break;
    case "AWAITING_ADMIN":
      image = yellowClock;
      text = i`Pending review`;
      break;
    default:
      image = bluePlus;
      text = i`Apply`;
  }

  const styles = useStylesheet(isNewCategory);

  return (
    <div>
      <div
        onClick={isNewCategory ? startApplication : undefined}
        className={css(styles.root)}
      >
        <img src={image} className={css(styles.icon)} />
        <div className={css(styles.text)}>{text}</div>
      </div>
      {showRejectedReason && (
        <Markdown
          className={css(styles.reason)}
          text={rejectedReason + i` [Reapply](${applicationPath})`}
        />
      )}
    </div>
  );
};

export default ProductStateColumn;

const useStylesheet = (isNewCategory: boolean) => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          ...(isNewCategory ? { cursor: "pointer" } : {}),
          padding: "0px, 4px",
        },
        icon: {
          margin: "0px 6px",
        },
        text: {
          display: "inline-block",
          ...(isNewCategory ? { color: primary } : {}),
        },
        reason: {
          paddingLeft: 25,
        },
      }),
    [isNewCategory, primary],
  );
};
