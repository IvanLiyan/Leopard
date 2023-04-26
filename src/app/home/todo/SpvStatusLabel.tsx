import { useQuery } from "@apollo/client";
import { Label, LabelProps, Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import {
  GET_SPV_STATUS_QUERY,
  GetSPVStatusResponse,
} from "@home/toolkit/spv-status-label";
import { SellerProfileVerificationStatus } from "@schema";
import { observer } from "mobx-react";
import React from "react";

type Props = BaseProps & {
  readonly status?: SellerProfileVerificationStatus | null;
};

const StatusLabel: React.FC<Props> = ({ status, className, style }) => {
  const { data } = useQuery<GetSPVStatusResponse, never>(GET_SPV_STATUS_QUERY, {
    skip: !!status,
  });
  const theme = useSPVStatusLabelTheme();

  const spvStatus = data?.currentMerchant?.sellerVerification.status || status;
  if (spvStatus == null) {
    return null;
  }

  return (
    <Layout.FlexRow style={[className, style]}>
      <Label
        style={{ borderRadius: 16, fontSize: 14 }}
        {...theme[spvStatus].style}
        text={theme[spvStatus].text}
      />
    </Layout.FlexRow>
  );
};

export default observer(StatusLabel);

const useSPVStatusLabelTheme = (): {
  [P in SellerProfileVerificationStatus]: {
    readonly style: Pick<LabelProps, "textColor" | "backgroundColor">;
    readonly text: string;
  };
} => {
  const {
    surfaceLight,
    warningLight,
    quaternaryLighter,
    positiveLighter,
    negativeLight,
    textDark,
    secondaryLighter,
    secondaryDarkest,
    quaternaryDarkest,
    positiveDarker,
    negativeDarkest,
  } = useTheme();

  return {
    REVIEWING: {
      style: { backgroundColor: surfaceLight, textColor: textDark },
      text: ci18n(
        "SPV status, Merchant is waiting for Wish to Approve or Reject",
        "Pending Wish Review",
      ),
    },
    INCOMPLETE: {
      style: { backgroundColor: warningLight, textColor: quaternaryDarkest },
      text: ci18n(
        "SPV status, Merchant has not submitted verification",
        "Incomplete",
      ),
    },
    // Note: "complete" is a temporary state before creating authentication ticket.
    // If profile stuck in this state, it means something wrong with creation.
    // see details below on how we convert  COMPLETE --> REVIEWING
    // sweeper/merchant_dashboard/lib/seller_profile_verification/main_helper.py: reply_or_create_reauth_ticket()
    // sweeper/merchant_dashboard/lib/seller_profile_verification/main_helper_cn.py: reply_or_create_reauth_ticket()
    COMPLETE: {
      style: {
        backgroundColor: secondaryLighter,
        textColor: secondaryDarkest,
      },
      text: ci18n(
        "Transient SPV status, Merchant has submitted verification but a case is not created yet",
        "Submitted",
      ),
    },
    APPROVED: {
      style: { backgroundColor: positiveLighter, textColor: positiveDarker },
      text: ci18n(
        "SPV status, Wish has confirmed the Merchant's Identity and they are able to sell",
        "Approved",
      ),
    },
    REJECTED: {
      style: { backgroundColor: negativeLight, textColor: negativeDarkest },
      text: ci18n(
        "SPV status, Wish has rejected the Merchant's application and they are not allowed to sell",
        "Rejected",
      ),
    },
    REQUEST_INFO: {
      style: {
        backgroundColor: quaternaryLighter,
        textColor: quaternaryDarkest,
      },
      text: ci18n(
        "SPV status, Merchant needs to fix an issue with an already submitted an application",
        "Needs Attention",
      ),
    },
  };
};
