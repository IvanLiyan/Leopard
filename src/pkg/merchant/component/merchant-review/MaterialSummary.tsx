// This file was grandfathered in. Disable this rule

/* eslint-disable local-rules/no-large-method-params */
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { ImageList } from "@merchant/component/core";
import ImageViewer from "@merchant/component/core/modal/ImageViewer";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import { default as Row } from "@merchant/component/merchant-review/InfoRow";

/* Toolkit */
import { callAsync } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";
import {
  MaterialProps,
  EntityProps,
  ReauthType,
} from "@toolkit/merchant-review/material-types";
import { TicketState } from "@merchant/component/merchant-review/StateLabel";

/* Merchant Stores */
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type MaterialSummaryData = {
  readonly reauthType: ReauthType;
  readonly ticketId: string;
  readonly state: TicketState;
  readonly materialSummary: ReadonlyArray<EntityProps>;
};

export type MaterialSummaryProps = BaseProps & MaterialSummaryData;

@observer
class MaterialSummary extends Component<MaterialSummaryProps> {
  @observable
  isOpen = true;

  @observable
  realNameVerifyResult: string | null | undefined;

  @observable
  realNameVerifyButtonDisabled = false;

  @observable
  realNameVerifyButtonLoading = false;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        color: palettes.textColors.Ink,
      },
      content: {
        padding: "20px 0px 4px 48px",
      },
      space: {
        marginBottom: 16,
      },
      line: {
        borderBottom: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        width: "100%",
        height: 0,
      },
      entityName: {
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        marginBottom: 20,
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingBottom: 24,
      },
      verifyResultContainer: {
        marginLeft: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
    });
  }

  handleClickImage = (
    entityName: string,
    materialName: string,
    imageGroup: ImageGroupProps,
    imageId?: string
  ) => {
    const imageViewer = new ImageViewer({
      imageGroups: [imageGroup],
      selectedImageId: imageId,
      title: entityName + " > " + materialName,
      showSidebar: true,
    });
    imageViewer.render();
  };

  @action
  handleRealNameVerification = async () => {
    this.realNameVerifyButtonLoading = true;

    const param = {
      ticketId: this.props.ticketId,
    };

    try {
      // TODO: migrate this call https://phab.wish.com/w/webpack/api-calls/
      // eslint-disable-next-line local-rules/no-untyped-api-calls
      const resp = await callAsync(
        "merchant/get-real-name-verification-for-reauth",
        param
      );

      this.realNameVerifyButtonLoading = false;
      if (!resp.data.fail_reason) {
        this.realNameVerifyResult = i`No Result`;
      } else {
        this.realNameVerifyResult = resp.data.fail_reason;
        this.realNameVerifyButtonDisabled = true;
      }
    } catch (e) {
      this.realNameVerifyButtonLoading = false;
    }
  };

  renderOneMaterial = (entityName: string, material: MaterialProps) => {
    let content: ReactNode | null = null;
    if (material.type == "text") {
      content = material.text;
    } else if (material.type == "choice") {
      const key = material.userChoice || "";
      const choices = material.choices || {};
      content = choices[key] || "";
    } else if (material.type == "image") {
      content = this.renderImageMaterialContent(entityName, material);
    }

    return (
      <Row
        title={material.name || ""}
        style={this.styles.space}
        titleWidth={220}
        key={material.id}
      >
        {content || "N/A"}
      </Row>
    );
  };

  renderImageMaterialContent = (
    entityName: string,
    material: MaterialProps
  ) => {
    if (!material.images) {
      return null;
    }
    const imageGroup = material.images;
    const { groupId, images } = imageGroup;
    const displayImageCount = 3;
    const hiddenImageCount = images.length - displayImageCount;
    const { locale } = LocalizationStore.instance();
    return (
      <ImageList
        imageListId={groupId}
        moreImageCount={hiddenImageCount}
        onMoreButtonClick={() =>
          this.handleClickImage(entityName, material.name || "", imageGroup)
        }
        locale={locale}
      >
        {images.slice(0, displayImageCount).map((image) => (
          <ImageList.Image
            src={image.src}
            name={image.name}
            key={image.imageId}
            imageId={image.imageId}
            onClick={(imageId) =>
              this.handleClickImage(
                entityName,
                material.name || "",
                imageGroup,
                imageId || ""
              )
            }
          />
        ))}
      </ImageList>
    );
  };

  renderOneEntity = (
    entity: EntityProps,
    index: number,
    array: ReadonlyArray<EntityProps>
  ) => {
    let line: null | ReactNode = null;
    if (index != array.length - 1) {
      line = <div className={css(this.styles.line, this.styles.space)} />;
    }
    let extraRow: null | ReactNode = null;
    if (entity.extraValue) {
      extraRow = (
        <Row
          title={entity.extraKey || i`Extra Value`}
          style={this.styles.space}
          titleWidth={220}
        >
          {entity.extraValue}
        </Row>
      );
    }
    return (
      <div key={entity.id}>
        <div className={css(this.styles.entityName)}>{entity.name}</div>
        {extraRow}
        {entity.materials.map((material) =>
          this.renderOneMaterial(entity.name, material)
        )}
        {line}
      </div>
    );
  };

  renderRealNameVerification() {
    const { reauthType, state } = this.props;
    if (reauthType != "registration_info") {
      return null;
    }
    if (state == "approved" || state == "rejected") {
      return null;
    }

    return (
      <>
        <div className={css(this.styles.line)} />
        <div className={css(this.styles.content)}>
          <div className={css(this.styles.buttonContainer)}>
            <PrimaryButton
              onClick={this.handleRealNameVerification}
              isDisabled={this.realNameVerifyButtonDisabled}
              isLoading={this.realNameVerifyButtonLoading}
            >
              Real-name Verification
            </PrimaryButton>
            <div className={css(this.styles.verifyResultContainer)}>
              {this.realNameVerifyResult}
            </div>
          </div>
        </div>
      </>
    );
  }

  renderMaterialSummery() {
    const { materialSummary } = this.props;
    if (materialSummary) {
      return (
        <div className={css(this.styles.content)}>
          {materialSummary.map(this.renderOneEntity)}
        </div>
      );
    }
    return (
      <div className={css(this.styles.content, this.styles.space)}>
        Merchant hasn't submitted any materials.
      </div>
    );
  }

  render() {
    const { style } = this.props;
    return (
      <Card style={[this.styles.root, style]}>
        <Accordion
          header={i`Submitted Materials Summary`}
          isOpen={this.isOpen}
          onOpenToggled={(isOpen) => (this.isOpen = isOpen)}
        >
          {this.renderMaterialSummery()}
          {this.renderRealNameVerification()}
        </Accordion>
      </Card>
    );
  }
}
export default MaterialSummary;
