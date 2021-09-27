import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, reaction } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightMedium } from "@toolkit/fonts";
import { Validator } from "@toolkit/validators";

/* Relative Imports */
import ProductColumn from "./ProductColumn";

import { ProductColumnProps } from "./ProductColumn";
import { InternalBasicColumnProps } from "@ContextLogic/lego";

export type ValidatedProductColumnProps = ProductColumnProps & {
  readonly validators: ReadonlyArray<Validator>;
  readonly productIds?: ReadonlyArray<string>;
};

export type InternalValidatedProductColumnProps = InternalBasicColumnProps<
  string
> &
  ValidatedProductColumnProps;

@observer
class ValidatedProductColumn extends Component<ValidatedProductColumnProps> {
  @observable
  validationResponse: string | null | undefined;

  dispose: (() => void) | null | undefined = null;

  async componentDidMount() {
    this.dispose = reaction(
      // eslint-disable-next-line react/destructuring-assignment
      () => [this.props.productIds],
      ([productIds]) => {
        (async () => {
          if (productIds) {
            await this.validate();
          }
        })();
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
  }

  async validate() {
    const { value, validators } = (this
      .props as any) as InternalValidatedProductColumnProps;
    this.validationResponse = null;
    for (const validator of validators) {
      const response = await validator.validate(value);
      if (response) {
        this.validationResponse = response;
        break;
      }
    }
  }

  @computed
  get styles() {
    return StyleSheet.create({
      error: {
        color: palettes.reds.DarkRed,
        fontSize: 12,
        fontWeight: weightMedium,
        whiteSpace: "pre-wrap",
      },
    });
  }

  renderError() {
    if (this.validationResponse) {
      return (
        <span className={css(this.styles.error)}>
          {this.validationResponse}
        </span>
      );
    }
  }

  render() {
    const { productIds, validators, ...props } = this.props;
    return (
      <>
        <ProductColumn {...props} />
        {this.renderError()}
      </>
    );
  }
}
export default ValidatedProductColumn;
