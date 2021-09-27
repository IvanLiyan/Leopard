import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  Country,
  Datetime,
  CurrencyValue,
  OrderSchema,
  OrderTaxItemSchema,
  TaxAuthoritySchema,
  OrderSalesTaxDetailsSchema,
} from "@schema/types";
import { useApolloStore } from "@merchant/stores/ApolloStore";

export type PickOrderSalesTaxItem = Pick<
  OrderTaxItemSchema,
  "isSale" | "isRefund" | "refundItemId" | "remitType"
> & {
  readonly authority: Pick<TaxAuthoritySchema, "name" | "type">;
  readonly taxAmount: Pick<CurrencyValue, "display">;
  readonly createdTime: Pick<Datetime, "mmddyyyy">;
  readonly taxableAddress: {
    readonly country: Pick<Country, "name">;
  };
};

export type PickedOrderSalesTaxDetailsSchema = Pick<
  OrderSalesTaxDetailsSchema,
  "remitTypes"
> & {
  readonly netTax: Pick<CurrencyValue, "amount" | "display" | "currencyCode">;
  readonly salesTax: Pick<CurrencyValue, "amount" | "display" | "currencyCode">;
  readonly refundedTax: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly netTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly salesTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly refundedTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly merchantRemitItems: ReadonlyArray<PickOrderSalesTaxItem>;
  readonly merchantRemitNetTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly wishRemitNetTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly authorityCountry?: Pick<Country, "code"> | null;
};

export type PickedOrderTaxInfo = {
  readonly salesTax: PickedOrderSalesTaxDetailsSchema;
};

const GET_ORDER_TAX_DATA = gql`
  query OrderTaxCell_GetTaxData($orderId: String!) {
    fulfillment {
      order(id: $orderId) {
        merchantCurrencyAtPurchaseTime
        tax {
          salesTax {
            merchantRemitItems: items(remitType: MERCHANT_REMIT) {
              remitType
              createdTime {
                mmddyyyy
              }
              taxableAddress {
                country {
                  name
                }
              }
              authority {
                name
                type
              }
              isSale
              isRefund
              taxAmount {
                display
              }
              refundItemId
            }
            netTax(inMerchantCurrency: true) {
              amount
              display
              currencyCode
            }
            salesTax(inMerchantCurrency: true) {
              amount
              display
              currencyCode
            }
            refundedTax(inMerchantCurrency: true) {
              amount
              display
              currencyCode
            }
            netTaxInAuthorityCurrency: netTax(targetCurrency: AUTHORITY) {
              amount
              display
              currencyCode
            }
            salesTaxInAuthorityCurrency: salesTax(targetCurrency: AUTHORITY) {
              amount
              display
              currencyCode
            }
            refundedTaxInAuthorityCurrency: refundedTax(
              targetCurrency: AUTHORITY
            ) {
              amount
              display
              currencyCode
            }
            merchantRemitNetTaxInAuthorityCurrency: netTax(
              remitType: MERCHANT_REMIT
              inMerchantCurrency: false
            ) {
              amount
              display
              currencyCode
            }
            wishRemitNetTaxInAuthorityCurrency: netTax(
              remitType: WISH_REMIT
              inMerchantCurrency: false
            ) {
              amount
              display
              currencyCode
            }
            remitTypes
            authorityCountry {
              code
            }
          }
        }
      }
    }
  }
`;

export type GetTaxDataResponseType = {
  readonly fulfillment: {
    readonly order?:
      | (Pick<OrderSchema, "merchantCurrencyAtPurchaseTime"> & {
          readonly tax?: PickedOrderTaxInfo | null;
        })
      | undefined;
  };
};

type GetTaxDataRequestType = {
  readonly orderId: string;
};

export const useOrderTaxData = (orderId: string) => {
  const { client } = useApolloStore();
  return useQuery<GetTaxDataResponseType, GetTaxDataRequestType>(
    GET_ORDER_TAX_DATA,
    {
      variables: { orderId },
      client,
    }
  );
};
