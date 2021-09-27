/*
 * InlineEdit.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput, TextInputProps } from "@ContextLogic/lego";
import { KEYCODE_ESCAPE } from "@toolkit/dom";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator } from "@toolkit/validators";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly placeholder?: string;
  readonly initialValue?: string;
  readonly isLoading?: boolean;
  readonly validators?: TextInputProps["validators"];
  readonly onSave: (newValue: string) => unknown;
  readonly onCancel: () => unknown;
};

const InlineEdit: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    placeholder,
    initialValue,
    isLoading,
    onSave,
    onCancel,
    validators,
  } = props;
  const styles = useStylesheet(props);
  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState(false);

  return (
    <div className={css(styles.root, className, style)}>
      <TextInput
        inputContainerStyle={css(styles.textInput)}
        placeholder={placeholder}
        value={value}
        onChange={({ text }) => {
          setValue(text);
        }}
        validators={validators || [new RequiredValidator()]}
        onValidityChanged={(isValid) => {
          setValid(isValid);
        }}
        onKeyUp={(keyCode) => {
          if (keyCode == KEYCODE_ESCAPE) {
            onCancel();
          }
        }}
        renderBlankError
        focusOnMount
      />
      <div className={css(styles.buttonContainer)}>
        <PrimaryButton
          popoverStyle={css(styles.primaryButton)}
          style={{ flex: 1 }}
          onClick={() => {
            onSave(value || ""); // NOTE: will be disabled if value is null
          }}
          isDisabled={!valid}
          isLoading={isLoading}
        >
          Save
        </PrimaryButton>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default observer(InlineEdit);

const useStylesheet = (props: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        },
        textInput: {
          height: 40,
          minWidth: 250,
        },
        primaryButton: {
          display: "flex",
          alignItems: "stretch",
          height: 42,
          minWidth: 160,
          margin: "0px 10px",
        },
        button: {
          height: 42,
          minWidth: 160,
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    []
  );
};
