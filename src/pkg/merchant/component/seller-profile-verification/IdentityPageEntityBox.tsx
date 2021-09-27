import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

type IdentityPageEntityBoxProps = BaseProps & {
  readonly title: string;
  readonly text: string;
  readonly img: IllustrationName;
  readonly selected: boolean;
  readonly onClick: () => void;
};

const IdentityPageEntityBox = (props: IdentityPageEntityBoxProps) => {
  const styles = useStylesheet();
  const { className, style, title, text, img, selected, onClick } = props;
  return (
    <div
      className={css(
        styles.root,
        style,
        className,
        selected && styles.selected
      )}
      onClick={onClick}
    >
      <div className={css(styles.boxLeft)}>
        <Text weight="bold" className={css(styles.boxTitle)}>
          {title}
        </Text>
        <div className={css(styles.boxText)}>{text}</div>
      </div>
      <Illustration className={css(styles.boxRight)} name={img} alt="" />
    </div>
  );
};

export default observer(IdentityPageEntityBox);

const useStylesheet = () => {
  const { textLight, primary, textBlack, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "38px 25px",
          border: `1px solid ${borderPrimaryDark}`,
          cursor: "pointer",
          borderRadius: 4,
        },
        boxLeft: {
          flex: 1,
        },
        boxTitle: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
        },
        boxText: {
          fontSize: 14,
          lineHeight: "20px",
          marginTop: 12,
          color: textLight,
        },
        boxRight: {
          "@media (max-width: 640px)": {
            display: "none",
          },
          marginLeft: 25,
          width: 100,
        },
        selected: {
          border: `2px solid ${primary}`,
          padding: "37px 24px",
        },
      }),
    [textLight, textBlack, borderPrimaryDark, primary]
  );
};
