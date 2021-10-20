/* External Libraries */
import { observable, computed, action } from "mobx";
import gql from "graphql-tag";

/* Merchant API */
import * as productApi from "@merchant/api/product";
import { ProductDetail, ProductUpdateData } from "@merchant/api/product";

/* Merchant Store */
import ApolloStore from "@stores/ApolloStore";
import {
  UpsertProduct,
  ProductUpsertInput,
  InventoryInput,
  VariationInput,
  PaymentCurrencyCode,
} from "@schema/types";
import NavigationStore from "@stores/NavigationStore";
import UserStore from "@stores/UserStore";
import ToastStore from "@stores/ToastStore";

import { CurrencyInput, Maybe } from "@schema/types";

const UPSERT_VARIATION_MUTATION = gql`
  mutation updateVariation(
    $productId: ObjectIdType!
    $variations: [VariationInput!]!
  ) {
    productCatalog {
      upsertProduct(input: { id: $productId, variations: $variations }) {
        ok
        message
      }
    }
  }
`;

export class VariationEditState {
  id: string;

  @observable
  sku: string | null | undefined;

  @observable
  size: string | null | undefined;

  @observable
  color: string | null | undefined;

  @observable
  price: number | null | undefined;

  @observable
  cost: number | null | undefined;

  @observable
  inventory: number | null | undefined;

  @observable
  enabled: boolean | null | undefined;

  constructor(params: { variationId: string }) {
    this.id = params.variationId;
  }
}

export default class ProductEditState {
  productId: string;
  submitSuccess: boolean;

  @observable
  mainImageUrl: string | null | undefined;

  @observable
  extraImageUrls: ReadonlyArray<string> | null | undefined;

  @observable
  cleanImageUrl: string | null | undefined;

  @observable
  sizeChartName: string | null | undefined;

  @observable
  name: string | null | undefined;

  @observable
  parentSku: string | null | undefined;

  @observable
  description: string | null | undefined;

  @observable
  brandId: string | null | undefined;

  @observable
  upc: string | null | undefined;

  @observable
  landingPageUrl: string | null | undefined;

  @observable
  maxQuantity: number | null | undefined;

  @observable
  isLtl: string | null | undefined;

  @observable
  validBrand: boolean = true;

  @observable
  tags: ReadonlyArray<string> | null | undefined;

  @observable
  variations: Map<string, VariationEditState> = new Map();

  @observable
  currencyCode: PaymentCurrencyCode | null | undefined;

  constructor(params: { productId: string }) {
    this.productId = params.productId;
    this.submitSuccess = false;
  }

  @computed
  get productDetail(): ProductDetail | null | undefined {
    const productDetailRequest = productApi.getProductDetail({
      product_id: this.productId,
    });
    return productDetailRequest?.response?.data?.product_detail;
  }

  @computed
  get updateData(): ProductUpdateData {
    const updateData: ProductUpdateData = {};
    if (this.mainImageUrl != null) {
      updateData.main_image_url = this.mainImageUrl;
    }
    if (this.extraImageUrls != null) {
      updateData.extra_image_urls = this.extraImageUrls;
    }
    if (this.cleanImageUrl != null) {
      updateData.clean_image_url = this.cleanImageUrl;
    }
    if (this.sizeChartName !== null) {
      updateData.size_chart_name = this.sizeChartName;
    }
    if (this.name != null) {
      updateData.name = this.name;
    }
    if (this.parentSku != null) {
      updateData.parent_sku = this.parentSku;
    }
    if (this.description != null) {
      updateData.description = this.description;
    }
    if (this.brandId != null) {
      updateData.brand_id = this.brandId;
    }
    if (this.upc != null) {
      updateData.upc = this.upc;
    }
    if (this.maxQuantity != null) {
      updateData.max_quantity = this.maxQuantity;
    }
    if (this.landingPageUrl != null) {
      updateData.landing_page_url = this.landingPageUrl;
    }
    if (this.tags != null) {
      updateData.tags = this.tags;
    }
    return updateData;
  }

