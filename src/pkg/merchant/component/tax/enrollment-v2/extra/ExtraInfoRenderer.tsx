import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Tip, Info } from "@ContextLogic/lego";

/* Merchant Components */
import FBWWarehouseTaxInfo from "@merchant/component/tax/enrollment-v2/extra/FBWWarehouseTaxInfo";

import { CountryCode } from "@toolkit/countries";
import { usePersistenceStore } from "@stores/PersistenceStore";
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { css } from "@toolkit/styling";
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

const ExtraFBWTaxInfo = (props: {
  readonly warehouse: {
    readonly name: string;
    readonly country: CountryCode;
  };
  readonly warehouseCountry: string;
}) => {
  const { warehouse, warehouseCountry } = props;
  if (warehouse.country !== warehouseCountry) {
    return null;
  }

  return (
    <FBWWarehouseTaxInfo
      countryCode={warehouseCountry}
      warehouseName={warehouse.name}
    />
  );
};

const FBWWarehouseTooltip = (props: { readonly origin: string }) => {
  const { origin } = props;
  const persistenceStore = usePersistenceStore();
  const { primary } = useTheme();

  const fbwTaxExtraInfoData: any = persistenceStore.get(origin);
  if (fbwTaxExtraInfoData) {
    const warehouse = fbwTaxExtraInfoData.warehouse;

    const clearSessionFlag = () => {
      persistenceStore.remove("TaxExtraInfo");
      persistenceStore.remove(origin);
    };

    const createShippingPlanLink = `[${i`Create a shipping plan`}](/create-shipping-plan?shipmentType=FBW)`;
    return (
      <Tip color={primary} icon="tip">
        <Markdown
          text={
            i`After accepting FBW Terms of Service and completing your Tax Settings for the` +
            i` Netherlands, you are eligible to use the non-bonded **${warehouse.name}**` +
            i` warehouse. Create a shipping plan today and stock` +
            i` your products in the ${warehouse.name} warehouse. ${createShippingPlanLink}`
          }
          onLinkClicked={clearSessionFlag}
          openLinksInNewTab
        />
      </Tip>
    );
  }
  return null;
};

export const ExtraTaxInfo = (props: {
  readonly origin: string | null | undefined;
  readonly path: string | null;
  readonly value?: string;
}) => {
  const { origin, path, value } = props;
  const persistenceStore = usePersistenceStore();
  const styles = useStylesheet();

  const code = value as CountryCode;
  if (infoCountries.has(code)) {
    return (
      <Info
        className={css(styles.info)}
        text={getCountryTooltipText(code)}
        size={16}
        sentiment="info"
        position="right"
      />
    );
  }

  if (origin == null) return null;
  const warehouse: any | null = persistenceStore.get(origin) || null;
  switch (origin) {
    case "FBWWarehouseTaxForm":
      switch (path) {
        case "/tax/v2-enroll":
          if (value && warehouse) {
            return (
              <ExtraFBWTaxInfo
                warehouse={warehouse?.warehouse}
                warehouseCountry={value}
              />
            );
          }

          return null;
        case "/tax/settings":
          return <FBWWarehouseTooltip origin={origin} />;
        default:
          return null;
      }

    default:
      return null;
  }
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        info: {
          marginLeft: 6,
        },
      }),
    [],
  );
};
