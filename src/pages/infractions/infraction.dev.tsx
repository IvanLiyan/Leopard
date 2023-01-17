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
import MessagesCard from "@infractions/components/cards/MessagesCard";

const InfractionsPage: NextPage<Record<string, never>> = () => {
  const styles = useInfractionDetailsStylesheet();
  const [infractionId] = useStringQueryParam("id");

  return (
    <PageRoot>
      <PageHeader relaxed title={i`Infraction Details`} />
      <PageGuide relaxed contentContainerStyle={styles.content}>
        <Layout.FlexColumn style={styles.column}>
          <InfractionDetailsCard infractionId={infractionId} />
          <InfractionImpactCard infractionId={infractionId} />
          <OrderDetailsCard infractionId={infractionId} />
          <ProductListingDetailsCard infractionId={infractionId} />
          <BrandDetailsCard infractionId={infractionId} />
          <InfractionEvidenceCard infractionId={infractionId} />
        </Layout.FlexColumn>
        <Layout.FlexColumn style={styles.column}>
          <FixesCard infractionId={infractionId} />
          <MessagesCard infractionId={infractionId} />
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(InfractionsPage);
