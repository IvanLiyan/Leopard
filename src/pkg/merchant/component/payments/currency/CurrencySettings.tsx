import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant API */
import * as currencyApi from "@merchant/api/currency";

/* Relative Imports */
import { CurrencySettingsCard } from "./CurrencySettingsCard";
import { CurrencySettingsHelp } from "./CurrencySettingsHelp";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencySettingsProps = BaseProps & {
  readonly isPayPal: boolean;
  readonly isPayoneer: boolean;
};

const CurrencySettings = (props: CurrencySettingsProps) => {
  const styles = useStylesheet();

  const now = new Date();
  const { isPayPal, isPayoneer } = props;

  const [cancelled, setCancelled] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [pendingCurrency, setPendingCurrency] = useState<
    string | null | undefined
  >(null);
  const [allowedMigrationCode, setAllowedMigrationCode] = useState<
    string | null | undefined
  >(null);
  const [conversionRate, setConversionRate] = useState<
    number | null | undefined
  >(null);
  const [loaded, setLoaded] = useState(false);

  const completed = endDate ? endDate < now : false;
  const cancelledOrPending = cancelled ? "CANCELLED" : "PENDING";
  const conversionStatus = completed ? "COMPLETED" : cancelledOrPending;

  const reloadData = async () => {
    const resp = await currencyApi.fetchCurrencyInformation({}).call();
    setCurrentCurrency(resp.data?.current_currency || "USD");
    if (resp.data?.start_date != null && resp.data?.end_date != null) {
      setStartDate(moment.utc(resp.data?.start_date).toDate());
      setEndDate(moment.utc(resp.data?.end_date).toDate());
    }
    setPendingCurrency(resp.data?.pending_currency || null);
    setAllowedMigrationCode(resp.data?.allowed_migration_code || null);
    setConversionRate(resp.data?.conversion_rate || null);
    setLoaded(true);
  };
  useEffect(() => {
    reloadData();
  }, []);

  const cancelConversion = async () => {
    await currencyApi.cancelCurrencyConversion({}).call();
    setCancelled(true);
  };

  const requestConversion = async (requestedEndDate: Date) => {
    await currencyApi
      .requestCurrencyConversion({
        currency_code: allowedMigrationCode ? allowedMigrationCode : "N/A",
        currency_rate: conversionRate ? conversionRate : 0,
        effective_date: moment(requestedEndDate).format("MM-DD-YYYY"),
      })
      .call();
    await reloadData();
    setCancelled(false);
  };

  if (!loaded) {
    return (
      <LoadingIndicator
        type="spinner"
        size={100}
        className={css(styles.loading)}
      />
    );
  }

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.cardWidth)}>
        <CurrencySettingsCard
          allowedMigration={allowedMigrationCode}
          pendingCurrency={pendingCurrency}
          currentCurrency={currentCurrency}
          startDate={startDate}
          endDate={endDate}
          conversionRate={conversionRate}
          conversionStatus={conversionStatus}
          cancelConversion={cancelConversion}
          requestConversion={requestConversion}
          isPayPal={isPayPal}
          isPayoneer={isPayoneer}
        />
      </div>
      <div className={css(styles.helpWidth)}>
        <CurrencySettingsHelp
          allowedMigration={allowedMigrationCode}
          currentCurrency={currentCurrency}
        />
      </div>
    </div>
  );
};

export default CurrencySettings;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          display: "flex",
          fontFamily: fonts.proxima,
          width: "100%",
        },
        loading: {
          padding: "200px 200px",
          textAlign: "center",
        },
        cardWidth: {
          width: "58.7%",
        },
        helpWidth: {
          width: "40%",
        },
      }),
    []
  );
