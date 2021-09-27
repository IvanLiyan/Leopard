import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import numeral from "numeral";
import _ from "lodash";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
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
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FBWWarehouseSelection from "@merchant/component/logistics/shipping-plan/FBWWarehouseSelection";
import FBWWarehouseTaxForm from "@merchant/component/logistics/shipping-plan/FBWWarehouseTaxForm";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Relative Imports */
import FBSCreateShippingPlanTable from "./FBSCreateShippingPlanTable";
import FBSShippingPlanConfirmModal from "./FBSShippingPlanConfirmModal";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

import { RowSelectionArgs } from "@ContextLogic/lego";
import { WarehouseType } from "@toolkit/fbw";
import { OnCloseFn } from "@merchant/component/core/modal/Modal";
import { Product, Region } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";
import { IOnChangeProps } from "./FBSCreateShippingPlanTable";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

type FBSCreateShippingPlanFormProps = BaseProps & {
  readonly regions: ReadonlyArray<Region>;
  readonly countryMapping: {
    [key: string]: CountryCode;
  };
  readonly warehouseClassification: {
    [key: string]: ReadonlyArray<string>;
  };
  readonly whitelistedWarehouses: ReadonlyArray<string>;
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly showTermsOfService: boolean;
  readonly shipmentType: string;
  readonly recommendedVariations: ReadonlyArray<Product>;
  readonly pbIncentive: boolean;
  readonly editState: TaxEnrollmentV2State;
  readonly refetchTaxData: () => void;
};

const initializeQuantity = (
  warehouses: ReadonlyArray<WarehouseType>,
  variations: ReadonlyArray<Product>
) => {
  const variationWarehouseMap = new Map();
  variations.forEach((item) => {
    const warehouseQuantityMap = new Map();
    warehouses.forEach((wh: WarehouseType) => {
      warehouseQuantityMap.set(wh.warehouse_code, 10);
    });
    variationWarehouseMap.set(item.variation_id, warehouseQuantityMap);
  });
  return variationWarehouseMap;
};

export type RegionMap = {
  [index in Region]: number;
};

