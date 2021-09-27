import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { TextInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { HorizontalFieldProps } from "@ContextLogic/lego";
import { Validator } from "@toolkit/validators";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CardTitleProps = BaseProps & {
  readonly hasDescription?: boolean;
};

type CardDescriptionProps = BaseProps;

type ReauthTipProps = BaseProps & {
  readonly tipText: string | null | undefined;
};

type ReauthRowProps = HorizontalFieldProps;

type ReauthRowTitleProps = BaseProps;

type ReauthRowValueProps = BaseProps;

type EntityProps = BaseProps;

type EntityTitleProps = BaseProps;

type ReauthTextAreaProps = BaseProps & {
  readonly value?: string | null | undefined;
  readonly placeholder?: string | null | undefined;
  readonly validators?: ReadonlyArray<Validator>;
  readonly onChange: (event: OnTextChangeEvent) => unknown;
};

type UsernameProps = BaseProps & {
  readonly username: string | null | undefined;
};

type MessageTimeProps = BaseProps & {
  readonly messageTime: string | null | undefined;
};

type MessageTitleProps = BaseProps & {
  readonly messageTitle: string | null | undefined;
};

export const CardTitle = (props: CardTitleProps) => {
  const styles = useStyleSheet();
  const { children, hasDescription } = props;
  return (
    <div
      className={css(
        styles.cardTitle,
        hasDescription && styles.cardTitleWithDesctiption
      )}
    >
      {children}
    </div>
  );
};

export const CardDescription = (props: CardDescriptionProps) => {
  const styles = useStyleSheet();
  const { children } = props;
  return <div className={css(styles.cardDescription)}>{children}</div>;
};

export const ReauthTip = (props: ReauthTipProps) => {
  const styles = useStyleSheet();
  const { tipText } = props;
  return <div className={css(styles.tip)}>{tipText}</div>;
};

export const ReauthRow = (props: ReauthRowProps) => {
  const styles = useStyleSheet();
  const { children, ...otherProps } = props;
  return (
    <HorizontalField style={styles.row} {...otherProps}>
      {children}
    </HorizontalField>
  );
};

export const ReauthRowTitle = (props: ReauthRowTitleProps) => {
  const styles = useStyleSheet();
  const { children } = props;
  return <div className={css(styles.rowTitle)}>{children}</div>;
};

export const ReauthRowValue = (props: ReauthRowValueProps) => {
  const styles = useStyleSheet();
  const { children } = props;
  return <div className={css(styles.rowValue)}>{children}</div>;
};

export const Entity = (props: EntityProps) => {
  const styles = useStyleSheet();
  const { children } = props;
  return <div className={css(styles.entity)}>{children}</div>;
};

export const EntityTitle = (props: EntityTitleProps) => {
  const styles = useStyleSheet();
  const { children } = props;
  return <div className={css(styles.entityTitle)}>{children}</div>;
};

export const Separator = () => {
  const styles = useStyleSheet();
  return <div className={css(styles.separator)} />;
};

export const ReauthTextArea = (props: ReauthTextAreaProps) => {
  const styles = useStyleSheet();
  const { value, placeholder, onChange, validators } = props;
  return (
    <TextInput
      style={styles.textArea}
      isTextArea
      value={value}
      rows={4}
      placeholder={placeholder || ""}
      padding={13}
      verticalPadding
      onChange={onChange}
      validators={validators}
    />
  );
};

export const Username = (props: UsernameProps) => {
  const styles = useStyleSheet();
  const { username } = props;
  return <div className={css(styles.username)}>{username}</div>;
};

export const MessageTime = (props: MessageTimeProps) => {
  const styles = useStyleSheet();
  const { messageTime } = props;
  return <div className={css(styles.messageTime)}>{messageTime}</div>;
};

export const MessageTitle = (props: MessageTitleProps) => {
  const styles = useStyleSheet();
  const { messageTitle } = props;
  return <div className={css(styles.messageTitle)}>{messageTitle}</div>;
};

const useStyleSheet = () => {
  const {
    dimenStore: { isSmallScreen },
  } = AppStore.instance();

  return useMemo(
    () =>
      StyleSheet.create({
        cardTitle: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          fontWeight: fonts.weightSemibold,
          lineHeight: "29px",
          margin: "25px 0 28px 26px",
        },
        cardTitleWithDesctiption: {
          margin: "25px 0 8px 26px",
        },
        cardDescription: {
          color: palettes.textColors.Ink,
          fontSize: 17,
          fontWeight: fonts.weightMedium,
          margin: "0 0 28px 26px",
        },
        entity: {
          marginLeft: 27,
        },
        entityTitle: {
          color: palettes.textColors.Ink,
          fontSize: 17,
          fontWeight: fonts.weightSemibold,
          lineHeight: "25px",
        },
        separator: {
          marginTop: 9,
          marginBottom: 9,
          borderBottom: `2px ${palettes.greyScaleColors.DarkGrey} solid`,
          height: 1,
          width: "100%",
        },
        row: {
          marginTop: 17,
          display: "flex",
          ":last-child": {
            marginBottom: 17,
          },
        },
        rowTitle: {
          fontSize: 16,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          lineHeight: 1.5,
          textAlign: !isSmallScreen ? "right" : "center",
        },
        tip: {
          whiteSpace: "pre-wrap",
          fontSize: 12,
          lineHeight: 1.43,
          padding: 8,
          color: palettes.textColors.Ink,
        },
        rowValue: {
          fontSize: 17,
          lineHeight: "25px",
          width: "90%",
          marginRight: 20,
        },
        textArea: {
          width: "100%",
          marginTop: 9,
        },
        username: {
          marginTop: 2,
          marginBottom: 2,
          fontSize: 16,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
        },
        messageTime: {
          fontSize: 14,
          color: palettes.textColors.LightInk,
          fontWeight: fonts.weightSemibold,
          marginBottom: 16,
        },
        messageTitle: {
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
          marginBottom: 16,
          whiteSpace: "pre-wrap",
        },
      }),
    [isSmallScreen]
  );
};
