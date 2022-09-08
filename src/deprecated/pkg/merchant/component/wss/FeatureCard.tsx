import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

import Icon from "@merchant/component/core/Icon";
import { IconName } from "@ContextLogic/zeus";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FeatureCardProps = BaseProps & {
  readonly cardImg: IconName;
  readonly title: string;
  readonly subtitle: string;
};

const FeatureCard: React.FC<FeatureCardProps> = (props: FeatureCardProps) => {
  const { cardImg, title, subtitle, style, className } = props;
  const { isSmallScreen } = useDeviceStore();
  const { textWhite } = useTheme();
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn
      style={[styles.root, className, style]}
      alignItems={isSmallScreen ? "center" : "flex-start"}
    >
      <Icon name={cardImg} size={43} color={textWhite} />
      <Text style={styles.title} weight="semibold">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textWhite } = useTheme();
  const { isSmallScreen } = useDeviceStore();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textWhite,
        },
        title: {
          fontSize: isSmallScreen ? 16 : 20,
          marginTop: isSmallScreen ? 10 : 18,
        },
        subtitle: {
          fontSize: 16,
          marginTop: isSmallScreen ? 16 : 8,
          textAlign: isSmallScreen ? "center" : undefined,
        },
      }),
    [isSmallScreen, textWhite]
  );
};

export default observer(FeatureCard);
