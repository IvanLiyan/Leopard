/*
 *
 * DownloadPrepareCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/14/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";
import { Accordion, DownloadButton, Markdown } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  DownloadAllProductsCsv,
  DownloadAllProductsCsvInput,
} from "@schema/types";

import { zendeskURL } from "@toolkit/url";
import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";
import HeaderList from "@plus/component/orders/bulk-fulfill/HeaderList";
import ConfirmDownloadModal from "@plus/component/orders/bulk-fulfill/ConfirmDownloadModal";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductState";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";

const DOWNLOAD_ALL_MUTATION = gql`
  mutation {
    productCatalog {
      downloadAllProductsCsv(input: {}) {
        ok
        errorMessage
      }
    }
  }
`;

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

const DownloadPrepareCard: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  const [isHeadersOpen, setIsHeadersOpen] = useState(true);
  const toastStore = useToastStore();

  const {
    requiredColumns,
    optionalColumns,
  } = state.initialData.platformConstants.productCsvImportColumns;

  const { isStoreMerchant } = state.initialData.currentMerchant;
  const { optionalColumnsOverride } = state;

  const optionalColumnsToUse = isStoreMerchant
    ? optionalColumnsOverride
    : optionalColumns;

  const learnMoreLink = isStoreMerchant
    ? "https://localfaq.wish.com/hc/en-us/articles/360055410873-How-do-I-use-a-CSV-file-to-upload-products-"
    : zendeskURL("360052738953");

  const viewDescriptionLink = isStoreMerchant
    ? "https://localfaq.wish.com/hc/en-us/articles/360055410873-How-do-I-use-a-CSV-file-to-upload-products-"
    : zendeskURL("360052738953");

  type MutationResponseType = {
    readonly productCatalog: {
      readonly downloadAllProductsCsv: Pick<
        DownloadAllProductsCsv,
        "ok" | "errorMessage"
      >;
    };
  };

  const [requestDownloadAll] = useMutation<
    MutationResponseType,
    DownloadAllProductsCsvInput
  >(DOWNLOAD_ALL_MUTATION, {
    variables: {},
  });

  const handleDownloadAll = async () => {
    const { data } = await requestDownloadAll();
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

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`Prepare your CSV file`}
    >
      <div className={css(styles.upperContent)}>
        <Markdown
          className={css(styles.upperDescription)}
          text={
            i`Get started by preparing a new CSV file with a row for each ` +
            i`product listing. Download our sample CSV template to help you ` +
            i`format product details. [Learn more](${learnMoreLink}).`
          }
        />
        <div className={css(styles.downloadSection)}>
          <DownloadButton
            className={css(styles.downloadButton)}
            popoverContent={null}
            href={state.csvTemplateUrl}
          >
            Download template
          </DownloadButton>
          <DownloadButton
            className={css(styles.downloadButton)}
            popoverContent={null}
            onClick={handleDownloadAll}
          >
            Download all products
          </DownloadButton>
        </div>
      </div>
      <Accordion
        header={i`View list of column headers`}
        isOpen={isHeadersOpen}
        onOpenToggled={() => setIsHeadersOpen(!isHeadersOpen)}
      >
        <Markdown
          className={css(styles.headersDescription)}
          text={
            i`This is a list of required and optional information to help ` +
            i`create a successful listing through CSV. [View descriptions and examples](${viewDescriptionLink})`
          }
        />
        <div className={css(styles.headersContainer)}>
          <HeaderList
            className={css(styles.headerColumn)}
            title={ni18n(
              requiredColumns.length,
              "Required column",
              "Required columns"
            )}
            headers={requiredColumns}
          />
          <HeaderList
            className={css(styles.headerColumn)}
            title={ni18n(
              optionalColumnsToUse.length,
              "Optional column",
              "Optional columns"
            )}
            headers={optionalColumnsToUse}
          />
        </div>
      </Accordion>
    </BulkCard>
  );
};

const useStylesheet = () => {
  const { surfaceDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        upperContent: {
          display: "flex",
          flexDirection: "column",
          padding: 24,
          borderBottom: `1px solid ${surfaceDark}`,
        },
        upperDescription: {
          fontSize: 16,
          fontWeight: weightMedium,
          paddingBottom: 24,
        },
        downloadSection: {
          display: "flex",
        },
        downloadButton: {
          height: 40,
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        headersDescription: {
          padding: 24,
          fontSize: 16,
          lineHeight: "24px",
        },
        headersContainer: {
          display: "flex",
          paddingBottom: 24,
          paddingRight: 24,
          paddingLeft: 24,
        },
        loadingContainer: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        },
        headerColumn: {
          ":not(:last-child)": {
            marginRight: 126,
          },
        },
      }),
    [surfaceDark]
  );
};

export default observer(DownloadPrepareCard);
