/*
 *
 * RegionShippingMerchantTable.tsx
 *
 * Created by Joyce Ji on 9/23/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import {
  Table,
  CurrencyInput,
  Select,
  TextInput,
  CellInfo,
} from "@ContextLogic/lego";

import { css } from "@toolkit/styling";

import ProductShippingEditState, {
  RegionPick,
  CountryShippingState,
} from "@merchant/model/products/ProductShippingEditState";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Constants */
import { MERCHANT_PRODUCT_SHIPPING_TEST_ID } from "@merchant/toolkit/testing";

type RegionShippingTTDProps = {
  readonly shippingState: CountryShippingState;
  readonly editState: ProductShippingEditState;
  readonly region: RegionPick;
};

const RegionShippingTTD: React.FC<RegionShippingTTDProps> = observer(
  ({ shippingState, editState, region: { code } }: RegionShippingTTDProps) => {
    const styles = useStylesheet();
    const { ttdValidators, isSubmitting } = editState;
    const { countryName, timeToDoorValue: countryTimeToDoor } = shippingState;
    const regionalEnabled = shippingState.getIsRegionEnabled(code);
    const timeToDoor = shippingState.getRegionalTimeToDoor(code);
    const useRegionShipping = shippingState.getIsRegionUsingCountryTTD(code);
    const disabled = isSubmitting || !regionalEnabled;
    const [text, setText] = useState<string | undefined>(
      timeToDoor?.toString() || undefined
    );
    const [userEdited, setUserEdited] = useState<boolean>(false);

    useEffect(() => {
      if (useRegionShipping) {
        setText(countryTimeToDoor?.toString());
        return;
      }

      setText(timeToDoor?.toString());
    }, [useRegionShipping, setText, timeToDoor, code, countryTimeToDoor]);

    return (
      <div className={css(styles.row)}>
        <TextInput
          value={text}
          placeholder={i`e.g. ${5}`}
          hideCheckmarkWhenValid
          onChange={({ text }) => {
            setText(text.trim());
          }}
          onBlur={() => {
            const ttd = text ? parseInt(text.trim()) : undefined;
            shippingState.setRegionalTimeToDoor(ttd, code);
          }}
          disabled={disabled || useRegionShipping}
          onFocus={() => setUserEdited(true)}
          validators={userEdited ? ttdValidators : []}
          style={{ width: 80 }}
          data-testid={
            MERCHANT_PRODUCT_SHIPPING_TEST_ID.REGION_MAX_DELIVERY_DAYS
          }
        />
        <Select
          options={[
            {
              value: "country",
              text: i`Use ${countryName}`,
            },
            {
              value: "region",
              text: i`Use Region`,
            },
          ]}
          selectedValue={
            shippingState.getIsRegionUsingCountryTTD(code)
              ? "country"
              : "region"
          }
          onSelected={(value) => {
            if (value === "country") {
              shippingState.setRegionalTimeToDoor(undefined, code);
            }
            shippingState.setIsRegionUsingCountryTTD(value === "country", code);
          }}
          disabled={disabled}
        />
      </div>
    );
  }
);

type Props = BaseProps & {
  readonly regions: ReadonlyArray<RegionPick>;
  readonly shippingState: CountryShippingState;
};

