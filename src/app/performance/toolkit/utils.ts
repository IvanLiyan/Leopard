import { UserSchema, PaymentCurrencyCode } from "@schema";

export function exportCSV(params: {
  readonly type: string;
  readonly stats_type: string;
  readonly id: UserSchema["id" | "merchantId"];
  readonly isBDUser: boolean;
  readonly target_date: number;
  readonly currencyCode?: PaymentCurrencyCode;
}): void {
  const { type, id, isBDUser, target_date, stats_type, currencyCode } = params;
  let queryPath = "";
  if (isBDUser) {
    queryPath = `/stats/bd/weekly/export?target_date=${target_date}&stats_type=${stats_type}&bd_id=${id}`;
  } else {
    queryPath = `/stats/${type}/weekly/export?target_date=${target_date}&stats_type=${stats_type}&merchant_id=${id}&selected_currency=${currencyCode}`;
  }
  location.href = `${window.location.origin}${queryPath}`;
}

export function isBD(roles: ReadonlyArray<{ readonly name: string }>): boolean {
  return Boolean(roles.find((role) => role.name === "BD"));
}

export interface CountTableDataItem {
  [x: string]: {
    currencyCode?: string;
    CNY_amount?: number | null | undefined;
    USD_amount?: number | null | undefined;
    amount?: number | null | undefined;
    [x: string]: unknown;
  };
}

export type AugmentedPrice = {
  readonly CNY_amount?: number;
  readonly USD_amount?: number;
};

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

export function getOffsetDays(
  from: Date | null | undefined,
  to: Date | null | undefined,
): number {
  if (!to || !from) return 0;
  return Math.round((to.getTime() - from.getTime()) / (24 * 3600 * 1000));
}
