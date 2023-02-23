import React from "react";
import { observer } from "mobx-react";
import { Card as LegoCard, H5, H5Props, Divider } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "children" | "className" | "style"> & {
  readonly title: H5Props["children"];
};

const Card: React.FC<Props> = ({ children, className, style, title }) => {
  const styles = useInfractionDetailsStylesheet();
  return (
    <LegoCard style={[styles.cardRoot, className, style]}>
      <H5>{title}</H5>
      <Divider style={styles.divider} />
      {children}
    </LegoCard>
  );
};

export default observer(Card);
