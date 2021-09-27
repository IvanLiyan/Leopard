import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Merchant API */
import * as currencyApi from "@merchant/api/currency";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Markdown } from "@ContextLogic/lego";

const ChangeCurrencyTip = (props: BaseProps) => {
  const styles = useStylesheet();

  const [response] = useRequest(currencyApi.fetchCurrencyInformation({}));
  const data = response?.data;
  const isLoading = data == null;
  const allowedMigrationCode = data?.allowed_migration_code;
  const currencyCodeAndSymbol = `${allowedMigrationCode} (${getCurrencySymbol(
    allowedMigrationCode
  )})`;

  if (isLoading) {
    return (
      <LoadingIndicator
        type="spinner"
        size={50}
        className={css(styles.loading)}
      />
    );
  }
  const getStartedLink = `[${i`Get started`}](/payment-settings#currency)`;
  return (
    <Tip color={palettes.coreColors.WishBlue} icon="tip">
      <div className={css(styles.bannerText)}>
        <div className={css(styles.tipText)}>
          <span>
            {allowedMigrationCode == "BRL" ? (
              // eslint-disable-next-line local-rules/no-links-in-i18n
              <Markdown
                text={i`You will be able to edit product prices and receive orders in ${currencyCodeAndSymbol}. 
                  Payments will be one time converted to USD ($) at time of disbursements. ${getStartedLink}`}
              />
            ) : (
              // eslint-disable-next-line local-rules/no-links-in-i18n
              <Markdown
                text={i`You now have the option to conduct business in ${currencyCodeAndSymbol} by updating 
                  your Local Currency Code from USD to ${allowedMigrationCode}. ${getStartedLink}`}
              />
            )}
          </span>
        </div>
      </div>
    </Tip>
  );
};

export default ChangeCurrencyTip;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 4,
        },
        bannerText: {
          alignItems: "flex-start",
          color: palettes.textColors.Ink,
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
          fontFamily: fonts.proxima,
        },
        tipText: {
          fontWeight: fonts.weightMedium,
        },
        loading: {
          padding: "50px 200px",
          textAlign: "center",
        },
      }),
    []
  );
