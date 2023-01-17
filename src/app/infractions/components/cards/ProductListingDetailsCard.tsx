import React from "react";
import { observer } from "mobx-react";
import { Layout, Markdown } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Image from "@core/components/Image";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const ProductListingDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: { productImageUrl, productName, productId, sku, productDescription },
  } = useInfraction(infractionId);

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
            style={styles.cardItem}
          />
          <Markdown
            text={i`Product ID: ${productId}`}
            style={styles.cardItem}
          />
          <Markdown text={i`SKU: ${sku}`} style={styles.cardItem} />
          <Markdown
            text={i`Description: ${productDescription}`}
            style={styles.cardItem}
          />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </Card>
  );
};

export default observer(ProductListingDetailsCard);
