import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WssMerchantLevelType, FeePolicyConfigSchema } from "@schema";
import { useQuery } from "@apollo/client";
import { gql } from "@gql";

/* Relative Imports */
import WssSection from "./WssSection";
import TierDetailsCard, { TierStatus } from "./TierDetailsCard";
import { getNewPerks } from "@performance/migrated/toolkit/perks";

type TierDetailsProps = BaseProps & {
  readonly level?: WssMerchantLevelType | null;
};

type PickedLevel = Extract<
  WssMerchantLevelType,
  "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
>;

const LISTING_FEE_POLICY_CONFIG = gql(`
query ListingFeePolicyConfig {
  currentMerchant {
    merchantListingFee {
      feePolicyConfig {
        wssTierLevel
        wssTierName
        freeThreshold
        excessItemUnitPrice {
          amount
          currencyCode
        }
      }
    }
  }
}
`);

type MerchantListingFeeResponse = {
  readonly currentMerchant: {
    readonly merchantListingFee: {
      readonly feePolicyConfig: ReadonlyArray<FeePolicyConfigSchema>;
    };
  };
};

const TierDetails: React.FC<TierDetailsProps> = (props) => {
  const { className, style, level } = props;
  const [newPerks, setNewPerks] = useState([50, 50, 200, 500, 1000, 2000]);

  const { data } = useQuery<MerchantListingFeeResponse>(
    LISTING_FEE_POLICY_CONFIG,
  );

  useEffect(() => {
    if (data) {
      const res =
        data?.currentMerchant?.merchantListingFee?.feePolicyConfig.map(
          (item) => item.freeThreshold,
        );
      setNewPerks(res);
    }
  }, [data]);

  const levelOrder: ReadonlyArray<PickedLevel> = [
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
  ];

  const styles = useStylesheet();

  const curLevelIdx = levelOrder.findIndex((curLevel) => curLevel === level);

  const getStatus = (idx: number): TierStatus => {
    if (idx < curLevelIdx) {
      return "ACHIEVED";
    } else if (idx === curLevelIdx) {
      return "CURRENT";
    }
    return "NOT_ACHIEVED";
  };

  return (
    <WssSection style={[className, style]} title={i`Tier Details`}>
      <Layout.GridRow
        templateColumns="repeat(4, 1fr)"
        smallScreenTemplateColumns="repeat(2, 1fr)"
        alignItems="flex-start"
        style={styles.body}
      >
        {levelOrder.map((level, idx) => (
          <TierDetailsCard
            key={level}
            level={level}
            status={getStatus(idx)}
            perks={getNewPerks(newPerks)[level]}
            isLast={idx === levelOrder.length - 1}
          />
        ))}
      </Layout.GridRow>
    </WssSection>
  );
};

export default observer(TierDetails);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          gap: 16,
        },
      }),
    [],
  );
};
