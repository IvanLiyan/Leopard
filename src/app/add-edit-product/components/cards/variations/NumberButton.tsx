/*
 * NumberButton.tsx
 *
 * Created by Jonah Dlin on Tue Oct 26 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Button, Layout, TextInputProps, TextInput } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

const NumberButton: React.FC<
  BaseProps &
    Omit<TextInputProps, "onChange" | "value" | "onSubmit"> & {
      readonly onSubmit: (value: number | null | undefined) => unknown;
      readonly buttonText: string;
    }
> = ({
  buttonText,
  onSubmit,
  style,
  className,
  // inputContainerStyle is overriden
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputContainerStyle,
  "data-cy": dataCy,
  ...otherProps
}) => {
  const { borderPrimary } = useTheme();
  const styles = useStylesheet();
  const [value, setValue] = useState<number | null | undefined>();

  return (
    <Layout.FlexRow style={[style, className]}>
      <TextInput
        value={value}
        onChange={({ textAsNumber }) => setValue(textAsNumber)}
        type="number"
        hideBorder
        inputContainerStyle={{
          border: `1px solid ${borderPrimary}`,
          borderRadius: "4px 0px 0px 4px",
          maxWidth: 84,
          height: 42,
          boxSizing: "border-box",
        }}
        data-cy={`${dataCy}-input-number`}
        {...otherProps}
      />
      <Button
        onClick={() => onSubmit(value)}
        style={styles.button}
        data-cy={`${dataCy}-button`}
      >
        {buttonText}
      </Button>
    </Layout.FlexRow>
  );
};

export default observer(NumberButton);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          borderRadius: "0px 4px 4px 0px",
          borderLeft: 0,
          height: 42,
          boxShadow: "none",
        },
      }),
    [],
  );
};
