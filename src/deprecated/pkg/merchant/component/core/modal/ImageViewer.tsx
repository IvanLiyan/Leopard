//
//  component/modal/ImageViewer.tsx
//  Project-Lego
//
//  Created by Mengyu Yuan on 1/8/19.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/no-frozen-width */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import Modal, { OnCloseFn } from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import * as icons from "@assets/icons";

/* SVGs */
import closeWhite from "@assets/img/close-white.svg";
import showListWhite from "@assets/img/show-list-white.svg";

import DeviceStore from "@stores/DeviceStore";
import ToastStore from "@stores/ToastStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

export type ImageProps = {
  imageId: string;
  name: string;
  src: string;
};

export type ImageGroupProps = {
  groupId: string;
  groupTitle?: string;
  images: ReadonlyArray<ImageProps>;
};

export type ImageViewerProps = BaseProps & {
  imageGroups: ReadonlyArray<ImageGroupProps>;
  title?: string;
  selectedImageId?: string;
  showSidebar?: boolean;
  closeWhenClickBlank?: boolean;
};

type ImageViewerInternalProps = ImageViewerProps & {
  onCloseFn: OnCloseFn;
  modal: Modal;
};

type ImageInfoInternal = {
  imageId: string;
  name: string;
  src: string;
  groupId: string;
  imageCountInGroup: number;
  imageIndexInGroup: number; // start from "1"
  prevImageId: string | null | undefined;
  nextImageId: string | null | undefined;
};

type Size = {
  w: number;
  h: number;
};

type Coord = {
  x: number;
  y: number;
};

type ImageViewerLeftPanelProps = BaseProps & {
  image: ImageInfoInternal | null | undefined;
  isFirstImage: boolean;
  isLastImage: boolean;
  closeWhenClickBlank: boolean;
  onCloseFn: OnCloseFn;
  onPrev: () => unknown;
  onNext: () => unknown;
  onShowSidebar: () => unknown;
};

@observer
class ImageViewerLeftPanel extends Component<ImageViewerLeftPanelProps> {
  lastMousePos: Coord = { x: 0, y: 0 };
  imageMoved = false;

  @observable
  isMoving = false;

  @observable
  imageSize: Size = { w: 1, h: 1 };

  @observable
  imageMove: Coord = { x: 0, y: 0 };

  @observable
  imageScale = 1;

  panel: HTMLDivElement | null | undefined = null;

