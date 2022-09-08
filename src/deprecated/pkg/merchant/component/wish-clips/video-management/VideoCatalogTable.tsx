import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery, useMutation } from "@apollo/client";
import numeral from "numeral";

/* Lego Components */
import {
  Layout,
  LoadingIndicator,
  Table,
  PageIndicator,
  FormSelect,
  CellInfo,
  Pager,
  H7,
  TextInputWithSelect,
  Option,
  TableAction,
  MultiSecondaryButton,
  Text,
} from "@ContextLogic/lego";

import PageGuide from "@merchant/component/core/PageGuide";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";
import {
  VIDEO_CATALOG_QUERY,
  VideoCatalogRequestData,
  VideoCatalogResponseData,
  VIDEO_CATEGORIES,
  VideoCategoryType,
  VideoCategoryLabel,
  VideoCategoryStatusMapping,
  REMOVE_VIDEO_MUTATION,
  RemoveVideoRequestData,
  RemoveVideoResponseData,
} from "@toolkit/wish-clips/video-management";
import { SortOrderType, VideoSearchType } from "@schema/types";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useToastStore } from "@stores/ToastStore";

import Link from "@next-toolkit/Link";

const noDataMessage = i`N/A`;
const SearchOptions: ReadonlyArray<Option<VideoSearchType>> = [
  {
    value: "NAME",
    text: i`Video name`,
  },
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
  {
    value: "ID",
    text: i`Video ID`,
  },
];

const SortOptions: ReadonlyArray<{
  readonly value: SortOrderType;
  readonly text: string;
}> = [
  {
    value: "DESC",
    text: i`From new to old`,
  },
  {
    value: "ASC",
    text: i`From old to new`,
  },
];

const VideoThumbnailHeight = 48;
const VideoThumbnailWidth = 48;

type TableData = {
  readonly title?: string | null;
  readonly url: string;
  readonly previewUrl?: string | null;
  readonly id: string;
  readonly productId: string;
  readonly viewCount?: string | null;
  readonly likeCount?: string | null;
  readonly averageWatchTime?: string | null;
  readonly rejectionReason?: string | null;
};

type Props = BaseProps & {
  readonly onEditVideo: (value: string | null | undefined) => void;
};

