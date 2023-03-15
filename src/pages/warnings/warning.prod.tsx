import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { Layout } from "@ContextLogic/lego";
import { useStringQueryParam } from "@core/toolkit/url";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import InfractionDetailsCard from "@infractions/components/cards/InfractionDetailsCard";
import InfractionImpactCard from "@infractions/components/cards/InfractionImpactCard";
import OrderDetailsCard from "@infractions/components/cards/OrderDetailsCard";
import ProductListingDetailsCard from "@infractions/components/cards/ProductListingDetailsCard";
import BrandDetailsCard from "@infractions/components/cards/BrandDetailsCard";
import InfractionEvidenceCard from "@infractions/components/cards/InfractionEvidenceCard";
import FixesCard from "@infractions/components/cards/FixesCard";
import RequestPaymentCard from "@infractions/components/cards/RequestPaymentCard";
import MessagesCard from "@infractions/components/cards/MessagesCard";
import { useInfractionProvider } from "@infractions/InfractionContext";
import { Text } from "@ContextLogic/atlas-ui";
import { useUserStore } from "@core/stores/UserStore";
import Skeleton from "@core/components/Skeleton";
import ErrorBoundary from "@core/components/ErrorBoundary";

const PageLayout = ({
  columns,
}: {
  columns: ReadonlyArray<React.ReactNode>;
}) => {
  const styles = useInfractionDetailsStylesheet();

  return (
    <PageRoot>
      <PageHeader relaxed title={i`Infraction Details`} />
      <PageGuide relaxed contentContainerStyle={styles.detailsContent}>
        {columns.map((col, i) => {
          return (
            <Layout.FlexColumn key={i} style={styles.column}>
              {col}
            </Layout.FlexColumn>
          );
        })}
      </PageGuide>
    </PageRoot>
  );
};

const InfractionDetailsPage: NextPage<Record<string, never>> = () => {
  const [infractionId] = useStringQueryParam("id");
  const { merchantId } = useUserStore();

  const { InfractionProvider, loading, error } = useInfractionProvider({
    infractionId,
    merchantId,
  });

  if (loading) {
    return (
      <PageLayout
        columns={[
          <>
            <Skeleton height={294} />
            <Skeleton height={175} />
            <Skeleton height={460} />
          </>,
          <>
            <Skeleton height={640} />
            <Skeleton height={738} />
          </>,
        ]}
      />
    );
  }

  if (error) {
    return (
      <PageLayout
        columns={[
          <Text key={1} variant="bodyLStrong">
            Something went wrong.
          </Text>,
        ]}
      />
    );
  }

  return (
    <InfractionProvider>
      <PageLayout
        columns={[
          <>
            <InfractionDetailsCard />
            <InfractionImpactCard />
            <OrderDetailsCard />
            <ProductListingDetailsCard />
            <BrandDetailsCard />
            <InfractionEvidenceCard />
          </>,
          <>
            <FixesCard />
            <RequestPaymentCard />
            <ErrorBoundary>
              <MessagesCard />
            </ErrorBoundary>
          </>,
        ]}
      />
    </InfractionProvider>
  );
};

export default observer(InfractionDetailsPage);
