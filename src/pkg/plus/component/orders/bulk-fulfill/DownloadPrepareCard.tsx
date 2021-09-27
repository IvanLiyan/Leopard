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

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkCard from "./BulkCard";
import {
  Button,
  Markdown,
  Accordion,
  SimpleSelect,
  DayRangePickerInput,
} from "@ContextLogic/lego";

import HeaderList from "./HeaderList";
import { useTheme } from "@merchant/stores/ThemeStore";
import BulkFulfillState from "@plus/model/BulkFulfillState";

import { DatetimeInput } from "@schema/types";
import { Option } from "@ContextLogic/lego";

import { useRequestCSVEmail } from "@toolkit/orders/bulk-fulfill";
import templateCsv from "@toolkit/orders/MerchantPlus_Bulk_Fulfill_Template.csv";

type CSVDownloadOption =
  | "all-unfulfilled"
  | "wish-express-unfulfilled"
  | "date-range-unfulfilled";

const CSVDownloadOptions: { [option in CSVDownloadOption]: string } = {
  "all-unfulfilled": i`All unfulfilled orders`,
  "wish-express-unfulfilled": i`Wish Express unfulfilled orders`,
  "date-range-unfulfilled": i`Date range of unfulfilled orders`,
};

const CSVDownloadOptionsArray: Option<CSVDownloadOption>[] = Object.entries(
  CSVDownloadOptions
).map(([value, text]) => ({
  value: value as CSVDownloadOption,
  text,
}));

type Props = BaseProps & {
  readonly state: BulkFulfillState;
};

const DownloadPrepareCard: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  type DateRange = {
    from: Date | null | undefined;
    to: Date | null | undefined;
  };

  const [selectedDownload, setSelectedDownload] = useState<CSVDownloadOption>(
    "all-unfulfilled"
  );
  const [isHeadersOpen, setIsHeadersOpen] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const {
    requiredColumns,
    optionalColumns,
  } = state.initialData.fulfillment.fulfillmentCsv;

  const wishExpressOnly = selectedDownload === "wish-express-unfulfilled";

  let startDate: DatetimeInput | undefined;
  if (dateRange.from != null && selectedDownload != "all-unfulfilled") {
    startDate = {
      unix: dateRange.from.getTime() / 1000,
    };
  }

  let endDate: DatetimeInput | undefined;
  if (dateRange.to != null && selectedDownload != "all-unfulfilled") {
    endDate = {
      unix: dateRange.to.getTime() / 1000,
    };
  }

  const handleDownload = useRequestCSVEmail({
    input: {
      sort: { field: "RELEASED_TIME", order: "ASC" },
      startDate,
      endDate,
      wishExpressOnly,
    },
  });

  const dates = selectedDownload === "date-range-unfulfilled" && (
    <div className={css(styles.csvDatesContainer)}>
      <DayRangePickerInput
        fromDate={dateRange.from}
        toDate={dateRange.to}
        onDayRangeChange={(from, to) => {
          setDateRange({ from, to });
        }}
      />
    </div>
  );

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`Download orders and prepare your CSV file`}
    >
      <div className={css(styles.upperContent)}>
        <Markdown
          className={css(styles.upperDescription)}
          text={
            i`Collect order information, including order IDs, by downloading your unfulfilled ` +
            i`orders into a CSV file.`
          }
        />
        <div className={css(styles.downloadSection)}>
          <div className={css(styles.downloadOptions)}>
            <SimpleSelect<CSVDownloadOption>
              className={css(styles.downloadSelect)}
              options={CSVDownloadOptionsArray}
              onSelected={(value: CSVDownloadOption) =>
                setSelectedDownload(value)
              }
              selectedValue={selectedDownload}
            />
            {dates}
          </div>
          <Button
            className={css(styles.downloadButton)}
            onClick={handleDownload}
          >
            Download
          </Button>
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
            i`Prepare a new CSV file with the required information for each ` +
            i`order, or download our [bulk fulfill CSV template](${templateCsv}).`
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
              optionalColumns.length,
              "Optional column",
              "Optional columns"
            )}
            headers={optionalColumns}
          />
        </div>
      </Accordion>
    </BulkCard>
  );
};

const downloadSelectMaxWidth = 306;
const downloadSelectMargin = 12;
const downloadButtonMaxWidth = 154;

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
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          maxWidth:
            downloadSelectMaxWidth +
            downloadButtonMaxWidth +
            downloadSelectMargin,
        },
        downloadOptions: {
          maxWidth: downloadSelectMaxWidth,
          marginRight: downloadSelectMargin,
        },
        downloadSelect: {
          width: "100%",
          height: 40,
        },
        downloadButton: {
          maxWidth: downloadButtonMaxWidth,
          height: 40,
        },
        csvDatesContainer: {
          marginTop: 12,
        },
        headersDescription: {
          padding: 24,
          fontSize: 16,
          lineHeight: "24px",
        },
        headersContainer: {
          display: "flex",
          padding: "0px 24px 24px 24px",
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
