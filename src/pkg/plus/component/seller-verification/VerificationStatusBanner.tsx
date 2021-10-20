import React, { useEffect, useMemo } from "react";
import { css } from "@toolkit/styling";

import { Markdown, RichTextBanner } from "@ContextLogic/lego";

import { useUIStateBool } from "@toolkit/ui-state";
import { useNavigationStore } from "@stores/NavigationStore";

import {
  StatusDescriptions,
  kycStatusDescriptions,
} from "./VerificationStatusLabel";

import { Datetime } from "@schema/types";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import moment from "moment/moment";
import { formatDatetimeLocalized } from "@toolkit/datetime";
import { PickedSellerVerificationSchema } from "@toolkit/account-settings";

export type Props = BaseProps &
  Pick<
    PickedSellerVerificationSchema,
    | "status"
    | "isKycVerification"
    | "gmvCapReached"
    | "paymentsBlocked"
    | "adminFeedback"
    | "kycVerification"
  > & {
    readonly gmvCapGracePeriodEndDate?: Pick<Datetime, "unix"> | null;
  };

const VerificationStatusBanner: React.FC<Props> = (props: Props) => {
  const {
    style,
    className,
    status,
    isKycVerification,
    gmvCapReached,
    gmvCapGracePeriodEndDate,
    paymentsBlocked,
    adminFeedback,
    kycVerification,
  } = props;
  const navigationStore = useNavigationStore();

  const renderAdminFeedback = () => {
    if (!adminFeedback) {
      return null;
    }
    const {
      lastNameIssue,
      middleNameIssue,
      firstNameIssue,
      businessAddressIssue,
      proofOfIdentificationIssue,
      dateOfBirthIssue,
    } = adminFeedback;

    /* eslint-disable local-rules/unnecessary-list-usage */
    return (
      <ul>
        {firstNameIssue && (
          <li>
            <Markdown text={firstNameIssue} />
          </li>
        )}
        {middleNameIssue && (
          <li>
            <Markdown text={middleNameIssue} />
          </li>
        )}
        {lastNameIssue && (
          <li>
            <Markdown text={lastNameIssue} />
          </li>
        )}
        {dateOfBirthIssue && (
          <li>
            <Markdown text={dateOfBirthIssue} />
          </li>
        )}
        {businessAddressIssue && (
          <li>
            <Markdown text={businessAddressIssue} />
          </li>
        )}
        {proofOfIdentificationIssue && (
          <li>
            <Markdown text={proofOfIdentificationIssue} />
          </li>
        )}
      </ul>
    );
  };

  const uiBoolState = isKycVerification
    ? "HAS_SEEN_KYC_VERIFICATION_SUCCESS_MESSAGE"
    : "HAS_SEEN_SELLER_VERIFICATION_SUCCESS_MESSAGE";
  const verificationUrl = isKycVerification
    ? "/kyc-verification"
    : "/seller-profile-verification";
  const verificationUrlRevalidate = isKycVerification
    ? "/kyc-verification"
    : "/seller-profile-verification?revalidate=true";

  const {
    value: hasSeenVerificationSuccess,
    isLoading,
    update: setHasSeenVerificationSuccess,
  } = useUIStateBool(uiBoolState);

  useEffect(() => {
    if (isLoading || status != "APPROVED" || hasSeenVerificationSuccess) {
      return;
    }
    setHasSeenVerificationSuccess(true, { refresh: false });
  }, [
    status,
    isLoading,
    hasSeenVerificationSuccess,
    setHasSeenVerificationSuccess,
  ]);

  const incompleteTitle: string = useMemo(() => {
    if (isKycVerification && kycVerification?.canStart) {
      if (!paymentsBlocked && gmvCapReached && gmvCapGracePeriodEndDate) {
        const formattedDate = formatDatetimeLocalized(
          moment.unix(gmvCapGracePeriodEndDate.unix),
          "MMMM D",
        );
        return i`Validate your store before ${formattedDate}`;
      }
      return i`Validate your store to receive payments`;
    }
    return i`Validate your store to unlock features`;
  }, [
    isKycVerification,
    paymentsBlocked,
    gmvCapReached,
    gmvCapGracePeriodEndDate,
    kycVerification?.canStart,
  ]);

  if (!status) {
    return null;
  }

  const description = isKycVerification
    ? kycStatusDescriptions({
        status,
        gmvCapReached,
        canStart: !!kycVerification?.canStart,
      })
    : StatusDescriptions[status];

  if (status == "REVIEWING") {
    return (
      <RichTextBanner
        className={css(style, className)}
        sentiment="info"
        title={i`Thanks for your submission!`}
        description={description}
        contentAlignment="left"
      />
    );
  }

  if (status == "APPROVED") {
    if (isLoading || hasSeenVerificationSuccess) {
      return null;
    }

    return (
      <RichTextBanner
        className={css(style, className)}
        sentiment="success"
        title={i`You have unlocked unlimited sales and additional merchant features!`}
        description={description}
        contentAlignment="left"
      />
    );
  }

  if (
    status == "REJECTED" ||
    (status == "INCOMPLETE" && adminFeedback != null)
  ) {
    return (
      <RichTextBanner
        className={css(style, className)}
        sentiment="warning"
        title={i`We could not verify your information`}
        description={isKycVerification ? description : renderAdminFeedback}
        buttonText={i`Validate my store`}
        onClick={() => navigationStore.navigate(verificationUrlRevalidate)}
        contentAlignment="left"
      />
    );
  }

  if (isKycVerification && !kycVerification?.canStart) {
    return null;
  }

  return (
    <RichTextBanner
      className={css(style, className)}
      sentiment="warning"
      title={incompleteTitle}
      description={description}
      buttonText={i`Validate my store`}
      onClick={() => navigationStore.navigate(verificationUrl)}
      contentAlignment="left"
    />
  );
};

export default VerificationStatusBanner;
