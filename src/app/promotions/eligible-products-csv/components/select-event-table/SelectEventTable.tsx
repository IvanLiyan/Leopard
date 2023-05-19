import {
  CellInfo,
  Layout,
  Radio,
  SortOrder,
  Table,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n, cni18n } from "@core/toolkit/i18n";
import TableControl from "./TableControl";
import {
  MfpCampaignEventSortBy,
  MfpCampaignPromotionType,
  SortOrderType,
} from "@schema";
import {
  createCampaignEvents,
  EventTableData,
  GetCampaignEventsRequest,
  GetCampaignEventsResponse,
  GET_CAMPAIGN_EVENTS_QUERY,
} from "@promotions/eligible-products-csv/migrated-mfp-toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import EventCountries from "./EventCountries";
import ProductCategories from "./ProductCategories";
import {
  useDispatch,
  usePageState,
} from "@promotions/eligible-products-csv/StateContext";
import {
  ELIGIBLE_COUNTRIES_QUERY,
  EligibleCountriesQueryResponse,
} from "@promotions/eligible-products-csv/api/eligibleCountriesQuery";
import Skeleton from "@core/components/Skeleton";
import { Card, Text as AtlasText } from "@ContextLogic/atlas-ui";

type Props = BaseProps & {
  readonly eventTypes: ReadonlyArray<MfpCampaignPromotionType>;
};

const now = new Date().getTime() / 1000;

