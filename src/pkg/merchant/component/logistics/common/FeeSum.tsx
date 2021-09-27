import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { useRequest } from "@toolkit/api";

import { paymentIcon } from "@assets/illustrations";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import { getFeeSum } from "@merchant/api/fbw";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import type { GetFBWFeesParams, ProductType } from "@merchant/api/fbw";

export type FeeSumProp = BaseProps & {
  readonly productType: ProductType;
  readonly queryParams: GetFBWFeesParams;
};

const formatCurrencyString = (feeSumCurrencyDict: {
  [key: string]: number;
}) => {
  const formattedString = Array.from(
    Object.keys(feeSumCurrencyDict),
    (currency) => {
      return formatCurrency(feeSumCurrencyDict[currency], currency);
    }
  ).join(", ");
  return formattedString || "0";
};

const FeeSum = (props: FeeSumProp) => {
  const { productType, queryParams } = props;
  const [getAllFeeSumResult] = useRequest(
    getFeeSum({ product_type: productType })
  );
  const [getFilteredFeeSumResult] = useRequest(getFeeSum(queryParams));
  const totalSumDict = getAllFeeSumResult?.data?.currency_amount_dict;
  const filteredSumDict = getFilteredFeeSumResult?.data?.currency_amount_dict;
  const totalFeeSum = totalSumDict
    ? formatCurrencyString(totalSumDict)
    : i`Calculating...`;
  const filteredFeeSum = filteredSumDict
    ? formatCurrencyString(filteredSumDict)
    : i`Calculating...`;

  const styles = useStyleSheet();
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.box)}>
        <img src={paymentIcon} alt="icon" draggable={false} />
        <div className={css(styles.messageBox)}>
          <div>Total unpaid fees</div>
          <div className={css(styles.message)}>{totalFeeSum}</div>
        </div>
      </div>
      {Object.keys(queryParams).some((item) =>
        ["fee_types", "fee_statuses", "start_date", "end_date"].includes(item)
      ) && (
        <div className={css(styles.box)}>
          <img src={paymentIcon} alt="icon" draggable={false} />
          <div className={css(styles.messageBox)}>
            <div>Filtered unpaid fees</div>
            <div className={css(styles.message)}>{filteredFeeSum}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(FeeSum);

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          padding: "10px",
        },
        messageBox: {
          display: "flex",
          flexDirection: "column",
          marginLeft: 20,
        },
        message: {
          fontWeight: fonts.weightMedium,
        },
        box: {
          display: "flex",
          flexDirection: "row",
          border: "1px rgba(175, 199, 209, 0.5) solid",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "2px 4px 0 rgba(175, 199, 209, 0.2)",
          margin: "0px 5px",
        },
      }),
    []
  );
