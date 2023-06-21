import { observer } from "mobx-react";
import React, { useState, useMemo } from "react";
import { InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Image from "@core/components/Image";
import { TableColumn } from "src/app/performance-cn/components/Table";
import { Table } from "src/app/performance-cn/components";
import { LoadingIndicator } from "@ContextLogic/lego";
import { useQuery } from "@apollo/client";
import {
  PRODUCT_RATING_LISTING_DATA_QUERY,
  AugmentedProductRatingListing,
  ProductRatingListingResponseData,
  ProductRatingListingRequestArgs,
  ProductRatingListingTabData,
} from "src/app/performance-cn/toolkit/rating";
import commonStyles from "@performance-cn/styles/common.module.css";
import { PER_PAGE_LIMIT } from "src/app/performance-cn/toolkit/enums";
import Link from "@deprecated/components/Link";
import { wishURL, contestImageURL } from "@core/toolkit/url";
import { round } from "src/app/core/toolkit/stringUtils";

const ProductView: React.FC = () => {
  const [pageNo, setPageNo] = useState(0);
  const [productType, setProductType] =
    useState<ProductRatingListingTabData>("BestRated");
  const handleChange = (
    event: SelectChangeEvent<ProductRatingListingTabData>,
  ) => {
    setProductType(event.target.value as ProductRatingListingTabData);
    setPageNo(0);
  };

  const { data, loading: loading } = useQuery<
    ProductRatingListingResponseData,
    ProductRatingListingRequestArgs
  >(PRODUCT_RATING_LISTING_DATA_QUERY, {
    variables: {
      offset: pageNo * PER_PAGE_LIMIT,
      limit: PER_PAGE_LIMIT,
      listingTab: productType,
    },
    notifyOnNetworkStatusChange: true,
  });

  const ProductRatingData:
    | ReadonlyArray<AugmentedProductRatingListing>
    | undefined = useMemo(() => {
    return data?.currentMerchant?.storeStats?.productRatings.map((item) => {
      const { productId, average30dRating, ratings, sales } = item;
      return {
        productId,
        average30dRating,
        ratings,
        sales,
        open: false,
      };
    });
  }, [data?.currentMerchant?.storeStats?.productRatings]);

  const columns: Array<TableColumn<AugmentedProductRatingListing>> = [
    {
      key: "productId",
      title: i`Product Id`,
      align: "left",
      render: ({ row: { productId } }) => {
        const url = wishURL(`/product/${productId}`);
        return (
          <div className={commonStyles.productColumn}>
            <Image
              src={contestImageURL(String(productId), "tiny")}
              alt={i`Picture of product`}
            />
            <Link href={url} style={{ marginLeft: "10px" }} openInNewTab>
              {productId}
            </Link>
          </div>
        );
      },
    },
    {
      key: "average30dRating",
      align: "left",
      titleRender: () => <span>30-Day Average Rating</span>,
      render: ({ row: { average30dRating } }) => (
        <div style={{ textAlign: "left" }}>
          {round(String(average30dRating), 2)}
        </div>
      ),
    },
    {
      key: "ratings",
      align: "left",
      titleRender: () => <span>Number of Ratings</span>,
      render: ({ row: { ratings } }) => (
        <div style={{ textAlign: "left" }}>{String(ratings)}</div>
      ),
    },
    {
      key: "sales",
      align: "left",
      titleRender: () => <span>Sales</span>,
      render: ({ row: { sales } }) => (
        <div style={{ textAlign: "left" }}>{String(sales)}</div>
      ),
    },
    {
      key: "action",
      align: "left",
      titleRender: () => <span>Actions</span>,
      render: ({ row: { productId } }) => {
        const url = wishURL(`/product/profile/${productId}#tab=overview`);
        return (
          <div style={{ textAlign: "left" }} className={commonStyles.linkStyle}>
            <Link href={url} openInNewTab>
              View Product Profile
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className={commonStyles.toolkit} style={{ height: "auto" }}>
        <div style={{ flexDirection: "column" }}>
          <FormControl sx={{ margin: "20px 10px 10px 0px", width: 280 }}>
            <InputLabel>Filter By Types</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              value={productType}
              label="Filter By Types"
              onChange={handleChange}
            >
              <MenuItem value={"BestRated"}>View Best Rated Products</MenuItem>
              <MenuItem value={"WorstRated"}>
                View Worst Rated Products
              </MenuItem>
              <MenuItem value={"MostReviewed"}>
                View Most Reviewed Products
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : ProductRatingData ? (
        <Table
          data={ProductRatingData}
          columns={columns}
          pagination={{
            pageNo,
            totalCount:
              data?.currentMerchant?.storeStats?.productRatingsCount || 0,
            pageChange: (pageNo: number) => {
              setPageNo(pageNo);
            },
          }}
        />
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default observer(ProductView);
