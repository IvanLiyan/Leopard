import React from "react";
import { observer } from "mobx-react";
import { Radio, RadioProps } from "@mui/material";
import { Card, CardProps, Text, TextProps } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";

export type RadioButtonCardProps = Omit<CardProps, "onClick"> & {
  readonly checked: RadioProps["checked"];
  readonly onChange: CardProps["onChange"];
  readonly text?: TextProps["children"];
};

const RadioCard: React.FC<RadioButtonCardProps> = ({
  checked,
  onChange: onCheck,
  text,
  children,
  sx,
  ...props
}) => {
  const { secondaryDark, surfaceDarkest } = useTheme();

  return (
    <Card
      onClick={onCheck}
      borderRadius="md"
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        cursor: "pointer",
        padding: checked ? "6px 15px 6px 6px" : "7px 16px 7px 7px",
        borderColor: checked ? secondaryDark : undefined,
        borderWidth: checked ? "2px" : undefined,
        ":hover": {
          borderColor: checked ? undefined : surfaceDarkest,
        },
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
      />
      {text && <Text variant="bodyL">{text}</Text>}
      {children}
    </Card>
  );
};

export default observer(RadioCard);
