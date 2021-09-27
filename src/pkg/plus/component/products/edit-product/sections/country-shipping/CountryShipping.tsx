/*
 *
 * CountryShipping.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card, Checkbox, Markdown, CurrencyInput } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { Popover } from "@merchant/component/core";
import RegionShippingTable from "./RegionShippingTable";

import ProductEditState from "@plus/model/ProductEditState";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useLogger } from "@toolkit/logger";

import { PickedShippingSettingsSchema } from "@toolkit/product-edit";

type CountryShippingPriceProps = {
  readonly shippingSetting: PickedShippingSettingsSchema;
  readonly editState: ProductEditState;
};

const CountryShippingPrice: React.FC<CountryShippingPriceProps> = observer(
  ({ shippingSetting, editState }: CountryShippingPriceProps) => {
    const {
      forceValidation,
      primaryCurrency,
      defaultShippingPriceForStandardWarehouse,
    } = editState;
    const countryCode = shippingSetting.country.code;
    const shippingState = editState.getCountryShippingState(countryCode);
    const { shippingPrice } = shippingState;
    const [text, setText] = useState<string>(shippingPrice?.toString() || "");
    useEffect(() => {
      if (shippingPrice == null) {
        setText(defaultShippingPriceForStandardWarehouse?.toString() || "");
        return;
      }

      setText(shippingPrice?.toString() || "");
    }, [defaultShippingPriceForStandardWarehouse, setText, shippingPrice]);

    return (
      <CurrencyInput
        value={text}
        placeholder="0.00"
        currencyCode={primaryCurrency}
        hideCheckmarkWhenValid
        onChange={({ text }) => {
          setText(text.trim());
        }}
        onBlur={() => {
          const amount = parseFloat(text.trim());
          shippingState.setPrice(amount);
        }}
        debugValue={(Math.random() * 10).toFixed(2).toString()}
        style={{ minWidth: 80 }}
        forceValidation={forceValidation}
      />
    );
  }
);

type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const CountryShipping: React.FC<Props> = ({
  style,
  className,
  editState,
}: Props) => {
  const styles = useStylesheet();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const { storeCountries } = editState;
  const actionLogger = useLogger("PLUS_WISH_EXPRESS_UI");

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const renderExpanded = (shippingSetting: PickedShippingSettingsSchema) => {
    const { code: countryCode } = shippingSetting.country;
    const shippingState = editState.getCountryShippingState(countryCode);
    return (
      <div className={css(styles.regionShipping)}>
        <Card>
          <RegionShippingTable regions={[]} shippingState={shippingState} />
        </Card>
      </div>
    );
  };

  const rowExpands = (shippingSetting: PickedShippingSettingsSchema) => {
    // Disable region shipping for now.
    return false;
  };

  return (
    <div className={css(styles.root, style, className)}>
      <Markdown
        className={css(styles.description)}
        text={
          i`You can customize shipping prices for each country or ` +
          i`region listed below. You can add more countries by editing ` +
          i`your [Shipping Settings](${"/plus/settings/shipping"}).`
        }
      />

      <Table
        data={storeCountries}
        hideBorder
        rowHeight={70}
        rowExpands={rowExpands}
        expandedRows={Array.from(expandedRows)}
        renderExpanded={renderExpanded}
        onRowExpandToggled={onRowExpandToggled}
      >
        <Table.Column
          title={i`Country/Region`}
          columnKey="country.name"
          handleEmptyRow
        >
          {({
            row: shippingSetting,
          }: CellInfo<
            PickedShippingSettingsSchema["country"]["name"],
            PickedShippingSettingsSchema
          >) => (
            <div className={css(styles.country)}>
              <Flag
                countryCode={shippingSetting.country.code}
                className={css(styles.flag)}
              />
              <div className={css(styles.countryName)}>
                {shippingSetting.country.name}
              </div>
            </div>
          )}
        </Table.Column>
        <Table.Column
          title={i`Shipping price`}
          columnKey="price"
          width={100}
          handleEmptyRow
        >
          {({
            row: shippingSetting,
          }: CellInfo<
            PickedShippingSettingsSchema,
            PickedShippingSettingsSchema
          >) => (
            <CountryShippingPrice
              key={shippingSetting.country.name}
              shippingSetting={shippingSetting}
              editState={editState}
            />
          )}
        </Table.Column>
        <Table.SwitchColumn
          title={i`Enable shipping to country/region`}
          minWidth={120}
          columnKey="enabled"
          handleEmptyRow
          align="center"
          switchProps={({
            row: shippingSetting,
          }: CellInfo<boolean, PickedShippingSettingsSchema>) => {
            const countryCode = shippingSetting.country.code;
            const shippingState = editState.getCountryShippingState(
              countryCode
            );
            return {
              isOn: !!shippingState.enabled,
              onToggle(enabled) {
                shippingState.setEnabled(enabled);
              },
            };
          }}
          width={150}
        />
        <Table.Column
          minWidth={110}
          align="center"
          title={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Icon
                name="wishExpressTruck2"
                style={{ width: 14, marginRight: 4 }}
              />
              <>Wish Express</>
            </div>
          )}
          columnKey="wishExpressEnabled"
          handleEmptyRow
        >
          {({
            row: shippingSetting,
          }: CellInfo<boolean, PickedShippingSettingsSchema>) => {
            const countryCode = shippingSetting.country.code;
            const shippingState = editState.getCountryShippingState(
              countryCode
            );
            const canEnableWishExpress = editState.wishExpressCountries.includes(
              countryCode
            );
            if (canEnableWishExpress) {
              return (
                <Checkbox
                  checked={shippingState.wishExpressEnabled}
                  onChange={(checked) => {
                    actionLogger.info({
                      action: "CLICK_WISH_EXPRESS_COUNTRY_CHECKBOX",
                      enabled: checked,
                      country_code: countryCode,
                      product_id: editState.isNewProduct
                        ? null
                        : editState.initialState.id,
                    });
                    shippingState.wishExpressEnabled = checked;
                  }}
                  disabled={!shippingState.enabled}
                />
              );
            }

            return (
              <Popover
                popoverContent={i`Wish Express is not offered in this country/region yet.`}
                position="top center"
              >
                --
              </Popover>
            );
          }}
        </Table.Column>
      </Table>
    </div>
  );
};

export default observer(CountryShipping);

const useStylesheet = () => {
  const { surfaceLightest, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
        },
        description: {
          padding: 15,
        },
        country: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
        },
        regionShipping: {
          padding: 20,
          backgroundColor: pageBackground,
        },
      }),
    [surfaceLightest, pageBackground]
  );
};
