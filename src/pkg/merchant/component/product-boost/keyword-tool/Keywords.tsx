import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* External Libraries */
import queryString from "query-string";

/* Deprecated */
import Fetcher from "@merchant/component/__deprecated__/Fetcher";

/* Lego Components */
import { SearchBox } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import KeywordToolTable from "@merchant/component/product-boost/keyword-tool/KeywordToolTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { KeywordToolTableSortByProps } from "@merchant/component/product-boost/keyword-tool/KeywordToolTable";
import { SortOrder } from "@ContextLogic/lego";

const PageSize = 250;

const BaseUrl = "/product-boost/keywords-tool";

type KeywordsProps = BaseProps & {
  readonly last_update: string;
};

@observer
export default class Keywords extends Component<KeywordsProps> {
  @observable
  currentEnd = 0;

  @observable
  totalCount: number | null | undefined = null;

  @observable
  cursorMarks: Array<string> = ["*"];

  @observable
  currentCursorIndex = -1;

  @computed
  get hasNext(): boolean {
    const { cursorMarks, currentCursorIndex } = this;
    return (
      currentCursorIndex >= 0 && currentCursorIndex + 1 < cursorMarks.length
    );
  }

  @action
  onPageChange = (nextPage: number) => {
    const currentQuery = { ...this.queryParams };
    currentQuery.offset = (nextPage * PageSize).toString();
    if (this.totalCount != null && this.hasNext) {
      const nextCurrentEnd = Math.min(
        this.totalCount,
        (parseInt(currentQuery.offset) || 0) + PageSize
      );
      // Check if user pressed previous button
      if (nextCurrentEnd < this.currentEnd) {
        this.currentCursorIndex -= 1;
        currentQuery.cursorMark = this.cursorMarks[this.currentCursorIndex];
        // Check if user pressed next button
      } else {
        currentQuery.cursorMark = this.cursorMarks[this.currentCursorIndex + 1];
      }

      this.currentEnd = nextCurrentEnd;
    }
    const { routeStore } = AppStore.instance();
    routeStore.push(BaseUrl, currentQuery);
  };

  @action
  onResponse = (response: any) => {
    if (response.code === 0) {
      // Check if data is from list_keywords API
      if ("results" in response.data) {
        this.totalCount = response.data.results.num_results;
        this.currentEnd =
          this.currentOffset + response.data.results.rows.length || 0;

        const nextCursorMark = response.data.results.next_cursor_mark;
        if (nextCursorMark != null) {
          const existingIndex = this.cursorMarks.indexOf(nextCursorMark);
          // Next button is pressed and the cursorMark was never loaded before
          if (existingIndex === -1) {
            this.cursorMarks.push(nextCursorMark);
            this.currentCursorIndex += 1;
            // Next button is pressed and the cursorMark already exists
          } else if (existingIndex === this.currentCursorIndex + 2) {
            this.currentCursorIndex += 1;
          }
        }

        // Check if data is from multi_get_keywords API
      } else {
        const numResults = Object.keys(response.data).length;
        this.totalCount = numResults;
        this.currentEnd = numResults;
      }
    }
  };

  @action
  onSearchFieldChanged = ({ text }: OnTextChangeEvent) => {
    this.cursorMarks = ["*"];
    this.currentCursorIndex = -1;

    const currentQuery = { ...this.queryParams };
    currentQuery.offset = "0";
    currentQuery.cursorMark = "*";
    if (text && text.trim().length >= 0) {
      currentQuery.search = text.trim();
    } else {
      currentQuery.search = "";
    }
    const { routeStore } = AppStore.instance();
    routeStore.push(BaseUrl, currentQuery);
  };

  @action
  onReachSortToggled = () => {
    this.cursorMarks = ["*"];
    this.currentCursorIndex = -1;

    const currentQuery = { ...this.queryParams };
    currentQuery.offset = "0";
    currentQuery.cursorMark = "*";
    const sortBy: { [key: string]: SortOrder } = {};

    if (
      currentQuery.sortBy &&
      queryString.parse(currentQuery.sortBy).reach === "asc"
    ) {
      sortBy.reach = "desc";
    } else {
      sortBy.reach = "asc";
    }
    // currently, we only need to sort keywords in ascending order
    sortBy.keyword = "asc";
    sortBy.competition = "not-applied";
    sortBy.suggestedBid = "not-applied";
    currentQuery.sortBy = queryString.stringify(sortBy);

    const { routeStore } = AppStore.instance();
    routeStore.push(BaseUrl, currentQuery);
  };

