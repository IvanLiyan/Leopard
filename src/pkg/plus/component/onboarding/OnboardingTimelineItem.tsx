/*
 *
 * OnboardingSteps.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/21/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly index: number;
  readonly isLast?: boolean;
  readonly showLastNumber?: boolean;
};

const OnboardingTimelineItem: React.FC<Props> = ({
  index,
  isLast,
  showLastNumber,
  className,
  style,
  children,
}: Props) => {
  const styles = useStylesheet();

  const number = (
    <div className={css(styles.icon)}>
      {isLast && !showLastNumber ? (
        <Icon name="plusPackage" />
      ) : (
        <div className={css(styles.index)}>{index}</div>
      )}
    </div>
  );

  const verticalLine = !isLast && (
    <div className={css(styles.verticalLineContainer)}>
      <div className={css(styles.verticalLine)} />
    </div>
  );

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.left)}>
        {number}
        {verticalLine}
      </div>
      <div className={css(styles.right)}>{children}</div>
    </div>
  );
};

export default observer(OnboardingTimelineItem);

const useStylesheet = () => {
  const { primary, primaryLight, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "hidden",
          padding: "28px 24px",
          alignItems: "stretch",
        },
        root: {
          display: "flex",
          alignItems: "stretch",
        },
        left: {
          marginRight: "16px",
          display: "flex",
          flexDirection: "column",
        },
        icon: {
          borderRadius: "50%",
          border: `6px solid ${primaryLight}`,
          width: "44px",
          height: "44px",
          backgroundColor: surfaceLightest,
          color: primary,
          fontWeight: weightBold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        index: {
          fontSize: 22,
          lineHeight: 0.8, // removing baseline
          textAlign: "center",
          verticalAlign: "center",
        },
        verticalLineContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        verticalLine: {
          width: "1px",
          height: "100%",
          borderLeft: `1px ${primary} solid`,
        },
        right: {
          flex: 1,
          marginBottom: "28px",
        },
      }),
    [primary, primaryLight, surfaceLightest]
  );
};
