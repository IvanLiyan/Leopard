import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

import { Card, H6 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
  readonly renderRight?: (() => React.ReactNode) | undefined | null;
  readonly contentContainerStyle?: CSSProperties | string | null | undefined;
};

const CardSection: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    title,
    renderRight,
    children,
    contentContainerStyle,
  } = props;

  const styles = useStylesheet();

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <div className={css(styles.titleContainer)}>
        <H6 className={css(styles.title)}>{title}</H6>
        {renderRight && renderRight()}
      </div>
      <div className={css(styles.content, contentContainerStyle)}>
        {children}
      </div>
    </Card>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 15,
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        title: {
          color: textDark,
          fontSize: 16,
        },
        content: {
          flex: 1,
        },
      }),
    [textDark]
  );
};

export default observer(CardSection);
