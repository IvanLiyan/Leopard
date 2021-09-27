import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { HorizontalField, TitleAlignment } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import { getAuthTypeDisplay } from "./ABSBApplicationAuthTypeDisplay";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplication } from "@toolkit/brand/branded-products/abs";

export type ABSBApplicationDetailAccordionProps = BaseProps & {
  readonly application: ABSBApplication;
};

const ABSBApplicationDetailAccordion = ({
  application,
}: ABSBApplicationDetailAccordionProps) => {
  const styles = useStylesheet();
  const [isOpen, setIsOpen] = useState(false);

  const baseFieldProps = {
    titleStyle: styles.header,
    titleWidth: 250,
    titleAlign: "start" as TitleAlignment,
  };

  const fieldProps = {
    style: styles.field,
    centerTitleVertically: true,
    ...baseFieldProps,
  };

  return (
    <Accordion
      header={i`Information provided on application`}
      isOpen={isOpen}
      onOpenToggled={(isOpen) => {
        setIsOpen(isOpen);
      }}
      chevronSize={11}
      headerContainerStyle={styles.accordionHeader}
    >
      <HorizontalField title={i`Authorization type`} {...fieldProps}>
        <div>{getAuthTypeDisplay(application.authorization_type)}</div>
      </HorizontalField>

      <HorizontalField title={i`Your document(s)`} {...fieldProps}>
        {application.auth_docs &&
          application.auth_docs.map((doc) => (
            <Link
              key={doc.display_filename}
              href={doc.url}
              openInNewTab
              download
            >
              {doc.display_filename}
            </Link>
          ))}
      </HorizontalField>

      <HorizontalField
        title={i`Region(s) listed on document(s)`}
        {...fieldProps}
      >
        <div>
          {application.provided_countries
            .map((cc) => getCountryName(cc))
            .join(", ")}
        </div>
      </HorizontalField>

      <HorizontalField title={i`Brand owner`} {...fieldProps}>
        <div>{application.brand_owner_name}</div>
      </HorizontalField>

      <HorizontalField
        title={i`Brand representative`}
        style={[styles.field, styles.lastField]}
        {...baseFieldProps}
      >
        <div>{application.brand_rep_name}</div>
        <div>{application.brand_rep_title}</div>
        <div>{application.brand_rep_phone}</div>
        <div>{application.brand_rep_email}</div>
      </HorizontalField>
    </Accordion>
  );
};

export default observer(ABSBApplicationDetailAccordion);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        field: {
          display: "flex",
          alignItems: "center",
          width: "100%",
          minHeight: 40,
        },
        header: {
          marginLeft: 24,
          fontWeight: fonts.weightSemibold,
          color: textBlack,
        },
        lastField: {
          marginBottom: 16,
        },
        accordionHeader: {
          fontSize: 16,
        },
      }),
    [textBlack]
  );
};
