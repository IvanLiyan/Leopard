/*
 * CreateProductCategoryDisputeContainer.tsx
 *
 * Created by Betty Chen on June 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { useStringQueryParam } from "@toolkit/url";

/* Lego Components */
import { Button, PrimaryButton, Layout } from "@ContextLogic/lego";

/* Merchant Components */
import { PageGuide } from "@merchant/component/core";
import WelcomeHeader from "@merchant/component/core/WelcomeHeader";
import CreateProductCategoryDisputeSection from "@merchant/component/products/disputes/create/CreateProductCategoryDisputeSection";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import ProductCategoryDisputeState from "@merchant/model/products/ProductCategoryDisputeState";
import { CreateProductCategoryDisputeInitialData } from "@toolkit/products/product-category-dispute";

type Props = {
  readonly initialData: CreateProductCategoryDisputeInitialData;
};

const CreateProductCategoryDisputeContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const [sourceQuery] = useStringQueryParam("source");
  const { productCatalog } = initialData;

  const state = useMemo(
    () =>
      new ProductCategoryDisputeState({
        productId: productCatalog?.product?.id,
        source:
          sourceQuery === "EU_COMPLIANCE" ? sourceQuery : "PRODUCT_CATELOG",
      }),
    [productCatalog, sourceQuery]
  );

  if (productCatalog == null) {
    return null;
  }

  const actions = (
    <>
      <Button
        href={
          sourceQuery === "EU_COMPLIANCE"
            ? "/product/responsible-person"
            : "/product"
        }
        minWidth
      >
        Cancel
      </Button>
      <PrimaryButton
        onClick={async () => await state.submit()}
        isDisabled={state.isSubmitting || !state.isValid}
        minWidth
      >
        Submit
      </PrimaryButton>
    </>
  );

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`Dispute Product Category`}
        breadcrumbs={[
          {
            name: i`Products`,
            href: "/product",
          },
          ...(sourceQuery === "EU_COMPLIANCE"
            ? [
                {
                  name: i`EU Product Compliance`,
                  href: "/product/responsible-person",
                },
              ]
            : []),
        ]}
        actions={actions}
        paddingY="32px"
      />
      <PageGuide>
        <CreateProductCategoryDisputeSection
          fromEuCompliance={sourceQuery === "EU_COMPLIANCE"}
          state={state}
          initialData={initialData}
          className={css(styles.content)}
        />
      </PageGuide>
    </Layout.FlexColumn>
  );
};

export default observer(CreateProductCategoryDisputeContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        content: {
          marginTop: 32,
        },
      }),
    [pageBackground]
  );
};
