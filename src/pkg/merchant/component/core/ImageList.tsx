//
//  component/ImageList.tsx
//  Project-Lego
//
//  Created by Mengyu Yuan on 1/3/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { Component, CSSProperties } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

type ImageProps = BaseProps & {
  readonly src: string;
  readonly name: string;
  readonly imageId?: string;
  readonly onClick?: (imageId: string | null | undefined) => unknown;
  readonly width?: number | "unset";
  readonly height?: number | "unset";
};

@observer
class Image extends Component<ImageProps> {
  @computed
  get styles() {
    const { height, width, onClick } = this.props;
    let finalHeight: CSSProperties["height"] = 96;
    let finalWidth: CSSProperties["width"] = 200;
    if (height != undefined) {
      finalHeight = height === "unset" ? undefined : height;
    }
    if (width != undefined) {
      finalWidth = width === "unset" ? undefined : width;
    }

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingRight: 16,
      },
      imageContainer: {
        flex: 1,
        borderRadius: 4,
        overflow: "hidden",
        height: finalHeight,
        maxHeight: finalHeight,
        minHeight: finalHeight,
        width: finalWidth,
        maxWidth: finalWidth,
        minWidth: finalWidth,
        border: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick && "pointer",
        userSelect: "none",
      },
      image: {
        maxHeight: "100%",
        maxWidth: "100%",
      },
      imageName: {
        lineHeight: "36px",
        fontSize: 14,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: finalWidth ? finalWidth + 2 : undefined, // add border width
      },
    });
  }

  handleClick = () => {
    const { onClick, imageId } = this.props;
    if (onClick) {
      onClick(imageId);
    }
  };

  render() {
    const { name, src } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <div
          className={css(this.styles.imageContainer)}
          onClick={this.handleClick}
        >
          <NextImage
            draggable={false}
            className={css(this.styles.image)}
            src={src}
          />
        </div>
        <div className={css(this.styles.imageName)} title={name}>
          {name}
        </div>
      </div>
    );
  }
}

export type ImageListProps = BaseProps & {
  imageListId?: string;
  moreImageCount?: number;
  onMoreButtonClick?: (imageListId: string | null | undefined) => unknown;
  locale: string;
};

@observer
class ImageList extends Component<ImageListProps> {
  static Image = Image;

  static demoRender = `<ImageList moreImageCount={2} onMoreButtonClick={()=>{}}>
  <ImageList.Image
    src="https://www.baidu.com/img/baidu_jgylogo3.gif"
    name="baidu.gif"
    imageId="1"
    onClick={()=>{}}
  />
  <ImageList.Image
    src="https://www.google.com/a/cpanel/contextlogic.com/images/logo.gif"
    name="contextlogic.png"
    onClick={()=>{}}
  />
</ImageList>`;

  static demoWithVerticalLayout = true;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexWrap: "wrap",
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      dots: {
        height: 30,
        width: 30,
        borderRadius: "50%",
        backgroundColor: palettes.greyScaleColors.LightGrey,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 250ms",
        cursor: "pointer",
        ":hover": {
          backgroundColor: palettes.greyScaleColors.Grey,
        },
      },
      dot: {
        borderRadius: "50%",
        backgroundColor: palettes.textColors.LightInk,
        width: 5,
        height: 5,
        margin: 1,
      },
      text: {
        color: palettes.textColors.LightInk,
        fontSize: 14,
      },
    });
  }

  handleMoreButtonClick = () => {
    const { imageListId, onMoreButtonClick } = this.props;
    if (onMoreButtonClick) {
      onMoreButtonClick(imageListId);
    }
  };

  renderMoreButton() {
    const { moreImageCount, children, locale } = this.props;
    if (!moreImageCount || moreImageCount <= 0) {
      return null;
    }

    const childCount = React.Children.count(
      React.Children.toArray(children).filter((_) => React.isValidElement(_)),
    );
    const totalCount = moreImageCount + childCount;
    let buttonText = i`${totalCount} images in total`;
    if (locale === "zh") {
      buttonText = `共${totalCount}张`;
    }

    return (
      <div className={css(this.styles.buttonContainer)}>
        <div
          className={css(this.styles.dots)}
          onClick={this.handleMoreButtonClick}
        >
          <div className={css(this.styles.dot)} />
          <div className={css(this.styles.dot)} />
          <div className={css(this.styles.dot)} />
        </div>
        <div className={css(this.styles.text)}>{buttonText}</div>
      </div>
    );
  }

  render() {
    const { children, className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {children}
        {this.renderMoreButton()}
      </div>
    );
  }
}

export default ImageList;
