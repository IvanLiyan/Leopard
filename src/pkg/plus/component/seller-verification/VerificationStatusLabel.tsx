import React from "react";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { zendeskURL } from "@toolkit/url";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { ThemedLabel, Theme } from "@ContextLogic/lego";

import {
  SellerVerificationSchema,
  SellerProfileVerificationStatus,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps &
  Pick<SellerVerificationSchema, "isKycVerification" | "gmvCapReached"> & {
    readonly status: SellerProfileVerificationStatus;
    readonly canStart: boolean;
  };

const VerificationStatusLabel: React.FC<Props> = (props: Props) => {
  const {
    style,
    className,
    status,
    isKycVerification,
    canStart,
    gmvCapReached,
  } = props;
  const text = LabelText[status];
  const theme = LabelTheme[status];
  const description = isKycVerification
    ? kycStatusDescriptions({ status, gmvCapReached, canStart })
    : StatusDescriptions[status];

  return (
    <Popover
      popoverContent={description}
      popoverMaxWidth={250}
      position="right center"
    >
      <ThemedLabel className={css(style, className)} theme={theme}>
        {text}
      </ThemedLabel>
    </Popover>
  );
};

const LabelText: { [status in SellerProfileVerificationStatus]: string } = {
  REVIEWING: i`In review`,
  REJECTED: i`Rejected`,
  APPROVED: i`Validated`,
  INCOMPLETE: i`Incomplete`,
  COMPLETE: i`Complete`,
};

/* eslint-disable local-rules/unwrapped-i18n */
const LabelTheme: {
  [status in SellerProfileVerificationStatus]: Theme;
} = {
  REVIEWING: "Grey",
  REJECTED: "Yellow",
  APPROVED: "DarkPalaceBlue",
  INCOMPLETE: "Grey",
  COMPLETE: "Grey",
};

const MaxSalesAllowed = formatCurrency(1000, "USD");
const ValidationUrl = "/seller-profile-verification";
const SettingsPageUrl = "/plus/settings/account";

export const StatusDescriptions: {
  [status in SellerProfileVerificationStatus]: string | undefined;
} = {
  REVIEWING:
    i`Please be patient with us as it can take up to **${3} ` +
    i`business days** to validate your store. During this time, your ` +
    i`products will remain enabled and available for sale in the Wish app. `,
  REJECTED: i`We could not verify your information. View details [here](${SettingsPageUrl}).`,
  APPROVED:
    i`Your store has been successfully validated! Your products will ` +
    i`remain enabled and available for sale in the Wish app, and your ` +
    i`store is now eligible for **unlimited sales** and additional merchant ` +
    i`features to further grow your business.`,
  INCOMPLETE:
    i`Your current account allows you to sell up to ${MaxSalesAllowed}. ` +
    i`[Validate your store](${ValidationUrl}) to unlock unlimited orders and ` +
    i`exclusive features. [Learn more](${zendeskURL("360048831574")})`,
  COMPLETE:
    i`Please be patient with us as it can take up to **${3} ` +
    i`business days** to validate your store. During this time, your ` +
    i`products will remain enabled and available for sale in the Wish app. `,
};

export const kycStatusDescriptions = (kycState: {
  status: SellerProfileVerificationStatus;
  gmvCapReached: boolean;
  canStart: boolean;
}) => {
  const { status, gmvCapReached, canStart } = kycState;

  if (status == "INCOMPLETE" && !canStart) {
    return (
      i`Additionally, due to European regulations, you may be required ` +
      i`to validate your store to receive unlimited payments in the future.`
    );
  }

  const kycStatusDescriptionsMap = {
    REVIEWING:
      i`It will take up to **${3} business days** to ` +
      i`complete the review process of your store validation`,
    REJECTED:
      i`Note that payment may be withheld from your store ` +
      i`if you do not complete this process. Please validate ` +
      i`your store again.`,
    APPROVED:
      i`Your store is now successfully validated! Your store is ` +
      i`now eligible for unlimited sales and additional merchant ` +
      i`features to further grow your business. `,
    INCOMPLETE: gmvCapReached
      ? i`You have not completed our Know Your Customer (KYC) process.` +
        i` Per the regulations of the European Economic Area (EEA),` +
        i` we are no longer able to continue remitting payments` +
        i` to you until you validate your store.` +
        i` Please validate your store to receive payments.`
      : i`Per the regulations of the European Economic Area (EEA),` +
        i` please complete our Know Your Customer (KYC) process` +
        i` to validate your store and continue receiving payments from Wish.`,
    COMPLETE:
      i`Please be patient with us as it can take up to **${3} ` +
      i`business days** to validate your store.`,
  };
  return kycStatusDescriptionsMap[status];
};

export default VerificationStatusLabel;
