import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";

const BrandDetailsCard: React.FC<Omit<CardProps, "title" | "children">> = (
  props,
) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { brand, type },
  } = useInfractionContext();

  if (!brand || type === "REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER") {
    return null;
  }

  const { brandName, brandContactName, brandPhoneNumber, brandEmail } = brand;

  if (!brandName && !brandContactName && !brandPhoneNumber && !brandEmail) {
    return null;
  }

  return (
    <Card title={ci18n("card title", "Brand Details")} {...props}>
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
