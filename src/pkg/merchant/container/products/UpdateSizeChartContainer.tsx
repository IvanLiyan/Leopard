import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";

/* Merchant Components */
import SizeChart from "@merchant/component/products/size-chart/SizeChart";

/* Merchant API */
import * as sizeChartApi from "@merchant/api/size-chart";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { useStringQueryParam } from "@toolkit/url";

const UpdateSizeChartContainer = () => {
  const [query] = useStringQueryParam("q");
  const [response] = useRequest(
    sizeChartApi.getSizeChart({ sizechart: query })
  );

  if (!response?.data) {
    return <LoadingIndicator />;
  }
  return (
    <PageGuide>
      <SizeChart isCreate={false} sizeChart={response?.data} />
    </PageGuide>
  );
};

export default observer(UpdateSizeChartContainer);
