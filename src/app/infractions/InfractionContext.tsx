import React, { createContext, useContext } from "react";
import { MerchantWarningFixAction, MerchantWarningProofType } from "@schema";
import {
  CommerceTransactionStateDisplayText,
  DisputeStatus,
  getInfractionData,
  MerchantWarningImpactTypeDisplayText,
  MerchantWarningStateDisplayText,
} from "./toolkit";
import { ApolloError, useQuery } from "@apollo/client";
import { zendeskURL } from "@core/toolkit/url";
import {
  InfractionQueryResponse,
  InfractionQueryVariables,
  INFRACTION_QUERY,
} from "./api/infractionQuery";

type InfractionContextType = {
  readonly infraction: {
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
      readonly type: MerchantWarningProofType;
      readonly id: string;
      readonly note: string;
    }>;
    readonly actions: ReadonlyArray<MerchantWarningFixAction>;
    readonly brandAuthorizations: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
  };
  refetchInfraction: () => unknown;
};

const InfractionContext = createContext<InfractionContextType>({
  infraction: {
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
    brandAuthorizations: [],
  },
  refetchInfraction: () => {
    void null;
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
    };
  }

  const infractionDisplayText = getInfractionData(
    infraction.reason.reason,
    infraction.productTrueTagInfo?.counterfeitViolation?.reason ??
      infraction.productTrueTagInfo?.inappropriateViolation?.reason ??
      undefined,
    infraction.productTrueTagInfo?.subreason?.subcategory,
  );

  const infractionContext: InfractionContextType = {
    infraction: {
      id: infractionId,
      title: infractionDisplayText.title,
      body: (infraction.merchantActions ?? []).includes("PRODUCT_AUTHORIZATION")
        ? i`[Learn more](${zendeskURL(
            "mu360055998653",
          )}) about the requirements needed to offer this category of product on Wish.`
        : infractionDisplayText.body,
      policy: infractionDisplayText.policy,
      faq: infractionDisplayText.faq,
      state: MerchantWarningStateDisplayText[infraction.state],
      issuedDate: infraction.createdTime.datetime,
      disputeDeadline: infraction.effectiveDisputeDeadlineDate.datetime,
      disputeDeadlineUnix: infraction.effectiveDisputeDeadlineDate.unix,
      disputeStatus:
        infraction.trackingDispute != null
          ? infraction.trackingDispute.state
          : infraction.proofs.length > 0
          ? infraction.proofs[0].disputeStatus
          : "NOT_DISPUTED",
      infractionImpacts:
        infraction.impacts != null
          ? infraction.impacts.map(({ type, startDate, endDate }) =>
              MerchantWarningImpactTypeDisplayText[type](
                startDate?.datetime,
                endDate?.datetime,
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
                      unixA - unixB,
                  )[0].resultingTracking.text ?? undefined
                : undefined,
            trackingId:
              infraction.order.shippingDetails?.trackingId ?? undefined,
            carrier: infraction.order.shippingDetails?.provider?.name,
          }
        : undefined,
      product: infraction.product
        ? {
            productImageUrl: infraction.product.mainImage.wishUrl,
            productName: infraction.product.name,
            productId: infraction.product.id,
            productSku: infraction.product.sku,
            productDescription: infraction.product.description,
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
      infractionEvidence: infraction.proofs.map((proof) => ({
        type: proof.type,
        id: proof.id,
        note: proof.message ?? "--",
      })),
      actions: infraction.merchantActions ?? [],
      brandAuthorizations:
        data?.brand?.brandAuthorizations?.map((authorization) => ({
          id: authorization.id,
          name: authorization.brand.name,
        })) ?? [],
    },
    refetchInfraction: refetch,
  };

  return {
    InfractionProvider: ({ children }: { children: React.ReactNode }) => (
      <InfractionContext.Provider value={infractionContext}>
        {children}
      </InfractionContext.Provider>
    ),
    loading,
    error,
  };
};
