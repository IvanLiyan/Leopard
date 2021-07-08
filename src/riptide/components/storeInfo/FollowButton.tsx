import React from "react";
import Button, { Props as ButtonProps } from "@riptide/components/core/Button";
import Text from "@riptide/components/core/Text";

export type Props = Omit<ButtonProps, "children"> & {
  readonly isFollowing: boolean;
};

const FollowButton: React.FC<Props> = ({ isFollowing, ...rest }: Props) => {
  return (
    <Button {...rest}>
      <Text color="INHERIT">{isFollowing ? "Following" : "Follow"}</Text>
    </Button>
  );
};

export default FollowButton;
