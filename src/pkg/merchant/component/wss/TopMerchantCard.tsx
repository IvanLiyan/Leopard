import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

import Icon from "@merchant/component/core/Icon";
import { IconName } from "@ContextLogic/zeus";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TopMerchantCardProps = BaseProps & {
  readonly icon: IconName;
  readonly title: string;
  readonly subtitle: string;
  readonly alignCenter?: boolean;
};

const TopMerchantCard: React.FC<TopMerchantCardProps> = (
  props: TopMerchantCardProps
) => {
  const { secondaryDark } = useTheme();
  const { icon, title, subtitle, alignCenter, style, className } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      style={[style, className]}
      alignItems={alignCenter ? "center" : "flex-start"}
    >
      <Icon
        style={styles.iconContainer}
        name={icon}
        size={20}
        color={secondaryDark}
      />
      <Text style={styles.title} weight="bold">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, lightBlueSurface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        iconContainer: {
          padding: 13,
          borderRadius: 24,
          backgroundColor: lightBlueSurface,
        },
        title: {
          fontSize: 16,
          color: textBlack,
          margin: "8px 0",
        },
        subtitle: {
          fontSize: 16,
          color: textDark,
        },
      }),
    [textBlack, textDark, lightBlueSurface]
  );
};

export default observer(TopMerchantCard);
