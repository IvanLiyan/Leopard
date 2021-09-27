import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightMedium, weightNormal } from "@toolkit/fonts";

/* Merchant API */
import { getMultiLight, getMulti } from "@merchant/api/product";

/* Toolkit */
import { contestImageURL } from "@toolkit/url";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { LightProductDict } from "@merchant/api/product";

type ProductSearchBarProps = BaseProps & {
  readonly onAddProduct: (searchResult: LightProductDict) => unknown;
  readonly notFocusOnMount?: boolean;
};

type Option = "id" | "name" | "sku";

@observer
export default class ProductSearchBar extends Component<ProductSearchBarProps> {
  @observable
  option: Option = "id";

  @observable
  showResults = false;

  @observable
  searching = false;

  @observable
  inputValue = "";

  @observable
  results: ReadonlyArray<LightProductDict> = [];

  @observable
  dropDownRef: HTMLDivElement | null | undefined;

  timer: ReturnType<typeof setTimeout> | null | undefined;

  componentDidMount() {
    document.addEventListener("mousedown", this.hideResults);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.hideResults);
  }

  async getMultiProductLightRequest(pids: string) {
    try {
      const resp = await getMultiLight({ pids }).call();
      const results = resp.data?.results;
      return results ? results : [];
    } catch (err) {
      return [];
    }
  }

  async getMultiProductRequest(input: string, type: string) {
    try {
      const resp = await getMulti({ input, type, count: 50 }).call();
      const results = resp.data?.results;
      return results ? results : [];
    } catch (err) {
      return [];
    }
  }

  @action
  setDropDownRef(node: HTMLDivElement | null | undefined) {
    this.dropDownRef = node;
  }

  @action
  hideResults = (event: Event) => {
    if (this.dropDownRef && !this.dropDownRef.contains(event.target as any)) {
      this.showResults = false;
    }
  };

  @computed
  get styles() {
    return StyleSheet.create({
      resultsContainer: {
        color: `${palettes.textColors.LightInk}`,
        minHeight: 50,
        maxHeight: 250,
        top: "40px",
        overflowY: "scroll",
        position: "absolute",
        width: "100%",
        border: `1px solid ${palettes.greyScaleColors.Grey}`,
        borderRadius: 4,
        backgroundColor: `${palettes.textColors.White}`,
        zIndex: 100,
      },
      result: {
        fontSize: 12,
        fontWeight: weightNormal,
        lineHeight: 1,
        padding: 8,
        border: `1px solid ${palettes.greyScaleColors.LighterGrey}`,
        transition: "all 0.3s linear",
        transitionProperty: "color, background-color",
        display: "flex",
        alignItems: "center",
        minHeight: 120,
        ":hover": {
          color: `${palettes.textColors.Ink}`,
          backgroundColor: `${palettes.coreColors.LighterWishBlue}`,
          cursor: "pointer",
        },
      },
      productImgContainer: {
        flex: 1,
      },
      productImg: {
        maxWidth: "100%",
      },
      productDetail: {
        flex: 3,
        marginLeft: 5,
      },
      text: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: weightMedium,
      },
      flexColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }

  @computed
  get inputPlaceholder() {
    const dict = {
      id: i`Search a product ID`,
      name: i`Search a product name`,
      sku: i`Search a product SKU`,
    };
    return dict[this.option];
  }

  @computed
  get selectProps() {
    const options: { value: Option; text: string }[] = [
      {
        value: "id",
        text: i`Product ID`,
      },
      {
        value: "name",
        text: i`Product Name`,
      },
      {
        value: "sku",
        text: i`Product SKU`,
      },
    ];

    return {
      options,
      onSelected: (value: Option) => {
        this.option = value;
      },
      selectedValue: this.option,
      minWidth: 120,
      hideBorder: true,
    };
  }

  @computed
  get textInputProps() {
    const { notFocusOnMount } = this.props;
    return {
      icon: searchImg,
      placeholder: this.inputPlaceholder,
      hideBorder: true,
      focusOnMount: !notFocusOnMount,
      value: this.inputValue,
      onChange: ({ text }: OnTextChangeEvent) => {
        this.inputValue = text;
        if (text.trim().length === 0) {
          return;
        }
        this.searching = true;
        this.showResults = true;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        // only fire API call if user stops typing for 500 ms
        this.timer = setTimeout(async () => {
          try {
            if (this.option === "id") {
              this.results = await this.getMultiProductLightRequest(
                text.trim()
              );
            } else {
              this.results = await this.getMultiProductRequest(
                text,
                this.option
              );
            }
          } catch (error) {
            // server error
          }

          this.searching = false;
        }, 500);
      },
      renderDropdown: this.showResults ? () => this.renderResults : null,
      style: { minWidth: "25vw" },
    };
  }

  @computed
  get renderSearchContent(): ReadonlyArray<ReactNode> {
    const { onAddProduct } = this.props;
    return this.results.map((product: LightProductDict) => (
      <div
        className={css(this.styles.result)}
        key={product.id}
        onClick={() => {
          onAddProduct({
            id: product.id,
            name: product.name,
            parent_sku: product.parent_sku,
          });
          this.showResults = false;
          this.inputValue = "";
        }}
      >
        <div className={css(this.styles.productImgContainer)}>
          <img
            src={contestImageURL({ contestId: product.id })}
            className={css(this.styles.productImg)}
          />
        </div>
        <div className={css(this.styles.productDetail)}>
          <p>Product ID: {product.id}</p>
          {product.parent_sku && <p>Parent SKU: {product.parent_sku}</p>}
          <p>{product.name}</p>
        </div>
      </div>
    ));
  }

  @computed
  get renderResults() {
    if (this.searching) {
      return (
        <div className={css(this.styles.resultsContainer, this.styles.center)}>
          <LoadingIndicator />
        </div>
      );
    } else if (!this.results || this.results.length === 0) {
      return (
        <div
          className={css(this.styles.resultsContainer, this.styles.center)}
          ref={(node) => this.setDropDownRef(node)}
        >
          <span className={css(this.styles.text)}>No Results</span>
        </div>
      );
    }
    return (
      <div
        className={css(this.styles.resultsContainer, this.styles.flexColumn)}
        ref={(node) => this.setDropDownRef(node)}
      >
        {this.renderSearchContent}
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <TextInputWithSelect
        selectProps={this.selectProps}
        textInputProps={this.textInputProps}
        className={className}
      />
    );
  }
}
