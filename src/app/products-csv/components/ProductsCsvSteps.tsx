import React from "react";
import { observer } from "mobx-react";
import DownloadTemplateSection from "./DownloadTemplateSection";
import TemplateInfoSection from "./TemplateInfoSection";
import UploadTemplateSection from "./UploadTemplateSection";
import { Heading } from "@ContextLogic/atlas-ui";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@core/components/Stepper";

const ProductsCsvSteps: React.FC = () => {
  const steps = [
    {
      label: i`Build and download a custom template`,
      content: <DownloadTemplateSection />,
    },
    {
      label: i`Fill in the template`,
      content: <TemplateInfoSection />,
    },
    {
      label: i`Upload completed CSV template`,
      content: <UploadTemplateSection />,
    },
  ];

  return (
    <Stepper orientation="vertical">
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
  );
};

export default observer(ProductsCsvSteps);
