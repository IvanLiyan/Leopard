import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import UserRatingContent from "@performance/migrated/wss-order-metrics-components/UserRatingPage";
import { ci18n } from "@core/toolkit/i18n";

const UserRatingPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        breadcrumbs={[
          {
            name: ci18n("Wish Standards", "Wish Standards"),
            href: "/performance?tab=wish-standards",
          },
          { name: i`Average User Rating`, href: window.location.href },
        ]}
        title={i`Average User Rating`}
        relaxed
      >
        <Text>View the average of product ratings on your orders</Text>
      </PageHeader>
      <PageGuide relaxed style={{ marginTop: "32px" }}>
        <UserRatingContent />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(UserRatingPage);
