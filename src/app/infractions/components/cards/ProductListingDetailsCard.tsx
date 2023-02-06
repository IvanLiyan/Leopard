import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { Layout } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Image from "@core/components/Image";
import { InfractionContext } from "@infractions/InfractionContext";

const ProductListingDetailsCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: {
      productImageUrl,
      productName,
      productId,
      sku,
      productDescription,
    },
  } = useContext(InfractionContext);

  return (
    <Card title={i`Product Listing Details`} style={[className, style]}>
      <Layout.FlexRow>
        <Image
          src={productImageUrl}
          style={{ width: 96, height: 96, marginRight: 12 }}
          alt={i`product image`}
        />
        <Layout.FlexColumn>
          <Markdown
            text={i`Product Name: **${productName}**`}
            style={styles.cardMargin}
          />
          <Markdown
            text={i`Product ID: ${productId}`}
            style={styles.cardMargin}
          />
          <Markdown text={i`SKU: ${sku}`} style={styles.cardMargin} />
          <Markdown
            text={i`Description: ${productDescription}`}
            style={styles.cardMargin}
          />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </Card>
  );
};

export default observer(ProductListingDetailsCard);
