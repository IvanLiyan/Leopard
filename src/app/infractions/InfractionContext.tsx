import { createContext } from "react";
import { MerchantWarningFixAction, MerchantWarningProofType } from "@schema";
import { DisputeStatus } from "./toolkit";

export type InfractionContextType = {
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

export const InfractionContext = createContext<InfractionContextType>({
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