const VideoCatalogTable = (props: Props) => {
  const { className, style, onEditVideo } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const toastStore = useToastStore();

  const [offsetQuery, setOffsetQuery] = useIntQueryParam("offset");
  const [query, setQuery] = useStringQueryParam("query");
  const [type, setType] = useStringEnumQueryParam<VideoCategoryType>(
    "type",
    "LIVE"
  );
  const [searchType, setSearchType] =
    useStringEnumQueryParam<VideoSearchType>("search_type");
  const [sortOrderQuery, setSortOrderQuery] =
    useStringEnumQueryParam<SortOrderType>("sort");

  const offset = offsetQuery || 0;
  const sortOrder = sortOrderQuery || "DESC";
  const limit = 10;

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const { data, loading, refetch } = useQuery<
    VideoCatalogResponseData,
    VideoCatalogRequestData
  >(VIDEO_CATALOG_QUERY, {
    variables: {
      offset,
      limit,
      sort: {
        order: sortOrder,
        field: "ID",
      },
      searchType,
      query: searchQuery,
      videoStates: VideoCategoryStatusMapping[type],
    },
  });

  const [removeVideo] = useMutation<
    RemoveVideoResponseData,
    RemoveVideoRequestData
  >(REMOVE_VIDEO_MUTATION);

  const totalVideos = data?.productCatalog?.videoService.videoCount || 0;

  const tableData: ReadonlyArray<TableData> = (
    data?.productCatalog?.videoService.videos || []
  ).map((data) => ({
    title: data.title,
    url: data.highQuality?.url || data.source.url,
    previewUrl: data.preview?.url,
    id: data.id,
    productId: data.productId,
    viewCount:
      data.viewCount != null ? numeral(data.viewCount).format("0,0") : null,
    likeCount:
      data.likeCount != null ? numeral(data.likeCount).format("0,0") : null,
    averageWatchTime:
      data.averageWatchTime != null
        ? ci18n(
            "s means seconds",
            "{%1=number of seconds}s",
            numeral(data.averageWatchTime).format("0,0")
          )
        : null,
    rejectionReason: data.rejectionReason,
  }));

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffsetQuery(nextPage * limit);
    await refetch();
  };

  const confirmRemove = async (videoId: string, productId: string) => {
    new ConfirmationModal(() => (
      <Layout.FlexColumn style={styles.confirmation}>
        <Text>
          Removing this video will permanently delete the file and associated
          data from the platform. This action cannot be undone. Are you sure you
          want to proceed?
        </Text>
      </Layout.FlexColumn>
    ))
      .setHeader({ title: i`Remove Video` })
      .setAction(
        i`Confirm`,
        async () => await onRemoveVideo(videoId, productId)
      )
      .setCancel(i`Cancel`)
      .setWidthPercentage(0.4)
      .render();
  };

  const onRemoveVideo = async (videoId: string, productId: string) => {
    const { data } = await removeVideo({
      variables: {
        input: {
          videoId,
          productId,
        },
      },
    });

    if (data?.productCatalog?.removeVideo.ok) {
      navigationStore.reload({ fullReload: true });
      return;
    }

    const message = data?.productCatalog?.removeVideo.message;

    return toastStore.negative(message || i`Something went wrong`);
  };

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "edit",
      name: i`Edit`,
      apply: ([row]: ReadonlyArray<TableData>) => onEditVideo(row.id),
      canApplyToRow: () => true,
    },
    {
      key: "remove",
      name: i`Remove`,
      apply: async ([row]: ReadonlyArray<TableData>) =>
        await confirmRemove(row.id, row.productId),
      canApplyToRow: () => true,
    },
  ];

  const renderRowActions = ({
    row,
    actions,
    apply,
  }: {
    row: TableData;
    actions: ReadonlyArray<TableAction>;
    apply: (action: TableAction) => Promise<void>;
  }) => {
    return (
      <MultiSecondaryButton
        visibleButtonCount={2}
        style={styles.actionButtons}
        actions={actions.map((action) => ({
          text: action.name as string,
          onClick: async () => await apply(action),
          href: "#",
        }))}
      />
    );
  };

  const renderTab = (text: string) => <H7>{text}</H7>;

  const renderTabs = () =>
    VIDEO_CATEGORIES.map((type) => (
      <Pager.Content
        tabKey={type}
        titleValue={() => renderTab(VideoCategoryLabel[type])}
      >
        <LoadingIndicator loadingComplete={!loading}>
          <Table
            data={tableData}
            actions={type === "PENDING_REVIEW" ? undefined : tableActions}
            renderRowActions={
              type === "PENDING_REVIEW" ? undefined : renderRowActions
            }
            noDataMessage={i`No videos`}
          >
            <Table.Column
              _key="url"
              columnKey="url"
              title={i`Video name`}
              noDataMessage={noDataMessage}
            >
              {({ row }: CellInfo<TableData, TableData>) => (
                <Layout.FlexRow>
                  {row.previewUrl && (
                    <Layout.FlexColumn
                      style={styles.videoThumbnailContainer}
                      alignItems="center"
                    >
                      <video height="100%" muted>
                        <source src={row.previewUrl} />
                      </video>
                    </Layout.FlexColumn>
                  )}
                  {row.title ? (
                    <Link href={row.url} openInNewTab>
                      {row.title.length > 24
                        ? `${row.title.slice(0, 24)}...`
                        : row.title}
                    </Link>
                  ) : (
                    <Link href={row.url} openInNewTab>
                      Untitled
                    </Link>
                  )}
                </Layout.FlexRow>
              )}
            </Table.Column>
            <Table.ObjectIdColumn
              _key="id"
              columnKey="id"
              title={i`Video ID`}
              showFull={false}
              align="center"
            />
            {type !== "DECLINED" && (
              <Table.Column
                _key="viewCount"
                columnKey="viewCount"
                title={i`Views`}
                noDataMessage={noDataMessage}
                align="center"
              />
            )}
            {type !== "DECLINED" && (
              <Table.Column
                _key="likeCount"
                columnKey="likeCount"
                title={i`Likes`}
                noDataMessage={noDataMessage}
                align="center"
              />
            )}
            {type !== "DECLINED" && (
              <Table.Column
                _key="averageWatchTime"
                columnKey="averageWatchTime"
                title={i`Avg. Watch Time`}
                noDataMessage={noDataMessage}
                align="center"
              />
            )}
            {type === "DECLINED" && (
              <Table.Column
                _key="rejectionReason"
                columnKey="rejectionReason"
                title={i`Declined Reason`}
                noDataMessage={noDataMessage}
                align="center"
              />
            )}
          </Table>
        </LoadingIndicator>
      </Pager.Content>
    ));

  return (
    <PageGuide style={[className, style]}>
      <Layout.FlexColumn>
        <Layout.FlexRow
          justifyContent="space-between"
          style={[styles.rowItem, styles.tableControl]}
        >
          <Layout.FlexRow>
            <TextInputWithSelect
              style={styles.tableControlItem}
              selectProps={{
                style: styles.searchSelect,
                selectedValue: searchType,
                options: SearchOptions,
                onSelected(item: VideoSearchType) {
                  setSearchType(item);
                },
              }}
              textInputProps={{
                icon: "search",
                placeholder: i`Search`,
                value: query,
                onChange({ text }) {
                  setQuery(text);
                  setOffsetQuery(0);
                  if (text.trim().length > 0) {
                    setSearchType(searchType);
                  } else {
                    setSearchType(null);
                  }
                },
              }}
            />
          </Layout.FlexRow>
          <Layout.FlexRow>
            <PageIndicator
              onPageChange={onPageChange}
              hasPrev={offset != 0}
              hasNext={totalVideos ? offset + limit < totalVideos : false}
              rangeStart={offset + 1}
              rangeEnd={totalVideos ? Math.min(totalVideos, offset + limit) : 0}
              totalItems={totalVideos}
              currentPage={Math.ceil(offset / limit)}
              style={styles.tableControlItem}
            />
            <FormSelect
              icon="sort"
              options={SortOptions}
              onSelected={(value: SortOrderType) => setSortOrderQuery(value)}
              style={styles.tableControlItem}
              selectedValue={sortOrderQuery}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Pager
          hideHeaderBorder={false}
          selectedTabKey={type}
          onTabChange={async (tab: VideoCategoryType) => setType(tab)}
          condenseMode
          tabsRowStyle={{ ...styles.tabsRow }}
          tabsPadding="0px 44px 0px 0px"
          style={styles.rowItem}
        >
          {renderTabs()}
        </Pager>
      </Layout.FlexColumn>
    </PageGuide>
  );
};

const useStylesheet = () => {
  const { surfaceDarkest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        tableControl: {
          "@media (max-width: 900px)": {
            flexDirection: "column",
            flexAlign: "center",
          },
        },
        tableControlItem: {
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        searchSelect: {
          width: "50%",
        },
        rowItem: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        tabsRow: {
          background: "transparent",
        },
        videoThumbnailContainer: {
          overflow: "hidden",
          width: VideoThumbnailWidth,
          height: VideoThumbnailHeight,
          borderRadius: 4,
          backgroundColor: surfaceDarkest,
          margin: "16px 0px",
          marginRight: 8,
        },
        actionButtons: {
          paddingRight: 16,
        },
        confirmation: {
          padding: "24px 0px",
        },
      }),
    [surfaceDarkest]
  );
};

export default observer(VideoCatalogTable);
