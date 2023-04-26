import { ratingToStarTypeArray } from "./star-rating";

describe("Star rating array computed from a number rating between one and five", () => {
  it("Returns all empty stars for rating of 0", () => {
    expect(ratingToStarTypeArray(0)).toEqual([
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns all empty stars for rating of 0.2", () => {
    expect(ratingToStarTypeArray(0.2)).toEqual([
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns one half star for rating of 0.3", () => {
    expect(ratingToStarTypeArray(0.3)).toEqual([
      "HALF",
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns one half star for rating of 0.6", () => {
    expect(ratingToStarTypeArray(0.6)).toEqual([
      "HALF",
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns one full star for rating of 0.8", () => {
    expect(ratingToStarTypeArray(0.8)).toEqual([
      "FULL",
      "EMPTY",
      "EMPTY",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns three full stars for rating of 3", () => {
    expect(ratingToStarTypeArray(3)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns three full stars for rating of 3.23", () => {
    expect(ratingToStarTypeArray(3.23)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "EMPTY",
      "EMPTY",
    ]);
  });

  it("Returns three full stars and a half for rating of 3.27", () => {
    expect(ratingToStarTypeArray(3.27)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "HALF",
      "EMPTY",
    ]);
  });

  it("Returns three full stars and a half for rating of 3.62", () => {
    expect(ratingToStarTypeArray(3.62)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "HALF",
      "EMPTY",
    ]);
  });

  it("Returns four full stars and a half for rating of 4.5", () => {
    expect(ratingToStarTypeArray(4.5)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "FULL",
      "HALF",
    ]);
  });

  it("Returns four full stars and a half for rating of 4.7", () => {
    expect(ratingToStarTypeArray(4.7)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "FULL",
      "HALF",
    ]);
  });

  it("Returns five full stars for rating of 4.75", () => {
    expect(ratingToStarTypeArray(4.75)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "FULL",
      "FULL",
    ]);
  });

  it("Returns five full stars for rating of 5", () => {
    expect(ratingToStarTypeArray(5)).toEqual([
      "FULL",
      "FULL",
      "FULL",
      "FULL",
      "FULL",
    ]);
  });
});
