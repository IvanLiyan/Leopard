import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { css } from "@core/toolkit/styling";
import ImageUploadGroup, {
  ImageInfo,
} from "@add-edit-product/components/ImageUploadGroup";
import Section, { SectionProps } from "./Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { zendeskURL } from "@core/toolkit/url";
import { Stack, Text } from "@ContextLogic/atlas-ui";
import Markdown from "@core/components/Markdown";
import WishPreview from "./WishPreview";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ImageWidth = 173;

const ProductImagesV2: React.FC<Props> = (props: Props) => {
  const { style, className, state, ...sectionProps } = props;

  const { forceValidation, images } = state;
  const imageInfos: ReadonlyArray<ImageInfo> = useMemo(() => {
    if (images == null) {
      return [];
    }

    return images.map((image) => ({
      url: image.wishUrl,
      isClean: image.isCleanImage,
    }));
  }, [images]);

  const imageDescription =
    i`Images can be in the JPEG, PNG or GIF format. Files should be a minimum of ` +
    i`500x500 pixels, maximum size is 178 MP and 24MB. You can drag images to ` +
    i`reorder them once they are uploaded. Learn more about image requirements ` +
    i`[here](${zendeskURL("1260805100070")}).`;
  const markingDescription =
    i`If you intend to sell the product in a region that mandates a conformity ` +
    i`marking (e.g., CE marking in the European Union or UKCA in the UK), it is ` +
    i`necessary to upload an image of the product clearly displaying the ` +
    i`required marking. [Learn more](${zendeskURL("115001731533")})`;

  return (
    <Section
      className={css(style, className)}
      title={ci18n(
        "Section header, the asterisk symbol means the section is required",
        "Product images*",
      )}
      {...sectionProps}
      hasInvalidData={forceValidation && imageInfos.length == 0}
    >
      <Stack direction="row" sx={{ gap: "16px" }} alignItems="flex-start">
        <Stack direction="column" sx={{ gap: "8px", width: "70%" }}>
          <Markdown>{imageDescription}</Markdown>
          <Markdown>{markingDescription}</Markdown>
          {images != null && images.length > 0 && (
            <Stack direction="row" sx={{ gap: "16px" }}>
              <Text variant="bodyMStrong" sx={{ width: `${ImageWidth}px` }}>
                Main image
              </Text>
              <Text variant="bodyMStrong">Extra image(s)</Text>
            </Stack>
          )}
          <ImageUploadGroup
            maxSizeMB={24}
            maxImages={100}
            onImagesChanged={(images: ReadonlyArray<ImageInfo>) => {
              state.setImages(
                images.map((imageInfo, index) => ({
                  id: index,
                  wishUrl: imageInfo.url,
                  isCleanImage: imageInfo?.isClean || false,
                })),
              );
            }}
            images={imageInfos}
            allowReorder
            cleanImageEnabled
            imageWidth={ImageWidth}
            data-cy="product-image"
          />
        </Stack>

        <WishPreview state={state} style={{ width: "30%" }} />
      </Stack>
    </Section>
  );
};

export default observer(ProductImagesV2);
