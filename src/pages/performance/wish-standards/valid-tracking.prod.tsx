import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import ValidTrackingContent from "@performance/migrated/wss-order-metrics-components/ValidTrackingRatePage";
import { ci18n } from "@core/toolkit/i18n";

const ValidTrackingPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Valid Tracking Rate`, href: window.location.href },
        ]}
        title={i`Valid Tracking Rate`}
        relaxed
      >
        <Text>
          View the share of &apos;marked shipped&apos; orders that are
          &apos;confirmed shipped&apos;
        </Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <ValidTrackingContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(ValidTrackingPage);
