import { observable, action, computed } from "mobx";

import { VideoVisibility, VideoUpsertInput } from "@schema/types";
import {
  PickedProductSchema,
  UPSERT_VIDEO_MUTATION,
  UpsertVideoResponseData,
} from "@toolkit/wish-clips/video-management";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const notBlank = (arg: unknown): boolean => {
  if (typeof arg === "string") {
    return arg.trim() != "";
  }
  return arg != null;
};

export default class VideoCatalogState {
  /* For upload flow only */

  @observable
  videoUploading: boolean = false;

  /* End of upload flow only */

  @observable
  videoId?: string | null;

  @observable
  videoFileName?: string | null;

  @observable
  videoTitle?: string | null;

  @observable
  videoDescription?: string | null;

  @observable
  videoUrl?: string | null;

  @observable
  videoVisibility: VideoVisibility = "LIVE";

  @observable
  linkedProductIds: Set<string> = new Set();

  @observable
  linkedProducts: ReadonlyArray<PickedProductSchema> = [];

  @observable
  isSubmitting: boolean = false;

  constructor(args?: { readonly videoId: string }) {
    if (args == null) {
      return;
    }

    const { videoId } = args;

    this.videoId = videoId;
  }

  @computed
  get videoDetailsFilled(): boolean {
    return [this.videoVisibility, this.videoTitle, this.videoDescription].every(
      (param) => notBlank(param)
    );
  }

  @computed
  get canSubmit(): boolean {
    return (
      this.videoDetailsFilled &&
      notBlank(this.videoUrl) &&
      this.linkedProductIds.size > 0
    );
  }

  @action
  unlinkProduct(productId: string) {
    this.linkedProductIds.delete(productId);
    this.linkedProducts = this.linkedProducts.filter(
      (product) => product.id != productId
    );
  }

  @action
  linkProduct(product: PickedProductSchema) {
    if (this.linkedProductIds.has(product.id)) {
      return;
    }
    this.linkedProductIds.add(product.id);
    this.linkedProducts = [...this.linkedProducts, product];
  }

  @action
  async upsertVideo(showSuccessToast?: boolean): Promise<boolean> {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const {
      videoId,
      videoTitle,
      videoUrl,
      videoDescription,
      videoVisibility,
      linkedProductIds,
    } = this;

    const input = {
      id: videoId,
      videoUrl,
      visibility: videoVisibility,
      productIds: Array.from(linkedProductIds),
      title: videoTitle,
      description: videoDescription,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertVideoResponseData,
      { input: VideoUpsertInput }
    >({
      mutation: UPSERT_VIDEO_MUTATION,
      variables: { input },
    });

    const ok = data?.productCatalog?.upsertVideo.ok;
    const message = data?.productCatalog?.upsertVideo.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return false;
    }

    await navigationStore.navigate("/videos/management-hub/video-catalog");

    if (showSuccessToast) {
      toastStore.positive(i`Video has been updated`, {
        timeoutMs: 7000,
        deferred: true,
      });
    }

    return true;
  }
}
