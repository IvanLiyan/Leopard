import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import CustomerServiceAggregateModel from "@performance/components/customer-service/CustomerServiceAggregateModel";

const CustomerServicePerformance: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <CustomerServiceAggregateModel />
    </PageRoot>
  );
};

export default observer(CustomerServicePerformance);
