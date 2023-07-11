import React from "react";
import { observer } from "mobx-react";
import { Card as LegoCard, H5, H5Props, Divider } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Accordion from "@infractions/components/Accordion";
import { AccordionProps } from "@mui/material/Accordion";

export type Props = Pick<BaseProps, "className" | "style"> & {
  readonly children: NonNullable<React.ReactNode>;
  readonly title: H5Props["children"];
  readonly asAccordion?: boolean;
  readonly accordionProps?: Partial<
    Omit<AccordionProps, "children" | "title" | "detailsSx">
  >;
};

const Card: React.FC<Props> = ({
  children,
  className,
  style,
  title,
  asAccordion,
  accordionProps,
}) => {
  const styles = useInfractionDetailsStylesheet();

  if (asAccordion) {
    return (
      <Accordion
        title={title}
        detailsSx={{ padding: "16px" }}
        {...accordionProps}
      >
        {children}
      </Accordion>
    );
  }
  return (
    <LegoCard style={[styles.cardRoot, className, style]}>
      <H5>{title}</H5>
      <Divider style={styles.divider} />
      {children}
    </LegoCard>
  );
};

export default observer(Card);
