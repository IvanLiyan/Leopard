import { PaymentCurrencyCode } from "@schema";
import { useUserStore } from "@core/stores/UserStore";
import { useMemo } from "react";
import { useRouter } from "next/router";

export interface CountTableDataItem {
  [x: string]: {
    currencyCode?: string;
    CNY_amount?: number | null | undefined;
    USD_amount?: number | null | undefined;
    amount?: number | null | undefined;
    [x: string]: unknown;
  };
}

export const countTableDataCurrencyAmount = (
  data: ReadonlyArray<CountTableDataItem>,
  keys: string[],
): ReadonlyArray<CountTableDataItem> => {
  if (!data) return [];
  const arr = JSON.parse(JSON.stringify(data)); // deep copy the data so we can add the CNY and USD keys
  return arr.map((item: CountTableDataItem) => {
    keys.forEach((key: string) => {
      if (!item[key]) return;
      const amount = item[key].amount || 0;
      if (item[key].currencyCode === "CNY") {
        item[key].CNY_amount = amount;
        item[key].USD_amount = Number((amount / 7).toFixed(2));
      } else if (item[key].currencyCode === "USD") {
        item[key].USD_amount = amount;
        item[key].CNY_amount = amount * 7;
      }
    });
    return item;
  });
};

export const getOffsetDays = (
  from: Date | null | undefined,
  to: Date | null | undefined,
): number => {
  if (!to || !from) return 0;
  return Math.ceil((to.getTime() - from.getTime()) / (24 * 3600 * 1000));
};

export const useExportCSV = () => {
  const { loggedInMerchantUser } = useUserStore();
  const { merchantId, id, roles } = loggedInMerchantUser || {};
  const isBDUser = Boolean(roles?.find((role) => role.name === "BD"));

  const exportCSV = (params: {
    readonly type: string;
    readonly stats_type: string;
    readonly target_date: number;
    readonly currencyCode?: PaymentCurrencyCode;
  }): void => {
    const { type, target_date, stats_type, currencyCode } = params;
    let queryPath = "";
    if (isBDUser) {
      queryPath = `/stats/bd/weekly/export?target_date=${target_date}&stats_type=${stats_type}&bd_id=${id}`;
    } else {
      queryPath = `/stats/${type}/weekly/export?target_date=${target_date}&stats_type=${stats_type}&merchant_id=${merchantId}&selected_currency=${currencyCode}`;
    }
    location.href = `${window.location.origin}${queryPath}`;
  };
  return exportCSV;
};

export const useDateRange = ({
  recommendValue,
  data,
}: {
  readonly recommendValue: number;
  readonly data: ReadonlyArray<number>;
}): [number, number] => {
  return useMemo(() => {
    const sortedData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
};

type ProductBreakdownURI = {
  readonly weeksFromLatest: number;
  readonly startDate: string;
  readonly endDate: string;
};

export const encodeProductBreakdownURI = ({
  weeksFromLatest,
  startDate,
  endDate,
}: ProductBreakdownURI): string => {
  return `q=${encodeURIComponent(
    JSON.stringify({
      w: weeksFromLatest,
      s: startDate,
      e: endDate,
    }),
  )}`;
};

export const useDecodedProductBreakdownURI = (): {
  [key in keyof ProductBreakdownURI]: ProductBreakdownURI[key] | undefined;
} => {
  const router = useRouter();

  if (typeof router.query.q !== "string") {
    return {
      weeksFromLatest: undefined,
      startDate: undefined,
      endDate: undefined,
    };
  }

  const decodedComponent = JSON.parse(decodeURIComponent(router.query.q));
  const weeksFromLatestAsNumber = Number(decodedComponent.w);
  const weeksFromLatest = isNaN(weeksFromLatestAsNumber)
    ? undefined
    : weeksFromLatestAsNumber;
  const startDate =
    typeof decodedComponent.s === "string" ? decodedComponent.s : undefined;
  const endDate =
    typeof decodedComponent.e === "string" ? decodedComponent.e : undefined;

  return {
    weeksFromLatest,
    startDate,
    endDate,
  };
};
