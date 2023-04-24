/*
 * CountryShipping.tsx
 *
 * Created by Jonah Dlin on Mon Nov 01 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  Card,
  Markdown,
  CurrencyInput,
  NumericInput,
  Layout,
  CellInfo,
  Table,
  Text,
} from "@ContextLogic/lego";
import Flag from "@core/components/Flag";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import RegionShippingTable from "./RegionShippingTable";

import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import AddEditProductState, {
  CountryShipping as CountryShippingType,
  countryShippingHasWishExpress,
} from "@add-edit-product/AddEditProductState";
import { getCountryName } from "@core/toolkit/countries";
import {
  MAX_ALLOWED_DELIVERY_DAYS,
  TOP_SELLER_MAX_GMV_RANK,
} from "@add-edit-product/toolkit";
import TopSellerBadge from "./TopSellerBadge";
import WeBadge from "./WeBadge";
import { MinMaxValueValidator } from "@core/toolkit/validators";
import numeral from "numeral";
import { merchFeURL } from "@core/toolkit/router";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const CountryShipping: React.FC<Props> = ({
  style,
  className,
  state,
}: Props) => {
  const styles = useStylesheet();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const {
    countryShippings,
    updateCountryShipping,
    updateRegionShipping,
    primaryCurrency,
    forceValidation,
    canShowMaxDeliveryDays,
  } = state;

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const renderExpanded = (shippingSetting: CountryShippingType) => {
    const { countryCode } = shippingSetting;
    const shippingState = state.getCountryShipping(countryCode);
    if (shippingState == null) {
      return null;
    }
    return (
      <div className={css(styles.regionShipping)}>
        <Card>
          <RegionShippingTable state={state} countryCode={countryCode} />
        </Card>
      </div>
    );
  };

  const rowExpands = (shippingSetting: CountryShippingType) => {
    return shippingSetting.regionShipping.size > 0;
  };

  return (
    <Layout.FlexColumn
      alignItems="stretch"
      style={[styles.root, style, className]}
    >
      <Markdown
        className={css(styles.description)}
        text={
          i`You can customize shipping prices for each country or ` +
          i`region listed below. You can add more countries by editing ` +
          i`your [Shipping Settings](${merchFeURL("/plus/settings/shipping")}).`
        }
        style={styles.text}
        openLinksInNewTab
      />

      <Table
        data={countryShippings}
        hideBorder
        rowHeight={70}
        rowExpands={rowExpands}
        expandedRows={Array.from(expandedRows)}
        renderExpanded={renderExpanded}
        onRowExpandToggled={onRowExpandToggled}
        rowDataCy={(row: CountryShippingType) =>
          `country-shipping-row-${row.countryCode}`
        }
      >
        <Table.Column
          _key="countryCode"
          title={i`Destination`}
          columnKey="countryCode"
          columnDataCy="column-destination"
          handleEmptyRow
          description={i`These are the destinations enabled in your shipping settings.`}
        >
          {({
            row: shippingSetting,
          }: CellInfo<
            CountryShippingType["countryCode"],
            CountryShippingType
          >) => (
            <Layout.FlexRow alignItems="center">
              <Flag
                countryCode={shippingSetting.countryCode}
                className={css(styles.flag)}
              />
              <Text style={styles.countryName} weight="semibold">
                {getCountryName(shippingSetting.countryCode)}
              </Text>
            </Layout.FlexRow>
          )}
        </Table.Column>
        <Table.Column
          _key="shippingPrice"
          title={i`Shipping price`}
          columnKey="shippingPrice"
          columnDataCy="column-shipping-price"
          handleEmptyRow
          description={i`The shipping price for this product to this destination.`}
        >
          {({
            row: shippingSetting,
          }: CellInfo<CountryShippingType, CountryShippingType>) => {
            const value =
              shippingSetting.shippingPrice == null
                ? null
                : shippingSetting.shippingPrice;
            return (
              <CurrencyInput
                value={
                  shippingSetting.hasEditedShippingPrice || value == null
                    ? value
                    : value.toFixed(2).toString()
                }
                placeholder="0.00"
                currencyCode={primaryCurrency}
                hideCheckmarkWhenValid
                onChange={({ textAsNumber }) => {
                  if (textAsNumber != shippingSetting.shippingPrice) {
                    updateCountryShipping({
                      cc: shippingSetting.countryCode,
                      newProps: {
                        shippingPrice:
                          textAsNumber == null
                            ? null
                            : Math.max(textAsNumber, 0),
                        hasEditedShippingPrice: true,
                      },
                    });

                    Array.from(shippingSetting.regionShipping.values()).forEach(
                      ({ code, hasEditedShippingPrice }) => {
                        if (!hasEditedShippingPrice) {
                          updateRegionShipping({
                            cc: shippingSetting.countryCode,
                            regionCode: code,
                            newProps: {
                              shippingPrice: textAsNumber,
                            },
                          });
                        }
                      },
                    );
                  }
                }}
                debugValue={(Math.random() * 10).toFixed(2).toString()}
                style={{ minWidth: 80 }}
                forceValidation={forceValidation}
                disabled={state.isSubmitting || !shippingSetting.enabled}
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
            description={
              i`Max Delivery Days is the maximum delivery timeline shown to customers on when ` +
              i`they can expect your product to be delivered. It is based on the number of ` +
              i`business days it takes for an order to be processed and delivered to your ` +
              i`customer’s door. If you do not provide a value, the default will be based on ` +
              i`your historical delivery times.`
            }
          >
            {({
              row: shippingSetting,
            }: CellInfo<CountryShippingType, CountryShippingType>) => {
              return (
                <NumericInput
                  value={shippingSetting.maxDeliveryDays}
                  placeholder="0"
                  onChange={({ valueAsNumber }) => {
                    if (valueAsNumber != shippingSetting.maxDeliveryDays) {
                      updateCountryShipping({
                        cc: shippingSetting.countryCode,
                        newProps: {
                          maxDeliveryDays:
                            valueAsNumber == null
                              ? null
                              : Math.max(valueAsNumber, 0),
                          hasEditedMaxDeliveryDays: true,
                        },
                      });

                      Array.from(
                        shippingSetting.regionShipping.values(),
                      ).forEach(({ code, hasEditedMaxDeliveryDays }) => {
                        if (!hasEditedMaxDeliveryDays) {
                          updateRegionShipping({
                            cc: shippingSetting.countryCode,
                            regionCode: code,
                            newProps: {
                              maxDeliveryDays: valueAsNumber,
                            },
                          });
                        }
                      });
                    }
                  }}
                  style={{ minWidth: 80 }}
                  disabled={state.isSubmitting || !shippingSetting.enabled}
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
            row: shippingSetting,
          }: CellInfo<CountryShippingType, CountryShippingType>) => {
            const isTopSeller =
              shippingSetting.gmvRank != null &&
              shippingSetting.gmvRank <= TOP_SELLER_MAX_GMV_RANK;

            const isWishExpress =
              canShowMaxDeliveryDays &&
              countryShippingHasWishExpress(shippingSetting);
            return (
              <Layout.FlexRow>
                {isTopSeller && (
                  <TopSellerBadge className={css(styles.badge)} />
                )}
                {isWishExpress && <WeBadge className={css(styles.badge)} />}
                {!isTopSeller && !isWishExpress && `--`}
              </Layout.FlexRow>
            );
          }}
        </Table.Column>
        <Table.SwitchColumn
          _key="enabled"
          title={i`Enable shipping to destination`}
          description={i`You can enable or disable each destination for this product.`}
          minWidth={120}
          columnKey="enabled"
          columnDataCy="column-enabled"
          handleEmptyRow
          align="center"
          switchProps={({
            row: shippingSetting,
          }: CellInfo<boolean, CountryShippingType>) => {
            const countryCode = shippingSetting.countryCode;
            const shippingState = state.getCountryShipping(countryCode);
            return {
              isOn:
                shippingState == null ? false : shippingState.enabled || false,
              onToggle(enabled) {
                updateCountryShipping({
                  cc: countryCode,
                  newProps: {
                    enabled,
                  },
                });
              },
            };
          }}
          width={150}
        />
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(CountryShipping);

const useStylesheet = () => {
  const { surfaceLightest, pageBackground, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
        },
        description: {
          padding: 15,
        },
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
        },
        regionShipping: {
          padding: 20,
          backgroundColor: pageBackground,
        },
        badge: {
          width: 24,
          height: 24,
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        text: {
          color: textDark,
        },
      }),
    [surfaceLightest, pageBackground, textDark],
  );
};