  @computed
  get styles() {
    const maskBaseColor = "21, 41, 52";

    // The numbers are from fancybox3, which makes the gradient very smooth
    // http://fancyapps.com/fancybox/3/
    const gradient =
      `rgba(${maskBaseColor},.7) 0,` +
      `rgba(${maskBaseColor},.3) 50%,` +
      `rgba(${maskBaseColor},.15) 65%,` +
      `rgba(${maskBaseColor},.075) 75.5%,` +
      `rgba(${maskBaseColor},.037) 82.85%,` +
      `rgba(${maskBaseColor},.019) 88%,` +
      `transparent`;

    const imageWidth = this.imageSize.w * this.imageScale;
    const imageHeight = this.imageSize.h * this.imageScale;

    const offsetX = this.imageMove.x - imageWidth / 2;
    const offsetY = this.imageMove.y - imageHeight / 2;

    const { isFirstImage, isLastImage } = this.props;
    return StyleSheet.create({
      root: {
        flex: 1,
        overflow: "hidden",
        color: palettes.textColors.White,
        position: "relative",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: this.isMoving ? "grabbing" : "normal",
      },
      toolbar: {
        position: "absolute",
        top: 0,
        width: "100%",
        padding: "24px 0 30px 0",
        backgroundImage: `linear-gradient(180deg, ${gradient})`,
        display: "flex",
        zIndex: 10,
      },
      imageNumber: {
        marginLeft: 16,
        fontSize: 20,
        fontWeight: fonts.weightMedium,
      },
      tool: {
        width: 24,
        height: 24,
        marginRight: 24,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        cursor: "pointer",
        transition: "opacity 250ms",
        opacity: 0.7,
        ":hover": {
          opacity: 1,
        },
      },
      toolDisabled: {
        opacity: 0.2,
        cursor: "normal",
        ":hover": {
          opacity: 0.2,
        },
      },
      toolZoomIn: {
        backgroundImage: `url(${icons.zoomInWhite})`,
      },
      toolZoomOut: {
        backgroundImage: `url(${icons.zoomOutWhite})`,
      },
      toolShowSidebar: {
        backgroundImage: `url(${showListWhite})`,
      },
      toolClose: {
        backgroundImage: `url(${closeWhite})`,
      },
      tools: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
      },
      arrow: {
        position: "absolute",
        width: 36,
        height: 36,
        backgroundColor: `rgba(${maskBaseColor}, 0.8)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "50%",
        backgroundPosition: "center",
        backgroundImage: `url(${icons.arrowUpWhite})`,
        top: "50%",
        cursor: "pointer",
        transition: "opacity 250ms, visibility 250ms",
        zIndex: 10,
      },
      leftArrow: {
        transform: "translateY(-50%) rotate(-90deg)",
        opacity: isFirstImage ? 0 : 0.7,
        visibility: isFirstImage ? "hidden" : undefined,
        left: 16,
        ":hover": {
          opacity: isFirstImage ? 0 : 1,
        },
      },
      rightArrow: {
        transform: "translateY(-50%) rotate(90deg)",
        opacity: isLastImage ? 0 : 0.7,
        visibility: isLastImage ? "hidden" : undefined,
        right: 16,
        ":hover": {
          opacity: isLastImage ? 0 : 1,
        },
      },
      imageBox: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: this.imageSize.w * this.imageScale,
        height: this.imageSize.h * this.imageScale,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        zIndex: 5,
      },
      imageName: {
        position: "absolute",
        bottom: 0,
        left: 0,
        textAlign: "center",
        width: "100%",
        height: 30,
        padding: "30px 0 24px 0",
        fontSize: 20,
        backgroundImage: `linear-gradient(0deg, ${gradient})`,
        zIndex: 10,
      },
    });
  }

  @computed
  get initImageScale() {
    const leftPanelWidth = this.panel ? this.panel.clientWidth : 1;
    const leftPanelHeight = this.panel ? this.panel.clientHeight : 1;

    const imageRatio = this.imageSize.w / this.imageSize.h;
    const leftPanelRatio = leftPanelWidth / leftPanelHeight;

    let ratio = 0;
    if (imageRatio > leftPanelRatio) {
      ratio = (leftPanelWidth * 0.8) / this.imageSize.w;
    } else {
      ratio = (leftPanelHeight * 0.8) / this.imageSize.h;
    }

    if (ratio > 1) {
      ratio = 1;
    }

    return ratio;
  }

  handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!this.props.closeWhenClickBlank) {
      return;
    }
    if (this.imageMoved) {
      return;
    }

    const target: HTMLElement = e.target as any;
    if (target.getAttribute("dataid") == "leftPanel") {
      if (this.props.onCloseFn) {
        this.props.onCloseFn();
      }
    }
  };

  @action
  handleClickZoomIn = () => {
    if (this.imageScale >= 1) {
      return;
    }

    const lastImageScale = this.imageScale;
    this.imageScale += 0.1;
    if (this.imageScale > 1) {
      this.imageScale = 1;
    }

    // So that the zoom pivot is the center of the LeftPanel
    // instead of the center of image
    this.imageMove.x *= this.imageScale / lastImageScale;
    this.imageMove.y *= this.imageScale / lastImageScale;
  };

  @action
  handleClickZoomOut = () => {
    if (this.imageScale <= this.initImageScale) {
      return;
    }

    const lastImageScale = this.imageScale;
    this.imageScale -= 0.1;
    if (this.imageScale < this.initImageScale) {
      this.imageScale = this.initImageScale;
    }

    if (this.imageScale <= this.initImageScale) {
      this.imageMove = { x: 0, y: 0 };
    }

    // So that the zoom pivot is the center of the LeftPanel
    // instead of the center of image
    this.imageMove.x *= this.imageScale / lastImageScale;
    this.imageMove.y *= this.imageScale / lastImageScale;
  };

  handleClickClose = () => {
    if (this.props.onCloseFn) {
      this.props.onCloseFn();
    }
  };

  @action
  handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    this.imageSize = {
      w: e.currentTarget.naturalWidth,
      h: e.currentTarget.naturalHeight,
    };
    this.imageMove = { x: 0, y: 0 };
    this.imageScale = this.initImageScale;
    this.isMoving = false;
    this.imageMoved = false;
  };

  handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.lastMousePos = {
      x: e.clientX,
      y: e.clientY,
    };
    this.isMoving = true;
    this.imageMoved = false;
  };

  @action
  handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!this.isMoving) {
      return;
    }

    const pos = {
      x: e.clientX,
      y: e.clientY,
    };
    if (pos.x == 0 && pos.y == 0) {
      return;
    }

    this.imageMove = {
      x: pos.x - this.lastMousePos.x + this.imageMove.x,
      y: pos.y - this.lastMousePos.y + this.imageMove.y,
    };

    this.lastMousePos = pos;
    this.imageMoved = true;
  };

  handleDragEnd = () => {
    this.isMoving = false;
  };

  renderImageNumber() {
    const { image } = this.props;
    if (image) {
      return (
        <div className={css(this.styles.imageNumber)}>
          {image.imageIndexInGroup} / {image.imageCountInGroup}
        </div>
      );
    }
    return null;
  }

  renderTools() {
    const { onCloseFn, onShowSidebar } = this.props;
    const zoomInCss = css(
      this.styles.tool,
      this.styles.toolZoomIn,
      this.imageScale >= 1 && this.styles.toolDisabled,
    );
    const zoomOutCss = css(
      this.styles.tool,
      this.styles.toolZoomOut,
      this.imageScale <= this.initImageScale && this.styles.toolDisabled,
    );
    return (
      <div className={css(this.styles.tools)}>
        <div className={zoomInCss} onClick={this.handleClickZoomIn} />
        <div className={zoomOutCss} onClick={this.handleClickZoomOut} />
        <div
          className={css(this.styles.tool, this.styles.toolShowSidebar)}
          onClick={onShowSidebar}
        />
        <div
          className={css(this.styles.tool, this.styles.toolClose)}
          onClick={onCloseFn}
        />
      </div>
    );
  }

  renderImage() {
    const { image } = this.props;
    if (image) {
      return (
        <div className={css(this.styles.imageBox)}>
          <NextImage
            src={image.src}
            draggable={false}
            onLoad={this.handleImageLoaded}
          />
        </div>
      );
    }
    return null;
  }

  renderImageName() {
    const { image } = this.props;
    if (image) {
      return <div className={css(this.styles.imageName)}>{image.name}</div>;
    }
    return null;
  }

  render() {
    const { onNext, onPrev } = this.props;
    return (
      <div
        className={css(this.styles.root)}
        ref={(panel) => (this.panel = panel)}
        //@ts-ignore dataid is here so we can lookup the node
        // in handleOutsideClick
        dataid="leftPanel"
        onClick={this.handleOutsideClick}
        onMouseMove={this.handleDrag}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
      >
        <div className={css(this.styles.toolbar)}>
          {this.renderImageNumber()}
          {this.renderTools()}
        </div>

        <div
          className={css(this.styles.arrow, this.styles.leftArrow)}
          onClick={onPrev}
        />
        <div
          className={css(this.styles.arrow, this.styles.rightArrow)}
          onClick={onNext}
        />
        {this.renderImage()}
        {this.renderImageName()}
      </div>
    );
  }
}

@observer
class ImageViewContent extends Component<ImageViewerInternalProps> {
  @observable
  userToggleSidebar: boolean | null | undefined;

  @observable
  userSelectedImageId: string | null | undefined;

  @computed
  get imageMap():
    | {
        [imageId: string]: ImageInfoInternal;
      }
    | null
    | undefined {
    const { imageGroups } = this.props;
    if (!imageGroups) {
      return null;
    }

    const result: {
      [imageId: string]: ImageInfoInternal;
    } = {};

    let lastImageId: string | null | undefined = null;

    for (const group of imageGroups) {
      const { images } = group;
      if (!images) {
        continue;
      }

      const count = images.length;
      let index = 1;
      for (const image of images) {
        const imageInfo = {
          imageId: image.imageId,
          name: image.name,
          src: image.src,
          groupId: group.groupId,
          imageCountInGroup: count,
          imageIndexInGroup: index,
          prevImageId: lastImageId,
          nextImageId: null,
        };
        result[image.imageId] = imageInfo;

        if (lastImageId) {
          result[lastImageId].nextImageId = image.imageId;
        }

        lastImageId = image.imageId;
        index++;
      }
    }

    return result;
  }

  @computed
  get firstImage(): ImageInfoInternal | null | undefined {
    const { imageMap } = this;
    if (!imageMap) {
      return null;
    }

    for (const imageId of Object.keys(imageMap)) {
      const image = imageMap[imageId];
      if (!image.prevImageId) {
        return image;
      }
    }

    return null;
  }

  @computed
  get showSidebar() {
    const {
      props: { showSidebar },
      userToggleSidebar,
    } = this;
    if (userToggleSidebar != null) {
      return userToggleSidebar;
    }
    return !!showSidebar;
  }

  @computed
  get selectedImageId() {
    const {
      props: { selectedImageId },
      userSelectedImageId,
    } = this;
    if (userSelectedImageId != null) {
      return userSelectedImageId;
    }
    return selectedImageId;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        boxSizing: "border-box",
        height: DeviceStore.instance().screenInnerHeight,
        userSelect: "none",
      },
      container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        height: "100%",
      },
      rightPanel: {
        backgroundColor: palettes.greyScaleColors.LighterGrey,
        overflow: "hidden",
        transition: "width 250ms",
        "@media (min-width: 1024px)": {
          width: this.showSidebar ? 455 : 0,
        },
        "@media (max-width: 1023px)": {
          width: this.showSidebar ? 232 : 0,
        },
      },
      rightPanelInner: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        color: palettes.textColors.DarkInk,

        // auto show vertical scrollbar
        height: "100%",
        overflowY: "auto",

        // The width of inner DIV won't be affected by the width of parent DIV
        // It looks better during animation:
        //    Inner DIV stays still while the parent shrinks
        transition: "width 250ms",
        "@media (min-width: 1024px)": {
          width: 455,
        },
        "@media (max-width: 1023px)": {
          width: 232,
        },
      },
      title: {
        margin: "32px 16px 24px 16px",
        fontSize: "20px",
        fontWeight: fonts.weightSemibold,
        lineHeight: "30px",
      },
      groupTitle: {
        backgroundColor: palettes.greyScaleColors.LightGrey,
        padding: "8px 16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      groupTitleText: {
        fontWeight: fonts.weightMedium,
        flex: 1,
      },
      imageContainerInGroup: {
        padding: 12,
        display: "flex",
        flexWrap: "wrap",
      },
      imageInGroup: {
        margin: 4,
        width: 198,
        height: 90,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        boxSizing: "content-box",
        borderRadius: 4,
      },
      imageInGroupSelected: {
        margin: 0,
        border: `5px ${palettes.coreColors.WishBlue} solid`,
      },
      image: {
        maxWidth: "100%",
        maxHeight: "100%",
      },
      imageFill: {
        width: "100%",
        height: "100%",
      },
    });
  }

  @computed
  get isFirstImage() {
    const image = this.selectedImage;
    if (!image || !image.prevImageId) {
      return true;
    }
    return false;
  }

  @computed
  get isLastImage() {
    const image = this.selectedImage;
    if (!image || !image.nextImageId) {
      return true;
    }
    return false;
  }

  @computed
  get toggleBodyScrollbar() {
    const { modal } = this.props;
    // It may have its own scrollbar in the right panel.
    // Need to hide the scrollbar of body to prevent showing
    // 2 scrollbars together

    // toastStore.modalOpen is observable, use it as a trigger,
    // check modal.modalClosed to make sure it only takes effect for this
    // perticular modal, in case there are multiple modals in the page.
    const toastStore = ToastStore.instance();
    const css = "body { overflow: hidden }"; // prevent it from being translated
    if (toastStore.modalOpen && !modal.modalClosed) {
      return <style>{css}</style>;
    }
    return null;
  }

  @computed
  get selectedImage() {
    if (!this.imageMap) {
      return null;
    }

    if (!this.selectedImageId) {
      return this.firstImage;
    }

    return this.imageMap[this.selectedImageId];
  }

  @action
  handleImageClick = (imageId: string) => {
    this.userSelectedImageId = imageId;
  };

  @action
  handleClickPrev = () => {
    const image = this.selectedImage;
    if (!image || !image.prevImageId) {
      return;
    }

    this.userSelectedImageId = image.prevImageId;
  };

  @action
  handleClickNext = () => {
    const image = this.selectedImage;
    if (!image || !image.nextImageId) {
      return;
    }

    this.userSelectedImageId = image.nextImageId;
  };

  @action
  handleClickShowSidebar = () => {
    this.userToggleSidebar = !this.showSidebar;
  };

  renderRightPanelTitle() {
    const { title } = this.props;
    if (title) {
      return <div className={css(this.styles.title)}>{title}</div>;
    }
    return null;
  }

  renderOneGroup(group: ImageGroupProps) {
    const { groupId, groupTitle, images } = group;
    return (
      <div key={groupId}>
        <div className={css(this.styles.groupTitle)}>
          <div className={css(this.styles.groupTitleText)}>{groupTitle}</div>
        </div>
        <div className={css(this.styles.imageContainerInGroup)}>
          {images.map((image: ImageProps) => this.renderOneImage(image))}
        </div>
      </div>
    );
  }

  renderOneImage(image: ImageProps) {
    const { imageId, name, src } = image;
    let selected = false;
    if (this.selectedImage && this.selectedImage.imageId == imageId) {
      selected = true;
    }
    const imageBoxStyle = css(
      this.styles.imageInGroup,
      selected && this.styles.imageInGroupSelected,
    );
    return (
      <div
        key={imageId}
        className={imageBoxStyle}
        title={name}
        onClick={() => this.handleImageClick(imageId)}
      >
        <NextImage
          src={src}
          draggable={false}
          className={css(this.styles.image)}
        />
      </div>
    );
  }

  render() {
    const { closeWhenClickBlank, imageGroups, onCloseFn } = this.props;
    return (
      <div className={css(this.styles.root)}>
        {this.toggleBodyScrollbar}
        <div className={css(this.styles.container)}>
          <ImageViewerLeftPanel
            image={this.selectedImage}
            isFirstImage={this.isFirstImage}
            isLastImage={this.isLastImage}
            closeWhenClickBlank={closeWhenClickBlank || false}
            onCloseFn={onCloseFn}
            onPrev={this.handleClickPrev}
            onNext={this.handleClickNext}
            onShowSidebar={this.handleClickShowSidebar}
          />

          <div className={css(this.styles.rightPanel)}>
            <div className={css(this.styles.rightPanelInner)}>
              {this.renderRightPanelTitle()}
              {imageGroups.map((group: ImageGroupProps) =>
                this.renderOneGroup(group),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class ImageViewer {
  props: ImageViewerProps;
  modal: Modal;

  constructor(props: ImageViewerProps) {
    this.props = props;
    this.modal = new Modal(this.renderContent);
    this.modal
      .setWidthPercentage(1)
      .setTopPercentage(0)
      .setOverflowY("hidden")
      .setNoBackground(true)
      .setNoMaxHeight(true);
  }

  renderContent = (onCloseFn: OnCloseFn) => {
    return (
      <ImageViewContent // eslint-disable-next-line react/no-this-in-sfc
        modal={this.modal}
        onCloseFn={onCloseFn} // eslint-disable-next-line react/no-this-in-sfc
        {...this.props}
      />
    );
  };

  render() {
    return this.modal.render();
  }
}
