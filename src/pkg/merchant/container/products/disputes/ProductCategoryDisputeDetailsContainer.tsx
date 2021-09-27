/*
 * ProductCategoryDisputeDetailsContainer.tsx
 *
 * Created by Betty Chen on June 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import { WelcomeHeader, PageGuide } from "@merchant/component/core";
import ProductCategoryDisputeDetails from "@merchant/component/products/disputes/ProductCategoryDisputeDetails";

/* Model */
import { ProductCategoryDisputeDetailsInitialData } from "@toolkit/products/product-category-dispute";

type Props = BaseProps & {
  readonly initialData: ProductCategoryDisputeDetailsInitialData;
};

const ProductCategoryDisputeDetailsContainer = ({ initialData }: Props) => {
  const styles = useStylesheet();

  if (
    initialData.policy?.productCategoryDispute?.disputes == null ||
    initialData.policy.productCategoryDispute.disputes.length == 0
  ) {
    return null;
  }

  const dispute = initialData.policy.productCategoryDispute.disputes[0];
  const orders = initialData.fulfillment?.orders;

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`Dispute ${dispute.id}`}
        breadcrumbs={[
          {
            name: i`Product Category Disputes`,
            href: "/product-category-disputes",
          },
        ]}
        hideBorder
      />
      <PageGuide>
        <ProductCategoryDisputeDetails
          orders={orders}
          dispute={dispute}
          className={css(styles.section)}
        />
      </PageGuide>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
          color: textBlack,
        },
        section: {
          marginTop: 32,
        },
      }),
    [pageBackground, textBlack]
  );
};

export default observer(ProductCategoryDisputeDetailsContainer);
