import React, { forwardRef } from "react";
import MuiStepLabel, {
  StepLabelProps as MuiStepLabelProps,
} from "@mui/material/StepLabel";
import { useTheme } from "@core/stores/ThemeStore";
import { StepIconProps } from "@mui/material/StepIcon";
import { Components, Theme } from "@mui/material";

export const DefaultStepIcon = (props: StepIconProps) => {
  const { icon } = props;
  const { surfaceDarkest, textWhite } = useTheme();

  return (
    <div className="circle-icon">
      <div className="icon-text">{icon}</div>
      <style jsx>{`
        .circle-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: ${surfaceDarkest};
          line-height: 24px;
          text-align: center;
          border: 2px solid ${textWhite};
          box-shadow: 0 0 0 2px ${surfaceDarkest};
        }
        .icon-text {
          color: ${textWhite};
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

// TODO: the defaultProps override is not working here, so we still have to specify StepIconComponent prop inline
export const StepLabelTheme: Components<
  Omit<Theme, "components">
>["MuiStepLabel"] = {
  defaultProps: {
    StepIconComponent: DefaultStepIcon,
  },
};

export type StepLabelProps = MuiStepLabelProps;

const StepLabel: React.FC<StepLabelProps> = forwardRef(
  ({ StepIconComponent = DefaultStepIcon, ...rest }, ref) => {
    return (
      <MuiStepLabel ref={ref} StepIconComponent={StepIconComponent} {...rest} />
    );
  },
);

StepLabel.displayName = "StepLabel";

export default StepLabel;
