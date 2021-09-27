import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Select } from "@ContextLogic/lego";

/* Type Imports */
import { SelectProps } from "@ContextLogic/lego";
import { TrademarkCountryCode } from "@schema/types";

export type TrademarkOfficeSelectProps = Omit<
  SelectProps,
  "options" | "position"
> & {
  readonly acceptedTrademarkCountries: ReadonlyArray<TrademarkCountryCode>;
};

const TrademarkOfficeDisplay: {
  [trademarkCountryCode in TrademarkCountryCode]: string;
} = {
  AU: i`Australia - Intellectual Property Australia`,
  BR: i`Brazil - Instituto Nacional da Propriedade Industrial`,
  CA: i`Canada - Canadian Intellectual Property Office`,
  CH: i`Switzerland - Swiss Federal Institute of Intellectual Property`,
  CN: i`China - TMsearch`,
  EU: i`Europe - European Union Intellectual Property Office`,
  FR: i`France - Institut national de la propriété industrielle`,
  DE: i`Germany - Deutsches Patent- und Markenamt`,
  IN: i`India - Trademark Registry`,
  IT: i`Italy - Ufficio Italiano Brevetti e Marchi`,
  JP: i`Japan - Japanese Patent/Trademark Office`,
  MX: i`Mexico - Marcas IMPI`,
  NL: i`Netherlands - Benelux Office for Intellectual Property`,
  SG: i`Singapore - Intellectual Property Office of Singapore`,
  ES: i`Spain - Oficina Española de Patentes y Marcas`,
  TR: i`Turkey - Turkish Patent and Trademark Office`,
  AE: i`United Arab Emirates - Ministry of Economy`,
  GB: i`United Kingdom - Intellectual Property Office UK`,
  US: i`United States - United States Patent and Trademark Office`,
};

export const getTrademarkOfficeDisplay = (
  countryCode: TrademarkCountryCode
) => {
  return TrademarkOfficeDisplay[countryCode];
};

const TrademarkOfficeSelect = ({
  acceptedTrademarkCountries,
  ...otherProps
}: TrademarkOfficeSelectProps) => {
  const options = acceptedTrademarkCountries.map((cc) => {
    return {
      value: cc,
      text: getTrademarkOfficeDisplay(cc),
    };
  });

  return (
    <Select
      placeholder={i`Select an office`}
      options={options}
      position={"bottom center"}
      {...otherProps}
    />
  );
};

export default observer(TrademarkOfficeSelect);
