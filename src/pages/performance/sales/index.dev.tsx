import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import SalesAggregateView from "@performance/components/sales/SalesAggregateModel";

const PerformanceSalesPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <SalesAggregateView />
    </PageRoot>
  );
};

export default observer(PerformanceSalesPage);
