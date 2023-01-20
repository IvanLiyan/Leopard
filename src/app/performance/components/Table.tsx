import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { PER_PAGE_LIMIT } from "@performance/toolkit/enums";
import { useTheme } from "@core/stores/ThemeStore";

export type TableColumn<RowType> = {
  key: string;
  title?: string;
  align?: "left" | "center" | "right";
  titleRender?: () => JSX.Element;
  render?: (props: {
    row: RowType;
    index: number;
  }) => JSX.Element | string | number;
};

interface Props<RowType> {
  readonly children?: React.ReactNode;
  data: ReadonlyArray<RowType>;
  columns: ReadonlyArray<TableColumn<RowType>>;
  width?: number;
  pagination?: {
    pageChange?: (newPage: number) => void;
    totalCount: number;
    pageNo?: number;
  };
}

const CustomTable = <RowType,>(props: Props<RowType>): JSX.Element => {
  const { columns, data, pagination, width } = props;
  const { borderPrimary, surfaceLightest, surfaceLight } = useTheme();
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
        sx={{
          backgroundColor: surfaceLightest,
          borderRadius: "4px",
          border: `solid 1px ${borderPrimary}`,
          boxShadow: "none",
          maxWidth: width ? `${width}px` : undefined,
        }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: surfaceLight }}>
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
                      textAlign: column.align || "right",
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
                        row,
                        index: rowIndex,
                      })) ||
                    // @ts-ignore code is not type safe but we only pass in keys that correspond to row
                    row[key];
                  return (
                    <TableCell
                      key={columnIndex}
                      style={{
                        padding: "8px",
                        textAlign: column.align || "right",
                      }}
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

export default CustomTable;
