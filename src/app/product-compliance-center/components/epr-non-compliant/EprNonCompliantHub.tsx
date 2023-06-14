import React from "react";
import { observer } from "mobx-react";
import { Card } from "@ContextLogic/atlas-ui";
import EprNonCompliantSummaryArea from "./EprNonCompliantSummaryArea";
import EprNonCompliantProductsArea from "./EprNonCompliantProductsArea";

const EprNonCompliantHub: React.FC = () => {
  return (
    <Card
      sx={{
        marginTop: "24px",
        padding: "24px",
      }}
    >
      <EprNonCompliantSummaryArea />
      <EprNonCompliantProductsArea />
    </Card>
  );
};

export default observer(EprNonCompliantHub);
