import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";

const BrandDetailsCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { brand },
  } = useContext(InfractionContext);

  if (!brand) {
    return null;
  }

  const { brandName, brandContactName, brandPhoneNumber, brandEmail } = brand;

  if (!brandName && !brandContactName && !brandPhoneNumber && !brandEmail) {
    return null;
  }

  return (
    <Card
      title={ci18n("card title", "Brand Details")}
      style={[className, style]}
    >
      {brandName && (
        <Markdown text={i`Brand: ${brandName}`} style={styles.cardMargin} />
      )}
      {brandContactName && (
        <Markdown
          text={i`Name: ${brandContactName}`}
          style={styles.cardMargin}
        />
      )}
      {brandPhoneNumber && (
        <Markdown
          text={i`Phone Number: ${brandPhoneNumber}`}
          style={styles.cardMargin}
        />
      )}
      {brandEmail && (
        <Markdown text={i`Email: ${brandEmail}`} style={styles.cardMargin} />
      )}
    </Card>
  );
};

export default observer(BrandDetailsCard);
