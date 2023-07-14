import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import CategoryAttributes from "./cards/CategoryAttributes";
import Shipping from "./cards/Shipping";
import Variations from "./cards/Variations";
import ProductImagesV2 from "./cards/ProductImagesV2";
import ListingDetailsV2 from "./cards/ListingDetailsV2";
import InventoryGtin from "./cards/InventoryGtin";
import UnitPrice from "./cards/UnitPrice";
import Price from "./cards/Price";
import CategorizationV2 from "./cards/CategorizationV2";
import Compliance from "./cards/Compliance";
import { Layout } from "@ContextLogic/lego";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import CustomsLogisticsCardV2 from "./cards/customs-logistics/CustomsLogisticsCardV2";
import ProductCategoryV2 from "./cards/ProductCategoryV2";
import AdditionalAttributesV2 from "./cards/AdditionalAttributesV2";

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
  const [additionalAttributesOpen, setAdditionalAttributesOpen] =
    useState(true);
  const [categorizationOpen, setCategorizationOpen] = useState(true);

  const { hasVariations, isNewProduct, subcategoryId } = state;

  const showTips = false;

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexColumn>
        <ProductCategoryV2
          style={styles.section}
          isOpen={productCategoryOpen}
          state={state}
          onOpenToggled={(isOpen: boolean) => setProductCategoryOpen(isOpen)}
        />
        <ListingDetailsV2
          style={styles.section}
          isOpen={listingDetailsOpen}
          state={state}
          onOpenToggled={(isOpen) => setListingDetailsOpen(isOpen)}
        />
        <ProductImagesV2
          style={styles.section}
          isOpen={productImagesOpen}
          state={state}
          onOpenToggled={(isOpen) => setProductImagesOpen(isOpen)}
        />
        {subcategoryId && (
          <CategoryAttributes
            style={styles.section}
            isOpen={categoryAttributesOpen}
            state={state}
            onOpenToggled={(isOpen) => setCategoryAttributesOpen(isOpen)}
          />
        )}
        <Variations
          style={styles.section}
          isOpen={variationsOpen}
          state={state}
          onOpenToggled={(isOpen) => setVariationsOpen(isOpen)}
        />
        {!hasVariations && (
          <>
            {subcategoryId && (
              <AdditionalAttributesV2
                style={styles.section}
                state={state}
                isOpen={additionalAttributesOpen}
                onOpenToggled={(isOpen) => setAdditionalAttributesOpen(isOpen)}
              />
            )}
            <Price
              style={styles.section}
              isOpen={pricingOpen}
              state={state}
              onOpenToggled={(isOpen) => setPricingOpen(isOpen)}
              showTip={showTips}
            />
            <InventoryGtin
              style={styles.section}
              isOpen={inventoryOpen}
              state={state}
              onOpenToggled={(isOpen) => setInventoryOpen(isOpen)}
            />
            <CustomsLogisticsCardV2
              style={styles.section}
              isOpen={customsLogisticsOpen}
              state={state}
              onOpenToggled={(isOpen) => setCustomsLogisticsOpen(isOpen)}
            />
          </>
        )}
        <CategorizationV2
          style={styles.section}
          state={state}
          isOpen={categorizationOpen}
          onOpenToggled={(isOpen) => setCategorizationOpen(isOpen)}
        />
        {isNewProduct && (
          <Shipping
            style={styles.section}
            isOpen={shippingOpen}
            state={state}
            onOpenToggled={(isOpen) => setShippingOpen(isOpen)}
            showTip={showTips}
          />
        )}
        <UnitPrice
          style={styles.section}
          isOpen={unitPriceOpen}
          state={state}
          onOpenToggled={(isOpen) => setUnitPriceOpen(isOpen)}
        />
        <Compliance
          style={styles.section}
          isOpen={complianceOpen}
          state={state}
          onOpenToggled={(isOpen) => setComplianceOpen(isOpen)}
        />
      </Layout.FlexColumn>
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
        section: {
          marginBottom: CardSpacing,
        },
      }),
    [],
  );
