import React from "react";

/* Lego Components */
import { ImageList } from "@merchant/component/core";

import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@stores/LocalizationStore";

type ImageContentProps = BaseProps & {
  readonly imageGroup?: ImageGroupProps;
  readonly onClickImage: (
    imageGroup?: ImageGroupProps,
    imageId?: string,
  ) => unknown;
};

const UpdateMaterialImageContent = (props: ImageContentProps) => {
  const { imageGroup, onClickImage } = props;
  if (!imageGroup) {
    return null;
  }
  const { images } = imageGroup;
  const displayImageCount = 3;
  const hiddenImageCount = images.length - displayImageCount;
  const { locale } = LocalizationStore.instance();
  return (
    <ImageList
      moreImageCount={hiddenImageCount}
      onMoreButtonClick={() => onClickImage(imageGroup)}
      locale={locale}
    >
      {images.slice(0, displayImageCount).map((image) => (
        <ImageList.Image
          src={image.src}
          name={image.name}
          key={image.imageId}
          imageId={image.imageId}
          onClick={(imageId) => onClickImage(imageGroup, imageId || "")}
        />
      ))}
    </ImageList>
  );
};

export default UpdateMaterialImageContent;
