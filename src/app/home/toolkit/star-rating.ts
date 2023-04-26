import round from "lodash/round";
import range from "lodash/range";

export type StarType = "FULL" | "HALF" | "EMPTY";
export const ratingToStarTypeArray = (
  rating: number,
): ReadonlyArray<StarType> => {
  const ratingRounded = round(rating * 2) / 2;
  const hasHalfStar = Math.ceil(ratingRounded) - ratingRounded == 0.5;

  return range(1, 6).map((num) => {
    if (num - 1 == Math.floor(ratingRounded) && hasHalfStar) {
      return "HALF";
    }
    return num <= ratingRounded ? "FULL" : "EMPTY";
  });
};
