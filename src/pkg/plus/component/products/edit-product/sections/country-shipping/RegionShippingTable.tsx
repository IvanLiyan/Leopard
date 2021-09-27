/*
 *
 * RegionShippingMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

import { CurrencyInput } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { CountryShippingState } from "@plus/model/ProductEditState";
import { RegionPick } from "@toolkit/product-edit";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

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
  const {
    editState: { primaryCurrency },
  } = shippingState;

  return (
    <Table
      data={regions}
      hideBorder
      rowHeight={70}
      className={css(style, className)}
    >
      <Table.Column title={i`Country/Region`} columnKey="name" />
      <Table.Column title={i`Shipping price`} columnKey="price" handleEmptyRow>
        {({ row: region }: CellInfo<RegionPick, RegionPick>) => {
          const regionCode = region.code;
          const shippingPrice = shippingState.getRegionPrice(regionCode);
          return (
            <CurrencyInput
              value={shippingPrice.toString()}
              placeholder="0.00"
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) =>
                shippingState.setRegionPrice(textAsNumber ?? NaN, regionCode)
              }
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              style={{ minWidth: 80 }}
            />
          );
        }}
      </Table.Column>
      <Table.SwitchColumn
        title={i`Enable shipping to country/region`}
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
            },
          };
        }}
        width={150}
      />
    </Table>
  );
};

export default observer(RegionShippingTable);
