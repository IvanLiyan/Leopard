import React from "react";
import { observer } from "mobx-react";
import { Card as LegoCard, H5, H5Props, Divider } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Accordion from "@infractions/components/Accordion";

export type Props = Pick<BaseProps, "className" | "style"> & {
  readonly children: NonNullable<React.ReactNode>;
  readonly title: H5Props["children"];
  readonly asAccordion?: boolean;
};

const Card: React.FC<Props> = ({
  children,
  className,
  style,
  title,
  asAccordion,
}) => {
  const styles = useInfractionDetailsStylesheet();

  if (asAccordion) {
    return (
      <Accordion title={title} detailsSx={{ padding: "16px" }}>
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
