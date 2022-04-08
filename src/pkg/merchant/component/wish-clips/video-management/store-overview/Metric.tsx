/*
 * Metric.tsx
 *
 * Created by Jonah Dlin on Tue Mar 15 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Text, Layout, Info, H4 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { IconName } from "@ContextLogic/zeus";
import Icon from "@merchant/component/core/Icon";

type Props = BaseProps & {
  readonly icon: IconName;
  readonly name: string;
  readonly amount: string;
  readonly change?: number;
  readonly description?: string;
};

const Metric: React.FC<Props> = ({
  className,
  style,
  icon,
  name,
  amount,
  change,
  description,
}) => {
  const styles = useStylesheet();
  const { primary, positiveDark, negativeDarker } = useTheme();

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      <Layout.FlexRow
        style={styles.iconContainer}
        alignItems="center"
        justifyContent="center"
      >
        <Icon name={icon} size={36} color={primary} />
      </Layout.FlexRow>
      <Layout.FlexColumn alignItems="flex-start" justifyContent="space-between">
        <Layout.FlexRow style={styles.titleRow}>
          <Text style={styles.metricName}>{name}</Text>
          {description != null && <Info text={description} />}
        </Layout.FlexRow>
        <Layout.FlexRow style={styles.metricRow}>
          <H4>{amount}</H4>
          {change != null && (
            <Layout.FlexRow style={styles.changeRow}>
              <Icon
                size={16}
                color={change >= 0 ? positiveDark : negativeDarker}
                name={change >= 0 ? "arrowUp" : "arrowDown"}
              />
              <Text
                style={[
                  styles.changeNumber,
                  {
                    color: change >= 0 ? positiveDark : negativeDarker,
                  },
                ]}
                weight="semibold"
              >
                {Math.abs(change)}%
              </Text>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { secondaryLighter, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 24,
        },
        iconContainer: {
          height: 60,
          width: 60,
          borderRadius: "50%",
          backgroundColor: secondaryLighter,
        },
        titleRow: {
          gap: 4,
        },
        metricRow: {
          marginTop: 8,
          gap: 12,
        },
        metricName: {
          color: textDark,
          fontSize: 16,
          lineHeight: "24px",
        },
        changeRow: {
          gap: 4,
        },
        changeNumber: {
          fontSize: 12,
          lineHeight: "16px",
        },
      }),
    [secondaryLighter, textDark]
  );
};

export default observer(Metric);
