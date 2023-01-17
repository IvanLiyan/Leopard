import React from "react";
import { observer } from "mobx-react";
import { Layout } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const InfractionDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const { data } = useInfraction(infractionId);
  void data;

  return (
    <Card title={i`Messages`} style={[className, style]}>
      <Layout.FlexColumn
        justifyContent="center"
        alignItems="center"
        style={[styles.bodyText, { minHeight: 100 }]}
      >
        {"Messages Go Here"}
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(InfractionDetailsCard);
