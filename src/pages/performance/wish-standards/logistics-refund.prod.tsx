import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import LogisticsRefundContent from "@performance/migrated/wss-order-metrics-components/LogisticsRefundRatePage";
import { ci18n } from "@core/toolkit/i18n";

const LogisticsRefundPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Logistics Refund Rate`, href: window.location.href },
        ]}
        title={i`Logistics Refund Rate`}
        relaxed
      >
        <Text>
          View the share of orders refunded due to fulfillment related reasons
        </Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <LogisticsRefundContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(LogisticsRefundPage);
