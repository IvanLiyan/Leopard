import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CurrencyInput } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName, CountryCode } from "@toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import {
  ProductLevelInventory,
  VariationLevelInventory,
  ShippingPrice,
} from "@merchant/api/fbw";

export type FbwInventoryShippingPriceFieldsProps = BaseProps & {
  readonly productLevelInventory: ProductLevelInventory;
  readonly variationLevelInventory: VariationLevelInventory | null | undefined;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly addToShippingPriceUpdateInModal: (
    arg0: string,
    arg1: string
  ) => unknown;
  readonly shippingPrices: ReadonlyArray<ShippingPrice>;
};

type PriceInputFieldType = "PRICE" | "LOCALIZED_PRICE";

const FbwInventoryShippingPriceFields = (
  props: FbwInventoryShippingPriceFieldsProps
) => {
  const styles = useStyleSheet();
  const {
    productLevelInventory,
    merchantCurrency,
    localizedCurrency,
    addToShippingPriceUpdateInModal,
    shippingPrices,
  } = props;

  // this dict is only used for merchant with both currencies
  // it allows the UI to fetch original price on the page if the merchant is making
  // change to the localized price
  const destToOriginalPriceDict = {};
  for (const shippingPrice of shippingPrices) {
    (destToOriginalPriceDict as any)[shippingPrice.country_code] =
      shippingPrice.price != null ? shippingPrice.price.toString() : "";
  }

  const onShippingPriceFieldChange = (
    dest: string,
    priceType: PriceInputFieldType
  ) => {
    return (params: OnTextChangeEvent) => {
      if (priceType === "PRICE") {
        if (merchantCurrency !== "USD") {
          // merchant with merchant level currency
          addToShippingPriceUpdateInModal(`LOCAL_${dest}`, params.text);
        } else {
          addToShippingPriceUpdateInModal(dest, params.text);
          (destToOriginalPriceDict as any)[dest] = params.text;
        }
      }
      if (priceType === "LOCALIZED_PRICE") {
        // merchant with both price and localized price
        addToShippingPriceUpdateInModal(`LOCAL_${dest}`, params.text);
        addToShippingPriceUpdateInModal(
          dest,
          (destToOriginalPriceDict as any)[dest]
        );
      }
    };
  };

  const allDestination = productLevelInventory.country_ship_to.filter((d) =>
    getShippingDestinationName(d)
  );

  return (
    <div className={css(styles.shippingPriceContainer)}>
      {allDestination.map((dest) => {
        const shippingPrice = getShippingPriceByDest(dest, shippingPrices);
        const destinationName = getShippingDestinationName(dest);
        let defaultValue = "";
        let defaultLocalizedValue = "";
        let isInherited = false;
        if (shippingPrice) {
          if (merchantCurrency !== "USD") {
            defaultValue =
              shippingPrice.localized_price != null
                ? shippingPrice.localized_price.toString()
                : "";
          } else {
            defaultValue =
              shippingPrice.price != null ? shippingPrice.price.toString() : "";
            defaultLocalizedValue =
              shippingPrice.localized_price != null
                ? shippingPrice.localized_price.toString()
                : "";
          }
          isInherited = shippingPrice.is_inherited;
        }
        return (
          <div
            className={css(styles.shippingPriceInputField)}
            key={destinationName}
          >
            <div className={css(styles.shippingDestination)}>
              {destinationName}
              {isInherited && (
                <Info
                  className={css(styles.inheritedInfo)}
                  text={i`Shipping price set by default`}
                  size={16}
                />
              )}
            </div>
            <div className={css(styles.originalShippingPrice)}>
              <CurrencyInput
                currencyCode={merchantCurrency}
                defaultValue={defaultValue}
                placeholder={i`Not Set`}
                onChange={onShippingPriceFieldChange(dest, "PRICE")}
              />
            </div>
            {merchantCurrency === "USD" && localizedCurrency !== "USD" && (
              <div className={css(styles.localizedShippingPrice)}>
                <CurrencyInput
                  currencyCode={localizedCurrency}
                  defaultValue={defaultLocalizedValue}
                  placeholder={i`Not Set`}
                  onChange={onShippingPriceFieldChange(dest, "LOCALIZED_PRICE")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default observer(FbwInventoryShippingPriceFields);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        shippingDestination: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 10,
          paddingTop: 10,
          minWidth: 230,
          marginLeft: 40,
        },
        originalShippingPrice: {
          minWidth: 150,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 5,
          marginBottom: 5,
        },
        localizedShippingPrice: {
          minWidth: 150,
          marginTop: 5,
          marginBottom: 5,
        },
        shippingPriceContainer: {
          maxWidth: 800,
        },
        shippingPriceInputField: {
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        inheritedInfo: {
          marginLeft: 10,
        },
      }),
    []
  );
};

const getShippingDestinationName = (code: CountryCode | "D") => {
  if (code === "D") {
    return i`Default Shipping Price`;
  }
  return getCountryName(code);
};

const getShippingPriceByDest = (
  dest: string,
  shippingPrices: ReadonlyArray<ShippingPrice>
) => {
  for (const shippingPrice of shippingPrices) {
    if (shippingPrice.country_code === dest) {
      return shippingPrice;
    }
  }
  return null;
};
