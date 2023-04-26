import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import hash from "object-hash";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import { css } from "@core/toolkit/styling";
import { StarType, ratingToStarTypeArray } from "@home/toolkit/star-rating";

type Props = BaseProps & {
  readonly ratingValue: number;
};

const StarTypeToIllustration: { readonly [T in StarType]: IllustrationName } = {
  FULL: "starFilled",
  HALF: "starHalfFilled",
  EMPTY: "starUnfilled",
};

const StarRating = (props: Props) => {
  const { className, style, ratingValue } = props;
  const styles = useStylesheet();

  const stars: ReadonlyArray<StarType> = useMemo(
    () => ratingToStarTypeArray(ratingValue),
    [ratingValue],
  );

  const starTypeToAltText: { readonly [T in StarType]: string } = {
    FULL: i`Full star`,
    HALF: i`Half star`,
    EMPTY: i`Empty star`,
  };

  return (
    <div className={css(styles.stars, className, style)}>
      {stars.map((starType, index) => (
        <Illustration
          key={hash(`${index}-${starType}`)}
          name={StarTypeToIllustration[starType]}
          alt={starTypeToAltText[starType]}
          className={css(styles.star)}
        />
      ))}
    </div>
  );
};

export default StarRating;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        stars: {
          display: "flex",
        },
        star: {
          height: 13,
        },
      }),
    [],
  );
};