const FBSCreateShippingPlanForm = (props: FBSCreateShippingPlanFormProps) => {
  const styles = useStylesheet(props);
  const navigationStore = useNavigationStore();
  const {
    editState,
    warehouses,
    countryMapping,
    regions,
    warehouseClassification,
    whitelistedWarehouses,
    recommendedVariations,
    showTermsOfService,
  } = props;

  const regionMap: RegionMap = {
    "FBW-EU-AMS": 4,
    "FBW-EU-TLL": 2,
    "FBW-US": 1,
  };

  const FBSEligibleRegions = regions.filter(
    (region) => region !== "FBW-EU-TLL"
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showToS, setShowToS] = useState<boolean>(showTermsOfService);
  const [variationWarehouseQuantity, setVariationWarehouseQuantity] = useState<
    Map<string, Map<string, number>>
  >(initializeQuantity(warehouses, recommendedVariations));
  const [userSelectedRegions, setUserSelectedRegions] = useState<Array<number>>(
    FBSEligibleRegions.map((item) => regionMap[item])
  );
  const [selectedVariationsInModal, setSelectedVariationsInModal] = useState<
    Array<Product>
  >([]);
  const [selectedRows, setSelectedRows] = useState<Set<Product>>(new Set([]));
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState<number>(
    0
  );

  const selectedRecommendedVariations = Array.from(selectedRows);

  const availableRegions = regions
    .filter(
      (
        region // warehouse is not unbonded
      ) =>
        !warehouseClassification.unbonded.includes(region) || // warehouse country has tax settings
        editState.currentCountries.includes(countryMapping[region]) || // merchant has already been using the warehouse, continue letting them do so
        whitelistedWarehouses.includes(region)
    )
    .map((value) => regionMap[value]);

  const selectedAvailableRegions = availableRegions.filter((value) =>
    userSelectedRegions.includes(value)
  );

  const availableWarehouses = warehouses.filter((warehouse) => {
    return selectedAvailableRegions.includes(warehouse.region);
  });

  const renderTitle = (value: Region) => {
    const { warehouseClassification } = props;

    return (
      <div className={css(styles.option)}>
        {value}
        &nbsp;
        {warehouseClassification.unbonded.includes(value) &&
          availableRegions.includes(regionMap[value]) && (
            <span className={css(styles.subText)}>(Tax ID provided)</span>
          )}
      </div>
    );
  };

  const renderTermsOfServiceModal = () => {
    const renderFn = (onClose: OnCloseFn) => (
      <Markdown
        className={css(styles.modalContent)}
        text={
          i`By clicking Agree, you are verifying that you have read ` + // eslint-disable-next-line local-rules/no-links-in-i18n
          i`the [Terms of Service](${"/fbw/tos"}) and that you understand that` +
          i` by using FBS you are responsible for associated fees. Do you agree?`
        }
        openLinksInNewTab
      />
    );
    const modal = new ConfirmationModal(renderFn)
      .setAction(i`Agree`, async () => {
        setShowToS(false);
        await fbwApi.acceptTermsOfService().call();
      })
      .setCancel(i`Disagree`, () => {
        navigationStore.replace(`/`);
      })
      .setHeader({
        title: i`FBS Terms of Service`,
      })
      .setOnDismiss(() => {
        if (showToS) {
          navigationStore.replace(`/`);
        }
      });
    modal.render();
  };

  const renderDetails = (warehouses: ReadonlyArray<WarehouseType>) => {
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
              <ThemedLabel theme="DarkYellow" className={css(styles.label)}>
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

  const warehousesStyle = (columnNumbers: number) => {
    return StyleSheet.create({
      warehouses: {
        display: "grid",
        gridTemplateColumns: "repeat(" + columnNumbers + ", minmax(0, 1fr))",
        gridGap: "16px",
        padding: "16px 0",
      },
    });
  };

  const validate = (rows: ReadonlyArray<Product>) => {
    return rows.some((row) => {
      const variationId = row.variation_id;
      let qtySum = 0;
      warehouses.forEach((item) => {
        if (item.warehouse_code) {
          qtySum +=
            variationWarehouseQuantity
              .get(variationId)
              ?.get(item.warehouse_code) || 0;
        }
      });
      return qtySum < 5;
    });
  };

  const renderPrimaryButtons = () => {
    const { warehouses } = props;
    const isSubmitDisable =
      selectedRecommendedVariations.length <= 0 ||
      selectedAvailableRegions.length === 0;
    return (
      <div className={css(styles.action)}>
        <PrimaryButton
          isDisabled={isSubmitDisable}
          onClick={async () => {
            const selectedRows = [...selectedRecommendedVariations];
            if (validate(selectedRows)) {
              const title = i`You must select either 0 or at least 5 quantity per SKU.`;
              new ConfirmationModal(title)
                .setHeader({
                  title: i`Error`,
                })
                .setAction(i`OK`, () => {})
                .render();
            } else {
              new FBSShippingPlanConfirmModal({
                warehouses,
                variationWarehouseQuantity,
                rows: selectedRows,
                shipmentType: "FBS",
              }).render();
            }
          }}
        >
          Submit
        </PrimaryButton>
      </div>
    );
  };

  const onChangeRegion = async (value: number) => {
    const currentUserSelectedRegions = [...userSelectedRegions];

    if (currentUserSelectedRegions.includes(value)) {
      if (currentUserSelectedRegions.length === 1) {
        return;
      }
      currentUserSelectedRegions.splice(
        currentUserSelectedRegions.indexOf(value),
        1
      );
    } else {
      currentUserSelectedRegions.push(value);
    }
    setUserSelectedRegions(currentUserSelectedRegions);
  };

  const renderSelectSKUSection = () => {
    return (
      <div className={css(styles.section)}>
        <div className={css(styles.title)}>
          <Text weight="bold">Select products from Wish's Picks</Text>
          <div className={css(styles.total)}>
            <Text weight="medium" className={css(styles.totalText)}>
              Total SKUs:
            </Text>
            &nbsp;
            <Text weight="bold" className={css(styles.totalNumber)}>
              {numeral(selectedRecommendedVariations.length).format("0,0")}
            </Text>
          </div>
        </div>
        <Text weight="regular" className={css(styles.p)}>
          Wish's Picks recommends to you a list of high-potential products for
          FBS. Stock the following products by shipping them to the intake
          warehouses, so that some or all of them become automatically available
          for customers' same-day pickup purchases in Wish app.
        </Text>
      </div>
    );
  };

  const onQuantityChanged = ({
    event,
    variationId,
    warehouseCode,
  }: IOnChangeProps) => {
    const { valueAsNumber } = event;
    const number = valueAsNumber;
    if (number == null || number < 1) {
      return;
    }
    variationWarehouseQuantity.get(variationId)?.set(warehouseCode, number);
    setVariationWarehouseQuantity(new Map(variationWarehouseQuantity));
  };

  const onRecommendedCurrentPageChanged = (currentPage: number) => {
    setRecommendedCurrentPage(currentPage);
  };

  const onRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    if (selected) {
      selectedRows.add(row);
    } else {
      selectedRows.delete(row);
    }
    setSelectedRows(new Set(selectedRows));
  };

  const clearSelectedRowsInModal = (variation?: string) => {
    if (variation) {
      setSelectedVariationsInModal(
        selectedVariationsInModal.filter(
          (row) => row.variation_id !== variation
        )
      );
    } else {
      setSelectedVariationsInModal([]);
    }
  };

  const onAddModalRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    const variationId = row.variation_id;
    let currentSeletedVariationsInModal = [...selectedVariationsInModal];
    if (selected) {
      currentSeletedVariationsInModal.push(row);
    } else {
      currentSeletedVariationsInModal = currentSeletedVariationsInModal.filter(
        (row) => row.variation_id !== variationId
      );
    }
    setSelectedVariationsInModal(currentSeletedVariationsInModal);
  };

  const renderTabContent = () => (
    <FBSCreateShippingPlanTable
      warehouses={availableWarehouses}
      rows={recommendedVariations}
      variationWarehouseQuantity={variationWarehouseQuantity}
      onQuantityChange={onQuantityChanged}
      onRowSelectionToggled={onRowSelectionToggled}
      selectedVariations={Array.from(selectedRecommendedVariations)}
      currentPage={recommendedCurrentPage}
      onCurrentPageChanged={onRecommendedCurrentPageChanged}
      onAddModalRowSelectionToggled={onAddModalRowSelectionToggled}
      clearSelectedRowsInModal={clearSelectedRowsInModal}
      isRecommendedTab
      shipmentType={"FBS"}
    />
  );

  const renderRegionSection = () => {
    const {
      warehouses,
      warehouseClassification,
      countryMapping,
      pbIncentive,
      editState,
      refetchTaxData,
    } = props;

    const regionsOptions = FBSEligibleRegions.map((region: Region) => {
      return {
        title: () => renderTitle(region),
        name: region,
        value: regionMap[region],
      };
    });
    const details = renderDetails(warehouses);
    const showTaxForm = !_.isEqual(
      _.sortBy(userSelectedRegions, _),
      _.sortBy(selectedAvailableRegions, _)
    );
    return (
      <>
        <div className={css(styles.section)}>
          <Text weight="bold" className={css(styles.title)}>
            Select intake warehouse region
          </Text>
          {pbIncentive && (
            <Text weight="regular" className={css(styles.p)}>
              Products being shipped to FBW warehouses may qualify for 50%
              ProductBoost discounts! Take advantage now and enjoy additional
              impressions by creating a shipping plan to stock your inventory at
              any of the warehouses.
            </Text>
          )}
          <Text weight="regular" className={css(styles.p)}>
            Wish offers multiple warehouses across the Unitest States and
            European regions, so you can choose the right warehouse(s) to
            receive and store your inventory before it is shipped to FBS stores.
            If you ship your products to various stores across the United States
            and Europe, consider selecting multiple Wish's warehouses to stock
            inventory for faster logistics and lower shipping costs.
          </Text>
          <Text weight="medium" className={css(styles.subTitle)}>
            Select intake warehouse region
          </Text>
          <div
            className={css(warehousesStyle(regionsOptions.length).warehouses)}
          >
            {regionsOptions.map((regionsOption) => {
              const isSelected = userSelectedRegions.includes(
                regionsOption.value
              );
              return (
                <FBWWarehouseSelection
                  key={regionsOption.value}
                  title={regionsOption.title}
                  description={getCountryName(
                    countryMapping[regionsOption.name]
                  )}
                  value={regionsOption.value}
                  isSelected={isSelected}
                  onSelect={onChangeRegion}
                />
              );
            })}
          </div>
          {showTaxForm &&
            Object.keys(warehouseClassification).map((warehouseType) => {
              return warehouseClassification[warehouseType].map(
                (warehouseName) => {
                  return (
                    <FBWWarehouseTaxForm
                      key={warehouseName}
                      warehouseType={warehouseType}
                      warehouseName={warehouseName}
                      warehouseCountry={countryMapping[warehouseName]}
                      editState={editState}
                      refetchTaxData={refetchTaxData}
                    />
                  );
                }
              );
            })}
        </div>
        <Accordion
          header={i`Show more details`}
          onOpenToggled={(isOpen) => {
            setIsOpen(isOpen);
          }}
          isOpen={isOpen}
        >
          <div>{details}</div>
        </Accordion>
      </>
    );
  };

  if (showToS) {
    renderTermsOfServiceModal();
  }
  return (
    <div className={css(styles.content)}>
      <Card>
        {renderRegionSection()}
        {renderSelectSKUSection()}
        {renderTabContent()}
        {renderPrimaryButtons()}
      </Card>
    </div>
  );
};

