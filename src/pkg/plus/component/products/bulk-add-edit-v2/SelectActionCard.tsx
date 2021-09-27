/*
 * SelectActionCard.tsx
 *
 * Created by Jonah Dlin on Wed Mar 31 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation } from "react-apollo";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  Accordion,
  Alert,
  DownloadButton,
  FormSelect,
  Layout,
  Text,
} from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";
import ConfirmDownloadModal from "@plus/component/orders/bulk-fulfill/ConfirmDownloadModal";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import {
  ActionOptions,
  ActionType,
  PlusActionOptions,
  DownloadAllProductsCsvInputType,
  DownloadAllProductsCsvResponseType,
  DOWNLOAD_ALL_PRODUCTS_CSV,
  PlusActionType,
} from "@toolkit/products/bulk-add-edit-v2";
import AttributeRequiredTable from "./AttributeRequiredTable";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

const SelectActionCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const {
    selectedAction,
    csvTemplateUrl,
    csvExampleUrl,
    hasProducts,
    initialData: {
      currentMerchant: { isMerchantPlus },
      currentUser: {
        gating: { showShopifyProductCsvUpload },
      },
    },
    handleSelectAction,
  } = state;
  const styles = useStylesheet();

  const [isHeadersOpen, setIsHeadersOpen] = useState(false);
  const toastStore = useToastStore();

  const [requestDownloadAll] = useMutation<
    DownloadAllProductsCsvResponseType,
    DownloadAllProductsCsvInputType
  >(DOWNLOAD_ALL_PRODUCTS_CSV);

  const handleDownloadAll = async () => {
    const { data } = await requestDownloadAll({ variables: { input: {} } });
    const ok = data?.productCatalog.downloadAllProductsCsv.ok;
    const errorMessage =
      data?.productCatalog.downloadAllProductsCsv.errorMessage;

    if (!ok) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }
    new ConfirmDownloadModal({
      title: i`Processing Export`,
      text:
        i`Your products are being processed into a CSV file. You will ` +
        i`receive an email with a link to download the file in ${24} hours.`,
    }).render();
  };

  const renderDownloadButton = ({
    text,
    href,
    onClick,
  }: {
    readonly text: string;
    readonly href?: string;
    readonly onClick?: () => unknown;
  }) => (
    <DownloadButton
      style={styles.downloadButton}
      popoverContent={null}
      href={href}
      onClick={onClick}
      hideText={false}
      preventHidingText
    >
      {text}
    </DownloadButton>
  );

  const options: ReadonlyArray<Option<
    ActionType | PlusActionType
  >> = isMerchantPlus ? PlusActionOptions : ActionOptions;

  const filterOutAction = showShopifyProductCsvUpload
    ? null
    : "SHOPIFY_CREATE_PRODUCTS";
  const filteredOptions = options.filter(
    (option) => option.value != filterOutAction
  );
  return (
    <BulkCard className={css(className, style)} title={i`Select action type`}>
      <Layout.FlexColumn className={css(styles.content)}>
        <Text
          className={css(styles.text, styles.actionHeader)}
          weight="semibold"
        >
          Action type
        </Text>
        <FormSelect
          className={css(styles.actionSelect)}
          options={filteredOptions}
          onSelected={(value: ActionType | PlusActionType) => {
            handleSelectAction(value);
          }}
          selectedValue={selectedAction}
          placeholder={isMerchantPlus ? undefined : i`Select`}
          height={40}
        />
        <Alert
          className={css(styles.infoBox)}
          sentiment="info"
          text={() => (
            <div className={css(styles.alertContent)}>
              <Text className={css(styles.text, styles.infoBoxText)}>
                Download a template or example to help you get started.
              </Text>
              <Layout.FlexColumn>
                {renderDownloadButton({
                  text: i`Download CSV template`,
                  href: csvTemplateUrl,
                })}
                {renderDownloadButton({
                  text: i`Download example CSV`,
                  href: csvExampleUrl,
                })}
              </Layout.FlexColumn>
            </div>
          )}
        />
        {hasProducts && (
          <Alert
            className={css(styles.infoBox)}
            sentiment="info"
            text={() => (
              <div className={css(styles.alertContent)}>
                <Text className={css(styles.text, styles.infoBoxText)}>
                  Want to edit existing products?
                </Text>
                {renderDownloadButton({
                  text: i`Download all products`,
                  onClick: handleDownloadAll,
                })}
              </div>
            )}
          />
        )}
      </Layout.FlexColumn>

      <Accordion
        header={() => (
          <Text className={css(styles.accordionHeader)} weight="semibold">
            View list of column headers
          </Text>
        )}
        isOpen={isHeadersOpen}
        onOpenToggled={() => setIsHeadersOpen(!isHeadersOpen)}
      >
        <AttributeRequiredTable
          state={state}
          className={css(styles.accordionContent)}
        />
      </Accordion>
    </BulkCard>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        actionHeader: {
          marginBottom: 4,
        },
        actionSelect: {
          maxWidth: 310,
          marginBottom: 24,
        },
        alertContent: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          "@media (max-width: 900px)": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          },
        },
        infoBox: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        infoBoxText: {
          marginRight: 8,
          "@media (max-width: 900px)": {
            marginBottom: 8,
          },
        },
        downloadButton: {
          fontSize: 14,
          padding: "8px 17px",
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        accordionHeader: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
        },
        accordionContent: {
          padding: 24,
        },
      }),
    [borderPrimary, textDark, textBlack]
  );
};

export default observer(SelectActionCard);
