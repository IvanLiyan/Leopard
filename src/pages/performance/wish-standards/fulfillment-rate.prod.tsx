import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import FulfillmentRateContent from "@performance/migrated/wss-order-metrics-components/OrderFulfillmentRatePage";
import { ci18n } from "@core/toolkit/i18n";

const FulfillmentRatePage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Order Fulfillment Rate`, href: window.location.href },
        ]}
        title={i`Order Fulfillment Rate`}
        relaxed
      >
        <Text>View the share of orders successfully fulfilled</Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <FulfillmentRateContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(FulfillmentRatePage);
