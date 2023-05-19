import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { Rating, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "@apollo/client";
import { TableColumn } from "@performance/components/Table";
import { Table, Title } from "@performance/components/index";
import { LoadingIndicator } from "@ContextLogic/lego";
import { merchFeUrl } from "@core/toolkit/router";
import {
  STORE_RATING_LISTING_DATA_QUERY,
  PickedStoreRatingListing,
  StoreRatingListingResponseData,
  StoreRatingListingRequestArgs,
} from "@performance/toolkit/rating";
import { PER_PAGE_LIMIT } from "@performance/toolkit/enums";
import commonStyles from "@performance/styles/common.module.css";
import Link from "@core/components/Link";

const StoreRating: React.FC = () => {
  const [pageNo, setPageNo] = useState(0);
  const [countTitle, setCountTitle] = useState("");
  const [filterByStars, setFilterByStars] = useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setFilterByStars(event.target.value);
    setPageNo(0);
  };

  const { data, loading } = useQuery<
    StoreRatingListingResponseData,
    StoreRatingListingRequestArgs
  >(STORE_RATING_LISTING_DATA_QUERY, {
    variables: {
      offset: pageNo * PER_PAGE_LIMIT,
      limit: PER_PAGE_LIMIT,
      filterByStars: Number(filterByStars),
    },
    notifyOnNetworkStatusChange: true,
  });

  const StoreRatingData: ReadonlyArray<PickedStoreRatingListing> | undefined =
    useMemo(() => {
      const storeRatingsCount =
        data?.currentMerchant?.storeStats?.storeRatingsCount || 0;
      setCountTitle(i`${storeRatingsCount} Reviews`);
      return data?.currentMerchant?.storeStats?.storeRatings.map((item) => {
        const { orderIds, date, rating, comment, refundReason } = item;
        return {
          orderIds,
          date,
          rating,
          comment,
          refundReason,
        };
      });
    }, [
      data?.currentMerchant?.storeStats?.storeRatings,
      data?.currentMerchant?.storeStats?.storeRatingsCount,
    ]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<PickedStoreRatingListing>> = [
      {
        key: "orderIds",
        align: "left",
        titleRender: () => <span>Order IDs</span>,
        render: ({ row: { orderIds } }) => {
          const element = orderIds.map((id: string) => {
            return (
              <div
                className={commonStyles.linkStyle}
                style={{
                  display: "flex",
                  textAlign: "left",
                }}
                key={id}
              >
                <Link href={merchFeUrl(`/order/${id}`)} openInNewTab>
                  {id}
                </Link>
              </div>
            );
          });
          return <div>{element}</div>;
        },
      },
      {
        key: "date",
        align: "left",
        titleRender: () => <span>Date</span>,
        render: ({ row: { date } }) => (
          <div style={{ textAlign: "left" }}>{date}</div>
        ),
      },
      {
        key: "rating",
        align: "left",
        titleRender: () => <span>Rating</span>,
        render: ({ row: { rating } }) => (
          <div style={{ textAlign: "left" }}>
            <Rating value={rating} readOnly />
          </div>
        ),
      },
      {
        key: "comment",
        align: "left",
        titleRender: () => <span>Comment</span>,
        render: ({ row: { comment } }) => (
          <div style={{ textAlign: "left" }}>{comment}</div>
        ),
      },
      {
        key: "refundReason",
        align: "left",
        titleRender: () => <span>Refund Reason</span>,
        render: ({ row: { refundReason } }) => (
          <div style={{ textAlign: "left" }}>
            {refundReason ? refundReason : "-"}
          </div>
        ),
      },
    ];
    return columns;
  }, []);

  return (
    <>
      <div
        className={commonStyles.toolkit}
        style={{ height: "auto", paddingBottom: 0 }}
      >
        <FormControl sx={{ margin: "20px 10px 10px 0px", width: "120px" }}>
          <InputLabel>Filter By Stars</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            value={filterByStars}
            label="Filter By Stars"
            onChange={handleChange}
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>1 Stars</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
          </Select>
        </FormControl>
      </div>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : StoreRatingData ? (
        <div>
          <Title className={commonStyles.title}>{countTitle}</Title>
          <Table
            data={StoreRatingData}
            columns={columns}
            pagination={{
              pageNo,
              totalCount:
                data?.currentMerchant?.storeStats?.storeRatingsCount || 0,
              pageChange: (pageNo: number) => {
                setPageNo(pageNo);
              },
            }}
          />
        </div>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default observer(StoreRating);
