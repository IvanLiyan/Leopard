import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import RefundAggregateModel from "@performance/components/refund/RefundAggregateModel";

const PerformanceRefundPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <RefundAggregateModel />
    </PageRoot>
  );
};

export default observer(PerformanceRefundPage);
