import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Illustration } from "@merchant/component/core";
import { IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  illustration?: IllustrationName;
};

const Row: React.FC<Props> = ({
  className,
  style,
  children,
  illustration,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      {illustration && (
        <Illustration
          className={css(styles.iconContainer)}
          name={illustration}
          alt={illustration}
        />
      )}
      <div className={css(styles.textContainer)}>{children}</div>
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pageBackground,
          borderRadius: 4,
          padding: 20,
        },
        iconContainer: {
          height: 24,
          width: 24,
          marginRight: 20,
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
