import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";

const BrandDetailsCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { brandName, brandContactName, brandPhoneNumber, brandEmail },
  } = useContext(InfractionContext);

  return (
    <Card title={i`Brand Details`} style={[className, style]}>
      <Markdown text={i`Brand: ${brandName}`} style={styles.cardMargin} />
      <Markdown text={i`Name: ${brandContactName}`} style={styles.cardMargin} />
      <Markdown
        text={i`Phone Number: ${brandPhoneNumber}`}
        style={styles.cardMargin}
      />
      <Markdown text={i`Email: ${brandEmail}`} style={styles.cardMargin} />
    </Card>
  );
};

export default observer(BrandDetailsCard);
