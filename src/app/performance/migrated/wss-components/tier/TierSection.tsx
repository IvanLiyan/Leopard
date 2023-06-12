import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import BadgeSection from "./BadgeSection";
import MaturedOrdersSection from "./MaturedOrdersSection";
import UpdateScheduleSection from "./UpdateScheduleSection";
import WssSection from "@performance/migrated/wss-components/WssSection";
import { useTheme } from "@core/stores/ThemeStore";
import { CommerceMerchantState, WssMerchantLevelType } from "@schema";
import {
  isAtRisk,
  isBanned,
  PickedMerchantWssDetails,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const TierSection: React.FC<Props> = (props: Props) => {
  const { className, style, wssDetails, merchantState } = props;

  const level = wssDetails?.level;
  const styles = useStylesheet(merchantState, level);

  return (
    <WssSection
      style={[className, style]}
      title={ci18n(
        "Title of card that displays WSS tier information",
        "Your Tier",
      )}
    >
      <Layout.FlexRow style={styles.cardContent}>
        <BadgeSection wssDetails={wssDetails} />
        <Layout.FlexColumn style={{ gap: 28 }}>
          <UpdateScheduleSection
            merchantState={merchantState}
            wssDetails={wssDetails}
          />
          <MaturedOrdersSection
            merchantState={merchantState}
            wssDetails={wssDetails}
          />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </WssSection>
  );
};
export default observer(TierSection);

const useStylesheet = (
  merchantState: CommerceMerchantState,
  level?: WssMerchantLevelType | null,
) => {
  const { warning, warningLighter, borderPrimary, surfaceLightest } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        warningBorder: {},
        cardContent: {
          whiteSpace: "nowrap",
          padding: "16px 28px",
          gap: 28,
          flexGrow: 1,
          borderRadius: 4,
          border: `1px solid ${
            isBanned(merchantState) || isAtRisk(level) ? warning : borderPrimary
          }`,
          background:
            isBanned(merchantState) || isAtRisk(level)
              ? warningLighter
              : surfaceLightest,
        },
      }),
    [
      borderPrimary,
      level,
      merchantState,
      surfaceLightest,
      warning,
      warningLighter,
    ],
  );
};
