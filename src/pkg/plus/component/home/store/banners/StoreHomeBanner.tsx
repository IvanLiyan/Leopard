import React, { useEffect, useMemo } from "react";
import moment from "moment/moment";
import { useUIStateInt } from "@toolkit/ui-state";

import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";
import SellOnWishBanner from "./SellOnWishBanner";
import WelcomeToDashboard from "./WelcomeToDashboard";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly isOnboarding: boolean;
};

const StoreHomeBanner: React.FC<Props> = (props: Props) => {
  const {
    value: sellOnWishImpressionTime,
    update: updateSellOnWishImpressionTime,
    isLoading: isLoadingSellOnWishImpressionRecord,
  } = useUIStateInt("STORE_TIME_SEEN_SELL_ON_WISH_BANNER");

  const { isOnboarding } = props;

  useEffect(() => {
    if (
      isLoadingSellOnWishImpressionRecord ||
      sellOnWishImpressionTime != null
    ) {
      return;
    }
    updateSellOnWishImpressionTime(Math.round(new Date().getTime() / 1000));
  }, [
    updateSellOnWishImpressionTime,
    sellOnWishImpressionTime,
    isLoadingSellOnWishImpressionRecord,
  ]);

  const sellOnWishExpirationTime: number = useMemo(() => {
    const sellOnWishImpressionMoment = moment.unix(
      sellOnWishImpressionTime || new Date().getTime() / 1000
    );
    return sellOnWishImpressionMoment.add(1, "month").unix();
  }, [sellOnWishImpressionTime]);

  if (isOnboarding) {
    return <WelcomeToDashboard {...props} />;
  }

  if (isLoadingSellOnWishImpressionRecord) {
    return <BaseHomeBanner title="" />;
  }

  const showSellOnWishBanner =
    sellOnWishExpirationTime > new Date().getTime() / 1000;
  if (showSellOnWishBanner) {
    return <SellOnWishBanner />;
  }

  return <WelcomeToDashboard {...props} />;
};

export default StoreHomeBanner;
