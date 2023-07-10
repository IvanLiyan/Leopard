import {
  BrandSchema,
  CurrencyValue,
  Weight,
  Length,
  GtinProductServiceSchemaProductArgs,
  GtinProductSchema,
  GtinVariationSchema,
  PaymentCurrencyCode,
  BrandServiceSchemaTrueBrandsArgs,
} from "@schema";
import { gql } from "@apollo/client";

export const GET_GTIN_PRODUCT_QUERY = gql`
  query AddEdit_GetGtinProductQuery(
    $gtins: [String!]!
    $currency: PaymentCurrencyCode!
  ) {
    productCatalog {
      gtinProductService {
        product(gtins: $gtins) {
          title
          description
          imageUrls
          wishBrand {
            displayName
          }
          variations {
            gtin
            color
            size
            imageUrls
            length {
              value(targetUnit: CENTIMETER)
              unit
            }
            width {
              value(targetUnit: CENTIMETER)
              unit
            }
            height {
              value(targetUnit: CENTIMETER)
              unit
            }
            weight {
              value(targetUnit: GRAM)
              unit
            }
            price {
              convertedTo(currency: $currency, rate: MKL_POLICY) {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export type PickedGtinVariation = Pick<
  GtinVariationSchema,
  "color" | "size" | "imageUrls" | "gtin"
> & {
  readonly length?: Pick<Length, "value"> | null;
  readonly width?: Pick<Length, "value"> | null;
  readonly height?: Pick<Length, "value"> | null;
  readonly weight?: Pick<Weight, "value"> | null;
  readonly price?: {
    readonly convertedTo: Pick<CurrencyValue, "amount" | "currencyCode">;
  } | null;
};

export type PickedGtinProduct = Pick<
  GtinProductSchema,
  "title" | "description" | "imageUrls"
> & {
  readonly wishBrand?: Pick<BrandSchema, "displayName"> | null;
  readonly variations?: ReadonlyArray<PickedGtinVariation> | null;
};

export type GetGtinProductQueryRequest = GtinProductServiceSchemaProductArgs & {
  readonly currency: PaymentCurrencyCode;
};
export type GetGtinProductQueryResponse = {
  readonly productCatalog?: {
    readonly gtinProductService: {
      readonly product?: PickedGtinProduct | null;
    };
  } | null;
};

export const GET_BRAND_MATCH = gql`
  query GetBrandMatch($brandName: String!) {
    brand {
      trueBrands(brandName: $brandName, count: 1) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

export type PickedBrand = Pick<BrandSchema, "id" | "displayName" | "logoUrl">;

export type GetBrandMatchRequest = BrandServiceSchemaTrueBrandsArgs;

export type GetBrandMatchResponse = {
  readonly brand: {
    readonly trueBrands: ReadonlyArray<PickedBrand>;
  };
};
