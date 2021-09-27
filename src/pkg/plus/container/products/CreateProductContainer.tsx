/*
 *
 * CreateProductContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { useLogger } from "@toolkit/logger";
import { css } from "@toolkit/styling";

import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import EditProduct from "@plus/component/products/edit-product/EditProduct";
import ProductEditState from "@plus/model/ProductEditState";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { ProductEditInitialData } from "@toolkit/product-edit";

type Props = {
  readonly initialData: ProductEditInitialData;
};

const CreateProductContainer: React.FC<Props> = ({ initialData }: Props) => {
  const {
    currentMerchant: {
      standardWarehouseId,
      primaryCurrency,
      shippingSettings: storeCountries,
      isStoreMerchant,
      canManageShipping,
    },
    platformConstants: { countriesWeShipTo, wishExpressCountries },
  } = initialData;
  const sourceProductInitialData = initialData.productCatalog?.product;
  const productCount = initialData.productCatalog?.productCount || 0;

  const actionLogger = useLogger("PLUS_PRODUCT_UPLOAD");
  const [editState] = useState<ProductEditState>(
    new ProductEditState({
      standardWarehouseId,
      primaryCurrency,
      storeCountries,
      wishExpressCountries,
      initialState: sourceProductInitialData || {},
      isCloning: sourceProductInitialData != null,
      isStoreMerchant,
      canManageShipping,
      countriesWeShipTo,
    })
  );
  const navigationStore = useNavigationStore();
  const styles = useStylesheet();
  useEffect(() => {
    actionLogger.info({
      action: `VIEW_PRODUCTS_CREATE_PAGE`,
    });
  }, [initialData, actionLogger]);
  useEffect(() => {
    if (editState.hasChanges) {
      navigationStore.placeNavigationLock(
        i`You have unsaved changed. Are you sure want to leave?`
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [navigationStore, editState.hasChanges]);

  const actions = (
    <>
      <Button href="/plus/products/list">Discard</Button>
      <PrimaryButton
        onClick={async () => {
          actionLogger.info({
            action: `CLICK_ON_SAVE_FROM_PRODUCTS_CREATE_PAGE`,
          });
          await editState.submit();
        }}
        minWidth
      >
        Save
      </PrimaryButton>
    </>
  );
  const currentTitle = (editState.name || "").trim();
  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={
          currentTitle.trim().length > 0
            ? currentTitle
            : i`Unsaved Product listing`
        }
        breadcrumbs={[
          { name: i`Products`, href: "/plus/products/list" },
          { name: i`Add product`, href: window.location.href },
        ]}
        actions={actions}
        className={css(styles.header)}
      />
      <PageGuide>
        <EditProduct editState={editState} productCount={productCount} />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
      }),
    []
  );

export default observer(CreateProductContainer);
