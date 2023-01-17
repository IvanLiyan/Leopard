import React from "react";
import { observer } from "mobx-react";
import { Markdown } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const BrandDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: { brandName, brandContactName, brandPhoneNumber, brandEmail },
  } = useInfraction(infractionId);

  return (
    <Card title={i`Brand Details`} style={[className, style]}>
      <Markdown text={i`Brand: ${brandName}`} style={styles.cardItem} />
      <Markdown text={i`Name: ${brandContactName}`} style={styles.cardItem} />
      <Markdown
        text={i`Phone Number: ${brandPhoneNumber}`}
        style={styles.cardItem}
      />
      <Markdown text={i`Email: ${brandEmail}`} style={styles.cardItem} />
    </Card>
  );
};

export default observer(BrandDetailsCard);
