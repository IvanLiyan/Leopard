/* eslint-disable local-rules/unnecessary-list-usage */
import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import {
  H6,
  Table,
  Markdown,
  SecondaryButton,
  AttachmentInfo,
  LoadingIndicator,
} from "@ContextLogic/lego";

import { SecureFileInput } from "@merchant/component/core";
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { PageGuide } from "@merchant/component/core";

import { zendeskURL } from "@toolkit/url";

import { useToastStore } from "@merchant/stores/ToastStore";
import { uploadPriceDropCampaignCsv } from "@merchant/api/price-drop";
import PriceDropCSVErrorsModal from "@merchant/component/products/price-drop/PriceDropCSVErrorsModal";

const PriceDropCampaignCsvUploadContainer: React.FC<{}> = () => {
  const styles = useStyleSheet();
  const toastStore = useToastStore();

  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(true);

  const onFileUpload = async () => {
    if (!fileUrl) {
      toastStore.error(i`Please provide a CSV file.`);
      return;
    }

    try {
      setUploadCompleted(false);
      const resp = await uploadPriceDropCampaignCsv({
        file_url: fileUrl,
      }).call();
      const data = resp.data;

      if (!data) {
        toastStore.negative(i`Something went wrong`);
        return;
      }

      if (data.errors.length == 0) {
        toastStore.positive(
          i`Your file has been successfully ` +
            i`uploaded and queued to be imported. It may take up to ${24} hours to get processed. `
        );
        return;
      }

      new PriceDropCSVErrorsModal({ response: data }).render();
    } catch (e) {
      toastStore.error(e.msg);
    } finally {
      setUploadCompleted(true);
    }
  };
  const faqText = i`To learn more, check out the Price Drop FAQ article [here](${zendeskURL(
    "360041691693"
  )}).`;
  return (
    <PageGuide>
      <div className={css(styles.margin)}>
        <H6>Tips for preparing your Price Drop CSV file</H6>
        <ul>
          <li>
            Make sure your CSV column headers and cell format exactly match the
            example shown below.
          </li>
          <li>
            Make sure the product's Price Drop amount is greater than 1USD (or
            7CNY).
          </li>
          <li>
            Only products that are available for sale, enabled, and with
            positive inventory are eligible for the Price Drop program.
          </li>
          <li>
            Start Date can be set at a minimum of 2 calendar days beyond today's
            date.
          </li>
        </ul>
        <Markdown text={faqText} openLinksInNewTab />
      </div>
      <H6 className={css(styles.margin)}>Example CSV</H6>
      <Table
        className={css(styles.margin)}
        data={[
          { parent_sku: "SKU01", start_date: "2020-11-08", drop_percentage: 5 },
          {
            parent_sku: "SKU02",
            start_date: "2020-11-09",
            drop_percentage: 100,
          },
        ]}
      >
        <Table.Column title={`Parent SKU`} columnKey="parent_sku" />
        <Table.Column title={`Start Date`} columnKey="start_date" />
        <Table.NumeralColumn
          title={`Drop Percentage`}
          columnKey="drop_percentage"
          description="5-100"
        />
      </Table>
      <SecureFileInput
        bucket="TEMP_UPLOADS_V2"
        className={css(styles.fileContainer)}
        accepts=".csv"
        onAttachmentsChanged={(attachments: ReadonlyArray<AttachmentInfo>) => {
          if (attachments.length > 0 && attachments[0].url) {
            setFileUrl(attachments[0].url);
          }
        }}
        maxSizeMB={100}
        maxAttachments={1}
      />
      <LoadingIndicator loadingComplete={uploadCompleted}>
        <SecondaryButton
          className={css(styles.submitButton)}
          text={i`Upload`}
          onClick={onFileUpload}
          disabled={!uploadCompleted}
        />
      </LoadingIndicator>
    </PageGuide>
  );
};

const useStyleSheet = () => {
  const { positive, positiveLight, negative, negativeLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        textContainer: {
          margin: "8px 16px",
        },
        fileContainer: {
          display: "flex",
          margin: 10,
          justifyContent: "flex-start",
        },
        submitButton: {
          margin: 10,
        },
        positiveBanner: {
          backgroundColor: positiveLight,
          border: `3px solid ${positive}`,
          minHeight: 100,
          padding: 10,
        },
        negativeBanner: {
          backgroundColor: negativeLight,
          border: `3px solid ${negative}`,
          minHeight: 100,
          padding: 10,
        },
        margin: {
          margin: 10,
        },
      }),
    [positive, positiveLight, negative, negativeLight]
  );
};

export default observer(PriceDropCampaignCsvUploadContainer);
