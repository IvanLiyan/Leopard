import React from "react";
import { observer } from "mobx-react";
import { Radio, RadioProps } from "@mui/material";
import { Card, CardProps, Text, TextProps } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";

export type RadioButtonCardProps = Omit<CardProps, "onClick"> & {
  readonly checked: RadioProps["checked"];
  readonly onChange: CardProps["onChange"];
  readonly text?: TextProps["children"];
  readonly disabled?: boolean;
};

const RadioCard: React.FC<RadioButtonCardProps> = ({
  checked,
  onChange: onCheck,
  text,
  disabled,
  children,
  sx,
  ...props
}) => {
  const { surfaceLighter, secondaryDark, surfaceDarkest, textDark } =
    useTheme();

  return (
    <Card
      onClick={disabled ? undefined : onCheck}
      borderRadius="md"
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        cursor: disabled ? undefined : "pointer",
        padding: checked ? "6px 15px 6px 6px" : "7px 16px 7px 7px",
        borderColor: checked ? secondaryDark : undefined,
        borderWidth: checked ? "2px" : undefined,
        ":hover": {
          borderColor: checked || disabled ? undefined : surfaceDarkest,
        },
        backgroundColor: disabled ? surfaceLighter : undefined,
      }}
      // @ts-ignore mui typing issue, component prop is not being recognized
      component="button"
      {...props}
    >
      <Radio
        disableRipple
        sx={{
          "&&:hover": {
            backgroundColor: "transparent",
          },
        }}
        checked={checked}
        disabled={disabled}
      />
      {text && (
        <Text variant="bodyL" color={disabled ? textDark : undefined}>
          {text}
        </Text>
      )}
      {children}
    </Card>
  );
};

export default observer(RadioCard);
