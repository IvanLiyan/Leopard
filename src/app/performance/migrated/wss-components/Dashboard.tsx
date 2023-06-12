import { useQuery } from "@apollo/client";
import { Layout, LoadingIndicator } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ThingsToWatchSection from "./things-to-watch/ThingsToWatchSection";
import TierSection from "./tier/TierSection";
import InfractionsSection from "./infractions/InfractionsSection";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import {
  MerchantScoreResponseData,
  MERCHANT_SCORE_QUERY,
  PerformanceHealthInitialData,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import CustomerService from "./CustomerService";
import Infractions from "./Infractions";
import Overview from "./Overview";
import PerformanceMetrics from "./PerformanceMetrics";
import TierDetails from "./TierDetails";
import WssBanner from "./WssBanner";
import { useUserStore } from "@core/stores/UserStore";

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
  const { decision: wssInsights, isLoading: wssInsightsLoading } =
    useDeciderKey("wss_insights");
  const { isSu } = useUserStore();

  const wssDetails = data?.currentMerchant.wishSellerStandard;

  if (loading || wssInsightsLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <WssBanner
        merchantState={state}
        wssDetails={wssDetails}
        wssInsights={wssInsights || isSu}
      />
      {wssInsights || isSu ? (
        <Layout.GridRow templateColumns={"auto auto"} gap={16}>
          <TierSection merchantState={state} wssDetails={wssDetails} />
          <ThingsToWatchSection wssDetails={wssDetails} />
        </Layout.GridRow>
      ) : (
        <Overview initialData={initialData} wssDetails={wssDetails} />
      )}
      <PerformanceMetrics
        wssDetails={wssDetails}
        wssInsights={wssInsights || isSu}
      />
      {wssInsights || isSu ? (
        <InfractionsSection wssDetails={wssDetails} />
      ) : (
        <Infractions wssDetails={wssDetails} />
      )}
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
