/* eslint local-rules/unwrapped-i18n: 0 */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, action } from "mobx";

/* External Libraries */
import hash from "object-hash";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import truckIcon from "@assets/img/deliver-02.svg";
import deliveredIcon from "@assets/img/deliver-01.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedTrackingCheckpointSchema } from "@toolkit/orders/detail";
import { CheckpointAfterActionState } from "@schema/types";

type CheckpointProps = BaseProps & {
  readonly checkpoint: Readonly<PickedTrackingCheckpointSchema>;
};

const TimelineWidth = 30;

type RenderedCheckpoints = Extract<
  CheckpointAfterActionState,
  "DELIVERED" | "OUT_FOR_DELIVERY"
>;

const CheckpointIcons: { [type in RenderedCheckpoints]: string } = {
  DELIVERED: deliveredIcon,
  OUT_FOR_DELIVERY: truckIcon,
};

@observer
class Checkpoint extends Component<CheckpointProps> {
  ["constructor"]: typeof Checkpoint;
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 20px",
      },
      date: {
        color: palettes.textColors.LightInk,
        fontSize: 14,
        padding: "2px 0px",
        cursor: "default",
      },
      location: {
        color: palettes.textColors.LightInk,
        fontSize: 14,
        padding: "2px 0px",
        cursor: "default",
      },
      text: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        padding: "2px 0px",
        cursor: "default",
      },
      status: {
        color: palettes.textColors.LightInk,
        textTransform: "uppercase",
        fontSize: 13,
        fontWeight: fonts.weightNormal,
        padding: "2px 0px",
        cursor: "default",
      },
    });
  }

  @computed
  get location(): string | null | undefined {
    const { checkpoint } = this.props;
    const { country, state, city } = checkpoint.location;
    if (country == null) {
      return null;
    }
    return (
      [city, state, country.code].filter((_) => !!_).join(", ") || country.name
    );
  }

  render() {
    const { checkpoint, className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.date)}>{checkpoint.date.formatted}</div>
        {this.location && (
          <div className={css(this.styles.location)}>{this.location}</div>
        )}
        {checkpoint.resultingTrackingState && (
          <div className={css(this.styles.status)}>
            {checkpoint.resultingTrackingState}
          </div>
        )}
        <div className={css(this.styles.text)}>{checkpoint.message}</div>
      </div>
    );
  }
}

export type AftershipCheckpointsProps = BaseProps & {
  checkpoints: ReadonlyArray<PickedTrackingCheckpointSchema>;
  foldCount?: number | null | undefined;
};

@observer
class AftershipCheckpoints extends Component<AftershipCheckpointsProps> {
  ["constructor"]: typeof AftershipCheckpoints;

  static demoProps: AftershipCheckpointsProps = {
    checkpoints: [
      {
        resultingTrackingState: "IN_TRANSIT",
        location: {
          country: {
            name: "Flyt Express's sorting centre",
            code: "US",
          },
          city: null,
          zipcode: null,
          state: null,
        },
        date: {
          formatted: "May 11, 2018",
          timeSince: {
            days: 100,
          },
        },
        message: "Item received",
      },
      {
        resultingTrackingState: "IN_TRANSIT",
        location: {
          country: {
            name: "Flyt Express's sorting centre",
            code: "US",
          },
          city: null,
          zipcode: null,
          state: null,
        },
        date: {
          formatted: "May 11, 2018",
          timeSince: {
            days: 100,
          },
        },
        message: "Item in warehouse. PKG#:PKG18051113032",
      },
      {
        resultingTrackingState: "IN_TRANSIT",
        location: {
          country: {
            name: "Flyt Express's sorting centre",
            code: "US",
          },
          city: null,
          zipcode: null,
          state: null,
        },
        date: {
          formatted: "May 11, 2018",
          timeSince: {
            days: 100,
          },
        },
        message: "Item dispatched. PKG#:PKG18051113032",
      },
      {
        resultingTrackingState: "IN_TRANSIT",
        location: {
          country: {
            name: "Flyt Express's sorting centre",
            code: "US",
          },
          city: null,
          zipcode: null,
          state: null,
        },
        date: {
          formatted: "May 11, 2018",
          timeSince: {
            days: 100,
          },
        },
        message: "Item on freight. PKG#:PKG18051113032",
      },
      {
        resultingTrackingState: "IN_TRANSIT",
        location: {
          country: {
            name: "Flyt Express's sorting centre",
            code: "US",
          },
          city: null,
          zipcode: null,
          state: null,
        },
        date: {
          formatted: "May 11, 2018",
          timeSince: {
            days: 100,
          },
        },
        message: "Item in transit",
      },
    ],
    foldCount: 3,
  };