const SelectEventTable = (props: Props) => {
  /* begin logic to adapt to Leopard logic handling */
  const state = usePageState();
  const dispatch = useDispatch();
  const currentEventId = state.eventId;
  const onSelectRow = (event: EventTableData) => {
    dispatch({ type: "SET_EVENT_ID", eventId: event.eventId });
  };

  const {
    data: eligibleCountriesQueryData,
    loading: eligibleCountriesQueryLoading,
    error: eligibleCountriesQueryError,
  } = useQuery<EligibleCountriesQueryResponse>(ELIGIBLE_COUNTRIES_QUERY);

  const currentMerchant = eligibleCountriesQueryData?.currentMerchant;
  const countriesShippedTo =
    (currentMerchant == null ||
    currentMerchant.shippingSettings == null ||
    currentMerchant.shippingSettings.length == 0
      ? null
      : currentMerchant.shippingSettings.map(({ country: { code, name } }) => ({
          code,
          name,
        }))) || [];
  const eligibleCountries = countriesShippedTo.map((country) => country.code);
  /* end logic to adapt to Leopard logic handling */

  const { eventTypes } = props;
  const styles = useStylesheet();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sortField, setSortField] =
    useState<MfpCampaignEventSortBy>("START_TIME");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("ASC");
  const [promotionTypes] =
    useState<ReadonlyArray<MfpCampaignPromotionType>>(eventTypes);

  const {
    data,
    loading,
    error: getCampaignEventsQueryError,
  } = useQuery<GetCampaignEventsResponse, GetCampaignEventsRequest>(
    GET_CAMPAIGN_EVENTS_QUERY,
    {
      variables: {
        offset,
        limit,
        sort: {
          field: sortField,
          order: sortOrder,
        },
        startAtMin: {
          unix: now,
        },
        submitAtMin: {
          unix: now,
        },
        promotionTypes,
      },
    },
  );

  const events = createCampaignEvents(data?.mfp?.campaignEvents);
  const total = data?.mfp?.campaignEventsCount || 0;

  const canSelect = (row: EventTableData): boolean => {
    return row.countries.some((country) => eligibleCountries.includes(country));
  };

  const onFieldSortToggled = (field: MfpCampaignEventSortBy) => {
    return (sortOrder: SortOrder) => {
      setSortField(field);
      setSortOrder(sortOrder === "asc" ? "ASC" : "DESC");
    };
  };

  const getSortOrderForField = (field: MfpCampaignEventSortBy) => {
    if (sortField === field) {
      return sortOrder === "ASC" ? "asc" : "desc";
    }
    return "not-applied";
  };

  if (eligibleCountriesQueryLoading || loading) {
    return <Skeleton height={250} />;
  }

  if (eligibleCountriesQueryError || getCampaignEventsQueryError) {
    return <AtlasText variant="bodyLStrong">Something went wrong.</AtlasText>;
  }

  return (
    <Card>
      <Table
        style={{ border: "none" }}
        data={events}
        overflowY="hidden"
        rowDataCy={(row: EventTableData) => {
          return `event_${row.eventId}`;
        }}
      >
        <Table.Column
          _key="eventName"
          columnKey="eventName"
          title={ci18n("Name of promotional event", "Event Name")}
          columnDataCy="column-event-name"
        >
          {({ row }: CellInfo<number, EventTableData>) => (
            <Layout.FlexRow
              style={[styles.event, !canSelect(row) && styles.disabled]}
              onClick={canSelect(row) ? () => onSelectRow(row) : undefined}
            >
              <Radio checked={currentEventId === row.eventId} />
              <Text>{row.eventName}</Text>
            </Layout.FlexRow>
          )}
        </Table.Column>
        <Table.Column
          _key="duration"
          columnKey="duration"
          title={ci18n("Number of days", "Duration")}
          columnDataCy="column-duration"
        >
          {({ row }: CellInfo<number, EventTableData>) => (
            <Text>
              {cni18n(
                "Number of days",
                row.duration,
                "1 day",
                "{%1=number of days} days",
              )}
            </Text>
          )}
        </Table.Column>
        <Table.Column
          _key="date"
          columnKey="startDate"
          title={ci18n("Calendar date", "Date")}
          sortOrder={getSortOrderForField("START_TIME")}
          onSortToggled={onFieldSortToggled("START_TIME")}
          columnDataCy="column-date"
        >
          {({ row }: CellInfo<number, EventTableData>) => (
            <Text>
              {row.startDate.formatted} - {row.endDate.formatted}
            </Text>
          )}
        </Table.Column>
        <Table.Column
          _key="deadline"
          columnKey="deadline.formatted"
          title={ci18n("Deadline date", "Submission Deadline")}
          sortOrder={getSortOrderForField("SUBMISSION_DEADLINE")}
          onSortToggled={onFieldSortToggled("SUBMISSION_DEADLINE")}
          columnDataCy="column-deadline"
        />

        <Table.Column
          _key="countries"
          columnDataCy="column-countries"
          columnKey="countries"
          title={ci18n("Countries", "Countries")}
          multiline
          width={200}
        >
          {({ row }: CellInfo<number, EventTableData>) => (
            <EventCountries countries={row.countries} />
          )}
        </Table.Column>
        <Table.Column
          _key="categories"
          columnKey="categories"
          title={ci18n("Categories", "Categories")}
          multiline
          width={300}
          columnDataCy="column-categories"
        >
          {({ row }: CellInfo<number, EventTableData>) =>
            row.categories.length === 0 ? (
              ci18n("All product categories", "All Categories")
            ) : (
              <ProductCategories
                categories={row.categories.map((category) => category.name)}
              />
            )
          }
        </Table.Column>
        <Table.Column
          _key="discountPercentage"
          columnKey="discountPercentage"
          title={ci18n("Price discount rate", "Minimum Discount")}
          columnDataCy="column-discount-percentage"
        >
          {({ row }: CellInfo<number, EventTableData>) => (
            <Text>{numeral(row.discountPercentage / 100).format("0%")}</Text>
          )}
        </Table.Column>
      </Table>
      <TableControl
        limit={limit}
        offset={offset}
        total={total}
        onLimitChange={(l) => setLimit(l)}
        onOffsetChange={(o) => setOffset(o)}
      />
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        event: {
          cursor: "pointer",
          gap: 8,
        },
        disabled: {
          opacity: 0.6,
          cursor: "not-allowed",
        },
      }),
    [],
  );
};

export default observer(SelectEventTable);
