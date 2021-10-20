import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Select } from "@ContextLogic/lego";
import { IllustrationOrRender } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Merchant Components */
import MeasurementsTable from "@merchant/component/products/size-chart/MeasurementsTable";

/* Merchant Model */
import { Measurements } from "@merchant/model/Product";
import ProductEditState from "@merchant/model/products/ProductEditState";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { GetSizeChartResponse } from "@merchant/api/size-chart";
import { useStringQueryParam } from "@toolkit/url";
import { useNavigationStore } from "@stores/NavigationStore";

export type ProductSizeChartProps = BaseProps & {
  readonly sizeChart?: GetSizeChartResponse | null | undefined;
  readonly sizeChartNames?: ReadonlyArray<string> | null | undefined;
  readonly variationSizes: ReadonlyArray<string>;
  readonly editState: ProductEditState;
};

const fixedSelectWidth = 328;
const fixedDropdownWidth = 300;
const maxTextWidth = 640;

const ProductSizeChart = (props: ProductSizeChartProps) => {
  const { sizeChart, sizeChartNames, variationSizes, editState } = props;
  const navigationStore = useNavigationStore();
  const styles = useStylesheet();
  const [selectedSizeChartName] = useStringQueryParam("sizechart");
  if (selectedSizeChartName) {
    editState.sizeChartName = selectedSizeChartName;
  }
  const [sizeChartName, setSizeChartName] = useState(selectedSizeChartName);
  const [detached, setDetached] = useState(false);
  const sizeChartMeasurements = sizeChart?.measurements_list;
  const measurements = useMemo(() => {
    const originalMeasurements = new Measurements([]);
    if (sizeChartMeasurements) {
      originalMeasurements.fromJson(sizeChartMeasurements);
    }
    return originalMeasurements;
  }, [sizeChartMeasurements]);
  const options = (sizeChartNames || []).map((sizeChartName) => ({
    value: sizeChartName,
    text: sizeChartName,
  }));

  const renderConfirmation = () => {
    if (sizeChartName) {
      return (
        <Banner
          sentiment="info"
          text={
            i`Save changes to attach this chart. The size chart will only ` +
            i`attach if the sizes on the chart contain the product variation ` +
            i`sizes.`
          }
        />
      );
    }
    if (detached) {
      return (
        <Banner sentiment="info" text={i`Remember to save your changes.`} />
      );
    }
  };

  const onCreateOrEditButtonClicked = (redirectUrl: string) => {
    if (editState.hasNonSizeChartUpdates && !editState.submitSuccess) {
      return new ConfirmationModal(
        i`You will be redirected to a new page to create or edit your size ` +
          i`chart. Please save your changes to continue.`,
      )
        .setHeader({ title: i`Save changes to continue` })
        .setCancel(i`Continue without saving`, async () => {
          navigationStore.navigate(redirectUrl);
        })
        .setAction(i`Save and continue`, async () => {
          await editState.submit();
          if (editState.submitSuccess) {
            navigationStore.navigate(redirectUrl);
          }
        })
        .render();
    }
    navigationStore.navigate(redirectUrl);
  };

  const renderSelect = () => {
    if (options.length) {
      return (
        <div className={css(styles.flexRow)}>
          <div className={css(styles.select)}>
            <Select
              options={options}
              selectedValue={sizeChartName}
              placeholder={i`Select a size chart`}
              onSelected={(value) => {
                setSizeChartName(value);
                editState.sizeChartName =
                  editState.sizeChartName == value ? null : value;
                setDetached(false);
              }}
              position="bottom left"
              minWidth={fixedDropdownWidth}
            />
          </div>
          <span className={css(styles.span)}> or </span>
        </div>
      );
    }
  };

  const renderSelectCreate = () => {
    if (!sizeChart) {
      return (
        <div className={css(styles.flexRow)}>
          {renderSelect()}
          <Button
            onClick={() => {
              const url = `/size-chart/create?pid=${
                editState.productId || ""
              }&sizes=${variationSizes.join(",")}`;
              onCreateOrEditButtonClicked(url);
            }}
          >
            Create a new Size Chart
          </Button>
        </div>
      );
    }
  };

  const renderSizeChartDetail = () => {
    if (sizeChart) {
      return (
        <div className={css(styles.sizechart)}>
          <div className={css(styles.sheet)}>
            <SheetItem
              className={css(styles.fixedHeightSheetItem)}
              title={i`Name`}
            >
              {sizeChart?.name}
            </SheetItem>
            <div className={css(styles.sideBySide)}>
              <SheetItem
                className={css(styles.fixedHeightSheetItem)}
                title={i`Gender`}
              >
                {sizeChart?.gender_category ? i`Male` : i`Female`}
              </SheetItem>
              <SheetItem
                className={css(styles.fixedHeightSheetItem)}
                title={i`Unit`}
              >
                {sizeChart?.unit ? i`CM` : i`Inch`}
              </SheetItem>
            </div>
          </div>
          <div className={css(styles.measurementsTableContainer)}>
            <div className={css(styles.measurementsTable)}>
              <Card>
                <MeasurementsTable measurements={measurements} disableEdit />
              </Card>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderDetach = () => {
    if (sizeChart) {
      return (
        <Button
          className={css(styles.button)}
          onClick={() => {
            editState.sizeChartName = "";
            setSizeChartName("");
            setDetached(true);
          }}
        >
          Detach
        </Button>
      );
    }
  };

  const renderEditDetach = () => {
    if ((sizeChartName.trim().length > 0 || sizeChart) && !detached) {
      return (
        <Card>
          <div className={css(styles.marginTopBottom)}>
            <div className={css(styles.flexRow)}>
              <Button
                className={css(styles.button)}
                onClick={() => {
                  const url = `/size-chart/update?q=${
                    sizeChart?.id || sizeChartName
                  }`;
                  onCreateOrEditButtonClicked(url);
                }}
              >
                Edit
              </Button>
              {renderDetach()}
            </div>
          </div>
        </Card>
      );
    }
  };

  return (
    <div className={css(styles.root)}>
      {renderConfirmation()}
      <div className={css(styles.marginTopBottom)}>
        <div className={css(styles.flexRowSpace)}>
          <div className={css(styles.flexCol)}>
            <p className={css(styles.p)}>
              Apparel products with custom size charts may increase conversion,
              reduce returns, and improve your customer’s experience. You can
              create a custom chart from this product’s size variations. After
              you create your first chart, you can attach your custom size chart
              to this product and others.
            </p>
            <div className={css(styles.flexRow)}>{renderSelectCreate()}</div>
          </div>
          <IllustrationOrRender
            className={css(styles.image)}
            value={"sizeChart"}
            alt="image of size chart"
            animate={false}
          />
        </div>
      </div>
      {renderSizeChartDetail()}
      {renderEditDetach()}
    </div>
  );
};

export default observer(ProductSizeChart);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        sizechart: {
          backgroundColor: "white",
        },
        measurementsTableContainer: {
          overflow: "scroll",
        },
        measurementsTable: {
          marginTop: 24,
          marginBottom: 24,
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
          marginTop: 24,
          marginBottom: 24,
        },
        button: {
          marginLeft: 24,
        },
        sectionTitle: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        select: {
          minWidth: fixedSelectWidth,
          maxWidth: fixedSelectWidth,
        },
        span: {
          display: "flex",
          alignItems: "center",
          marginLeft: 24,
          marginRight: 24,
        },
        marginTopBottom: {
          marginTop: 24,
          marginBottom: 24,
        },
        sheet: {
          display: "flex",
          flexDirection: "column",
        },
        fixedHeightSheetItem: {
          height: 48,
          padding: "0px 20px",
          borderBottom: `1px solid ${colors.palettes.greyScaleColors.Grey}`,
        },
        flexCol: {
          display: "flex",
          flexDirection: "column",
        },
        p: {
          maxWidth: maxTextWidth,
          marginBottom: 24,
          color: colors.palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
        floatRight: {
          float: "right",
        },
        image: {
          display: "flex",
          transform: "translateZ(0)",
          minWidth: "16%",
          flexShrink: 2,
          marginRight: 24,
        },
        flexRowSpace: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        flexRow: {
          display: "flex",
          flexDirection: "row",
        },
        sideBySide: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
          flexWrap: "wrap",
          ":nth-child(1n) > div": {
            flexGrow: 1,
            flexBasis: 0,
            flexShrink: 1,
            ":first-child": {
              borderRight: `1px solid ${colors.palettes.greyScaleColors.Grey}`,
            },
          },
        },
      }),
    [],
  );
