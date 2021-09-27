/*
 * PackageEditing.tsx
 *
 * Created by Jonah Dlin on Fri Feb 05 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import {
  CheckboxField,
  FormSelect,
  Info,
  Layout,
  NumericInput,
  PrimaryButton,
  Text,
  Radio,
} from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Toolkit */
import {
  GetDimensionsResponseType,
  LengthOptions,
  PickedLengthUnit,
  roundPackageDimension,
  WeightOptions,
  PackageType,
  PackageTypeIconMap,
  PackageTypeLabel,
} from "@toolkit/wps/create-shipping-label";
import {
  ValidationResponse,
  Validator,
} from "@ContextLogic/lego/toolkit/forms/validators";
import { WeightUnit } from "@schema/types";
import { Illustration } from "@merchant/component/core";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
  readonly defaults?: GetDimensionsResponseType | undefined;
};

const PackageEditing: React.FC<Props> = ({
  className,
  style,
  state,
  defaults,
}: Props) => {
  const styles = useStylesheet();

  const [isSaving, setIsSaving] = useState(false);
  const [hasMadeWeightChange, setHasMadeWeightChange] = useState(false);
  const [hasMadeWidthChange, setHasMadeWidthChange] = useState(false);
  const [hasMadeHeightChange, setHasMadeHeightChange] = useState(false);
  const [hasMadeLengthChange, setHasMadeLengthChange] = useState(false);

  const { packageState, onClosePackage } = state;

  const {
    packageType,
    weight,
    width,
    height,
    length,
    weightUnit,
    lengthUnit,
    applyToAllVariations,
    forceValidation,
    submit,
  } = packageState;

  const handleSubmit = async () => {
    setIsSaving(true);
    const success = await submit();
    setIsSaving(false);

    if (success) {
      await onClosePackage();
    }
  };

  const renderFieldTitle = (title: string) => (
    <div className={css(styles.fieldTitle)}>
      <Text className={css(styles.fieldTitleText)} weight="semibold">
        {title}
      </Text>
      <div className={css(styles.fieldTitleStar)}>*</div>
    </div>
  );

  useEffect(() => {
    if (defaults == null) {
      return;
    }
    const {
      productCatalog: {
        variation: {
          logisticsMetadata: {
            weight: defaultWeight,
            width: defaultWidth,
            height: defaultHeight,
            length: defaultLength,
          },
        },
      },
    } = defaults;

    if (
      !hasMadeWeightChange &&
      weight == null &&
      defaultWeight != null &&
      defaultWeight.value != null
    ) {
      packageState.weight = defaultWeight.value;
    }
    if (
      !hasMadeWidthChange &&
      width == null &&
      defaultWidth != null &&
      defaultWidth.value != null
    ) {
      packageState.width = defaultWidth.value;
    }
    if (
      !hasMadeHeightChange &&
      height == null &&
      defaultHeight != null &&
      defaultHeight.value != null
    ) {
      packageState.height = defaultHeight.value;
    }
    if (
      !hasMadeLengthChange &&
      length == null &&
      defaultLength != null &&
      defaultLength.value != null
    ) {
      packageState.length = defaultLength.value;
    }
  }, [
    defaults,
    packageState,
    weight,
    width,
    height,
    length,
    hasMadeWidthChange,
    hasMadeHeightChange,
    hasMadeLengthChange,
    hasMadeWeightChange,
  ]);

  const renderPackageType = (type: PackageType) => (
    <Layout.FlexColumn
      style={[
        styles.packageSelection,
        packageType === type && styles.packageSelectionActive,
      ]}
      onClick={() => {
        packageState.packageType = type;
      }}
    >
      <Radio checked={packageType === type} />
      <Layout.FlexColumn alignItems="center" justifyContent="center">
        <Illustration
          name={PackageTypeIconMap[type]}
          alt={PackageTypeIconMap[type]}
          style={[styles.packageIllust]}
        />
        <Text style={[styles.packageText]}>{PackageTypeLabel[type]}</Text>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );

  return (
    <div className={css(styles.root, className, style)}>
      <Layout.FlexRow className={css(styles.section)}>
        {renderPackageType("BOX")}
        {renderPackageType("LARGE_ENVELOPE")}
      </Layout.FlexRow>
      <div className={css(styles.section)}>
        {renderFieldTitle(i`Weight`)}
        <NumericInput
          className={css(styles.numberInput, styles.input)}
          value={roundPackageDimension(weight)}
          onChange={({ valueAsNumber }) => {
            packageState.weight = valueAsNumber;
            setHasMadeWeightChange(true);
          }}
          validators={[new PackageMeasureValidator()]}
          onValidityChanged={({ isValid }) =>
            (packageState.isWeightValid = isValid)
          }
          forceValidation={forceValidation}
        />
        <FormSelect
          className={css(styles.unitInput, styles.input)}
          options={WeightOptions}
          selectedValue={weightUnit}
          onSelected={(unit: WeightUnit) => (packageState.weightUnit = unit)}
        />
      </div>
      {packageType === "BOX" && (
        <div className={css(styles.section)}>
          {renderFieldTitle(i`Width`)}
          <NumericInput
            className={css(styles.numberInput, styles.input)}
            value={roundPackageDimension(width)}
            onChange={({ valueAsNumber }) => {
              packageState.width = valueAsNumber;
              setHasMadeWidthChange(true);
            }}
            incrementStep={1}
            validators={[new PackageMeasureValidator()]}
            onValidityChanged={({ isValid }) =>
              (packageState.isWidthValid = isValid)
            }
            forceValidation={forceValidation}
          />
          {renderFieldTitle(i`Height`)}
          <NumericInput
            className={css(styles.numberInput, styles.input)}
            value={roundPackageDimension(height)}
            onChange={({ valueAsNumber }) => {
              packageState.height = valueAsNumber;
              setHasMadeHeightChange(true);
            }}
            incrementStep={1}
            validators={[new PackageMeasureValidator()]}
            onValidityChanged={({ isValid }) =>
              (packageState.isHeightValid = isValid)
            }
            forceValidation={forceValidation}
          />
          {renderFieldTitle(i`Length`)}
          <NumericInput
            className={css(styles.numberInput, styles.input)}
            value={roundPackageDimension(length)}
            onChange={({ valueAsNumber }) => {
              packageState.length = valueAsNumber;
              setHasMadeLengthChange(true);
            }}
            incrementStep={1}
            validators={[new PackageMeasureValidator()]}
            onValidityChanged={({ isValid }) =>
              (packageState.isLengthValid = isValid)
            }
            forceValidation={forceValidation}
          />
          <FormSelect
            className={css(styles.unitInput, styles.input)}
            options={LengthOptions}
            selectedValue={lengthUnit}
            onSelected={(unit: PickedLengthUnit) =>
              (packageState.lengthUnit = unit)
            }
          />
        </div>
      )}
      <Layout.FlexRow
        alignItems="center"
        className={css(styles.checkboxFieldContainer)}
      >
        <CheckboxField
          className={css(styles.checkboxField)}
          checked={applyToAllVariations}
          onChange={() =>
            (packageState.applyToAllVariations = !applyToAllVariations)
          }
        >
          Apply to all the variations of this product
        </CheckboxField>
        <Info
          className={css(styles.info)}
          text={
            i`After you check this box, the weight, width, height, and ` +
            i`length you input here will be applied as the default logistics ` +
            i`information for all variations of this product.`
          }
        />
      </Layout.FlexRow>
      <div className={css(styles.footer)}>
        <PrimaryButton isLoading={isSaving} onClick={handleSubmit}>
          Next
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark, negative, textBlack, primary, borderPrimaryLight } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        fieldTitle: {
          display: "flex",
        },
        fieldTitleText: {
          fontSize: 14,
          lineHeight: "16px",
          color: textDark,
        },
        fieldTitleStar: {
          fontSize: 14,
          lineHeight: 1,
          marginLeft: 2,
          color: negative,
        },
        section: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
          display: "grid",
          gridTemplateRows: "max-content max-content",
          gridTemplateColumns: "repeat(4, max-content)",
          columnGap: "8px",
          rowGap: 5,
        },
        input: {
          gridRow: 2,
        },
        unitInput: {
          width: 103,
        },
        numberInput: {
          width: 120,
        },
        checkboxFieldContainer: {
          margin: "20px 0px",
        },
        checkboxField: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        info: {
          marginLeft: 4,
          cursor: "pointer",
        },
        footer: {
          display: "flex",
          justifyContent: "flex-end",
        },
        packageSelection: {
          padding: 12,
          border: `1px solid ${borderPrimaryLight}`,
          borderRadius: 4,
          ":hover": {
            cursor: "pointer",
          },
          ":not(:first-child)": {
            marginLeft: 16,
          },
          minWidth: 172,
        },
        packageSelectionActive: {
          border: `1px solid ${primary}`,
        },
        packageIllust: {
          height: 45,
        },
        packageText: {
          marginTop: 8,
          size: 14,
        },
      }),
    [textDark, negative, textBlack, primary, borderPrimaryLight],
  );
};

export default observer(PackageEditing);

export class PackageMeasureValidator extends Validator {
  async validateText(text: string): Promise<ValidationResponse> {
    const value = text.trim();
    if (value.trim().length === 0) {
      return i`This field is required`;
    }

    const float = parseFloat(value);

    if (isNaN(float)) {
      return i`Please enter a numerical value`;
    }

    if (float <= 0) {
      return i`Please enter a positive number`;
    }

    return null;
  }
}
