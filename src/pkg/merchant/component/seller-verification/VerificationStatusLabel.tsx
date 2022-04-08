/* moved from
 * @plus/component/seller-verification/VerificationStatusLabel.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React from "react";

import Popover from "@merchant/component/core/Popover";
import { zendeskURL } from "@toolkit/url";

import { ThemedLabel, Theme } from "@ContextLogic/lego";

import {
  SellerVerificationSchema,
  SellerProfileVerificationStatus,
  CurrencyValue,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";

export type Props = BaseProps &
  Pick<
    SellerVerificationSchema,
    "isKycVerification" | "gmvCapReached" | "numSalesCap"
  > & {
    readonly status: SellerProfileVerificationStatus;
    readonly canStart: boolean;
    readonly gmvCap: Pick<CurrencyValue, "display" | "amount"> | null;
  };

const VerificationStatusLabel: React.FC<Props> = (props: Props) => {
  const {
    style,
    className,
    status,
    isKycVerification,
    canStart,
    gmvCapReached,
    gmvCap,
    numSalesCap,
  } = props;
  const {
    decision: deciderSellerProfileNumSalesCap,
    isLoading: loadingDeciderSellerProfileNumSalesCap,
  } = useDeciderKey("seller_profile_num_sales_cap");
  const text = LabelText[status];
  const theme = LabelTheme[status];

  let description: string | undefined;
  if (isKycVerification) {
    description = kycStatusDescriptions({ status, gmvCapReached, canStart });
  } else {
    if (loadingDeciderSellerProfileNumSalesCap) {
      return null;
    }
    if (!gmvCap || (!numSalesCap && numSalesCap != 0)) {
      return null;
    }
    const showNumSalesCap = deciderSellerProfileNumSalesCap || false;
    description = statusDescriptions({
      status,
      gmvCap,
      numSalesCap,
      showNumSalesCap,
    });
  }

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

const ValidationUrl = "/seller-profile-verification";
const SettingsPageUrl = "/plus/settings/account";

export const statusDescriptions = (sellerProfileState: {
  status: SellerProfileVerificationStatus;
  gmvCap: Pick<CurrencyValue, "display" | "amount">;
  numSalesCap: number;
  showNumSalesCap: boolean;
}) => {
  const { status, gmvCap, numSalesCap, showNumSalesCap } = sellerProfileState;

  let incompleteText: string;
  if (gmvCap.amount === 0) {
    incompleteText =
      i`Your account requires immediate validation in order to sell on Wish. ` +
      i`[Validate your store](${ValidationUrl}) to unlock unlimited orders and ` +
      i`exclusive features. [Learn more](${zendeskURL("360048831574")})`;
  } else if (showNumSalesCap) {
    incompleteText =
      i`Your current account allows you to sell up to ${gmvCap.display} ` +
      i`or ${numSalesCap} sales. ` +
      i`[Validate your store](${ValidationUrl}) to unlock unlimited orders and ` +
      i`exclusive features. [Learn more](${zendeskURL("360048831574")})`;
  } else {
    incompleteText =
      i`Your current account allows you to sell up to ${gmvCap.display}. ` +
      i`[Validate your store](${ValidationUrl}) to unlock unlimited orders and ` +
      i`exclusive features. [Learn more](${zendeskURL("360048831574")})`;
  }

  const statusDescriptionsMap: {
    [status in SellerProfileVerificationStatus]: string | undefined;
  } = {
    REVIEWING:
      gmvCap.amount === 0
        ? i`Please be patient with us as it can take up to **${3} ` +
          i`business days** to validate your store. Your impressions ` +
          i`will remain paused until your store has been successfully validated.`
        : i`Please be patient with us as it can take up to **${3} ` +
          i`business days** to validate your store. During this time, your ` +
          i`products will remain enabled and available for sale in the Wish app. `,
    REJECTED: i`We could not verify your information. View details [here](${SettingsPageUrl}).`,
    APPROVED:
      i`Your store has been successfully validated! Your products will ` +
      i`remain enabled and available for sale in the Wish app, and your ` +
      i`store is now eligible for **unlimited sales** and additional merchant ` +
      i`features to further grow your business.`,
    INCOMPLETE: incompleteText,
    COMPLETE:
      i`Please be patient with us as it can take up to **${3} ` +
      i`business days** to validate your store. During this time, your ` +
      i`products will remain enabled and available for sale in the Wish app. `,
  };
  return statusDescriptionsMap[status];
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
