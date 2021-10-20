import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { RadioGroup } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { RequiredValidator } from "@toolkit/validators";
import { useStringQueryParam, useStringArrayQueryParam } from "@toolkit/url";
import { css } from "@toolkit/styling";

/* Merchant Components */
import MeasurementsTable from "@merchant/component/products/size-chart/MeasurementsTable";

/* Merchant API */
import * as sizeChartApi from "@merchant/api/size-chart";

/* Merchant Model */
import { Measurements } from "@merchant/model/Product";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { GetSizeChartResponse } from "@merchant/api/size-chart";
import { useNavigationStore } from "@stores/NavigationStore";

export type SizeChartProps = BaseProps & {
  readonly isCreate: boolean;
  readonly sizeChart?: GetSizeChartResponse | null | undefined;
};

const SizeChart = (props: SizeChartProps) => {
  const { isCreate, sizeChart } = props;
  const styles = useStylesheet();
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [name, setName] = useState(sizeChart?.name);
  const [genderCategory, setGenderCategory] = useState(
    sizeChart?.gender_category || 0,
  );
  const [unit, setUnit] = useState(sizeChart?.unit || 0);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(true);
  const [success, setSuccess] = useState(false);
  // TODO [lliepert]: fix nav store in next ticket
  const sizes: string[] = [];
  const productId = undefined;
  // const [sizes] = useStringArrayQueryParam("sizes");
  // const [productId] = useStringQueryParam("pid");
  const sizeChartMeasurements = sizeChart?.measurements_list;
  const sizeList = Array.from(sizes || []);
  const originalMeasurements = new Measurements([]);
  if (sizeChartMeasurements) {
    originalMeasurements.fromJson(sizeChartMeasurements);
  }
  const [measurements] = useState(
    sizeChartMeasurements ? originalMeasurements : new Measurements(sizeList),
  );
  const navigationStore = useNavigationStore();

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const response = await sizeChartApi
        .createSizeChart({
          name: name || "",
          gender_category: genderCategory,
          unit,
          measurements_list: measurements.toJson(),
        })
        .call();
      if (response) {
        setSuccess(true);
        navigationStore.navigate(
          `/product-detail/${productId}?sizechart=${name || ""}#sizechart`,
        );
      }
    } catch (e) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await sizeChartApi
        .updateSizeChart({
          id: sizeChart?.id || "",
          name: name || "",
          gender_category: genderCategory,
          unit,
          measurements_list: measurements.toJson(),
        })
        .call();
      if (response) {
        setSuccess(true);
        navigationStore.back();
      }
    } catch (e) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const renderConfirmation = () => {
    if (success) {
      let confirmation = i`A new size chart, ${name}, has been created.`;
      if (!isCreate) {
        confirmation = i`The size chart has been updated.`;
      }
      return (
        <Card className={css(styles.stickyTop)} style={{ border: "none " }}>
          <Banner sentiment="success" text={confirmation} />
        </Card>
      );
    }
  };

  return (
    <div className={css(styles.root)}>
      {renderConfirmation()}
      <p className={css(styles.breadcrumb)}>Product Detail / Size Chart</p>
      <section className={css(styles.pageTitle)}>
        {isCreate ? i`Create Size Chart` : i`Edit Size Chart`}
      </section>
      <Card>
        <Accordion
          header={i`Size chart details`}
          onOpenToggled={(isDetailsOpen) => setIsDetailsOpen(isDetailsOpen)}
          isOpen={isDetailsOpen}
        >
          <div className={css(styles.fixedMarginTop)}>
            <p className={css(styles.text)}>
              Enter the details for your custom size chart. You can attach the
              chart on the product details page after you save it.
            </p>
          </div>
          <HorizontalField
            className={css(styles.fixedMargin)}
            title={i`Name your size chart`}
          >
            <TextInput
              className={css(styles.input)}
              value={name}
              onChange={({ text }) => setName(text)}
              validators={[new RequiredValidator()]}
              placeholder={i`e.g. Women's Standard Size Chart`}
            />
          </HorizontalField>
          <HorizontalField
            className={css(styles.fixedMargin)}
            title={i`Select a gender`}
          >
            <RadioGroup
              layout="vertical"
              onSelected={(value) => setGenderCategory(value)}
              selectedValue={genderCategory}
            >
              <RadioGroup.Item value={0} text={i`Female`} />
              <RadioGroup.Item value={1} text={i`Male`} />
            </RadioGroup>
          </HorizontalField>
          <HorizontalField
            className={css(styles.fixedMargin)}
            title={i`Unit of measurement`}
          >
            <RadioGroup
              layout="vertical"
              onSelected={(value) => setUnit(value)}
              selectedValue={unit}
            >
              <RadioGroup.Item value={0} text={i`Inch`} />
              <RadioGroup.Item value={1} text={i`CM`} />
            </RadioGroup>
          </HorizontalField>
        </Accordion>
        <Accordion
          className={css(styles.measurements)}
          header={i`Sizes and measurements`}
          onOpenToggled={(isMeasurementsOpen) =>
            setIsMeasurementsOpen(isMeasurementsOpen)
          }
          isOpen={isMeasurementsOpen}
        >
          <div className={css(styles.fixedMarginTop)}>
            <p className={css(styles.text)}>
              Enter the sizes and measurements for your chart. Measurements and
              numeric sizes are optional, but all size fields are required for a
              chosen measurement. For example, if you choose to use
              "Bust/Chest", you must enter in all the sizes for that
              measurement, including both min and max fields.
            </p>
          </div>
          <div className={css(styles.measurementsTable)}>
            <Card>
              <MeasurementsTable
                measurements={measurements}
                disableEdit={false}
              />
            </Card>
          </div>
        </Accordion>
      </Card>
      <Card className={css(styles.stickyBottom)} style={{ border: "none " }}>
        <div className={css(styles.buttons)}>
          <BackButton />
          <PrimaryButton
            onClick={isCreate ? handleCreate : handleUpdate}
            isDisabled={isLoading}
          >
            Save
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};
export default observer(SizeChart);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        breadcrumb: {
          fontFamily: fonts.proxima,
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: colors.palettes.textColors.LightInk,
          marginTop: 34,
        },
        pageTitle: {
          fontSize: 24,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: colors.palettes.textColors.Ink,
          marginTop: 16,
          marginBottom: 16,
        },
        measurements: {
          overflow: "scroll",
        },
        measurementsTable: {
          marginLeft: 24,
          marginBottom: 64,
          marginRight: 24,
        },
        stickyBottom: {
          position: "sticky",
          bottom: 40,
        },
        stickyTop: {
          position: "fixed",
          left: 0,
          right: 0,
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
        },
        input: {
          width: "60%",
        },
        text: {
          color: colors.palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
        fixedMarginTop: {
          marginLeft: 24,
          marginTop: 24,
          marginBottom: 24,
          marginRight: 24,
        },
        fixedMargin: {
          marginLeft: 24,
          marginBottom: 24,
          marginRight: 24,
        },
      }),
    [],
  );