  @action
  onCompetitionSortToggled = () => {
    this.cursorMarks = ["*"];
    this.currentCursorIndex = -1;

    const currentQuery = { ...this.queryParams };
    currentQuery.offset = "0";
    currentQuery.cursorMark = "*";
    const sortBy: { [key: string]: SortOrder } = {};

    if (
      currentQuery.sortBy &&
      queryString.parse(currentQuery.sortBy).competition === "asc"
    ) {
      sortBy.competition = "desc";
    } else {
      sortBy.competition = "asc";
    }
    // currently, we only need to sort keywords in ascending order
    sortBy.keyword = "asc";
    sortBy.reach = "not-applied";
    sortBy.suggestedBid = "not-applied";
    currentQuery.sortBy = queryString.stringify(sortBy);

    const { routeStore } = AppStore.instance();
    routeStore.push(BaseUrl, currentQuery);
  };

  @computed
  get queryParams() {
    const { routeStore } = AppStore.instance();
    return routeStore.queryParams;
  }

  @computed
  get currentOffset(): number {
    const { queryParams } = this;
    return parseInt(queryParams.offset) || 0;
  }

  @computed
  get currentCursorMark(): string | null | undefined {
    const { queryParams } = this;
    return queryParams.cursorMark || null;
  }

  @computed
  get currentSortBy(): KeywordToolTableSortByProps {
    const { queryParams } = this;

    if (queryParams.sortBy) {
      return queryString.parse(queryParams.sortBy);
    }
    return {
      keyword: "asc",
      reach: "desc",
      competition: "not-applied",
      suggestedBid: "not-applied",
    };
  }

  @computed
  get apiPath(): string {
    if (this.searchedText) {
      return "product-boost/keyword/multi-get";
    }
    return "product-boost/keywords/get";
  }

  @computed
  get fetcherParams(): any {
    if (this.searchedText) {
      return {
        keywords: this.searchedText,
      };
    }
    if (this.currentSortBy.reach === "not-applied") {
      if (this.currentSortBy.competition === "not-applied") {
        return {
          count: PageSize,
          cursor_mark: this.currentCursorMark,
          keyword_sort: this.currentSortBy.keyword,
          bid_sort: this.currentSortBy.suggestedBid,
        };
      }
      return {
        count: PageSize,
        cursor_mark: this.currentCursorMark,
        keyword_sort: this.currentSortBy.keyword,
        comp_sort: this.currentSortBy.competition,
      };
    }
    return {
      count: PageSize,
      cursor_mark: this.currentCursorMark,
      keyword_sort: this.currentSortBy.keyword,
      reach_sort: this.currentSortBy.reach,
    };
  }

  @computed
  get searchedText(): string | undefined {
    const { queryParams } = this;
    if (typeof queryParams.search !== "string") {
      return undefined;
    }

    return queryParams.search;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      topControls: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        marginTop: 25,
        ":nth-child(1n) > *": {
          height: 30,
          margin: "0px 0px 25px 0px",
        },
      },
      searchContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      searchBox: {
        minWidth: "300px",
      },
      pageIndicator: {
        alignSelf: "stretch",
      },
      buttons: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      createCampaignTip: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      },
      createCampaignTipText: {
        fontSize: 14,
        color: palettes.textColors.Ink,
      },
    });
  }

  renderKeywordToolTable() {
    if (this.searchedText) {
      return (
        <KeywordToolTable
          type={"search"}
          sortBy={this.currentSortBy}
          onReachSortToggled={this.onReachSortToggled}
          onCompetitionSortToggled={this.onCompetitionSortToggled}
        />
      );
    }
    return (
      <KeywordToolTable
        type={"list"}
        sortBy={this.currentSortBy}
        onReachSortToggled={this.onReachSortToggled}
        onCompetitionSortToggled={this.onCompetitionSortToggled}
      />
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.topControls)}>
          <div className={css(this.styles.searchContainer)}>
            <SearchBox
              className={css(this.styles.searchBox)}
              onChange={this.onSearchFieldChanged}
              placeholder={i`Try searching keywords:` + ` shoes, ring, etc.`}
              height={28}
              defaultValue={this.searchedText}
            />
          </div>
          <div className={css(this.styles.buttons)}>
            <PageIndicator
              className={css(this.styles.pageIndicator)}
              totalItems={this.totalCount}
              rangeStart={this.currentOffset + 1}
              rangeEnd={this.currentEnd}
              hasNext={this.hasNext}
              hasPrev={
                this.totalCount != null && this.currentOffset >= PageSize
              }
              currentPage={this.currentOffset / PageSize}
              onPageChange={this.onPageChange}
            />
          </div>
        </div>
        <Fetcher
          request_DEP={{ apiPath: this.apiPath, params: this.fetcherParams }}
          onResponse_DEP={this.onResponse}
        >
          {this.renderKeywordToolTable()}
        </Fetcher>
      </div>
    );
  }
}
