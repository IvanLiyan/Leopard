/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* External Libraries */
import faker from "faker/locale/en";

/* Lego Components */
import {
  H5,
  H6,
  Accordion,
  Button,
  Markdown,
  HorizontalField,
  TextInput,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { download } from "@assets/icons";
import { RequiredValidator } from "@toolkit/validators";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

import { DEPRECATEDFileInput } from "@merchant/component/core";

/* Merchant Components */
import RPApplicationState from "@merchant/model/policy/restricted-product/RPApplicationState";
import { CountryCodeToWarrantyTemplate } from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RestrictedProductCountryCode } from "@schema/types";

type LegalInformationProps = BaseProps & {
  readonly currentApplication: RPApplicationState;
  readonly suspectedCountry: RestrictedProductCountryCode;
};

const LegalInformation = ({
  style,
  suspectedCountry,
  currentApplication,
}: LegalInformationProps) => {
  const styles = useStylesheet();

  const warrantyTemplate = CountryCodeToWarrantyTemplate[suspectedCountry];

  const navigationStore = useNavigationStore();

  const handleDownload = () => {
    navigationStore.download(warrantyTemplate);
  };

  const [isOpen, setIsOpen] = useState(true);

  const validate = (isValid: boolean | string | null | undefined) => {
    if (!currentApplication.submitLegalInformation || !!isValid) {
      return null;
    }

    return i`This is a required field.`;
  };

  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>Legal Information</H5>
      <Markdown
        style={css(styles.subtitle)}
        text={i`Please provide the information below about your business.`}
      />

      <HorizontalField
        title={i`Name of Legal Representative`}
        popoverContent={i`The name of a legal representative of your business.`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.legalRepName = text;
          }}
          value={currentApplication.legalRepName}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid: boolean) => {
            currentApplication.legalRepNameValid = isValid;
          }}
          validationResponse={validate(currentApplication.legalRepName)}
          placeholder={i`e.g. Michael Smith`}
          debugValue={faker.name.findName()}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Title of Legal Representative`}
        popoverContent={i`The professional title of the legal representative.`}
        style={css(styles.field)}
        centerTitleVertically
        required
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.legalRepTitle = text;
          }}
          value={currentApplication.legalRepTitle}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid: boolean) => {
            currentApplication.legalRepTitleValid = isValid;
          }}
          validationResponse={validate(currentApplication.legalRepTitle)}
          placeholder={i`e.g. Owner`}
          debugValue={faker.name.jobTitle()}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Name of Business Entity (optional)`}
        popoverContent={i`The legal name of your business entity.`}
        style={css(styles.field)}
        centerTitleVertically
      >
        <TextInput
          onChange={({ text }) => {
            currentApplication.businessEntityName = text;
          }}
          value={currentApplication.businessEntityName}
          placeholder={i`e.g. Smith Group, LLC`}
          debugValue={faker.company.companyName()}
        />
      </HorizontalField>

      {currentApplication.warrantySelected && (
        <div>
          <HorizontalField
            title={i`Merchant Warranty Document`}
            popoverContent={
              i`The full text document of the written warranty or ` +
              i`service contract and contact information. [Download template](${warrantyTemplate})`
            }
            style={css(styles.field)}
            required
          >
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              accepts=".jpeg,.jpg,.png,.pdf,.doc,.docx"
              onAttachmentsChanged={(attachments) => {
                currentApplication.document = attachments;
              }}
              attachments={currentApplication.document}
              maxSizeMB={2}
              maxAttachments={1}
            />
          </HorizontalField>
          <Accordion
            header={i`Merchant Warranty Requirements`}
            onOpenToggled={(isOpen) => {
              setIsOpen(isOpen);
            }}
            isOpen={isOpen}
            className={css(styles.accordion)}
          >
            <div className={css(styles.content)}>
              <H6>
                The requirements needed to apply for Merchant Warranties are:
              </H6>
              <ul>
                <li>
                  The full text document of the written warranty or service
                  contract and contact information
                </li>
                <li>
                  {i`Merchant’s warranties are to include:`}
                  <ul>
                    <li>Merchant/Company Name</li>
                    <li>Merchant Contact Information</li>
                    <li>Company’s Physical Address</li>
                    <li>Product’s Warranty/ Service Coverage</li>
                    <li>Product’s Warranty/ Service Length</li>
                    <li>Additional Terms and Agreements</li>
                  </ul>
                </li>
                <li>
                  Statement explaining how to receive a free copy of the written
                  warranty or service contract upon request
                </li>
              </ul>
            </div>
            <div className={css(styles.buttonSection)}>
              <Button onClick={handleDownload}>
                <div className={css(styles.button)}>
                  <img src={download} className={css(styles.icon)} />
                  <Markdown text={i`Merchant Warranty template`} />
                </div>
              </Button>
            </div>
          </Accordion>
        </div>
      )}
    </div>
  );
};
export default observer(LegalInformation);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
        },
        title: {
          marginTop: 8,
        },
        subtitle: {
          marginTop: 8,
        },
        field: {
          margin: "8px 0px",
          width: "calc(100% - 192px)",
          minHeight: 40,
        },
        accordion: {
          marginTop: 24,
          borderTop: `solid 1px ${borderPrimary}`,
        },
        content: {
          padding: "20px 12px 12px 12px",
        },
        buttonSection: {
          display: "flex",
          justifyContent: "space-between",
          alignContent: "stretch",
          alignSelf: "stretch",
          paddingBottom: 24,
          paddingLeft: 12,
        },
        button: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        icon: {
          margin: "0px 6px 0px 0px",
        },
      }),
    [borderPrimary]
  );
};