  @computed
  get updateError(): string | null | undefined {
    const { updateData } = this;
    if (
      updateData.main_image_url &&
      updateData.main_image_url.trim().length === 0
    ) {
      return i`Main image cannot be empty.`;
    }
    if (!this.validBrand) {
      return i`You must select a brand from drop down list`;
    }
    if (this.tags && this.tags.length > 10) {
      return i`One product can have at most 10 tags`;
    }
  }

  hasUpdates(
    attributeValues?: ReadonlyArray<unknown> | null | undefined,
  ): boolean {
    const { updateData } = this;
    const values = attributeValues
      ? attributeValues
      : Object.values(updateData);
    let updated = false || this.variations.size !== 0;
    values.forEach((val) => (updated = updated || val !== undefined));
    return updated;
  }

  canUpdateVariation(): boolean {
    let canUpdate = true;
    this.variations.forEach((updateData) => {
      canUpdate =
        canUpdate && !!updateData.sku && updateData.sku.trim().length > 0;
    });
    return canUpdate;
  }

  @computed
  get hasNonSizeChartUpdates(): boolean {
    const { updateData } = this;
    let updated = false;
    for (const key of Object.keys(updateData) as (keyof ProductUpdateData)[]) {
      if (key !== "size_chart_name" && updateData[key] !== undefined) {
        updated = true;
        break;
      }
    }
    return updated;
  }

  @action
  setImages(params: {
    mainImageUrl: string;
    extraImageUrls: ReadonlyArray<string>;
    cleanImageUrl: string;
  }) {
    const navigationStore = NavigationStore.instance();
    const { mainImageUrl, extraImageUrls, cleanImageUrl } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const {
      main_image: oldMainImage,
      extra_images: oldExtraImages,
      clean_image: oldCleanImage,
    } = this.productDetail;

    this.mainImageUrl = oldMainImage === mainImageUrl ? null : mainImageUrl;
    const extraImagesUnchanged =
      extraImageUrls.length === oldExtraImages.length &&
      extraImageUrls.every((url, idx) => url === oldExtraImages[idx]);
    this.extraImageUrls = extraImagesUnchanged ? null : extraImageUrls;
    this.cleanImageUrl = cleanImageUrl === oldCleanImage ? null : cleanImageUrl;
  }

  @action
  setName(params: { name: string }) {
    const navigationStore = NavigationStore.instance();
    const { name } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const { name: oldName } = this.productDetail;

    this.name = oldName === name ? null : name;
  }

  @action
  setDescription(params: { description: string }) {
    const navigationStore = NavigationStore.instance();
    const { description } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }

    const { description: oldDescription } = this.productDetail;

