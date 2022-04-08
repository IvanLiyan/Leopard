//
//  component/form/Select.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/12/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Field,
  HorizontalField,
  HorizontalFieldProps,
  FormSelect,
  Option,
  TextInput,
  TextInputProps,
  OnTextChangeEvent,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { RequiredValidator } from "@toolkit/validators";
import states, { SubdivisionNames } from "@ContextLogic/lego/toolkit/states";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DemoProps } from "@ContextLogic/lego/toolkit/demo";

export type StateFieldProps = BaseProps & {
  readonly countryCode?: string | null | undefined;
  readonly currentState: string | null | undefined;
  readonly height?: number | null | undefined;
  readonly disabled?: boolean;
  readonly onState: (state: string) => unknown;
  readonly excludeStates?: ReadonlyArray<string>;
  readonly borderColor?: string | null | undefined;
  readonly showErrorMessages?: boolean;
  readonly title?: string | (() => React.ReactNode) | null | undefined;
  readonly skipValidation?: boolean;
} & (
    | {
        readonly fieldStyle?: null | undefined;
        readonly horizontalFieldProps?: null | undefined;
      }
    | {
        readonly fieldStyle: "HORIZONTAL";
        readonly horizontalFieldProps?: Omit<
          HorizontalFieldProps,
          "title" | "className" | "style"
        >;
      }
  );

@observer
class StateField extends Component<StateFieldProps> {
  static demoProps: ReadonlyArray<DemoProps & StateFieldProps> = [
    {
      demoDescription: `united states`,
      countryCode: "US",
      currentState: null,
      onState: () => {},
    },
    {
      demoDescription: `china`,
      countryCode: "CN",
      currentState: null,
      onState: () => {},
    },
    {
      demoDescription: `canada`,
      countryCode: "CA",
      currentState: null,
      onState: () => {},
    },
    {
      demoDescription: `brazil`,
      countryCode: "BR",
      currentState: null,
      onState: () => {},
    },
    {
      demoDescription: `germany`,
      countryCode: "DE",
      currentState: null,
      onState: () => {},
    },
  ];

  @computed
  get validators(): TextInputProps["validators"] {
    const { skipValidation } = this.props;

    if (skipValidation) {
      return [];
    }

    return [new RequiredValidator()];
  }

  @computed
  get stateOptions(): ReadonlyArray<Option<string>> {
    const { countryCode, excludeStates } = this.props;
    // as any required since countryCode may not exist on states
    const statesObject = (countryCode && (states as any)[countryCode]) || {};
    let stateCodes = Object.keys(statesObject);
    if (excludeStates && excludeStates.length > 0) {
      stateCodes = stateCodes.filter((code) => !excludeStates.includes(code));
    }
    stateCodes.sort();
    return stateCodes.map((stateCode) => {
      const stateName = statesObject[stateCode];
      return { value: stateName.toUpperCase(), text: stateName };
    });
  }

  @computed
  get subdivisionName(): string {
    const { countryCode } = this.props;
    if (countryCode != null) {
      if (SubdivisionNames[countryCode]) {
        return SubdivisionNames[countryCode];
      }
    }

    return i`State`;
  }

  onInputChange = ({ text }: OnTextChangeEvent) => {
    this.props.onState(text);
  };

  onOptionSelected = (stateName: string) => {
    this.props.onState(stateName);
  };

  renderInput() {
    const { disabled, height, currentState, borderColor, showErrorMessages } =
      this.props;
    return (
      <TextInput
        validators={this.validators}
        onChange={this.onInputChange}
        disabled={disabled}
        height={height || undefined}
        value={currentState || ""}
        placeholder={i`Enter your ${this.subdivisionName.toLowerCase()}`}
        borderColor={borderColor}
        showErrorMessages={showErrorMessages}
      />
    );
  }

  renderSelect() {
    const { currentState, disabled, borderColor } = this.props;
    return (
      <FormSelect
        options={this.stateOptions}
        onSelected={this.onOptionSelected}
        selectedValue={currentState ? currentState.toUpperCase() : undefined}
        placeholder={i`Select your ${this.subdivisionName.toLowerCase()}`}
        disabled={disabled}
        borderColor={borderColor || undefined}
      />
    );
  }

  render() {
    const { className, children, title, fieldStyle, horizontalFieldProps } =
      this.props;
    if (fieldStyle == "HORIZONTAL") {
      return (
        <HorizontalField
          title={title || this.subdivisionName}
          className={css(className)}
          {...horizontalFieldProps}
        >
          {this.stateOptions.length === 0
            ? this.renderInput()
            : this.renderSelect()}
          {children}
        </HorizontalField>
      );
    }
    return (
      <Field title={title || this.subdivisionName} className={css(className)}>
        {this.stateOptions.length === 0
          ? this.renderInput()
          : this.renderSelect()}
        {children}
      </Field>
    );
  }
}

export default StateField;
