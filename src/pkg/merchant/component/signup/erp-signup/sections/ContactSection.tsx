import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { EmailInput, TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes, black } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";
import { BaseSectionProps } from "./SectionWrapper";

const ContactSection = (props: BaseSectionProps) => {
  const styles = useStylesheet();
  const { state, className } = props;
  const { requiredValidator, isFromCN } = state;

  return (
    <div className={css(className)}>
      <div className={css(styles.subtitle)}>
        <div className={css(styles.bold)}>Technical Contact</div>
        <p>Will be used by Wish regarding urgent fixes, API updates, etc.</p>
      </div>
      <HorizontalField
        className={css(styles.field)}
        title={i`Name`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.technicalContact.name}
          onChange={({ text }) => {
            state.technicalContact.name = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Job Title`}
        titleWidth={240}
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.technicalContact.jobTitle}
          onChange={({ text }) => {
            state.technicalContact.jobTitle = text;
          }}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Phone Number`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.technicalContact.phoneNumber}
          onChange={({ text }) => {
            state.technicalContact.phoneNumber = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Email`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <EmailInput
          className={css(styles.textInput)}
          value={state.technicalContact.email}
          onChange={({ text }) => {
            state.technicalContact.email = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      {isFromCN && (
        <HorizontalField
          className={css(styles.field)}
          title={i`Wechat`}
          titleWidth={240}
          centerTitleVertically
        >
          <TextInput
            className={css(styles.textInput)}
            value={state.technicalContact.wechat}
            onChange={({ text }) => {
              state.technicalContact.wechat = text;
            }}
          />
        </HorizontalField>
      )}
    </div>
  );
};
export default observer(ContactSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        bold: {
          fontWeight: weightBold,
        },
        horizontalLine: {
          borderRadius: 4,
          border: "solid 1px rgba(196, 205, 213, 0.5)",
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          marginTop: 27,
        },
        field: {
          marginTop: 24,
        },
        textInput: {
          flex: 1,
          maxWidth: 648,
        },
        subtitle: {
          fontSize: 16,
          color: black,
          paddingTop: 16,
        },
      }),
    [],
  );
