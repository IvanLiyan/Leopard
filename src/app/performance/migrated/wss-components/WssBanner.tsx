import { Alert, Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CommerceMerchantState } from "@schema";
import {
  PickedMerchantWssDetails,
  useWssBannerTriggers,
  WssBannerTriggerType,
} from "@performance/migrated/toolkit/stats";
import { zendeskURL } from "@core/toolkit/url";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
  readonly wssInsights?: boolean | null;
};

const WssBanner: React.FC<Props> = (props: Props) => {
  const { className, style, merchantState, wssDetails, wssInsights } = props;

  const disputeURI = "/warnings/v2";
  const validateAccountURI = "/seller-profile-verification";
  const learnMore = zendeskURL("4408084779547");

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
          <Alert
            style={[className, style]}
            sentiment="warning"
            title={i`You're at risk of suspension`}
            text={() => (
              <Markdown
                text={
                  i`Your account is at risk of suspension due to inactivity. ` +
                  i`To restore your Wish Standards tier, continue being active on Wish`
                }
              />
            )}
          />
        ),
      },
      ACCOUNT_DISABLED: {
        ...bannerTriggers.ACCOUNT_DISABLED,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="warning"
            title={i`Your account has been deactivated`}
            text={() => (
              <Markdown
                text={
                  i`Based on our evaluation of your store's performance, your ` +
                  i`account has been deactivated.`
                }
              />
            )}
          />
        ),
      },
      ACCOUNT_AT_RISK: {
        ...bannerTriggers.ACCOUNT_AT_RISK,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="warning"
            title={i`You're at risk of suspension`}
            text={() => (
              <Markdown
                text={
                  i`Please improve your performance metrics and address infractions to ensure ` +
                  i`your account stays active on Wish`
                }
              />
            )}
          />
        ),
      },
      INSUFFICIENT_MATURE_ORDER: {
        ...bannerTriggers.INSUFFICIENT_MATURE_ORDER,
        banner: (
          <Alert
            style={[className, style]}
            sentiment={wssInsights ? "info" : "warning"}
            title={i`Your tier didn't update in the last cycle`}
            text={() => (
              <Markdown
                text={
                  i`In order to update tiers, you must have ${50} or more matured ` +
                  i`orders in the ${90} days prior to your tier update`
                }
              />
            )}
          />
        ),
      },
      NO_LONGER_PLATINUM: {
        ...bannerTriggers.NO_LONGER_PLATINUM,
        banner: (
          <Alert
            style={[className, style]}
            sentiment={wssInsights ? "info" : "warning"}
            title={i`Your tier is no longer Platinum`}
            text={() => (
              <Markdown
                text={
                  i`Platinum-tier merchants must have ${100} orders or` +
                  i` more in the ${30} days prior to their tier update`
                }
              />
            )}
          />
        ),
      },
      DID_NOT_UPGRADE_TO_PLATINUM: {
        ...bannerTriggers.DID_NOT_UPGRADE_TO_PLATINUM,
        banner: (
          <Alert
            style={[className, style]}
            sentiment={wssInsights ? "info" : "warning"}
            title={i`Increase your orders to go Platinum`}
            text={() => (
              <Markdown
                text={
                  i`Congratulations on your outstanding metrics! Keep up ` +
                  i`the good work and reach ${100} or more matured ` +
                  i`orders in ${30} days to upgrade to Platinum tier.`
                }
              />
            )}
          />
        ),
      },
      BRONZE_FROM_INFRACTIONS: {
        ...bannerTriggers.BRONZE_FROM_INFRACTIONS,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="warning"
            title={i`Your tier is Bronze due to infractions`}
            text={() => (
              <Markdown
                text={
                  i`If you believe this is an error, you can ` +
                  i`**[dispute the infractions](${disputeURI})** to move up tiers`
                }
                openLinksInNewTab
              />
            )}
          />
        ),
      },
      UNVALIDATED_UNRATED_NO_DATA: {
        ...bannerTriggers.UNVALIDATED_UNRATED_NO_DATA,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="info"
            title={i`Why is my account not rated yet?`}
            text={() => (
              <Markdown
                text={
                  i`After you [validate your store](${validateAccountURI}), the rating will be ready when you've ` +
                  i`received ${50} orders or more in the past ${90} days. [Learn more](${learnMore})`
                }
                openLinksInNewTab
              />
            )}
          />
        ),
      },
      VALIDATED_UNRATED_NO_DATA: {
        ...bannerTriggers.VALIDATED_UNRATED_NO_DATA,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="info"
            title={i`Why is my account not rated yet?`}
            text={() => (
              <Markdown
                text={
                  i`The rating will be ready when you've received ${50} orders or ` +
                  i`more in the past ${90} days. [Learn more](${learnMore})`
                }
                openLinksInNewTab
              />
            )}
          />
        ),
      },
      UNVALIDATED_UNRATED_WITH_DATA: {
        ...bannerTriggers.UNVALIDATED_UNRATED_WITH_DATA,
        banner: (
          <Alert
            style={[className, style]}
            sentiment={wssInsights ? "info" : "warning"}
            title={i`Why is my account not rated yet?`}
            text={() => (
              <Markdown
                text={
                  i`After you [validate your store](${validateAccountURI}), the rating will be ready when you've ` +
                  i`received ${50} orders or more in the past ${90} days. [Learn more](${learnMore})`
                }
                openLinksInNewTab
              />
            )}
          />
        ),
      },
      AIV_ADJUSTMENT: {
        ...bannerTriggers.AIV_ADJUSTMENT,
        banner: (
          <Alert
            style={[className, style]}
            sentiment="info"
            title={i`Wish adjusted your tier up`}
            text={() => (
              <Markdown
                text={i`Your tier might not reflect your performance metrics and infractions`}
              />
            )}
          />
        ),
      },
    };
  }, [className, learnMore, style, bannerTriggers, wssInsights]);

  if (wssInsights) {
    if (wssBanners.BAN_FROM_INACTIVITY.show) {
      return wssBanners.BAN_FROM_INACTIVITY.banner;
    }
    if (wssBanners.ACCOUNT_DISABLED.show) {
      return wssBanners.ACCOUNT_DISABLED.banner;
    }
    if (wssBanners.ACCOUNT_AT_RISK.show) {
      return wssBanners.ACCOUNT_AT_RISK.banner;
    }
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
