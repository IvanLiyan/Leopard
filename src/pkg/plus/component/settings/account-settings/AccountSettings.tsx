/*
 *
 * AccountSettings.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020, 10:04:54 AM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import StoreSettings from "./StoreSettings";
import SecuritySettings from "./SecuritySettings";
import PersonalSettings from "./PersonalSettings";
import { AccountSettingsInitialData } from "@toolkit/account-settings";

import VerificationStatusBanner from "@plus/component/seller-verification/VerificationStatusBanner";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly initialData: AccountSettingsInitialData;
};

const AccountSettings: React.FC<Props> = (props: Props) => {
  const { className, style, initialData } = props;

  const {
    currentMerchant: { sellerVerification },
  } = initialData;

  const { adminFeedback, status, isKycVerification } = sellerVerification;

  const styles = useStylesheet();

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      {status && (
        <VerificationStatusBanner
          status={status}
          isKycVerification={isKycVerification}
          gmvCapReached={sellerVerification.gmvCapReached}
          gmvCapGracePeriodEndDate={sellerVerification.gmvCapGracePeriodEndDate}
          paymentsBlocked={sellerVerification.paymentsBlocked}
          kycVerification={sellerVerification.kycVerification}
          adminFeedback={adminFeedback}
        />
      )}
      <div className={css(styles.content)}>
        <PersonalSettings hasBottomBorder initialData={initialData} />
        <StoreSettings hasBottomBorder initialData={initialData} />
        <SecuritySettings initialData={initialData} />
      </div>
    </Card>
  );
};

export default observer(AccountSettings);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "25px 50px 50px 40px",
        },
      }),
    [],
  );
};
