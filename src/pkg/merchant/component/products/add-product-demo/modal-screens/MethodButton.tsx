import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";
import { useTheme } from "@stores/ThemeStore";
import { weightSemibold } from "@toolkit/fonts";

type Props = BaseProps & {
  readonly illustration: IllustrationName;
  readonly title: string;
  readonly onClick: () => unknown;
};

const MethodButton: React.FC<Props> = (props: Props) => {
  const { className, style, illustration, title, children, onClick } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)} onClick={onClick}>
      <Illustration style={css(styles.image)} name={illustration} alt="" />
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.text)}>{children}</div>
    </div>
  );
};

export default MethodButton;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 50,
          border: "1px solid rgba(175, 199, 209, 0.5)",
          borderRadius: 4,
          cursor: "pointer",
        },
        image: {
          height: 32,
          marginBottom: 20,
        },
        title: {
          fontSize: 16,
          lineHeight: "20px",
          color: textDark,
          textAlign: "center",
          marginBottom: 9,
          fontWeight: weightSemibold,
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          textAlign: "center",
          color: textDark,
        },
      }),
    [textDark]
  );
};