  @computed
  get styles() {
    const lineKeyframes = {
      from: {
        transform: "scale(1, 0)",
      },

      to: {
        transform: "scale(1, 1)",
      },
    };

    const iconKeyframes = {
      from: {
        transform: "scale(0, 0)",
      },

      to: {
        transform: "scale(1, 1)",
      },
    };

    return StyleSheet.create({
      root: {
        display: "flex",
        position: "relative",
        flexDirection: "column",
      },
      table: {
        zIndex: 1,
        marginBottom: 20,
        borderCollapse: "collapse",
      },
      icon: {
        animationName: [iconKeyframes],
        animationDuration: "1050ms",
      },
      iconImage: {
        width: TimelineWidth,
      },
      iconSolid: {
        width: TimelineWidth * 0.7,
        height: TimelineWidth * 0.7,
        borderRadius: "100%",
        backgroundColor: "#e2edf3",
      },
      checkpoint: {
        marginBottom: 13,
      },
      lineContainer: {
        zIndex: 0,
        position: "absolute",
        top: 0,
        bottom: 0,
        width: TimelineWidth,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        animationName: [lineKeyframes],
        animationDuration: "750ms",
        transformOrigin: "bottom",
      },
      line: {
        width: 4,
        backgroundColor: "#e2edf3",
        height: "100%",
        borderRadius: 2,
      },
      iconContainer: {
        display: "flex",
        width: TimelineWidth,
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
      },
      bottomFog: {
        backgroundImage: "linear-gradient(transparent, white)",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingLeft: TimelineWidth + 20,
      },
      showToggle: {
        opacity: 1,
        color: palettes.coreColors.WishBlue,
        transition: "all 0.3s linear",
        ":hover": {
          opacity: 0.6,
        },
        fontWeight: fonts.weightSemibold,
        fontSize: 16,
        cursor: "pointer",
      },
      modal: {
        padding: "20px 40px",
      },
    });
  }

  @computed
  get checkpoints(): ReadonlyArray<PickedTrackingCheckpointSchema> {
    const { checkpoints, foldCount } = this.props;
    const numVisible = foldCount != null ? foldCount : checkpoints.length;
    return checkpoints
      .slice(checkpoints.length - numVisible, checkpoints.length)
      .reverse();
  }

  @computed
  get allCheckpointsVisible() {
    const { checkpoints } = this.props;
    return this.checkpoints.length == checkpoints.length;
  }

  @action
  onShowMoreToggled = () => {
    const { checkpoints } = this.props;

    const AftershipCheckpoints = this.constructor;
    new Modal(() => (
      <div className={css(this.styles.modal)}>
        <AftershipCheckpoints checkpoints={checkpoints} />
      </div>
    ))
      .setHeader({ title: i`Tracking History` })
      .setWidthPercentage(0.46)
      .render();
  };

  renderTimeline(checkpoint: PickedTrackingCheckpointSchema, idx: number) {
    const { checkpoints } = this;
    const animationDuration = (idx / checkpoints.length) * 2500;
    const style = { animationDuration: `${animationDuration}ms` };

    const icon =
      CheckpointIcons[checkpoint.resultingTrackingState as RenderedCheckpoints];
    if (icon) {
      return (
        <img
          src={icon}
          alt="icon"
          style={style}
          className={css(this.styles.icon, this.styles.iconImage)}
        />
      );
    }

    return (
      <div
        style={style}
        className={css(this.styles.icon, this.styles.iconSolid)}
      />
    );
  }

  render() {
    const { foldCount, checkpoints, className } = this.props;

    const showFoldToggle = foldCount && checkpoints.length > foldCount;

    return (
      <div className={css(this.styles.root, className)}>
        <div
          key={hash(this.checkpoints)}
          className={css(this.styles.lineContainer)}
        >
          <div className={css(this.styles.line)} />
        </div>
        <table className={css(this.styles.table)}>
          <tbody>
            {this.checkpoints.map((checkpoint, idx) => {
              return (
                <tr key={hash(checkpoint)}>
                  <td className={css(this.styles.iconContainer)}>
                    {this.renderTimeline(checkpoint, idx)}
                  </td>
                  <td>
                    <Checkpoint
                      className={css(this.styles.checkpoint)}
                      checkpoint={checkpoint}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={css(this.styles.bottomFog)}>
          {showFoldToggle && (
            <div
              className={css(this.styles.showToggle)}
              onClick={this.onShowMoreToggled}
            >
              {!this.allCheckpointsVisible && i`Show all`}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AftershipCheckpoints;
