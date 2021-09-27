import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Accordion, Card, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

@observer
class FBWInstruction extends Component<BaseProps> {
  @observable
  isInstructionsOpen = false;

  @computed
  get styles() {
    return StyleSheet.create({
      card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        padding: "24px",
      },
      textStatsTitle: {
        paddingTop: "10px",
        fontSize: 20,
        color: palettes.textColors.DarkInk,
      },
      topSection: {
        display: "flex",
        flexDirection: "column",
        padding: "20px 0px",
        fontSize: 16,
      },
      button: {
        width: 100,
      },
      explanation: {
        fontSize: "16px",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
      nestedExplanation: {
        fontSize: "16px",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: "#152934",
        padding: "15px",
        display: "block",
        textAlign: "left",
      },
      instructionTitle: {
        padding: "15px",
        fontSize: 20,
        color: palettes.textColors.DarkInk,
      },
      instructionRow: {
        display: "flex",
        backgroundColor: colors.pageBackground,
      },
      instructionCell: {
        flex: 1,
        padding: "15px",
        margin: "0px 20px 0px 20px",
        width: "100%",
        height: "220px",
        borderRadius: 5,
        border: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        backgroundColor: palettes.textColors.White,
      },
      imageContainer: {
        padding: "15px",
        width: "20%",
        display: "block",
      },
      instructionText: {
        textAlign: "left",
        height: 40,
      },
      image: {
        height: "150px",
        display: "block",
      },
    });
  }

  render() {
    return (
      <Card className={css(this.styles.card)}>
        <div className={css(this.styles.content)}>
          <Text weight="bold" className={css(this.styles.textStatsTitle)}>
            Pack your products
          </Text>
          <div className={css(this.styles.content)}>
            <Text weight="medium" className={css(this.styles.explanation)}>
              Pack each SKU individually and place grouped SKUs and manifests
              inside sturdy cases.
            </Text>
          </div>
        </div>
        <Accordion
          header={i`Instructions`}
          isOpen={this.isInstructionsOpen}
          onOpenToggled={(isOpen) => (this.isInstructionsOpen = isOpen)}
          backgroundColor={palettes.greyScaleColors.LighterGrey}
        >
          {this.renderInstructions()}
        </Accordion>
      </Card>
    );
  }

  renderInstructions() {
    return (
      <div className={css(this.styles.content)}>
        <Text weight="bold" className={css(this.styles.instructionTitle)}>
          Attach SKU labels
        </Text>
        <Text weight="medium" className={css(this.styles.nestedExplanation)}>
          Note for FBW-US: You may choose to skip the step of individually
          packaging SKUs and instead directly attach the SKU label to the
          product itself. A nominal FBW order repackaging fee will apply.
        </Text>
        <div className={css(this.styles.instructionRow)}>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Download and print SKU labels.
            </div>
            <Illustration
              name="fbwstep01"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Cut labels into individual ones.
            </div>
            <Illustration
              name="fbwstep02"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Attach a SKU label to each package.
            </div>
            <Illustration
              name="fbwstep03"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Package each SKU individually.
            </div>
            <Illustration
              name="fbwstep04"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Group the same SKUs in each case.
            </div>
            <Illustration
              name="fbwstep05"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
        </div>
        <div className={css(this.styles.instructionTitle)}>
          Place manifests in cases
        </div>
        <div className={css(this.styles.instructionRow)}>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Download and print manifest.
            </div>
            <Illustration
              name="fbwstep06"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Place one manifest in each case.
            </div>
            <Illustration
              name="fbwstep07"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
        </div>
        <div className={css(this.styles.instructionTitle)}>
          Attach case labels
        </div>
        <div className={css(this.styles.instructionRow)}>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Download and print case labels.
            </div>
            <Illustration
              name="fbwstep08"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
          <div className={css(this.styles.imageContainer)}>
            <div className={css(this.styles.instructionText)}>
              Stick case label on each case.
            </div>
            <Illustration
              name="fbwstep09"
              alt="illustration"
              className={css(this.styles.image)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default FBWInstruction;
