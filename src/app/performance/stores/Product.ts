import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  CurrencyValue,
  Datetime,
  MerchantStatsWeeklyArgs,
  PaymentCurrencyCode,
  ProductPerformanceStats,
} from "@schema";
import {
  AugmentedPrice,
  countTableDataCurrencyAmount,
  CountTableDataItem,
} from "@performance/toolkit/utils";

export const PERFORMANCE_PRODUCT_DATA_QUERY = gql`
  query Product_PerformanceProductDataQuery($weeks: Int!) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          product {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            activeProducts
            activeSkus
            skusPerProduct
            averagePrice {
              amount
              currencyCode
            }
            averageShippingPrice {
              amount
              currencyCode
            }
            priceToShippingRatio
            averageAdditonalImagesPerProduct
            productImpressions
            gmv {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

type PickedProduct = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly averagePrice?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly averageShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "currencyCode"
  >;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  ProductPerformanceStats,
  | "activeProducts"
  | "activeSkus"
  | "skusPerProduct"
  | "priceToShippingRatio"
  | "averageAdditonalImagesPerProduct"
  | "productImpressions"
>;

export type ProductDataQueryResponse = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly product: PickedProduct;
      }>;
    };
  };
};

export type ProductDataQueryArguments = MerchantStatsWeeklyArgs;

export type AugmentedProduct = Omit<
  PickedProduct,
  "averagePrice" | "averageShippingPrice" | "gmv"
> & {
  readonly averagePrice?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
  readonly averageShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "currencyCode"
  > &
    AugmentedPrice;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
};

class Store {
  readonly storeName = "performance-product-store";

  @observable
  data: ReadonlyArray<AugmentedProduct> = [];

  @observable
  currencyCode: PaymentCurrencyCode = "USD";

  @observable
  productCNYFlag = false;

  @action updateCurrencyCode(currencyCode: PaymentCurrencyCode) {
    this.currencyCode = currencyCode;
  }

  @action
  updatePerProductData(data: ProductDataQueryResponse) {
    const productData = data?.currentMerchant?.storeStats?.weekly?.map(
      (week) => week.product,
    );
    this.data = countTableDataCurrencyAmount(
      productData as unknown as ReadonlyArray<CountTableDataItem>, // cast is very dangerous but original code was not type safe. please do not repeat
      ["averagePrice", "averageShippingPrice", "gmv"],
    ) as unknown as ReadonlyArray<AugmentedProduct>; // cast is very dangerous but original code was not type safe. please do not repeat
    if (productData[0].gmv?.currencyCode === "CNY") this.productCNYFlag = true;
  }
}

export default new Store();