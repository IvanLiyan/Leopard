import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */

import { Popover } from "@merchant/component/core";

import {
  FilterButton,
  SearchBox,
  PageIndicator,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";

/* Merchant API */
import * as finesApi from "@merchant/api/fines";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import OrderFinesTable from "./OrderFinesTable";
import OrderFinesFilter from "./OrderFinesFilter";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineSpec } from "@merchant/api/fines";
import { OnTextChangeEvent } from "@ContextLogic/lego";

const PageSize = 10;

type OrderFinesProps = BaseProps;

const OrderFines: React.FC<OrderFinesProps> = (props: OrderFinesProps) => {
  const styles = useStylesheet(props);
  const { className, style } = props;
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const [offset, setOffset] = useIntQueryParam("offset");
  const [orderId, setOrderId] = useStringQueryParam("order_id");
  const [selectedFineTypes] = useIntArrayQueryParam("fine_types");
  const [disputeStatuses] = useStringArrayQueryParam("dispute_statuses");

  const currentOffset = offset || 0;

  const [fineMetadataResponse] = useRequest(finesApi.getFinesMetadata({}));

  const [finesResponse] = useRequest(
    finesApi.getOrderFines({
      count: PageSize,
      offset: currentOffset,
      fine_types: (selectedFineTypes || []).join(","),
      transaction_id: orderId,
      dispute_statuses: (disputeStatuses || []).join(","),
    })
  );

  const fineTypes = fineMetadataResponse?.data?.fine_types;
  if (fineTypes == null) {
    return <LoadingIndicator />;
  }

  const orderFineTypes: ReadonlyArray<FineSpec> = fineTypes.filter(
    (type) => type.is_transaction_fine
  );

  const fines = finesResponse?.data?.results;
  const hasNext = finesResponse?.data?.has_more || false;
  const totalCount = finesResponse?.data?.total_count || 0;
  const currentEnd = Math.min(totalCount, (offset || 0) + PageSize);
  const lastPage = totalCount ? Math.floor((totalCount - 1) / PageSize) : 0;

  const onOrderIdChange = ({ text }: OnTextChangeEvent) => {
    setOffset(0);
    setOrderId(text.trim().length == 0 ? null : text.trim());
  };

  const onPageChange = (_nextPage: number) => {
    let nextPage = Math.max(0, _nextPage);
    nextPage = Math.min(lastPage, nextPage);
    setExpandedRows(new Set([]));
    setOffset(nextPage * PageSize);
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const hasActiveFilters = !!(
    offset != null && // orderId != null && // T143183: orderId only poppulated when order search bar used,
    // has no relation to filter being active
    ((selectedFineTypes != null && selectedFineTypes.length !== 0) ||
      (disputeStatuses != null && disputeStatuses.length !== 0))
  );

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.searchContainer)}>
          <div className={css(styles.title)}>Order Penalties</div>
          <SearchBox
            className={css(styles.searchBox)}
            onChange={onOrderIdChange}
            placeholder={i`Search an order ID`}
            height={30}
            defaultValue={orderId}
            tokenize
            maxTokens={1}
          />
        </div>

        <div className={css(styles.buttons)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            isLoading={finesResponse == null}
            totalItems={totalCount}
            rangeStart={currentOffset + 1}
            rangeEnd={currentEnd}
            hasNext={hasNext}
            hasPrev={totalCount != null && currentOffset >= PageSize}
            currentPage={currentOffset / PageSize}
            onPageChange={onPageChange}
          />

          <Popover
            popoverContent={() => (
              <OrderFinesFilter availableFines={orderFineTypes} />
            )}
            position="bottom right"
            contentWidth={400}
          >
            <FilterButton
              style={styles.filterButton}
              isActive={hasActiveFilters}
            />
          </Popover>
        </div>
      </div>
      {fines == null ? (
        <LoadingIndicator />
      ) : (
        <OrderFinesTable
          fines={fines}
          expandedRows={Array.from(expandedRows)}
          onRowExpandToggled={onRowExpandToggled}
        />
      )}
    </div>
  );
};

export default observer(OrderFines);

const useStylesheet = (props: OrderFinesProps) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginTop: 25,
          ":nth-child(1n) > *": {
            height: 30,
            margin: "0px 0px 25px 0px",
          },
        },
        searchContainer: {
          display: "flex",
          flexDirection: "row",
        },
        title: {
          fontSize: 22,
          fontWeight: fonts.weightBold,
          lineHeight: 1.33,
          color: palettes.textColors.Ink,
          marginRight: 25,
          userSelect: "none",
          alignSelf: "center",
        },
        searchBox: {
          fontWeight: fonts.weightBold,
          "@media (min-width: 900px)": {
            minWidth: 350,
          },
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
        },
        filterButton: {
          alignSelf: "stretch",
          padding: "4px 15px",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        pageIndicatorLoading: {
          marginRight: 25,
        },
        filterImg: {
          width: 13,
          height: 13,
          marginRight: 8,
        },
      }),
    []
  );
