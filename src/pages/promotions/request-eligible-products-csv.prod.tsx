import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { Card, Heading } from "@ContextLogic/atlas-ui";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@core/components/Stepper";
import { ci18n } from "@core/toolkit/i18n";
import { merchFeUrl } from "@core/toolkit/router";
import SelectPromotionSection from "@promotions/eligible-products-csv/components/SelectPromotionSection";
import SubmitRequestSection from "@promotions/eligible-products-csv/components/SubmitRequestSection";
import { StateProvider } from "@promotions/eligible-products-csv/StateContext";

const RequestEligibleProductsCsvPage: NextPage<Record<string, never>> = () => {
  const steps = [
    {
      key: "SELECT_TYPE",
      label: ci18n("label for a section of the UI", "Select Promotion Type"),
      content: <SelectPromotionSection />,
    },
    {
      key: "SUBMIT_REQUEST",
      label: ci18n("label for a section of the UI", "Submit Request"),
      content: <SubmitRequestSection />,
    },
  ];

  return (
    <StateProvider>
      <PageRoot>
        <PageHeader
          relaxed
          title={i`Request CSV of Eligible Products for Promotions`}
          breadcrumbs={[
            {
              name: i`Promotions`,
              href: merchFeUrl("/merchant-promotions"),
            },
            {
              name: i`Request CSV of Eligible Products for Promotions`,
              href: window.location.href,
            },
          ]}
        />
        <PageGuide relaxed>
          <Card sx={{ marginTop: "24px", padding: "24px" }}>
            <Stepper orientation="vertical">
              {steps.map((step) => {
                return (
                  <Step key={step.key} active>
                    <StepLabel>
                      <Heading variant="h3">{step.label}</Heading>
                    </StepLabel>
                    <StepContent>{step.content}</StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Card>
        </PageGuide>
      </PageRoot>
    </StateProvider>
  );
};

export default observer(RequestEligibleProductsCsvPage);
