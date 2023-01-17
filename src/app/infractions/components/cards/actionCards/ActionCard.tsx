import React from "react";
import { observer } from "mobx-react";
import { Card as LegoCard, H6, H6Props, Layout } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "children" | "className" | "style"> & {
  readonly title: H6Props["children"];
  readonly ctaButtons?: React.ReactFragment;
};

const ActionCard: React.FC<Props> = ({
  children,
  className,
  style,
  title,
  ctaButtons,
}) => {
  const styles = useInfractionDetailsStylesheet();
  return (
    <LegoCard style={[styles.cardRoot, className, style]}>
      <H6 style={{ paddingBottom: 12 }}>{title}</H6>
      {children}
      {ctaButtons && (
        <Layout.FlexRow justifyContent="flex-end">{ctaButtons}</Layout.FlexRow>
      )}
    </LegoCard>
  );
};

export default observer(ActionCard);
