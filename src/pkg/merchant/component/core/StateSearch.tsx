//
//  component/form/StateSearch.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 6/5/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { observable, action, computed, reaction } from "mobx";
import { observer } from "mobx-react";
import sortBy from "lodash/sortBy";

/* Lego Components */
import TypeaheadInput from "./TypeaheadInput";

/* Lego Toolkit */
import { editDistance } from "@ContextLogic/lego/toolkit/string";
import states from "@ContextLogic/lego/toolkit/states";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { StateCode } from "@ContextLogic/lego/toolkit/states";
import { CountryCode } from "@toolkit/countries";
import { TextInputProps } from "@ContextLogic/lego";

export type StateSearchProps = BaseProps & {
  readonly countryCode: CountryCode;
  readonly currentStateCode: StateCode | null | undefined;
  readonly onState: (arg0: {
    stateCode: StateCode | null | undefined;
  }) => unknown;
  readonly disabled?: boolean;
  readonly placeholder?: string | undefined;
  readonly inputProps?: TextInputProps | null | undefined;
};

type StateItem = { readonly stateCode: StateCode; readonly stateName: string };

@observer
class StateSearch extends Component<StateSearchProps> {
  static defaultProps: Partial<StateSearchProps> = {
    placeholder: i`Enter a state`,
  };

  @observable
  value: string | null | undefined;

  dispose: (() => void) | null | undefined;

  componentDidMount() {
    this.dispose = reaction(
      // eslint-disable-next-line react/destructuring-assignment
      () => [this.props.currentStateCode, this.props.countryCode],
      ([currentStateCode, countryCode]) => {
        if (currentStateCode != null) {
          // as any required since countryCode may not exist on states
          const statesObject =
            (countryCode && (states as any)[countryCode]) || {};

          this.value = statesObject[currentStateCode];
        }
      },
      { fireImmediately: true }
    );
  }

  componentWilUnmount() {
    const { dispose } = this;
    if (dispose != null) {
      dispose();
    }
    this.dispose = null;
  }

  @action
  onTextChange = ({ text }: { text: string }) => {
    const { onState } = this.props;
    this.value = text;
    onState({ stateCode: null });
  };

  @action
  onSelection = ({ item }: { item: StateItem }) => {
    const { onState } = this.props;
    this.value = item.stateName;
    onState({ stateCode: item.stateCode });
  };

  @computed
  get stateOptions(): ReadonlyArray<StateItem> {
    const { countryCode } = this.props;
    // Not all countries have states populated in states.tsx -- flow
    // warns about this. We fallback to empty array if this happens.
    // as any required since countryCode may not exist on states
    const statesObject = (countryCode && (states as any)[countryCode]) || {};
    return Object.keys(statesObject).map((stateCode) => ({
      stateCode,
      stateName: statesObject[stateCode],
    })) as ReadonlyArray<StateItem>;
  }

  queryCountries = async (args: {
    query: string;
  }): Promise<ReadonlyArray<StateItem>> => {
    const { stateOptions } = this;
    const query = args.query.trim().toLocaleLowerCase();
    if (query.length == 0) {
      // Present all options -- sorted lexicographically  -- if nothing has been
      // searched yet.
      return sortBy(stateOptions, (state) => state);
    }

    const mostLikelyResults = stateOptions.filter((item) =>
      item.stateName.toLocaleLowerCase().includes(query)
    );

    const distances: {
      [stateCode: string]: number;
    } = mostLikelyResults.reduce(
      (total, item) => ({
        ...total,
        [item.stateCode]: editDistance(
          item.stateName.toLocaleLowerCase(),
          query
        ),
      }),
      {}
    );

    return sortBy(mostLikelyResults, (item) => distances[item.stateCode]);
  };

  render() {
    const { inputProps, placeholder } = this.props;
    return (
      <TypeaheadInput
        text={this.value}
        onTextChange={this.onTextChange}
        getData={this.queryCountries}
        onSelection={this.onSelection}
        renderItem={({ item }: { item: StateItem }) => item.stateName}
        inputProps={{
          ...inputProps,
          placeholder,
        }}
      />
    );
  }
}

export default StateSearch;
