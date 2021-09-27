import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { AttachmentInfo, Field } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { SecureFileInput } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { Tip } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { RadioGroup } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  RequiredValidator,
  UrlValidator,
  CharacterLength,
} from "@toolkit/validators";
import { proxima, weightNormal } from "@toolkit/fonts";

/* Merchant API */
import { submitTrueBrandRequest } from "@merchant/api/brand/true-brands";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Relative Imports */
import NewTrueBrandRequestConfirmation, {
  NewTrueBrandRequestConfirmationProps,
} from "./new-true-brand-request/NewTrueBrandRequestConfirmation";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SellerType } from "@merchant/api/brand/true-brands";

export type NewTrueBrandRequestProps = BaseProps &
  Pick<NewTrueBrandRequestConfirmationProps, "isMerchantPlus"> & {
    brandName?: string;
  };

type NewTrueBrandRequestContentProps = NewTrueBrandRequestProps & {
  readonly closeModal: () => unknown;
};

const NewTrueBrandRequestContent = (props: NewTrueBrandRequestContentProps) => {
  const styles = useStylesheet();
  const { closeModal, brandName: brandNameProp, isMerchantPlus } = props;
  const { primary, surfaceLight } = useTheme();
  const toastStore = useToastStore();
  const [brandNameValid, setBrandNameValid] = useState(false);
  const [brandName, setBrandName] = useState(brandNameProp);
  const [brandUrl, setBrandUrl] = useState("");
  const [hasRegisteredTrademarkStr, setHasRegisteredTrademarkStr] = useState(
    ""
  );
  const [sellerType, setSellerType] = useState<SellerType>();
  const [brandUrlValid, setBrandUrlValid] = useState(false);
  const [brandLogoUrlValid, setBrandLogoUrlValid] = useState(false);
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [
    productPackagingAttachments,
    setProductPackagingAttachments,
  ] = useState<ReadonlyArray<AttachmentInfo>>([]);
  const [merchantNotes, setMerchantNotes] = useState("");
  const [merchantNotesValid, setMerchantNotesValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const productPackagingImages = [];
      for (const attachment of productPackagingAttachments) {
        productPackagingImages.push({
          filename: attachment.fileName,
          url: attachment.url,
        });
      }

      const response = await submitTrueBrandRequest({
        brand_name: brandName || "",
        brand_url: brandUrl,
        brand_logo_url: brandLogoUrl,
        product_packaging_images: JSON.stringify(productPackagingImages),
        merchant_notes: merchantNotes,
        seller_type: sellerType,
        has_registered_trademark: hasRegisteredTrademarkStr == "true",
      }).call();

      const wasSuccess = response.data?.success;

      if (wasSuccess) {
        setIsLoading(false);
        setSuccess(true);
      } else {
        toastStore.negative(
          i`You have already made a request for this brand name.`
        );
        closeModal();
      }
    } catch (e) {
      closeModal();
      throw e;
    }
  };

  if (success) {
    return <NewTrueBrandRequestConfirmation isMerchantPlus={isMerchantPlus} />;
  }

  const markdownText = `[${i`Learn more`}](${zendeskURL("360046520933")})`;
  const faqText =
    i`Which brands are accepted? Review our guidelines on ` +
    i`how to successfully suggest a brand. ${markdownText}`;

  const productPackagingImagesText = () => (
    <div className={css(styles.productPackagingImagesPopover)}>
      Images that show the suggested brand on product and/or packaging. Upload
      up to 5 images.
    </div>
  );

  return (
    <div className={css(styles.modal)}>
      <Tip color={primary} icon="tip">
        <Markdown text={faqText} openLinksInNewTab />
      </Tip>
      <div className={css(styles.twoFields)}>
        <Field title={i`Brand Name`} className={css(styles.insideTwoFields)}>
          <TextInput
            placeholder={i`Enter the name of the brand`}
            value={brandName}
            onChange={({ text }) => {
              setBrandName(text);
            }}
            validators={[
              new RequiredValidator(),
              new CharacterLength({ maximum: 500 }),
            ]}
            onValidityChanged={(isValid) => {
              setBrandNameValid(isValid);
            }}
            hideCheckmarkWhenValid
          />
        </Field>
        <Field
          title={i`URL to brand website`}
          className={css(styles.insideTwoFields)}
        >
          <TextInput
            placeholder={i`Enter the brand website’s URL`}
            onChange={({ text }) => {
              setBrandUrl(text);
            }}
            validators={[new UrlValidator()]}
            onValidityChanged={(isValid) => {
              setBrandUrlValid(isValid);
            }}
            hideCheckmarkWhenValid
          />
        </Field>
      </div>
      <Field title={i`Brand logo`} className={css(styles.field)}>
        <SecureFileInput
          bucket="TEMP_UPLOADS"
          accepts={".jpeg,.jpg,.png"}
          maxSizeMB={10}
          maxAttachments={1}
          onAttachmentsChanged={(attachments) => {
            setBrandLogoUrl(attachments[0]?.url);
            setBrandLogoUrlValid(attachments[0]?.url != null);
          }}
          backgroundColor={surfaceLight}
          disabled={isLoading}
        />
      </Field>
      <Field
        title={i`Are you a reseller or owner of this brand?`}
        className={css(styles.field)}
      >
        <RadioGroup
          selectedValue={sellerType}
          onSelected={(value) => {
            setSellerType(value);
          }}
          layout={"horizontal"}
          itemStyle={css(styles.radioItem)}
        >
          <RadioGroup.Item value={"RESELLER"} text={i`Reseller`} />
          <RadioGroup.Item value={"BRAND_OWNER"} text={i`Brand owner`} />
        </RadioGroup>
      </Field>
      <Field
        title={
          i`Does this brand have an active registered trademark that appears ` +
          i`on products or packaging?`
        }
        className={css(styles.field)}
      >
        <RadioGroup
          selectedValue={hasRegisteredTrademarkStr}
          onSelected={(value) => {
            setHasRegisteredTrademarkStr(value);
          }}
          layout={"horizontal"}
          itemStyle={css(styles.radioItem)}
        >
          <RadioGroup.Item value={"true"} text={i`Yes`} />
          <RadioGroup.Item value={"false"} text={i`No`} />
        </RadioGroup>
      </Field>
      <Field
        title={i`Images of product packaging`}
        description={productPackagingImagesText}
        style={css(styles.field)}
      >
        <SecureFileInput
          bucket="TEMP_UPLOADS"
          accepts={".jpeg,.jpg,.png"}
          maxSizeMB={10}
          maxAttachments={5}
          onAttachmentsChanged={(attachments) => {
            setProductPackagingAttachments(attachments);
          }}
          attachments={productPackagingAttachments}
          backgroundColor={surfaceLight}
          disabled={isLoading}
        />
      </Field>
      <Field
        title={i`Additional information (optional)`}
        className={css(styles.field)}
      >
        <TextInput
          placeholder={
            i`What types of products does this brand sell? ` +
            i`(electronics, fashion, home decor, etc.)`
          }
          isTextArea
          rows={5}
          cols={40}
          height={200}
          onChange={({ text }) => {
            setMerchantNotes(text);
          }}
          validators={[new CharacterLength({ maximum: 1000 })]}
          onValidityChanged={(isValid) => {
            setMerchantNotesValid(isValid);
          }}
        />
      </Field>
      <PrimaryButton
        style={css(styles.button)}
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={
          !brandNameValid ||
          !brandUrlValid ||
          !merchantNotesValid ||
          !brandLogoUrlValid ||
          !hasRegisteredTrademarkStr
        }
      >
        Submit suggestion
      </PrimaryButton>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        modal: {
          padding: "20px 130px",
        },
        field: {
          marginTop: 30,
        },
        twoFields: {
          display: "flex",
          justifyContent: "space-between",
        },
        insideTwoFields: {
          marginTop: 30,
          flex: 1,
          ":first-child": {
            marginRight: 24,
          },
        },
        button: {
          margin: "30px 0px",
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
        radioButton: {
          fontWeight: weightNormal,
        },
        radioItem: {
          width: "20%",
        },
        productPackagingImagesPopover: {
          fontSize: 14,
          lineHeight: 1.5,
          padding: 13,
          maxWidth: 230,
          fontFamily: proxima,
          color: textBlack,
        },
      }),
    [textBlack]
  );
};

export default class NewTrueBrandRequestModal extends Modal {
  props: NewTrueBrandRequestProps;

  constructor(props: NewTrueBrandRequestProps) {
    super(() => null);

    this.setHeader({
      title: i`Suggest a new brand`,
    });

    this.props = props;
    this.noMaxHeight = true;

    const { dimenStore } = AppStore.instance();
    const targetPercentage = 900 / dimenStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return (
      <NewTrueBrandRequestContent
        {...this.props}
        closeModal={() => this.close()}
      />
    );
  }
}
