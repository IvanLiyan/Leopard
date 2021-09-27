import React from "react";
import { observer } from "mobx-react";

import FulfullmentInsightCard, {
  FulfullmentInsightCardProps,
} from "./FulfullmentInsightCard";

type Props = Omit<FulfullmentInsightCardProps, "illustration">;

const FulfillmentPenaltyCard: React.FC<Props> = (props: Props) => {
  return (
    <FulfullmentInsightCard
      illustration="boxWithBlueRibbon"
      link="/policy/fulfillment#5.1"
      {...props}
    >
      Will unfulfilled orders receive penalties?
    </FulfullmentInsightCard>
  );
};

export default observer(FulfillmentPenaltyCard);
