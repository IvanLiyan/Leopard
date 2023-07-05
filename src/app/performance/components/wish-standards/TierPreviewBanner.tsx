import React from "react";
import { observer } from "mobx-react";
import { Alert, AlertProps, AlertTitle, Text } from "@ContextLogic/atlas-ui";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import { WssMerchantLevelType } from "@schema";
import Link from "@core/components/Link";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";
import {
  TierPreviewBannerQueryResponse,
  TIER_PREVIEW_BANNER_QUERY,
} from "@performance/api/tierPreviewBannerQuery";
import { useDeciderKey } from "@core/stores/ExperimentStore";

type Tier = Extract<
  WssMerchantLevelType,
  "BAN" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
>;

const TierInfo: {
  readonly [tier in Tier]: {
    readonly name: string;
    readonly icon: IllustrationName;
    readonly level: number;
  };
} = {
  BAN: {
    name: i`At risk`,
    icon: "wssBannedBadge",
    level: 0,
  },
  BRONZE: {
    name: i`Bronze`,
    icon: "wssBronzeBadge",
    level: 1,
  },
  SILVER: {
    name: i`Silver`,
    icon: "wssSilverBadge",
    level: 2,
  },
  GOLD: {
    name: i`Gold`,
    icon: "wssGoldBadge",
    level: 3,
  },
  PLATINUM: {
    name: i`Platinum`,
    icon: "wssPlatinumBadge",
    level: 4,
  },
};

const TierPreviewBanner: React.FC<
  Omit<AlertProps, "sx"> & {
    readonly sx?: Omit<AlertProps["sx"], "clipPath">;
  }
> = ({ sx, ...props }) => {
  const { decision: showBanner, isLoading: dkeyLoading } = useDeciderKey(
    "wss_2_0_transition_state",
  );
  const { data, loading } = useQuery<TierPreviewBannerQueryResponse>(
    TIER_PREVIEW_BANNER_QUERY,
    {
      fetchPolicy: "no-cache",
    },
  );

  if (loading || dkeyLoading) {
    return <Skeleton height={72} sx={sx} />;
  }

  const currentTier = data?.currentMerchant?.wishSellerStandard.level;
  const newTier = data?.currentMerchant?.wishSellerStandard.stats?.levelPreview;

  if (
    !showBanner ||
    currentTier == null ||
    currentTier === "UNASSESSED" ||
    newTier == null ||
    newTier === "UNASSESSED"
  ) {
    return null;
  }

  const body =
    currentTier === newTier
      ? i`Based on your current performance, you will maintain your tier when we enforce the new Wish Standards criteria on August 18th, 2023.`
      : TierInfo[currentTier].level < TierInfo[newTier].level
      ? i`Based on your current performance, you will reach the ${TierInfo[newTier].name} tier when we enforce the new Wish Standards criteria on August 18th, 2023.`
      : i`You are at risk of dropping down to the ${TierInfo[newTier].name} tier when we enforce the new Wish Standards criteria on August 18th, 2023.`;

  return (
    <Alert
      severity="info"
      icon={
        <Illustration
          style={{ height: "38px", width: "38px" }}
          name={TierInfo[newTier].icon}
          alt={TierInfo[newTier].name}
        />
      }
      sx={sx}
      {...props}
    >
      <AlertTitle>Changes to Wish Standards</AlertTitle>
      <Text color="inherit">
        {body}{" "}
        <Link
          href="https://merchanthelp.wish.com/s/article/Wish-Standards-Improvements-Updates-August-2023"
          variant="underlined"
          openInNewTab
          color="inherit"
        >
          Learn more
        </Link>
      </Text>
    </Alert>
  );
};

export default observer(TierPreviewBanner);
