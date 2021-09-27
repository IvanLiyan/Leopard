/*
 *
 * PersonalSettings.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020, 10:05:00 AM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { formatPhoneNumber } from "@toolkit/phone-number";
import { Theme, ThemedLabel } from "@ContextLogic/lego";

import { CountryCode } from "@toolkit/countries";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import SettingsSection, {
  SettingsSectionProps,
} from "@plus/component/settings/toolkit/SettingsSection";
import SettingsRow from "@plus/component/settings/toolkit/SettingsRow";
import ShippingAddress from "@plus/component/orders/fulfillment/ShippingAddress";
import VerificationStatusLabel from "@plus/component/seller-verification/VerificationStatusLabel";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import ChangePhoneNumberModal from "./modals/change-phone-number-modal/ChangePhoneNumberModal";

import { AccountSettingsInitialData } from "@toolkit/account-settings";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { KycProfileVerificationStatus } from "@schema/types";

export type PersonalSettingsProps = BaseProps & {
  readonly hasBottomBorder?: SettingsSectionProps["hasBottomBorder"];
  readonly initialData: AccountSettingsInitialData;
};

/* eslint-disable local-rules/unwrapped-i18n */
const KYCLabelTheme: {
  [status in KycProfileVerificationStatus]: Theme;
} = {
  REJECTED: "Yellow",
  INCOMPLETE: "Grey",
  COMPLETE: "DarkPalaceBlue",
};

const KYCLabelText: { [status in KycProfileVerificationStatus]: string } = {
  REJECTED: i`Rejected`,
  INCOMPLETE: i`Incomplete`,
  COMPLETE: i`Complete`,
};

