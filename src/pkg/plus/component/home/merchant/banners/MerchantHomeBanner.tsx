import React from "react";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */

import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import NoNewsToday from "./NoNewsToday";
import HappyToHaveYou from "./HappyToHaveYou";
import CongratsOnSales from "./CongratsOnSales";
import UnfinishedTodos from "./UnfinishedTodos";
import CongratsFirstSale from "./CongratsFirstSale";
// import WishStoreAlmostReady from "./WishStoreAlmostReady";
import CongratsOnImpressions from "./CongratsOnImpressions";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Timedelta,
  MerchantStats,
  OnboardingSchema,
  FulfillmentSchema,
} from "@schema/types";

const GET_BANNER_DATA = gql`
  query GetBannerData {
    currentUser {
      onboarding {
        numStepsLeft
      }
    }
    currentMerchant {
      signupTime {
        timeSince {
          hours
        }
      }
      storeStats {
        totalWishes
        totalImpressions
      }
    }
    fulfillment {
      actionRequiredOrderCount
    }
  }
`;

type ResponseType = {
  readonly currentUser: {
    readonly onboarding: Pick<OnboardingSchema, "numStepsLeft"> | null;
  };
  readonly currentMerchant: {
    readonly signupTime: {
      readonly timeSince: Pick<Timedelta, "hours">;
    };
    readonly storeStats: Pick<MerchantStats, "totalImpressions">;
  };
  readonly fulfillment: Pick<FulfillmentSchema, "actionRequiredOrderCount">;
};

const MerchantHomeBanner: React.FC<BaseProps> = (props: BaseProps) => {
  const { data } = useQuery<ResponseType, void>(GET_BANNER_DATA);
  if (data == null) {
    return <BaseHomeBanner title="" />;
  }

  const {
    currentUser: { onboarding },
    currentMerchant: {
      signupTime: {
        timeSince: { hours: hoursSinceSignup },
      },
      storeStats: { totalImpressions },
    },
    fulfillment: { actionRequiredOrderCount },
  } = data;

  if (
    onboarding != null &&
    onboarding.numStepsLeft > 0 &&
    hoursSinceSignup > 24
  ) {
    return <UnfinishedTodos {...props} />;
  }

  if (actionRequiredOrderCount != null && actionRequiredOrderCount == 1) {
    return <CongratsFirstSale {...props} />;
  }

  if (actionRequiredOrderCount != null && actionRequiredOrderCount > 1) {
    return <CongratsOnSales {...props} />;
  }

  if (totalImpressions > 500) {
    return <CongratsOnImpressions {...props} />;
  }

  if (hoursSinceSignup < 14 * 24) {
    return <HappyToHaveYou {...props} />;
  }

  return <NoNewsToday {...props} />;
};

export default MerchantHomeBanner;
