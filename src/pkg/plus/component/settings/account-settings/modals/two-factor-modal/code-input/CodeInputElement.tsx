/*
 * CodeInputElement.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, {
  useMemo,
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type CodeInputElementProps = BaseProps & {
  readonly value: string;
  readonly index: number;
  readonly onChange: (value: string, index: number) => unknown;
  readonly onFocus: () => unknown;
  readonly onBackspace: () => unknown;
};

const CodeInputElement = (
  props: CodeInputElementProps,
  ref: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["ref"],
) => {
  const {
    className,
    style,
    value,
    index,
    onChange: onChangeProp,
    onFocus,
    onBackspace,
  } = props;
  const styles = useStylesheet();

  const onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      onChangeProp(target.value.substr(-1), index);
    }
  };

  return (
    <input
      ref={ref}
      className={css(styles.root, className, style)}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={(e) => {
        // String not being shown to the user.
        // eslint-disable-next-line local-rules/unwrapped-i18n
        if (e.key === "Backspace") {
          onBackspace();
        }
      }}
    />
  );
};
export default forwardRef(CodeInputElement);

const useStylesheet = () => {
  const { textBlack, borderPrimary, surfaceLight, primary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 50,
          height: 56,
          color: "transparent", // hides the cursor
          textShadow: `0 0 0 ${textBlack}`, // shows the text
          fontSize: 36,
          fontWeight: weightSemibold,
          textAlign: "center",
          borderRadius: 4,
          border: `solid 1px ${borderPrimary}`,
          ":focus": {
            outline: "none",
            boxShadow: "none",
            border: `solid 1px ${primary}`,
          },
          ":disabled": {
            backgroundColor: surfaceLight,
          },
          ":not(:last-child)": {
            marginRight: 20,
          },
        },
      }),
    [textBlack, borderPrimary, surfaceLight, primary],
  );
};
