import { NextPage } from "next";
import React from "react";
import { observer } from "mobx-react";
import { Alert } from "@ContextLogic/lego";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import { merchFeUrl } from "@core/toolkit/router";
import PageHeader from "@core/components/PageHeader";
import AverageFulfillmentTimeModel from "src/app/performance-cn/components/customer-experience-graphs/AverageFulfillmentTimeModel";
import RefundRateModel from "src/app/performance-cn/components/customer-experience-graphs/RefundRateModel";
import AverageShippingTimeModel from "src/app/performance-cn/components/customer-experience-graphs/AverageShippingTimeModel";
import AverageShippingDelayModel from "src/app/performance-cn/components/customer-experience-graphs/AverageShippingDelayModel";
import AverageRatingModel from "src/app/performance-cn/components/customer-experience-graphs/AverageRatingModel";

const CustomerExperienceGraphsPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeUrl("/home") },
          { name: i`Performance`, href: merchFeUrl("/performance-overview") },
          { name: i`Customer Experience Graph`, href: window.location.href },
        ]}
        title={i`Customer Experience Graph`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <AverageFulfillmentTimeModel />
        <RefundRateModel />
        <AverageShippingTimeModel />
        <AverageShippingDelayModel />
        <AverageRatingModel />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(CustomerExperienceGraphsPage);
