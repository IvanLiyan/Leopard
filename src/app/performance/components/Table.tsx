import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { PER_PAGE_LIMIT } from "@performance/toolkit/enums";
import { Tooltip } from "@mui/material";
import { forwardRef } from "react";
import UnwrappedIcon, { IconProps } from "@core/components/Icon";
import { formatPercentage, addCommas } from "@core/toolkit/stringUtils";
import commonStyles from "@performance/styles/common.module.css";
import {
  AugmentedSalesAggregate,
  AugmentedSalesBreakdown,
} from "@performance/stores/Sales";
import { AugmentedProduct } from "@performance/stores/Product";
import { useTheme } from "@core/stores/ThemeStore";

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => (
  // extra div because Icon does not currently forward refs, changes required at the Zeus level
  <span ref={ref}>
    <UnwrappedIcon {...props} />
  </span>
));
Icon.displayName = "Icon";

export type TableColumn = {
  key: string;
  title?: string;
  titleRender?: () => JSX.Element;
  render?: (props: {
    value: unknown;
    row: AugmentedProduct | AugmentedSalesAggregate | AugmentedSalesBreakdown;
    index: number;
  }) => JSX.Element | string | number;
};

interface Props {
  readonly children?: React.ReactNode;
  data: ReadonlyArray<
    AugmentedProduct | AugmentedSalesAggregate | AugmentedSalesBreakdown
  >;
  columns: ReadonlyArray<TableColumn>;
  width?: number;
  pagination?: {
    pageChange?: (newPage: number) => void;
    totalCount: number;
    pageNo?: number;
  };
}

const CustomTable = (props: Props): JSX.Element => {
  const { columns, data, width, pagination } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(PER_PAGE_LIMIT);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    pagination?.pageChange?.(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={width ? { maxWidth: `${width}px` } : {}}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f3f3f3" }}>
              {columns.map((column) => {
                const displayHead =
                  (column.titleRender && column.titleRender()) || column.title;
                return (
                  <TableCell
                    key={column.key}
                    style={{
                      fontWeight: "bold",
                      padding: "8px",
                      verticalAlign: "top",
                    }}
                  >
                    {displayHead}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex: number) => {
                  const key = column.key;
                  const displayContent =
                    (column.render &&
                      column.render({
                        // @ts-ignore code is not type safe but we only pass in keys that correspond to row
                        value: row[key],
                        row,
                        index: rowIndex,
                      })) ||
                    // @ts-ignore code is not type safe but we only pass in keys that correspond to row
                    row[key];
                  return (
                    <TableCell
                      key={columnIndex}
                      style={{ padding: "8px", textAlign: "right" }}
                    >
                      {displayContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          page={pagination.pageNo == null ? page : pagination.pageNo}
          component="div"
          count={pagination.totalCount}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[PER_PAGE_LIMIT]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export const useSalesBaseColumn = (): ReadonlyArray<TableColumn> => {
  const { textBlack } = useTheme();
  const salesBaseColumn: ReadonlyArray<TableColumn> = [
    {
      key: "productImpressions",
      titleRender: () => (
        <>
          <span>Product Impressions</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times your products were viewed
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ value }) => {
        const valueCast =
          value as AugmentedSalesAggregate["productImpressions"];
        return valueCast == null ? "-" : addCommas(String(valueCast));
      },
    },
    {
      key: "addToCart",
      titleRender: () => (
        <>
          <span>Buy Button Clicks</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times the buy button is clicked
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ value }) => {
        const valueCast = value as AugmentedSalesAggregate["addToCart"];
        return valueCast == null ? "-" : addCommas(String(valueCast));
      },
    },
    {
      key: "addToCartConversion",
      titleRender: () => (
        <>
          <span>Buy Button CTR</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Buy button click divided by product impressions
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ value }) => {
        const valueCast =
          value as AugmentedSalesAggregate["addToCartConversion"];
        return valueCast == null
          ? "-"
          : formatPercentage(String(valueCast), "1", 4);
      },
    },
    {
      key: "orders",
      titleRender: () => (
        <>
          <span>Orders</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times your products were bought
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ value }) => {
        const valueCast = value as AugmentedSalesAggregate["orders"];
        return valueCast == null ? "-" : addCommas(String(valueCast));
      },
    },
    {
      key: "checkoutConversion",
      titleRender: () => (
        <>
          <span>Checkout Conversion</span>
          <Tooltip
            title={
              <div style={{ fontSize: "12px" }}>
                Orders divided by shopping cart impressions
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ value }) => {
        const valueCast =
          value as AugmentedSalesAggregate["checkoutConversion"];
        return valueCast == null
          ? "-"
          : formatPercentage(String(valueCast), "1", 2);
      },
    },
  ];

  return salesBaseColumn;
};

export default CustomTable;
