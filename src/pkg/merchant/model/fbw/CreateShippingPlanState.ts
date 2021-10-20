import { action, observable, computed } from "mobx";
import {
  Step,
  StepList,
  InitialData,
  SUBMIT_SHIPPING_PLAN,
  PickedVariationSchema,
  PickedAvailableWarehouse,
  SubmitShippingPlanResponseType,
} from "@toolkit/fbw/create-shipping-plan";
import {
  ShippingPlanInput,
  FulfilledByWishMutationsCreateShippingPlanArgs,
} from "@schema/types";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const DEFAULT_INVENTORY = 10;

export class VariationState {
  variation: PickedVariationSchema;
  parent: CreateShippingPlanState;

  @observable
  inventoryByWarehouseId: Map<string, number> = new Map();

  @observable
  length = 0;

  @observable
  width = 0;

  @observable
  height = 0;

  @observable
  weight = 0;

  constructor(params: {
    readonly variation: VariationState["variation"];
    readonly parent: VariationState["parent"];
    readonly selectedWarehouseIds: string[];
  }) {
    this.variation = params.variation;
    this.parent = params.parent;

    this.initializeInventories(params.selectedWarehouseIds);
  }

  initializeInventories(warehouseIds: string[]) {
    warehouseIds.forEach((wId) =>
      this.inventoryByWarehouseId.set(wId, DEFAULT_INVENTORY),
    );
  }

  getActiveInventory(warehouseId: string): number {
    const {
      variation: { fbwInventory },
    } = this;
    const warehouseInventory = fbwInventory.find(
      ({ warehouse }) => warehouse.id == warehouseId,
    );
    if (warehouseInventory == null) {
      return 0;
    }
    return warehouseInventory.activeInventory;
  }

  @computed
  get dimensions(): string {
    const { length, width, height } = this;
    return `${length}cm x ${width}cm x ${height}cm`;
  }

  @computed
  get hasInventoryForSelectedVariations(): boolean {
    const {
      inventoryByWarehouseId,
      parent: { selectedWarehouseIds },
    } = this;
    return selectedWarehouseIds.every(
      (warehouseId) => !!inventoryByWarehouseId.get(warehouseId),
    );
  }

  @computed
  get hasDimensions(): boolean {
    const { length, width, height, weight } = this;
    return length > 0 && width > 0 && height > 0 && weight > 0;
  }

  @computed
  get hasSiblings(): boolean {
    return this.parent.selectedVariations.some(
      ({ variation: { id, productId } }) =>
        id != this.variation.id && productId == this.variation.productId,
    );
  }

  @computed
  get canCopy(): boolean {
    return this.hasDimensions && this.hasSiblings;
  }
}

export default class CreateShippingPlanState {
  initialData: InitialData;

  @observable
  isSubmitting = false;

  @observable
  currentStepIndex = 0;

  @observable
  selectedWarehouseIds: ReadonlyArray<string> = [];

  @observable
  selectedVariations: ReadonlyArray<VariationState> = [];

  @observable
  selectedVariationsBackup: ReadonlyArray<VariationState> = [];

  constructor(params: {
    readonly initialData: CreateShippingPlanState["initialData"];
  }) {
    this.initialData = params.initialData;
  }

  @computed
  get variationsHaveChanged(): boolean {
    return (
      JSON.stringify(
        this.selectedVariations.map((v) => v.variation.id).sort(),
      ) !==
      JSON.stringify(
        this.selectedVariationsBackup.map((v) => v.variation.id).sort(),
      )
    );
  }

  @computed
  get currentStep(): Step {
    const { currentStepIndex } = this;
    return StepList[currentStepIndex];
  }

  @computed
  get availableWarehouses(): ReadonlyArray<PickedAvailableWarehouse> {
    const {
      initialData: {
        currentMerchant: {
          fulfilledByWish: { availableWarehousesForShippingPlanSubmission },
        },
      },
    } = this;
    return availableWarehousesForShippingPlanSubmission;
  }

  @computed
  get selectedWarehouses(): ReadonlyArray<PickedAvailableWarehouse> {
    const { availableWarehouses, selectedWarehouseIds } = this;
    return availableWarehouses.filter((warehouse) =>
      selectedWarehouseIds.includes(warehouse.id),
    );
  }

  @computed
  get hasPreviousStep(): boolean {
    const { currentStepIndex } = this;
    return currentStepIndex > 0;
  }

  @computed
  get canGoBack(): boolean {
    const { hasPreviousStep, isSubmitting } = this;
    return !isSubmitting && hasPreviousStep;
  }

  @computed
  get clearanceError(): string | undefined {
    const { currentStep, selectedWarehouses, selectedVariations } = this;

    if (currentStep == "SELECT_REGION") {
      if (selectedWarehouses.length == 0) {
        return i`Please select warehouses to continue`;
      }
    }

    if (currentStep == "SPECIFY_SKU_AND_QUANTITY") {
      if (selectedVariations.length == 0) {
        return i`Please select SKUs you want to include in this plan`;
      }

      if (
        selectedVariations.some(
          ({ hasInventoryForSelectedVariations }) =>
            !hasInventoryForSelectedVariations,
        )
      ) {
        return i`Please specify inventory for all selected SKUs to continue`;
      }
    }

    if (currentStep == "LOGISTICS_INFO") {
      if (selectedVariations.some(({ hasDimensions }) => !hasDimensions)) {
        return i`Please specify dimensions for all selected SKUs to continue`;
      }
    }
  }

