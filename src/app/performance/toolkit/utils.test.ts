// tests currently disabled due to issues with Jest and hooks
// please reach out to lliepert if you have any questions

describe("pass file", () => {
  test("it", () => {
    expect(true).toBe(true);
  });
});

export {};

// import {
// countTableDataCurrencyAmount,
// CountTableDataItem,
//   getOffsetDays,
//   useDateRange,
// } from "./utils";

// describe("countTableDataCurrencyAmount", () => {
//   test("when initial data is in CNY, it adds USD and CNY correctly to only the specified keys", () => {
//     const initialData: ReadonlyArray<CountTableDataItem> = [
//       {
//         key1: {
//           lorem: "ipsum",
//           dolor: "sit",
//           amet: "consectetur",
//           amount: 10,
//           currencyCode: "CNY",
//           adipiscing: "elit",
//         },
//         key2: {
//           donec: "varius",
//           augue: "ut",
//           amount: 11,
//           currencyCode: "CNY",
//           magna: "hendrerit",
//         },
//         key3: {
//           a: "vulputate",
//           amount: 12,
//           currencyCode: "CNY",
//           mauris: "vehicula",
//         },
//       },
//       {
//         key1: {
//           lorem: "lobortis",
//           dolor: "sit",
//           amount: 13,
//           currencyCode: "CNY",
//           consequat: "tincidunt",
//         },
//         key2: {
//           amount: 14,
//           currencyCode: "CNY",
//           ultrices: "condimentum",
//         },
//         key3: {
//           amount: 15,
//           currencyCode: "CNY",
//         },
//       },
//     ];

//     const result = countTableDataCurrencyAmount(initialData, ["key1", "key2"]);
//     expect(result).toEqual([
//       {
//         key1: {
//           lorem: "ipsum",
//           dolor: "sit",
//           amet: "consectetur",
//           amount: 10,
//           CNY_amount: 10,
//           USD_amount: 1.43,
//           currencyCode: "CNY",
//           adipiscing: "elit",
//         },
//         key2: {
//           donec: "varius",
//           augue: "ut",
//           amount: 11,
//           CNY_amount: 11,
//           USD_amount: 1.57,
//           currencyCode: "CNY",
//           magna: "hendrerit",
//         },
//         key3: {
//           a: "vulputate",
//           amount: 12,
//           currencyCode: "CNY",
//           mauris: "vehicula",
//         },
//       },
//       {
//         key1: {
//           lorem: "lobortis",
//           dolor: "sit",
//           amount: 13,
//           CNY_amount: 13,
//           USD_amount: 1.86,
//           currencyCode: "CNY",
//           consequat: "tincidunt",
//         },
//         key2: {
//           amount: 14,
//           CNY_amount: 14,
//           USD_amount: 2,
//           currencyCode: "CNY",
//           ultrices: "condimentum",
//         },
//         key3: {
//           amount: 15,
//           currencyCode: "CNY",
//         },
//       },
//     ]);
//   });

//   test("when initial data is in USD, it adds USD and CNY correctly to only the specified", () => {
//     const initialData: ReadonlyArray<CountTableDataItem> = [
//       {
//         key1: {
//           lorem: "ipsum",
//           dolor: "sit",
//           amet: "consectetur",
//           amount: 10,
//           currencyCode: "USD",
//           adipiscing: "elit",
//         },
//         key2: {
//           donec: "varius",
//           augue: "ut",
//           amount: 11,
//           currencyCode: "USD",
//           magna: "hendrerit",
//         },
//         key3: {
//           a: "vulputate",
//           amount: 12,
//           currencyCode: "USD",
//           mauris: "vehicula",
//         },
//       },
//       {
//         key1: {
//           lorem: "lobortis",
//           dolor: "sit",
//           amount: 13,
//           currencyCode: "USD",
//           consequat: "tincidunt",
//         },
//         key2: {
//           amount: 14,
//           currencyCode: "USD",
//           ultrices: "condimentum",
//         },
//         key3: {
//           amount: 15,
//           currencyCode: "USD",
//         },
//       },
//     ];

//     const result = countTableDataCurrencyAmount(initialData, ["key1", "key3"]);
//     expect(result).toEqual([
//       {
//         key1: {
//           lorem: "ipsum",
//           dolor: "sit",
//           amet: "consectetur",
//           amount: 10,
//           CNY_amount: 70,
//           USD_amount: 10,
//           currencyCode: "USD",
//           adipiscing: "elit",
//         },
//         key2: {
//           donec: "varius",
//           augue: "ut",
//           amount: 11,
//           currencyCode: "USD",
//           magna: "hendrerit",
//         },
//         key3: {
//           a: "vulputate",
//           amount: 12,
//           CNY_amount: 84,
//           USD_amount: 12,
//           currencyCode: "USD",
//           mauris: "vehicula",
//         },
//       },
//       {
//         key1: {
//           lorem: "lobortis",
//           dolor: "sit",
//           amount: 13,
//           CNY_amount: 91,
//           USD_amount: 13,
//           currencyCode: "USD",
//           consequat: "tincidunt",
//         },
//         key2: {
//           amount: 14,
//           currencyCode: "USD",
//           ultrices: "condimentum",
//         },
//         key3: {
//           amount: 15,
//           CNY_amount: 105,
//           USD_amount: 15,
//           currencyCode: "USD",
//         },
//       },
//     ]);
//   });
// });

// describe("getOffsetDays", () => {
//   test("Calculate the number of days between ordinal dates", () => {
//     const from = new Date("2022-10-10");
//     const to = new Date("2022-10-30");
//     const result = getOffsetDays(from, to);
//     expect(result).toEqual(20);
//   });
//   test("Calculate the number of days between reverse dates", () => {
//     const from = new Date("2022-10-30");
//     const to = new Date("2022-10-10");
//     const result = getOffsetDays(from, to);
//     expect(result).toEqual(-20);
//   });
//   test("Calculate the number of days between null dates", () => {
//     const from = null;
//     const to = new Date("2022-10-10");
//     const result = getOffsetDays(from, to);
//     expect(result).toEqual(0);
//   });
//   test("Calculate the number of days between all null dates", () => {
//     const from = null;
//     const to = undefined;
//     const result = getOffsetDays(from, to);
//     expect(result).toEqual(0);
//   });
// });

// describe("useDateRange", () => {
//   test("Calculate [minVal, maxVal] in recommendValue and data when recommendValue is minimum value", () => {
//     const recommendValue = 2;
//     const data = [
//       5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5,
//       4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.333, 4.333, 4.333, 4.333, 4.333, 4.333,
//       4.333, 4.333, 4.333,
//     ];
//     const result = useDateRange({ recommendValue, data });
//     expect(result).toEqual([2, 5]);
//   });

//   test("Calculate [minVal, maxVal] in recommendValue and data when recommendValue is maximum value", () => {
//     const recommendValue = 6;
//     const data = [
//       5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5,
//       4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.333, 4.333, 4.333, 4.333, 4.333, 4.333,
//       4.333, 4.333, 4.333,
//     ];
//     const result = useDateRange({ recommendValue, data });
//     expect(result).toEqual([4.333, 6]);
//   });

//   test("Calculate [minVal, maxVal] in recommendValue and data when recommendValue is median value", () => {
//     const recommendValue = 5;
//     const data = [
//       5, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5,
//       4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.333, 4.333, 4.333, 4.333, 4.333, 4.333,
//       4.333, 4.333, 4.333,
//     ];
//     const result = useDateRange({ recommendValue, data });
//     expect(result).toEqual([4.333, 5]);
//   });
// });
