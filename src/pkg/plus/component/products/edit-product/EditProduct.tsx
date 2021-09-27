/*
 *
 * EditProduct.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import Shipping from "./sections/Shipping";
import Variations from "./sections/Variations";
import ProductImages from "./sections/ProductImages";
import ListingDetails from "./sections/ListingDetails";
import BarcodeAutoFill from "./sections/BarcodeAutoFill";
import SingleVariationPricing from "./sections/SingleVariationPricing";
import SingleVariationInventory from "./sections/SingleVariationInventory";
import Logistics from "./sections/Logistics";

import TagsCard from "./right-cards/TagsCard";
import BrandCard from "./right-cards/BrandCard";
import BasicInfoCard from "./right-cards/BasicInfoCard";
import AvailableForSale from "./right-cards/AvailableForSale";
import WishPreviewCard from "./right-cards/WishPreviewCard";
import CurrencySettings from "./sections/CurrencySettings";

import ProductEditState from "@plus/model/ProductEditState";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";
import { Layout, LoadingIndicator } from "@ContextLogic/lego";
import UnitPrice from "./sections/UnitPrice";

const CardSpacing = 25;

type Props = {
  readonly editState: ProductEditState;
  readonly productCount?: number;
};

const EditProduct = ({ editState, productCount }: Props) => {
  const [autoFillOpen, setAutoFillOpen] = useState(true);
  const [productImagesOpen, setProductImagesOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [listingDetailsOpen, setListingDetailsOpen] = useState(true);
  const [unitPriceOpen, setUnitPriceOpen] = useState(true);
  const [variationsOpen, setVariationsOpen] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(true);
  const [logisticsOpen, setLogisticsOpen] = useState(true);

  const { hasColorOrSizeVariations, isNewProduct } = editState;

  const { decision: showV2, isLoading: isLoadingShowV2 } = useDeciderKey(
    "manual_product_add_v2"
  );

  const {
    decision: showUnitPrice,
    isLoading: isLoadingShowUnitPrice,
  } = useDeciderKey("mplus_manual_add_edit_unit_price");

  const styles = useStylesheet({ v2: showV2 || false });

  // tips are only shown on the create product flow, we control this by only
  // passing in productCount during the create flow, and only showing tips if
  // one was passed on
  const showTips = productCount != null && productCount < 3;

  const showLogistics = true;

  if (isLoadingShowV2 || isLoadingShowUnitPrice) {
    return <LoadingIndicator style={styles.pageLoadingIndicator} />;
  }

  return showV2 ? (
    <Layout.FlexColumn style={styles.root}>
      <CurrencySettings className={css(styles.section)} editState={editState} />
      <div className={css(styles.content)}>
        <Layout.FlexColumn style={styles.leftSide}>
          {isNewProduct && (
            <BarcodeAutoFill
              className={css(styles.section)}
              isOpen={autoFillOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setAutoFillOpen(isOpen)}
            />
          )}
          <ProductImages
            className={css(styles.section)}
            isOpen={productImagesOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setProductImagesOpen(isOpen)}
          />
          <ListingDetails
            className={css(styles.section)}
            isOpen={listingDetailsOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setListingDetailsOpen(isOpen)}
          />
          {(isNewProduct || hasColorOrSizeVariations) && (
            <Variations
              className={css(styles.section)}
              isOpen={variationsOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setVariationsOpen(isOpen)}
            />
          )}
          {!hasColorOrSizeVariations && (
            <>
              <SingleVariationPricing
                className={css(styles.section)}
                isOpen={pricingOpen}
                editState={editState}
                onOpenToggled={(isOpen) => setPricingOpen(isOpen)}
                showTip={showTips}
              />
              <SingleVariationInventory
                className={css(styles.section)}
                isOpen={inventoryOpen}
                editState={editState}
                onOpenToggled={(isOpen) => setInventoryOpen(isOpen)}
              />
            </>
          )}
          {showLogistics && !hasColorOrSizeVariations && (
            <Logistics
              className={css(styles.section)}
              isOpen={logisticsOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setLogisticsOpen(isOpen)}
            />
          )}
          <Shipping
            className={css(styles.section)}
            isOpen={shippingOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setShippingOpen(isOpen)}
            showTip={showTips}
          />
        </Layout.FlexColumn>
        <div className={css(styles.rightSide)}>
          <WishPreviewCard
            className={css(styles.rightCard)}
            editState={editState}
          />
        </div>
      </div>
    </Layout.FlexColumn>
  ) : (
    <Layout.FlexColumn style={styles.root}>
      <div className={css(styles.content)}>
        <Layout.FlexColumn style={styles.leftSide}>
          {isNewProduct && (
            <BarcodeAutoFill
              className={css(styles.section)}
              isOpen={autoFillOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setAutoFillOpen(isOpen)}
            />
          )}
          <ProductImages
            className={css(styles.section)}
            isOpen={productImagesOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setProductImagesOpen(isOpen)}
          />
          <ListingDetails
            className={css(styles.section)}
            isOpen={listingDetailsOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setListingDetailsOpen(isOpen)}
          />
          {showUnitPrice && (
            <UnitPrice
              className={css(styles.section)}
              isOpen={unitPriceOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setUnitPriceOpen(isOpen)}
            />
          )}
          {(isNewProduct || hasColorOrSizeVariations) && (
            <Variations
              className={css(styles.section)}
              isOpen={variationsOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setVariationsOpen(isOpen)}
            />
          )}
          {!hasColorOrSizeVariations && (
            <>
              <SingleVariationPricing
                className={css(styles.section)}
                isOpen={pricingOpen}
                editState={editState}
                onOpenToggled={(isOpen) => setPricingOpen(isOpen)}
                showTip={showTips}
              />
              <SingleVariationInventory
                className={css(styles.section)}
                isOpen={inventoryOpen}
                editState={editState}
                onOpenToggled={(isOpen) => setInventoryOpen(isOpen)}
              />
            </>
          )}
          {showLogistics && !hasColorOrSizeVariations && (
            <Logistics
              className={css(styles.section)}
              isOpen={logisticsOpen}
              editState={editState}
              onOpenToggled={(isOpen) => setLogisticsOpen(isOpen)}
            />
          )}
          <Shipping
            className={css(styles.section)}
            isOpen={shippingOpen}
            editState={editState}
            onOpenToggled={(isOpen) => setShippingOpen(isOpen)}
            showTip={showTips}
          />
        </Layout.FlexColumn>
        <div className={css(styles.rightSide)}>
          {!isNewProduct && (
            <AvailableForSale
              className={css(styles.rightCard)}
              editState={editState}
            />
          )}
          <BrandCard className={css(styles.rightCard)} editState={editState} />
          <TagsCard className={css(styles.rightCard)} editState={editState} />
          <BasicInfoCard
            className={css(styles.rightCard)}
            editState={editState}
          />
        </div>
      </div>
    </Layout.FlexColumn>
  );
};

export default observer(EditProduct);

const useStylesheet = ({ v2 }: { readonly v2: boolean }) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: 25,
        },
        pageLoadingIndicator: {
          paddingTop: 25,
        },
        content: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
          flex: 1,
        },
        section: {
          marginBottom: CardSpacing,
        },
        leftSide: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          "@media (min-width: 900px)": {
            minWidth: v2 ? "65%" : "70%",
          },
        },
        rightSide: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          "@media (min-width: 900px)": {
            width: v2 ? "calc(35% - 35px)" : "calc(30% - 35px)",
            flexShrink: 0,
            marginLeft: 35,
          },
        },
        rightCard: {
          marginBottom: CardSpacing,
        },
      }),
    [v2]
  );
