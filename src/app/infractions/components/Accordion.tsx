import React from "react";
import { observer } from "mobx-react";
import { Heading, HeadingProps } from "@ContextLogic/atlas-ui";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails, {
  AccordionDetailsProps,
} from "@mui/material/AccordionDetails";
import { useTheme } from "@core/stores/ThemeStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type Props = Omit<AccordionProps, "children" | "title"> & {
  readonly children: NonNullable<React.ReactNode>;
  readonly title: HeadingProps["children"];
  readonly detailsSx?: AccordionDetailsProps["sx"];
};

const Accordion: React.FC<Props> = ({
  children,
  title,
  detailsSx = {},
  ...props
}) => {
  const { surfaceLight, borderPrimary } = useTheme();

  return (
    // extra div required to break link between different accordions
    <div>
      <MuiAccordion
        variant="outlined"
        sx={{ borderColor: borderPrimary }}
        {...props}
      >
        <AccordionSummary
          sx={{
            backgroundColor: surfaceLight,
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Heading variant="h4">{title}</Heading>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: 0,
            borderTop: `1px solid ${borderPrimary}`,
            ...detailsSx,
          }}
        >
          {children}
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
};

export default observer(Accordion);
