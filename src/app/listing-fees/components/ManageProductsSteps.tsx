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
        <Text style={{ fontSize: 16 }}>
          {ci18n("Visit Product listing page", "Visit")}
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
            {ci18n("Visit Product listing page", "Product listing")}
          </Link>
          {ci18n("Visit Product listing page", "page")}
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
        <Text style={{ fontSize: 16 }}>
          {ci18n("Go to the CSV management page", "Go to the")}
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
            {ci18n("Go to the CSV management page", "CSV management")}
          </Link>
          {ci18n("Go to the CSV management page", "page")}
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
        <Text style={{ fontSize: 16 }}>
          {ci18n("Go to the CSV status page to check the process", "Go to the")}
          <Link
            href={merchFeUrl(`/md/products/csv-history`)}
            underline
            openInNewTab
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
              color: "#1E1E1C",
            }}
          >
            {ci18n(
              "Go to the CSV status page to check the process",
              "CSV status",
            )}
          </Link>
          {ci18n(
            "Go to the CSV status page to check the process",
            "page to check the process",
          )}
        </Text>
      ),
    },
  ];

  return (
    <ListingFeesSection
      title={i`Manage underperforming products`}
      subtitle={() => (
        <Text style={{ fontSize: 16 }}>
          {i`How to disable underperforming products to minimize or avoid listing fees`}
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
              <StepContent
                style={{
                  textAlign: "center",
                  fontFamily: "Proxima-Regular,Arial,sans-serif",
                }}
              >
                {step.content}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </ListingFeesSection>
  );
};

export default ManageProductsSteps;
