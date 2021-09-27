import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type CardHeaderProps = BaseProps & {
  readonly pageNumberDisplay?: string;
  readonly onClickBack?: () => void;
  readonly displayType: "pages" | "back" | "both";
};

const CardHeader = (props: CardHeaderProps) => {
  const {
    className,
    style,
    pageNumberDisplay,
    onClickBack,
    displayType,
  } = props;

  const styles = useStylesheet();

  const additionalStyle =
    displayType === "pages"
      ? { justifyContent: "flex-end" }
      : { justifyContent: "space-between" };

  return (
    <div className={css(styles.root, additionalStyle, style, className)}>
      {displayType !== "pages" && (
        <div className={css(styles.back)}>
          <Icon name="arrowLeft" onClick={onClickBack} />
        </div>
      )}
      {displayType !== "back" && <span>{pageNumberDisplay}</span>}
    </div>
  );
};

export default CardHeader;

const useStylesheet = () => {
  const { textUltralight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: "stretch",
          fontSize: 14,
          lineHeight: "20px",
          color: textUltralight,
          display: "flex",
        },
        back: {
          cursor: "pointer",
        },
      }),
    [textUltralight]
  );
};
