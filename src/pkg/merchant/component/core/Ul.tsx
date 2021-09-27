import React from "react";
import { StyleSheet } from "aphrodite";
import { useMemo } from "react";
import { BaseProps } from "@toolkit/api";
import { css } from "@toolkit/styling";
import { Layout } from "@ContextLogic/lego";

export type LiProps = BaseProps & {
  readonly indent?: number;
  readonly bulletSize?: number;
};

const Bullets: { [indent in 0 | 1 | 2]: string } = {
  0: "•",
  1: "◦",
  2: "▪",
};

const Li: React.FC<LiProps> = ({
  className,
  style,
  children,
  indent = 0,
  bulletSize,
}) => {
  const styles = useLiStylesheet({ bulletSize });
  const cleansedIndent = Math.round(indent) < 0 ? 0 : Math.round(indent);
  const bulletType = (cleansedIndent % 3) as 0 | 1 | 2;
  const bullet = Bullets[bulletType];
  return (
    <Layout.GridRow
      className={css(className, style)}
      templateColumns="max-content auto"
      gap={4}
    >
      <div className={css(styles.bullet)}>{bullet}</div>
      {children}
    </Layout.GridRow>
  );
};

export type UlProps = Omit<BaseProps, "children"> & {
  readonly children?:
    | ReadonlyArray<React.ReactElement<LiProps>>
    | React.ReactElement<LiProps>;
  readonly margin?: number;
};

const Ul = ({ className, style, children, margin = 16 }: UlProps) => {
  const renderLiContainer = (
    li: React.ReactElement<LiProps>,
    index: number
  ) => {
    const indent = li.props.indent == null ? 0 : li.props.indent;
    const cleansedIndent = Math.round(indent) < 0 ? 0 : Math.round(indent);
    return (
      // using index as key as last resort. Usually list points are not reordered
      <div style={{ marginLeft: margin * cleansedIndent }} key={index}>
        {li}
      </div>
    );
  };

  let childrenArray: ReadonlyArray<React.ReactElement<LiProps>> = [];
  if (Array.isArray(children)) {
    childrenArray = children;
  } else if (children != null) {
    // need the cast, it's not possible children is an array or null here
    childrenArray = [children as React.ReactElement<LiProps>];
  }

  return (
    <Layout.FlexColumn className={css(className, style)}>
      {childrenArray.map((child, index) => renderLiContainer(child, index))}
    </Layout.FlexColumn>
  );
};

Ul.Li = Li;

export default Ul;

const useLiStylesheet = ({ bulletSize }: { bulletSize?: number }) =>
  useMemo(
    () =>
      StyleSheet.create({
        bullet: {
          ...(bulletSize == null ? {} : { fontSize: bulletSize }),
        },
      }),
    [bulletSize]
  );
