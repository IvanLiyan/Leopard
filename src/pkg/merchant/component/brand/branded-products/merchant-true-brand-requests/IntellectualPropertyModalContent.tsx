import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Field } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { H6 } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator, UrlValidator } from "@toolkit/validators";

/* Relative Imports */
import TrademarkTypeSelect from "./TrademarkTypeSelect";
import TrademarkOfficeSelect from "./TrademarkOfficeSelect";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TrademarkCountryCode } from "@schema/types";
import { MerchantTrueBrandRequestObject } from "@merchant/api/brand/true-brands";
import IntellectualPropertyInfoState from "@merchant/model/brand/branded-products/IntellectualPropertyInfoState";

export type IntellectualPropertyModalProps = BaseProps & {
  readonly request: MerchantTrueBrandRequestObject;
  readonly acceptedTrademarkCountries: ReadonlyArray<TrademarkCountryCode>;
};

type IntellectualPropertyModalContentProps = IntellectualPropertyModalProps & {
  readonly closeModal: () => unknown;
};

const IntellectualPropertyModalContent = ({
  request,
  closeModal,
  acceptedTrademarkCountries,
}: IntellectualPropertyModalContentProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { surfaceLight } = useTheme();
  const [intellectualPropertyInfo] = useState<IntellectualPropertyInfoState>(
    new IntellectualPropertyInfoState(request.id)
  );

  if (intellectualPropertyInfo.submitted) {
    if (intellectualPropertyInfo.submitSucceeded) {
      toastStore.positive(
        i`Intellectual property information successfully added!`
      );
      closeModal();
      navigationStore.reload();
    } else {
      toastStore.negative(
        i`Sorry, we were unable to add the intellectual property information.`
      );
    }
  }

  const renderPopoverTitle = (titleText: string, popoverContent: string) => (
    <div className={css(styles.titleWithPopover)}>
      {titleText}
      <Info className={css(styles.info)} popoverContent={popoverContent} />
    </div>
  );

  return (
    <div className={css(styles.modal)}>
      <H6>Please provide the trademark for this brand.</H6>
      <div className={css(styles.field, styles.row)}>
        <Field title={i`Trademark type`} className={css(styles.halfField)}>
          <TrademarkTypeSelect
            onSelected={(value) => {
              intellectualPropertyInfo.trademarkType = value;
            }}
            selectedValue={intellectualPropertyInfo.trademarkType}
          />
        </Field>
        <Field title={i`Trademark name`} className={css(styles.halfField)}>
          <TextInput value={request.brand_name} disabled />
        </Field>
      </div>
      <Field
        title={() =>
          renderPopoverTitle(
            i`Trademark registration number`,
            i`Enter the trademark registration number provided by the ` +
              i`government trademark office. Please note that trademark ` +
              i`application numbers are not accepted.`
          )
        }
        className={css(styles.field)}
      >
        <TextInput
          placeholder={i`Enter the trademark registration number provided by the trademark office`}
          onChange={({ text }) => {
            intellectualPropertyInfo.trademarkNumber = text;
          }}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) => {
            intellectualPropertyInfo.trademarkNumberValid = isValid;
          }}
          hideCheckmarkWhenValid
        />
      </Field>
      <Field
        title={() =>
          renderPopoverTitle(
            i`Trademark office`,
            i`The trademark must be active and issued by official ` +
              i`government trademark offices listed in the drop down menu.`
          )
        }
        className={css(styles.field)}
      >
        <TrademarkOfficeSelect
          onSelected={(value) => {
            intellectualPropertyInfo.trademarkOffice = value;
          }}
          selectedValue={intellectualPropertyInfo.trademarkOffice}
          acceptedTrademarkCountries={acceptedTrademarkCountries}
        />
      </Field>
      <Field
        title={() =>
          renderPopoverTitle(
            i`Trademark registration document`,
            i`The trademark text must match the brand name. If it ` +
              i`is an image based trademark with words, letters, or ` +
              i`numbers, the image must match the trademark record.`
          )
        }
        className={css(styles.field)}
      >
        <DEPRECATEDFileInput
          bucket="TEMP_UPLOADS"
          accepts=".jpeg,.jpg,.png,.pdf"
          maxSizeMB={10}
          maxAttachments={1}
          onAttachmentsChanged={(attachments) => {
            intellectualPropertyInfo.trademarkDocUrl = attachments[0]?.url;
          }}
          backgroundColor={surfaceLight}
          disabled={intellectualPropertyInfo.isSubmitting}
        />
      </Field>
      <Field
        title={i`Trademark registration URL (optional)`}
        className={css(styles.field)}
      >
        <TextInput
          placeholder={i`Enter the URL for the trademark registration`}
          onChange={({ text }) => {
            intellectualPropertyInfo.trademarkUrl = text;
          }}
          validators={[new UrlValidator({ allowBlank: true })]}
          onValidityChanged={(isValid) => {
            intellectualPropertyInfo.trademarkUrlValid = isValid;
          }}
        />
      </Field>
      <PrimaryButton
        style={css(styles.button)}
        onClick={() => intellectualPropertyInfo.submit()}
        isLoading={intellectualPropertyInfo.isSubmitting}
        isDisabled={!intellectualPropertyInfo.formComplete}
      >
        Submit
      </PrimaryButton>
    </div>
  );
};

export default observer(IntellectualPropertyModalContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        modal: {
          padding: "20px 130px",
        },
        field: {
          marginTop: 30,
        },
        row: {
          display: "flex",
          justifyContent: "space-between",
        },
        halfField: {
          width: "49%",
        },
        button: {
          margin: "30px 0px",
          // maxWidth: 234,
        },
        success: {
          padding: "60px 128px 93px 128px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        successIllustration: {
          height: "12.5em",
          width: "12.5em",
        },
        successText: {
          marginTop: 35,
          textAlign: "center",
          fontSize: 16,
        },
        info: {
          marginLeft: 5,
        },
        titleWithPopover: {
          display: "flex",
          alignItems: "baseline",
        },
      }),
    []
  );
