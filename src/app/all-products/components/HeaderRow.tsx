/*
 * HeaderRow.tsx
 *
 * Created by Jonah Dlin on Tue Apr 26 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  H5,
  Layout,
  PrimaryButton,
  SecondaryButton,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  PickedWarehouse,
  DOWNLOAD_PRODUCTS_MUTATION,
  DownloadProductsResponseType,
  DownloadProductsRequestType,
  GET_PRODUCTS_FOR_EXPORT_QUERY,
  GetProductsForExportResponseType,
  GetProductsForExportRequestType,
  generateCsvExport,
} from "@all-products/toolkit";
import { useToastStore } from "@core/stores/ToastStore";
import { cni18n, ci18n } from "@core/toolkit/i18n";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useMutation } from "@apollo/client";
import { FileType } from "@schema";
import { useApolloStore } from "@core/stores/ApolloStore";
import moment from "moment/moment";
import { createFileAndDownload } from "@core/toolkit/file";
import { formatDatetimeLocalized } from "@core/toolkit/datetime";
import ConfirmDownloadModal from "./ConfirmDownloadModal";
import { merchFeURL } from "@core/toolkit/router";

type Props = BaseProps & {
  readonly count?: number | null;
  readonly totalCount?: number | null;
  readonly productsOnScreen: number;
  readonly warehouse: PickedWarehouse;
  readonly variables: GetProductsForExportRequestType;
};

const FileTypeDisplayText: { readonly [T in FileType]: string } = {
  CSV:
    i`Your products are being processed into a CSV file. You will ` +
    i`receive an email with a link to download the file in ${24} hours.`,
  XLSX:
    i`Your products are being processed into an XLSX file. You will ` +
    i`receive an email with a link to download the file in ${24} hours.`,
};

const HeaderRow: React.FC<Props> = ({
  className,
  style,
  count,
  totalCount,
  productsOnScreen,
  warehouse,
  variables,
}) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { client } = useApolloStore();

  const [loadingDownloadXlsx, setLoadingDownloadXlsx] = useState(false);
  const [loadingDownloadCsv, setLoadingDownloadCsv] = useState(false);
  const [loadingDownloadTable, setLoadingDownloadTable] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    confirmDownloadModalConfirmationType,
    setConfirmDownloadModalConfirmationType,
  ] = useState<FileType | null>(null);

  const warehouseName = warehouse.unitId;

  const [requestDownloadAll] = useMutation<
    DownloadProductsResponseType,
    DownloadProductsRequestType
  >(DOWNLOAD_PRODUCTS_MUTATION);

  const toggleLoadingDownloadState = (fileType: FileType, to: boolean) => {
    if (fileType == "CSV") {
      setLoadingDownloadCsv(to);
    }
    if (fileType == "XLSX") {
      setLoadingDownloadXlsx(to);
    }
  };

  const handleDownloadAll = async (fileType: FileType) => {
    toggleLoadingDownloadState(fileType, true);
    const { data } = await requestDownloadAll({
      variables: {
        input: {
          warehouseId: warehouse.id,
          fileType,
        },
      },
    });
    toggleLoadingDownloadState(fileType, false);
    const ok = data?.productCatalog.downloadAllProducts?.ok;
    const errorMessage = data?.productCatalog.downloadAllProducts?.errorMessage;

    if (!ok) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }
    setIsModalOpen(true);
    setConfirmDownloadModalConfirmationType(fileType);
  };

  const handleDownloadTable = async () => {
    setLoadingDownloadTable(true);

    const { data } = await client.query<
      GetProductsForExportResponseType,
      GetProductsForExportRequestType
    >({
      query: GET_PRODUCTS_FOR_EXPORT_QUERY,
      variables,
    });

    const fileText = generateCsvExport(data, warehouse);
    createFileAndDownload({
      filename: `products_export_${formatDatetimeLocalized(
        moment(),
        "DD_MM_YYYY",
      )}.csv`,
      content: fileText,
      mimeType: "text/csv",
    });

    setLoadingDownloadTable(false);
  };

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      justifyContent="space-between"
    >
      <ConfirmDownloadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={ci18n(
          "Text on a confirmation modal telling the merchant that the export of their products is processing",
          "Processing Export",
        )}
        text={
          confirmDownloadModalConfirmationType === null
            ? undefined
            : FileTypeDisplayText[confirmDownloadModalConfirmationType]
        }
      />
      <H5 style={styles.title}>
        {count != null &&
          cni18n(
            "Title above table of products telling merchants how many products are in the table",
            count,
            "1 Product",
            "{%1=number of products} Products",
          )}
      </H5>
      <Layout.FlexRow
        style={styles.buttonRow}
        alignItems="stretch"
        justifyContent="flex-end"
      >
        {totalCount != null && (
          <SecondaryButton
            style={styles.button}
            padding="10px 16px"
            onClick={() => void handleDownloadAll("XLSX")}
            isLoading={loadingDownloadXlsx}
          >
            <Text weight="semibold" style={styles.buttonText}>
              {cni18n(
                "Name of button merchants can click to download all their products as an XLSX file. Included is the name of the warehouse and the number of rows that will be in the file.",
                totalCount,
                "Download XLSX [{%2=warehouse name}] ({%1=number of products} row)",
                "Download XLSX [{%2=warehouse name}] ({%1=number of products} rows)",
                warehouseName,
              )}
            </Text>
          </SecondaryButton>
        )}
        {totalCount != null && (
          <SecondaryButton
            style={styles.button}
            padding="10px 16px"
            onClick={() => void handleDownloadAll("CSV")}
            isLoading={loadingDownloadCsv}
          >
            <Text weight="semibold" style={styles.buttonText}>
              {cni18n(
                "Name of button merchants can click to download all their products as an CSV file. Included is the name of the warehouse and the number of rows that will be in the file.",
                totalCount,
                "Download CSV [{%2=warehouse name}] ({%1=number of products} row)",
                "Download CSV [{%2=warehouse name}] ({%1=number of products} rows)",
                warehouseName,
              )}
            </Text>
          </SecondaryButton>
        )}
        {productsOnScreen != null && (
          <SecondaryButton
            style={styles.button}
            padding="10px 16px"
            onClick={() => void handleDownloadTable()}
            isLoading={loadingDownloadTable}
          >
            <Text weight="semibold" style={styles.buttonText}>
              {cni18n(
                "Name of button merchants can click to export the products currently on-screen in the table as an CSV file. Included is the number of rows that will be in the file.",
                productsOnScreen,
                "Download current view ({%1=number of products} row)",
                "Download current view ({%1=number of products} rows)",
              )}
            </Text>
          </SecondaryButton>
        )}
        <PrimaryButton
          style={styles.button}
          onClick={() => navigationStore.navigate(merchFeURL("/products/add"))}
        >
          <Text weight="semibold" style={styles.buttonText}>
            {ci18n(
              "Text on a button merchants can click to be redirected to the add product page",
              "Add Product",
            )}
          </Text>
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: { gap: 16 },
        buttonRow: {
          flexWrap: "wrap",
          gap: 16,
        },
        button: {
          height: 40,
        },
        buttonText: {
          fontSize: 14,
          lineHeight: "20px",
        },
        title: {
          whiteSpace: "nowrap",
          lineHeight: "28px",
          marginTop: 6,
          alignSelf: "flex-start",
        },
      }),
    [],
  );
};

export default observer(HeaderRow);
