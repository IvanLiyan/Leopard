import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { H5Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly renderRight?: () => React.ReactNode;
};

const HomeSection: React.FC<Props> = ({
  style,
  title,
  children,
  className,
  renderRight,
}: Props) => {
  const styles = useStylesheet({ hasRightContent: renderRight != null });
  if (!children) {
    return null;
  }
  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.titleContainer)}>
        <H5Markdown className={css(styles.title)} text={`**${title}**`} />
        {renderRight && renderRight()}
      </div>
      {children}
    </div>
  );
};

export default HomeSection;

const useStylesheet = ({
  hasRightContent,
}: {
  readonly hasRightContent: boolean;
}) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "5px 0px",
        },
        title: {
          marginRight: hasRightContent ? 16 : 0,
        },
      }),
    [hasRightContent],
  );
