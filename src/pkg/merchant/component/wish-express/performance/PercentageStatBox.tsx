import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* External Libraries */
import numeral from "numeral";
import Color from "color";

/* Lego Components */
import { CircularProgressBar, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PercentageStatBoxDisplayMode = "positive" | "negative" | "neutral";

export type PercentageStatBoxProps = BaseProps & {
  value: number | null | undefined;
  title: string;
  timeRange?: string | null | undefined;
  inversed?: boolean;
  description?: string;
  displayMode: PercentageStatBoxDisplayMode;
  target: string;
  width: number;
};

@observer
class PercentageStatBox extends Component<PercentageStatBoxProps> {
  @observable
  displayProgress: number | null | undefined = null;

  @computed
  get progressValue(): number {
    const { inversed, value } = this.props;
    if (value == null) {
      return 0;
    }

    return inversed ? 1 - value : value;
  }

  @computed
  get displayValue(): number {
    const {
      props: { inversed },
      displayProgress,
    } = this;

    if (displayProgress == null) {
      return 0;
    }

    return inversed ? 1 - displayProgress : displayProgress;
  }

  @computed
  get progressFillColor(): string {
    // eslint-disable-next-line new-cap
    return Color(this.valueColor).fade(0.3).string();
  }

  @computed
  get progressOutlineColor(): string {
    // eslint-disable-next-line new-cap
    return Color(this.valueColor).fade(0.7).string();
  }

  @computed
  get valueColor(): string {
    const { displayMode } = this.props;

    if (displayMode === "positive") {
      return palettes.cyans.LightCyan;
    } else if (displayMode === "negative") {
      return palettes.reds.DarkRed;
    }
    return palettes.greyScaleColors.Grey;
  }

  @computed
  get progressOpacity(): number {
    const { progressValue, displayProgress } = this;
    if (
      progressValue === 0 ||
      progressValue == null ||
      displayProgress == null
    ) {
      return 1;
    }

    return displayProgress / progressValue;
  }

  renderTimeRange() {
    const { timeRange } = this.props;
    if (!timeRange) {
      return null;
    }

    return (
      <Text weight="medium" className={css(this.styles.timeRange)}>
        {timeRange}
      </Text>
    );
  }

  @computed
  get styles() {
    const { width } = this.props;

    return StyleSheet.create({
      root: {
        position: "relative",
        backgroundColor: "#ffffff",
        boxShadow: "0 0px 4px 0 rgba(99, 113, 120, 0.4)",
        padding: 20,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      title: {
        fontSize: 15,
        cursor: "default",
        userSelect: "none",
        color: "rgba(43, 51, 51, 0.81)",
      },
      value: {
        fontSize: 37,
        cursor: "default",
        margin: "30px 0px",
        userSelect: "none",
        color: this.valueColor,
      },
      timeRange: {
        textAlign: "center",
        color: "#5f6464",
        fontSize: 14,
        cursor: "default",
        userSelect: "none",
      },
      progress: {
        position: "absolute",
        width: "100%",
        height: "100%",
      },
      content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      },
      contentInner: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 5,
      },
      circleContainer: {
        width,
        height: width,
        position: "relative",
        margin: "30px 0px",
      },
      target: {
        alignSelf: "flex-end",
        fontSize: 13,
      },
    });
  }

  renderNoData() {
    const { title, width, className } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <Text weight="bold" className={css(this.styles.title)}>
          {title}
        </Text>
        <div
          className={css(this.styles.circleContainer)}
          style={{ opacity: this.progressOpacity }}
        >
          <CircularProgressBar
            className={css(this.styles.progress)}
            progress={100}
            fillColor="#aaaaaa"
            width={width}
            animate={false}
          />
          <div className={css(this.styles.content)}>
            <div className={css(this.styles.contentInner)}>
              <Text weight="regular" className={css(this.styles.value)}>
                No Data
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { title, value, width, target, className } = this.props;
    if (value == null) {
      return this.renderNoData();
    }

    return (
      <div className={css(this.styles.root, className)}>
        <Text weight="bold" className={css(this.styles.title)}>
          {title}
        </Text>
        <div className={css(this.styles.circleContainer)}>
          <CircularProgressBar
            key={`progress-with-${width}`}
            className={css(this.styles.progress)}
            progress={this.progressValue}
            fillColor={this.progressFillColor}
            outlineColor={"#e8e8e8"}
            strokeWidth={8}
            width={width}
          />

          <div className={css(this.styles.content)}>
            <div className={css(this.styles.contentInner)}>
              <Text weight="regular" className={css(this.styles.value)}>
                {numeral(value).format("0.00%")}
              </Text>
              {this.renderTimeRange()}
            </div>
          </div>
        </div>
        <div className={css(this.styles.target)}>Target: {target}</div>
      </div>
    );
  }
}
export default PercentageStatBox;
