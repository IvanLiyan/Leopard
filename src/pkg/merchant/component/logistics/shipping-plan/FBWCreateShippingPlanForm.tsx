import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable, reaction } from "mobx";

/* External Libraries */
import numeral from "numeral";
import _ from "lodash";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Label } from "@ContextLogic/lego";
import { Pager } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { ThemedLabel } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as illustrations from "@assets/illustrations";

/* Merchant Components */
import FBWWarehouseSelection from "@merchant/component/logistics/shipping-plan/FBWWarehouseSelection";
import FBWWarehousesClassificationModal from "@merchant/component/logistics/shipping-plan/FBWWarehousesClassificationModal";
import FBWWarehouseTaxForm from "@merchant/component/logistics/shipping-plan/FBWWarehouseTaxForm";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

/* Merchant Store */
import DimenStore from "@merchant/stores/DimenStore";
import NavigationStore from "@merchant/stores/NavigationStore";

/* Relative Imports */
import FBWCreateShippingPlanTable from "./FBWCreateShippingPlanTable";
import FBWShippingPlanConfirmModal from "./FBWShippingPlanConfirmModal";

import { RowSelectionArgs } from "@ContextLogic/lego";
import { OnChangeEvent } from "@ContextLogic/lego";
import { WarehouseType } from "@toolkit/fbw";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WarehouseQuantityChangeArgs } from "./FBWWarehouseQuantityInput";
import {
  DistributionItem,
  FetchInboundGuidanceResponse,
} from "@merchant/api/fbw";
import { APIResponse } from "@toolkit/api";
import { OnCloseFn } from "@merchant/component/core/modal/Modal";
import { CountryCode } from "@toolkit/countries";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";
import { log } from "@toolkit/logger";

type FBWCreateShippingPlanFormProps = BaseProps & {
  readonly regions: ReadonlyArray<string>;
  readonly countryMapping: {
    [key: string]: CountryCode;
  };
  readonly warehouseClassification: {
    [key: string]: ReadonlyArray<string>;
  };
  readonly whitelistedWarehouses: ReadonlyArray<string>;
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly manualVariations: ReadonlyArray<Product>;
  readonly recommendedVariations: ReadonlyArray<Product>;
  readonly recommendedSelectedVariations: ReadonlyArray<Product>;
  readonly showTermsOfService: boolean;
  readonly shipmentType: string;
  readonly pbIncentive: boolean;
  readonly editState: TaxEnrollmentV2State;
  readonly refetchTaxData: () => void;
};

const FBWShippingPlanCreationTableName = "FBW_SHIPPING_PLAN_CREATION";

@observer
class FBWCreateShippingPlanForm extends Component<
  FBWCreateShippingPlanFormProps
