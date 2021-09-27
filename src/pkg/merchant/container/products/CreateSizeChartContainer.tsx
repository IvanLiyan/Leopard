import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";

/* Merchant Components */
import SizeChart from "@merchant/component/products/size-chart/SizeChart";

const CreateSizeChartContainer = () => {
  return (
    <PageGuide>
      <SizeChart isCreate />
    </PageGuide>
  );
};

export default observer(CreateSizeChartContainer);
