import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import hash from "object-hash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Imports */
import { Illustration, IllustrationName } from "@merchant/component/core";

type Props = BaseProps & {
  readonly ratingValue: number;
};

const StarRating = (props: Props) => {
  const { className, style, ratingValue } = props;
  const styles = useStylesheet();

  const starIllustList = useMemo(() => {
    let stars = [] as Array<IllustrationName>;
    const rating = Math.round(ratingValue * 10) / 10;
    const numFullStars = Math.floor(rating);

    stars = [
      ...stars,
      ...Array.from(Array(numFullStars).keys()).map(
        () => "starFilled" as IllustrationName
      ),
    ];

    if (numFullStars < 5) {
      const notWholeNumber = rating % 1 !== 0;
      const remainingStars = notWholeNumber
        ? 5 - numFullStars - 1
        : 5 - numFullStars;

      if (notWholeNumber) stars = [...stars, "starHalfFilled"];
      stars = [
        ...stars,
        ...Array.from(Array(remainingStars).keys()).map(
          () => "starUnfilled" as IllustrationName
        ),
      ];
    }

    return stars;
  }, [ratingValue]);

  return (
    <div className={css(styles.stars, className, style)}>
      {starIllustList.map((starIllust, index) => (
        <Illustration
          key={hash(`${index}-${starIllust}`)}
          name={starIllust}
          alt="star"
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
    []
  );
};
