import React from "react";
import { Heading } from "@ContextLogic/atlas-ui";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@core/components/Stepper";
import { Text } from "@ContextLogic/lego";
import ListingFeesSection from "./ListingFeesSection";
import { ci18n } from "@core/toolkit/i18n";
import Link from "@deprecated/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
const ManageProductsSteps: React.FC = () => {
  const steps = [
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 1",
      ),
      content: i`Visit Product listing page`,
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 2",
      ),
      content: `Click on the download button and select “CSV for underperforming products `,
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 3",
      ),
      content: i`Change the “Enabled” column value to “No” `,
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 4",
      ),
      content: (
        <div>
          Go to the
          <Link
            href={merchFeUrl(`/md/products/csv-download-center`)}
            underline
            openInNewTab
            style={{
              fontWeight: "bold",
              marginLeft: 10,
              marginRight: 10,
              color: "#1E1E1C",
            }}
          >
            CSV management
          </Link>
          page,
        </div>
      ),
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 5",
      ),
      content: i`Upload the updated CSV file`,
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 6",
      ),
      content: i`Go to the CSV status page to check the process`,
    },
  ];

  return (
    <ListingFeesSection
      title={i`Manage under-performing products`}
      subtitle={() => (
        <Text>
          {i`How to disable under-performing products using CSV to avoid listing fees`}
        </Text>
      )}
    >
      <Stepper
        orientation="horizontal"
        alternativeLabel
        style={{ marginTop: 40 }}
      >
        {steps.map((step) => {
          return (
            <Step key={step.label} active>
              <StepLabel>
                <Heading variant="h3">{step.label}</Heading>
              </StepLabel>
              <StepContent>{step.content}</StepContent>
            </Step>
          );
        })}
      </Stepper>
    </ListingFeesSection>
  );
};

export default ManageProductsSteps;
