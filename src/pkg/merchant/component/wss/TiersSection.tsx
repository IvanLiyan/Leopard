import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

/* Merchant Components */
import TierCard from "@merchant/component/wss/TierCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TiersSectionProps = BaseProps;

const TiersSection: React.FC<TiersSectionProps> = (
  props: TiersSectionProps
) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const {
    lightBlueSurface,
    warningLighter,
    surfaceLighter,
    quaternaryLightest,
  } = useTheme();
  const { style, className } = props;

  const TierCardsBox = isSmallScreen ? Layout.FlexColumn : Layout.FlexRow;

  return (
    <Layout.FlexColumn
      style={[styles.root, className, style]}
      alignItems="center"
    >
      <Text style={styles.title} weight="bold">
        How the program works
      </Text>
      <Text style={styles.subtitle}>
        Your performance across several criteria will land your store in one of
        four tiers: Platinum, Gold, Silver, and Bronze. The higher your tier,
        the more benefits you receive that help you boost visibility, grow your
        customer base, and get paid quickly. Merchants in lower tiers are
        encouraged to level up and achieve these benefits.
      </Text>
      <TierCardsBox
        alignItems="stretch"
        justifyContent="center"
        style={styles.cards}
      >
        <TierCard
          style={styles.card}
          headerImg="wssPlatinumBadge"
          headerColor={lightBlueSurface}
          header={i`Platinum`}
          listItems={[
            i`Maximum impression boost`,
            i`Premier merchant badge displayed in app`,
            i`Best commission rates*`,
            i`Weekly disbursements*`,
          ]}
        />
        <TierCard
          style={styles.card}
          headerImg="wssGoldBadge"
          headerColor={warningLighter}
          header={i`Gold`}
          listItems={[
            i`Impression boost`,
            i`Premier merchant badge displayed in app`,
            i`Exceptional commission rates*`,
            i`Disbursements twice per month`,
          ]}
        />
        <TierCard
          style={styles.card}
          headerImg="wssSilverBadge"
          headerColor={surfaceLighter}
          header={i`Silver`}
          listItems={[
            i`Favorable commission rates*`,
            i`Disbursements twice per month`,
          ]}
        />
        <TierCard
          style={styles.card}
          headerImg="wssBronzeBadge"
          headerColor={quaternaryLightest}
          header={i`Bronze`}
          listItems={[i`Disbursements twice per month`]}
        />
      </TierCardsBox>
      <Text style={styles.footer}>
        *These benefits - and more - coming soon for top-tier merchants!
      </Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { isSmallScreen } = useDeviceStore();
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: isSmallScreen ? 48 : 112,
          paddingLeft: 16,
          paddingRight: 16,
        },
        title: {
          fontSize: isSmallScreen ? 20 : 28,
          color: textBlack,
          alignSelf: isSmallScreen ? "flex-start" : undefined,
        },
        subtitle: {
          fontSize: 16,
          color: textDark,
          maxWidth: isSmallScreen ? undefined : 785,
          margin: "16px 0 20px 0",
          textAlign: isSmallScreen ? undefined : "center",
        },
        cards: {
          flexWrap: "wrap",
          color: textBlack,
        },
        card: {
          maxWidth: isSmallScreen ? undefined : 276,
          margin: isSmallScreen ? 12 : 16,
          flexBasis: "22%",
        },
        footer: {
          fontSize: 14,
          color: textDark,
          margin: "32px 0",
        },
      }),
    [textDark, textBlack, isSmallScreen]
  );
};

export default observer(TiersSection);
