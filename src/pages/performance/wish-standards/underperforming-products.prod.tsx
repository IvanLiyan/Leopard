import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Card, Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { ci18n } from "@core/toolkit/i18n";
import UnderperformingProductsHeader from "@performance/components/underperforming-products/UnderperformingProductsHeader";
import UnderperformingProductsPerformanceScale from "@performance/components/underperforming-products/UnderperformingProductsPerformanceScale";
import UnderperformingProductsTable from "@performance/components/underperforming-products/UnderperformingProductsTable";
import TierPreviewBanner from "@performance/components/wish-standards/TierPreviewBanner";

const UnderperformingProductsPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Underperforming Products`, href: window.location.href },
        ]}
        title={i`Underperforming Products`}
        relaxed
      >
        <Text>
          View the share of products ordered in the last 90 days with high
          product quality refunds and low ratings
        </Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <Card sx={{ padding: "20px 24px 24px 24px" }}>
          <TierPreviewBanner sx={{ margin: "4px 0px 24px 0px" }} />
          <UnderperformingProductsHeader />
          <UnderperformingProductsPerformanceScale />
          <UnderperformingProductsTable />
        </Card>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(UnderperformingProductsPage);
