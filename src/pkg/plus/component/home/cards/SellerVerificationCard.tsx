import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import HomePageCard from "./HomePageCard";
import { useUIStateBool } from "@toolkit/ui-state";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedSellerVerification } from "@toolkit/home";

import { useTheme } from "@stores/ThemeStore";

import { useLogger } from "@toolkit/logger";
import moment from "moment/moment";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type Props = BaseProps & {
  sellerVerification: PickedSellerVerification;
};

const SellerVerificationCard: React.FC<Props> = ({
  style,
  className,
  sellerVerification,
}: Props) => {
  const styles = useStylesheet();

  const {
    gmvCap,
    gmvCapReached,
    actionRequired,
    impressionsPaused,
    gmvCapGracePeriodEndDate,
    status,
    paymentsBlocked,
    isKycVerification,
  } = sellerVerification;

  const title: string = useMemo(() => {
    if (isKycVerification) {
      if (paymentsBlocked) {
        return i`Validate your store to receive payments`;
      } else if (gmvCapReached && gmvCapGracePeriodEndDate) {
        const formattedDate = formatDatetimeLocalized(
          moment.unix(gmvCapGracePeriodEndDate.unix),
          "MMMM D",
        );
        return i`Validate your store before ${formattedDate}`;
      }
      return i`Validate your store to receive payments`;
    }
    if (status === "REJECTED") {
      return i`Let's try validating your store again`;
    } else if (impressionsPaused) {
      return i`Your account has reached its selling limit`;
    } else if (gmvCapReached && gmvCapGracePeriodEndDate) {
      const formattedDate = formatDatetimeLocalized(
        moment.unix(gmvCapGracePeriodEndDate.unix),
        "MMMM D",
      );
      return i`Validate your store before ${formattedDate}`;
    }
    return i`Validate your store to unlock features`;
  }, [
    isKycVerification,
    status,
    paymentsBlocked,
    gmvCapReached,
    gmvCapGracePeriodEndDate,
    impressionsPaused,
  ]);

  const logTableName = isKycVerification
    ? "PLUS_KYC_VERIFICATION_UI"
    : "PLUS_SELLER_VERIFICATION_UI";
  const dismissUIState = isKycVerification
    ? "DISMISSED_KYC_VERIFICATION_INTRO_BANNER"
    : "DISMISSED_SELLER_VERIFICATION_INTRO_BANNER";
  const url = isKycVerification
    ? "/kyc-verification"
    : "/seller-profile-verification";
  const actionLogger = useLogger(logTableName);

  const {
    value: hideBanner,
    isLoading,
    update: setDismissBanner,
  } = useUIStateBool(dismissUIState);

  if (isLoading || !gmvCap || !actionRequired) {
    return null;
  }
  if (!gmvCapReached && hideBanner) {
    // Banner can only be hidden if cap has not been reached
    return null;
  }

  let description: string | undefined;
  if (isKycVerification) {
    if (paymentsBlocked) {
      description =
        i`You have not completed our Know Your Customer (KYC) process.` +
        i` Per the regulations of the European Economic Area (EEA),` +
        i` we are no longer able to continue remitting payments` +
        i` to you until you validate your store.` +
        i` Please validate your store to receive payments.`;
    } else {
      description =
        i`Per the regulations of the European Economic Area (EEA),` +
        i` please complete our Know Your Customer (KYC) process` +
        i` to validate your store and prevent payment withholding.`;
    }
  } else {
    if (impressionsPaused) {
      description =
        i`Expand your sales beyond this limit and unlock unlimited ` +
        i`sales by validating your store.`;
    } else {
      description =
        i`Your current account allows you to sell up to ${gmvCap.display}. ` +
        i`Validate your store to unlock.`;
    }
  }

  return (
    <HomePageCard
      className={css(style, className)}
      title={title}
      description={description}
      illustration="merchantPlusSellerValidationTask"
      illustrationStyle={css(styles.illustration)}
    >
      <div className={css(styles.buttonsContainer)}>
        {gmvCapReached ? (
          <PrimaryButton href={url}>Validate store</PrimaryButton>
        ) : (
          <Button href={url}>Validate store</Button>
        )}
        {!gmvCapReached && (
          <div
            onClick={async () => {
              actionLogger.info({
                action: "DISMISSED_SELLER_VALIDATION_INTRO_BANNER",
              });
              await setDismissBanner(true);
            }}
            className={css(styles.dismiss)}
          >
            Dismiss
          </div>
        )}
      </div>
    </HomePageCard>
  );
};

export default observer(SellerVerificationCard);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        buttonsContainer: {
          display: "flex",
          flexDirection: "column",
        },
        dismiss: {
          alignSelf: "center",
          margin: "10px 0px",
          fontSize: 16,
          color: textDark,
          cursor: "pointer",
        },
        illustration: {
          padding: "26px 12px",
        },
      }),
    [textDark],
  );
};
