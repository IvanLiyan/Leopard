/*
 *
 * ShippingProfileDestinationMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  FormSelect,
  NumericInput,
  CurrencyInput,
  StaggeredFadeIn,
} from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Table } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";
import { RequiredValidator } from "@toolkit/validators";

import { TableProps } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";

import TopGmvCountryBadge from "@plus/component/settings/shipping-settings/TopGmvCountryBadge";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import ShippingProfileState, {
  PickedCountryWeShipTo,
  ShippingProfileDestinationState,
} from "@plus/model/ShippingProfileState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly data: ReadonlyArray<ShippingProfileDestinationState>;
  readonly selectedRowIndeces: ReadonlyArray<number>;
  readonly onRowSelectionToggled: TableProps["onRowSelectionToggled"];
  readonly profileState: ShippingProfileState;
};

const ShippingProfileDestinationTable: React.FC<Props> = ({
  style,
  className,
  data,
  profileState,
  selectedRowIndeces,
  onRowSelectionToggled,
}: Props) => {
  const styles = useStylesheet();
  const {
    primaryCurrency,
    forceValidation,
    isSubmitting,
    availableCountryOptions,
  } = profileState;

  const countriesByCode: {
    [key: string]: PickedCountryWeShipTo;
  } = useMemo(() => {
    return availableCountryOptions.reduce((accum, country) => {
      return { ...accum, [country.code]: country };
    }, {});
  }, [availableCountryOptions]);

  const isTopGMVCountry = (
    country: PickedCountryWeShipTo | undefined
  ): boolean => country?.gmvRank != null && country?.gmvRank <= 10;

  const renderCountry = (destinationState: ShippingProfileDestinationState) => {
    if (destinationState.isSaved) {
      const { country } = destinationState;
      if (country == null) {
        return null;
      }

      return (
        <div className={css(styles.country)} key={destinationState.internalId}>
          <Flag countryCode={country.code} className={css(styles.flag)} />
          <div className={css(styles.countryName)}>{country.name}</div>
        </div>
      );
    }

    return (
      <FormSelect
        key={destinationState.internalId}
        options={availableCountryOptions.map(({ code, name }) => ({
          value: code,
          text: name,
        }))}
        onSelected={(value: string) => {
          {
            const selectedCountry = countriesByCode[value];
            if (!selectedCountry) {
              return;
            }
            destinationState.country = selectedCountry;
          }
        }}
        selectedValue={destinationState.country?.code}
        placeholder={i`Select a country`}
      />
    );
  };

  return (
    <Table
      hideBorder
      rowHeight={60}
      className={css(style, className)}
      selectedRows={selectedRowIndeces}
      onRowSelectionToggled={onRowSelectionToggled}
      actions={[]}
      data={data}
      noDataMessage={i`Add destinations that you ship products to.`}
    >
      <Table.Column
        title={i`Destination`}
        columnKey="name"
        width={200}
        handleEmptyRow
      >
        {({
          row: profileState,
        }: CellInfo<
          ShippingProfileDestinationState,
          ShippingProfileDestinationState
        >) => renderCountry(profileState)}
      </Table.Column>
      <Table.Column title={i`Rate`} columnKey="rate" handleEmptyRow width={100}>
        {({
          row: destinationState,
        }: CellInfo<
          ShippingProfileDestinationState,
          ShippingProfileDestinationState
        >) => {
          return (
            <CurrencyInput
              value={destinationState.rate?.toString()}
              placeholder="0.00"
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) =>
                destinationState.setRate(textAsNumber || 0)
              }
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              style={{ width: 100 }}
              forceValidation={forceValidation}
              validators={[new RequiredValidator()]}
              disabled={isSubmitting}
              showErrorMessages={false}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Max delivery`}
        columnKey="inventory"
        handleEmptyRow
        minWidth={100}
        description={
          i`The maximum amount of days it will take for an` +
          i` order to be processed and delivered to your customer’s door.`
        }
      >
        {({
          row: destinationState,
        }: CellInfo<
          ShippingProfileDestinationState,
          ShippingProfileDestinationState
        >) => {
          return (
            <div className={css(styles.ttdContainer)}>
              <NumericInput
                key={destinationState.internalId}
                value={destinationState.maxDeliveryDays}
                incrementStep={1}
                onChange={({ valueAsNumber }) =>
                  destinationState.setMaxDeliveryDays(valueAsNumber || 0)
                }
                validators={[new RequiredValidator()]}
                forceValidation={forceValidation}
                disabled={isSubmitting}
                placeholder="5"
                style={{ marginRight: 7, maxWidth: 100 }}
              />
              <span>days</span>
            </div>
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Badges`}
        columnKey="badges"
        handleEmptyRow
        align="left"
        width={100}
      >
        {({
          row: { country },
        }: CellInfo<
          ShippingProfileDestinationState,
          ShippingProfileDestinationState
        >) => {
          return (
            <StaggeredFadeIn
              deltaY={5}
              animationDurationMs={150}
              className={css(styles.badgesContainer)}
            >
              {isTopGMVCountry(country) && (
                <TopGmvCountryBadge className={css(styles.badge)} />
              )}

              {country?.wishExpress.supportsWishExpress && (
                <Illustration
                  name="wishExpressWithoutText"
                  alt="wish express"
                  className={css(styles.badge)}
                />
              )}
            </StaggeredFadeIn>
          );
        }}
      </Table.Column>
      <Table.SwitchColumn
        title={i`On/off`}
        columnKey="enabled"
        handleEmptyRow
        align="center"
        switchProps={({
          row,
        }: CellInfo<boolean, ShippingProfileDestinationState>) => {
          return {
            isOn: true,
            onToggle(enabled) {},
          };
        }}
        description={
          i`Turning a destination on or off controls whether a ` +
          i`customer will see this shipping option at checkout.`
        }
      />
    </Table>
  );
};

export default observer(ShippingProfileDestinationTable);

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
          marginLeft: 7,
          height: 24,
        },
        ttdContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        badgesContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        fixtureCell: {
          padding: "0px 14px",
        },
      }),
    []
  );
};