const PersonalSettings: React.FC<PersonalSettingsProps> = (
  props: PersonalSettingsProps
) => {
  const { className, style, hasBottomBorder, initialData } = props;
  const styles = useStylesheet(props);

  const {
    currentUser: { name, canEditPhoneNumber },
    currentMerchant: {
      businessName,
      proofOfIdentity,
      businessAddress,
      countryOfDomicile,
      sellerVerification,
    },
  } = initialData;
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(
    initialData.currentUser.phoneNumber
  );

  const supportEmailLink = "mailto:merchant_support@wish.com";
  const namePopover =
    i`To update your name, please contact your account manager ` +
    i`([merchant_support@wish.com](${supportEmailLink}))`;
  const phonePopover =
    i`To update your number, please contact your account manager ` +
    i`([merchant_support@wish.com](${supportEmailLink}))`;

  const lastNameIssue = sellerVerification?.adminFeedback?.lastNameIssue;
  const firstNameIssue = sellerVerification?.adminFeedback?.firstNameIssue;
  const businessAddressIssue =
    sellerVerification?.adminFeedback?.businessAddressIssue;
  const proofOfIdentificationIssue =
    sellerVerification?.adminFeedback?.proofOfIdentificationIssue;

  const renderKycStatusRows = () => {
    if (
      !sellerVerification.isKycVerification ||
      sellerVerification.kycVerification?.status == null ||
      sellerVerification.kycVerification?.merchantType == null ||
      sellerVerification.kycVerification?.merchantType == "NOT_SET"
    ) {
      return null;
    }
    return (
      <SettingsRow
        title={
          sellerVerification.kycVerification?.merchantType == "INDIVIDUAL"
            ? i`Proof of identity(Fourthline)`
            : i`KYC questionnaire`
        }
      >
        <ThemedLabel
          className={css(styles.kycStatus)}
          theme={KYCLabelTheme[sellerVerification.kycVerification?.status]}
        >
          {KYCLabelText[sellerVerification.kycVerification?.status]}
        </ThemedLabel>
      </SettingsRow>
    );
  };

  const renderSellerVerificationRight = () => {
    const { lastUpdateTime, status, isKycVerification } = sellerVerification;
    const url = isKycVerification
      ? "/kyc-verification"
      : "/seller-profile-verification?revalidate=true";
    if (status == null) {
      return null;
    }
    if (["INCOMPLETE", "REJECTED"].includes(status)) {
      return <Link href={url}>Validate Store</Link>;
    }

    if (!lastUpdateTime) {
      return null;
    }

    return (
      <div className={css(styles.verificationLastSubmitted)}>
        Submitted on {lastUpdateTime.mmddyyyy}
      </div>
    );
  };

  const nameIssue =
    firstNameIssue || lastNameIssue
      ? [firstNameIssue, lastNameIssue].filter((_) => !!_).join(". ")
      : undefined;

  const {
    platformConstants: { interselectablePhoneCountries },
  } = initialData;
  const interselectablePhoneCountryCodes = interselectablePhoneCountries.map(
    ({ code }) => code as CountryCode
  );

  return (
    <SettingsSection
      className={css(className, style)}
      title={i`Personal`}
      hasBottomBorder={hasBottomBorder}
    >
      <div className={css(styles.root)}>
        <SettingsRow
          title={i`Name`}
          popoverMarkdown={nameIssue || namePopover}
          popoverSentiment={nameIssue ? "warning" : "info"}
        >
          {name}
        </SettingsRow>
        {phoneNumber && (
          <SettingsRow
            title={i`Phone number`}
            popoverMarkdown={canEditPhoneNumber ? undefined : phonePopover}
            onEdit={
              canEditPhoneNumber
                ? () => {
                    new ChangePhoneNumberModal({
                      currentPhoneNumber: phoneNumber,
                      setPhoneNumber,
                      interselectablePhoneCountryCodes,
                    }).render();
                  }
                : undefined
            }
          >
            {formatPhoneNumber(phoneNumber)}
          </SettingsRow>
        )}
        {countryOfDomicile && (
          <SettingsRow title={i`Country/region of domicile `}>
            {countryOfDomicile.name}
          </SettingsRow>
        )}
        {businessName && (
          <SettingsRow title={i`Business name`}>{businessName}</SettingsRow>
        )}
        {businessAddress && (
          <SettingsRow
            title={i`Business address`}
            popoverMarkdown={businessAddressIssue}
            popoverSentiment={businessAddressIssue ? "warning" : "info"}
          >
            <ShippingAddress
              shippingDetails={{ ...businessAddress, name: "" }}
            />
          </SettingsRow>
        )}
        {proofOfIdentity != null && proofOfIdentity.length > 0 && (
          <SettingsRow
            title={i`Proof of identity`}
            popoverMarkdown={proofOfIdentificationIssue}
            popoverSentiment={proofOfIdentificationIssue ? "warning" : "info"}
          >
            <div className={css(styles.proofOfIds)}>
              {proofOfIdentity.map((file) => (
                <Link
                  key={file.fileUrl}
                  href={file.fileUrl}
                  download
                  className={css(styles.proofOfId)}
                  openInNewTab
                >
                  {file.displayFilename}
                </Link>
              ))}
            </div>
          </SettingsRow>
        )}
        {sellerVerification.status != null &&
          !sellerVerification.isKycVerification && (
            <SettingsRow title={i`Status`}>
              <div className={css(styles.verificationRow)}>
                <VerificationStatusLabel
                  status={sellerVerification.status}
                  isKycVerification={false}
                  gmvCapReached={sellerVerification.gmvCapReached}
                  canStart={sellerVerification.canStart}
                />
                {renderSellerVerificationRight()}
              </div>
            </SettingsRow>
          )}
        {renderKycStatusRows()}
      </div>
    </SettingsSection>
  );
};

export default observer(PersonalSettings);

const useStylesheet = (props: PersonalSettingsProps) => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        proofOfIds: {
          display: "flex",
          flexDirection: "column",
        },
        proofOfId: {
          margin: "2px 0px",
        },
        verificationRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        verificationLastSubmitted: {
          color: textLight,
        },
        kycStatus: {
          alignSelf: "flex-start",
        },
      }),
    [textLight]
  );
};