> {
  constructor(props: FBWCreateShippingPlanFormProps) {
    super(props);
    const { countryMapping, regions, warehouseClassification } = this.props;

    this.unbondedWarehouseCountries = new Map(
      warehouseClassification.unbonded.map((unbondedWarehouse) => [
        // if you find this please fix the any types (legacy)
        (this.regionMap as any)[unbondedWarehouse],
        countryMapping[unbondedWarehouse],
      ])
    );
    // if you find this please fix the any types (legacy)
    this.userSelectedRegions = regions.map(
      (value) => (this.regionMap as any)[value]
    );
  }

  regionMap = {
    "FBW-EU-AMS": 4,
    "FBW-US": 1,
    "FBW-EU-TLL": 2,
  };

  // {variation_id => {warehouse_id => quantity}}
  @observable
  variationWarehouseQuantity: Map<string, Map<string, number>> = new Map();

  // {variation_id => {warehouse_id => DistirbutionItem}}
  @observable
  variationWarehouseDistribution: Map<
    string,
    Map<string, DistributionItem>
  > = new Map();

  // {variation_id => quantity}
  @observable
  variationQuantity: Map<string, number> = new Map();

  @observable
  allManualVariations: ReadonlyArray<Product> = [
    ...this.props.manualVariations,
  ];

  @observable
  allRecommendedVariations: ReadonlyArray<Product> = [
    ...this.props.recommendedVariations,
  ];

  @observable
  isOpen = false;

  @observable
  selectedVariationsInModal: Array<Product> = [];

  @observable
  selectedManualVariations: Array<Product> = [...this.props.manualVariations];

  @observable
  selectedRecommendedVariations: Array<Product> = [
    ...this.props.recommendedSelectedVariations,
  ];

  @observable
  tabKey: string =
    this.props.manualVariations.length > 0 ? "manual" : "recommend";

  @observable
  recommendedCurrentPage = 0;

  @observable
  manuallyCurrentPage = 0;

  @observable
  quantityValid = true;

  @observable
  agreedTermsOfService = !this.props.showTermsOfService;

  @observable
  showPreviousSoldProducts = true;

  @observable
  shipmentType: string = this.props.shipmentType;

  @observable
  unbondedWarehouseCountries: Map<number, string>;

  @observable
  userSelectedRegions: Array<number> = [];

  @observable
  taxIDSaved = false;

  variationsDispose: (() => void) | null | undefined = null;

  warehousesDispose: (() => void) | null | undefined = null;

  @computed
  get styles() {
    return StyleSheet.create({
      section: {
        padding: "0 24px",
      },
      tab: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      },
      content: {
        paddingLeft: this.pageX,
        paddingRight: this.pageX,
        paddingBottom: this.pageBottom,
        paddingTop: this.pageTop,
      },
      title: {
        fontSize: 20,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
        paddingTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      p: {
        fontSize: 16,
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
        paddingTop: "8px",
      },
      checkbox: {
        marginLeft: 0,
      },
      header: {
        marginBottom: 30,
      },
      tip: {
        margin: "30px 24px 30px 24px",
      },
      action: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 24,
      },
      link: {
        paddingLeft: 5,
      },
      total: {
        fontSize: 20,
        lineHeight: 1.4,
        color: palettes.textColors.LightInk,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginRight: 24,
      },
      totalText: {
        fontSize: 20,
        textColor: palettes.textColors.White,
      },
      totalNumber: {
        fontSize: 20,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
      },
      modalContent: {
        maxWidth: "100%",
        fontSize: 16,
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightNormal,
        fontFamily: fonts.proxima,
      },
      option: {
        display: "flex",
        flexDirection: "row",
      },
      selectButton: {
        paddingTop: "16px",
        width: "100%",
      },
      subTitle: {
        display: "flex",
        flexDirection: "row",
        paddingTop: "20px",
        alignItems: "center",
        fontSize: 16,
        color: palettes.textColors.DarkInk,
      },
      label: {
        width: 112,
      },
      infoIcon: {
        paddingLeft: "4px",
      },
      subText: {
        lineHeight: 1.43,
        color: palettes.textColors.LightInk,
      },
    });
  }

  warehousesStyle = (columnNumbers: number) => {
    return StyleSheet.create({
      warehouses: {
        display: "grid",
        gridTemplateColumns: "repeat(" + columnNumbers + ", minmax(0, 1fr))",
        gridGap: "16px",
        padding: "16px 0",
      },
    });
  };

  @computed
  get pageX(): string | number {
    const { pageGuideXForPageWithTable } = DimenStore.instance();
    return pageGuideXForPageWithTable;
  }

  @computed
  get pageBottom(): string | number {
    const { pageGuideBottom } = DimenStore.instance();
    return pageGuideBottom;
  }

  @computed
  get pageTop(): string | number {
    return "20px";
  }

  @computed
  get variations(): ReadonlyArray<Product> {
    const { tabKey } = this;
    if (tabKey === "recommend") {
      return [...this.allRecommendedVariations];
    }

    return this.allManualVariations;
  }

  @computed
  get selectedRows(): Array<Product> {
    if (this.tabKey === "recommend") {
      return this.selectedRecommendedVariations;
    }
    return this.selectedManualVariations;
  }

  @computed
  get showTaxForm(): boolean {
    // Check if everything user selected is available for use
    return !_.isEqual(
      _.sortBy(this.userSelectedRegions, _),
      _.sortBy(this.selectedAvailableRegions, _)
    );
  }

  @computed
  get availableRegions(): ReadonlyArray<number> {
    const {
      countryMapping,
      regions,
      warehouseClassification,
      whitelistedWarehouses,
      editState,
    } = this.props;

    return (
      regions
        .filter(
          (
            region // warehouse is not unbonded
          ) =>
            !warehouseClassification.unbonded.includes(region) || // warehouse country has tax settings
            editState.currentCountries.includes(countryMapping[region]) || // merchant has already been using the warehouse, continue letting them do so
            whitelistedWarehouses.includes(region)
        )
        // if you find this please fix the any types (legacy)
        .map((value) => (this.regionMap as any)[value])
    );
  }

  @computed
  get selectedAvailableRegions(): ReadonlyArray<number> {
    return this.availableRegions.filter((value) =>
      this.userSelectedRegions.includes(value)
    );
  }

  componentDidMount() {
    const { showTermsOfService } = this.props;
    if (showTermsOfService) {
      this.renderTermsOfServiceModal();
    }
    this.variationsDispose = reaction(
      () => this.variations,
      (variations) => {
        this.updateCountsBasedOnRecommendation();
      },
      { fireImmediately: true }
    );
    this.warehousesDispose = reaction(
      () => this.availableWarehouses,
      (variations) => {
        this.updateCountsBasedOnRecommendation();
      },
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    const { variationsDispose, warehousesDispose } = this;
    if (variationsDispose) {
      variationsDispose();
    }
    this.variationsDispose = null;
    if (warehousesDispose) {
      warehousesDispose();
    }
    this.warehousesDispose = null;
  }

  renderTermsOfServiceModal() {
    const navigationStore = NavigationStore.instance();

    const renderFn = (onClose: OnCloseFn) => (
      <Markdown
        className={css(this.styles.modalContent)}
        text={
          i`By clicking Agree, you are verifying that you have read ` + // eslint-disable-next-line local-rules/no-links-in-i18n
          i`the [Terms of Service](${"/fbw/tos"}) and that you understand that` +
          i` by using FBW you are responsible for associated fees. Do you agree?`
        }
        openLinksInNewTab
      />
    );
    const modal = new ConfirmationModal(renderFn)
      .setAction(i`Agree`, async () => {
        this.agreedTermsOfService = true;
        await fbwApi.acceptTermsOfService().call();
      })
      .setCancel(i`Disagree`, () => {
        this.agreedTermsOfService = false;
        navigationStore.replace(`/`);
      })
      .setHeader({
        title: i`FBW Terms of Service`,
      })
      .setOnDismiss(() => {
        if (!this.agreedTermsOfService) {
          navigationStore.replace(`/`);
        }
      });
    modal.render();
  }

  async updateCountsBasedOnRecommendation(
    variationIds?: ReadonlyArray<string>
  ) {
    let updatedVariations = [
      ...this.allRecommendedVariations.map((item) => ({
        ...item,
        is_recommended: true,
      })),
      ...this.allManualVariations,
    ];
    const { variationQuantity } = this;
    if (variationIds) {
      const filteredVariations: ReadonlyArray<Product> = updatedVariations.filter(
        (variation) => {
          return variationIds && variationIds.includes(variation.variation_id);
        }
      );
      updatedVariations = [...filteredVariations];
    }

    if (
      updatedVariations &&
      updatedVariations.length > 0 &&
      this.availableWarehouses.length > 0
    ) {
      // inbound guidance is supported for FBW items, or manually added FBS item
      // if you find this please fix the any types (legacy)
      const isFBWorNotRecommended = (item: any) =>
        this.shipmentType === "FBW" || !item.is_recommended;
      const params = {
        shipment_type: this.tabKey !== "manual" ? this.shipmentType : "FBW",
        skus: JSON.stringify(
          updatedVariations.filter(isFBWorNotRecommended).map((row) => {
            return row.sku;
          })
        ),
        quantities: JSON.stringify(
          updatedVariations.filter(isFBWorNotRecommended).map((row) => {
            return (
              variationQuantity.get(row.variation_id || "") ||
              (this.shipmentType === "FBS" && this.tabKey !== "manual"
                ? -1
                : 10)
            );
          })
        ),
        variation_ids: JSON.stringify(
          updatedVariations.filter(isFBWorNotRecommended).map((row) => {
            return row.variation_id;
          })
        ),
        product_ids: JSON.stringify(
          updatedVariations.filter(isFBWorNotRecommended).map((row) => {
            return row.product_id;
          })
        ),
        warehouse_ids: JSON.stringify(
          this.availableWarehouses.map((warehouse) => {
            return warehouse.id;
          })
        ),
      };
      const resp: APIResponse<FetchInboundGuidanceResponse> = await fbwApi
        .fetchInboundGuidance(params)
        .call();
      // update counts based on inbound guidance
      if (resp.code === 0) {
        const distributionMap = resp.data?.distribution_map;
        if (distributionMap) {
          for (const row of updatedVariations) {
            const distribution = distributionMap[row.variation_id || ""];
            if (!distribution) {
              continue;
            }
            const warehouseQuantityMap = new Map();
            const warehouseDistributionMap = new Map();
            let totalQuantity = 0;
            for (const warehouseCode of Object.keys(distribution)) {
              warehouseQuantityMap.set(
                warehouseCode,
                distribution[warehouseCode].quantity
              );
              warehouseDistributionMap.set(
                warehouseCode,
                distribution[warehouseCode]
              );
              // if you find this please fix the any types (legacy)
              (row as any)[warehouseCode] =
                distribution[warehouseCode].quantity;
              totalQuantity += (row as any)[warehouseCode];
            }
            this.variationWarehouseQuantity.set(
              row.variation_id || "",
              warehouseQuantityMap
            );
            this.variationWarehouseDistribution.set(
              row.variation_id || "",
              warehouseDistributionMap
            );
            this.variationQuantity.set(row.variation_id, totalQuantity);
          }
          return updatedVariations;
        }
      }
    } else {
      // Clear all distribution if there are no available warehouses
      for (const row of updatedVariations) {
        this.variationWarehouseQuantity.set(row.variation_id || "", new Map());
        this.variationWarehouseDistribution.set(
          row.variation_id || "",
          new Map()
        );
      }
    }
  }

  onRecommendedCurrentPageChanged = (currentPage: number) => {
    this.recommendedCurrentPage = currentPage;
  };

  onManuallyCurrentPageChanged = (currentPage: number) => {
    this.manuallyCurrentPage = currentPage;
  };

  onValidityChanged = (quantityValid: boolean) => {
    this.quantityValid = quantityValid;
  };

  @action
  onRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    const variationId = row.variation_id;
    const seletedRows = this.selectedRows;
    if (selected) {
      seletedRows.push(row);
    } else {
      const index = seletedRows.findIndex((row) => {
        return row.variation_id === variationId;
      });
      seletedRows.splice(index, 1);
    }
  };

  @computed
  get userSelectedWarehouses(): ReadonlyArray<WarehouseType> {
    const { warehouses } = this.props;
    return warehouses.filter((warehouse) => {
      return this.userSelectedRegions.includes(warehouse.region);
    });
  }

  @computed
  get availableWarehouses(): ReadonlyArray<WarehouseType> {
    const { warehouses } = this.props;
    return warehouses.filter((warehouse) => {
      return this.selectedAvailableRegions.includes(warehouse.region);
    });
  }

  @action
  onChangeRegion = async (value: number) => {
    const userSelectedRegions = [...this.userSelectedRegions];

    if (userSelectedRegions.includes(value)) {
      if (userSelectedRegions.length === 1) {
        return;
      }
      this.userSelectedRegions.splice(
        this.userSelectedRegions.indexOf(value),
        1
      );
    } else {
      this.userSelectedRegions.push(value);
    }
    const totalVariations = [
      ...this.allRecommendedVariations,
      ...this.allManualVariations,
    ];
    if (totalVariations.length > 0) {
      const variationIds = totalVariations.map((row) => {
        return row.variation_id || "";
      });
      const rows = await this.updateCountsBasedOnRecommendation(variationIds);
      if (rows) {
        const unselectVariationIds = this.getUnselectedVariationIds(
          totalVariations,
          [
            ...this.selectedRecommendedVariations,
            ...this.selectedManualVariations,
          ]
        );
        if (unselectVariationIds) {
          this.selectedRecommendedVariations = this.selectedRecommendedVariations.filter(
            (row) => {
              return !unselectVariationIds.includes(row.variation_id);
            }
          );
          this.selectedManualVariations = this.selectedManualVariations.filter(
            (row) => {
              return !unselectVariationIds.includes(row.variation_id);
            }
          );
        }
      }
    }
  };

  @action
  setTaxIDSaved = (taxIDSaved: boolean): void => {
    this.taxIDSaved = taxIDSaved;
  };

  getUnselectedVariationIds = (
    rows: ReadonlyArray<Product>,
    selectedRows: ReadonlyArray<Product>
  ): ReadonlyArray<string | null | undefined> => {
    const unselectVariationIds: Array<string | null | undefined> = [];
    for (const addedRow of selectedRows) {
      const warehouseDistributionMap = this.variationWarehouseDistribution.get(
        addedRow.variation_id || ""
      );
      if (warehouseDistributionMap) {
        let allBlocked = true;
        for (const warehouseCode of warehouseDistributionMap.keys()) {
          const distributionItem = warehouseDistributionMap.get(warehouseCode);
          if (distributionItem) {
            if (!distributionItem.blacklisted) {
              allBlocked = false;
            }
          }
        }
        if (allBlocked) {
          unselectVariationIds.push(addedRow.variation_id);
        }
      }
    }
    return unselectVariationIds;
  };

  @action
  onQuantityChanged = async (
    { valueAsNumber }: OnChangeEvent,
    variationId: string
  ) => {
    const number = valueAsNumber;
    if (number == null || number < 1) {
      return;
    }
    this.variationQuantity.set(variationId, number);
    await this.updateCountsBasedOnRecommendation([variationId || ""]);
  };

  @action
  onWarehouseQuantityChanged = (args: WarehouseQuantityChangeArgs) => {
    const { variationId, warehouseCode } = args;
    const newQuantity = args.event.valueAsNumber || 0;
    const warehouseDistributionMap = this.variationWarehouseQuantity.get(
      variationId
    );
    let newVariationTotal = 0;
    if (warehouseDistributionMap) {
      warehouseDistributionMap.set(warehouseCode, newQuantity);
      for (const warehouseCode of warehouseDistributionMap.keys()) {
        newVariationTotal += warehouseDistributionMap.get(warehouseCode) || 0;
      }
    }
    this.variationQuantity.set(variationId, newVariationTotal);
  };

  @action
  onAddModalRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    const variationId = row.variation_id;
    if (selected) {
      this.selectedVariationsInModal.push(row);
    } else {
      this.selectedVariationsInModal = this.selectedVariationsInModal.filter(
        (row) => {
          return row.variation_id !== variationId;
        }
      );
    }
  };

  @action
  handleAddToShippingPlanOnClick = async () => {
    this.tabKey = "manual";
    // select the unselect variations in recommendation tab
    // when merchant manually add the variations
    this.selectedRecommendedVariations = [
      ...this.selectedRecommendedVariations,
      ...this.recommendedVariationsToSelect,
    ];

    // add the variations when the variations not added into
    // both recommendation tab and manually-added tab
    this.allManualVariations = [
      ...this.allManualVariations,
      ...this.manualVariationsToAdd,
    ];
    // select the unselect variations in manually-added tab
    // when merchant manually add the variations
    this.selectedManualVariations = [
      ...this.selectedManualVariations,
      ...this.manualVariationsToSelect,
    ];

    this.addVariationsToShippingPlan(this.selectedManualVariations);
  };

  @action
  handleAddPreviousSalesToShippingPlanOnClick = (
    topVariations: ReadonlyArray<Product>
  ) => {
    const totalVariations = [
      ...this.allRecommendedVariations,
      ...this.allManualVariations,
    ];
    topVariations = topVariations.filter(
      (topVariation) =>
        !totalVariations.some((variation) => {
          return variation.variation_id === topVariation.variation_id;
        })
    );
    this.allManualVariations = [...this.allManualVariations, ...topVariations];
    this.selectedManualVariations = [
      ...this.selectedManualVariations,
      ...topVariations,
    ];
    this.showPreviousSoldProducts = false;
    this.addVariationsToShippingPlan(topVariations);
  };

  handleDismissPreviousSalesOnClick = () => {
    this.showPreviousSoldProducts = false;
  };

  addVariationsToShippingPlan = async (
    variationsToAdd: ReadonlyArray<Product>
  ) => {
    if (variationsToAdd) {
      const variationIds = variationsToAdd.map((row) => {
        return row.variation_id || "";
      });
      const rows = await this.updateCountsBasedOnRecommendation(variationIds);
      if (rows) {
        const rowToSelect: Array<Product> = [];
        for (const row of variationsToAdd) {
          const warehouseDistributionMap = this.variationWarehouseDistribution.get(
            row.variation_id || ""
          );
          if (warehouseDistributionMap) {
            let allBlocked = true;
            if (warehouseDistributionMap) {
              for (const warehouseCode of warehouseDistributionMap.keys()) {
                const distributionItem = warehouseDistributionMap.get(
                  warehouseCode
                );
                if (distributionItem) {
                  if (!distributionItem.blacklisted) {
                    allBlocked = false;
                  }
                }
              }
            }
            if (
              !allBlocked &&
              !this.selectedManualVariations.find(
                (item) => item.sku === row.sku
              )
            ) {
              rowToSelect.push(row);
            }
          }
        }
        this.selectedManualVariations = [
          ...this.selectedManualVariations,
          ...rowToSelect,
        ];
      }
    }
    this.selectedVariationsInModal = [];
  };

  @computed
  get selectedRecommendedVariationIds(): ReadonlyArray<string> {
    return this.selectedRecommendedVariations.map((row) => {
      return row.variation_id || "";
    });
  }

  @computed
  get recommendedVariationIds(): ReadonlyArray<string> {
    return this.allRecommendedVariations.map((row) => {
      return row.variation_id || "";
    });
  }

  @computed
  get selectedManualVariationIds(): ReadonlyArray<string> {
    return this.selectedManualVariations.map((row) => {
      return row.variation_id || "";
    });
  }

  @computed
  get manualVariationIds(): ReadonlyArray<string> {
    return this.allManualVariations.map((row) => {
      return row.variation_id || "";
    });
  }

  @computed
  get recommendedVariationsToSelect(): ReadonlyArray<Product> {
    // unselected variations in recommendation tab,
    // select variations when merchant manually add those variations
    return this.selectedVariationsInModal.filter((variation) => {
      return (
        this.recommendedVariationIds.includes(variation.variation_id) &&
        !this.selectedRecommendedVariationIds.includes(variation.variation_id)
      );
    });
  }

  @computed
  get manualVariationsToSelect(): ReadonlyArray<Product> {
    // unselected variations in manually-added tab,
    // select variations when merchant manually add those variations
    return this.selectedVariationsInModal.filter((variation) => {
      return (
        this.manualVariationIds.includes(variation.variation_id) &&
        !this.selectedManualVariationIds.includes(variation.variation_id)
      );
    });
  }

  @computed
  get manualVariationsToAdd(): ReadonlyArray<Product> {
    // variations not in recommendation tab and manually-added tab,
    // add variations when merchant manually add those variations
    return this.selectedVariationsInModal.filter((variation) => {
      return (
        !this.manualVariationIds.includes(variation.variation_id) &&
        !this.recommendedVariationIds.includes(variation.variation_id)
      );
    });
  }

  @action
  clearSelectedRowsInModal = (variation?: string) => {
    if (variation) {
      this.selectedVariationsInModal = this.selectedVariationsInModal.filter(
        (row) => {
          return row.variation_id !== variation;
        }
      );
    } else {
      this.selectedVariationsInModal = [];
    }
  };

  @action
  onTabChange = (tabKey: string) => {
    this.tabKey = tabKey;
  };

  get isSubmitDisable(): boolean {
    if (
      this.selectedRecommendedVariations.length +
        this.selectedManualVariations.length <=
        0 ||
      this.selectedAvailableRegions.length === 0
    ) {
      return true;
    }
    if (!this.quantityValid) {
      return true;
    }
    return false;
  }

  renderRecomTab = () => {
    return (
      <div className={css(this.styles.tab)}>
        <img src={illustrations.recomIcon} />
        <Label
          fontSize={16}
          fontWeight="bold"
          textColor={palettes.coreColors.WishBlue}
          backgroundColor={palettes.textColors.White}
        >
          {i`Wish's Picks ` +
            " (" +
            this.selectedRecommendedVariations.length +
            ")"}
        </Label>
      </div>
    );
  };

  renderManualTab = () => {
    return (
      <div className={css(this.styles.tab)}>
        <img src={illustrations.addIcon} />
        <Label
          fontSize={16}
          fontWeight={"bold"}
          textColor={palettes.textColors.Ink}
          backgroundColor={palettes.textColors.White}
        >
          {i`Manually added ` +
            " (" +
            this.selectedManualVariations.length +
            ")"}
        </Label>
      </div>
    );
  };

  renderDetails = (warehouses: ReadonlyArray<WarehouseType>) => {
    return (
      <Table data={warehouses}>
        <Table.Column columnKey={"region_name"} title={i`Region`} />
        <Table.Column columnKey={"warehouse_name"} title={i`Warehouse`} />
        <Table.Column
          columnKey={"estimated_fulfill_time"}
          title={i`Estimated Fulfill Time`}
        >
          {({ row }) =>
            row.estimated_fulfill_time === 1
              ? i`1 Day`
              : `${row.estimated_fulfill_time} Days`
          }
        </Table.Column>
        <Table.Column handleEmptyRow columnKey={"'"} title={i`Max Weight`}>
          {({ row }) => {
            return row.region_name !== "FBW-US" ? (
              <ThemedLabel
                theme="DarkYellow"
                className={css(this.styles.label)}
              >
                {row.region_name === "FBW-EU"
                  ? "2kg / package"
                  : "23kg / package"}
              </ThemedLabel>
            ) : (
              <div>--</div>
            );
          }}
        </Table.Column>
        <Table.LinkColumn
          columnKey={"id"}
          href={({ row }) => `/fbw/warehouse-fees/${row.id}`}
          text={i`Click to View Fees`}
          openInNewTab
          title={i`Fees`}
          description={i`All fees charged by warehouse`}
        />
      </Table>
    );
  };

  renderTitle = (value: string) => {
    return (
      <div className={css(this.styles.option)}>
        {value}
        &nbsp;
        {this.props.warehouseClassification.unbonded.includes(value) &&
          // if you find this please fix the any types (legacy)
          this.availableRegions.includes((this.regionMap as any)[value]) && (
            <span className={css(this.styles.subText)}>(Tax ID provided)</span>
          )}
      </div>
    );
  };

  showWarehousesClassification = () => {
    new FBWWarehousesClassificationModal({
      warehouseClassification: this.props.warehouseClassification,
    }).render();
  };

  renderRegionSection = () => {
    const { editState, refetchTaxData, pbIncentive } = this.props;
    const regionsOptions = this.props.regions.map((region) => {
      return {
        title: () => this.renderTitle(region),
        name: region,
        // if you find this please fix the any types (legacy)
        value: (this.regionMap as any)[region],
      };
    });
    const details = this.renderDetails(this.props.warehouses);
    return (
      <>
        <div className={css(this.styles.section)}>
          <Text weight="bold" className={css(this.styles.title)}>
            Select intake warehouse region
          </Text>
          {pbIncentive && (
            <Text weight="regular" className={css(this.styles.p)}>
              Products being shipped to FBW warehouses may qualify for 50%
              ProductBoost discounts! Take advantage now and enjoy additional
              impressions by creating a shipping plan to stock your inventory at
              any of the warehouses.
            </Text>
          )}
          <Text weight="regular" className={css(this.styles.p)}>
            FBW offers multiple warehouses across the U.S. and European regions,
            so you can choose the right warehouse(s) to receive and store your
            inventory. If you ship your products to various countries across the
            U.S. and Europe, consider selecting multiple FBW warehouses to stock
            inventory for faster logistics and lower shipping costs.
          </Text>
          <div className={css(this.styles.subTitle)}>
            <Text weight="medium">Select intake warehouse region</Text>
            <div
              onClick={this.showWarehousesClassification}
              className={css(this.styles.infoIcon)}
            >
              <Info
                text={i`Click to view warehouse classification`}
                sentiment="info"
              />
            </div>
          </div>
          <div
            className={css(
              this.warehousesStyle(regionsOptions.length).warehouses
            )}
          >
            {regionsOptions.map((regionsOption) => {
              const isSelected = this.userSelectedRegions.includes(
                regionsOption.value
              );
              return (
                <FBWWarehouseSelection
                  key={regionsOption.value}
                  title={regionsOption.title}
                  description={getCountryName(
                    this.props.countryMapping[regionsOption.name]
                  )}
                  value={regionsOption.value}
                  isSelected={isSelected}
                  onSelect={this.onChangeRegion}
                />
              );
            })}
          </div>
          {this.showTaxForm &&
            Object.keys(this.props.warehouseClassification).map(
              (warehouseType) => {
                return this.props.warehouseClassification[warehouseType].map(
                  (warehouseName) => {
                    return (
                      <FBWWarehouseTaxForm
                        key={warehouseName}
                        warehouseType={warehouseType}
                        warehouseName={warehouseName}
                        warehouseCountry={
                          this.props.countryMapping[warehouseName]
                        }
                        onSaveTaxID={this.setTaxIDSaved}
                        editState={editState}
                        refetchTaxData={refetchTaxData}
                      />
                    );
                  }
                );
              }
            )}
        </div>
        <Accordion
          header={i`Show more details`}
          onOpenToggled={(isOpen) => {
            this.isOpen = isOpen;
          }}
          isOpen={this.isOpen}
        >
          <div>{details}</div>
        </Accordion>
      </>
    );
  };

  renderSelectSKUSection = () => {
    return (
      <div className={css(this.styles.section)}>
        <div className={css(this.styles.title)}>
          <Text weight="bold">Select products</Text>
          <div className={css(this.styles.total)}>
            <Text weight="medium" className={css(this.styles.totalText)}>
              Total SKUs:
            </Text>
            &nbsp;
            <Text weight="bold" className={css(this.styles.totalNumber)}>
              {numeral(
                this.selectedManualVariations.length +
                  this.selectedRecommendedVariations.length
              ).format("0,0")}
            </Text>
          </div>
        </div>
        <Text weight="regular" className={css(this.styles.p)}>
          Products that are approved and enabled are eligible to be added to
          your shipping plan.
        </Text>
        <Link href="product" style={{ marginLeft: 5 }} openInNewTab>
          <Text weight="regular">View all products</Text>
        </Link>
        <Pager
          equalSizeTabs
          onTabChange={this.onTabChange}
          selectedTabKey={this.tabKey}
        >
          <Pager.Content titleValue={this.renderRecomTab} tabKey="recommend" />
          <Pager.Content titleValue={this.renderManualTab} tabKey="manual" />
        </Pager>
      </div>
    );
  };

  // This is to log shipping plan creation event where the shipping plan contains wish's picks products
  logOnSubmit = () => {
    if (this.selectedRecommendedVariations.length > 0) {
      log(FBWShippingPlanCreationTableName, {
        action: `submit_shipping_plan_with_recommendation`,
        data: this.selectedRecommendedVariations
          .map((row) => row.variation_id)
          .join(","),
      });
    }
  };

  renderPrimaryButtons = () => {
    return (
      <div className={css(this.styles.action)}>
        <PrimaryButton
          isDisabled={this.isSubmitDisable}
          onClick={async () => {
            const selectedRows = [
              ...this.selectedRecommendedVariations,
              ...this.selectedManualVariations,
            ];
            if (this.validate(selectedRows)) {
              const title = i`You must select either 0 or at least 5 quantity per SKU.`;
              new ConfirmationModal(title)
                .setHeader({
                  title: i`Error`,
                })
                .setAction(i`OK`, () => {})
                .render();
            } else {
              new FBWShippingPlanConfirmModal({
                warehouses: this.props.warehouses,
                variationQuantity: this.variationQuantity,
                variationWarehouseQuantity: this.variationWarehouseQuantity,
                rows: selectedRows,
                shipmentType: this.props.shipmentType,
                onSubmitCallback: this.logOnSubmit,
              }).render();
            }
          }}
        >
          Submit
        </PrimaryButton>
      </div>
    );
  };

  validate = (rows: ReadonlyArray<Product>) => {
    const { variationQuantity } = this;
    return rows.some((row) => {
      const quantity = variationQuantity.get(row.variation_id || "") || 10;
      return quantity < 5;
    });
  };

  renderTabContent = () => {
    return (
      <>
        {this.tabKey === "recommend" && (
          <FBWCreateShippingPlanTable
            warehouses={this.availableWarehouses}
            rows={this.variations}
            variationQuantity={this.variationQuantity}
            variationWarehouseQuantity={this.variationWarehouseQuantity}
            variationWarehouseDistribution={this.variationWarehouseDistribution}
            onQuantityChange={this.onQuantityChanged}
            onWarehouseQuantityChange={this.onWarehouseQuantityChanged}
            onRowSelectionToggled={this.onRowSelectionToggled}
            selectedVariations={this.selectedRecommendedVariations}
            currentPage={this.recommendedCurrentPage}
            onCurrentPageChanged={this.onRecommendedCurrentPageChanged}
            onAddModalRowSelectionToggled={this.onAddModalRowSelectionToggled}
            handleAddToShippingPlanOnClick={this.handleAddToShippingPlanOnClick}
            clearSelectedRowsInModal={this.clearSelectedRowsInModal}
            isRecommendedTab
            shipmentType={this.shipmentType}
          />
        )}
        {this.tabKey === "manual" && (
          <FBWCreateShippingPlanTable
            warehouses={this.availableWarehouses}
            rows={this.variations}
            variationQuantity={this.variationQuantity}
            variationWarehouseQuantity={this.variationWarehouseQuantity}
            variationWarehouseDistribution={this.variationWarehouseDistribution}
            onQuantityChange={this.onQuantityChanged}
            onWarehouseQuantityChange={this.onWarehouseQuantityChanged}
            onRowSelectionToggled={this.onRowSelectionToggled}
            selectedVariations={this.selectedManualVariations}
            currentPage={this.manuallyCurrentPage}
            onCurrentPageChanged={this.onManuallyCurrentPageChanged}
            onAddModalRowSelectionToggled={this.onAddModalRowSelectionToggled}
            handleAddToShippingPlanOnClick={this.handleAddToShippingPlanOnClick}
            clearSelectedRowsInModal={this.clearSelectedRowsInModal}
            handleAddPreviousSalesToShippingPlanOnClick={
              this.handleAddPreviousSalesToShippingPlanOnClick
            }
            isRecommendedTab={false}
            showPreviousSoldProducts={this.showPreviousSoldProducts}
            handleDismissPreviousSalesOnClick={
              this.handleDismissPreviousSalesOnClick
            }
            shipmentType={this.shipmentType}
          />
        )}
      </>
    );
  };

  render() {
    return (
      <div className={css(this.styles.content)}>
        <Card>
          {this.renderRegionSection()}
          {this.renderSelectSKUSection()}
          {this.renderTabContent()}
          {this.renderPrimaryButtons()}
        </Card>
      </div>
    );
  }
}
export default FBWCreateShippingPlanForm;
