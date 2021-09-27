import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import TrackingDisputeStateLabel from "@merchant/component/policy/disputes/TrackingDisputeStateLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Illustration, IllustrationName } from "@merchant/component/core";
import { TrackingDisputeState } from "@merchant/api/disputes";

export type LabelSentiment = "positive" | "negative" | "warning" | "info";

type DisputeWelcomeHeaderProps = BaseProps & {
  readonly title?: string;
  readonly body?: string;
  readonly illustration: IllustrationName;
  readonly state: TrackingDisputeState;
};

@observer
class DisputeWelcomeHeader extends Component<DisputeWelcomeHeaderProps> {
  renderTitle = () => {
    const { title, state } = this.props;
    return (
      <div className={css(this.styles.title)}>
        <Text weight="bold">{title}</Text>
        <TrackingDisputeStateLabel
          state={state}
          className={css(this.styles.label)}
        />
      </div>
    );
  };

  @computed
  get styles() {
    return StyleSheet.create({
      label: {
        marginLeft: 16,
        height: 20,
        marginTop: 4,
        fontSize: 12,
      },
      title: {
        fontSize: 24,
        lineHeight: 1.25,
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        color: palettes.textColors.Ink,
        marginBottom: 20,
      },
    });
  }

  render() {
    const { body, illustration } = this.props;

    return (
      <WelcomeHeader
        title={this.renderTitle}
        body={body}
        illustration={() => (
          <Illustration name={illustration} alt="illustration" />
        )}
      />
    );
  }
}

export default DisputeWelcomeHeader;
