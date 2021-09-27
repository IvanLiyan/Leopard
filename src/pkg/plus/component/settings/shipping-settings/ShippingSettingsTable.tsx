/*
 *
 * ShippingSettingsMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/27/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { TableProps, CellInfo, SortOrder } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import TopGmvCountryBadge from "./TopGmvCountryBadge";
import WishExpressTimeToDoorBadge from "./WishExpressTimeToDoorBadge";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import {
  Country,
  WishExpressCountryDetails,
  ShippableCountryCode,
} from "@schema/types";

export type PickedWishExpressDetails = Pick<
  WishExpressCountryDetails,
  "supportsWishExpress" | "expectedTimeToDoor"
>;
export type PickedCountry = Pick<Country, "name" | "code" | "gmvRank"> & {
  readonly wishExpress: PickedWishExpressDetails;
};
export type SortField = "ENABLED";

export type DataItem = {
  readonly enabled: boolean;
  readonly country: PickedCountry;
  readonly isTopGMVCountry: boolean;
  readonly originallyEnabled: boolean;
  readonly wishExpress: PickedWishExpressDetails;
};

type Props = BaseProps & {
  readonly data: ReadonlyArray<DataItem>;
  readonly selectedRowIndeces: ReadonlyArray<number>;
  readonly setCountryEnabled: (
    countryCode: ShippableCountryCode,
    enabled: boolean
  ) => unknown;
  readonly onRowSelectionToggled: TableProps["onRowSelectionToggled"];
  readonly actions: TableProps["actions"];
  readonly sortField: SortField | undefined;
  readonly sortOrder: SortOrder | undefined;
  readonly onSortToggled: (field: SortField, order: SortOrder) => unknown;
};

const ShippingSettingsTable: React.FC<Props> = ({
  style,
  className,
  data,
  actions,
  sortOrder,
  sortField,
  onSortToggled,
  setCountryEnabled,
  selectedRowIndeces,
  onRowSelectionToggled,
}: Props) => {
  const styles = useStylesheet();
  return (
    <Table
      data={data}
      hideBorder
      rowHeight={60}
      className={css(style, className)}
      selectedRows={selectedRowIndeces}
      onRowSelectionToggled={onRowSelectionToggled}
      actions={actions}
      noDataMessage={i`No countries found`}
    >
      <Table.Column
        title={i`Country/Region`}
        columnKey="country.name"
        minWidth="50%"
        handleEmptyRow
      >
        {({
          row: { country },
        }: CellInfo<DataItem["country"]["name"], DataItem>) => {
          return (
            <div className={css(styles.country)}>
              <Flag countryCode={country.code} className={css(styles.flag)} />
              <div className={css(styles.countryName)}>{country.name}</div>
            </div>
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Badges`}
        columnKey="isTopGMVCountry"
        handleEmptyRow
      >
        {({
          row: {
            isTopGMVCountry,
            wishExpress: { supportsWishExpress, expectedTimeToDoor },
          },
        }: CellInfo<DataItem["isTopGMVCountry"], DataItem>) => {
          return (
            <div className={css(styles.country)}>
              {isTopGMVCountry && (
                <TopGmvCountryBadge className={css(styles.badge)} />
              )}

              <WishExpressTimeToDoorBadge
                className={css(styles.badge, styles.weBadge)}
                supportsWishExpress={supportsWishExpress}
                expectedTimeToDoor={expectedTimeToDoor}
              />
            </div>
          );
        }}
      </Table.Column>
      <Table.SwitchColumn
        title={i`Enable country/region for all products`}
        columnKey="enabled"
        handleEmptyRow
        align="center"
        switchProps={({
          row: dataItem,
        }: CellInfo<DataItem["enabled"], DataItem>) => {
          return {
            isOn: dataItem.enabled,
            onToggle(enabled) {
              setCountryEnabled(
                dataItem.country.code as ShippableCountryCode,
                enabled
              );
            },
          };
        }}
        sortOrder={sortField == "ENABLED" ? sortOrder : "not-applied"}
        onSortToggled={(newOrder) => onSortToggled("ENABLED", newOrder)}
        width={300}
      />
    </Table>
  );
};

export default observer(ShippingSettingsTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        country: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          userSelect: "none",
        },
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          minWidth: 60,
        },
        badge: {
          marginLeft: 15,
        },
        weBadge: {
          minWidth: 100,
        },
      }),
    []
  );
};
