import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  title?: string;
  icon?: ReactNode;
};

const Row: React.FC<Props> = ({
  className,
  style,
  title,
  icon,
  children,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      {icon && <div className={css(styles.iconContainer)}>{icon}</div>}
      <div className={css(styles.textContainer)}>
        {title && <Markdown text={`**${title}**`} />}
        {children}
      </div>
    </div>
  );
};

export default observer(Row);

const useStylesheet = () => {
  const { pageBackground } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
        },
        iconContainer: {
          width: 40,
          height: 40,
          marginRight: 24,
          backgroundColor: pageBackground,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        textContainer: {
          flex: 1,
        },
      }),
    [pageBackground],
  );
};
