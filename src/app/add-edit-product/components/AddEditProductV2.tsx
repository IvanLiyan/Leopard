import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import CategoryAttributes from "./cards/CategoryAttributes";
import Shipping from "./cards/Shipping";
import Variations from "./cards/Variations";
import ProductImages from "./cards/ProductImages";
import ListingDetails from "./cards/ListingDetails";
import Autofill from "./cards/Autofill";
import Inventory from "./cards/Inventory";
import UnitPrice from "./cards/UnitPrice";
import Price from "./cards/Price";
import WishPreviewCard from "./cards/WishPreviewCard";
import Categorization from "./cards/Categorization";
import Compliance from "./cards/Compliance";
import { Layout } from "@ContextLogic/lego";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import CustomsLogisticsCard from "./cards/CustomsLogisticsCard";
import BasicInfo from "./cards/BasicInfo";
import ProductCategoryV2 from "./cards/v2/ProductCategoryV2";

const CardSpacing = 25;

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

/*
 * Add flow overview:
 * - product category selection is allowed
 * - variations are generated based on user selected variation option types and values (see form component in VariationOptionsInput.tsx)
 *
 * Edit flow overview:
 * - product category update is allowed only when it was missing, and in this case, we allow selecting variation options as well
 * - user can edit existing variation option fields (color, size, taxonomy options) from the variations table
 * - user can also use the add variation modal to add new variations
 */
const AddEditProductV2 = ({ className, style, state }: Props) => {
  const styles = useStylesheet();

  const [productCategoryOpen, setProductCategoryOpen] = useState(true);
  const [autoFillOpen, setAutoFillOpen] = useState(true);
  const [productImagesOpen, setProductImagesOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [listingDetailsOpen, setListingDetailsOpen] = useState(true);
  const [unitPriceOpen, setUnitPriceOpen] = useState(true);
  const [variationsOpen, setVariationsOpen] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(true);
  const [categoryAttributesOpen, setCategoryAttributesOpen] = useState(true);
  const [customsLogisticsOpen, setCustomsLogisticsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(true);
  const [complianceOpen, setComplianceOpen] = useState(true);

  const { hasVariations, isNewProduct } = state;

  const showTips = false;

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <div className={css(styles.content)}>
        <Layout.FlexColumn style={styles.leftSide}>
          <ProductCategoryV2
            style={styles.section}
            isOpen={productCategoryOpen}
            state={state}
            onOpenToggled={(isOpen: boolean) => setProductCategoryOpen(isOpen)}
          />
          {isNewProduct && (
            <Autofill
              style={styles.section}
              isOpen={autoFillOpen}
              state={state}
              onOpenToggled={(isOpen: boolean) => setAutoFillOpen(isOpen)}
            />
          )}
          <ProductImages
            style={styles.section}
            isOpen={productImagesOpen}
            state={state}
            onOpenToggled={(isOpen) => setProductImagesOpen(isOpen)}
          />
          <ListingDetails
            style={styles.section}
            isOpen={listingDetailsOpen}
            state={state}
            onOpenToggled={(isOpen) => setListingDetailsOpen(isOpen)}
          />
          <UnitPrice
            style={styles.section}
            isOpen={unitPriceOpen}
            state={state}
            onOpenToggled={(isOpen) => setUnitPriceOpen(isOpen)}
          />
          <CategoryAttributes
            style={styles.section}
            isOpen={categoryAttributesOpen}
            state={state}
            onOpenToggled={(isOpen) => setCategoryAttributesOpen(isOpen)}
          />
          <CustomsLogisticsCard
            style={styles.section}
            isOpen={customsLogisticsOpen}
            state={state}
            onOpenToggled={(isOpen) => setCustomsLogisticsOpen(isOpen)}
          />
          <Variations
            style={styles.section}
            isOpen={variationsOpen}
            state={state}
            onOpenToggled={(isOpen) => setVariationsOpen(isOpen)}
          />
          {!hasVariations && (
            <>
              <Price
                style={styles.section}
                isOpen={pricingOpen}
                state={state}
                onOpenToggled={(isOpen) => setPricingOpen(isOpen)}
                showTip={showTips}
              />
              <Inventory
                style={styles.section}
                isOpen={inventoryOpen}
                state={state}
                onOpenToggled={(isOpen) => setInventoryOpen(isOpen)}
              />
            </>
          )}
          {isNewProduct && (
            <Shipping
              style={styles.section}
              isOpen={shippingOpen}
              state={state}
              onOpenToggled={(isOpen) => setShippingOpen(isOpen)}
              showTip={showTips}
            />
          )}
          <Compliance
            style={styles.section}
            isOpen={complianceOpen}
            state={state}
            onOpenToggled={(isOpen) => setComplianceOpen(isOpen)}
          />
        </Layout.FlexColumn>
        <Layout.FlexColumn style={styles.rightSide} alignItems="stretch">
          <Categorization className={css(styles.rightCard)} state={state} />
          <WishPreviewCard className={css(styles.rightCard)} state={state} />
          {!isNewProduct && (
            <BasicInfo className={css(styles.rightCard)} state={state} />
          )}
        </Layout.FlexColumn>
      </div>
    </Layout.FlexColumn>
  );
};

export default observer(AddEditProductV2);

const useStylesheet = () =>
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
            minWidth: "65%",
          },
        },
        rightSide: {
          "@media (min-width: 900px)": {
            width: "calc(35% - 35px)",
            flexShrink: 0,
            marginLeft: 35,
          },
        },
        rightCard: {
          marginBottom: CardSpacing,
        },
      }),
    [],
  );
