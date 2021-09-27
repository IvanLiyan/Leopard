import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import {
  Link,
  Table,
  Select,
  Popover,
  CopyButton,
  FilterButton,
  PageIndicator,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";

import { BasicColumnProps, CellInfo } from "@ContextLogic/lego";
import { FetcherRenderProps } from "./PaymentDetailsTableFetcher";
import { formatDatetimeLocalized } from "@toolkit/datetime";

// Response data from API request
export type TableData<R> = {
  readonly results: ReadonlyArray<R>;
  readonly show_local_currency: boolean;
  readonly num_results: number;
};

// C: Props of the table column
// The other fields are custom props to this table
export type PaymentDetailsColumn<R, C> = C & {
  readonly visible?: boolean | ((arg0: TableData<R>) => boolean);
  readonly column?: React.ComponentType<C>;
  readonly render?: (arg0: CellInfo<any, R>) => React.ReactNode;
  readonly expand?: boolean;
  readonly margin?: string | number;
  readonly sortArrow?: React.ReactNode;
  readonly onSort?: () => unknown;
};

// Props passed without Fetcher
export type CommonTableProps<R, C> = {
  readonly dryrun: boolean;
  readonly title: string;
  readonly currency: string;
  readonly columns: ReadonlyArray<PaymentDetailsColumn<R, C>>;
  readonly filterActive?: boolean;
  readonly nextPageRequiresAPICall?: boolean;
  readonly filter?: (closePopup: () => unknown) => React.ReactNode;
};

// Props added by Fetcher
type PaymentDetailsTableProps<R, C, D = TableData<R>> = CommonTableProps<R, C> &
  FetcherRenderProps<D> & {
    readonly nextPageRequiresAPICall?: boolean;
  };

// The page size used for the backend query.
// This is currently hardcoded into the backend query
// since each MerchantPayable contains 200 transactions
const PAGE_SIZE = 200;

// The page size shown in the frontend.
// So, if we retrieve 200 trans from the backend
// we can display 4 pages worth of transactions without doing another query.
// Invariant: page_size must be a multiple of the display_page_size
const SUBPAGE_SIZES = [10, 20, 50, 100, 200];

// Alternative to ObjectIdColumn that adds links
type IDRenderProps = {
  readonly id: string;
  readonly url: string;
};

export const IDRender = ({ id, url }: IDRenderProps) => (
  <CopyButton text={id} copyOnBodyClick={false}>
    <Link openInNewTab href={url}>
      <section>{`...${id.substring(id.length - 5)}`}</section>
    </Link>
  </CopyButton>
);

// Alternative to DatetimeColumn that accepts date format
// rather than timestamp
type DateRenderProps = {
  readonly date: string;
};

export const DateRender = ({ date }: DateRenderProps) => (
  <>
    <div>
      {formatDatetimeLocalized(
        moment(date, "MM-DD-YYYY HH:mm:ssZ"),
        "MM/DD/YYYY"
      )}
    </div>
    <div>
      {formatDatetimeLocalized(moment(date, "MM-DD-YYYY HH:mm:ssZ"), "h:mmA")}
    </div>
  </>
);

@observer
class PaymentDetailsTable<
  R,
  C extends BasicColumnProps
> extends React.Component<PaymentDetailsTableProps<R, C>> {
  @observable
  subpage = 0;

  @observable
  subpageSize = 10;

  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @computed
  get styles() {
    return StyleSheet.create({
      noResult: {
        textAlign: "center",
      },
      header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      title: {
        border: 0,
        width: "fit-content",
        marginTop: 20,
        color: "#333",
        fontSize: 24,
        fontFamily: fonts.proxima,
        fontWeight: fonts.weightBold,
      },
      headerTools: {
        display: "flex",
        alignItems: "center",
      },
      pagination: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      filterButton: {
        padding: "5px 15px",
        paddingLeft: 10,
      },
      pageIndicator: {
        paddingRight: 10,
      },
      loadingContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 40,
      },
      sortArrow: {
        margin: "2px 0 0 2px",
        display: "inline",
        cursor: "pointer",
        position: "absolute",
      },
      table: {
        border: "1px solid rgba(175, 199, 209, 0.5)",
        boxShadow: "none",
        margin: "20px 0",
        borderRadius: 4,
      },
      expandBox: {
        backgroundColor: "#f6f8f9",
        padding: 24,
      },
      expandTable: {
        border: "1px solid rgba(175, 199, 209, 0.5)",
        boxShadow: "none",
      },
    });
  }

  renderColumn(col: PaymentDetailsColumn<R, C>) {
    const { data } = this.props;
    const {
      visible,
      render,
      column,
      expand,
      margin,
      renderHeader,
      sortArrow,
      onSort,
      ...props
    } = col;

    if (visible != null && !visible) {
      return null;
    }

    if (typeof visible === "function" && (data == null || !visible(data))) {
      return null;
    }

    const Component: React.ComponentType<any> = column || Table.Column;

    const header: React.ReactNode | null | undefined =
      renderHeader != null ? renderHeader() : col.title;

    return (
      <Component
        key={col.columnKey}
        handleEmptyRow
        multiline
        renderHeader={() => (
          <div style={margin != null ? { margin } : {}}>
            <span>{header}</span>
            {onSort != null && (
              <span onClick={onSort} className={css(this.styles.sortArrow)}>
                {sortArrow}
              </span>
            )}
          </div>
        )}
        {...props}
      >
        {/* if you find this please fix the any types (legacy) */}
        {(cell: any) => (
          <div style={{ margin }}>{render?.(cell) || cell.value}</div>
        )}
      </Component>
    );
  }

  changePage = (pageRequested: number) => {
    const { page, nextPageRequiresAPICall } = this.props;
    const numSubpages = PAGE_SIZE / this.subpageSize;

    if (!nextPageRequiresAPICall) {
      this.subpage = pageRequested;
    } else {
      if (pageRequested >= numSubpages) {
        this.props.loadPage(page + 1);
        this.subpage = 0;
      } else if (pageRequested < 0) {
        this.props.loadPage(page - 1);
        this.subpage = numSubpages + pageRequested;
      } else {
        this.subpage = pageRequested;
      }
    }
  };

  @action
  changePageSize = (newSize: number) => {
    this.subpageSize = newSize;
    this.subpage = 0;
  };

  @computed
  get indices(): [number, number] {
    const { data } = this.props;

    if (data == null) {
      return [0, 0];
    }

    const startIndex = this.subpage * this.subpageSize;
    const endIndex = Math.min(
      startIndex + this.subpageSize,
      data.results.length
    );
    return [startIndex, endIndex];
  }

  renderHeader() {
    const { dryrun, title } = this.props;

    return (
      <div className={css(this.styles.header)}>
        <div className={css(this.styles.title)}>
          {dryrun ? "[DRYRUN]" : ""}
          {title}
        </div>
        <div className={css(this.styles.headerTools)}>
          {this.renderPagination()}
          {this.renderFilterButton()}
        </div>
      </div>
    );
  }

  renderPagination() {
    const { page, loading, data, nextPageRequiresAPICall } = this.props;

    const offset = nextPageRequiresAPICall ? PAGE_SIZE * page : 0;
    const [startIndex, endIndex] = this.indices;
    const totalItems = data?.num_results || data?.results?.length || 0;

    return (
      <div className={css(this.styles.pagination)}>
        <PageIndicator
          isLoading={loading}
          totalItems={totalItems}
          rangeStart={offset + startIndex + 1}
          rangeEnd={offset + endIndex}
          hasNext={offset + endIndex < totalItems}
          hasPrev={offset + startIndex > 0}
          currentPage={this.subpage}
          onPageChange={this.changePage}
          className={css(this.styles.pageIndicator)}
        />
        <Select
          disabled={loading}
          options={SUBPAGE_SIZES.map((size) => ({
            value: size,
            text: size.toString(),
          }))}
          onSelected={this.changePageSize}
          selectedValue={this.subpageSize}
          buttonHeight={30}
        />
      </div>
    );
  }

  renderFilterButton() {
    const { filter: filterProp, loading, filterActive } = this.props;

    if (filterProp == null) {
      return null;
    }

    const filter = filterProp(() => {
      // popovers close when the user hits the esc key - trigger that
      // eslint-disable-next-line local-rules/unwrapped-i18n
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
    });

    return (
      <Popover
        position="bottom right"
        on="click"
        contentWidth={400}
        closeOnMouseLeave={false}
        popoverContent={() => filter}
      >
        <>
          <FilterButton
            style={this.styles.filterButton}
            isActive={filterActive}
            disabled={loading}
          />
        </>
      </Popover>
    );
  }

  @computed
  get expandedRowsIndices(): ReadonlyArray<number> {
    const { columns } = this.props;
    const expand = columns.some((c) => c.expand);
    if (expand) {
      return this.expandedRows.toArray().map((row) => parseInt(row));
    }
    return [];
  }

  @action
  onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      this.expandedRows.add(index.toString());
    } else {
      this.expandedRows.remove(index.toString());
    }
  };

  renderExpandedTable = (data: R) => {
    const { columns } = this.props;
    const expandColumns = columns.filter((c) => c.expand);

    return (
      <div className={css(this.styles.expandBox)}>
        <Table
          data={[data]}
          className={css(this.styles.expandTable)}
          hideBorder
        >
          {expandColumns.map((col) => this.renderColumn(col))}
        </Table>
      </div>
    );
  };

  renderTable() {
    const { columns, data, loading, title } = this.props;

    if (data != null) {
      const regularColumns = columns.filter((c) => !c.expand);

      const [startIndex, endIndex] = this.indices;

      return (
        <Table
          className={css(this.styles.table)}
          data={data.results.slice(startIndex, endIndex)}
          rowHeight={null}
          rowExpands={() => regularColumns.length < columns.length}
          expandedRows={this.expandedRowsIndices}
          renderExpanded={this.renderExpandedTable}
          onRowExpandToggled={this.onRowExpandToggled}
          maxVisibleColumns={columns.length}
          noDataMessage={i`You do not have any ${title.toLowerCase()} yet.`}
          hideBorder
        >
          {regularColumns.map((col) => this.renderColumn(col))}
        </Table>
      );
    }

    if (loading) {
      return (
        <div className={css(this.styles.loadingContainer)}>
          <LoadingIndicator
            type="swinging-bar" // Inline style as className doesn't take precedence
            // over built-in styles
            style={{ flex: 1, maxWidth: 400 }}
          />
        </div>
      );
    }

    return <h6 className={css(this.styles.noResult)}>No Results</h6>;
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderTable()}
      </>
    );
  }
}

export default PaymentDetailsTable;
