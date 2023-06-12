import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import QualityRefundContent from "@performance/migrated/wss-order-metrics-components/ProductQualityRefundPage";
import { ci18n } from "@core/toolkit/i18n";

const QualityRefundPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Product Quality Refund`, href: window.location.href },
        ]}
        title={i`Product Quality Refund`}
        relaxed
      >
        <Text>View the share of orders refunded due to product quality</Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <QualityRefundContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(QualityRefundPage);
