import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

/* Merchant Components */
import TopMerchantCard from "@merchant/component/wss/TopMerchantCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TopMerchantSectionProps = BaseProps;

const TopMerchantSection: React.FC<TopMerchantSectionProps> = (
  props: TopMerchantSectionProps
) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const { style, className } = props;

  return (
    <Layout.FlexColumn alignItems="center" style={[className, style]}>
      <Text style={styles.title} weight="bold">
        How to become a Premier Merchant
      </Text>
      <Text style={styles.subtitle}>
        Once you reach a certain order minimum, you're automatically enrolled in
        Wish Standards and can start earning rewards. Every few weeks, we will
        evaluate your performance based on several qualities, including those
        listed below. Excellence in these areas will put you one step closer to
        becoming, or remaining, a top-tier merchant.
      </Text>
      <Layout.FlexRow style={styles.cards} justifyContent="center">
        <TopMerchantCard
          style={styles.card}
          icon="tag"
          title={i`High product quality`}
          subtitle={i`Customers are consistently delighted by the quality of their purchase.`}
          alignCenter={isSmallScreen}
        />
        <TopMerchantCard
          style={styles.card}
          icon="history"
          title={i`Fast delivery times`}
          subtitle={i`You routinely deliver products to consumers quickly and on time.`}
          alignCenter={isSmallScreen}
        />
        <TopMerchantCard
          style={styles.card}
          icon="shieldUser"
          title={i`High reliability`}
          subtitle={
            i`You consistently provide valid tracking information and ` +
            i`fulfill orders faithfully.`
          }
          alignCenter={isSmallScreen}
        />
        <TopMerchantCard
          style={styles.card}
          icon="clipboardCheck"
          title={i`Good compliance record`}
          subtitle={i`You do not commit any infractions or compliance violations.`}
          alignCenter={isSmallScreen}
        />
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { isSmallScreen } = useDeviceStore();
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: isSmallScreen ? 20 : 28,
          color: textBlack,
          margin: isSmallScreen ? "40px 16px 0 16px" : "96px 16px 0 16px",
          alignSelf: isSmallScreen ? "flex-start" : undefined,
        },
        subtitle: {
          fontSize: 16,
          color: textDark,
          margin: 16,
          alignSelf: isSmallScreen ? "flex-start" : undefined,
          maxWidth: isSmallScreen ? undefined : 785,
          textAlign: isSmallScreen ? undefined : "center",
        },
        cards: {
          marginTop: isSmallScreen ? 0 : 16,
          flexWrap: "wrap",
          maxWidth: 1000,
        },
        card: {
          maxWidth: 380,
          margin: isSmallScreen ? "16px" : "28px 16px",
          flexBasis: "50%",
        },
      }),
    [textBlack, textDark, isSmallScreen]
  );
};

export default observer(TopMerchantSection);
