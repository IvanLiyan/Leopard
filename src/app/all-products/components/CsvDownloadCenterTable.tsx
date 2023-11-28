import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Button } from "@ContextLogic/atlas-ui";
/* Lego Components */
import { Layout, LoadingIndicator, Label, SearchBox } from "@ContextLogic/lego";
/* Model */
import { default as Table, TableColumn } from "@core/components/Table";
import { useQuery } from "@apollo/client";
import commonStyles from "@performance-cn/styles/common.module.css";
import {
  GET_DOWNLOAD_TOTAL_JOB_COUNTS,
  GetDownloadTotalJobCountsResponseType,
  GetDownloadTotalJobCountsRequestType,
  GET_DOWNLOAD_TOTAL_JOBS,
  GetDownloadTotalJobsResponseType,
  GetDownloadTotalJobsRequestType,
  CsVDownloadTableData,
} from "@all-products/toolkit";

const CsvdownloadCenterTable: React.FC = () => {
  const [pageNo, setPageNo] = useState(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const PER_PAGE_LIMIT = 10;
  const { data: tableCount } = useQuery<
    GetDownloadTotalJobCountsResponseType,
    GetDownloadTotalJobCountsRequestType
  >(GET_DOWNLOAD_TOTAL_JOB_COUNTS, {
    variables: { query: searchInput },
  });

  const { data: tableData, loading: tableLoading } = useQuery<
    GetDownloadTotalJobsResponseType,
    GetDownloadTotalJobsRequestType
  >(GET_DOWNLOAD_TOTAL_JOBS, {
    variables: {
      query: searchInput,
      offset: pageNo * PER_PAGE_LIMIT,
      limit: PER_PAGE_LIMIT,
    },
  });

  const ProductTableData: ReadonlyArray<CsVDownloadTableData> | undefined =
    useMemo(() => {
      return tableData?.productCatalog?.downloadJobs?.map((item) => {
        const {
          id,
          submittedDate,
          completedDate,
          jobType,
          status,
          downloadLink,
        } = item;
        return {
          id,
          submittedDate,
          completedDate,
          jobType,
          status,
          downloadLink,
        };
      });
    }, [tableData?.productCatalog?.downloadJobs]);

  const LabelStyle = (status: string) => {
    let bgColor = "#DDFEFF";
    let ftColor = "#074C50";
    switch (status) {
      case "Processing":
        bgColor = "#DDFEFF";
        ftColor = "#074C50";
        break;
      case "Failed":
        bgColor = "#FFCBC7";
        ftColor = "#4B1810";
        break;
      case "Ready":
        bgColor = "#D2FFE2";
        ftColor = "#073719";
        break;
      default:
        bgColor = "#DDFEFF";
        ftColor = "#074C50";
        break;
    }
    return (
      <Label
        style={{ height: 24, fontSize: 12, textAlign: "center" }}
        borderRadius={4}
        backgroundColor={bgColor}
        textColor={ftColor}
        text={status}
      />
    );
  };

  const columns: Array<TableColumn<CsVDownloadTableData>> = [
    {
      key: "id",
      title: i`Job ID`,
      align: "left",
      render: ({ row: { id } }) => (
        <div style={{ textAlign: "left" }}>{String(id)}</div>
      ),
    },
    {
      key: "submittedDate",
      title: i`Submitted time`,
      align: "left",
      render: ({ row: { submittedDate } }) =>
        submittedDate == null ? "-" : <div>{`${submittedDate.formatted}`}</div>,
    },
    {
      key: "completedDate",
      title: i`Completed time`,
      align: "left",
      render: ({ row: { completedDate } }) =>
        completedDate == null ? "-" : <div>{`${completedDate.formatted}`}</div>,
    },
    {
      key: "jobType",
      title: i`Type`,
      align: "left",
      render: ({ row: { jobType } }) => (
        <div style={{ textAlign: "left" }}>{jobType}</div>
      ),
    },
    {
      key: "status",
      title: i`Status`,
      align: "left",
      render: ({ row: { status } }) => (
        <div style={{ textAlign: "left" }}>
          {LabelStyle(status ? status : "Processing")}
        </div>
      ),
    },
    {
      key: "action",
      render: ({ row: { downloadLink } }) => {
        const disabled = downloadLink == null || downloadLink.length === 0;
        return (
          <div style={{ textAlign: "left" }} className={commonStyles.linkStyle}>
            <Button
              secondary
              href={!disabled ? downloadLink : undefined}
              disabled={disabled}
            >
              Download
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Layout.FlexRow style={{ marginTop: 24, marginBottom: 30 }}>
        <SearchBox
          icon="search"
          placeholder={i`Search for Job ID`}
          tokenize
          noDuplicateTokens
          maxTokens={1}
          defaultValue={searchInput}
          onTokensChanged={({ tokens }) => {
            if (tokens.length > 0) {
              setSearchInput(tokens[0].trim());
            } else {
              setSearchInput("");
            }
            setPageNo(0);
          }}
        />
      </Layout.FlexRow>
      {tableLoading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : ProductTableData ? (
        <Table
          data={ProductTableData}
          columns={columns}
          pagination={{
            pageNo: pageNo,
            totalCount: tableCount?.productCatalog?.downloadJobsCount || 0,
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

export default observer(CsvdownloadCenterTable);
