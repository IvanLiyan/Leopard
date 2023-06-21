import React from "react";
import { observer } from "mobx-react";
import { Card, Alert, Text } from "@ContextLogic/atlas-ui";
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
      <Alert
        severity="warning"
        sx={{
          marginBottom: "24px",
        }}
      >
        <Text>
          Due to an upcoming product categorization update, there may be some
          changes to the Extended Producer Responsibility (EPR) categories for
          your products shipping to EPR regions starting August 27, 2023, UTC.
        </Text>
        <Text>
          To comply, you must submit EPR registration numbers for these
          categories to Wish before this date or risk products in these
          categories being blocked for sale in applicable EPR countries.
        </Text>
      </Alert>
      <EprNonCompliantSummaryArea />
      <EprNonCompliantProductsArea />
    </Card>
  );
};

export default observer(EprNonCompliantHub);
