import React, { useEffect, useMemo } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useStringQueryParam } from "@core/toolkit/url";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { useInfractionProvider } from "@infractions/InfractionContext";
import { Text } from "@ContextLogic/atlas-ui";
import { useUserStore } from "@core/stores/UserStore";
import Skeleton from "@core/components/Skeleton";
import InfractionDetailsCard from "@infractions/components/cards/InfractionDetailsCard";
import BrandDetailsCard from "@infractions/components/cards/BrandDetailsCard";
import InfractionEvidenceCard from "@infractions/components/cards/InfractionEvidenceCard";
import OrderDetailsCard from "@infractions/components/cards/OrderDetailsCard";
import ProductListingDetailsCard from "@infractions/components/cards/ProductListingDetailsCard";
import MerchantLevelDispute from "@infractions/components/disputes/MerchantLevelDispute";
import { DisputeFlow } from "@infractions/toolkit";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { merchFeURL } from "@core/toolkit/router";
import BrandedProductGeoblockDispute from "@infractions/components/disputes/BrandedProductGeoblockDispute";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const styles = useInfractionDetailsStylesheet();

  return (
    <PageRoot>
      <PageHeader title={i`Dispute Infraction`} />
      <PageGuide contentContainerStyle={styles.disputeContent}>
        {children}
      </PageGuide>
    </PageRoot>
  );
};

const InfractionsPage: NextPage<Record<string, never>> = () => {
  const [infractionId] = useStringQueryParam("id");
  const { merchantId } = useUserStore();
  const navigationStore = useNavigationStore();

  const { InfractionProvider, loading, error, infractionContext } =
    useInfractionProvider({
      infractionId,
      merchantId,
    });

  const disputeFlowComponent = useMemo(() => {
    const disputeFlowToComponent: {
      readonly [flow in DisputeFlow]: JSX.Element;
    } = {
      MERCHANT: <MerchantLevelDispute />,
      BRANDED_PRODUCT_GEOBLOCK: <BrandedProductGeoblockDispute />,
      LEGACY: <></>,
    };

    return disputeFlowToComponent[infractionContext?.disputeFlow || "LEGACY"];
  }, [infractionContext?.disputeFlow]);

  useEffect(() => {
    if (infractionContext?.disputeFlow === "LEGACY") {
      void navigationStore.navigate(
        merchFeURL(`/dispute-infraction/${infractionId}`),
      );
    }
  }, [navigationStore, infractionContext?.disputeFlow, infractionId]);

  if (loading) {
    return (
      <PageLayout>
        <Skeleton height={48} sx={{ marginBottom: "24px" }} />
        <Skeleton height={48} sx={{ marginBottom: "24px" }} />
        <Skeleton height={460} />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Text variant="bodyLStrong">Something went wrong.</Text>
      </PageLayout>
    );
  }

  return (
    <InfractionProvider>
      <PageLayout>
        <InfractionDetailsCard asAccordion />
        <OrderDetailsCard asAccordion />
        <ProductListingDetailsCard asAccordion />
        <BrandDetailsCard asAccordion />
        <InfractionEvidenceCard asAccordion />
        {disputeFlowComponent}
      </PageLayout>
    </InfractionProvider>
  );
};

export default observer(InfractionsPage);
