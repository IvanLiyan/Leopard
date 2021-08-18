/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps, CleanedBaseDivProps } from "@riptide/toolkit/types";

type FlexProps = BaseProps &
  CleanedBaseDivProps & {
    readonly alignItems?: CSSProperties["alignItems"];
    readonly justifyContent?: CSSProperties["justifyContent"];
  };

const FlexRow = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    { style, children, alignItems = "center", justifyContent, ...divProps },
    ref,
  ) => {
    const styles = useStylesheet({ alignItems, justifyContent });
    return (
      <div
        className={css(styles.root, styles.row, style)}
        {...divProps}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

const FlexColumn = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ style, children, alignItems, justifyContent, ...divProps }, ref) => {
    const styles = useStylesheet({ alignItems, justifyContent });
    return (
      <div
        className={css(styles.root, styles.column, style)}
        {...divProps}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

const Layout = {
  FlexRow,
  FlexColumn,
};

export default Layout;

const useStylesheet = ({
  alignItems,
  justifyContent,
}: Pick<FlexProps, "alignItems" | "justifyContent">) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems,
          justifyContent,
        },
        row: {
          flexDirection: "row",
        },
        column: {
          flexDirection: "column",
        },
      }),
    [alignItems, justifyContent],
  );
