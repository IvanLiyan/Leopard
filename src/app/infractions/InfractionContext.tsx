import React, { createContext, useContext } from "react";
import {
  Country,
  MerchantWarningFixAction,
  MerchantWarningProofSchema,
  MerchantWarningReason,
  PaymentCurrencyCode,
} from "@schema";
import {
  CommerceTransactionStateDisplayText,
  DisputeStatus,
  getInfractionCopy,
  MerchantWarningImpactTypeDisplayText,
  MerchantWarningStateDisplayText,
} from "./copy";
import { DisputeFlow, getDisputeFlow, getDisputeStatus } from "./toolkit";
import { ApolloError, useQuery } from "@apollo/client";
import { zendeskURL } from "@core/toolkit/url";
import {
  InfractionQueryResponse,
  InfractionQueryVariables,
  INFRACTION_QUERY,
} from "./api/infractionQuery";
import { InfractionEvidenceType } from "./components/cards/InfractionEvidenceCard";

type InfractionContextType = {
  readonly infraction: {
    readonly type: MerchantWarningReason;
    readonly id: string;
    readonly title: string;
    readonly body: string;
    readonly policy: string | undefined;
    readonly faq: string | undefined;
    readonly state: string;
    readonly issuedDate: string;
    readonly disputeDeadline: string;
    readonly disputeDeadlineUnix: number;
    readonly disputeStatus: DisputeStatus;
    readonly infractionImpacts: ReadonlyArray<string>;
    readonly wssImpact: boolean | undefined;
    readonly order?: {
      readonly orderCancellationReason: string | undefined;
      readonly orderId: string;
      readonly orderStatus: string;
      readonly orderTotal: string;
      readonly availableForFulfillmentDate: string | undefined;
      readonly confirmedFulfillmentDate: string | undefined;
      readonly confirmedDeliveryDate: string | undefined;
      readonly autoRefundedDate: string | undefined;
      readonly trackingDisputeId: string | undefined;
      readonly trackingStatus: string | undefined;
      readonly trackingId: string | undefined;
      readonly carrier: string | undefined;
    };
    readonly product?: {
      readonly productImageUrl: string;
      readonly productName: string;
      readonly productId: string;
      readonly productSku?: string | null;
      readonly productDescription?: string;
    };
    readonly brand?: {
      readonly brandName: string | undefined;
      readonly brandContactName: string | undefined;
      readonly brandPhoneNumber: string | undefined;
      readonly brandEmail: string | undefined;
    };
    readonly infractionEvidence: ReadonlyArray<{
      readonly type: InfractionEvidenceType;
      readonly id: string;
      readonly note: string;
    }>;
    readonly actions: ReadonlyArray<MerchantWarningFixAction>;
    readonly actionsTaken: ReadonlyArray<MerchantWarningFixAction>;
    readonly brandAuthorizations: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
  };
  readonly refetchInfraction: () => unknown;
  readonly disputeFlow: DisputeFlow;
  readonly merchantCurrency: PaymentCurrencyCode;
  readonly ordersDisputeAdapter: {
    readonly countriesWeShipTo: ReadonlyArray<Pick<Country, "name" | "code">>;
    readonly proofs: ReadonlyArray<
      Pick<MerchantWarningProofSchema, "id" | "type" | "disputeStatus">
    >;
  };
};

const InfractionContext = createContext<InfractionContextType>({
  infraction: {
    type: "BAD_CUSTOMER_SERVICE",
    id: "",
    title: "",
    body: "",
    policy: "",
    faq: "",
    state: "",
    issuedDate: "",
    disputeDeadline: "",
    disputeDeadlineUnix: 0,
    disputeStatus: "NOT_DISPUTED",
    infractionImpacts: [],
    wssImpact: false,
    order: undefined,
    product: undefined,
    brand: undefined,
    infractionEvidence: [],
    actions: [],
    actionsTaken: [],
    brandAuthorizations: [],
  },
  refetchInfraction: () => {
    void null;
  },
  disputeFlow: "MERCHANT",
  merchantCurrency: "USD",
  ordersDisputeAdapter: {
    countriesWeShipTo: [],
    proofs: [],
  },
});

export const useInfractionContext = () => {
  return useContext(InfractionContext);
};

