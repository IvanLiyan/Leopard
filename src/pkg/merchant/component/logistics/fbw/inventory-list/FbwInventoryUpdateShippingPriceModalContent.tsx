import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import getSymbolFromCurrency from "currency-symbol-map";

/* Lego Components */
import { ObjectId } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Toolkit */
import { contestImageURL } from "@toolkit/url";

/* Relative Imports */
import FbwInventoryShippingPriceFields from "./FbwInventoryShippingPriceFields";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ProductLevelInventory,
  VariationLevelInventory,
} from "@merchant/api/fbw";

export type FbwInventoryUpdateShippingPriceModalContentProps = BaseProps & {
  readonly productLevelInventory: ProductLevelInventory;
  readonly variationLevelInventory: VariationLevelInventory | null | undefined;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly addToShippingPriceUpdateInModal: (
    arg0: string,
    arg1: string,
  ) => unknown;
  readonly getWarehouseNameByCode: (arg0: string) => string | null | undefined;
};

const FbwInventoryUpdateShippingPriceModalContent = (
  props: FbwInventoryUpdateShippingPriceModalContentProps,
) => {
  const styles = useStyleSheet();
  const {
    productLevelInventory,
    variationLevelInventory,
    merchantCurrency,
    localizedCurrency,
    addToShippingPriceUpdateInModal,
    getWarehouseNameByCode,
  } = props;

  const { productStore } = useStore();
  const productId = productLevelInventory.product_id;
  const product = productStore.getProduct(productId);

  // Notice here: The shippingPrices are stored as state and fetched in useEffect
  //  This is to force the content to re-render upon click open
  //  so that the user can see the change after updating the shipping price
  const [shippingPrices, setShippingPrices] = useState<ReadonlyArray<
    Readonly<api.ShippingPrice>
  > | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await api
        .getFBWInventoryShippingPrice({
          warehouse_id: productLevelInventory.warehouse_id,
          product_id: productLevelInventory.product_id,
          variation_id: variationLevelInventory
            ? variationLevelInventory.variation_id
            : "",
        })
        .call();
      const { data } = resp;
      if (!data) {
        return;
      }
      setShippingPrices(data.shipping_prices);
    };
    fetchData();
  }, [productLevelInventory, variationLevelInventory, setShippingPrices]);

  if (!shippingPrices) {
    return <LoadingIndicator type="swinging-bar" />;
  }
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.root)}>
        <div className={css(styles.flexRow)}>
          <div className={css(styles.productImgContainer)}>
            <img
              src={contestImageURL({ contestId: productId })}
              className={css(styles.productImg)}
            />
          </div>
          <div className={css(styles.inventoryDetailContainer)}>
            <div className={css(styles.productNameContainer)}>
              <span className={css(styles.fieldLabel)}>Name: </span>
              <div className={css(styles.normalFieldValue)}>
                {product ? product.name : i`Product name not found`}
              </div>
            </div>
            <div className={css(styles.fieldValueContainer)}>
              <span className={css(styles.fieldLabel)}>Product ID: </span>
              <ObjectId
                className={css(styles.normalFieldValue)}
                id={productId}
                showFull
              />
            </div>
            {!variationLevelInventory && (
              <div className={css(styles.fieldValueContainer)}>
                <span className={css(styles.fieldLabel)}>Parent SKU: </span>
                <div className={css(styles.boldFieldValue)}>
                  {productLevelInventory.product_SKU}
                </div>
              </div>
            )}
            {variationLevelInventory && (
              <div className={css(styles.fieldValueContainer)}>
                <span className={css(styles.fieldLabel)}>Parent SKU: </span>
                <div className={css(styles.normalFieldValue)}>
                  {productLevelInventory.product_SKU}
                </div>
              </div>
            )}
            {variationLevelInventory && (
              <div className={css(styles.fieldValueContainer)}>
                <span className={css(styles.fieldLabel)}>Variation SKU: </span>
                <ObjectId
                  className={css(styles.boldFieldValue)}
                  id={variationLevelInventory.variation_SKU}
                  showFull
                />
              </div>
            )}
            <div className={css(styles.fieldValueContainer)}>
              <span className={css(styles.fieldLabel)}>Warehouse: </span>
              <div className={css(styles.boldFieldValue)}>
                {getWarehouseNameByCode(productLevelInventory.warehouse_code)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={css(styles.currencyContainer)}>
        <div className={css(styles.currencyLabel)}>
          {`${merchantCurrency}(${getSymbolFromCurrency(merchantCurrency)})`}
        </div>
        <div className={css(styles.localizedCurrencyLabel)}>
          {localizedCurrency &&
          localizedCurrency !== "USD" &&
          merchantCurrency === "USD"
            ? `${localizedCurrency}(${getSymbolFromCurrency(
                localizedCurrency,
              )})`
            : ""}
        </div>
      </div>
      <FbwInventoryShippingPriceFields
        productLevelInventory={productLevelInventory}
        variationLevelInventory={variationLevelInventory}
        merchantCurrency={merchantCurrency}
        localizedCurrency={localizedCurrency}
        addToShippingPriceUpdateInModal={addToShippingPriceUpdateInModal}
        shippingPrices={shippingPrices}
      />
    </div>
  );
};

export default observer(FbwInventoryUpdateShippingPriceModalContent);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 20,
          paddingBottom: 20,
        },
        flexRow: {
          display: "flex",
        },
        inventoryDetailContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 2,
        },
        productNameContainer: {
          flexDirection: "row",
          display: "flex",
          marginBottom: 10,
        },
        fieldLabel: {},
        productImgContainer: {
          flex: 1,
          minWidth: 50,
        },
        productImg: {
          maxWidth: "100%",
        },
        fieldValueContainer: {
          marginBottom: 15,
          display: "flex",
          alignItems: "center",
        },
        currencyContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "36%",
          maxWidth: 320,
          paddingLeft: 310,
        },
        currencyLabel: {},
        localizedCurrencyLabel: {},
        boldId: {
          fontWeight: fonts.weightBold,
        },
        boldFieldValue: {
          fontWeight: fonts.weightBold,
          paddingLeft: 10,
        },
        normalFieldValue: {
          paddingLeft: 10,
        },
      }),
    [],
  );
};
