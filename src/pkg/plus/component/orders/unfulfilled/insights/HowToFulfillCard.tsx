import React from "react";
import { observer } from "mobx-react";

import { zendeskURL } from "@toolkit/url";

import FulfullmentInsightCard, {
  FulfullmentInsightCardProps,
} from "./FulfullmentInsightCard";

type Props = Omit<FulfullmentInsightCardProps, "illustration">;

const HowToFulfillCard: React.FC<Props> = (props: Props) => {
  return (
    <FulfullmentInsightCard
      {...props}
      link={zendeskURL("360050728714")}
      illustration="fulfillmentChecklistWithBox"
    >
      How do I fulfill Wish orders?
    </FulfullmentInsightCard>
  );
};

export default observer(HowToFulfillCard);
