import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  ErrorText,
  TextInput,
  Layout,
  Text,
  Popover,
  TextInputProps,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";

type PickedTextInputProps = Pick<
  TextInputProps,
  "value" | "onChange" | "placeholder" | "validationResponse" | "validators"
>;

type Props = BaseProps &
  PickedTextInputProps & {
    readonly title: string;
    readonly isValid?: boolean;
    readonly errorMessage?: string;
    readonly onBeginEditing?: () => unknown;
    readonly isOptional?: boolean;
    readonly infoText?: string;
  };

const FormInputRow: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    value,
    onChange,
    isValid,
    errorMessage,
    title,
    placeholder,
    isOptional,
    infoText,
    onBeginEditing,
    validationResponse,
    validators,
  } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      alignItems="stretch"
      justifyContent="flex-start"
      style={[style, className]}
    >
      <Layout.FlexRow justifyContent="space-between">
        <Layout.FlexRow alignItems="center">
          <Text weight="semibold" style={styles.title}>
            {title}
          </Text>
          {infoText && (
            <Popover popoverContent={infoText}>
              <Icon name="info" size={16} style={styles.info} />
            </Popover>
          )}
        </Layout.FlexRow>
        {isOptional && (
          <Text style={styles.optional}>
            {ci18n(
              "Tells the merchant this field is optional to fill out",
              "Optional",
            )}
          </Text>
        )}
      </Layout.FlexRow>
      <Layout.FlexColumn alignItems="stretch">
        <TextInput
          validators={validators}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSelect={() => onBeginEditing && onBeginEditing()}
          validationResponse={validationResponse}
        />
        {!isValid && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textLight, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        info: {
          marginLeft: 8,
        },
        optional: {
          color: textLight,
          fontSize: 11,
        },
        title: {
          marginBottom: 5,
          fontSize: 15,
          color: textDark,
        },
      }),
    [textLight, textDark],
  );
};

export default observer(FormInputRow);
