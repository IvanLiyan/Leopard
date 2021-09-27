import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable, runInAction, reaction } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { StrengthIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { sleep } from "@ContextLogic/lego/toolkit/async";

/* Toolkit */
import KeywordsValidator from "@toolkit/product-boost/validators/KeywordsValidator";
import { call } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

type SolrKeyword = {
  competition: number;
  competition_text: string;
  high_bid: number;
  high_bid_text: string;
  keyword: string;
  reach_style: string;
  reach_text: string;
};

export type EditKeywordsCellProps = BaseProps & {
  readonly value: string;
  readonly index: number;
  readonly maxKeywords: number | null | undefined;
  readonly maxKeywordLen: number | null | undefined;
  readonly onKeywordsChange: (value: string, index: number) => unknown;
  readonly focusOnMount?: boolean;
  readonly lastItem: boolean | null | undefined;
};

@observer
class EditKeywordsCell extends Component<EditKeywordsCellProps> {
  @observable
  showDropdown = false;

  @observable
  keywordToSearch = "";

  mostRecentlySearchedKeyword = "";

  @observable
  solrKeywords: ReadonlyArray<SolrKeyword> = [];

  @observable
  dropDownRef: HTMLDivElement | null | undefined;

  @observable
  dropDownTop = 500;

  @observable
  dropDownWidth = 860;

  dispose: (() => void) | null | undefined = null;

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    document.addEventListener("mousedown", this.hideResults);
    this.dispose = reaction(
      () => [this.keywordToSearch],
      async ([keywordToSearch]) => {
        this.mostRecentlySearchedKeyword = keywordToSearch;
        // debounce typing
        await sleep(20);
        if (keywordToSearch !== this.mostRecentlySearchedKeyword) {
          return;
        }
        this.showDropdown = false;
        const query = keywordToSearch.substring(
          keywordToSearch.lastIndexOf(",") + 1
        );
        if (!query) {
          return;
        }
        const response = await call("product-boost/keyword-search", {
          query,
          selected_keywords: keywordToSearch.substring(
            0,
            keywordToSearch.lastIndexOf(",")
          ),
          min_bid: 0.3,
        });
        runInAction(() => {
          this.solrKeywords = response.data.keywords;
          if (this.solrKeywords.length) {
            this.showDropdown = true;
          }
        });
      },
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    const { dispose } = this;
    if (dispose) {
      dispose();
    }
    this.dispose = null;
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("mousedown", this.hideResults);
  }

  handleScroll = () => {
    if (this.dropDownRef) {
      this.changeDropDownTop(this.dropDownRef.getBoundingClientRect().top);
    }
  };

  // Need to throttle the call rate
  changeDropDownTop = _.throttle((val: number) => {
    this.dropDownTop = val;
  }, 100);

  @action
  setDropDownRef(node: HTMLDivElement | null | undefined) {
    if (node) {
      this.changeDropDownTop(node.getBoundingClientRect().top);
      this.dropDownWidth = node.getBoundingClientRect().width;
    }
    this.dropDownRef = node;
  }

  @action
  hideResults = (event: Event) => {
    if (this.dropDownRef && !this.dropDownRef.contains(event.target as any)) {
      this.showDropdown = false;
    }
  };

  @computed
  get keywordsValidator() {
    const { maxKeywordLen, maxKeywords } = this.props;
    return new KeywordsValidator({
      maxNumOfKeywords: maxKeywords,
      maxKeywordLength: maxKeywordLen,
    });
  }

  @computed
  get styles() {
    const { lastItem } = this.props;
    return StyleSheet.create({
      root: {
        padding: "16px 0",
      },
      keywordSuggestTable: {
        position: "fixed",
        top: this.dropDownTop,
        width: this.dropDownWidth,
        border: `1px solid ${palettes.greyScaleColors.Grey}`,
        borderRadius: 4,
        backgroundColor: `${palettes.textColors.White}`,
        zIndex: 100,
        // Compensate the margin at page's bottom
        // TODO: remove this when new page launched.
        maxHeight: lastItem ? "210px" : undefined,
        overflowY: lastItem ? "auto" : undefined,
      },
    });
  }

  @action
  onClickKeyword = (index: number) => {
    const currentValue = this.props.value;
    const keyword = this.solrKeywords[index].keyword;
    const previousKeywords = currentValue.substring(
      0,
      currentValue.lastIndexOf(",") + 1
    );
    const newKeywords = previousKeywords + keyword;
    this.props.onKeywordsChange(newKeywords, this.props.index);
    this.showDropdown = false;
  };

  renderReachColumn(index: number, value: string) {
    // value is of format "width:1.2345%;"
    const colonPos = value.indexOf(":");
    const percentPos = value.indexOf("%");
    const reachString = value.substring(colonPos + 1, percentPos);
    const reach = parseFloat(reachString) / 100;
    return <StrengthIndicator strength={reach} warningRange={[0.3, 0.6]} />;
  }

  renderDropdown = () => {
    return (
      <div
        ref={(node: HTMLDivElement | null | undefined) =>
          this.setDropDownRef(node)
        }
      >
        <Table
          className={css(this.styles.keywordSuggestTable)}
          data={this.solrKeywords}
          onClickRow={({ index }) => this.onClickKeyword(index)}
          rowStyle={() => {
            return {
              ":hover": {
                cursor: "pointer",
                opacity: 0.8,
              },
            };
          }}
        >
          <Table.Column columnKey={"keyword"} title={i`Keyword`} />
          <Table.Column columnKey={"reach_style"} title={i`Reach`}>
            {({ index, value }) => this.renderReachColumn(index, value)}
          </Table.Column>
        </Table>
      </div>
    );
  };

  render() {
    const {
      value,
      index,
      maxKeywords,
      className,
      focusOnMount,
      onKeywordsChange,
    } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <TextInput
          value={value}
          placeholder={i`Enter optional keywords`}
          className={css(className)}
          isTextArea
          tokenize
          noDuplicateTokens
          focusOnMount={focusOnMount}
          maxTokens={maxKeywords}
          height={100}
          validators={[this.keywordsValidator]}
          onChange={({ text }: OnTextChangeEvent) => {
            onKeywordsChange(text, index);
            this.keywordToSearch = text;
          }}
          onKeyUp={(keyCode?: number) => {
            if (keyCode === 13) {
              // Enter pressed
              this.showDropdown = false;
            }
          }}
          renderDropdown={this.showDropdown ? this.renderDropdown : null}
          showCopyButton
        />
      </div>
    );
  }
}
export default EditKeywordsCell;