const RegionShippingTable: React.FC<Props> = ({
  style,
  className,
  shippingState,
  regions,
}: Props) => {
  const styles = useStylesheet();
  const { editState, countryName } = shippingState;
  const {
    primaryCurrency,
    ttdColumnDescription,
    shippingPriceValidators,
    showAdvancedSection,
    unityCountries,
    isMerchantInCalculatedShippingBeta,
  } = editState;

  const isUnity =
    showAdvancedSection &&
    unityCountries
      .map((country) => country.code)
      .includes(shippingState.countryCode);

  const showEstimatedShipping =
    isMerchantInCalculatedShippingBeta &&
    isUnity &&
    editState.getDomesticShippingEnabled(editState.warehouseId);

  const unityCountryCodes = unityCountries.map((country) => country.code);

  return (
    <Table
      data={regions}
      hideBorder
      rowHeight={70}
      className={css(style, className)}
    >
      <Table.Column _key={undefined} title={i`Region`} columnKey="name" />
      {showAdvancedSection && isMerchantInCalculatedShippingBeta && (
        <Table.Column
          _key="advanced_logistics_support"
          title={i`Advanced Logistics Support`}
          description={i`Whether or not the destination country supports advanced logistics`}
          columnKey="country"
          minWidth={150}
          handleEmptyRow
        >
          {() =>
            unityCountryCodes.includes(shippingState.countryCode)
              ? i`Yes`
              : i`No`
          }
        </Table.Column>
      )}
      <Table.Column
        _key={undefined}
        title={i`Shipping price`}
        columnKey="price"
        handleEmptyRow
        minWidth={150}
      >
        {({ row: region }: CellInfo<RegionPick, RegionPick>) => {
          const regionCode = region.code;
          const regionalShippingPrice =
            shippingState.getRegionPrice(regionCode);
          const disabled =
            editState.isSubmitting ||
            !shippingState.getIsRegionEnabled(regionCode);

          let regionValue: string | number | null | undefined =
            regionalShippingPrice;
          if (shippingState.getIsRegionUsingCountryShipping(regionCode)) {
            regionValue = showEstimatedShipping
              ? i`Calculated`
              : shippingState.priceAmount;
          }

          return (
            <div className={css(styles.row)}>
              <CurrencyInput
                value={regionValue}
                placeholder="0.00"
                currencyCode={primaryCurrency}
                hideCheckmarkWhenValid
                onChange={({ textAsNumber }) => {
                  if (
                    !(
                      disabled ||
                      shippingState.getIsRegionUsingCountryShipping(regionCode)
                    )
                  ) {
                    shippingState.setRegionPrice(textAsNumber, regionCode);
                  }
                }}
                debugValue={(Math.random() * 10).toFixed(2).toString()}
                style={styles.currencyInput}
                disabled={
                  disabled ||
                  shippingState.getIsRegionUsingCountryShipping(regionCode)
                }
                validators={
                  shippingState.getIsRegionUsingCountryShipping(regionCode)
                    ? []
                    : shippingPriceValidators
                }
                data-testid={
                  MERCHANT_PRODUCT_SHIPPING_TEST_ID.REGION_SHIPPING_PRICE
                }
              />
              <Select
                options={[
                  {
                    value: "country",
                    text: i`Use ${countryName}`,
                  },
                  {
                    value: "region",
                    text: i`Use Region`,
                  },
                ]}
                selectedValue={
                  shippingState.getIsRegionUsingCountryShipping(regionCode) ||
                  showEstimatedShipping
                    ? "country"
                    : "region"
                }
                onSelected={(value) => {
                  if (value === "country") {
                    shippingState.setRegionPrice(undefined, regionCode);
                  }
                  shippingState.setIsRegionUsingCountryShipping(
                    value === "country",
                    regionCode
                  );
                }}
                disabled={
                  disabled ||
                  showEstimatedShipping ||
                  (!editState.isStandardWarehouse &&
                    !shippingState.isCountryAllowWeRegionalPrice)
                }
              />
            </div>
          );
        }}
      </Table.Column>
      {editState.showTTDColumn && (
        <Table.Column
          _key={undefined}
          title={i`Max delivery days`}
          description={ttdColumnDescription}
          columnKey="timeToDoor"
          width={300}
          handleEmptyRow
        >
          {({ row: region }: CellInfo<RegionPick, RegionPick>) => (
            <RegionShippingTTD
              region={region}
              shippingState={shippingState}
              editState={editState}
            />
          )}
        </Table.Column>
      )}
      <Table.SwitchColumn
        _key={undefined}
        title={i`Enable destination`}
        description={i`You can enable or disable each destination for this product.`}
        columnKey="enabled"
        handleEmptyRow
        align="center"
        switchProps={({ row: region }: CellInfo<boolean, RegionPick>) => {
          const regionCode = region.code;
          const enabled = shippingState.getIsRegionEnabled(regionCode);
          return {
            isOn: enabled,
            onToggle(enabled) {
              shippingState.setIsRegionEnabled(enabled, regionCode);
              // Disable shipping for a country if all possible regions for a country are disabled
              // Currently only applied to US
              if (shippingState.countryCode == "US") {
                shippingState.setIsCountryEnabled();
              }
            },
            disabled: !shippingState.enabled,
          };
        }}
        width={150}
      />
    </Table>
  );
};

export default observer(RegionShippingTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        currencyInput: {
          width: 130,
        },
        row: {
          display: "flex",
          flexDirection: "row",
        },
      }),
    []
  );
};