export const useInfractionProvider = ({
  infractionId,
  merchantId,
}: {
  infractionId: string;
  merchantId: string | null | undefined;
}): {
  InfractionProvider: React.FC<{ children: React.ReactNode }>;
  loading: boolean;
  error: ApolloError | "INFRACTION_IS_NULL" | undefined;
  infractionContext: InfractionContextType | undefined;
} => {
  const { data, loading, error, refetch } = useQuery<
    InfractionQueryResponse,
    InfractionQueryVariables
  >(INFRACTION_QUERY, {
    variables: {
      infractionId,
      merchantId: merchantId ?? "", // query is skipped in this case
    },
    skip: merchantId == null,
    errorPolicy: "all", // temporarily allowing errors while BE fixes things
  });

  if (loading) {
    return {
      InfractionProvider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      ),
      loading,
      error,
      infractionContext: undefined,
    };
  }

  const infraction = data?.policy?.merchantWarning;

  if (error || infraction == null) {
    return {
      InfractionProvider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      ),
      loading,
      error: error ?? "INFRACTION_IS_NULL",
      infractionContext: undefined,
    };
  }

  const infractionCopy = getInfractionCopy(
    infraction.reason.reason,
    infraction.productTrueTagInfo?.counterfeitViolation?.reason ??
      infraction.productTrueTagInfo?.inappropriateViolation?.reason ??
      undefined,
    infraction.productTrueTagInfo?.subreason?.subcategory ?? undefined,
  );

  const product = infraction.products?.[0];

  const infractionContext: InfractionContextType = {
    infraction: {
      type: infraction.reason.reason,
      id: infractionId,
      title: infractionCopy.title,
      body: (infraction.merchantActions ?? []).includes("PRODUCT_AUTHORIZATION")
        ? i`[Learn more](${zendeskURL(
            "mu360055998653",
          )}) about the requirements needed to offer this category of product on Wish.`
        : infractionCopy.body,
      policy: infractionCopy.policy,
      faq: infractionCopy.faq,
      state: MerchantWarningStateDisplayText[infraction.state],
      issuedDate: infraction.createdTime.datetime,
      disputeDeadline: infraction.effectiveDisputeDeadlineDate.datetime,
      disputeDeadlineUnix: infraction.effectiveDisputeDeadlineDate.unix,
      disputeStatus: getDisputeStatus(infraction),
      infractionImpacts:
        infraction.impacts != null
          ? infraction.impacts.map(({ type, startDate, endDate, countries }) =>
              MerchantWarningImpactTypeDisplayText[type](
                startDate?.datetime,
                endDate?.datetime,
                countries.map(({ name }) => name),
              ),
            )
          : [],
      wssImpact:
        infraction.wssImpact === "YES"
          ? true
          : infraction.wssImpact === "NO"
          ? false
          : undefined,
      order: infraction.order
        ? {
            orderCancellationReason:
              infraction.order?.refundItems &&
              infraction.order.refundItems.length > 0
                ? infraction.order.refundItems
                    .map(({ reasonInfo: { text } }) => text)
                    .join(", ")
                : undefined,
            orderId: infraction.order.id,
            orderStatus:
              CommerceTransactionStateDisplayText[infraction.order.state],
            orderTotal: infraction.order.merchantTotal.display,
            availableForFulfillmentDate:
              infraction.order.releasedTime?.datetime,
            confirmedFulfillmentDate:
              infraction.order.tracking?.confirmedFulfillmentDate?.datetime,
            confirmedDeliveryDate:
              infraction.order.tracking?.deliveredDate?.datetime,
            autoRefundedDate: infraction.order.refundedTime?.datetime,
            trackingDisputeId: infraction.trackingDispute?.id,
            trackingStatus:
              infraction.order.tracking?.checkpoints &&
              infraction.order.tracking.checkpoints.length > 0
                ? [...infraction.order.tracking.checkpoints].sort(
                    ({ date: { unix: unixA } }, { date: { unix: unixB } }) =>
                      unixB - unixA,
                  )[0].resultingTracking.text ?? undefined
                : undefined,
            trackingId:
              infraction.order.shippingDetails?.trackingId ?? undefined,
            carrier: infraction.order.shippingDetails?.provider?.name,
          }
        : undefined,
      product: product
        ? {
            productImageUrl: product.mainImage.wishUrl,
            productName: product.name,
            productId: product.id,
            productSku: product.sku,
            productDescription: product.description,
          }
        : undefined,
      brand: infraction.takedownRequest
        ? {
            brandName: infraction.takedownRequest.name ?? undefined,
            brandContactName: infraction.takedownRequest.contact ?? undefined,
            brandPhoneNumber:
              infraction.takedownRequest.phoneNumber ?? undefined,
            brandEmail: infraction.takedownRequest.email ?? undefined,
          }
        : undefined,
      infractionEvidence: infraction.proofs.map((proof) =>
        infraction.reason.reason == "REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER" &&
        proof.warningId
          ? {
              type: "INFRACTION",
              id: proof.warningId,
              note: proof.note ?? "--",
            }
          : {
              type: proof.type,
              id: proof.id,
              note: proof.note ?? "--",
            },
      ),
      actions: infraction.merchantActions ?? [],
      actionsTaken: infraction.outstandingMerchantActions ?? [],
      brandAuthorizations:
        data?.brand?.brandAuthorizations?.map((authorization) => ({
          id: authorization.id,
          name: authorization.brand.name,
        })) ?? [],
    },
    refetchInfraction: refetch,
    disputeFlow: getDisputeFlow(
      infraction.reason.reason,
      infraction.productTrueTagInfo?.counterfeitViolation?.reason ??
        infraction.productTrueTagInfo?.inappropriateViolation?.reason ??
        undefined,
      infraction.productTrueTagInfo?.subreason?.subcategory ?? undefined,
    ),
    merchantCurrency: infraction.merchant.primaryCurrency,
    ordersDisputeAdapter: {
      countriesWeShipTo: data?.platformConstants.countriesWeShipTo ?? [],
      proofs: infraction.proofs.map(({ id, type, disputeStatus }) => ({
        id,
        type,
        disputeStatus,
      })),
    },
  };

  return {
    InfractionProvider: ({ children }: { children: React.ReactNode }) => (
      <InfractionContext.Provider value={infractionContext}>
        {children}
      </InfractionContext.Provider>
    ),
    loading,
    error,
    infractionContext,
  };
};
