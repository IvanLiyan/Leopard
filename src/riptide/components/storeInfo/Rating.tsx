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

  const commonProps = {
    style: { verticalAlign: "top" },
    size: 14,
    colors: { color1: textLight },
  };

  const HalfStar: React.FC = () => {
    return <Icon name="halfStar" {...commonProps} />;
  };

  const FullStar: React.FC = () => {
    return <Icon name="starFilled" {...commonProps} />;
  };

  const fullStars =
    numFullStars !== 0
      ? new Array(numFullStars).fill(null).map((_, i) => <FullStar key={i} />)
      : null;
  const halfStars =
    numHalfStars !== 0
      ? new Array(numHalfStars).fill(null).map((_, i) => <HalfStar key={i} />)
      : null;

  return (
    <>
      {fullStars}
      {halfStars}
    </>
  );
};

export default Rating;
