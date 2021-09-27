import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, action } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Field } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { DateValidator } from "@toolkit/validators";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { Moment } from "moment/moment";

export type OnDateChangeEvent = {
  readonly date: Moment | null | undefined;
};

type LineItemDateFieldProps = BaseProps & {
  readonly title: string;
  readonly defaultValue?: string | null | undefined;
  readonly onChange?: (event: OnDateChangeEvent) => unknown;
};

@observer
class LineItemDateField extends Component<LineItemDateFieldProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
    });
  }

  @computed
  get defaultValue(): string {
    const { defaultValue } = this.props;
    return defaultValue || "";
  }

  @computed
  get dateValidator(): DateValidator {
    return new DateValidator();
  }

  @action
  onChange = (data: OnTextChangeEvent) => {
    const { text, isValid } = data;
    if (this.props.onChange && isValid) {
      const date = text.trim().length > 0 ? moment(text, "DD/MM/YYYY") : null;
      this.props.onChange({ date });
    }
  };

  render() {
    const { className, title } = this.props;
    return (
      <Field title={title} className={css(className)}>
        <TextInput
          onChange={this.onChange}
          passValidity
          placeholder={i`DD/MM/YYYY`}
          height={30}
          icon="calendar"
          defaultValue={this.defaultValue}
          validators={[this.dateValidator]}
          hideCheckmarkWhenValid
        />
      </Field>
    );
  }
}

export default LineItemDateField;
