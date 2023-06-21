import { useQuery } from "@apollo/client";
import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ThingsToWatchSection from "./things-to-watch/ThingsToWatchSection";
import TierSection from "./tier/TierSection";
import InfractionsSection from "./infractions/InfractionsSection";
import {
  MerchantScoreResponseData,
  MERCHANT_SCORE_QUERY,
  PerformanceHealthInitialData,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import CustomerService from "./CustomerService";
import PerformanceMetrics from "./PerformanceMetrics";
import TierDetails from "./TierDetails";
import WssBanner from "./WssBanner";
import Skeleton from "@core/components/Skeleton";
import TierPreviewBanner from "@performance/components/wish-standards/TierPreviewBanner";

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const Dashboard: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, initialData } = props;
  const {
    currentMerchant: { storeStats, state },
  } = initialData;

  const { data, loading } = useQuery<MerchantScoreResponseData, never>(
    MERCHANT_SCORE_QUERY,
    {
      fetchPolicy: "no-cache",
    },
  );

  const wssDetails = data?.currentMerchant.wishSellerStandard;

  if (loading) {
    return <Skeleton height={1920} />;
  }

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <TierPreviewBanner />
      <WssBanner merchantState={state} wssDetails={wssDetails} />
      <Layout.GridRow templateColumns={"auto auto"} gap={16}>
        <TierSection merchantState={state} wssDetails={wssDetails} />
        <ThingsToWatchSection wssDetails={wssDetails} />
      </Layout.GridRow>
      <PerformanceMetrics wssDetails={wssDetails} />
      <InfractionsSection wssDetails={wssDetails} />
      <TierDetails level={wssDetails?.level} />
      <CustomerService cs={storeStats?.cs} />
    </Layout.FlexColumn>
  );
};

export default observer(Dashboard);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 40,
        },
      }),
    [],
  );
};
