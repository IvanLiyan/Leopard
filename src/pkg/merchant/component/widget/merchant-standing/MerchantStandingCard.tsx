import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Components */
import { Card, Text, H6, Link } from "@ContextLogic/lego";
import { Illustration, IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as logger from "@toolkit/logger";

/* Merchant Components */
import UnderReviewMerchantStandingModal from "@merchant/component/policy/merchant-standing/UnderReviewMerchantStandingModal";
import ActiveMerchantStandingModal from "@merchant/component/policy/merchant-standing/ActiveMerchantStandingModal";
import SilverMerchantStandingModal from "@merchant/component/policy/merchant-standing/SilverMerchantStandingModal";
import GoldMerchantStandingModal from "@merchant/component/policy/merchant-standing/GoldMerchantStandingModal";
import PlatinumMerchantStandingModal from "@merchant/component/policy/merchant-standing/PlatinumMerchantStandingModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantStandingCode } from "@schema/types";

export type MerchantStandingCardProps = BaseProps & {
  readonly standing: MerchantStandingCode;
};

const StandingIcon: { [type in MerchantStandingCode]: IllustrationName } = {
  ACTIVE: "activeMerchantStanding",
  GOLD: "goldMerchantStanding",
  PLATINUM: "platinumMerchantStanding",
  SILVER: "silverMerchantStanding",
  UNDER_REVIEW: "underReviewMerchantStanding",
};

const StandingTitle: { [type in MerchantStandingCode]: string } = {
  ACTIVE: i`Active`,
  GOLD: i`Gold`,
  PLATINUM: i`Platinum`,
  SILVER: i`Silver`,
  UNDER_REVIEW: i`Under Review`,
};

const MerchantStandingCard = ({
  className,
  standing,
}: MerchantStandingCardProps) => {
  const styles = useStylesheet();
  const standingLogger = logger.useLogger("MERCHANT_STANDING_CLICK");

  const openModal = (standing: MerchantStandingCode) => {
    standingLogger.info({
      merchant_standing: standing,
      action: "LEARN_MORE_HOME",
    });

    if (standing === "ACTIVE") {
      const modal = new ActiveMerchantStandingModal({});
      modal.render();
    } else if (standing === "GOLD") {
      const modal = new GoldMerchantStandingModal({});
      modal.render();
    } else if (standing === "PLATINUM") {
      const modal = new PlatinumMerchantStandingModal({});
      modal.render();
    } else if (standing === "SILVER") {
      const modal = new SilverMerchantStandingModal({});
      modal.render();
    } else if (standing === "UNDER_REVIEW") {
      const modal = new UnderReviewMerchantStandingModal({});
      modal.render();
    }
  };

  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <Illustration
        name={StandingIcon[standing]}
        alt={i`illustration`}
        className={css(styles.illustrationIconContainer)}
      />
      <div className={css(styles.contentContainer)}>
        <Text>Merchant Standing</Text>
        <H6 className={css(styles.title)}>{StandingTitle[standing]}</H6>
        <Link onClick={() => openModal(standing)}>Learn more</Link>
      </div>
    </Card>
  );
};
export default observer(MerchantStandingCard);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          padding: 24,
        },
        contentContainer: {
          marginLeft: 24,
        },
        illustrationIconContainer: {
          height: 58,
        },
        title: {
          color: textBlack,
          marginBottom: 12,
        },
      }),
    [textBlack]
  );
};
