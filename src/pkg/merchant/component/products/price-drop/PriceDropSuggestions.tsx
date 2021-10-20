import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";
import { useTheme } from "@stores/ThemeStore";

type PriceDropSuggestionsProps = BaseProps & {
  readonly illustration: IllustrationName;
  readonly content: ReactNode;
  readonly renderAction?: () => ReactNode;
};

const PriceDropSuggestions = (props: PriceDropSuggestionsProps) => {
  const { illustration, content, renderAction, className, style } = props;
  const styles = useStylesheet();
  let borderColor = palettes.coreColors.WishBlue;
  if (illustration === "greyoutCoins") {
    borderColor = "#48636f";
  }
  return (
    <Card className={css(className, style)}>
      <div
        className={css(styles.root)}
        style={{ borderLeft: `solid 4px ${borderColor}` }}
      >
        <Illustration
          className={css(styles.img)}
          name={illustration}
          alt={illustration}
        />
        <div className={css(styles.content)}>{content}</div>
        {renderAction && renderAction()}
      </div>
    </Card>
  );
};

export default observer(PriceDropSuggestions);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        img: {
          margin: 15,
          width: 50,
          height: 50,
        },
        content: {
          fontSize: 20,
          fontWeight: weightBold,
          flexGrow: 1,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