const useStylesheet = (props: FBSCreateShippingPlanFormProps) => {
  const {
    pageGuideXForPageWithTable: pageX,
    pageGuideBottom: pageBottom,
  } = useDimenStore();
  const { textLight, textBlack, textDark, textWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          paddingLeft: pageX,
          paddingRight: pageX,
          paddingBottom: pageBottom,
          paddingTop: 20,
        },
        option: {
          display: "flex",
          flexDirection: "row",
        },
        subText: {
          lineHeight: 1.43,
          color: textLight,
        },
        section: {
          padding: "0 24px",
        },
        title: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          paddingTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        action: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 24,
        },
        p: {
          width: "80%",
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          paddingTop: "8px",
        },
        subTitle: {
          display: "flex",
          flexDirection: "row",
          paddingTop: 20,
          alignItems: "center",
          fontSize: 16,
          color: textDark,
        },
        label: {
          width: 112,
        },
        infoIcon: {
          paddingLeft: 4,
        },
        total: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textLight,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginRight: 24,
        },
        totalText: {
          fontSize: 20,
          textColor: textWhite,
        },
        totalNumber: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
        },
        modalContent: {
          maxWidth: "100%",
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          fontFamily: fonts.proxima,
        },
      }),
    [pageX, pageBottom, textBlack, textDark, textLight, textWhite]
  );
};
export default FBSCreateShippingPlanForm;
