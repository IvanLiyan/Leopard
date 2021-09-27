import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

import { PopoverProps } from "@ContextLogic/lego";

export type LineChartProps = PopoverProps &
  BaseProps & {
    readonly title: string;
    readonly color: string;
    readonly strokeDasharray?: string;
    readonly icon: IllustrationName;
    readonly subMetric?: ReadonlyArray<LineChartSubMetric>;
  };

export type LineChartSubMetric = {
  readonly title: string;
  readonly content: string;
  readonly color: string;
  readonly strokeDasharray: string;
  readonly icon: IllustrationName;
};

@observer
class LineChartMetric extends Component<LineChartProps> {
  @computed
  get styles() {
    const { color } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        borderStyle: "solid",
        borderRadius: "4px",
        borderWidth: "1px",
        borderColor: color,
      },
      metricsContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      },
      contentContainer: {
        display: "flex",
        flexDirection: "row",
      },
      textContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "16px 10px 16px 0px",
      },
      title: {
        fontSize: 17,
        fontWeight: fonts.weightBold,
        fontFamily: fonts.proxima,
        color,
      },
      textContent: {
        fontSize: 20,
        fontWeight: fonts.weightBold,
        fontFamily: fonts.proxima,
        fontStyle: "normal",
        fontStretch: "normal",
        letterSpacing: "normal",
        whiteSpace: "nowrap",
        color: palettes.textColors.Ink,
      },
      icon: {
        width: 17,
        height: 17,
        margin: "16px 10px",
      },
      topLine: {
        height: 10,
        width: "100%",
      },
      subMetricContainer: {
        display: "flex",
        flexDirection: "row",
        margin: "0px 0px 15px 0px",
      },
      subIcon: {
        width: 16,
        height: 16,
        margin: "3px 5px",
      },
      subLine: {
        height: 3,
        width: 20,
        margin: "10px 10px 10px 23px",
      },
      subTextContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "3px 30px 3px 0px",
      },
      subTitle: {
        fontSize: 12,
        fontWeight: fonts.weightMedium,
        fontFamily: fonts.proxima,
        color,
      },
      subTextContent: {
        fontSize: 12,
        fontWeight: fonts.weightMedium,
        fontFamily: fonts.proxima,
        fontStyle: "normal",
        fontStretch: "normal",
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
    });
  }

  @computed
  get renderSubMetric() {
    const { subMetric } = this.props;
    if (subMetric == null || subMetric.length == 0) {
      return null;
    }
    return subMetric.map((metric) => {
      const { title, content, color, strokeDasharray, icon } = metric;
      return (
        <div className={css(this.styles.contentContainer)}>
          <svg className={css(this.styles.subLine)}>
            <line
              x1="0"
              y1="5"
              x2="100%"
              y2="5"
              stroke={color}
              strokeWidth={10}
              strokeDasharray={strokeDasharray}
            />
          </svg>
          <Illustration
            className={css(this.styles.subIcon)}
            name={icon}
            alt={title}
          />
          <div className={css(this.styles.subTextContainer)}>
            <div className={css(this.styles.subTitle)}>{title}</div>
            <div className={css(this.styles.subTextContent)}>{content}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    const {
      title,
      icon,
      color,
      strokeDasharray,
      children,
      className,
      style,
      subMetric,
      ...popoverProps
    } = this.props;

    const validChildren = React.Children.toArray(children).filter(
      (e) => e != null
    );

    const childIsText =
      validChildren.length == 1 && typeof validChildren[0] === "string";

    return (
      <div className={css(this.styles.root, className, style)}>
        <svg className={css(this.styles.topLine)}>
          <line
            x1="0"
            y1="5"
            x2="100%"
            y2="5"
            stroke={color}
            strokeWidth={10}
            strokeDasharray={strokeDasharray}
          />
        </svg>
        <Popover
          position={"top center"}
          popoverMaxWidth={250}
          {...popoverProps}
        >
          <div className={css(this.styles.metricsContainer)}>
            <div className={css(this.styles.contentContainer)}>
              <Illustration
                className={css(this.styles.icon)}
                name={icon}
                alt={title}
              />
              <div className={css(this.styles.textContainer)}>
                <div className={css(this.styles.title)}>{title}</div>
                {childIsText ? (
                  <div className={css(this.styles.textContent)}>
                    {validChildren[0]}
                  </div>
                ) : (
                  validChildren
                )}
              </div>
            </div>
            {this.renderSubMetric}
          </div>
        </Popover>
      </div>
    );
  }
}
export default LineChartMetric;
