import React, { useState } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { Layout } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card, { Props as CardProps } from "./Card";
import Image from "@core/components/Image";
import { useInfractionContext } from "@infractions/InfractionContext";
import { wishProductURL } from "@core/toolkit/url";

const ProductListingDetailsCard: React.FC<
  Omit<CardProps, "title" | "children">
> = (props) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { product, type },
  } = useInfractionContext();
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (
    product == null ||
    type === "REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER" ||
    type === "VIOLATE_POLICY"
  ) {
    return null;
  }

  const {
    productImageUrl,
    productName,
    productId,
    productSku,
    productDescription: productDescriptionRaw,
  } = product;

  const productDescription =
    !productDescriptionRaw || productDescriptionRaw.length < 300
      ? productDescriptionRaw
      : !showFullDescription
      ? i`${productDescriptionRaw.slice(0, 250).trimEnd()}... [View More](#)`
      : i`${productDescriptionRaw} [View Less](#)`;

  return (
    <Card title={i`Product Listing Details`} {...props}>
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
            text={i`Product ID: [${productId}](${wishProductURL(productId)})`}
            style={styles.cardMargin}
          />
          {productSku && (
            <Markdown text={i`SKU: ${productSku}`} style={styles.cardMargin} />
          )}
          {productDescription && (
            <Markdown
              onLinkClicked={() => {
                setShowFullDescription((prev) => !prev);
              }}
              text={i`Description: ${productDescription}`}
              style={styles.cardMargin}
            />
          )}
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </Card>
  );
};

export default observer(ProductListingDetailsCard);
