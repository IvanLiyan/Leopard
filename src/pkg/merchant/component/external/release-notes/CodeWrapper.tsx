import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type CodeWrapperProps = {
  readonly children: string | ReadonlyArray<string>;
};

const CodeWrapper = ({ children }: CodeWrapperProps) => {
  const styles = useStylesheet();

  const formatString = (content: string | ReadonlyArray<string>) => {
    if (typeof content === "string") return content;
    return content.join(", ");
  };
  return (
    <code className={css(styles.codeSection)}>{formatString(children)}</code>
  );
};

const useStylesheet = () => {
  const { primary, pageBackground, surfaceLighter } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        codeSection: {
          padding: "0px 8px",
          color: primary,
          backgroundColor: pageBackground,
          border: `0.5px solid ${surfaceLighter}`,
          borderRadius: 2,
          fontSize: "12px",
          lineHeight: "18px",
        },
      }),
    [primary, pageBackground, surfaceLighter]
  );
};

export default CodeWrapper;