    this.description = oldDescription === description ? null : description;
  }

  @action
  setParentSKU(params: { parentSku: string }) {
    const navigationStore = NavigationStore.instance();
    const { parentSku } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const { parent_sku: oldSKU } = this.productDetail;

    this.parentSku = oldSKU === parentSku ? null : parentSku;
  }

  @action
  setUPC(params: { upc: string }) {
    const navigationStore = NavigationStore.instance();
    const { upc } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const { brand_id: oldUPC } = this.productDetail;
    this.upc = oldUPC === upc ? null : upc;
  }

  @action
  setLandingPageUrl(params: { landingPageUrl: string }) {
    const navigationStore = NavigationStore.instance();
    const { landingPageUrl } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const { landing_page_url: oldLandingPageUrl } = this.productDetail;
    this.landingPageUrl =
      oldLandingPageUrl === landingPageUrl ? null : landingPageUrl;
  }

  @action
  setMaxQuantity(params: { maxQuantity: number }) {
    const navigationStore = NavigationStore.instance();
    const { maxQuantity } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    const { max_quantity: oldMaxQuantity } = this.productDetail;
    this.maxQuantity = oldMaxQuantity === maxQuantity ? null : maxQuantity;
  }

  @action
  setTags(params: { tagsString: string }) {
    const navigationStore = NavigationStore.instance();
    const { tagsString } = params;
    if (this.productDetail == null) {
      navigationStore.reload();
      return;
    }
    let tagList = tagsString.split(",");
    tagList = tagList.filter((tag) => tag.trim().length > 0);
    const { tags: tags } = this.productDetail;
    this.tags = tagList === tags ? null : tagList;
  }

  @action
  setVariationColor(params: { id: string; value: string }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.color = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationSize(params: { id: string; value: string }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.size = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationSKU(params: { id: string; value: string }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.sku = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationInventory(params: { id: string; value: number }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.inventory = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationPrice(params: { id: string; value: number }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.price = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationCost(params: { id: string; value: number }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.cost = value;
    this.variations.set(id, variationEditState);
  }

  @action
  setVariationEnabled(params: { id: string; value: boolean }) {
    const { id, value } = params;
    let variationEditState = this.variations.get(id);
    if (!variationEditState) {
      variationEditState = new VariationEditState({ variationId: id });
    }
    variationEditState.enabled = value;
    this.variations.set(id, variationEditState);
  }

  async submit() {
    const toastStore = ToastStore.instance();
    const userStore = UserStore.instance();
    const { updateData, updateError } = this;

    this.currencyCode = userStore.merchantSourceCurrency || "USD";
    const hasUpdates = this.hasUpdates();
    const hasImageUpdates = this.hasUpdates([
      this.mainImageUrl,
      this.extraImageUrls,
      this.cleanImageUrl,
    ]);
    const canUpdateVariations = this.canUpdateVariation();

    if (!hasUpdates) {
      toastStore.error(i`You did not make any change to the product.`);
      return;
    }
    if (updateError) {
      toastStore.error(updateError);
      return;
    }
    if (!canUpdateVariations) {
      toastStore.error(i`Cannot update variation sku to be empty. Please Fix.`);
      return;
    }

    const variationUpdateInfo: Array<VariationInput> = [];
    this.variations.forEach((updateData) => {
      const warehouseId = this.productDetail
        ? this.productDetail.default_warehouse_id
        : null;
      const inventoryData: ReadonlyArray<InventoryInput> =
        updateData.inventory == null || warehouseId == null
          ? []
          : [
              {
                warehouseId,
                count: updateData.inventory,
              },
            ];
      const priceData: Maybe<CurrencyInput> =
        updateData.price == null
          ? null
          : {
              currencyCode: this.currencyCode || "USD",
              amount: updateData.price,
            };
      const costData: Maybe<CurrencyInput> =
        updateData.cost == null
          ? null
          : {
              currencyCode: this.currencyCode || "USD",
              amount: updateData.cost,
            };
      const variationData: VariationInput = {
        id: updateData.id,
        sku: updateData.sku,
        color: updateData.color,
        size: updateData.size,
        enabled: updateData.enabled,
        inventory: inventoryData,
        price: priceData,
        cost: costData,
      };
      variationUpdateInfo.push(variationData);
    });

    type UpdateVariationMutationArgs = {
      readonly productId: ProductUpsertInput["id"];
      readonly variations: ProductUpsertInput["variations"];
    };

    type UpdateVariationMutationResponse = {
      readonly productCatalog: {
        readonly upsertProduct: Pick<UpsertProduct, "ok" | "message">;
      };
    };

    const { client } = ApolloStore.instance();

    const { data } = await client.mutate<
      UpdateVariationMutationResponse,
      UpdateVariationMutationArgs
    >({
      mutation: UPSERT_VARIATION_MUTATION,
      variables: {
        productId: this.productId,
        variations: variationUpdateInfo,
      },
    });

    if (!data?.productCatalog.upsertProduct.ok) {
      toastStore.error(
        data?.productCatalog.upsertProduct.message || i`Something went wrong`,
      );
      return;
    }

    try {
      await productApi
        .updateProductDetail({
          product_id: this.productId,
          update_data: JSON.stringify(updateData),
        })
        .call();
    } catch (e) {
      toastStore.error(e.msg);
      return;
    }

    this.submitSuccess = true;
    const successMsg = hasImageUpdates
      ? i`Your product has been updated. Image updates may take a few minutes`
      : i`Your product has been updated.`;
    toastStore.positive(successMsg, {
      deferred: true,
    });
  }
}
