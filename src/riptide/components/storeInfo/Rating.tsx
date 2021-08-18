import React from "react";
import { Icon } from "@ContextLogic/zeus";

import { useTheme } from "@riptide/toolkit/theme";

export type Props = {
  readonly rating: number;
};

type StarProps = {
  readonly key: number;
};

const Rating: React.FC<Props> = ({ rating: ratingProp }: Props) => {
  const { textLight } = useTheme();
  const rating = Math.round(ratingProp * 2) / 2;
  const numFullStars = Math.floor(rating);
  const numHalfStars = (rating - numFullStars) * 2;

  const commonProps = {
    style: { verticalAlign: "top" },
    size: 14,
    colors: { color1: textLight },
  };

  const HalfStar: React.FC<StarProps> = ({ key }: StarProps) => {
    return <Icon key={key} name="halfStar" {...commonProps} />;
  };

  const FullStar: React.FC<StarProps> = ({ key }: StarProps) => {
    return <Icon key={key} name="starFilled" {...commonProps} />;
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
