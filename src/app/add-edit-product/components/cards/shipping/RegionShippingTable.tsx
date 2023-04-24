/*
 * RegionShippingTable.tsx
 *
 * Created by Jonah Dlin on Mon Nov 01 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

import {
  CurrencyInput,
  Layout,
  NumericInput,
  CellInfo,
  Table,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import AddEditProductState, {
  RegionShipping,
  regionShippingHasWishExpress,
} from "@add-edit-product/AddEditProductState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@schema";
import WeBadge from "./WeBadge";
import { MinMaxValueValidator } from "@core/toolkit/validators";
import { MAX_ALLOWED_DELIVERY_DAYS } from "@add-edit-product/toolkit";
import numeral from "numeral";

type Props = BaseProps & {
  readonly countryCode: CountryCode;
  readonly state: AddEditProductState;
};

const NoData = `--`;

const RegionShippingTable: React.FC<Props> = ({
  style,
  className,
  state,
  countryCode,
}: Props) => {
  const {
    primaryCurrency,
    updateRegionShipping,
    getCountryShipping,
    isSubmitting,
    canShowMaxDeliveryDays,
    forceValidation,
  } = state;

  const countryShipping = getCountryShipping(countryCode);

  const regions = useMemo(() => {
    if (countryShipping == null) {
      return [];
    }
    return Array.from(countryShipping.regionShipping.values());
  }, [countryShipping]);

  return (
    <Table
      data={regions}
      hideBorder
      rowHeight={70}
      className={css(style, className)}
      rowDataCy={(row: RegionShipping) => `region-shipping-row-${row.code}`}
    >
      <Table.Column _key="name" title={i`Region`} columnKey="name" />
      <Table.Column
        _key="shippingPrice"
        title={i`Shipping price`}
        columnKey="shippingPrice"
        columnDataCy="column-shipping-price"
        handleEmptyRow
      >
        {({
          row: regionShipping,
        }: CellInfo<RegionShipping, RegionShipping>) => {
          const regionCode = regionShipping.code;
          const value =
            regionShipping.shippingPrice == null
              ? null
              : regionShipping.shippingPrice;
          return (
            <CurrencyInput
              value={
                regionShipping.hasEditedShippingPrice || value == null
                  ? value
                  : value.toFixed(2).toString()
              }
              placeholder="0.00"
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) => {
                if (textAsNumber != regionShipping.shippingPrice) {
                  updateRegionShipping({
                    cc: countryCode,
                    regionCode,
                    newProps: {
                      shippingPrice: textAsNumber == null ? null : textAsNumber,
                      hasEditedShippingPrice: true,
                    },
                  });
                }
              }}
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              style={{ minWidth: 80 }}
              disabled={isSubmitting || !regionShipping.enabled}
            />
          );
        }}
      </Table.Column>
      {canShowMaxDeliveryDays && (
        <Table.Column
          _key="maxDeliveryDays"
          title={i`Max delivery days`}
          columnKey="maxDeliveryDays"
          columnDataCy="column-max-delivery-days"
          handleEmptyRow
        >
          {({
            row: regionShipping,
          }: CellInfo<RegionShipping, RegionShipping>) => {
            const value = regionShipping.maxDeliveryDays;
            return (
              <NumericInput
                value={value}
                placeholder="0"
                onChange={({ valueAsNumber }) => {
                  if (valueAsNumber != regionShipping.maxDeliveryDays) {
                    updateRegionShipping({
                      cc: countryCode,
                      regionCode: regionShipping.code,
                      newProps: {
                        maxDeliveryDays:
                          valueAsNumber == null
                            ? null
                            : Math.max(valueAsNumber, 0),
                        hasEditedMaxDeliveryDays: true,
                      },
                    });
                  }
                }}
                style={{ minWidth: 80 }}
                disabled={isSubmitting || !regionShipping.enabled}
                forceValidation={forceValidation}
                validators={[
                  new MinMaxValueValidator({
                    maxAllowedValue: MAX_ALLOWED_DELIVERY_DAYS,
                    allowBlank: true,
                    customMessage: i`Cannot exceed ${numeral(
                      MAX_ALLOWED_DELIVERY_DAYS,
                    ).format("0,0")} days`,
                  }),
                ]}
              />
            );
          }}
        </Table.Column>
      )}
      <Table.Column
        _key="wishExpressMaxDeliveryDaysRequirement"
        title={i`Badges`}
        columnKey="wishExpressMaxDeliveryDaysRequirement"
        handleEmptyRow
      >
        {({
          row: regionShipping,
        }: CellInfo<RegionShipping, RegionShipping>) => {
          const isWishExpress =
            canShowMaxDeliveryDays &&
            regionShippingHasWishExpress(regionShipping);
          return (
            <Layout.FlexRow>
              {isWishExpress ? <WeBadge /> : NoData}
            </Layout.FlexRow>
          );
        }}
      </Table.Column>
      <Table.SwitchColumn
        _key="enabled"
        title={i`Enable shipping to destination`}
        minWidth={120}
        columnKey="enabled"
        handleEmptyRow
        align="center"
        switchProps={({
          row: regionShipping,
        }: CellInfo<boolean, RegionShipping>) => {
          return {
            isOn: regionShipping.enabled || false,
            onToggle(enabled) {
              updateRegionShipping({
                cc: countryCode,
                regionCode: regionShipping.code,
                newProps: {
                  enabled,
                },
              });
            },
          };
        }}
        width={150}
        columnDataCy="column-enable"
      />
    </Table>
  );
};

export default observer(RegionShippingTable);
