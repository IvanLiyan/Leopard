// This diff is working with currencies directly, handle ad-hoc
//

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { RichTextBanner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import { ConversionStatus } from "./CurrencyCodeDisplay";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencyUpdateProgressBannerProps = BaseProps & {
  readonly conversionStatus: ConversionStatus;
  readonly pendingCurrencyDisplay: string;
  readonly endDateDisplay: string;
};

export const CurrencyUpdateProgressBanner = (
  props: CurrencyUpdateProgressBannerProps
) => {
  const styles = useStylesheet();
  const { conversionStatus, pendingCurrencyDisplay, endDateDisplay } = props;

  return (
    <>
      {conversionStatus === "CANCELLED" && (
        <RichTextBanner
          sentiment="info"
          title={i`Your currency conversion to ${pendingCurrencyDisplay} was cancelled.`}
          description={
            i`Your product prices, shipping prices, and payments have been reverted ` +
            i`back to USD ($).`
          }
          contentAlignment="left"
          className={css(styles.progressBanner)}
        />
      )}
      {conversionStatus === "COMPLETED" && (
        <RichTextBanner
          sentiment="success"
          title={i`Success! Your store's Local Currency Code is now updated and set to ${pendingCurrencyDisplay}.`}
          description={
            i`Your product prices, shipping prices, and payments will be ` +
            i`automatically converted to ${pendingCurrencyDisplay} based on the ` +
            i`average 30-day conversion rate listed below.`
          }
          contentAlignment="left"
          className={css(styles.progressBanner)}
        />
      )}
      {conversionStatus === "PENDING" && (
        <RichTextBanner
          sentiment="info"
          title={i`Your currency conversion to ${pendingCurrencyDisplay} is in progress!`}
          description={i`Effective on ${endDateDisplay}, your Currency Settings will be using ${pendingCurrencyDisplay}.`}
          contentAlignment="left"
          className={css(styles.progressBanner)}
        />
      )}
    </>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        progressBanner: {
          padding: "6px 0px",
          fontSize: 16,
        },
      }),
    []
  );
