import React, { useMemo } from "react";
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
import BrandedProductGeoblockDispute from "@infractions/components/disputes/BrandedProductGeoblockDispute";
import CounterfeitDispute from "@infractions/components/disputes/CounterfeitDispute";
import InappropriateContentDispute from "@infractions/components/disputes/InappropriateContentDispute";
import MisleadingListingDispute from "@infractions/components/disputes/MisleadingListingDispute";
import Orders from "@infractions/components/disputes/Orders";
import {
  BulkDisputeContextProvider,
  useBulkDisputeInfractionIds,
} from "@infractions/DisputeContext";
import { RichTextBanner } from "@ContextLogic/lego";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const styles = useInfractionDetailsStylesheet();
  const warningDescriptionNode = () => {
    return (
      <div>
        {i`If the order has been delivered, please make sure to fill in the "Confirmed fulfillment date from shipping carrier" and "Confirmed delivered date from shipping carrier" to release the payment. `}
        <br />
        {i`If the order hasn’t been delivered yet, please try to dispute the possible upcoming Order-Not-Delivered Infraction to fill in the confirmed delivered date. `}
        <br />
        {i`If the order’s payment is still ineligible, please reach out to your Account Manager.`}
      </div>
    );
  };
  return (
    <PageRoot>
      <PageHeader title={i`Dispute Infraction`} />
      <PageGuide contentContainerStyle={styles.disputeContent}>
        <RichTextBanner
          description={warningDescriptionNode}
          sentiment="warning"
          title={""}
        />
        {children}
      </PageGuide>
    </PageRoot>
  );
};

const InfractionsPage: NextPage<Record<string, never>> = () => {
  const [infractionId] = useStringQueryParam("id");
  const { merchantId } = useUserStore();

  const [bulkInfractionIds] = useBulkDisputeInfractionIds();

  const { InfractionProvider, loading, error, infractionContext } =
    useInfractionProvider({
      infractionId: infractionId || bulkInfractionIds[0],
      merchantId,
    });

  const disputeFlowComponent = useMemo(() => {
    const disputeFlowToComponent: {
      readonly [flow in DisputeFlow]: JSX.Element;
    } = {
      MERCHANT: <MerchantLevelDispute />,
      BRANDED_PRODUCT_GEOBLOCK: <BrandedProductGeoblockDispute />,
      COUNTERFEIT: <CounterfeitDispute />,
      INAPPROPRIATE_CONTENT: <InappropriateContentDispute />,
      MISLEADING_LISTING: <MisleadingListingDispute />,
      ORDER: <Orders />,
    };

    return infractionContext?.disputeFlow ? (
      disputeFlowToComponent[infractionContext.disputeFlow]
    ) : (
      <Text variant="bodyLStrong">Something went wrong.</Text>
    );
  }, [infractionContext?.disputeFlow]);

  if (loading) {
    return (
      <PageLayout>
        <Skeleton height={48} sx={{ marginBottom: "24px" }} />
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
      <BulkDisputeContextProvider>
        <PageLayout>
          <InfractionDetailsCard
            asAccordion
            accordionProps={{ expanded: !infractionId }}
          />
          <OrderDetailsCard
            asAccordion
            accordionProps={{ expanded: !infractionId }}
          />
          <ProductListingDetailsCard
            asAccordion
            accordionProps={{ expanded: !infractionId }}
          />
          <BrandDetailsCard
            asAccordion
            accordionProps={{ expanded: !infractionId }}
          />
          <InfractionEvidenceCard
            asAccordion
            accordionProps={{ expanded: !infractionId }}
          />
          {disputeFlowComponent}
        </PageLayout>
      </BulkDisputeContextProvider>
    </InfractionProvider>
  );
};

export default observer(InfractionsPage);
