/*
 * CreateProductCategoryDisputeSection.tsx
 *
 * Created by Betty Chen on June 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { wishURL, zendeskURL } from "@toolkit/url";

/* Lego Components */
import {
  Layout,
  Card,
  Markdown,
  Text,
  Field,
  FormSelect,
  TextInput,
  Link,
  AttachmentInfo,
  CheckboxField,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Illustration } from "@merchant/component/core";
import Ul from "@merchant/component/core/Ul";

/* Merchant Components */
import { SecureFileInput } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import {
  CreateProductCategoryDisputeInitialData,
  getTopLevelTags,
} from "@toolkit/products/product-category-dispute";
import ProductCategoryDisputeState from "@merchant/model/products/ProductCategoryDisputeState";
import { ProductCategoryDisputeReason } from "@schema/types";

type Props = BaseProps & {
  readonly state: ProductCategoryDisputeState;
  readonly initialData: CreateProductCategoryDisputeInitialData;
  readonly fromEuCompliance?: boolean;
};

const CreateProductCategoryDisputeSection: React.FC<Props> = ({
  className,
  style,
  state,
  initialData,
  fromEuCompliance = false,
}: Props) => {
  const styles = useStylesheet();

  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    [],
  );

  const product = initialData.productCatalog?.product;
  const proposedCategories = initialData.platformConstants.topLevelTags || [];

  const learnMoreLink = zendeskURL("4403535077403");

  const currentProductTags = useMemo(
    () =>
      initialData.productCatalog?.product?.trueTags
        ? getTopLevelTags(initialData.productCatalog.product.trueTags)
        : null,
    [initialData],
  );

  const euDisputeReasons =
    initialData.policy?.productCategoryDispute?.reasons != null
      ? initialData.policy.productCategoryDispute.reasons.map((reason) => ({
          value: reason.reason,
          text: reason.text,
        }))
      : [];

  if (product == null) {
    return null;
  }

  const upload = async (attachments: ReadonlyArray<AttachmentInfo>) => {
    if (attachments.length === 0) {
      setAttachments([]);
      state.uploadFiles = null;
      return;
    }

    setAttachments(attachments);

    state.uploadFiles = attachments.map((attachment) => ({
      url: attachment.url,
      fileName: attachment.fileName,
    }));
  };

  return (
    <Layout.GridRow
      templateColumns="2fr 1fr"
      smallScreenTemplateColumns="1fr"
      gap={32}
      className={css(className, style)}
    >
      <Card
        className={css(styles.card)}
        contentContainerStyle={css(styles.cardContent)}
      >
        <Markdown
          className={css(styles.field)}
          text={
            i`If you believe this product's category has been misidentified, ` +
            i`you may dispute it here once. Wish will review and respond within a ` +
            i`few business days. Please note that editing the product listing may delay ` +
            i`dispute resolution. [Learn more](${learnMoreLink})`
          }
          openLinksInNewTab
        />
        {!fromEuCompliance && (
          <Field title={i`Reason for dispute`} className={css(styles.field)}>
            <TextInput
              onChange={({ text }) => (state.merchantNote = text)}
              placeholder={i`Please explain why this product does not belong in this category.`}
              isTextArea
            />
          </Field>
        )}
        <Field title={i`Disputed Category`} className={css(styles.field)}>
          <TextInput placeholder={currentProductTags || undefined} disabled />
        </Field>
        {!fromEuCompliance && (
          <Field title={i`Proposed Category`} className={css(styles.field)}>
            <FormSelect
              placeholder={i`Select`}
              options={proposedCategories.map((category) => ({
                value: category.id,
                text: category.name,
              }))}
              selectedValue={state.proposedTopCategoryTagId}
              onSelected={(value: string) =>
                (state.proposedTopCategoryTagId = value)
              }
            />
          </Field>
        )}
        {!fromEuCompliance && (
          <Field
            title={i`Add supporting images or files (optional)`}
            className={css(styles.field)}
          >
            <SecureFileInput
              accepts=".jpg,.jpeg,.png"
              onAttachmentsChanged={upload}
              bucket="TEMP_UPLOADS_V2"
              maxSizeMB={5}
              maxAttachments={10}
              attachments={attachments}
            />
          </Field>
        )}
        {fromEuCompliance && (
          <Field title={i`Reason for dispute`} className={css(styles.field)}>
            <FormSelect
              placeholder={i`Select one`}
              options={euDisputeReasons}
              selectedValue={state.euDisputeReason}
              onSelected={(value: ProductCategoryDisputeReason) =>
                (state.euDisputeReason = value)
              }
            />
          </Field>
        )}
        {fromEuCompliance && (
          <Field
            title={i`Explain selected reason`}
            className={css(styles.field)}
          >
            <TextInput
              onChange={({ text }) => (state.merchantNote = text)}
              placeholder={i`Please further explain the above-selected reason for dispute.`}
              isTextArea
            />
          </Field>
        )}
        {fromEuCompliance && (
          <Layout.FlexColumn className={css(styles.field)}>
            <CheckboxField
              checked={state.euComplianceAcceptTerms}
              onChange={(value: boolean) =>
                (state.euComplianceAcceptTerms = value)
              }
              title={() => (
                <Text>
                  I must confirm the following information before submitting the
                  dispute:
                </Text>
              )}
            />
            <Ul className={css(styles.bullets)}>
              <Ul.Li className={css(styles.bullet)}>
                I have reviewed the "Market Surveillance Regulation (EU)
                2019/1020" with a legal expert and I believe the product
                provided in this dispute have been misidentified as requiring an
                EU Responsible Person.
              </Ul.Li>
              <Ul.Li className={css(styles.bullet)}>
                To the best of my belief and understanding, all information
                submitted above is true and correct, and I am aware that
                providing false information could result in the closure of my
                account.
              </Ul.Li>
            </Ul>
          </Layout.FlexColumn>
        )}
      </Card>

      <Layout.FlexColumn>
        <Card
          title={i`Product`}
          contentContainerStyle={css(styles.cardContent)}
          className={css(styles.card)}
        >
          <Layout.GridRow templateColumns="1fr 4fr" gap={16}>
            <img src={product.mainImage.wishUrl} />
            <Layout.FlexColumn>
              <Link href={wishURL(`/c/${product.id}`)} openInNewTab>
                {product.name}
              </Link>
              <Markdown
                text={i`PID: ${product.id}`}
                className={css(styles.pid)}
              />
            </Layout.FlexColumn>
          </Layout.GridRow>
        </Card>
        <Card
          contentContainerStyle={css(styles.cardContent)}
          className={css(styles.card)}
        >
          <Layout.FlexRow>
            <Illustration
              name="lightBulb"
              alt="lightBulb"
              className={css(styles.illustration)}
            />
            <Text>Each listing may only be disputed once.</Text>
          </Layout.FlexRow>
        </Card>
      </Layout.FlexColumn>
    </Layout.GridRow>
  );
};

export default observer(CreateProductCategoryDisputeSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
          color: textBlack,
        },
        cardContent: {
          padding: 24,
        },
        illustration: {
          width: 20,
          marginRight: 16,
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        pid: {
          marginTop: 8,
        },
        bullets: {
          marginLeft: 24,
        },
        bullet: {
          marginTop: 4,
        },
      }),
    [textBlack],
  );
};
