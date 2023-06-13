import { CommerceMerchantState } from "@schema";
import {
  PickedMerchantWssDetails,
  useWssBannerTriggers,
  WssBannerTriggerType,
} from "@performance/migrated/toolkit/stats";
import { zendeskURL } from "@core/toolkit/url";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { Alert, AlertTitle } from "@ContextLogic/atlas-ui";
import Markdown from "@core/components/Markdown";

type Props = {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const banFromInactivityMarkdown =
  i`Your account is at risk of suspension due to inactivity. ` +
  i`To restore your Wish Standards tier, continue being active on Wish`;

const accountDisabledMarkdown =
  i`Based on our evaluation of your store's performance, your ` +
  i`account has been deactivated.`;

const accountAtRiskMarkdown =
  i`Please improve your performance metrics and address infractions to ensure ` +
  i`your account stays active on Wish`;

const insufficientMatureOrderMarkdown =
  i`In order to update tiers, you must have ${50} or more matured ` +
  i`orders in the ${90} days prior to your tier update`;

const noLongerPlatinumMarkdown =
  i`Platinum-tier merchants must have ${100} orders or` +
  i` more in the ${30} days prior to their tier update`;

const didNotUpgradeToPlatinumMarkdown =
  i`Congratulations on your outstanding metrics! Keep up ` +
  i`the good work and reach ${100} or more matured ` +
  i`orders in ${30} days to upgrade to Platinum tier.`;

const bronzeFromInfractionsMarkdown =
  i`If you believe this is an error, you can ` +
  i`**[dispute the infractions](${"/warnings/v2"})** to move up tiers`;

const unvalidatedUnratedNoDataMarkdown =
  i`After you [validate your store](${"/seller-profile-verification"}), the rating will be ready when you've ` +
  i`received ${50} orders or more in the past ${90} days. [Learn more](${zendeskURL(
    "4408084779547",
  )})`;

const validatedUnratedNoDataMarkdown =
  i`The rating will be ready when you've received ${50} orders or ` +
  i`more in the past ${90} days. [Learn more](${zendeskURL("4408084779547")})`;

const unvalidatedUnratedWithDataMarkdown =
  i`After you [validate your store](${"/seller-profile-verification"}), the rating will be ready when you've ` +
  i`received ${50} orders or more in the past ${90} days. [Learn more](${zendeskURL(
    "4408084779547",
  )})`;

const aivAdjustmentMarkdown = i`Your tier might not reflect your performance metrics and infractions`;

const WssBanner: React.FC<Props> = (props: Props) => {
  const { merchantState, wssDetails } = props;

  const bannerTriggers = useWssBannerTriggers({ merchantState, wssDetails });

  const wssBanners = useMemo((): {
    readonly [k in WssBannerTriggerType]: {
      readonly banner: JSX.Element;
      readonly show: boolean;
    };
  } => {
    return {
      BAN_FROM_INACTIVITY: {
        ...bannerTriggers.BAN_FROM_INACTIVITY,
        banner: (
          <Alert severity="warning">
            <AlertTitle>You&apos;re at risk of suspension</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {banFromInactivityMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      ACCOUNT_DISABLED: {
        ...bannerTriggers.ACCOUNT_DISABLED,
        banner: (
          <Alert severity="warning">
            <AlertTitle>Your account has been deactivated</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {accountDisabledMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      ACCOUNT_AT_RISK: {
        ...bannerTriggers.ACCOUNT_AT_RISK,
        banner: (
          <Alert severity="warning">
            <AlertTitle>You&apos;re at risk of suspension</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {accountAtRiskMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      INSUFFICIENT_MATURE_ORDER: {
        ...bannerTriggers.INSUFFICIENT_MATURE_ORDER,
        banner: (
          <Alert severity={"info"}>
            <AlertTitle>
              Your tier didn&apos;t update in the last cycle
            </AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {insufficientMatureOrderMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      NO_LONGER_PLATINUM: {
        ...bannerTriggers.NO_LONGER_PLATINUM,
        banner: (
          <Alert severity={"info"}>
            <AlertTitle>Your tier is no longer Platinum</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {noLongerPlatinumMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      DID_NOT_UPGRADE_TO_PLATINUM: {
        ...bannerTriggers.DID_NOT_UPGRADE_TO_PLATINUM,
        banner: (
          <Alert severity={"info"}>
            <AlertTitle>Increase your orders to go Platinum</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {didNotUpgradeToPlatinumMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      BRONZE_FROM_INFRACTIONS: {
        ...bannerTriggers.BRONZE_FROM_INFRACTIONS,
        banner: (
          <Alert severity="warning">
            <AlertTitle>Your tier is Bronze due to infractions</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
              aProps={{ openInNewTab: true }}
            >
              {bronzeFromInfractionsMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      UNVALIDATED_UNRATED_NO_DATA: {
        ...bannerTriggers.UNVALIDATED_UNRATED_NO_DATA,
        banner: (
          <Alert severity="info">
            <AlertTitle>Why is my account not rated yet?</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
              aProps={{ openInNewTab: true }}
            >
              {unvalidatedUnratedNoDataMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      VALIDATED_UNRATED_NO_DATA: {
        ...bannerTriggers.VALIDATED_UNRATED_NO_DATA,
        banner: (
          <Alert severity="info">
            <AlertTitle>Why is my account not rated yet?</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
              aProps={{ openInNewTab: true }}
            >
              {validatedUnratedNoDataMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      UNVALIDATED_UNRATED_WITH_DATA: {
        ...bannerTriggers.UNVALIDATED_UNRATED_WITH_DATA,
        banner: (
          <Alert severity={"info"}>
            <AlertTitle>Why is my account not rated yet?</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
              aProps={{ openInNewTab: true }}
            >
              {unvalidatedUnratedWithDataMarkdown}
            </Markdown>
          </Alert>
        ),
      },
      AIV_ADJUSTMENT: {
        ...bannerTriggers.AIV_ADJUSTMENT,
        banner: (
          <Alert severity="info">
            <AlertTitle>Wish adjusted your tier up</AlertTitle>
            <Markdown
              pProps={{ color: "inherit" }}
              strongProps={{ color: "inherit" }}
            >
              {aivAdjustmentMarkdown}
            </Markdown>
          </Alert>
        ),
      },
    };
  }, [bannerTriggers]);

  if (wssBanners.BAN_FROM_INACTIVITY.show) {
    return wssBanners.BAN_FROM_INACTIVITY.banner;
  }
  if (wssBanners.ACCOUNT_DISABLED.show) {
    return wssBanners.ACCOUNT_DISABLED.banner;
  }
  if (wssBanners.ACCOUNT_AT_RISK.show) {
    return wssBanners.ACCOUNT_AT_RISK.banner;
  }
  if (wssBanners.BRONZE_FROM_INFRACTIONS.show) {
    return wssBanners.BRONZE_FROM_INFRACTIONS.banner;
  }
  if (wssBanners.NO_LONGER_PLATINUM.show) {
    return wssBanners.NO_LONGER_PLATINUM.banner;
  }
  if (wssBanners.INSUFFICIENT_MATURE_ORDER.show) {
    return wssBanners.INSUFFICIENT_MATURE_ORDER.banner;
  }
  if (wssBanners.AIV_ADJUSTMENT.show) {
    return wssBanners.AIV_ADJUSTMENT.banner;
  }

  return Object.values(wssBanners).find((v) => v.show)?.banner ?? null;
};

export default observer(WssBanner);
