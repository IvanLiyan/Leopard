import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { CountrySelect } from "@merchant/component/core";
import { CountryType } from "@merchant/component/core/CountrySelect";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";

import { usePersistenceStore } from "@merchant/stores/PersistenceStore";
import { WarehouseType } from "@toolkit/fbw";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

import { CountryCode } from "@schema/types";
import { useTheme } from "@merchant/stores/ThemeStore";

type EUSelectShipFromCountryFBWProps = {
  readonly requiresWEShipFrom: boolean;
  readonly countryOptions: ReadonlyArray<CountryType>;
  readonly editState: TaxEnrollmentV2State;
};

const EUSelectShipFromCountryFBW = (props: EUSelectShipFromCountryFBWProps) => {
  const { requiresWEShipFrom, countryOptions, editState } = props;
  const persistenceStore = usePersistenceStore();
  const styles = useStylesheet();
  const taxExtraInfoDataKey = persistenceStore.get<string>("TaxExtraInfo");
  const taxExtraInfoData = taxExtraInfoDataKey
    ? persistenceStore.get<{ readonly warehouse: WarehouseType }>(
        taxExtraInfoDataKey
      )
    : null;
  const warehouse = taxExtraInfoData ? taxExtraInfoData?.warehouse : null;

  return (
    <>
      <HorizontalField
        title={() => {
          return (
            <div className={css(styles.title)}>
              <section className={css(styles.text)}>Standard orders</section>
              &nbsp;
              <section className={css(styles.subText)}>(Non-FBW)</section>
            </div>
          );
        }}
        className={css(styles.field)}
        titleWidth={400}
        centerTitleVertically
      >
        <div className={css(styles.selectContainer)}>
          <CountrySelect
            placeholder={i`Select a country/region`}
            onCountry={(countryCode: CountryCode | undefined) => {
              editState.euStandardShipFromCountryCode = countryCode;
            }}
            currentCountryCode={
              editState.euStandardShipFromCountryCode as CountryCode
            }
            countries={countryOptions}
          />
        </div>
      </HorizontalField>
      {requiresWEShipFrom && (
        <HorizontalField
          title={() => {
            return (
              <div className={css(styles.title)}>
                <section className={css(styles.text)}>
                  Wish Express orders
                </section>
                &nbsp;
                <section className={css(styles.subText)}>(Non-FBW)</section>
              </div>
            );
          }}
          titleWidth={400}
          centerTitleVertically
          popoverContent={
            i`Provide a ship-from location for your Wish Express orders that are` +
            i` **NOT** fulfilled by the Fulfillment By Wish (FBW) program.`
          }
        >
          <div className={css(styles.selectContainer)}>
            <CountrySelect
              placeholder={i`Select a country/region`}
              onCountry={(countryCode: CountryCode | undefined) => {
                editState.euWishExpressShipFromCountryCode = countryCode;
              }}
              currentCountryCode={
                editState.euWishExpressShipFromCountryCode as CountryCode
              }
              countries={countryOptions}
            />
          </div>
        </HorizontalField>
      )}
      <HorizontalField
        className={css(styles.textWarehouse)}
        title={() => {
          return i`Non-bonded FBW orders`;
        }}
        titleWidth={400}
        centerTitleVertically
        popoverPosition="bottom"
        popoverContent={
          i`Non-bonded FBW orders refer to orders shipped from a non-bonded` +
          i` Fulfillment By Wish (FBW) warehouse, which means duty needs to` +
          i` be paid upon dutiable product inventory's arrival` +
          i` at the warehouse.` +
          "\n\n&nbsp;\n\n" +
          i`If you do **NOT** plan to use the Fulfillment By Wish program or` +
          i` a non-bonded FBW warehouse, please dismiss this information here.`
        }
      >
        {warehouse && (
          <div className={css(styles.warehouse)}>
            <section>{warehouse.name}</section>
            <section>{getCountryName((warehouse as any).country)}</section>
          </div>
        )}
      </HorizontalField>
    </>
  );
};

export default EUSelectShipFromCountryFBW;

const useStylesheet = () => {
  const { textDark, textBlack, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        selectContainer: {
          display: "flex",
          "@media (min-width: 900px)": {
            maxWidth: 300,
          },
          flexDirection: "column",
        },
        warehouse: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          maxWidth: "300px",
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        textWarehouse: {
          display: "flex",
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
          paddingTop: "16px",
          alignItems: "center",
        },
        subText: {
          fontSize: 16,
          fontStyle: "italic",
          color: textLight,
          lineHeight: 1.5,
        },
        title: {
          display: "flex",
          flexDirection: "row",
        },
        tooltip: {
          fontFamily: fonts.proxima,
          fontSize: 12,
          lineHeight: 1.43,
          color: textBlack,
          padding: 8,
          textAlign: "left",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
        field: {
          marginBottom: 15,
        },
      }),
    [textDark, textBlack, textLight]
  );
};
