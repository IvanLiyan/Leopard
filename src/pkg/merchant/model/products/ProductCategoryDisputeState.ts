import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import {
  UpsertProductCategoryDisputeInput,
  UpsertProductCategoryDispute,
  ProductCategoryDisputeAction,
  FileInput,
  ProductCategoryDisputeSource,
  ProductCategoryDisputeReason,
  ProductCategoryDisputeAdminUnchangedReason,
} from "@schema/types";

/* Merchant Components */
import ProductCategoryDisputeModal from "@merchant/component/products/disputes/create/ProductCategoryDisputeModal";

const PRODUCT_CATEGORY_DISPUTE_MUTATION = gql`
  mutation ProductCategoryDisputeState_ProductCategoryDisputeMutation(
    $input: UpsertProductCategoryDisputeInput!
  ) {
    policy {
      productCategoryDispute {
        upsertProductCategoryDispute(input: $input) {
          ok
          message
          nextId
        }
      }
    }
  }
`;

type ProductCategoryDisputeResponse = {
  readonly policy: {
    readonly productCategoryDispute: {
      readonly upsertProductCategoryDispute: Pick<
        UpsertProductCategoryDispute,
        "ok" | "message" | "nextId"
      >;
    };
  };
};

export default class ProductCategoryDisputeState {
  @observable
  source: ProductCategoryDisputeSource;

  @observable
  action: ProductCategoryDisputeAction;

  @observable
  id?: string | null | undefined;

  @observable
  merchantNote: string | null | undefined;

  @observable
  productId: string | null | undefined;

  @observable
  proposedTopCategoryTagId: string | null | undefined;

  @observable
  uploadFiles: FileInput[] | null | undefined;

  @observable
  euDisputeReason: ProductCategoryDisputeReason | null | undefined;

  @observable
  euComplianceAcceptTerms: boolean;

  @observable
  adminUnchangedReason:
    | ProductCategoryDisputeAdminUnchangedReason
    | null
    | undefined;

  @observable
  adminUnchangedOtherReasonDetails: string | null | undefined;

  @observable
  isSubmitting: boolean = false;

  constructor(args: {
    id?: string;
    productId?: string;
    source: ProductCategoryDisputeSource;
  }) {
    const { id, productId, source } = args;

    if (id != null) {
      this.id = id;
    }

    if (productId != null) {
      this.productId = productId;
    }

    this.source = source;
    this.euComplianceAcceptTerms = false;
    this.action = "CREATE";
  }

  @computed
  get isValid(): boolean {
    if (this.source === "EU_COMPLIANCE") {
      return (
        this.euComplianceAcceptTerms &&
        this.euDisputeReason != null &&
        this.merchantNote != null &&
        this.merchantNote.trim() !== ""
      );
    } else if (this.source === "PRODUCT_CATELOG") {
      return (
        this.merchantNote != null &&
        this.merchantNote.trim() !== "" &&
        this.proposedTopCategoryTagId != null
      );
    }

    return true;
  }

  @action
  async review(makeChange: boolean) {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;
    this.action = makeChange ? "MARK_UPDATE" : "MARK_UNCHANGE";

    const input = {
      action: this.action,
      source: this.source,
      id: this.id,
      ...(!makeChange
        ? {
            adminUnchangedReason: this.adminUnchangedReason,
            adminUnchangedOtherReasonDetails: this
              .adminUnchangedOtherReasonDetails,
          }
        : {}),
    };

    const { data } = await client.mutate<
      ProductCategoryDisputeResponse,
      { input: UpsertProductCategoryDisputeInput }
    >({
      mutation: PRODUCT_CATEGORY_DISPUTE_MUTATION,
      variables: { input },
    });

    const ok =
      data?.policy.productCategoryDispute.upsertProductCategoryDispute.ok;
    const message =
      data?.policy.productCategoryDispute.upsertProductCategoryDispute.message;
    const nextId =
      data?.policy.productCategoryDispute.upsertProductCategoryDispute.nextId;
    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`
      );
      return;
    }
    if (nextId) {
      await navigationStore.navigate(
        `/review-product-category-dispute/${nextId}`
      );
    } else {
      await navigationStore.navigate("/product-category-disputes");
    }

    toastStore.positive(i`Submitted successfully.`, {
      timeoutMs: 7000,
      deferred: true,
    });
  }

  @action
  async submit() {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;

    const input = {
      action: this.action,
      source: this.source,
      id: this.id,
      merchantNote: this.merchantNote,
      productId: this.productId,
      proposedTopCategoryTagId: this.proposedTopCategoryTagId,
      uploadFiles: this.uploadFiles,
      reason: this.euDisputeReason,
    };

    const { data } = await client.mutate<
      ProductCategoryDisputeResponse,
      { input: UpsertProductCategoryDisputeInput }
    >({
      mutation: PRODUCT_CATEGORY_DISPUTE_MUTATION,
      variables: { input },
    });

    const ok =
      data?.policy.productCategoryDispute.upsertProductCategoryDispute.ok;
    const message =
      data?.policy.productCategoryDispute.upsertProductCategoryDispute.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`
      );
      return;
    }

    new ProductCategoryDisputeModal({
      fromEuCompliance: this.source === "EU_COMPLIANCE",
    }).render();
  }
}
