import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H6 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import * as fonts from "@toolkit/fonts";

/* Model */
import {
  PerformanceHealthInitialData,
  countStoreHealthWarnings,
} from "@toolkit/performance/stats";

type Props = BaseProps & {
  readonly text: string;
  readonly showWarning?: boolean;
  readonly initialData: PerformanceHealthInitialData;
};

const WarningBadgeTab = (props: Props) => {
  const { text, showWarning = false, initialData, className, style } = props;
  const styles = useStylesheet();

  const badgeValue = useMemo(() => {
    return countStoreHealthWarnings(initialData);
  }, [initialData]);

  return (
    <div className={css(styles.root, className, style)}>
      <H6 className={css(styles.text)}>{text}</H6>
      {badgeValue > 0 && showWarning && (
        <div className={css(styles.badge)}>{badgeValue}</div>
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { negative, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          padding: "12px 40px",
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          marginRight: 6,
        },
        badge: {
          backgroundColor: negative,
          borderRadius: "50%",
          width: 16,
          height: 16,
          fontSize: 10,
          color: textWhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: fonts.weightMedium,
        },
      }),
    [negative, textWhite],
  );
};

export default observer(WarningBadgeTab);
