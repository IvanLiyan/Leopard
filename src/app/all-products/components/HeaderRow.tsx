import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  H5,
  Layout,
  PrimaryButton,
  Text,
  LoadingIndicator,
} from "@ContextLogic/lego";
import Link from "@core/components/Link";
import { Alert, AlertTitle } from "@ContextLogic/atlas-ui";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  PickedWarehouse,
  DOWNLOAD_PRODUCTS_MUTATION,
  DownloadProductsRequestType,
  DownloadProductsResponseType,
  DOWNLOAD_UNDERPERFORMING_PRODUCTS_MUTATION,
  DownloadUnderperformingProductsRequestType,
  DownloadUnderperformingProductsResponseType,
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
import { merchFeUrl } from "@core/toolkit/router";

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

  const [
    loadingDownloadUnderperformingCsv,
    setLoadingDownloadUnderperformingCsv,
  ] = useState(false);
  const [
    showDownloadUnderperformingSuccBanner,
    setShowDownloadUnderperformingSuccBanner,
  ] = useState(false);
  const [loadingDownloadXlsx, setLoadingDownloadXlsx] = useState(false);
  const [loadingDownloadCsv, setLoadingDownloadCsv] = useState(false);
  const [loadingDownloadTable, setLoadingDownloadTable] = useState(false);

  const [downloadType, setDownloadType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    confirmDownloadModalConfirmationType,
    setConfirmDownloadModalConfirmationType,
  ] = useState<FileType | null>(null);

  const [requestDownloadAll] = useMutation<
    DownloadProductsResponseType,
    DownloadProductsRequestType
  >(DOWNLOAD_PRODUCTS_MUTATION);

  const [requestDownloadUnderperforming] = useMutation<
    DownloadUnderperformingProductsResponseType,
    DownloadUnderperformingProductsRequestType
  >(DOWNLOAD_UNDERPERFORMING_PRODUCTS_MUTATION);

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

  const handleDownloadUnderPerform = async (fileType: FileType) => {
    setLoadingDownloadUnderperformingCsv(true);

    const { data } = await requestDownloadUnderperforming({
      variables: {
        input: {
          fileType,
        },
      },
    });
    const ok = data?.productCatalog.downloadUnderPerformingProducts?.ok;
    const errorMessage =
      data?.productCatalog.downloadUnderPerformingProducts?.errorMessage;
    setLoadingDownloadUnderperformingCsv(false);

    if (!ok) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }
    setShowDownloadUnderperformingSuccBanner(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setDownloadType(event.target.value);
    switch (event.target.value) {
      case "CSV for underperforming products":
        return handleDownloadUnderPerform("CSV");
      case "XLSX for all products":
        return handleDownloadAll("XLSX");
      case "CSV for all products":
        return handleDownloadAll("CSV");
      case "CSV for the current view":
        return handleDownloadTable();
      default:
        return null;
    }
  };

  return (
    <>
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
          alignItems="center"
          justifyContent="flex-end"
        >
          <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
            <Select
              value={downloadType}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={handleChange}
              autoWidth
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                Download as CSV/XLSX
              </MenuItem>
              <MenuItem value="CSV for underperforming products">
                CSV for underperforming products(Weekly)
              </MenuItem>
              {totalCount != null && (
                <MenuItem value="XLSX for all products">
                  XLSX for all products
                </MenuItem>
              )}
              {totalCount != null && (
                <MenuItem value="CSV for all products">
                  CSV for all products
                </MenuItem>
              )}
              {productsOnScreen != null && (
                <MenuItem value="CSV for the current view">
                  CSV for the current view ({productsOnScreen} rows)
                </MenuItem>
              )}
            </Select>
          </FormControl>
          {(loadingDownloadUnderperformingCsv ||
            loadingDownloadXlsx ||
            loadingDownloadCsv ||
            loadingDownloadTable) && <LoadingIndicator type="spinner" />}
          <PrimaryButton
            style={styles.button}
            onClick={() =>
              navigationStore.navigate(merchFeUrl("/products/add"))
            }
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
      <Layout.FlexRow>
        {showDownloadUnderperformingSuccBanner && (
          <Alert severity="success" sx={{ flex: 1 }}>
            <AlertTitle>
              Downloading CSV for underperforming products
            </AlertTitle>
            <div
              color="inherit"
              style={{
                display: "flex",
                fontSize: 14,
                fontFamily: "Proxima Nova",
              }}
            >
              <Text>
                It may take a while for your file to download depending on its
                size. Go to the
              </Text>
              <Link
                href={merchFeUrl(`/md/products/csv-download-center`)}
                variant="underlined"
                openInNewTab
                color="inherit"
                sx={{
                  marginLeft: 1,
                  marginRight: 1,
                }}
              >
                CSV download center
              </Link>
              <Text>
                to view, manage, and download your CSV when it’s ready.
              </Text>
            </div>
          </Alert>
        )}
      </Layout.FlexRow>
    </>
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
