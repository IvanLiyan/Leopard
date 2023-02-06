import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { Layout } from "@ContextLogic/lego";
import { useStringQueryParam } from "@core/toolkit/url";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import InfractionDetailsCard from "@infractions/components/cards/InfractionDetailsCard";
import InfractionImpactCard from "@infractions/components/cards/InfractionImpactCard";
import OrderDetailsCard from "@infractions/components/cards/OrderDetailsCard";
import ProductListingDetailsCard from "@infractions/components/cards/ProductListingDetailsCard";
import BrandDetailsCard from "@infractions/components/cards/BrandDetailsCard";
import InfractionEvidenceCard from "@infractions/components/cards/InfractionEvidenceCard";
import FixesCard from "@infractions/components/cards/FixesCard";
import RequestPaymentCard from "@infractions/components/cards/RequestPaymentCard";
import MessagesCard from "@infractions/components/cards/MessagesCard";

const InfractionsPage: NextPage<Record<string, never>> = () => {
  const styles = useInfractionDetailsStylesheet();
  const [infractionId] = useStringQueryParam("id");
  void infractionId; // TODO: will use to populate InfractionContext.Provider during GQL integration

  return (
    <PageRoot>
      <PageHeader relaxed title={i`Infraction Details`} />
      <PageGuide relaxed contentContainerStyle={styles.content}>
        <Layout.FlexColumn style={styles.column}>
          <InfractionDetailsCard />
          <InfractionImpactCard />
          <OrderDetailsCard />
          <ProductListingDetailsCard />
          <BrandDetailsCard />
          <InfractionEvidenceCard />
        </Layout.FlexColumn>
        <Layout.FlexColumn style={styles.column}>
          <FixesCard />
          <RequestPaymentCard />
          <MessagesCard />
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(InfractionsPage);
