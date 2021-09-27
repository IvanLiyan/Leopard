import React from "react";
import { observer } from "mobx-react";

import { zendeskURL } from "@toolkit/url";

import FulfullmentInsightCard, {
  FulfullmentInsightCardProps,
} from "./FulfullmentInsightCard";

type Props = Omit<FulfullmentInsightCardProps, "illustration">;

const FulfillmentSLACard: React.FC<Props> = (props: Props) => {
  return (
    <FulfullmentInsightCard
      {...props}
      link={zendeskURL("360051621873")}
      illustration="notepadList"
    >
      When do I need to fulfill orders by?
    </FulfullmentInsightCard>
  );
};

export default observer(FulfillmentSLACard);
