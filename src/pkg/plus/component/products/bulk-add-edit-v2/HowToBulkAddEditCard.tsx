/*
 *
 * HowToBulkAddEditCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Checkpoint, Markdown, Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";
import { useTheme } from "@merchant/stores/ThemeStore";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { zendeskURL } from "@toolkit/url";

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

const HowToBulkAddEditCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const { isStoreMerchant, isMerchantPlus } = state.initialData.currentMerchant;

  const styles = useStylesheet();

  const fileStatusPageLink = "/plus/products/bulk-csv-add-edit-history";
  const faqLink = useMemo(() => {
    if (isStoreMerchant) {
      return "https://localfaq.wish.com/hc/en-us/articles/360055410873-How-do-I-use-a-CSV-file-to-upload-products-";
    }
    if (isMerchantPlus) {
      return zendeskURL("1260806204110");
    }
    return zendeskURL("1260805100290");
  }, [isStoreMerchant, isMerchantPlus]);

  const viewExamplesLink = useMemo(() => {
    if (isStoreMerchant) {
      return "https://localfaq.wish.com/hc/en-us/articles/205211817-What-Attributes-Do-I-Need-To-Include-When-Adding-Products-";
    }
    if (isMerchantPlus) {
      return zendeskURL("1260806181769");
    }
    return zendeskURL("1260805100070");
  }, [isStoreMerchant, isMerchantPlus]);

  return (
    <BulkCard
      className={css(className, style)}
      title={i`How to add/edit products with CSV`}
      contentContainerStyle={css(styles.container)}
    >
      <Checkpoint>
        <Checkpoint.Point>
          <Text className={css(styles.text)}>
            Select the type of action you would like to take.
          </Text>
          <Markdown
            className={css(styles.text)}
            text={
              i`Refer to the **List of Product Attributes** to see which ` +
              i`product attributes are required for each type of action. ` +
              i`[View descriptions and examples](${viewExamplesLink})`
            }
          />
          <Text className={css(styles.text)}>
            Prepare your CSV file with a row for each Parent SKU (to group
            variations) or SKU (for each variation) by downloading either a CSV
            template (recommended for adding products) or all your existing
            products (recommended for editing products).
          </Text>
        </Checkpoint.Point>
        <Checkpoint.Point>
          <Text className={css(styles.text)}>
            Upload your formatted CSV file.
          </Text>
        </Checkpoint.Point>
        <Checkpoint.Point>
          <Text className={css(styles.text)}>
            Check the column mapping to make sure your column headers match Wish
            attributes.
          </Text>
        </Checkpoint.Point>
        <Checkpoint.Point>
          <Text className={css(styles.text)}>
            Select “Submit” to upload all the products from your CSV file.
          </Text>
        </Checkpoint.Point>
        <Checkpoint.Point>
          <Markdown
            className={css(styles.text)}
            openLinksInNewTab
            text={
              i`Check the [Product CSV File Status](${fileStatusPageLink}) ` +
              i`page to track the status of your file.`
            }
          />
        </Checkpoint.Point>
      </Checkpoint>
      <Markdown
        className={css(styles.text, styles.footer)}
        text={i`Still need help? [View our FAQ](${faqLink})`}
      />
    </BulkCard>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 24,
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          ":nth-child(2)": {
            marginTop: 20,
          },
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        footer: {
          marginLeft: 24,
        },
      }),
    [textDark]
  );
};

export default observer(HowToBulkAddEditCard);
