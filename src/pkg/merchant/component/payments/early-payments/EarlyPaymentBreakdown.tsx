import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { PageIndicator } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { FilterButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { CheckboxGrid } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringQueryParam,
} from "@toolkit/url";

/* Merchant API */
import * as earlyPaymentsApi from "@merchant/api/early-payment";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import EarlyPaymentHistoryTable from "./EarlyPaymentHistoryTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@merchant/stores/LocalizationStore";

const TablePageSize = 20;

const EarlyPaymentBreakdown = (props: BaseProps) => {
  const [offset, setOffset] = useIntQueryParam("start");
  const start = offset || 0;
  const styles = useStyleSheet();
  const { locale } = LocalizationStore.instance();
  const isZh = locale === "zh";

  const [savedStatusFilter, setSavedStatusFilter] = useIntArrayQueryParam(
    "status_filter"
  );
  const [statusFilter, setStatusFilter] = useState(new Set(savedStatusFilter));

  const [savedPaymentIdFilter, setSavedPaymentIdFilter] = useStringQueryParam(
    "payment_id"
  );
  const [paymentIdFilter, setPaymentIdFilter] = useState(savedPaymentIdFilter);

  const [paymentsResponse, refreshEarlyPayments] = useRequest(
    earlyPaymentsApi.getEarlyPayments({
      start,
      count: TablePageSize,
      filter_statuses: Array.from(savedStatusFilter || []),
      early_payment_id: savedPaymentIdFilter,
    })
  );
  const requestEarlyPaymentResponse = paymentsResponse?.data;
  const payments = paymentsResponse?.data?.early_payments;

  const tableData = useMemo(
    () =>
      payments
        ? payments.map<earlyPaymentsApi.EarlyPayment>((ep) => ({
            ...ep,
            creation_time: moment.utc(ep.creation_time).unix(),
          }))
        : [],
    [payments]
  );

  const totalCount = paymentsResponse?.data?.total_count || 0;
  const currentEnd = Math.min(totalCount, start + TablePageSize);
  const lastPage = totalCount
    ? Math.floor((totalCount - 1) / TablePageSize)
    : 0;

  const [filterResponse] = useRequest(
    earlyPaymentsApi.getEarlyPaymentFilterOptions()
  );
  const statuses = filterResponse?.data?.status_options || [];

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    nextPage = Math.min(lastPage, nextPage);
    setOffset(nextPage * TablePageSize);
  };

  /*eslint-disable local-rules/unwrapped-i18n*/

  /*eslint-disable local-rules/no-i18n-project-feature*/
  const getStatusText = (title: string): string => {
    switch (title) {
      case "To Be Processed":
        return isZh ? "未处理" : i`To Be Processed`;
      case "In Process":
        return isZh ? "处理中" : i`In Process`;
      case "Open":
        return isZh ? "进行中" : i`Open`;
      case "Closed":
        return isZh ? "已完成" : i`Closed`;
      case "Cancelled":
        return isZh ? "已取消" : i`Cancelled`;
      default:
        return title;
    }
  };

  /*eslint-enable local-rules/unwrapped-i18n*/

  /*eslint-enable local-rules/no-i18n-project-feature*/
  const filterPopover = () => (
    <>
      <div className={css(styles.filterTitle)}>
        {isZh ? "状态过滤器" : `Status Filters`}
      </div>
      <div className={css(styles.checkBoxes)}>
        <CheckboxGrid
          options={statuses.map((x) => ({
            title: getStatusText(x.title),
            value: x.value,
          }))}
          selected={statuses
            .map((x) => x.value)
            .filter((x) => !statusFilter.has(x))}
          onCheckedChanged={(value, checked) => {
            const newFiltered = new Set(statusFilter);
            if (checked) {
              newFiltered.delete(value);
            } else {
              newFiltered.add(value);
            }
            setStatusFilter(newFiltered);
          }}
        />
      </div>
      <HorizontalField
        className={css(styles.instanceIdField)}
        title={isZh ? "提前放款ID" : `Early Payment ID`}
        titleWidth={130}
        titleAlign="start"
      >
        <TextInput
          height={20}
          value={paymentIdFilter}
          onChange={(event) => {
            setPaymentIdFilter(event.text);
          }}
        />
      </HorizontalField>
      <div className={css(styles.footer)}>
        <Button
          onClick={() => {
            // Revert back to saved filters
            setStatusFilter(new Set(savedStatusFilter));
            setPaymentIdFilter(savedPaymentIdFilter);

            /* eslint-disable-next-line local-rules/unwrapped-i18n */
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          disabled={false}
          style={{
            padding: "7px 20px",
            borderRadius: 3,
            color: palettes.textColors.DarkInk,
          }}
        >
          {isZh ? "取消" : `Cancel`}
        </Button>
        <PrimaryButton
          className={css(styles.applyFilterButton)}
          onClick={() => {
            // Save and apply filter changes
            setOffset(0);
            setSavedStatusFilter(Array.from(statusFilter));
            setSavedPaymentIdFilter(paymentIdFilter);

            /* eslint-disable-next-line local-rules/unwrapped-i18n */
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
        >
          {isZh ? "应用过滤器" : `Apply filters`}
        </PrimaryButton>
      </div>
    </>
  );

  if (!requestEarlyPaymentResponse) {
    return (
      <div className={css(styles.loadingContainer)}>
        <LoadingIndicator type="spinner" size={70} />
      </div>
    );
  }

  return (
    <>
      <div className={css(styles.buttonContainer)}>
        <PageIndicator
          className={css(styles.pageIndicator)}
          totalItems={requestEarlyPaymentResponse?.total_count || 0}
          rangeStart={start + 1}
          rangeEnd={currentEnd}
          hasNext={requestEarlyPaymentResponse?.has_more || false}
          hasPrev={!!requestEarlyPaymentResponse && start > 0}
          currentPage={start / TablePageSize}
          onPageChange={onPageChange}
        />
        <PrimaryButton
          isLoading={!paymentsResponse}
          className={css(styles.refreshButton)}
          onClick={() => refreshEarlyPayments()}
        >
          {isZh ? "刷新" : `Refresh`}
        </PrimaryButton>
        <FilterButton
          className={css(styles.filterButton)}
          popoverPosition="bottom right"
          popoverContent={filterPopover}
        />
      </div>
      <EarlyPaymentHistoryTable data={tableData} />
    </>
  );
};

export default observer(EarlyPaymentBreakdown);

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0px 24px 12px 24px",
        },
        loadingContainer: {
          display: "flex",
          justifyContent: "center",
        },
        filterButton: {
          display: "flex",
          alignSelf: "center",
          marginLeft: 20,
        },
        refreshButton: {
          minWidth: 100,
        },
        pageIndicator: {
          marginRight: 20,
        },
        applyFilterButton: {
          marginLeft: 20,
        },
        footer: {
          borderTop: "1px solid #c4cdd5",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-end",
          padding: 16,
        },
        checkBoxes: {
          padding: "0px 24px 12px 24px",
        },
        filterTitle: {
          fontSize: 16,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          lineHeight: 1.5,
          padding: "20px 20px 0px 20px",
          alignSelf: "center",
          textAlign: "left",
        },
        instanceIdField: {
          margin: "0px 12px 12px 20px",
        },
      }),
    []
  );
