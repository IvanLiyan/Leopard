import React from "react";
import { Icon } from "@ContextLogic/zeus";

import { useTheme } from "@riptide/toolkit/theme";
import { useStorefrontState } from "@toolkit/context/storefront-state";

const Rating: React.FC = () => {
  const { textLight } = useTheme();
  const { averageRating } = useStorefrontState();

  const rating = Math.round(averageRating * 2) / 2;
  const numFullStars = Math.floor(rating);
  const numHalfStars = (rating - numFullStars) * 2;
  const numEmptyStars = 5 - numFullStars - numHalfStars;

  const commonProps = {
    style: { verticalAlign: "top" },
    size: 14,
    colors: { color1: textLight },
  };

  const FullStar: React.FC = () => {
    return <Icon name="starFilled" {...commonProps} />;
  };

  const HalfStar: React.FC = () => {
    return <Icon name="halfStar" {...commonProps} />;
  };

  const EmptyStar: React.FC = () => {
    return <Icon name="star" {...commonProps} />;
  };

  const fullStars =
    numFullStars !== 0
      ? new Array(numFullStars).fill(null).map((_, i) => <FullStar key={i} />)
      : null;
  const halfStars =
    numHalfStars !== 0
      ? new Array(numHalfStars).fill(null).map((_, i) => <HalfStar key={i} />)
      : null;
  const emptyStars =
    numEmptyStars !== 0
      ? new Array(numEmptyStars).fill(null).map((_, i) => <EmptyStar key={i} />)
      : null;

  return (
    <>
      {fullStars}
      {halfStars}
      {emptyStars}
    </>
  );
};

export default Rating;
