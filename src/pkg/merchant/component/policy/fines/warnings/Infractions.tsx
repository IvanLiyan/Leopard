import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { SearchBox } from "@ContextLogic/lego";
import { FilterButton } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringQueryParam,
} from "@toolkit/url";

/* Merchant API */
import * as warningsApi from "@merchant/api/warnings";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import InfractionsTable from "./InfractionsTable";
import InfractionsFilter from "./InfractionsFilter";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  InfractionReasonSpec,
  InfractionFinesSpec,
  InfractionStatesSpec,
  GetInfractionsMetadataResponse,
} from "@merchant/api/warnings";
import { OnTextChangeEvent } from "@ContextLogic/lego";

const PageSize = 10;

type InfractionsProps = BaseProps & {
  readonly infractionsMetadata: GetInfractionsMetadataResponse;
};

const Infractions = (props: InfractionsProps) => {
  const styles = useStylesheet(props);
  const { className, style, infractionsMetadata } = props;

  const availableFines: ReadonlyArray<InfractionReasonSpec> =
    infractionsMetadata.reasons || [];
  const infractionFines: ReadonlyArray<InfractionFinesSpec> =
    infractionsMetadata.warning_fines || [];
  const infractionStatesOptions: ReadonlyArray<InfractionStatesSpec> =
    infractionsMetadata.infraction_states || [];

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const [infractionsOffset, setInfractionsOffset] = useIntQueryParam(
    "infractions_offset"
  );
  const [searchId, setSearchId] = useStringQueryParam("search_id");
  const [infractionReasons] = useIntArrayQueryParam("infraction_reasons");
  const [infractionStates] = useIntArrayQueryParam("infraction_states");
  const [infractionSortKey] = useStringQueryParam("infractions_sort_key");
  const [infractionSortOrder] = useIntQueryParam("infractions_sort_order");
  const [hasPenalties] = useIntArrayQueryParam("has_penalties");

  const currentOffset = infractionsOffset || 0;
  const currentInfractionSortKey = infractionSortKey || "last_update";
  const currentInfractionSortOrder = infractionSortOrder || -1;

  const hasActiveFilters = !!(
    infractionsOffset != null &&
    ((infractionReasons != null && infractionReasons.length !== 0) ||
      (infractionStates != null && infractionStates.length !== 0) ||
      (hasPenalties != null && hasPenalties.length !== 0))
  );

  const query: warningsApi.GetInfractionsParams = {
    count: PageSize,
    start: currentOffset,
    query: searchId,
    "infraction_fine_types[]": undefined,
    "reason[]": infractionReasons || [],
    sortKey: currentInfractionSortKey,
    sortDir: currentInfractionSortOrder,
    "state[]": infractionStates || [],
    "has_penalties[]": hasPenalties || [],
  };

  const [response] = useRequest(warningsApi.getInfractions(query));
  const fines = response?.data?.results.rows;
  const hasNext = !(response?.data?.results.feed_ended || false);
  const totalCount = response?.data?.results.num_results || 0;
  const currentEnd = Math.min(totalCount, (infractionsOffset || 0) + PageSize);
  const lastPage = totalCount ? Math.floor((totalCount - 1) / PageSize) : 0;

  const onOrderIdChange = ({ text }: OnTextChangeEvent) => {
    setInfractionsOffset(0);
    setSearchId(text.trim().length == 0 ? null : text.trim());
  };

  const onPageChange = (_nextPage: number) => {
    let nextPage = Math.max(0, _nextPage);
    nextPage = Math.min(lastPage, nextPage);
    setExpandedRows(new Set([]));
    setInfractionsOffset(nextPage * PageSize);
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.searchContainer)}>
          <div className={css(styles.title)}>Infractions</div>

          <SearchBox
            className={css(styles.searchBox)}
            onChange={onOrderIdChange}
            placeholder={i`Search for Product ID/ Infraction ID/ Order ID/ Ticket ID`}
            height={30}
            defaultValue={searchId}
            tokenize
          />
        </div>

        <div className={css(styles.buttons)}>
          <PageIndicator
            key="infractions_page_indicator"
            className={css(styles.pageIndicator)}
            isLoading={response == null}
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
              <InfractionsFilter
                availableReasons={availableFines}
                className={css(styles.filterBody)}
                hasActiveFilters={hasActiveFilters}
                infractionFines={infractionFines}
                infractionStatesOptions={infractionStatesOptions}
              />
            )}
            position="bottom right"
            contentWidth={850}
          >
            <FilterButton
              style={styles.filterButton}
              isActive={hasActiveFilters}
            />
          </Popover>
        </div>
      </div>
      {fines == null || undefined ? (
        <LoadingIndicator />
      ) : (
        <InfractionsTable
          fines={fines}
          expandedRows={Array.from(expandedRows)}
          onRowExpandToggled={onRowExpandToggled}
        />
      )}
    </div>
  );
};

export default observer(Infractions);

const useStylesheet = (props: InfractionsProps) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        filterBody: {
          // overflow: "scroll",
          // padding: "0px 20px"
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
          // lineHeight: 1.33,
          color: palettes.textColors.Ink,
          marginRight: 25,
          userSelect: "none",
          alignSelf: "center",
        },
        searchBox: {
          fontWeight: fonts.weightBold,
          "@media (min-width: 900px)": {
            minWidth: 400,
          },
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
        },
        filterButton: {
          alignSelf: "stretch",
          marginRight: 15,
          padding: "4px 15px",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        filterDropdown: {
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
