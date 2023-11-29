import React from "react";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@core/components/Stepper";
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
      content: (
        <Text>
          Visit
          <Link
            href={merchFeUrl(`/md/products`)}
            underline
            openInNewTab
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
              color: "#1E1E1C",
            }}
          >
            Product listing
          </Link>
          page
        </Text>
      ),
    },
    {
      label: ci18n(
        "The steps of how to disable underperforming products to avoid listing fees",
        "Step 2",
      ),
      content: i`Click on the download button and select “CSV for underperforming products” `,
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
        <Text>
          Go to the
          <Link
            href={merchFeUrl(`/md/products/csv`)}
            underline
            openInNewTab
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
              color: "#1E1E1C",
            }}
          >
            CSV management
          </Link>
          page
        </Text>
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
      content: (
        <Text>
          Go to the
          <Link
            href={merchFeUrl(`/products/csv-history`)}
            underline
            openInNewTab
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
              color: "#1E1E1C",
            }}
          >
            CSV status
          </Link>
          page to check the process
        </Text>
      ),
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
