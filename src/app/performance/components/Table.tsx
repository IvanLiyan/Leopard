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
import { AugmentedProduct } from "@performance/stores/ProductStore";

export type TableColumn = {
  key: string;
  title?: string;
  titleRender?: () => JSX.Element;
  render?: (props: {
    value: unknown;
    row: AugmentedProduct;
    index: number;
  }) => JSX.Element | string | number;
};

interface Props {
  readonly children?: React.ReactNode;
  data: ReadonlyArray<AugmentedProduct>;
  columns: ReadonlyArray<TableColumn>;
  width?: number;
  pagination?: {
    pageChange?: (newPage: number) => undefined;
    totalCount: number;
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
        <Table sx={width ? {} : { minWidth: 1400 }}>
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
          {data.length && (
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
          )}
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          page={page}
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

export default CustomTable;
