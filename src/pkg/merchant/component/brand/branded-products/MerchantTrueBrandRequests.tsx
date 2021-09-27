import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { merchantGetTrueBrandRequests } from "@merchant/api/brand/true-brands";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { externalURL } from "@toolkit/url";

/* Relative Imports */
import RequestStateLabel from "./merchant-true-brand-requests/RequestStateLabel";
import MerchantTrueBrandRequestsDetailRow from "./merchant-true-brand-requests/MerchantTrueBrandRequestsDetailRow";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import {
  FileSchema,
  MerchantTrueBrandRequestObject,
} from "@merchant/api/brand/true-brands";
import { TrademarkCountryCode } from "@schema/types";

type MerchantTrueBrandRequestsProps = BaseProps & {
  readonly acceptedTrademarkCountries: ReadonlyArray<TrademarkCountryCode>;
};

const MerchantTrueBrandRequests = ({
  acceptedTrademarkCountries,
  style,
}: MerchantTrueBrandRequestsProps) => {
  const PAGE_SIZE = 10;

  const styles = useStylesheet();
  const [offset, setOffset] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const [response] = useRequest(
    merchantGetTrueBrandRequests({
      count: PAGE_SIZE,
      offset,
    })
  );

  const total = response?.data?.total;
  const remaining = total ? total - offset : 0;

  const requests = response?.data?.requests;

  if (requests == null) {
    return <LoadingIndicator />;
  }

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const renderExpandedRow = (request: MerchantTrueBrandRequestObject) => (
    <MerchantTrueBrandRequestsDetailRow
      request={request}
      acceptedTrademarkCountries={acceptedTrademarkCountries}
    />
  );

  return (
    <div className={css(style)}>
      <Table
        data={requests}
        noDataMessage={i`No Brand Suggestions Found`}
        rowHeight={65}
        highlightRowOnHover
        rowExpands={() => true}
        expandedRows={Array.from(expandedRows)}
        onRowExpandToggled={onRowExpandToggled}
        renderExpanded={renderExpandedRow}
      >
        <Table.DatetimeColumn
          title={i`Suggest Date`}
          columnKey={"date_requested"}
          format={"MM/DD/YYYY"}
        />
        <Table.DatetimeColumn
          title={i`Resubmit Date`}
          columnKey={"date_resubmitted"}
          format={"MM/DD/YYYY"}
        />
        <Table.Column title={i`Brand Name`} columnKey={"brand_name"} />
        <Table.Column title={i`Logo`} columnKey={"brand_logo_url"}>
          {({ row }) => (
            <img
              src={row.brand_logo_file_url ?? row.brand_logo_url ?? null}
              className={css(styles.image)}
              alt={i`${row.brand_name}'s Logo`}
            />
          )}
        </Table.Column>
        <Table.Column
          title={i`Product Packaging`}
          columnKey={"product_packaging_images"}
        >
          {({ row }) => {
            return row.product_packaging_images.map((image: FileSchema) => (
              <Link href={image.url}>{image.filename}</Link>
            ));
          }}
        </Table.Column>
        <Table.LinkColumn
          title={i`Brand Website`}
          columnKey={"brand_url"}
          href={({
            value,
          }: CellInfo<
            MerchantTrueBrandRequestObject["brand_url"],
            MerchantTrueBrandRequestObject
          >) => externalURL(value)}
          text={({
            value,
          }: CellInfo<
            MerchantTrueBrandRequestObject["brand_url"],
            MerchantTrueBrandRequestObject
          >) => value}
          openInNewTab
        />
        <Table.Column title={i`Status`} columnKey={"state"}>
          {({ row }) => <RequestStateLabel state={row.state} />}
        </Table.Column>
      </Table>

      <PageIndicator
        className={css(styles.pageIndicator)}
        rangeStart={1 + offset}
        rangeEnd={offset + Math.min(PAGE_SIZE, remaining)}
        totalItems={total}
        hasNext={remaining > PAGE_SIZE}
        hasPrev={offset > 0}
        currentPage={Math.floor(offset / PAGE_SIZE)}
        onPageChange={(page) => {
          setOffset(page * PAGE_SIZE);
          setExpandedRows(new Set([]));
        }}
        isLoading={response === null}
      />
    </div>
  );
};
export default observer(MerchantTrueBrandRequests);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        image: {
          height: 40,
          objectFit: "contain",
        },
        pageIndicator: {
          marginTop: 20,
          float: "right",
        },
        tip: {
          marginBottom: 30,
        },
      }),
    []
  );