  @computed
  get canGoNext(): boolean {
    const { clearanceError } = this;
    return clearanceError == null;
  }

  isSelectedWarehouse(warehouseId: string): boolean {
    const { selectedWarehouseIds } = this;
    return selectedWarehouseIds.includes(warehouseId);
  }

  @action
  selectWarehouse(warehouseId: string) {
    if (this.isSelectedWarehouse(warehouseId)) {
      return;
    }
    this.selectedWarehouseIds = [...this.selectedWarehouseIds, warehouseId];
    const navigationStore = NavigationStore.instance();
    navigationStore.placeNavigationLock(
      i`You have unsaved changed. Are you sure want to leave?`,
    );

    this.selectedVariations.forEach((variation) =>
      variation.initializeInventories([warehouseId]),
    );
  }

  @action
  deselectWarehouse(warehouseId: string) {
    if (!this.isSelectedWarehouse(warehouseId)) {
      return;
    }
    this.selectedWarehouseIds = this.selectedWarehouseIds.filter(
      (id) => id != warehouseId,
    );
    const navigationStore = NavigationStore.instance();
    if (this.selectedWarehouseIds.length == 0) {
      navigationStore.releaseNavigationLock();
    }
  }

  isSelectedVariation(variationId: string): boolean {
    const { selectedVariations } = this;
    return selectedVariations.some(
      ({ variation }) => variation.id == variationId,
    );
  }

  @action
  selectVariation(variation: PickedVariationSchema) {
    if (this.isSelectedVariation(variation.id)) {
      return;
    }
    this.selectedVariations = [
      ...this.selectedVariations,
      new VariationState({
        variation,
        parent: this,
        selectedWarehouseIds: [...this.selectedWarehouseIds],
      }),
    ];
  }

  @action
  deselectVariation(variation: PickedVariationSchema) {
    if (!this.isSelectedVariation(variation.id)) {
      return;
    }
    this.selectedVariations = this.selectedVariations.filter(
      ({ variation: { id } }) => id != variation.id,
    );
  }

  @action
  backupVariations() {
    this.selectedVariationsBackup = this.selectedVariations;
  }

  @action
  restoreVariations() {
    this.selectedVariations = this.selectedVariationsBackup;
  }

  @action
  updateAllVariations({
    variation: { productId: incomingProductId },
    height: incomingHeight,
    width: incomingWidth,
    length: incomingLength,
    weight: incomingWeight,
  }: VariationState) {
    this.selectedVariations.forEach((state) => {
      if (state.variation.productId == incomingProductId) {
        state.height = incomingHeight;
        state.width = incomingWidth;
        state.length = incomingLength;
        state.weight = incomingWeight;
      }
    });
  }

  @action
  async moveToNextStep() {
    const { currentStep } = this;
    if (currentStep != "SUBMIT") {
      this.currentStepIndex = Math.min(
        StepList.length - 1,
        this.currentStepIndex + 1,
      );
      return;
    }
    await this.submit();
  }

  @action
  moveToPreviousStep() {
    this.currentStepIndex = Math.max(0, this.currentStepIndex - 1);
  }

  private async submit() {
    const { selectedVariations, selectedWarehouseIds } = this;
    const createdShippingPlanIDs = new Set();

    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const inputs: ReadonlyArray<ShippingPlanInput> = selectedWarehouseIds.map(
      (warehouseId) => {
        return {
          warehouseId,
          skus: selectedVariations.map((variationState) => ({
            quantity:
              variationState.inventoryByWarehouseId.get(warehouseId) || 0,
            variationId: variationState.variation.id,
            dimensions: {
              width: { value: variationState.width, unit: "CENTIMETER" },
              length: { value: variationState.length, unit: "CENTIMETER" },
              height: { value: variationState.height, unit: "CENTIMETER" },
              weight: { value: variationState.weight, unit: "KILOGRAM" },
            },
          })),
        };
      },
    );
    this.isSubmitting = true;
    const responses = await Promise.all(
      inputs.map((input) => this.submitWarehouse(input)),
    );
    for (const response of responses) {
      const ok = response?.logistics.fulfilledByWish.createShippingPlan.ok;
      const message =
        response?.logistics.fulfilledByWish.createShippingPlan.message;
      const shippingPlanID =
        response?.logistics.fulfilledByWish.createShippingPlan.shippingPlan.id;

      if (!ok) {
        toastStore.error(message || i`Something went wrong`);
        this.isSubmitting = false;
        return;
      }

      createdShippingPlanIDs.add(shippingPlanID);
    }
    toastStore.positive(i`Shipping plan has been created!`, { deferred: true });
    navigationStore.releaseNavigationLock();
    const url = `/fbw/shipping-plans-by-id?ids=${[
      ...createdShippingPlanIDs,
    ].join(",")}`;
    await navigationStore.navigate(url);
  }

  private async submitWarehouse(
    input: ShippingPlanInput,
  ): Promise<SubmitShippingPlanResponseType | undefined | null> {
    const { client } = ApolloStore.instance();

    const { data } = await client.mutate<
      SubmitShippingPlanResponseType,
      FulfilledByWishMutationsCreateShippingPlanArgs
    >({
      mutation: SUBMIT_SHIPPING_PLAN,
      variables: {
        input,
      },
    });

    return data;
  }
}
