import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import FulfillmentSpeedContent from "@performance/migrated/wss-order-metrics-components/ConfirmedFulfillmentSpeedPage";
import { ci18n } from "@core/toolkit/i18n";

const FulfillmentSpeedPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Confirmed Fulfillment Speed`, href: window.location.href },
        ]}
        title={i`Confirmed Fulfillment Speed`}
        relaxed
      >
        <Text>
          View the average time for an order to be confirmed fulfilled
        </Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <FulfillmentSpeedContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(FulfillmentSpeedPage);
