import React from "react";
import { observer } from "mobx-react";
import MuiSkeleton, { SkeletonProps } from "@mui/material/Skeleton";
import { useTheme } from "@core/stores/ThemeStore";

const Skeleton = ({ sx: sxProp, ...props }: SkeletonProps) => {
  const { surface } = useTheme();
  const sx = { transform: "none", bgcolor: surface, ...sxProp };
  return <MuiSkeleton sx={sx} {...props} />;
};

export default observer(Skeleton);
