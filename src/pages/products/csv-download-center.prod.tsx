import React, { useMemo } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { Alert, AlertTitle } from "@ContextLogic/atlas-ui";
import Image from "@core/components/Image";
import PageRoot from "@core/components/PageRoot";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
/* Lego Components */
import { Text } from "@ContextLogic/lego";
/* Model */
import CsvdownloadCenterTable from "@all-products/components/CsvDownloadCenterTable";
import { ci18n } from "@core/toolkit/i18n";

const CsvDownloadCenterPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();

  return (
    <PageRoot style={styles.root}>
      <PageHeader
        title={i`CSV download center`}
        relaxed
        illustration={() => (
          <Image
            src="/md/images/product-listing/home_listing_fees_banner.svg"
            alt={ci18n("alt text for an image", "CSV download center banner")}
            width={213}
            height={143}
          />
        )}
      >
        <Text>
          View download status, manage, and download your CSV files once they
          are ready.
        </Text>
      </PageHeader>
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert severity="info" sx={{ flex: 1 }}>
          <AlertTitle>
            Only underperforming products are supported for downloading
          </AlertTitle>
          <div color="inherit">
            At this moment, only underperforming products can be downloaded
          </div>
        </Alert>
        <CsvdownloadCenterTable></CsvdownloadCenterTable>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          background: "#fff",
        },
      }),
    [],
  );
};

export default observer(CsvDownloadCenterPage);
